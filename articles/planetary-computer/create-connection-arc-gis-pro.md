---
title: Using ArcGIS Pro with Microsoft Planetary Computer Pro
description: Learn how to configure and authenticate ArcGIS Pro so that it can read STAC item data from Microsoft Planetary Computer Pro. 
author: aloverro
ms.author: adamloverro
ms.service: planetary-computer-pro
ms.topic: how-to
ms.date: 05/08/2025

ms.custom:
  - build-2025
# customer intent: As a GeoCatalog user, I want to configure and authenticate ArcGIS pro to operate with Microsoft Planetary Computer Pro so that I can view imagery stored in my GeoCatalog within the ArcGIS Pro tool.
---

# Configure ArcGIS Pro to access a GeoCatalog

This guide demonstrates how to configure ArcGIS Pro to access geospatial datasets from the Microsoft Planetary Computer Pro GeoCatalog using OAuth 2.0 delegated authentication with Microsoft Entra ID. This process requires registering two applications in Microsoft Entra ID (a Web API and a Desktop client), configuring delegated permissions with user_impersonation scope, and connecting ArcGIS Pro to Azure Blob Storage and SpatioTemporal Access Catalog (STAC) compliant datasets hosted in the Microsoft Planetary Computer Pro environment.

By the end of this guide, you are able to securely browse and access data hosted in Microsoft Planetary Computer (MPC) Pro directly in ArcGIS Pro using Microsoft Entra ID user impersonation.

## Prerequisites

- Access to a Microsoft Entra ID tenant
- Azure subscription with permissions to manage app registrations
- ArcGIS Pro installed on your machine

> [!TIP] 
> Before you begin, review [Register an application in Microsoft Entra ID](/entra/identity-platform/quickstart-register-app) for background information on app registration.


## Register web API application for ArcGIS Pro
### [Public](#tab/public)
1. Open the Azure portal and go to **Microsoft Entra ID**.

    :::image type="content" source="media/microsoft-entra-id.png" alt-text="Screenshot showing a user selecting Microsoft Entra ID from Azure portal." lightbox="media/microsoft-entra-id.png":::

1. Navigate to **App registrations** > **New registration**.

    :::image type="content" source="media/new-app-registration.png" alt-text="Screenshot showing new app registration." lightbox="media/new-app-registration.png":::

1. Register the Web API app. Suggested names:
    - ArcGISPro-GeoCatalog-WebAPI or 
    - ArcGIS Pro

1. Set **Multitenant** as the account type.

    :::image type="content" source="media/register-an-app-arcgis-pro.png" alt-text="Screenshot showing register an app ArcGIS Pro." lightbox="media/register-an-app-arcgis-pro.png":::

    :::image type="content" source="media/new-app-registration-arcgis-pro.png" alt-text="Screenshot showing new app  registration ArcGIS Pro." lightbox="media/new-app-registration-arcgis-pro.png":::

1. After registration, complete the following configuration within the new app registration ArcGIS Pro.

   - Go to the **Authentication** tab.

   - Add platform: **Web**.

   :::image type="content" source="media/add-web-platform.png" alt-text="Screenshot showing the selection to add a web platform type of authentication." lightbox="media/add-web-platform.png":::

1. Set **Redirect URI**: <https://localhost>.
  
    :::image type="content" source="media/add-redirect-uri.png" alt-text="Screenshot showing how to add a redirect URI." lightbox="media/add-redirect-uri.png":::

1. Add platform: **Mobile and Desktop applications**

    :::image type="content" source="media/add-mobile-desktop-app.png" alt-text="Screenshot showing add mobile desktop app." lightbox="media/add-mobile-desktop-app.png":::
    
1. Set **Custom Redirect URI**: arcgis-pro://auth.

    :::image type="content" source="media/configure-desktop-device.png" alt-text="Screenshot showing configure desktop device." lightbox="media/configure-desktop-device.png":::

1. Enable **ID tokens** under **Implicit grant and hybrid flows**.

