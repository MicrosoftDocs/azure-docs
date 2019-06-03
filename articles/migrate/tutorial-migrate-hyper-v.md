---
title: Migrate on-premises Hyper-V VMs to Azure with Azure Migrate  | Microsoft Docs
description: This article describes how to migrate on-premises Hyper-V VMs to Azure with Azure Migrate
author: rayne-wiselman
manager: carmonm
ms.service: azure-migrate
ms.topic: tutorial
ms.date: 06/02/2019
ms.author: raynew
ms.custom: MVC
---

# Migrate Hyper-V VMs to Azure 


This article describes how to migrate on-premises Hyper-V VMs to Azure using Azure Migrate Server Migration. 

In this article you

> [!div class="checklist"]
> * Prepare Azure and your on-premises Hyper-V environment
> * Set up the source environment, including deployment of an on-premises Azure Migrate configuration server.
> * Set up the target environment for migration
> * Set up a replication policy
> * Enable replication
> * Run a test migration to make sure everything's working as expected
> * Run a a full migration to Azure


## Prepare Azure 

### Verify account permissions

If you just created your free Azure account, you're the administrator of your subscription and you have the permissions you need. If you're not the subscription administrator, work with the administrator to assign the permissions you need. To enable replication for a new virtual machine, you must have permission to:

- Create a VM in the selected resource group.
- Create a VM in the selected virtual network.
- Write to an Azure storage account.
- Write to an Azure managed disk.

To complete these tasks your account should be assigned the Virtual Machine Contributor built-in role. In addition, to manage Site Recovery operations in a vault, your account should be assigned the Site Recovery Contributor build-in role.


### Create a Recovery Services vault

1. In the Azure portal, click **+Create a resource**, and search the Marketplace for **Recovery**.
2. Click **Backup and Site Recovery (OMS)**, and in the Backup and Site Recovery page, click **Create**. 
1. In **Recovery Services vault** > **Name**, enter a friendly name to identify the vault. For this set of tutorials we're using **ContosoVMVault**.
2. In **Resource group**, select an existing resource group or create a new one. For this tutorial we're using **contosoRG**.
3. In **Location**, select the region in which the vault should be located. We're using **West Europe**.
4. To quickly access the vault from the dashboard, select **Pin to dashboard** > **Create**.

   The new vault appears on **Dashboard** > **All resources**, and on the main **Recovery Services vaults** page.

### Set up an Azure network

On-premises machines are replicated to Azure managed disks. When failover occurs,  Azure VMs are created from these managed disks, and joined to the Azure network you specify in this procedure.

