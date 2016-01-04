<properties 
	pageTitle="Deploy templates with PowerShell" 
	description="Deploy templates with PowerShell" 
	services="" 
	documentationCenter="" 
	authors="v-anpasi" 
	manager="v-kiwhit" 
	editor=""/>

<tags 
	ms.service="multiple" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="1/04/2016" 
	ms.author="v-anpasi"/>

# Deploy templates with PowerShell

You can deploy templates in Microsoft Azure Stack by using PowerShell. Your tenant subscription must be enabled for virtual machine deployment. This example shows how to deploy a virtual machine using a template and PowerShell.

## Authenticate PowerShell with Microsoft Azure Stack

Before deploying, you must authenticate your PowerShell instance with Microsoft Azure Stack.

1.  Get your tenant GUID. You can find this by following these steps:

    1.  In a browser, log in to the Microsoft Azure Portal with your tenant account.

    2.  Click Active Directory and then click your Active Directory tenant.

    3.  In the browser’s Address Bar, copy the GUID from the URL.

2.  Open PowerShell and run the authentication script below. Change “Your Tenant GUID” to your GUID. Also, change “Sub Name” to your subscription name that you created above.

		# Add specific Azure Stack Environment
		$AadTenantId = "Your Tenant GUID" #GUID Specific to the AAD Tenant
		 
		Add-AzureRmEnvironment -Name 'Azure Stack' `
		    -ActiveDirectoryEndpoint ("https://login.windows.net/$AadTenantId/") `
		    -ActiveDirectoryServiceEndpointResourceId "https://azurestack.local-api/" `
		    -ResourceManagerEndpoint ("https://api.azurestack.local/") `
		    -GalleryEndpoint ("https://gallery.azurestack.local:30016/") `
		    -GraphEndpoint "https://graph.windows.net/"
		 
		# Get Azure Stack Environment Information
		$env = Get-AzureRmEnvironment 'Azure Stack'
		
		# Authenticate to AAD with Azure Stack Environment
		Add-AzureRmAccount -Environment $env -Verbose
		
		# Get Azure Stack Environment Subscription
		Get-AzureRmSubscription -SubscriptionName "Sub Name"  | Select-AzureRmSubscription


3.  When the Microsoft Azure sign in window opens, sign in with your Azure Stack tenant account.

## Deploy a virtual machine using a template

The VHD used in this example template is a default marketplace image (WindowsServer-2012-R2-Datacenter). If you want to target another VHD, you must first add an image to the Platform Image Repository as described in [Appendix C](#_Appendix_C:_Add).

1.  Navigate to <http://aka.ms/AzureStackGitHub>.

2.  Search for the **101-simple-windows-vm** template and save the template file to the following location: c:\\templates\\azuredeploy.json.

3.  In PowerShell, run the following deployment script. Replace “username” and “password” with your username and password. On subsequent uses, increment the value for the $myNum parameter. If you don’t do this, your previous virtual machine deployment will be overwritten.

		# Set Deployment Variables
		$myNum = "001" #Modify this per deployment
		$RGName = "myRG$myNum"
		$myLocation = "local"
		$myBlobStorageEndpoint = "blob.azurestack.local"
		
		# Create Resource Group for Template Deployment
		New-AzureRMResourceGroup -Name $RGName -Location $myLocation
		
		# Deploy Simple IaaS Template 
		New-AzureRmResourceGroupDeployment `
		    -Name "myDeployment$myNum" `
		    -ResourceGroupName $RGName `
		    -TemplateFile "c:\templates\azuredeploy-101-simple-windows-vm.json" `
		    -deploymentLocation $myLocation `
		    -blobStorageEndpoint $myBlobStorageEndpoint `
		    -newStorageAccountName "mystorage$myNum" `
		    -dnsNameForPublicIP "mydns$myNum" `
		    -adminUsername "username" `
		    -adminPassword ("password" | ConvertTo-SecureString -AsPlainText -Force) `
		    -vmName "myVM$myNum" `
		    -windowsOSVersion " WindowsServer-2012-R2-Datacenter "


4.  Go to the Microsoft Azure Stack portal and you’ll see your new virtual machine named my Deployment001.


