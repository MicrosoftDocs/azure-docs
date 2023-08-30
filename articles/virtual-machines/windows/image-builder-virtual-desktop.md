---
title: Create an Azure Virtual Desktop image by using Azure VM Image Builder
description: Create an Azure VM image of Azure Virtual Desktop by using VM Image Builder and PowerShell.
author: kof-f
ms.author: kofiforson
ms.reviewer: erd
ms.date: 06/20/2023
ms.topic: article
ms.service: virtual-machines
ms.collection: windows
ms.subservice: image-builder 
ms.custom: devx-track-azurepowershell
---

# Create an Azure Virtual Desktop image by using VM Image Builder and PowerShell

**Applies to:** :heavy_check_mark: Windows VMs 

In this article, you learn how to create an Azure Virtual Desktop image with these customizations:

* [FSLogix setup](https://github.com/DeanCefola/Azure-WVD/blob/master/PowerShell/FSLogixSetup.ps1)
* [Azure Virtual Desktop optimization](https://github.com/The-Virtual-Desktop-Team/Virtual-Desktop-Optimization-Tool)
* [Microsoft Teams installation](../../virtual-desktop/teams-on-avd.md)
* [Windows Restart customizer](../linux/image-builder-json.md?bc=%2fazure%2fvirtual-machines%2fwindows%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json#windows-restart-customizer)
* [Windows Update customizer](../linux/image-builder-json.md?bc=%2fazure%2fvirtual-machines%2fwindows%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json#windows-update-customizer)

The article discusses how to automate the customizations by using Azure VM Image Builder. You can then distribute the image to an [Azure Compute Gallery](../shared-image-galleries.md) (formerly Shared Image Gallery), where you can replicate it to other regions, control the scale, and share the image within and beyond your organization.

To simplify deploying a VM Image Builder configuration, our example uses an Azure Resource Manager template with the VM Image Builder template nested within it. This approach gives you a few more benefits, such as variables and parameter inputs. You can also pass parameters from the command line.

This article is intended as a copy-and-paste exercise.

> [!NOTE]
> You'll find the scripts for installing the apps on [GitHub](https://github.com/danielsollondon/azvmimagebuilder/tree/master/solutions/14_Building_Images_WVD). They're for illustration and testing purposes only. Do not use them for production workloads. 

## Tips for building Windows images 

- VM size: For Windows, use `Standard_D2_v2` or greater. The default size is `Standard_D1_v2`, which isn't suitable for Windows.
- This article uses [PowerShell customizer scripts](../linux/image-builder-json.md). Use the following settings, or the build will stop responding:

    ```json
      "runElevated": true,
      "runAsSystem": true,
    ```

    For example:

    ```json
      {
          "type": "PowerShell",
          "name": "installFSLogix",
          "runElevated": true,
          "runAsSystem": true,
          "scriptUri": "https://raw.githubusercontent.com/azure/azvmimagebuilder/main/solutions/14_Building_Images_WVD/0_installConfFsLogix.ps1"
    ```
- Comment your code: The VM Image Builder build log, *customization.log*, is verbose. If you comment your scripts by using 'write-host', they'll be sent to the logs, which should make troubleshooting easier.

    ```PowerShell
     write-host 'AIB Customization: Starting OS Optimizations script'
    ```

- Exit codes: VM Image Builder expects all scripts to return a `0` exit code. If you use a non-zero exit code, VM Image Builder fails the customization and stops the build. If you have complex scripts, add instrumentation and emit exit codes, which will be shown in the *customization.log* file.

    ```PowerShell
     Write-Host "Exit code: " $LASTEXITCODE
    ```
- Test: Test and retest your code on a standalone VM. Ensure that there are no user prompts, that you're using the correct privileges, and so on.

- Networking: `Set-NetAdapterAdvancedProperty` is set in the optimization script but fails the VM Image Builder build. Because it disconnects the network, it's commented out. We're investigating this issue.

## Prerequisites

You must have the latest Azure PowerShell cmdlets installed. For more information, see [Overview of Azure PowerShell](/powershell/azure/overview).

```PowerShell
# Check to ensure that you're registered for the providers and RegistrationState is set to 'Registered'
Get-AzResourceProvider -ProviderNamespace Microsoft.VirtualMachineImages
Get-AzResourceProvider -ProviderNamespace Microsoft.Storage 
Get-AzResourceProvider -ProviderNamespace Microsoft.Compute
Get-AzResourceProvider -ProviderNamespace Microsoft.KeyVault

# If they don't show as 'Registered', run the the following commented-out code

## Register-AzResourceProvider -ProviderNamespace Microsoft.VirtualMachineImages
## Register-AzResourceProvider -ProviderNamespace Microsoft.Storage
## Register-AzResourceProvider -ProviderNamespace Microsoft.Compute
## Register-AzResourceProvider -ProviderNamespace Microsoft.KeyVault
```

## Set up the environment and variables

```azurepowershell-interactive
# Step 1: Import module
Import-Module Az.Accounts

# Step 2: get existing context
$currentAzContext = Get-AzContext

# Destination image resource group
$imageResourceGroup="avdImageDemoRg"

# Location (see possible locations in the main docs)
$location="westus2"

# Your subscription. This command gets your current subscription
$subscriptionID=$currentAzContext.Subscription.Id

# Image template name
$imageTemplateName="avd10ImageTemplate01"

# Distribution properties object name (runOutput). Gives you the properties of the managed image on completion
$runOutputName="sigOutput"

# Create resource group
New-AzResourceGroup -Name $imageResourceGroup -Location $location
```

## Permissions, user identity, and role 

1. Create a user identity.

    ```azurepowershell-interactive
    # setup role def names, these need to be unique
    $timeInt=$(get-date -UFormat "%s")
    $imageRoleDefName="Azure Image Builder Image Def"+$timeInt
    $identityName="aibIdentity"+$timeInt

    ## Add Azure PowerShell modules to support AzUserAssignedIdentity and Azure VM Image Builder
    'Az.ImageBuilder', 'Az.ManagedServiceIdentity' | ForEach-Object {Install-Module -Name $_ -AllowPrerelease}

    # Create the identity
    New-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName -Location $location

    $identityNameResourceId=$(Get-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName).Id
    $identityNamePrincipalId=$(Get-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName).PrincipalId

    ```

1. Assign permissions to the identity to distribute images. The following commands download and update the template with the previously specified parameters.

    ```azurepowershell-interactive
    $aibRoleImageCreationUrl="https://raw.githubusercontent.com/azure/azvmimagebuilder/main/solutions/12_Creating_AIB_Security_Roles/aibRoleImageCreation.json"
    $aibRoleImageCreationPath = "aibRoleImageCreation.json"

    # Download the config
    Invoke-WebRequest -Uri $aibRoleImageCreationUrl -OutFile $aibRoleImageCreationPath -UseBasicParsing

    ((Get-Content -path $aibRoleImageCreationPath -Raw) -replace '<subscriptionID>',$subscriptionID) | Set-Content -Path $aibRoleImageCreationPath
    ((Get-Content -path $aibRoleImageCreationPath -Raw) -replace '<rgName>', $imageResourceGroup) | Set-Content -Path $aibRoleImageCreationPath
    ((Get-Content -path $aibRoleImageCreationPath -Raw) -replace 'Azure Image Builder Service Image Creation Role', $imageRoleDefName) | Set-Content -Path $aibRoleImageCreationPath

    # Create a role definition
    New-AzRoleDefinition -InputFile  ./aibRoleImageCreation.json

    # Grant the role definition to the VM Image Builder service principal
    New-AzRoleAssignment -ObjectId $identityNamePrincipalId -RoleDefinitionName $imageRoleDefName -Scope "/subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup"
    ```

> [!NOTE] 
> If you receive the error "New-AzRoleDefinition: Role definition limit exceeded. No more role definitions can be created," see [Troubleshoot Azure RBAC (role-based access control)](../../role-based-access-control/troubleshooting.md).


## Create an Azure Compute Gallery 

If you don't already have an Azure Compute Gallery, you need to create one.

```azurepowershell-interactive
$sigGalleryName= "myaibsig01"
$imageDefName ="win10avd"

# Create the gallery
New-AzGallery -GalleryName $sigGalleryName -ResourceGroupName $imageResourceGroup  -Location $location

# Create the gallery definition
New-AzGalleryImageDefinition -GalleryName $sigGalleryName -ResourceGroupName $imageResourceGroup -Location $location -Name $imageDefName -OsState generalized -OsType Windows -Publisher 'myCo' -Offer 'Windows' -Sku '10avd'

```

## Configure the VM Image Builder template

For this example, we've prepared a template that downloads and updates the VM Image Builder template with the parameters that were specified earlier. The template installs FSLogix, operating system optimizations, and Microsoft Teams, and it runs Windows Update at the end.

If you open the template, you can see in the source property the image that's being used. In this example, it uses a Windows 10 multi-session image. 

### Windows 10 images
You should be aware of two key types of images: multi-session and single-session.

Multi-session images are intended for pooled usage. Here's an example of the image details in Azure:

```json
"publisher": "MicrosoftWindowsDesktop",
"offer": "Windows-10",
"sku": "20h2-avd",
"version": "latest"
```

Single-session images are intended for individual usage. Here's an example of the image details in Azure:

```json
"publisher": "MicrosoftWindowsDesktop",
"offer": "Windows-10",
"sku": "19h2-ent",
"version": "latest"
```

You can also change which Windows 10 images are available:

```azurepowershell-interactive
Get-AzVMImageSku -Location westus2 -PublisherName MicrosoftWindowsDesktop -Offer windows-10
```

## Download and configure the template

Now, download the template and configure it for your own use.

```azurepowershell-interactive
$templateUrl="https://raw.githubusercontent.com/azure/azvmimagebuilder/main/solutions/14_Building_Images_WVD/armTemplateWVD.json"
$templateFilePath = "armTemplateWVD.json"

Invoke-WebRequest -Uri $templateUrl -OutFile $templateFilePath -UseBasicParsing

((Get-Content -path $templateFilePath -Raw) -replace '<subscriptionID>',$subscriptionID) | Set-Content -Path $templateFilePath
((Get-Content -path $templateFilePath -Raw) -replace '<rgName>',$imageResourceGroup) | Set-Content -Path $templateFilePath
((Get-Content -path $templateFilePath -Raw) -replace '<region>',$location) | Set-Content -Path $templateFilePath
((Get-Content -path $templateFilePath -Raw) -replace '<runOutputName>',$runOutputName) | Set-Content -Path $templateFilePath

((Get-Content -path $templateFilePath -Raw) -replace '<imageDefName>',$imageDefName) | Set-Content -Path $templateFilePath
((Get-Content -path $templateFilePath -Raw) -replace '<sharedImageGalName>',$sigGalleryName) | Set-Content -Path $templateFilePath
((Get-Content -path $templateFilePath -Raw) -replace '<region1>',$location) | Set-Content -Path $templateFilePath
((Get-Content -path $templateFilePath -Raw) -replace '<imgBuilderId>',$identityNameResourceId) | Set-Content -Path $templateFilePath

```

Feel free to view the [template](https://raw.githubusercontent.com/azure/azvmimagebuilder/main/solutions/14_Building_Images_WVD/armTemplateWVD.json). All the code is viewable.


## Submit the template

Your template must be submitted to the service. Doing so downloads any dependent artifacts, such as scripts, and validates, checks permissions, and stores them in the staging resource group, which is prefixed with *IT_*.

```azurepowershell-interactive
New-AzResourceGroupDeployment -ResourceGroupName $imageResourceGroup -TemplateFile $templateFilePath -TemplateParameterObject @{"api-Version" = "2020-02-14"; "imageTemplateName" = $imageTemplateName; "svclocation" = $location}

# Optional - if you have any errors running the preceding command, run:
$getStatus=$(Get-AzImageBuilderTemplate -ResourceGroupName $imageResourceGroup -Name $imageTemplateName)
$getStatus.ProvisioningErrorCode 
$getStatus.ProvisioningErrorMessage
```
 
## Build the image

```azurepowershell-interactive
Start-AzImageBuilderTemplate -ResourceGroupName $imageResourceGroup -Name $imageTemplateName -NoWait
```

> [!NOTE]
> The command doesn't wait for the VM Image Builder service to complete the image build, so you can query the status as shown here.

```azurepowershell-interactive
$getStatus=$(Get-AzImageBuilderTemplate -ResourceGroupName $imageResourceGroup -Name $imageTemplateName)

# Shows all the properties
$getStatus | Format-List -Property *

# Shows the status of the build
$getStatus.LastRunStatusRunState 
$getStatus.LastRunStatusMessage
$getStatus.LastRunStatusRunSubState
```
## Create a VM

Now that the image is built, you can build a VM from it. Use the examples from [New-AzVM (Az PowerShell module.Compute)](/powershell/module/az.compute/new-azvm#examples).

## Clean up your resources

If you no longer need the resources that were created during this process, you can delete them by doing the following:

> [!IMPORTANT]
> Delete the resource group template first. If you delete only the resource group, the staging resource group (*IT_*) that's used by VM Image Builder won't be cleaned up.

1. Remove the VM Image Builder template.

    ```azurepowershell-interactive
    Remove-AzImageBuilderTemplate -ResourceGroupName $imageResourceGroup -Name vd10ImageTemplate
    ```

1. Delete the role assignment.

    ```azurepowershell-interactive
    Remove-AzRoleAssignment -ObjectId $identityNamePrincipalId -RoleDefinitionName $imageRoleDefName -Scope "/subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup"

    ## Remove the definitions
    Remove-AzRoleDefinition -Name "$identityNamePrincipalId" -Force -Scope "/subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup"

    ## Delete the identity
    Remove-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName -Force
    ```

1. Delete the resource group.

    ```azurepowershell-interactive
    Remove-AzResourceGroup $imageResourceGroup -Force
    ```

## Next steps

To try more VM Image Builder examples, go to [GitHub](https://github.com/azure/azvmimagebuilder/tree/main/quickquickstarts).

