---
title: Azure Backup - Archive tier overview 
description: Learn about Archive tier support for Azure Backup.
ms.topic: overview
ms.date: 05/25/2023
ms.custom: references_regions
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Overview of Archive tier in Azure Backup

Customers rely on Azure Backup to store backup data including their Long-Term Retention (LTR) backup data as per the retention needs defined by the organization's compliance rules. In most cases, the older backup data is rarely accessed and is only stored for compliance needs.

Azure Backup supports backup of Long-Term Retention points in the archive tier, in addition to Snapshots and the Standard tier.

## Support matrix

### Supported workloads

Archive tier supports the following workloads:

| Workloads | Operations |
| --- | --- |
| Azure Virtual Machines | Only monthly and yearly recovery points. Daily and weekly recovery points aren't supported.  <br><br> Age >= 3 months in Vault-standard tier <br><br> Retention left >= 6 months. <br><br> No active daily and weekly dependencies. |
| SQL Server in Azure Virtual Machines <br><br> SAP HANA in Azure Virtual Machines | Only full recovery points. Logs and differentials aren't supported. <br><br> Age >= 45 days in Vault-standard tier. <br><br> Retention left >= 6 months. <br><br>  No dependencies. |

A recovery point becomes archivable only if all the above conditions are met.

>[!Note]
>Archive tier support for Azure Virtual Machines, SQL Servers in Azure VMs and SAP HANA in Azure VM is now generally available in multiple regions. For the detailed list of supported regions, see the [support matrix](#support-matrix).

### Supported clients

Archive tier supports the following clients:

- [Azure portal](./use-archive-tier-support.md?pivots=client-portaltier)
- [PowerShell](./use-archive-tier-support.md?pivots=client-powershelltier)
- [CLI](./use-archive-tier-support.md?pivots=client-clitier)

### Supported regions

| Supported workload | Supported region |
| --- | --- |
| **Azure VMs**, **SQL Server in Azure VMs**, **SAP HANA in Azure VMs** | Australia East, Australia Southeast, Brazil South, Canada Central, Canada East, Central US, East Asia, East US 2, East US, France Central, Germany West Central, Central India, South India, Japan East, Japan West, Korea Central, Korea South, North Central US, North Europe, Norway East, South Central US, South East Asia, UAE North, UK South, UK West, West Central US, West Europe, West US 2, West US, US Gov Arizona, US Gov Virginia, US Gov Texas, China North 2, China East 2 |

## How Azure Backup moves recovery points to the Vault-archive tier?

> [!VIDEO https://www.youtube.com/embed/nQnH5mpiz60?start=416]

## Archive recommendations (only for Azure Virtual Machines)

The recovery points for Azure Virtual Machines are incremental. When you move recovery points to archive tier, they're converted to full recovery points (to ensure that all recovery points in Archive tier are independent and isolated from each other). Thus, overall backup storage (Vault-standard + Vault-archive) may increase.

The amount of storage increase depends on the churn pattern of the Virtual Machines.

- The higher the churn in the Virtual Machines, lesser is the overall backup storage when a recovery point is moved to archive tier.
- If the churn in the Virtual Machine is low, moving to Archive tier may lead to increase in Backup storage. This may offset the price difference between the Vault-standard tier and Vault-archive tier. Therefore, that might increase the overall cost.

To resolve this, Azure Backup provides recommendation set. The recommendation set returns a list of recovery points, which if moved together to Archive tier ensures cost savings.

>[!Note]
>The cost savings depends on various reasons and might differ for every instance.

## Modify protection

Azure Backup offers two ways to modify protection for a data-source:

- Modifying an existing policy
- Protecting the datasource with a new policy

In both scenarios, the new policy is applied to all older recovery points, which are in standard tier and archive tier. So, older recovery points might get deleted if there's a policy change.

When you move recovery points to archive, they're subjected to an early deletion period of 180 days. The charges are prorated. If you delete a recovery point that hasn't stayed in vault-archive for 180 days, then you're charged for the remaining retention period selected at vault-archive tier price.

## Stop protection and delete data

Stop protection and delete data deletes all recovery points. For recovery points in archive that haven't stayed for a duration of 180 days in archive tier, deletion of recovery points leads to early deletion cost.

## Stop protection and retain data

Azure Backup now supports tiering to archive when you choose to *Stop protection and retain data*. If the backup item is associated with a long term retention policy and is moved to *Stop protection and retain data* state, you can choose to move recommended recovery points to vault-archive tier.

>[!Note]
>For Azure VM backups, moving recommended recovery points to vault-archive saves costs. For other supported workloads, you can choose to move all eligible recovery points to archive to save costs. If backup item is associated with a short term retention policy and it's moved to *Stop protection & retain data* state, you can't tier the recovery points to archive.

## Archive tier pricing

You can view the Archive tier pricing from our [pricing page](https://azure.microsoft.com/pricing/details/backup/).

## Frequently asked questions

### What will happen to archive recovery points if I stop protection and retain data?

The recovery point will remain in archive forever. For more information, see [Impact of stop protection on recovery points](manage-recovery-points.md#impact-of-stop-protection-on-recovery-points).

### Is Cross Region restore supported from archive tier?

When you move your data in GRS vaults from standard tier to archive tier, the data moves into GRS archive. This is true even when Cross region restore is enabled. Once the backup data moves into archive tier, you can’t restore the data into the paired region. However, during region failures, the backup data in secondary region will become available for restore. 

When you restore from recovery point in Archive tier in primary region, the recovery point is copied to the Standard tier and is retained according to the rehydration duration, both in primary and secondary region. You can perform Cross region restore from these rehydrated recovery points.

### I can see eligible recovery points for my Virtual Machine, but I can't seeing any recommendation. What can be the reason?

The recovery points for Virtual Machines meet the eligibility criteria. So, there are archivable recovery points. However, the churn in the Virtual Machine may be low, thus there are no recommendations. In this scenario, though you can move the archivable recovery points to archive tier, but it may increase the overall backup storage costs.

### How do I ensure that all recovery points are moved to Archive tier, if moved via Azure portal?

To ensure that all recovery points are moved to Archive tier, 

1. Select the required workload.
1. Go to **Move Recovery Points** by following [these steps](./use-archive-tier-support.md?pivots=client-portaltier#move-recommended-recovery-points-for-a-particular-azure-virtual-machine).

If the list of recovery points is blank, then all the eligible/recommended recovery points are moved to the vault Archive tier.

### Can I use 'File Recovery' option to restore specific files in Azure VM backup for archived recovery points?

No. Currently, the **File Recovery** option doesn't support restoring specific files from an archived recovery point of an Azure VM backup.

## Next steps

- [Use Archive tier](use-archive-tier-support.md)
- [Azure Backup pricing](azure-backup-pricing.md)
