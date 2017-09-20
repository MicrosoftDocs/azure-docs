---
title: Upgrade a Site Recovery vault to an Azure Recovery Services vault
description: Learn how to upgrade an Azure Site Recovery vault to a Recovery Services vault
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
ms.date: 07/31/2017
ms.author: rajani-janaki-ram

---
# Upgrade a Site Recovery vault to an Azure Resource Manager-based Recovery Services vault

This article describes how to upgrade Azure Site Recovery vaults to Azure Resource Manager-based Recovery Service vaults without any impact on ongoing replication. For more information about Azure Resource Manager features and benefits, see [Azure Resource Manager overview](../azure-resource-manager/resource-group-overview.md).

## Introduction
A Recovery Services vault is an Azure Resource Manager resource for managing backup and disaster recovery natively in the cloud. It is a unified vault that you can use in the new Azure portal, and it replaces the classic backup and Site Recovery vaults.

Recovery Services vaults offer an array of features, including:

* Azure Resource Manager support: You can protect and fail over your virtual machines and physical machines into an Azure Resource Manager stack.

* Exclude disk: If you have temp files or high churn data that you don’t want to use all your bandwidth for, you can exclude volumes from replication. This capability has been enabled currently in *VMware to Azure* and *Hyper-V to Azure* and is extended to other scenarios as well.

* Support for premium and locally redundant storage: You can now protect servers in premium storage accounts that allow customers to protect applications with higher input/output operations per second (IOPS). This capability is currently enabled in *VMware to Azure*.

* Streamlined getting-started experience: The enhanced getting-started experience has been designed to make disaster-recovery setup easy.

* Backup and Site Recovery management from the same vault: You can now protect servers for disaster recovery or perform backup from the same vault, which can reduce your management overhead significantly.

