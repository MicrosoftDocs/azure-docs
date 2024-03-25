---
title: Configure Azure VM Image Builder permissions by using the Azure CLI
description: Configure requirements for Azure VM Image Builder, including permissions and privileges, by using the Azure CLI.
author: kof-f
ms.author: kofiforson
ms.reviewer: jushiman
ms.date: 04/02/2021
ms.topic: article
ms.service: virtual-machines
ms.subservice: image-builder
ms.custom: devx-track-azurecli
---

# Configure Azure VM Image Builder permissions by using the Azure CLI

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

When you register for Azure VM Image Builder, your subscription gets access to a VM Image Builder service principal name (SPN). This registration also authorizes the service permission to create, manage, and delete a staging resource group. For the image building process, the Contributor role assignment is also required at the staging resource group.

If you want VM Image Builder to distribute images, you need to create a user-assigned identity in Azure, with permissions to read and write images. For example, you might want to distribute images to managed images or to Azure Compute Gallery. If you're accessing Azure storage, then the user-assigned identity you create needs permissions to read private or public containers.

You must set up permissions and privileges prior to building an image. The following sections detail how to configure possible scenarios by using the Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Create a user-assigned managed identity

VM Image Builder requires you to create an [Azure user-assigned managed identity](../../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-cli.md). VM Image Builder uses this identity to read images, write images, and access Azure storage accounts. You grant the identity permission to do specific actions in your subscription.

> [!NOTE]
> User-assigned managed identity is the correct way to grant permissions to the image resource groups. The SPN is deprecated for this purpose.

The following example shows you how to create an Azure user-assigned managed identity. Replace the placeholder settings to set your variables.

| Setting | Description |
|---------|-------------|
| \<Resource group\> | The resource group where you want to create the user-assigned managed identity. |

```azurecli-interactive
identityName="aibIdentity"
imageResourceGroup=<Resource group>

az identity create \
    --resource-group $imageResourceGroup \
    --name $identityName
```

For more information, see [Azure user-assigned managed identity](../../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-cli.md).

## Allow VM Image Builder to distribute images

For VM Image Builder to distribute images, the service must be allowed to inject the images into resource groups. To grant the required permissions, create a user-assigned managed identity, and grant it rights on the resource group where the image is built. VM Image Builder doesn't have permission to access resources in other resource groups in the subscription. You need to take explicit actions to allow access, to prevent your builds from failing.

You don't need to grant the user-assigned managed identity contributor rights on the resource group to distribute images. However, the user-assigned managed identity needs the following Azure `Actions` permissions in the distribution resource group:

```Actions
Microsoft.Compute/images/write
Microsoft.Compute/images/read
Microsoft.Compute/images/delete
```

If you want to distribute to Azure Compute Gallery, you also need:

```Actions
Microsoft.Compute/galleries/read
Microsoft.Compute/galleries/images/read
Microsoft.Compute/galleries/images/versions/read
Microsoft.Compute/galleries/images/versions/write
```

## Permission to customize existing images

For VM Image Builder to build images from source custom images, the service must be allowed to read the images into these resource groups. To grant the required permissions, create a user-assigned managed identity, and grant it rights on the resource group where the image is located.

Here's how you build from an existing custom image:

```Actions
Microsoft.Compute/images/read
```

Here's how you build from an existing Azure Compute Gallery version:

```Actions
Microsoft.Compute/galleries/read
Microsoft.Compute/galleries/images/read
Microsoft.Compute/galleries/images/versions/read
```

## Permission to customize images on your virtual networks

VM Image Builder has the capability to deploy and use an existing virtual network in your subscription, thus allowing customizations access to connected resources.

You don't need to grant the user-assigned managed identity contributor rights on the resource group to deploy a VM to an existing virtual network. However, the user-assigned managed identity needs the following Azure `Actions` permissions on the virtual network resource group:

```Actions
Microsoft.Network/virtualNetworks/read
Microsoft.Network/virtualNetworks/subnets/join/action
```

## Create an Azure role definition

The following examples create an Azure role definition from the actions described in the previous sections. The examples are applied at the resource group level. Evaluate and test if the examples are granular enough for your requirements.

The image actions allow read and write. Decide what is appropriate for your environment. For example, create a role to allow VM Image Builder to read images from resource group *example-rg-1*, and write images to resource group *example-rg-2*.

### Custom image Azure role example

The following example creates an Azure role to use and distribute a source custom image. You then grant the custom role to the user-assigned managed identity for VM Image Builder.

To simplify the replacement of values in the example, set the following variables first. Replace the placeholder settings to set your variables.

| Setting | Description |
|---------|-------------|
| \<Subscription ID\> | Your Azure subscription ID. |
| \<Resource group\> | Resource group for the custom image. |

