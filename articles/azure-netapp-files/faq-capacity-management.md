---
title: FAQs About Azure NetApp Files | Microsoft Docs
description: Answers frequently asked questions (FAQs) about Azure NetApp Files capacity management.
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: conceptual
author: b-hchen
ms.author: anfdocs
ms.date: 09/01/2022
---
# Capacity management FAQs for Azure NetApp Files

This article answers frequently asked questions (FAQs) about Azure NetApp Files capacity management.

## How do I monitor usage for capacity pool and volume of Azure NetApp Files? 

Azure NetApp Files provides capacity pool and volume usage metrics. You can also use Azure Monitor to monitor usage for Azure NetApp Files. See [Metrics for Azure NetApp Files](azure-netapp-files-metrics.md) for details. 

## How do I determine if a directory is approaching the limit size?

You can use the `stat` command from a client to see whether a directory is approaching the [maximum size limit](azure-netapp-files-resource-limits.md#resource-limits) for directory metadata (320 MB).
See [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md#directory-limit) for the limit and calculation. 

## Does snapshot space count towards the usable / provisioned capacity of a volume?

Yes, the [consumed snapshot capacity](azure-netapp-files-cost-model.md#capacity-consumption-of-snapshots) counts towards the provisioned space in the volume. In case the volume runs full, consider taking the following actions:

* [Resize the volume](azure-netapp-files-resize-capacity-pools-or-volumes.md).
* [Remove older snapshots](snapshots-delete.md) to free up space in the hosting volume. 

## Does Azure NetApp Files support auto-grow for volumes or capacity pools?

No, Azure NetApp Files volumes and capacity pool do not auto-grow upon filling up. See [Cost model for Azure NetApp Files](azure-netapp-files-cost-model.md).   

You can use the community supported [Logic Apps ANFCapacityManager tool](https://github.com/ANFTechTeam/ANFCapacityManager) to manage capacity-based alert rules. The tool can automatically increase volume sizes to prevent your volumes from running out of space.

## Does the destination volume of a replication count towards hard volume quota?  

No, the destination volume of a replication does not count towards hard volume quota.

## Can I manage Azure NetApp Files through Azure Storage Explorer?

No. Azure NetApp Files is not supported by Azure Storage Explorer.

## Why is volume space not freed up immediately after deleting large amount of data in a volume?

When deleting a very large amount of data in a volume (which can include snapshots), the space reclamation process can take time. Wait a few minutes for Azure NetApp Files to reclaim the space in the volume.

## Next steps  

- [How to create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md)
- [Networking FAQs](faq-networking.md)
- [Security FAQs](faq-security.md)
- [Performance FAQs](faq-performance.md)
- [NFS FAQs](faq-nfs.md)
- [SMB FAQs](faq-smb.md)
- [Data migration and protection FAQs](faq-data-migration-protection.md)
- [Azure NetApp Files backup FAQs](faq-backup.md)
- [Application resilience FAQs](faq-application-resilience.md)
- [Integration FAQs](faq-integration.md)
