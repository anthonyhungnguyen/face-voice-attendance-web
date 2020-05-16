// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiResponse, NextApiRequest } from 'next'
import app from '../../utils/firebase'
import { transferDayToRealWeekDay } from '../../utils/supplement'

interface deviceStat {
	currentSubject: string[]
	code: string
}

const requestDeviceStatusAndCurrentSubject = async (
	roonId: number,
	date: string,
	currentTime: string
): Promise<deviceStat> => {
	return new Promise(async (resolve) => {
		let currentSubject = undefined
		const devRef = app.firestore().collection('device').get()
		const data = await devRef.then((data) => data.docs.find((d) => d.data().room === roonId))
		const renderedListOfSubjectWithTime = data.data().timeline[date]
		const foundSubjectInTime = Object.keys(renderedListOfSubjectWithTime).find(
			(d) =>
				renderedListOfSubjectWithTime[d][0] <= currentTime && currentTime <= renderedListOfSubjectWithTime[d][1]
		)

		if (foundSubjectInTime) {
			currentSubject = [
				foundSubjectInTime,
				`${renderedListOfSubjectWithTime[foundSubjectInTime][0]}-${renderedListOfSubjectWithTime[
					foundSubjectInTime
				][1]}`
			]
		}

		resolve({
			currentSubject: currentSubject,
			code: data.data().code
		})
	})
}

const checkStudentInList = async (subCode: string, stuId: string) => {
	return new Promise(async (resolve) => {
		const subRef = app.firestore().collection('subject').get()
		const subject = (await subRef).docs.find((s) => s.id === subCode)
		const isFound = subject.data().studentList.includes(stuId)
		resolve(isFound)
	})
}

const checkAttendance = async (roomId: number, password: string, stuId: string) => {
	return new Promise(async (resolve) => {
		const now = new Date()
		let renderedTodayHHMM = ''
		if (now.getMinutes() < 10) {
			renderedTodayHHMM = `${now.getHours()}:0${now.getMinutes()}`
		} else {
			renderedTodayHHMM = `${now.getHours()}:${now.getMinutes()}`
		}
		const renderedDate = transferDayToRealWeekDay(now.getDay())
		const { currentSubject, code } = await requestDeviceStatusAndCurrentSubject(
			roomId,
			renderedDate,
			renderedTodayHHMM
		)
		if (currentSubject) {
			if (password !== code) {
				resolve({ result: 'error', message: `Wrong password, please re-do agan'` })
			}
			const timeInterval = currentSubject[1].split('-')
			const firstFlag = await checkStudentInList(currentSubject[0], stuId)
			const secondFlag = renderedTodayHHMM >= timeInterval[0] && renderedTodayHHMM <= timeInterval[1]
			if (firstFlag && secondFlag) {
				resolve({
					result: 'success',
					message: `Success`,
					subCode: currentSubject[0],
					currentSubject: currentSubject
				})
			} else if (!firstFlag && secondFlag) {
				resolve({ result: 'error', message: 'You do not belong to this class', currentSubject: currentSubject })
			}
		}
		resolve({ result: 'error', message: 'No class is taking place right now!', currentSubject: currentSubject })
	})
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { roomId, password, stuId } = req.body
	await checkAttendance(roomId, password, stuId).then(res.json)
}
