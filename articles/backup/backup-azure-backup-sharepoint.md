---
title: Back up a SharePoint farm to Azure with DPM
description: This article provides an overview of DPM/Azure Backup server protection of a SharePoint farm to Azure
ms.topic: conceptual
ms.date: 03/09/2020
---
# Back up a SharePoint farm to Azure with DPM

You back up a SharePoint farm to Microsoft Azure by using System Center Data Protection Manager (DPM) in much the same way that you back up other data sources. Azure Backup provides flexibility in the backup schedule to create daily, weekly, monthly, or yearly backup points and gives you retention policy options for various backup points. DPM provides the capability to store local disk copies for quick recovery-time objectives (RTO) and to store copies to Azure for economical, long-term retention.

Backing up SharePoint to Azure with DPM is a very similar process to backing up SharePoint to DPM locally. Particular considerations for Azure will be noted in this article.

## SharePoint supported versions and related protection scenarios

For a list of supported SharePoint versions and the DPM versions required to back them up see [What can DPM back up?](https://docs.microsoft.com/system-center/dpm/dpm-protection-matrix?view=sc-dpm-2019#applications-backup)

DPM - System Center 2012 R2 supports backup to Azure from Update Rollup 5. Update Rollup 5 provides the ability to protect a SharePoint farm to Azure if the farm is configured by using SQL AlwaysOn.

Azure Backup for DPM supports the following scenarios:

Recovery is supported for farm, database, and file or list item from disk recovery points.  Farm and database recovery are supported from Azure recovery points. |

## Before you start

There are a few things you need to confirm before you back up a SharePoint farm to Azure.

### Prerequisites

Before you proceed, make sure that you have met all the [prerequisites for using Microsoft Azure Backup](backup-azure-dpm-introduction.md#prerequisites-and-limitations) to protect workloads. Some tasks for prerequisites include: create a backup vault, download vault credentials, install Azure Backup Agent, and register DPM/Azure Backup Server with the vault.

Additional prerequisites and limitations can be found on the [Back up SharePoint with DPM](https://docs.microsoft.com/system-center/dpm/back-up-sharepoint?view=sc-dpm-2019#prerequisites-and-limitations) article.

## Configure backup

To configure the backup for your SharePoint farm, see [Configure Backup](https://docs.microsoft.com//system-center/dpm/back-up-sharepoint?view=sc-dpm-2019#configure-backup) in the DPM documentation.


## Back up a SharePoint farm by using DPM

After you have configured DPM and the SharePoint farm as explained previously, SharePoint can be protected by DPM.

For instructions on how to back up your SharePoint farm with DPM, see [ ]()

## Monitoring

To monitor the backup job, follow the instructions in [Montioring DPM backup](https://docs.microsoft.com/system-center/dpm/back-up-sharepoint?view=sc-dpm-2019#monitoring)

## Restore SharePoint data

To learn how to restore a SharePoint item from a disk with DPM, see [Restore SharePoint data](https://docs.microsoft.com/system-center/dpm/back-up-sharepoint?view=sc-dpm-2019#restore-sharepoint-data).

## Restore a SharePoint database from Azure by using DPM

1. To recover a SharePoint content database, browse through various recovery points (as shown previously), and select the recovery point that you want to restore.

    ![DPM SharePoint Protection8](./media/backup-azure-backup-sharepoint/dpm-sharepoint-protection9.png)
2. Double-click the SharePoint recovery point to show the available SharePoint catalog information.

   > [!NOTE]
   > Because the SharePoint farm is protected for long-term retention in Azure, no catalog information (metadata) is available on the DPM server. As a result, whenever a point-in-time SharePoint content database needs to be recovered, you need to catalog the SharePoint farm again.
   >
   >
3. Click **Re-catalog**.

    ![DPM SharePoint Protection10](./media/backup-azure-backup-sharepoint/dpm-sharepoint-protection12.png)

    The **Cloud Recatalog** status window opens.

    ![DPM SharePoint Protection11](./media/backup-azure-backup-sharepoint/dpm-sharepoint-protection13.png)

    After cataloging is finished, the status changes to *Success*. Click **Close**.

    ![DPM SharePoint Protection12](./media/backup-azure-backup-sharepoint/dpm-sharepoint-protection14.png)
4. Click the SharePoint object shown in the DPM **Recovery** tab to get the content database structure. Right-click the item, and then click **Recover**.

    ![DPM SharePoint Protection13](./media/backup-azure-backup-sharepoint/dpm-sharepoint-protection15.png)
5. At this point, follow the recovery steps earlier in this article to recover a SharePoint content database from disk.

## Switching the Front-End Web Server

If you have more than one front-end web server, and want to switch the server that DPM uses to protect the farm, follow the instructions in [Switching the Front-End Web Server](https://docs.microsoft.com/system-center/dpm/back-up-sharepoint?view=sc-dpm-2019#switching-the-front-end-web-server).

## Next steps


