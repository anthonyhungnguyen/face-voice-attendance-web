export const transferDayToRealWeekDay = (day: number) => {
	switch (day) {
		case 0:
			return 'sunday'
		case 1:
			return 'monday'
		case 2:
			return 'tuesday'
		case 3:
			return 'wednesday'
		case 4:
			return 'thursday'
		case 5:
			return 'friday'
		case 6:
			return 'saturday'
	}
}

export const getTimeNow = () => {
	const now = new Date()
	if (process.env.NODE_ENV === 'production') {
		now.setTime(now.getTime() + 7 * 60 * 60 * 1000)
		return now
	} else {
		return now
	}
}
