---
title: Migrate failover cluster instance 
description: Learn how to lift and shift your Always On failover cluster instance high availability solution to SQL Server on Azure VMs using Azure Migrate. 
ms.service: virtual-machines-sql
ms.subservice: migration-guide
author: rahugup
manager: bsiva
ms.topic: how-to
ms.date: 4/25/2021
ms.author: rahugup
---
# Migrate failover cluster instance to SQL Server on Azure VMs

This article teaches you to migrate your Always On failover cluster instance (FCI) to SQL Server on Azure VMs using the [Azure Migrate: Server Migration tool](../../../migrate/migrate-services-overview.md#azure-migrate-server-migration-tool). Using the migration tool, you will be able to migrate each node in the failover cluster instance to an Azure VM hosting SQL Server, as well as the cluster and FCI metadata.  

In this article, you learn how to: 

> [!div class="checklist"]
> * Prepare Azure and source environment for migration.
> * Start replicating VMs.
> * Monitor replication.
> * Run a full VM migration.
> * Reconfigure SQL failover cluster with Azure shared disks.


This guide uses the agent-based migration approach of Azure Migrate, which treats any server or virtual machine as a physical server. When migrating physical machines, Azure Migrate: Server Migration uses the same replication architecture as the agent-based disaster recovery in the Azure Site Recovery service, and some components share the same code base. Some content might link to Site Recovery documentation.


## Prerequisites

Before you begin this tutorial, you should:

1. An Azure subscription. Create a [free account](https://azure.microsoft.com/pricing/free-trial/), if necessary. 
1. Install the [Azure PowerShell `Az` module](/powershell/azure/install-az-ps). 
1. Download the [PowerShell samples scripts](https://github.com/Azure/azure-docs-powershell-samples/tree/master/azure-migrate/SQL%20Migration) from the GitHub repository.

## Prepare Azure

Prepare Azure for migration with Server Migration.

**Task** | **Details**
--- | ---
**Create an Azure Migrate project** | Your Azure account needs Contributor or Owner permissions to [create a new project](../../../migrate/create-manage-projects.md).
**Verify permissions for your Azure account** | Your Azure account needs Contributor or Owner permissions on the Azure subscription, permissions to register Azure Active Directory (AAD) apps, and User Access Administrator permissions on the Azure subscription to create a Key Vault, to create a VM, and to write to an Azure managed disk.
**Set up an Azure virtual network** | [Setup](../../../virtual-network/manage-virtual-network.md#create-a-virtual-network) an Azure virtual network (VNet). When you replicate to Azure, Azure VMs are created and joined to the Azure VNet that you specify when you set up migration.


To check you have proper permissions, follow these steps: 

1. In the Azure portal, open the subscription, and select **Access control (IAM)**.
2. In **Check access**, find the relevant account, and select it to view permissions.
3. You should have **Contributor** or **Owner** permissions.
    - If you just created a free Azure account, you're the owner of your subscription.
    - If you're not the subscription owner, work with the owner to assign the role.

If you need to assign permissions, follow the steps in [Prepare for an Azure user account](../../../migrate/tutorial-discover-vmware.md#prepare-an-azure-user-account).


## Prepare for migration

To prepare for server migration, you need to verify the server settings, and prepare to deploy a replication appliance.

### Check machine requirements

Make sure machines comply with requirements for migration to Azure. 

1. [Verify](../../../migrate/migrate-support-matrix-physical-migration.md#physical-server-requirements) server requirements.
2. Verify that source machines that you replicate to Azure comply with [Azure VM requirements](../../../migrate/migrate-support-matrix-physical-migration.md#azure-vm-requirements).
1. Some [Windows](../../../migrate/prepare-for-migration.md#windows-machines) sources require a few additional changes. Migrating the source before making these changes could prevent the VM from booting in Azure. For some operating systems, Azure Migrate makes these changes automatically. 

### Prepare for replication 

Azure Migrate: Server Migration uses a replication appliance to replicate machines to Azure. The replication appliance runs the following components: 

- **Configuration server**: The configuration server coordinates communications between on-premises and Azure, and manages data replication.
- **Process server**: The process server acts as a replication gateway. It receives replication data; optimizes it with caching, compression, and encryption, and sends it to a cache storage account in Azure. 

Prepare for appliance deployment as follows:

- Create a Windows Server 2016 machine to host the replication appliance.  Review the [machine requirements](../../../migrate/migrate-replication-appliance.md#appliance-requirements).
- The replication appliance uses MySQL. Review the [options](../../../migrate/migrate-replication-appliance.md#mysql-installation) for installing MySQL on the appliance.
- Review the Azure URLs required for the replication appliance to access [public](../../../migrate/migrate-replication-appliance.md#url-access) and [government](../../../migrate/migrate-replication-appliance.md#azure-government-url-access) clouds.
- Review [port](../../../migrate/migrate-replication-appliance.md#port-access) access requirements for the replication appliance.

> [!NOTE]
> The replication appliance should be installed on a machine other than the source machine you are replicating or migrating, and not on any machine that has had the Azure Migrate discovery and assessment appliance installed to before.

### Download replication appliance installer

To download the replication appliance installer, follow these steps: 

1. In the Azure Migrate project > **Servers**, in **Azure Migrate: Server Migration**, select **Discover**.

    ![Discover VMs](../../../migrate/media/tutorial-migrate-physical-virtual-machines/migrate-discover.png)

1. In **Discover machines** > **Are your machines virtualized?**, select **Physical or other (AWS, GCP, Xen, etc.)**.
1. In **Target region**, select the Azure region to which you want to migrate the machines.
1. Select **Confirm that the target region for migration is region-name**.
1. Select **Create resources**. This creates an Azure Site Recovery vault in the background.
    - If you've already set up migration with Azure Migrate Server Migration, the target option can't be configured, since resources were set up previously.    
    - You can't change the target region for this project after selecting this button.
    - All subsequent migrations are to this region.

1. In **Do you want to install a new replication appliance?**, select **Install a replication appliance**.
1. In **Download and install the replication appliance software**, download the appliance installer, and the registration key. You need to the key in order to register the appliance. The key is valid for five days after it's downloaded.

    ![Download provider](../../../migrate/media/tutorial-migrate-physical-virtual-machines/download-provider.png)

1. Copy the appliance setup file and key file to the Windows Server 2016 machine you created for the appliance.
1. After the installation completes, the Appliance configuration wizard will launch automatically (You can also launch the wizard manually by using the cspsconfigtool shortcut that is created on the desktop of the appliance machine). Use the **Manage Accounts** tab of the wizard to create a dummy account with the following details:

   -  "guest" as the friendly name
   -  "username" as the username
   -  "password" as the password for the account. 
   
   You will use this dummy account in the Enable Replication stage. 

1. After setup completes, and the appliance restarts, in **Discover machines**, select the new appliance in **Select Configuration Server**, and select **Finalize registration**. Finalize registration performs a couple of final tasks to prepare the replication appliance.

    ![Finalize registration](../../../migrate/media/tutorial-migrate-physical-virtual-machines/finalize-registration.png)


## Install the Mobility service 

Install the Mobility service agent on the servers you want to migrate. The agent installers are available on the replication appliance. Find the right installer, and install the agent on each machine you want to migrate. 

To install the Mobility service, follow these steps: 

1. Sign in to the replication appliance.
2. Navigate to **%ProgramData%\ASR\home\svsystems\pushinstallsvc\repository**.
3. Find the installer for the machine operating system and version. Review [supported operating systems](../../../site-recovery/vmware-physical-azure-support-matrix.md#replicated-machines). 
4. Copy the installer file to the machine you want to migrate.
5. Make sure that you have the passphrase that was generated when you deployed the appliance.
    - Store the file in a temporary text file on the machine.
    - You can obtain the passphrase on the replication appliance. From the command line, run **C:\ProgramData\ASR\home\svsystems\bin\genpassphrase.exe -v** to view the current passphrase.
    - Don't regenerate the passphrase. This will break connectivity and you will have to reregister the replication appliance.
    - In the */Platform* parameter, specify *VMware* for both VMware machines and physical machines. 

1. Connect to the machine and extract the contents of the installer file to a local folder (such as c:\temp). Run this in an admin command prompt: 

    ```
    ren Microsoft-ASR_UA*Windows*release.exe MobilityServiceInstaller.exe
    MobilityServiceInstaller.exe /q /x:C:\Temp\Extracted
    cd C:\Temp\Extracted
    ```

2. Run the Mobility Service Installer:

    ```
    UnifiedAgent.exe /Role "MS" /Platform "VmWare" /Silent
    ```

3. Register the agent with the replication appliance:

    ```
    cd C:\Program Files (x86)\Microsoft Azure Site Recovery\agent
    UnifiedAgentConfigurator.exe  /CSEndPoint <replication appliance IP address> /PassphraseFilePath <Passphrase File Path>
    ```

It may take some time after installation for discovered machines to appear in Azure Migrate: Server Migration. As VMs are discovered, the **Discovered servers** count rises.

![Discovered servers](../../../migrate/media/tutorial-migrate-physical-virtual-machines/discovered-servers.png)

## Prepare source machines

To prepare source machines, you'll need information from the cluster. 

> [!CAUTION]
> - Maintain disk ownership throughout the replication process until the final cutover. If there is a change in disk ownership, there is a chance that the volumes could be corrupted and replication would need to be to retriggered. Set the preferred owner for each disk to avoid transfer of ownership during the replication process. 
> - Avoid patching activities and system reboots during the replication process to avoid transfer of disk ownership.

To prepare source machines, do the following: 

1. **Identify disk ownership:** Log in to one of the cluster nodes and open Failover Cluster Manager. Identify the owner node for the disks to determine the disks that need to be migrated with each server.  
2. **Retrieve cluster information:** Run the `Get-ClusterInfo.ps1` script on a cluster node to retrieve information on the cluster resources. The script will output the role name, resource name, IP, and probe port in the `Cluster-Config.csv` file. Use this CSV file to create and assign resource in Azure later in this article.  
    
   ```powershell
   ./Get-ClusterInfo.ps1
   ```

## Create load balancer

For the cluster and cluster roles to respond properly to requests, an Azure Load balancer is required. Without a load balancer, the other VMs are unable to reach the cluster IP address as it's not recognized as belonging to the network or the cluster. 

1. Fill out the columns in the `Cluster-Config.csv` file: 

    **Column Header** | **Description**
    --- | ---
    NewIP | Specify the IP address in the Azure virtual network (or subnet) for each resource in the CSV file.
    ServicePort | Specify the service port to be used by each resource in the CSV file. For SQL cluster resource, use the same value for service port as the probe port in the CSV. For other cluster roles, the default values used are 1433 but you can continue to use the port numbers that are configured in your current setup. 


1. Run the `Create-ClusterLoadBalancer.ps1` script to create the load balancer using the following mandatory parameters: 

    **Parameter** | **Type** | **Description**
    --- | --- | ---
    ConfigFilePath | Mandatory |  Specify the path for the `Cluster-Config.csv` file that you have filled out in the previous step.
    ResourceGroupName | Mandatory| Specify the name of the resource Group in which the load balancer is to be created. 
    VNetName | Mandatory| Specify the name of the Azure virtual network that the load balancer will be associated to. 
    SubnetName | Mandatory| Specify the name of the subnet in the Azure virtual network that the load balancer will be associated to. 
    VNetResourceGroupName | Mandatory| Specify the name of the resource group for the Azure virtual network that the load balancer will be associated to. 
    Location | Mandatory| Specify the location in which the load balancer should be created. 
    LoadBalancerName | Mandatory| Specify the name of the load balancer to be created. 


    ```powershell
    ./Create-ClusterLoadBalancer.ps1 -ConfigFilePath ./cluster-config.csv -ResourceGroupName $resoucegroupname -VNetName $vnetname -subnetName $subnetname -VnetResourceGroupName $vnetresourcegroupname -Location “eastus” -LoadBalancerName $loadbalancername
    ```

## Replicate machines

Now, select machines for migration. You can replicate up to 10 machines together. If you need to replicate more, then replicate them simultaneously in batches of 10.

1. In the Azure Migrate project > **Servers**, **Azure Migrate: Server Migration**, select **Replicate**.

    ![Screenshot of the Azure Migrate - Servers screen showing the Replicate button selected in Azure Migrate: Server Migration under Migration tools.](../../../migrate/media/tutorial-migrate-physical-virtual-machines/select-replicate.png)

1. In **Replicate**, > **Source settings** > **Are your machines virtualized?**, select **Physical or other (AWS, GCP, Xen, etc.)**.
1. In **On-premises appliance**, select the name of the Azure Migrate appliance that you set up.
1. In **Process Server**, select the name of the replication appliance.
1. In **Guest credentials**, select the dummy account created previously during the [replication installer setup](#download-replication-appliance-installer). Then select **Next: Virtual machines**.

    ![Screenshot of the Source settings tab in the Replicate screen with the Guest credentials field highlighted.](../../../migrate/media/tutorial-migrate-physical-virtual-machines/source-settings.png)

1. In **Virtual Machines**, in **Import migration settings from an assessment?**, leave the default setting **No, I'll specify the migration settings manually**.
1. Check each VM you want to migrate. Then select **Next: Target settings**.

    ![Select VMs](../../../migrate/media/tutorial-migrate-physical-virtual-machines/select-vms.png)


1. In **Target settings**, select the subscription, and target region to which you'll migrate, and specify the resource group in which the Azure VMs will reside after migration.
1. In **Virtual Network**, select the Azure VNet/subnet to which the Azure VMs will be joined after migration.
1. In **Availability options**, select:
    -  Availability Zone to pin the migrated machine to a specific Availability Zone in the region. Use this option to distribute servers that form a multi-node application tier across Availability Zones. If you select this option, you'll need to specify the Availability Zone to use for each of the selected machine in the Compute tab. This option is only available if the target region selected for the migration supports Availability Zones
    -  Availability Set to place the migrated machine in an Availability Set. The target Resource Group that was selected must have one or more availability sets in order to use this option.
    - No infrastructure redundancy required option if you don't need either of these availability configurations for the migrated machines.
    
1. In **Disk encryption type**, select:
    - Encryption-at-rest with platform-managed key
    - Encryption-at-rest with customer-managed key
    - Double encryption with platform-managed and customer-managed keys

    > [!NOTE]
    > To replicate VMs with CMK, you'll need to [create a disk encryption set](../../../virtual-machines/disks-enable-customer-managed-keys-portal.md#set-up-your-disk-encryption-set) under the target Resource Group. A disk encryption set object maps Managed Disks to a Key Vault that contains the CMK to use for SSE.
  
1. In **Azure Hybrid Benefit**:

    - Select **No** if you don't want to apply Azure Hybrid Benefit. Then select **Next**.
    - Select **Yes** if you have Windows Server machines that are covered with active Software Assurance or Windows Server subscriptions, and you want to apply the benefit to the machines you're migrating. Then select **Next**.

    :::image type="content" source="../../../migrate/media/tutorial-migrate-vmware/target-settings.png" alt-text="Target settings":::

1. In **Compute**, review the VM name, size, OS disk type, and availability configuration (if selected in the previous step). VMs must conform with [Azure requirements](../../../migrate/migrate-support-matrix-physical-migration.md#azure-vm-requirements).

    - **VM size**: If you're using assessment recommendations, the VM size dropdown shows the recommended size. Otherwise Azure Migrate picks a size based on the closest match in the Azure subscription. Alternatively, pick a manual size in **Azure VM size**.
    - **OS disk**: Specify the OS (boot) disk for the VM. The OS disk is the disk that has the operating system bootloader and installer.
    - **Availability Zone**: Specify the Availability Zone to use.
    - **Availability Set**: Specify the Availability Set to use.

    ![Compute settings](../../../migrate/media/tutorial-migrate-physical-virtual-machines/compute-settings.png)

1. In **Disks**, specify whether the VM disks should be replicated to Azure, and select the disk type (standard SSD/HDD or premium managed disks) in Azure. Then select **Next**.
    - Use the list that you had made earlier to select the disks to be replicated with each server. Exclude other disks from replication.
   

    ![Disk settings](../../../migrate/media/tutorial-migrate-physical-virtual-machines/disks.png)

1. In **Review and start replication**, review the settings, and select **Replicate** to start the initial replication for the servers.

> [!NOTE]
> You can update replication settings any time before replication starts, **Manage** > **Replicating machines**. Settings can't be changed after replication starts.

## Track and monitor

Replication proceeds in the following sequence: 

- When you select **Replicate** a _Start Replication_ job begins. 
- When the _Start Replication_ job finishes successfully, the machines begin their initial replication to Azure.
- After initial replication finishes, delta replication begins. Incremental changes to on-premises disks are periodically replicated to the replica disks in Azure.
- After the initial replication is completed, configure the Compute and Network items for each VM. Clusters typically have multiple NICs but only one NIC is required for the migration (set the others as do not create).

You can track job status in the portal notifications.

You can monitor replication status by selecting on **Replicating servers** in **Azure Migrate: Server Migration**.
![Monitor replication](../../../migrate/media/tutorial-migrate-physical-virtual-machines/replicating-servers.png)


## Migrate VMs

After machines are replicated, they are ready for migration. To migrate your servers, follow these steps: 

1. In the Azure Migrate project > **Servers** > **Azure Migrate: Server Migration**, select **Replicating servers**.

    ![Replicating servers](../../../migrate/media/tutorial-migrate-physical-virtual-machines/replicate-servers.png)

1. To ensure that the migrated server is synchronized with the source server, stop the SQL Server resource (in **Failover Cluster Manager** > **Roles** > **Other resources**) while ensuring that the cluster disks are online.   
1. In **Replicating machines** > select on server name > **Overview**, ensure that the last synchronized timestamp is after you have stopped SQL Server resource on the servers to be migrated before you move onto the next step. This should only take a few of minutes. 
1. In **Replicating machines**, right-click the VM > **Migrate**.
1. In **Migrate** > **Shut down virtual machines and perform a planned migration with no data loss**, select **No** > **OK**.
   
   > [!NOTE]
   > For Physical Server Migration, shut down of source machine is not supported automatically. The recommendation is to bring the application down as part of the migration window (don't let the applications accept any connections) and then initiate the migration (the server needs to be kept running, so remaining changes can be synchronized) before the migration is completed.

1. A migration job starts for the VM. Track the job in Azure notifications.
1. After the job finishes, you can view and manage the VM from the **Virtual Machines** page.

## Reconfigure cluster 

After your VMs have migrated, reconfigure the cluster. Follow these steps: 

1. Shut down the migrated servers in Azure.
1. Add the migrated machines to the backend pool of the load balancer. Navigate to **Load Balancer** > **Backend pools** > select backend pool > **add migrated machines**. 

1. Reconfigure the migrated disks of the servers as shared disks by running the `Create-SharedDisks.ps1` script. The script is interactive and will prompt for a list of machines and then show available disks to be extracted (only data disks). You will be prompted once to select which machines contain the drives to be turned into shared disks. Once selected, you will be prompted again, once per machine, to pick the specific disks. 

   **Parameter** | **Type** | **Description**
   --- | --- | ---
   ResourceGroupName | Mandatory |  Specify the name of the resource group containing the migrated servers.
   NumberofNodes | Optional | Specify the number of nodes in your failover cluster instance. This parameter is used to identify the right SKU for the shared disks to be    created. By default, the script assumes the number of nodes in the cluster to be 2.   
   DiskNamePrefix | Optional | Specify the prefix that you'd want to add to the names of your shared disks. 
   
   ```powershell 
   ./Create-SharedDisks.ps1 -ResourceGroupName $resoucegroupname -NumberofNodes $nodesincluster -DiskNamePrefix $disknameprefix 
   ```

1. Attach the shared disks to the migrated servers by running the `Attach-SharedDisks.ps1` script. 

   **Parameter** | **Type** |**Description**
   --- | ---  | ---
   ResourceGroupName | Mandatory | Specify the name of the resource group containing the migrated servers.
   StartingLunNumber | Optional |Specify the starting LUN number that is available for the shared disks to be attached to. By default, the script tries to attach shared    disks to LUN starting 0.  
   
   ```powershell 
   ./Attach-ShareDisks.ps1 -ResourceGroupName $resoucegroupname 
   ```

1. Start the migrated servers in Azure and login to any node. 

1. Copy the `ClusterConfig.csv` file and run the `Update-ClusterConfig.ps1` script passing the CSV as a parameter. This will ensure the cluster resources are updated with the new configuration for the cluster to work in Azure. 

   ```powershell
   ./Update-ClusterConfig.ps1 -ConfigFilePath $filepath
   ```

Your SQL Server failover cluster instance  is ready. 

## Complete the migration

1. After the migration is done, right-click the VM > **Stop migration**. This does the following:
    - Stops replication for the on-premises machine.
    - Removes the machine from the **Replicating servers** count in Azure Migrate: Server Migration.
    - Cleans up replication state information for the machine.
1. Install the Azure VM [Windows](../../../virtual-machines/extensions/agent-windows.md) agent on the migrated machines.
1. Perform any post-migration app tweaks, such as updating database connection strings, and web server configurations.
1. Perform final application and migration acceptance testing on the migrated application now running in Azure.
1. Cut over traffic to the migrated Azure VM instance.
1. Remove the on-premises VMs from your local VM inventory.
1. Remove the on-premises VMs from local backups.
1. Update any internal documentation to show the new location and IP address of the Azure VMs. 

## Post-migration best practices

- For SQL Server:
    -  Install [SQL Server IaaS Agent extension](../../virtual-machines/windows/sql-server-iaas-agent-extension-automate-management.md) to automate management and administration tasks. 
    - [Optimize](../../virtual-machines/windows/performance-guidelines-best-practices-checklist.md) SQL Server performance on Azure VMs. 
    - Understand [pricing](../../virtual-machines/windows/pricing-guidance.md#free-licensed-sql-server-editions) for SQL Server on Azure. 
- For increased resilience:
    - Keep data secure by backing up Azure VMs using the [Azure Backup service](../../../backup/quick-backup-vm-portal.md). 
    - Keep workloads running and continuously available by replicating Azure VMs to a secondary region with [Site Recovery](../../../site-recovery/azure-to-azure-tutorial-enable-replication.md).
- For increased security:
    - Lock down and limit inbound traffic access with [Azure Security Center - Just in time administration](../../../security-center/security-center-just-in-time.md).
    - Restrict network traffic to management endpoints with [Network Security Groups](../../../virtual-network/network-security-groups-overview.md).
    - Deploy [Azure Disk Encryption](../../../security/fundamentals/azure-disk-encryption-vms-vmss.md) to help secure disks, and keep data safe from theft and unauthorized access.
    - Read more about [securing IaaS resources](https://azure.microsoft.com/services/virtual-machines/secure-well-managed-iaas/), and visit the [Azure Security Center](https://azure.microsoft.com/services/security-center/).
- For monitoring and management:
    - Consider deploying [Azure Cost Management](../../../cost-management-billing/cost-management-billing-overview.md) to monitor resource usage and spending.


## Next steps

Investigate the [cloud migration journey](/azure/architecture/cloud-adoption/getting-started/migrate) in the Azure Cloud Adoption Framework.