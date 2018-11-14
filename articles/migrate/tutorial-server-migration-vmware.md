---
title: Migrate on-premises VMware VMs to Azure with Azure Migrate Server Migration | Microsoft Docs
description: Describes how to migrate on-premises VMware VMs to Azure, using Azure Migrate Server Migration.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: tutorial
ms.date: 11/13/2018
ms.author: raynew
ms.custom: mvc
---

# Migrate VMware VMs to Azure

The [Azure Migrate](migrate-overview.md) service discovers, assesses, and migrates on-premises workloads to Azure. 

This article describes how to migrate on-premises VMware VMs using the public preview of Azure Migrate Server migration. 

> [!NOTE]
> Azure Migrate Server Migration is currently in public preview. You can use the existing GA version of Azure Migrate to discover and assess VMs for migration, but the actual migration isn't supported in the existing GA version.

In this tutorial, you:

> [!div class="checklist"]
> * Start replicating on-premises VMs discovered by the Azure Migrate appliance.
> * Run a test migration to make sure everything's working as expected.
> * Run a full migration of the VMware VMs.

## Before you start

Before you begin this tutorial you should:
- Deploy the Azure Migrate appliance. If you haven't, [complete this tutorial](tutorial-deploy-appliance-vmware.md) to set up the appliance.
- Assess the VMs you want to migrate. You don't have to do this, but you can migrate more confidently if you've assessed the VMs to check that they're suitable for running in Azure, and to get estimates for Azure VM sizing, and monthly Azure costs. If you run an assessment, you can use the recommended sizes when you migrate the VMs.
- To learn more about this preview:
    - Review the [preview features and limitations](migrate-overview.md#azure-migrate-services-public-preview).
    - Learn about [VMware](migrate-overview.md#vmware-architecture) assessment and migration architecture.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Check VMs in the portal

You discovered the on-premises VMs when you set up the Azure Migrate appliance. Before you migrate, verify that the VMs appear as expected in the Azure portal:

1. Open the Azure Migrate dashboard
2. In the **Server Assessment Service** page, click the icon that displays the count for the discovered machines. 

## Replicate VMs

1. In the Azure Migrate dashboard, under **Migrate**, verify the machines that appear, and click **Migrate Servers** to open the Server Migration wizard.
2. In  **Select virtual machines** > **Import settings from an Azure Migrate assessment**, click **Yes** if you want to use the VM sizes and disk type recommended in an assessment. Click **No** to specify the settings manually.
3. In **Select group and assessment**, if you indicated you want to use settings from an assessment, select the group and assessment from which you want to import the settings. You can only import settings from assessments created for the same VMware site.
4. In **Select virtual machines**, check each VM you want to migrate. You can select a  maximum of five machines. Then click **Next**.
5. In **Target settings**, select the subscription and Azure region for the migration. 
6. Pick the resource group in which the migrated VMs will be located, and the Azure VNet/subnet in which the migrated Azure VMs will be located. 
7. In **Azure Hybrid Benefit**, click **Yes** if you want to apply the benefit to the machines you're migrating. Then click **Next**.
8. In **Compute**, select the migrated VM size, OS disk, and availability set, and then click **Next**.
    - If you selected to use VM sizing from an assessment, the VM sizing dropdown will show the assessment recommendations.
    - If you didn't select to use an assessment, Azure Migrate automatically picks a size based on the closest match in the Azure subscription.
    - If you want to set the size manually, clear the option to let Azure Migrate pick the size, and select VM sizes in the dropdown.
    - The OS disk has the OS bootloader and the operating system installation.
    - If the VM should be in an Azure availability set after migration, specify the set. The set must be in the target resource group you specify for the migration.
9. In **Disk**, specify whether the VM disks should be replicated to standard or premium managed disks in Azure. If you exclude disks they won't be replicated, and thus won't be present on the Azure VM after migration. Then click **Next**.
10. In **Prepare infrastructure**, set up the Azure components needed for the migration, and then click **Next**. Creating the Azure components might take a few minutes.

    - You only need to set up the infrastructure once for each Azure Migrate appliance. 
    - You set up the infrastructure the first time you replicate a VM using the appliance.
    - **Service bus**: Azure Migrate uses the service bus to send replication orchestration messages to the appliance.
    - **Gateway storage account**: Azure Migrate uses the gateway storage acount to store state information about the VMs being replicated.
    - **Log storage account**: The Azure Migrate appliance uploads replication logs for VMs to a log storage account. Azure Migrate applies the replication information to the replica managed disks.
    - **Key vault**: The Azure Migrate appliance uses the key vault to manage connection strings for the service bus, and access keys for the storage accounts used in replication.

11. In **Configure infrastructure**, you configure the key vault so that it can manage the access keys for the storage accounts. Do this as follows:

    - Open PowerShell on your desktop.
    - Use the **Login-AzureRMAccount** cmdlet to log into your Azure account.
    - Click **Copy** to copy the PowerShell script that appears on the **Configure Infrastructure** page.
    - Paste the script into PowerShell, and wait for it to run and finish.
    - Confirm that the script has run successfully, and then click **Next**.
12. In **Summary**, review the replication settings, and click **Replicate** to begin the initial replication of the VMs.

    - A job starts to replicate each selected VM
    - You can monitor the job on the Azure Migrate dashboard > **Server Migration** > **Migration Jobs**.
    - After the start replication job finishes, initial replication begins.
    - During initial replication, a VM snapshot is created. Disk data from the snapshot is replicated to replica managed disks in Azure.
    - After initial replication finishes, delta replication begins. Incremental changes to on-premises disks are periodically replicated to the replica disks in Azure.
    - When delta replication begins, you can run a test migration for the VMs, before running a full migration to Azure.
    - After the initial replication, you can update VM properties at any time before you migrate the VM. On the **Migrating machines** page, click the VM to view and modify its settings.


## Run a test migration

Run a test migration to check that migration is working properly, without impacting the on-premises machines, which remain operational. 

- Test migration simulates the migration by creating an Azure VM using replicated data (usually migrating to a non-production VNet in your Azure subscription).
- You can use the replicated test Azure VM to validate the migration, perform app testing, and address any issues before full migration.

Do a test migration as follows:

1. In Azure Migrate dashboard > **Server Migration** > **Migrating machines**, right-click the VM > **Test migrate**.
2. In **Test Migration**, select the  the Azure VNet in which the Azure VM will be located after the migration. We suggest using a non-production VNet.
3. Select the snapshot you want to use for the migration.
4. Check the test migration job in **Server Migration** > **Migration Jobs**.
5. After test migration completes, you can manage the test VM from the Virtual Machines in the Azure portal. The VM will have the suffix **-Test** in its name.
6. After test migration completes and you've finished testing, right-click the VM on the **Migrating machines** page > **Clean up test migration**.


## Run a full migration

After you've verified that the test migration works as expected, you can migrate the on-premises machines.

1. In the Azure Migrate dashboard > **Server Migration** > **Migrating machines**, right-click the VM > **Migrate**.
2. Select the latest snapshot > **OK**.
3. This starts a migration job for the VM. You can track the job on the dashboard > **Server Migration** > **Migration Jobs**.
4. After the job finishes the Azure VM appears in the portal, and you can manage it from the **Virtual Machines** page.
5. To finish the migration, right-click the VM in **Migrating Machines** > **Complete migration**. This stops replication for the on-premises machine, and cleans up replication information for the VM.



## Next steps

- [Learn](concepts-assessment-calculation.md) how assessments are calculated.
- [Learn](how-to-modify-assessment.md) how to customize an assessment.
- Learn how to increase the reliability of assessments using [machine dependency mapping](how-to-create-group-machine-dependencies.md)
