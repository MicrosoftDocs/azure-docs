---
title: Configure Azure Image Builder Service permissions using PowerShell
description: Configure requirements for Azure VM Image Builder Service including permissions and privileges using PowerShell
author: danielsollondon
ms.author: danis
ms.date: 03/05/2021
ms.topic: article
ms.service: virtual-machines
ms.subservice: image-builder
ms.collection: linux
---

# Configure Azure Image Builder Service permissions using PowerShell

When you register for the (AIB), this grants the AIB Service permission to create, manage and delete a staging resource group (IT_*), and have rights to add resources to it, that are required for the image build. This is done by an AIB Service Principal Name (SPN) being made available in your subscription during a successful registration.

To allow Azure VM Image Builder to distribute images to either the managed images or to a Shared Image Gallery, you will need to create an Azure user-assigned identity that has permissions to read and write images. If you are accessing Azure storage, then this will need permissions to read private or public containers.

You must setup permissions and privileges prior to building an image. The following sections detail how to configure possible scenarios using PowerShell.

> [!IMPORTANT]
> Azure Image Builder is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Register the features

First, you must register for the Azure Image Builder Service. Registration grants the service permission to create, manage, and delete a staging resource group. The service also has rights to add resources the group that are required for the image build.

```powershell-interactive
Register-AzProviderFeature -FeatureName VirtualMachineTemplatePreview -ProviderNamespace Microsoft.VirtualMachineImages
```

## Create an Azure user-assigned managed identity

Azure Image Builder requires you to create an [Azure user-assigned managed identity](../../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-cli.md). The Azure Image Builder uses the user-assigned managed identity to read images, write images, and access Azure storage accounts. You grant the identity permission to do specific actions in your subscription.

> [!NOTE]
> Previously, Azure Image Builder used the Azure Image Builder service principal name (SPN) to grant permissions to the image resource groups. Using the SPN will be deprecated. Use a user-assigned managed identity instead.

The following example shows you how to create an Azure user-assigned managed identity. Replace the placeholder settings to set your variables.

| Setting | Description |
|---------|-------------|
| \<Resource group\> | Resource group where to create the user-assigned managed identity. |

```powershell-interactive
## Add AZ PS module to support AzUserAssignedIdentity
Install-Module -Name Az.ManagedServiceIdentity

$parameters = @{
    Name = 'aibIdentity'
    ResourceGroupName = '<Resource group>'
}
# create identity
New-AzUserAssignedIdentity @parameters
```

For more information about Azure user-assigned identities, see the [Azure user-assigned managed identity](../../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-cli.md) documentation on how to create an identity.

## Allow Image Builder to distribute images

For Azure Image Builder to distribute images (Managed Images / Shared Image Gallery), the Azure Image Builder service must be allowed to inject the images into these resource groups. To grant the required permissions, you need to create a user-assigned managed identity and grant it rights on the resource group where the image is built. Azure Image Builder **does not** have permission to access resources in other resource groups in the subscription. You need to take explicit actions to allow access to avoid your builds from failing.

You don't need to grant the user-assigned managed identity contributor rights on the resource group to distribute images. However, the user-assigned managed identity needs the following Azure `Actions` permissions in the distribution resource group:

```Actions
Microsoft.Compute/images/write
Microsoft.Compute/images/read
Microsoft.Compute/images/delete
```

If distributing to a shared image gallery, you also need:

```Actions
Microsoft.Compute/galleries/read
Microsoft.Compute/galleries/images/read
Microsoft.Compute/galleries/images/versions/read
Microsoft.Compute/galleries/images/versions/write
```

## Permission to customize existing images

For Azure Image Builder to build images from source custom images (Managed Images / Shared Image Gallery), the Azure Image Builder service must be allowed to read the images into these resource groups. To grant the required permissions, you need to create a user-assigned managed identity and grant it rights on the resource group where the image is located.

Build from an existing custom image:

```Actions
Microsoft.Compute/galleries/read
```

Build from an existing Shared Image Gallery version:

```Actions
Microsoft.Compute/galleries/read
Microsoft.Compute/galleries/images/read
Microsoft.Compute/galleries/images/versions/read
```

## Permission to customize images on your VNETs

Azure Image Builder has the capability to deploy and use an existing VNET in your subscription, thus allowing customizations access to connected resources.

You don't need to grant the user-assigned managed identity contributor rights on the resource group to deploy a VM to an existing VNET. However, the user-assigned managed identity needs the following Azure `Actions` permissions on the VNET resource group:

```Actions
Microsoft.Network/virtualNetworks/read
Microsoft.Network/virtualNetworks/subnets/join/action
```

## Create an Azure role definition

The following examples create an Azure role definition from the actions described in the previous sections. The examples are applied at the resource group level. Evaluate and test if the examples are granular enough for your requirements. For your scenario, you may need to refine it to a specific shared image gallery.

