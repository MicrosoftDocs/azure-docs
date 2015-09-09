#Developer Service On-boarding Guide#

##Deploy Resource Provider as Azure Websites

1. Navigate to [Portal](https://portal.azure.com/). 
2.	Sign in with MSA and Azure Subscription (from Part 1 – Non-Technical steps).
3.	(Once Portal Loads) Confirm in the top right that the Azure Subscription and Tenant (aka Directory) selected is correct.
4.	Navigate to “+NEW” (top left of portal)
5.	Select “Web + Mobile”
6.	Select “Web App”
7.	Provide the required Azure Storage settings/configurations such as website name subscritpion etcetera.
8.	For App Service Plan, create new
9.	Fill in the required details, but make sure you select a plan higher than Free or Shared. 
    ![drawing](media/marketplace-publishing-dev-services-create-and-deploy-resource-provider-deploy-resourceprovider-as-azurewebsites.JPG)
10. Create the website.

##Enabling SSL on Azure Websites

The steps to enable SSL on azure websites is given [here.](http://azure.microsoft.com/blog/2015/07/02/enabling-client-certificate-authentication-for-an-azure-web-app/)

###Overview
You can restrict access to your Azure web app by enabling different types of authentication for it. One way to do so is to authenticate using a client certificate when the request is over TLS/SSL. This mechanism is called TLS mutual authentication or client certificate authentication and this article will detail how to setup your web app to use client certificate authentication.

###Configure Web App for Client Certificate Authentication
To setup your web app to require client certificates you need to add the clientCertEnabled site setting for your web app and set it to true. This setting is not currently available through the management experience in the portal, and the REST API will need to be used to accomplish this.

You can use the ARMClient tool to make it easy to craft the REST API call. After you log in with the tool you will need to issue the following command:

Copy

> ARMClient PUT subscriptions/{Subscription Id}/resourcegroups/{Resource Group Name}/providers/Microsoft.Web/sites/{Website Name}?api-version=2015-04-01 @enableclientcert.json -verbose

replacing everything in {} with information for your web app and creating a file called enableclientcert.json with the following JSON content:

	{ "location": "My Web App Location",
	"properties": {
	"clientCertEnabled": true } }

Make sure to change the value of "location" to wherever your web app is located e.g. North Central US or West US etc.

Accessing the Client Certificate From Your Web App
When your web app is configured to use client certificate authentication, the client cert will be available in your app through a base64 encoded value in the "X-ARR-ClientCert" request header. Your application can create a certificate from this value and then use it for authentication and authorization purposes in your application.
