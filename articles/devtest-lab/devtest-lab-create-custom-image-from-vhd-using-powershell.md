---
title: Create an Azure DevTest Labs custom image from a VHD file using PowerShell | Microsoft Docs
description: Automate creation of a custom image in Azure DevTest Labs from a VHD file using PowerShell
services: devtest-lab,virtual-machines
documentationcenter: na
author: tomarcher
manager: douge
editor: ''

ms.assetid:
ms.service: devtest-lab
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/10/2017
ms.author: tarcher

---

# Create a custom image from a VHD file using PowerShell

[!INCLUDE [devtest-lab-create-custom-image-from-vhd-selector](../../includes/devtest-lab-create-custom-image-from-vhd-selector.md)]

[!INCLUDE [devtest-lab-custom-image-definition](../../includes/devtest-lab-custom-image-definition.md)]

[!INCLUDE [devtest-lab-upload-vhd-options](../../includes/devtest-lab-upload-vhd-options.md)]

## Step-by-step instructions

The following steps walk you through creating a custom image from a VHD file using PowerShell:

1. At a PowerShell prompt, log in to your Azure account with the following call to the **Login-AzureRmAccount** cmdlet.  
	
	```PowerShell
	Login-AzureRmAccount
	```

1.	Select the desired Azure subscription by calling the **Select-AzureRmSubscription** cmdlet. Replace the following placeholder for the **$subscriptionId** variable with a valid Azure subscription ID. 

	```PowerShell
	$subscriptionId = '<Specify your subscription ID here>'
	Select-AzureRmSubscription -SubscriptionId $subscriptionId
	```

1.	Get the lab object by calling the **Get-AzureRmResource** cmdlet. Replace the following placeholders for the **$labRg** and **$labName** variables with the appropriate values for your environment. 

	```PowerShell
	$labRg = '<Specify your lab resource group name here>'
	$labName = '<Specify your lab name here>'
	$lab = Get-AzureRmResource -ResourceId ('/subscriptions/' + $subscriptionId + '/resourceGroups/' + $labRg + '/providers/Microsoft.DevTestLab/labs/' + $labName)
	```
 
1.	Get the lab storage account and lab storage account key values from the lab object. 

	```PowerShell
	$labStorageAccount = Get-AzureRmResource -ResourceId $lab.Properties.defaultStorageAccount 
	$labStorageAccountKey = (Get-AzureRmStorageAccountKey -ResourceGroupName $labStorageAccount.ResourceGroupName -Name $labStorageAccount.ResourceName)[0].Value
	```

1.	Replace the following placeholder for the **$vhdUri** variable with the URI to your uploaded VHD file. You can get the VHD file's URI from the storage account's blob blade in the Azure portal.

	```PowerShell
	$vhdUri = '<Specify the VHD URI here>'
	```

1.	Create the custom image using the **New-AzureRmResourceGroupDeployment** cmdlet. Replace the following placeholders for the **$customImageName** and **$customImageDescription** variables to meaningful names for your environment.

	```PowerShell
	$customImageName = '<Specify the custom image name>'
	$customImageDescription = '<Specify the custom image description>'

	$parameters = @{existingLabName="$($lab.Name)"; existingVhdUri=$vhdUri; imageOsType='windows'; isVhdSysPrepped=$false; imageName=$customImageName; imageDescription=$customImageDescription}

	New-AzureRmResourceGroupDeployment -ResourceGroupName $lab.ResourceGroupName -Name CreateCustomImage -TemplateUri 'https://raw.githubusercontent.com/Azure/azure-devtestlab/master/Samples/201-dtl-create-customimage-from-vhd/azuredeploy.json' -TemplateParameterObject $parameters
	```

## PowerShell script to create a custom image from a VHD file

The following PowerShell script can be used to create a custom image from a VHD file. Replace the placeholders (starting and ending with angle brackets) with the appropriate values for your needs. 

```PowerShell
# Log in to your Azure account.  
Login-AzureRmAccount

# Select the desired Azure subscription. 
$subscriptionId = '<Specify your subscription ID here>'
Select-AzureRmSubscription -SubscriptionId $subscriptionId

# Get the lab object.
$labRg = '<Specify your lab resource group name here>'
$labName = '<Specify your lab name here>'
$lab = Get-AzureRmResource -ResourceId ('/subscriptions/' + $subscriptionId + '/resourceGroups/' + $labRg + '/providers/Microsoft.DevTestLab/labs/' + $labName)

# Get the lab storage account and lab storage account key values.
$labStorageAccount = Get-AzureRmResource -ResourceId $lab.Properties.defaultStorageAccount 
$labStorageAccountKey = (Get-AzureRmStorageAccountKey -ResourceGroupName $labStorageAccount.ResourceGroupName -Name $labStorageAccount.ResourceName)[0].Value

# Set the URI of the VHD file.	
$vhdUri = '<Specify the VHD URI here>'

# Set the custom image name and description values.
$customImageName = '<Specify the custom image name>'
$customImageDescription = '<Specify the custom image description>'

# Set up the parameters object.
$parameters = @{existingLabName="$($lab.Name)"; existingVhdUri=$vhdUri; imageOsType='windows'; isVhdSysPrepped=$false; imageName=$customImageName; imageDescription=$customImageDescription}

# Create the custom image. 
New-AzureRmResourceGroupDeployment -ResourceGroupName $lab.ResourceGroupName -Name CreateCustomImage -TemplateUri 'https://raw.githubusercontent.com/Azure/azure-devtestlab/master/Samples/201-dtl-create-customimage-from-vhd/azuredeploy.json' -TemplateParameterObject $parameters
```

## Related blog posts

- [Custom images or formulas?](https://blogs.msdn.microsoft.com/devtestlab/2016/04/06/custom-images-or-formulas/)
- [Copying Custom Images between Azure DevTest Labs](http://www.visualstudiogeeks.com/blog/DevOps/How-To-Move-CustomImages-VHD-Between-AzureDevTestLabs#copying-custom-images-between-azure-devtest-labs)

##Next steps

- [Add a VM to your lab](./devtest-lab-add-vm-with-artifacts.md)