The image actions allow read and write. Decide what is appropriate for your environment. For example, create a role to allow Azure Image Builder to read images from resource group *example-rg-1* and write images to resource group *example-rg-2*.

### Custom image Azure role example

The following example creates an Azure role to use and distribute a source custom image. You then grant the custom role to the user-assigned managed identity for Azure Image Builder.

To simplify the replacement of values in the example, set the following variables first. Replace the placeholder settings to set your variables.

| Setting | Description |
|---------|-------------|
| \<Subscription ID\> | Your Azure subscription ID |
| \<Resource group\> | Resource group for custom image |

```powershell-interactive
$sub_id = "<Subscription ID>"
# Resource group - For Preview, image builder will only support creating custom images in the same Resource Group as the source managed image.
$imageResourceGroup = "<Resource group>"
$identityName = "aibIdentity"

# Use a web request to download the sample JSON description
$sample_uri="https://raw.githubusercontent.com/azure/azvmimagebuilder/master/solutions/12_Creating_AIB_Security_Roles/aibRoleImageCreation.json"
$role_definition="aibRoleImageCreation.json"

Invoke-WebRequest -Uri $sample_uri -Outfile $role_definition -UseBasicParsing

# Create a unique role name to avoid clashes in the same Azure Active Directory domain
$timeInt=$(get-date -UFormat "%s")
$imageRoleDefName="Azure Image Builder Image Def"+$timeInt

# Update the JSON definition placeholders with variable values
((Get-Content -path $role_definition -Raw) -replace '<subscriptionID>',$sub_id) | Set-Content -Path $role_definition
((Get-Content -path $role_definition -Raw) -replace '<rgName>', $imageResourceGroup) | Set-Content -Path $role_definition
((Get-Content -path $role_definition -Raw) -replace 'Azure Image Builder Service Image Creation Role', $imageRoleDefName) | Set-Content -Path $role_definition

# Create a custom role from the aibRoleImageCreation.json description file. 
New-AzRoleDefinition -InputFile $role_definition

# Get the user-identity properties
$identityNameResourceId=$(Get-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName).Id
$identityNamePrincipalId=$(Get-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName).PrincipalId

# Grant the custom role to the user-assigned managed identity for Azure Image Builder.
$parameters = @{
    ObjectId = $identityNamePrincipalId
    RoleDefinitionName = $imageRoleDefName
    Scope = '/subscriptions/' + $sub_id + '/resourceGroups/' + $imageResourceGroup
}

New-AzRoleAssignment @parameters
```

### Existing VNET Azure role example

The following example creates an Azure role to use and distribute an existing VNET image. You then grant the custom role to the user-assigned managed identity for Azure Image Builder.

To simplify the replacement of values in the example, set the following variables first. Replace the placeholder settings to set your variables.

| Setting | Description |
|---------|-------------|
| \<Subscription ID\> | Your Azure subscription ID |
| \<Resource group\> | VNET resource group |

```powershell-interactive
$sub_id = "<Subscription ID>"
$res_group = "<Resource group>"
$identityName = "aibIdentity"

# Use a web request to download the sample JSON description
$sample_uri="https://raw.githubusercontent.com/azure/azvmimagebuilder/master/solutions/12_Creating_AIB_Security_Roles/aibRoleNetworking.json"
$role_definition="aibRoleNetworking.json"

Invoke-WebRequest -Uri $sample_uri -Outfile $role_definition -UseBasicParsing

# Create a unique role name to avoid clashes in the same AAD domain
$timeInt=$(get-date -UFormat "%s")
$networkRoleDefName="Azure Image Builder Network Def"+$timeInt

# Update the JSON definition placeholders with variable values
((Get-Content -path $role_definition -Raw) -replace '<subscriptionID>',$sub_id) | Set-Content -Path $role_definition
((Get-Content -path $role_definition -Raw) -replace '<vnetRgName>', $res_group) | Set-Content -Path $role_definition
((Get-Content -path $role_definition -Raw) -replace 'Azure Image Builder Service Networking Role',$networkRoleDefName) | Set-Content -Path $role_definition

# Create a custom role from the aibRoleNetworking.json description file
New-AzRoleDefinition -InputFile $role_definition

# Get the user-identity properties
$identityNameResourceId=$(Get-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName).Id
$identityNamePrincipalId=$(Get-AzUserAssignedIdentity -ResourceGroupName $imageResourceGroup -Name $identityName).PrincipalId

# Assign the custom role to the user-assigned managed identity for Azure Image Builder
$parameters = @{
    ObjectId = $identityNamePrincipalId
    RoleDefinitionName = $networkRoleDefName
    Scope = '/subscriptions/' + $sub_id + '/resourceGroups/' + $res_group
}

New-AzRoleAssignment @parameters
```

## Next steps

For more information, see [Azure Image Builder overview](../image-builder-overview.md).
