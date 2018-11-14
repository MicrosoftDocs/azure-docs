---
title: Set up and test migration of on-premises VMware VMs to Azure with Azure Migrate | Microsoft Docs
description: Describes how to migrate on-premises VMware VMs to Azure, using the Azure Migrate service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: tutorial
ms.date: 11/13/2018
ms.author: raynew
ms.custom: mvc
---

# Set up and test migration of VMware VMs to Azure

The [Azure Migrate](migrate-overview.md) service discovers, assesses, and migrates on-premises workloads to Azure. 

This article describes how to set up migration of on-premises VMware VMs using the public preview of Azure Migrate services. After setting up the migration,  you can run a test migration to make sure everything's working as expected. 

> [!NOTE]
> Azure Migrate Server Migration is currently in public preview. You can use the existing GA version of Azure Migrate to discover and assess VMs for migration, but the actual migration isn't supported in the existing GA version.

In this tutorial, you:

> [!div class="checklist"]
> * Create an Azure subscription if you don't have one, and make sure it has the correct permissions.
> * Create an account on the vCenter Server so that the Azure Migrate can discover VMware VMs.
>   Create an Azure Migrate appliance if you don't have one. The appliance discovers on-premises VMs.
> * Set up the appliance for the first time, and register it with Azure Migrate.
> * Start replicating VMs. 
> * Run a test migration to make sure everything's working as expected.

## Before you start

We recommend you do the following before you start:

