---
title: Migrate VMware VMs agentless the Migration and modernization tool
description: Learn how to run an agentless migration of VMware VMs with Azure Migrate.
author: piyushdhore-microsoft
ms.author: piyushdhore
ms.manager: vijain
ms.topic: tutorial
ms.service: azure-migrate
ms.date: 02/05/2025
ms.custom: vmware-scenario-422, mvc, engagement-fy24
---

# Migrate VMware VMs to Azure (agentless)

This article shows you how to migrate on-premises VMware VMs to Azure, using the [Migration and modernization](../migrate-services-overview.md) tool, with agentless migration. You can also migrate VMware VMs using agent-based migration. [Compare](server-migrate-overview.md#compare-migration-methods) the methods.

[!INCLUDE [scenario-banner.md](../includes/scenario-banner.md)]

This tutorial is the third in a series that demonstrates how to assess and migrate VMware VMs to Azure.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. Tutorials use default options where possible, and don't show all possible settings and paths.


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Add the Migration and modernization tool.
> * Discover VMs you want to migrate.
> * Start replicating VMs.
> * Run a test migration to make sure everything's working as expected.
> * Run a full VM migration.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Prerequisites

Before you begin this tutorial, you should:

1. [Complete the first tutorial](tutorial-discover-vmware.md) to prepare Azure and VMware for migration.
2. We recommend that you complete the second tutorial to [assess VMware VMs](./tutorial-assess-vmware-azure-vm.md) before migrating them to Azure, but you don't have to.
3. Go to the already created project or [create a new project](../create-manage-projects.md)
4. Verify permissions for your Azure account - Your Azure account needs permissions to create a VM, and write to an Azure managed disk.

> [!NOTE]
> To use Azure Hybrid Benefit for Linux, perform the following depending on your operating system type:
>
> For **SLES**, run the following commands:
>
> `wget --no-check-certificate https://52.188.224.179/late_instance_offline_update_azure_SLE15.tar.gz`
> `sha1sum late_instance_offline_update_azure_SLE15.tar.gz`
> `tar -xvf late_instance_offline_update_azure_SLE15.tar.gz`
> `cd x86_64`
> `zypper --no-refresh --no-remote --non-interactive in *.rpm`
>
> For **RHEL**, set SELinux mode to `Permissive` or disabled.


> [!NOTE]
> If you're planning to upgrade your Windows operating system, Azure Migrate may download the Windows SetupDiag for error details in case upgrade fails. Ensure the VM created in Azure post the migration has access to [SetupDiag](https://go.microsoft.com/fwlink/?linkid=870142). In case there is no access to SetupDiag, you may not be able to get detailed OS upgrade failure error codes but the upgrade can still proceed.

## Set up the Azure Migrate appliance

The Migration and modernization tool runs a lightweight VMware VM appliance that's used for discovery, assessment, and agentless migration of VMware VMs. If you follow the [assessment tutorial](./tutorial-assess-vmware-azure-vm.md), you've already set the appliance up. If  you didn't, set it up now, using one of these methods:

- **OVA template**: [Set up](how-to-set-up-appliance-vmware.md) on a VMware VM using a downloaded OVA template.
- **Script**: [Set up](../deploy-appliance-script.md) on a VMware VM or physical machine, using a PowerShell installer script. This method should be used if you can't set up a VM using an OVA template, or if you're in Azure Government.

After creating the appliance, you check that it can connect to Azure Migrate: Server Assessment, configure it for the first time, and register it with the Azure Migrate project.

## Replicate VMs

After setting up the appliance and completing discovery, you can begin replication of VMware VMs to Azure.

- You can run up to 500 replications simultaneously.
- In the portal, you can select up to 10 VMs at once for migration. To migrate more machines, add them to groups in batches of 10.

> [!Note]
> Azure Migrate doesn't support agentless migration of VMware VMs with VMDK containing non-ASCII characters.

Enable replication as follows:

1. In the Azure Migrate project > **Servers, databases and web apps** > **Migration and modernization**, select **Replicate**.

    :::image type="content" source="../media/tutorial-migrate-vmware/select-replicate.png" alt-text="Screenshot on selecting Replicate option.":::

2. In **Replicate**, > **Basics** > **Are your machines virtualized?**, select **Yes, with VMware vSphere**.
3. In **On-premises appliance**, select the name of the Azure Migrate appliance that you set up > **OK**.

    :::image type="content" source="../media/tutorial-migrate-vmware/source-settings.png" alt-text="Screenshot on source settings.":::

4. In **Virtual machines**, select the machines you want to replicate. To apply VM sizing and disk type from an assessment if you've run one, in **Import migration settings from an Azure Migrate assessment?**, select **Yes**, and select the VM group and assessment name. If you aren't using assessment settings, select **No**.

    :::image type="content" source="../media/tutorial-migrate-vmware/select-assessment.png" alt-text="Screenshot on selecting assessment."::: 

5. In **Virtual machines**, select VMs you want to migrate. Then select **Next: Target settings**.

    :::image type="content" source="../media/tutorial-migrate-vmware/select-vms-inline.png" alt-text="Screenshot on selecting VMs." lightbox="../media/tutorial-migrate-vmware/select-vms-expanded.png":::

6. In **Target settings**, select the subscription, target region, and Storage account.
   > [!Note]
   > After starting first replication of a VM, the storage account cannot be changed. The default option selected in drop down will be used to create a new storage account. If the option is not selected, the storage account will be created in final step of enabling replication.
7. In **Virtual Network**, select the Azure VNet/subnet, which the Azure VMs join after migration.
8. In **Availability options**, select:
    -  Availability Zone to pin the migrated machine to a specific Availability Zone in the region. Use this option to distribute servers that form a multi-node application tier across Availability Zones. If you select this option, you'll need to specify the Availability Zone to use for each of the selected machine in the Compute tab. This option is only available if the target region selected for the migration supports Availability Zones
    -  Availability Set to place the migrated machine in an Availability Set. The target Resource Group that was selected must have one or more availability sets in order to use this option. Availability Set with Proximity Placement Groups is supported.
    - No infrastructure redundancy required option if you don't need either of these availability configurations for the migrated machines.
9. In **Disk encryption type**, select:
    - Encryption-at-rest with platform-managed key
    - Encryption-at-rest with customer-managed key
    - Double encryption with platform-managed and customer-managed keys

   > [!NOTE]
   > To replicate VMs with CMK, you'll need to [create a disk encryption set](/azure/virtual-machines/disks-enable-customer-managed-keys-portal) under the target Resource Group. A disk encryption set object maps Managed Disks to a Key Vault that contains the CMK to use for SSE.

10. In **Azure Hybrid Benefit**, specify whether you already have a Windows Server license or Enterprise Linux subscription (RHEL and SLES). If you do and they're covered with active Software Assurance of Windows Server or Enterprise Linux Subscriptions (RHEL and SLES), you can apply for the Azure Hybrid Benefit when you bring licenses to Azure. Then select **Next**. You can also select **I have an Enterprise Linux license** in the **Azure Hybrid benefit** section of the **Compute and Network** screen. 

    :::image type="content" source="../media/tutorial-migrate-vmware/target-settings.png" alt-text="Screenshot on target settings.":::

11. In **Compute**, review the VM name, size, OS disk type, and availability configuration (if selected in the previous step). VMs must conform with [Azure requirements](../migrate-support-matrix-vmware-migration.md#azure-vm-requirements).

    - **VM size**: If you're using assessment recommendations, the VM size dropdown shows the recommended size. Otherwise, Azure Migrate picks a size based on the closest match in the Azure subscription. Alternatively, pick a manual size in **Azure VM size**.
    - **OS Type**: Select the type of OS used (Windows or Linux).
    - **Operating System**: Select the operating system version for Linux machines to apply the correct license type.
    - **OS disk**: Specify the OS (boot) disk for the VM. The OS disk is the disk that has the operating system bootloader and installer.
    - **Availability Zone**: Specify the Availability Zone to use.
    - **Availability Set**: Specify the Availability Set to use.

    > [!NOTE]
    > If you want to select a different availability option for a sets of virtual machines, go to step 1 and repeat the steps by selecting different availability options after starting replication for one set of virtual machines.

12. In **Disks**, indicate whether the VM disks should be replicated to Azure, and specify the disk type (standard SSD/HDD or Premium-managed disks) in Azure. Then select **Next**.

    :::image type="content" source="../media/tutorial-migrate-vmware/disks-inline.png" alt-text="Screenshot shows the Disks tab of the Replicate dialog box." lightbox="../media/tutorial-migrate-vmware/disks-expanded.png":::

    > [!NOTE]
    > To optimize costs and enhance performance, you can now migrate to Premium managed disks for OS disks and Premium V2 SSD (preview) for data disks exclusively on VMware environment.

13. In **Tags**, choose to add tags to your Virtual machines, Disks, and NICs.

    :::image type="content" source="../media/tutorial-migrate-vmware/tags-inline.png" alt-text="Screenshot shows the tags tab of the Replicate dialog box." lightbox="../media/tutorial-migrate-vmware/tags-expanded.png":::

 
14. In **Review and start replication**, review the settings, and select **Replicate** to start the initial replication for the servers.

   > [!NOTE]
   > If there is a connectivity issue with Azure or if the appliance services are down for more than 90 minutes, the active replication cycles for replicating servers are reset to 0% and the respective cycle runs from the beginning.  

> [!NOTE]
> You can update replication settings any time before replication starts (**Manage** > **Replicating machines**). You can't change settings after replication starts.

## Track and monitor

1. Track job status in the portal notifications.
2. Monitor replication status by selecting on the numerical value next to **Azure VM** in **Migration and modernization**.

     ![Monitor replication](../media/tutorial-migrate-vmware/replicating-servers.png)

Replication occurs as follows:
- When the Start Replication job finishes successfully, the machines begin their initial replication to Azure.
- During initial replication, a VM snapshot is created. Disk data from the snapshot is replicated to replica managed disks in Azure.
- After initial replication finishes, delta replication begins. Incremental changes to on-premises disks are periodically replicated to the replica disks in Azure.

## Run a test migration


When delta replication begins, you can run a test migration for the VMs, before running a full migration to Azure. We highly recommend that you do this at least once for each machine, before you migrate it.

- Running a test migration checks that migration will work as expected, without impacting the on-premises machines, which remain operational, and continue replicating.
- Test migration simulates the migration by creating an Azure VM using replicated data (usually migrating to a non-production VNet in your Azure subscription).
- You can use the replicated test Azure VM to validate the migration, perform app testing, and address any issues before full migration.

Do a test migration as follows:

1. In **Servers, databases and web apps** > **Migration and modernization**, select the numerical value next to **Azure VM**.

    :::image type="content" source="../media/tutorial-migrate-vmware/test-migrated-servers.png" alt-text="Screenshot of Test migrated servers.":::

2. Right-click the VM to test, and select **Test migrate**.

    :::image type="content" source="../media/tutorial-migrate-vmware/test-migrate-inline.png" alt-text="Screenshot of Test migration." lightbox="../media/tutorial-migrate-vmware/test-migrate-expanded.png":::

3. In **Test migration**, select the Azure VNet in which the Azure VM will be located during testing. We recommend you use a non-production VNet. 
4. Choose the subnet to which you would like to associate each of the Network Interface Cards (NICs) of the migrated VM.

    :::image type="content" source="../media/tutorial-migrate-vmware/test-migration-subnet-selection.png" alt-text="Screenshot shows subnet selection during test migration.":::
1. You have an option to upgrade the Windows Server OS during test migration. To upgrade, select the **Upgrade available** option. In the pane that appears, select the target OS version that you want to upgrade to and select **Apply**. [Learn more](../how-to-upgrade-windows.md).
5. The **Test migration** job starts. Monitor the job in the portal notifications.
6. After the migration finishes, view the migrated Azure VM in **Virtual Machines** in the Azure portal. The machine name has a suffix **-Test**.
7. After the test is done, right-click the Azure VM in **Replicating machines**, and select **Clean up test migration**.

    :::image type="content" source="../media/tutorial-migrate-vmware/clean-up-inline.png" alt-text="Screenshot of Clean up migration." lightbox="../media/tutorial-migrate-vmware/clean-up-expanded.png":::

    > [!NOTE]
    > You can now register your servers running SQL server with SQL VM RP to take advantage of automated patching, automated backup and simplified license management using SQL IaaS Agent Extension.
    >- Select **Manage** > **Replicating machines** > **Machine containing SQL server** > **Compute and Network** and select **Yes** to register with SQL VM RP.
    >- Select Azure Hybrid benefit for SQL Server if you have SQL Server instances that are covered with active Software Assurance or SQL Server subscriptions and you want to apply the benefit to the machines you're migrating.hs.

## Migrate VMs

After you've verified that the test migration works as expected, you can migrate the on-premises machines.

1. In the Azure Migrate project > **Servers, databases and web apps** > **Migration and modernization**, select numerical value next to **Azure VM**.

    ![Replicating servers](../media/tutorial-migrate-vmware/replicate-servers.png)

2. In **Replicating machines**, right-click the VM > **Migrate**.
3. In **Migrate** > **Shut down virtual machines and perform a planned migration with no data loss**, select **Yes** > **OK**.
    - By default Azure Migrate shuts down the on-premises VM, and runs an on-demand replication to synchronize any VM changes that occurred since the last replication occurred. This ensures no data loss.
    - If you don't want to shut down the VM, select **No**
1. You have an option to upgrade the Windows Server OS during migration. To upgrade, select the **Upgrade available** option. In the pane that appears, select the target OS version that you want to upgrade to and select **Apply**. [Learn more](../how-to-upgrade-windows.md).
4. A migration job starts for the VM. Track the job in Azure notifications.
1. After the job finishes, you can view and manage the VM from the **Virtual Machines** page.

## Complete the migration

1. After the migration is done, right-click the VM > **Complete migration**. This stops replication for the on-premises machine, and cleans up replication state information for the VM.
1. We automatically install the VM agent for Windows VMs and Linux during migration.
1. Verify and [troubleshoot any Windows activation issues on the Azure VM.](/troubleshoot/azure/virtual-machines/troubleshoot-activation-problems)
1. Perform any post-migration app tweaks, such as updating host names, database connection strings, and web server configurations.
1. Perform final application and migration acceptance testing on the migrated application now running in Azure.
1. Cut over traffic to the migrated Azure VM instance.
1. Remove the on-premises VMs from your local VM inventory.
1. Remove the on-premises VMs from local backups.
1. Update any internal documentation to show the new location and IP address of the Azure VMs.

### Linux Support updates

- To receive OS updates on your end of support VM that was migrated to Azure, upgrade to the latest version by following the steps [here](https://access.redhat.com/support/policy/updates/errata/).
- To extend support for your end of support VM that was migrated to Azure with the existing OS version, update the [license option](/azure/virtual-machines/linux/azure-hybrid-benefit-linux?tabs=ahbNewPortal%2CahbExistingPortal%2Clicenseazcli%2CslesAzcliByosConv%2Cslesazclipaygconv%2Crhelpaygconversion%2Crhelcompliance#byos-to-payg-conversions) to get extended support.
- To receive specialized OS updates on your migrated VM, update the license option as described [here](/azure/virtual-machines/linux/azure-hybrid-benefit-linux?tabs=ahbNewPortal%2CahbExistingPortal%2Clicenseazcli%2CslesAzcliByosConv%2Cslesazclipaygconv%2Crhelpaygconversion%2Crhelcompliance#byos-to-payg-conversions).


## Post-migration best practices

- For increased resilience:
    - Keep data secure by backing up Azure VMs using the Azure Backup service. [Learn more](../../backup/quick-backup-vm-portal.md).
    - Keep workloads running and continuously available by replicating Azure VMs to a secondary region with Site Recovery. [Learn more](../../site-recovery/azure-to-azure-tutorial-enable-replication.md).
- For increased performance:
    - By default, data disks are created with host caching set to "None". Review and adjust data disk caching to your workload needs. [Learn more](/azure/virtual-machines/premium-storage-performance#disk-caching).  
- For increased security:
    - Lock down and limit inbound traffic access with [Microsoft Defender for Cloud - Just in time administration](../../security-center/security-center-just-in-time.md).
    - Manage and govern updates on Windows and Linux machines with [Azure Update Manager](../../update-manager/overview.md).
    - Restrict network traffic to management endpoints with [Network Security Groups](../../virtual-network/network-security-groups-overview.md).
    - Deploy [Azure Disk Encryption](/azure/virtual-machines/disk-encryption-overview) to help secure disks, and keep data safe from theft and unauthorized access.
    - Read more about [securing IaaS resources](https://azure.microsoft.com/services/virtual-machines/secure-well-managed-iaas/), and visit the [Microsoft Defender for Cloud](https://azure.microsoft.com/services/security-center/).
- For monitoring and management:
-  Consider deploying [Microsoft Cost Management](../../cost-management-billing/cost-management-billing-overview.md) to monitor resource usage and spending.


## Next steps

Investigate the [cloud migration journey](/azure/architecture/cloud-adoption/getting-started/migrate) in the Azure Cloud Adoption Framework.
