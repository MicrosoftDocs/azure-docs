---
title: Share gallery images across tenants 
description: Learn how to create scale sets using images that are shared across Azure tenants using Shared Image Galleries.
author: sandeepraichura
ms.author: saraic
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.subservice: shared-image-gallery
ms.date: 04/05/2019
ms.reviewer: cynthn
ms.custom: devx-track-azurecli

---
# Share images across tenants with Azure Compute Gallery

[!INCLUDE [virtual-machines-share-images-across-tenants](../../includes/virtual-machines-share-images-across-tenants.md)]

## Create a scale set using Azure CLI

> [!IMPORTANT]
> You can't currently create a Flexible virtual machine scale set from an image shared by another tenant. 

Sign in the service principal for tenant 1 using the appID, the app key, and the ID of tenant 1. You can use `az account show --query "tenantId"` to get the tenant IDs if needed.

```azurecli-interactive
az account clear
az login --service-principal -u '<app ID>' -p '<Secret>' --tenant '<tenant 1 ID>'
az account get-access-token 
```
 
Sign in the service principal for tenant 2 using the appID, the app key, and the ID of tenant 2:

```azurecli-interactive
az login --service-principal -u '<app ID>' -p '<Secret>' --tenant '<tenant 2 ID>'
az account get-access-token
```

Create the scale set. Replace the information in the example with your own.

```azurecli-interactive
az vmss create \
  -g myResourceGroup \
  -n myScaleSet \
  --image "/subscriptions/<Tenant 1 subscription>/resourceGroups/<Resource group>/providers/Microsoft.Compute/galleries/<Gallery>/images/<Image definition>/versions/<version>" \
  --admin-username azureuser \
  --generate-ssh-keys
```

## Next steps

If you run into any issues, you can [troubleshoot shared image galleries](../virtual-machines/troubleshooting-shared-images.md).
