---
title: Common questions about Shared disks in Azure Site Recovery 
description: This article answers common questions about Azure to Azure Shared disks in Azure Site Recovery.
ms.author: ankitadutta
author: ankitaduttaMSFT
ms.topic: faq
ms.date: 04/22/2025
ms.service: azure-site-recovery

---
# Common questions about Azure to Azure shared disks

This article answers common questions about using shared disks (Azure to Azure) with Azure Site Recovery. 

## Frequently asked questions

#### Does Azure Site Recovery support Linux VMs with shared disks?
No, Azure Site Recovery does not support Linux VMs with shared disks. Only VMs with WSFC-based shared disks are supported.

#### Is PowerShell supported for Azure Site Recovery with shared disks?
Yes, it is supported.

#### Can we enable replication for only some of the VMs attached to a shared disk?
No, enable replication can only be enabled successfully when all the VMs attached to a shared disk are selected.

#### Is it possible to exclude shared disks and enable replication for only some of the VMs in a cluster?
Yes, the first time you don’t select all the VMs in Enable Replication, a warning appears mentioning the unselected VMs attached to the shared disk. If you still proceed, unselect the shared disk replication by selecting ‘No’ for the storage option in Replication Settings tab.
 
####  If the *enable replication* job fails for a cluster, can we restart it after fixing the issue without reselecting clusters again?
Yes, you can restart the job without reselecting clusters, just like other A2A scenarios. However, since the *enable replication* process runs for each node, you need to restart the failed job for all nodes through the Site Recovery Jobs interface.

#### Can new shared disks be added to a protected cluster?
No, if new shared disks need to be added, disable the replication for the already protected cluster. Enable a new cluster protection with a new cluster name for the modified infrastructure.

#### Are both crash-consistent and app-consistent recovery points supported?
No, Azure Site Recovery for Shared Disks supports only Crash consistent recovery points.

#### Can we use recovery plans to failover Azure Site Recovery enabled VMs with shared disks?
No, recovery plans are not supported for shared disks in Azure Site Recovery.


## Next steps

Learn more about:

- [Azure managed disk](/azure/virtual-machines/disks-shared).
- [Support matrix for shared disk in Azure Site Recovery](./shared-disk-support-matrix.md).
- [Shared disk tutorial](./tutorial-shared-disk.md).