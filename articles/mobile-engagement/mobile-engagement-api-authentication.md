<properties 
	pageTitle="Authenticate with Mobile Engagement REST APIs"
	description="Describes how to authenticate with Azure Mobile Engagement REST APIs" 
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="piyushjo"
	manager="erikre"
	editor=""/>

<tags
	ms.service="mobile-engagement"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="mobile-multiple"
	ms.workload="mobile" 
	ms.date="07/08/2016"
	ms.author="wesmc;ricksal"/>

# Authenticate with Mobile Engagement REST APIs

## Overview

This document describes how to get a valid AAD Oauth token to authenticate with the Mobile Engagement REST APIs. 

It is assumed that you have a valid Azure subscription and you have created a Mobile Engagement app using one of our [Developer Tutorials](mobile-engagement-windows-store-dotnet-get-started.md).

## Authentication

A Microsoft Azure Active Directory based OAuth token is used for authentication. 

In order to authentication an API request, an authorization header must be added to every request which is of the following form:

	Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGmJlNmV2ZWJPamg2TTNXR1E...

>[AZURE.NOTE] Azure Active Directory tokens expire in 1 hour.

There are several ways to get a token. Since the APIs are generally called from a cloud service, you want to use an API key. An API key in Azure terminology is called a Service principal password. The following procedure describes one way to setting it up manually.

### One-time setup (using script)

You should follow the set of instructions below to perform the setup using a PowerShell script which takes the minimum time for setup but uses the most permissible defaults. Optionally, you can also follow the instructions in the [manual setup](mobile-engagement-api-authentication-manual.md) for doing this from the Azure portal directly and do finer configuration. 

1. Get the latest version of Azure PowerShell from [here](http://aka.ms/webpi-azps). For more information on the download instructions, you can see this [link](../powershell-install-configure.md).  

2. Once Azure PowerShell is installed, use the following commands to ensure that you have the **Azure module** installed:

    a. Make sure the Azure PowerShell module is available in the list of available modules. 
    
		Get-Module –ListAvailable 

	![Available Azure Modules][1]
    	
    b. If you do not find the Azure PowerShell module in the above list then you need to run the following:
    	
		Import-Module Azure 
    	
3. Login to the Azure Resource Manager from PowerShell by running the following command and providing your user name and password for your Azure account: 
    	
		Login-AzureRmAccount

4. If you have multiple subscriptions then you should run the following:

	a. Get a list of all your subscriptions and copy the SubscriptionId of the subscription you want to use. Make sure this subscription is the same one which has the Mobile Engagement App which you are going to interact with using the APIs. 

		Get-AzureRmSubscription

	b. Run the following command providing the SubscriptionId to configure the subscription to be used.

		Select-AzureRmSubscription –SubscriptionId <subscriptionId>

5. Copy the text for the [New-AzureRmServicePrincipalOwner.ps1](https://raw.githubusercontent.com/matt-gibbs/azbits/master/src/New-AzureRmServicePrincipalOwner.ps1) script to your local machine and save it as a PowerShell cmdlet (e.g. `APIAuth.ps1`) and execute it `.\APIAuth.ps1`. 
	
6. The script will ask you to provide an input for **principalName**. Provide a suitable name here that you want to use to create your Active Directory application (e.g. APIAuth). 

7. After the script completes, it will display the following four values that you will need to authenticate programmatically with AD so make sure to copy them. 
		
	**TenantId**, **SubscriptionId**, **ApplicationId**, and **Secret**.

	You will use TenantId as `{TENANT_ID}`, ApplicationId as `{CLIENT_ID}` and Secret as `{CLIENT_SECRET}`.

	> [AZURE.NOTE] Your default security policy may block you from running a PowerShell scripts. If so, you temporarily configure your execution policy to allow script execution using the following command:

    	> Set-ExecutionPolicy RemoteSigned

8. Here is how the set of PS cmdlets would look like. 

	![][3]

9. Check in the Azure Management portal that a new AD application was created with the name you provided to the script called **principalName** under **Show Applications my company owns**.

	![][4]

#### Steps to get a valid token

1. Call the API with the following parameters and make sure to replace the TENANT\_ID, CLIENT\_ID and CLIENT\_SECRET:

	- **Request URL** as *https://login.microsoftonline.com/{TENANT\_ID}/oauth2/token*
	- **HTTP Content-Type header** as *application/x-www-form-urlencoded*
	- **HTTP Request Body** as *grant\_type=client\_credentials&client_id={CLIENT\_ID}&client_secret={CLIENT\_SECRET}&resource=https%3A%2F%2Fmanagement.core.windows.net%2F*

	The following is an example request:

		POST /{TENANT_ID}/oauth2/token HTTP/1.1
		Host: login.microsoftonline.com
		Content-Type: application/x-www-form-urlencoded
		grant_type=client_credentials&client_id={CLIENT_ID}&client_secret={CLIENT_SECRET}&reso
		urce=https%3A%2F%2Fmanagement.core.windows.net%2F

	Here is an example response:

		HTTP/1.1 200 OK
		Content-Type: application/json; charset=utf-8
		Content-Length: 1234
	
		{"token_type":"Bearer","expires_in":"3599","expires_on":"1445395811","not_before":"144
		5391911","resource":"https://management.core.windows.net/","access_token":{ACCESS_TOKEN}}

	This example included URL encoding of the POST parameters, `resource` value is actually `https://management.core.windows.net/`. Be careful to also URL encode `{CLIENT_SECRET}` as it may contain special characters.

	> [AZURE.NOTE] For testing, you can use an HTTP client tool like [Fiddler](http://www.telerik.com/fiddler) or [Chrome Postman extension](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop) 

2. Now in every API call, include the authorization request header:

		Authorization: Bearer {ACCESS_TOKEN}

	If you get a 401 status code returned, check the response body, it might tell you the token is expired. In that case, get a new token.

##Using the APIs

Now that you have a valid token, you are ready to make the API calls.

1. In each API request, you will need to pass a valid, unexpired token which you obtained in the previous section.

2. You will need to plug in some parameters into the request URI which identifies your application. The request URI looks like the following

		https://management.azure.com/subscriptions/{subscription-id}/resourcegroups/{resource-group-name}/
		providers/Microsoft.MobileEngagement/appcollections/{app-collection}/apps/{app-resource-name}/

	To get the parameters, click on your application name and click Dashboard and you will see a page like the following with all the 3 parameters.

	- **1** `{subscription-id}`
	- **2** `{app-collection}`
	- **3** `{app-resource-name}`
	- **4** Your Resource Group name is going to be **MobileEngagement** unless you created a new one. 

	![Mobile Engagement API URI parameters][2]

>[AZURE.NOTE] <br/>
>1. Ignore the API Root Address as this was for the previous APIs.<br/>
>2. If you created the app using Azure Classic portal then you need to use the Application Resource name which is different than the Application name itself. If you created the app in the Azure Portal then you should use the App Name itself (there is no differentiation between Application Resource Name and App Name for apps created in the new portal).  

<!-- Images -->
[1]: ./media/mobile-engagement-api-authentication/azure-module.png
[2]: ./media/mobile-engagement-api-authentication/mobile-engagement-api-uri-params.png
[3]: ./media/mobile-engagement-api-authentication/ps-cmdlets.png
[4]: ./media/mobile-engagement-api-authentication/ad-app-creation.png



