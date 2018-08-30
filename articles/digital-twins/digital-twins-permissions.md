---
title: Azure Digital Twins and Authentication on Management APIs | Microsoft Docs
description: Describes how to authenticate and authorize middle-tier applications to have access to Azure Digital Twins Management APIs.
author: alinamstanciu
manager: bertv
ms.service: digital-twins
services: digital-twins
ms.devlang: csharp
ms.topic: quickstart
ms.custom: mvc
ms.date: 08/30/2018
ms.author: alinast
---

## Grant permissions to Users or ServicePrincipal to interact with Digital Twins Management APIs

>TODO: We need to optimize/automate this step to create a console app (maybe PowerShell) to

Solutions developers often create a middle-tier application that is registered in AAD and has been granted Delegated permissions Read/Write access to the Azure Digital Twins Management APIs. Users then authenticate to the middle-tier application, and then an on-behalf-of token flow is used when calling the downstream API. Here is the [On-Behalf-Of documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-protocols-oauth-on-behalf-of) and here is a [Sample code](https://azure.microsoft.com/en-us/resources/samples/active-directory-dotnet-webapi-onbehalfof/) to call a downstream web API from a web API using Azure AD.

After deployment of Digital Twins, a Management Url swagger will be generated for your instance with this format https://{resourceName}.{location}.azuresmartspaces.net/management/swagger

### Create an AAD App Registration
1. Follow the steps [here](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-v1-integrate-apps-with-azure-ad) to register an application in Azure
1. Click settings --> Required Permissions
	* Click Add on the top left
	* Select the API you'd like to use to get external data into Digital Twins (e.g. Microsoft Graph)
	* Select the permissions that your app needs to have in order to access the correct information
	* Select Save, and then click Add again
	* Select the "Azure Smart Spaces Service" API
	* Check the Read/Write Access delegated permissions box
	* Save, and select Grant Permissions
 1. Generate a key -> use that value in configuration appSettings.json as ClientSecret
 1. Get Application ID and use it in configuration appSettings.json as ClientId, see image

 ![AAD App Registration][1]

### Add permissions for AAD Registered App to Digital Twins Management API
 1. Run `Login-AzureRmAccount`in PowerShell
 1. Run `Connect-AzureAD` in PowerShell
 1. Run `Get-AzureRmADServicePrincipal -ApplicationId <Application ID>` -> use the ClientId/Application ID above
 1. Get the Service Principal `Id` from return payload and use it in next step payload as `objectId` to create a role assignment on this object
 1. Create a role assignment in Digital Twins for Service Pricipal Id above (Note: This needs to be run by someone with Admin pridvilegies)
	* Make a POST call on https://{resourceName}.{location}.azuresmartspaces.net/management/api/v1.0/roleassignments
	* Payload
	```json
		{
		"RoleId": "98e44ad7-28d4-4007-853b-b9968ad132d1",
		"objectId": "Service Principal Id above",
		"objectIdType": "ServicePrincipalId",
		"Path": "/",
		"tenantId": "72f988bf-86f1-41af-91ab-2d7cd011db47"
		}
	```

<!-- Images -->
[1]: /media/quickstart-view-occupancy-dotnet/AADAppRegistration.png



