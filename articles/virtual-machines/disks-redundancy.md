---
title: Redundancy options for Azure managed disks
description: Learn about zone-redundant storage and locally-redundant storage for Azure managed disks.
author: roygara
ms.author: rogarana
ms.date: 07/12/2021
ms.topic: how-to
ms.service: storage
ms.subservice: disks
ms.custom: references_regions, devx-track-azurepowershell
---

# Redundancy options for managed disks

Azure managed disks offer two storage redundancy options, zone-redundant storage (ZRS) as a preview, and locally-redundant storage. ZRS provides higher availability for managed disks than locally-redundant storage (LRS) does. However, the write latency for LRS disks is better than ZRS disks because LRS disks synchronously write data to three copies in a single data center.

## Locally-redundant storage for managed disks

Locally-redundant storage (LRS) replicates your data three times within a single data center in the selected region. LRS protects your data against server rack and drive failures. To protect an LRS disk from a zonal failure like a natural disaster or other issues, take the following steps:

- Use applications that can synchronously write data to two zones, and automatically failover to another zone during a disaster.
    - An example would be SQL Server AlwaysOn.
- Take frequent backups of LRS disks with ZRS snapshots.
- Enable cross-zone disaster recovery for LRS disks via [Azure Site Recovery](../site-recovery/azure-to-azure-how-to-enable-zone-to-zone-disaster-recovery.md). However, cross-zone disaster recovery doesn't provide zero Recovery Point Objective (RPO).

If your workflow doesn't support application-level synchronous writes across zones, or your application must meet zero RPO, then ZRS disks would ideal.

## Zone-redundant storage for managed disks (preview)

Zone-redundant storage (ZRS) synchronously replicates your Azure managed disk across three Azure availability zones in the region you select. Each availability zone is a separate physical location with independent power, cooling, and networking. 

A ZRS disk (preview) lets you recover from failures in availability zones. If a zone went down, a ZRS disk can be attached to a virtual machine (VM) in a different zone. ZRS disks can also be shared between VMs for improved availability with clustered or distributed applications like SQL FCI, SAP ASCS/SCS, or GFS2. A shared ZRS disk can be attached to primary and secondary VMs in different zones to take advantage of both ZRS and [availability zones](../availability-zones/az-overview.md). If your primary zone fails, you can quickly fail over to the secondary VM using [SCSI persistent reservation](disks-shared-enable.md#supported-scsi-pr-commands).

### Billing implications

For details see the [Azure pricing page](https://azure.microsoft.com/pricing/details/managed-disks/).

### Comparison with other disk types

Except for more write latency, disks using ZRS are identical to disks using LRS, they have the same scale targets. [Benchmark your disks](disks-benchmarks.md) to simulate the workload of your application and compare the latency between LRS and ZRS disks. 

### Limitations

[!INCLUDE [disk-storage-zrs-limitations](../../includes/disk-storage-zrs-limitations.md)]

## Next steps

- To learn how to create a ZRS disk, see [Deploy a ZRS managed disk](disks-deploy-zrs.md).
