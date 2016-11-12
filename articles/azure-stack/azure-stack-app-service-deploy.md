---
title: Add an App Service Resource Provider to Azure Stack | Microsoft Docs
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
ms.date: 11/10/2016
ms.author: anwestg

---

# Add an App Service resource provider to Azure Stack

Adding an App Service Resource Provider to Azure Stack has eight steps:

1.	Download required components.
2.	Create certificates to be used by App Service on Azure Stack.
3.	Use the installer to download, stage and, install App Service. 
4.	Validate App Service Installation.
5.	Create DNS records for the Front-End and Management Server load balancers.
6.	Register the newly deployed App Service resource provider with Azure Resource Manager.
7.  Register the App Service Gallery Items in the Azure Stack Gallery.
8.	Test Drive the App Service Resource Provider.

## Download Required Components

1.	Download the [App Service on Azure Stack preview installer](http://aka.ms/appsvconmastp2installer). 
2.	Download the [App Service on Azure Stack deployment helper scripts](http://aka.ms/appsvconmastp2helper). 
3.	Extract the files from the helper scripts zip file, there should be four scripts:
	- Create-AppServiceCerts.ps1
	- Create-AppServiceDnsRecords.ps1
	- Register-AppServiceResourceProvider.ps1 
	- Register-AppServiceGalleryItems.ps1

## Create certificates to be used by App Service on Azure Stack

This first script works with the Azure Stack certificate authority to create three certificates that are needed by App Service. Run the script on the ClientVM ensuring you are running PowerShell as azurestack\administrator:
1.	In a PowerShell session running as **azurestack\administrator**, execute the **Create-AppServiceCerts.ps1** script.  The script creates three certificates, in the same folder as the create certificates script, that are needed by App Service.
2.	Enter a password to secure the pfx files and make a note of it as you will need to enter it in the App Service on Azure Stack Installer.

## Use the installer to download and install App Service on Azure Stack

The appservice.exe installer will:
1.	Prompt you to accept the Microsoft and third-party EULAs.
2.	Collect Azure Stack deployment information.
3.	Create a blob container in the Azure Stack storage account specified.
4.	Download the files needed to install the App Service resource provider.
5.	Prepare the install to deploy the App Service resource provider in the Azure Stack environment.
6.	Upload the files to the App Service storage account.
7.	Present information needed to kick off the Azure Resource Manager template.

The following steps guide you through the installation stages:

> [!NOTE] 
> You MUST use an elevated account (local or domain administrator) to execute the installer. If you sign in as azurestack\azurestackuser, you will be prompted for elevated credentials. 

1.	Run appservice.exe as **azurestack\administrator**. 
2.	Click **Deploy using Azure Resource Manager**.

![App Service on Azure Stack Technical Preview 2 Installer][1]

3.	Review and accept the Microsoft Software Pre-Release License Terms, and then click **Next**.
4.	Review and accept the third-party license terms, and then click **Next**.
5.	Review the App Cloud Service configuration information and click **Next**.

![App Service on Azure Stack Technical Preview 2 App Service Cloud Configuration][2]

6. Click **Connect** (Next to the Azure Stack Subscriptions box).

![App Service on Azure Stack Technical Preview 2 App Service Cloud Configuration Screen Two][3]

7.	In the Azure Stack Authentication window provide your **Azure Active Directory Service Admin account** and **password**, and then Click **Sign In**.
**Note:** Enter the Azure Active Directory account that you provided when you deployed Azure Stack.
	- Click the **Down Arrow** on the right side of the box next to **Azure Stack Subscriptions** and then select your subscription.

![App Service on Azure Stack Technical Preview 2 Subscription Selection][5]

8.	Click the **Down Arrow** on the right side of the box next to **Azure Stack Locations**.
	- Select **Local**.
9. Enter the **Name** for your administrator.
10.	Enter a **Password** for the administrator.
11.	Review the **SQL Server details** and make changes if necessary.
12.	Review the **SysAdmin Login Account** and make changes if necessary.
13.	Enter the **SysAdmin Password**.
14.	Click **Next**.  At this point, the installer will verify the connection details for SQL Server provided.

![App Service on Azure Stack Technical Preview 2 Subscription Selection][4]	

15.	Click **Browse** next to the **App Service Default SSL Certificate File** and navigate to the **_.appservice.AzureStack.Local** certificate [created earlier](#Create-Certificates-To-Be-Used-By-Azure-Stack-Web-Apps).
16.	Enter the **certificate password** that you set when you created the certificates.
17.	Click **Browse** next to the **Resource Provider SSL Certificate File** and navigate to the **api.appservice.AzureStack.Local** certificate [created earlier](#Create-Certificates-To-Be-Used-By-Azure-Stack-Web-Apps).
18.	Enter the **certificate password** that you set when you created the certificates.
19.	Click **Browse** next to the **Resource Provider Root Certificate File** and navigate to the **AzureStackCertificationAuthority** certificate [created earlier](#Create-Certificates-To-Be-Used-By-Azure-Stack-Web-Apps).
20.	Click **Next** the installer will verify the certificate password provided.

![App Service on Azure Stack Technical Preview 2 Certificate Details][6]

The deployment will take about 45-60 minutes to complete.

![App Service on Azure Stack Technical Preview 2 Installation Progress][7]

21. After the installer successfully completes, click **Exit**.

## Validate App Service on Azure Stack Installation

1.	On your **Azure Stack Host Machine** open **Hyper-V Manager**.
2.	Locate the **CN0-VM** and **connect** to the VM.
![App Service on Azure Stack Technical Preview 2 Hyper-V Manager][8]
3.	On the desktop of this VM, double-click the **Web Cloud Management Console**.
![App Service on Azure Stack Technical Preview 2 Management Console][9]
4.	Navigate to **Managed Servers**.
5.	When all the machines are **Ready**, proceed to the next step. 
![App Service on Azure Stack Technical Preview 2 Managed Servers Status][10]
 
## Create DNS records for the Management Server and Front-End load balancers
1.	Open a PowerShell instance as **azurestack\administrator**.
2.	Navigate to the location of the scripts downloaded and extracted in the [prerequisite step](#Download-Required-Components).
3.	Run the **Create-AppServiceDnsRecords.ps1** script, this script creates DNS entries to enable the portal and web app requests to be routed to the Front-End Servers.  During Azure Resource Manager deployment of App Service, two Software Load Balancers (SLBs), were created in the network resource provider. They point to the Management Servers and the Front-End servers. The portal and Azure Resource Manager based requests to the Azure Stack App Service resource provider go to the Management Server.

## Register the newly deployed App Service provider with Azure Resource Manager
1.	Open a PowerShell instance as **azurestack\administrator**.
2.	Navigate to the location of the scripts downloaded and extracted in the [prerequisite step](#Download-Required-Components).
3.	Run the **Register-AppServiceResourceProvider.ps1** script. 
4. 	In the Azure Stack Authentication window provide your **Azure Active Directory Service Admin account** and **password**, and then Click **Sign In**.
**Note:** Enter the Azure Active Directory account that you provided when you deployed Azure Stack.

## Register the App Service Gallery Items in the Azure Stack Gallery.
1.  Open a PowerShell instance as **azurestack\administrator**.
2.  Navigate to the location of the scripts downloaded and extracted in the [prerequisite step](#Download-Required-Components).
3.  Run the **Register-AppServiceGalleryItems.ps1** script.
4.  In the Azure Stack Authentication window provide your **Azure Active Directory Service Admin account** and **password**, and then Click **Sign In**.
**Note:** Enter the Azure Active Directory account that you provided when you deployed Azure Stack.

## Test Drive App Service on Azure Stack

Now that you have deployed and registered the App Service resource provider, you can test it to make sure that tenants can deploy Web, Mobile, and API apps.

1.	In the Azure Stack portal, click New, click Web + Mobile, and click Web App.
2.	In the Web App blade, type a name in the Web app box.
3.	Under Resource Group, click New, and then type a name in the Resource Group box. 
4.	Click App Service plan/Location and click Create New.
5.	In the App Service plan blade, type a name in the App Service plan box.
6.	Click Pricing tier, click Free-Shared or Shared-Shared, click Select, click OK, and then click Create.
7.	In under a minute, a tile for the new web app will appear on the Dashboard. Click the tile.
8.	In the web app blade, click Browse to view the default website for this app.


**Deploy a WordPress, DNN, or Django website (optional)**

1. In the Azure Stack portal, click “+”, go to the Azure Marketplace, deploy a Django website, and wait for successful completion. The Django web platform uses a file system-based database and doesn’t require any additional resource providers like SQL or MySQL.  

2. If you also deployed a MySQL resource provider, you can deploy a WordPress website from the Marketplace. When you're prompted for database parameters, input the user name as *User1@Server1* (with the user name and server name of your choice).

3. If you also deployed a SQL Server resource provider, you can deploy a DNN website from the Marketplace. When you're prompted for database parameters, pick a database in the computer running SQL Server that is connected to your resource provider.

## Next steps

You can also try out other [platform as a service (PaaS) services](azure-stack-tools-paas-services.md)
*  [SQL Server resource provider](azure-stack-sql-rp-deploy.md) 
*  [MySQL resource provider](azure-stack-mysql-rp-deploy.md).

<!--Image references-->
[1]: ./media/azure-stack-app-service-deploy/AppService_exe_Start.png
[2]: ./media/azure-stack-app-service-deploy/AppService_exe_DefaultEntriesStep1.png
[3]: ./media/azure-stack-app-service-deploy/AppService_exe_DefaultEntriesStep2.png
[4]: ./media/azure-stack-app-service-deploy/AppService_exe_DefaultEntriesStep2_populated.png
[5]: ./media/azure-stack-app-service-deploy/AppService_exe_DefaultEntriesStep2_SubscriptionSelection.png
[6]: ./media/azure-stack-app-service-deploy/AppService_exe_DefaultEntriesStep3_Certificates.png
[7]: ./media/azure-stack-app-service-deploy/AppService_exe_InstallationProgress.png
[8]: ./media/azure-stack-app-service-deploy/HyperV.png
[9]: ./media/azure-stack-app-service-deploy/MMC.png
[10]: ./media/azure-stack-app-service-deploy/ManagedServers.png


<!--Links-->
[Azure_Stack_App_Service_preview_installer]: http://go.microsoft.com/fwlink/?LinkID=717531
[App_Service_Deployment]: http://go.microsoft.com/fwlink/?LinkId=723982
[AppServiceHelperScripts]: http://go.microsoft.com/fwlink/?LinkId=733525
