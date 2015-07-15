
<properties
	pageTitle="Azure Backup - restore a virtual machine"
	description="Learn how to restore an Azure virtual machine"
	services="backup"
	documentationCenter=""
	authors="trinadhk"
	manager="shreeshd"
	editor=""/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/27/2015"
	ms.author="trinadhk"/>

# Restore a virtual machine
You can restore a virtual machine to a new VM from the backups stored in Azure backup vault using restore action.

## Choose an item to restore

1. Navigate to the **Protected Items** tab and select the virtual machine you want to restore to a new VM.

    ![Protected items](./media/backup-azure-restore-vms/protected-items.png)

    The **Recovery Point** column in the **Protected Items** page will tell you the number of recovery points for a virtual machine. The **Newest Recovery Point** column tells you the time of the most recent backup from which a virtual machine can be restored.

2. Click **Restore** to open the **Restore an Item** wizard.

    ![Restore an item](./media/backup-azure-restore-vms/restore-item.png)

## Pick a recovery point

1. In the **select a recovery point** screen, you can restore from the newest recovery point, or from a previous point in time. The default option selected when wizard opens is Newest Recovery Point.

    ![Select a recovery point](./media/backup-azure-restore-vms/select-recovery-point.png)

2. To pick an earlier point in time, choose the **Select Date** option in the dropdown and select a date in the calendar control by clicking on the calendar icon. In the control, all dates that have recovery points are filled with a light gray shade and are selectable by the user.

    ![Select a date](./media/backup-azure-restore-vms/select-date.png)

    Once you click on a date in the calendar control, the recovery points available on that date will be shown in recovery points table below. The **Time** column indicates the time at which the snapshot was taken. The **Type** column displays the [consistency](https://azure.microsoft.com/documentation/articles/backup-azure-vms/#consistency-of-recovery-points) of the recovery point. The table header shows the number of recovery points available on that day in parenthesis.

    ![Recovery points](./media/backup-azure-restore-vms/recovery-points.png)

3. Select the recovery point from the **Recovery Points** table and click on the Next arrow to go to the next screen.

## Specify a destination location

1. In the **Select restore instance** screen specify details of where to restore the virtual machine.

  - Specify the virtual machine name: In a given cloud service, the virtual machine name should be unique. If you plan to replace an existing VM with the same name, first delete the existing VM and data disks and then restore the data from Azure Backup.
  - Select a cloud service for the VM: This is mandatory for creating a VM. You can choose to either use an existing cloud service or create a new cloud service.

        Whatever cloud service name is picked should be globally unique. Typically, the cloud service name gets associated with a public-facing URL in the form of [cloudservice].cloudapp.net. Azure will not allow you to create a new cloud service if the name has already been used. If you choose to create select create a new cloud service, it will be given the same name as the virtual machine – in which case the VM name picked should be unique enough to be applied to the associated cloud service.

        We only display cloud services and virtual networks that are not associated with any affinity groups in the restore instance details. [Learn More](https://msdn.microsoft.com/en-us/library/azure/jj156085.aspx).

2. Select a storage account for the VM: This is mandatory for creating the VM. You can select from existing storage accounts in the same region as the Azure Backup vault. We don’t support storage accounts that are Zone redundant or of Premium storage type.

    If there are no storage accounts with supported configuration, please create a storage account of supported configuration prior to starting restore operation.

    ![Select a virtual network](./media/backup-azure-restore-vms/restore-sa.png)

3. Select a Virtual Network: The virtual network (VNET) for the virtual machine should be selected at the time of creating the VM. The restore UI shows all the VNETs within this subscription that can be used. It is not mandatory to select a VNET for the restored VM – you will be able to connect to the restored virtual machine over the internet even if the VNET is not applied.

    If the cloud service selected is associated with a virtual network, then you cannot change the virtual network.

    ![Select a virtual network](./media/backup-azure-restore-vms/restore-cs-vnet.png)

4. Select a subnet: In case the VNET has subnets, by default the first subnet will be selected. Choose the subnet of your choice from the dropdown options. For subnet details, go to Networks extension in the [portal home page](https://manage.windowsazure.com/), go to Virtual Networks and select the virtual network and drill down into Configure to see subnet details.

    ![Select a subnet](./media/backup-azure-restore-vms/select-subnet.png)

5. Click on the **Submit** icon in the wizard to submit the details and create a restore job.

## Track the Restore operation
Once you have input all the information into the restore wizard and submitted it Azure Backup will try to create a job to track the restore operation.

![Creating a restore job](./media/backup-azure-restore-vms/create-restore-job.png)

If job creation is successful, you will see a toast notification indicating job is created. You can get more details by clicking on the **View Job** button that will take you to **Jobs** tab.

![Restore job created](./media/backup-azure-restore-vms/restore-job-created.png)

Once the restore operation is finished, it will be marked as completed in **Jobs** tab.

![Restore job complete](./media/backup-azure-restore-vms/restore-job-complete.png)

After restoring the virtual machine you may need to re-install the extensions existing on the original VM and [modify the endpoints](virtual-machines-set-up-endpoints) for the virtual machine in the Azure portal.

## Troubleshooting errors
For most errors, you can follow the recommended action suggested in the Error Details. Here are some additional points to help with the troubleshooting:

| Backup operation | Error details | Workaround |
| -------- | -------- | -------|
| Restore | Restore failed with Cloud Internal error | <ol><li>Cloud service to which you are trying to restore is configured with DNS settings. You can check <br>$deployment = Get-AzureDeployment -ServiceName "ServiceName" -Slot "Production" 	Get-AzureDns -DnsSettings $deployment.DnsSettings<br>If there is Address configured, this means that DNS settings are configured.<br> <li>Cloud service to which to you are trying to restore is configured with ReservedIP and existing VMs in cloud service are in stopped state.<br>You can check a cloud service has reserved IP by using following powershell cmdlets:<br>$deployment = Get-AzureDeployment -ServiceName "servicename" -Slot "Production" $dep.ReservedIPName</ol> |

## Next steps
- [Manage virtual machines](backup-azure-manage-vms)

 
