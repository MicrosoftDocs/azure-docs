<properties 
	pageTitle="Getting Started with Azure Mobile Engagement Authentication APIs"
	description="This is a migration guide to help customers who were using authentication with Capptain APIs and now need to authenticate using the new Azure Mobile Enagagement APIs." 
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="wesmc7777"
	manager="erikre"
	editor=""/>

<tags
	ms.service="mobile-engagement"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="mobile-multiple"
	ms.workload="mobile" 
	ms.date="02/29/2016"
	ms.author="wesmc"/>

# Azure Mobile Engagement - Using the APIs for authentication

## Overview

This document describes in detail how to get the authentication mechanism working for the new APIs.

It is assumed that you have a valid Azure subscription and you have created a Mobile Engagement app using one of our [Developer Tutorials](mobile-engagement-windows-store-dotnet-get-started.md).

## Authentication

A Microsoft Azure Active Directory based OAuth token must be used for authentication. 

In order to authentication an API request, an authorization header must be added to every request. It must be of the following form:

	Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGmJlNmV2ZWJPamg2TTNXR1E...

>[AZURE.NOTE] Azure Active Directory tokens expire in 1 hour.

There are several ways to get a token. Since the APIs are generally called from a cloud service, you probably want to use an API key. An API key in Azure terminology is called a Service principal password. The following procedure describes one way to setting it up manually.

> [AZURE.WARNING] The key displayed in Azure Active Directory is NOT the Mobile Engagement API key shown in Portal. The concept of Mobile Engagement API key is deprecated and has been replaced by AAD authentication described in this document.

#### One-time setup (manual)

While doing this, please note the following information as you will need it later:
	
1. Create an Azure Active Directory application using [this guide](../resource-group-create-service-principal-portal.md).

	- The application name you chose referred to as `{AD_APP_NAME}` in this document.
	- The client identifier displayed in configure menu, referred to as `{CLIENT_ID}` in this document.
	- The key displayed only once after saving, referred to as `{CLIENT_SECRET}` in this document.
	- Click **VIEW ENDPOINTS** button in the bottom bar, copy the **OAUTH 2.0 TOKEN ENDPOINT URL**, referred to as `https://login.microsoftonline.com/{TENANT_ID}/oauth2/token` in this document.	   
<br/>                                    
2. Assign a role to the Service principal like Reader or Owner using [Azure CLI](../xplat-cli-install.md).

	If you are on Windows, modify your `PATH` environment variable to include `C:\Program Files (x86)\Microsoft SDKs\Azure\CLI\bin` to be able to use the azure commands.		

	Execute the following commands to setup your account with Azure command line interface (CLI):

		azure config mode arm 
		azure login

	Then use this command to find the Object Id of your application.

		$ azure ad sp show --search {AD_APP_NAME} 
		info: Executing command ad sp show 
		+ Getting active directory service principals
		data: Object Id: 71785194-b7f5-4701-a9d6-fefb6cd32d18 
		data: Display Name: {AD_APP_NAME} 
		data: Service Principal Names:
		data: {AD_APP_URI}
		data: 8cdaf270-763c-4577-b2a2-ce559b47d353 
		data: 
		info: ad sp show command OK

	Note the `Object Id` in the output.

	Then assign the `Owner` role to the Service principal using this command:
  
		$ azure role assignment create --objectId {OBJECT_ID} -o Owner 
		info: Executing command role assignment create
		+ Finding role with specified name
		-data: RoleAssignmentId :
		/subscriptions/{SUBSCRIPTION_ID}/providers/Microsoft.Authorization/roleAssignm
		ents/009392b1-2b7c-4de8-8f70-1fccb2e0a331 
		data: RoleDefinitionName : Reader
		data: RoleDefinitionId : acdd72a7-3385-48ef-bd42-f606fba81ae7 
		data: Scope : /subscriptions/{SUBSCRIPTION_ID} 
		data: Display Name : {AD_APP_NAME}
		data: SignInName :
		data: ObjectId : {OBJECT_ID} 
		data: ObjectType : ServicePrincipal

#### One-time setup (using script)

