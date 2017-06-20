---
title: Configure Deployment Sources for App Services on Azure Stack | Microsoft Docs
description: How a Service Administrator can configure deployment sources (Git, GitHub, BitBucket, DropBox and OneDrive) for App Service on Azure Stack
services: azure-stack
documentationcenter: ''
author: apwestgarth
manager: stefsch
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: app-service
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 4/6/2017
ms.author: anwestg

---

# Configure deployment sources

App Service on Azure Stack supports on-demand deployment from multiple Source Control Providers.  This feature enables application developers to be able to deploy direct from their source control repositories.  In order for tenants to be able to configure App Service to connect to their repositories, Administrators must first configure the integration between App Service on Azure Stack and the Source Control Provider.  The Source Control Providers supported, in addition to local Git, are:

* GitHub
* BitBucket
* OneDrive
* DropBox

## View Deployment Sources in App Service Administration

1. Log in to the Azure Stack Admin Portal (https://adminportal.local.azurestack.external) as the service administrator.
2. Browse to **Resource Providers** and select the **App Service Resource Provider Admin**.
    ![App Service Resource Provider Admin][1]
3. Click **Source control configuration**.  Here you see the list of all Deployment Sources configured.
    ![App Service Resource Provider Admin Source Control Configuration][2]

## Configure GitHub

> [!NOTE]
> You require a GitHub account to complete this task.  You may wish to use an account for your organization rather than a personal account.

1. Log in to GitHub, browse to https://www.github.com/settings/developers and click **Register a new application**
    ![GitHub - Register a new application][3]
2. Enter an **Application name** for example - App Service on Azure Stack
3. Enter the **Homepage URL**.  **The Homepage URL must be the Azure Stack Portal address** for example - https://portal.local.azurestack.external
4. Enter an **Application Description**
5. Enter the **Authorization callback URL**.  In a default Azure Stack deployment, the Url is in the form https://portal.local.azurestack.external/tokenauthorize, if you are running under a different domain substitute your domain for azurestack.local
    ![GitHub - Register a new application with values populated][4]
6. Click **Register application**.  You will now be presented with a page listing the **Client ID** and **Client Secret** for the application.
    ![GitHub - Completed application registration][5]
7.  In a new browser tab or window Log in to the Azure Stack Admin Portal (https://adminportal.local.azurestack.external) as the service administrator. 
8.  Browse to **Resource Providers** and select the **App Service Resource Provider Admin**. 
9. Click **Source control configuration**.
10. Copy and paste the **Client Id** and **Client Secret** into the corresponding input boxes for GitHub.
11. Click **Save**.
12. If you do not wish to configure any other Deployment Sources, proceed to [Schedule Repair of Management Roles](azure-stack-app-service-configure-deployment-sources.md#schedule-repair-of-management-roles).


## Configure BitBucket

> [!NOTE]
> You require a BitBucket account to complete this task.  You may wish to use an account for your organization rather than a personal account.

1. Log in to BitBucket and browse to **Integrations** under your account
    ![BitBucket Dashboard - Integrations][7]
2. Click **OAuth** under Access Management and **Add consumer**
    ![BitBucket Add OAuth Consumer][8]
3. Enter a **Name** for the consumer, for example App Service on Azure Stack
4. Enter a **Description** for the application
5. Enter the **Callback URL**.  In a default Azure Stack deployment, the Callback Url is in the form https://portal.local.azurestack.external/TokenAuthorize, if you are running under a different domain substitute your domain for azurestack.local.  The Url must follow the capitalization as listed here for BitBucket integration to succeed.
6. Enter the **URL** - this Url should be the Azure Stack Portal URL, for example https://portal.local.azurestack.external
7. Select the **Permissions** required
    **Repositories**: **Read**
    **Webhooks**: **Read and write**
8. Click **Save**.  You will now see this new application, along with the **Key** and **Secret** under **OAuth consumers**.
    ![BitBucket Application Listing][9]
9.  In a new browser tab or window Log in to the Azure Stack Admin Portal (https://adminportal.local.azurestack.external) as the service administrator. 
10.  Browse to **Resource Providers** and select the **App Service Resource Provider Admin**. 
11. Click **Source control configuration**.
12. Copy and paste the **Key** into the **Client Id** input box and **Secret** into the **Client Secret** input box for BitBucket.
13. Click **Save**.
14. If you do not wish to configure any other Deployment Sources, proceed to [Schedule Repair of Management Roles](azure-stack-app-service-configure-deployment-sources.md#schedule-repair-of-management-roles).

## Configure OneDrive

> [!NOTE]
> OneDrive for Business Accounts are not currently supported.  You need to have a Microsoft Account linked to a OneDrive account to complete this task.  You may wish to use an account for your organization rather than a personal account.

1. Browse to https://apps.dev.microsoft.com/?referrer=https%3A%2F%2Fdev.onedrive.com%2Fapp-registration.htm and Log in using your Microsoft Account.
2. Click **Add an app** under **My applications**
![OneDrive Applications][10]
3. Enter a **Name** for the New Application Registration, enter **App Service on Azure Stack**, and click **Create Application**
4. The next screen lists the properties of your new application. Record the **Application Id**
![OneDrive Application Properties][11]
5. Under **Application Secrets** click **Generate New Password** and record the **New password generated** - this is your application secret.
> [!NOTE]
> Make sure to make a note of the new password as it is not retrievable once you click OK at this stage.
6. Under **Platforms** click **Add Platform** and select **Web**
7. Enter the **Redirect URI**.  In a default Azure Stack deployment, the Redirect URI is in the form https://portal.local.azurestack.external/tokenauthorize, if you are running under a different domain substitute your domain for azurestack.local
![OneDrive Application - Add Web Platform][12]
8. Set the **Microsoft Graph Permissions** - **Delegated Permissions**
    - **Files.ReadWrite.AppFolder**
    - **User.Read**  
      ![OneDrive Application - Graph Permissions][13]
10. Click **Save**.
11.  In a new browser tab or window Log in to the Azure Stack Admin Portal (https://adminportal.local.azurestack.external) as the service administrator. 
12.  Browse to **Resource Providers** and select the **App Service Resource Provider Admin**. 
13. Click **Source control configuration**.
14. Copy and paste the **Application Id** into the **Client Id** input box and **Password** into the **Client Secret** input box for OneDrive.
15. Click **Save**.
16. If you do not wish to configure any other Deployment Sources, proceed to [Schedule Repair of Management Roles](azure-stack-app-service-configure-deployment-sources.md#schedule-repair-of-management-roles).

## Configure DropBox

> [!NOTE]
> You need to have a DropBox account to complete this task.  You may wish to use an account for your organization rather than a personal account.

1. Browse to https://www.dropbox.com/developers/apps and Log in using your DropBox Account
2. Click **Create app** 
![Dropbox applications][14]
3. Select **DropBox API**
4. Set the access level to **App Folder**
5. Enter a **Name** for your application.
![Dropbox application registration][15]
6. Click **Create App**.  You will now be presented with a page listing the settings for the App including **App key** and **App secret**.
7. Check the **App folder name** is set to **App Service on Azure Stack**
8. Set the **OAuth 2 Redirect URI** and click **Add**.  In a default Azure Stack deployment, the Redirect URI is in the form https://portal.local.azurestack.external/tokenauthorize, if you are running under a different domain substitute your domain for azurestack.local
![Dropbox application configuration][16]
9.  In a new browser tab or window Log in to the Azure Stack Admin Portal (https://adminportal.local.azurestack.external) as the service administrator. 
10.  Browse to **Resource Providers** and select the **App Service Resource Provider Admin**. 
11. Click **Source control configuration**.
12. Copy and paste the **Application Key** into the **Client Id** input box and **App secret** into the **Client Secret** input box for DropBox.
13. Click **Save**.
14. If you do not wish to configure any other Deployment Sources, proceed to [Schedule Repair of Management Roles](azure-stack-app-service-configure-deployment-sources.md#schedule-repair-of-management-roles).

## Schedule repair of management roles
In order for the settings updated in the configuration of the various deployment sources to be applied, the Management Roles need to be repaired.  This process ensures that the configuration values are applied correctly and the configured Deployment Sources are made available to tenants.

1. In a new browser tab or window Log in to the Azure Stack Admin Portal (https://adminportal.local.azurestack.external) as the service administrator.
2. Browse to **Resource Providers** and select the **App Service Resource Provider Admin**.
3. Click **Source control configuration**
4. Copy and paste the **Client Id** and **Client Secret** into the corresponding input boxes for GitHub.
5. Click **Save**
6. Click **Roles**
7. Click **Management Server**
8. Click **Repair All** and select **Yes**.  This operation schedules a repair on all Management Servers to complete the integration.  The repair operations are managed to minimize downtime.
    ![App Service Resource Provider Admin - Roles - Management Server Repair All][6]

<!--Image references-->
[1]: ./media/azure-stack-app-service-configure-deployment-sources/App-service-provider-admin.png
[2]: ./media/azure-stack-app-service-configure-deployment-sources/App-service-provider-admin-source-control-configuration.png
[3]: ./media/azure-stack-app-service-configure-deployment-sources/App-service-provider-admin-github-developer-applications.png
[4]: ./media/azure-stack-app-service-configure-deployment-sources/App-service-provider-admin-github-register-a-new-oauth-application-populated.png
[5]: ./media/azure-stack-app-service-configure-deployment-sources/App-service-provider-admin-github-register-a-new-oauth-application-complete.png
[6]: ./media/azure-stack-app-service-configure-deployment-sources/App-service-provider-admin-roles-management-server-repair-all.png
[7]: ./media/azure-stack-app-service-configure-deployment-sources/App-service-provider-admin-bitbucket-dashboard.png
[8]: ./media/azure-stack-app-service-configure-deployment-sources/App-service-provider-admin-bitbucket-access-management-add-oauth-consumer.png
[9]: ./media/azure-stack-app-service-configure-deployment-sources/App-service-provider-admin-bitbucket-access-management-add-oauth-consumer-complete.png
[10]: ./media/azure-stack-app-service-configure-deployment-sources/App-service-provider-admin-Onedrive-applications.png
[11]: ./media/azure-stack-app-service-configure-deployment-sources/App-service-provider-admin-Onedrive-application-registration.png
[12]: ./media/azure-stack-app-service-configure-deployment-sources/App-service-provider-admin-Onedrive-application-platform.png
[13]: ./media/azure-stack-app-service-configure-deployment-sources/App-service-provider-admin-Onedrive-application-graph-permissions.png
[14]: ./media/azure-stack-app-service-configure-deployment-sources/App-service-provider-admin-Dropbox-applications.png
[15]: ./media/azure-stack-app-service-configure-deployment-sources/App-service-provider-admin-Dropbox-application-registration.png
[16]: ./media/azure-stack-app-service-configure-deployment-sources/App-service-provider-admin-Dropbox-application-configuration.png
