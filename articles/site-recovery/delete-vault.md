---
title: Delete an Azure Site Recovery vault
description: Learn how to delete a Recovery Services vault configured for Azure Site Recovery
author: ankitaduttaMSFT
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 11/05/2019
ms.author: ankitadutta 
ms.custom:
---
# Delete a Site Recovery Services vault

This article describes how to delete a Recovery Services vault for Site Recovery. To delete a vault used in Azure Backup, see [Delete a Backup vault in Azure](../backup/backup-azure-delete-vault.md).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]


## Before you start

Before you can delete a vault you must remove registered servers, and items in the vault. What you need to remove depends on the replication scenarios you've deployed. 


## Delete a vault-Azure VM to Azure

1. Follow [these instructions](site-recovery-manage-registration-and-protection.md#disable-protection-for-a-azure-vm-azure-to-azure) to delete all protected VMs.
2. Then, delete the vault.

## Delete a vault-VMware VM to Azure

1. Follow [these instructions](site-recovery-manage-registration-and-protection.md#disable-protection-for-a-vmware-vm-or-physical-server-vmware-to-azure) to delete all protected VMs.
2. Follow [these steps](vmware-azure-set-up-replication.md#disassociate-or-delete-a-replication-policy) to delete all replication policies.
3. Delete references to vCenter using [these steps](vmware-azure-manage-vcenter.md#delete-a-vcenter-server).
4. Follow [these instructions](vmware-azure-manage-configuration-server.md#delete-or-unregister-a-configuration-server) to decommission a configuration server.
5. Then, delete the vault.


## Delete a vault-Hyper-V VM (with VMM) to Azure

1. Follow [these steps](site-recovery-manage-registration-and-protection.md#disable-protection-for-a-hyper-v-virtual-machine-replicating-to-azure-using-the-system-center-vmm-to-azure-scenario) to delete Hyper-V VMs managed by System Center VMM.
2. Disassociate and delete all replication policies. Do this in your vault > **Site Recovery Infrastructure** > **For System Center VMM** > **Replication Policies**.
3. Follow [these steps](site-recovery-manage-registration-and-protection.md#unregister-a-vmm-server) to unregister a connected VMM server.
4. Then, delete the vault.

## Delete a vault-Hyper-V VM to Azure

1. Follow [these steps](site-recovery-manage-registration-and-protection.md#disable-protection-for-a-hyper-v-virtual-machine-hyper-v-to-azure) to delete all protected VMs.
2. Disassociate  and delete all replication policies. Do this in  your vault > **Site Recovery Infrastructure** > **For Hyper-V Sites** > **Replication Policies**.
3. Follow [these instructions](site-recovery-manage-registration-and-protection.md#unregister-a-hyper-v-host-in-a-hyper-v-site) to unregister a Hyper-V host.
4. Delete the Hyper-V site.
5. Then, delete the vault.


## Use PowerShell to force delete the vault 

> [!Important]
> If you're testing the product and aren't concerned about data loss, use the force delete method to rapidly remove the vault and all its dependencies.
> The PowerShell command deletes all the contents of the vault and is **not reversible**.

To delete the Site Recovery vault even if there are protected items, use these commands:

```azurepowershell
Connect-AzAccount

Select-AzSubscription -SubscriptionName "XXXXX"

$vault = Get-AzRecoveryServicesVault -Name "vaultname"

Remove-AzRecoveryServicesVault -Vault $vault
```

Learn more about [Get-AzRecoveryServicesVault](/powershell/module/az.recoveryservices/get-azrecoveryservicesvault), and [Remove-AzRecoveryServicesVault](/powershell/module/az.recoveryservices/remove-azrecoveryservicesvault).
