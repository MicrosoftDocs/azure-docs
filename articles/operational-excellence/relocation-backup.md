---
title: Relocate Azure Backup to another region
description: This article offers guidance on relocating Azure Backup to another region.
author: anaharris-ms
ms.service: azure-backup
ms.topic:  how-to
ms.date: 06/13/2024
ms.author:  anaharris
ms.custom: subject-relocation
# Customer intent: As ant administrator, I want to relocate Azure Backup to another region.
---

<!-- remove ../backup/azure-backup-move-vaults-across-regions.md?toc=/azure/operational-excellence/toc.json -->

# Relocate Azure Backup to another region

This article covers relocation guidance for [Azure Backup](../backup/backup-overview.md) across regions. 

Azure Backup doesn’t support the relocation of backup data from one Recovery Services vault to another. In order to continue to protect your resources, you must register and back them up to a Recovery Services vault in the new region. 

After you relocate your resources to the new region, you can choose to either keep or delete the backup data in the Recovery Services vaults in the old region.

>[!NOTE] 
>If you do choose to keep the backup data in the old region, you do incur backup charges.


## Prerequisites

- Copy internal resources or settings of Azure Resource Vault.
    - Network firewall reconfiguration
    - Alert Notification.
    - Move workbook if configured
    - Diagnostic settings reconfiguration
- List all Recovery Service Vault dependent resources. The most common dependencies are:
    - Azure Virtual Machine (VM)
    - Public IP address
    - Azure Virtual Network
    - Azure Recovery Service Vault
- Whether the VM is moved with the vault or not, you can always restore the VM from the retained backup history in the vault.
- Copy the backup VM configuration metadata to validate once the relocation is complete.
- Confirm that all services and features that are in use by source resource vault are supported in the target region.


## Prepare

Azure Backup currently doesn’t support the movement of backup data from one Recovery Services vault to another across regions.

Instead, you must redeploy the Recovery Service vault and reconfigure the backup for resources to a Recovery Service vault in the new region. 


**To prepare for redeployment and configuration:**

1. Export a Resource Manager template. This template contains settings that describe your Recovery Vault.

    1. Sign in to the [Azure portal](https://portal.azure.com).
    2. Select **All resources** and then select your Recovery Vault resource.
    3. Select **Export template**. 
    4. Choose **Download** in the **Export template** page.
    5. Locate the .zip file that you downloaded from the portal, and unzip that file to a folder of your choice.

       This zip file contains the .json files that include the template and scripts to deploy the template.
       
1. Validate all the associated resources detail in the downloaded template, such as private endpoint, backup policy, and security settings.

1. Update the parameter of the Recovery Vault by changing the value properties under parameters, such as  Recovery Vault name, replication type, sku, target location etc.


## Redeploy 

[Create and reconfigure the Recovery Service vault](/azure/backup/backup-create-recovery-services-vault) in the target region. 

Make sure to reconfigure all associated settings that were captured from the source Recovery service vault:

- (Optional) Private Endpoint - Follow the procedure to relocate a [virtual network]](/technical-delivery-playbook/azure-services/networking/virtual-network/) as described and create the Private Endpoint.
- Network firewall reconfiguration
- Alert Notification.
- Move workbook if configured 
- Diagnostic settings reconfiguration

## Backup resources

In order to continue to protect your resources, you must register and back them up to a Recovery Services vault in the new region. This section shows you how to back up the following:

