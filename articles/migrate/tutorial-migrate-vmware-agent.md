---
title: Migrate VMware vSphere VMs with agent-based the Migration and modernization tool
description: Learn how to run an agent-based migration of VMware vSphere VMs with Azure Migrate.
author: dhananjayanr98
ms.author: dhananjayanr
ms.manager: kmadnani
ms.topic: tutorial
ms.service: azure-migrate
ms.reviewer: v-uhabiba
ms.date: 05/12/2025
ms.custom: vmware-scenario-422, MVC, engagement-fy25
# Customer intent: As a system administrator, I want to migrate VMware vSphere VMs to Azure using agent-based migration, so that I can leverage cloud capabilities while ensuring minimal downtime and maintaining operational continuity during the transition.
---

# Migrate VMware vSphere VMs to Azure (agent-based)

This article shows you how to migrate on-premises VMware vSphere or Azure VMware Solution VMs to Azure, using the [Migration and modernization](migrate-services-overview.md) tool, with agent-based migration.  You can also migrate VMware vSphere VMs using agentless migration (Recommended). [Compare](server-migrate-overview.md) the methods.

 In this tutorial, you learn how to:
> [!div class="checklist"]
> * Prepare Azure to work with Azure Migrate.
> * Prepare for agent-based migration. Set up a VMware vCenter Server account so that Azure Migrate can discover machines for migration. Set up an account so that the Mobility service agent can install on machines you want to migrate, and prepare a machine to act as the replication appliance.
> * Set up the replication appliance.
> * Start migration execution.
> * Track and monitor migrations.
> * Run a test migration to make sure everything's working as expected.
> * Run a full VM migration.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. Tutorials use default options where possible, and don't show all possible settings and paths.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.


## Prerequisites

Before you begin this tutorial, you should:

