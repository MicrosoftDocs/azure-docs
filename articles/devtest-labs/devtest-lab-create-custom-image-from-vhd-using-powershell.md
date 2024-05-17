---
title: Create a custom image from VHD file by using Azure PowerShell
description: Automate creation of a custom image in Azure DevTest Labs from a VHD file by using PowerShell.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/30/2023
ms.custom: devx-track-azurepowershell, UpdateFrequency2
---

# Create a custom image from a VHD file with PowerShell

[!INCLUDE [devtest-lab-create-custom-image-from-vhd-selector](../../includes/devtest-lab-create-custom-image-from-vhd-selector.md)]

[!INCLUDE [devtest-lab-custom-image-definition](../../includes/devtest-lab-custom-image-definition.md)]

[!INCLUDE [devtest-lab-upload-vhd-options](../../includes/devtest-lab-upload-vhd-options.md)]

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## PowerShell steps

The following steps walk you through creating a custom image from a VHD file by using Azure PowerShell:

1. At a PowerShell command prompt, sign in to your Azure account with the **Connect-AzAccount** cmdlet:

   ```powershell
   Connect-AzAccount
   ```

1. Select your Azure subscription with the **Select-AzSubscription** cmdlet. Replace \<subscription ID> with your subscription ID GUID.

   ```powershell
   $subscriptionId = '<subscription ID>'
   Select-AzSubscription -SubscriptionId $subscriptionId
   ```

1. Get the lab object by calling the **Get-AzResource** cmdlet. Replace the \<lab resource group name> and \<lab name> placeholders with your own resource group and lab names.

   ```powershell
   $labRg = '<lab resource group name>'
   $labName = '<lab name>'
   $lab = Get-AzResource -ResourceId ('/subscriptions/' + $subscriptionId + '/resourceGroups/' + $labRg + '/providers/Microsoft.DevTestLab/labs/' + $labName)
   ```

1. Replace the placeholder for the **$vhdUri** variable with the URI of your uploaded VHD file. You can get the VHD file's URI from its blob page in the lab's storage account in the Azure portal. An example VHD URI is: `https://acontosolab1234.blob.core.windows.net/uploads/myvhd.vhd`.

   ```powershell
   $vhdUri = '<VHD URI>'
   ```

1. Create the custom image by using the **New-AzResourceGroupDeployment** cmdlet. Replace the \<custom image name> and \<custom image description> placeholders with the name and description you want.

   ```powershell
   $customImageName = '<custom image name>'
   $customImageDescription = '<custom image description>'

   $parameters = @{existingLabName="$($lab.Name)"; existingVhdUri=$vhdUri; imageOsType='windows'; isVhdSysPrepped=$false; imageName=$customImageName; imageDescription=$customImageDescription}

   New-AzResourceGroupDeployment -ResourceGroupName $lab.ResourceGroupName -Name CreateCustomImage -TemplateUri 'https://raw.githubusercontent.com/Azure/azure-devtestlab/master/samples/DevTestLabs/QuickStartTemplates/201-dtl-create-customimage-from-vhd/azuredeploy.json' -TemplateParameterObject $parameters
   ```

## Complete PowerShell script

Combining the preceding steps produces the following PowerShell script that creates a custom image from a VHD file. To use the script, replace the following placeholders with your own values:

- \<subscription ID>
- \<lab resource group name>
- \<lab name>
- \<VHD URI>
- \<custom image name>
- \<custom image description>

```powershell
# Log in to your Azure account.
Connect-AzAccount

# Select the desired Azure subscription.
$subscriptionId = '<subscription ID>'
Select-AzSubscription -SubscriptionId $subscriptionId

# Get the lab object.
$labRg = '<lab resource group name>'
$labName = '<lab name>'
$lab = Get-AzResource -ResourceId ('/subscriptions/' + $subscriptionId + '/resourceGroups/' + $labRg + '/providers/Microsoft.DevTestLab/labs/' + $labName)

# Set the URI of the VHD file.
$vhdUri = '<VHD URI>'

# Set the custom image name and description values.
$customImageName = '<custom image name>'
$customImageDescription = '<custom image description>'

# Set up the parameters object.
$parameters = @{existingLabName="$($lab.Name)"; existingVhdUri=$vhdUri; imageOsType='windows'; isVhdSysPrepped=$false; imageName=$customImageName; imageDescription=$customImageDescription}

# Create the custom image.
New-AzResourceGroupDeployment -ResourceGroupName $lab.ResourceGroupName -Name CreateCustomImage -TemplateUri 'https://raw.githubusercontent.com/Azure/azure-devtestlab/master/samples/DevTestLabs/QuickStartTemplates/201-dtl-create-customimage-from-vhd/azuredeploy.json' -TemplateParameterObject $parameters
```

## Next steps

- [Compare custom images and formulas in DevTest Labs](devtest-lab-comparing-vm-base-image-types.md)
- [Copying Custom Images between Azure DevTest Labs](https://www.visualstudiogeeks.com/blog/DevOps/How-To-Move-CustomImages-VHD-Between-AzureDevTestLabs#copying-custom-images-between-azure-devtest-labs)
