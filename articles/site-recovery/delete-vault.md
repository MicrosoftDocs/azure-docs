---
title: Delete a Site Recovery vault
description: Learn how to delete an Azure Site Recovery vault, based on the Site Recovery scenario.
service: site-recovery
documentationcenter: ''
author: rajani-janaki-ram
manager: rochakm
editor: ''

ms.assetid:
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 07/04/2017
ms.author: rajani-janaki-ram

---
# Delete a Site Recovery vault
Dependencies can prevent you from deleting an Azure Site Recovery vault. The actions you need to take vary based on the Site Recovery scenario: VMware to Azure, Hyper-V (with and without System Center Virtual Machine Manager) to Azure, and Azure Backup. To delete a vault used in Azure Backup, see [Delete a Backup vault in Azure](../backup/backup-azure-delete-vault.md).

>[!Important]
>If you're testing the product and aren't concerned about data loss, use the force delete method to rapidly remove the vault and all its dependencies.

> The PowerShell command deletes all the contents of the vault and is not reversible.

## Use PowerShell to force delete the vault 

To delete the Site Recovery vault even if there are protected items, use these commands:

    Login-AzureRmAccount

    Select-AzureRmSubscription -SubscriptionName "XXXXX"

    $vault = Get-AzureRmSiteRecoveryVault -Name "vaultname"

    Remove-AzureRmSiteRecoveryVault -Vault $vault


## Delete a Site Recovery vault 
To delete the vault, follow the recommended steps for your scenario.

### VMware VMs to Azure

1. Delete all protected VMs by following the steps in [Disable protection for a VMware](site-recovery-manage-registration-and-protection.md##disable-protection-for-a-vmware-vm-or-physical-server).

2. Delete all replication policies by following the steps in [Delete a replication policy](site-recovery-setup-replication-settings-vmware.md##delete-a-replication-policy).

3. Delete references to vCenter by following the steps in [Delete a vCenter](site-recovery-vmware-to-azure-manage-vCenter.md##delete-a-vcenter-in-azure-site-recovery).

4. Delete the configuration server by following the steps in [Decommission a configuration server](site-recovery-vmware-to-azure-manage-configuration-server.md##decommissioning-a-configuration-server).

5. Delete the vault.


### Hyper-V VMs (with Virtual Machine Manager) to Azure
1. Delete all protected VMs by following the steps in [Disable protection for a VMware VM or physical server](site-recovery-manage-registration-and-protection.md##disable-protection-for-a-vmware-vm-or-physical-server).

2. Delete all replication policies by following the steps in [Delete a replication policy](site-recovery-setup-replication-settings-vmware.md##delete-a-replication-policy).

3.	Delete references to Virtual Machine Manager servers by following the steps in [Unregister a connected VMM server](site-recovery-manage-registration-and-protection.md##unregister-a-connected-vmm-server).

4.	Delete the vault.

### Hyper-V VMs (without Virtual Machine Manager) to Azure
1. Delete all protected VMs by following the steps in [Disable protection for a VMware VM or physical server](site-recovery-manage-registration-and-protection.md##disable-protection-for-a-vmware-vm-or-physical-server).

2. Delete all replication policies by following the steps in [Delete a replication policy](site-recovery-setup-replication-settings-vmware.md##delete-a-replication-policy).

3. Delete references to Hyper-V servers by following the steps in [Unregister a Hyper-V host](/site-recovery-manage-registration-and-protection.md##unregister-a-hyper-v-host-in-a-hyper-v-site).

4. Delete the Hyper-V site.

5. Delete the vault.