- [Azure Virtual Machines](#back-up-azure-virtual-machine)
- [Azure File Share](#back-up-azure-file-share)
- [SQL Server/SAP HANA in Azure VM](#back-up-sql-serversap-hana-in-azure-vm)
- [On-premises resources](#back-up-services-for-on-premises-resources)

### Back up Azure Virtual Machine

When an Azure Virtual Machine (VM) protected by a Recovery Services vault is moved from one region to another, it can no longer be backed up to the older vault. The backups in the old vault may start failing with the errors **BCMV2VMNotFound** or [**ResourceNotFound**](../backup/backup-azure-vms-troubleshoot.md#320001-resourcenotfound---could-not-perform-the-operation-as-vm-no-longer-exists--400094-bcmv2vmnotfound---the-virtual-machine-doesnt-exist--an-azure-virtual-machine-wasnt-found). 

You can also choose to write a customized script for bulk VM protection:

```azurepowershell

https://management.azure.com/Subscriptions/{subscriptionId}/resourceGroups/{vaultresourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/backupFabrics/{fabricName}/protectionContainers/{containerName}/protectedItems/{protectedItemName}?api-version=2019-05-13

```

1. Prepare Azure Virtual Machines (VMs) for relocation:
    
    1. See the [prerequisites associated with VM relocation](../resource-mover/tutorial-move-region-virtual-machines.md#prerequisites) and ensure that the VM is eligible for relocation.
    1. [Select the VM on the **Backup Items** tab](../backup/backup-azure-delete-vault.md#delete-protected-items-in-the-cloud) of existing vault’s dashboard and select **Stop protection** followed by retain/delete data as per your requirement. When the backup data for a VM is stopped with retain data, the recovery points remain forever and don’t adhere to any policy.
       >[!Note]
       >Retaining data in the older vault will incur backup charges. If you no longer wish to retain data to avoid billing, you need to delete the retained backup data using the  [Delete data option](../backup/backup-azure-manage-vms.md#delete-backup-data).
    1. Ensure that the VMs are turned on. All VMs’ disks that need to be available in the destination region are attached and initialized in the VMs.
    1. Ensure that VMs have the latest trusted root certificates, and an updated certificate revocation list (CRL). To do so:
       - On Windows VMs, install the latest Windows updates.
       - On Linux VMs, refer to distributor guidance to ensure that machines have the latest certificates and CRL.
    1. Allow outbound connectivity from VMs:
       - If you're using a URL-based firewall proxy to control outbound connectivity, allow access to [these URLs](../resource-mover/support-matrix-move-region-azure-vm.md#url-access).
       - If you're using network security group (NSG) rules to control outbound connectivity, create [these service tag rules](../resource-mover/support-matrix-move-region-azure-vm.md#nsg-rules).


1. Redeploy Azure VMs by using [Azure Resource Mover](../resource-mover/tutorial-move-region-virtual-machines.md) to relocate your VM to the new region.


### Back up Azure File Share

1. [Back up Azure file shares with Azure CLI](../backup/backup-afs-cli.md).
1.	Satisfy the [prerequisites to relocate the Storage Account](../storage/common/storage-account-move.md?tabs=azure-portal#prerequisites). 
1. Export and modify a Resource Move template. For more information, see [Prepare Storage Account for region relocation](../storage/common/storage-account-move.md?tabs=azure-portal#prepare).
1. [Relocate the Azure Storage account to another region](../storage/common/storage-account-move.md).
1. When Azure File Share is copied across regions, its associated snapshots don’t relocate along with it. To relocate the snapshots data to the new region, you need to relocate the individual files and directories of the snapshots to the Storage Account in the new region by using [AzCopy](../storage/common/storage-use-azcopy-files.md#copy-all-file-shares-directories-and-files-to-another-storage-account).
1. Choose whether you want to retain or delete the snapshots (and the corresponding recovery points) of the original Azure File Share by selecting your file share on the [Backup Items tab](../backup/backup-azure-delete-vault.md#delete-protected-items-in-the-cloud) of the original vault’s dashboard. When the backup data for Azure File Share is stopped with retain data, the recovery points remain forever and don’t adhere to any policy.


>[!NOTE]
>While configuring File Share, if the Recovery Service Vault isn't available, check to see whether it is associated with another Recovery Service vault.

### Back up SQL Server/SAP HANA in Azure VM

When you relocate a VM that runs SQL or SAP HANA servers, you will no longer be able to back up the SQL and SAP HANA databases in the vault of the earlier region.

**To protect the SQL and SAP HANA servers that are running in the new region:**

1. Before you relocate SQL Server/SAP HANA running in a VM to a new region, ensure the following prerequisites are met:
    
    1. See the [prerequisites associated with VM relocate](../resource-mover/tutorial-move-region-virtual-machines.md#prerequisites) and ensure that the VM is eligible for relocate. 
    1. Select the VM on the [Backup Items tab](../backup/backup-azure-delete-vault.md#delete-protected-items-in-the-cloud) of the existing vault’s dashboard and select _the databases_ for which backup needs to be stopped. Select **Stop protection** followed by retain/delete data as per your requirement. When the backup data is stopped with retain data, the recovery points remain forever and don’t adhere to any policy. 
       >[!Note]
       >Retaining data in the older vault will incur backup charges. If you no longer wish to retain data to avoid billing, you need to delete the retained backup data using [Delete data option](../backup/backup-azure-manage-vms.md#delete-backup-data).
    1. Ensure that the VMs to be moved are turned on. All VMs disks that need to be available in the destination region are attached and initialized in the VMs.
    1. Ensure that VMs have the latest trusted root certificates, and an updated certificate revocation list (CRL). To do so:
       - On Windows VMs, install the latest Windows updates.
       - On Linux VMs, refer to the distributor guidance and ensure that machines have the latest certificates and CRL.
    1. Allow outbound connectivity from VMs:
       - If you're using a URL-based firewall proxy to control outbound connectivity, allow access to [these URLs](../resource-mover/support-matrix-move-region-azure-vm.md#url-access).
       - If you're using network security group (NSG) rules to control outbound connectivity, create [these service tag rules](../resource-mover/support-matrix-move-region-azure-vm.md#nsg-rules).
    
1. Relocate your VM to the new region using [Azure Resource Mover](../resource-mover/tutorial-move-region-virtual-machines.md).
1. Create a Recovery Services vault in the new region where the VM is relocated. 
1. Re-configure backup.


### Back up services for on-premises resources

1. To backup files, folders, and system state for VMs (Hyper-V & VMware) and other on-premises workloads, see [About the Microsoft Azure Recovery Services (MARS)](../backup/backup-azure-about-mars.md).
1. Download vault credentials to register the server in the vault.
    :::image type="content" source="media\relocation\backup\mars-agent-credential-download.png" alt-text="Screenshot showing how to download vault credentials to register the server in the vault.":::
1. Reconfigure backup agent on on-premises virtual machine.
    :::image type="content" source="media\relocation\backup\mars-register-to-target-rsv.png" alt-text="Screenshot showing how to reconfigure an on premise virtual machine.":::


