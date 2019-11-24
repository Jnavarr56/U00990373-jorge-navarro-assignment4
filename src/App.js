import React, { useEffect, useState } from 'react'
import { ThemeProvider } from '@material-ui/styles'
import theme from './theme'
import {
	Container,
	Card, CardHeader, CardContent, Divider,
	Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
	Button, Grid,
	CircularProgress,
	LinearProgress,
	CssBaseline,
	Typography,
	Avatar,
	Tabs,
	Tab,
	CardMedia
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Page, SubwayTimes } from './components'
import { getAddressFromCoords, getNearbyStations, getWalkingDirections, renderWalkingRoute, isInNYC } from './utils/googleMaps' 
import { getAllNextNearbyDepartures, getNextDeparturesForStation } from './utils/here' 
import { delay } from './utils/general' 
import moment from 'moment'
import Carousel from 'react-material-ui-carousel'
import LoadingOverlay from 'react-loading-overlay'
import CountDown, { zeroPad } from 'react-countdown-now'


const useStyles = makeStyles(() => ({
	root: {
		maxHeight: 800,
		overflow: 'hidden',
		'& > *:first-child.MuiCard-root': {
			height: '100%',
			width: '100%',
		},
	},
	loadingMessage: {
		color: 'white'
	},
	progressBar: {
		height: 50,
		width: 600,
		'& .MuiLinearProgress-bar2Buffer': {
			backgroundColor: theme.palette.secondary.main
		}
	},
	departuresCard: {
		height: 600,
		display: 'flex',
		flexDirection: 'column',
		'& .MuiCardContent-root, & ._loading_overlay_wrapper': {
			height: '100%'
		},
		'& .MuiCardContent-root,':  {
			overflowY: 'auto'		
		},
	},
	contentCard: {
		height: 600,
	},
	content: {
		height: 400,
		width: '100%',
		'& > .MuiCardMedia-root': {
			height: '100%',
		}
	},

	

}))


const REFRESH_TIMEOUT = process.env.NODE_ENV === 'development' ? 5000 : 30000
const LOADING_DELAY = process.env.NODE_ENV === 'development' ? 100 : 500

