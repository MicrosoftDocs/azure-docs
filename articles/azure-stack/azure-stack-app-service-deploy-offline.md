---
title: 'Deploy App Service in an offline environment: Azure Stack | Microsoft Docs'
description: Detailed guidance on how to deploy App Service in a disconnected Azure Stack environment secured by AD FS.
services: azure-stack
documentationcenter: ''
author: apwestgarth
manager: stefsch
editor: 

ms.assetid: 
ms.service: azure-stack
ms.workload: app-service
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 7/3/2017
ms.author: anwestg

---
# Add an App Service resource provider to a disconnected Azure Stack environment secured by AD FS

By following the instructions in this article, you can install the [App Service resource provider](azure-stack-app-service-overview.md) to an Azure Stack environment that is:
- not connected to the internet
- secured by Active Directory Federation Services (AD FS). 

To add the App Service resource provider to your offline Azure Stack deployment, you must complete three top-level tasks:

1. Complete the [prerequisite steps](azure-stack-app-service-before-you-get-started.md) (like purchasing certificates, which can take a few days to receive).
2. Download and extract the installation and helper files to a machine connected to the internet.
3. Create an offline installation package and copy it to your offline environment.
4. Run the appservice.exe installer file.


## Download the required components

Before getting started on the offline Azure Stack environment, you must download the installation and helper files from the internet.

