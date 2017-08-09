---
title: Upgrade Site Recovery vault to Recovery Services vault
description: Learn how to upgrade an Azure Site Recovery vault to Recovery Services vault
ddocumentationcenter: ''
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
# Upgrade Site Recovery vaults to Azure Resource Manager based Recovery Services Vaults

This article describes how to upgrade ‘Site Recovery Vaults’ to Azure Resource Manager based ‘Recovery Service Vaults’ without any impact to on-going replication. You can read more about Azure Resource Manager features and benefits [here](../azure-resource-manager/resource-group-overview.md).

## Introduction
Recovery Services Vault is an Azure Resource Manager resource to manage your backup and disaster recovery needs natively in the cloud. It is a unified vault that can be used in the new Azure portal, a replacement for the classic Backup and Site Recovery vaults.

Recovery Services vaults open an array of features including:

- 	Azure Resource Manager support: You can protect and failover your virtual machines and physical machines into Azure Resource Manager stack.

- 	Exclude Disk – If you have temp files or high churn data that you don’t want to use up your bandwidth for, you can exclude volumes from replication. This capability has been enabled currently in ‘VMware to Azure’ & ‘Hyper-V to Azure’ and would soon be extended to other scenarios as well.

- Support for Premium and Locally redundant Storage (LRS) – You can now protect servers into premium storage accounts that allow customers to protect applications with higher IOPs. This capability has been enabled currently in ‘VMware to Azure’.

- 	Streamlined ‘Getting Started’ experience – The enhanced Getting Started experience, has been tailored to ensure that setting up disaster recovery is an easy process.

- Manage Backup and Site Recovery from the same vault – You can now protect servers for disaster recovery or perform backup, from the same vault, which reduces your management overhead significantly.

