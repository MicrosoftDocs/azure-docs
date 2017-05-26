---
title: Frequently asked questions for Azure Stack | Microsoft Docs
description: Azure Stack frequently asked questions.
services: azure-stack
documentationcenter: ''
author: HeathL17
manager: byronr
editor: ''

ms.assetid: 028479e4-a17e-43c7-885c-cb2130f850d2
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 4/17/2017
ms.author: helaw

---
# Frequently asked questions for Azure Stack
## Deployment
### Do I need to format my data disks before starting or restarting an installation?
Disks should be in raw format. If you reinstall the operating system, you may need to check if the old storage pool is still present and delete using the following steps:

1. Open Server Manager.
2. Select Storage Pools.
3. See if a storage pool is listed.
4. Right-click **storage pool** if listed and enable read / write.
5. Right-click **Virtual Hard Disk** (Lower left corner) and select delete.
6. Right-click **Storage Pool** and click delete.
7. Launch Azure Stack script again and verify that the disk verification passes.

Optionally, the following script can be used:

```PowerShell
$pools = Get-StoragePool -IsPrimordial $False -ErrorVariable Err -ErrorAction SilentlyContinue
if ($pools -ne $null) {
  $pools| Set-StoragePool -IsReadOnly $False -ErrorVariable Err -ErrorAction SilentlyContinue
  $pools = Get-StoragePool -IsPrimordial $False -ErrorVariable Err -ErrorAction SilentlyContinue
  $pools | Get-VirtualDisk | Remove-VirtualDisk -Confirm:$False
  $pools | Remove-StoragePool -Confirm:$False
}
```

### Can I use all SSD disks for the storage pool in the POC installation?
For more information on storage configurations, see the [requirements guide](azure-stack-deploy.md).

### Can I use NVMe data disks for the Microsoft Azure Stack POC?
While Storage Spaces Direct supports NVMe disks, Azure Stack only supports a subset of the possible drive types and combinations possible for Storage Spaces Direct.  See the [requirements guide](azure-stack-deploy.md) for more information. 

### How can I reinstall Azure Stack?
You can follow the steps in the [redeployment guide](azure-stack-redeploy.md).  

## Tenant
### Can I deploy my own images as a tenant?
Yes, just like in Azure, a tenant can upload images in Azure Stack, in addition to using the images from the service administrator. For an overview, see the [Adding a VM Image](azure-stack-add-vm-image.md). 

## Testing
### Can I use Nested Virtualization to test the Microsoft Azure Stack POC?
Nested virtualization is not supported or tested with Azure Stack Technical Preview 3.

## Virtual machines
### Does Azure Stack support dynamic disks for virtual machines?
Azure Stack does not support dynamic disks.


## Next steps
[Troubleshooting](azure-stack-troubleshooting.md)

