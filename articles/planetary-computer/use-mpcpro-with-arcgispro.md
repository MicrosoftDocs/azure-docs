---
title: Using ArcGIS Pro with Microsoft Planetary Computer Pro
description: Learn how to configure and authenticate ArcGIS Pro so that it can read STAC item data from Microsoft Planetary Computer (MPC) Pro. 
author: aloverro
ms.author: adamloverro
ms.service: azure
ms.topic: how-to
ms.date: 05/02/2025

# customer intent: As a GeoCatalog user, I want to configure and authenticate ArcGIS pro to operate with Microsoft Planetary Computer Pro so that I can view imagery stored in my GeoCatalog within the ArcGIS Pro tool.
---

# Configure ArcGIS Pro to access a GeoCatalog

This guide demonstrates how to configure ArcGIS Pro to access geospatial datasets from the Microsoft Planetary Computer (MPC) Pro GeoCatalog using OAuth 2.0 delegated authentication with Microsoft Entra ID. This requires registering two applications in Microsoft Entra ID (a Web API and a Desktop client), configuring delegated permissions with user_impersonation scope, and connecting ArcGIS Pro to Azure Blob Storage and SpatioTemporal Access Catalog (STAC) compliant datasets hosted in the MPC Pro environment.

By the end of this guide, you'll be able to securely browse and access MPC-hosted data directly in ArcGIS Pro using Microsoft Entra ID user impersonation.

## Prerequisites

- Access to a Microsoft Entra ID tenant
- Azure subscription with permissions to manage app registrations
- ArcGIS Pro installed on your machine

> [!TIP] 
> Before you begin, review [Register an application in Microsoft Entra ID](/entra/identity-platform/quickstart-register-app) for background information on app registration.

## Register Web API Application for ArcGIS Pro

1. Open the Azure Portal and go to **Microsoft Entra ID**.
  ![Screenshot showing microsoft entra id](./media/Screenshot_showing_microsoft_entra_id.png)

1. Navigate to **App registrations** \> **New registration**.\
  ![Screenshot showing new app resigration](./media/Screenshot_showing_new_app_resigration.png)

1. Register the Web API app. Suggested names:
   - ArcGISPro-GeoCatalog-WebAPI or 
   - ArcGIS Pro

1. Set **Multitenant** as the account type.
  ![Screenshot showing register an app arcgispro](./media/Screenshot_showing_register_an_app_arcgispro.png)
  Here's the overview page of the new app registration ArcGIS Pro:
  ![Screenshot showing new app registation arcgis pro](./media/Screenshot_showing_new_app_registation_arcgis_pro.png)

1. After registration, complete the following configuration within the new app registration ArcGIS Pro:

   - Go to the **Authentication** tab:
   - Add platform: **Web**


   ![Screenshot showing add web platform](./media/Screenshot_showing_add_web_platform.png)

- Set **Redirect URI**: <https://localhost>
  ![Screenshot showing add redirect uri](./media/Screenshot_showing_add_redirect_uri.png)

- Add platform: **Mobile and Desktop applications**

  ![Screenshot showing add mobile desktop app](./media/Screenshot_showing_add_mobile_desktop_app.png)

- Set **Custom Redirect URI**: arcgis-pro://auth

  ![Screenshot showing configure desktop device](./media/Screenshot_showing_configure_desktop_device.png)

- Enable **ID tokens** under **Implicit grant and hybrid flows**,

- Select **Save**

  ![Screenshot showing enable id tokens](./media/Screenshot_showing_enable_id_tokens.png)

- Go to **API Permissions**:

  - Add and grant admin consent for:
    - Azure Storage \> user_impersonation
    - Microsoft Graph \> User.Read (This permission is enabled by default)

![Screenshot showing add api permissions](./media/Screenshot_showing_add_api_permissions.png)

- **Grant admin consent** after permissions are added.

![Screenshot showing grant admin consent](./media/Screenshot_showing_grant_admin_consent.png)

- Go to **Expose an API**:

  - Add **App ID URI**

![Screenshot showing add app id uri](./media/Screenshot_showing_add_app_id_uri.png)

- Define scopes:

  - user_authentication (Display name: ArcGISPro-API-User-Auth)

  - user_impersonation (Display name: ArcGISPro-API-Impersonation)

![Screenshot showing add user authentication scope](./media/Screenshot_showing_add_user_authentication_scope.png)

![Screenshot showing add user impersonation scope](./media/Screenshot_showing_add_user_impersonation_scope.png)

- Select **Add a client application** and note the App ID.

![Screenshot showing add a client app](./media/Screenshot_showing_add_a_client_app.png)

## Register Desktop Client Application for ArcGIS Pro 