For more details regarding the upgraded experience and features, check this [blog](https://azure.microsoft.com/blog/azure-site-recovery-now-available-in-a-new-experience-with-support-for-arm-and-csp/).

## Salient features

- **No impact to ongoing replication**:  Ongoing replications continue without any interruption during and post upgrade.

- **No additional cost** – Experience a whole set of newer capabilities with no additional cost

- **No data loss** – Since this is an upgrade and not a migration, existing replication information (recovery points, replication settings etc.) remains intact during and post the upgrade.


## What happens during the upgrade?

Operations like registering a new server, enabling replication for a VM, etc. are not allowed during the upgrade. Any operation that just involves data being read from or written to the vault, like ongoing replication of protected items to the vault, continue uninterrupted.

## Changes to your automation and tooling after vault upgrade
As part of upgrading you vault type from the Classic deployment model to the Resource Manager deployment model, you must update your existing automation or tooling to ensure that it continues to work after the upgrade.

## Preparing your environment for vault upgrade

1.	Install/Upgrade PowerShell to version 5 or above using this [link](https://www.microsoft.com/download/details.aspx?id=50395)

2.	Install latest Azure PowerShell MSI from [here](https://github.com/Azure/azure-powershell/releases)

3.	[Download](https://aka.ms/vaultupgradescript) the script for vault upgrade

## Prerequisites for upgrade
The following pre-requisites should be met, to upgrade your vaults from Site Recovery vaults to Azure Resource Manager based Recovery Service Vaults.

- Minimum agent version: Upgrade requires that the version of Azure Site Recovery Provider installed on your server is at-least 5.1.1700.0.

- Supported configuration: Your vault shouldn’t be configured with SAN, SQL Always Availability groups. All other configurations are supported.

>[!NOTE]
> Storage mapping can only be managed via PowerShell post the upgrade.

- Supported deployment scenario – Your vault shouldn’t be on ‘VMware to Azure’ legacy deployment model.  You need to first move to enhanced deployment model before proceeding.

- No active user-initiated jobs that involve management plane operations: Since access to the management plane is restricted during upgrade, you need to complete all your management plane actions and then trigger upgrade. This doesn’t include on-going replication.

## Frequently asked questions

- Does this upgrade affect my ongoing replication?

  No. Your ongoing replication continues uninterrupted during and post upgrade.

- What happens to the network settings - Site-to-Site VPN, IP settings etc.?

  The upgrade doesn't affect the network settings, all Azure to on-premises connections will remain intact.
- What happens to my vaults if I don’t plan on upgrading in the near future?

  Support for Site Recovery vault the old Azure portal will be deprecated starting September. So we strongly recommend customers to use the upgrade feature to move to the new portal.

- What does this migration plan mean for my existing tooling?  

  Updating your tooling to the Resource Manager deployment model that Recovery Services Vaults are based on, is one of the most important changes that you must account for in your upgrade plans.

- How long will the management-plane downtime be?

  Upgrade takes about 15-30 minutes. It could take up to a maximum of one hour.

- Can I roll back after upgrading?

  No. Rollback is not supported after the resources have been successfully upgraded.

- Can I validate my subscription or resources to see if they're capable of upgrade?

  Yes. In the platform-supported upgrade option, the first step in upgrade is to validate that the resources are capable of upgrade. In case the validation of pre-requisites fails, you will receive appropriate error/warnings.

- How do I report an issue with the upgrade?

  In case you face any failures during upgrade, note the OperationId listed in the error. Microsoft Support will be proactively working on resolving the issue. You can reach out to the support team as well, with your Subscription ID, vault name and operation ID. We will work on resolving the issue at the earliest. Do not retry the operation unless explicitly instructed to do so by Microsoft.

## How to run the script?

Run the following command in your PowerShell prompt:

    PS > .\RecoveryServicesVaultUpgrade-1.0.0.ps1 -SubscriptionID <subscriptionID>  -VaultName <vaultname> -Location <location> -ResourceType HyperVRecoveryManagerVault -TargetResourceGroupName <rgname>

- SubscriptionId: The subscription ID associated with the vault that is being upgraded
- VaultName: Name of the vault being upgraded
- Location: Location of the vault being upgraded
- ResourceType: HyperVRecoveryManagerVault for Site Recovery vaults
- TargetResourceGroupName: Resource group into which you want the upgraded vault to be placed. The TargetResourceGroupName can be an existing ResourceGroup in Azure Resource Manager or a new one. In case the TargetResourceGroupName supplied does not exist, it is created as part of upgrade in the same location as the vault. To read more about Resource Groups, click [here](../azure-resource-manager/resource-group-overview.md#resource-groups):

>[!NOTE]
>Resource Group Names have constraints. Please follow the same, as failure to do so could lead to vault upgrade failure.

Example:

    .\RecoveryServicesVaultUpgrade-1.0.0.ps1 -SubscriptionId 1234-54123-354354-56416-8645 -VaultName gen2dr -Location "north europe" -ResourceType hypervrecoverymanagervault -TargetResourceGroupName abc


Alternatively, you can run the script as below, and you’ll be asked to provide inputs for all the parameters that are required.

    PS > .\RecoveryServicesVaultUpgrade-1.0.0.ps1
    cmdlet RecoveryServicesVaultUpgrade-1.0.0.ps1 at command pipeline position 1

    Supply values for the following parameters:
    SubscriptionId:
    VaultName:
    Location:
    ResourceType:
    TargetResourceGroupName:

1.	The PowerShell script will prompt you to enter your credentials. You need to enter your credentials twice - once for the ASM account and once for the Azure Resource Manager account.

2.	Once your credentials are entered, the script runs a prerequisites check to determine that your infrastructure setup meets the pre-requisites mentioned earlier in the doc.

3.	Once the pre-requisites are checked, you are prompted with a confirmation to proceed with vault upgrade. On confirming, the upgrade process starts upgrading your vault. The entire upgrade can take 15-30 mins to complete.

4.	Once the upgrade completes successfully, you can access the upgraded vault in the new Azure portal.

## Management experience post upgrade

### How to replicate using Azure Site Recovery in the Recovery Services vault

- You can now protect your Azure VMs from one region to another. To know more, refer to the documentation [here](site-recovery-azure-to-azure.md).

- To know more about replicating VMware VMs to Azure, refer to the documentation [here](vmware-walkthrough-overview.md).

- To know more about replicating Hyper-VMs (without VMM) to Azure, refer to the documentation [here](hyper-v-site-walkthrough-overview.md).

- To know more about replicating Hyper-VMs (with VMM) to Azure, refer to the documentation [here](vmm-to-azure-walkthrough-overview.md).

- To know more about replicating Hyper-VMs (with VMM) to a secondary site, refer to the documentation [here](site-recovery-vmm-to-vmm.md).

- To know more about replicating VMware VMs to a secondary site, refer to the documentation [here](site-recovery-vmware-to-vmware.md).

### How to view your replicated items

Below is the screen that  shows the Recovery Services vault dashboard page that displays key entities for the vault. Click on the **Site Recovery** -> **Replicated items** to view the list of protected entities in the vault.


![Replicated items](./media/upgrade-site-recovery-vaults/replicateditems.png)

The below screen shows the workflow for viewing your replicated items and how to initiate a failover.

![Replicated items](./media/upgrade-site-recovery-vaults/failover.png)

### How to view your replication settings

In Site Recovery vault, each protection group is configured with replication settings (Copy frequency, Recovery point retention, frequency of application consistent snapshots etc.). In Recovery Services vault, these settings are configured as a replication policy. The name of the policy is the name of the protection group or the ‘primarycloud_Policy’.

To know more about replication policy, refer [here](site-recovery-setup-replication-settings-vmware.md)
