---
title: Relocate Azure Backup to Another Region
description: This article offers guidance on relocating Azure Backup to another region.
ms.topic: how-to
ms.date: 09/15/2025
ms.custom: subject-relocation

# Customer intent: As an administrator, I want to relocate Azure Backup to another region.
---

<!-- remove ../../../backup/azure-backup-move-vaults-across-regions.md?toc=/azure/operational-excellence/toc.json -->

# Relocate Azure Backup to another region

This article covers relocation guidance for [Azure Backup](../../../backup/backup-overview.md) across regions.

Azure Backup doesn't support the relocation of backup data from one Recovery Services vault to another. To continue to protect your resources, you must register and back them up to a Recovery Services vault in the new region.

After you relocate your resources to the new region, you can choose to either keep or delete the backup data in the Recovery Services vaults in the old region.

>[!NOTE]
>If you choose to keep the backup data in the old region, you incur backup charges.

## Prerequisites

- Copy internal resources or settings of Recovery Services vaults:

  - Network firewall reconfiguration.
  - Alert notification.
  - Workbook to move, if configured.
  - Diagnostic settings reconfiguration.

- List all resources dependent on Recovery Services vaults. The most common dependencies are:

  - Azure virtual machines (VMs).
  - Public IP address.
  - Azure Virtual Network.
  - Recovery Services vault.

- Restore the VM from the retained backup history in the vault, if necessary. You can always perform this task whether the VM is moved with the vault or not.
- Copy the backup VM configuration metadata to validate after the relocation is finished.
- Confirm that all services and features that are in use by the source vault are supported in the target region.

## Prepare

Azure Backup currently doesn't support the movement of backup data from one Recovery Services vault to another across regions. Instead, you must redeploy the Recovery Services vault and reconfigure the backup for resources to a Recovery Services vault in the new region.

### Prepare for redeployment and configuration