1. Select **Save**.

    :::image type="content" source="media/enable-id-tokens.png" alt-text="Screenshot showing enable ID tokens ArcGIS App authentication." lightbox="media/enable-id-tokens.png":::

1. Go to **API Permissions**.

    - Add and grant admin consent for:
      - Azure Storage > user_impersonation.
      - Microsoft Graph > User.Read (This permission is enabled by default).
    
    :::image type="content" source="media/add-api-permissions.png" alt-text="Screenshot showing howto configure the addition of API permissions." lightbox="media/add-api-permissions.png":::

1. **Grant admin consent** after permissions are added.

    :::image type="content" source="media/grant-admin-consent.png" alt-text="Screenshot showing how to grant admins consent." lightbox="media/grant-admin-consent.png":::

1. Go to **Expose an API**.

    - Add **App ID URI**.

    :::image type="content" source="media/add-app-id-uri.png" alt-text="Screenshot showing how to add the app id URI ." lightbox="media/add-app-id-uri.png":::

1. Define scopes:

    - user_authentication (Display name: ArcGISPro-API-User-Auth)
    - user_impersonation (Display name: ArcGISPro-API-Impersonation)

    :::image type="content" source="media/add-user-authentication-scope.png" alt-text="Screenshot showing add user authentication scope." lightbox="media/add-user-authentication-scope.png":::
    
    :::image type="content" source="media/add-user-impersonation-scope.png" alt-text="Screenshot showing add user impersonation scope." lightbox="media/add-user-impersonation-scope.png":::

