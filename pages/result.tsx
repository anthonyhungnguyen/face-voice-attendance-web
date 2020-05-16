import Head from 'next/head'
import { useRouter } from 'next/router'

const Result = () => {
	const router = useRouter()
	const { code, stuName, subName, subInstruc, recordedAt } = router.query
	return (
		<div className='container'>
			<Head>
				<title>{recordedAt ? 'Success' : 'Fail'}</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='w-screen h-screen bg-blue-400 flex justify-center items-center'>
				<div className='w-1/4 bg-white border-2 border-white shawdow-2xl p-2 text-center rounded-md'>
					<span className='text-2xl font-bold my-3'>{recordedAt ? 'Successfully' : 'Failed'}</span>
					<p className='text-xl my-3'>{stuName}</p>
					<div className='flex flex-col'>
						<div className='flex w-full my-3'>
							<p className='inline font-bold w-1/2 text-center'>Course</p>
							<p className='inline w-1/2'>{subName}</p>
						</div>
						<div className='flex w-full my-3'>
							<p className='inline font-bold w-1/2 text-center'>Instructor</p>
							<p className='inline w-1/2'>{subInstruc}</p>
						</div>
						<div className='flex w-full my-3'>
							<p className='inline font-bold w-1/2'>Timeline</p>
							<p className='inline w-1/2'>{recordedAt ? recordedAt : 'Not yet'}</p>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}

export default Result
