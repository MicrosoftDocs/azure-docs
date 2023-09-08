---
title: Use Azure VM Image Builder with a gallery for Windows VMs
description: Create Azure Shared Gallery image versions using VM Image Builder and Azure PowerShell.
author: kof-f
ms.author: kofiforson
ms.reviewer: erd
ms.date: 06/30/2023
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: image-builder
ms.collection: windows 
ms.custom: devx-track-azurepowershell
---
# Create a Windows image and distribute it to an Azure Compute Gallery 

**Applies to:** :heavy_check_mark: Windows VMs 

In this article, you learn how to use Azure VM Image Builder and Azure PowerShell to create an image version in an [Azure Compute Gallery](../shared-image-galleries.md) (formerly Shared Image Gallery) and then distribute the image globally. You can also do this by using the [Azure CLI](../linux/image-builder-gallery.md).

To configure the image, this article uses a JSON template, which you can find at [armTemplateWinSIG.json](https://raw.githubusercontent.com/azure/azvmimagebuilder/master/quickquickstarts/1_Creating_a_Custom_Win_Shared_Image_Gallery_Image/armTemplateWinSIG.json). You'll download and edit a local version of the template, so you'll also use a local PowerShell session.

To distribute the image to an Azure Compute Gallery, the template uses [sharedImage](../linux/image-builder-json.md#distribute-sharedimage) as the value for the `distribute` section of the template.

VM Image Builder automatically runs `Sysprep` to generalize the image. The command is a generic `Sysprep` command, and you can [override](../linux/image-builder-troubleshoot.md#vms-created-from-vm-image-builder-images-arent-created-successfully) it if you need to. 

Be aware of the number of times you layer customizations. You can run the `Sysprep` command a limited number of times on a single Windows image. After you've reached the `Sysprep` limit, you must re-create your Windows image. For more information, see [Limits on how many times you can run Sysprep](/windows-hardware/manufacture/desktop/sysprep--generalize--a-windows-installation#limits-on-how-many-times-you-can-run-sysprep). 


## Register the features

To use VM Image Builder, you need to register the features.

1. Check your provider registrations. Make sure that each one returns *Registered*.

   ```powershell
   Get-AzResourceProvider -ProviderNamespace Microsoft.VirtualMachineImages | Format-table -Property ResourceTypes,RegistrationState
   Get-AzResourceProvider -ProviderNamespace Microsoft.Storage | Format-table -Property ResourceTypes,RegistrationState 
   Get-AzResourceProvider -ProviderNamespace Microsoft.Compute | Format-table -Property ResourceTypes,RegistrationState
   Get-AzResourceProvider -ProviderNamespace Microsoft.KeyVault | Format-table -Property ResourceTypes,RegistrationState
   Get-AzResourceProvider -ProviderNamespace Microsoft.Network | Format-table -Property ResourceTypes,RegistrationState
   ```

1. If they don't return *Registered*, register the providers by running the following commands:

   ```powershell
   Register-AzResourceProvider -ProviderNamespace Microsoft.VirtualMachineImages
   Register-AzResourceProvider -ProviderNamespace Microsoft.Storage
   Register-AzResourceProvider -ProviderNamespace Microsoft.Compute
   Register-AzResourceProvider -ProviderNamespace Microsoft.KeyVault
   Register-AzResourceProvider -ProviderNamespace Microsoft.Network
   ```

1. Install PowerShell modules:

   ```powerShell
   'Az.ImageBuilder', 'Az.ManagedServiceIdentity' | ForEach-Object {Install-Module -Name $_ -AllowPrerelease}
   ```

## Create variables

Because you'll be using some pieces of information repeatedly, create some variables to store that information. 

Replace the values for the variables, such as `username` and `vmpassword`, with your own information.

```powershell
# Get existing context
$currentAzContext = Get-AzContext

# Get your current subscription ID. 
$subscriptionID=$currentAzContext.Subscription.Id

# Destination image resource group
$imageResourceGroup="aibwinsig"

# Location
$location="westus"

# Image distribution metadata reference name
$runOutputName="aibCustWinManImg02ro"

# Image template name
$imageTemplateName="helloImageTemplateWin02ps"

# Distribution properties object name (runOutput).
# This gives you the properties of the managed image on completion.
$runOutputName="winclientR01"

# Create a resource group for the VM Image Builder template and Azure Compute Gallery
New-AzResourceGroup `
   -Name $imageResourceGroup `
   -Location $location
```


## Create a user-assigned identity and set permissions on the resource group

VM Image Builder uses the provided [user-identity](../../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-powershell.md) to inject the image into Azure Compute Gallery. In this example, you create an Azure role definition with specific actions for distributing the image. The role definition is then assigned to the user identity.

```powershell
# setup role def names, these need to be unique
$timeInt=$(get-date -UFormat "%s")
$imageRoleDefName="Azure Image Builder Image Def"+$timeInt
$identityName="aibIdentity"+$timeInt

## Add an Azure PowerShell module to support AzUserAssignedIdentity
Install-Module -Name Az.ManagedServiceIdentity

# Create an identity
New-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName

$identityNameResourceId=$(Get-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName).Id
$identityNamePrincipalId=$(Get-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName).PrincipalId
```


### Assign permissions for the identity to distribute the images

Use this command to download an Azure role definition template, and then update it with the previously specified parameters.

```powershell
$aibRoleImageCreationUrl="https://raw.githubusercontent.com/azure/azvmimagebuilder/master/solutions/12_Creating_AIB_Security_Roles/aibRoleImageCreation.json"
$aibRoleImageCreationPath = "aibRoleImageCreation.json"

# Download the configuration
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

To use VM Image Builder with an Azure Compute Gallery, you need to have an existing gallery and image definition. VM Image Builder doesn't create the gallery and image definition for you.

If you don't already have a gallery and image definition to use, start by creating them. 

```powershell
# Gallery name
$sigGalleryName= "myIBSIG"

# Image definition name
$imageDefName ="winSvrimage"

# Additional replication region
$replRegion2="eastus"

# Create the gallery
New-AzGallery `
   -GalleryName $sigGalleryName `
   -ResourceGroupName $imageResourceGroup  `
   -Location $location

# Create the image definition
New-AzGalleryImageDefinition `
   -GalleryName $sigGalleryName `
   -ResourceGroupName $imageResourceGroup `
   -Location $location `
   -Name $imageDefName `
   -OsState generalized `
   -OsType Windows `
   -Publisher 'myCompany' `
   -Offer 'WindowsServer' `
   -Sku 'WinSrv2019'
```

## Download and configure the template

Download the JSON template and configure it with your variables.

```powershell

$templateFilePath = "armTemplateWinSIG.json"

Invoke-WebRequest `
   -Uri "https://raw.githubusercontent.com/azure/azvmimagebuilder/master/quickquickstarts/1_Creating_a_Custom_Win_Shared_Image_Gallery_Image/armTemplateWinSIG.json" `
   -OutFile $templateFilePath `
   -UseBasicParsing

(Get-Content -path $templateFilePath -Raw ) `
   -replace '<subscriptionID>',$subscriptionID | Set-Content -Path $templateFilePath
(Get-Content -path $templateFilePath -Raw ) `
   -replace '<rgName>',$imageResourceGroup | Set-Content -Path $templateFilePath
(Get-Content -path $templateFilePath -Raw ) `
   -replace '<runOutputName>',$runOutputName | Set-Content -Path $templateFilePath
(Get-Content -path $templateFilePath -Raw ) `
   -replace '<imageDefName>',$imageDefName | Set-Content -Path $templateFilePath
(Get-Content -path $templateFilePath -Raw ) `
   -replace '<sharedImageGalName>',$sigGalleryName | Set-Content -Path $templateFilePath
(Get-Content -path $templateFilePath -Raw ) `
   -replace '<region1>',$location | Set-Content -Path $templateFilePath
(Get-Content -path $templateFilePath -Raw ) `
   -replace '<region2>',$replRegion2 | Set-Content -Path $templateFilePath
((Get-Content -path $templateFilePath -Raw) -replace '<imgBuilderId>',$identityNameResourceId) | Set-Content -Path $templateFilePath
```


## Create the image version

Your template must be submitted to the service. The following commands will download any dependent artifacts, such as scripts, and store them in the staging resource group, which is prefixed with *IT_*.

```powershell
New-AzResourceGroupDeployment `
   -ResourceGroupName $imageResourceGroup `
   -TemplateFile $templateFilePath `
   -ApiVersion "2022-02-14" `
   -imageTemplateName $imageTemplateName `
   -svclocation $location
```

To build the image, invoke 'Run' on the template.

```powershell
Invoke-AzResourceAction `
   -ResourceName $imageTemplateName `
   -ResourceGroupName $imageResourceGroup `
   -ResourceType Microsoft.VirtualMachineImages/imageTemplates `
   -ApiVersion "2022-02-14" `
   -Action Run
```

Creating the image and replicating it to both regions can take a few moments. Before you begin creating a VM, wait until this part is finished.

```powershell
Get-AzImageBuilderTemplate -ImageTemplateName $imageTemplateName -ResourceGroupName $imageResourceGroup |
  Select-Object -Property Name, LastRunStatusRunState, LastRunStatusMessage, ProvisioningState
```

## Create the VM

Create a VM from the image version that you created with VM Image Builder.

1. Get the image version that you created:

   ```powershell
   $imageVersion = Get-AzGalleryImageVersion `
   -ResourceGroupName $imageResourceGroup `
   -GalleryName $sigGalleryName `
   -GalleryImageDefinitionName $imageDefName
   $imageVersionId = $imageVersion.Id
   ```

1. Create the VM in the second region, where the image was replicated:

   ```powershell
   $vmResourceGroup = "myResourceGroup"
   $vmName = "myVMfromImage"

   # Create user object
   $cred = Get-Credential -Message "Enter a username and password for the virtual machine."

   # Create a resource group
   New-AzResourceGroup -Name $vmResourceGroup -Location $replRegion2

   # Network pieces
   $subnetConfig = New-AzVirtualNetworkSubnetConfig -Name mySubnet -AddressPrefix 192.168.1.0/24
   $vnet = New-AzVirtualNetwork -ResourceGroupName $vmResourceGroup -Location $replRegion2 `
   -Name MYvNET -AddressPrefix 192.168.0.0/16 -Subnet $subnetConfig
   $pip = New-AzPublicIpAddress -ResourceGroupName $vmResourceGroup -Location $replRegion2 `
   -Name "mypublicdns$(Get-Random)" -AllocationMethod Static -IdleTimeoutInMinutes 4
   $nsgRuleRDP = New-AzNetworkSecurityRuleConfig -Name myNetworkSecurityGroupRuleRDP  -Protocol Tcp `
   -Direction Inbound -Priority 1000 -SourceAddressPrefix * -SourcePortRange * -DestinationAddressPrefix * `
   -DestinationPortRange 3389 -Access Deny
   $nsg = New-AzNetworkSecurityGroup -ResourceGroupName $vmResourceGroup -Location $replRegion2 `
   -Name myNetworkSecurityGroup -SecurityRules $nsgRuleRDP
   $nic = New-AzNetworkInterface -Name myNic -ResourceGroupName $vmResourceGroup -Location $replRegion2 `
   -SubnetId $vnet.Subnets[0].Id -PublicIpAddressId $pip.Id -NetworkSecurityGroupId $nsg.Id

   # Create a virtual machine configuration using $imageVersion.Id to specify the image
   $vmConfig = New-AzVMConfig -VMName $vmName -VMSize Standard_D1_v2 | `
   Set-AzVMOperatingSystem -Windows -ComputerName $vmName -Credential $cred | `
   Set-AzVMSourceImage -Id $imageVersion.Id | `
   Add-AzVMNetworkInterface -Id $nic.Id

   # Create a virtual machine
   New-AzVM -ResourceGroupName $vmResourceGroup -Location $replRegion2 -VM $vmConfig
   ```

## Verify the customization

Create a Remote Desktop connection to the VM by using the username and password that you set when you created the VM. In the VM, open a Command Prompt window and run the following command:

```console
dir c:\
```

You should see a directory named `buildActions` that was created during image customization.


## Clean up your resources

> [!NOTE]
> If you now want to try to recustomize the image version to create a new version of the same image, *skip the step outlined here* and go to [Use VM Image Builder to create another image version](image-builder-gallery-update-image-version.md).

If you no longer need the resources that you created as you followed the process in this article, you can delete them.

The following process deletes both the image that you created and all the other resource files. Make sure that you've finished this deployment before you delete the resources.

Delete the resource group template first. Otherwise, the staging resource group (*IT_*) that VM Image Builder uses won't be cleaned up.

1. Get the ResourceID of the image template. 

   ```powerShell
   $resTemplateId = Get-AzResource -ResourceName $imageTemplateName -ResourceGroupName $imageResourceGroup -ResourceType Microsoft.VirtualMachineImages/imageTemplates -ApiVersion "2022-02-14"
   ```

1. Delete image template.

   ```powerShell
   Remove-AzResource -ResourceId $resTemplateId.ResourceId -Force
   ```

1. Delete the role assignment.

   ```powerShell
   Remove-AzRoleAssignment -ObjectId $identityNamePrincipalId -RoleDefinitionName $imageRoleDefName -Scope "/subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup"
   ```

1. Remove the definitions.

   ```powerShell
   Remove-AzRoleDefinition -Name "$identityNamePrincipalId" -Force -Scope "/subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup"
   ```

1. Delete the identity.

   ```powerShell
   Remove-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName -Force
   ```

1. Delete the resource group.

   ```powerShell
   Remove-AzResourceGroup $imageResourceGroup -Force
   ```

## Next steps

To update the image version that you created in this article, see [Use VM Image Builder to create another image version](image-builder-gallery-update-image-version.md).   
