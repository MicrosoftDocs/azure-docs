---
title: Image Builder - Create a Windows Virtual Desktop image
description: Create an Azure VM image of Windows Virtual Desktop using Azure Image Builder in PowerShell.
author: danielsollondon
ms.author: danis
ms.reviewer: cynthn
ms.date: 01/27/2021
ms.topic: article
ms.service: virtual-machines-windows
ms.collection: windows
ms.subservice: imaging
---

# Create a Windows Virtual Desktop image using Azure VM Image Builder and PowerShell

This article shows you how to create a Windows Virtual Desktop image with these customizations:

* Installing [FsLogix](https://github.com/DeanCefola/Azure-WVD/blob/master/PowerShell/FSLogixSetup.ps1).
* Running a [Windows Virtual Desktop Optimization script](https://github.com/The-Virtual-Desktop-Team/Virtual-Desktop-Optimization-Tool) from the community repo.
* Install [Microsoft Teams](../../virtual-desktop/teams-on-wvd.md).
* [Restart](../linux/image-builder-json.md?bc=%2fazure%2fvirtual-machines%2fwindows%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json#windows-restart-customizer)
* Run [Windows Update](../linux/image-builder-json.md?bc=%2fazure%2fvirtual-machines%2fwindows%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json#windows-update-customizer)

We will show you how to automate this using the Azure VM Image Builder, and distribute the image to a [Shared Image Gallery](../shared-image-galleries.md), where you can replicate to other regions, control the scale, and share the image inside and outside your organizations.


To simplify deploying an Image Builder configuration, this example uses an Azure Resource Manager template with the Image Builder template nested inside. This gives you some other benefits, like variables and parameter inputs. You can also pass parameters from the command line.

This article is intended to be a copy and paste exercise.

> [!NOTE]
> The scripts to install the apps are located on [GitHub](https://github.com/danielsollondon/azvmimagebuilder/tree/master/solutions/14_Building_Images_WVD). They are for illustration and testing only, and not for production workloads. 

## Tips for building Windows images 

- VM Size - the default VM size is a `Standard_D1_v2`, which is not suitable for Windows. Use a `Standard_D2_v2` or greater.
- This example uses the [PowerShell customizer scripts](../linux/image-builder-json.md). You need to use these settings or the build will stop responding.

    ```json
      "runElevated": true,
      "runAsSystem": true,
    ```

    For example:

    ```json
      {
          "type": "PowerShell",
          "name": "installFsLogix",
          "runElevated": true,
          "runAsSystem": true,
          "scriptUri": "https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/solutions/14_Building_Images_WVD/0_installConfFsLogix.ps1"
    ```
- Comment your code - The AIB build log (customization.log) is extremely verbose, if you comment your scripts using 'write-host' these will be sent to the logs, and make troubleshooting easier.

    ```PowerShell
     write-host 'AIB Customization: Starting OS Optimizations script'
    ```

- Exit Codes - AIB expects all scripts to return a 0 exit code, any non-zero exit code will result in AIB failing the customization and stopping the build. If you have complex scripts, add instrumentation and emit exit codes, these will be shown in the customization.log.

    ```PowerShell
     Write-Host "Exit code: " $LASTEXITCODE
    ```
- Test: Please test and test your code before on a standalone VM, ensure there are no user prompts, you are using the right privilege etc.

- Networking - `Set-NetAdapterAdvancedProperty`. This is being set in the optimization script, but fails the AIB build, as it disconnects the network, this is commented out. It is under investigation.

## Prerequisites

You must have the latest Azure PowerShell CmdLets installed, see [here](/powershell/azure/overview) for install details.

```PowerShell
# Register for Azure Image Builder Feature
Register-AzProviderFeature -FeatureName VirtualMachineTemplatePreview -ProviderNamespace Microsoft.VirtualMachineImages

Get-AzProviderFeature -FeatureName VirtualMachineTemplatePreview -ProviderNamespace Microsoft.VirtualMachineImages

# wait until RegistrationState is set to 'Registered'

# check you are registered for the providers, ensure RegistrationState is set to 'Registered'.
Get-AzResourceProvider -ProviderNamespace Microsoft.VirtualMachineImages
Get-AzResourceProvider -ProviderNamespace Microsoft.Storage 
Get-AzResourceProvider -ProviderNamespace Microsoft.Compute
Get-AzResourceProvider -ProviderNamespace Microsoft.KeyVault

# If they do not saw registered, run the commented out code below.

## Register-AzResourceProvider -ProviderNamespace Microsoft.VirtualMachineImages
## Register-AzResourceProvider -ProviderNamespace Microsoft.Storage
## Register-AzResourceProvider -ProviderNamespace Microsoft.Compute
## Register-AzResourceProvider -ProviderNamespace Microsoft.KeyVault
```

## Set up environment and variables

```azurepowershell-interactive
# Step 1: Import module
Import-Module Az.Accounts

# Step 2: get existing context
$currentAzContext = Get-AzContext

# destination image resource group
$imageResourceGroup="wvdImageDemoRg"

# location (see possible locations in main docs)
$location="westus2"

# your subscription, this will get your current subscription
$subscriptionID=$currentAzContext.Subscription.Id

# image template name
$imageTemplateName="wvd10ImageTemplate01"

# distribution properties object name (runOutput), i.e. this gives you the properties of the managed image on completion
$runOutputName="sigOutput"

# create resource group
New-AzResourceGroup -Name $imageResourceGroup -Location $location
```

## Permissions, user identity and role 


 Create a user identity.

```azurepowershell-interactive
# setup role def names, these need to be unique
$timeInt=$(get-date -UFormat "%s")
$imageRoleDefName="Azure Image Builder Image Def"+$timeInt
$idenityName="aibIdentity"+$timeInt

## Add AZ PS modules to support AzUserAssignedIdentity and Az AIB
'Az.ImageBuilder', 'Az.ManagedServiceIdentity' | ForEach-Object {Install-Module -Name $_ -AllowPrerelease}

# create identity
New-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $idenityName

$idenityNameResourceId=$(Get-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $idenityName).Id
$idenityNamePrincipalId=$(Get-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $idenityName).PrincipalId

```

Assign permissions to the identity to distribute images. This command will download and update the template with the parameters specified earlier.

```azurepowershell-interactive
$aibRoleImageCreationUrl="https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/solutions/12_Creating_AIB_Security_Roles/aibRoleImageCreation.json"
$aibRoleImageCreationPath = "aibRoleImageCreation.json"

# download config
Invoke-WebRequest -Uri $aibRoleImageCreationUrl -OutFile $aibRoleImageCreationPath -UseBasicParsing

((Get-Content -path $aibRoleImageCreationPath -Raw) -replace '<subscriptionID>',$subscriptionID) | Set-Content -Path $aibRoleImageCreationPath
((Get-Content -path $aibRoleImageCreationPath -Raw) -replace '<rgName>', $imageResourceGroup) | Set-Content -Path $aibRoleImageCreationPath
((Get-Content -path $aibRoleImageCreationPath -Raw) -replace 'Azure Image Builder Service Image Creation Role', $imageRoleDefName) | Set-Content -Path $aibRoleImageCreationPath

# create role definition
New-AzRoleDefinition -InputFile  ./aibRoleImageCreation.json

# grant role definition to image builder service principal
New-AzRoleAssignment -ObjectId $idenityNamePrincipalId -RoleDefinitionName $imageRoleDefName -Scope "/subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup"
```

> [!NOTE] 
> If you see this error: 'New-AzRoleDefinition: Role definition limit exceeded. No more role definitions can be created.' see this article to resolve: https://docs.microsoft.com/azure/role-based-access-control/troubleshooting.



## Create the Shared Image Gallery 

If you don't already have a Shared Image Gallery, you need to create one.

```azurepowershell-interactive
$sigGalleryName= "myaibsig01"
$imageDefName ="win10wvd"

# create gallery
New-AzGallery -GalleryName $sigGalleryName -ResourceGroupName $imageResourceGroup  -Location $location

# create gallery definition
New-AzGalleryImageDefinition -GalleryName $sigGalleryName -ResourceGroupName $imageResourceGroup -Location $location -Name $imageDefName -OsState generalized -OsType Windows -Publisher 'myCo' -Offer 'Windows' -Sku '10wvd'

```

## Configure the Image Template

For this example, we have a template ready to that will download and update the template with the parameters specified earlier, it will install FsLogix, OS optimizations, Microsoft Teams, and run Windows Update at the end.

If you open the template you can see in the source property the image that is being used, in this example it uses a Win 10 Multi session image. 

### Windows 10 images
Two key types you should be aware of: multisession and single-session.

Multi session images are intended for pooled usage. Here is an example of the image details in Azure:

```json
"publisher": "MicrosoftWindowsDesktop",
"offer": "Windows-10",
"sku": "20h2-evd",
"version": "latest"
```

Single session images are intend for individual usage. Here is an example of the image details in Azure:

```json
"publisher": "MicrosoftWindowsDesktop",
"offer": "Windows-10",
"sku": "19h2-ent",
"version": "latest"
```

You can also change the Win10 images available:

```azurepowershell-interactive
Get-AzVMImageSku -Location westus2 -PublisherName MicrosoftWindowsDesktop -Offer windows-10
```

## Download template and configure

Now, you need to download the template and configure it for your use.

```azurepowershell-interactive
$templateUrl="https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/solutions/14_Building_Images_WVD/armTemplateWVD.json"
$templateFilePath = "armTemplateWVD.json"

Invoke-WebRequest -Uri $templateUrl -OutFile $templateFilePath -UseBasicParsing

((Get-Content -path $templateFilePath -Raw) -replace '<subscriptionID>',$subscriptionID) | Set-Content -Path $templateFilePath
((Get-Content -path $templateFilePath -Raw) -replace '<rgName>',$imageResourceGroup) | Set-Content -Path $templateFilePath
((Get-Content -path $templateFilePath -Raw) -replace '<region>',$location) | Set-Content -Path $templateFilePath
((Get-Content -path $templateFilePath -Raw) -replace '<runOutputName>',$runOutputName) | Set-Content -Path $templateFilePath

((Get-Content -path $templateFilePath -Raw) -replace '<imageDefName>',$imageDefName) | Set-Content -Path $templateFilePath
((Get-Content -path $templateFilePath -Raw) -replace '<sharedImageGalName>',$sigGalleryName) | Set-Content -Path $templateFilePath
((Get-Content -path $templateFilePath -Raw) -replace '<region1>',$location) | Set-Content -Path $templateFilePath
((Get-Content -path $templateFilePath -Raw) -replace '<imgBuilderId>',$idenityNameResourceId) | Set-Content -Path $templateFilePath

```

Feel free to view the [template](https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/solutions/14_Building_Images_WVD/armTemplateWVD.json), all the code is viewable.


## Submit the template

Your template must be submitted to the service, this will download any dependent artifacts (like scripts), validate, check permissions, and store them in the staging Resource Group, prefixed, *IT_*.

```azurepowershell-interactive
New-AzResourceGroupDeployment -ResourceGroupName $imageResourceGroup -TemplateFile $templateFilePath -api-version "2020-02-14" -imageTemplateName $imageTemplateName -svclocation $location

# Optional - if you have any errors running the above, run:
$getStatus=$(Get-AzImageBuilderTemplate -ResourceGroupName $imageResourceGroup -Name $imageTemplateName)
$getStatus.ProvisioningErrorCode 
$getStatus.ProvisioningErrorMessage
```
 
## Build the image
```azurepowershell-interactive
Start-AzImageBuilderTemplate -ResourceGroupName $imageResourceGroup -Name $imageTemplateName -NoWait
```

> [!NOTE]
> The command will not wait for the image builder service to complete the image build, you can query the status below.

```azurepowershell-interactive
$getStatus=$(Get-AzImageBuilderTemplate -ResourceGroupName $imageResourceGroup -Name $imageTemplateName)

# this shows all the properties
$getStatus | Format-List -Property *

# these show the status the build
$getStatus.LastRunStatusRunState 
$getStatus.LastRunStatusMessage
$getStatus.LastRunStatusRunSubState
```
## Create a VM
Now the build is finished you can build a VM from the image, use the examples from [here](/powershell/module/az.compute/new-azvm#examples).

## Clean up

Delete the resource group template first, do not just delete the entire resource group, otherwise the staging resource group (*IT_*) used by AIB will not be cleaned up.

Remove the Image Template.

```azurepowershell-interactive
Remove-AzImageBuilderTemplate -ResourceGroupName $imageResourceGroup -Name wvd10ImageTemplate
```

Delete the role assignment.

```azurepowershell-interactive
Remove-AzRoleAssignment -ObjectId $idenityNamePrincipalId -RoleDefinitionName $imageRoleDefName -Scope "/subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup"

## remove definitions
Remove-AzRoleDefinition -Name "$idenityNamePrincipalId" -Force -Scope "/subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup"

## delete identity
Remove-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $idenityName -Force
```

Delete the resource group.

```azurepowershell-interactive
Remove-AzResourceGroup $imageResourceGroup -Force
```

## Next steps

You can try more examples [on GitHub](https://github.com/danielsollondon/azvmimagebuilder/tree/master/quickquickstarts).