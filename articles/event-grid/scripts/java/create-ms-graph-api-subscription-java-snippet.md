GraphServiceClient graphClient = GraphServiceClient.builder().authenticationProvider( authProvider ).buildClient();

Subscription subscription = new Subscription();
subscription.changeType = "updated,deleted,created";
subscription.notificationUrl = "EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=yourPartnerTopic&location=theNameOfAzureRegionFortheTopic";
subscription.lifecycleNotificationUrl = "EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=yourPartnerTopic&location=theNameOfAzureRegionFortheTopic";
subscription.resource = "users";
subscription.expirationDateTime = OffsetDateTimeSerializer.deserialize("2024-03-31T18:23:45.9356913Z");
subscription.clientState = "secretClientValue";

graphClient.subscriptions()
	.buildRequest()
	.post(subscription);