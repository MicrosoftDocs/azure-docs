---
title: Create a Windows VM with Azure Image Builder using PowerShell
description: Create a Windows VM with the Azure Image Builder PowerShell module.
author: kof-f
ms.author: kofiforson
ms.reviewer: cynthn
ms.date: 03/02/2021
ms.topic: how-to
ms.service: virtual-machines
ms.subervice: image-builder
ms.colletion: windows
ms.custom: devx-track-azurepowershell
---
# Create a Windows VM with Azure Image Builder using PowerShell

This article demonstrates how you can create a customized Windows image using the Azure VM Image
Builder PowerShell module.


## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

If you choose to use PowerShell locally, this article requires that you install the Az PowerShell
module and connect to your Azure account using the
[Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount)
cmdlet. For more information about installing the Az PowerShell module, see
[Install Azure PowerShell](/powershell/azure/install-az-ps).

[!INCLUDE [cloud-shell-try-it](../../../includes/cloud-shell-try-it.md)]

If you have multiple Azure subscriptions, choose the appropriate subscription in which the resources
should be billed. Select a specific subscription using the
[Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet.

```azurepowershell-interactive
Set-AzContext -SubscriptionId 00000000-0000-0000-0000-000000000000
```

### Register features

Register the following resource providers for use with your Azure subscription if they
aren't already registered.

- Microsoft.Compute
- Microsoft.KeyVault
- Microsoft.Storage
- Microsoft.Network
- Microsoft.VirtualMachineImages

```azurepowershell-interactive
Get-AzResourceProvider -ProviderNamespace Microsoft.Compute, Microsoft.KeyVault, Microsoft.Storage, Microsoft.VirtualMachineImages, Microsoft.Network |
  Where-Object RegistrationState -ne Registered |
    Register-AzResourceProvider
```

## Define variables

You'll be using several pieces of information repeatedly. Create variables to store the information.

```azurepowershell-interactive
# Destination image resource group name
$imageResourceGroup = 'myWinImgBuilderRG'

# Azure region
$location = 'WestUS2'

# Name of the image to be created
$imageTemplateName = 'myWinImage'

# Distribution properties of the managed image upon completion
$runOutputName = 'myDistResults'
```

Create a variable for your Azure subscription ID. To confirm that the `subscriptionID` variable
contains your subscription ID, you can run the second line in the following example.

```azurepowershell-interactive
# Your Azure Subscription ID
$subscriptionID = (Get-AzContext).Subscription.Id
Write-Output $subscriptionID
```

## Create a resource group

Create an [Azure resource group](../../azure-resource-manager/management/overview.md)
using the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup)
cmdlet. A resource group is a logical container in which Azure resources are deployed and managed as
a group.

The following example creates a resource group based on the name in the `$imageResourceGroup`
variable in the region specified in the `$location` variable. This resource group is used to store
the image configuration template artifact and the image.

```azurepowershell-interactive
New-AzResourceGroup -Name $imageResourceGroup -Location $location
```

## Create user identity and set role permissions

Grant Azure image builder permissions to create images in the specified resource group using the
following example. Without this permission, the image build process won't complete successfully.

Create variables for the role definition and identity names. These values must be unique.

```azurepowershell-interactive
[int]$timeInt = $(Get-Date -UFormat '%s')
$imageRoleDefName = "Azure Image Builder Image Def $timeInt"
$identityName = "myIdentity$timeInt"
```

Create a user identity.

```azurepowershell-interactive
New-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName
```

Store the identity resource and principal IDs in variables.

```azurepowershell-interactive
$identityNameResourceId = (Get-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName).Id
$identityNamePrincipalId = (Get-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName).PrincipalId
```

### Assign permissions for identity to distribute images

Download .json config file and modify it based on the settings defined in this article.

