---
 title: include file
 description: include file
 services: digital-twins
 author: alinamstanciu
 ms.service: digital-twins
 ms.topic: include
 ms.date: 06/26/2019
 ms.author: alinast
 ms.custom: include file
---

>[!NOTE]
>Be aware that the legacy AAD app registration that is used here will be discontinued soon. This section will be updated once Azure Digital Twins is completely integrated with the [new AAD app registration](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app). In the meanwhile, you may experiment with the new AAD app. Note that you will need to use [public client (mobile & destkop)](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-app-types#mobile-and-native-apps) for the *Redirect URI*. 

1. In the [Azure portal](https://portal.azure.com), open **Azure Active Directory** from the left pane, and then open the **App registrations (Legacy)** pane. Select the **New application registration** button.

1. Give a friendly name for this app registration in the **Name** box. Choose **Application type** as **Native**, and **Redirect URI** as `https://microsoft.com`. Select **Create**.

    ![Create pane](./media/digital-twins-permissions/aad-app-reg-create.png)

1. Open the registered app. Copy the following values to a temporary file:
    a. The value of the **Application (client) ID** field, which identifies your Azure Active Directory app, and
    b. The value of the **Directory (tenant) ID** field, which represents your Azure Active Directory tenant. 
   
   You'll use both these values to configure your sample application in the following sections.

    ![Azure Active Directory application ID](./media/digital-twins-permissions/aad-app-reg-app-id.png)

1. In your app registration pane, select **API permissions**, and then select **Add a permission**.

    ![Azure Active Directory API permissions](./media/digital-twins-permissions/aad-app-reg-api-permit.png)

1. In the **Request API permissions** pane, select the tab **APIs my organization uses**, and then search for **Azure Digital Twins**. Select the **Azure Digital Twins Deployer - Dev** option. 

    ![Azure Active Directory select API](./media/digital-twins-permissions/aad-app-reg-select-api.png)

1. Note that the **Request API permissions** pane now shows the permissions to select for these APIs. Select **user_impersonation**, and then select **Add permissions**. 

    ![Azure Active Directory select permissions](./media/digital-twins-permissions/aad-app-reg-select-permit.png)
 
   The API **Azure Digital Twins Deployer - Dev** will appear in the list of **API permissions**. 
 