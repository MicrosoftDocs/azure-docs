---
 title: include file
 description: include file
 services: azure-digital-twins
 author: alinamstanciu
 ms.service: azure-digital-twins
 ms.topic: include
 ms.date: 09/19/2018
 ms.author: alinast
 ms.custom: include file
---

As a solution developer, you might need to create a middle-tier application that is registered in Azure Active Directory and has been [delegated Read/Write access permissions](https://docs.microsoft.com/azure/active-directory/develop/v1-permissions-and-consent) to the Azure Digital Twins Management APIs.

Users will authenticate against the middle-tier application and an Oauth [on-behalf-of](https://docs.microsoft.com/azure/active-directory/develop/active-directory-v2-protocols-oauth-on-behalf-of) flow is used to call the actual API downstream. A [full example](https://azure.microsoft.com/resources/samples/active-directory-dotnet-webapi-onbehalfof/) demonstrating this is provided.

### Azure Active Directory app registration

1. Follow the following steps to [integrate applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/quickstart-v1-integrate-apps-with-azure-ad) and register an application in Azure:

    ![Azure Active Directory app registration first step][1]
     ![Azure Active Directory app registration second step][2]

1. After app registration is complete, click **Settings** > **Required permissions**:
    * Click **Add** on the top left.
    * Click **Select an API** to use to get external data into Digital Twins.
    * Search for **Azure Smart Spaces Service** API and click **Select**.
    * Click **Select permissions** that your app needs to have to access the correct information.
    * Check the **Read/Write Access** delegated permissions box and click **Select**.
    * Click **Done** and select **Grant permissions**.

    ![Azure Active Directory app registration third step][5]

1. Generate a secret key by creating a `Password` for your Azure Active Directory app. A `Password` can be obtained under the **Settings -> Keys -> Password** menu. Use that value to configure `appSettings.json` as `ClientSecret`:

    ![Azure Active Directory app registration fourth step][6]

1. Get the `Application ID` of your Azure Active Directory app and use it to configure `appSettings.json` as `ClientId`:

    ![Azure Active Directory app registration fifth step][4]

1. To configure `Tenant` in your `appSettings.json` file, supply your `Directory ID` located under **Microsoft Properties -> Properties**:

    ![Azure Active Directory app registration sixth step][7]

### Add permissions for Azure Active Directory registered app to Digital Twins Management API

1. Open a PowerShell command window.

1. Run the following commands (using the Application ID from Azure Active Directory app registration):

    ```bash
    Login-AzureRmAccount
    ```
    ```bash
    Connect-AzureAD
    ```
    ```bash
    Get-AzureRmADServicePrincipal -ApplicationId <Application ID>
    ```

1. Get the Service Principal ID from return payload and use it in next step payload as `objectId` to create a role assignment on this object.

1. Create a role assignment in Digital Twins for the Service Principal ID above (Note: This needs to be run by someone with Admin privileges).

    * Make a POST call on `https://{resourceName}.{location}.azuresmartspaces.net/management/api/v1.0/roleassignments`
    * The JSON body should be:
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
[1]: ./media/digital-twins-permissions/aad-app-registration1.png
[2]: ./media/digital-twins-permissions/aad-app-registration2.png
[3]: ./media/digital-twins-permissions/aad-app-registration3.png
[4]: ./media/digital-twins-permissions/aad-app-registration.v2.clientid.png
[5]: ./media/digital-twins-permissions/aad-app-registration.v2.permission.png
[6]: ./media/digital-twins-permissions/aad-app-registration.v2.secret.png
[7]: ./media/digital-twins-permissions/aad-app-registration.v2.tenant.png
