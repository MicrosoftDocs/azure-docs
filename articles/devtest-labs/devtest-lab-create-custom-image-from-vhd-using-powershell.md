---
title: Create a custom image from VHD file by using Azure PowerShell
description: Automate creation of a custom image in Azure DevTest Labs from a VHD file by using PowerShell.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 04/02/2025
ms.custom: devx-track-azurepowershell, UpdateFrequency2

#customer intent: As a lab administrator, I want to create custom images from VHD files, so I can make the custom images available to lab users as bases for creating lab VMs.
---

# Create a custom image from a VHD file by using Azure PowerShell

[!INCLUDE [devtest-lab-create-custom-image-from-vhd-selector](../../includes/devtest-lab-create-custom-image-from-vhd-selector.md)]

In this article, you learn how to create an Azure DevTest Labs virtual machine (VM) custom image from a virtual hard disk (VHD) file by using Azure PowerShell. You can also [use the Azure portal to create a custom image](devtest-lab-create-template.md).

[!INCLUDE [devtest-lab-custom-image-definition](../../includes/devtest-lab-custom-image-definition.md)]

## Prerequisites

- **Owner** or **Contributor** permissions in an existing lab.
- Azure PowerShell installed. You can use [Azure Cloud Shell](/azure/cloud-shell/quickstart) or [install PowerShell locally](/powershell/azure/install-azure-powershell).

  - In Cloud Shell, select the **PowerShell** environment.
  - For a local PowerShell installation, run `Update-Module -Name Az` to get the latest version of Azure PowerShell, and run [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to Azure.

- A VHD file uploaded to the Azure Storage account for the lab. To upload a VHD file:

  1. Go to your lab storage account in the Azure portal and select **Upload**.
  1. Browse to and select the VHD file, select the **uploads** container or create a new container named **uploads** for the file, and then select **Upload**.

  You can also upload a VHD file by following the instructions in any of these articles:

  - [Upload a VHD file by using the AzCopy command-line utility](devtest-lab-upload-vhd-using-azcopy.md)
  - [Upload a VHD file by using Microsoft Azure Storage Explorer](devtest-lab-upload-vhd-using-storage-explorer.md)
  - [Upload a VHD file by using PowerShell](devtest-lab-upload-vhd-using-powershell.md)

## Create a custom image

The following Azure PowerShell steps create a DevTest Labs custom image from an uploaded VHD file by using a deployment template from the public [DevTest Labs template repository](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/QuickStartTemplates/201-dtl-create-customimage-from-vhd).

1. After you sign in to Azure, select the subscription you want to use by running `Select-AzSubscription`. Replace the `<subscription ID>` placeholder with your subscription ID.

   ```powershell
   $subscriptionId = '<subscription ID>'
   Select-AzSubscription -SubscriptionId $subscriptionId
   ```

1. Use [Get-AzResource](/powershell/module/az.resources/get-azresource) to get the lab object. Replace the `<lab resource group name>` and `<lab name>` placeholders with your own resource group and lab names, which you can get from the Azure portal.

   ```powershell
   $labRg = '<lab resource group name>'
   $labName = '<lab name>'
   $lab = Get-AzResource -ResourceId ('/subscriptions/' + $subscriptionId + '/resourceGroups/' + $labRg + '/providers/Microsoft.DevTestLab/labs/' + $labName)
   ```

1. Set up the parameters.

   - Replace the `<custom image name>` and `<custom image description` placeholders with a name and description for the custom image.
   - Replace the `<VHD URI>` placeholder with the URI of your uploaded VHD file. You can get the VHD file's URI from the Azure Storage container where you uploaded the file. An example VHD URI is: `https://acontosolab1234.blob.core.windows.net/uploads/myvhd.vhd`.

   ```powershell
   $customImageName = '<custom image name>'
   $customImageDescription = '<custom image description>'
   $vhdUri = '<VHD URI>'

   $parameters = @{existingLabName="$($lab.Name)"; existingVhdUri=$vhdUri; imageOsType='windows'; isVhdSysPrepped=$false; imageName=$customImageName; imageDescription=$customImageDescription}
   ```

1. Run [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) to create the custom image by using a template according to the parameters.

   ```powershell
   New-AzResourceGroupDeployment -ResourceGroupName $lab.ResourceGroupName -Name CreateCustomImage -TemplateUri 'https://raw.githubusercontent.com/Azure/azure-devtestlab/master/samples/DevTestLabs/QuickStartTemplates/201-dtl-create-customimage-from-vhd/azuredeploy.json' -TemplateParameterObject $parameters
   ```

## Use a PowerShell script

You can combine the preceding steps to produce an Azure PowerShell script that creates a custom image from a VHD file. To use the script, replace the parameter values under the `# Values to change` comment with your own values.

```powershell
# Values to change
$subscriptionId = '<Azure subscription ID>'
$labRg = '<Lab resource group name>'
$labName = '<Lab name>'
$vhdUri = '<VHD URI>'
$customImageName = '<Name for the custom image>'
$customImageDescription = '<Description for the custom image>'

# Select the desired Azure subscription.
Select-AzSubscription -SubscriptionId $subscriptionId

# Get the lab object.
$lab = Get-AzResource -ResourceId ('/subscriptions/' + $subscriptionId + '/resourceGroups/' + $labRg + '/providers/Microsoft.DevTestLab/labs/' + $labName)

# Set up the parameters object.
$parameters = @{existingLabName="$($lab.Name)"; existingVhdUri=$vhdUri; imageOsType='windows'; isVhdSysPrepped=$false; imageName=$customImageName; imageDescription=$customImageDescription}

# Create the custom image.
New-AzResourceGroupDeployment -ResourceGroupName $lab.ResourceGroupName -Name CreateCustomImage -TemplateUri 'https://raw.githubusercontent.com/Azure/azure-devtestlab/master/samples/DevTestLabs/QuickStartTemplates/201-dtl-create-customimage-from-vhd/azuredeploy.json' -TemplateParameterObject $parameters
```

## Related content

- [Compare custom images and formulas in DevTest Labs](devtest-lab-comparing-vm-base-image-types.md)
- [Copying Custom Images between Azure DevTest Labs](https://www.visualstudiogeeks.com/blog/DevOps/How-To-Move-CustomImages-VHD-Between-AzureDevTestLabs#copying-custom-images-between-azure-devtest-labs)
