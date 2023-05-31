'use strict';

const AWS = require('aws-sdk');
const BUCKET = 'products-catalog-csv-file';

module.exports.importProductsFile = async (event) => {
	const { name } = event.queryParameters;
	const s3 = new AWS.S3({ region: 'us-west-1' });
	const catalogPath = `uploaded/${name}.csv`;
	const params = {
		Bucket: BUCKET,
		Key: catalogPath,
		Expires: 60,
		ContentType: 'text/csv',
	};

	const signedUrl = await s3.getSignedUrl('putObject', params);

	return signedUrl;
};

module.exports.importFileParser = async (event) => {
	const s3 = new AWS.S3({ region: 'us-west-1' });
	const params = {};

	for (const record of event.Records) {
		params = {
			Bucket: 'products-catalog-csv-file',
			Key: record.s3.object.key,
		};
	}

	const s3Stream = s3.getObject(params).createReadStream();

	s3Stream
		.on('data', (data) => {
			console.log(data);
		})
		.on('error', (error) => {
			console.log(error);
		})
		.on('end', () => {
			console.log('All data was processed');
		});
};