1. Go to the already created project or [create a new project](create-manage-projects.md).
2. [Complete the first tutorial](./tutorial-discover-vmware.md) to prepare Azure and VMware for migration.
3. We recommend that you complete the second tutorial to [assess VMware VMs](./tutorial-assess-vmware-azure-vm.md) before migrating them to Azure, but you don't have to.
4. Verify permissions for your Azure account - Your Azure account needs permissions to create a VM, and write to an Azure managed disk.
5.  For the required Azure Migrate built‑in roles and permission details to create a project and run discovery, assessments, and migrations, see [Prepare Azure accounts for Azure Migrate](prepare-azure-accounts.md).
6.  Assign permissions to register the Replication Appliance in Microsoft Entra ID. [Learn more](../site-recovery/deploy-vmware-azure-replication-appliance-modernized.md#required-permissions).

### Set up an Azure network

[Set up an Azure network](/azure/virtual-network/manage-virtual-network). Source (on-premises or Azure VMware Solution) machines are replicated to Azure managed disks. When you fail over to Azure for migration, Azure VMs are created from these managed disks, and joined to the Azure network you set up.


## Prepare for migration

Verify support requirements  and permissions, and prepare to deploy a replication appliance.

### Prepare an account to discover VMs

The Migration and modernization tool needs access to VMware vSphere to discover VMs you want to migrate. Create the account as follows:

1. To use a dedicated account, create a role at the vCenter Server level. Give the role a name such as
   **Azure_Migrate**.
2. Assign the role the permissions summarized in the table below.
3. Create a user on the vCenter Server or vSphere host. Assign the role to the user.

#### VMware vSphere account permissions

**Task** | **Role/Permissions** | **Details**
--- | --- | ---
**VM discovery** | At least a read-only user<br/><br/> Data Center object –> Propagate to Child Object, role=Read-only | User assigned at datacenter level, and has access to all the objects in the datacenter.<br/><br/> To restrict access, assign the **No access** role with the **Propagate to child** object, to the child objects (vSphere hosts, datastores, VMs, and networks).
**Replication** |  Create a role (Azure Site Recovery) with the required permissions, and then assign the role to a VMware vSphere user or group<br/><br/> Data Center object –> Propagate to Child Object, role=Azure Site Recovery<br/><br/> Datastore -> Allocate space, browse datastore, low-level file operations, remove file, update virtual machine files<br/><br/> Network -> Network assign<br/><br/> Resource -> Assign VM to resource pool, migrate powered off VM, migrate powered on VM<br/><br/> Tasks -> Create task, update task<br/><br/> Virtual machine -> Configuration<br/><br/> Virtual machine -> Interact -> answer question, device connection, configure CD media, configure floppy media, power off, power on, VMware tools install<br/><br/> Virtual machine -> Inventory -> Create, register, unregister<br/><br/> Virtual machine -> Provisioning -> Allow virtual machine download, allow virtual machine files upload<br/><br/> Virtual machine -> Snapshots -> Remove snapshots | User assigned at datacenter level, and has access to all the objects in the datacenter.<br/><br/> To restrict access, assign the **No access** role with the **Propagate to child** object, to the child objects (vSphere hosts, datastores, VMs, and networks).

### Prepare an account for Mobility service installation

The Mobility service must be installed on machines you want to replicate.

- The Azure Migrate replication appliance can do a push installation of this service when you enable replication for a machine, or you can install it manually, or using installation tools.
- In this tutorial, we're going to install the Mobility service with the push installation.
- For push installation, you need to prepare an account that the Migration and modernization tool can use to access the VM. This account is used only for the push installation, if you don't install the Mobility service manually.

Prepare the account as follows:

1. Prepare a domain or local account with permissions to install on the VM.
2. For Windows VMs, if you're not using a domain account, disable Remote User Access control on the local machine by adding the DWORD entry **LocalAccountTokenFilterPolicy**, with a value of 1 in the registry, under **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System**
3. For Linux VMs, prepare a root account on the source Linux server.


### Prepare a machine for the replication appliance

The Azure Site Recovery Replication appliance is used to replicate machines to Azure. [Learn more](../site-recovery/vmware-azure-architecture-modernized.md).

To set up a new appliance, we recommend using the OVA template as it ensures all prerequisite configurations are handled. The OVA template creates a machine with the required specifications. 

If your organization has restrictions, you can manually set up the replication appliance using PowerShell. Ensure you meet all the [hardware](../site-recovery/replication-appliance-support-matrix.md#hardware-requirements) and [software requirements](../site-recovery/replication-appliance-support-matrix.md#software-requirements), and any other prerequisites.

### Check VMware vSphere requirements

Make sure VMware vSphere VMs comply with requirements for migration to Azure.

1. [Verify](migrate-support-matrix-vmware-migration.md#vmware-vsphere-requirements-agent-based) VMware vSphere VM requirements.
2. [Verify](migrate-support-matrix-vmware-migration.md#vm-requirements-agent-based) VM requirements for migration.
3. Verify Azure settings. Source VMs (on-premises or Azure VMware Solution VMs) you replicate to Azure must comply with [Azure VM requirements](migrate-support-matrix-vmware-migration.md#azure-vm-requirements).
4. There are some changes needed on VMs before you migrate them to Azure.
    - It's important to make these changes before you begin migration. If you migrate the VM before you make the change, the VM might not boot up in Azure.
    - Review [Windows](prepare-for-migration.md#windows-machines) and [Linux](prepare-for-migration.md#linux-machines) changes you need to make.

> [!NOTE]
> Agent-based migration with the Migration and modernization tool is based on features of the Azure Site Recovery service. Some requirements might link to Site Recovery documentation.

## Set up the replication appliance

> [!NOTE]
> Classic replication appliance is retiring on **30 September 2026**. Final recovery point for existing replications will be on **31 May 2026**. Support for migrating these will continue until the retirement date (**30 September 2026**). You need to switch to the simplified appliance for all new migrations using the agent-based replication appliance.

This section describes how to set up the simplified appliance with a downloaded Open Virtualization Application (OVA) template. If you can't use this method, you can set up the appliance [using a script](tutorial-migrate-physical-virtual-machines.md#set-up-the-replication-appliance).

### Download the replication appliance OVF template or PowerShell installer script
> [!NOTE]
> Azure migrate appliance based discovery is a prerequisite to set up replication appliance and track agent-based migrations in the new portal. To execute migrations using replication appliance directly without installing Azure Migrate appliance, You must redirect to classic Azure Migrate Portal by navigating to your **Azure Migrate Project > Execute > Migrations** and clicking on the link available in the banner.

1. In the Azure Migrate project > **Execute** > **Migration**, select **Start execution**.
2. In **Specify intent**, > **What do you want to migrate**, select **Servers or Virtual Machines(VM)**. Under **Where do you want to migrate to**, select **Azure VM**.
3. In **How will you select workloads**, You can either manually select servers using **From all inventory** or select an existing assessment using **From an assessment**.
4. In **Discovery method**, select the appliance that matches your source environment (VMware vSphere in this case). Under **Migration mode**, select **Agent-based migration**.
5. In **Workloads** page, Select **Set up the replication appliance** to start the appliance set up.   
6. Virtualization type and migration method (agentless vs agent-based) will be prepopulated and greyed out based on the source azure migrate appliance type used for discovery and the migration mode selected in the previous step.
7. In **Target region**, select the Azure region to which you want to migrate the machines.
8. Select **Confirm that the target region for migration is region-name**.
9. Select **Create resources**. This creates an Azure Site Recovery vault in the background.
    > [!NOTE]
    > You can't change the target region for this project after clicking this button, and all subsequent migrations are to this region.
   
10. Select **[Download](https://aka.ms/V2ARcmOvaDownloadLink_ecy)**. This downloads an OVF template. 
11. Note the name of the resource group and the Recovery Services vault. You need these during appliance deployment.

    > [!NOTE]
    > If you selected private endpoint as the connectivity method for the Azure Migrate project when it was created, the Recovery Services vault will also be configured for private endpoint connectivity. Ensure that the private endpoints are reachable from the replication appliance: [**Learn more**](troubleshoot-network-connectivity.md)

### Import the OVF template into VMware vSphere

After downloading the OVF template, you import it into VMware vSphere to create the replication application on a VMware vSphere VM running Windows Server 2016.

1. Sign in to the VMware vCenter Server or vSphere ESXi host with the VMware vSphere Client.
2. On the **File** menu, select **Deploy OVF Template** to start the **Deploy OVF Template Wizard**.
3. In **Select source**, enter the location of the downloaded OVF.
4. In **Review details**, select **Next**.
5. In **Select name and folder** and **Select configuration**, accept the default settings.
6. In **Select storage** > **Select virtual disk format**, for best performance select **Thick Provision Eager Zeroed**.
7. On the rest of the wizard pages, accept the default settings.
8. In **Ready to complete**, to set up the VM with the default settings, select **Power on after deployment** > **Finish**.

   > [!TIP]
   > If you want to add an additional NIC, clear **Power on after deployment** > **Finish**. By default, the template contains a single NIC. You can add additional NICs after deployment.

### Register the replication appliance

Finish setting up and registering the replication appliance using the steps provided [here](../site-recovery/deploy-vmware-azure-replication-appliance-modernized.md#register-appliance).

## Execute migrations


> [!NOTE]
> In the portal you can select up to 10 machines at once for replication. If you need to replicate more, then group them in batches of 10.

1. In the Azure Migrate project > **Execute** > **Migration**, select **Start execution**.

2. In **Specify intent**, > **What do you want to migrate**, select **Servers or Virtual Machines(VM)**. Under **Where do you want to migrate to**, select **Azure VM**.

3. In **How will you select workloads**, You can either manually select servers using **From all inventory** or select an existing assessment using **From an assessment**.

4. In **Discovery method**, select the appliance that matches your source environment (VMware vSphere in this case). Under **Migration mode**, select **Agent-based migration**.

5. In **Workloads**, select the machines you want to replicate and migrate and select the **Target VM security type**. Azure Migrate supports migration to Trusted Launch Virtual Machines (TVMs). By default, it migrates eligible VMs as TVMs. These VMs provide enhanced security features such as secure boot and virtual TPM at no extra cost. We recommend using them wherever applicable.
6. Select the replication appliance you have set up from the drop-down menu or set up a new replication appliance by referring the steps provided in previous section.
7. In **vCenter server/vSphere host**, select the vCenter host details from the drop-down.
8. In **Guest credentials**, specify the VM admin account that will be used for push installation of the Mobility service. Then click Next after selecting the VMs you want to replicate.
9. In **Target settings**, select the subscription, and target region to which you'll migrate, and specify the resource group in which the Azure VMs will reside after migration. Complete the below settings in the blade,
     - In **Availability options**, select:
          - Availability Zone to pin the migrated machine to a specific Availability Zone in the region. Use this option to distribute servers that form a multi-node application tier across Availability Zones. If you select this option,                 you'll need to specify the Availability Zone to use for each of the selected machine in the Compute tab. This option is only available if the target region selected for the migration supports Availability Zones
          - Availability Set to place the migrated machine in an Availability Set. The target Resource Group that was selected must have one or more availability sets in order to use this option.
          - No infrastructure redundancy required option if you don't need either of these availability configurations for the migrated machines.
     - In **Virtual Network**, select the Azure VNet/subnet to which the Azure VMs will be joined after migration.  
     - In  **Cache storage account**, keep the default option to use the cache storage account that is automatically created for the project. Use the dropdown if you'd like to specify a different storage account to use as the cache storage         account for replication. <br/>

   > [!NOTE]
   > - If you selected private endpoint as the connectivity method for the Azure Migrate project, grant the Recovery Services vault access to the cache storage account. [**Learn more**](migrate-servers-to-azure-using-private-link.md#grant-access-permissions-to-the-recovery-services-vault)
   > - To replicate using ExpressRoute with private peering, create a private endpoint for the cache storage account. [**Learn more**](migrate-servers-to-azure-using-private-link.md#create-a-private-endpoint-for-the-storage-account-1)
   
     - In **Disk encryption type**, select:
          - Encryption-at-rest with platform-managed key
          - Encryption-at-rest with customer-managed key
          - Double encryption with platform-managed and customer-managed keys

   > [!NOTE]
   > To replicate VMs with CMK, you'll need to [create a disk encryption set](/azure/virtual-machines/disks-enable-customer-managed-keys-portal#set-up-your-disk-encryption-set) under the target Resource Group. A disk encryption set object maps managed disks to a Key Vault that contains the CMK to use for SSE.
   
     - In **Azure Hybrid Benefit**:
          - Select **No** if you don't want to apply Azure Hybrid Benefit. Then click **Next**.
          - Select **Yes** if you have Windows Server machines that are covered with active Software Assurance or Windows Server subscriptions, and you want to apply the benefit to the machines you're migrating. Then click **Next**.
      
10. In **Compute**, review the VM name, size, OS disk type, and availability configuration (if selected in the previous step). VMs must conform with [Azure requirements](migrate-support-matrix-vmware-migration.md#azure-vm-requirements).

   - **VM size**: If you're using assessment recommendations, the VM size dropdown shows the recommended size. Otherwise Azure Migrate picks a size based on the closest match in the Azure subscription. Alternatively, pick a manual size in **Azure VM size**.
   - **OS disk**: Specify the OS (boot) disk for the VM. The OS disk is the disk that has the operating system bootloader and installer.
   - **Availability Zone**: Specify the Availability Zone to use.
   - **Availability Set**: Specify the Availability Set to use.
   - **Capacity reservation**: If you already have a capacity reservation for the VM SKU in the target subscription and location,         specify it here for this deployment. Capacity reservations ensure that the required VM SKU is available when you start              migration. You can associate a reservation now or skip this step and configure it later during the migration. The capacity reservation for the SKU can be in any resource group within the target subscription and location.[Learn more](/azure/virtual-machines/capacity-reservation-create).

11. In **Disks**, specify whether the VM disks should be replicated to Azure, and select the disk type (Premium v2, Ultra Disk, Standard SSD, Standard HDD, or Premium Managed disks) in Azure. Then select **Next**.
    - You can exclude disks from replication.
    - If you exclude disks, they won't be present on the Azure VM after migration.
    - You can exclude disks if the mobility agent is already installed on that server. [Learn more](../site-recovery/exclude-disks-replication.md#exclude-limitations).

12. In **Tags**, choose to add tags to your Virtual machines, Disks, and NICs.

13. In **Review and start execution**, review the settings, and select **Review and start execution** to start the initial              replication for the servers.

## Track and monitor

1. In Azure Migrate project, go to Execute > Migrations. Use **View by applications** or **View by workloads** to switch how items     are grouped.

2. Replication occurs as follows: 
      - When the Start Replication job finishes successfully, the machines begin their initial replication to Azure.
	  - During initial replication, a VM snapshot is created. Disk data from the snapshot is replicated to replica managed disks in         Azure.
	  - After initial replication finishes, delta replication begins. Incremental changes to the source disks are periodically              replicated to the replica disks in Azure.

3. Execution progress is shown in Execution stage and Execution status:
      - **Execution stage**: Preparation, Testing, or Completion.
      - **Execution status**: In progress, In error, Action pending, or Completed.
  
4. Execution progress is tracked across three stages in the Execution stage:
      - **Preparation**: Servers that are enabled for replication remain in the Preparation stage while initial replication (data             replication) is in progress. You can perform **Stop, Start, Pause, & Resume** operations in this stage if required using            the drop-downs available in the server drill-down blade. After initial replication is complete, the servers move to the             Testing stage. 
      -  **Testing**: Servers for which initial replication is complete and delta replication is in progress will move to the                 Testing phase. You can choose perform test migrations on a test virtual network before the actual migration                         (recommended). You can skip the Testing stage and start migration directly by using the actions available in the                    **Completion** drop-down menu. 
      - **Completion**: Servers for which Test Migrations are completed or skipped will move to this stage. You can perform final             migrations (Cutover) for these servers. After migration is completed, perform **Complete migration** to clean up the                migration resources by using the drop-downs available in the server drill-down blade.

## Run a test migration

When delta replication begins, you can run a test migration for the VMs, before running a full migration to Azure. We highly recommend that you do this at least once for each machine, before you migrate it.

- Running a test migration checks that migration works as expected, without impacting the source (on-premises or AVS) machines, which remain operational, and continue replicating.
- Test migration simulates the migration by creating an Azure VM using replicated data (usually migrating to a non-production VNet in your Azure subscription).
- You can use the replicated test Azure VM to validate the migration, perform app testing, and address any issues before full migration.

Do a test migration as follows:

1. In Azure Migrate project, Under **Execute** > **Migrations** > select the server for which you wish to do test migration by clicking on the server name under **Workloads** column.

2. In the drill-down blade, under **Testing** drop-down, select **Start test migration**.

3. In **Test migration**, select the Azure VNet in which the Azure VM will be located during testing. We recommend you use a non-production VNet. 
4. Select the subnet to which you would like to associate each of the Network Interface Cards (NICs) of the migrated VM.

    :::image type="content" source="./media/tutorial-migrate-vmware/test-migration-subnet-selection.png" alt-text="Screenshot shows subnet selection during test migration.":::
5. You have an option to upgrade the Windows Server OS during test migration. To upgrade, select the **Upgrade available** option. In the pane that appears, select the target OS version that you want to upgrade to and select **Apply**. [Learn more](./how-to-upgrade-windows.md).
6. Once you click **Test migration**, the job starts. Monitor the status in the portal under **Execution status**. After the test migration finishes, ensure you clean up the test resources by navigating to the server and selecting **Clean up test migration** under the **Testing** drop-down.

    :::image type="content" source="./media/tutorial-migrate-vmware/clean-up-inline.png" alt-text="Screenshot of Clean up migration." lightbox="./media/tutorial-migrate-vmware/clean-up-expanded.png":::

    > [!NOTE]
    > You can now register your servers running SQL server with SQL VM RP to take advantage of automated patching, automated backup and simplified license management using SQL IaaS Agent Extension.
    >- Select the server under **Workloads** column in Execute> Migrations page. In Compute and Network settings, select checkbox associated with register with SQL IaaS extension.
    >- Select Azure Hybrid benefit for SQL Server if you have SQL Server instances that are covered with active Software Assurance or SQL Server subscriptions and you want to apply the benefit to the machines you're migrating.hs.

## Migrate VMs

After you've verified that the test migration works as expected, you can migrate the source (on-premises or AVS) machines.

1. In Azure Migrate project, Under **Execute** > **Migrations** > select the server for which you wish to do final migration by clicking on the server name under **Workloads** column.
2. In the drill-down blade, under **Completion** drop-down, select **Migrate**.
3. In **Migrate** > **Shut down virtual machines and perform a planned migration with no data loss**, select **Yes** > **OK**.
    - By default Azure Migrate shuts down the source (on-premises or AVS) VM, and runs an on-demand replication to synchronize any VM changes that occurred since the last replication occurred. This ensures no data loss.
    - If you don't want to shut down the VM, select **No**
4. You have an option to upgrade the Windows Server OS during migration. To upgrade, select the **Upgrade available** option. In the pane that appears, select the target OS version that you want to upgrade to and select **Apply**. [Learn more](./how-to-upgrade-windows.md).
5. If you already have a capacity reservation for the VM SKU in the target subscription and location, specify it here for this deployment. Capacity reservations ensure that the required VM SKU is available when you start migration. The capacity reservation for the SKU can be in any resource group within the target subscription and location. [Learn more](/azure/virtual-machines/capacity-reservation-create).
6. A migration job starts for the server. Track the job in Azure notifications.
7. After the job finishes, you can view and manage the server from the **Migrations** page which will be tracked under **Completion** stage.

## Complete the migration

1. After the migration is done, in the drill-down page of the server, under Completion drop-down, select Complete migration. This      stops replication for the source (on-premises or AVS) machine, and cleans up replication state information for the VM.
1. Verify and [troubleshoot any Windows activation issues on the Azure VM.](/troubleshoot/azure/virtual-machines/troubleshoot-activation-problems)
1. Perform any post-migration app tweaks, such as host names, updating database connection strings, and web server configurations.
1. Perform final application and migration acceptance testing on the migrated application now running in Azure.
1. Cut over traffic to the migrated Azure VM instance.
1. Remove the source (on-premises or AVS) VMs from your local VM inventory.
1. Remove the source (on-premises or AVS) VMs from local backups.
1. Update any internal documentation to show the new location and IP address of the Azure VMs.

## Post-migration best practices

- On-premises or on Azure VMware Solution
    - Move app traffic over to the app running on the migrated Azure VM instance.
    - Remove the source VMs (on-premises or AVS) from your local VM inventory.
    - Remove the source VMs (on-premises or AVS) from local backups.
    - Update any internal documentation to show the new location and IP address of the Azure VMs.
- Tweak Azure VM settings after migration:
    - The [Azure VM agent](/azure/virtual-machines/extensions/agent-windows) manages VM interaction with the Azure Fabric Controller. It's required for some Azure services, such as Azure Backup, Site Recovery, and Azure Security. When migrating VMware VMs with agent-based migration, the Mobility Service installer installs Azure VM agent on Windows machines. On Linux VMs, we recommend that you install the agent after migration.
    - Manually uninstall the Mobility service from the Azure VM after migration. We recommend that you reboot the server when prompted.
    - Manually uninstall VMware tools after migration.
- In Azure:
    - Perform any post-migration app tweaks, such as updating database connection strings, and web server configurations.
    - Perform final application and migration acceptance testing on the migrated application now running in Azure.
- Business continuity/disaster recovery
    - Keep data secure by backing up Azure VMs using the Azure Backup service. [Learn more](../backup/quick-backup-vm-portal.md).
    - Keep workloads running and continuously available by replicating Azure VMs to a secondary region with Site Recovery. [Learn more](../site-recovery/azure-to-azure-tutorial-enable-replication.md).
- For increased security:
    - Lock down and limit inbound traffic access with [Microsoft Defender for Cloud - Just in time administration](../security-center/security-center-just-in-time.md).
    - Manage and govern updates on Windows and Linux machines with [Azure Update Manager](../update-manager/overview.md).
    - Restrict network traffic to management endpoints with [Network Security Groups](../virtual-network/network-security-groups-overview.md).
    - Deploy [Azure Disk Encryption](/azure/virtual-machines/disk-encryption-overview) to help secure disks, and keep data safe from theft and unauthorized access.
    - Read more about [securing IaaS resources](https://azure.microsoft.com/services/virtual-machines/secure-well-managed-iaas/), and visit the [Microsoft Defender for Cloud](https://azure.microsoft.com/services/security-center/).
- For monitoring and management:
    - Consider deploying [Microsoft Cost Management](../cost-management-billing/cost-management-billing-overview.md) to monitor resource usage and spending.

 ## Next steps

- Investigate the [cloud migration journey](/azure/architecture/cloud-adoption/getting-started/migrate) in the Azure Cloud Adoption Framework.
- Learn more on how to migrate your [Hyper-V](tutorial-migrate-hyper-v.md) and [Physical](tutorial-migrate-physical-virtual-machines.md) Servers.