1. Download the [App Service on Azure Stack preview installer](http://aka.ms/appsvconmasrc1installer).

2. Download the [App Service on Azure Stack deployment helper scripts](http://aka.ms/appsvconmasrc1helper).

3. Extract the Create-AppServiceCerts.ps1 file from the helper script zip file. 

## Create an offline installation package

To deploy App Service in a disconnected environment, you must first create an offline installation package on a machine that's connected to the Internet. 

1. Run the AppService.exe installer on a machine that's connected to the Internet.

2. Click  **Advanced** > **Create offline installation package**.

    ![App Service on Azure Stack Create offline installation package][1]

3. The App Service installer creates an offline installation package and displays the path to it. You can click **Open folder** to open the folder in your file explorer.

   ![App Service on Azure Stack Offline installation package][2]

4. Copy the installer (AppService.exe) and the offline installation package to your Azure Stack host machine.

## Complete the offline installation of App Service on Azure Stack

1. On the disconnected Azure Stack host machine, run appservice.exe as azurestack\administrator.

2. Click **Advanced** > **Complete offline installation**.

    ![App Service on Azure Stack Complete offline installation][3]

3. Browse to the location of the offline installation package you previously created and then click **Next**.

    ![App Service on Azure Stack location of offline installation package][4]


4. Review and accept the third-party license terms and then click **Next**.

5. Make sure that the App Service cloud configuration information is correct. If you used the default settings during Azure Stack Development Kit deployment, you can accept the default values here. However, if you customized the options when you deployed Azure Stack, you must edit the values in this window to reflect that. For example, if you use the domain suffix mycloud.com, your endpoint must change to management.mycloud.com. After you confirm your information, click **Next**.

    ![App Service on Azure Stack App Service cloud configuration][2]

6. On the next page:
    1. Click the **Connect** button next to the **Azure Stack Subscriptions** box.
        - If you're using Azure Active Directory (Azure AD), enter your Azure AD admin account and password. Click **Sign In**. You *must* enter the Azure AD account that you provided when you deployed Azure Stack.
        - If you're using Active Directory Federation Services (AD FS), provide your admin account. For example, azurestackadmin@azurestack.local. Enter your password, and click **Sign In**.
    2. In the **Azure Stack Subscriptions** box, select your subscription.
    3. In the **Azure Stack Locations** box, select the location that corresponds to the region you're deploying to. For example, select **local** if your deploying to the Azure Stack Development Kit.
    4. Enter a **Resource Group Name** for your App Service deployment. By default, it's set to **APPSERVICE-LOCAL**.
    5. Enter the **Storage Account Name** that you want App Service to create as part of the installation. By default, it's set to **appsvclocalstor**.
    6. Click **Next**.

    ![App Service on Azure Stack subscription selection][3]

7. Enter the information for your file share and then click **Next**.

8. On the next page:
    1. In the **Identity Application ID** box, enter the GUID for the application you’re using for identity.
    2. In the **Identity Application certificate file** box, enter (or browse to) the location of the certificate file.
    3. In the **Identity Application certificate password** box, enter the password for the certificate. This password is the one that you made note of when you used the script to create the certificates.
    4. In the **Azure Resource Manager root certificate file** box, enter (or browse to) the location of the certificate file.
    5. Click **Next**.

9. For each of the three certificate file boxes, click **Browse** and navigate to the appropriate certificate file. You must also provide the password for each certificate. These certificates are the ones that you created in the [Create required certificates step](azure-stack-app-service-deploy.md#create-required-certificates). Click **Next** after entering all the information.

    | Box | Certificate file name example |
    | --- | --- |
    | **App Service default SSL certificate file** | \_.appservice.local.AzureStack.external.pfx |
    | **App Service API SSL certificate file** | api.appservice.local.AzureStack.external.pfx |
    | **App Service Publisher SSL certificate file** | ftp.appservice.local.AzureStack.external.pfx |

    If you used a different domain suffix when you created the certificates, your certificate file names don’t use *local.AzureStack.external*. Instead, use your custom domain information.

10. Enter the SQL Server details for the server instance used to host the App Service resource provider databases and then click **Next**. The installer validates the SQL connection properties.

11. Review the role instance and SKU options. The defaults are populated with the minimum recommended instance SKUs for each role. A summary of core and memory requirements is provided to help plan your deployment. After you make your selections, click **Next**.

    | Role | Recommended minimum instances | Recommended minimum SKU | Notes |
    | --- | --- | --- | --- |
    | Controller | 1 | Standard_A1 - (1 Core, 1792 MB) | Manages and maintains the health of the App Service cloud. |
    | Management | 1 | Standard_A2 - (2 Cores, 3584 MB) | Manages the App Service Azure Resource Manager and API endpoints, portal extensions (admin, tenant, Functions portal), and the data service. To support failover, increased the recommended instances to 2. |
    | Publisher | 1 | Standard_A1 - (1 Core, 1792 MB) | Publishes content via FTP and web deployment. |
    | FrontEnd | 1 | Standard_A1 - (1 Core, 1792 MB) | Routes requests to App Service applications. |
    | Shared Worker | 1 | Standard_A1 - (1 Core, 1792 MB) | Hosts web, mobile, or API applications and Azure Functions apps. TYou might want to add more instances. As an operator, you can define your offering and choose any SKU tier. The tiers must have a minimum of one core. |

    ![App Service on Azure Stack role configuration][6]

    > [!NOTE]
    > In the technical previews, the App Service resource provider installer also deploys a Standard A1 instance to operate as a simple file server to support Azure Resource Manager. This instance remains for a single-node development kit. For production workloads, at general availability the App Service installer enables the use of a high-availability file server.

12. Choose your deployment Windows Server 2016 virtual machine image from those available in the compute resource provider for the App Service cloud. Click **Next**.

    ![App Service on Azure Stack VM image selection][7]

13. On the next page:
     1. Enter the Worker Role virtual machine administrator user name and password.
     2. Enter the Other Roles virtual machine administrator user name and password.
     3. Click **Next**.

    ![App Service on Azure Stack credential entry][8]

14. On the summary page:
    1. Verify the selections you made. To make changes, use the **Previous** buttons to visit previous pages.
    2. If the configurations are correct, select the check box.
    3. To start the deployment, click **Next**.

    ![App Service on Azure Stack selection summary][9]

15. You can track the installation progress on the next page. After the install successfully finishes, click **Exit**.

    ![App Service on Azure Stack installation progress][10]




## Test drive App Service on Azure Stack

After you install App Service resource provider, test it to make sure that users can deploy web, mobile, and API apps.

> [!NOTE]
> You need to create an offer that has the Microsoft.Web namespace within the plan. Then you need to have a tenant subscription that subscribes to this offer. For more information, see  [Create offer](azure-stack-create-offer.md) and [Create plan](azure-stack-create-plan.md).
>

You *must* have a tenant subscription to create applications that use App Service on Azure Stack. The only capabilities that a service admin can complete within the admin portal are related to the resource provider administration of App Service. These capabilities include adding capacity, configuring deployment sources, and adding Worker tiers and SKUs.

To create web, mobile, and API apps you must use the tenant portal and have a tenant subscription.  

1. In the Azure Stack tenant portal, click **New** > **Web + Mobile** > **Web App**.

2. On the **Web App** blade, type a name in the **Web app** box.

3. Under **Resource Group**, click **New**. Then type a name in the **Resource Group** box.

4. Click **App Service plan/Location** > **Create New**.

5. On the **App Service plan** blade, type a name in the **App Service plan** box.

6. Click **Pricing tier** > **Free-Shared** or **Shared-Shared** > **Select** > **OK** > **Create**.

7. In under a minute, a tile for the new web app appears on the dashboard. Click the tile.

8. On the **Web App** blade, click **Browse** to view the default website for this app.

## Deploy a WordPress, DNN, or Django website (optional)

1. In the Azure Stack tenant portal, click **+**. Go to the Azure Marketplace, deploy a Django website, and wait for successful completion. The Django web platform uses a file system-based database. It doesn’t require any additional resource providers such as SQL or MySQL.

2. If you also deployed a MySQL resource provider, you can deploy a WordPress website from the Marketplace. When you're prompted for database parameters, enter the user name as *User1@Server1*, with the user name and server name of your choice.

3. If you also deployed a SQL Server resource provider, you can deploy a DNN website from the Marketplace. When you're prompted for database parameters, pick a database in the computer running SQL Server that's connected to your resource provider.

## Next steps

You can also try out other [platform as a service (PaaS) services](azure-stack-tools-paas-services.md).

- [SQL Server resource provider](azure-stack-sql-resource-provider-deploy.md)
- [MySQL resource provider](azure-stack-mysql-resource-provider-deploy.md)

<!--Image references-->
[1]: ./media/azure-stack-app-service-deploy-offline/app-service-offline-step1.png
[2]: ./media/azure-stack-app-service-deploy-offline/app-service-offline-step2.png
[3]: ./media/azure-stack-app-service-deploy-offline/app-service-offline-step3.png
[4]: ./media/azure-stack-app-service-deploy-offline/app-service-offline-step4.png
[5]: ./media/azure-stack-app-service-deploy-offline/app-service-exe-default-entries-step-cloud-configuration.png
[6]: ./media/azure-stack-app-service-deploy-offline/app-service-exe-default-entries-step-subscription-location-populated.png
[7]: ./media/azure-stack-app-service-deploy-offline/app-service-exe-default-entries-step-resource-group-SQL.png
[8]: ./media/azure-stack-app-service-deploy-offline/app-service-exe-default-entries-step-certificates.png
[9]: ./media/azure-stack-app-service-deploy-offline/app-service-exe-default-entries-step-role-configuration.png
[10]: ./media/azure-stack-app-service-deploy-offline/app-service-exe-default-entries-step-vm-image-selection.png
[11]: ./media/azure-stack-app-service-deploy-offline/app-service-exe-default-entries-step-role-credentials.png
[12]: ./media/azure-stack-app-service-deploy-offline/app-service-exe-selection-summary.png
[13]: ./media/azure-stack-app-service-deploy-offline/app-service-exe-installation-progress.png
[14]: ./media/azure-stack-app-service-deploy-offline/managed-servers.png


<!--Links-->
[Azure_Stack_App_Service_preview_installer]: http://go.microsoft.com/fwlink/?LinkID=717531
[App_Service_Deployment]: http://go.microsoft.com/fwlink/?LinkId=723982
[AppServiceHelperScripts]: http://go.microsoft.com/fwlink/?LinkId=733525