This is an alternative way to accomplish the steps mentioned previously using a PowerShell script.

1. Get the latest version of Azure PowerShell. See this [link](../powershell-install-configure.md) for download instructions. 

2. Open Windows PowerShell in Admin mode and make sure that you have installed the [Azure Resource Manager cmdlets](https://msdn.microsoft.com/library/mt125356.aspx).

		Install-Module AzureRM
		Install-AzureRM

3. Run the following command:

		Import-Module AzureRM.profile

4. Run the following command to launch a log-in dialog. After logging in, the command will display the “active” subscription, meaning, the one that will be affected by any commands you run.

		Add-AzureRmAccount

5. Run the following command to list all of your subscriptions. Copy the guid of the one you want to use.

		Get-AzureRmSubscription

6. Run the following command providing the subscription guid to configure the subscription to be used. This is especially useful when you have multiple subscriptions.

		Select-AzureRmSubscription –SubscriptionId <subscriptionId>

7. Copy the text for the [New-AzureRmServicePrincipalOwner.ps1](https://raw.githubusercontent.com/matt-gibbs/azbits/master/src/New-AzureRmServicePrincipalOwner.ps1) script to your local machine and run it.

	>[Azure.Note] Your default security policy may block you from running a PowerShell scripts. If so, you temporarily configure your execution policy to allow script execution using the following command:

	>	Set-ExecutionPolicy RemoteSigned

	The script will prompt you for a “name” to assign to your ServicePrincipal. You can provide any name here you want.

	After the script completes, it will display four values need to authenticate programmatically with AD:
**TenantId**, **SubscriptionId**, **ApplicationId**, and **Secret**.

	Copy these values for reference. For getting an access token now, you will use TenantId as `{TENANT_ID}`, ApplicationId as `{CLIENT_ID}` and Secret as `{CLIENT_SECRET}`.

8. Check in the Azure Management portal that a new AD application was under **Show Applications my company owns**.

#### Steps to get a valid token

To get a new token, call this API: 

	https://login.microsoftonline.com/{TENANT_ID}/oauth2/token 

The following is and example request:

	POST /{TENANT_ID}/oauth2/token HTTP/1.1
	Host: login.microsoftonline.com
	Content-Type: application/x-www-form-urlencoded Content-Length: 195
	grant_type=client_credentials&client_id={CLIENT_ID}&client_secret={CLIENT_SECRET}&reso
	urce=https%3A%2F%2Fmanagement.core.windows.net%2F

Here is an example response:

	HTTP/1.1 200 OK
	Content-Type: application/json; charset=utf-8
	Content-Length: 1234
	
	{"token_type":"Bearer","expires_in":"3599","expires_on":"1445395811","not_before":"144
	5391911","resource":"https://management.core.windows.net/","access_token":{ACCESS_T
	OKEN}}

This example included URL encoding of the POST parameters, `resource` value is actually `https://management.core.windows.net/`. Be careful to also URL encode `{CLIENT_SECRET}` as it may contain special characters.

Now in every API call, include the authorization request header:

	Authorization: Bearer {ACCESS_TOKEN}

If you get a 401 status code returned, check the response body, it might tell you the token is expired. In that case, get a new token.

##Using the APIs

Now that you have a valid token, you are ready to make the API calls.

1. In each API request, you will need to pass a valid, unexpired token which you obtained in the previous section.

2. You will need to plug in some parameters into the request URI which identifies your application. The request URI looks like the following

		https://management.azure.com/subscriptions/{subscription-id}/resourcegroups/MobileEngagement/
		providers/Microsoft.MobileEngagement/appcollections/{app-collection}/apps/{app-resource-name}/

	To get the parameters, click on your application name and click Dashboard and you will see a page like the following with all the 3 parameters.

	- **1** `{subscription-id}`
	- **2** `{app-collection}`
	- **3** `{app-resource-name}`

	![](./media/mobile-engagement-api-authentication/mobile-engagement-api-uri-params.png)

>[AZURE.NOTE] <br/>
>1. Ignore the API Root Address as this was for the previous APIs.<br/>
>2.You need to use the Application Resource name which is different than the Application name itself. 