1. In the [Azure portal](https://portal.azure.com), select **Create a resource** > **Networking** > **Virtual network**.
2. Keep **Resource Manager** selected as the deployment model.
3. In **Name**, enter a network name. The name must be unique within the Azure resource group. We're using **ContosoASRnet** in this tutorial.
4. Specify the resource group in which the network will be created. We're using the existing resource group **contosoRG**.
5. In **Address range**, enter the range for the network. We're using **10.1.0.0/24**, and not using a subnet.
6. In **Subscription**, select the subscription in which to create the network.
7. In **Location**, select the same region as that in which the Recovery Services vault was created. In our tutorial it's **West Europe**. The network must be in the same region as the vault.
8. We're leaving the default options of basic DDoS protection, with no service endpoint on the network.
9. Click **Create**.


The virtual network takes a few seconds to create. After it's created, you see it in the Azure portal dashboard.

## Prepare Hyper-V

### Prepare VMM (optional)

If Hyper-V hosts are managed by VMM, you need to prepare the on-premises VMM server. 

- Make sure the VMM server has a least one cloud, with one or more host groups. The Hyper-V host on which VMs are running should be located in the cloud.
- Prepare the VMM server for network mapping.

#### Prepare VMM for network mapping

If you're using VMM, network mapping maps between on-premises VMM VM networks, and Azure virtual networks. Mapping ensures that Azure VMs are connected to the right network when they're created after failover.

Prepare VMM for network mapping as follows:

1. Make sure you have a [VMM logical network](https://docs.microsoft.com/system-center/vmm/network-logical) that's associated with the cloud in which the Hyper-V hosts are located.
2. Ensure you have a [VM network](https://docs.microsoft.com/system-center/vmm/network-virtual) linked to the logical network.
3. In VMM, connect the VMs to the VM network.

### Verify internet access

1. For the purposes of the tutorial, the simplest configuration is for the Hyper-V hosts and VMM server to have direct access to the internet without using a proxy. 
2. Make sure that Hyper-V hosts, and the VMM server if relevant, can access the required URLs below.   
3. If you're controlling access by IP address, make sure that:
    - IP address-based firewall rules can connect to [Azure Datacenter IP Ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653), and the HTTPS (443) port.
    - Allow IP address ranges for the Azure region of your subscription.
    
### Required URLs

Name | Commercial URL | Government URL | Description
--- | --- | --- | ---
Azure Active Directory | ``login.microsoftonline.com`` | ``login.microsoftonline.us`` | Used for access control and identity management by using Azure Active Directory. 
Backup | ``*.backup.windowsazure.com`` | ``*.backup.windowsazure.us`` | Used for replication data transfer and coordination.
Replication | ``*.hypervrecoverymanager.windowsazure.com`` | ``*.hypervrecoverymanager.windowsazure.us``  | Used for replication management operations and coordination.
Storage | ``*.blob.core.windows.net`` | ``*.blob.core.usgovcloudapi.net``  | Used for access to the storage account that stores replicated data.
Telemetry (optional) | ``dc.services.visualstudio.com`` | ``dc.services.visualstudio.com`` | Used for telemetry.
Time synchronization | ``time.windows.com`` | ``time.nist.gov`` | Used to check time synchronization between system and global time in all deployments.



### Prepare to connect to Azure VMs after migration

During a failover scenario you may want to connect to your replicated on-premises network.

To connect to Windows VMs using RDP after failover, allow access as follows:

1. To access over the internet, enable RDP on the on-premises VM before failover. Make sure that
   TCP, and UDP rules are added for the **Public** profile, and that RDP is allowed in **Windows
   Firewall** > **Allowed Apps** for all profiles.
2. To access over site-to-site VPN, enable RDP on the on-premises machine. RDP should be allowed in
   the **Windows Firewall** -> **Allowed apps and features** for **Domain and Private** networks.
   Check that the operating system's SAN policy is set to **OnlineAll**. [Learn
   more](https://support.microsoft.com/kb/3031135). There should be no Windows updates pending on
   the VM when you trigger a failover. If there are, you won't be able to sign in to the virtual
   machine until the update completes.
3. On the Windows Azure VM after failover, check **Boot diagnostics** to view a screenshot of the
   VM. If you can't connect, check that the VM is running and review these
   [troubleshooting tips](https://social.technet.microsoft.com/wiki/contents/articles/31666.troubleshooting-remote-desktop-connection-after-failover-using-asr.aspx).



## Select a replication goal

1. In the Azure portal, go to **Recovery Services vaults** and select the vault. We prepared the vault **ContosoVMVault** in the previous tutorial.
2. In **Getting Started**, select **Site Recovery**, and then select **Prepare Infrastructure**.
3. In **Protection goal** > **Where are your machines located?**, select **On-premises**.
4. In **Where do you want to replicate your machines?**, select **To Azure**.
5. In **Are your machines virtualized?**, select **Yes, with Hyper-V**.
6. In **Are you using System Center VMM to manage your Hyper-V hosts?**, select **No**.
7. Select **OK**.

 
## Confirm deployment planning

1. In **Deployment planning**, if you're planning a large deployment, download the Deployment Planner for Hyper-V from the link on the page. 
2. For this tutorial, we don't need the Deployment Planner. In **Have you completed deployment planning?**, select **I will do it later**, and then select **OK**.



## Set up the source environment

To set up the source environment, you create a Hyper-V site and add to that site the Hyper-V hosts containing VMs that you want to replicate. Then, you download and install the Azure Site Recovery Provider and the Azure Recovery Services agent on each host, and register the Hyper-V site in the vault.

1. Under **Prepare Infrastructure**, select **Source**.
2. In **Prepare source**, select **+ Hyper-V Site**.
3. In **Create Hyper-V site**, specify the site name. We're using **ContosoHyperVSite**.
4. After the site is created, in **Prepare source** > **Step 1: Select Hyper-V site**, select the site you created.
5. Select **+ Hyper-V Server**.
6. Download the installer for the Microsoft Azure Site Recovery Provider.
7. Download the vault registration key. You need this key to install the Provider. The key is valid for five days after you generate it.


## Install the Provider

Install the downloaded setup file (AzureSiteRecoveryProvider.exe) on each Hyper-V host that you want to add to the Hyper-V site. Setup installs the Azure Site Recovery Provider and Recovery Services agent on each Hyper-V host.

1. Run the setup file.
2. In the Azure Site Recovery Provider Setup wizard > **Microsoft Update**, opt in to use Microsoft Update to check for Provider updates.
3. In **Installation**, accept the default installation location for the Provider and agent, and select **Install**.
4. After installation, in the Microsoft Azure Site Recovery Registration Wizard > **Vault Settings**, select **Browse**, and in **Key File**, select the vault key file that you downloaded.
5. Specify the Azure Site Recovery subscription, the vault name (**ContosoVMVault**), and the Hyper-V site (**ContosoHyperVSite**) to which the Hyper-V server belongs.
6. In **Proxy Settings**, select **Connect directly to Azure Site Recovery without a proxy**.
7. In **Registration**, after the server is registered in the vault, select **Finish**.

Metadata from the Hyper-V server is retrieved by Azure Site Recovery, and the server is displayed in **Site Recovery Infrastructure** > **Hyper-V Hosts**. This process can take up to 30 minutes.

### Install the Provider on a Hyper-V core server

If you're running a Hyper-V core server, download the setup file and follow these steps:

1. Extract the files from AzureSiteRecoveryProvider.exe to a local directory by running this command:

    `AzureSiteRecoveryProvider.exe /x:. /q`
 
2. Run `.\setupdr.exe /i`. Results are logged to %Programdata%\ASRLogs\DRASetupWizard.log.

3. Register the server by running this command:

    ```
    cd  C:\Program Files\Microsoft Azure Site Recovery Provider\DRConfigurator.exe" /r /Friendlyname "FriendlyName of the Server" /Credentials "path to where the credential file is saved"
    ```

## Set up the target environment

Select and verify target resources:

1. Select **Prepare infrastructure** > **Target**.
2. Select the subscription and the resource group **ContosoRG** in which the Azure VMs will be created after failover.
3. Select the **Resource Manager"** deployment model.

Site Recovery checks that you have one or more compatible Azure storage accounts and networks.

## Set up a replication policy

1. Select **Prepare infrastructure** > **Replication Settings** > **+Create and associate**.
2. In **Create and associate policy**, specify a policy name. We're using **ContosoReplicationPolicy**.
3. For this tutorial, we'll leave the default settings:
    - **Copy frequency** indicates how often delta data (after initial replication) will replicate. The default frequency is every five minutes.
    - **Recovery point retention** indicates that recovery points will be retained for two hours.
    - **App-consistent snapshot frequency** indicates that recovery points containing app-consistent snapshots will be created every hour.
    - **Initial replication start time** indicates that initial replication will start immediately.
4. After the policy is created, select **OK**. When you create a new policy, it's automatically associated with the specified Hyper-V site. In our tutorial, that's **ContosoHyperVSite**.


## Enable replication

1. In **Replicate application**, select **Source**.
2. In **Source**, select the **ContosoHyperVSite** site. Then, select **OK**.
3. In **Target**, verify the target (Azure), the vault subscription, and the **Resource Manager** deployment model.
4. If you're using tutorial settings, select the **contosovmsacct1910171607** storage account created in the previous tutorial for replicated data. Also select the **ContosoASRnet** network, in which Azure VMs will be located after failover.
5. In **Virtual machines** > **Select**, select the VM that you want to replicate. Then, select **OK**.

   You can track progress of the **Enable Protection** action in **Jobs** > **Site Recovery jobs**. After the **Finalize Protection** job finishes, the initial replication is complete, and the VM is ready for failover.


## Run a test failover


### Verify VM properties

Before you run a test failover, verify the VM properties, and make sure that the Hyper-V VM complies with Azure requirements.

1. In **Protected Items**, click **Replicated Items** > and the VM.
2. In the **Replicated item** pane, there's a summary of VM information, health status, and the
   latest available recovery points. Click **Properties** to view more details.
3. In **Compute and Network**, you can modify the Azure name, resource group, target size, availability set, and managed disk settings.
4. You can view and modify network settings, including the network/subnet in which the Azure VM
   will be located after failover, and the IP address that will be assigned to it.
5. In **Disks**, you can see information about the operating system and data disks on the VM.

### Create a network for test failover

We recommended that for test failover, you choose a network that's isolated from the production recovery site network specific in the  **Compute and Network** settings for each VM. By default, when you create an Azure virtual network, it is isolated from other networks. The test network should mimic your production network:

- The test network should have same number of subnets as your production network. Subnets should have the same names.
- The test network should use the same IP address range.
- Update the DNS of the test network with the IP address specified for the DNS VM in **Compute and Network** settings. Read [test failover considerations for Active Directory](../site-recovery/site-recovery-active-directory.md#test-failover-considerations) for more details.

### Run a test failover for a single VM

When you run a test failover, the following happens:

1. A prerequisites check runs to make sure all of the conditions required for failover are in
   place.
2. Failover processes the data, so that an Azure VM can be created. If you select the latest recovery
   point, a recovery point is created from the data.
3. An Azure VM is created using the data processed in the previous step.

Run the test failover as follows:

1. In **Settings** > **Replicated Items**, click the VM > **+Test Failover**.
2. Select the **Latest processed** recovery point for this tutorial. This fails over the VM to the latest available point in time. The time stamp is shown. With this option, no time is spent processing data, so it provides a low RTO (recovery time objective).
3. In **Test Failover**, select the target Azure network to which Azure VMs will be connected after
   failover occurs.
4. Click **OK** to begin the failover. You can track progress by clicking on the VM to open its
   properties. Or you can click the **Test Failover** job in vault name > **Settings** > **Jobs** >
   **Site Recovery jobs**.
5. After the failover finishes, the replica Azure VM appears in the Azure portal > **Virtual
   Machines**. Check that the VM is the appropriate size, that it's connected to the right network,
   and that it's running.
6. You should now be able to connect to the replicated VM in Azure.
7. To delete Azure VMs created during the test failover, click **Cleanup test failover** on the
  VM. In **Notes**, record and save any observations associated with the test failover.

In some scenarios, failover requires additional processing that takes around eight to ten minutes
to complete. You might notice longer test failover times for VMware Linux machines, VMware VMs that
don't have the DHCP service enables, and VMware VMs that don't have the following boot drivers:
storvsc, vmbus, storflt, intelide, atapi.

### Connect after failover

If you followed the [instructions for preparing to connect](#prepare-to-connect-to-azure-vms-after-migration) after migration, you should now be able to connect to Azure VMs using RDP/SSH.

## Migrate to Azure

Run a failover for the machines you want to migrate.

1. In **Settings** > **Replicated items** click the machine > **Failover**.
2. In **Failover** select a **Recovery Point** to fail over to. Select the latest recovery point.
3. The encryption key setting isn't relevant for this scenario.
4. Select **Shut down machine before beginning failover**. Site Recovery will attempt to shutdown virtual machines before triggering the failover. Failover continues even if shutdown fails. You can follow the failover progress on the **Jobs** page.
5. Check that the Azure VM appears in Azure as expected.
6. In **Replicated items**, right-click the VM > **Complete Migration**. This does the following:

   - Finishes the migration process, stops replication for the on-premises VM, and stops Site Recovery billing for the VM.
   - This step cleans up the replication data. It doesn't delete the migrated VMs.


> [!WARNING]
> **Don't cancel a failover in progress**: VM replication is stopped before failover starts. If you cancel a failover in progress, failover stops, but the VM won't replicate again.

In some scenarios, failover requires additional processing that takes around eight to ten minutes to complete. You might notice longer test failover times for physical servers, VMware Linux machines, VMware VMs that don't have the DHCP service enables, and VMware VMs that don't have the following boot drivers: storvsc, vmbus, storflt, intelide, atapi.



## Post-migration steps in Azure

- Perform any post-migration app tweaks, such as updating database connection strings, and web server configurations. 
- Perform final application and migration acceptance testing on the migrated application now running in Azure.
- The [Azure VM agent](https://docs.microsoft.com/azure/virtual-machines/extensions/agent-windows) manages VM interaction with the Azure Fabric Controller. It's required for some Azure services, such as Azure Backup, Site Recovery, and Azure Security.
    - If you're migrating VMware machines and physical servers, the Mobility Service installer installs available Azure VM agent on Windows machines. On Linux VMs, we recommend that you install the agent after failover.
    - If you’re migrating Azure VMs to a secondary region, the Azure VM agent must be provisioned on the VM before the migration.
    - If you’re migrating Hyper-V VMs to Azure, install the Azure VM agent on the Azure VM after the migration.
- Manually remove any Site Recovery provider/agent from the VM. If you migrate VMware VMs or physical servers, uninstall the Mobility service from the VM.
- For increased resilience:
    - Keep data secure by backing up Azure VMs using the Azure Backup service. [Learn more]( https://docs.microsoft.com/azure/backup/quick-backup-vm-portal).
    - Keep workloads running and continuously available by replicating Azure VMs to a secondary region with Site Recovery. [Learn more](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-quickstart).
- For increased security:
    - Lock down and limit inbound traffic access with Azure Security Center [Just in time administration]( https://docs.microsoft.com/azure/security-center/security-center-just-in-time)
    - Restrict network traffic to management endpoints with [Network Security Groups](https://docs.microsoft.com/azure/virtual-network/security-overview).
    - Deploy [Azure Disk Encryption](https://docs.microsoft.com/azure/security/azure-security-disk-encryption-overview) to help secure disks, and keep data safe from theft and unauthorized access.
    - Read more about [securing IaaS resources]( https://azure.microsoft.com/services/virtual-machines/secure-well-managed-iaas/ ), and visit the [Azure Security Center](https://azure.microsoft.com/services/security-center/ ).
- For monitoring and management:
    - Consider deploying [Azure Cost Management](https://docs.microsoft.com/azure/cost-management/overview) to monitor resource usage and spending.

## Post-migration steps on-premises

- Move app traffic over to the app running on the migrated Azure VM instance.
- Remove the on-premises VMs from your local VM inventory.
- Remove the on-premises VMs from local backups.
- Update any internal documentation to show the new location and IP address of the Azure VMs.


## Next steps

[Learn about](server-migrate-overview.md) VMware migration options

  
