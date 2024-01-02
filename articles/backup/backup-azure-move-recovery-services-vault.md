---
title: How to move Azure Backup Recovery Services vaults 
description: Instructions on how to move a Recovery Services vault across Azure subscriptions and resource groups.
ms.topic: conceptual
ms.date: 02/11/2022
ms.custom: references_regions 
ms.reviewer: caishwarya
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Move a Recovery Services vault across Azure subscriptions and resource groups

This article explains how to move a Recovery Services vault configured for Azure Backup across Azure subscriptions, or to another resource group in the same subscription. You can use the Azure portal or PowerShell to move a Recovery Services vault.

## Supported regions

All public regions and sovereign regions are supported, except France South, France Central, Germany Northeast and Germany Central.

## Prerequisites for moving Recovery Services vault

- During vault move across resource groups, both the source and target resource groups are locked preventing the write and delete operations. For more information, see this [article](../azure-resource-manager/management/move-resource-group-and-subscription.md).
- Only admin subscription has the permissions to move a vault.
- For moving vaults across subscriptions, the target subscription must reside in the same tenant as the source subscription and its state must be enabled. To move a vault to a different Microsoft Entra ID, see [Transfer subscription to a different directory](../role-based-access-control/transfer-subscription.md) and [Recovery Service vault FAQs](./backup-azure-backup-faq.yml).
- You must have permission to perform write operations on the target resource group.
- Moving the vault only changes the resource group. The Recovery Services vault will reside on the same location and it can't be changed.
- You can move only one Recovery Services vault, per region, at a time.
- If a VM doesn't move with the Recovery Services vault across subscriptions, or to a new resource group, the current VM recovery points will remain intact in the vault until they expire.
- Whether the VM is moved with the vault or not, you can always restore the VM from the retained backup history in the vault.
- The Azure Disk Encryption requires that the key vault and VMs reside in the same Azure region and subscription.
- To move a virtual machine with managed disks, see this [article](../azure-resource-manager/management/move-resource-group-and-subscription.md).
- The options for moving resources deployed through the Classic model differ depending on whether you're moving the resources within a subscription, or to a new subscription. For more information, see this [article](../azure-resource-manager/management/move-resource-group-and-subscription.md).
- Backup policies defined for the vault are retained after the vault moves across subscriptions or to a new resource group.
- You can only move a vault that contains any of the following types of backup items. Any backup items of types not listed below will need to be stopped and the data permanently deleted before moving the vault.
  - Azure Virtual Machines
  - Microsoft Azure Recovery Services (MARS) Agent
  - Microsoft Azure Backup Server (MABS)
  - Data Protection Manager (DPM)
- If you move a vault containing VM backup data, across subscriptions, you must move your VMs to the same subscription, and use the same target VM resource group name (as it was in old subscription) to continue backups.

> [!NOTE]
> Moving Recovery Services vaults for Azure Backup across Azure regions isn't supported.<br><br>
> If you've configured any VMs (Azure IaaS, Hyper-V, VMware) or physical machines for disaster recovery using **Azure Site Recovery**, the move operation will be blocked. If you want to move vaults for Azure Site Recovery, review [this article](../site-recovery/move-vaults-across-regions.md) to learn about moving vaults manually.

## Use Azure portal to move Recovery Services vault to different resource group

To move a Recovery Services vault and its associated resources to different resource group:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Open the list of **Recovery Services vaults** and select the vault you want to move. When the vault dashboard opens, it appears as shown in the following image.

   ![Open Recovery Services Vault](./media/backup-azure-move-recovery-services/open-recover-service-vault.png)

   If you don't see the **Essentials** information for your vault, select the drop-down icon. You should now see the Essentials information for your vault.

   ![Essentials Information tab](./media/backup-azure-move-recovery-services/essentials-information-tab.png)

