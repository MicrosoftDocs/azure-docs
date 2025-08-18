---
title: Migrate with Veeam and Azure Data Box
description: Discover common migration scenarios using both Azure Data Box and Veeam solutions.
ms.date: 08/17/2025
ms.topic: reference
ms.service: azure-databox
author: bapic
ms.author: bchakra
# Customer intent: "As an Azure resource manager, I want to access built-in policy definitions for Azure Data Box, so that I can implement governance and compliance measures effectively across my resources."
---

<!--
Initial score: 65 (404/20)
Curremnt score: 98 (1141/1 false-positive)
-->

# Seeding data with Veeam and Azure Data Box Next-gen

This article provides information on using Azure Data Box and Veeam solutions together to migrate large amounts of data to Azure storage services. Using Azure Data Box and Veeam Backup and Replication solutions allows you to migrate on-premises backup and archive data in a reliable, secure, and timely manner. 

Azure Blob storage provides cost-effective data retention and recovery capabilities. However, not all Azure Blob features are supported by each product. You can learn more about using object storage with Veeam Products in the [Veeam product documentation](https://www.veeam.com/kb4241).

This article describes how the process works at a high level. You can find relevant, detailed, step-by-step instructions within the respective products' websites.

![Image of Veeam and Azure Data Box workflow.](media/migrate-veeam-and-data-box/veeam-data-box-workflow.png)

### Solution flow overview

1. Log in to Azure portal and [order](https://portal.azure.com/) an appropriate size of Azure Data Box.  

2. Once the device arrives, setup and configure the Azure Data box. Here's [step by step guide](/azure/databox/data-box-deploy-ordered) to order, and set up an Azure Data Box device.

3. Setup Azure Data Box and configure as SOBR capacity tier

    a.  Once device arrives, ensure that you [connect](/azure/databox/data-box-deploy-set-up) Azure Data Box to your on-premises infrastructure and [setup REST API access](/azure/databox/data-box-deploy-copy-data-via-rest).

    b. Add the appliance to Veeam Backup & Replication. Configuring [Azure Data Box as a Capacity Tier extent](https://helpcenter.veeam.com/docs/backup/hyperv/data_box_seeding.html) with "Copy backups to object storage as soon as they're created" in your Scale-Out Backup Repository (SOBR). Note that *"Move mode"* isn't recommended.

4. Back up your data to the data box appliance using the Veeam solution. Veeam Backup and Replication uses the REST API endpoint (Azure Blob) to write to the Data Box device.

5. Once the backup data has been fully copied to the device, you need to put the data box tier into [maintenance mode](https://helpcenter.veeam.com/docs/backup/hyperv/sobr_maintenance.html) in Veeam and [prepare the device for shipping](https://helpcenter.veeam.com/docs/backup/hyperv/data_box_seeding.html).

6. Once the device is shipped to the Azure datacenter, data is imported into the storage account, [add the destination Storage Account to Veeam Backup and Replication](https://helpcenter.veeam.com/docs/backup/hyperv/data_box_seeding.html?ver=120) and synchronize the data.

 Learn more about other solutions integration in Azure with Veeam and Azure Blob storage here: [Azure Data Protection with Veeam - Azure Storage | Microsoft Learn](/azure/storage/solution-integration/validated-partners/backup-archive-disaster-recovery/veeam/veeam-solution-guide)

*This article is based on the original blog content by Johan Huttenga and is available at [Seeding data with Veeam and Azure Data Box Next-gen](https://community.veeam.com/blogs-and-podcasts-57/seeding-data-with-veeam-and-azure-data-box-next-gen-10819). All due credit to the author and the Veeam community.*