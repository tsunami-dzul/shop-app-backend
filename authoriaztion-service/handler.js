'use strict';

const decodeBase64 = (base64Code) => {
	try {
		const basicAuth = base64Code.split(' ')[1];
		const envValues = Buffer.from(basicAuth, 'base64').toString().split(':');
		const password = process.env[envValues[0]];

		return {
			passwordAuth: envValues[1],
			passwordEnv: password,
		};
	} catch (err) {
		throw err;
	}
};

module.exports.basicAuthorizer = async (event) => {
	try {
		const base64Code = event.headers?.Authorization;

		if (base64Code) {
			const auth = decodeBase64(base64Code);

			if (auth.passwordAuth === auth.passwordEnv) {
				return {
					statusCode: 200,
					body: JSON.stringify({
						message: 'User is authenticated successfully',
					}),
				};
			}

			return {
				statusCode: 403,
				body: JSON.stringify({
					message: 'User or password is incorrect',
				}),
			};
		}

		return {
			statusCode: 401,
			body: JSON.stringify({
				message: 'Authorization was not porivided',
			}),
		};
	} catch (err) {
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: `There was an unexpected error: ${err}`,
			}),
		};
	}
};
