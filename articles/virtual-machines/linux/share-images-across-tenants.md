---
title: Share gallery images across tenants in Azure 
description: Learn how to share VM images across Azure tenants using Shared Image Galleries.
author: cynthn
ms.service: virtual-machines
ms.subservice: imaging
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 05/04/2019
ms.author: cynthn
ms.reviewer: akjosh
---
# Share gallery VM images across Azure tenants

Shared Image Galleries let you share images using RBAC. You can use RBAC to share images within your tenant, and even to individuals outside of your tenant. For more information about this simple sharing option, see the [Share the gallery](/azure/virtual-machines/linux/shared-images-portal#share-the-gallery).

[!INCLUDE [virtual-machines-share-images-across-tenants](../../../includes/virtual-machines-share-images-across-tenants.md)]

> [!IMPORTANT]
> You cannot use the portal to deploy a VM from an image in another azure tenant. To create a VM from an image shared between tenants, you must use the Azure CLI or [Powershell](../windows/share-images-across-tenants.md).

## Create a VM using Azure CLI

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

Create the VM. Replace the information in the example with your own.

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --image "/subscriptions/<Tenant 1 subscription>/resourceGroups/<Resource group>/providers/Microsoft.Compute/galleries/<Gallery>/images/<Image definition>/versions/<version>" \
  --admin-username azureuser \
  --generate-ssh-keys
```

## Next steps

If you run into any issues, you can [troubleshoot shared image galleries](troubleshooting-shared-images.md).