---
title: Relocate AzureNetApp Files to another region
description: Learn how to relocate an Azure NetApp Files to nother region
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 08/14/2024
ms.service: azure-automation
ms.topic: how-to
ms.custom:
  - subject-relocation
---

# Relocate Azure NetApp Files to another region

This article cover guidance for relocating [Azure NetApp Files](../azure-netapp-files/azure-netapp-files-introduction.md) resources to another region.

[!INCLUDE [relocate-reasons](./includes/service-relocation-reason-include.md)]


## Prerequisites

Before you begin the relocation planning stage, first review the following prerequisites:

- The target NetApp account instance should already be created.

- Source and target regions must be paired regions. To see if they are paired, see [Supported cross-region replication pairs](../azure-netapp-files/cross-region-replication-introduction.md?#supported-region-pairs).

- Understand all dependent resources. Some of the resources could be the following:
    - Azure Entra ID
    - [Virtual Network](./relocation-virtual-network.md)
    - Azure DNS
    - [Storage services](./relocation-storage-account.md)
    - [Capacity pools](../azure-netapp-files/azure-netapp-files-set-up-capacity-pool.md)



## Downtime



## Prepare


- The target Microsoft Entra ID connection must have access to the DNS servers or Microsoft Entra Domain Services Domain Controllers that are reachable from the delegated subnet in the target region.

- The network configurations (including separate subnets if needed and IP ranges) should already be planned and prepared

- Turn off replication procedures to disaster recovery region. IF you've established a disaster recovery (DR) solution using replication to a DR region, turn off replication to the DR site before initiating relocation procedures.

- Understand the following considerations in regards to replication:
    
    - SMB, NFS, and dual-protocol volumes are supported. Replication of SMB volumes requires an Microsoft Entra ID connection in the source and target NetApp accounts.
    
    - The replication destination volume is read-only until the entire move is complete.
    
    - Azure NetApp Files replication doesn't currently support multiple subscriptions. All replications must be performed under a single subscription.
    
    - There are resource limits for the maximum number of cross-region replication destination volumes. For more information, see [Resource limits for Azure NetApp Files](../azure-netapp-files/azure-netapp-files-resource-limits.md)
    
## Redeploy

**To redeploy your NetApp resources:**

1. [Create the target NetApp account](../azure-netapp-files/azure-netapp-files-create-netapp-account.md).

1. (Optional) [Create the target capacity pool](../azure-netapp-files/azure-netapp-files-set-up-capacity-pool.md).

1. [Delegate a subnet in the target region](../azure-netapp-files/azure-netapp-files-delegate-subnet.md). Azure NetApp Files creates a system route to the delegated subnet. Peering and endpoints can be used to connect to the target as needed. 

1. Create a data replication volume by following the directions in [Create volume replication for Azure NetApp Files](../azure-netapp-files/cross-region-replication-create-peering.md).

1. [Verify that the health status](../azure-netapp-files/cross-region-replication-display-health-status.md) of replication is healthy.


## Cleanup

Once the replication is complete, you can then safely delete the replication peering the source volume.

## Related content


- [Cross-region replication of Azure NetApp Files volumes](../azure-netapp-files/cross-region-replication-introduction.md)
To learn more about moving resources between regions and disaster recovery in Azure, refer to:

- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)
