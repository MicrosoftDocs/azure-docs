<properties
  pageTitle="Planning your Azure Backup Server deployment | Microsoft Azure"
  description="Important considerations for planning your workload backup infrastructure with Azure Backup Server"
  services="backup"
  documentationCenter=""
  authors="aashishr"
  manager="shreeshd"
  editor=""/>

<tags
  ms.service="backup"
  ms.workload="storage-backup-recovery"
  ms.tgt_pltfrm="na"
  ms.devlang="na"
  ms.topic="article"
  ms.date="12/02/2015"
  ms.author="aashishr"/>


# Plan your Azure Backup Server deployment

> [AZURE.SELECTOR]
- [Azure Backup Server](backup-planning-azure-backup-server.md)

[//]: <> (- [System Center DPM](backup-planning-scdpm.md))

[//]: <> (## How does Azure Backup Server work?)


[//]: <> (## Deploying in Azure)

## Deduplication
Q: Can I get dedup on a Microsoft Azure Backup server storage pool?
<br>A: Yes, dedup is available on a Microsoft Azure Backup server storage pool. The user experience for Microsoft Azure Backup server is exactly as detailed in this [DPM blog post](http://blogs.technet.com/b/dpm/archive/2015/01/06/deduplication-of-dpm-storage-reduce-dpm-storage-consumption.aspx).


## Billing
Q: What is the billing model for Microsoft Azure Backup server?
<br>A: Users will be billed via a protected instance model. For more information, refer to the FAQs on the [pricing](http://azure.microsoft.com/pricing/details/backup/) page.

Q: What is the billing model if I only protected data on disk?
<br>A: The billing model is the same as the protected instance model. Since this data is protected on on-premises storage there is no Azure storage charge for only disk-based backups. In this case only the protected instance fee would be billed to the customer. For more information about what defines an instance and how much is charged per instance, refer to the FAQs on the [pricing ](http://azure.microsoft.com/pricing/details/backup/) page.

Q: What is the charge per protected instance?
<br>A: Refer to the [pricing ](http://azure.microsoft.com/pricing/details/backup/) page.

Q: Where can I find examples that highlight different application workloads and the protected instance fee for them?
<br>A: Refer to the "Examples section" on the [pricing ](http://azure.microsoft.com/pricing/details/backup/) page.

Q: How would Microsoft Azure Backup server bill for a datasource which is protected on disk as well as cloud?
<br>A: Regardless of whether data is backed up to disk or cloud, Microsoft Azure backup server would charge based on protected instances. Protected instance size is calculated based on the front end size of the datasource. For backup data in Azure storage, Azure storage costs also apply.