1. Select **Add a client application** ; choose and take note of the Client ID. This ID is used later when setting up [Authentication Connection](#add-an-authentication-connection) in ArcGIS Pro.

    :::image type="content" source="media/add-a-client-app.png" alt-text="Screenshot showing how to add a client app." lightbox="media/add-a-client-app.png":::
### [US Gov](#tab/usgov)

1. Open the Azure portal and go to **Microsoft Entra ID**.

    :::image type="content" source="media/microsoft-entra-id.png" alt-text="Screenshot showing a user selecting Microsoft Entra ID from Azure portal." lightbox="media/microsoft-entra-id.png":::

1. Navigate to **App registrations** > **New registration**.

    :::image type="content" source="media/new-app-registration.png" alt-text="Screenshot showing new app registration." lightbox="media/new-app-registration.png":::

1. Register the Web API app. Suggested names:
    - ArcGISPro-GeoCatalog-WebAPI or 
    - ArcGIS Pro

1. Set **Multitenant** as the account type.
    :::image type="content" source="media/register-an-app-arcgis-pro.png" alt-text="Screenshot showing register an app ArcGIS Pro." lightbox="media/register-an-app-arcgis-pro.png":::

    :::image type="content" source="media/new-app-registration-arcgis-pro.png" alt-text="Screenshot showing new app  registration ArcGIS Pro." lightbox="media/new-app-registration-arcgis-pro.png":::

1. After registration, complete the following configuration within the new app registration ArcGIS Pro.

   - Go to the **Authentication** tab.

   - Add platform: **Web**.

   :::image type="content" source="media/add-web-platform.png" alt-text="Screenshot showing the selection to add a web platform type of authentication." lightbox="media/add-web-platform.png":::

1. Set **Redirect URI**: <https://localhost>.
  
    :::image type="content" source="media/add-redirect-uri.png" alt-text="Screenshot showing how to add a redirect URI." lightbox="media/add-redirect-uri.png":::

1. Add platform: **Mobile and Desktop applications**

    :::image type="content" source="media/add-mobile-desktop-app.png" alt-text="Screenshot showing add mobile desktop app." lightbox="media/add-mobile-desktop-app.png":::
    
1. Set **Custom Redirect URI**: arcgis-pro://auth.

    :::image type="content" source="media/government-mobile-first-redirect.png" alt-text="Screenshot showing configure desktop plus device with a redirect URI." lightbox="media/government-mobile-first-redirect.png":::

1. In the new **Mobile and desktop applications** panel, select *Add URI* to add a second Redirect URI: https://login.microsoftonline.us/common/oauth2/nativeclient

    :::image type="content" source="media/government-mobile-second-redirect.png" alt-text="Screenshot showing the addition of a second Redirect URI." lightbox="media/government-mobile-second-redirect.png":::

1. Enable **ID tokens** under **Implicit grant and hybrid flows**.

1. Select **Save**.

    :::image type="content" source="media/enable-id-tokens.png" alt-text="Screenshot showing enable ID tokens ArcGIS App authentication." lightbox="media/enable-id-tokens.png":::

1. Go to **API Permissions**.

    - Add and grant admin consent for:
      - Azure Storage > user_impersonation.
      - Microsoft Graph > User.Read (This permission is enabled by default).
    
    :::image type="content" source="media/add-api-permissions.png" alt-text="Screenshot showing howto configure the addition of API permissions." lightbox="media/add-api-permissions.png":::

1. **Grant admin consent** after permissions are added.

    :::image type="content" source="media/grant-admin-consent.png" alt-text="Screenshot showing how to grant admins consent." lightbox="media/grant-admin-consent.png":::

1. Go to **Expose an API**.

    - Add **App ID URI**.

    :::image type="content" source="media/add-app-id-uri.png" alt-text="Screenshot showing how to add the app id URI." lightbox="media/add-app-id-uri.png":::

1. Define scopes:

    - user_authentication (Display name: ArcGISPro-API-User-Auth)
    - user_impersonation (Display name: ArcGISPro-API-Impersonation)

    :::image type="content" source="media/add-user-authentication-scope.png" alt-text="Screenshot showing add user authentication scope." lightbox="media/add-user-authentication-scope.png":::
    
    :::image type="content" source="media/add-user-impersonation-scope.png" alt-text="Screenshot showing add user impersonation scope." lightbox="media/add-user-impersonation-scope.png":::

1. Select **Add a client application** ; choose and take note of the Client ID. This ID is used later when setting up an [Authentication Connection](#add-an-authentication-connection) in ArcGIS Pro.

    :::image type="content" source="media/add-a-client-app.png" alt-text="Screenshot showing how to add a client app." lightbox="media/add-a-client-app.png":::

---

## Register desktop client application for ArcGIS Pro
### [Public](#tab/public)
Register a second application (with a distinct name) to represent ArcGIS
Pro Desktop and configure its API permissions --- ensuring it includes
access to the web API exposed by the first application.

1. Create a second app registration for the ArcGIS Pro desktop client.

    - Suggested name: ArcGISPro-GeoCatalog-DesktopClient or GeoCatalog-ArcGIS.
    
    - Set account type: **Single tenant**.

    :::image type="content" source="media/register-second-app-arcgis-pro-desktop-client.png" alt-text="Screenshot showing register second app arcgisprodesktopclient." lightbox="media/register-second-app-arcgis-pro-desktop-client.png":::

    :::image type="content" source="media/new-app-registration-geocatalog-arcgis.png" alt-text="Screenshot showing new app  registration GeoCatalog ArcGIS." lightbox="media/new-app-registration-geocatalog-arcgis.png":::

1. Configure the Desktop Client App.

    Complete the following configuration within the new App registration GeoCatalog-ArcGIS.

    - For **Authentication**, repeat the same steps as in Step 1:
    
      - Add platform: **Web**.
      - Set **Redirect URI**: https://localhost.
      - Add platform: **Mobile and desktop applications**
      - Set **Redirect URI**: arcgis-pro://auth.
      - Enable **ID tokens** under **Implicit grant and hybrid flows**.
      - Select **Save**.

    - **API Permissions**: Adding Access to the Web API App.
    
      - In the **API permissions** tab, select **Add a permission**.
    
      - Go to the **APIs my organization uses** tab and search for the **Web
        API app** created in Step 1 (for example, ArcGIS Pro).
    
      - Select the app name to open the **Request API Permissions** screen.

   :::image type="content" source="media/request-api-permissions.png" alt-text="Screenshot showing request API permissions." lightbox="media/request-api-permissions.png":::

    - Select both user_authentication and user_impersonation; the delegated permissions defined in the first app.

    - Select **Add permissions**.

    :::image type="content" source="media/add-api-permissions-arcgis-pro.png" alt-text="Screenshot showing add API permissions ArcGIS Pro." lightbox="media/add-api-permissions-arcgis-pro.png":::

    - Continue to add the following delegated permissions:
    
      - **Azure Storage** > user_impersonation.
      - **Azure Orbital Spatio** > user_impersonation.
      - **Microsoft Graph** > User.Read (This permission is enabled by default).
      - Select **Add permissions**.
      - Select **Grant admin consent**.
    
    :::image type="content" source="media/app-selection-on-request-api-permissions-screen.png" alt-text="Screenshot showing app selection on request API permissions screen." lightbox="media/app-selection-on-request-api-permissions-screen.png":::
  
    :::image type="content" source="media/grant-admin-consents-4.png" alt-text="Screenshot showing grant admin consents (4)." lightbox="media/grant-admin-consents-4.png":::
### [US Gov](#tab/usgov)
Register a second application (with a distinct name) to represent ArcGIS
Pro Desktop and configure its API permissions --- ensuring it includes
access to the web API exposed by the first application.

1. Create a second app registration for the ArcGIS Pro desktop client.

    - Suggested name: ArcGISPro-GeoCatalog-DesktopClient or GeoCatalog-ArcGIS.
    
    - Set account type: **Single tenant**.

    :::image type="content" source="media/register-second-app-arcgis-pro-desktop-client.png" alt-text="Screenshot showing register second app arcgisprodesktopclient." lightbox="media/register-second-app-arcgis-pro-desktop-client.png":::

    :::image type="content" source="media/new-app-registration-geocatalog-arcgis.png" alt-text="Screenshot showing new app  registration GeoCatalog ArcGIS." lightbox="media/new-app-registration-geocatalog-arcgis.png":::

1. Configure the Desktop Client App.

    Complete the following configuration within the new App registration GeoCatalog-ArcGIS.

    - For **Authentication**, repeat the same steps as in Step 1:
    
      - Add platform: **Web**.
      - Set **Redirect URI**: https://localhost.
      - Add platform: **Mobile and desktop applications**
      - Set **Redirect URI**: arcgis-pro://auth.
      - Add another **Mobile and desktop applications** Redirect URI: https://login.microsoftonline.us/common/oauth2/nativeclient.
      - Enable **ID tokens** under **Implicit grant and hybrid flows**.
      - Select **Save**.

    - **API Permissions**: Adding Access to the Web API App.
    
      - In the **API permissions** tab, select **Add a permission**.
    
      - Go to the **APIs my organization uses** tab and search for the **Web
        API app** created in Step 1 (for example, ArcGIS Pro).
    
      - Select the app name to open the **Request API Permissions** screen.

   :::image type="content" source="media/request-api-permissions.png" alt-text="Screenshot showing request API permissions." lightbox="media/request-api-permissions.png":::

    - Select both user_authentication and user_impersonation; the delegated permissions defined in the first app.

    - Select **Add permissions**.

    :::image type="content" source="media/add-api-permissions-arcgis-pro.png" alt-text="Screenshot showing add API permissions ArcGIS Pro." lightbox="media/add-api-permissions-arcgis-pro.png":::

    - Continue to add the following delegated permissions:
    
      - **Azure Storage** > user_impersonation.
      - **Azure Orbital Spatio** > user_impersonation.
      - **Microsoft Graph** > User.Read (This permission is enabled by default).
      - Select **Add permissions**.
      - Select **Grant admin consent**.
    
    :::image type="content" source="media/app-selection-on-request-api-permissions-screen.png" alt-text="Screenshot showing app selection on request API permissions screen." lightbox="media/app-selection-on-request-api-permissions-screen.png":::
  
    :::image type="content" source="media/grant-admin-consents-4.png" alt-text="Screenshot showing grant admin consents (4)." lightbox="media/grant-admin-consents-4.png":::

---

## Configure ArcGIS Pro (Desktop) for Microsoft Planetary Computer Pro GeoCatalog access

This section outlines how to configure authentication and data access in the **ArcGIS Pro desktop application**, using OAuth 2.0 integration with **Microsoft Entra ID** and access to the **Microsoft Planetary Computer Pro GeoCatalog**. It includes steps to add an authentication connection and create storage and STAC data connections.

## Add an authentication connection
### [Public](#tab/public)
1. Open the **ArcGIS Pro settings** page in one of the following ways:

    - From an open project, select the **Project** tab on the ribbon.
    - From the start page, select the **Settings** tab.

1. In the side menu, select **Options**.

1. In the **Options** dialog box, under **Application**, select **Authentication**.

1. Select **Add Connection** to add a new authentication connection.

1. In the **Add Connection** dialog box:

    - Enter a **Connection Name**.

    - For **Type**, select **Microsoft Entra ID**.

    - Enter your **Entra Domain** and **Client ID**.

      - You can [find your **Entra Domain**](/partner-center/account-settings/find-ids-and-domain-names) (also know as your **Primary Domain**) from with Microsoft Entra ID from your Azure portal

      - Your **Client ID** is the client ID you set in the **Add a client application** step.

    - Add the following **scopes**:

      - `https://storage.azure.com/.default`

      - `https://geocatalog.spatio.azure.com/.default`

    :::image type="content" source="media/add-connection.png" alt-text="Screenshot showing how to add a connection." lightbox="media/add-connection.png":::

    - Select **OK**.
    
    - Sign in through the Authentication dialog and complete the prompts.
    
    :::image type="content" source="media/sign-in.png" alt-text="Screenshot showing how to sign in with the Authentication dialog." lightbox="media/sign-in.png":::

> [!TIP] 
> For more information, see the official ArcGIS Pro documentation [Connect to authentication providers from ArcGIS Pro](https://pro.arcgis.com/en/pro-app/latest/get-started/connect-to-authentication-providers-from-arcgis-pro.htm).

### [US Gov](#tab/usgov)

1. Open the **ArcGIS Pro settings** page in one of the following ways:

    - From an open project, select the **Project** tab on the ribbon.
    - From the start page, select the **Settings** tab.

1. In the side menu, select **Options**.

1. In the **Options** dialog box, under **Application**, select **Authentication**.

1. Select **Add Connection** to add a new authentication connection.

1. In the **Add Connection** dialog box:

    - Enter a **Connection Name**.

    - For **Type**, select **Microsoft Entra ID**.
    
    - Select **Azure US Government** under **Azure Environment**

    - Enter your **Entra Domain** and **Client ID**.

      - You can [find your **Entra Domain**](/partner-center/account-settings/find-ids-and-domain-names) (also know as your **Primary Domain**) from with Microsoft Entra ID from your Azure portal
      - Your **Client ID** is the client ID you set in the **Add a client application** step.

    - Add the following **scopes**:

      - `https://storage.usgovcloudapi.net/.default`

      - `https://geocatalog.spatio.azure.us/.default`

    :::image type="content" source="media/add-authentication-us-gov.png" alt-text="Screenshot showing how to add a connection." lightbox="media/add-authentication-us-gov.png":::

    - Select **OK**.
    
    - Sign in through the Authentication dialog and complete the prompts.
    
    :::image type="content" source="media/sign-in.png" alt-text="Screenshot showing how to sign in with the Authentication dialog." lightbox="media/sign-in.png":::

> [!TIP] 
> For more information, see the official ArcGIS Pro documentation [Connect to authentication providers from ArcGIS Pro](https://pro.arcgis.com/en/pro-app/latest/get-started/connect-to-authentication-providers-from-arcgis-pro.htm).

---

## Prepare and record GeoCatalog information
### GeoCatalog URI, Collection Name, and Token API Endpoint

1. Create a Microsoft Planetary Computer Pro GeoCatalog in your Azure subscription (for example,
     arcgisprogeocatalog), and locate it in the appropriate resource group.

    :::image type="content" source="media/find-hidden-type-geocatalog.png" alt-text="Screenshot showing find hiddentype GeoCatalog." lightbox="media/find-hidden-type-geocatalog.png":::

1. Select on the GeoCatalog. For example, **arcgisprogeocatalog**.

1. Record the **GeoCatalog URI**. For example, ```https://arcgisprogeocatalog.<unique-identity>.<cloud-region>.geocatalog.spatio.azure.com```.

    :::image type="content" source="media/get-geocatalog-uri.png" alt-text="Screenshot showing how to retrieve the GeoCatalog URI." lightbox="media/get-geocatalog-uri.png":::

1. Open the link to your GeoCatalog URI in the browser and select on the
    **Collections** button

    :::image type="content" source="media/media-processing-center-pro-collections.png" alt-text="Screenshot showing Microsoft Planetary Computer Pro web interface." lightbox="media/media-processing-center-pro-collections.png":::

1. Record the **Collection Name**. For example, sentinel-2-l2a-tutorial-1000.

1. Construct the **Token API Endpoint** using this pattern: ```<GeoCatalog URI>/sas/token/<Collection Name>?api-version=2025-04-30-preview```
 
   - Example:```https://arcgisprogeocatalog.<unique-identity>.<cloud-region>.geocatalog.spatio.azure.com/sas/token/sentinel-2-l2a-tutorial-1000?api-version=2025-04-30-preview```

### Storage Location
Each Collection within the MPC Pro GeoCatalog utilizes a dedicated Storage Account and Azure Blob Container to store geospatial data and STAC Item assets. In the following steps, you find and record the Storage Account and Container names uses for a specific collection. 

> [!NOTE] 
> An Azure Storage Account and Blob Container are only discoverable after STAC Items or other assets must be added to a collection.

There are two easy ways to discover the Storage Account and Blob Container for a collection, using a thumbnail, or using a STAC Item with assets:

#### From a Collection Thumbnail

1. From a specific Collection page, select the collection name.

    :::image type="content" source="media/click-on-collection-name.png" alt-text="Screenshot showing click on collection name." lightbox="media/click-on-collection-name.png":::

1. Select the **Edit collection** button.

    :::image type="content" source="media/edit-collection.png" alt-text="Screenshot showing how to edit a GeoCatalog collection." lightbox="media/edit-collection.png":::

1. In the resulting JSON display, locate the key "**title:assets:thumbnail:href**" and copy the corresponding value. For example:

    ```bash
    https://<unique-storage>.blob.core.windows.net/sentinel-2-l2a-tutorial-1000-<unique-id>/collection-assets/thumbnail/lulc.png
    ```

1. Record the value of Account Name and Container Name, for example:

    - **(Storage) Account Name**: ```<unique-storage>```
    - **Container Name**: ```sentinel-2-l2a-tutorial-1000-<unique-id>```

    :::image type="content" source="media/collection-json-display.png" alt-text="Screenshot showing collection json display." lightbox="media/collection-json-display.png":::

#### From a STAC Item

1. From a specific Collection page, select **STAC Items**.
    
    :::image type="content" source="media/select-stac-items.png" alt-text="Screenshot showing the selection of the STAC Item." lightbox="media/select-stac-items.png":::

1. Select the checkbox next to one of the listed STAC items.
    
    :::image type="content" source="media/select-stac-item-checkbox.png" alt-text="Screenshot showing checking a STAC Item box." lightbox="media/select-stac-item-checkbox.png":::

1. Scroll to the bottom of the STAC Item right side panel and select this link for the STAC Item JSON

    :::image type="content" source="media/select-stac-item-json-link.png" alt-text="Screenshot showing selection of the STAC Item JSON link." lightbox="media/select-stac-item-json-link.png":::

1. Find the object within the STAC Item json specification called `assets`. Choosing one of the asset types within this object, find the `href` key.

    ```json
    "assets": {
        "image": {
            "href": "https://<unique-storage>.blob.core.windows.net/naip-sample-datasets-<unique-id>/12f/va_m_3807708_sw_18_060_20231113_20240103/image.tif",
        }
    }
    ```
1. Record the value of Account Name and Container Name, for example:

    - **(Storage) Account Name**: ```<unique-storage>```
    - **Container Name**: ```naip-sample-datasets-<unique-id>```


## Set up a connection to Azure Blob 

1. In ArcGIS Pro, open the **Create Cloud Storage Connection File** geoprocessing tool to create a new ACS connection file. This tool can be accessed in the main Ribbon on the Analysis Tab. Select the Tools Button, then search for the tool by typing its name.

1. Specify a Connection File Location for the ACS file.

1. Provide a Connection File Name. For example, **geocatalog_connection.acs**.

1. For Service Provider select Azure.

1. For **Authentication**, select the name of the auth profile that you created in previous steps.

1. For **Access Key ID (Account Name)**, use the **Account Name** value that you recorded earlier: ```<unique-storage>```.

1. For **Bucket (Container) Name** use the **Container Name** value that you recorded earlier: ```sentinel-2-l2a-tutorial-1000-<unique-id>```.

1. Don't specify a **Folder**.

1. Add the provider option **ARC_TOKEN_SERVICE_API** and set the value to your **Token API Endpoint** that you constructed earlier. For example:

    ```bash
    https://arcgisprogeocatalog.<unique-identity>.<cloud-region>.geocatalog.spatio.azure.com/sas/token/sentinel-2-l2a-tutorial-1000?api=version=2025-04-30-preview
    ```

1. Add the provider option **ARC_TOKEN_OPTION_NAME** and set the value **to AZURE_STORAGE_SAS_TOKEN**.

    :::image type="content" source="media/create-cloud-storage-connection-file-sample.png" alt-text="Screenshot showing create cloud storage connection file sample." lightbox="media/create-cloud-storage-connection-file-sample.png":::
## Create a STAC connection to Microsoft Planetary Computer Pro

1. Create a new STAC connection in ArcGIS Pro (desktop).

    > [!TIP] 
    > Refer to ArcGIS Pro documentation to [Create a STAC connection](https://pro.arcgis.com/en/pro-app/latest/help/data/imagery/create-a-stac-connection.htm).

    :::image type="content" source="media/create-new-stac-connection.png" alt-text="Screenshot showing create new stac connection." lightbox="media/create-new-stac-connection.png":::

    - Provide a name for the STAC Connection: For example, GeoCatalog_Connection.
    
    - For **Connection** use the form```<GeoCatalog URI>/stac```. For example,
      ```bash
        https://arcgisprogeocatalog.<unique-identity>.<cloud-storage>.geocatalog.spatio.azure.com/stac
        ```

    - Reference the Authentication settings made in previous step.

    - Add **Custom Parameters**: Name: ```api-version```, Value: ```2025-04-30-preview```
    
    - Add the ACS connection file that was created in previous step to the **Cloud Storage Connections** list.

    - Select **OK**.

    :::image type="content" source="media/create-stac-connection.png" alt-text="Screenshot showing how to create a STAC connection." lightbox="media/create-stac-connection.png":::

1. Explore the STAC connection.

    > [!TIP] 
    > Learn more about the ArcGIS [Explore STAC Pane](https://pro.arcgis.com/en/pro-app/latest/help/data/imagery/explore-stac.htm).

    :::image type="content" source="media/explore-stac.png" alt-text="Screenshot showing the Explore STAC dialog box." lightbox="media/explore-stac.png":::

    - Search, fetch extensive STAC metadata, and view the browse images.
    
    - Add selected images to Map or Scene.
    
    :::image type="content" source="media/explore-stac-data.png" alt-text="Screenshot showing explore the STAC data window." lightbox="media/explore-stac-data.png":::
## Related content

- [Create cloud storage connection file](https://pro.arcgis.com/en/pro-app/latest/tool-reference/data-management/create-cloud-storage-connection-file.htm)
- [Create a new GeoCatalog](./deploy-geocatalog-resource.md)
- [Create a STAC collection](./create-stac-collection.md)