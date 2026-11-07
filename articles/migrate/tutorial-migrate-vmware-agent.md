---
title: Migrate VMware vSphere VMs with agent-based the Migration and modernization tool
description: Learn how to run an agent-based migration of VMware vSphere VMs with Azure Migrate.
author: dhananjayanr98
ms.author: dhananjayanr
ms.manager: kmadnani
ms.topic: tutorial
ms.service: azure-migrate
ms.reviewer: v-gajeronika
ms.date: 06/16/2026
ms.update-cycle: 365-days
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

This section describes how to set up the replication appliance by using a downloaded Open Virtualization Application (OVA) template. If you can't use this method, you can set up the appliance [by using a script](tutorial-migrate-physical-virtual-machines.md#set-up-the-replication-appliance).

### Download the replication appliance OVF template

1. In the Azure Migrate project, go to **Manage** > **Server replication**, and select **Start replication**.
2. In **Specify intent**, under **What do you want to migrate**, select **Servers or Virtual Machines (VM)**. Under **Where do you want to migrate to**, select **Azure VM**.
3. In **How will you select workloads**, select **From replication appliance (VMware)** under **Other sources**. Select the link available in the page to start the setup.
4. In the setup page, the virtualization type is prepopulated based on the selection applied in the previous step (VMware).
5. In **Target region**, select the Azure region where you want to migrate the machines.
6. Select **Confirm that the target region for migration is ``region-name``**.
7. Select **Create resources**. This action creates an Azure Site Recovery vault in the background.
    > [!NOTE]
    > You can't change the target region for this project after clicking this button, and all subsequent migrations are to this region.

   
