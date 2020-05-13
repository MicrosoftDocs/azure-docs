---
 title: include file
 description: include file
 services: digital-twins
 ms.author: alinast
 author: alinamstanciu
 manager: bertvanhoof
 ms.service: digital-twins
 ms.topic: include
 ms.date: 02/03/2020
 ms.custom: include file
---

>[!NOTE]
>This section provides instructions for [Azure AD app registration](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app).

1. In the [Azure portal](https://portal.azure.com), open **Azure Active Directory** from the expandable left menu, and then open the **App registrations** pane. 

    [![Select the Azure Active Directory pane](./media/digital-twins-permissions/azure-portal-select-aad-pane.png)](./media/digital-twins-permissions/azure-portal-select-aad-pane.png#lightbox)

1. Select the **+ New registration** button.

    [![Select the New registration button](./media/digital-twins-permissions/aad-app-register.png)](./media/digital-twins-permissions/aad-app-register.png#lightbox)

1. Give a friendly name for this app registration in the **Name** box. 

    1. Under **Redirect URI (optional)** section, enter `https://microsoft.com` in the textbox.     

    1. Verify which accounts and tenants are supported by your Azure Active Directory app.

    1. Select **Register**.

    [![Create pane](./media/digital-twins-permissions/aad-app-reg-create.png)](./media/digital-twins-permissions/aad-app-reg-create.png#lightbox)

1. The **Authentication** blade specifies important authentication configuration settings. 

    1. Add **Redirect URIs** and configure **Access Tokens** by selecting **+ Add a platform**.

    1. Select **Yes** to specify that the app is a **public client**.

    1. Verify which accounts and tenants are supported by your Azure Active Directory app.

    [![Public client configuration setting](./media/digital-twins-permissions/aad-configure-public-client.png)](./media/digital-twins-permissions/aad-configure-public-client.png#lightbox)

1. After selecting the appropriate platform, configure your **Redirect URIs** and **Access Tokens** in the side panel to the right of the user interface.

    1. **Redirect URIs** must match the address supplied by the authentication request:

        * For apps hosted in a local development environment, select **Public client (mobile & desktop)**. Make sure to set **public client** to **Yes**.
        * For Single-Page Apps hosted on Azure App Service, select **Web**.

    1. Determine whether a **Logout URL** is appropriate.

    1. Enable the implicit grant flow by checking **Access tokens** or **ID tokens**.
                
    [![Configure Redirect URIs](./media/digital-twins-permissions/aad-app-configure-redirect-uris.png)](./media/digital-twins-permissions/aad-app-configure-redirect-uris.png#lightbox)

    Click **Configure**, then **Save**.

1.  Open the **Overview** pane of your registered app, and copy the values of the following entities to a temporary file. You'll use these values to configure your sample application in the following sections.

    - **Application (client) ID**
    - **Directory (tenant) ID**

    [![Azure Active Directory application ID](./media/digital-twins-permissions/aad-app-reg-app-id.png)](./media/digital-twins-permissions/aad-app-reg-app-id.png#lightbox)

1. Open the **API permissions** pane for your app registration. Select **+ Add a permission** button. In the **Request API permissions** pane, select the **APIs my organization uses** tab, and then search for one of the following:
    
    1. `Azure Digital Twins`. Select the **Azure Digital Twins** API.

        [![Search API or Azure Digital Twins](./media/digital-twins-permissions/aad-aap-search-api-dt.png)](./media/digital-twins-permissions/aad-aap-search-api-dt.png#lightbox)

    1. Alternatively, search for `Azure Smart Spaces Service`. Select the **Azure Smart Spaces Service** API.

        [![Search API for Azure Smart Spaces](./media/digital-twins-permissions/aad-app-search-api.png)](./media/digital-twins-permissions/aad-app-search-api.png#lightbox)

    > [!IMPORTANT]
    > The Azure AD API name and ID that will appear depends on your tenant:
    > * Test tenant and customer accounts should search for `Azure Digital Twins`.
    > * Other Microsoft accounts should search for `Azure Smart Spaces Service`.

1. Either API will appear as **Azure Digital Twins** in the same **Request API permissions** pane once selected. Select the **Read** drop-down option, and then select the **Read.Write** checkbox. Select the **Add permissions** button.

    [![Add API permissions](./media/digital-twins-permissions/aad-app-req-permissions.png)](./media/digital-twins-permissions/aad-app-req-permissions.png#lightbox)

1. Depending on your organization's settings, you might need to take additional steps to grant admin access to this API. Contact your administrator for more information. Once the admin access is approved, the **Admin Consent Required** column in the **API permissions** pane will display your permissions. 

    [![Admin consent approval](./media/digital-twins-permissions/aad-app-admin-consent.png)](./media/digital-twins-permissions/aad-app-admin-consent.png#lightbox)

    Verify that **Azure Digital Twins** appears.
