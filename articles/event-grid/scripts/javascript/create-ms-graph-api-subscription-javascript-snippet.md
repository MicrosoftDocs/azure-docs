const options = {
	authProvider,
};

const client = Client.init(options);

const subscription = {
   changeType: 'updated,deleted,created',
   notificationUrl: 'EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=yourPartnerTopic&location=theNameOfAzureRegionFortheTopic',
   lifecycleNotificationUrl: 'EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=yourPartnerTopic&location=theNameOfAzureRegionFortheTopic',
   resource: 'users',
   expirationDateTime: '2024-03-31T18:23:45.9356913Z',
   clientState: 'secretClientValue'
};

await client.api('/subscriptions')
	.post(subscription);