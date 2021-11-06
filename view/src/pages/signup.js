import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';

import axios from 'axios';

const styles = (theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(3)
	},
	submit: {
		margin: theme.spacing(3, 0, 2)
	},
	progess: {
		position: 'absolute'
	}
});

const Signup = (props) => {
    const [localState, setLocalState] = useState({
		firstName: '',
		lastName: '',
		phoneNumber: '',
		country: '',
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
		errors: [],
		loading: false
	});

	const handleChange = (event) => {
		setLocalState(prevState => {
			return {...prevState, [event.target.name]: event.target.value};
		});
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setLocalState(prevState => {
			return {...prevState, loading: true};
		});
		const newUserData = {
			firstName: localState.firstName,
			lastName: localState.lastName,
			phoneNumber: localState.phoneNumber,
			country: localState.country,
			username: localState.username,
			email: localState.email,
			password: localState.password,
			confirmPassword: localState.confirmPassword
		};
		axios
			.post('/signup', newUserData)
			.then((response) => {
				localStorage.setItem('AuthToken', `${response.data.token}`);
				setLocalState(prevState => {
					return {...prevState, loading: false};
				});	
				props.history.push('/');
			})
			.catch((error) => {
				setLocalState(prevState => {
					return {...prevState, errors: error.response.data, loading: false};
				});
			});
	};

    return (
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign up
					</Typography>
					<form className={classes.form} noValidate>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="firstName"
									label="First Name"
									name="firstName"
									autoComplete="firstName"
									helperText={localState.errors.firstName}
									error={localState.errors.firstName ? true : false}
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="lastName"
									label="Last Name"
									name="lastName"
									autoComplete="lastName"
									helperText={localState.errors.lastName}
									error={localState.errors.lastName ? true : false}
									onChange={handleChange}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="username"
									label="User Name"
									name="username"
									autoComplete="username"
									helperText={localState.errors.username}
									error={localState.errors.username ? true : false}
									onChange={handleChange}
								/>
							</Grid>

							<Grid item xs={12} sm={6}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="phoneNumber"
									label="Phone Number"
									name="phoneNumber"
									autoComplete="phoneNumber"
									pattern="[7-9]{1}[0-9]{9}"
									helperText={localState.errors.phoneNumber}
									error={localState.errors.phoneNumber ? true : false}
									onChange={handleChange}
								/>
							</Grid>

							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
									helperText={localState.errors.email}
									error={localState.errors.email ? true : false}
									onChange={handleChange}
								/>
							</Grid>

							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									id="country"
									label="Country"
									name="country"
									autoComplete="country"
									helperText={localState.errors.country}
									error={localState.errors.country ? true : false}
									onChange={handleChange}
								/>
							</Grid>

							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="current-password"
									helperText={localState.errors.password}
									error={localState.errors.password ? true : false}
									onChange={handleChange}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									variant="outlined"
									required
									fullWidth
									name="confirmPassword"
									label="Confirm Password"
									type="password"
									id="confirmPassword"
									autoComplete="current-password"
									onChange={handleChange}
								/>
							</Grid>
						</Grid>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							onClick={handleSubmit}
                            disabled={localState.loading || 
                                !localState.email || 
                                !localState.password ||
                                !localState.firstName || 
                                !localState.lastName ||
                                !localState.country || 
                                !localState.username || 
                                !localState.phoneNumber}
						>
							Sign Up
							{localState.loading && <CircularProgress size={30} className={classes.progess} />}
						</Button>
						<Grid container justify="flex-end">
							<Grid item>
								<Link href="login" variant="body2">
									Already have an account? Sign in
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
			</Container>
    );
};

export default withStyles(styles)(Signup);