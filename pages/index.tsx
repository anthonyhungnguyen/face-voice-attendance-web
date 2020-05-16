import React, { useState } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import axios from 'axios'
import swal from 'sweetalert'

type FormElem = React.FormEvent<HTMLFormElement>

interface IAttendance {
	studentName: string
	subjectName: string
	subjectInstructor: string
	recordedAt: string
}
const Home = () => {
	const [ roomId, setRoomId ] = useState('')
	const [ password, setPassword ] = useState('')
	const [ stuId, setStuId ] = useState('')

	const handleCheckAttendance = async (e: FormElem) => {
		e.preventDefault()
		if (!roomId || !password || !stuId) {
			swal('Error', 'Please enter all fields', 'error')
		}
		const response = await axios.post('/api/checkFromWeb', { roomId, password, stuId })
		const { result, message, subCode } = response.data
		if (result === 'success') {
			await handleFetchInfo(subCode).then((data: IAttendance) => {
				if (data['recordedAt']) {
					Router.push({
						pathname: '/result',
						query: {
							stuName: data.studentName,
							subName: data.subjectName,
							subInstruc: data.subjectInstructor,
							recordedAt: data.recordedAt
						}
					})
				} else {
					Router.push({
						pathname: '/result',
						query: {
							stuName: data.studentName,
							subName: data.subjectName,
							subInstruc: data.subjectInstructor,
							recordedAt: null
						}
					})
				}
			})
		} else {
			swal(result.toUpperCase(), message, result)
		}
	}

	const handleCreateNewSchedule = async () => {
		const response = await axios.post('/api/create', { id: 0 })
		const data = response.data
		console.log(data)
	}

	const handleTickAttendanceFromJetson = async () => {
		const response = await axios.post('/api/checkFromJetson', { roomId, stuId })
		const data = response.data
		swal(data.result.toUpperCase(), data.message, data.result)
	}

	const handleFetchInfo = async (subCode: string) => {
		return new Promise(async (resolve) => {
			const response = await axios.post('/api/fetchInfo', {
				stuId,
				subCode
			})
			const data = response.data
			resolve(data)
		})
	}
	return (
		<div className='container'>
			<Head>
				<title>FVA</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className='w-screen h-screen bg-blue-400 flex justify-center items-center'>
				<button onClick={handleCreateNewSchedule}>Hello</button>
				<button onClick={handleTickAttendanceFromJetson}>Tick Attendance</button>
				<form className='relative p-2 mt-2 w-1/4' onSubmit={handleCheckAttendance}>
					<input
						type='text'
						className='w-full text-2xl py-1 bg-transparent border-b-2 border-white outline-none text-white placeholder-white'
						placeholder='enter your room'
						id='room'
						value={roomId}
						onChange={(e) => setRoomId(e.target.value)}
					/>
					<input
						type='password'
						className='w-full text-2xl py-1 bg-transparent border-b-2 border-white outline-none placeholder-white mt-5  text-white'
						placeholder='password'
						id='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<input
						type='text'
						className='w-full text-2xl py-1 bg-transparent border-b-2 border-white outline-none placeholder-white mt-5 text-white'
						placeholder='student ID'
						id='student ID'
						value={stuId}
						onChange={(e) => setStuId(e.target.value)}
					/>
					<button
						className='float-right py-2 px-5 border-2 border-white mt-4 uppercase font-bold text-white text-center'
						type='submit'
					>
						Next
					</button>
				</form>
			</main>
		</div>
	)
}

export default Home