For more information about the upgraded experience and features, see the [Storage, Backup, and Recovery blog](https://azure.microsoft.com/blog/azure-site-recovery-now-available-in-a-new-experience-with-support-for-arm-and-csp/).

## Salient features

* No impact on ongoing replication: Ongoing replications continue without any interruption during and post upgrade.

* No additional cost: Get an entire set of updated capabilities at no additional cost.

* No data loss: Because this process is an upgrade and not a migration, existing replication recovery points and settings remain intact during and after the upgrade.


## What happens during the vault upgrade?

During the upgrade, you cannot perform operations such as registering a new server or enabling replication for a virtual machine (VM). Operations that involve reading data from or writing data to the vault, such as ongoing replication of protected items to the vault, continue uninterrupted.

### Changes to automation and tooling after the upgrade
As you upgrade the vault type from the classic deployment model to the Resource Manager deployment model, update the existing automation or tooling to ensure that it continues to work after the upgrade.

### Prepare your environment for the upgrade

* [Install PowerShell or upgrade it to version 5 or later](https://www.microsoft.com/download/details.aspx?id=50395)
* [Install the latest version of Azure PowerShell MSI](https://github.com/Azure/azure-powershell/releases)
* [Download the Recovery Services vault upgrade script](https://aka.ms/vaultupgradescript)

### Prerequisites
To upgrade from Site Recovery vaults to Azure Resource Manager-based Recovery Service vaults, you must meet the following requirements:

* Minimum agent version: The version of Azure Site Recovery Provider installed on your server must be 5.1.1700.0 or later.

* Supported configuration: You cannot configure your vault with storage area network (SAN) or SQL Server AlwaysOn Availability Groups. All other configurations are supported.

    >[!NOTE]
    >After the upgrade, you can manage storage mapping only via PowerShell.

* Supported deployment scenario: Your vault shouldn’t be the *VMware to Azure* legacy deployment model. Before you proceed, first move to the enhanced deployment model.

* No active user-initiated jobs that involve management plane operations: Because access to the management plane is restricted during upgrade, complete all your management plane actions before you trigger the upgrade. This process doesn’t include ongoing replication.

## Frequently asked questions

**Does this upgrade affect my ongoing replication?**

No. Your ongoing replication continues uninterrupted during and after the upgrade.

**What happens to network settings such as site-to-site VPN and IP settings?**

The upgrade doesn't affect the network settings. All Azure-to-on-premises connections remain intact.

**What happens to my vaults if I don’t plan to upgrade in the near future?**

Support for Site Recovery vault in the old Azure portal will be deprecated starting September 2017. We strongly recommend that you use the upgrade feature to move to the new portal.

**What does this migration plan mean for my existing tooling?**  

Updating your tooling to the Resource Manager deployment model is one of the most important changes that you must account for in your upgrade plans. The Recovery Services vaults are based on the Resource Manager deployment model. 

**How long does the management-plane downtime last?**

The upgrade ordinarily takes about 15 to 30 minutes, and it could take up to a maximum of one hour.

**Can I roll back after upgrading?**

No. Rollback is not supported after the resources have been successfully upgraded.

**Can I validate my subscription or resources to see whether they can be upgraded?**

Yes. In the platform-supported upgrade option, the first step in the upgrade is to validate that the resources are capable of an upgrade. If the validation fails, you will receive appropriate error messages or warnings.

**How do I report an issue with the upgrade?**

If you experience any failures during the upgrade, note the operation ID that's listed in the error. Microsoft Support will proactively work on resolving the issue. You can also contact the Support team with your subscription ID, vault name, and operation ID. Support will work to resolve the issue as quickly as possible. Do not retry the operation unless you are explicitly instructed to do so by Microsoft.

## Run the script

In PowerShell, run the following command:

    PS > .\RecoveryServicesVaultUpgrade-1.0.0.ps1 -SubscriptionID <subscriptionID>  -VaultName <vaultname> -Location <location> -ResourceType HyperVRecoveryManagerVault -TargetResourceGroupName <rgname>

* SubscriptionID: The subscription ID that's associated with the vault that you're upgrading.

* VaultName: The name of the vault that you're upgrading.

* Location: The location of the vault that you're upgrading.

* ResourceType: HyperVRecoveryManagerVault for Site Recovery vaults.

* TargetResourceGroupName: The resource group into which you want the upgraded vault to be placed. TargetResourceGroupName can be an existing resource group in Azure Resource Manager or a new one. If the TargetResourceGroupName that's supplied does not exist, it is created as part of the upgrade in the same location as the vault. For more information, see the "Resource groups" section of [Azure Resource Manager overview](../azure-resource-manager/resource-group-overview.md#resource-groups).

    >[!NOTE]
    >Resource group naming is subject to certain constraints. To prevent vault upgrade failure, be sure to observe the naming convention carefully.
    >
    >For example:
    >
    >.\RecoveryServicesVaultUpgrade-1.0.0.ps1 -SubscriptionId 1234-54123-354354-56416-8645 -VaultName gen2dr -Location "north europe" -ResourceType hypervrecoverymanagervault -TargetResourceGroupName abc

Alternatively, you can run the following script. Enter the values for the required parameters.

    PS > .\RecoveryServicesVaultUpgrade-1.0.0.ps1
    cmdlet RecoveryServicesVaultUpgrade-1.0.0.ps1 at command pipeline position 1

    Supply values for the following parameters:
    SubscriptionId:
    VaultName:
    Location:
    ResourceType:
    TargetResourceGroupName:

1. The PowerShell script prompts you to enter your credentials. Enter them twice, once for the classic deployment model account and once for the Azure Resource Manager account.

2. After you've entered your credentials, the script runs a check to determine whether your infrastructure setup meets the previously mentioned requirements.

3. After the prerequisites have been checked and confirmed, you are prompted to proceed with the vault upgrade. The upgrade process starts upgrading your vault. The entire upgrade can take 15 to 30 minutes to complete.

4. After the upgrade has been completed successfully, you can access the upgraded vault in the new Azure portal.

## Post-upgrade vault management

### Replicate by using Azure Site Recovery in the Recovery Services vault

* You can now protect your Azure VMs from one region to another. For more information, see [Replicate Azure VMs between regions with Azure Site Recovery](site-recovery-azure-to-azure.md).

* For more information about replicating VMware VMs to Azure, see [Replicate VMware VMs to Azure with Site Recovery](vmware-walkthrough-overview.md).

* For more information about replicating Hyper-V VMs (without VMM) to Azure, see [Replicate Hyper-V virtual machines (without VMM) to Azure](hyper-v-site-walkthrough-overview.md).

* For more information about replicating Hyper-V VMs (with VMM) to Azure, see [Replicate Hyper-V virtual machines in VMM clouds to Azure using Site Recovery in the Azure portal](vmm-to-azure-walkthrough-overview.md).

* For more information about replicating Hyper-VMs (with VMM) to a secondary site, see [Replicate Hyper-V virtual machines in VMM clouds to a secondary VMM site using the Azure portal](site-recovery-vmm-to-vmm.md).

* For more information about replicating VMware VMs to a secondary site, see [Replicate on-premises VMware virtual machines or physical servers to a secondary site in the classic Azure portal](site-recovery-vmware-to-vmware.md).

### View your replicated items

The following image shows the Recovery Services vault dashboard page that displays key entities for the vault. To view a list of protected entities in the vault, select **Site Recovery** > **Replicated items**.


![Replicated items](./media/upgrade-site-recovery-vaults/replicateditems.png)

The following image shows the workflow for viewing your replicated items and the **Failover** command for initiating a failover.

![Replicated items](./media/upgrade-site-recovery-vaults/failover.png)

### View your replication settings

In the Site Recovery vault, each protection group is configured with copy frequency, recovery point retention, frequency of application consistent snapshots, and other replication settings. In the Recovery Services vault, these settings are configured as a replication policy. The name of the policy is the name of the protection group or the *primarycloud_Policy*.

For more information about replication policy, see [Manage replication policy for VMware to Azure](site-recovery-setup-replication-settings-vmware.md).
