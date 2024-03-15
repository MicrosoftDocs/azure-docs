---
title: Migrate Managed image to Compute gallery
description: Learn how to legacy Managed image to image version in Azure compute gallery.
author: AjKundnani
ms.service: virtual-machines
ms.subservice: gallery
ms.topic: how-to
ms.date: 03/09/2024
ms.author: ajkundna
ms.reviewer: cynthn
ms.custom: template-how-to, devx-track-azurepowershell
---

# Migrate Managed image to Azure compute gallery image version

**Applies to:** :heavy_check_mark: Linux Virtual Machine :heavy_check_mark: Windows Virtual Machine :heavy_check_mark: Virtual Machine Flex Scale Sets

[Managed images](capture-image-resource.yml) is legacy method to generalize and capture Virtual Machine image. For the most current technology, customers are encouraged to use [Azure compute gallery](azure-compute-gallery.md). All new features, like ARM64, Trusted launch, and Confidential Virtual Machine are only supported through Azure compute gallery. If you have an existing managed image, you can use it as a source and create an Azure compute gallery image.

## Before you begin

- [Create an Azure Compute Gallery](create-gallery.md).
- Assign `Reader` permission on source managed image.
- Assign `Contributor` permission on target Azure compute gallery image definition.

## Migrate Managed image to Azure Compute Gallery image

### [Portal](#tab/portal)

This section steps through using the Azure portal to migrate Managed image to existing Azure Compute Gallery.

1. Sign-in to [Azure portal](https://portal.azure.com).
2. Navigate to `Managed image` to be migrated and select **Clone to a VM image**.

:::image type="content" source="./media/shared-image-galleries/01-click-clone-image.png" alt-text="Screenshot of the Managed image to be migrated":::

3. Provide following details on the `Create VM image version` page and select **Next : Replication >**:
    - Version number
    - Target Azure compute gallery
    - Target Virtual Machine image definition

4. Select following `Replication` configuration or select default values and select **Next : Encryption >**:
    - Default storage sku
    - Default replication count
    - Target replication regions

5. Select `SSE encryption type` or select default `Encryption at-rest with a platform managed key` and select **Next : Tags >**.
6. *Optional* Assign resource tags.
7. Validate the configuration on `Review + Create` page and select **Create** to complete the migration.

### [CLI](#tab/cli)

You need the `tenantID` of the source image, the `subscriptionID` for the Azure compute gallery (target), and the `resourceID` of the source image.

```azurecli
# Set some variables
tenantID="<tenant ID for the source image>"
subID="<subscription ID where the image will be creted>"
sourceImageID="<resource ID of the source managed image>"

# Login to the subscription where the new image will be created
az login

# Log in to the tenant where the source image is available
az login --tenant $tenantID

# Log back in to the subscription where the image will be created and ensure subscription context is set
az login
az account set --subscription $subID

# Create the image
az sig image-version create `
    --gallery-image-definition myImageDef `
    --gallery-image-version 1.0.0 `
    --gallery-name myGallery `
    --resource-group myResourceGroup `
    --image-version $sourceImageID
```

### [PowerShell](#tab/powershell)

You need the `tenantID` of the source image, the `subscriptionID` for the Azure compute gallery (target), and the `resourceID` of the source image.

```azurepowershell
# Set variables 
$targetSubID = "<subscription ID for the target>"
$sourceTenantID = "<tenant ID where for the source image>"
$sourceImageID = "<resource ID of the source image>"

# Login to the tenant where the source image is published
Connect-AzAccount -Tenant $sourceTenantID -UseDeviceAuthentication

# Login to the subscription where the new image will be created and set the context
Connect-AzAccount -UseDeviceAuthentication -Subscription $targetSubID
Set-AzContext -Subscription $targetSubID

# Create the image version from another image version in a different tenant
New-AzGalleryImageVersion `
    -ResourceGroupName myResourceGroup `
    -GalleryName myGallery `
    -GalleryImageDefinitionName myImageDef `
    -Location "West US 2" `
    -Name 1.0.0 `
    -SourceImageId $sourceImageID
```

---

## Next steps

Replace managed image reference with Azure compute gallery image version in the Virtual machine and flex scale sets deployment templates.