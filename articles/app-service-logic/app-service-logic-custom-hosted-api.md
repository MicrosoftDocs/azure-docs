<properties 
	pageTitle="Author Logic App definitions" 
	description="Learn how to write the JSON definition for Logic apps." 
	authors="stepsic-microsoft-com" 
	manager="dwrede" 
	editor="" 
	services="app-service\logic" 
	documentationCenter=""/>

<tags
	ms.service="app-service-logic"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/07/2015"
	ms.author="stepsic"/>
	
# Using a custom API hosted on App Service with Logic apps

Although Logic apps has a rich set of 40+ connectors for a variety of services, you may want to call into your own custom API that can run your own code. One of the easiest and most scalable way to host your own custom Web API's is to use an App Service Web app, so this article covers how to call into a Web API hosted on App Service.

## Deploy your Web App

First, you'll need to deploy your API as a Web App in App Service. The instructions here cover basic deployment: [Create an ASP.NET web app](https://azure.microsoft.com/en-us/documentation/articles/web-sites-dotnet-get-started/).

Be sure to get the *URL* of your Web app - it appears in the *Essentials* at the top of the Web app.

## Calling into the API

Start by creating a new blank Logic app. Once you have a blank Logic app created, click *Edit* or *Triggers and actions* and select *Create from Scratch*.

First, you'll probably want to use a recurrence trigger or click the *Run this logic manually*. Next, you'll want to actually make the call to your API. To do this, click the green *HTTP* action on the right-hand side.

1. Choose the *Method* - this will be defined in your API's code
2. In the *URL* section paste in the *URL* for your deployed Web app
3. If you require any *Headers* include them in JSON format like this: `{"Content-type" : "application/json", "Accept" : "application/json" }`
4. If your API is public then you may leave *Authentication* blank. If you want to secure calls to your API see the following sections.
5. Finally, include the *Body* of the question that you defined in your API.

Click *Save* in the command bar. If you click *Run now* you should see the call to your API and the response in the run list.

This works great if you have a public API, but if you want to secure your API then there are a couple different ways to do that:

1. **No code change required** - Azure Active Directory can be used to protect your API without requiring any code changes or redeployment.
2. Enforce Basic Auth, AAD Auth or Certificate Auth in the code of your API. 

## Securing calls to your API without a code change 

You can use the 

### Part 1: Setting up a

You only **need** to do this once for your directory. You can use the same identity for all of your Logic apps (you may also create uinque ones if you wish). You can either do this in the UI or use PowerShell.

#### Create an application identity using the Azure portal

1. Navigate to https://manage.windowsazure.com/#Workspaces/ActiveDirectoryExtension/directory and select the directory that you use for your Web App
2. Click the *Applications* tab
3. Click *Add* in the command bar at the bottom of the page
4. Give your identity a Name to use, click the next arrow
5. Put in a unique string formatted as a domain in the two text boxes, and click the checkmark
6. Click the *Configure* tab for this application
7. Copy the *Client ID*, this will be used in your Logic app
8. In the *Keys* section click *Select duration* and choose either 1 year or 2 years
9. Click the *Save* button at the bottom of the screen (you may have to wait a few seconds)
10. Now be sure to copy the key in the box. This will also be used in your Logic app

#### Create an application identity using PowerShell
1. Switch-AzureMode AzureResourceManager
2. Add-AzureAccount
3. New-AzureADApplication -DisplayName "MyLogicAppID" -HomePage "http://someranddomain.tld" -IdentifierUris "http://someranddomain.tld" -Password "Pass@word1!"
4. Be sure to copy the *Tenant ID*, the *Application ID* and the password you used

### Part 2: Protect your Web App 

If 

#### Enable Authorization in the Azure Portal

Navigate to the Web app and click the *Settings* in the command bar. 

#### Deploying your Web App using an ARM template



## Securing your API in code

### Certificate auth

You can use Client certificates to validate the incoming requests to your Web app. See [How To Configure TLS Mutual Authentication for Web App](https://azure.microsoft.com/en-us/documentation/articles/app-service-web-configure-tls-mutual-auth/) for how to set up your code. 

In the *Authorization* section you should provide: `{"type": "clientcertificate","password": "test","pfx": "long-pfx-key"}`. 

| Element | Description |
|---------|-------------|
| type | Required. Type of authentication.For SSL client certificates, the value must be ClientCertificate. |
| pfx | Required. Base64-encoded contents of the PFX file. |
| password | Required. Password to access the PFX file. |

### Basic auth

You can use Basic authentication (e.g. username and password) to validate the incoming 

In the *Authorization* section you should provide: `{"type": "basic","username": "test","password": "test"}`. 

| Element | Description |
|---------|-------------|
| type | Required. Type of authentication. For Basic authentication, the value must be Basic. |
| username | Required. Username to authenticate. |
| password | Required. Password to authenticate. |
 
### Manually implement AAD auth

If you want more granular control over the access to your API you can manually implement AAD authentication, as covered in this article: [Use Active Directory for authentication in Azure App Service](https://azure.microsoft.com/en-us/documentation/articles/web-sites-authentication-authorization/).

You will still need to follow the above steps to create an Application identity for your Logic app and use that to call the API.