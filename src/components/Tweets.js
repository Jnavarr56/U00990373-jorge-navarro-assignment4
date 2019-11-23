import React, { useEffect, useState, useCallback } from 'react'
import { CircularProgress } from '@material-ui/core'
import axios from 'axios'
import Countdown from 'react-countdown-now'

const Posts = props => {
	const [ loading, setLoading ] = useState(true)
	const [ error, setError ] = useState(null)
	const [ tweets, setTweets ] = useState([])

	const getTweets = useCallback(() => {
		setError(null)
		setLoading(true)

		axios
			.get('url')
			.then(response => {
				setTweets(response)
				setLoading(false)
				setError(null)
				setTimeout(getTweets, 30000)
			})
			.catch(err => {
				setError(err)
				setLoading(false)
				console.log(err)
			})
	}, [])

	useEffect(() => {
		getTweets()
	}, [ getTweets ])

	return (
		<>
			{loading && <CircularProgress />}
			{error && (
				<Countdown
					date={Date.now() + 30000}
					renderer={({ seconds }) => (
						<span>
							Error fetching tweets! Trying again <span>{seconds}</span>{' '}
							seconds.
						</span>
					)}
					onComplete={() => getTweets()}
				/>
			)}
			{tweets.length > 0 && tweets.map(tweet => <p key={tweet.id}>tweet</p>)}
		</>
	)
}

export default Posts