3. In the vault overview menu, select **change** next to the **Resource group**, to open the **Move resources** pane.

   ![Change Resource Group](./media/backup-azure-move-recovery-services/change-resource-group.png)

4. In the **Move resources** pane, for the selected vault it's recommended to move the optional related resources by selecting the checkbox as shown in the following image.

   ![Move Subscription](./media/backup-azure-move-recovery-services/move-resource.png)

5. To add the target resource group, in the **Resource group** drop-down list, select an existing resource group or select **create a new group** option.

   ![Create Resource](./media/backup-azure-move-recovery-services/create-a-new-resource.png)

6. After adding the resource group, confirm **I understand that tools and scripts associated with moved resources will not work until I update them to use new resource IDs** option and then select **OK** to complete moving the vault.

   ![Confirmation Message](./media/backup-azure-move-recovery-services/confirmation-message.png)

## Use Azure portal to move Recovery Services vault to a different subscription

You can move a Recovery Services vault and its associated resources to a different subscription

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Open the list of Recovery Services vaults and select the vault you want to move. When the vault dashboard opens, it appears as shown the following image.

    ![Open Recovery Services Vault](./media/backup-azure-move-recovery-services/open-recover-service-vault.png)

    If you don't see the **Essentials** information for your vault, select the drop-down icon. You should now see the Essentials information for your vault.

    ![Essentials Information tab](./media/backup-azure-move-recovery-services/essentials-information-tab.png)

3. In the vault overview menu, select **change** next to **Subscription**, to open the **Move resources** pane.

   ![Change Subscription](./media/backup-azure-move-recovery-services/change-resource-subscription.png)

4. Select the resources to be moved, here we recommend you to use the **Select All** option to select all the listed optional resources.

   ![move resource](./media/backup-azure-move-recovery-services/move-resource-source-subscription.png)

5. Select the target subscription from the **Subscription** drop-down list, where you want the vault to be moved.
6. To add the target resource group, in the **Resource group** drop-down list, select an existing resource group or select **create a new group** option.

   ![Add Subscription](./media/backup-azure-move-recovery-services/add-subscription.png)

7. Select **I understand that tools and scripts associated with moved resources will not work until I update them to use new resource IDs** option to confirm, and then select **OK**.

> [!NOTE]
> Cross subscription backup (RS vault and protected VMs are in different subscriptions) isn't a supported scenario. Also, storage redundancy option from local redundant storage (LRS) to global redundant storage (GRS) and vice versa can't be modified during the vault move operation.

## Use Azure portal to back up resources in Recovery Services vault after moving across regions

Azure Resource Mover supports the movement of multiple resources across regions. While moving your resources from one region to another, you can ensure that your resources stay protected. As Azure Backup supports protection of several workloads, you may need to take some steps to continue having the same level of protection in the new region.

To understand the detailed steps to achieve this, refer to the sections below.

>[!Note]
>- Azure Backup currently doesn’t support the movement of backup data from one Recovery Services vault to another. To protect your resource in the new region, the resource needs to be registered and backed up to a new/existing vault in the new region. When moving your resources from one region to another, backup data in your existing Recovery Services vaults in the older region can be retained/deleted based on your requirement. If you choose to retain data in the old vaults, you will incur backup charges accordingly.
>- After resource move, to ensure continued security for backed-up resources in a vault that was configured with Multi-User Authorization (MUA), the destination vault should be configured with MUA using a Resource Guard in the destination region. This is because the Resource Guard and the vault must be located in the same region; therefore, the Resource Guard for the source vault can't be used to enable MUA on the destination vault.

### Back up Azure Virtual Machine after moving across regions

