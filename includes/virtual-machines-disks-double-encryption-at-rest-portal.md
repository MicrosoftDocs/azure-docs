---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 07/08/2020
 ms.author: rogarana
 ms.custom: include file
---
## Supported regions

[!INCLUDE [virtual-machines-disks-double-encryption-at-rest-regions](virtual-machines-disks-double-encryption-at-rest-regions.md)]

## Getting started

1. Sign in to the Azure portal.
1. Search for and select Disk Encryption Sets

:::image type="content" source="media/virtual-machines-disks-double-encryption-at-rest-portal/double-encryption-select-key-vault.png" alt-text="example text":::

1. Select Add

:::image type="content" source="media/virtual-machines-disks-double-encryption-at-rest-portal/double-encryption-add-disk-encryption-set.png" alt-text="example text":::

1. Fill in the info, select one of the supported regions

:::image type="content" source="media/virtual-machines-disks-double-encryption-at-rest-portal/double-encryption-create-disk-encryption-set-blade.png" alt-text="example text":::

1. Select an Azure Key Vault and key

:::image type="content" source="media/virtual-machines-disks-double-encryption-at-rest-portal/double-encryption-select-key-vault.png" alt-text="example text":::

1. Select create
1. Navigate to the disk encryption set you just created, and select the error that is displayed. This will configure your disk encryption set to work.

:::image type="content" source="media/virtual-machines-disks-double-encryption-at-rest-portal/double-encryption-disk-set-error.png" alt-text="example text":::

1. Navigate to your disk
1. Select Encryption
1. Select double encryption at rest and a disk encryption set
1. select save.

:::image type="content" source="media/virtual-machines-disks-double-encryption-at-rest-portal/double-encryption-enable-disk-blade.png" alt-text="example text":::
