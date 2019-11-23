import React, { useEffect, useState } from 'react'
import './App.css'
import { ThemeProvider } from '@material-ui/styles'
import theme from './theme'
import {
	Container,
	CardHeader,
	Card,
	CardContent,
	Divider,
	Typography,
	Grid,
	CssBaseline,
	Button,
	CircularProgress,
	CardMedia,
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
	List,
	ListItem,
	ListItemIcon,
	Avatar,
	ListItemText
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import axios from 'axios'

import Page from './components/Page'
import { Column, Tweets, SubwayTimes } from './components'

import moment from 'moment'

console.log(process.env)

const useStyles = makeStyles(theme => ({
	content: {
		flexGrow: 1,
		'& .MuiDivider-root': {
			backgroundColor: 'black'
		},
		padding: '8px 0'
	},
	grid: {
		height: '100%'
	},
	column: {
		backgroundColor: 'white',
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'column',
		maxHeight: 800,
		overflowY: 'auto'
		// padding: '8px 4px 8px'
	},
	station: {
		width: '100%',
		marginBottom: 16
	},
	footerLabel: {
		color: 'black'
	},
	media: {
		height: 150
	},
	panel: {
		width: '100%'
	}
}))

const App = () => {
	const classes = useStyles()
	return (
		<>
			<CssBaseline />
			<ThemeProvider theme={theme}>
				<Page>
					<Container
						className={classes.content}
						maxWidth="lg"
					>
						<Grid
							className={classes.grid}
							container
							justify="space-between"
							spacing={2}
						>
							<Column
								component="nav"
								title="Your Nearest Train Times"
								xs={12}
							>
								<SubwayTimes />
							</Column>
						</Grid>
					</Container>
				</Page>
			</ThemeProvider>
		</>
	)
}

export default App
