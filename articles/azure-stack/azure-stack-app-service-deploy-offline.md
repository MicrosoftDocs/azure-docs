---
title: Deploy App Service in an Offline Environment - Azure Stack  | Microsoft Docs
description: Detailed guidance on how to deploy App Service in a disconnected Azure Stack environment secured by ADFS.
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
# Add an App Service resource provider to a disconnected Azure Stack environment secured by ADFS

If you are running Azure Stack in an isolated environment secured by ADFS and you want to give your tenants the ability to create Web, Mobile, and API applications and Azure Functions with their Azure Stack subscription, you must add an [App Service Resource Provider](azure-stack-app-service-overview.md) to your Azure Stack deployment. To do so, follow these steps:

1. Download required components.
2. Use the installer to create an offline installation package.
3. Create certificates to be used by App Service on Azure Stack.
4. Use the installer to complete the offline installation of App Service.
5. ADFS Based Deployments - Configure Service Principal for Virtual Machine Scale Set Integration on Worker Tiers and Single Sign On for Kudu and the Azure Functions Portal and Advanced Developer Tools
6. Validate App Service Installation.
7. Test Drive the App Service Resource Provider.

## Download the required components

1. Download the [App Service on Azure Stack preview installer](http://aka.ms/appsvconmasrc1installer).
2. Download the [App Service on Azure Stack deployment helper scripts](http://aka.ms/appsvconmasrc1helper).
3. Extract the files from the helper scripts zip file.  Once extracted you see the following files and folder structure
   - Create-AppServiceCerts.ps1
   - Create-IdentityApp.ps1
   - Modules
      - AzureStack.Identity.psm1
      - GraphAPI.psm1

## Create an Offline Installation Package

To deploy App Service in an isolated environment, you need must create an offline installation package from a machine with connectivity to the internet.

1. Run the **App Service on Azure Stack preview installer** (AppService.exe) from a machine with connectivity to the internet.
2. Click the **Advanced** tab and click **Create offline installation package**.
![App Service on Azure Stack Advanced Options Create Offline Installation Package][1]
3. The App Service installer will create an offline installation package and then display the path and give an option to open the folder.
![App Service on Azure Stack Offline Installation Package][2]
4. Now copy the **App Service on Azure Stack preview installer** (AppService.exe) and the Offline Installation Package to the Azure Stack Host machine.

## Create certificates to be used by App Service on Azure Stack

This first script works with the Azure Stack certificate authority to create three certificates that are needed by App Service. Run the script on the ClientVM ensuring you are running PowerShell as azurestack\administrator:

1. In a PowerShell session running as **azurestack\administrator**, execute the **Create-AppServiceCerts.ps1** script from the location you extracted the Helper Scripts into.  The script creates three certificates, in the same folder as the create certificates script, that is needed by App Service.
2. Enter a password to secure the pfx files and make a note of it as you need to enter it in the App Service on Azure Stack Installer.

### Create-AppServiceCerts.ps1 Parameters

| Parameter | Required/Optional | Default Value | Description |
| --- | --- | --- | --- |
| pfxPassword | Required | null | Password used to protect the certificate private key |
| DomainName | Required | local.azurestack.external | Azure Stack Region and Domain Suffix |
| CertificateAuthority | Required | AzS-CA01.azurestack.local | Certificate Authority Endpoint |

## Complete the offline installation of App Service on Azure Stack

> [!NOTE]
> You MUST use an elevated account (local or domain administrator) to execute the installer. If you sign in as azurestack\azurestackuser, you are prompted for elevated credentials.

1. Run appservice.exe as **azurestack\administrator**.
2. Click the **Advanced** tab and click **Complete offline installation**.
![App Service on Azure Stack Advanced Options Complete Offline Installation][3]
3. **Specify the location of the offline installation package** you previously created and then click **Next**
![App Service on Azure Stack Location of Offline Installation Package][4]
4. Review and accept the Microsoft Software Pre-Release License Terms, and then click **Next**.
5. Review and accept the third-party license terms, and then click **Next**.
6. Review the App Cloud Service configuration information and click **Next**.
![App Service on Azure Stack Cloud Configuration][5]
> [!NOTE]
> The App Service on Azure Stack Installer provides the default values for a One Node Azure Stack Installation.  If you have customized any of the options when you deployed Azure Stack, for example domain suffix, you need to edit the values in this window accordingly.  For example, if you are using the domain suffix mycloud.com your Admin ARM endpoint would need to change to adminmanagement.[region].mycloud.com

7. Click **Connect** (Next to the Azure Stack Subscriptions box).  Provide your **Admin Account (for example azurestackadmin@azurestack.local)** and **password** and then Click **Sign In**
8. Click the **Down Arrow** on the right side of the box next to **Azure Stack Subscriptions** and then select your subscription.
9. Click the **Down Arrow** on the right side of the box next to **Azure Stack Locations**.
   - Select the location corresponding to the region you are deploying, for example, **Local**
   - Click **Next**    
![App Service on Azure Stack Subscription Selection][6]
10. Enter the **Resource Group Name** for your App Service deployment, by default this is set to **APPSERVICE-LOCAL**.
11. Enter the **Storage Account Name** you would like App Service to create as part of the installation.  By default this is set to **appsvclocalstor**.
12. Enter the **SQL Server details** for the instance that will be used to host the App Service RP Databases.  Click **Next** and the installer will validate the SQL connection properties and move to the next step.
Storage, and
13. Click **Browse** next to the **App Service Default SSL Certificate File** and navigate to the **_.appservice.local.AzureStack.external** certificate [created earlier](#Create-Certificates-To-Be-Used-By-Azure-Stack-Web-Apps).  If you specified a different location and domain suffix when creating certificates, then select the corresponding certificate.
14. Enter the **certificate password** that you set when you created the certificates.
15. Click **Browse** next to the **Resource Provider SSL Certificate File** and navigate to the **api.appservice.local.AzureStack.external** certificate [created earlier](#Create-Certificates-To-Be-Used-By-Azure-Stack-Web-Apps).  If you specified a different location and domain suffix when creating certificates then select the corresponding certificate.
16. Enter the **certificate password** that you set when you created the certificates.  
17. Click **Browse** next to the **Resource Provider Root Certificate File** and navigate to the **AzureStackCertificationAuthority** certificate [created earlier](#Create-Certificates-To-Be-Used-By-Azure-Stack-Web-Apps).
18. Click **Next** the installer verifies the certificate password provided.
![App Service on Azure Stack Certificate Details][8]
19. Review the **App Service Role Configuration**.  The defaults are populated with the minimum recommended instance SKUs for each role.  A summary of core and memory requirements is provided to help plan your deployment.  Once you have made your selections click **Next** to advance.
  - **Controller**: By default 1 Standard A1 instance is selected.  This is the minimum we recommend.  The Controller role is responsible for managing and maintaining the health of the App Service cloud.
  - **Management**: By default 1 Standard A2 instance is selected.  To provide failover we recommend two instances.  The Management role is responsible for the App Service ARM and API endpoints, Portal Extensions (Admin, Tenant, Functions Portal), and the Data Service
  - **Publisher**: By default 1 Standard A1 instance is selected.  This is the minimum we recommend.  The Publisher role is responsible for publishing content via FTP and Web Deploy.
  - **FrontEnd**: By default 1 Standard A1 instance is selected.  This is the minimum we recommend.  The Frontend role is responsible for routing requests to App Service Applications
  - **Shared Worker**: By default 1 Standard A1 instance is selected but you may wish to add more.  You as an administrator can define your offering and as such can choose any tier of SKU but they must have a minimum of one core.  The Shared Worker is responsible for hosting Web/Mobile/API applications and Azure Function Apps.
![App Service on Azure Stack Role Configuration][9]

    > [!NOTE]
    > In the technical previews the App Service RP installer also deploys a Standard A1 instance to operate as a simple File Server to support the farm.  This remains for single node PoC but for Production workloads at GA the App Service installer enables the use of a HA File Server.

20. Choose your chosen deployment **Windows Server 2016** VM Image, from those available in the Compute Resource Provider, for the App Service Cloud and click **Next**.     
![App Service on Azure Stack VM Image Selection][10]
21. Provide the **Username and Password** you would like to configure for the **Worker Roles** within the App Service Cloud, and then provide the **Username and Password** you would like to configure for all **other App Service roles** and click **Next**.
![App Service on Azure Stack Credential Entry][11]
22. The summary listing displays the result of all the selections you have made for verification.   If you wish to make any changes navigate back through the screens and amend the selections.  If the configuration is as desired **check the checkbox** and click **Next**. 
![App Service on Azure Stack Selection Summary][12]
23. The installer will begin the deployment of App Service on Azure Stack.
24. The final step of deploying App Service on Azure Stack will take about 45-60 minutes to complete based on the default selections.
![App Service on Azure Stack Installation Progress][13]
25. After the installer successfully completes, click **Exit**.

## ADFS Based Deployments - Configure Service Principal for Virtual Machine Scale Set Integration on Worker Tiers and Single Sign On for Kudu and the Azure Functions Portal and Advanced Developer Tools

>[!NOTE]
> These steps are only applicable to ADFS secured Azure Stack Environments.

To configure service principal for VMSS integration on Worker Tiers to scale out and To enable the advanced developer tools within App Service - Kudu - and to enable the use of the Azure Functions Portal experience, administrators need to configure SSO. 

1. Open a PowerShell instance as **azurestack\azurestackadmin**.
2. Navigate to the location of the scripts downloaded and extracted in the [prerequisite step](#Download-Required-Components).
3. [Install and configure Azure Stack PowerShell environment](azure-stack-powershell-configure.md).  Follow instructions to create **AzureStackAdmin** environment and login to the AzureStackAdmin environment.
4. In the same PowerShell session, run the **CreateIdentityApp.ps1** script.  When prompted for your AAD Tenant ID - enter '**ADFS**'
5. In the Credential window provide your **ADFS Service Admin account** and **password**, and then Click **Ok**.
6. Provide the **certificate file path** and **certificate password** for the [certificate created earlier](# Create certificates to be used by App Service on Azure Stack).  The certificate created for this step by default is **sso.appservice.local.azurestack.external.pfx**
7. The script creates a new application in the Tenant Azure Active Directory and generate a new PowerShell Script.
8. Copy the identity app certificate file and the generated script to the **CN0-VM** (use a remote desktop session).
9. Return to **CN0-VM**
10. Open an **Administrator PowerShell window** and browse to the directory where the script file and certificate were copied to in step 7.
11. Now run the script file.  This script file enters the properties in the App Service on Azure Stack configuration and initiates a repair operation on all Front-End and Management roles.

| Parameter | Required/Optional | Default Value | Description |
| --- | --- | --- | --- |
| DirectoryTenantName | Mandatory | null | use 'ADFS' for ADFS environment |
| TenantArmEndpoint | Mandatory | management.local.azurestack.external | The Tenant ARM Endpoint |
| AzureStackCredential | Mandatory | null | The ADFS Service Admin Account |
| CertificateFilePath | Mandatory | null | Path to the identity application certificate file generated earlier |
| CertificatePassword | Mandatory | null | Password used to protect the certificate private key |
| DomainName | Required | local.azurestack.external | Azure Stack Region and Domain Suffix |
| AdfsMachineName | Optional | ADFS machine name for example AzS-ADFS01.azurestack.local |


## Validate App Service on Azure Stack Installation

1. In the Azure Stack Admin portal, browse to the Resource Group created by the installer, by default this is **APPSERVICE-LOCAL**.
2. Locate the **CN0-VM** and **connect** to the VM by clicking connect in the Virtual Machine blade.
3. On the desktop of this VM, double-click the **Web Cloud Management Console**.
4. Navigate to **Managed Servers**.
5. When all the machines except one or more Workers are **Ready**, proceed to the next step. 
6. Close the remote desktop machine and return to the machine you executed the App Service installer from.

    > [!NOTE]
    > You do not need to wait for one or more Workers to be marked as Ready to complete the installation of App Service on Azure Stack, however you need a minimum of one worker ready to deploy a Web/Mobile/API App or Azure Function.
    
    ![App Service on Azure Stack Managed Servers Status][14]

## Test Drive App Service on Azure Stack

Now that you have deployed and registered the App Service resource provider, you can test it to make sure that tenants can deploy Web, Mobile, and API apps.

> [!NOTE]
> You need to create an offer that has the Microsoft.Web namespace within the plan and then you need to have a tenant subscription that has subscribed to this offer.  For more information, see the following articles - [Create Offer](azure-stack-create-offer.md) and [Create Plan](azure-stack-create-plan.md)
>
>You **must** have a **Tenant Subscription** to create applications using App Service on Azure Stack.  The only capabilities that a Service Admin can complete within the Admin Portal are related to the resource provider administration of App Service such as adding capacity, configuring deployment sources, adding worker tiers and SKUs.
>
> As of TP3 to **create Web/Mobile/API Apps** you must use the **Tenant portal** and have a **tenant subscription**.  

1. In the Azure Stack Tenant portal, click New, click Web + Mobile, and click Web App.
2. In the Web App blade, type a name in the Web app box.
3. Under Resource Group, click New, and then type a name in the Resource Group box. 
4. Click App Service plan/Location and click Create New.
5. In the App Service plan blade, type a name in the App Service plan box.
6. Click Pricing tier, click Free-Shared or Shared-Shared, click Select, click OK, and then click Create.
7. In under a minute, a tile for the new web app appears on the Dashboard. Click the tile.
8. In the web app blade, click Browse to view the default website for this app.

## Deploy a WordPress, DNN, or Django website (optional)**

1. In the **Azure Stack tenant portal**, click “+”, go to the Azure Marketplace, deploy a Django website, and wait for successful completion. The Django web platform uses a file system-based database and doesn’t require any additional resource providers like SQL or MySQL.
2. If you also deployed a MySQL resource provider, you can deploy a WordPress website from the Marketplace. When you're prompted for database parameters, input the user name as *User1@Server1* (with the user name and server name of your choice).
3. If you also deployed a SQL Server resource provider, you can deploy a DNN website from the Marketplace. When you're prompted for database parameters, pick a database in the computer running SQL Server that is connected to your resource provider.

## Next steps

You can also try out other [platform as a service (PaaS) services](azure-stack-tools-paas-services.md)

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