Register a second application (with a distinct name) to represent ArcGIS
Pro Desktop and configure its API permissions --- ensuring it includes
access to the web API exposed by the first application.

1. Create a second app registration for the ArcGIS Pro desktop client.

- Suggested name: ArcGISPro-GeoCatalog-DesktopClient or
  GeoCatalog-ArcGIS

- Set account type: **Single tenant**

![Screenshot showing register second app arcgisprodesktopclient](./media/Screenshot_showing_register_second_app_arcgisprodesktopclient.png)

Here's the overview page of the new app registration GeoCatalog-ArcGIS:

![Screenshot showing new app registation geocatalog arcgis](./media/Screenshot_showing_new_app_registation_geocatalog_arcgis.png)

2. Configure the Desktop Client App

> Complete the following configuration within the new App registration
> GeoCatalog-ArcGIS:

- **Authentication**? repeat the same steps as in Step 1:

  - Add platform: **Web**

  - Set **Redirect URI**: https://localhost

  - Add platform: **Mobile and Desktop applications**

  - Set **Redirect URI**: arcgis-pro://auth

  - Enable **ID tokens** under **Implicit grant and hybrid flows**

  - Select **Save**

- **API Permissions**: Adding Access to the Web API App

  - In the **API permissions** tab, select **Add a permission**.

  - Go to the **APIs my organization uses** tab and search for the **Web
    API app** created in Step 1 (for example, ArcGIS Pro).

  - Select the app name to open the **Request API Permissions** screen.
   ![Screenshot showing request api    permissions](./media/Screenshot_showing_request_api____permissions.png)

- Select both user_authentication and user_impersonation - the delegated
  permissions defined in the first app

- Select **Add permissions**

![Screenshot showing add api permissions arcgispro](./media/Screenshot_showing_add_api_permissions_arcgispro.png)

- Continue to add the following delegated permissions:

  - **Azure Storage** \> user_impersonation

  - **Azure Orbital Spatio** \> user_impersonation

  - **Microsoft Graph** \> User.Read (This permission is enabled by default)

- Select **Add permissions**

- **Grant admin consent**

![Screenshot showing app selection on request api permissions screen](./media/Screenshot_showing_app_selection_on_request_api_permissions_screen.png)

![Screenshot showing grant admin consents (4)](./media/Screenshot_showing_grant_admin_consents__4_.png)

## Configure ArcGIS Pro (Desktop) for MPC Pro GeoCatalog Access

This section outlines how to configure authentication and data access in
the **ArcGIS Pro desktop application**, using OAuth 2.0 integration with
**Microsoft Entra ID** and access to the **MPC Pro GeoCatalog**. It
includes steps to add an authentication connection and create storage
and STAC data connections.

## Add an Authentication Connection

1. Open the **ArcGIS Pro settings** page in one of the following ways:

    - From an open project, select the **Project** tab on the ribbon.

    - From the start page, select the **Settings** tab.

2. In the side menu, select **Options**.

3. In the **Options** dialog box, under **Application**, select
    **Authentication**.

4. Select **Add Connection** to add a new authentication connection.

5. In the **Add Connection** dialog box:

    - Enter a **Connection Name**

    - For **Type**, select **Microsoft Entra ID**

    - Enter your **Entra Domain** and **Client ID**

    - Add the following **scopes**:

      - <https://storage.azure.com/.default>

      - <https://geocatalog.spatio.azure.com/.default>

![Screenshot showing add connection](./media/Screenshot_showing_add_connection.png)

- Select **OK**

- Sign in through the Authentication dialog and complete the prompts.

![Screenshot showing sing in](./media/Screenshot_showing_sing_in.png)

