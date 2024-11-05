---
title: Manage backed up SAP ASE databases on Azure VMs
description: In this article, you'll learn the common tasks for managing and monitoring SAP ASE databases that are running on Azure virtual machines.
ms.topic: how-to
ms.date: 11/12/2024
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Manage and monitor backed up SAP ASE databases

This article describes common tasks for managing and monitoring SAP ASE databases that are running on an Azure virtual machine (VM) and backed up to an Azure Backup Recovery Services vault by the [Azure Backup](./backup-overview.md) service. 

You'll learn how to monitor jobs and alerts, trigger an on-demand backup, edit policies, stop and resume database protection, and unregister a VM from backups.

If you haven't configured backups yet for your SAP ASE databases, see Back up SAP ASE databases on Azure VMs. To learn more about the supported configurations and scenarios, see [Support matrix for backup of SAP ASE databases on Azure VMs](sap-ase-backup-support-matrix.md).

## Monitor backup jobs

Azure Backup shows all manually triggered jobs in the Backup jobs section of Recovery Services Vault.

:::image type="content" source="media/sap-adaptive-server-enterprise-db-manage/monitor-backup-jobs.png" alt-text="Screenshot showing how to monitor backup jobs." lightbox="media/sap-adaptive-server-enterprise-db-manage/monitor-backup-jobs.png":::

## Review backup status 

Azure Backup periodically synchronizes the datasource between the extension installed on the VM and Azure Backup service, and shows the backup status in the Azure portal. The following table lists the (four) backup status for a datasource: 

| **Backup state** | **Description** |
| ------------ | ----------- |
| **Healthy** | The last backup is successful. |
| **Unhealthy** | The last backup has failed. |
| **NotReachable** | Currently, there's no synchronization occurring between the extension on the VM and the Azure Backup service. |
| **IRPending** | The first backup on the datasource hasn't occurred yet. |

Generally, synchronization occurs every *hour*. However, at the extension level, Azure Backup polls every *5 minutes* to check for any changes in the status of the latest backup compared to the previous one. For example, if the previous backup is successful but the latest backup has failed, Azure Backup syncs that information to the service to update the backup status in the Azure portal accordingly to *Healthy or Unhealthy*. 

If no data sync occurs to the Azure Backup service for more than *2 hours*, Azure Backup shows the backup status as *NotReachable*. This scenario might occur if the VM is shut down for an extended period or there's a network connectivity issue on the VM, causing the synchronization to cease. Once the VM is operational again and the extension services restart, the data sync operation to the service resumes, and the backup status changes to *Healthy or Unhealthy* based on the status of the last backup. 

:::image type="content" source="media/sap-adaptive-server-enterprise-db-manage/backup-items.png" alt-text="Screenshot showing the status of backed up items." lightbox="media/sap-adaptive-server-enterprise-db-manage/backup-items.png":::

## Change Backup policy

You can change the underlying policy for an SAP ASE backup items > View details > Backup policy > Change Backup Policy.

Making policy modifications affects all the associated backup items and triggers corresponding configure protection jobs.

:::image type="content" source="media/sap-adaptive-server-enterprise-db-manage/change-backup-jobs.png" alt-text="Screenshot showing how to change backup jobs." lightbox="media/sap-adaptive-server-enterprise-db-manage/change-backup-jobs.png":::

## Edit a Policy
To modify the policy to change backup types, frequencies, and retention range, follow these steps:

>[!Note]
>Any change in the retention period will be applied to both the new recovery points and, retroactively, to all the older recovery points.

1. On the **Recovery Services Vault**, go to **Backup Policies**, and then select the policy you want to edit.

  :::image type="content" source="media/sap-adaptive-server-enterprise-db-manage/edit-policy.png" alt-text="Screenshot showing how to edit backup policy." lightbox="media/sap-adaptive-server-enterprise-db-manage/edit-policy.png":::

Modifying the backup policy affects all the associated backup items and triggers the corresponding configure protection jobs.

## Stop protection for an SAP HANA database or HANA instance

You can stop protecting an SAP ASE database in a couple of ways:

- Delete backup data -Stop all future backup jobs and delete all recovery points.

