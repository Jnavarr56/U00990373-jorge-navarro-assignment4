import React, { useState, useEffect } from 'react'
import {
	CardHeader,
	CardContent,
	Card,
	Divider,
	Grid,
	Button,
	CircularProgress,
	CardMedia,
	Avatar,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Tabs,
	Tab
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import LoadingOverlay from 'react-loading-overlay'
import axios from 'axios'
import Carousel from 'react-material-ui-carousel'
import moment from 'moment'
import CountDown, { zeroPad } from 'react-countdown-now'

const useStyles = makeStyles(theme => ({
	overlay: {
		height: '100%',
		width: '100%',
		'& #dummy-map': {
			display: 'none'
		},
		'& #map': {
			height: 400
		}
	},
	overlaySpinner: {
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
		'& .MuiCircularProgress-root': {
			marginBottom: theme.spacing(1)
		}
	},
	content: {
		display: 'flex',
		justifyContent: 'center'
	},
	media: {
		height: 400,
		width: 400
	},
	departure: {
		maxHeight: 600,
		overflowY: 'auto'
	},
	contentCard: {
		width: '100%'
	}
}))

const REFRESH_TIMEOUT = process.env.NODE_ENV === 'development' ? 30000 : 5000

const SubwayTimes = () => {
	const classes = useStyles()

	const [ permission, setPermission ] = useState(null)
	const [ stationData, setStationData ] = useState(null)
	const [ departures, setDepartures ] = useState(null)
	const [ directions, setDirections ] = useState(null)

	const [ loading, setLoading ] = useState('')
	const [ refreshing, setRefreshing ] = useState(false)
	const [ tab, setTabs ] = useState('photos')

	const handleConfirmPermissions = () => {
		const { permissions, geolocation } = navigator

		setLoading('Checking location permissions...')
		setTimeout(() => {
			permissions.query({ name: 'geolocation' }).then(({ state }) => {
				if (state !== 'granted') {
					setPermission(false)
					setLoading('')
				} else {
					console.log(state)
					setPermission(true)
					setLoading('Permissions granted, getting coordinates...')

					geolocation.getCurrentPosition(
						({ coords }) => {
							setLoading(
								`Coordinates found: latitude ${coords.latitude}, longitude ${coords.longitude}...`
							)

							const { google } = window
							const { latitude: lat, longitude: lng } = coords

							const query = {
								location: {
									lat,
									lng
								},
								rankBy: google.maps.places.RankBy.DISTANCE,
								type: [ 'subway_station' ]
							}

							const googlePlaceSearch = new google.maps.places.PlacesService(
								document.getElementById('dummy-map')
							)

							googlePlaceSearch.nearbySearch(query, stations => {
								setLoading(
									`Nearest subway station found: ${stations[0].name}, getting directions...`
								)

								const directionsService = new google.maps.DirectionsService()

								const request = {
									origin: query.location,
									destination: {
										lat: stations[0].geometry.location.lat(),
										lng: stations[0].geometry.location.lng()
									},
									travelMode: 'WALKING'
								}

								directionsService.route(request, (response, status) => {
									console.log(response, status)

									if (status !== 'OK') {
										return null
									}

									setDirections(response)

									setLoading(`Found directions, getting departures...`)

									const HEREurl = `https://transit.api.here.com/v3/multiboard/by_geocoord.json?app_id=${
										process.env.REACT_APP_HERE_APP_ID
									}&app_code=${
										process.env.REACT_APP_HERE_APP_CODE
									}&center=${lat},${lng}&time=${new Date().toISOString()}&modes=subway`

									axios
										.get(HEREurl)
										.then(({ data }) => {
											setLoading('Initial departures found...')
											const {
												MultiNextDeparture
											} = data.Res.MultiNextDepartures

											setStationData({
												...stations[0],
												...MultiNextDeparture[0].Stn
											})

											setDepartures(MultiNextDeparture[0].NextDepartures.Dep)
											setLoading('')

											const refreshDepartures = () => {
												console.log(MultiNextDeparture[0].Stn.id)
												const url = `https://transit.api.here.com/v3/multiboard/by_stn_ids.json?lang=en&stnIds=${
													MultiNextDeparture[0].Stn.id
												}&time=${new Date().toISOString()}&app_id=${
													process.env.REACT_APP_HERE_APP_ID
												}&app_code=${process.env.REACT_APP_HERE_APP_CODE}`
												setRefreshing(
													`Updating arrival times for ${stations[0].name}`
												)
												axios.get(url).then(({ data }) => {
													setTimeout(() => {
														console.log(data)
														setDepartures(
															data.Res.MultiNextDepartures.MultiNextDeparture[0]
																.NextDepartures.Dep
														)
														setRefreshing('')

														setTimeout(refreshDepartures, REFRESH_TIMEOUT)
													}, 250)
												})
											}

											setTimeout(refreshDepartures, REFRESH_TIMEOUT)
										})
										.catch(err => console.log(err))
								})
							})
						},
						() => alert('error'),
						{ enableHighAccuracy: true }
					)
				}
			})
		}, 2000)
	}

	useEffect(() => {
		if (tab === 'map') {
			const { google } = window
			const directionsRenderer = new google.maps.DirectionsRenderer()
			const map = new google.maps.Map(document.getElementById('map'), {
				zoom: 7
			})
			directionsRenderer.setMap(map)
			directionsRenderer.setDirections(directions)
		}
	}, [ directions, tab ])

	return (
		<LoadingOverlay
			active={Boolean(loading)}
			className={classes.overlay}
			spinner={
				<div className={classes.overlaySpinner}>
					<CircularProgress
						color="primary"
						size={150}
					/>
				</div>
			}
			text={loading}
		>
			{!permission && !loading ? (
				<Dialog open>
					<DialogTitle>Watch the Gap!</DialogTitle>
					<Divider />
					<DialogContent>
						<DialogContentText>
							{permission === null ? (
								<>
									I need to access your location.
									<br />
									<br />
									Please make sure you've enabled access.
								</>
							) : (
								<>
									This won't work until you've enabled location permission!
									<br />
									<br />
									Please enable them.
								</>
							)}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button
							color="secondary"
							variant="contained"
							onClick={handleConfirmPermissions}
						>
							Got It
						</Button>
						<Button
							color="primary"
							variant="contained"
							onClick={() => setPermission(false)}
						>
							Hell No
						</Button>
					</DialogActions>
				</Dialog>
			) : (
				<>
					{stationData && departures && (
						<>
							<CardHeader
								subheader={`${(stationData.distance / 1609.344).toFixed(
									5
								)} miles away`}
								title={stationData.name}
							/>
							<CardContent>
								<Grid
									container
									justify="space-around"
								>
									<Grid
										component="main"
										item
										xs={6}
									>
										<Card>
											<LoadingOverlay
												active={Boolean(refreshing)}
												label={refreshing}
												spinner={
													<div className={classes.overlaySpinner}>
														<CircularProgress
															color="primary"
															size={150}
														/>
													</div>
												}
											>
												<CardContent className={classes.departure}>
													{departures.map((departure, i) => {
														const time = moment(departure.time)
														const subheader = `${time.format(
															'hh:mm a'
														)} - ${time.fromNow()}`
														const { dir, name } = departure.Transport
														const {
															color: backgroundColor,
															textColor: color
														} = departure.Transport.At

														return (
															<Card key={`station-${i}`}>
																<CardHeader
																	action={
																		<CountDown
																			date={time.toDate()}
																			renderer={({
																				hours,
																				minutes,
																				seconds,
																				completed
																			}) => {
																				return completed
																					? 'Gone!'
																					: `${zeroPad(hours)}:${zeroPad(
																							minutes
																					  )}:${zeroPad(seconds)}`
																			}}
																		/>
																	}
																	avatar={
																		<Avatar style={{ backgroundColor }}>
																			<span style={{ color }}>{name}</span>
																		</Avatar>
																	}
																	subheader={subheader}
																	title={dir}
																/>
															</Card>
														)
													})}
												</CardContent>
											</LoadingOverlay>
										</Card>
									</Grid>

									<Grid
										className={classes.content}
										component="nav"
										item
										xs={5}
									>
										<Card className={classes.contentCard}>
											<Tabs
												value={tab}
												onChange={(e, val) => setTabs(val)}
											>
												<Tab
													label="Photos"
													value="photos"
												/>
												<Tab
													label="Map"
													value="map"
												/>
											</Tabs>
											<CardContent>
												{tab === 'photos' && (
													<Carousel animation="fade">
														{stationData.photos.map(photo => (
															<Card key={photo.getUrl()}>
																<CardContent>
																	<CardMedia
																		className={classes.media}
																		image={photo.getUrl()}
																		key={photo.getUrl()}
																	/>
																</CardContent>
															</Card>
														))}
													</Carousel>
												)}

												{tab === 'map' && <div id="map"> </div>}
											</CardContent>
										</Card>
									</Grid>
								</Grid>
							</CardContent>
						</>
					)}
				</>
			)}
			<div id="dummy-map" />
		</LoadingOverlay>
	)
}

export default SubwayTimes
