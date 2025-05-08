---
title: Using ArcGIS Pro with Microsoft Planetary Computer Pro
description: Learn how to configure and authenticate ArcGIS Pro so that it can read STAC item data from Microsoft Planetary Computer Pro. 
author: aloverro
ms.author: adamloverro
ms.service: azure
ms.topic: how-to
ms.date: 05/02/2025

# customer intent: As a GeoCatalog user, I want to configure and authenticate ArcGIS pro to operate with Microsoft Planetary Computer Pro so that I can view imagery stored in my GeoCatalog within the ArcGIS Pro tool.
---

# Configure ArcGIS Pro to access a GeoCatalog

This guide demonstrates how to configure ArcGIS Pro to access geospatial datasets from the Microsoft Planetary Computer Pro GeoCatalog using OAuth 2.0 delegated authentication with Microsoft Entra ID. This requires registering two applications in Microsoft Entra ID (a Web API and a Desktop client), configuring delegated permissions with user_impersonation scope, and connecting ArcGIS Pro to Azure Blob Storage and SpatioTemporal Access Catalog (STAC) compliant datasets hosted in the Microsoft Planetary Computer Pro environment.

By the end of this guide, you'll be able to securely browse and access Microsoft Planetary Computer-hosted data directly in ArcGIS Pro using Microsoft Entra ID user impersonation.

## Prerequisites

- Access to a Microsoft Entra ID tenant
- Azure subscription with permissions to manage app registrations
- ArcGIS Pro installed on your machine

> [!TIP] 
> Before you begin, review [Register an application in Microsoft Entra ID](/entra/identity-platform/quickstart-register-app) for background information on app registration.

## Register Web API Application for ArcGIS Pro

1. Open the Azure Portal and go to **Microsoft Entra ID**.
    :::image type="content" source="./media/microsoft-entra-id.png" alt-text="Screenshot showing a user selecting Microsoft Entra ID from Azure portal.":::

1. Navigate to **App registrations** \> **New registration**.

    :::image type="content" source="./media/new-app-registration.png" alt-text="Screenshot showing new app registration.":::

1. Register the Web API app. Suggested names:
    - ArcGISPro-GeoCatalog-WebAPI or 
    - ArcGIS Pro

1. Set **Multitenant** as the account type.
    :::image type="content" source="./media/register-an-app-arcgis-pro.png" alt-text="Screenshot showing register an app ArcGIS Pro.":::

    Here's the overview page of the new app registration ArcGIS Pro:

    :::image type="content" source="./media/new-app-registration-arcgis-pro.png" alt-text="Screenshot showing new app  registration ArcGIS Pro.":::

1. After registration, complete the following configuration within the new app registration ArcGIS Pro:

   - Go to the **Authentication** tab:
   - Add platform: **Web**

   :::image type="content" source="./media/add-web-platform.png" alt-text="Screenshot showing the selection to add a web platform type of authentication.":::

1. Set **Redirect URI**: <https://localhost>
  
    :::image type="content" source="./media/add-redirect-uri.png" alt-text="Screenshot showing how to add a redirect URI.":::

1. Add platform: **Mobile and Desktop applications**

    :::image type="content" source="./media/add-mobile-desktop-app.png" alt-text="Screenshot showing add mobile desktop app.":::
    
1. Set **Custom Redirect URI**: arcgis-pro://auth

    :::image type="content" source="./media/configure-desktop-device.png" alt-text="Screenshot showing configure desktop device.":::

1. Enable **ID tokens** under **Implicit grant and hybrid flows**,

1. Select **Save**

    :::image type="content" source="./media/enable-id-tokens.png" alt-text="Screenshot showing enable ID tokens ArcGIS App authentication.":::

1. Go to **API Permissions**:

    - Add and grant admin consent for:
      - Azure Storage \> user_impersonation
      - Microsoft Graph \> User.Read (This permission is enabled by default)
    
    :::image type="content" source="./media/add-api-permissions.png" alt-text="Screenshot showing howto configure the addition of API permissions.":::

1. **Grant admin consent** after permissions are added.

    :::image type="content" source="./media/grant-admin-consent.png" alt-text="Screenshot showing how to grant admins consent.":::

1. Go to **Expose an API**:

    - Add **App ID URI**

    :::image type="content" source="./media/add-app-id-uri.png" alt-text="Screenshot showing how to add the app id URI .":::

1. Define scopes:

    - user_authentication (Display name: ArcGISPro-API-User-Auth)
    - user_impersonation (Display name: ArcGISPro-API-Impersonation)

    :::image type="content" source="./media/add-user-authentication-scope.png" alt-text="Screenshot showing add user authentication scope.":::
    
    :::image type="content" source="./media/add-user-impersonation-scope.png" alt-text="Screenshot showing add user impersonation scope.":::

1. Select **Add a client application** and note the App ID.

    :::image type="content" source="./media/add-a-client-app.png" alt-text="Screenshot showing how to add a client app.":::

## Register Desktop Client Application for ArcGIS Pro 

