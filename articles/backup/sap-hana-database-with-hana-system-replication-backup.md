---
title: Back up SAP HANA System Replication database on Azure VMs (preview)    
description: In this article, discover how to back up SAP HANA database with HANA System Replication enabled.
ms.topic: conceptual
ms.date: 10/05/2022
author: v-amallick
ms.service: backup
ms.author: v-amallick
---

# Back up SAP HANA System Replication databases on Azure VMs (preview)

SAP HANA databases are critical workloads that require a low recovery-point objective (RPO) and long-term retention. You can back up SAP HANA databases running on Azure virtual machines (VMs) by using [Azure Backup](backup-overview.md).

This article describes about how to back up SAP HANA System Replication (HSR) databases running on Azure VMs to an Azure Backup Recovery Services vault.

In this article, you'll learn how to:

>[!div class="checklist"]
>- Create and configure a Backup vault
>- Create a policy
>- Discover databases instances
>- Configure backups
>- Track a a backup job

>[!Note]
>See [SAP HANA backup support matrix](sap-hana-backup-support-matrix.md) for more information about the supported configurations and scenarios.


## Next steps

- [Back up SAP HANA database instances in Azure VMs (preview)](sap-hana-database-instances-backup.md).
- [Restore SAP HANA database instances in Azure VMs (preview)](sap-hana-database-instances-restore.md).
