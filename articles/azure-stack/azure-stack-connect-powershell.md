<properties
	pageTitle="Deploy templates with PowerShell in Azure Stack | Microsoft Azure"
	description="Learn how to deploy a virtual machine using a template and PowerShell."
	services="azure-stack"
	documentationCenter=""
	authors="ErikjeMS"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/25/2016"
	ms.author="erikje"/>

# Deploy templates in Azure Stack using PowerShell

Use PowerShell to deploy Azure Resource Manager (ARM) templates to the Azure Stack POC.

ARM templates deploy and provision all of the resources for your application in a single, coordinated operation.

> [AZURE.NOTE] If you work on the Client VM, you’ll need to first **uninstall** the existing Azure PowerShell module and then [download](http://aka.ms/azStackPsh) the latest Azure PowerShell SDK. 

## Turn off IE enhanced security and enable cookies

Before authenticating PowerShell, you must allow cookies and JavaScript in the Internet Explorer profile you use to sign in to Azure Active Directory for both administrator and user sign-ins. These configurations should be set on any Windows Server machine being used to execute Azure PowerShell against Azure Stack. In most cases this will be the ClientVM.

**To turn off IE enhanced security:**

1. Sign in to the **ClientVM.AzureStack.local** virtual machine as an **azurestack\administrator**, and then open Server Manager.

2. Turn off **IE Enhanced Security Configuration** for both admins and users.

3. Sign out of the **ClientVM.AzureStack.local** virtual machine.

**To enable cookies:**

1. Sign in to the **ClientVM.AzureStack.local** virtual machine as an **azurestack\azurestackuser**.

2. On the Windows Start screen, click **All apps** &gt; **Windows accessories** &gt; **Internet Explorer**.

2. If prompted, check **Use recommended security**, and then click **OK**.

3. In Internet Explorer, click the **Tools (gear) icon** &gt; **Internet options** &gt; **Privacy** tab.

4. Click **Advanced**, make sure that both **Accept** buttons are selected, click **OK**, and then click **OK** again.


## Authenticate PowerShell with Microsoft Azure Stack (required)

1. [Turn off IE enhanced security and enable cookies](azure-stack-sql-rp-deploy-long.md#turn-off-ie-enhanced-security-and-enable-cookies).

2.  Run the following PowerShell cmdlet to configure the environment, and authenticate a user.

    - Replace *DIRECTORY_TENANT_NAME* with the fully qualified name of your directory tenant. Typically a directory tenant name will look like mydirectorytenant.onmicrosoft.com.
	- Replace *SUBSCRIPTION_NAME* with the default provider subscription name.
	- If you're using China Azure AD, please use "chinacloudapi.cn" to replace "windows.net" in the following cmdlets. You also also need to add "https://*.microsoftonline.cn" and "https://*.microsoftonline-p.cn" to your trusted website list.

```PowerShell

# Add the Microsoft Azure Stack environment
		
		$AadTenantId="DIRECTORY_TENANT_NAME"

# Configure the environment with the Add-AzureRmEnvironment cmdlet
		Add-AzureRmEnvironment -Name 'Azure Stack' `
    		-ActiveDirectoryEndpoint "https://login.windows.net/$AadTenantId/" `
    		-ActiveDirectoryServiceEndpointResourceId "https://azurestack.local-api/"`
    		-ResourceManagerEndpoint "https://api.azurestack.local/" `
    		-GalleryEndpoint "https://gallery.azurestack.local/" `
    		-GraphEndpoint "https://graph.windows.net/"

		# Authenticate a user to the environment (you will be prompted during authentication)
		$privateEnv = Get-AzureRmEnvironment 'Azure Stack'
		$privateAzure = Add-AzureRmAccount -Environment $privateEnv -Verbose
		Select-AzureRmProfile -Profile $privateAzure

		# Select an existing subscription where the deployment will take place
		Get-AzureRmSubscription -SubscriptionName "SUBSCRIPTION_NAME"  | Select-AzureRmSubscription
```


## Run AzureRM PowerShell cmdlets

In this example, you'll run the following script to deploy a virtual machine to Azure Stack POC using an ARM template.

The VHD used in this example template is a default marketplace image (WindowsServer-2012-R2-Datacenter). If you want to target another VHD, you must first add an image to the Platform Image Repository as described in [Add an image to the Platform Image Repository](azure-stack-add-image-pir.md).

1.  Go to <http://aka.ms/AzureStackGitHub>, search for the **101-simple-windows-vm** template, and save it to the following location: c:\\templates\\azuredeploy-101-simple-windows-vm.json.

2.  In PowerShell, run the following deployment script.

  Replace *username* and *password* with your username and password. On subsequent uses, increment the value for the *$myNum* parameter. If you don’t do this, your previous virtual machine deployment will be overwritten.

```PowerShell
		# Set Deployment Variables
		$myNum = "001" #Modify this per deployment
		$RGName = "myRG$myNum"
		$myLocation = "local"
		$myBlobStorageEndpoint = "blob.azurestack.local"

		# Create Resource Group for Template Deployment
		New-AzureRmResourceGroup -Name $RGName -Location $myLocation

		# Deploy Simple IaaS Template
		New-AzureRmResourceGroupDeployment `
		    -Name "myDeployment$myNum" `
		    -ResourceGroupName $RGName `
		    -TemplateFile "c:\templates\azuredeploy-101-simple-windows-vm.json" `
		    -blobStorageEndpoint $myBlobStorageEndpoint `
		    -newStorageAccountName "mystorage$myNum" `
		    -dnsNameForPublicIP "mydns$myNum" `
		    -adminUsername "username" `
		    -adminPassword ("password" | ConvertTo-SecureString -AsPlainText -Force) `
		    -vmName "myVM$myNum" `
		    -windowsOSVersion "2012-R2-Datacenter"
```

3.  Open the Azure Stack portal, click **Browse**, click **Virtual machines**, and look for your new virtual machine (*myDeployment001*).
  
## Video example: hybrid virtual machine deployment

[AZURE.VIDEO microsoft-azure-stack-tp1-poc-hybrid-vm-deployment]

## Next steps

[Deploy templates with Visual Studio](azure-stack-deploy-template-visual-studio.md)
