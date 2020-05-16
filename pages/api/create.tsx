// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiResponse, NextApiRequest } from 'next'
import app from '../../utils/firebase'
import { transferDayToRealWeekDay } from '../../utils/supplement'

const queryListOfHours = (id: number, dayOfWeek: string) => {
	return new Promise(async (resolve) => {
		const devRef = app.firestore().collection('device').get()
		const data = (await devRef).docs.find((d) => Number(d.id) === id)
		const toReturn = data.data().timeline[dayOfWeek]
		resolve(toReturn)
	})
}

const createTodaySubjectsReport = (subjectCode: string, stuList: Array<string>) => {
	const now = new Date()
	const today = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`
	const toInput = {}
	stuList.forEach((stu) => (toInput[stu] = { hasCheck: false, recordedAt: null }))
	console.log(toInput)
	app.firestore().collection('report').doc(today).set(
		{
			[subjectCode]: toInput
		},
		{ merge: true }
	)
}

const queryStudentsListBasedOnSubjectCode = (subjectCode: string): Promise<Array<string>> => {
	return new Promise(async (resolve) => {
		const subRef = app.firestore().collection('subject').get()
		const stuList = (await subRef).docs.find((d) => d.id === subjectCode)
		resolve(stuList.data()['studentList'])
	})
}
export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { id } = req.body
	console.log(id)
	const currentDate = new Date()
	const dayOfWeek = transferDayToRealWeekDay(currentDate.getDay())
	await queryListOfHours(id, dayOfWeek).then((data) =>
		Object.keys(data).forEach(async (sCode) => {
			await queryStudentsListBasedOnSubjectCode(sCode).then((stuList) =>
				createTodaySubjectsReport(sCode, stuList)
			)
		})
	)
	res.send('Success')
}