const App = () => {

	const classes = useStyles()

	const [ openPermissionsDialog, setOpenPermissionsDialog ] = useState(false)
	const [ loadingState, setLoadingState ] = useState(true)
	const [ loadingMessage, setLoadingMessage ] = useState('')
	const [ loadingProgress, setloadingProgress ] = useState(0)
	const [ loadingBuffer, setloadingBuffer ] = useState(0)
	const [ refreshing, setRefreshing ] = useState(false)
	const [ tab, setTab ] = useState('photos')
	const [ data, setData ] = useState(null)


	const handleReset = () => {
		setLoadingState(false)
		setLoadingMessage('')
		setloadingProgress(0)
		setloadingBuffer(0)
	}
	
	
	const handleInitRequests = async () => {

		setloadingProgress(2)
		setloadingBuffer(2)
		setOpenPermissionsDialog(false)
		setLoadingState(true)

		
		setloadingBuffer(10)
		setLoadingMessage('Checking location permissions')
		
		
		await delay(LOADING_DELAY)
		
		navigator.geolocation.getCurrentPosition(
			async ({ coords }) => {
				console.log('coords: ', coords)

				setloadingProgress(10)
				setLoadingMessage('Permissions granted! :)')
				await delay(LOADING_DELAY)


				
				setloadingBuffer(25)
				setLoadingMessage('Getting coordinates')
				await delay(LOADING_DELAY)
				const { latitude: lat, longitude: lng } = coords 
				setloadingProgress(25)
				setLoadingMessage(`Found coordinates: (${lat}, ${lng})!`)
				await delay(LOADING_DELAY)

				setloadingBuffer(40)
				setLoadingMessage(`Checking if location is in NYC`)
				await delay(LOADING_DELAY)
				//breakpoints
				const addressResults = await getAddressFromCoords(lat, lng)
				console.log('addressResults: ', addressResults)
				if (!addressResults) return
				const validAddress = isInNYC(addressResults)
				console.log('valid: ', validAddress)
				if (!validAddress) return
				setloadingProgress(40)
				setLoadingMessage(`Location is in NYC!`)
				await delay(LOADING_DELAY)

				setloadingBuffer(60)
				setLoadingMessage(`Getting address`)
				await delay(LOADING_DELAY)
				const address = addressResults[0]
				console.log('address: ', address)
				setloadingProgress(60)
				setLoadingMessage(`Found address: ${address.formatted_address}!`)
				await delay(LOADING_DELAY)


				setloadingBuffer(70)
				setLoadingMessage(`Searching for nearby subway stations`)
				await delay(LOADING_DELAY)
				// breakpoint
				const nearbyStations = await getNearbyStations(lat, lng)
				console.log('nearbyStations: ', nearbyStations)
				if (!nearbyStations) return
				setloadingProgress(70)
				setLoadingMessage(`Found some nearby stations: ${nearbyStations.length} exactly!`)
				await delay(LOADING_DELAY)


				setloadingBuffer(75)
				setLoadingMessage(`Getting closest station`)
				await delay(LOADING_DELAY)
				const closestStation = nearbyStations[0]
				console.log('closestStation: ', closestStation)
				setloadingProgress(75)
				setLoadingMessage(`Found closest station: ${closestStation.name}!`)
				await delay(LOADING_DELAY)

				setloadingBuffer(85)
				setLoadingMessage(`Getting walking route to station - ${closestStation.name}`)
				await delay(LOADING_DELAY)
				const origin = { lat, lng } 
				const destination = {
					lat: closestStation.geometry.location.lat(),
					lng: closestStation.geometry.location.lng()
				}
				const walkingDirections = await getWalkingDirections(origin, destination)
				//breakpoint
				if (!walkingDirections) return
				console.log('walkingDirections', walkingDirections)
				setloadingProgress(85)
				setLoadingMessage(`Found walking route to station - ${closestStation.name}!`)
				await delay(LOADING_DELAY)

				setloadingBuffer(95)
				setLoadingMessage(`Getting nearby departures`)
				await delay(LOADING_DELAY)
				const nearbyDepartures = await getAllNextNearbyDepartures(lat, lng)
				//breakpoint
				if (!nearbyDepartures) return
				console.log('nearbyDepartures', nearbyDepartures)
				setloadingProgress(95)
				setLoadingMessage(`Found all nearby departures!`)
				await delay(LOADING_DELAY)

				setloadingBuffer(97)
				setLoadingMessage(`Matching nearby departures to station - ${closestStation.name}`)
				await delay(LOADING_DELAY)
				const closestStationDepartures = nearbyDepartures[0]
				console.log('closestStationDepartures', closestStationDepartures)
		
				setloadingProgress(97)
				setLoadingMessage(`Matched nearby departures to station - ${closestStation.name}!`)
				await delay(LOADING_DELAY)

				setloadingBuffer(100)
				setLoadingMessage(`Building refresh function for station - ${closestStation.name}`)
				await delay(LOADING_DELAY)
				const refreshDepartures = async () => {
					console.log('Refreshing', closestStationDepartures.Stn.id)
					setRefreshing(true)
					const newDepartures = await getNextDeparturesForStation(closestStationDepartures.Stn.id)
					if (!newDepartures) return
					
					console.log('Refreshing', newDepartures)
					setData(prev => ({
						...prev,
						departures: newDepartures
					}))

					setTimeout(() => {
											setRefreshing(false)

					setTimeout(refreshDepartures, REFRESH_TIMEOUT)
					}, 100)

				
				} 
				setloadingProgress(100)
				setLoadingMessage(`Built refresh function for station - ${closestStation.name}!`)
				await delay(LOADING_DELAY)

				setLoadingMessage(`Done! :)`)
				await delay(LOADING_DELAY)
				handleReset()

				setData({
					...closestStation,
					stationId: closestStationDepartures.Stn.id,
					distance: closestStationDepartures.Stn.distance,
					departures: closestStationDepartures.NextDepartures.Dep,
					directions: walkingDirections,
					refresh: refreshDepartures
				})

				setTimeout(refreshDepartures, REFRESH_TIMEOUT)

			},
			({ code }) => {
				console.log('Location permission denied')
				if (code === 1) {
					handleReset()
					setOpenPermissionsDialog(true)
				}
			}
			// ,{ enableHighAccuracy: true }
		)
	}
	
	const handleQueryPermission = () => {

		setLoadingState(true)

		navigator.permissions.query({ name: 'geolocation' }).then(({ state }) => {

			setLoadingState(false)
			
			if (state === 'granted') handleInitRequests()

			else setOpenPermissionsDialog(true)
		})

	}
	useEffect(handleQueryPermission, [])

	useEffect(() => {

		if (data && tab === 'map') renderWalkingRoute('map', data.directions)

	}, [ tab ])
	


	const circleSpin = <CircularProgress color="primary" thickness={1.8} size={200} />
	
	const spinner = (
		loadingProgress ? (
			<LinearProgress className={classes.progressBar} variant={'buffer'} valueBuffer={loadingBuffer} value={loadingProgress}/>
		) : (
			circleSpin
		) 
	)

	const text = <Typography className={classes.loadingMessage} variant="overline">{loadingMessage}</Typography>
			
	return (
		<>
			<CssBaseline />
			<ThemeProvider theme={theme}>
				<Page 
					active={loadingState}	
					text={text}
					spinner={spinner}
				>	
						<Container
							className={classes.root}
							maxWidth="lg"
						>
							<Card>
								<CardHeader title={'Your Local Train Times'} />
								<Divider/>
								{data && (
									<CardHeader 
										title={data.name}
										subheader={`${(data.distance/ 1609.344).toFixed(5)} miles away`}
									/>
								)}

								<Divider />
								{data && (
									<CardContent>
										<Grid container spacing={2} justify="space-around"> 
											<Grid item xs={7} >
												<Card className={classes.departuresCard}>
													<LoadingOverlay active={refreshing} spinner={circleSpin}>
													<CardContent>					
														{data.departures.map((dep, i) => {

															const { time: timestamp } = dep
															const { dir, name, At } = dep.Transport
															const { color: backgroundColor , textColor: color } = At
															const time = moment(timestamp)
															const subheader = `${time.format('hh:mm a')} - ${time.fromNow()}`
															return (
																<React.Fragment key={`dep-${i}`} >
																	<CardHeader 
																		title={dir}
																		subheader={subheader}
																		avatar={(
																	
																			<Avatar style={{ backgroundColor  }}>
																				<Typography variant="h4" style={{ color }}>
																					{name}
																				</Typography>
																			</Avatar>
																		)}
																	/>
																	<Divider/>
																</React.Fragment>
															)
														})}
													</CardContent>
													</LoadingOverlay>
												</Card>

											</Grid>
											<Grid item xs={5}>
												<Card className={classes.contentCard}>
												<Tabs
																											value={tab}
																											onChange={(e, val) => setTab(val)}
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
														{tab === 'map' && <div id='map' style={{ height: 400 }}/>}
														{tab === 'photos' && (
															<Carousel animation="fade">
																{data.photos.map(photo => {
																	const url = photo.getUrl()
																	return (
																		<Card key={url}>
																			<CardContent className={classes.content}>
																				<CardMedia
																					image={url}
																					key={url}
																				/>
																			</CardContent>
																		</Card>
																	)
																})}																
															</Carousel>
														)}
													</CardContent>
												</Card>
											</Grid>
										</Grid>
									</CardContent>
								)}

							</Card>
						</Container>
						<Dialog open={openPermissionsDialog}>
							<DialogTitle>I need to access your location!</DialogTitle>
							<Divider />
							<DialogContent>
								<DialogContentText>
									You haven't yet enabled location permission for this site in your browser.
									<br/>
									You'll be asked to do this after you press "Okay".
									<br/>
									<br/>
									This site will not work until you enable this perrmisison.
									<br/>
									<br/>
									If you've received this message more than once but haven't been prompted
									by your broswer to enable location sharing, try going in your 
									browers settings for this site and manually allowing permission.
								</DialogContentText>
							</DialogContent>
							<Divider />
							<DialogActions>
								<Button
									color="secondary"
									variant="contained"
									onClick={handleInitRequests}
								>
									Got It
								</Button>
							</DialogActions>
						</Dialog>
				</Page>
			</ThemeProvider>
		</>
	)
}

export default App
