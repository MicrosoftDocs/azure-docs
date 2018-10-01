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

In order for an application to communicate with the Azure Digital Twins, it needs to be registered in Azure Active Directory and [delegated Read/Write access permissions](https://docs.microsoft.com/azure/active-directory/develop/v1-permissions-and-consent) for the Azure Digital Twins REST APIs. This section shows how users can authenticate against the middle-tier application and use an Oauth [on-behalf-of](https://docs.microsoft.com/azure/active-directory/develop/active-directory-v2-protocols-oauth-on-behalf-of) flow to call the actual API downstream, as demonstrated in this [example](https://azure.microsoft.com/resources/samples/active-directory-dotnet-webapi-onbehalfof/).

### Azure Active Directory app registration

1. Follow the steps to [integrate applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/quickstart-v1-integrate-apps-with-azure-ad) and register an application in Azure. Choose **Application type**=`Native` and **Redirect URI**=`https://microsoft.com` as outlined in below images:

    ![Azure Active Directory app registration new][1]

    ![Azure Active Directory app registration create][2]

1. After app registration is complete, click **Settings** > **Required permissions**:
    - Click **Add** on the top left.
    - Click **Select an API** to use to get external data into Digital Twins.
    - Search for **Azure Smart Spaces Service** API and click **Select**.

    ![Azure Active Directory app registration add api][3]

    - Click **Select permissions** that your app needs to have to access the correct information.
    - Check the **Read/Write Access** delegated permissions box and click **Select**.
    - Click **Done** and select **Grant permissions**
    - Get the `Application ID` of your Azure Active Directory app and use it to configure `appSettings.json` as `ClientId`:

    ![Azure Active Directory app registration grant permissions][4]

    - To configure `Tenant` in your `appSettings.json` file, supply your `Directory ID` located under **Microsoft Properties > Properties**:

    ![Azure Active Directory app registration sixth step][5]

<!-- Images -->
[1]: ./media/digital-twins-permissions/aad-app-registration1.png
[2]: ./media/digital-twins-permissions/aad-app-registration3.png
[3]: ./media/digital-twins-permissions/aad-app-registration2.png
[4]: ./media/digital-twins-permissions/aad-app-registration.v2.permission.png
[5]: ./media/digital-twins-permissions/aad-app-registration.v2.tenant.png
