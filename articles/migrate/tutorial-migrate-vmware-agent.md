---
title: Migrate VMware vSphere VMs with agent-based the Migration and modernization tool
description: Learn how to run an agent-based migration of VMware vSphere VMs with Azure Migrate.
author: vijain
ms.author: vijain
ms.manager: kmadnani
ms.topic: tutorial
ms.service: azure-migrate
ms.date: 05/22/2023
ms.custom: MVC, engagement-fy23
---

# Migrate VMware vSphere VMs to Azure (agent-based)

This article shows you how to migrate on-premises VMware vSphere VMs to Azure, using the [Migration and modernization](migrate-services-overview.md#migration-and-modernization-tool) tool, with agent-based migration.  You can also migrate VMware vSphere VMs using agentless migration. [Compare](server-migrate-overview.md#compare-migration-methods) the methods.

 In this tutorial, you learn how to:
> [!div class="checklist"]
> * Prepare Azure to work with Azure Migrate.
> * Prepare for agent-based migration. Set up a VMware vCenter Server account so that Azure Migrate can discover machines for migration. Set up an account so that the Mobility service agent can install on machines you want to migrate, and prepare a machine to act as the replication appliance.
> * Add the Migration and modernization tool
> * Set up the replication appliance.
> * Replicate VMs.
> * Run a test migration to make sure everything's working as expected.
> * Run a full migration to Azure.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof-of-concept. Tutorials use default options where possible, and don't show all possible settings and paths.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.


## Prerequisites

Before you begin this tutorial, [review](./agent-based-migration-architecture.md) the VMware vSphere agent-based migration architecture.

## Prepare Azure

Complete the tasks in the table to prepare Azure for agent-based migration.

**Task** | **Details**
--- | ---
**Create an Azure Migrate project** | Your Azure account needs Contributor or Owner permissions to create a project.
**Verify Azure account permissions** | Your Azure account needs permissions to create a VM, and write to an Azure managed disk.
**Set up an Azure network** | Set up a network that Azure VMs will join after migration.

### Assign permissions to create project
If you don't have an Azure Migrate project, verify permissions to create one.


1. In the Azure portal, open the subscription, and select **Access control (IAM)**.
2. In **Check access**, find the relevant account, and select it to view permissions.
3. Verify that you have **Contributor** or **Owner** permissions.

    - If you just created a free Azure account, you're the owner of your subscription.
    - If you're not the subscription owner, work with the owner to assign the role.

### Assign Azure account permissions

Assign the Virtual Machine Contributor role to the account, so that you have permissions to:

- Create a VM in the selected resource group.
- Create a VM in the selected virtual network.
- Write to an Azure managed disk.


<a name='assign-permissions-to-register-the-replication-appliance-in-azure-ad'></a>

### Assign permissions to register the Replication Appliance in Microsoft Entra ID

If you are following the least privilege principle, assign the **Application Developer** Microsoft Entra role to the user registering the Replication Appliance. Follow the [Assign administrator and non-administrator roles to users with Microsoft Entra ID](../active-directory/fundamentals/active-directory-users-assign-role-azure-portal.md) guide to do so.

> [!IMPORTANT]
> If the user registering the Replication Appliance is a Microsoft Entra Global Administrator, that user already has the required permissions.

### Set up an Azure network

[Set up an Azure network](../virtual-network/manage-virtual-network.md#create-a-virtual-network). On-premises machines are replicated to Azure managed disks. When you fail over to Azure for migration, Azure VMs are created from these managed disks, and joined to the Azure network you set up.

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

The appliance is used to replication machines to Azure. The appliance is single, highly available, on-premises VMware vSphere VM that hosts these components:

- **Configuration server**: The configuration server coordinates communications between on-premises and Azure, and manages data replication.
- **Process server**: The process server acts as a replication gateway. It receives replication data; optimizes it with caching, compression, and encryption, and sends it to a cache storage account in Azure. The process server also installs the Mobility Service agent on VMs you want to replicate, and performs automatic discovery of on-premises VMware VMs.

Prepare for the appliance as follows:

- [Review appliance requirements](migrate-replication-appliance.md#appliance-requirements). Generally, you set up the replication appliance a VMware vSphere VM using a downloaded OVA file. The template creates an appliance that complies with all requirements.
- MySQL must be installed on the appliance. [Review](migrate-replication-appliance.md#mysql-installation) installation methods.
- Review the [public cloud URLs](migrate-replication-appliance.md#url-access), and [Azure Government URLs](migrate-replication-appliance.md#azure-government-url-access) that the appliance machine needs to access.
- [Review the ports](migrate-replication-appliance.md#port-access) that the replication appliance machine needs to access.



### Check VMware vSphere requirements

Make sure VMware vSphere VMs comply with requirements for migration to Azure.

1. [Verify](migrate-support-matrix-vmware-migration.md#vmware-vsphere-requirements-agent-based) VMware vSphere VM requirements.
2. [Verify](migrate-support-matrix-vmware-migration.md#vm-requirements-agent-based) VM requirements for migration.
3. Verify Azure settings. On-premises VMs you replicate to Azure must comply with [Azure VM requirements](migrate-support-matrix-vmware-migration.md#azure-vm-requirements).
4. There are some changes needed on VMs before you migrate them to Azure.
    - It's important to make these changes before you begin migration. If you migrate the VM before you make the change, the VM might not boot up in Azure.
    - Review [Windows](prepare-for-migration.md#windows-machines) and [Linux](prepare-for-migration.md#linux-machines) changes you need to make.

> [!NOTE]
> Agent-based migration with the Migration and modernization tool is based on features of the Azure Site Recovery service. Some requirements might link to Site Recovery documentation.

## Set up the replication appliance

This procedure describes how to set up the appliance with a downloaded Open Virtualization Application (OVA) template. If you can't use this method, you can set up the appliance [using a script](tutorial-migrate-physical-virtual-machines.md#set-up-the-replication-appliance).

### Download the replication appliance template

Download the template as follows:

1. In the Azure Migrate project, select **Servers, databases and web apps** under **Migration goals**.
2. In **Servers, databases and web apps** > **Migration and modernization**, click **Discover**.

    ![Discover VMs](./media/tutorial-migrate-vmware-agent/migrate-discover.png)

3. In **Discover machines** > **Are your machines virtualized?**, click **Yes, with VMware vSphere hypervisor**.
4. In **How do you want to migrate?**, select **Using agent-based replication**.
5. In **Target region**, select the Azure region to which you want to migrate the machines.
6. Select **Confirm that the target region for migration is region-name**.
7. Click **Create resources**. This creates an Azure Site Recovery vault in the background. You can't change the target region for this project after clicking this button, and all subsequent migrations are to this region.

    ![Create Recovery Services vault](./media/tutorial-migrate-vmware-agent/create-resources.png)  

    > [!NOTE]
    > If you selected private endpoint as the connectivity method for the Azure Migrate project when it was created, the Recovery Services vault will also be configured for private endpoint connectivity. Ensure that the private endpoints are reachable from the replication appliance: [**Learn more**](troubleshoot-network-connectivity.md)


8. In **Do you want to install a new replication appliance?**, select **Install a replication appliance**.
9. Click **Download**. This downloads an OVF template.
    ![Download OVA](./media/tutorial-migrate-vmware-agent/download-ova.png)
10. Note the name of the resource group and the Recovery Services vault. You need these during appliance deployment.


### Import the template into VMware vSphere

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

### Start appliance setup

1. In the VMware vSphere Client console, turn on the VM. The VM boots up into a Windows Server 2016 installation experience.
2. Accept the license agreement, and enter an administrator password.
3. After the installation finishes, sign in to the VM as the administrator, using the admin password. The first time you sign in, the replication appliance setup tool (Azure Site Recovery Configuration Tool) starts within a few seconds.
5. Enter a name to use for registering the appliance with the Migration and modernization tool. Select **Next**.
6. The tool checks that the VM can connect to Azure. After the connection is established, select **Sign in** to sign in to your Azure subscription.
7. Wait for the tool to finish registering a Microsoft Entra app to identify the appliance. The appliance reboots.
1. Sign in to the machine again. In a few seconds, the Configuration Server Management Wizard starts automatically.

### Register the replication appliance

Finish setting up and registering the replication appliance.

1. In appliance setup, select **Setup connectivity**.
2. Select the NIC (by default there's only one NIC) that the replication appliance uses for VM discovery, and to do a push installation of the Mobility service on source machines.
3. Select the NIC that the replication appliance uses for connectivity with Azure. Then select **Save**. You cannot change this setting after it's configured.

   > [!TIP]
   > If for some reason you need to change the NIC selection and you have not clicked the **Finalize configuration** button in step 12, you can do so by clearing your browser cookies and restarting the **Configuration Server Management Wizard**.
  
4. If the appliance is located behind a proxy server, you need to specify proxy settings.
    - Specify the proxy name as **http://ip-address**, or **http://FQDN**. HTTPS proxy servers aren't supported.
5. When prompted for the subscription, resource groups, and vault details, add the details that you noted when you downloaded the appliance template.
6. In **Install third-party software**, accept the license agreement. Select **Download and Install** to install MySQL Server.
7. Select **Install VMware PowerCLI**. Make sure all browser windows are closed before you do this. Then select **Continue**.
   
   > [!NOTE]
   > In newer versions of the Replication Appliance the **VMware PowerCLI** installation is not required.
   
8. In **Validate appliance configuration**, prerequisites are verified before you continue.
9. In **Configure vCenter Server/vSphere ESXi server**, enter the FQDN or IP address of the vCenter server, or vSphere host, where the VMs you want to replicate are located. Enter the port on which the server is listening. Enter a friendly name to be used for the VMware server in the vault.
10. Enter the credentials for the account you [created](#prepare-an-account-to-discover-vms) for VMware discovery. Select **Add** > **Continue**.
11. In **Configure virtual machine credentials**, enter the credentials you [created](#prepare-an-account-for-mobility-service-installation) for push installation of the Mobility service, when you enable replication for VMs.  
    - For Windows machines, the account needs local administrator privileges on the machines you want to replicate.
    - For Linux, provide details for the root account.
12. Select **Finalize configuration** to complete registration.


After the replication appliance is registered, Azure Migrate Server Assessment connects to VMware servers using the specified settings, and discovers VMs. You can view discovered VMs in **Manage** > **Discovered items**, in the **Other** tab.



## Replicate VMs

Select VMs for migration.

> [!NOTE]
> In the portal you can select up to 10 machines at once for replication. If you need to replicate more, then group them in batches of 10.

1. In the Azure Migrate project > **Servers, databases and web apps** > **Migration and modernization**, click **Replicate**.

    :::image type="content" source="./media/tutorial-migrate-vmware-agent/select-replicate.png" alt-text="Screenshot  of the Servers screen in Azure Migrate. The Replicate button is selected in the Migration and modernization tool under Migration tools.":::

2. In **Replicate**, > **Source settings** > **Are your machines virtualized?**, select **Yes, with VMware vSphere**.
3. In **On-premises appliance**, select the name of the Azure Migrate appliance that you set up.
4. In **vCenter server**, specify the name of the vCenter server managing the VMs, or the vSphere server on which the VMs are hosted.
5. In **Process Server**, select the name of the replication appliance.
6. In **Guest credentials**, specify the VM admin account that will be used for push installation of the Mobility service. Then click **Next: Virtual machines**.

    :::image type="content" source="./media/tutorial-migrate-vmware-agent/source-settings.png" alt-text="Screenshot of the Source settings tab in the Replicate screen. The Guest credentials field is highlighted and the value is set to VM-admin-account.":::

7. In **Virtual Machines**, select the machines that you want to replicate.

    - If you've run an assessment for the VMs, you can apply VM sizing and disk type (premium/standard) recommendations from the assessment results. To do this, in **Import migration settings from an Azure Migrate assessment?**, select the **Yes** option.
    - If you didn't run an assessment, or you don't want to use the assessment settings, select the **No** options.
    - If you selected to use the assessment, select the VM group, and assessment name.
8. In **Availability options**, select:
    -  Availability Zone to pin the migrated machine to a specific Availability Zone in the region. Use this option to distribute servers that form a multi-node application tier across Availability Zones. If you select this option, you'll need to specify the Availability Zone to use for each of the selected machine in the Compute tab. This option is only available if the target region selected for the migration supports Availability Zones
    -  Availability Set to place the migrated machine in an Availability Set. The target Resource Group that was selected must have one or more availability sets in order to use this option.
    - No infrastructure redundancy required option if you don't need either of these availability configurations for the migrated machines.
9. Check each VM you want to migrate. Then click **Next: Target settings**.

    :::image type="content" source="./media/tutorial-migrate-vmware-agent/select-vms-inline.png" alt-text="Screenshot on selecting VMs." lightbox="./media/tutorial-migrate-vmware-agent/select-vms-expanded.png":::

10. In **Target settings**, select the subscription, and target region to which you'll migrate, and specify the resource group in which the Azure VMs will reside after migration.
11. In **Virtual Network**, select the Azure VNet/subnet to which the Azure VMs will be joined after migration.  
12. In  **Cache storage account**, keep the default option to use the cache storage account that is automatically created for the project. Use the dropdown if you'd like to specify a different storage account to use as the cache storage account for replication. <br/>
    > [!NOTE]
    >
    > - If you selected private endpoint as the connectivity method for the Azure Migrate project, grant the Recovery Services vault access to the cache storage account. [**Learn more**](migrate-servers-to-azure-using-private-link.md#grant-access-permissions-to-the-recovery-services-vault)
    > - To replicate using ExpressRoute with private peering, create a private endpoint for the cache storage account. [**Learn more**](migrate-servers-to-azure-using-private-link.md#create-a-private-endpoint-for-the-storage-account-1)
13. In **Availability options**, select:
    -  Availability Zone to pin the migrated machine to a specific Availability Zone in the region. Use this option to distribute servers that form a multi-node application tier across Availability Zones. If you select this option, you'll need to specify the Availability Zone to use for each of the selected machine in the Compute tab. This option is only available if the target region selected for the migration supports Availability Zones
    -  Availability Set to place the migrated machine in an Availability Set. The target Resource Group that was selected must have one or more availability sets in order to use this option.
    - No infrastructure redundancy required option if you don't need either of these availability configurations for the migrated machines.
14. In **Disk encryption type**, select:
    - Encryption-at-rest with platform-managed key
    - Encryption-at-rest with customer-managed key
    - Double encryption with platform-managed and customer-managed keys

   > [!NOTE]
   > To replicate VMs with CMK, you'll need to [create a disk encryption set](../virtual-machines/disks-enable-customer-managed-keys-portal.md#set-up-your-disk-encryption-set) under the target Resource Group. A disk encryption set object maps Managed Disks to a Key Vault that contains the CMK to use for SSE.

15. In **Azure Hybrid Benefit**:

    - Select **No** if you don't want to apply Azure Hybrid Benefit. Then click **Next**.
    - Select **Yes** if you have Windows Server machines that are covered with active Software Assurance or Windows Server subscriptions, and you want to apply the benefit to the machines you're migrating. Then click **Next**.

        :::image type="content" source="./media/tutorial-migrate-vmware/target-settings.png" alt-text="Screenshot on target settings.":::

16. In **Compute**, review the VM name, size, OS disk type, and availability configuration (if selected in the previous step). VMs must conform with [Azure requirements](migrate-support-matrix-vmware-migration.md#azure-vm-requirements).

   - **VM size**: If you're using assessment recommendations, the VM size dropdown shows the recommended size. Otherwise Azure Migrate picks a size based on the closest match in the Azure subscription. Alternatively, pick a manual size in **Azure VM size**.
   - **OS disk**: Specify the OS (boot) disk for the VM. The OS disk is the disk that has the operating system bootloader and installer.
   - **Availability Zone**: Specify the Availability Zone to use.
   - **Availability Set**: Specify the Availability Set to use.

17. In **Disks**, specify whether the VM disks should be replicated to Azure, and select the disk type (standard SSD/HDD or premium managed disks) in Azure. Then click **Next**.
    - You can exclude disks from replication.
    - If you exclude disks, they won't be present on the Azure VM after migration.

    :::image type="content" source="./media/tutorial-migrate-vmware-agent/disks-inline.png" alt-text="Screenshot shows the Disks tab of the Replicate dialog box." lightbox="./media/tutorial-migrate-vmware-agent/disks-expanded.png":::
    - You can exclude disks if the mobility agent is already installed on that server. [Learn more](../site-recovery/exclude-disks-replication.md#exclude-limitations).

18. In **Tags**, choose to add tags to your Virtual machines, Disks, and NICs.

    :::image type="content" source="./media/tutorial-migrate-vmware/tags-inline.png" alt-text="Screenshot shows the tags tab of the Replicate dialog box." lightbox="./media/tutorial-migrate-vmware/tags-expanded.png":::

19. In **Review and start replication**, review the settings, and click **Replicate** to start the initial replication for the servers.

> [!NOTE]
> You can update replication settings any time before replication starts, **Manage** > **Replicating machines**. Settings can't be changed after replication starts.


## Track and monitor

1. Track job status in the portal notifications.

    ![Track job](./media/tutorial-migrate-vmware-agent/jobs.png)

2. To monitor replication status, click **Replicating servers** in **Migration and modernization**.

    ![Monitor replication](./media/tutorial-migrate-vmware-agent/replicate-servers.png)

Replication occurs as follows:
- When the Start Replication job finishes successfully, the machines begin their initial replication to Azure.
- After initial replication finishes, delta replication begins. Incremental changes to on-premises disks are periodically replicated to the replica disks in Azure.


## Run a test migration


When delta replication begins, you can run a test migration for the VMs, before running a full migration to Azure. We highly recommend that you do this at least once for each machine, before you migrate it.

- Running a test migration checks that migration will work as expected, without impacting the on-premises machines, which remain operational, and continue replicating.
- Test migration simulates the migration by creating an Azure VM using replicated data (usually migrating to a non-production VNet in your Azure subscription).
- You can use the replicated test Azure VM to validate the migration, perform app testing, and address any issues before full migration.

Do a test migration as follows:


1. In **Migration goals** > **Servers** > **Migration and modernization**, select **Test migrated servers**.

     :::image type="content" source="./media/tutorial-migrate-vmware-agent/test-migrated-servers.png" alt-text="Screenshot of Test migrated servers.":::

2. Right-click the VM to test, and click **Test migrate**.

    :::image type="content" source="./media/tutorial-migrate-vmware-agent/test-migrate-inline.png" alt-text="Screenshot of Test migration." lightbox="./media/tutorial-migrate-vmware-agent/test-migrate-expanded.png":::

3. In **Test Migration**, select the Azure VNet in which the Azure VM will be located after the migration. We recommend you use a non-production VNet.
4. The **Test migration** job starts. Monitor the job in the portal notifications.
5. After the migration finishes, view the migrated Azure VM in **Virtual Machines** in the Azure portal. The machine name has a suffix **-Test**.
6. After the test is done, right-click the Azure VM in **Replicating machines**, and click **Clean up test migration**.

    :::image type="content" source="./media/tutorial-migrate-vmware-agent/clean-up-inline.png" alt-text="Screenshot of Clean up migration." lightbox="./media/tutorial-migrate-vmware-agent/clean-up-expanded.png":::

    > [!NOTE]
    > You can now register your servers running SQL server with SQL VM RP to take advantage of automated patching, automated backup and simplified license management using SQL IaaS Agent Extension.
    >- Select **Manage** > **Replicating servers** > **Machine containing SQL server** > **Compute and Network** and select **yes** to register with SQL VM RP.
    >- Select Azure Hybrid benefit for SQL Server if you have SQL Server instances that are covered with active Software Assurance or SQL Server subscriptions and you want to apply the benefit to the machines you're migrating.hs.

## Migrate VMs

After you've verified that the test migration works as expected, you can migrate the on-premises machines.

1. In the Azure Migrate project > **Servers, databases and web apps** > **Migration and modernization**, select **Replicating servers**.

    ![Replicating servers](./media/tutorial-migrate-vmware-agent/replicate-servers.png)

2. In **Replicating machines**, right-click the VM > **Migrate**.
3. In **Migrate** > **Shut down virtual machines and perform a planned migration with no data loss**, select **Yes** > **OK**.
    - By default Azure Migrate shuts down the on-premises VM to ensure minimum data loss.
    - If you don't want to shut down the VM, select **No**
4. A migration job starts for the VM. Track the job in Azure notifications.
5. After the job finishes, you can view and manage the VM from the **Virtual Machines** page.

## Complete the migration

1. After the migration is done, right-click the VM > **Stop replication**. This does the following:
    - Stops replication for the on-premises machine.
    - Removes the machine from the **Replicating servers** count in the Migration and modernization tool.
    - Cleans up replication state information for the VM.
1. Verify and [troubleshoot any Windows activation issues on the Azure VM.](/troubleshoot/azure/virtual-machines/troubleshoot-activation-problems)
1. Perform any post-migration app tweaks, such as host names, updating database connection strings, and web server configurations.
1. Perform final application and migration acceptance testing on the migrated application now running in Azure.
1. Cut over traffic to the migrated Azure VM instance.
1. Remove the on-premises VMs from your local VM inventory.
1. Remove the on-premises VMs from local backups.
1. Update any internal documentation to show the new location and IP address of the Azure VMs.

## Post-migration best practices

- On-premises
    - Move app traffic over to the app running on the migrated Azure VM instance.
    - Remove the on-premises VMs from your local VM inventory.
    - Remove the on-premises VMs from local backups.
    - Update any internal documentation to show the new location and IP address of the Azure VMs.
- Tweak Azure VM settings after migration:
    - The [Azure VM agent](../virtual-machines/extensions/agent-windows.md) manages VM interaction with the Azure Fabric Controller. It's required for some Azure services, such as Azure Backup, Site Recovery, and Azure Security. When migrating VMware VMs with agent-based migration, the Mobility Service installer installs Azure VM agent on Windows machines. On Linux VMs, we recommend that you install the agent after migration.
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
    - Restrict network traffic to management endpoints with [Network Security Groups](../virtual-network/network-security-groups-overview.md).
    - Deploy [Azure Disk Encryption](../virtual-machines/disk-encryption-overview.md) to help secure disks, and keep data safe from theft and unauthorized access.
    - Read more about [securing IaaS resources](https://azure.microsoft.com/services/virtual-machines/secure-well-managed-iaas/), and visit the [Microsoft Defender for Cloud](https://azure.microsoft.com/services/security-center/).
- For monitoring and management:
    - Consider deploying [Azure Cost Management](../cost-management-billing/cost-management-billing-overview.md) to monitor resource usage and spending.




 ## Next steps

Investigate the [cloud migration journey](/azure/architecture/cloud-adoption/getting-started/migrate) in the Azure Cloud Adoption Framework.
