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
import LoadingOverlay from 'react-loading-overlay'
const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100vh',
		'& > .MuiAppBar-root': {
			'& .MuiTypography-root': {
				fontSize: theme.spacing(2),
				color: 'white',
				fontWeight: 'bold'
			},
			'& > .MuiToolbar-root': {
				'& > *:first-child': {
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flex-start',
					'& img': {
						height: theme.spacing(4),
						marginRight: theme.spacing(1.5)
					}
				}
			}
		},
		'& > ._loading_overlay_wrapper': {
			'&, & > *:first-child': {
				height: '100%'
			}
		},
		'& > .MuiBottomNavigation-root': {
			'& *': { color: 'white' }
		}
	},
	children: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
		'&, & > *': {
			height: '100%'
		}
	}
}))

const Page = ({ children, active, spinner, text }) => {
	const classes = useStyles()

	return (
		<main className={classes.root}>
			<AppBar
				color="primary"
				elevation={5}
				position="static"
			>
				<Toolbar>
					<div>
						<Link href="/">
							<img src="logo.svg" />
						</Link>
						<Typography variant="h5">See Something, Code Something</Typography>
					</div>
				</Toolbar>
			</AppBar>
			<LoadingOverlay
				active={active}
				spinner={spinner}
				text={text}
			>
				<div className={classes.children}>
					<>{children}</>
				</div>
			</LoadingOverlay>
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
		</main>
	)
}

export default Page
