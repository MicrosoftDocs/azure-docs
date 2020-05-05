---
title: Configure Azure Image Builder Service Permissions using PowerShell
description: Configure requirements for Azure VM Image Builder Service including permissions and privileges using PowerShell
author: cynthn
ms.author: patricka
ms.date: 05/05/2020
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

## Register the features

First, you must register for the Azure Image Builder Service. Registration grants the service permission to create, manage, and delete a staging resource group. The service also has rights to add resources the group that are required for the image build. 

```powershell-interactive
Register-AzProviderFeature -FeatureName VirtualMachineTemplatePreview -ProviderNamespace Microsoft.VirtualMachineImages
```

## Privileges

Depending on your scenario, privileges are required for Azure Image Builder. The following sections detail the privileges required for possible scenarios. To grant the required privileges, create an Azure custom role definition and assign it to the Azure Image Builder service principal name. For examples showing how to create and assign an Azure custom role definition, see [Create an Azure role definition](#create-an-azure-role-definition) at the end of the article.

### Distribute images

For Azure Image Builder to distribute images (Managed Images / Shared Image Gallery), the Azure Image Builder service must be allowed to inject the images into these resource groups. You need to grant the Azure Image Builder service principal name (SPN) rights on the resource group where the image is built. Azure Image Builder **does not** have permission to access other resources in other resource groups in the subscription. You need to take explicit actions to allow access to avoid your builds from failing.

You don't need to grant Azure Image Builder SPN contributor access on the resource group to distribute images. However, Azure Image Builder service principal name needs the following Azure `Actions` permissions in the distribution resource group:

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

Build from an existing Shared Image Gallery version:

```Actions
Microsoft.Compute/galleries/read
Microsoft.Compute/galleries/images/read
Microsoft.Compute/galleries/images/versions/read
```

### Customize images on your existing VNETs

Azure Image Builder has the capability to deploy and use an existing VNET in your subscription, thus allowing customizations access to connected resources.

You don't need to grant Azure Image Builder SPN contributor access on the resource group to deploy a VM to an existing VNET. However, Azure Image Builder service principal name needs the following Azure `Actions` permissions on the VNET resource group:

```Actions
Microsoft.Network/virtualNetworks/read
Microsoft.Network/virtualNetworks/subnets/join/action
```

## Create an Azure role definition

The following examples create an Azure role definition from the actions described in the previous sections. The examples are applied at the resource group level. Evaluate and test if the examples are granular enough for your requirements. For your scenario, you may need to refine it to a specific shared image gallery.

The image actions allow read and write. Decide what is appropriate for your environment. For example, create a role to allow Azure Image Builder to read images from resource group *example-rg-1* and write images to resource group *example-rg-2*.

### Custom image Azure role example

The following example creates an Azure role to use and distribute a source custom image. Use the custom role to set the Azure Image Builder service principal name permissions.

To simplify the replacement of values in the example, set the following variables first. Replace the placeholder settings to set your variables.

| Setting | Description |
|---------|-------------|
| \<Subscription ID\> | Your Azure subscription ID |
| \<Resource group\> | Resource group for custom image |

```powershell-interactive
# Subscription ID - You can get this using `az account show | grep id` or from the Azure portal.
$sub_id = "<Subscription ID>"

# Resource group - For Preview, image builder will only support creating custom images in the same Resource Group as the source managed image.
$res_group = "<Resource group>"
```

First, use a sample JSON description as a role definition. Use a web request to download the JSON description and replace placeholder with variable values.

```powershell-interactive
# Download the role definition sample
$sample_uri="https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/solutions/12_Creating_AIB_Security_Roles/aibRoleImageCreation.json"
$role_definition="aibRoleImageCreation.json"

Invoke-WebRequest -Uri $sample_uri -Outfile $role_definition -UseBasicParsing

# Update the definition placeholders with variable values
((Get-Content -path $role_definition -Raw) -replace '<subscriptionID>',$sub_id) | Set-Content -Path $role_definition
((Get-Content -path $role_definition -Raw) -replace '<rgName>', $res_group) | Set-Content -Path $role_definition
```

The following is an example role definition.

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

Next, create a custom role from the `aibRoleImageCreation.json` description file. 

```powershell-interactive
New-AzRoleDefinition -InputFile $role_definition
```

Next, assign the custom role to Azure Image Builder service principal name to grant permission.

```powershell-interactive
$parameters = @{
    ObjectId = 'ef511139-6170-438e-a6e1-763dc31bdf74'
    RoleDefinitionName = 'Azure Image Builder Service Image Creation Role'
    Scope = '/subscriptions/' + $sub_id + '/resourceGroups/' + $res_group
}

New-AzRoleAssignment @parameters
```

### Existing VNET Azure role example

The following example creates an Azure role to use and distribute an existing VNET image. Use the custom role to set the Azure Image Builder service principal name permissions.

To simplify the replacement of values in the example, set the following variables first. Replace the placeholder settings to set your variables.

| Setting | Description |
|---------|-------------|
| \<Subscription ID\> | Your Azure subscription ID |
| \<Resource group\> | Resource group for custom image |

```powershell-interactive
# Subscription ID - You can get this using `az account show | grep id` or from the Azure portal.
$sub_id = "<Subscription ID>"

# Resource group - For Preview, image builder will only support creating custom images in the same Resource Group as the source managed image.
$res_group = "<Resource group>"
```

First, use a sample JSON description as a role definition. Use a web request to download the JSON description and replace placeholder with variable values.

```powershell-interactive
# Download the role definition sample
$sample_uri="https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/solutions/12_Creating_AIB_Security_Roles/aibRoleNetworking.json"
$role_definition="aibRoleNetworking.json"

Invoke-WebRequest -Uri $sample_uri -Outfile $role_definition -UseBasicParsing

# Update the definition placeholders with variable values
((Get-Content -path $role_definition -Raw) -replace '<subscriptionID>',$sub_id) | Set-Content -Path $role_definition
((Get-Content -path $role_definition -Raw) -replace '<vnetRgName>', $res_group) | Set-Content -Path $role_definition
```

The following is an example role definition.

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

Create a custom role from the `aibRoleNetworking.json` description file.

```powershell-interactive
New-AzRoleDefinition -InputFile $role_definition
```

Next, assign the custom role to Azure Image Builder service principal name to grant permission.

```powershell-interactive
$parameters = @{
    ObjectId = 'ef511139-6170-438e-a6e1-763dc31bdf74'
    RoleDefinitionName = 'Azure Image Builder Service Networking Role'
    Scope = '/subscriptions/' + $sub_id + '/resourceGroups/' + $res_group
}

New-AzRoleAssignment @parameters
```
