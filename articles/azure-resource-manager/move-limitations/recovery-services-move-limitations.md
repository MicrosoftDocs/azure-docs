---
title: Move Azure resources to new subscription or resource group | Microsoft Docs
description: Use Azure Resource Manager to move resources to a new resource group or subscription.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 06/24/2019
ms.author: tomfitz
---

### Recovery Services limitations

 To move a Recovery Services vault, follow these steps: [Move resources to new resource group or subscription](../backup/backup-azure-move-recovery-services-vault.md).

Currently, you can move one Recovery Services vault, per region, at a time. You can't move vaults that back up Azure Files, Azure File Sync, or SQL in IaaS virtual machines.

If a virtual machine doesn't move with the vault, the current virtual machine recovery points stay in the vault until they expire. Whether the virtual machine moved with the vault or not, you can restore the virtual machine from the backup history in the vault.

Recovery Services vault doesn't support cross subscription backups. If you move a vault with virtual machine backup data across subscriptions, you must move your virtual machines to the same subscription, and use the same target resource group to continue backups.

Backup policies defined for the vault are kept after the vault moves. Reporting and monitoring must be set up again for the vault after the move.

To move a virtual machine to a new subscription without moving the Recovery Services vault:

 1. Temporarily stop backup
 1. [Delete the restore point](#virtual-machines-limitations). This operation deletes only the instant recovery points, not the backed-up data in the vault.
 1. Move the virtual machines to the new subscription
 1. Reprotect it under a new vault in that subscription

Move isn't enabled for Storage, Network, or Compute resources used to set up disaster recovery with Azure Site Recovery. For example, suppose you have set up replication of your on-premises machines to a storage account (Storage1) and want the protected machine to come up after failover to Azure as a virtual machine (VM1) attached to a virtual network (Network1). You can't move any of these Azure resources - Storage1, VM1, and Network1 - across resource groups within the same subscription or across subscriptions.
