<properties
	pageTitle="Deploy templates with PowerShell in Azure Stack | Microsoft Azure"
	description="Learn how to deploy a virtual machine using a Resource Manager template and PowerShell."
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
	ms.date="09/26/2016"
	ms.author="helaw"/>

# Deploy templates in Azure Stack using PowerShell

Use PowerShell to deploy Azure Resource Manager templates to the Azure Stack POC.  Resource Manager templates deploy and provision all resources for your application in a single, coordinated operation.

## Run AzureRM PowerShell cmdlets

In this example, you run a script to deploy a virtual machine to Azure Stack POC using a Resource Manager template.  Before proceeding, ensure you have [installed and configured PowerShell](azure-stack-connect-powershell.md)  

The VHD used in this example template is a default marketplace image (WindowsServer-2012-R2-Datacenter).

1.  Go to <http://aka.ms/AzureStackGitHub>, search for the **101-simple-windows-vm** template, and save it to the following location: c:\\templates\\azuredeploy-101-simple-windows-vm.json.

2.  In PowerShell, run the following deployment script. Replace *username* and *password* with your username and password. On subsequent uses, increment the value for the *$myNum* parameter to prevent overwriting your deployment.

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
		    -Name myDeployment$myNum `
		    -ResourceGroupName $RGName `
		    -TemplateFile c:\templates\azuredeploy-101-simple-windows-vm.json `
		    -BlobStorageEndpoint $myBlobStorageEndpoint `
		    -NewStorageAccountName mystorage$myNum `
		    -DnsNameForPublicIP mydns$myNum `
		    -AdminUsername username `
		    -AdminPassword ("password" | ConvertTo-SecureString -AsPlainText -Force) `
		    -VmName myVM$myNum `
		    -WindowsOSVersion 2012-R2-Datacenter
    ```

3.  Open the Azure Stack portal, click **Browse**, click **Virtual machines**, and look for your new virtual machine (*myDeployment001*).

## Video example: hybrid virtual machine deployment

[AZURE.VIDEO microsoft-azure-stack-tp1-poc-hybrid-vm-deployment]

## Next steps

[Deploy templates with Visual Studio](azure-stack-deploy-template-visual-studio.md)
