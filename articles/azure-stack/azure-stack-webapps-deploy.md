<properties
	pageTitle="Add a Web Apps Resource Provider to Azure Stack | Microsoft Azure"
	description="Detailed guidance for deploying Web Apps in Azure Stack"
	services="azure-stack"
	documentationCenter=""
	authors="ccompy, apwestgarth"
	manager="stefsch"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="app-service"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/25/2016"
	ms.author="anwestg"/>

# Add a Web Apps resource provider to Azure Stack

Adding a Web Apps Resource Provider to Azure Stack has seven steps:

1.	Download required components.
2.	Create certificates to be used by Azure Stack Web Apps.
3.	Use the installer to download, stage and install Azure Stack Web Apps. 
4.	Validate Web Apps Installation.
5.	Create DNS records for the Front End and Management Server load balancers.
6.	Register the newly deployed Web Apps resource provider with ARM.
7.	Test Drive the Web Apps Resource Provider.

## Download Required Components

1.	Download the [Azure Stack App Service preview installer](http://aka.ms/azasinstaller). 
2.	Download the [Azure Stack App Service deployment helper scripts](http://aka.ms/azashelper). 
3.	Extract the files from the helper scripts zip file, there should be three scripts:
	- Create-AppServiceCerts.ps1
	- Create-AppServiceDnsRecords.ps1
	- Register-AppServiceResourceProvider.ps1 

## Create certificates to be used by Azure Stack Web Apps

This first script works with the Azure Stack certificate authority to create 3 certificates that are needed by Web Apps. Run the script on the ClientVM ensuring you are running PowerShell as azurestack\administrator:
1.	In a PowerShell session running as **azurestack\administrator**, execute the **Create-AppServiceCerts.ps1** script.  This creates three certificates, in the same folder as the script, that are needed by Web Apps.
2.	Enter a password to secure the pfx files and make a note of it as you will need to enter it in the Azure Stack Web Apps Installer.

## Use the installer to download and install Azure Stack Web Apps

The appservice.exe installer will:
1.	Prompt the user to accept the Microsoft and third party EULAs.
2.	Collect Azure Stack deployment information.
3.	Create a blob container in the Azure Stack storage account specified.
4.	Download the files needed to install the Azure Stack Web App resource provider.
5.	Prepare the install to deploy the Web App resource provider in the Azure Stack environment.
6.	Upload the files to the App Service storage account.
7.	Present information needed to kick off the Azure Resource Manager template.

The following steps guide you through the installation stages:

>[AZURE.NOTE] You must use an elevated account (local or domain administrator) to execute the installer. If you sign in as azurestack\azurestackuser, you will be prompted for elevated credentials. 

1.	Run appservice.exe as **azurestack\administrator**. 
2.	Click **Deploy using Azure Resource Manager**.

![Azure Stack App Service Technical Preview 1 Installer][1]

3.	Review and accept the Microsoft Software Pre-Release License Terms, and then click **Next**.
4.	Review and accept the third partylicense terms, and then click **Next**.
5.	Review the App Cloud Service configuration information and click **Next**.

![Azure Stack App Service Technical Preview 1 App Service Cloud Configuration][2]

6. Click **Connect** (Next to the Azure Stack Subscriptions box).

![Azure Stack App Service Technical Preview 1 App Service Cloud Configuration Screen Two][3]

7.	In the Azure Stack Authentication window provide your **Azure Active Directory Service Admin account** and **password**, and then Click **Sign In**.
**Note:** This is the Azure Active Directory account that you provided when you deployed Azure Stack.
	- Click the **Down Arrow** on the right side of the box next to **Azure Stack Subscriptions** and then select your subscription.

![Azure Stack App Service Technical Preview 1 Subscription Selection][5]

8.	Click the **Down Arrow** on the right side of the box next to **Azure Stack Locations**.
	- Select **Local**.
9. Enter the **Name** for your administrator.
10.	Enter a **Password** for the administrator.
11.	Review the **SQL Server details** and make changes if required.
12.	Review the **SysAdmin Login Account** and make changes if required.
13.	Enter the **SysAdmin Password**.
14.	Click **Next**.  At this point the installer will now verify the connection details for SQL Server provided.

![Azure Stack App Service Technical Preview 1 Subscription Selection][4]	

15.	Click **Browse** next to the **Web Apps Default SSL Certificate File** and navigate to the **webapps.AzureStack.Local** certificate [created earlier](#Create-Certificates-To-Be-Used-By-Azure-Stack-Web-Apps).
16.	Enter the **certificate password** that you set when you created the certificates.
17.	Click **Browse** next to the **Resource Provider SSL Certificate File** and navigate to the **management.AzureStack.Local** certificate [created earlier](#Create-Certificates-To-Be-Used-By-Azure-Stack-Web-Apps).
18.	Enter the **certificate password** that you set when you created the certificates.
19.	Click **Browse** next to the **Resource Provider Root Certificate File** and navigate to the **management.AzureStack.Local** certificate [created earlier](#Create-Certificates-To-Be-Used-By-Azure-Stack-Web-Apps).
20.	Click **Next** the installer will verify the certificate password provided.

![Azure Stack App Service Technical Preview 1 Certificate Details][6]

The deployment will take about 45-60 minutes to complete.

![Azure Stack App Service Technical Preview 1 Installation Progress][7]

21. After the installer successfully completes click **Exit**.

## Validate Web Apps Installation

1.	On your **Azure Stack Host Machine** open **Hyper-V Manager**.
2.	Locate the **CN0-VM** and **connect** to the VM.
![Azure Stack App Service Technical Preview 1 Hyper-V Manager][8]
3.	On the desktop of this VM double click the **Web Cloud Management Console**.
![Azure Stack App Service Technical Preview 1 Management Console][9]
4.	Navigate to **Managed Servers**.
5.	When all the machines are **Ready** proceed to the next step. 
![Azure Stack App Service Technical Preview 1 Managed Servers Status][10]

## Create DNS records for the Management Server and Front End load balancers
1.	Open a PowerShell instance as **azurestack\administrator**.
2.	Navigate to the location of the scripts downloaded and extracted in the [prerequisite step](#Download-Required-Components).
3.	Run the **Create-AppServiceDnsRecords.ps1** script, this creates DNS entries to enable the portal and web app requests to be routed to the Front End Servers.  During ARM deployment of Web Apps, two Software Load Balancers (SLBs), were created in the network resource provider. They point to the Management Servers and the Front End servers. The portal and ARM based requests to the Azure Stack App Service resource provider go to the Management Server.

## Register the newly deployed Azure Stack Web Apps provider with ARM
1.	Open a PowerShell instance as **azurestack\administrator**.
2.	Navigate to the location of the scripts downloaded and extracted in the [prerequisite step](#Download-Required-Components).
3.	Run the **Register-AppServiceResourceProvider.ps1** script. 

>[AZURE.NOTE] Type the username and password **EXACTLY (including upper and lower case)** as it was entered for the **Virtual Machine(s) Administrator** and **Password** fields in the installation or your resource provider registration will fail.

## Test Drive Azure Stack Web Apps

Now that you have deployed and registered the Web Apps resource provider, you can test it to make sure that tenants can deploy web apps.

1.	In the Azure Stack portal, click New, click Web + Mobile, and click Web App.
2.	In the Web App blade, type a name in the Web app box.
3.	Under Resource Group, click New, and then type a name in the Resource Group box. 
4.	Click App Service plan/Location and click Create New.
5.	In the App Service plan blade, type a name in the App Service plan box.
6.	Click Pricing tier, click Free-Shared or Shared-Shared, click Select, click OK, and then click Create.
7.	In under a minute, a tile for the new web app will appear on the Dashboard. Click on the tile.
8.	In the web app blade, click Browse to view the default website for this app.


**Deploy a WordPress, DNN, or Django website (optional)**

1. In the Azure Stack portal, click “+”, go to the Azure Marketplace, deploy a Django website, and wait for successful completion. The Django web platform uses a file system-based database and doesn’t require any additional resource providers like SQL or MySQL.  

2. If you also deployed a MySQL resource provider, you can deploy a WordPress website from the Marketplace. When you're prompted for database parameters, input the user name as *User1@Server1* (with the user name and server name of your choice).

3. If you also deployed a SQL Server resource provider, you can deploy a DNN website from the Marketplace. When you're prompted for database parameters, pick a database in the computer running SQL Server that is connected to your resource provider.

## Next steps

You can also try out other [platform as a service (PaaS) services](azure-stack-tools-paas-services.md), like the [SQL Server resource provider](azure-stack-sqlrp-deploy.md) and [MySQL resource provider](azure-stack-mysqlrp-deploy.md).

<!--Image references-->
[1]: ./media/azure-stack-webapps-deploy/AppService_exe_Start.png
[2]: ./media/azure-stack-webapps-deploy/AppService_exe_DefaultEntriesStep1.png
[3]: ./media/azure-stack-webapps-deploy/AppService_exe_DefaultEntriesStep2.png
[4]: ./media/azure-stack-webapps-deploy/AppService_exe_DefaultEntriesStep2_populated.png
[5]: ./media/azure-stack-webapps-deploy/AppService_exe_DefaultEntriesStep2_SubscriptionSelection.png
[6]: ./media/azure-stack-webapps-deploy/AppService_exe_DefaultEntriesStep3_Certificates.png
[7]: ./media/azure-stack-webapps-deploy/AppService_exe_InstallationProgress.png
[8]: ./media/azure-stack-webapps-deploy/HyperV.png
[9]: ./media/azure-stack-webapps-deploy/MMC.png
[10]: ./media/azure-stack-webapps-deploy/ManagedServers.png


<!--Links-->
[Azure_Stack_App_Service_preview_installer]: http://go.microsoft.com/fwlink/?LinkID=717531
[WebAppsDeployment]: http://go.microsoft.com/fwlink/?LinkId=723982
[AppServiceHelperScripts]: http://go.microsoft.com/fwlink/?LinkId=733525
