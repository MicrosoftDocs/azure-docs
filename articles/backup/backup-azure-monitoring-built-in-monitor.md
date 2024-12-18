---
title: Monitor Azure Backup protected workloads
description: In this article, learn about the monitoring and notification capabilities for Azure Backup workloads using the Azure portal.
ms.topic: how-to
ms.date: 12/30/2024
ms.assetid: 86ebeb03-f5fa-4794-8a5f-aa5cbbf68a81
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Monitoring Azure Backup workloads

Azure Backup provides multiple backup solutions based on the backup requirement and infrastructure topology (On-premises vs Azure). Any backup user or admin should see what's going on across all solutions and can expect to be notified in important scenarios. 

Overview of alerts, jobs, security and usage are available by default in the **Overview** pane of Azure Business Continuity Center, Recovery Services Vault and Backup Vault. This article describes the ways to view and configure monitoring capabilities via Business Continuity Center, Recovery Services Vault and Backup Vault.

## Protected and protectable items in Azure Business Continuity Center

You can monitor all your protected and protectable items via Azure Business Continuity Center. Go to the **[Protected Items](../business-continuity-center/tutorial-view-protected-items-and-perform-actions.md)** blade in Azure Business Continuity Center to view your resources protected by one or more solutions and perform actions on them. Go to the **[Protectable resources](../business-continuity-center/tutorial-view-protectable-resources.md)** in Azure Business Continuity Center to view your resources that are not currently protected by any solution.

## Backup Items in Recovery Services vault

You can monitor all your backup items via a Recovery Services vault. Navigating to the **Backup Instances** section in [Recovery Services vault](backup-azure-manage-windows-server.md#manage-backup-items) opens a view that provides a detailed list of all backup items of the given workload type, with information on the last backup status for each item, latest restore point available, and so on. You can also [view the list of backup instances in a Backup vault](manage-backup-vault.md#manage-backup-instances).

>[!NOTE]
>For items backed-up to Azure using DPM, the list will show all the data sources protected (both disk and online) using the DPM server. If the protection is stopped for the datasource with backup data retained, the datasource will be still listed in the portal. You can go to the details of the data source to see if the recovery points are present in disk, online or both. Also, datasources for which the online protection is stopped but data is retained,  billing for the online recovery points continue until the data is completely deleted.
>
> The DPM version must be DPM 1807 (5.1.378.0) or DPM 2019 ( version 10.19.58.0 or above), for the backup items to be visible in the Recovery Services vault portal.
>
>For DPM, MABS and MARS, the Backup Item (VM name, cluster name, host name, volume or folder name) and Protection Group cannot include '<', '>', '%', '&', ':', '\', '?', '/', '#' or any control characters.

## Backup Jobs

Learn how to monitor Backup jobs in [Azure Business Continuity Center](../business-continuity-center/tutorial-monitor-operate.md), [Recovery Services vault](backup-azure-manage-windows-server.md#manage-backup-jobs), and [Backup vault](manage-backup-vault.md#manage-backup-jobs).

## Next steps

[Monitor Azure Backup workloads using Azure Monitor](backup-azure-monitoring-use-azuremonitor.md)
