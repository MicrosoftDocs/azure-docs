---
title: 'Deploy App Services: Azure Stack | Microsoft Docs'
description: Detailed guidance for deploying App Service in Azure Stack
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
ms.date: 8/31/2017
ms.author: anwestg

---
# Add an App Service resource provider to Azure Stack

As an Azure Stack cloud operator, you can give your users the ability to create web, mobile, and API applications. To do this, you must first add the [App Service resource provider](azure-stack-app-service-overview.md) to your Azure Stack deployment as described in this article. After you have installed the App Service resource provider, you can include it in your offers and plans. Users can then subscribe to get the service and start creating applications.

To add the App Service resource provider to your Azure Stack deployment, you must complete three top-level tasks:

1.	Download and extract the installation and helper files.
2.	Create the required certificates.
3.	Run the appservice.exe installer file.

## Download and extract the installation and helper files

1. Download the [App Service on Azure Stack preview installer](http://aka.ms/appsvconmasrc1installer).

2. Download the [App Service on Azure Stack deployment helper scripts](http://aka.ms/appsvconmasrc1helper).

3. Extract the files from the helper scripts zip file:

   - Create-AppServiceCerts.ps1
   - Create-IdentityApp.ps1
   - Modules
      - AzureStack.Identity.psm1
      - GraphAPI.psm1
   
## Create the required certificates

This first script works with the Azure Stack certificate authority to create these three certificates that are needed by App Service. 

| Certificate | Certificate file name example |
| --- | --- |
| Default SSL certificate | \_.appservice.local.AzureStack.external.pfx |
| API SSL certificate | api.appservice.local.AzureStack.external.pfx |
| Publisher SSL certificate | ftp.appservice.local.AzureStack.external.pfx |

If you use a different domain suffix, your certificate files doesn't use *local.AzureStack.external*. Instead, your custom domain information is used.

To create the certificates, follow these steps:

1. On the Azure Stack host, open a PowerShell session as azurestack\AzureStackAdmin.

2.	Run the **Create-AppServiceCerts.ps1** script from the folder where you extracted the helper scripts. The script creates three certificates that App Service needs.

3.	To secure the .pfx files, enter a password. Make a note of the password. It is needed for the App Service on Azure Stack installer process.

### Create-AppServiceCerts.ps1 parameters

| Parameter | Required/optional | Default value | Description |
| --- | --- | --- | --- |
| pfxPassword | Required | Null | Password used to protect the certificate private key |
| DomainName | Required | local.azurestack.external | Azure Stack region and domain suffix |
| CertificateAuthority | Required | AzS-CA01.azurestack.local | Certificate authority endpoint |

## Install the App Service resource provider

Installing the App Service resource provider into your Azure Stack environment can take up to an hour. During this process, the installer will:

* Create a blob container in the specified Azure Stack storage account.
* Create a DNS zone and entries for App Service.
* Register the App Service resource provider.
* Register the App Service gallery items.

To deploy App Service resource provider, follow these steps:

1. Run appservice.exe as an administrator (azurestack\AzureStackAdmin).

2. Click **Deploy App Service on your Azure Stack cloud**.

    ![App Service on Azure Stack installer][1]

3. Review and accept the Microsoft Software Prerelease License Terms and then click **Next**.

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

7. Enter the information for your file share and then click **Next**. need screen cap

8. On the next page: need screen cap
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
    
    need screen cap

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

## Validate the App Service on Azure Stack installation

1. In the Azure Stack admin portal, browse to the resource group created by the installer. By default, this group is **APPSERVICE-LOCAL**.

2. Locate **CN0-VM**. To connect to the VM, click **Connect** on the **Virtual Machine** blade.

3. On the desktop of this VM, double-click **Web Cloud Management Console**.

4. Go to **Managed Servers**.

5. When all the machines display **Ready** for one or more Workers, proceed to step 6.

6. Close the remote desktop machine, and return to the machine where you executed the App Service installer.

    > [!NOTE]
    > You don't need to wait for one or more Workers to display **Ready** to complete the installation of App Service on Azure Stack. However, you need a minimum of one Worker that's ready to deploy a web, mobile, or API app or Azure Functions.

    ![App Service on Azure Stack Managed Servers status][11]

## Configure an Azure AD service principal for virtual machine scale set integration on Worker tiers and SSO for the Azure Functions portal and advanced developer tools

>[!NOTE]
> These steps apply to Azure AD secured Azure Stack environments only.

Administrators need to configure SSO to:

* Enable the advanced developer tools within App Service (Kudu).
* Enable the use of the Azure Functions portal experience.

Follow these steps:

1. Open a PowerShell instance as azurestack\azurestackadmin.

2. Go to the location of the scripts downloaded and extracted in the [prerequisite step](#Download-Required-Components).

3. [Install](azure-stack-powershell-install.md) and [configure an Azure Stack PowerShell environment](azure-stack-powershell-configure-admin.md).

4. In the same PowerShell session, run the **CreateIdentityApp.ps1** script. When you're prompted for your Azure AD tenant ID, enter the Azure AD tenant ID you're using for your Azure Stack deployment, for example, myazurestack.onmicrosoft.com.

5. In the **Credential** window, enter your Azure AD service admin account and password. Click **OK**.

6. Enter the certificate file path and certificate password for the [certificate created earlier](# Create certificates to be used by App Service on Azure Stack). The certificate created for this step by default is sso.appservice.local.azurestack.external.pfx.

7. The script creates a new application in the tenant Azure AD and generates a new PowerShell script named **UpdateConfigOnController.ps1**.

    >[!NOTE]
    > Make note of the **Application ID** that's returned in the PowerShell output. You need this information to search for it in step 12.

8. Copy the identity app certificate file and the generated script to **CN0-VM** by using a remote desktop session.

9. Open a new browser window, and sign in to the Azure portal (portal.azure.com) as the **Azure Active Directory Service Admin**.

10. Open the Azure AD resource provider.

11. Click **App Registrations**.

12. Search for the **Application ID** returned as part of step 7. An App Service application is listed.

13. Click **Application** in the list, and open the **Keys** blade.

14. Add a new key with **Description - Functions Portal**, and set the **Expiration Date** to **Never Expires**.

15. Click **Save**, and then copy the key that was generated.

    >[!NOTE]
    > Be sure to note or copy the key when it's generated. After it's saved, it can't be viewed again, and you need to regenerate a new key.

    ![App Service on Azure Stack application keys][12]

16. Return to the **Application Registration** in Azure AD.

17. Click **Required Permissions** > **Grant Permissions** > **Yes**.

    ![App Service on Azure Stack SSO grant][13]

18. Return to **CN0-VM**, and open the **Web Cloud Management Console** once more.

19. Select the **Settings** node on the left pane, and look for the **ApplicationClientSecret** setting.

20. Right-click and select **Edit**. Paste the key generated in step 15, and click **OK**.

    ![App Service on Azure Stack application keys][14]

21. Open an administrator PowerShell window. Browse to the directory where the script file and certificate were copied in step 7.

22. Run the script file. This script file enters the properties in the App Service on Azure Stack configuration and initiates a repair operation on all FrontEnd and Management roles.

| Parameter | Required/optional | Default value | Description |
| --- | --- | --- | --- |
| DirectoryTenantName | Mandatory | Null | Azure AD tenant ID. Provide the GUID or string, for example, myazureaaddirectory.onmicrosoft.com |
| TenantAzure Resource ManagerEndpoint | Mandatory | management.local.azurestack.external | The tenant Azure Resource Manager endpoint |
| AzureStackCredential | Mandatory | Null | Azure AD administrator |
| CertificateFilePath | Mandatory | Null | Path to the identity application certificate file generated earlier |
| CertificatePassword | Mandatory | Null | Password used to protect the certificate private key |
| DomainName | Required | local.azurestack.external | Azure Stack region and domain suffix |
| AdfsMachineName | Optional | Ignored for Azure AD deployments, but required in AD FS deployment. AD FS machine name, for example, AzS-ADFS01.azurestack.local |

## Configure an AD FS service principal for virtual machine scale set integration on Worker tiers and SSO for the Azure Functions portal and advanced developer tools

>[!NOTE]
> These steps apply to AD FS secured Azure Stack environments only.

Administrators need to configure SSO to:

* Configure a service principal for virtual machine scale set integration on Worker tiers.
* Enable the advanced developer tools within App Service (Kudu).
* Enable the use of the Azure Functions portal experience. 

Follow these steps:

1. Open a PowerShell instance as azurestack\azurestackadmin.

2. Go to the location of the scripts downloaded and extracted in the [prerequisite step](#Download-Required-Components).

3. [Install](azure-stack-powershell-install.md) and [configure an Azure Stack PowerShell environment](azure-stack-powershell-configure-admin.md).

4. In the same PowerShell session, run the **CreateIdentityApp.ps1** script. When you're prompted for your Azure AD tenant ID, enter **ADFS**.

5. In the **Credential** window, enter your AD FS service admin account and password. Click **OK**.

6. Provide the certificate file path and certificate password for the [certificate created earlier](# Create certificates to be used by App Service on Azure Stack). The certificate created for this step by default is sso.appservice.local.azurestack.external.pfx.

7. The script creates a new application in the tenant Azure AD and generates a new PowerShell script named **UpdateConfigOnController.ps1**.

8. Copy the identity app certificate file and the generated script to the **CN0-VM** by using a remote desktop session.

9. Return to **CN0-VM**.

10. Open an administrator PowerShell window, and browse to the directory where the script file and certificate were copied in step 7.

11. Run the script file. This script file enters the properties in the App Service on Azure Stack configuration and initiates a repair operation on all FrontEnd and Management roles.

| Parameter | Required/optional | Default value | Description |
| --- | --- | --- | --- |
| DirectoryTenantName | Mandatory | Null | Use **ADFS** for the AD FS environment |
| TenantAzure Resource ManagerEndpoint | Mandatory | management.local.azurestack.external | The tenant Azure Resource Manager endpoint |
| AzureStackCredential | Mandatory | Null | The AD FS service admin account |
| CertificateFilePath | Mandatory | Null | Path to the identity application certificate file generated earlier |
| CertificatePassword | Mandatory | Null | Password used to protect the certificate private key |
| DomainName | Required | local.azurestack.external | Azure Stack region and domain suffix |
| AdfsMachineName | Optional | AD FS machine name, for example, AzS-ADFS01.azurestack.local |

## Test drive App Service on Azure Stack

After you deploy and register the App Service resource provider, test it to make sure that users can deploy web, mobile, and API apps.

> [!NOTE]
> You need to create an offer that has the Microsoft.Web namespace within the plan. Then you need to have a tenant subscription that subscribes to this offer. For more information, see [Create offer](azure-stack-create-offer.md) and [Create plan](azure-stack-create-plan.md).
>
You *must* have a tenant subscription to create applications that use App Service on Azure Stack. The only capabilities that a service admin can complete within the admin portal are related to the resource provider administration of App Service. These capabilities include adding capacity, configuring deployment sources, and adding Worker tiers and SKUs.
>
As of the third technical preview, to create web, mobile, API, and Azure Functions apps, you must use the tenant portal and have a tenant subscription. 

1. In the Azure Stack tenant portal, click **New** > **Web + Mobile** > **Web App**.

2. On the **Web App** blade, type a name in the **Web app** box.

3. Under **Resource Group**, click **New**. Type a name in the **Resource Group** box.

4. Click **App Service plan/Location** > **Create New**.

5. On the **App Service plan** blade, type a name in the **App Service plan** box.

6. Click **Pricing tier** > **Free-Shared** or **Shared-Shared** > **Select** > **OK** > **Create**.

7. In under a minute, a tile for the new web app appears on the dashboard. Click the tile.

8. On the **Web App** blade, click **Browse** to view the default website for this app.

## Deploy a WordPress, DNN, or Django website (optional)

1. In the Azure Stack tenant portal, click **+**, go to the Azure Marketplace, deploy a Django website, and wait for successful completion. The Django web platform uses a file system-based database. It doesn’t require any additional resource providers, such as SQL or MySQL.

2. If you also deployed a MySQL resource provider, you can deploy a WordPress website from the Marketplace. When you're prompted for database parameters, enter the user name as *User1@Server1*, with the user name and server name of your choice.

3. If you also deployed a SQL Server resource provider, you can deploy a DNN website from the Marketplace. When you're prompted for database parameters, choose a database in the computer running SQL Server that's connected to your resource provider.

## Next steps

You can also try out other [platform as a service (PaaS) services](azure-stack-tools-paas-services.md).

- [SQL Server resource provider](azure-stack-sql-resource-provider-deploy.md)
- [MySQL resource provider](azure-stack-mysql-resource-provider-deploy.md)

<!--Image references-->
[1]: ./media/azure-stack-app-service-deploy/app-service-exe-start.png
[2]: ./media/azure-stack-app-service-deploy/app-service-exe-default-entries-step-cloud-configuration.png
[3]: ./media/azure-stack-app-service-deploy/app-service-exe-default-entries-step-subscription-location-populated.png
[4]: ./media/azure-stack-app-service-deploy/app-service-exe-default-entries-step-resource-group-sql.png
[5]: ./media/azure-stack-app-service-deploy/app-service-exe-default-entries-step-certificates.png
[6]: ./media/azure-stack-app-service-deploy/app-service-exe-default-entries-step-role-configuration.png
[7]: ./media/azure-stack-app-service-deploy/app-service-exe-default-entries-step-vm-image-selection.png
[8]: ./media/azure-stack-app-service-deploy/app-service-exe-default-entries-step-role-credentials.png
[9]: ./media/azure-stack-app-service-deploy/app-service-exe-selection-summary.png
[10]: ./media/azure-stack-app-service-deploy/app-service-exe-installation-progress.png
[11]: ./media/azure-stack-app-service-deploy/managed-servers.png
[12]: ./media/azure-stack-app-service-deploy/app-service-sso-keys.png
[13]: ./media/azure-stack-app-service-deploy/app-service-sso-grant.png
[14]: ./media/azure-stack-app-service-deploy/app-service-application-secret.png

<!--Links-->
[Azure_Stack_App_Service_preview_installer]: http://go.microsoft.com/fwlink/?LinkID=717531
[App_Service_Deployment]: http://go.microsoft.com/fwlink/?LinkId=723982
[AppServiceHelperScripts]: http://go.microsoft.com/fwlink/?LinkId=733525
