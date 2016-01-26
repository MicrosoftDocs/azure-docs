<properties
	pageTitle="Deploy templates with PowerShell in Azure Stack"
	description="Learn how to deploy a virtual machine using a template and PowerShell."
	services="azure-stack"
	documentationCenter=""
	authors="erikje"
	manager="v-kiwhit"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/29/2016"
	ms.author="erikje"/>

# Deploy templates with PowerShell in Azure Stack

You can deploy templates in Microsoft Azure Stack by using PowerShell. Your tenant subscription must be enabled for virtual machine deployment. This example shows how to deploy a virtual machine using a template and PowerShell.

## Authenticate PowerShell with Microsoft Azure Stack

Before deploying with PowerShell, you must authenticate to a Microsoft Azure Stack environment.

1.  Get your tenant GUID, configure the environment, and authenticate a user by running the following PowerShell cmdlet. Replace *EMAIL* with a tenant account in the Azure Active Directory (this email must end in <directoryname>.onmicrosoft.com). Replace *SUBSCRIPTION_NAME* with the default provider subscription name.

		# Add the Microsoft Azure Stack environment
		[net.mail.mailaddress]$AadFullMailAddress="EMAIL"
		$AadTenantId=(Invoke-WebRequest -Uri ('https://login.windows.net/'+($AadFullMailAddress.Host)+'/.well-known/openid-configuration')|ConvertFrom-Json).token_endpoint.Split('/')[3]

		# Configure the environment with the Add-AzureRmEnvironment cmdlt
		Add-AzureRmEnvironment -Name 'Azure Stack' `
    		-ActiveDirectoryEndpoint ("https://login.windows.net/$AadTenantId/") `
    		-ActiveDirectoryServiceEndpointResourceId "https://azurestack.local-api/"`
    		-ResourceManagerEndpoint ("https://api.azurestack.local/") `
    		-GalleryEndpoint ("https://gallery.azurestack.local/") `
    		-GraphEndpoint "https://graph.windows.net/"

		# Authenticate a user to the environment (you will be prompted during authentication)
		$privateEnv = Get-AzureRmEnvironment 'Azure Stack'
		$privateAzure = Add-AzureRmAccount -Environment $privateEnv -Verbose
		Select-AzureRmProfile -Profile $privateAzure

		# Select an existing subscription where the deployment will take place
		Get-AzureRmSubscription -SubscriptionName "SUBSCRIPTION_NAME"  | Select-AzureRmSubscription

2.  You can now execute AzureRM PowerShell cmdlts to deploy resources to Microsoft Azure Stack.

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
		    -windowsOSVersion "2012-R2-Datacenter "


4.  Go to the Microsoft Azure Stack portal and you’ll see your new virtual machine named my Deployment001.

## Next Steps

[Deploy templates with Visual Studio](azure-stack-deploy-template-visual-studio.md)
