---
title: Azure PowerShell Samples
description: Use these Azure PowerShell scripts for DevTest Labs activities like adding users, creating custom roles, and setting lab policies.
ms.topic: sample
ms.custom: devx-track-azurepowershell, UpdateFrequency2
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/31/2025

#customer intent: As a lab administrator, I want to run Azure PowerShell scripts to add and assign users and allow specific VM sizes and images, so I can easily configure lab settings.
---

# Azure PowerShell samples for Azure DevTest Labs

This article includes the following sample Azure PowerShell scripts for Azure DevTest Labs:

- [Add an external user to a lab](#add-an-external-user-to-a-lab)
- [Create and assign a custom role in a lab](#create-and-assign-a-custom-lab-user-role)
- [Set allowed virtual machine (VM) sizes for a lab](#set-allowed-vm-sizes)
- [Add Marketplace images to a lab](#add-a-marketplace-image-to-a-lab)
- [Create a custom image from a virtual hard drive (VHD)](#create-a-custom-image-from-a-vhd-file)

## Prerequisites

- To add or assign users or roles, you need **Owner** role in a lab, or **Owner** or **User Access Administrator** role in the Azure subscription that contains the lab.
- To set allowed lab VM sizes, add a Marketplace image, or create a custom image, you need at least **Contributor** role in the lab or the Azure subscription.
- All scripts require Azure PowerShell. You can use [Azure Cloud Shell](/azure/cloud-shell/quickstart) or [install PowerShell locally](/powershell/azure/install-azure-powershell).
  - In Cloud Shell, select the **PowerShell** environment.
  - For a local PowerShell installation, run `Update-Module -Name Az` to get the latest version of Azure PowerShell, and run [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) to sign in to Azure. If you have multiple Azure subscriptions, use `Set-AzContext -SubscriptionId "<SubscriptionId>"` to provide the subscription ID you want to use.

## Add an external user to a lab

This sample PowerShell script adds an external user to a lab with **DevTest Labs User** role. The user to add must be in the organization's Microsoft Entra ID.

To use the script, replace the parameter values under the `# Values to change` comment with your own values. You can get the `subscriptionId`, `labResourceGroup`, and `labName` values from the lab's main page in the Azure portal.

This script uses the following commands:

- [Get-AzADUser](/powershell/module/az.resources/get-azaduser): Gets the user object from Microsoft Entra ID.
- [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment): Assigns the **DevTest Labs User** role to the specified user at the specified scope.

```powershell
# Values to change
$subscriptionId = "<Azure subscription ID>"
$labResourceGroup = "<Lab resource group name>"
$labName = "<Lab name>"
$userDisplayName = "<User display name in Microsoft Entra ID>"

# Select the Azure subscription that contains the lab. This step is optional if you have only one subscription.
Select-AzSubscription -SubscriptionId $subscriptionId

# Get the user object.
$adObject = Get-AzADUser -SearchString $userDisplayName

# Assign the role. 
$labId = ('/subscriptions/' + $subscriptionId + '/resourceGroups/' + $labResourceGroup + '/providers/Microsoft.DevTestLab/labs/' + $labName)
New-AzRoleAssignment -ObjectId $adObject.Id -RoleDefinitionName 'DevTest Labs User' -Scope $labId
```

## Create and assign a custom lab user role

This sample PowerShell script creates a custom role that allows lab users to modify lab policies, and assigns the custom role to an external user. The user to assign the role must be in the organization's Microsoft Entra ID.

To use the script, replace the parameter values under the `# Values to change` comment with your own values. You can get the `subscriptionId`, `rgName`, and `labName` values from the lab's main page in the Azure portal.

This script uses the following commands:

- [Get-AzProviderOperation](/powershell/module/az.resources/get-azprovideroperation): Lists all the available operations for the `Microsoft.DevTestLab` resource provider.
- [Get-AzRoleDefinition](/powershell/module/az.resources/get-azroledefinition): Lists all the allowed actions for the **DevTest Labs User** role.
- [New-AzRoleDefinition](/powershell/module/az.resources/new-azroledefinition): Creates the new **Policy Contributor** custom role.
- [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment): Assigns the custom role to the specified user at the specified scope.

```powershell
# Values to change
$subscriptionId = "<Azure subscription ID>"
$rgName = "<Lab resource group name>"
$labName = "<Lab name>"
$userDisplayName = "<User display name in Microsoft Entra ID>"

# List all the operations for a resource provider.
Get-AzProviderOperation -OperationSearchString "Microsoft.DevTestLab/*"

# List allowed actions for a role.
(Get-AzRoleDefinition "DevTest Labs User").Actions

# Create the custom role.
$policyRoleDef = (Get-AzRoleDefinition "DevTest Labs User")
$policyRoleDef.Id = $null
$policyRoleDef.Name = "Policy Contributor"
$policyRoleDef.IsCustom = $true
$policyRoleDef.AssignableScopes.Clear()
$policyRoleDef.AssignableScopes.Add("/subscriptions/" + $subscriptionId)
$policyRoleDef.Actions.Add("Microsoft.DevTestLab/labs/policySets/policies/*")
$policyRoleDef = (New-AzRoleDefinition -Role $policyRoleDef)

# Retrieve the user object.
$adObject = Get-AzADUser -SearchString $userDisplayName

# Create the role assignment. 
$scope = '/subscriptions/' + $subscriptionId + '/resourceGroups/' + $rgName + '/providers/Microsoft.DevTestLab/labs/' + $labName + '/policySets/default/policies/*'
New-AzRoleAssignment -ObjectId $adObject.Id -RoleDefinitionName "Policy Contributor" -Scope $scope
```

## Set allowed VM sizes

This sample PowerShell script sets the allowed sizes for creating lab VMs. Provide the information the script calls for when prompted.

- [Get-AzResource](/powershell/module/az.resources/get-azresource): Gets the lab and lab policies resources.
- [Set-AzResource](/powershell/module/az.resources/set-azresource): Updates the lab VM size policy.
- [New-AzResource](/powershell/module/az.resources/new-azresource): Creates a new lab VM size policy.

```powershell
param (
[Parameter(Mandatory=$true, HelpMessage="The name of the DevTest Lab to update")]
    [string] $DevTestLabName,
[Parameter(Mandatory=$true, HelpMessage="The array of VM sizes to add")]
    [Array] $SizesToAdd
)

function Get-Lab
{
    $lab = Get-AzResource -ResourceType 'Microsoft.DevTestLab/labs' -Name $DevTestLabName

if(!$lab)
    {
        throw "Lab named $DevTestLabName was not found"
    }
    
    return $lab
}

function Get-PolicyChanges ($lab)
{
    #start by finding the existing policy
    $script:labResourceName = $lab.Name + '/default'
    $existingPolicy = (Get-AzResource -ResourceType 'Microsoft.DevTestLab/labs/policySets/policies' -Name $labResourceName -ResourceGroupName $lab.ResourceGroupName -ApiVersion 2016-05-15) | Where-Object {$_.Name -eq 'AllowedVmSizesInLab'}
    if($existingPolicy)
    {
        $existingSizes = $existingPolicy.Properties.threshold
        $savePolicyChanges = $false
    }
    else
    {
        $existingSizes = ''
        $savePolicyChanges = $true
    }

if($existingPolicy.Properties.threshold -eq '[]')
    {
        Write-Output "Skipping $($lab.Name) because it currently allows all sizes"
        return
    }

# Make a list of all the current allowed sizes plus the `$SizesToAdd`.
    $finalVmSizes = $existingSizes.Replace('[', '').Replace(']', '').Split(',',[System.StringSplitOptions]::RemoveEmptyEntries)

foreach($vmSize in $SizesToAdd)
    {
        $quotedSize = '"' + $vmSize + '"'

if(!$finalVmSizes.Contains($quotedSize))
        {
            $finalVmSizes += $quotedSize
            $savePolicyChanges = $true
        }
    }

if(!$savePolicyChanges)
    {
        Write-Output "No policy changes required for VMSize in lab $($lab.Name)"
    }

return @{
        existingPolicy = $existingPolicy
        savePolicyChanges = $savePolicyChanges
        finalVmSizes = $finalVmSizes
    }
}

function Set-PolicyChanges ($lab, $policyChanges)
{
    if($policyChanges.savePolicyChanges)
    {
        $thresholdValue = ('[' + [String]::Join(',', $policyChanges.finalVmSizes) + ']')

$policyObj = @{
            subscriptionId = $lab.SubscriptionId
            status = 'Enabled'
            factName = 'LabVmSize'
            resourceGroupName = $lab.ResourceGroupName
            labName = $lab.Name
            policySetName = 'default'
            name = $lab.Name + '/default/allowedvmsizesinlab'
            threshold = $thresholdValue
            evaluatorType = 'AllowedValuesPolicy'
        }

$resourceType = "Microsoft.DevTestLab/labs/policySets/policies/AllowedVmSizesInLab"
        if($policyChanges.existingPolicy)
        {
            Write-Output "Updating $($lab.Name) VM Size policy"
            Set-AzResource -ResourceType $resourceType -ResourceName $labResourceName -ResourceGroupName $lab.ResourceGroupName -ApiVersion 2016-05-15 -Properties $policyObj -Force
        }
        else
        {
            Write-Output "Creating $($lab.Name) VM Size policy"
            New-AzResource -ResourceType $resourceType -ResourceName $labResourceName -ResourceGroupName $lab.ResourceGroupName -ApiVersion 2016-05-15 -Properties $policyObj -Force
        }
    }
}

$lab = Get-Lab
$policyChanges = Get-PolicyChanges $lab
Set-PolicyChanges $lab $policyChanges
```

## Add a Marketplace image to a lab

This sample PowerShell script adds a Marketplace image to the available base images for lab VM creation. Provide the information the script calls for when prompted.

The script uses the following commands:

- [Get-AzResource](/powershell/module/az.resources/get-azresource): Gets lab, lab policy, and gallery image resources.
- [Set-AzResource](/powershell/module/az.resources/set-azresource): Modifies the existing lab Marketplace image policy.
- [New-AzResource](/powershell/module/az.resources/new-azresource): Creates a new lab Marketplace image policy.

```powershell
param (
[Parameter(Mandatory=$true, HelpMessage="The name of the DevTest Lab to update")]
    [string] $DevTestLabName,
[Parameter(Mandatory=$true, HelpMessage="The array of Marketplace image names to enable")]
    [Array] $ImagesToAdd
)

function Get-Lab
{
    $lab = Get-AzResource -ResourceType 'Microsoft.DevTestLab/labs' -Name $DevTestLabName

if(!$lab)
    {
        throw "Lab named $DevTestLabName was not found"
    }
    
    return $lab
}

function Get-PolicyChanges ($lab)
{
    #start by finding the existing policy
    $script:labResourceName = $lab.Name + '/default'
    $existingPolicy = (Get-AzResource -ResourceType 'Microsoft.DevTestLab/labs/policySets/policies' -Name $labResourceName -ResourceGroupName $lab.ResourceGroupName -ApiVersion 2016-05-15) | Where-Object {$_.Name -eq 'GalleryImage'}
    if($existingPolicy)
    {
        $existingImages = [Array] (ConvertFrom-Json $existingPolicy.Properties.threshold)
        $savePolicyChanges = $false
    }
    else
    {
        $existingImages =  @()
        $savePolicyChanges = $true
    }

if($existingPolicy.Properties.threshold -eq '[]')
    {
        Write-Output "Skipping $($lab.Name) because it currently allows all marketplace images"
        return
    }

$allAvailableImages = Get-AzResource -ResourceType Microsoft.DevTestLab/labs/galleryImages -Name $lab.Name -ResourceGroupName $lab.ResourceGroupName -ApiVersion 2017-04-26-preview
    $finalImages = $existingImages

# loop through the requested images and add them to the finalImages list if they aren't already there
    foreach($image in $ImagesToAdd)
    {
        $imageObject = $allAvailableImages | Where-Object {$_.Name -eq $image}
        
        if(!$imageObject)
        {
            throw "Image $image is not available in the lab"
        }

$addImage = $true
        $parsedAvailableImage = $imageObject.Properties.imageReference

foreach($finalImage in $finalImages)
        {
            # determine whether or not the requested image is already allowed in this lab
            $parsedFinalImg = ConvertFrom-Json $finalImage

if($parsedFinalImg.offer -eq $parsedAvailableImage.offer -and $parsedFinalImg.publisher -eq $parsedAvailableImage.publisher -and $parsedFinalImg.sku -eq $parsedAvailableImage.sku -and $parsedFinalImg.osType -eq $parsedAvailableImage.osType -and $parsedFinalImg.version -eq $parsedAvailableImage.version)
            {
                $addImage = $false
                break
            }
        }

if($addImage)
        {
            Write-Output "  Adding image $image to the lab"
            $finalImages += ConvertTo-Json $parsedAvailableImage -Compress
            $savePolicyChanges = $true
        }
    }

if(!$savePolicyChanges)
    {
        Write-Output "No policy changes required for allowed Marketplace Images in lab $($lab.Name)"
    }

return @{
        existingPolicy = $existingPolicy
        savePolicyChanges = $savePolicyChanges
        finalImages = $finalImages
    }
}

function Set-PolicyChanges ($lab, $policyChanges)
{
    if($policyChanges.savePolicyChanges)
    {
        $thresholdValue = '["'
        for($i = 0; $i -lt $policyChanges.finalImages.Length; $i++)
        {
            $value = $policyChanges.finalImages[$i]
            if($i -ne 0)
            {
                $thresholdValue = $thresholdValue + '","'
            }

            $thresholdValue = $thresholdValue + $value.Replace('"', '\"')
        }
        $thresholdValue = $thresholdValue + '"]'

$policyObj = @{
            status = 'Enabled'
            factName = 'GalleryImage'
            threshold = $thresholdValue
            evaluatorType = 'AllowedValuesPolicy'
        }

$resourceType = "Microsoft.DevTestLab/labs/policySets/policies/galleryimage"
        if($policyChanges.existingPolicy)
        {
            Write-Output "Updating $($lab.Name) Marketplace Images policy"
            Set-AzResource -ResourceType $resourceType -ResourceName $labResourceName -ResourceGroupName $lab.ResourceGroupName -ApiVersion 2017-04-26-preview -Properties $policyObj -Force
        }
        else
        {
            Write-Output "Creating $($lab.Name) Marketplace Images policy"
            New-AzResource -ResourceType $resourceType -ResourceName $labResourceName -ResourceGroupName $lab.ResourceGroupName -ApiVersion 2017-04-26-preview -Properties $policyObj -Force
        }
    }
}

$lab = Get-Lab
$policyChanges = Get-PolicyChanges $lab
Set-PolicyChanges $lab $policyChanges
```

## Create a custom image from a VHD file

This sample PowerShell script creates a DevTest Labs custom image from a VHD file by using a deployment template from the public [DevTest Labs template repository](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/QuickStartTemplates/201-dtl-create-customimage-from-vhd). This script requires a Windows VHD file uploaded to the lab's Azure Storage account.

To use the script, replace the parameter values under the `# Values to change` comment with your own values. You can get the `subscriptionId`, `labRg`, and `labName` values from the lab's main page in the Azure portal. Get the `vhdUri` value from the Azure Storage container where you uploaded the VHD file.

This script uses the following commands:

- [Get-AzResource](/powershell/module/az.resources/get-azresource): Gets the lab and lab storage account resources.
- [Get-AzStorageAccountKey](/powershell/module/az.storage/get-azstorageaccountkey): Gets the access keys for the lab storage account.
- [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment): Deploys the custom image and resource group based on the template.

```powershell
# Values to change
$subscriptionId = '<Azure subscription ID>'
$labRg = '<Lab resource group name>'
$labName = '<Lab name>'
$vhdUri = '<URI for the uploaded VHD>'
$customImageName = '<Name for the custom image>'
$customImageDescription = '<Description for the custom image>'

# Select the Azure subscription. 
Select-AzSubscription -SubscriptionId $subscriptionId

# Get the lab object.
$lab = Get-AzResource -ResourceId ('/subscriptions/' + $subscriptionId + '/resourceGroups/' + $labRg + '/providers/Microsoft.DevTestLab/labs/' + $labName)

# Get the lab storage account and lab storage account key values.
$labStorageAccount = Get-AzResource -ResourceId $lab.Properties.defaultStorageAccount 
$labStorageAccountKey = (Get-AzStorageAccountKey -ResourceGroupName $labStorageAccount.ResourceGroupName -Name $labStorageAccount.ResourceName)[0].Value

# Set up the parameters object.
$parameters = @{existingLabName="$($lab.Name)"; existingVhdUri=$vhdUri; imageOsType='windows'; isVhdSysPrepped=$false; imageName=$customImageName; imageDescription=$customImageDescription}

# Create the custom image.
New-AzResourceGroupDeployment -ResourceGroupName $lab.ResourceGroupName -Name CreateCustomImage -TemplateUri 'https://raw.githubusercontent.com/Azure/azure-devtestlab/master/samples/DevTestLabs/QuickStartTemplates/201-dtl-create-customimage-from-vhd/azuredeploy.json' -TemplateParameterObject $parameters
```

## Related content

[Azure PowerShell documentation](/powershell/)
