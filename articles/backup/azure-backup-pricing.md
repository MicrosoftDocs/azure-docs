---
title: Azure Backup pricing
description: Learn how to estimate your costs for budgeting Azure Backup pricing.
ms.topic: conceptual
ms.date: 06/16/2020
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Azure Backup pricing

To learn about Azure Backup pricing, visit the [Azure Backup pricing page](https://azure.microsoft.com/pricing/details/backup/).

## Download detailed estimates for Azure Backup pricing

If you're looking to estimate your costs for budgeting or cost comparison purposes, download the detailed [Azure Backup pricing estimator](https://aka.ms/AzureBackupCostEstimates).  

### What does the estimator contain?

The Azure Backup cost estimator sheet has an option for you to estimate all possible workloads you're looking to back up using Azure Backup. These workloads include:

- Azure VMs
- On-premises servers
- SQL in Azure VMs
- SAP HANA in Azure VMs
- Azure files shares

## Estimate costs for backing up Azure VMs or on-premises servers

To estimate the costs of backing up Azure VMs or on-premises servers using Azure Backup, you’ll need the following parameters:

- Size of the VMs or on-premises servers that you're trying to back up
  - Enter the “used size” of disks or servers required to be backed up

- Number of servers with that size

- What is the expected amount of data churn on these servers?<br>
  Churn refers to the amount of change in data. For example, if you had a VM with 200 GB of data to be backed up and 10 GB of it changes every day, the daily churn is 5%.

  - Higher churn will mean that you back up more data

  - Pick **Low** or **Moderate** for file servers and **High** if you're running databases

  - If you know your **churn%**, you can use the **Enter your own%** option

- Choose the backup policy

  - How long do you expect to retain “Daily” backups? (in days)

  - How long do you expect to retain “Weekly” backups? (in weeks)

  - How long do you expect to retain “Monthly” backups? (in months)

  - How long do you expect to retain “Yearly” backups? (in years)

  - How long do you expect to retain “Instant restore snapshots”? (1-5 days)

    - This option lets you restore from as far back as seven days in a quick manner using snapshots stored on disks.

- **Optional** – Selective Disk backup

  - If you're using the **Selective Disk Backup** option while backing up Azure VMs, choose the **Exclude Disk** option and enter the percentage of disks excluded from backup in terms of size. For example, if you have a VM connected to three disks with 200 GB used in each disk and if you want to exclude two of them from backing up, enter 66.7%.

- **Optional** – Backup Storage Redundancy

  - This indicates the redundancy of the Storage Account your backup data goes into. We recommend using **GRS** for the highest availability. Since it ensures that a copy of your backup data is kept in a different region, it helps you meet multiple compliance standards. Change the redundancy to **LRS** if you're backing up development or test environments that don't need an enterprise-level backup. Select the **RAGRS** option in the sheet if you want to understand costs when [Cross-Region Restore](backup-azure-arm-restore-vms.md#cross-region-restore) is enabled for your backups.

- **Optional** – Modify regional pricing or apply discounted rates

  - If you want to check your estimates for a different region or discounted rates, select **Yes** for the **Try estimates for a different region?** option and enter the rates with which you want to run the estimates.

## Estimate costs for backing up SQL servers in Azure VMs

To estimate the costs of backing up SQL servers running in Azure VMs using Azure Backup, you’ll need the following parameters:

- Size of the SQL servers that you're trying to back up

- Number of SQL servers with the above size

- What is the expected compression for your SQL servers’ backup data?

  - Most Azure Backup customers see that the backup data has 80% compression compared to the SQL server size when the SQL compression is **enabled**.

  - If you expect to see a different compression, enter the number in this field

- What is the expected size of log backups?

  - The % indicates daily log size as a % of the SQL server size

- What is the expected amount of daily data churn on these servers?

  - Typically, databases have "High” churn

  - If you know your **churn%**, you can use the **Enter your own%** option

- Choose the backup policy

  - Backup Type

    - The most effective policy you can choose is **Daily differentials** with weekly/monthly/yearly full backups. Azure Backup can restore from differentials through single-click as well.

    - You can also choose to have a policy with daily/weekly/monthly/yearly full backups. This option will consume slightly more storage than the first option.

  - How long do you expect to retain “log” backups? (in days) [7-35]

  - How long do you expect to retain “Daily” backups? (in days)

  - How long do you expect to retain “Weekly” backups? (in weeks)

  - How long do you expect to retain “Monthly” backups? (in months)

  - How long do you expect to retain “Yearly” backups? (in years)

- **Optional** – Backup Storage Redundancy

  - This indicates the redundancy of the Storage Account your backup data goes into. We recommend using **GRS** for the highest availability. Since it ensures that a copy of your backup data is kept in a different region, it helps you meet multiple compliance standards. Change the redundancy to **LRS** if you're backing up development or test environments that don't need an enterprise-level backup.

- **Optional** – Modify regional pricing or apply discounted rates

  - If you want to check your estimates for a different region or discounted rates, select **Yes** for the **Try estimates for a different region?** option and enter the rates with which you want to run the estimates.

## Estimate costs for backing up SAP HANA servers in Azure VMs

To estimate the costs of backing up SAP HANA servers running in Azure VMs using Azure Backup, you’ll need the following parameters:

- Total size of the SAP HANA databases that you're trying to back up. This should be the sum of full backup size of each of the databases, as reported by SAP HANA.
- Number of SAP HANA servers with the above size
- What is the expected size of log backups?
  
  - The % indicates average daily log size as a % of the total size of SAP HANA databases that you're backing up on the SAP HANA server
- What is the expected amount of daily data churn on these servers?
  - The % indicates average daily churn size as a % of the total size of SAP HANA databases that you're backing up on the SAP HANA server
  - Typically, databases have "High” churn
  - If you know your **churn%**, you can use the **Enter your own%** option
- Choose the backup policy
  - Backup Type
    - The most effective policy you can choose is **Daily differentials** with **weekly/monthly/yearly** full backups. Azure Backup can restore from differentials through single-click as well.
    - You can also choose to have a policy with **daily/weekly/monthly/yearly** full backups. This option will consume slightly more storage than the first option.
  - How long do you expect to retain “log” backups? (in days) [7-35]
  - How long do you expect to retain “Daily” backups? (in days)
  - How long do you expect to retain “Weekly” backups? (in weeks)
  - How long do you expect to retain “Monthly” backups? (in months)
  - How long do you expect to retain “Yearly” backups? (in years)
- **Optional** – Backup Storage Redundancy
  
  - This indicates the redundancy of the Storage Account your backup data goes into. We recommend using **GRS** for the highest availability. Since it ensures that a copy of your backup data is kept in a different region, it helps you meet multiple compliance standards. Change the redundancy to **LRS** if you're backing up development or test environments that don't need an enterprise-level backup.
- **Optional** – Modify regional pricing or apply discounted rates
  
  - If you want to check your estimates for a different region or discounted rates, select **Yes** for the **Try estimates for a different region?** option and enter the rates with which you want to run the estimates.
  
## Estimate costs for backing up Azure file shares

To estimate the costs of backing up Azure file shares using the [snapshot-based backup solution](azure-file-share-backup-overview.md) offered by Azure Backup, you’ll need the following parameters:

- Size (**in GB**) of the file shares that you want to back up.

- If you want to back up file shares spread across multiple storage accounts, specify the number of storage accounts hosting the file shares with the above size.

- Expected amount of data churn on the file shares that you want to back up. <br>Churn refers to the amount of change in data and it directly impacts the snapshot storage size. For example, if you have a file share with 200 GB of data to be backed up, and 10 GB of it changes every day, the daily churn is 5%.
  - Higher churn means the amount of data change in the file share contents every day is high, and so incremental snapshot (capturing only the data changes) size would also be more.
  - Select Low (1%), Moderate (3%), or High (5%) based on your file share characteristics and usage.
  - If you know the exact **churn%** for your file share, you can select the **Enter your own%** option from the drop-down. Specify the values (in %) for daily, weekly, monthly, and yearly churn.

- Type of storage account (standard or premium) and the storage redundancy setting of the storage account hosting the backed-up file share. <br>In the current backup solution for Azure file shares, snapshots are stored in the same storage account as the backed-up file share. So the storage cost associated with snapshots is billed as part of your Azure files bill, based on the snapshot pricing for the account type and redundancy setting of the storage account hosting the backed-up file share and snapshots.

- Retention for different backups
  - How long do you expect to retain “Daily” backups? (in days)
  - How long do you expect to retain “Weekly” backups? (in weeks)
  - How long do you expect to retain “Monthly” backups? (in months)
  - How long do you expect to retain “Yearly” backups? (in years)

  Refer to [the Azure File share support matrix](azure-file-share-support-matrix.md#retention-limits) for the maximum supported retention values in each category.

- **Optional** – Modify regional pricing or apply discounted rates.
  - The default values set for snapshot storage cost per GB and protected instance cost in the estimator are for the East US region. If you want to check your estimates for a different region or discounted rates, select **Yes** for the **Try estimates for a different region?** option, and enter the rates with which you want to run the estimates.

## Next steps

[What is the Azure Backup service?](backup-overview.md)
