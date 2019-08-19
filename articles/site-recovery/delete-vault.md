---
title: Delete a Recovery Services vault configured for the Azure Site Recovery service
description: Learn how to delete a Recovery Services vault configured for Azure Site Recovery
author: rajani-janaki-ram
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 11/27/2018
ms.author: rajanaki

---
# Delete a Site Recovery Services vault

Dependencies can prevent you from deleting an Azure Site Recovery vault. The actions you need to take vary based on the Site Recovery scenario. To delete a vault used in Azure Backup, see [Delete a Backup vault in Azure](../backup/backup-azure-delete-vault.md).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Delete a Site Recovery vault 
To delete the vault, follow the recommended steps for your scenario.
### Azure VMs to Azure

1. Delete all protected VMs by following the steps in [Disable protection for a VMware](site-recovery-manage-registration-and-protection.md#disable-protection-for-a-azure-vm-azure-to-azure).
2. Delete the vault.

### VMware VMs to Azure

1. Delete all protected VMs by following the steps in [Disable protection for a VMware](site-recovery-manage-registration-and-protection.md#disable-protection-for-a-vmware-vm-or-physical-server-vmware-to-azure).

2. Delete all replication policies by following the steps in [Delete a replication policy](vmware-azure-set-up-replication.md#disassociate-or-delete-a-replication-policy).

3. Delete references to vCenter by following the steps in [Delete a vCenter server](vmware-azure-manage-vcenter.md#delete-a-vcenter-server).

4. Delete the configuration server by following the steps in [Decommission a configuration server](vmware-azure-manage-configuration-server.md#delete-or-unregister-a-configuration-server).

5. Delete the vault.


### Hyper-V VMs (with VMM) to Azure
1. Delete all protected VMs by following the steps in[Disable protection for a Hyper-V VM (with VMM)](site-recovery-manage-registration-and-protection.md#disable-protection-for-a-hyper-v-virtual-machine-replicating-to-azure-using-the-system-center-vmm-to-azure-scenario).

2. Disassociate & delete all replication policies by browsing to your Vault -> **Site Recovery Infrastructure** - > **For System Center VMM** -> **Replication Policies**

3.	Delete references to VMM servers by following the steps in [Unregister a connected VMM server](site-recovery-manage-registration-and-protection.md##unregister-a-vmm-server).

4.	Delete the vault.

### Hyper-V VMs (without Virtual Machine Manager) to Azure
1. Delete all protected VMs by following the steps in [Disable protection for a Hyper-V virtual machine (Hyper-V to Azure)](site-recovery-manage-registration-and-protection.md#disable-protection-for-a-hyper-v-virtual-machine-hyper-v-to-azure).

2. Disassociate & delete all replication policies by browsing to your Vault -> **Site Recovery Infrastructure** - > **For Hyper-V Sites** -> **Replication Policies**

3. Delete references to Hyper-V servers by following the steps in [Unregister a Hyper-V host](site-recovery-manage-registration-and-protection.md#unregister-a-hyper-v-host-in-a-hyper-v-site).

4. Delete the Hyper-V site.

5. Delete the vault.


## Use PowerShell to force delete the vault 

> [!Important]
> If you're testing the product and aren't concerned about data loss, use the force delete method to rapidly remove the vault and all its dependencies.
> The PowerShell command deletes all the contents of the vault and is **not reversible**.

To delete the Site Recovery vault even if there are protected items, use these commands:

    Connect-AzAccount

    Select-AzSubscription -SubscriptionName "XXXXX"

    $vault = Get-AzRecoveryServicesVault -Name "vaultname"

    Remove-AzRecoveryServicesVault -Vault $vault

Learn more about [Get-AzRecoveryServicesVault](https://docs.microsoft.com/powershell/module/az.recoveryservices/get-azrecoveryservicesvault), and [Remove-AzRecoveryServicesVault](https://docs.microsoft.com/powershell/module/az.recoveryservices/remove-azrecoveryservicesvault).
