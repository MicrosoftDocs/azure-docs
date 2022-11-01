---
title: Azure Backup - Archive tier overview 
description: Learn about Archive tier support for Azure Backup.
ms.topic: overview
ms.date: 06/06/2022
ms.custom: references_regions
author: v-amallick
ms.service: backup
ms.author: v-amallick
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
>- Archive tier support for Azure Virtual Machines, SQL Servers in Azure VMs and SAP HANA in Azure VM is now generally available in multiple regions. For the detailed list of supported regions, see the [support matrix](#support-matrix).
>- Archive tier support for Azure Virtual Machines for the remaining regions is in limited public preview. To sign up for limited public preview, fill [this form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR463S33c54tEiJLEM6Enqb9UNU5CVTlLVFlGUkNXWVlMNlRPM1lJWUxLRy4u).

### Supported clients

Archive tier supports the following clients:

- [Azure portal](./use-archive-tier-support.md?pivots=client-portaltier)
- [PowerShell](./use-archive-tier-support.md?pivots=client-powershelltier)
- [CLI](./use-archive-tier-support.md?pivots=client-clitier)

### Supported regions

| Workloads | Preview | Generally available |
| --- | --- | --- |
| SQL Server in Azure Virtual Machines/ SAP HANA in Azure Virtual Machines | None | All regions, except West US 3, West India, Switzerland North, Switzerland West, Sweden Central, Sweden South, Australia Central, Australia Central 2, Brazil Southeast, Norway West, Germany Central, Germany North, Germany Northeast, South Africa North, South Africa West. |
| Azure Virtual Machines | US Gov Virginia, US Gov Texas, US Gov Arizona, China North 2, China East 2. | All public regions, except West US 3, West India, Switzerland North, Switzerland West, Sweden Central, Sweden South, Australia Central, Australia Central 2, Brazil Southeast, Norway West, Germany Central, Germany North, Germany Northeast, South Africa North, South Africa West, UAE North. |

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

When you move recovery points to archive, they're subjected to an early deletion period of 180 days. The charges are prorated. If a recovery point that hasn’t stayed in archive for 180 days is deleted, it incurs cost equivalent to 180 minus the number of days it has spent in standard tier.

If you delete recovery points that haven't stayed in archive for a minimum of 180 days,  they incur early deletion cost.

## Stop protection and delete data

Stop protection and delete data deletes all recovery points. For recovery points in archive that haven't stayed for a duration of 180 days in archive tier, deletion of recovery points leads to early deletion cost.

## Archive tier pricing

You can view the Archive tier pricing from our [pricing page](azure-backup-pricing.md).

## Frequently asked questions

### What will happen to archive recovery points if I stop protection and retain data?

The recovery point will remain in archive forever. For more information, see [Impact of stop protection on recovery points](manage-recovery-points.md#impact-of-stop-protection-on-recovery-points).

### Is Cross Region restore supported from archive tier?

When you move your data in GRS vaults from standard tier to archive tier, the data moves into GRS archive. This is true even when Cross region restore is enabled. Once the backup data moves into archive tier, you can’t restore the data into the paired region. However, during region failures, the backup data in secondary region will become available for restore. 

While restoring from recovery point in Archive tier in primary region, the recovery point is copied to the Standard tier and is retained according to the rehydration duration, both in primary and secondary region. You can perform Cross region restore from these rehydrated recovery points.

### I can see eligible recovery points for my Virtual Machine, but I can't seeing any recommendation. What can be the reason?

The recovery points for Virtual Machines meet the eligibility criteria. So, there are archivable recovery points. However, the churn in the Virtual Machine may be low, thus there are no recommendations. In this scenario, though you can move the archivable recovery points to archive tier, but it may increase the overall backup storage costs.

### I have stopped protection and retained data for my workload. Can I move the recovery points to archive tier?

No. Once protection is stopped for a particular workload, the corresponding recovery points can't be moved to the archive tier. To move recovery points to archive tier, you need to resume the protection on the data source.

### How do I ensure that all recovery points are moved to Archive tier, if moved via Azure portal?

To ensure that all recovery points are moved to Archive tier, 

1. Select the required workload.
1. Go to **Move Recovery Points** by following [these steps](./use-archive-tier-support.md?pivots=client-portaltier#move-recommended-recovery-points-for-a-particular-azure-virtual-machine).

If the list of recovery points is blank, then all the eligible/recommended recovery points are moved to the vault Archive tier.

## Next steps

- [Use Archive tier](use-archive-tier-support.md)
- [Azure Backup pricing](azure-backup-pricing.md)
