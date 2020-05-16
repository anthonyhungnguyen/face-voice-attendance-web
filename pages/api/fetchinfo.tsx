// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiResponse, NextApiRequest } from 'next'
import app from '../../utils/firebase'

const processUnixTime = (unixTimeStamp: number) => {
	const date = new Date(unixTimeStamp * 1000)

	const hours = date.getHours()
	const minutes = '0' + date.getMinutes()
	const seconds = '0' + date.getSeconds()
	const day = date.getDate()
	const month = date.getMonth()
	const year = date.getFullYear()
	const formattedTime = `${day}-${month}-${year} ${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`
	return formattedTime
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { stuId, subCode } = req.body
	const stuRef = app.firestore().collection('student').get()
	const choosenStu = (await stuRef).docs.find((d) => d.id === stuId)

	const subRef = app.firestore().collection('subject').get()
	const choosenSub = (await subRef).docs.find((d) => d.id === subCode)

	const now = new Date()
	const today = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`
	const repRef = app.firestore().collection('report').get()
	const choosenRep = (await repRef).docs.find((d) => d.id === today)
	let formattedTime = null
	if (choosenRep.data()[subCode][stuId]['recordedAt']) {
		formattedTime = processUnixTime(choosenRep.data()[subCode][stuId]['recordedAt']['seconds'])
	}
	res.json({
		studentName: choosenStu.data().name,
		subjectName: choosenSub.data().name,
		subjectInstructor: choosenSub.data().instructor,
		recordedAt: formattedTime
	})
}
