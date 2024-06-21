---
title: Host developer portal on WordPress - Azure API Management
description: Configure a WordPress plugin (preview) for the developer portal in your API Management instance. Use WordPress customizations to enhance the developer portal.
services: api-management
author: dlepow
ms.service: api-management
ms.custom: 
ms.topic: how-to
ms.date: 06/18/2024
ms.author: danlep
---

# Host the API Management developer portal on WordPress

[!INCLUDE [api-management-availability-premium-dev-standard-basic-standardv2-basicv2](../../includes/api-management-availability-premium-dev-standard-basic-standardv2-basicv2.md)]

Azure API management customers increasingly require advanced customizations for the developer portal – for example, localization, collapsible and expandable menus, custom stylesheet etc. These customizations can be enabled through a content management system (CMS). 

Hence, Azure API management is providing native plugins for building developer portals with popular CMS solutions (e.g., WordPress), which will provide integration with API Management. Through this, customers will be able to leverage the power of CMS for customizations. WordPress on Azure App Service offers managed hosting and is an established, supported, well-documented solution that’s easy to install and maintain.  

## Prerequisites

* An API Management instance in which the developer portal is created and enabled. If needed, [create an instance](get-started-create-service-instance.md).
* Download the developer portal WordPress plugin from the [plugin repo](https://aka.ms/apim/wpplugin).


## Step 1: Create WordPress on App Service  

For details, see [Create a WordPress site on Azure App Service](../app-service/quickstart-wordpress.md).


1. In the Azure portal, navigate to [https://portal.azure.com/#create/WordPress.WordPress](https://portal.azure.com/#create/WordPress.WordPress) portal.azure.com, select app service and create a new WordPress on App Service.  

1. On the **Basics** tab, enter project details. 

    Note the admin username and password for WordPress setup. This is required to login into WP-ADMIN site and install the plugin in a later step.

1. On the **Add-ins** tab:

    1. Select the recommended default values for **Email with Azure Communication Services**, **Azure CDN**, and **Azure Blob Storage**.
    1. In **Virtual network**, select either the *New** value or an existing virtual network. 
1. On the **Deployment** tab, leave **Add staging slot** unselected.
1. Select **Review + create** to run final validation.
1. Select **Create** to complete app service deployment.

It can take several minutes for WordPress on the app service to deploy. You can begin the next steps while the deployment is in progress.

## Step 2: Create a new Microsoft Entra app registration  

In this step, create a new Microsoft Entra app and use this to authenticate to App Service. 

1. In the [Azure portal](https://portal.azure.com), navigate to **App registrations** > **+ New registration**.
1.  Provide the new app name, and in **Supported account types**, select **Accounts in this organizational directory only**. Select **Register**.
1. On the **Overview** page, copy the **Application (client) Id** and **Directory (tenant) Id**. You need these values in later steps to add the application to your API Management instance and app service for authentication.
    :::image type="content" source="media/developer-portal-wordpress-plugin/app-registration-overview.png" alt-text="Screenshot of Overview page of app registration in the portal.":::

1. In the left menu, select **Authentication** > **+ Add a platform**.
1. On the **Configure platforms** page, select **Web**.
1. On the **Configure Web** page, enter the following redirect URI, substituting the name of your app service, and select **Configure**:

    `https://nameofappservice>.azurewebsites.net/.auth/login/aad/callback`
    
1. Select **+ Add a platform** again. Select **Single-page application**.
1. On the **Configure single-page application** page, enter the following redirect URI, substituting the name of your API Management instance, and select **Configure**:
    
    `https://<apiminstancename>.developer.azure-api.net/signin`
    
1. On the **Authentication** page, under **Single-page application**, select **Add URI** and enter the following URI, substituting the name of your API Management instance:
    
    `https://<apiminstancename>.developer.azure-api.net/`

1. Under **Implicit grant and hybrid flows**, select **ID tokens** and select **Save**.
1. In the left menu, select **Token configuration** > **+ Add optional claim**>
1. On the **Add optional claim** page, select **ID** and select the following claims: **email, family_name, given_name, onprem_sid, preferred_username, upn**. Select **Add**. 
1. When prompted, select **Turn on the Microsoft Graph email, profile permission**. Select **Add**.
1. In the left menu, select **API permissions** and confirm that the following Microsoft Graph permissions are present: **email, profile, User.Read**.

    :::image type="content" source="media/developer-portal-wordpress-plugin/required-api-permissions.png" alt-text="Screenshot of API permissions in the portal.":::

1. In the left menu, select **Certificates & secrets** > **+ New client secret**. 
1. Configure settings for the secret and select **Add**. Be sure to copy and safely store the secret's **Value** immediately after it's generated. You need this value in later steps to add the application to you API Management instance and app service for authentication. 
1. In the left menu, select **Expose an API** > **+ Add a scope**. 

    1. Accept the default **Application ID URI** and select **Save and continue**.
    1. Enter a descriptive **Scope name**.
    1. Under **Who can consent?**, select **Admins and users**.
    1. Enter a descriptive **Admin consent display name** and **Admin consent description**. 
    1. Confirm that **State** is set to **Enabled**, and select **Add scope**. 

## Step 3: Enable authentication to the app service using app registration

1. In the [portal](https://portal.azure.com), navigate to the WordPress app service.
1. In the left menu, under **Settings**, select **Authentication** > **Add identity provider**.
1. On the **Basics** tab, in **Identity provider**, select **Microsoft**.
1. Under **App registration**, select **Provide the details of an existing app registration**. Enter the **Application (client) Id** and **Client secret** from the app registration you created in the previous step.
1. In **Allowed token audiences**, enter the **Application ID URI** from the app registration. Example: `api://<app-id>`.
1. Under **Additional checks**:
    1. In **Client application requirement**, select **Allow requests from specific client applications**.
    1. In **Tenant requirement**, select **Use default restrictions based on issuer**.
1. Accept the default values for the remaining settings and select **Add**.

The identity provider is added to the app service.

## Step 4: Enable authentication to the API Management developer portal using app registration 

Configure the same Microsoft Entra app registration as an identity provider for the API Management developer portal. For details, see [Authorize developer accounts by using Microsoft Entra ID in Azure API Management](api-management-howto-aad.md).

1. In the [portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **Developer portal**, select **Identities** > **+ Add**.
1. On the **Add identity provider** page, select **Azure Active Directory** (Microsoft Entra ID).
1. Enter the **Client Id**, **Client secret**, and **Signin tenant** from the app registration you created in a previous step.
1. In **Client library**, select **MSAL**.
1. Accept default values for the remaining settings and select **Add**.
1. [Republish the developer portal](developer-portal-overview.md#publish-the-portal) to apply the changes.

Test the authentication by signing into the developer portal at the following URL, substituting the name of your API Management instance: `https://<apiminstancename>.developer.azure-api.net/signin`. Select the **Azure Active Directory** (Microsoft Entra ID) button to sign in.

## Step 6: Navigate to WordPress admin site and upload the customized theme 

<!-- essential or just an example? THeme Twenty Twenty-Four was already active in my installation...-->

1. Open the WordPress admin website at the following URL, substituting the name of your app service:  `http://<appservicename>.azurewebsites.net/wp-admin` 

    When you open it for the first time, it will seek consent of specific permissions.

1. Sign into the WordPress admin site using the username and password you entered while creating WordPress on App Service. 
1. In the left menu, select **Appearance** > **Themes** and then **Add New Theme** 
1. In the next screen, select **Upload Theme**. 
1. Upload a customized theme by choosing the file `twentytwentyfour.zip` and select **Install Now**. This should load the customized theme. 

## Step 7: Install the developer portal plugin 

1. In the WordPress admin site, in the left menu, select **Plugins** > **Add New Plugin**.
1. Select **Upload Plugin**. Select **Choose File** to upload the API Management developer portal plugin zipfile that you downloaded previously. Select **Install Now**.
1. After successful installation, select **Activate Plugin**.
1. In the left menu, select **Azure API Management Developer Portal**.
1. On the **APIM Settings** page, enter the following settings and select **Save Changes**:
    * Name of your API Management instance
    * Enable **Create default pages** and **Create navigation menu**.

## Step 8: Add a custom stylesheet 

<!-- essential or just an example? -->

Navigate to Appearance -> Themes and customize the stylesheet. Click on Customize and then navigate to Styles. Click on Edit Styles and add additional CSS as shown below (follow below screenshots to get to custom stylesheet page). The custom stylesheet has been provided to you as a separate CSS file.  

A screenshot of a web page

Description automatically generated 

A screenshot of a black screen



1. Copy the contents from “WordPress - Custom stylesheet.css” stylesheet in additional CSS. Sample screenshot below 


## Step 9: Add the WordPress site to the list of origins on the API Management instance 

1. In the [portal](https://portal.azure.com), navigate to your API Management instance.
1. In the left menu, under **Developer portal**, select **Portal settings**.
1. On the **Self-hosted portal configuration** tab, enter the hostname of your WordPress on App Service site as a portal origin: `https://<yourappservicename>.azurewebsites.net`
1. [Republish the developer portal](developer-portal-overview.md#publish-the-portal) to apply the changes.


## Step 10: Sign into your new API Management developer portal deployed on WordPress 

Sign into the WordPress site as a developer to see your new API Management developer portal deployed on WordPress and hosted on App Service.

1. Navigate to your WordPress site in a new browser window: `https://<yourappservicename>.azurewebsites.net` 
1. When prompted, sign in using Microsoft Entra credentials for a developer account.

 


You can now use the following features of the API Management developer portal: 

* Sign into the portal

* See list of APIs 

* Navigate to API details page and see list of operations 

* Test the API using valid API keys 

* See list of products 

* Subscribe to a product and generate subscription keys 

* Navigate to Profile tab with account and subscription details 

* Sign out of the portal 


       
## Related content

- [Customize the developer portal](api-management-howto-developer-portal-customize.md) 