> [!TIP] 
> For more information, see the official ArcGIS Pro documentation [Connect to authentication providers from ArcGIS Pro](https://pro.arcgis.com/en/pro-app/latest/get-started/connect-to-authentication-providers-from-arcgis-pro.htm)


## Prepare and record GeoCatalog information

1. Create an MPC Pro GeoCatalog in your Azure subscription (for example,
    ArcGISProGeoCatalog), and locate it in the appropriate resource
    group.

![Screenshot showing find hiddentype geocatalog](./media/Screenshot_showing_find_hiddentype_geocatalog.png)

2. Select on the GeoCatalog (for example, ArcGISProGeoCatalog)

3. Record the **GeoCatalog URI** (e.g.,
    https://arcgisprogeocatalog.\<unique-identity\>.\<cloud-region\>.geocatalog.spatio.azure.com)

![Screenshot showing get geocatalog uri](./media/Screenshot_showing_get_geocatalog_uri.png)

4. Open the link to your GeoCatalog URI in the browser and select on the
    **Collections** button

![Screenshot showing mpc pro collections](./media/Screenshot_showing_mpc_pro_collections.png)

  1. Record the **Collection Name** (for example,
      sentinel-2-l2a-turorial-1000)

  2. Construct the **Token API Endpoint** using this pattern

> \<GeoCatalog URI\>/sas/token/\<Collection
> Name\>?api-version=2025-04-30-preview
>
> Example:
>
> https://arcgisprogeocatalog.\<unique-identity\>.\<cloud-region\>.geocatalog.spatio.azure.com/sas/token/sentinel-2-l2a-turorial-1000?api-version=2025-04-30-preview

3. Select on the collection name

![Screenshot showing click on collectionname](./media/Screenshot_showing_click_on_collectionname.png)

4. Select on **Edit collection** button

![Screenshot showing edit collection](./media/Screenshot_showing_edit_collection.png)

5. In the resulting JSON display, locate the key
    "**title:assets:thumbnail:href**" and copy the corresponding value.
    for example:

> https://\<unique-storage\>.blob.core.windows.net/sentinel-2-l2a-tutorial-1000-\<unique-id\>/collection-assets/thumbnail/lulc.png

6. Record the value of Account Name and Container Name:

    - **Account Name**: for example \<unique-storage\>

    - **Container Name**: for example
      sentinel-2-l2a-tutorial-1000-\<unique-id\>

![Screenshot showing collection jason display](./media/Screenshot_showing_collection_jason_display.png)

## Set up a connection to Azure Blob 

1. In ArcGIS Pro, open the **Create Cloud Storage Connection File**
    geoprocessing tool to create a new ACS connection file. This tool can be
    accessed in the main Ribbon on the Analysis Tab. Select the Tools
    Button, then search for the tool by typing its name.

2. Specify a Connection File Location for the ACS file

3. Provide a Connection File Name for example, geocatalog_connection.acs

4. For Service Provider select Azure

5. For Authentication select the name of the auth profile that you
    created in previous steps

6. For **Access Key ID (Account Name)** use the **Account Name** value
    that you recorded earlier: \<unique-storage\>

7. For **Bucket (Container) Name** use the **Container Name** value
    that you recorded earlier:
    sentinel-2-l2a-tutorial-1000-\<unique-id\>

8. Add the provider option **ARC_TOKEN_SERVICE_API** and set the value
    to your **Token API Endpoint** that you constructed earlier, for example:

```https://arcgisprogeocatalog.\<unique-identity\>.\<cloud-region\>.geocatalog.spatio.azure.com/api/token/sentinel-2-l2a-turorial-1000?api=version=2025-04-30-preview```

9. Add the provider option **ARC_TOKEN_OPTION_NAME** and set the value
    to AZURE_STORAGE_SAS_TOKEN

![Screenshot showing create cloud storage connection file sample](./media/Screenshot_showing_create_cloud_storage_connection_file_sample.png)

## Create a STAC Connection to Microsoft Planetary Computer Pro

1. Create a new STAC connection in ArcGIS Pro (desktop)

> [!TIP] 
> Refer to ArcGIS Pro documentation to [Create a STAC connection](https://pro.arcgis.com/en/pro-app/latest/help/data/imagery/create-a-stac-connection.htm)

![Screenshot showing create new stac connection](./media/Screenshot_showing_create_new_stac_connection.png)

- Provide a name for the STAC Connection: For example, GeoCatalog_Connection

- For Connection use the form```\<GeoCatalog URI\>/api```, for example
  ```https://arcgisprogeocatalog.\<unique-identity\>.\<cloud-storage\>.geocatalog.spatio.azure.com/api```

- Reference the Authentication settings made in previous step

- Add the ACS connection file that was created in previous step to the
  STAC connection

- Select the OK button

![Screenshot showing create stacconnection](./media/Screenshot_showing_create_stacconnection.png)

2. Explore the STAC connection

  > [!TIP] 
  > Learn more about the ArcGIS [Explore STAC Pane](https://pro.arcgis.com/en/pro-app/latest/help/data/imagery/explore-stac.htm)

![Screenshot showing explore stac](./media/Screenshot_showing_explore_stac.png)

- Search, fetch extensive STAC metadata, and view the browse images

- Add selected images to Map or Scene

![Screenshot showing explore stacdata](./media/Screenshot_showing_explore_stacdata.png)


## Related Content

- [Create Cloud Storage Connection File](https://pro.arcgis.com/en/pro-app/latest/tool-reference/data-management/create-cloud-storage-connection-file.htm)
- [Create a new GeoCatalog](./deploy-geocatalog-resource.md)
- [Create a STAC Collection](./create-stac-collection.md)