// THE CLI IS IN PREVIEW. NON-PRODUCTION USE ONLY
mgc subscriptions create --body '{\
   "changeType": "updated,deleted,created",\
   "notificationUrl": "EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=youPartnerTopic&location=theNameOfAzureRegionFortheTopic",\
   "lifecycleNotificationUrl": "EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=yourPartnerTopic&location=theNameOfAzureRegionFortheTopic",\
   "resource": "users",\
   "expirationDateTime":"2024-03-31T18:23:45.9356913Z",\
   "clientState": "secretClientValue"\
}\
'