- Review the [new features and limitations](migrate-overview.md#azure-migrate-services-public-preview) for the public preview.
- Learn about [VMware](migrate-overview.md#vmware-architecture) migration architecture and processes.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.


## Prerequisites

- **Azure account permissions**: When you log into Azure, the Azure account needs permission to create Azure Active Directory (Azure AD) apps.
- **VMware**: The VMs that you plan to migrate must be managed by vCenter Server running version 5.5, 6.0, or 6.5. Additionally, you need one ESXi host running version 5.0 or higher to deploy the Azure Migrate appliance.
- **vCenter Server account**: You need a read-only account to access the vCenter Server. Azure Migrate uses this account to discover the on-premises VMs.
- **Permissions**: On the vCenter Server, you need permissions to create a VM by importing a file in .OVA format.
- **Appliance connectivity**: The Azure Migrate appliance that you deploy on a VMware VM needs internet access to connect to Azure.

## Set up Azure permissions

Either a tenant/global admin can assign permissions to create Azure AD apps to the account, or assign the Application Developer role (that has the permissions) to the account.

### Grant account permissions

The tenant/global admin can grant permissions as follows:

1. In Azure AD, the tenant/global admin should navigate to **Azure Active Directory** > **Users** > **User Settings**.
2. The admin should set **App registrations** to **Yes**.

    ![Azure AD permissions](./media/tutorial-set-up-migration-vmware/aad.png)

> [!NOTE]
> This is a default setting that isn't sensitive. [Learn more](https://docs.microsoft.com/azure/active-directory/develop/active-directory-how-applications-are-added#who-has-permission-to-add-applications-to-my-azure-ad-instance).



### Assign Application Developer role 

The tenant/global admin has permissions to assign the role to the account. [Learn more](https://docs.microsoft.comazure/active-directory/fundamentals/active-directory-users-assign-role-azure-portal).



## Set up a vCenter Server account

Azure Migrate needs access the vCenter Server to discover VMs for assessment. Before you deploy Azure Migrate, prepare a VMware account with the following permissions.

**Permission** | **Details**
--- | ---
Datastore.Browse | Find the log files from the VM folder.
Datastore.LowLevelFileOperations | Download log files for troubleshooting.
VirtualMachine.Configuration.DiskChangeTracking | Set disk change tracking on the VM disk
VirtualMachine.Configuration.DiskLease | Access VM disk data
VirtualMachine.Provisioning.AllowReadOnlyDiskAccess | Read replication data
VirtualMachine.SnapshotManagement.* | Create and manage VM snapshots.
VirtualMachine.Provisioning.AllowVirtualMachineDownload | Allow read operations on the VM disks.


## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com).

# Open Azure Migrate

1. In the Azure portal, click **All services**.
2. Search for **Azure Migrate**, and select **Azure Migrate - PREVIEW**  in the search results. This opens the Azure Migrate dashboard.

## Set up the appliance VM

Deploy the Azure Migrate appliance as a VMware VM:

- The appliance discovers on-premises VMware VMs, and sends VM metadata and performance data to Azure Migrate.
- To set up the appliance, you download an OVA template file, and import it to vCenter Server to create a VM.
- 


### Download the OVA template

1. In the Azure Migrate dashboard, click **Discover a new site** > **Discover & Assess** > **Discover Machines**.
2. In **Discover machines** > **Are your machines virtualized?**, click **Yes, with VMWare vSphere hypervisor**.
3. Click **Download** to download the .OVA template file.

    ![Download .ova file](./media/tutorial-set-up-migration-vmware/download-appliance.png)


### Verify OVA security

Check that the OVA file is secure, before you deploy it.

1. On the machine to which you downloaded the file, open an administrator command window.
2. Run the following command to generate the hash for the OVA:
    - ```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
    - Example usage: ```C:\>CertUtil -HashFile C:\AzureMigrate\AzureMigrate.ova SHA256```
3. The generated hash should match these settings.


  For OVA version 1.0.9.14

  **Algorithm** | **Hash value**
  --- | ---
  MD5 | C78457689822921B783467586AFB22B3
  SHA1 | F1338F9D9818DB61C88F8BDA1A8B5DF34B8C562D
  SHA256 | 0BE66C936BBDF856CF0CDD705719897075C0CEA5BE3F3B6F65E85D22B6F685BE

  
### Create the appliance VM

Import the downloaded OVA file to vCenter Server, and create a VM from it.

1. In the vSphere Client console, click **File** > **Deploy OVF Template**.

    ![Deploy OVF](./media/tutorial-set-up-migration-vmware/deploy-ovf.png)

2. In the Deploy OVF Template Wizard > **Source**, specify the location of the OVA file.
3. In **Name** and **Location**, specify a friendly name for the VM, and the inventory object in which the VM
will be hosted.
5. In **Host/Cluster**, specify the host or cluster on which the VM will run.
6. In **Storage**, specify the storage destination for the VM.
7. In **Disk Format**, specify the disk type and size.
8. In **Network Mapping**, specify the network to which the  VM will connect. The network needs internet connectivity, to send metadata to Azure.
9. Review and confirm the settings, then click **Finish**.


### Verify internet connectivity

The appliance VM needs internet connectivity to Azure. If you're using a URL-based proxy to control outbound connectivity, make sure these URLs are allowed.

**URL** | **Requirement**
--- | ---
*.portal.azure.com | Reach the Azure portal.
*.windows.net<br/><br/> *microsoftonline.com | Log into Azure.<br/><br/>  Create Azure AD app and Service Principal objects for agent to service communications.
management.azure.com | Communicate with Azure Resource Manager to set up Azure Migrate artifacts.
dc.services.visualstudio.com | Upload app logs for internal monitoring.
*.vault.azure.net | Communication between agent and service (persistent secrets).
*.servicebus.windows.net | Communication between the appliance and Azure Migrate.
*.discoverysrv.windowsazure.com<br/><br/> *.migration.windowsazure.com/<br/><br/> *.hypervrecoverymanager.windowsazure.com | Azure Migrate Service URLs.
*.blob.core.windows.net | Upload data to storage accounts

## Set up the appliance

Set up the appliance for the first time, and register it with Azure Migrate.

1. Open a Virtual Machine Console in the vSphere Web Client, and connect to the VM. 
2. Provide the language, time zone, and password preferences for the appliance.
3. When the Windows login screen appears, log into the appliance using the password you specified for it.
4. [Download](https://code.vmware.com/web/sdk/67/vddk) VMware VDDK for vSphere version 6.7.0 EP1. You need a VMware account to download.
5. Place the downloaded file on the appliance VM desktop.
6. Copy the PowerShell script to install the VDDK (TBD) to the appliance desktop.
7. Run the script in PowerShell, and provide the full path of the downloaded VDDK package as input. This extracts the package contents and sets environment variables that Azure Migrate needs to find the VDDK binaries. These are needed for replication to work as expected.

    > [!NOTE]
    > For example, if both the package and script are on the desktop, you run the script as follows:

    ![Install script](./media/tutorial-set-up-migration-vmware/vddk-install.png)

8. Close the console connection to the appliance.
9. Log into the appliance from a browser with **https://*appliance name or IP address*:44368**, using the appliance password.

    ![Appliance wizard](./media/tutorial-set-up-migration-vmware/appliance-wizard.png)

10. In **Set up prerequisites**, do the following:
    - **License**: Accept the license terms, and read the third-party information.
    - **Connectivity**: The app checks that the VM has internet access. If the VM accesses the internet via a proxy and not directly:
        - Click **Proxy settings**, and specify the proxy address and listening port, in the form http://ProxyIPAddress or http://ProxyFQDN.
        - Specify credentials if the proxy needs authentication.
        - Only HTTP proxy is supported.
        - The collector checks that the collector service is running. The service is installed by default on the collector VM.
    - **Time sync**: The time on the appliance should be in sync with internet time for discovery to function correctly.

### Register the appliance with Azure Migrate

1. Click **Log In**.
2. On the new tab, log in using the Azure credentials with the required permissions. 
3. After a successful logon, go back to the web app.
4. Select the subscription, resource group, and region in which you want to store the list of discovered VMs, and the VM metadata.
5. Select a site name. A site gathers together a group of discovered VMs.


## Prepare VMs for migration

Before beginning the migration process, there are a number of steps needed to prepare VMs for migration. Before making changes, we recommend you take a backup or snapshot of each VM.

### Prepare Windows machines
 
1. Configure the SAN policy of the VM. This ensures that the Windows volumes on the migrated Azure VMs receive the same driver letter as the on-premises machine. To do this:

    - Log into the VM with an admin account and open a command prompt. Type **diskpart**.
    - Type **SAN POLICY=OnlineAll**.
    - Type **Exit** to exit Diskpart and close the command prompt.

2. Enable Azure serial console for the VM. [Learn more](https://docs.microsoft.com/azure/virtual-machines/windows/serial-console#enable-serial-console-in-custom-or-older-images). You don't need to reboot the VM after you do this. The Azure VM created after migrate boots using the disk image which is equivalent to a restart.
3. If the VM operating system is Windows Server 2003, ensure that the Hyper-V Guest Integration Components are installed on the VM.
4. Make sure remote desktop is enabled. Ensure that Windows Firewall allows remote desktop access on all network profiles.


### Prepare Linux machines

1. Install Hyper-V Linux Integration Services. Newer versions of Linux distributions might have this installed by default).
2. Rebuild the Linux init image so that it contains necessary Hyper-V drivers, and so that the VM will boot in Azure (required for some distributions).
3. Enable serial console logging for troubleshooting. [Learn more]https://docs.microsoft.com/azure/virtual-machines/linux/serial-console)
4. Update the device map file with device name to volume associations, to use persistent device identifiers.
5. Update fstab entries to use persistent volume identifiers.
6. Remove any udev rules that reserve interface names based on MAC address etc.
7. Update network interfaces to receive DHCP IP addresses.
8. Ensure ssh is enabled. Check that sshd service is set to start automatically on reboot.
9. Ensure that incoming ssh connection requests aren't blocked by the operating system firewall, or IP table rules.

Get a [sample script] for preparing Linux machines. the script might not work for all distributions and environments, but it's a useful reference.
[Learn more](https://docs.microsoft.com/azure/virtual-machines/linux/serial-console) about making these changes on the most popular Linux distributions.


## Discover VMs


1. In **Specify vCenter Server details**, do the following:
    - Specify the name (FQDN) or IP address of the the vCenter Server. You can leave the default port, or specify a custom port on which your vCenter Server listens.
    - In **User name** and **Password**, specify the read-only account credentials that the appliance will use to discover VMs on the vCenter server.
    - In **Collection scope**, select a scope for VM discovery. The collector discovers VMs within the specified scope. Scope can be set to a specific folder, datacenter, or cluster.
2. Click **Validate connection** to make sure that the appliance can connect to vCenter Server.
3. After the connection is established, click **Save** > **Start discovery**.

It takes around 15 minutes for metadata of discovered VMs to appear in the portal. 


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


## Start migration

1. In the Azure Migrate dashboard > **Server Migration** > **Migrating machines**, right-click the VM > **Migrate**.
2. Select the latest snapshot > **OK**.
3. This starts a migration job for the VM. You can track the job on the dashboard > **Server Migration** > **Migration Jobs**.
4. After the job finishes the Azure VM appears in the portal, and you can manage it from the **Virtual Machines** page.
5. To finish the migration, right-click the VM in **Migrating Machines** > **Complete migration**. This stops replication for the on-premises machine, and cleans up replication information for the VM.



## Next steps

- [Learn](concepts-assessment-calculation.md) how assessments are calculated.
- [Learn](how-to-modify-assessment.md) how to customize an assessment.
- Learn how to increase the reliability of assessments using [machine dependency mapping](how-to-create-group-machine-dependencies.md)
