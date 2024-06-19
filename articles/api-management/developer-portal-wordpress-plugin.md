---
title: Host developer portal on Wordpress - Azure API Management
description: Configure a Wordpress plugin (preview) for the developer portal in your API Management instance. Use Wordpress customizations to enhance the developer portal.
services: api-management
author: dlepow

ms.service: api-management
ms.custom: 
ms.topic: how-to
ms.date: 06/18/2024
ms.author: danlep
---

# Host the API Management developer portal on Wordpress

[!INCLUDE [api-management-availability-premium-dev-standard-basic-standardv2-basicv2](../../includes/api-management-availability-premium-dev-standard-basic-standardv2-basicv2.md)]

Azure API management customers increasingly require advanced customizations for the developer portal – for example, localization, collapsible and expandable menus, custom stylesheet etc. These customizations can be enabled through a content management system (CMS). 

Hence, Azure API management is providing native plugins for building developer portals with popular CMS solutions (e.g., WordPress), which will provide integration with API Management. Through this, customers will be able to leverage the power of CMS for customizations. WordPress on Azure App Service offers managed hosting and is an established, supported, well-documented solution that’s easy to install and maintain.  

<!-- Is WP on App Service the only supported scenario? App Service on Linux? -->

## Prerequisites

* ? 

## Steps to enable APIM developer portal on Wordpress   

### Step 1: Create a new App service  

Navigate to portal.azure.com, select app service and create a new Wordpress on App Service. For details, see [Create a Wordpress site on Azure App Service](../app-service/quickstart-wordpress.md). 

 

### Step 2: Deploy Wordpress on a new app service  

In this step, please note down the admin user name and password for Wordpress setup. This is required to login into WP-ADMIN site and install plugin in later step 

Select the recommended default values for Email services, CDN and Blob storage as shown below. 

We have disabled CI/CD deployment and staging environment option. In addition, we did not add any tags. 

A screenshot of a application

Description automatically generated 

A screenshot of a computer application

Description automatically generated  

And finally click on review+create to run final validation and complete app service deployment. 

 

A screenshot of a computer

Description automatically generated 

### Step 3: Create a new AAD app registration  

In this step, we will create a new AAD app and use this to authenticate to App Service. 

1. Navigate to App registrations and click on New App registration 

A screenshot of a computer

Description automatically generated 

1. Provide the new app name and select “Accounts in this organizations directory” as account type as shown below. Click on Register. 

 

A screenshot of a computer

Description automatically generated 

1. Navigate to Authentication left navigation menu item for newly created AAD app and add platform configurations 

1. Select Web option under Web apps. 

A screenshot of a computer

Description automatically generated 

1. Provide the redirect URI as shown below. 

https://<nameofappservice>.azurewebsites.net/.auth/login/aad/callback 

A screenshot of a computer

Description automatically generated 

1. Click on Add a platform again and this time select Single page application. Provide redirect URI as https://<apimservicename>.developer.azure-api.net/signin and https://<apimservicename>.developer.azure-api.net/ as shown below 

A screenshot of a computer

Description automatically generated 

1. Select “ID Tokens” checkbox in the Implicit grant and hybrid flows section. Click on Save. 

A screenshot of a computer

Description automatically generated 

1. Add optional claims by select Token configuration in left navigation menu. Select the following: email. Family_name, given_name, onprem_sid, preferred_username, upn. Click on Add. 

A white background with black text

Description automatically generated 

 

1. When prompted to turn on Microsoft Graph – select Yes 

A screenshot of a computer error

Description automatically generated 

1. Navigate to API permissions menu to see the appropriate graph permissions are present as shown below 

A screenshot of a computer

Description automatically generated 

1. Generate a new client app secret and copy client secret when generated. This is required to add application to APIM service and App service for authentication. 

A screenshot of a computer

Description automatically generated 

1. Click on “Expose a API” in left navigation and add a scope as shown below 

A screenshot of a computer

Description automatically generated 

### Step 4: Add the newly created AAD app to the App Service 

A screenshot of a computer

Description automatically generated 

Provide the AAD app registration client id and secret. Select rest of values as shown here 

ShapeA screenshot of a computer

Description automatically generated 

A screenshot of a computer

Description automatically generated 

### Step 5: Enable authentication to the APIM service using the same AAD app. 

Navigate to APIM service for which you are setting up the APIM developer portal. Click on Identities and select Azure AD as identity provider. Update the client id and client secret as shown here. 

 

A screenshot of a computer

Description automatically generated 

### Step 6: Navigate to Wordpress admin site and upload the customized theme 

Open the website: http://<appservicename>.azurewebsites.net/wp-admin 

When you open it for first time, it will seek consent of specific permissions 

A screenshot of a computer screen

Description automatically generated 

1. Login to WP-Admin site using the user name and password you provided while creating the Wordpress site. 

1. Click on Appearance -> Themes and Add New Theme 

A screenshot of a computer

Description automatically generated 

1. In the next screen, click on Upload Theme 

A screenshot of a computer

Description automatically generated 

1. Upload a customized theme by choosing the file “twentytwentyfour.zip” and click on Install now. This should load the customized theme. 

A screenshot of a computer

Description automatically generated 

### Step 7: Navigate to Wordpress admin site and install the APIM dev portal plugin 

Click on Plugins -> Add new plugin -> Upload new plugin and upload the APIM dev portal plugin zip file 

1. Click on Install Now and Activate plugin. 

 

A screenshot of a computer error

Description automatically generated 

 

1. Navigate to plugin settings and provide APIM service name 

A screenshot of a computer

Description automatically generated 

### Step 8: Add a custom stylesheet 

Navigate to Appearance -> Themes and customize the stylesheet. Click on Customize and then navigate to Styles. Click on Edit Styles and add additional CSS as shown below (follow below screenshots to get to custom stylesheet page). The custom stylesheet has been provided to you as a separate CSS file.  

A screenshot of a web page

Description automatically generated 

A screenshot of a black screen

Description automatically generated 

A screenshot of a computer screen

Description automatically generated 

 

A screenshot of a computer

Description automatically generated 

1. Copy the contents from “Wordpress - Custom stylesheet.css” stylesheet in additional CSS. Sample screenshot below 

A screenshot of a phone

Description automatically generated 

### Step 9: Add the Wordpress site to the list of origins on the APIM service 

1. Navigate to the APIM service -> Click on Portal Settings -> Self hosted portal configuration tab and then add the Wordpress site as a origin as shown below. 

A screenshot of a computer

Description automatically generated 

 

### Step 10: Navigate to the Wordpress site and login as a developer to see your new APIM developer portal deployed on Wordpress and hosted on App Service 

1. Navigate to your wordpress site in a new browser window – https://<yourappservicename>.azurewebsites.net 

 

A screenshot of a computer

Description automatically generated 

 

You can now use the following features of the APIM developer portal: 

Login using AAD credentials 

See list of APIs 

Navigate to API details page and see list of operations 

Test the API using the right API keys 

See list of products 

Subscribe to a product and generate subscription keys 

Navigate to Profile tab with account and subscription details 

Logout 

 

       
## Related content

- [Customize the developer portal](api-management-howto-developer-portal-customize.md) 

