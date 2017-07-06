---
title: Deploy App Services - Azure Stack | Microsoft Docs
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
ms.date: 7/3/2017
ms.author: anwestg

---
# Add an App Service resource provider to Azure Stack

If you want to give your tenants the ability to create Web, Mobile, and API applications with their Azure Stack subscription, you must add an [App Service Resource Provider](azure-stack-app-service-overview.md) to your Azure Stack deployment. To do so, follow these steps:

1. Download required components.
2. Create certificates to be used by App Service on Azure Stack.
3. Use the installer to download, stage and, install App Service.
4. Validate App Service Installation.
5. Configure Service Principal for Virtual Machine Scale Set Integration on Worker Tiers and Single Sign On for Kudu and the Azure Functions Portal and Advanced Developer Tools.
6. Test Drive the App Service Resource Provider.

## Download the required components

1. Download the [App Service on Azure Stack preview installer](http://aka.ms/appsvconmasrc1installer).
2. Download the [App Service on Azure Stack deployment helper scripts](http://aka.ms/appsvconmasrc1helper).
3. Extract the files from the helper scripts zip file.  Once extracted the following files and folder structure
   - Create-AppServiceCerts.ps1
   - Create-IdentityApp.ps1
   - Modules
      - AzureStack.Identity.psm1
      - GraphAPI.psm1
   
## Create certificates required by App Service on Azure Stack

This first script works with the Azure Stack certificate authority to create three certificates that are needed by App Service. Run the script on the ClientVM ensuring you are running PowerShell as azurestack\AzureStackAdmin:

1. In a PowerShell session running as **azurestack\AzureStackAdmin**, execute the **Create-AppServiceCerts.ps1** script from the folder that you extracted the helper scripts into.  The script creates three certificates, in the same folder as the create certificates script, that are needed by App Service.
2. Enter a password to secure the pfx files and make a note of it as you need to enter it in the App Service on Azure Stack Installer.

### Create-AppServiceCerts.ps1 Parameters

| Parameter | Required/Optional | Default Value | Description |
| --- | --- | --- | --- |
| pfxPassword | Required | null | Password used to protect the certificate private key |
| DomainName | Required | local.azurestack.external | Azure Stack Region and Domain Suffix |
| CertificateAuthority | Required | AzS-CA01.azurestack.local | Certificate Authority Endpoint |

## Use the installer to download and install App Service on Azure Stack

The appservice.exe installer will:

1. Prompt you to accept the Microsoft and third-party EULAs.
2. Collect Azure Stack deployment information.
3. Create a blob container in the Azure Stack storage account specified.
4. Download the files needed to install the App Service resource provider.
5. Prepare the install to deploy the App Service resource provider in the Azure Stack environment.
6. Upload the files to the App Service storage account.
7. Deploy the App Service Resource Provider.
8. Create DNS Zone and Entries for App Service.
9. Register the App Service Resource Provider.
10. Register the App Service Gallery Items.

The following steps guide you through the installation stages:

> [!NOTE]
> You MUST use an elevated account (local or domain administrator) to execute the installer. If you sign in as azurestack\azurestackuser, you will be prompted for elevated credentials.

1. Run appservice.exe as **azurestack\AzureStackAdmin**.
2. Click **Deploy App Service on your Azure Stack cloud**.
![App Service on Azure Stack Technical Preview 3 Installer][1]
3. Review and accept the Microsoft Software Pre-Release License Terms, and then click **Next**.
4. Review and accept the third-party license terms, and then click **Next**.
5. Review the App Cloud Service configuration information and click **Next**.
![App Service on Azure Stack Technical Preview 3 App Service Cloud Configuration][2]

    > [!NOTE]
    > The App Service on Azure Stack Installer provides the default values for a One Node Azure Stack Installation.  If you have customized any of the options when you deployed Azure Stack, for example domain suffix, you need to edit the values in this window accordingly.  For example, if you are using the domain suffix mycloud.com your Admin ARM endpoint would need to change to adminmanagement.[region].mycloud.com

6. Click **Connect** (Next to the Azure Stack Subscriptions box).
   - If you are using AAD, then you must provide your **Azure Active Directory Service Admin account** and **password**, and then Click **Sign In**.  You **must** enter the Azure Active Directory account that you provided when you deployed Azure Stack.
   - If you are using ADFS, then you must provide your **Admin Account (for example azurestackadmin@azurestack.local)** and **password** and then Click **Sign In**.
7. Click the **Down Arrow** on the right side of the box next to **Azure Stack Subscriptions** and then select your subscription.
8. Click the **Down Arrow** on the right side of the box next to **Azure Stack Locations**, select the location corresponding to the region you are deploying (for example, **Local**), and then click **Next**. 
    ![App Service on Azure Stack Technical Preview 3 Subscription Selection][3]
9. Enter the **Resource Group Name** for your App Service deployment, by default this is set to **APPSERVICE-LOCAL**.
10. Enter the **Storage Account Name** you would like App Service to create as part of the installation.  By default this is set to **appsvclocalstor**.
11. Enter the **SQL Server details** for the instance that will be used to host the App Service RP Databases.  Click **Next** and the installer will validate the SQL connection properties and move to the next step.
![App Service on Azure Stack Technical Preview 3 Resource Group, Storage, and SQL Server information][4]
12. Click **Browse** next to the **App Service Default SSL Certificate File** and navigate to the **_.appservice.local.AzureStack.external** certificate [created earlier](#Create-Certificates-To-Be-Used-By-Azure-Stack-Web-Apps).  If you specified a different location and domain suffix when creating certificates, then select the corresponding certificate.
13. Enter the **certificate password** that you set when you created the certificates.
14. Click **Browse** next to the **Resource Provider SSL Certificate File** and navigate to the **api.appservice.local.AzureStack.external** certificate [created earlier](#Create-Certificates-To-Be-Used-By-Azure-Stack-Web-Apps).  If you specified a different location and domain suffix when creating certificates, then select the corresponding certificate.
15. Enter the **certificate password** that you set when you created the certificates.
16. Click **Browse** next to the **Resource Provider Root Certificate File** and navigate to the **AzureStackCertificationAuthority** certificate [created earlier](#Create-Certificates-To-Be-Used-By-Azure-Stack-Web-Apps).
17. Click **Next** the installer verifies the certificate password provided.
![App Service on Azure Stack Technical Preview 3 Certificate Details][5]
18. Review the **App Service Role Configuration**.  The defaults are populated with the minimum recommended instance SKUs for each role.  A summary of core and memory requirements is provided to help plan your deployment.  Once you have made your selections, click **Next** to advance.
  - **Controller**: By default 1 Standard A1 instance is selected.  This is the minimum we recommend.  The Controller role is responsible for managing and maintaining the health of the App Service cloud.
  - **Management**: By default 1 Standard A2 instance is selected.  To provide failover we recommend two instances.  The Management role is responsible for the App Service ARM and API endpoints, Portal Extensions (Admin, Tenant, Functions Portal), and the Data Service.
  - **Publisher**: By default 1 Standard A1 instance is selected.  This is the minimum we recommend.  The Publisher role is responsible for publishing content via FTP and Web Deploy.
  - **FrontEnd**: By default 1 Standard A1 instance is selected.  This is the minimum we recommend.  The Frontend role is responsible for routing requests to App Service Applications.
  - **Shared Worker**: By default 1 Standard A1 instance is selected but you may wish to add more.  You as an administrator can define your offering and as such can choose any tier of SKU but they must have a minimum of one core.  The Shared Worker is responsible for hosting Web/Mobile/API applications and Azure Function Apps.
![App Service on Azure Stack Technical Preview 3 Role Configuration][6]

    > [!NOTE]
    > In the technical previews the App Service RP installer also deploys a Standard A1 instance to operate as a simple File Server to support the farm.  This will remain for single node Development Kit but for Production workloads at GA the App Service installer will enable the use of a HA File Server.

19. Choose your chosen deployment **Windows Server 2016** VM Image, from those available in the Compute Resource Provider, for the App Service Cloud and click **Next**.
   ![App Service on Azure Stack Technical Preview 3 VM Image Selection][7]
20. Provide the **Username and Password** you would like to configure for the **Worker Roles** within the App Service Cloud, and then provide the **Username and Password** you would like to configure for all other **App Service** roles and click **Next**.
   ![App Service on Azure Stack Technical Preview 3 Credential Entry][8]
21. The summary listing displays the result of all of the selections you have made for verification.   If you wish to make any changes navigate back through the screens and amend the selections.  If the configuration is as desired **check the checkbox** and click **Next**. 
   ![App Service on Azure Stack Technical Preview 3 Selection Summary][9]
22. The installer begins the deployment of App Service on Azure Stack.
23. The final step of deploying App Service on Azure Stack will take about 45-60 minutes to complete based on the default selections.
   ![App Service on Azure Stack Technical Preview 3 Installation Progress][10]
24. After the installer successfully completes, click **Exit**.

## Validate App Service on Azure Stack Installation

1. In the Azure Stack Admin portal, browse to the Resource Group created by the installer, by default this is **APPSERVICE-LOCAL**.
2. Locate the **CN0-VM** and **connect** to the VM by clicking connect in the Virtual Machine blade.
3. On the desktop of this VM, double-click the **Web Cloud Management Console**.
4. Navigate to **Managed Servers**.
5. When all the machines except one or more Workers are **Ready**, proceed to the next step.
6. Close the remote desktop machine and return to the machine you executed the App Service installer from.
> [!NOTE]
> You do not need to wait for one or more Workers to be marked as Ready to complete the installation of App Service on Azure Stack, however you need a minimum of one worker ready to deploy a Web/Mobile/API App or Azure Function.
![App Service on Azure Stack Technical Preview 3 Managed Servers Status][11]

## Configure Service Principal for Virtual Machine Scale Set Integration on Worker Tiers and Single Sign On for Kudu and the Azure Functions Portal and Advanced Developer Tools

>[!NOTE]
> These steps are only applicable to AAD secured Azure Stack Environments.  It is not possible to enable SSO or the Azure Functions Portal in ADFS-based environments at present.

To enable the advanced developer tools within App Service - Kudu - and to enable the use of the Azure Functions Portal experience, administrators need to configure SSO.

1. Open a PowerShell instance as **azurestack\administrator**.
2. Navigate to the location of the scripts downloaded and extracted in the [prerequisite step](#Download-Required-Components).
3. Run the **CreateIdentityApp.ps1** script.  When prompted for your AAD Tenant ID - enter the AAD Tenant ID you are using for your Azure Stack deployment, for example **myazurestack.onmicrosoft.com**.
4. In the Credential window provide your **Azure Active Directory Service Admin account** and **password**, and then Click **Ok**.
5. Provide the **certificate file path** and **certificate password** for the [certificate created earlier](# Create certificates to be used by App Service on Azure Stack).  The certificate created for this step by default is **sso.appservice.local.azurestack.external.pfx**
6. The script creates a new application in the Tenant Azure Active Directory and generate a new PowerShell Script.

>[!NOTE]
> Make note of the **ApplicationID** that is returned in the PowerShell output.  You will need this to search for it in step 13.

7. Copy the identity app certificate file and the generated script to the **CN0-VM** (use a remote desktop session).
8. Open a new browser window and login to the **Azure portal (portal.azure.com)** as the **Azure Active Directory Service Admin**.
9. Open the **Azure Active Directory resource provider**.
10. Click **App Registrations**.
11. Search for the **Application ID** returned as part of step 6. An App Service application is listed.
12. Click the **Application** in the list and open the **Keys** blade
13. Add a new key with **Description - FunctionsPortal** and set the **Expiration Date to NeverExpires**
14. Click Save and then copy the key generated.
>[!NOTE]
> Before sure to note or copy the key when generated.  Once saved it can't be viewed again and you need to regenerate a new key.
![App Service on Azure Stack Technical Preview 3 Application Keys][12]
15. Return to the **Application Registration** in the **Azure Active Directory**.
16. Click **Required Permissions** and then click **Grant Permissions** and click **Yes**.
![App Service on Azure Stack Technical Preview 3 SSO Grant][13]
17. Return to **CN0-VM** and open the **Web Cloud Management Console** once more.
18. Select the **Settings** node on the left-hand pane and look for the **ApplicationClientSecret** Setting.
19. **Right click and select Edit**.  **Paste the key** generated in step 15 and click **OK**.
![App Service on Azure Stack Technical Preview 3 Application Keys][12]
20. Open an **Administrator PowerShell window** and browse to the directory where the script file and certificate were copied to in step 7.
21. Now run the script file.  This script file enters the properties in the App Service on Azure Stack configuration and initiates a repair operation on all Front-End and Management roles.

| Parameter | Required/Optional | Default Value | Description |
| --- | --- | --- | --- |
| DirectoryTenantName | Mandatory | null | Azure Active Directory Tenant Id, provide the GUID or string, for example, myazureaaddirectory.onmicrosoft.com |
| TenantArmEndpoint | Mandatory | management.local.azurestack.external | The Tenant ARM Endpoint |
| AzureStackCredential | Mandatory | api.appservice.local.azurestack.external | AAD Administrator |
| CertificateFilePath | Mandatory | null | Path to the identity application certificate file generated earlier |
| CertificatePassword | Mandatory | null | Password used to protect the certificate private key |
| DomainName | Required | local.azurestack.external | Azure Stack Region and Domain Suffix |
| AdfsMachineName | Optional | Ignore in case of AAD Deployment but required in ADFS deployment. ADFS machine name for example AzS-ADFS01.azurestack.local |

## Test Drive App Service on Azure Stack

Now that you have deployed and registered the App Service resource provider, you can test it to make sure that tenants can deploy Web, Mobile, and API apps.

> [!NOTE]
> You need to create an offer that has the Microsoft.Web namespace within the plan and then you need to have a tenant subscription that has subscribed to this offer.  For more information, see the following articles - [Create Offer](azure-stack-create-offer.md) and [Create Plan](azure-stack-create-plan.md)
>
>You **must** have a **Tenant Subscription** to create applications using App Service on Azure Stack.  The only capabilities that a Service Admin can complete within the Admin Portal are related to the resource provider administration of App Service such as adding capacity, configuring deployment sources, adding worker tiers and SKUs.
>
> As of TP3 to **create Web/Mobile/API/Function Apps**, you must use the **Tenant portal** and have a **tenant subscription**.  

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

<!--Links-->
[Azure_Stack_App_Service_preview_installer]: http://go.microsoft.com/fwlink/?LinkID=717531
[App_Service_Deployment]: http://go.microsoft.com/fwlink/?LinkId=723982
[AppServiceHelperScripts]: http://go.microsoft.com/fwlink/?LinkId=733525
