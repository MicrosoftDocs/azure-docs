---
title: Configure Reports for Azure Backup
description: This article talks about configuring Power BI reports for Azure Backup using Recovery Services vault.
services: backup
documentationcenter: ''
author: JPallavi
manager: vijayts
editor: ''

ms.assetid: 86e465f1-8996-4a40-b582-ccf75c58ab87
ms.service: backup
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 03/30/2017
ms.author: pajosh
ms.custom: H1Hack27Feb2017

---
# Configure Azure Backup reports
This article talks about steps to configure reports for Azure Backup using Recovery Services vault. Once, the configuration is complete, you can go to Power BI to view all the reports, customize them and create reports. 

## Supported Scenarios
1. Azure Backup reports are supported for Azure virtual machine backup and for Azure Recovery Services Agent.
2. You can view reports across vaults and across subscriptions, if same storage account is configured for each of the vaults.

## Pre-requisites
1. Create a storage account to configure it for reports. This storage account is used for storing reports related data.
2. [Create a Power BI account](https://powerbi.microsoft.com/landing/signin/) to view, customize, and create your own reports.

## Configure storage account for reports
Use the following steps to configure storage account for recovery services vault using Azure portal. If you intend to view reports across vaults,  you can use the same storage account across multiple vaults. 
1. If you already have a Recovery Services vault open, proceed to next step. If you do not have a Recovery Services vault open, but are in the Azure portal, on the Hub menu, click **Browse**.

   * In the list of resources, type **Recovery Services**.
   * As you begin typing, the list filters based on your input. When you see **Recovery Services vaults**, click it.

      ![Create Recovery Services Vault step 1](./media/backup-azure-vms-encryption/browse-to-rs-vaults.png) <br/>

     The list of Recovery Services vaults appears. From the list of Recovery Services vaults, select a vault.

     The selected vault dashboard opens.
2. From the list of items that appears under vault, click **Backup Reports** under Monitoring and Reports section to configure storage account for reports.
3. On the Backup Reports blade, click **Configure** button and set the Status toggle button to **On**.
4. Select **Export to Storage Account** check box so that reporting data can start flowing in to storage account.
5. Click Storage Account picker and select storage account from the list for storing reporting data.
6. Select **Azure Backup Reporting Data** check box and also move the slider to select retention period for this reporting data. Reporting data in storage account is kept for the period selected using this slider. 
7. Review all the changes and click **Save** button on top. This action ensures that all your changes are saved and storage account is now configured for storing reporting data.

## View reports in Power BI 
After configuring storage account for reports using recovery services vault, it takes around 24 hours for reporting data to start flowing in. After 24 hours of setting up storage account, use the following steps to view reports in Power BI:
1. [Sign in](https://powerbi.microsoft.com/landing/signin/) to Power BI.
2. Click **Get Data** and click Get under **Services** in Content Pack Library. [Learn more](https://powerbi.microsoft.com/en-us/documentation/powerbi-content-packs-services/) about Power BI content packs.
3. Type **Azure Backup** in Search bar and click **Get it now**.
4. Enter storage account name configured in step 5 above and click **Next** button.
5. Enter storage account key for this storage account. You can [view and copy storage access keys](../storage/storage-create-storage-account.md#manage-your-storage-account) by navigating to your storage account in Azure portal.
6. Click **Sign in** button. After sign-in is successful, you get **Importing data** notification.
7. Once data is imported successfully, type **Azure Backup** in the navigation pane. The list now shows Azure Backup dashboard, reports, and dataset with a yellow star indicating newly imported reports.
8. Click **Azure Backup** under Dashboards, which shows a set of pinned key reports.
9. To view the complete set of reports, click any report in the dashboard.
10. Click each tab in the reports to view reports in that area.

## Next Steps
Now that you have configured storage account and imported Azure Backup content pack, the next step is to customize these reports and use reporting data model to create reports. Refer the following articles for more details.

* [Filtering reports in Power BI](https://powerbi.microsoft.com/documentation/powerbi-service-about-filters-and-highlighting-in-reports/)
* [Using Azure Backup reporting data model](backup-azure-reports-data-model.md)
* [Creating reports in Power BI](https://powerbi.microsoft.com/documentation/powerbi-service-create-a-new-report/)

