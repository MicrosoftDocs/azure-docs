<properties
	pageTitle="Deploy templates with PowerShell in Azure Stack | Microsoft Azure"
	description="Learn how to deploy a virtual machine using a template and PowerShell."
	services="azure-stack"
	documentationCenter=""
	authors="heathl17"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/25/2016"
	ms.author="helaw"/>

# Deploy templates in Azure Stack using PowerShell

Use PowerShell to deploy Azure Resource Manager (ARM) templates to the Azure Stack POC.

ARM templates deploy and provision all of the resources for your application in a single, coordinated operation.

## Run AzureRM PowerShell cmdlets

In this example, you'll run the following script to deploy a virtual machine to Azure Stack POC using an ARM template.

Before proceeding, ensure you have installed and configured PowerShell.  

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
