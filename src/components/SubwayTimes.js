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
import {
	getAddressFromCoords,
	getNearbyStations,
	getWalkingDirections,
	isInNYC
} from '../utils/googleMaps'
import {
	getAllNextNearbyDepartures,
	getNextDeparturesForStation
} from '../utils/here'
import LoadingOverlay from 'react-loading-overlay'

import Carousel from 'react-material-ui-carousel'
import CountDown, { zeroPad } from 'react-countdown-now'
import moment from 'moment'

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

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const REFRESH_TIMEOUT = process.env.NODE_ENV === 'development' ? 5000 : 30000

const SubwayTimes = () => {
	const classes = useStyles()

	const [ permission, setPermission ] = useState(null)
	const [ stationData, setStationData ] = useState(null)
	const [ departures, setDepartures ] = useState(null)
	const [ directions, setDirections ] = useState(null)

	const [ loading, setLoading ] = useState('')
	const [ refreshing, setRefreshing ] = useState(false)
	const [ tab, setTabs ] = useState('photos')

	const handleConfirmPermissions = async () => {
		setLoading('Checking location permissions')
		await delay(1000)

		navigator.geolocation.getCurrentPosition(
			async ({ coords }) => {
				console.log('coords: ', coords)

				setPermission(true)
				setLoading('Permissions granted! :)')
				await delay(1000)

				setLoading('Getting coordinates')
				await delay(1000)
				const { latitude: lat, longitude: lng } = coords
				setLoading(`Found coordinates: (${lat}, ${lng})!`)
				await delay(1000)

				setLoading(`Checking if location is in NYC`)
				await delay(1000)
				//breakpoints
				const addressResults = await getAddressFromCoords(lat, lng)
				console.log('addressResults: ', addressResults)
				if (!addressResults) return
				const validAddress = isInNYC(addressResults)
				console.log('valid: ', validAddress)
				if (!validAddress) return
				setLoading(`Location is in NYC!`)
				await delay(1000)

				setLoading(`Getting address`)
				await delay(1000)
				const address = addressResults[0]
				console.log('address: ', address)
				setLoading(`Found address: ${address.formatted_address}!`)
				await delay(1000)

				setLoading(`Searching for nearby subway stations`)
				await delay(1000)
				// breakpoint
				const nearbyStations = await getNearbyStations(lat, lng)
				console.log('nearbyStations: ', nearbyStations)
				if (!nearbyStations) return
				setLoading(
					`Found some nearby stations: ${nearbyStations.length} exactly!`
				)
				await delay(1000)

				setLoading(`Getting closest station`)
				await delay(1000)
				const closestStation = nearbyStations[0]
				console.log('closestStation: ', closestStation)
				setLoading(`Found closest station: ${closestStation.name}!`)
				await delay(1000)

				setLoading(`Getting walking route to station - ${closestStation.name}`)
				await delay(1000)
				const origin = { lat, lng }
				const destination = {
					lat: closestStation.geometry.location.lat(),
					lng: closestStation.geometry.location.lng()
				}
				const walkingDirections = await getWalkingDirections(
					origin,
					destination
				)
				//breakpoint
				if (!walkingDirections) return
				console.log('walkingDirections', walkingDirections)
				setLoading(`Found walking route to station - ${closestStation.name}!`)
				await delay(1000)

				setLoading(`Getting nearby departures`)
				await delay(1000)
				const nearbyDepartures = await getAllNextNearbyDepartures(lat, lng)
				//breakpoint
				if (!nearbyDepartures) return
				console.log('nearbyDepartures', nearbyDepartures)
				setLoading(`Found all nearby departures!`)
				await delay(1000)

				setLoading(
					`Matching nearby departures to station - ${closestStation.name}`
				)
				await delay(1000)
				const closestStationDepartures = nearbyDepartures[0]
				console.log('nearbyDepartures', nearbyDepartures)
				setLoading(
					`Matched nearby departures to station - ${closestStation.name}!`
				)
				await delay(1000)

				setLoading(
					`Building refresh function for station - ${closestStation.name}`
				)
				await delay(1000)

				const refreshDepartures = async () => {
					console.log('Refreshing', closestStationDepartures.Stn.id)

					setRefreshing(true)

					const newDepartures = await getNextDeparturesForStation(
						closestStationDepartures.Stn.id
					)
					//breakpoint
					if (newDepartures) {
						setRefreshing(false)
						console.log('Refreshing', newDepartures)
						setTimeout(refreshDepartures, REFRESH_TIMEOUT)
					}
				}
				setLoading(
					`Built refresh function for station - ${closestStation.name}!`
				)
				await delay(1000)

				console.log('Done! :)')
				await delay(1000)
			},
			({ code }) => {
				console.log('ERR')
				if (code === 1) {
					setPermission(false)
					setLoading('')
				}
			},
			{ enableHighAccuracy: true }
		)
	}

	useEffect(() => {
		if (tab === 'map' && directions) {
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
									Please make sure you've enabled access!
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
					<Divider />
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
		</LoadingOverlay>
	)
}

export default SubwayTimes