```azurepowershell-interactive
$myRoleImageCreationUrl = 'https://raw.githubusercontent.com/azure/azvmimagebuilder/master/solutions/12_Creating_AIB_Security_Roles/aibRoleImageCreation.json'
$myRoleImageCreationPath = "$env:TEMP\myRoleImageCreation.json"

Invoke-WebRequest -Uri $myRoleImageCreationUrl -OutFile $myRoleImageCreationPath -UseBasicParsing

$Content = Get-Content -Path $myRoleImageCreationPath -Raw
$Content = $Content -replace '<subscriptionID>', $subscriptionID
$Content = $Content -replace '<rgName>', $imageResourceGroup
$Content = $Content -replace 'Azure Image Builder Service Image Creation Role', $imageRoleDefName
$Content | Out-File -FilePath $myRoleImageCreationPath -Force
```

Create the role definition.

```azurepowershell-interactive
New-AzRoleDefinition -InputFile $myRoleImageCreationPath
```

Grant the role definition to the image builder service principal.

```azurepowershell-interactive
$RoleAssignParams = @{
  ObjectId = $identityNamePrincipalId
  RoleDefinitionName = $imageRoleDefName
  Scope = "/subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup"
}
New-AzRoleAssignment @RoleAssignParams
```

> [!NOTE]
> If you receive the error: "_New-AzRoleDefinition: Role definition limit exceeded. No more role
> definitions can be created._", see
> [Troubleshoot Azure RBAC](../../role-based-access-control/troubleshooting.md).

## Create a Shared Image Gallery

Create the gallery.

```azurepowershell-interactive
$myGalleryName = 'myImageGallery'
$imageDefName = 'winSvrImages'

New-AzGallery -GalleryName $myGalleryName -ResourceGroupName $imageResourceGroup -Location $location
```

Create a gallery definition.

```azurepowershell-interactive
$GalleryParams = @{
  GalleryName = $myGalleryName
  ResourceGroupName = $imageResourceGroup
  Location = $location
  Name = $imageDefName
  OsState = 'generalized'
  OsType = 'Windows'
  Publisher = 'myCo'
  Offer = 'Windows'
  Sku = 'Win2019'
}
New-AzGalleryImageDefinition @GalleryParams
```

## Create an image

Create an Azure image builder source object. See
[Find Windows VM images in the Azure Marketplace with Azure PowerShell](./cli-ps-findimage.md)
for valid parameter values.

```azurepowershell-interactive
$SrcObjParams = @{
  SourceTypePlatformImage = $true
  Publisher = 'MicrosoftWindowsServer'
  Offer = 'WindowsServer'
  Sku = '2019-Datacenter'
  Version = 'latest'
}
$srcPlatform = New-AzImageBuilderSourceObject @SrcObjParams
```

Create an Azure image builder distributor object.

```azurepowershell-interactive
$disObjParams = @{
  SharedImageDistributor = $true
  ArtifactTag = @{tag='dis-share'}
  GalleryImageId = "/subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup/providers/Microsoft.Compute/galleries/$myGalleryName/images/$imageDefName"
  ReplicationRegion = $location
  RunOutputName = $runOutputName
  ExcludeFromLatest = $false
}
$disSharedImg = New-AzImageBuilderDistributorObject @disObjParams
```

Create an Azure image builder customization object.

```azurepowershell-interactive
$ImgCustomParams01 = @{
  PowerShellCustomizer = $true
  CustomizerName = 'settingUpMgmtAgtPath'
  RunElevated = $false
  Inline = @("mkdir c:\\buildActions", "mkdir c:\\buildArtifacts", "echo Azure-Image-Builder-Was-Here  > c:\\buildActions\\buildActionsOutput.txt")
}
$Customizer01 = New-AzImageBuilderCustomizerObject @ImgCustomParams01
```

Create a second Azure image builder customization object.

```azurepowershell-interactive
$ImgCustomParams02 = @{
  FileCustomizer = $true
  CustomizerName = 'downloadBuildArtifacts'
  Destination = 'c:\\buildArtifacts\\index.html'
  SourceUri = 'https://raw.githubusercontent.com/azure/azvmimagebuilder/master/quickquickstarts/exampleArtifacts/buildArtifacts/index.html'
}
$Customizer02 = New-AzImageBuilderCustomizerObject @ImgCustomParams02
```

