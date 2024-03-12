---
 title: include file
 description: include file
 author: roygara
 ms.service: azure-disk-storage
 ms.topic: include
 ms.date: 11/02/2023
 ms.author: rogarana
ms.custom:
  - include file
  - ignite-2023
---
- Supported for 4k sector size Ultra Disks and Premium SSD v2.
- Only supported on 512e sector size Ultra Disks and Premium SSD v2 if they were created after 5/13/2023.
    - For disks created before this date, [snapshot your disk](../articles/virtual-machines/disks-incremental-snapshots.md) and create a new disk using the snapshot.
- Can't be enabled if migrating a virtual machine or a virtual machine scale set that is encrypted with Azure Disk Encryption, or has ever been encrypted with Azure Disk Encryption, to Encryption at Host. See [Azure Disk Encryption scenarios on Windows VMs](https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/virtual-machines/windows/disk-encryption-windows.md#restrictions) for further restrictions and unsupported scenarios when using Azure Disk Encryption.
- Azure Disk Encryption can't be enabled on disks that have encryption at host enabled.
- The encryption can be enabled on existing virtual machine scale sets. However, only new VMs created after enabling the encryption are automatically encrypted.
- Existing VMs must be deallocated and reallocated in order to be encrypted.