1. Export an Azure Resource Manager template. This template contains settings that describe your Recovery Services vault.

    1. Sign in to the [Azure portal](https://portal.azure.com).
    1. Select **All resources**, and then select your Recovery Services vault resource.
    1. Select **Export template**.
    1. On the **Export template** page, select **Download**.
    1. Locate the .zip file that you downloaded from the portal, and unzip that file to a folder of your choice.

       This .zip file contains the .json files that include the template and scripts to deploy the template.

1. Validate all the associated resource details in the downloaded template, such as private endpoint, backup policy, and security settings.

1. Update the parameter of the Recovery Services vault by changing the value properties under parameters, such as the Recovery Services vault name, replication type, version, and target location.

## Redeploy

[Create and reconfigure the Recovery Services vault](/azure/backup/backup-create-recovery-services-vault) in the target region.

Make sure to reconfigure all associated settings that were captured from the source Recovery Services vault:

- (Optional) Private endpoint: Relocate a virtual network and create a private endpoint.
- Network firewall reconfiguration.
- Alert notification.
- Workbook to move, if configured.
- Diagnostic settings reconfiguration.

## Back up resources

To continue to protect your resources, you must register and back them up to a Recovery Services vault in the new region. This section shows you how to back up the following resources:

- [Azure VMs](#back-up-an-azure-virtual-machine)
- [Azure file shares](#back-up-azure-file-shares)
- [SQL Server/SAP HANA in an Azure VM](#back-up-sql-serversap-hana-in-an-azure-vm)
- [On-premises resources](#back-up-services-for-on-premises-resources)

### Back up an Azure virtual machine

When an Azure VM protected by a Recovery Services vault is moved from one region to another, it can no longer be backed up to the older vault. The backups in the old vault might start failing with the errors `BCMV2VMNotFound` or [ResourceNotFound](../../../backup/backup-azure-vms-troubleshoot.md#320001-resourcenotfound---could-not-perform-the-operation-as-vm-no-longer-exists--400094-bcmv2vmnotfound---the-virtual-machine-doesnt-exist--an-azure-virtual-machine-wasnt-found).

You can also choose to write a customized script for bulk VM protection:

```azurepowershell
https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{vaultresourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/{fabricName}/protectionContainers/{containerName}/protectedItems/{protectedItemName}?api-version=2019-05-13
```

1. Prepare Azure VMs for relocation:

    1. See the [prerequisites associated with VM relocation](../../../resource-mover/tutorial-move-region-virtual-machines.md#prerequisites) and ensure that the VM is eligible for relocation.
    1. [Select the VM on the Backup Items tab](../../../backup/backup-azure-delete-vault.md#delete-protected-items-in-the-cloud) of the existing vault's dashboard. Select **Stop protection** followed by retain/delete data according to your requirements. When the backup data for a VM is stopped with retain data, the recovery points remain forever and don't adhere to any policy.
  
        > [!NOTE]
        > Retaining data in the older vault incurs backup charges. If you no longer want to retain data to avoid billing, you need to delete the retained backup data by using the [Delete data option](../../../backup/backup-azure-manage-vms.md#delete-backup-data).
  
    1. Ensure that the VMs are turned on. All VM disks that need to be available in the destination region are attached and initialized in the VMs.
    1. Ensure that the VMs have the latest trusted root certificates and an updated certificate revocation list (CRL). To do so:
  
        - On Windows VMs, install the latest Windows updates.
        - On Linux VMs, refer to distributor guidance to ensure that machines have the latest certificates and CRL.
  
    1. Allow outbound connectivity from VMs:
  
        - If you use a URL-based firewall proxy to control outbound connectivity, allow access to [these URLs](../../../resource-mover/support-matrix-move-region-azure-vm.md#url-access).
        - If you use network security group (NSG) rules to control outbound connectivity, create [these service tag rules](../../../resource-mover/support-matrix-move-region-azure-vm.md#nsg-rules).

1. Redeploy Azure VMs by using [Azure Resource Mover](../../../resource-mover/tutorial-move-region-virtual-machines.md) to relocate your VM to the new region.

### Back up Azure file shares

1. [Back up Azure file shares with the Azure CLI](../../../backup/backup-afs-cli.md).

1. Satisfy the [prerequisites to relocate the storage account](../../../storage/common/storage-account-move.md?tabs=azure-portal#prerequisites).

1. Export and modify an Azure Resource Move template. For more information, see [Prepare storage account for region relocation](../../../storage/common/storage-account-move.md?tabs=azure-portal#prepare).

1. [Relocate the Azure Storage account to another region](../../../storage/common/storage-account-move.md).

1. When an Azure file share is copied across regions, its associated snapshots don't relocate along with it. To relocate the snapshot data to the new region, use [AzCopy](../../../storage/common/storage-use-azcopy-files.md#copy-all-file-shares-directories-and-files-to-another-storage-account) to relocate the individual files and directories of the snapshots to the storage account in the new region.

1. Choose whether you want to retain or delete the snapshots (and the corresponding recovery points) of the original Azure file share. Select your file share on the [Backup Items tab](../../../backup/backup-azure-delete-vault.md#delete-protected-items-in-the-cloud) of the original vault's dashboard. When the backup data for the Azure file share is stopped with retain data, the recovery points remain forever and don't adhere to any policy.

> [!NOTE]
> When you configure a file share, if the Recovery Services vault isn't available, check to see whether the vault is associated with another Recovery Services vault.

### Back up SQL Server/SAP HANA in an Azure VM

When you relocate a VM that runs SQL Server or SAP HANA, you can no longer back up the SQL and SAP HANA databases in the vault of the earlier region.

#### Protect the SQL and SAP HANA servers that are running in the new region

1. Before you relocate SQL and SAP HANA servers running in a VM to a new region, ensure that the following prerequisites are met:

    1. See the [prerequisites associated with VM relocation](../../../resource-mover/tutorial-move-region-virtual-machines.md#prerequisites). Ensure that the VM is eligible for relocation.
    1. Select the VM on the [Backup Items tab](../../../backup/backup-azure-delete-vault.md#delete-protected-items-in-the-cloud) of the existing vault's dashboard and select _the databases_ for which backup needs to be stopped. Select **Stop protection** followed by retain/delete data according to your requirements. When the backup data is stopped with retain data, the recovery points remain forever and don't adhere to any policy.
       >[!NOTE]
       >Retaining data in the older vault incurs backup charges. If you no longer want to retain data to avoid billing, you need to delete the retained backup data by using the [Delete data option](../../../backup/backup-azure-manage-vms.md#delete-backup-data).
    1. Ensure that the VMs to be moved are turned on. All VM disks that need to be available in the destination region must be attached and initialized in the VMs.
    1. Ensure that the VMs have the latest trusted root certificates and an updated CRL. To do so:
       - On Windows VMs, install the latest Windows updates.
       - On Linux VMs, refer to the distributor guidance and ensure that machines have the latest certificates and CRL.
    1. Allow outbound connectivity from VMs:
       - If you're using a URL-based firewall proxy to control outbound connectivity, allow access to [these URLs](../../../resource-mover/support-matrix-move-region-azure-vm.md#url-access).
       - If you're using NSG rules to control outbound connectivity, create [these service tag rules](../../../resource-mover/support-matrix-move-region-azure-vm.md#nsg-rules).

1. Relocate your VM to the new region by using [Azure Resource Mover](../../../resource-mover/tutorial-move-region-virtual-machines.md).
1. Create a Recovery Services vault in the new region where the VM is relocated.
1. Reconfigure the backup.

### Back up services for on-premises resources

1. To back up files, folders, and system state for VMs (Hyper-V and VMware) and other on-premises workloads, see [About the Microsoft Azure Recovery Services (MARS) agent for Azure Backup](../../../backup/backup-azure-about-mars.md).
1. Download vault credentials to register the server in the vault.

    :::image type="content" source="./media/backup/mars-agent-credential-download.png" alt-text="Screenshot that shows how to download vault credentials to register the server in the vault.":::
1. Reconfigure the backup agent on an on-premises VM.

    :::image type="content" source="./media/backup/mars-register-to-target-rsv.png" alt-text="Screenshot that shows how to reconfigure an on-premises virtual machine.":::