Register a second application (with a distinct name) to represent ArcGIS
Pro Desktop and configure its API permissions --- ensuring it includes
access to the web API exposed by the first application.

1. Create a second app registration for the ArcGIS Pro desktop client.

    - Suggested name: ArcGISPro-GeoCatalog-DesktopClient or
    GeoCatalog-ArcGIS
    
    - Set account type: **Single tenant**

    :::image type="content" source="./media/register-second-app-arcgis-prodesktopclient.png" alt-text="Screenshot showing register second app arcgisprodesktopclient.":::

    Here's the overview page of the new app registration GeoCatalog-ArcGIS:

    :::image type="content" source="./media/new-app-registration-geocatalog-arcgis.png" alt-text="Screenshot showing new app  registration GeoCatalog ArcGIS.":::

1. Configure the Desktop Client App

    Complete the following configuration within the new App registration
    GeoCatalog-ArcGIS:

    - **Authentication**? repeat the same steps as in Step 1:
    
      - Add platform: **Web**
      - Set **Redirect URI**: https://localhost
      - Add platform
      - Set **Redirect URI**: arcgis-pro://auth
      - Enable **ID tokens** under **Implicit grant and hybrid flows**
    
      - Select **Save**

    - **API Permissions**: Adding Access to the Web API App
    
      - In the **API permissions** tab, select **Add a permission**.
    
      - Go to the **APIs my organization uses** tab and search for the **Web
        API app** created in Step 1 (for example, ArcGIS Pro).
    
      - Select the app name to open the **Request API Permissions** screen.

   :::image type="content" source="./media/request-api-permissions.png" alt-text="Screenshot showing request API permissions.":::

    - Select both user_authentication and user_impersonation; the delegated permissions defined in the first app

    - Select **Add permissions**

    :::image type="content" source="./media/add-api-permissions-arcgis-pro.png" alt-text="Screenshot showing add API permissions ArcGIS Pro.":::

    - Continue to add the following delegated permissions:
    
      - **Azure Storage** \> user_impersonation
      - **Azure Orbital Spatio** \> user_impersonation
      - **Microsoft Graph** \> User.Read (This permission is enabled by default)
    - Select **Add permissions**
    - **Grant admin consent**
    
    :::image type="content" source="./media/app-selection-on-request-api-permissions-screen.png" alt-text="Screenshot showing app selection on request API permissions screen.":::
  
    :::image type="content" source="./media/grant-admin-consents--4-.png" alt-text="Screenshot showing grant admin consents (4).":::

## Configure ArcGIS Pro (Desktop) for Microsoft Planetary Computer Pro GeoCatalog Access

This section outlines how to configure authentication and data access in the **ArcGIS Pro desktop application**, using OAuth 2.0 integration with **Microsoft Entra ID** and access to the **Microsoft Planetary Computer Pro GeoCatalog**. It includes steps to add an authentication connection and create storage and STAC data connections.

## Add an Authentication Connection

1. Open the **ArcGIS Pro settings** page in one of the following ways:

    - From an open project, select the **Project** tab on the ribbon.
    - From the start page, select the **Settings** tab.

1. In the side menu, select **Options**.

1. In the **Options** dialog box, under **Application**, select
    **Authentication**.

1. Select **Add Connection** to add a new authentication connection.

1. In the **Add Connection** dialog box:

    - Enter a **Connection Name**

    - For **Type**, select **Microsoft Entra ID**

    - Enter your **Entra Domain** and **Client ID**

    - Add the following **scopes**:

      - <https://storage.azure.com/.default>

      - <https://geocatalog.spatio.azure.com/.default>

    :::image type="content" source="./media/add-connection.png" alt-text="Screenshot showing how to add a connection.":::

    - Select **OK**
    
    - Sign in through the Authentication dialog and complete the prompts.
    
    :::image type="content" source="./media/sign-in.png" alt-text="Screenshot showing how to sign in with the Authentication dialog.":::

