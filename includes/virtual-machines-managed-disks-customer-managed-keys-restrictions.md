---
 title: include file
 description: include file
 author: roygara
 ms.service: azure-disk-storage
 ms.topic: include
 ms.date: 02/22/2023
 ms.author: rogarana
 ms.custom: include file
---
- If this feature is enabled for a disk with incremental snapshots, it can't be disabled on that disk or its snapshots.
    To work around this, copy all the data to an entirely different managed disk that isn't using customer-managed keys. You can do that with either the [Azure CLI](../articles/virtual-machines/linux/disks-upload-vhd-to-managed-disk-cli.md#copy-a-managed-disk) or the [Azure PowerShell module](../articles/virtual-machines/windows/disks-upload-vhd-to-managed-disk-powershell.md#copy-a-managed-disk).
- Only [software and HSM RSA keys](../articles/key-vault/keys/about-keys.md) of sizes 2,048-bit, 3,072-bit and 4,096-bit are supported, no other keys or sizes.
    - [HSM](../articles/key-vault/keys/hsm-protected-keys.md) keys require the **premium** tier of Azure Key vaults.
- For Ultra Disks and Premium SSD v2 disks only: Snapshots created from disks that are encrypted with server-side encryption and customer-managed keys must be encrypted with the same customer-managed keys.
- Most resources related to your customer-managed keys (disk encryption sets, VMs, disks, and snapshots) must be in the same subscription and region.
    - Azure Key Vaults may be used from a different subscription but must be in the same region as your disk encryption set. As a preview, you can use Azure Key Vaults from [different Microsoft Entra tenants](../articles/virtual-machines/disks-cross-tenant-customer-managed-keys.md).
- Disks encrypted with customer-managed keys can only move to another resource group if the VM they are attached to is deallocated.
- Disks, snapshots, and images encrypted with customer-managed keys can't be moved between subscriptions.
- Managed disks currently or previously encrypted using Azure Disk Encryption can't be encrypted using customer-managed keys.
- Can only create up to 5000 disk encryption sets per region per subscription.
- For information about using customer-managed keys with shared image galleries, see [Preview: Use customer-managed keys for encrypting images](../articles/virtual-machines/image-version-encryption.md).
