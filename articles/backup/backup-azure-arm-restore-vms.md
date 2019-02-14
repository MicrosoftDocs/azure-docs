---
title: 'Azure Backup: Restore virtual machines by using the Azure portal'
description: Restore an Azure virtual machine from a recovery point by using the Azure portal
services: backup
author: geethalakshmig
manager: vijayts
keywords: restore backup; how to restore; recovery point;
ms.service: backup
ms.topic: conceptual
ms.date: 09/04/2017
ms.author: geg
---
# Use the Azure portal to restore virtual machines
Protect your data by taking snapshots of your data at defined intervals. These snapshots are known as recovery points, and they're stored in Recovery Services vaults. If it's necessary to repair or rebuild a virtual machine (VM), you can restore the VM from any of the saved recovery points. When you restore a recovery point, you can:

* Create a new VM: From a point-in-time recovery point of your backed-up VM.
* Restore disks: Use the template that comes with the process to customize the restored VM, or do an individual file recovery.

This article explains how to restore a VM to a new VM or restore all backed-up disks. For individual file recovery, see [Recover files from an Azure VM backup](backup-azure-restore-files-from-vm.md).

![Three ways to restore from VM backup](./media/backup-azure-arm-restore-vms/azure-vm-backup-restore.png)


Restoring a VM or all disks from VM backup involves two steps:

* Select a restore point for restore.
* Select the restore type
    - Option 1: Create a new VM
    - Option 2: Restore disks.