When an Azure Virtual Machine (VM) that’s been protected by a Recovery Services vault is moved from one region to another, it can no longer be backed up to the older vault. The backups in the old vault will start failing with the errors **BCMV2VMNotFound** or [**ResourceNotFound**](./backup-azure-vms-troubleshoot.md#320001-resourcenotfound---could-not-perform-the-operation-as-vm-no-longer-exists--400094-bcmv2vmnotfound---the-virtual-machine-doesnt-exist--an-azure-virtual-machine-wasnt-found). For information on how to protect your VMs in the new region, see the following sections.

#### Prepare to move Azure VMs

Before you move a VM, ensure the following prerequisites are met:

1. See the [prerequisites associated with VM move](../resource-mover/tutorial-move-region-virtual-machines.md#prerequisites) and ensure that the VM is eligible for move.
1. [Select the VM on the **Backup Items** tab](./backup-azure-delete-vault.md#delete-protected-items-in-the-cloud) of existing vault’s dashboard and select **Stop protection** followed by retain/delete data as per your requirement. When the backup data for a VM is stopped with retain data, the recovery points remain forever and don’t adhere to any policy. This ensures you always have your backup data ready for restore.
   >[!Note]
   >Retaining data in the older vault will incur backup charges. If you no longer wish to retain data to avoid billing, you need to delete the retained backup data using the  [Delete data option](./backup-azure-manage-vms.md#delete-backup-data).
1. Ensure that the VMs are turned on. All VMs’ disks that need to be available in the destination region are attached and initialized in the VMs.
1. Ensure that VMs have the latest trusted root certificates, and an updated certificate revocation list (CRL). To do so:
   - On Windows VMs, install the latest Windows updates.
   - On Linux VMs, refer to distributor guidance to ensure that machines have the latest certificates and CRL.
1. Allow outbound connectivity from VMs:
   - If you're using a URL-based firewall proxy to control outbound connectivity, allow access to [these URLs](../resource-mover/support-matrix-move-region-azure-vm.md#url-access).
   - If you're using network security group (NSG) rules to control outbound connectivity, create [these service tag rules](../resource-mover/support-matrix-move-region-azure-vm.md#nsg-rules).

#### Move Azure VMs

Move your VM to the new region using [Azure Resource Mover](../resource-mover/tutorial-move-region-virtual-machines.md).

#### Protect Azure VMs using Azure Backup

Start protecting your VM in a new or existing Recovery Services vault in the new region. When you need to restore from your older backups, you can still do it from your old Recovery Services vault if you had chosen to retain the backup data. 

The above steps should help ensure that your resources are being backed up in the new region as well.

### Back up Azure File Share after moving across regions

Azure Backup offers [a snapshot management solution](./backup-afs.md) for your Azure Files today. This means, you don’t move the file share data into the Recovery Services vaults. Also, as the snapshots don’t move with your Storage Account, you’ll effectively have all your backups (snapshots) in the existing region only and protected by the existing vault. However, if you move your Storage Accounts along with the file shares across regions or create new file shares in the new region, see to the following sections to ensure that they are protected by Azure Backup.

#### Prepare to move Azure File Share

Before you move the Storage Account, ensure the following prerequisites are met:

1.	See the [prerequisites to move Storage Account](../storage/common/storage-account-move.md?tabs=azure-portal#prerequisites). 
1. Export and modify a Resource Move template. For more information, see [Prepare Storage Account for region move](../storage/common/storage-account-move.md?tabs=azure-portal#prepare).

#### Move Azure File Share

To move your Storage Accounts along with the Azure File Shares in them from one region to another, see [Move an Azure Storage account to another region](../storage/common/storage-account-move.md).

>[!Note]
>When Azure File Share is copied across regions, its associated snapshots don’t move along with it. In order to move the snapshots data to the new region, you need to move the individual files and directories of the snapshots to the Storage Account in the new region using [AzCopy](../storage/common/storage-use-azcopy-files.md#copy-all-file-shares-directories-and-files-to-another-storage-account).

#### Protect Azure File share using Azure Backup

Start protecting the Azure File Share copied into the new Storage Account in a new or existing Recovery Services vault in the new region.  

Once the Azure File Share is copied to the new region, you can choose to stop protection and retain/delete the snapshots (and the corresponding recovery points) of the original Azure File Share as per your requirement. This can be done by selecting your file share on the [Backup Items tab](./backup-azure-delete-vault.md#delete-protected-items-in-the-cloud) of the original vault’s dashboard. When the backup data for Azure File Share is stopped with retain data, the recovery points remain forever and don’t adhere to any policy.
   
This ensures that you will always have your snapshots ready for restore from the older vault. 
 
### Back up SQL Server/SAP HANA in Azure VM after moving across regions

When you move a VM running SQL or SAP HANA servers to another region, the SQL and SAP HANA databases in those VMs can no longer be backed up in the vault of the earlier region. To protect the SQL and SAP HANA servers running in Azure VM in the new region, see the following sections.

#### Prepare to move SQL Server/SAP HANA in Azure VM

Before you move SQL Server/SAP HANA running in a VM to a new region, ensure the following prerequisites are met:

1. See the [prerequisites associated with VM move](../resource-mover/tutorial-move-region-virtual-machines.md#prerequisites) and ensure that the VM is eligible for move. 
1. Select the VM on the [Backup Items tab](./backup-azure-delete-vault.md#delete-protected-items-in-the-cloud) of the existing vault’s dashboard and select _the databases_ for which backup needs to be stopped. Select **Stop protection** followed by retain/delete data as per your requirement. When the backup data is stopped with retain data, the recovery points remain forever and don’t adhere to any policy. This ensures that you always have your backup data ready for restore.
   >[!Note]
   >Retaining data in the older vault will incur backup charges. If you no longer wish to retain data to avoid billing, you need to delete the retained backup data using [Delete data option](./backup-azure-manage-vms.md#delete-backup-data).
1. Ensure that the VMs to be moved are turned on. All VMs disks that need to be available in the destination region are attached and initialized in the VMs.
1. Ensure that VMs have the latest trusted root certificates, and an updated certificate revocation list (CRL). To do so:
   - On Windows VMs, install the latest Windows updates.
   - On Linux VMs, refer to the distributor guidance and ensure that machines have the latest certificates and CRL.
1. Allow outbound connectivity from VMs:
   - If you're using a URL-based firewall proxy to control outbound connectivity, allow access to [these URLs](../resource-mover/support-matrix-move-region-azure-vm.md#url-access).
   - If you're using network security group (NSG) rules to control outbound connectivity, create [these service tag rules](../resource-mover/support-matrix-move-region-azure-vm.md#nsg-rules).

#### Move SQL Server/SAP HANA in Azure VM

Move your VM to the new region using [Azure Resource Mover](../resource-mover/tutorial-move-region-virtual-machines.md).

#### Protect SQL Server/SAP HANA in Azure VM using Azure Backup

Start protecting the VM in a new/existing Recovery Services vault in the new region. When you need to restore from your older backups, you can still do it from your old Recovery Services vault.
 
The above steps should help ensure that your resources are being backed up in the new region as well.

## Use PowerShell to move Recovery Services vault

To move a Recovery Services vault to another resource group, use the `Move-AzureRMResource` cmdlet. `Move-AzureRMResource` requires the resource name and type of resource. You can get both from the `Get-AzureRmRecoveryServicesVault` cmdlet.

```powershell
$destinationRG = "<destinationResourceGroupName>"
$vault = Get-AzureRmRecoveryServicesVault -Name <vaultname> -ResourceGroupName <vaultRGname>
Move-AzureRmResource -DestinationResourceGroupName $destinationRG -ResourceId $vault.ID
```

To move the resources to different subscription, include the `-DestinationSubscriptionId` parameter.

```powershell
Move-AzureRmResource -DestinationSubscriptionId "<destinationSubscriptionID>" -DestinationResourceGroupName $destinationRG -ResourceId $vault.ID
```

After executing the above cmdlets, you'll be asked to confirm that you want to move the specified resources. Type **Y** to confirm. After a successful validation, the resource moves.

## Use CLI to move Recovery Services vault

To move a Recovery Services vault to another resource group, use the following cmdlet:

```azurecli
az resource move --destination-group <destinationResourceGroupName> --ids <VaultResourceID>
```

To move to a new subscription, provide the `--destination-subscription-id` parameter.

## Post migration

1. Set/verify the access controls for the resource groups.  
2. The Backup reporting and monitoring feature needs to be configured again for the vault after the move completes. The previous configuration will be lost during the move operation.

## Move an Azure virtual machine to a different recovery service vault. 

If you want to move an Azure virtual machine that has backup enabled, then you have two choices. They depend on your business requirements:

- [Don’t need to preserve previous backed-up data](#dont-need-to-preserve-previous-backed-up-data)
- [Must preserve previous backed-up data](#must-preserve-previous-backed-up-data)

### Don’t need to preserve previous backed-up data

To protect workloads in a new vault, the current protection and data will need to be deleted in the old vault and backup is configured again.

>[!WARNING]
>The following operation is destructive and can't be undone. All backup data and backup items associated with the protected server will be permanently deleted. Proceed with caution.

**Stop and delete current protection on the old vault:**

1. Disable soft delete in the vault properties. Follow [these steps](backup-azure-security-feature-cloud.md#disabling-soft-delete-using-azure-portal) to disable soft delete.

2. Stop protection and delete backups from the current vault. In the Vault dashboard menu, select **Backup Items**. Items listed here that need to be moved to the new vault must be removed along with their backup data. See how to [delete protected items in the cloud](backup-azure-delete-vault.md#delete-protected-items-in-the-cloud) and [delete protected items on premises](backup-azure-delete-vault.md#delete-protected-items-on-premises).

3. If you're planning to move AFS (Azure file shares), SQL servers or SAP HANA servers, then you'll need also to unregister them. In the vault dashboard menu, select **Backup Infrastructure**. See how to [unregister the SQL server](manage-monitor-sql-database-backup.md#unregister-a-sql-server-instance), [unregister a storage account associated with Azure file shares](manage-afs-backup.md#unregister-a-storage-account), and [unregister an SAP HANA instance](sap-hana-db-manage.md#unregister-an-sap-hana-instance).

4. Once they're removed from the old vault, continue to configure the backups for your workload in the new vault.

### Must preserve previous backed-up data

If you need to keep the current protected data in the old vault and continue the protection in a new vault, there are limited options for some of the workloads:

- For MARS, you can [stop protection with retain data](backup-azure-manage-mars.md#stop-protecting-files-and-folder-backup) and register the agent in the new vault.

  - Azure Backup service will continue to retain all the existing recovery points of the old vault.
  - You'll need to pay to keep the recovery points in the old vault.
  - You'll be able to restore the backed-up data only for unexpired recovery points in the old vault.
  - A new initial replica of the data will need to be created on the new vault.

- For an Azure VM, you can [stop protection with retain data](backup-azure-manage-vms.md#stop-protecting-a-vm) for the VM in the old vault, move the VM to another resource group, and then protect the VM in the new vault. See [guidance and limitations](../azure-resource-manager/management/move-limitations/virtual-machines-move-limitations.md) for moving a VM to another resource group.

  A VM can be protected in only one vault at a time. However, the VM in the new resource group can be protected on the new vault as it's considered a different VM.

  - Azure Backup service will retain the recovery points that have been backed up on the old vault.
  - You'll need to pay to keep the recovery points in the old vault (see [Azure Backup pricing](azure-backup-pricing.md) for details).
  - You'll be able to restore the VM, if needed, from the old vault.
  - The first backup on the new vault of the VM in the new resource will be an initial replica.

## Next steps

You can move many different types of resources between resource groups and subscriptions.

For more information, see [Move resources to new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md).