8. Select **[Download](https://aka.ms/V2ARcmOvaDownloadLink_ecy)**. This action downloads an OVF template. 
9. Note the name of the resource group and the Recovery Services vault. You need these names during appliance deployment.

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

1. In the Azure Migrate project, go to **Manage** > **Server replication**, and select **Start replication**.

    :::image type="content" source="./media/tutorial-migrate-vmware-agent/execute-migration.png" alt-text="Screenshot how to start the execution." lightbox="./media/tutorial-migrate-vmware-agent/execute-migration.png":::

2. In **Specify intent**, > **What do you want to migrate**, select **Servers or Virtual Machines(VM)**. Under **Where do you want to migrate to**, select **Azure VM**.

3. Under **How will you select workloads**, select one of the following options:
    - If you have an existing Azure Migrate appliance, select one of the following options and proceed to **Discovery method**:
         - **From all inventory** to manually select servers.
         - **From an assessment** to use an existing assessment.
    - If you don't have an existing Azure Migrate appliance (required for assessments, waves, and other planning capabilities) and want to directly execute agent-based migrations, select **From a replication appliance (VMware)**.  If you completed the replication appliance setup, you can proceed to **Workloads**.
       Otherwise, complete the setup as per the steps provided in the previous section.

4. In **Discovery method**, select the appliance that matches your source environment (VMware vSphere in this case). Under **Migration mode**, select **Agent-based migration**.

    :::image type="content" source="./media/tutorial-migrate-vmware-agent/agent-based-method.png" alt-text="Screenshot show how to select agent-based migration." lightbox="./media/tutorial-migrate-vmware-agent/agent-based-method.png":::

5. In **Workloads**:
   - Select the **Target VM security type**.
        - Azure Migrate supports migration to Trusted Launch Virtual Machines (TVMs). By default, it migrates eligible VMs as TVMs. These VMs provide enhanced security features such as secure boot and virtual TPM at no extra cost.
        - You can also migrate eligible machines to Confidential virtual machines, [Learn more](../confidential-computing/confidential-vm-overview.md). If you select **Confidential virtual machines**, only eligible servers are available for selection and the rest are grayed out. Refer [CVM support matrix](migrate-to-trusted-launch-virtual-machines-with-azure-migrate.md#supported-operating-systems-for-migrating-to-confidential-virtual-machines).
   - Select the replication appliance you set up from the drop-down menu or set up a new replication appliance by referring to the steps provided in the previous section.
       - In **vCenter server/vSphere host**, select the vCenter host details from the drop-down.
       - In **Guest credentials**, specify the VM admin account that you use for push installation of the Mobility service.
   - Then, select **Next** after selecting the VMs you want to replicate.
6. In **Target settings**, select the subscription and target region to which you want to migrate, and specify the resource group where the Azure VMs reside after migration. Complete the following settings:
    - **Storage account**: Keep the default option to use the cache storage account that the portal automatically creates for the project. To use a different storage account for replication, select it from the drop-down list.
    
   > [!NOTE]
   > - If you use private endpoint as the connectivity method for the Azure Migrate project, grant the Recovery Services vault access to the cache storage account. [**Learn more**](migrate-servers-to-azure-using-private-link.md#grant-access-permissions-to-the-recovery-services-vault)
   > - To replicate using ExpressRoute with private peering, create a private endpoint for the cache storage account. [**Learn more**](migrate-servers-to-azure-using-private-link.md#create-a-private-endpoint-for-the-storage-account-1)
   
    - **Azure Hybrid Benefit**: Apply Azure Hybrid Benefit and save up to 76% vs. pay-as-you-go costs by using an eligible Windows Server and/or Enterprise Linux license. Check the boxes applicable to your license (Windows Server license or Enterprise Linux license).
    - **Virtual network**: Select the Azure virtual network and subnet that the Azure VMs join after migration.
    - **Availability options**: Select one of the following options:
          - **Availability Zone** – Pins the migrated machine to a specific Availability Zone in the region. Use this option to distribute machines that are part of a multinode application tier across Availability Zones. If you select this option, specify the Availability Zone for each selected machine on the
            **Compute** tab. This option is available only if the selected target region supports Availability Zones.
          - **Availability Set** – Places the migrated machine in an Availability Set. The selected target resource group must contain one or more availability sets.
          - **No infrastructure redundancy required**– Select this option if you don't require Availability Zones or Availability Sets for the migrated machines.
        
   -  In **Security Details**,
         - If the selected target security type is **Standard or Trusted Launch virtual machines**:
            - **Secure boot** is enabled by default (recommended). You can choose to remove this option. Then, proceed to **Disk encryption type** selection.
         - If the selected target security type is **Confidential virtual machines**:
            - You can optionally choose to confidentially encrypt the OS disks. This encryption provides an additional layer of encryption that binds the disk encryption keys to the
              virtual machine's TPM and makes the disk content accessible only to the VM.
            - To enable this encryption, select the **Confidential compute encryption** option and proceed to **OS disk encryption type** selection. Otherwise, proceed to **Disk
              encryption type** selection.
            - Under **OS disk encryption type**, select one of the following options:
               - Encryption at rest with platform-managed key (default, if you didn't select **Confidential compute encryption**)
               - Confidential encryption with platform-managed key (available, if you selected **Confidential compute encryption**)
               - Confidential encryption with customer-managed key (available, if you selected **Confidential compute encryption**)
                  > [!NOTE]
                  > - Secure Boot is enabled by default on target VMs when Confidential OS disk encryption is selected.
                  > - Only customer-managed key (CMK) are supported for confidential OS disk encryption for disks larger than 127 GB. For disks smaller than 127 GB, both platform-managed key (PMK) and customer-managed key (CMK) are supported.
                  > - Confidential OS disk encryption can lengthen the standard initial VM creation time during migration due to the encryption process.
                  > - Data disks currently don't support confidential encryption. However, you can secure them by using host-based encryption with customer-managed keys (CMK) or platform-managed keys (PMK).
	   
         - **Disk encryption type**, select:
              - Encryption-at-rest with platform-managed key
              - Encryption-at-rest with customer-managed key
              - Double encryption with platform-managed and customer-managed keys   
         
   > [!NOTE]
   > - To replicate VMs with customer-managed keys (CMK), [create a disk encryption set](/azure/virtual-machines/disks-enable-customer-managed-keys-portal#set-up-your-disk-encryption-set) under the target resource group. A disk encryption set object maps managed disks to a Key Vault that contains the
     CMK to use for SSE.
   > - The seed disk is created in Azure during replication/staging before cutover. Encrypting it protects data right from the first write while it resides in Azure. The **Disk encryption type** setting applies to both seed disks and the managed disks after final migration.
 
      
7. In **Compute**, review the VM name, size, OS disk type, and availability configuration (if selected in the previous step). VMs must conform to [Azure requirements](migrate-support-matrix-vmware-migration.md#azure-vm-requirements).

   - **VM size**: If you're using assessment recommendations, the VM size dropdown shows the recommended size. Otherwise Azure Migrate picks a size based on the closest match in the Azure subscription. Alternatively, pick a manual size in **Azure VM size**.
   - **OS disk**: Specify the OS (boot) disk for the VM. The OS disk contains the operating system bootloader and installer.
   - **Availability Zone**: Specify the Availability Zone to use.
   - **Availability Set**: Specify the Availability Set to use.
   - **Capacity reservation**: If you already have a capacity reservation for the VM SKU in the target subscription and location, specify it here for this deployment. Capacity reservations ensure that the required VM SKU is available when you start migration. You can associate a reservation now or skip this step
     and configure it later during the migration. The capacity reservation for the SKU can be in any resource group within the target subscription and location. [Learn more](/azure/virtual-machines/capacity-reservation-create).

8. In **Disks**, specify whether the VM disks should be replicated to Azure, and select the disk type (Premium v2, Ultra Disk, Standard SSD, Standard HDD, or Premium Managed disks) in Azure. Then select **Next**.
    - You can exclude disks from replication.
    - If you exclude disks, they won't be present on the Azure VM after migration.
    - You can exclude disks if the mobility agent is already installed on that server. [Learn more](../site-recovery/exclude-disks-replication.md#exclude-limitations).

9. In **Tags**, choose to add tags to your Virtual machines, Disks, and NICs.

10. In **Review and start execution**, review the settings, and select **Execute migration** to start the initial replication for the servers.
11. When you select **Execute migration**, you start replication for the selected servers. Replication proceeds as follows:
    - When the start replication job finishes successfully, the server begins initial replication to Azure.
    - During initial replication, a VM snapshot is created. Disk data from the snapshot is replicated to replica managed disks (seed disks) in Azure.
    -  After initial replication finishes, delta replication begins. The process periodically replicates incremental changes to the source disks to the replica disks in Azure and the server is ready for migration in delta replication. 
   
## Track and migrate replicating servers

This section explains how to track replicating servers and perform test and final migrations.

1. In your Azure Migrate project, go to **Manage** > **Server replication**. Navigate to **Other**.
2. The following columns show the replication and migration status of your servers for which you initiated replication:
    - **Replication status**: Displays the current state of replication for the server. Learn more about [replication states](concepts-vmware-agentless-migration.md#replication-states).
    - **Replication health**: Indicates whether replication is Healthy, Warning, or Critical.
    - **Last sync**: Shows when the latest replication data was synchronized to Azure.
    - **Test migration status**: Indicates the current or most recent test migration status for the replicating server or shows as **Pending**.
    - **Migration status**: Displays the current or most recent migration status for the replicating server or shows as **Ready to migrate** if the initial replication is completed.
3. **Test migration**:
    - For servers that complete initial replication and are in **Delta sync**, you can run a test migration to validate your workloads and applications in Azure before final migration. Use an isolated Azure virtual network to avoid impacting your production environment. Test migration doesn't interrupt ongoing delta replication, and you can run multiple test migrations as needed. After validation is complete, ensure to clean up the test migration resources.
    - For the server you want to test, select the menu on the right, and then select **Test migration**.
  
       :::image type="content" source="./media/tutorial-migrate-vmware-agent/start-test-migration.png" alt-text="Screenshot how to navigate to start test migration." lightbox="./media/tutorial-migrate-vmware-agent/start-test-migration.png":::
       
    - In **Test migration** page:
       - Choose the **Virtual network** and **Subnet**.
       - Optionally, upgrade the operating system. To perform OS upgrade, select **Upgrade available** (only supported for Windows OS, currently in preview). Learn more about [Upgrading windows OS upgrade](how-to-upgrade-windows.md). 
       - After configuring the above settings, select **Test migration**.
        
After validation is complete, select the menu on the right of the server, and then select **Clean up test migration** to remove the test VM and associated resources.

4.  **Migration**:
    - Servers that are ready for migration show as **Ready to migrate** under the column **Migration status**.
    - To perform migration for these servers, select **Migrate** in the **Server replication** page.
    - In the **Migrate** page,
       - Select the servers you want to migrate.
       - Optionally, select the Target OS if you want to upgrade the OS (only supported for Windows OS, currently in preview). Learn more about [Upgrading windows OS upgrade](how-to-upgrade-windows.md).
       - Choose to shut down virtual machines if you want to perform a planned migration with no data loss.
       - After configuring the above settings, select **Migrate**.
  
5. View the status and migration completion time for migrated servers in the **Migration status** column.
6. . **Optional replication actions**:
   The following actions are optional and needed only for specific replication or recovery scenarios. You can access them from the menu for each server.    
     - **Stop replication**: Stops replication for the server when you no longer want to replicate or migrate it.
     - **Resynchronize**: Resynchronizes the server when replication needs to be re-established to bring the replica back in sync with the source.
  
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
