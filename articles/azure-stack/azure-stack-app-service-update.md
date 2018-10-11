
---
title: 'Update Azure App Service on Azure Stack | Microsoft Docs'
description: Detailed guidance for updating Azure App Service on Azure Stack
services: azure-stack
documentationcenter: ''
author: apwestgarth
manager: stefsch
editor: ''

ms.service: azure-stack
ms.workload: app-service
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/10/2018
ms.author: anwestg

---
# Update Azure App Service on Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

> [!IMPORTANT]  
> Apply the 1807 update to your Azure Stack integrated system or deploy the latest Azure Stack development kit before deploying Azure App Service 1.3.
>
>

By following the instructions in this article, you can upgrade the [App Service resource provider](azure-stack-app-service-overview.md) deployed in an Azure Stack environment that is connected to the Internet.

> [!IMPORTANT]  
> Prior to running the upgrade, make sure that you have already completed the [deployment of the Azure App Service on Azure Stack Resource Provider](azure-stack-app-service-deploy.md)


## Run the App Service resource provider installer

During this process, the upgrade will:

* Detect prior deployment of App Service
* Prepare all update packages and new versions of all OSS Libraries to be deployed
* Upload to Storage
* Upgrade all App Service roles (Controllers, Management, Front-End, Publisher, and Worker roles)
* Update App Service scale set definitions
* Update App Service Resource Provider Manifest

> [!IMPORTANT]
> The App Service installer must be run on a machine which can reach the Azure Stack Administrator Azure Resource Manager endpoint.
>
>

To upgrade your deployment of App Service on Azure Stack, follow these steps:

1. Download the [App Service Installer](https://aka.ms/appsvcupdate3installer)

2. Run appservice.exe as an administrator

    ![App Service Installer][1]

3. Click **Deploy App Service or upgrade to the latest version.**

4. Review and accept the Microsoft Software License Terms and then click **Next**.

5. Review and accept the third-party license terms and then click **Next**.

6. Make sure that the Azure Stack Azure Resource Manager endpoint and Active Directory Tenant information is correct. If you used the default settings during Azure Stack Development Kit deployment, you can accept the default values here. However, if you customized the options when you deployed Azure Stack, you must edit the values in this window to reflect that. For example, if you use the domain suffix *mycloud.com*, your Azure Stack Azure Resource Manager endpoint must change to *management.region.mycloud.com*. After you confirm your information, click **Next**.

    ![Azure Stack Cloud Information][2]

7. On the next page:

   1. Click the **Connect** button next to the **Azure Stack Subscriptions** box.
        * If you're using Azure Active Directory (Azure AD), enter the Azure AD admin account and password that you provided when you deployed Azure Stack. Click  **Sign In**.
        * If you're using Active Directory Federation Services (AD FS), provide your admin account. For example, *cloudadmin@azurestack.local*. Enter your password, and click **Sign In**.
   2. In the **Azure Stack Subscriptions** box, select the **Default Provider Subscription**.
   3. In the **Azure Stack Locations** box, select the location that corresponds to the region you're deploying to. For example, select **local** if your deploying to the Azure Stack Development Kit.
   4. If an existing App Service deployment is discovered, then the resource group and storage account will be populated and greyed out.
   5. Click **Next** to review the upgrade summary.

    ![App Service Installation Detected][3]

8. On the summary page:
   1. Verify the selections you made. To make changes, use the **Previous** buttons to visit previous pages.
   2. If the configurations are correct, select the check box.
   3. To start the upgrade, click **Next**.

       ![App Service Upgrade Summary][4]

9. Upgrade progress page:
    1. Track the upgrade progress. The duration of the upgrade of App Service on Azure Stack varies dependent on number of role instances deployed.
    2. After the upgrade successfully completes, click **Exit**.

        ![App Service Upgrade Progress][5]

<!--Image references-->
[1]: ./media/azure-stack-app-service-update/app-service-exe.png
[2]: ./media/azure-stack-app-service-update/app-service-azure-resource-manager-endpoints.png
[3]: ./media/azure-stack-app-service-update/app-service-installation-detected.png
[4]: ./media/azure-stack-app-service-update/app-service-upgrade-summary.png
[5]: ./media/azure-stack-app-service-update/app-service-upgrade-complete.png

## Next steps

You can also try out other [platform as a service (PaaS) services](azure-stack-tools-paas-services.md).

* [SQL Server resource provider](azure-stack-sql-resource-provider-deploy.md)
* [MySQL resource provider](azure-stack-mysql-resource-provider-deploy.md)
