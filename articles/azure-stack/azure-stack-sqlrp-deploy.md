<properties
	pageTitle="Prepare the physical machine"
	description="Prepare the physical machine"
	services="azure-stack"
	documentationCenter=""
	authors="ErikjeMS"
	manager="v-kiwhit"
	editor=""/>

<tags
	ms.service="multiple"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/04/2016"
	ms.author="v-anpasi"/>

# Add a SQL resource provider to Azure Stack

The SQL Server Resource Provider adaptor lets you use any SQL Server-based workload through Azure Stack so that SQL server databases can be used when deploying cloud native apps as well as SQL-based websites on Azure Stack.

## Before you deploy

Before deploying SQL resource providers, you'll need to create a default Windows Server image with .NET 3.5, turn off IE Enhanced Seucrity, and install the latest version of Azure PowerShell.

### Create an image of Windows Server including .NET 3.5

You'll need to create a Windows Server 2012 R2 Datacenter VHD with .Net 3.5 image and set is as the default image in the Platform Image repository. For more information, see [Create an image of WindowsServer2012R2 including .NET 3.5](azure-stack-add-image-pir.md#Create-an-image-of-WindowsServer2012R2-including-.NET-3.5).

### Turn off IE Enhanced Security

To enable PowerShell scripts to authenticate against AAD, you must turn off of IE Enhanced Security:

1. Sign in to the Azure Stack POC machine as an AzureStack/administrator, and then open Server Manager.

2. Turn off **IE Ehanced Security Configuration** for both Admins and Users.

3. Sign in to the **ClientVM.AzureStack.local** virtual machine as an administrator, and then open Server Manager.

4. Turn off **IE Ehanced Security Configuration** for both Admins and Users.

### Install the latest version of Azure PowerShell

1. Sign in to the Azure Stack POC machine as an AzureStack/administrator.

2. Using Remote Desktop Connection, sign in to the **ClientVM.AzureStack.local** virtual machine as an administrator.

3. Open the Control Panel, click **Uninstall a program**, click the **Azure PowerShell** entry, and then click **Uninstall**.

4. Download and install the latest Azure PowerShell from [http://aka.ms.webpi-azps](http://aka.ms.webpi-azps).

## Certificate Creation

You will need a wildcard certificate to secure communications between the resource provider and Azure Resource Manager:

1.	On PortalVM in inetmgr, select Feature: Server Certificates, Action: Create Domain Certificate

2.	Fill out the Prompt wizard

	- Common name: *.azurestack.local
	
	- You can fill whatever details you would like in the other fields, click next
	
	- Click select and select AzureStackCertificationAuthority
	
	- Friendly name: *.azureStack.Local    
	
3.	Export wildcard certificate

	- Open MMC
	
	- Ctrl+M, add certifcates pane for the local computer acoount
	 
	- Go to Certificates, Personal and find *.azureStack.local
	
	- Right-click, all tasks, export
	
	- Slect Yes, export private key
	
	- Check Export all extended properties.
	
	- Check Password and Specify suitable password. 
	
	- Export to file certificate.pfx in a folder of your choice.
	
	- Remote desktop from portalVM to ClientVM and copy certificate.pfx to its desktop

3.	Export the wildcard certificate.

  - Open MMC Certificates and find \*.azureStack.local.

  - Right-click, all tasks, export

  - Select Yes, export private key

  - Check Export all extended properties.

  - Specify suitable password.

  - Export to file certificate.pfx

The certificates are only valid in the environment in which they were generated.

Caution: When deploying in a multiple POC environment caution must be taken not to use a certificate from a different environment. If certificate generation is used, then make sure to remove any certificates which were not generated for this environment.

## Prepare and perform deployment

Download the SQL RP binaries by clicking [this link](https://fakeurl.com) and copy the downloaded ZIP file to the ClientVM's desktop in your POC environment.

1.	Change the deployment (AzureStack.SqlRP.Deployment.\*.nupkg) nuget package extension to .zip and extract the contents to D:\SQLRP\

2.	Place the setup nuget package (AzureStack.SqlRP.Setup.\*.nupkg) inside the extracted Deployment at d:\SQLRP\ AzureStack.SqlRP.Deployment.5.11.57.0\Contents\Deployment\

3.	Take the certificate.pfx file you have created (Detailed steps are above) and place the certificate under d:\SQLRP\ AzureStack.SqlRP.Deployment.5.11.57.0\Contents\Deployment\Certificate Folder

4.	Go to D:\SQLRP\AzureStack.SqlRP.Deployment.5.11.57.0\Contents\Deployment\Templates

5.	Change the parameters in InstallSqlRpComplete-Parameters.json.

    - Change cseBlobNamePackage to: AzureStack.SqlRP.Setup.5.11.57.0.nupkg
    >this is case sensitive

    - Specify an admin user\password to use as credentials for the RP VM.
    >the adminPassword field will be used as your SQL auth login as well in your Resource Provider's SQL Server

    - Input the certificate password you chose to create the certificate in the steps above.

6. Invoke SqlRPTemplateDeployment.ps1 as admin (right click, “Run as Administrator”)

    - When asked for AAD tenantID parameter – input your AAD tenant name, e.g. microsoftazurestack.onmicrosoft.com

    - When asked for package name, provide: AzureStack.SqlRP.Setup.5.11.57.0.nupkg
    >this is case sensitive

7.	Wait for the deployment to succeed. This might take 90 minutes.

## Add DNS record

1.	From the Azure Stack admin portal, lookup the NIC resource for your newly deployed VM and write down its public IP (192.168.X.X).

2.	Log in to your POC env and from there log in to ADVM (remote desktopadvm.AzureStackLocal.com),

3.	Run DNS manager from run box dnsmgmt.msc.

4.	Create an A Record in the ADVM for ‘sqlrp.azurestack.local’ by right clicking and selecting "new Host Record".

  - Enter the Name for the new host “sqlrp” (this will make it sqlrp.azurestack.local).

  - Enter the public IP address you wrote down in step 1 in “IP Address” field.

  - Click add host.

## Register the SQL Resource Provider

1.	Invoke Register-SqlRP.ps1 with the required parameters. Look up the SqlRP endpoint user name and password hard-coded in the ConfigureAzureStackSqlServer.ps1 script. ##TODO write the actual password, it doesn’t matter for TP1

2. Open the Azure Stack Admin Portal, click **Browse**, click **Resource Providers**, and verify that your SQL resource provider is registered.

3. Create your SQL resource by clicking "+" and selecting "Data" --> "SQL".
