---
title: Configure Azure Image Builder Service Permissions using PowerShell
description: Configure requirements for Azure VM Image Builder Service including permissions and privileges using PowerShell
author: cynthn
ms.author: patricka
ms.date: 05/04/2020
ms.topic: article
ms.service: virtual-machines
ms.subservice: imaging
---

# Configure Azure Image Builder Service permissions using PowerShell

Azure Image Builder Service requires configuration of permissions and privileges prior to building an image. The following sections detail how to configure possible scenarios using PowerShell.

> [!IMPORTANT]
> Azure Image Builder is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

First, you must register for the Azure Image Builder Service. Registration grants the service permission to create, manage, and delete a staging resource group. The service also has rights to add resources the group that are required for the image build. 

Azure Image Builder **does not** have permission to access other resources in other resource groups in the subscription. You need to take explicit actions to allow access to avoid your builds from failing.

```powershell-interactive
Register-AzProviderFeature -FeatureName VirtualMachineTemplatePreview -ProviderNamespace Microsoft.VirtualMachineImages
```

## Privileges

Depending on your scenario, privileges are required for Azure Image Builder. The following sections detail the privileges required for possible scenarios. To grant the required privileges, create an Azure custom role definition and assign it to the Azure Image Builder service principal name. For examples showing how to create and assign an Azure custom role definition, see [Create an Azure role definition](#create-an-azure-role-definition) at the end of the article.

### Distribute images

For Azure Image Builder to distribute images (Managed Images / Shared Image Gallery), the Azure Image Builder service must be allowed to inject the images into these resource groups, to do this, you need to grant the Azure Image Builder Service Principal Name (SPN) rights on the resource group where the image will be placed. 

You can avoid granting the Azure Image Builder SPN contributor on the resource group to distribute images, but it's service principal name needs the following Azure `Actions` permissions in the distribution resource group:

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

### Customize existing custom images

For Azure Image Builder to build images from source custom images (Managed Images / Shared Image Gallery), the Azure Image Builder service must be allowed to read the images into these resource groups, to do this, you need to grant the Azure Image Builder Service Principal Name (SPN) reader rights on the resource group where the image is located. 

Build from an existing custom image:

```Actions
Microsoft.Compute/galleries/read
```

Build from an existing SIG version:

```Actions
Microsoft.Compute/galleries/read
Microsoft.Compute/galleries/images/read
Microsoft.Compute/galleries/images/versions/read
```

### Customize images on your existing VNETs

Azure Image Builder has the capability to deploy and use an existing VNET in your subscription, thus allowing customizations access to connected resources.

You can avoid granting the Azure Image Builder service principal name contributor for it to deploy a VM to an existing VNET, but it's service principal name needs these Azure Actions on the VNET resource group:

```Actions
Microsoft.Network/virtualNetworks/read
Microsoft.Network/virtualNetworks/subnets/join/action
```

## Create an Azure role definition

The following examples create an Azure role definition from the actions described in the previous sections. The examples are applied at the resource group level. Evaluate and test if the examples are granular enough for your requirements. For example, the scope is set to the resource group. For your scenario, you may need to refine it to a specific shared image gallery.

The image actions allow read and write. Decide what is appropriate for your environment. For example, create a role to allow Azure Image Builder to read images from resource group *example-rg-1* and write images to resource group *example-rg-2*.

### Custom image Azure role example

The following example creates an Azure role to use and distribute a source custom image. Use the custom role to set the Azure Image Builder service principal name permissions.

First, create a role definition using the following JSON description. Name the file `aibRoleImageCreation.json`.

```json
{
    "Name": "Azure Image Builder Service Image Creation Role",
    "IsCustom": true,
    "Description": "Azure role to distribute a source custom image using Azure Image Builder Service",
    "Actions": [
        "Microsoft.Compute/galleries/read",
        "Microsoft.Compute/galleries/images/read",
        "Microsoft.Compute/galleries/images/versions/read",
        "Microsoft.Compute/galleries/images/versions/write",
    
        "Microsoft.Compute/images/write",
        "Microsoft.Compute/images/read",
        "Microsoft.Compute/images/delete"
    ],
    "NotActions": [
    
    ],
    "AssignableScopes": [
        "/subscriptions/<Subscription ID>/resourceGroups/<Distribution resource group>"
    ]
}
```

Replace the following placeholder settings in the JSON description.

| Setting | Description |
|---------|-------------|
| \<Subscription ID\> | Azure subscription ID for the custom role |
| \<Distribution resource group\> | Resource group for distribution |

Create a custom role from the `aibRoleImageCreation.json` description file. 

```powershell
New-AzRoleDefinition -InputFile  ./aibRoleImageCreation.json
```

Next, assign the custom role to Azure Image Builder service principal name to grant permission.

```powershell
$sub_id = "<Subscription ID>"
$res_group = "<Distribution resource group>"

$parameters = @{
    ObjectId = 'ef511139-6170-438e-a6e1-763dc31bdf74'
    RoleDefinitionName = 'Azure Image Builder Service Image Creation Role'
    Scope = '/subscriptions/$sub_id/resourceGroups/$res_group'
}

New-AzRoleAssignment @parameters
```

Replace the following placeholder settings when executing the command.

| Setting | Description |
|---------|-------------|
| \<Subscription ID\> | Azure subscription |
| \<Distribution resource group\> | Distribution resource group |


### Use an existing VNET example

Setting Azure Image Builder service principal name permissions to allow it to use an existing VNET

The following example creates an Azure role to use and distribute a source custom image. Use the custom role to set the Azure Image Builder service principal name permissions.

First, create a role definition using the following JSON description. Name the file `aibRoleNetworking.json`.

```json
{
    "Name": "Azure Image Builder Service Networking Role",
    "IsCustom": true,
    "Description": "Image Builder access to create resources for the image build",
    "Actions": [
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.Network/virtualNetworks/subnets/join/action"
    ],
    "NotActions": [
  
    ],
    "AssignableScopes": [
      "/subscriptions/<Subscription ID>/resourceGroups/<VNET resource group>"
    ]
  }
```

Replace the following placeholder settings in the JSON description.

| Setting | Description |
|---------|-------------|
| \<Subscription ID\> | Azure subscription ID for the custom role |
| \<VNET resource group\> | VNET resource group  |

Create a custom role from the `aibRoleNetworking.json` description file.

```powershell
New-AzRoleDefinition -InputFile  ./aibRoleNetworking.json
```

Next, assign the custom role to Azure Image Builder service principal name to grant permission.

```powershell
$sub_id = "<Subscription ID>"
$res_group = "<VNET resource group>"

$parameters = @{
    ObjectId = 'ef511139-6170-438e-a6e1-763dc31bdf74'
    RoleDefinitionName = 'Azure Image Builder Service Networking Role'
    Scope = '/subscriptions/$sub_id/resourceGroups/$res_group'
}

New-AzRoleAssignment @parameters
```

Replace the following placeholder settings when executing the command.

| Setting | Description |
|---------|-------------|
| \<Subscription ID\> | Azure subscription |
| \<VNET resource group\> | VNET resource group |
