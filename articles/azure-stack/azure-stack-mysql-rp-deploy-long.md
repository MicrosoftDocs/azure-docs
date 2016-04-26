<properties
	pageTitle="Add a MySQL resource provider to Azure Stack"
	description="Add a MySQL resource provider to Azure Stack"
	services="azure-stack"
	documentationCenter=""
	authors="Dumagar"
	manager="bradleyb"
	editor=""/>

<tags
	ms.service="multiple"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/31/2016"
	ms.author="dumagar"/>


# Instructions for adding a MySQL resource provider to Azure Stack to use with WebApps

This article shows the detailed instructions for each step, so that you can start [using MySQL databases with Web Apps on Azure Stack] (azure-stack-mysql-rp-deploy-short.md).

## Set up steps before you deploy

Before you deploy the resource provider, you need to:
- Have a default Windows Server image with .NET 3.5
- Turn off Internet Explorer (IE) Enhanced Security
- Install the latest version of Azure PowerShell

### Create an image of Windows Server including .NET 3.5

Skip this step if you downloaded the Azure Stack bits after 2/23/2016 because the default base Windows Server 2012 R2 image includes .NET 3.5 framework from this download and later.

If you downloaded before 2/23/2016, you need to create a Windows Server 2012 R2 Datacenter VHD with .NET 3.5 image and set is as the default image in the Platform Image repository. For more information, see [Create an image of Windows Server 2012R2 including .NET 3.5](azure-stack-add-image-pir.md#create-an-image-of-windowsserver2012r2-including-&#046;net-3&#046;5).

### Turn off IE enhanced security and enable cookies

To deploy a resource provider, your PowerShell Integrated Scripting Environment (ISE) must be run as an administrator, so you need to allow cookies and JavaScript in your Internet Explorer profile used for logging into Azure Active Directory (e.g. for both administrator and user separately)

**To turn off IE enhanced security:**

1. Sign in to the Azure Stack proof-of-concept (PoC) computer as an AzureStack/administrator, and then open Server Manager.

2. Turn off **IE Enhanced Security Configuration** for both Admins and Users.

3. Sign in to the **ClientVM.AzureStack.local** virtual machine as an administrator, and then open Server Manager.

4. Turn off **IE Enhanced Security Configuration** for both Admins and Users.

**To enable cookies:**

1. On the Windows Start screen, select **All apps**, select **Windows accessories**, right-click **Internet Explorer**, point to **More**,and then select **Run as an administrator**.

2. If prompted, check **Use recommended security**, and then click **OK**.

3. In Internet Explorer, click the **Tools (gear) icon** &gt; **Internet options** &gt; **Privacy** tab.

4. Click **Advanced**, make sure that both **Accept** buttons are selected, click **OK**, and then click **OK** again.

5. Close Internet Explorer and restart PowerShell ISE as an administrator.

### Install an Azure Stack compatible release of Azure PowerShell

1. Uninstall any existing Azure PowerShell from your Client VM.

2. Sign in to the Azure Stack POC machine as an AzureStack/administrator.

3. Using Remote Desktop, sign in to the **ClientVM.AzureStack.local** virtual machine as an administrator.

4. Open the Control Panel, click **Uninstall a program** &gt; click **Azure PowerShell** &gt; click **Uninstall**.

5. [Download the latest Azure PowerShell that supports Azure Stack](http://aka.ms/azstackpsh) and install it.

    After you install PowerShell, you can run this verification PowerShell script to make sure that you can connect to your Azure Stack instance (a login web page should appear).

## Bootstrap the resource provider deployment PowerShell

1. Connect the Azure Stack POC remote desktop to clientVm.AzureStack.Local and sign in as azurestack\\azurestackuser.

2. [Download the MySQL RP binaries](http://aka.ms/masmysqlrp) file and extract its contents to D:\\MySQLRP.

3. Run the D:\\MySQLRP\\Bootstrap.cmd file as an administrator (azurestack\administrator). This opens the Bootstrap.ps1 file in PowerShell ISE. When the PowerShell ISE windows completes loading  run the bootstrap script by clicking the “play” button or pressing F5. Two major tabs will load, each containing all the scripts and files necessary to deploy your MySQL Resource Provider. 

## Prepare prerequisites

Click the **Prepare Prerequisites** tab to:

	- Create required certificates
	- Download MySQL binaries to your Azure Stack
	- Upload artifacts to a storage account on Azure Stack
	- Publish gallery items

### Create the required certificates
This **New-SslCert.ps1** script adds the \_.AzureStack.local.pfx SSL certificate to the D:\\MySQLRP\\Prerequisites\\BlobStorage\\Container folder. The certificate secures communication between the resource provider and the local instance of the Azure Resource Manager.

1. In the **Prepare Prerequisites** major tab, click the **New-SslCert.ps1** tab and run it.

2. In the prompt that appears, type a PFX password that protects the private key and **Make a note of this password**. You will need to supply it as a parameter later.

### Download MySQL binaries to your Azure Stack

Select the **Download-MySqlServer.ps1** tab and run it. When prompted, accept the EULA by clicking Yes in the Confirm dialog box. This command adds two zip files to the D:\MySql\Prerequisites\BlobStorage\Container folder.

### Upload all artifacts to a storage account on Azure Stack

1. Click the **Upload-Microsoft.MySql-RP.ps1** tab and run it.

2. In the Windows PowerShell credential request dialog box, type the Azure Stack service administrator credentials.

3. When prompted for the Azure Active Directory Tenant ID, input your Azure Active Directory tenant fully qualified domain name, e.g. microsoftazurestack.onmicrosoft.com. A pop up window will ask for credentials. Submit your Azure Stack Service Admin credentials.

	> [AZURE.TIP] If the pop-up doesn't appear, you either haven’t turned off IE enhanced security to enable JavaScript on this machine and user, or you haven’t accepted cookies in IE. See [Set up steps before you deploy](#set-up-steps-before-you-deploy).

4. Type your Azure Stack Service Admin credentials and then click **Sign In**.

### Publish gallery items for later resource creation

Select the **Publish-GalleryPackages.ps1** tab and run it. This script adds two marketplace items to the Azure Stack POC portal’s marketplace that you can use to deploy database resources as marketplace items.

## Deploy the MySQL RP Resource Provider VM

Now that you have prepared the Azure Stack PoC with the necessary certificates and marketplace items, you can deploy a SQL Server Resource Provider. Click the **Deploy MySQL provider** tab to:

   - Provide values in a JSON file that the deployment process will references
   - Deploy the resource provider
   - Update the local DNS
   - Register the SQL Server Resource Provider Adapter

### Provide values in the JSON file

Click **Microsoft.MySqlprovider.Parameters.JSON**. This parameter file contains the necessary parameters for your Azure Resource Manager template to properly deploy to Azure Stack.

1. Fill out the **empty** parameters in the JSON file:

	- Make sure to provide the **adminusername** and **adminpassword** for the MySQL Resource Provider VM:

	- Make sure you input the password for the **SetupPfxPassword** parameter that you made a note of in the [Prepare prequisites](#prepare-prerequisites) step.
	
	- Make sure you input and note the **basicAuthUserName** and **basicAuthPassword** parameters. you will need them to register the RP later on 

2. Click **Save** to save the parameter file.

### Deploy the resource provider

1. Click the **Deploy-Microsoft.Mysql-provider.PS1** tab and run the script.
2. Type your tenant name in Azure Active Directory when prompted.
3. In the pop-up window, submit your Azure Stack service admin credentials.

The full deployment may take between 15 and 45 minutes on some highly utilized Azure Stack POCs. T

### Update the local DNS

1. Click the **Register-Microsoft.MySQL-fqdn.ps1** tab and run the script.
2. When prompted for Azure Active Directory Tenant ID, input your Azure Active Directory tenant fully qualified domain name (e.g., **microsoftazurestack.onmicrosoft.com**).

### Register the SQL RP Resource Provider##

1. Click the **Register-Microsoft.My-provider.ps1** tab and run the script.

2. When prompted for credentials, use what you noted as the **basicAuthUserName** and **basicAuthPassword** parameters

## Verify the deployment using the Azure Stack Portal

1. Log off the ClientVM and log in again as **AzureStack\User**.

2. On the desktop, click **Azure Stack POC Portal** and log on to the portal as the service admin.

3. Verify that the deployment succeeded. Click **Browse** &gt; **Resource Groups** &gt; click the resource group you used (default is MySQLRP), and then make sure that the essentials part of the blade (upper half) reads **deployment succeeded**.


4. Verify that the registration succeeded. Click **Browse** &gt; **Resource providers** &gt; and then look for **MySQL Local** 
## Test your deployment– create your first SQL Database

1. Sign in to the Azure Stack POC portal as service admin.

2. Click the **+** button &gt;**Custom** &gt;**MySQL Server & Databases**

3. Fill in the form with database details
4. The connections string for your database will include the "server" name as part of the user name: eg: **"user@Server"**. you will need to input a username in this form for e.g. when deploying a MySQL web site using the Azure Web Site resource provider


## Next steps

Try other [PaaS services](azure-stack-tools-paas-services.md) like the [SQL Server resource provider](azure-stack-sql-rp-deploy-short.md) and the [Web Apps resource provider](azure-stack-webapps-deploy.md).