- Retain backup data -Stop all future backup jobs and leave the recovery points intact.

If you choose to leave recovery points, keep these details in mind:

- All recovery points will remain intact forever, and all pruning will stop at stop protection with retain data.

- You'll incur charges for the protected instance and the consumed storage. For more information, see Azure Backup pricing.

- If you delete a data source without stopping backups, new backups will fail.

   :::image type="content" source="media/sap-adaptive-server-enterprise-db-manage/stop-backup.png" alt-text="Screenshot showing how to stop backup." lightbox="media/sap-adaptive-server-enterprise-db-manage/stop-backup.png":::

   :::image type="content" source="media/sap-adaptive-server-enterprise-db-manage/retain-backup-data.png" alt-text="Screenshot showing how to retain backup data." lightbox="media/sap-adaptive-server-enterprise-db-manage/retain-backup-data.png":::

## Resume protection for an SAP ASE database

When you stop protection for an SAP ASE database, if you select the Retain Backup Data option, you can later resume protection. If you don't retain the backed-up data, you can't resume protection.

To resume protection for an SAP ASE database:

1.	Open the backup item, and then select **Resume backup**.
2.	On the **Backup policy** menu, select a policy, and then select **Save**.

   :::image type="content" source="media/sap-adaptive-server-enterprise-db-manage/resume-backup.png" alt-text="Screenshot showing how to resume backup." lightbox="media/sap-adaptive-server-enterprise-db-manage/resume-backup.png":::

## Unregister an SAP ASE instance

Unregister an SAP ASE instance after you disable protection but before you delete the vault:

1.	In the **Recovery Services** vault, under **Manage**, select **Backup Infrastructure**.

   :::image type="content" source="media/sap-adaptive-server-enterprise-db-manage/backup-infrastructure.png" alt-text="Screenshot showing how to backup infrastructure." lightbox="media/sap-adaptive-server-enterprise-db-manage/backup-infrastructure.png":::

2. For **Backup Management type**, select **Workload in Azure VM**.

   :::image type="content" source="media/sap-adaptive-server-enterprise-db-manage/select-workload.png" alt-text="Screenshot showing how to select workload in Azure VM." lightbox="media/sap-adaptive-server-enterprise-db-manage/select-workload.png":::

3. On the **Protected Servers** pane, select the instance to unregister. To delete the vault, you must unregister all servers and instances.

   :::image type="content" source="media/sap-adaptive-server-enterprise-db-manage/select-instance.png" alt-text="Screenshot showing how to select instance to deregister." lightbox="media/sap-adaptive-server-enterprise-db-manage/select-instance.png":::

## Configure striping for higher backup throughput for SAP ASE databases

Striping is designed to enhance backup efficiency further by allowing data to be streamed through multiple backup channels simultaneously. This is beneficial for large databases, where the time required to complete a backup can be significant. By distributing the data across multiple stripes, striping significantly reduces backup time, allowing for more efficient use of both storage and network resources. Based on our internal testing we saw 30-40% increase in throughput performance and we highly recommend testing the striping configuration before making changes on production.

### Enable striping for SAP ASE databases

During the execution of the preregistration script, you can control the enable-striping parameter by setting it to true or false depending on your need. Additionally, a new configuration parameter, stripesCount, is introduced, which defaults to 4 but can be modified to suit your requirements.

### Recommended configuration

For databases smaller than 4 TB, we suggest using a stripe count of 4. This configuration provides an optimal balance between performance and resource utilization, ensuring a smooth and efficient backup process.

### Change the database stripe count

You have two ways to modify the stripe count:

- **Pre-registration script**: Run the preregistration script and specify your preferred value using the stripes-count parameter.

   >[!Note]
   >This parameter is optional.

- **Configuration file**: Manually update the stripesCount value in the configuration file at the following path: */opt/msawb/etc/config/SAPAse/config.json*

For more information, refer to the [official documentation](/azure/sap/workloads/dbms-guide-sapase).

>[!Note]
>Setting the above ASE parameters will lead to increased memory and CPU utilization. We recommend that you monitor the memory consumption and CPU utilization, as overutilization can  impact the backup and other ASE operations negatively.