## Select a restore point for restore
1. Sign in to the [Azure portal](http://portal.azure.com/).

2. On the Azure menu, select **All services**. In the list of services, type **Recovery Services** or go to **STORAGE** where the **Recovery Service vaults** is listed, select it.

    ![Recovery Services vault](./media/backup-azure-arm-restore-vms/open-recovery-services-vault1.png)

3. The list of vaults in the subscription is displayed.

    ![List of Recovery Services vaults](./media/backup-azure-arm-restore-vms/list-of-rs-vaults1.png)

4. From the list of Recovery Service vaults, select the vault associated with the VM you want to restore. When you select the vault, its dashboard opens.

    ![Selected Recovery Services vault](./media/backup-azure-arm-restore-vms/select-vault-open-vault-blade1.png)

5. In the vault dashboard, on the **Backup Items** tile, select **Azure Virtual Machine**.

    ![Vault dashboard](./media/backup-azure-arm-restore-vms/vault-dashboard1.png)

6. The **Backup Items** blade with the list of Azure VMs is opened.

    ![List of VMs in vault](./media/backup-azure-arm-restore-vms/list-of-vms-in-vault1.png)

7. From the list, select a VM to open the dashboard. The VM dashboard opens to the monitoring area, which contains the **Recovery points**. All VM level operations like **Backup now**, **File recovery**, **Stop backup** can be performed from this blade.
Restore can be performed in many ways from this blade. Note that this blade lists only the last 30 days recovery points.

    - To restore using a restore point from the last 30 days, right-click the VM > **Restore VM**.
    - To restore using a restore point older than 30 days, click the link under **Restore Points**.
    - To list and filter VMs with customized dates, click **Restore VM** in the menu. Use the filter to modify the time range for the displayed restore points. You can also filter on different types of data consistency.
8. Review the restore point settings:
    - Data consistency shows the [type of consistency](backup-azure-vms-introduction.md#consistency-types) in the recovery point.
    - The **Recovery Type** shows where the point is stored (in a storage account, in the vault, or both. [Learn more](https://azure.microsoft.com/blog/large-disk-support/) about instant recovery points.

  ![Restore points](./media/backup-azure-arm-restore-vms/vm-blade1.png)
9. Select a restore point.

10. Select **Restore configuration**. The **Restore configuration** blade opens.

## Choose a VM restore configuration
After you select the restore point, choose a VM restore configuration. To configure the restored VM, you can use the Azure portal or PowerShell.

### Restore options

**Option** | **Details**
--- | ---
**Create new-create VM** | Equivalent to quick create of a VM. Gets a basic VM up and running from a restore point.<br/><br/> The VM settings can be modified as part of the restore process.
**Create new-restore disk** | Creates a VM that you can customize as part of the restore process.<br/><br/> This option copies VHDs to the storage account you specify.<br/><br/> - The storage account should be in the same location as the vault.<br/><br/> If you don't have an appropriate storage account you need to create one.<br/><br/> The storage account replication type is shown in parentheses. Zone redundant storage (ZRS) isn't supported.<br/><br/> From the storage account you can either attach the restored disks to an existing VM, or create a new VM from the restored disks using PowerShell.
**Replace existing** | With this option you don't need to create a VM.<br/><br/> The current VM must exist. If it's been deleted this option can't be used.<br/><br/> Azure Backup takes a snapshot of the existing VM and stores it in the staging location specified. The existing disks connected to the VM are then replaced with the selected restore point. The snapshot created previously is copied to the vault and stored as a recovery point in accordance with your backup retention policy.<br/><br/> Replace existing is supported for unencrypted managed VMs. It's not supported for unmanaged disks, [generalized VMs](https://docs.microsoft.com/azure/virtual-machines/windows/capture-image-resource), or for VMs [created using custom images](https://azure.microsoft.com/resources/videos/create-a-custom-virtual-machine-image-in-azure-resource-manager-with-powershell/).<br/><br/> If the restore point has more or less disks than the current VM, then the number of disks in the restore point will only reflect the VM.

> [!NOTE]
> If you want to restore a VM with advanced networking settings, for example if they're managed by an internal or external load balancer, or have multiple NICs or multiple reserved IP addresses, restore with PowerShell. [Learn more](#restore-vms-with-special-network-configurations).
> If a Windows VM uses [HUB licensing](../virtual-machines/windows/hybrid-use-benefit-licensing.md), use the **Create new-restore disk** option, and then use PowerShell or the restore template to create the VM with **License Type** set to **Windows_Server**. This setting can also be applied after creating the VM.


Specify the restore setting as follows:

1. In **Restore**, select a [restore point](#select-a-restore-point-for-restore) > **Restore configuration**.
2. In **Restore configuration**, select how you want to restore the VM in accordance with the settings summarized in the table above.

    ![Restore configuration wizard](./media/backup-azure-arm-restore-vms/restore-configuration-create-new1.png)


## Create new-Create a VM

1. In **Restore configuration** > **Create new** > **Restore Type**, select **Create a virtual machine**.
2. In **Virtual machine name**, specify a VM which doesn’t exist in the subscription.
3. In **Resource group**, select an existing resource group for the new VM, or create a new one with a globally unique name. If you assign a name that already existing, Azure assigns the group the same name as the VM.
4. In **Virtual network**, select the VNet in which the VM will be placed. All VNets associated with the subscription are displayed. Select the subnet. The first subnet is selected by default.
5. In **Storage Location**, specify the storage type used for the VM.

    ![Restore configuration wizard](./media/backup-azure-arm-restore-vms/recovery-configuration-wizard1.png)

6. In **Restore configuration**, select **OK**. In **Restore**, click **Restore** to trigger the restore operation.



## Create new-Restore disks

1. In **Restore configuration** > **Create new** > **Restore Type**, select **Restore disks**.
2. In **Resource group**, select an existing resource group for the restored disks, or create a new one with a globally unique name.
3. In **Storage account**, specify the account to which to copy the VHDs. Make sure the account is in the same region as the vault.

    ![Recovery configuration completed](./media/backup-azure-arm-restore-vms/trigger-restore-operation1.png)

4. In **Restore configuration**, select **OK**. In **Restore**, click **Restore** to trigger the restore operation.
5. After the disk is restored, you can do any of the following to complete the VM restore operation.

    - Use the template that was generated as part of the restore operation to customize settings, and trigger VM deployment. You edit the default template settings, and submit the template for VM deployment.
    - You can [attach the restored disks](https://docs.microsoft.com/azure/virtual-machines/windows/attach-disk-ps) to an existing VM.
    - You can [create a new VM](backup-azure-vms-automation.md#restore-an-azure-vm) from the restored disks using PowerShell.


## Replace existing disks

Use this option to replace existing disks in the current VM with the selected restore point.

1. In **Restore configuration**, click **Replace existing**.
2. In **Restore Type**, select **Replace disk/s** (the restore point that will replace the existing VM disk or disks).
3. In **Staging Location**, specify where snapshots of the current managed disks should be saved.

   ![Restore configuration wizard Replace Existing](./media/backup-azure-arm-restore-vms/restore-configuration-replace-existing.png)


## Track the restore operation
After you trigger the restore operation, the backup service creates a job for tracking the restore operation. The backup service also creates and temporarily displays the notification in the **Notifications** area of the portal. If you don't see the notification, select the **Notifications** symbol to view your notifications.

![Restore triggered](./media/backup-azure-arm-restore-vms/restore-notification1.png)

Click on the hyperlink of the notifications to go to **BackupJobs** list. All the details of the operations for a given job is available in the **BackupJobs** lists. You can go to **BackupJobs** from the vault dashboard by clicking the Backup Jobs tile, select **Azure virtual machine** to display the jobs associated with the vault.

The **Backup jobs** blade opens and displays the list of jobs.

![List of VMs in a vault](./media/backup-azure-arm-restore-vms/restore-job-in-progress1.png)

**Progress bar** is now available in the **Restore Details** blade. The **Restore Details** blade can be opened by clicking any restore job which has status **in-progress**. The **Progress bar** is available in all variants of restores like **Create New**, **Restore Disk** and **Replace existing**. The details carried by Restore Progress bar are **estimated time of restore**, **percentage of restore** and **number of bytes transferred**.

Restore Progress bar details are given below:

- **Estimated time of restore** initially provides the time taken to complete the restore operation. As the operation progresses, the time taken reduces and reaches 0 once the restore operation completes.
- **Percentage of restore** provides the data how much percentage of restore operation is completed.
- **Number of bytes transferred** is available in the sub task when restore happens through Create New VM. This provides the details of how many numbers of bytes were transferred against the total number of bytes to be transferred.


## Use templates to customize a restored VM
After the [restore disks operation is finished](#Track-the-restore-operation), use the template that was generated as part of the restore operation to create a new VM with a configuration different from the backup configuration. You also can use it to customize names of resources that were created during the process of creating a new VM from a restore point.

![Restore job drill-down](./media/backup-azure-arm-restore-vms/restore-job-drill-down1.png)

To get the template that was generated as part of the restore disks option:

1. Go to the **Restore Job Details** corresponding to the job.

2. On the **Restore Job Details** screen, select **Deploy Template** to initiate template deployment.

3. On the **Deploy template** blade for custom deployment, use template deployment to [edit and deploy the template](../azure-resource-manager/resource-group-template-deploy-portal.md#deploy-resources-from-custom-template) or append more customizations by [authoring a template](../azure-resource-manager/resource-group-authoring-templates.md) before you deploy.

  ![Load template deployment](./media/backup-azure-arm-restore-vms/edit-template1.png)

4. After you enter the required values, accept the **Terms and Conditions** and select **Purchase**.

  ![Submit template deployment](./media/backup-azure-arm-restore-vms/submitting-template1.png)

## Post-restore steps
* If you use a cloud-init-based Linux distribution, such as Ubuntu, for security reasons, the password is blocked post restore. Use the VMAccess extension on the restored VM to [reset the password](../virtual-machines/linux/reset-password.md). We recommend using SSH keys on these distributions to avoid resetting the password post restore.
* Extensions present during the backup configuration are installed, but they won't be enabled. If you see an issue, reinstall the extensions.
* If the backed-up VM has static IP post restore, the restored VM has a dynamic IP to avoid conflict when you create a restored VM. Learn more about how you can [add a static IP to a restored VM](../virtual-network/virtual-networks-reserved-private-ip.md#how-to-add-a-static-internal-ip-to-an-existing-vm).
* A restored VM doesn't have an availability value set. We recommend using the restore disks option to [add an availability set](../virtual-machines/windows/tutorial-availability-sets.md) when you create a VM from PowerShell or templates by using restored disks.


## Backup for restored VMs
If you restored a VM to the same resource group with the same name as the originally backed-up VM, backup continues on the VM post restore. If you restored the VM to a different resource group or you specified a different name for the restored VM, the VM is treated as if it's a new VM. You need to set up backup for the restored VM.

## Restore a VM during an Azure datacenter disaster
Azure Backup allows restoring backed-up VMs to the paired datacenter in case the primary datacenter where VMs are running experiences a disaster and you configured the backup vault to be geo-redundant. During such scenarios, select a storage account, which is present in a paired datacenter. The rest of the restore process remains the same. Backup uses the compute service from the paired geo to create the restored VM. For more information, see [Azure datacenter resiliency](../resiliency/resiliency-technical-guidance-recovery-loss-azure-region.md).

## Restore domain controller VMs
Backup of domain controller (DC) VMs is a supported scenario with Backup. However, you must be careful during the restore process. The correct restore process depends on the structure of the domain. In the simplest case, you have a single DC in a single domain. More commonly for production loads, you have a single domain with multiple DCs, perhaps with some DCs on-premises. Finally, you might have a forest with multiple domains.

From an Active Directory perspective, the Azure VM is like any other VM on a modern supported hypervisor. The major difference with on-premises hypervisors is that there's no VM console available in Azure. A console is required for certain scenarios, such as recovering by using a bare-metal recovery (BMR)-type backup. However, VM restore from the backup vault is a full replacement for BMR. Directory Services Restore Mode (DSRM) is also available, so all Active Directory recovery scenarios are viable. For more information, see [Backup and restore considerations for virtualized domain controllers](https://technet.microsoft.com/library/virtual_active_directory_domain_controller_virtualization_hyperv(v=ws.10).aspx#backup_and_restore_considerations_for_virtualized_domain_controllers) and [Planning for Active Directory forest recovery](https://technet.microsoft.com/library/planning-active-directory-forest-recovery(v=ws.10).aspx).

### Single DC in a single domain
The VM can be restored (like any other VM) from the Azure portal or by using PowerShell.

### Multiple DCs in a single domain
When other DCs of the same domain can be reached over the network, the DC can be restored like any VM. If it's the last remaining DC in the domain, or a recovery in an isolated network is performed, a forest recovery procedure must be followed.

### Multiple domains in one forest
When other DCs of the same domain can be reached over the network, the DC can be restored like any VM. In all other cases, we recommend a forest recovery.

## Restore VMs with special network configurations
It's possible to back up and restore VMs with the following special network configurations. However, these configurations require some special consideration while going through the restore process:

* VMs under load balancers (internal and external)
* VMs with multiple reserved IPs
* VMs with multiple NICs

> [!IMPORTANT]
> When you create the special network configuration for VMs, you must use PowerShell to create VMs from the restored disks.
>
>

To fully re-create the VMs after restoring to disk, follow these steps:

1. Restore the disks from a Recovery Services vault by using [PowerShell](backup-azure-vms-automation.md#restore-an-azure-vm).

1. Create the VM configuration required for load balancer/multiple NIC/multiple reserved IP by using the PowerShell cmdlets. Use it to create the VM with the configuration you want:

   a. Create a VM in the cloud service with an [internal load balancer](https://azure.microsoft.com/documentation/articles/load-balancer-internal-getstarted/).

   b. Create a VM to connect to an [internet-facing load balancer](https://azure.microsoft.com/documentation/articles/load-balancer-internet-getstarted/).

   c. Create a VM with [multiple NICs](../virtual-machines/windows/multiple-nics.md).

   d. Create a VM with [multiple reserved IPs](../virtual-network/virtual-network-multiple-ip-addresses-powershell.md).

## Next steps
Now that you can restore your VMs, see the troubleshooting article for information on common errors with VMs. Also, check out the article on managing tasks with your VMs.

* [Troubleshooting errors](backup-azure-vms-troubleshoot.md#restore)
* [Manage virtual machines](backup-azure-manage-vms.md)
