
<properties
	pageTitle="Restore virtual machines from backup using Azure portal | Microsoft Azure"
	description="Restore an Azure virtual machine from a recovery point using Azure portal"
	services="backup"
	documentationCenter=""
	authors="markgalioto"
	manager="cfreeman"
	editor=""
	keywords="restore backup; how to restore; recovery point;"/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/10/2016"
	ms.author="trinadhk; jimpark;"/>


# Use Azure portal to restore virtual machines

> [AZURE.SELECTOR]
- [Restore VMs in Classic portal](backup-azure-restore-vms.md)
- [Restore VMs in Azure portal](backup-azure-arm-restore-vms.md)


Protect your data by taking snapshots of your data at defined intervals. These snapshots are known as recovery points, and they are stored in recovery services vaults. If or when it is necessary to repair or rebuild a VM, you can restore the VM from any of the saved recovery points. When you restore a recovery point, you return or revert the VM to the state when the recovery point was taken. This article explains how to restore a VM.

> [AZURE.NOTE] Azure has two deployment models for creating and working with resources: [Resource Manager and classic](../resource-manager-deployment-model.md). This article provides the information and procedures for restoring VMs deployed using the Resource Manager model.



## Restore a recovery point

1. Sign in to the [Azure portal](http://portal.azure.com/)

2. On the Azure menu, click **Browse** and in the list of services, type **Recovery Services**. The list of services adjusts to what you type. When you see **Recovery Services vaults**, select it.

    ![Open Recovery Services vault](./media/backup-azure-arm-restore-vms/open-recovery-services-vault.png)

    The list of vaults in the subscription is displayed.

    ![List of Recovery Services vaults](./media/backup-azure-arm-restore-vms/list-of-rs-vaults.png)

3. From the list, select the vault associated with the VM you want to restore. When you click the vault, its dashboard opens.

    ![List of Recovery Services vaults](./media/backup-azure-arm-restore-vms/select-vault-open-vault-blade.png)

4. Now that you're in the vault dashboard. On the **Backup Items** tile, click **Azure Virtual Machines** to display the VMs associated with the vault.

    ![vault dashboard](./media/backup-azure-arm-restore-vms/vault-dashboard.png)

    The **Backup Items** blade opens and displays the list of Azure virtual machines.

    ![list of VMs in vault](./media/backup-azure-arm-restore-vms/list-of-vms-in-vault.png)

5. From the list, select a VM to open the dashboard. The VM dashboard opens to the Monitoring area, which contains the Restore points tile.

    ![list of VMs in vault](./media/backup-azure-arm-restore-vms/vm-blade.png)

6. On the VM dashboard menu, click **Restore**

    ![list of VMs in vault](./media/backup-azure-arm-restore-vms/vm-blade-menu-restore.png)

    The Restore blade opens.

    ![restore blade](./media/backup-azure-arm-restore-vms/restore-blade.png)

7. On the **Restore** blade, click **Restore point** to open the **Select Restore point** blade.

    ![restore blade](./media/backup-azure-arm-restore-vms/recovery-point-selector.png)

    By default, the dialog displays all restore points from the last 30 days. Use the **Filter** to alter the time range of the restore points displayed. By default, restore points of all consistency are displayed. Modify **All Restore points** filter to select a specific consistency of restore points. For more information about each type of restoration point, see the explanation of [Data consistency](./backup-azure-vms-introduction.md#data-consistency).  
    - **Restore point consistency** from this list choose:
        - Crash consistent restore points,
        - Application consistent restore points,
        - File system consistent restore points
        - All restore points.  

8. Choose a Restore point and click **OK**.

    ![choose restore point](./media/backup-azure-arm-restore-vms/select-recovery-point.png)

    The **Restore** blade shows the Restore point is set.

    ![restore point is set](./media/backup-azure-arm-restore-vms/recovery-point-set.png)

9. On the **Restore** blade, **Restore configuration** opens automatically after restore point is set.

    ![restore configuration wizard is set](./media/backup-azure-arm-restore-vms/recovery-configuration-wizard.png)

## Choosing a VM restore configuration

Now that you have selected the restore point, choose a configuration for your restore VM. Your choices for configuring the restored VM are to use: Azure portal or PowerShell.

> [AZURE.NOTE] Portal provides a Quick Create option for restored VM. If you want to customize the VM configuration of the to-be restored VM, use PowerShell to restore backed up disks and attach them to choice of VM configuration. See [Restoring a VM with special network configurations](#restoring-vms-with-special-network-configurations).

1. If you are not already there, go to the **Restore** blade. Ensure a **Restore point** has been selected, and click **Restore configuration** to open the **Recovery configuration** blade.

    ![recovery configuration wizard is set](./media/backup-azure-arm-restore-vms/recovery-configuration-wizard.png)

2. On the **Restore configuration** blade, enter or select values for each of the following fields:
    - **Virtual machine name** - Provide a name for the VM. The name must be unique to the resource group (for a Resource Manager-deployed VM) or cloud service (for a Classic VM). You cannot replace the virtual machine if it already exists in the subscription.
    - **Resource group** - Use an existing resource group, or create a new one. If you are restoring a Classic VM, use this field to specify the name of a new cloud service. If you are create a new resource group/cloud service, the name must be globally unique. Typically, the cloud service name is associated with a public-facing URL - for example: [cloudservice].cloudapp.net. If you attempt to use a name for the cloud resource group/cloud service that has already been used, Azure assigns the resource group/cloud service the same name as the VM. Azure displays resource groups/cloud services and VMs not associated with any affinity groups. For more information, see [How to migrate from Affinity Groups to a Regional Virtual Network (VNet)](../virtual-network/virtual-networks-migrate-to-regional-vnet.md).
    - **Virtual Network** - Select the virtual network (VNET) when creating the VM. The field provides all VNETs associated with the subscription. Resource group of the VM is displayed in parentheses.
    - **Subnet** - If the VNET has subnets, the first subnet is selected by default. If there are additional subnets, select the desired subnet.
    - **Storage account** - This menu lists the storage accounts in the same location as the Recovery Services vault. When choosing a storage account, select an account that shares the same location as the Recovery Services vault. Storage accounts that are Zone redundant are not supported. If there are no storage accounts with the same location as the Recovery Services vault, you must create one before starting the restore operation. The storage account's replication type is mentioned in parentheses.

    > [AZURE.NOTE] If you are restoring a Resource Manager-deployed VM, you must identify a virtual network (VNET). A virtual network (VNET) is optional for a Classic VM.

3. On the **Restore configuration** blade, click **OK** to finalize the restore configuration.

4. On the **Restore** blade, click **Restore** to trigger the restore operation.

    ![Recovery configuration completed](./media/backup-azure-arm-restore-vms/trigger-restore-operation.png)

## Track the restore operation

Once you trigger the restore operation, the Backup service creates a job for tracking the restore operation. The Backup service also creates and temporarily displays the notification in Notifications area of portal. If you do not see the notification, you can always click the Notifications icon to view your notifications.

![Restore triggered](./media/backup-azure-arm-restore-vms/restore-notification.png)

To view the operation while it is processing, or to view when it completed, open the Backup jobs list.

1. On the Azure menu, click **Browse** and in the list of services, type **Recovery Services**. The list of services adjusts to what you type. When you see **Recovery Services vaults**, select it.

    ![Open Recovery Services vault](./media/backup-azure-arm-restore-vms/open-recovery-services-vault.png)

    The list of vaults in the subscription is displayed.

    ![List of Recovery Services vaults](./media/backup-azure-arm-restore-vms/list-of-rs-vaults.png)

2. From the list, select the vault associated with the VM you restored. When you click the vault, its dashboard opens.

3. In the vault dashboard on the **Backup Jobs** tile, click **Azure Virtual Machines** to display the jobs associated with the vault.

    ![vault dashboard](./media/backup-azure-arm-restore-vms/vault-dashboard-jobs.png)

    The **Backup Jobs** blade opens and displays the list of jobs.

    ![list of VMs in vault](./media/backup-azure-arm-restore-vms/restore-job-in-progress.png)

## Restoring VMs with special network configurations
It is possible to backup and restore VMs with the following special network configurations. However, these configurations require some special consideration while going through the restore process.

- VMs under load balancer (internal and external)
- VMs with multiple reserved IPs
- VMs with multiple NICs

>[AZURE.IMPORTANT] When creating the special network configuration for VMs, you must use PowerShell to create VMs from the disks restored.

To fully recreate the virtual machines after restoring to disk, follow these steps:

1. Restore the disks from a recovery services vault using [PowerShell](../backup-azure-vms-automation.md#restore-an-azure-vm)

2. Create the VM configuration required for load balancer/multiple NIC/multiple reserved IP using the PowerShell cmdlets and use it to create the VM of desired configuration.
	- Create VM in cloud service with [Internal Load balancer ](https://azure.microsoft.com/documentation/articles/load-balancer-internal-getstarted/)
	- Create VM to connect to [Internet facing load balancer] (https://azure.microsoft.com/en-us/documentation/articles/load-balancer-internet-getstarted/)
	- Create VM with [multiple NICs](https://azure.microsoft.com/documentation/articles/virtual-networks-multiple-nics/)
	- Create VM with [multiple reserved IPs](https://azure.microsoft.com/documentation/articles/virtual-networks-reserved-public-ip/)

## Next steps
Now that you can restore your VMs, see the troubleshooting article for information on common errors with VMs. Also, check out the article on managing tasks with your VMs.

- [Troubleshooting errors](backup-azure-vms-troubleshoot.md#restore)
- [Manage virtual machines](backup-azure-manage-vms.md)
