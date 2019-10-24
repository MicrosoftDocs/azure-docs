---
title: Share gallery images across tenants in Azure | Microsoft Docs
description: Learn how to share VM images across Azure tenants using Shared Image Galleries.
services: virtual-machines-linux
author: cynthn
manager: gwallace

ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.topic: article
ms.date: 04/05/2019
ms.author: cynthn
---
# Share gallery VM images across Azure tenants

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