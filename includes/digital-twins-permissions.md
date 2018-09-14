---
 title: include file
 description: include file
 services: digital-twins
 author: dominicbetts
 ms.service: digital-twins
 ms.topic: include
ms.date: 08/30/2018
 ms.author: alinast
 ms.custom: include file
---

> TODO: We need to optimize/automate this step to create a console app (maybe PowerShell)

As a solution developer, you might need to create a middle-tier application that is registered in AAD and has been [delegated Read/Write access permissions](https://docs.microsoft.com/azure/active-directory/develop/v1-permissions-and-consent) to the Azure Digital Twins Management APIs. Users then authenticate to the middle-tier application, and then an on-behalf-of token flow is used when calling the downstream API. Here is the [on-behalf-of documentation](https://docs.microsoft.com/azure/active-directory/develop/active-directory-v2-protocols-oauth-on-behalf-of) and here is [sample code](https://azure.microsoft.com/resources/samples/active-directory-dotnet-webapi-onbehalfof/) to call a downstream web API from a web API using Azure AD.

### Create an AAD App Registration

1. Follow the steps [Integrating applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/quickstart-v1-integrate-apps-with-azure-ad) to register an application in Azure, see images
 ![AAD App Registration First Step][1]
 ![AAD App Registration Second Step][2]
1. After App Registration is created, click **Settings** > **Required permissions**
	* Click **Add** on the top left
	* Click **Select an API** to use to get external data into Digital Twins
	* Search for **Azure Smart Spaces Service** API and click **Select**
	* Click **Select permissions** that your app needs to have in order to access the correct information
	* Check the **Read/Write Access** delegated permissions box and click **Select**
	* Click **Done**, and select **Grant permissions** 
 1. Generate a Key based on above article and use that value in configuration appSettings.json as ClientSecret
 1. Get Application ID and use it in configuration appSettings.json as ClientId, see image

 ![AAD App Registration Third Step][3] 

### Add permissions for AAD Registered App to Digital Twins Management API
 1. Open a PowerShell command window
 1. Run the following commands(Use the Application ID from AAD App Registration): 
	```
	Login-AzureRmAccount
	Connect-AzureAD
	Get-AzureRmADServicePrincipal -ApplicationId <Application ID>
	```

 1. Get the Service Principal *Id* from return payload and use it in next step payload as *objectId* to create a role assignment on this object
 1. Create a role assignment in Digital Twins for Service Pricipal *Id* above (Note: This needs to be run by someone with Admin pridvilegies) 
	* Make a POST call on https://{resourceName}.{location}.azuresmartspaces.net/management/api/v1.0/roleassignments
	* Body payload
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
[1]: /media/quickstart-view-occupancy-dotnet/aad-app-registration1.png
[2]: /media/quickstart-view-occupancy-dotnet/aad-app-registration2.png
[3]: /media/quickstart-view-occupancy-dotnet/aad-app-registration3.png



