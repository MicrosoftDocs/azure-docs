---
title: 'Update Azure App Service Offline | Microsoft Docs'
description: Detailed guidance for updating Azure App Service on Azure Stack offline
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
ms.date: 08/15/2018
ms.author: anwestg

---
# Offline update of Azure App Service on Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

> [!IMPORTANT]
> Apply the 1807 update to your Azure Stack integrated system or deploy the latest Azure Stack development kit before deploying Azure App Service 1.3.
>
>

By following the instructions in this article, you can upgrade the [App Service resource provider](azure-stack-app-service-overview.md) deployed in an Azure Stack environment that is:

* not connected to the Internet
* secured by Active Directory Federation Services (AD FS).

> [!IMPORTANT]
> Prior to running the upgrade, make sure that you have already completed the [deployment of the Azure App Service on Azure Stack Resource Provider](azure-stack-app-service-deploy-offline.md)
>
>

## Run the App Service resource provider installer

To upgrade the App Service resource provider in an Azure Stack environment, you must complete these tasks:

1. Download the [App Service Installer](https://aka.ms/appsvcupdate3installer)
2. Create an offline upgrade package.
3. Run the App Service installer (appservice.exe) and complete the upgrade.

During this process, the upgrade will:

* Detect prior deployment of App Service
* Upload to Storage
* Upgrade all App Service roles (Controllers, Management, Front-End, Publisher, and Worker roles)
* Update App Service scale set definitions
* Update App Service Resource Provider Manifest

## Create an offline upgrade package

To upgrade App Service in a disconnected environment, you must first create an offline upgrade package on a machine that's connected to the Internet.

1. Run appservice.exe as an administrator

    ![App Service Installer][1]

2. Click **Advanced** > **Create offline package**

    ![App Service Installer Advanced][2]

3. The App Service installer creates an offline upgrade package and displays the path to it.  You can click **Open folder** to open the folder in your file explorer.

4. Copy the installer (AppService.exe) and the offline upgrade package to your Azure Stack host machine.

## Complete the upgrade of App Service on Azure Stack

> [!IMPORTANT]
> The App Service installer must be run on a machine which can reach the Azure Stack Administrator Azure Resource Manager Endpoint.
>
>

1. Run appservice.exe as an administrator.

    ![App Service Installer][1]

2. Click **Advanced** > **Complete offline installation or upgrade**.

    ![App Service Installer Advanced][2]

3. Browse to the location of the offline upgrade package you previously created and then click **Next**.

4. Review and accept the Microsoft Software License Terms and then click **Next**.

5. Review and accept the third-party license terms and then click **Next**.

6. Make sure that the Azure Stack Azure Resource Manager endpoint and Active Directory Tenant information is correct. If you used the default settings during Azure Stack Development Kit deployment, you can accept the default values here. However, if you customized the options when you deployed Azure Stack, you must edit the values in this window to reflect that. For example, if you use the domain suffix *mycloud.com*, your Azure Stack Azure Resource Manager endpoint must change to *management.region.mycloud.com*. After you confirm your information, click **Next**.

    ![Azure Stack Cloud Information][3]

7. On the next page:

   1. Click the **Connect** button next to the **Azure Stack Subscriptions** box.
        * If you're using Azure Active Directory (Azure AD), enter the Azure AD admin account and password that you provided when you deployed Azure Stack. Click  **Sign In**.
        * If you're using Active Directory Federation Services (AD FS), provide your admin account. For example, *cloudadmin@azurestack.local*. Enter your password, and click **Sign In**.
   2. In the **Azure Stack Subscriptions** box, select the **Default Provider Subscription**.
   3. In the **Azure Stack Locations** box, select the location that corresponds to the region you're deploying to. For example, select **local** if your deploying to the Azure Stack Development Kit.
   4. If an existing App Service deployment is discovered, then the resource group and storage account will be populated and greyed out.
   5. Click **Next** to review the upgrade summary.

    ![App Service Installation Detected][4]

8. On the summary page:
   1. Verify the selections you made. To make changes, use the **Previous** buttons to visit previous pages.
   2. If the configurations are correct, select the check box.
   3. To start the upgrade, click **Next**.

       ![App Service Upgrade Summary][5]

9. Upgrade progress page:
    1. Track the upgrade progress. The duration of the upgrade of App Service on Azure Stack varies dependent on number of role instances deployed.
    2. After the upgrade successfully completes, click **Exit**.

        ![App Service Upgrade Progress][6]

<!--Image references-->
[1]: ./media/azure-stack-app-service-update-offline/app-service-exe.png
[2]: ./media/azure-stack-app-service-update-offline/app-service-exe-advanced.png
[3]: ./media/azure-stack-app-service-update-offline/app-service-azure-resource-manager-endpoints.png
[4]: ./media/azure-stack-app-service-update-offline/app-service-installation-detected.png
[5]: ./media/azure-stack-app-service-update-offline/app-service-upgrade-summary.png
[6]: ./media/azure-stack-app-service-update-offline/app-service-upgrade-complete.png

## Next steps

You can also try out other [platform as a service (PaaS) services](azure-stack-tools-paas-services.md).

* [SQL Server resource provider](azure-stack-sql-resource-provider-deploy.md)
* [MySQL resource provider](azure-stack-mysql-resource-provider-deploy.md)