> [!TIP] 
> For more information, see the official ArcGIS Pro documentation [Connect to authentication providers from ArcGIS Pro](https://pro.arcgis.com/en/pro-app/latest/get-started/connect-to-authentication-providers-from-arcgis-pro.htm)


## Prepare and record GeoCatalog information

1. Create an Microsoft Planetary Computer Pro GeoCatalog in your Azure subscription (for example,
     arcgisprogeocatalog), and locate it in the appropriate resource
    group.

    :::image type="content" source="./media/find-hidden-type-geocatalog.png" alt-text="Screenshot showing find hiddentype GeoCatalog.":::

1. Select on the GeoCatalog (for example,  arcgisprogeocatalog)

1. Record the **GeoCatalog URI** (e.g.,
    https://arcgisprogeocatalog.\<unique-identity\>.\<cloud-region\>.geocatalog.spatio.azure.com)

    :::image type="content" source="./media/get-geocatalog-uri.png" alt-text="Screenshot showing how to retrieve the GeoCatalog URI.":::

1. Open the link to your GeoCatalog URI in the browser and select on the
    **Collections** button

    :::image type="content" source="./media/media-processing-center-pro-collections.png" alt-text="Screenshot showing Microsoft Planetary Computer Pro web interface.":::

1. Record the **Collection Name** (for example, sentinel-2-l2a-turorial-1000)

1. Construct the **Token API Endpoint** using this pattern

      ```bash
    \<GeoCatalog URI\>/sas/token/\<Collection Name\api-version=2025-04-30-preview
      ```  
    Example:
    
    ```bash
    https://arcgisprogeocatalog.\<unique-identity\>.\<cloud-region\>.geocatalog.spatio.azure.com/sas/token/sentinel-2-l2a-turorial-1000?api-version=2025-04-30-preview
    ```

1. Select on the collection name

    :::image type="content" source="./media/click-on-collectionname.png" alt-text="Screenshot showing click on collectionname.":::

1. Select on **Edit collection** button

    :::image type="content" source="./media/edit-collection.png" alt-text="Screenshot showing how to edit a GeoCatalog collection.":::

1. In the resulting JSON display, locate the key
    "**title:assets:thumbnail:href**" and copy the corresponding value.
    for example:

```bash
> https://\<unique-storage\>.blob.core.windows.net/sentinel-2-l2a-tutorial-1000-\<unique-id\>/collection-assets/thumbnail/lulc.png
```

1. Record the value of Account Name and Container Name:

    - **Account Name**: for example \<unique-storage\>
    - **Container Name**: for example sentinel-2-l2a-tutorial-1000-\<unique-id\>

    :::image type="content" source="./media/collection-json-display.png" alt-text="Screenshot showing collection json display.":::

## Set up a connection to Azure Blob 

1. In ArcGIS Pro, open the **Create Cloud Storage Connection File**
    geoprocessing tool to create a new ACS connection file. This tool can be accessed in the main Ribbon on the Analysis Tab. Select the Tools Button, then search for the tool by typing its name.

1. Specify a Connection File Location for the ACS file

1. Provide a Connection File Name for example, geocatalog_connection.acs

1. For Service Provider select Azure

1. For Authentication select the name of the auth profile that you created in previous steps

1. For **Access Key ID (Account Name)** use the **Account Name** value that you recorded earlier: \<unique-storage\>

1. For **Bucket (Container) Name** use the **Container Name** value that you recorded earlier: sentinel-2-l2a-tutorial-1000-\<unique-id\>

1. Add the provider option **ARC_TOKEN_SERVICE_API** and set the value to your **Token API Endpoint** that you constructed earlier, for example:

    ```https://arcgisprogeocatalog.\<unique-identity\>.\<cloud-region\>.geocatalog.spatio.azure.com/api/token/sentinel-2-l2a-tutorial-1000?api=version=2025-04-30-preview```

1. Add the provider option **ARC_TOKEN_OPTION_NAME** and set the value
    to AZURE_STORAGE_SAS_TOKEN

    :::image type="content" source="./media/create-cloud-storage-connection-file-sample.png" alt-text="Screenshot showing create cloud storage connection file sample.":::

## Create a STAC Connection to Microsoft Planetary Computer Pro

1. Create a new STAC connection in ArcGIS Pro (desktop)

    > [!TIP] 
    > Refer to ArcGIS Pro documentation to [Create a STAC connection](https://pro.arcgis.com/en/pro-app/latest/help/data/imagery/create-a-stac-connection.htm)


    :::image type="content" source="./media/create-new-stac-connection.png" alt-text="Screenshot showing create new stac connection.":::

- Provide a name for the STAC Connection: For example, GeoCatalog_Connection

- For Connection use the form```\<GeoCatalog URI\>/api```, for example
  ```https://arcgisprogeocatalog.\<unique-identity\>.\<cloud-storage\>.geocatalog.spatio.azure.com/api```

- Reference the Authentication settings made in previous step

- Add the ACS connection file that was created in previous step to the
  STAC connection

- Select the OK button

    :::image type="content" source="./media/create-stac-connection.png" alt-text="Screenshot showing how to create a STAC connection.":::

1. Explore the STAC connection

    > [!TIP] 
    > Learn more about the ArcGIS [Explore STAC Pane](https://pro.arcgis.com/en/pro-app/latest/help/data/imagery/explore-stac.htm)

    :::image type="content" source="./media/explore-stac.png" alt-text="Screenshot showing the Explore STAC dialog box.":::

    - Search, fetch extensive STAC metadata, and view the browse images
    
    - Add selected images to Map or Scene
    
    :::image type="content" source="./media/explore-stac-data.png" alt-text="Screenshot showing explore the STAC data window.":::


## Related Content

- [Create Cloud Storage Connection File](https://pro.arcgis.com/en/pro-app/latest/tool-reference/data-management/create-cloud-storage-connection-file.htm)
- [Create a new GeoCatalog](./deploy-geocatalog-resource.md)
- [Create a STAC Collection](./create-stac-collection.md)