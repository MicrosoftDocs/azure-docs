
# Integrating push notifications in your solution

## About 

Push notification integration is included in the calling SDK. These are not the visual push notifications that pop a UI to the end user. These notifications are silent notifications that are delivered to the application in the background. THe purpose for these notifications is to notify the client application that there is an incoming call it needs to receive.

In order to improve reliability of your calls and ensure the application is able to receive incoming call, you will need to registre your client applications for push notification. Azure Communication Services relies on Azure Notification Hubs to deliver notifications to the different endpoints. 

## Registering your app in the Azure Portal

1. login to the azure portal; navigate to your communication resource

2. in the resource menu, navigate to the push notifications blade

### APNS registration
You will need to enter in the following items:
 * **Token** - this is the provider authentication token, obtained through your developer account
 * **Key ID** - This is a 10-character key identifier (kid) key, obtained from your developer account
 * **Bundle ID** - The name of the application of BundleID
 * **Team ID** The issuer (iss) registered claim key; the value is a 10-character TeamId, obtained from your developer account
 * **Endpoint** The endpoint of this credential (i.e. development or production)

### GCM Registration
Enter your GCM API Key found in your developer account.


## Related content
