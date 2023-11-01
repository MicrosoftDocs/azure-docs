---
title: Dedicated hosts include file
description: Include file for dedicated hosts resize functionality
services: virtual-machines
author: mattmcinnes
ms.topic: include
ms.service: virtual-machines
ms.subservice: azure-dedicated-host
ms.date: 09/11/2023
ms.author: mattmcinnes
ms.reviewer: vamckMS
ms.custom: include file
---

Moving a host and all associated VMs to newer generation hardware can be done through the host resize feature. Resize simplifies the migration process and avoids having to manually create new hosts and move all VMs individually.

Resize limitations:
- Host can only be resized to an ADH within the same VM family. A Dsv3-Type3 host can be resized to Dsv3-Type4 but **not** to an **E**sv3-Type4.
- You can only resize to newer generation of hardware. A Dsv3-Type3 host can be resized to Dsv3-Type4 but **not** Dsv3-Type2.
- Resizing changes the 'Host Asset ID'. The 'Host ID' remains the same.
- The host and all associated VMs become unavailable during the resize operation.

> [!Warning]
> The resize operation causes the loss of any non-persistent data such as temp disk data. Save all your work to persistent data storage before triggering resize.

> [!Note]
> If the source host is already running on the latest hardware, 'Size' page would display an empty list. If you're looking for enhanced performance, consider switching to a different VM family.


### [Portal](#tab/portal)

1. Search for and select the host.
1. In the left menu under **Settings**, select **Size**.
1. Once on the size page from the list of SKUs, select the desired SKU to resize to.
1. Selecting a target size from the list would enable **Resize** button on the bottom on the page.
1. Click **Resize**, host's 'Provisioning State' changes from 'Provisioning Succeeded' to 'Updating'
1. Once the resizing is complete, the host's 'Provisioning State' reverts to 'Provisioning Succeeded'


### [CLI](#tab/cli)

First list the sizes that you can resize in case you're unsure which to resize to.

Use [az vm host list-resize-options](/cli/azure/vm#az-vm-host-list-resize-options).

```azurecli-interactive
az vm host list-resize-options \
 --host-group myHostGroup \
 --host-name myHost \
 --resource-group myResourceGroup
```

Resize the host using [az vm host resize](/cli/azure/vm#az-vm-host-resize) .

```azurecli-interactive
az vm host resize \
 --host-group myHostGroup \
 --host-name myHost \
 --resource-group myResourceGroup \
 --sku Dsv3-Type4
```

### [PowerShell](#tab/powershell)

When using PowerShell, the resize feature is referred to as a host 'Update'. Use the following commands to update the host:

```azurepowershell-interactive
Update-AzHost
      [-ResourceGroupName] <String>
      [-HostGroupName] <String>
      [-Name] <String>
      [-Sku <String>]
      [-AutoReplaceOnFailure <Boolean>]
      [-LicenseType <DedicatedHostLicenseTypes>]
      [-DefaultProfile <IAzureContextContainer>]
      [-WhatIf]
      [-Confirm]
      [<CommonParameters>]
```

For more info on Update-AzHost, check out the [Update-AzHost reference docs](/powershell/module/az.compute/update-azhost).

---
