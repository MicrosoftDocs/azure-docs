---
title: Create a Windows VM with Azure VM Image Builder by using PowerShell
description: In this article, you create a Windows VM by using the VM Image Builder PowerShell module.
author: kof-f
ms.author: kofiforson
ms.reviewer: erd
ms.date: 11/10/2022
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: image-builder
ms.collection: windows
ms.custom: devx-track-azurepowershell
---
# Create a Windows VM with VM Image Builder by using PowerShell

**Applies to:** :heavy_check_mark: Windows VMs

This article demonstrates how to create a customized Windows VM image by using the Azure VM Image
Builder PowerShell module.


## Prerequisites

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

If you choose to use PowerShell locally, this article requires that you install the Azure PowerShell
module and connect to your Azure account by using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet. For more information, see [Install Azure PowerShell](/powershell/azure/install-azure-powershell).

Some of the steps require cmdlets from the [Az.ImageBuilder](https://www.powershellgallery.com/packages/Az.ImageBuilder) module. Install separately by using the following command.

```azurepowershell-interactive
Install-Module -Name Az.ImageBuilder
```

[!INCLUDE [cloud-shell-try-it](../../../includes/cloud-shell-try-it.md)]

If you have multiple Azure subscriptions, choose the appropriate subscription in which the resources
should be billed. Select a specific subscription by using the
[Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet.

```azurepowershell-interactive
Set-AzContext -SubscriptionId 00000000-0000-0000-0000-000000000000
```

### Register providers

If you haven't already done so, register the following resource providers to use with your Azure subscription:

- Microsoft.Compute
- Microsoft.KeyVault
- Microsoft.Storage
- Microsoft.Network
- Microsoft.VirtualMachineImages
- Microsoft.ManagedIdentity
- Microsoft.ContainerInstance

```azurepowershell-interactive
Get-AzResourceProvider -ProviderNamespace Microsoft.Compute, Microsoft.KeyVault, Microsoft.Storage, Microsoft.VirtualMachineImages, Microsoft.Network, Microsoft.ManagedIdentity |
  Where-Object RegistrationState -ne Registered |
    Register-AzResourceProvider
```

## Define variables

Because you'll be using some pieces of information repeatedly, create some variables to store that information:

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

Create a variable for your Azure subscription ID. To confirm that the `subscriptionID` variable contains your subscription ID, you can run the second line in the following example:

```azurepowershell-interactive
# Your Azure Subscription ID
$subscriptionID = (Get-AzContext).Subscription.Id
Write-Output $subscriptionID
```

## Create a resource group

Create an [Azure resource group](../../azure-resource-manager/management/overview.md) by using the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet. A resource group is a logical container in which Azure resources are deployed and managed as a group.

The following example creates a resource group that's based on the name in the `$imageResourceGroup` variable in the region that you've specified in the `$location` variable. This resource group is used to store the image configuration template artifact and the image.

```azurepowershell-interactive
New-AzResourceGroup -Name $imageResourceGroup -Location $location
```

## Create a user identity and set role permissions

Grant Azure image builder permissions to create images in the specified resource group by using the following example. Without this permission, the image build process won't finish successfully.

1. Create variables for the role definition and identity names. These values must be unique.

   ```azurepowershell-interactive
   [int]$timeInt = $(Get-Date -UFormat '%s')
   $imageRoleDefName = "Azure Image Builder Image Def $timeInt"
   $identityName = "myIdentity$timeInt"
   ```

1. Create a user identity.

   ```azurepowershell-interactive
   New-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName -Location $location
   ```

1. Store the identity resource and principal IDs in variables.

   ```azurepowershell-interactive
   $identityNameResourceId = (Get-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName).Id
   $identityNamePrincipalId = (Get-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName).PrincipalId
   ```

### Assign permissions for the identity to distribute the images

1. Download the JSON configuration file, and then modify it based on the settings that are defined in this article.

   ```azurepowershell-interactive
   $myRoleImageCreationUrl = 'https://raw.githubusercontent.com/azure/azvmimagebuilder/master/solutions/12_Creating_AIB_Security_Roles/aibRoleImageCreation.json'
   $myRoleImageCreationPath = "myRoleImageCreation.json"

   Invoke-WebRequest -Uri $myRoleImageCreationUrl -OutFile $myRoleImageCreationPath -UseBasicParsing

   $Content = Get-Content -Path $myRoleImageCreationPath -Raw
   $Content = $Content -replace '<subscriptionID>', $subscriptionID
   $Content = $Content -replace '<rgName>', $imageResourceGroup
   $Content = $Content -replace 'Azure Image Builder Service Image Creation Role', $imageRoleDefName
   $Content | Out-File -FilePath $myRoleImageCreationPath -Force
   ```

1. Create the role definition.

   ```azurepowershell-interactive
   New-AzRoleDefinition -InputFile $myRoleImageCreationPath
   ```

1. Grant the role definition to the VM Image Builder service principal.

   ```azurepowershell-interactive
   $RoleAssignParams = @{
     ObjectId = $identityNamePrincipalId
     RoleDefinitionName = $imageRoleDefName
     Scope = "/subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup"
   }
   New-AzRoleAssignment @RoleAssignParams
   ```

> [!NOTE]
> If you receive the error "New-AzRoleDefinition: Role definition limit exceeded. No more role definitions can be created," see [Troubleshoot Azure RBAC (role-based access control)](../../role-based-access-control/troubleshooting.md).

## Create an Azure Compute Gallery

1. Create the gallery.

   ```azurepowershell-interactive
   $myGalleryName = 'myImageGallery'
   $imageDefName = 'winSvrImages'

   New-AzGallery -GalleryName $myGalleryName -ResourceGroupName $imageResourceGroup -Location $location
   ```

1. Create a gallery definition.

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

1. Create a VM Image Builder source object. For valid parameter values, see [Find Windows VM images in Azure Marketplace with Azure PowerShell](./cli-ps-findimage.md).

   ```azurepowershell-interactive
   $SrcObjParams = @{
     PlatformImageSource = $true
     Publisher = 'MicrosoftWindowsServer'
     Offer = 'WindowsServer'
     Sku = '2019-Datacenter'
     Version = 'latest'
   }
   $srcPlatform = New-AzImageBuilderTemplateSourceObject @SrcObjParams
   ```

1. Create a VM Image Builder distributor object.

   ```azurepowershell-interactive
   $disObjParams = @{
     SharedImageDistributor = $true
     ArtifactTag = @{tag='dis-share'}
     GalleryImageId = "/subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup/providers/Microsoft.Compute/galleries/$myGalleryName/images/$imageDefName"
     ReplicationRegion = $location
     RunOutputName = $runOutputName
     ExcludeFromLatest = $false
   }
   $disSharedImg = New-AzImageBuilderTemplateDistributorObject @disObjParams
   ```

1. Create a VM Image Builder customization object.

   ```azurepowershell-interactive
   $ImgCustomParams01 = @{
     PowerShellCustomizer = $true
     Name = 'settingUpMgmtAgtPath'
     RunElevated = $false
     Inline = @("mkdir c:\\buildActions", "mkdir c:\\buildArtifacts", "echo Azure-Image-Builder-Was-Here  > c:\\buildActions\\buildActionsOutput.txt")
   }
   $Customizer01 = New-AzImageBuilderTemplateCustomizerObject @ImgCustomParams01
   ```

1. Create a second VM Image Builder customization object.

   ```azurepowershell-interactive
   $ImgCustomParams02 = @{
     FileCustomizer = $true
     Name = 'downloadBuildArtifacts'
     Destination = 'c:\\buildArtifacts\\index.html'
     SourceUri = 'https://raw.githubusercontent.com/azure/azvmimagebuilder/master/quickquickstarts/exampleArtifacts/buildArtifacts/index.html'
   }
   $Customizer02 = New-AzImageBuilderTemplateCustomizerObject @ImgCustomParams02
   ```

1. Create a VM Image Builder template.

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

When the template has been created, a message is returned, and a VM Image Builder configuration template is created in `$imageResourceGroup`.

To determine whether the template creation process was successful, use the following example:

```azurepowershell-interactive
Get-AzImageBuilderTemplate -ImageTemplateName $imageTemplateName -ResourceGroupName $imageResourceGroup |
  Select-Object -Property Name, LastRunStatusRunState, LastRunStatusMessage, ProvisioningState
```

In the background, VM Image Builder also creates a staging resource group in your subscription. This resource group is used for the image build. It's in the format `IT_<DestinationResourceGroup>_<TemplateName>`.

> [!WARNING]
> Don't delete the staging resource group directly. To cause the staging resource group to be deleted, delete the image template artifact.

If the service reports a failure when the image configuration template is submitted, do the following:

- See [Troubleshoot Azure VM Image Builder failures](../linux/image-builder-troubleshoot.md).
- Before you retry submitting the template, delete it by following this example:

  ```azurepowershell-interactive
  Remove-AzImageBuilderTemplate -ImageTemplateName $imageTemplateName -ResourceGroupName $imageResourceGroup
  ```

## Start the image build

Submit the image configuration to the VM Image Builder service by running the following command:

```azurepowershell-interactive
Start-AzImageBuilderTemplate -ResourceGroupName $imageResourceGroup -Name $imageTemplateName
```

Wait for the image building process to finish, which could take up to an hour.

If you encounter errors, review [Troubleshoot Azure VM Image Builder failures](../linux/image-builder-troubleshoot.md).

## Create a VM

1. Store the VM login credentials in a variable. The password must be complex.

   ```azurepowershell-interactive
   $Cred = Get-Credential
   ```

1. Create the VM by using the image you created.

   ```azurepowershell-interactive
   $ArtifactId = (Get-AzImageBuilderTemplateRunOutput -ImageTemplateName $imageTemplateName -ResourceGroupName $imageResourceGroup).ArtifactId

   New-AzVM -ResourceGroupName $imageResourceGroup -Image $ArtifactId -Name myWinVM01 -Credential $Cred
   ```

## Verify the customizations

1. Create a Remote Desktop connection to the VM by using the username and password that you set when you created the VM.

1. Inside the VM, open PowerShell and run `Get-Content`, as shown in the following example:

   ```azurepowershell-interactive
   Get-Content -Path C:\buildActions\buildActionsOutput.txt
   ```

   The output is based on the contents of the file that you created during the image customization process.

   ```Output
   Azure-Image-Builder-Was-Here
   ```

1. From the same PowerShell session, verify that the second customization finished successfully by checking for the presence of `c:\buildArtifacts\index.html`, as shown in the following example:

   ```azurepowershell-interactive
   Get-ChildItem c:\buildArtifacts\
   ```

   The result should be a directory listing showing that the file was downloaded during the image customization process.

   ```Output
       Directory: C:\buildArtifacts

   Mode                 LastWriteTime         Length Name
   ----                 -------------         ------ ----
   -a---          29/01/2021    10:04            276 index.html
   ```

## Clean up your resources

If you no longer need the resources that were created during this process, you can delete them by doing the following:

1. Delete the VM Image Builder template.

   ```azurepowershell-interactive
   Remove-AzImageBuilderTemplate -ResourceGroupName $imageResourceGroup -Name $imageTemplateName
   ```

1. Delete the image resource group.

   > [!CAUTION]
   > The following example deletes the specified resource group and all the resources that it contains. If any resources outside the scope of this article exist in the resource group, they'll also be deleted.

   ```azurepowershell-interactive
   Remove-AzResourceGroup -Name $imageResourceGroup
   ```

## Next steps

To learn more about the components of the JSON file that this article uses, see the [VM Image Builder template reference](../linux/image-builder-json.md).
