import React from 'react'
import {
	AppBar,
	Toolbar,
	BottomNavigation,
	BottomNavigationAction,
	Link,
	Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
	appBar: {
		marginBottom: 8,
		'& .MuiTypography-root': {
			fontSize: 16,
			color: 'white',
			fontWeight: 'bold'
		}
	},
	logoGrouping: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		'& img': {
			height: 36,
			marginRight: 12
		}
	},
	footerLabel: {
		color: 'white'
	}
}))

const Page = ({ children }) => {
	const classes = useStyles()

	return (
		<>
			<AppBar
				className={classes.appBar}
				color="primary"
				elevation={5}
				position="static"
			>
				<Toolbar>
					<div className={classes.logoGrouping}>
						<Link href="/">
							<img src="logo.svg" />
						</Link>
						<Typography variant="h5">See Something, Code Something</Typography>
					</div>
				</Toolbar>
			</AppBar>
			{children}
			<BottomNavigation
				component="footer"
				showLabels
			>
				<BottomNavigationAction
					className={classes.footerLabel}
					icon={null}
					label="@ Jorge Navarro 2019"
				/>
			</BottomNavigation>
		</>
	)
}

export default Page