```azurecli-interactive
# Subscription ID - You can get this using `az account show | grep id` or from the Azure portal.
subscriptionID=$(az account show --query id --output tsv)
# Resource group - image builder will only support creating custom images in the same Resource Group as the source managed image.
imageResourceGroup=<Resource group>
identityName="aibIdentity"

# Use *cURL* to download the a sample JSON description 
curl https://raw.githubusercontent.com/azure/azvmimagebuilder/master/solutions/12_Creating_AIB_Security_Roles/aibRoleImageCreation.json -o aibRoleImageCreation.json

# Create a unique role name to avoid clashes in the same Azure Active Directory domain
imageRoleDefName="Azure Image Builder Image Def"$(date +'%s')

# Update the JSON definition using stream editor
sed -i -e "s/<subscriptionID>/$subscriptionID/g" aibRoleImageCreation.json
sed -i -e "s/<rgName>/$imageResourceGroup/g" aibRoleImageCreation.json
sed -i -e "s/Azure Image Builder Service Image Creation Role/$imageRoleDefName/g" aibRoleImageCreation.json

# Create a custom role from the sample aibRoleImageCreation.json description file.
az role definition create --role-definition ./aibRoleImageCreation.json

# Get the user-assigned managed identity id
imgBuilderCliId=$(az identity show -g $imageResourceGroup -n $identityName --query clientId -o tsv)

# Grant the custom role to the user-assigned managed identity for Azure Image Builder.
az role assignment create \
    --assignee $imgBuilderCliId \
    --role $imageRoleDefName \
    --scope /subscriptions/$subscriptionID/resourceGroups/$imageResourceGroup
```

### Existing virtual network Azure role example

The following example creates an Azure role to use and distribute an existing virtual network image. You then grant the custom role to the user-assigned managed identity for VM Image Builder.

To simplify the replacement of values in the example, set the following variables first. Replace the placeholder settings to set your variables.

| Setting | Description |
|---------|-------------|
| \<Subscription ID\> | Your Azure subscription ID. |
| \<Resource group\> | The virtual network resource group |

```azurecli-interactive
# Subscription ID - You can get this using `az account show | grep id` or from the Azure portal.
subscriptionID=$(az account show --query id --output tsv)
VnetResourceGroup=<Resource group>
identityName="aibIdentity"

# Use *cURL* to download the a sample JSON description 
curl https://raw.githubusercontent.com/azure/azvmimagebuilder/master/solutions/12_Creating_AIB_Security_Roles/aibRoleNetworking.json -o aibRoleNetworking.json

# Create a unique role name to avoid clashes in the same domain
netRoleDefName="Azure Image Builder Network Def"$(date +'%s')

# Update the JSON definition using stream editor
sed -i -e "s/<subscriptionID>/$subscriptionID/g" aibRoleNetworking.json
sed -i -e "s/<vnetRgName>/$vnetRgName/g" aibRoleNetworking.json
sed -i -e "s/Azure Image Builder Service Networking Role/$netRoleDefName/g" aibRoleNetworking.json

# Create a custom role from the aibRoleNetworking.json description file.
az role definition create --role-definition ./aibRoleNetworking.json

# Get the user-assigned managed identity id
imgBuilderCliId=$(az identity show -g $imageResourceGroup -n $identityName --query clientId -o tsv)

# Grant the custom role to the user-assigned managed identity for Azure Image Builder.
az role assignment create \
    --assignee $imgBuilderCliId \
    --role $netRoleDefName \
    --scope /subscriptions/$subscriptionID/resourceGroups/$VnetResourceGroup
```

## Using managed identity for Azure Storage access

If you want to authenticate with Azure Storage and use private containers, VM Image Builder needs a user-assigned managed identity. VM Image Builder uses the identity to authenticate with Azure Storage.

> [!NOTE]
> VM Image Builder only uses the identity at the time that you submit the image template. The build VM doesn't have access to the identity during image build.

Use the Azure CLI to create the user-assigned managed identity:

```azurecli
az role assignment create \
    --assignee <Image Builder client ID> \
    --role "Storage Blob Data Reader" \
    --scope /subscriptions/<Subscription ID>/resourceGroups/<Resource group>/providers/Microsoft.Storage/storageAccounts/$scriptStorageAcc/blobServices/default/containers/<Storage account container>
```

In the VM Image Builder template, provide the user-assigned managed identity:

```json
    "type": "Microsoft.VirtualMachineImages/imageTemplates",
    "apiVersion": "2020-02-14",
    "location": "<Region>",
    ..
    "identity": {
    "type": "UserAssigned",
          "userAssignedIdentities": {
            "<Image Builder ID>": {}     
        }
```

Replace the following placeholder settings:

| Setting | Description |
|---------|-------------|
| \<Region\> | Template region |
| \<Resource group\> | Resource group |
| \<Storage account container\> | Storage account container name |
| \<Subscription ID\> | Azure subscription |

For more information, see [Create an image and use a user-assigned managed identity to access files in Azure Storage](./image-builder-user-assigned-identity.md). You learn how to create and configure the user-assigned managed identity to access a storage account.

## Next steps

[Azure VM Image Builder overview](../image-builder-overview.md)
