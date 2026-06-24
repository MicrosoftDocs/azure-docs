---
title: Back up and restore a SharePoint farm to Azure with DPM
description: Learn how to back up a SharePoint farm and restore SharePoint content databases from Azure recovery points by using System Center Data Protection Manager (DPM).
ms.topic: how-to
ms.date: 06/24/2026
ms.service: azure-backup
ms.custom: engagement-fy23, seo-fy26
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a SharePoint administrator, I want to back up my SharePoint farm to Azure using a data protection solution, so that I can ensure long-term retention and quick recovery of my critical data.
---

# Back up and restore a SharePoint farm to Azure by using Data Protection Manager


This article describes how to back up and restore SharePoint data by using System Center Data Protection Manager (DPM). The process for backing up SharePoint to Azure by using DPM is similar to backing up SharePoint to a local DPM server.

System Center Data Protection Manager (DPM) enables you to back up a SharePoint farm to Microsoft Azure. Azure Backup lets you schedule daily, weekly, monthly, or yearly recovery points and configure separate retention settings for each backup frequency. DPM stores local disk copies for quick recovery time objectives (RTOs) and stores Azure copies for long-term retention.

[!INCLUDE [The functionality of Azure Backup trim process.](../../includes/backup-trim-process-notification.md)]

## SharePoint supported scenarios

For information on the supported SharePoint versions and the DPM versions required to back them up, see [this article](/system-center/dpm/dpm-protection-matrix#applications-backup).

## Prerequisites

Before you proceed to back up a SharePoint farm to Azure, ensure that you've met all the [prerequisites for using Microsoft Azure Backup](backup-azure-dpm-introduction.md#prerequisites-and-limitations) to protect workloads. The tasks in prerequisites also include: create a backup vault, download vault credentials, install Azure Backup agent, and register DPM/Azure Backup Server with the vault.

For other prerequisites and limitations, see [Back up SharePoint with DPM](/system-center/dpm/back-up-sharepoint#prerequisites-and-limitations).

## Configure backup

To back up the SharePoint farm, configure protection for SharePoint using *ConfigureSharePoint.exe*, and then create a protection group in DPM. See the DPM documentation to learn [how to configure backup](/system-center/dpm/back-up-sharepoint#configure-backup).

Use this sequence to configure protection:

1. Run *ConfigureSharePoint.exe* on the DPM server to prepare SharePoint for protection.
1. Create or update a DPM protection group that includes the SharePoint farm and content databases.
1. Configure backup schedules and retention ranges for local disk recovery points and Azure recovery points.
1. Run the initial consistency check and first backup job.

To verify that configuration succeeded, open the DPM console and confirm that the SharePoint data source state is **OK** and that recovery points are created for both disk and Azure storage.

## Monitor operations

To monitor the backup job, see [Monitoring DPM backup](/system-center/dpm/back-up-sharepoint#monitoring).

Monitor these items after each backup cycle:

1. Job completion state in the DPM **Monitoring** workspace.
1. Alert history for protection group failures or catalog issues.
1. Recovery point availability for the expected schedule.

If jobs fail, resolve active alerts first, rerun the job, and verify that a new recovery point appears.

## Restore SharePoint data

To learn how to restore a SharePoint item from a disk with DPM, see [Restore SharePoint data](/system-center/dpm/back-up-sharepoint#restore-sharepoint-data).

For fast recovery from local storage, use disk recovery points when possible. Use Azure recovery points when you need long-term retention or when local recovery points aren't available.

## Restore a SharePoint database from Azure using DPM

To recover a SharePoint content database, follow these steps:

1. Browse through various recovery points (as shown previously), and select the recovery point that you want to restore.

    ![Screenshot showing how to select a recovery point from the list.](./media/backup-azure-backup-sharepoint/dpm-sharepoint-protection9.png)
2. Double-click the SharePoint recovery point to show the available SharePoint catalog information.

   > [!NOTE]
   > Because the SharePoint farm is protected for long-term retention in Azure, no catalog information (metadata) is available on the DPM server. So, whenever a point-in-time SharePoint content database needs to be recovered, you need to catalog the SharePoint farm again.

3. Select **Re-catalog**.

    ![Screenshot showing how to select Re-recatalog.](./media/backup-azure-backup-sharepoint/dpm-sharepoint-protection12.png)

    The **Cloud Recatalog** status window opens.

    ![Screenshot showing the Cloud Recatalog status window.](./media/backup-azure-backup-sharepoint/dpm-sharepoint-protection13.png)

    Once the cataloging is finished and the status changes to *Success*, select **Close**.

    ![Screenshot showing the cataloging is complete with Success state.](./media/backup-azure-backup-sharepoint/dpm-sharepoint-protection14.png)

4. On the DPM **Recovery** tab, select the *SharePoint object* to get the content database structure, right-click the item, and then select **Recover**.

    ![Screenshot showing how to recover a SharePoint database from Azure.](./media/backup-azure-backup-sharepoint/dpm-sharepoint-protection15.png)
5. To recover a SharePoint content database from disk, see [this section](#restore-sharepoint-data).

To verify that the restore succeeded, open SharePoint and confirm that the recovered content database mounts successfully and that users can access site content.

## Switch the Front-End Web Server

If you've more than one front-end web server, and want to switch the server that DPM uses to protect the farm, see [Switching the Front-End Web Server](/system-center/dpm/back-up-sharepoint#switching-the-front-end-web-server).

## Troubleshoot SharePoint backup and restore with DPM

Use this checklist for common restore and cataloging issues:

1. **Re-catalog is unavailable or fails**: Verify connectivity between DPM and Azure, then retry cataloging from the same recovery point.
1. **SharePoint catalog data is missing**: Run **Re-catalog** again and wait for completion before selecting database items for recovery.
1. **Recovery job fails with access errors**: Verify that DPM and SharePoint service accounts still have required farm and SQL permissions.
1. **Recovery points are older than expected**: Review protection group schedules and retention settings for both disk and Azure copies.

If you still can't restore data, review [Troubleshoot System Center Data Protection Manager](backup-azure-scdpm-troubleshooting.md).

## Next steps

* [Azure Backup Server and DPM - FAQ](backup-azure-dpm-azure-server-faq.yml)
* [Troubleshoot System Center Data Protection Manager](backup-azure-scdpm-troubleshooting.md)


## Related content

[Manage backup to Azure for DPM servers via PowerShell](backup-dpm-automation.md).