Create an Azure image builder template.

```azurepowershell-interactive
$ImgTemplateParams = @{
  ImageTemplateName = $imageTemplateName
  ResourceGroupName = $imageResourceGroup
  Source = $srcPlatform
  Distribute = $disSharedImg
  Customize = $Customizer01, $Customizer02
  Location = $location
  UserAssignedIdentityId = $identityNameResourceId
}
New-AzImageBuilderTemplate @ImgTemplateParams
```

When complete, a message is returned and an image builder configuration template is created in the
`$imageResourceGroup`.

To determine if the template creation process was successful, you can use the following example.

```azurepowershell-interactive
Get-AzImageBuilderTemplate -ImageTemplateName $imageTemplateName -ResourceGroupName $imageResourceGroup |
  Select-Object -Property Name, LastRunStatusRunState, LastRunStatusMessage, ProvisioningState
```

In the background, image builder also creates a staging resource group in your subscription. This
resource group is used for the image build. It's in the format:
`IT_<DestinationResourceGroup>_<TemplateName>`.

> [!WARNING]
> Do not delete the staging resource group directly. Delete the image template artifact, this will
> cause the staging resource group to be deleted.

If the service reports a failure during the image configuration template submission:

- See [Troubleshooting Azure VM Image Build (AIB) Failures](../linux/image-builder-troubleshoot.md).
- Delete the template using the following example before you retry.

```azurepowershell-interactive
Remove-AzImageBuilderTemplate -ImageTemplateName $imageTemplateName -ResourceGroupName $imageResourceGroup
```

## Start the image build

Submit the image configuration to the VM image builder service.

```azurepowershell-interactive
Start-AzImageBuilderTemplate -ResourceGroupName $imageResourceGroup -Name $imageTemplateName
```

Wait for the image build process to complete. This step could take up to an hour.

If you encounter errors, review [Troubleshooting Azure VM Image Build (AIB) Failures](../linux/image-builder-troubleshoot.md).

## Create a VM

Store login credentials for the VM in a variable. The password must be complex.

```azurepowershell-interactive
$Cred = Get-Credential
```

Create the VM using the image you created.

```azurepowershell-interactive
$ArtifactId = (Get-AzImageBuilderRunOutput -ImageTemplateName $imageTemplateName -ResourceGroupName $imageResourceGroup).ArtifactId

New-AzVM -ResourceGroupName $imageResourceGroup -Image $ArtifactId -Name myWinVM01 -Credential $Cred
```

## Verify the customizations

Create a Remote Desktop connection to the VM using the username and password you set when you
created the VM. Inside the VM, open PowerShell and run `Get-Content` as shown in the following example:

```azurepowershell-interactive
Get-Content -Path C:\buildActions\buildActionsOutput.txt
```

You should see output based on the contents of the file created during the image customization
process.

```Output
Azure-Image-Builder-Was-Here
```

From the same PowerShell session, verify that the second customization completed successfully by checking
for the presence of the file `c:\buildArtifacts\index.html` as shown in the following example:

```azurepowershell-interactive
Get-ChildItem c:\buildArtifacts\
```

The result should be a directory listing showing the file downloaded during the image customization
process.

```Output
    Directory: C:\buildArtifacts

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a---          29/01/2021    10:04            276 index.html
```


## Clean up resources

If the resources created in this article aren't needed, you can delete them by running the following
examples.

### Delete the image builder template

```azurepowershell-interactive
Remove-AzImageBuilderTemplate -ResourceGroupName $imageResourceGroup -Name $imageTemplateName
```

### Delete the image resource group

> [!CAUTION]
> The following example deletes the specified resource group and all resources contained within it.
> If resources outside the scope of this article exist in the specified resource group, they will
> also be deleted.

```azurepowershell-interactive
Remove-AzResourceGroup -Name $imageResourceGroup
```

## Next steps

To learn more about the components of the .json file used in this article, see
[Image builder template reference](../linux/image-builder-json.md).
