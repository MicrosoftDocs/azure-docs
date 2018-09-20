---
 title: include file
 description: include file
 services: digital-twins
 author: alinamstanciu
 ms.service: digital-twins
 ms.topic: include
 ms.date: 09/19/2018
 ms.author: alinast
 ms.custom: include file
---

As a solution developer, you might need to create a middle-tier application that is registered in Azure Active Directory and has been [delegated Read/Write access permissions](https://docs.microsoft.com/azure/active-directory/develop/v1-permissions-and-consent) to the Azure Digital Twins Management APIs.

Users will authenticate against the middle-tier application and an Oauth [on-behalf-of](https://docs.microsoft.com/azure/active-directory/develop/active-directory-v2-protocols-oauth-on-behalf-of) flow is used to call the actual API downstream. A [full example](https://azure.microsoft.com/resources/samples/active-directory-dotnet-webapi-onbehalfof/) demonstrating this is provided.

### Azure Active Directory app registration

1. Follow the following steps to [integrate applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/quickstart-v1-integrate-apps-with-azure-ad) and register an application in Azure:

 ![Azure Active Directory app registration first step][5]
 ![Azure Active Directory app registration second step][6]

2. After app registration is complete, click **Settings** > **Required permissions**:

	* Click **Add** on the top left.
	* Click **Select an API** to use to get external data into Digital Twins.
	* Search for **Azure Smart Spaces Service** API and click **Select**.
	* Click **Select permissions** that your app needs to have in order to access the correct information.
	* Check the **Read/Write Access** delegated permissions box and click **Select**.
	* Click **Done** and select **Grant permissions**.

3. Generate a secret key using the instructions above and use that value in configuration `appSettings.json` as `ClientSecret`.
1. 
1. Get Application *Id* and use it in configuration `appSettings.json` as `ClientId`:

 ![Azure Active Directory app registration third step][7]

### Add permissions for Azure Active Directory registered app to Digital Twins Management API

1. Open a PowerShell command window.

2. Run the following commands (using the Application *Id* from Azure Active Directory app registration):

	```bash
	Login-AzureRmAccount
    ```
	```bash
    Connect-AzureAD
	```
    ```bash
    Get-AzureRmADServicePrincipal -ApplicationId <Application ID>
    ```

3. Get the Service Principal *Id* from return payload and use it in next step payload as *objectId* to create a role assignment on this object.

4. Create a role assignment in Digital Twins for Service Pricipal *Id* above (Note: This needs to be run by someone with Admin pridvilegies) 
	* Make a POST call on `https://{resourceName}.{location}.azuresmartspaces.net/management/api/v1.0/roleassignments`
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
[1]: ./media/digital-twins-permissions/aad-app-registration.v2.clientid.png
[2]: ./media/digital-twins-permissions/aad-app-registration.v2.permission.png
[3]: ./media/digital-twins-permissions/aad-app-registration.v2.secret.png
[4]: ./media/digital-twins-permissions/aad-app-registration.v2.tenant.png

[5]: ./media/digital-twins-permissions/aad-app-registration1.png
[6]: ./media/digital-twins-permissions/aad-app-registration2.png
[7]: ./media/digital-twins-permissions/aad-app-registration3.png
