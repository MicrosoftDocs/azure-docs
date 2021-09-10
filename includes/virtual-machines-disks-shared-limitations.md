---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 08/16/2021
 ms.author: rogarana
 ms.custom: include file
---

Enabling shared disks is only available to a subset of disk types. Currently only ultra disks, premium SSDs, and standard SSDs can enable shared disks. Each managed disk that have shared disks enabled are subject to the following limitations, organized by disk type:

### Ultra disks

Ultra disks have their own separate list of limitations, unrelated to shared disks. For ultra disk limitations, refer to [Using Azure ultra disks](../articles/virtual-machines/disks-enable-ultra-ssd.md).

When sharing ultra disks, they have the following additional limitations:

- Only basic disks can be used with some versions of Windows Server Failover Cluster, for details see [Failover clustering hardware requirements and storage options](/windows-server/failover-clustering/clustering-requirements).
- Only [server-side encryption](../articles/virtual-machines/disk-encryption.md) is supported, [Azure Disk Encryption](../articles/virtual-machines/windows/disk-encryption-overview.md) is not currently supported.

Shared ultra disks are available in all regions that support ultra disks by default, and do not require you to sign up for access to use them.

### Premium SSDs

- Can only be enabled on data disks, not OS disks.
- **ReadOnly** host caching is not available for premium SSDs with `maxShares>1`.
- Disk bursting is not available for premium SSDs with `maxShares>1`.
- When using Availability sets and virtual machine scale sets with Azure shared disks, [storage fault domain alignment](../articles/virtual-machines/availability.md) with virtual machine fault domain is not enforced for the shared data disk.
- When using [proximity placement groups (PPG)](../articles/virtual-machines/windows/proximity-placement-groups.md), all virtual machines sharing a disk must be part of the same PPG.
- Only basic disks can be used with some versions of Windows Server Failover Cluster, for details see [Failover clustering hardware requirements and storage options](/windows-server/failover-clustering/clustering-requirements).
- Azure Site Recovery support is not yet available.
- Azure Backup is available through [Azure Disk Backup](../articles/backup/disk-backup-overview.md).
- Only [server-side encryption](../articles/virtual-machines/disk-encryption.md) is supported, [Azure Disk Encryption](../articles/virtual-machines/windows/disk-encryption-overview.md) is not currently supported.

#### Premium SSD regional availability

Shared disks on all premium SSD sizes are available in all regions that managed disks are available.


### Standard SSDs

- Can only be enabled on data disks, not OS disks.
- When using Availability sets and virtual machine scale sets with Azure shared disks, [storage fault domain alignment](../articles/virtual-machines/availability.md) with virtual machine fault domain is not enforced for the shared data disk.
- When using [proximity placement groups (PPG)](../articles/virtual-machines/windows/proximity-placement-groups.md), all virtual machines sharing a disk must be part of the same PPG.
- Only basic disks can be used with some versions of Windows Server Failover Cluster, for details see [Failover clustering hardware requirements and storage options](/windows-server/failover-clustering/clustering-requirements).
- Azure Site Recovery support is not yet available.
- Azure Backup is available through [Azure Disk Backup](../articles/backup/disk-backup-overview.md).
- Only [server-side encryption](../articles/virtual-machines/disk-encryption.md) is supported, [Azure Disk Encryption](../articles/virtual-machines/windows/disk-encryption-overview.md) is not currently supported.

#### Standard SSD regional availability

Shared disks on all standard SSD sizes are available in all regions that managed disks are available.
