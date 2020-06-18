---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 06/03/2020
 ms.author: rogarana
 ms.custom: include file
---

While in preview, enabling shared disks is only available to a subset of disk types. Currently only ultra disks and premium SSDs can enable shared disks. Each managed disk that have shared disks enabled are subject to the following limitations, organized by disk type:

### Ultra disks

Ultra disks have their own separate list of limitations, unrelated to shared disks. For ultra disk limitations, refer to [Using Azure ultra disks](../articles/virtual-machines/linux/disks-enable-ultra-ssd.md).

When sharing ultra disks, they have the following additional limitations:

- Currently limited to Azure Resource Manager or SDK support.
- Only basic disks can be used with some versions of Windows Server Failover Cluster, for details see [Failover clustering hardware requirements and storage options](https://docs.microsoft.com/windows-server/failover-clustering/clustering-requirements).

### Premium SSDs

- Currently only supported in the West Central US region.
- All virtual machines sharing a disk must be deployed in the same [proximity placement groups](../articles/virtual-machines/windows/proximity-placement-groups.md).
- Can only be enabled on data disks, not OS disks.
- Only basic disks can be used with some versions of Windows Server Failover Cluster, for details see [Failover clustering hardware requirements and storage options](https://docs.microsoft.com/windows-server/failover-clustering/clustering-requirements).
- ReadOnly host caching is not available for premium SSDs with `maxShares>1`.
- Availability sets and virtual machine scale sets can only be used with `FaultDomainCount` set to 1.
- Azure Backup and Azure Site Recovery support is not yet available.

If you're interested in trying shared disks then [sign up for our preview](https://aka.ms/AzureSharedDiskPreviewSignUp).
