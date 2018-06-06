---
title: Rehost a Contoso app with migration to Azure VMs with Azure Site Recovery | Microsoft Docs
description: Learn how rehost an on-premises app and  with a lift-and-shift migration to Azure for migration of on-premises machines using the Azure Site Recovery service.
services: site-recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 06/30/2018
ms.author: raynew
---

# Contoso migration: Rehost an on-premises app to Azure VMs


This article shows you how Contoso are rehosting their SmartHotel app in Azure, by migrating the app VMs to Azure VMs.


This document is one in a series of articles that document how the fictitious company Contoso migrates their on-premises resources to the Microsoft Azure cloud. The series includes background information, and a series of scenarios that illustrate how to set up a migration infrastructure, assess the suitability of on-premises resources for migration, and run different types of migrations. Scenarios grow in complexity, and we'll add additional articles over time.


**Article** | **Details** | **Status**
--- | --- | ---
Article 1: Overview | Provides an overview of Contoso's migration strategy, the article series, and the sample apps we use. | Available
Article 2: Deploy an Azure infrastructure | Describes how Contoso prepares its on-premises and Azure infrastructure for migration. The same infrastructure is used for all Contoso migration scenarios. | Available
Article 3: Assess on-premises resources  | Shows how Contoso runs an assessment of their on-premises two-tier SmartHotel app running on VMware. They assess app VMs with the [Azure Migrate](migrate-overview.md) service, and the app SQL Server database with the [Azure Database Migration Assistant](https://docs.microsoft.com/sql/dma/dma-overview?view=sql-server-2017). | Available
Article 4: Refactor (lift-and-shift) to Azure VMs and a SQL Managed Instance (this article) | Demonstrates how Contoso migrates the SmartHotel app to Azure. They migrate the app frontend VM using [Azure Site Recovery](https://docs.microsoft.com/azure/site-recovery/site-recovery-overview), and the app database using the [Azure Database Migration](https://docs.microsoft.com/azure/dms/dms-overview) service, to migrate to a SQL Managed Instance. | Available
Article 5: Refactor (lift-and-shift) to Azure VMs (this article) | Shows how Contoso migrate their SmartHotel app VMs using Site Recovery only.
Article 6: Refactor (lift-and-shift) to Azure VMs and SQL Server Availability Groups | Shows how Contoso migrates the SmartHotel app. They use Site Recovery to migrate the app VMs, and the Database Migration service to migrate the app database to a SQL Server Availability Group. | Available
Article 7: Refactor (lift-and-shift) to Azure VMs and Azure MySQL Server | Demonstrates how Contoso migrates the SmartHotel app VMs using Site Recovery, and MySQL Workbench to migrate (backup and restore) to an Azure MySQL Server instance. | Available

In this article, Contoso will migrate the two-tier Windows. NET SmartHotel app running on VMware VMs to Azure. If you'd like to use this app, it's provided as open source and you can download it from [github](https://github.com/Microsoft/SmartHotel360).



## Business drivers

The IT Leadership team has worked closely with their business partners to understand what the business wants to achieve with this migration:

- **Address business growth**: Contoso is growing and as a result there is pressure on their on-premises systems and infrastructure.
- **Limit risk**: The SmartHotel app is critical for the Contoso business. They want to move it to Azure with zero risk.
- **Extend**:  Contoso doesn't want to modify the app. They simply want to ensure that it's stable.


## Migration goals

The Contoso cloud team has pinned down goals for this migration. These goals are used to determine the best migration method:

- After migration, the app in Azure should have the same performance capabilities as it does today in their on-premises VMWare environment.  The app will remain as critical in the cloud as it is on-premises. 
- Contoso doesn’t want to invest in this app.  It is critical and important to the business, but in its current form they simply want to move it safely to the cloud.
- Contoso doesn't want to change the ops model for this app. They want to continue to interact with it in the cloud in the same way that they do now.
- Contoso doesn't want to change app functionality. Only the app location will change.

## Proposed architecture

In this scenario:

- The app is tiered across two VMs (WEBVM and SQLVM), and located on VMware ESXi host **contosohost1.contoso.com** (version 6.5)
- The VMware environment is managed by vCenter Server 6.5 (**vcenter.contoso.com**), running on a VM.
- Contoso will migrate both of the app VMs to Azure.
- Contoso has an on-premises datacenter (contoso-datacenter), with an on-premises domain controller (**contosodc1**).
- The on-premises VMs in the Contoso datacenter will be decommissioned after the migration is done.

![Scenario architecture](./media/contoso-migration-rehost-vm/architecture.png) 

### Azure services

**Service** | **Description** | **Cost**
--- | --- | ---
[Azure Site Recovery](https://docs.microsoft.com/azure/site-recovery/) | The service orchestrates and manages migration and disaster recovery for Azure VMs, and on-premises VMs and physical servers.  | During replication to Azure, Azure Storage charges are incurred.  Azure VMs are created, and incur charges, when failover occurs. [Learn more](https://azure.microsoft.com/pricing/details/site-recovery/) about charges and pricing.

 

## Migration process

Contoso will migrate the two VMs running their tiered SmartHotel application to Azure.

- They already have their [Azure infrastructure](contoso-migration-infrastructure.md) in place, so they just need to add a couple of Azure components specifically for this scenario, prepare their on-premises VMware environment, and enable replication for the VMs.
- After VMs are replicating to Azure, they'll run a failover from their on-premises site to Azure, to complete the migration.

![Migration process](./media/contoso-migration-rehost-vm/migraton-process.png) 



## Prerequisites

Here's what Contoso (and you) needs to run this scenario.

**Requirements** | **Details**
--- | ---

**Azure subscription** | You should have already created a subscription during early articles in this series. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/).<br/><br/> If you create a free account, you're the administrator of your subscription and can perform all actions.<br/><br/> If you use an existing subscription and you're not the administrator, you need to work with the admin to assign you Owner or Contributor permissions.<br/><br/> If you need more granular permissions, review [this article](../site-recovery/site-recovery-role-based-linked-access-control.md). 
**Azure infrastructure** | Contoso set up their Azure infrastructure as described in [Azure infrastructure for migration](contoso-migration-infrastructure.md).<br/><br/> Learn more about specific [network](https://docs.microsoft.com/azure/site-recovery/vmware-physical-azure-support-matrix#network) and [storage](https://docs.microsoft.com/azure/site-recovery/vmware-physical-azure-support-matrix#storage) requirements for Site Recovery.
**On-premises servers** | Your on-premises vCenter server should be running version 5.5, 6.0, or 6.5<br/><br/> An ESXi host running version 5.5, 6.0 or 6.5<br/><br/> One or more VMware VMs running on the ESXi host.
**On-premises VMs** | VMs must meet [Azure requirements](https://docs.microsoft.com/azure/site-recovery/vmware-physical-azure-support-matrix#azure-vm-requirements).


## Scenario steps

Here's how Contoso will run the migration:

> [!div class="checklist"]
> * **Step 1: Prepare Azure for Site Recovery**: Contoso creates a Azure storage account to hold replicated data, and a Recovery Services vault.
> * **Step 2: Prepare on-premises VMware for Site Recovery**: They prepare accounts for VM discovery and agent installation, and prepare to connect to Azure VMs after failover.
> * **Step 3: Replicate VMs**: They configure the Site Recovery source and target environment, set up a replication policy, and start replicating VMs to Azure storage.
> * **Step 4: Migrate the VMs with Site Recovery**: They run a test failover to make sure everything's working, and then run a full failover to migrate the VMs to Azure.




## Step 1: Prepare Azure for the Site Recovery service

There are a number of elements Contoso need in place to deploy Site Recovery to migrate the app VMs (WEBVM and SQLVM):

- A VNet in which failed over resources are located.
- An Azure storage account to hold replicated data. 
- A Recovery Services vault in Azure.

They set up Site Recovery as follows:

1. Contoso needs an Azure VNet into which the VMs will be migrated. They set up these networks when they [deployed the Azure infrastructure](contoso-migration-infrastructure.md)

    - Since the VMs host the SmartHotel app, they will be migrated to the Azure production network in the primary East US 2 region.
    - Both VMs will be in the ContosoRG resource group, which contains production resources.
    - WEBVM, containing the app frontend, will migrate to the frontend subnet (PROD-FE-EUS2), in the production network (VNET-PROD-EUS2).
    - SQLVM, containing the database, will migrate to the database subnet (PROD-DB-EUS2), in the production network (VNET-PROD-EUS2).

2. Contoso needs to create an Azure storage account (contosovmsacc20180528) in the primary region.
    - The storage account must be in the same region as the Recovery Services vault.
    - They use a general-purpose account, with standard storage, and LRS replication. 

    ![Site Recovery storage](./media/contoso-migration-rehost-vm/asr-storage.png)

3. With the network and storage account in place, Contoso now creates a vault (ContosoMigrationVault), and places it in the ContosoFailoverRG resource group in the primary East US 2 region.

    ![Recovery Services vault](./media/contoso-migration-rehost-vm/asr-vault.png)

**Need more help?**

[Learn about](https://docs.microsoft.com/azure/site-recovery/tutorial-prepare-azure) setting up Azure for Site Recovery.


## Step 2: Prepare on-premises VMware for Site Recovery

Here's what Contoso prepares on-premises:

- An account on the vCenter server or vSphere ESXi host, to automate VM discovery.
- An account that allows automatic installation of the Mobility service on the VMware VMs. 
- On-premises VMs so that they can connect to the replicated Azure VMs when they're created after failover.


### Prepare an account for automatic discovery

Site Recovery needs access to VMware servers to:

- Automatically discover VMs. At least a read-only account is required.
- Orchestrate replication, failover, and failback for VMs. The account should be able to run operations such as creating and removing disks, and turning on VMs.

Contoso sets up the account as follows:

1. They create a role at the vCenter level.
2. They assign that role the required permissions.



### Prepare an account for Mobility service installation

The Mobility service must be installed on the VM you want to replicate.

- Site Recovery can do an automatic push installation of this component when you enable replication for the VMs.
- For automatic push installation, you need to prepare an account that Site Recovery will use to access the VMs.
- You specify this account when you set up replication in the Azure console.
- You need a domain or local account with permissions to install on the VMs.


### Prepare to connect to Azure VMs after failover

After failover to Azure, Contoso wants to be able to connect to the replicated VMs in Azure. To do this, there's a couple of things they need to do on the on-premises VM, before they run the migration: 

1. For access over the internet, they enable RDP on the on-premises VM before failover, and ensure that TCP and UDP rules are added for the **Public** profile, and that RDP is allowed in **Windows Firewall** > **Allowed Apps** for all profiles.
2. For access over their site-to-site VPN, they enable RDP on the on-premises machine, and allow RDP in the **Windows Firewall** -> **Allowed apps and features** for **Domain and Private** networks.
3. They set the operating system's SAN policy on the on-premises VM to **OnlineAll**.

In addition, when they run a failover they need to check the following:

- There should be no Windows updates pending on the VM when triggering a failover. If there are, they won't be able to log in to the virtual machine until the update completes.
- After failover, they should check **Boot diagnostics** to view a screenshot of the VM. If this doesn't work, they should check that the VM is running and review these [troubleshooting tips](http://social.technet.microsoft.com/wiki/contents/articles/31666.troubleshooting-remote-desktop-connection-after-failover-using-asr.aspx).


**Need more help?**

- [Learn about](https://docs.microsoft.com/azure/site-recovery/vmware-azure-tutorial-prepare-on-premises#prepare-an-account-for-automatic-discovery) creating and assigning a role for automatic discovery.
- [Learn about](https://docs.microsoft.com/azure/site-recovery/vmware-azure-tutorial-prepare-on-premises#prepare-an-account-for-mobility-service-installation) creating an account for push installation of the Mobility service.


## Step 3: Replicate the on-premises VMs

Before they can run a migration to Azure, Contoso needs to set up replication, and enable replication for the on-premises VMs.

### Set a replication goal

1. In the vault, under the vault name (ContosoVMVault) they set a replication goal (**Getting Started** > **Site Recovery** > **Prepare infrastructure**.
2. They specify that their machines are located on-premises, that they're VMware VMs, and that they want to replicate them to Azure.

    ![Replication goal](./media/contoso-migration-rehost-vm/replication-goal.png)

### Confirm deployment planning

To continue, they need to confirm that they have completed deployment planning, by selecting **Yes, I have done it**. In this deployment Contoso are only migrating two VMs, and don't need deployment planning.


### Set up the source environment

Now Contoso needs to configure their source environment. They download an OVF template and use it to deploy the configuration server as a highly available, on-premises VMware VM. 

The configuration server VM runs a number of components:

- The configuration server that coordinates communications between on-premises and Azure and manages data replication.
- The process server that acts as a replication gateway. It receives replication data; optimizes it with caching, compression, and encryption; and sends it to Azure storage.
- The process server also installs Mobility Service on VMs you want to replicate and performs automatic discovery of on-premises VMware VMs.

After the configuration server VM is created and started, they register it in the vault.

Contoso perform these steps as follows:

1. In the vault, they download the OVF template from **Prepare Infrastructure** > **Source** > **Configuration Server**.
    
    ![Download OVF](./media/contoso-migration-rehost-vm/add-cs.png)

2. They import the template into VMware to create and deploy the VM.

    ![OVF template](./media/contoso-migration-rehost-vm/vcenter-wizard.png)

3.  When they turn on the VM for the first time, it boots up into a Windows Server 2016 installation experience. They accept the license agreement, and enter an administrator password.

4. After the installation finishes, they sign in to the VM as the administrator. At first sign-in, the Azure Site Recovery Configuration Tool runs by default.
5. In the tool, they specify a name to register the configuration server in the vault.
6. The tool checks that the VM can connect to Azure.
7. After the connection is established, they sign in to the Azure subscription. The credentials must have access to the vault in which they'll register the configuration server.

    [Register configuration server](./media/contoso-migration-rehost-vm/config-server-register2.png)

7. The tool performs some configuration tasks and then reboots.
8. They sign in to the machine again, and the Configuration Server Management Wizard starts automatically.
9. In the wizard, they select the NIC to receive replication traffic. This setting can't be changed after it's configured.
10. They select the subscription, resource group, and the vault in which to register the configuration server.
        ![vault](./media/contoso-migration-rehost-vm/cswiz1.png) 

10. They download and install MySQL Server, and VMWare PowerCLI. Then, they validate the server settings.
11. After validation, they specify the FQDN or IP address of the vCenter server or vSphere host. They leave the default port, and specify a friendly name for the server in Azure.
12. They specify the account that they created for automatic discovery, and the credentials that are used to automatically install the Mobility Service. For Windows machines, the account needs local administrator privileges on the VMs.

    ![vCenter](./media/contoso-migration-rehost-vm/cswiz2.png)

7. After registration finishes, in the Azure portal, Contoso double checks that the configuration server and VMware server are listed on the **Source** page in the vault. Discovery can take 15 minutes or more. 
8. Site Recovery then connects to VMware servers using the specified settings, and discovers VMs.

### Set up the target

Now Contoso needs to specify target replication settings.

1. In **Prepare infrastructure** > **Target**, they select the target settings.
2. Site Recovery checks that there's an Azure storage account and network in the specified target.

### Create a replication policy

After the source and target are set up, Contoso is ready to create a replication policy, and associate it with the configuration server.

1. In  **Prepare infrastructure** > **Replication Settings** > **Replication Policy** >  **Create and Associate**, they create a policy **ContosoMigrationPolicy**.
2. They use the default settings:
    - **RPO threshold**: Default of 60 minutes. This value defines how often recovery points are created. An alert is generated if continuous replication exceeds this limit.
    - **Recovery point retention**. Default of 24 hours. This value specifies how long the retention window is for each recovery point. Replicated VMs can be recovered to any point in a window.
    - **App-consistent snapshot frequency**. Default of one hour. This value specifies the frequency at which application-consistent snapshots are created.

        ![Create replication policy](./media/contoso-migration-rehost-vm/replication-policy.png)

5. The policy is automatically associated with the configuration server. 

    ![Associate replication policy](./media/contoso-migration-rehost-vm/replication-policy2.png)

### Enable replication for WEBVM

Now Contoso can start replicating the WebVM.

1. In **Replicate application** > **Source** > **+Replicate** they select the source settings.
2. They indicate that they want to enable virtual machines, select the vCenter server, and the configuration server.

    ![Enable replication](./media/contoso-migration-rehost-vm/enable-replication1.png)

3. Now, they specify the target settings, including the resource group and network in which the Azure VM will be located after failover, and the storage account in which replicated data will be stored.

     ![Enable replication](./media/contoso-migration-rehost-vm/enable-replication2.png)

4. Contoso selects the WebVM for replication. 

    - At this stage Contoso selects only WEBVM because VNet and subnet must be selected, and the VMs aren't in the same subnet.
    - Site Recovery automatically installs the Mobility service when replication is enabled for the VM.

    ![Enable replication](./media/contoso-migration-rehost-vm/enable-replication3.png)

5. Contoso checks that the correct replication policy is selected, and enables replication for WEBVM. They track replication progress in **Jobs**. After the **Finalize Protection** job runs, the machine is ready for failover.
6. In **Essentials** in the Azure portal, Contoso can see the structure for the VMs replicating to Azure.


### Enable replication for SQLVM

Now Contoso can start replicating the SQLVM machine, using the same process as above.

1. They select source settings, indicates that they want to enable the VM, and specify the vCenter server, and configuration server.

    ![Enable replication](./media/contoso-migration-rehost-vm/enable-replication1.png)

2. They then specify the target settings.

     ![Enable replication](./media/contoso-migration-rehost-vm/enable-replication2-sqlvm.png)

3. They select SQLVM for replication. The Mobility service will be automatically installed.

    ![Enable replication](./media/contoso-migration-rehost-vm/enable-replication3-sqlvm.png)

4. They apply the same replication policy that was used for WEBVM, and enable replication.

    ![Infrastructure view](./media/contoso-migration-rehost-vm/essentials.png)

**Need more help?**

- You can read a full walkthrough of all these steps in [Set up disaster recovery for on-premises VMware VMs](https://docs.microsoft.com/azure/site-recovery/vmware-azure-tutorial).
- Detailed instructions are available to help you [set up the source environment](https://docs.microsoft.com/azure/site-recovery/vmware-azure-set-up-source), [deploy the configuration server(https://docs.microsoft.com/azure/site-recovery/vmware-azure-deploy-configuration-server), and [configure replication settings](https://docs.microsoft.com/azure/site-recovery/vmware-azure-set-up-replication).
- You can learn more about [enabling replication](https://docs.microsoft.com/azure/site-recovery/vmware-azure-enable-replication).


## Step 4: Migrate the VMs 

Contoso run a quick test failover, and then a full failover to migrate the VMs.

### Run a test failover

A test failover helps to ensure that everything's working as expected. 

1. Contoso runs a test failover, to the latest available point in time (Latest processed).
2. They select **Shut down machine before beginning failover**, so that Site Recovery attempts to shut down the source VM before triggering the failover. Failover continues even if shutdown fails. 
3. Test failover runs: 

    - A prerequisites check runs to make sure all of the conditions required for migration are in place.
    - Failover processes the data, so that an Azure VM can be created. If select the latest recovery point, a recovery point is created from the data.
    - An Azure VM is created using the data processed in the previous step.
3. After the failover finishes, the replica Azure VM appears in the Azure portal. Contoso checks that the VM is the appropriate size,  connected to the right network, and running. 
4. After verifying the test failover, they clean up the failover, and record and save any observations. 

### Create and customize a recovery plan

 After verifying that the test failover worked as expected, Contoso creates a recovery plan for migration. 

- A recovery plan specifies the order in which failover occurs, how Azure VMs will be brought up in Azure.
- Since the app is two-tier, they customize the recovery plan so that the data VM (SQLVM) starts before the frontend (WEBVM).


1. In **Recovery Plans (Site Recovery)** > **+Recovery Plan**, they create a plan and add the VMs to it.

    ![Recovery plan](./media/contoso-migration-rehost-vm/recovery-plan.png)

2. After creating the plan, they select it for customization (**Recovery Plans** > **SmartHotelMigrationPlan** > **Customize**.
2.	They remove WEBVM from **Group 1: Start**.  This ensures that the first start action affects SQLVM only.
3.	In **+Group** > **Add protected items**, they add WEBVM to Group 2: Start.  The VMs need to be in two different groups.


### Migrate the VMs


Now Contoso is ready to run a failover on the recovery plan, to migrate the VMs.

1. They select the plan > **Failover**.
2. They select to fail over to the latest recovery point, and specify that Site Recovery should try to shut down the on-premises VM before triggering the failover. They can follow the failover progress on the **Jobs** page.

    ![Failover](./media/contoso-migration-rehost-vm/failover1.png)


3. After the failover, they verify that the Azure VM appears as expected in the Azure portal.

    ![Failover](./media/contoso-migration-rehost-vm/failover2.png)  

3. After verification, they complete the migration for each VM. This stops replication for the VM, and stops Site Recovery billing for it.

    ![Failover](./media/contoso-migration-rehost-vm/failover3.png)

**Need more help?**

- [Learn about](https://docs.microsoft.com/azure/site-recovery/tutorial-dr-drill-azure) running a test failover. 
- [Learn](https://docs.microsoft.com/azure/site-recovery/site-recovery-create-recovery-plans) how to create a recovery plan.
- [Learn about](https://docs.microsoft.com/azure/site-recovery/site-recovery-failover) failing over to Azure.

## Step 5: Clean up after migration

With migration complete, the SmartHotel app tiers are now running on Azure VMs.

Now, Contoso needs to complete these cleanup steps:  

- Remove the WEBVM machine from the vCenter inventory.
- Remove the SQLVM machine from the vCenter inventory.
- Remove WEBVM and SQLVM from local backup jobs.
- Update internal documentation to show the new location, and IP addresses for the VMs.
- Review any resources that interact with the VMs, and update any relevant settings or documentation to reflect the new configuration.

## Step 9: Review the deployment

With the app now running, Contoso now needs to fully operationalize and secure it in Azure.

### Security

The Contoso security team reviews the Azure VMs, to determine any security issues.

- To control access, they review the Network Security Groups (NSGs) for the VMs. NSGs are used to ensure that only traffic allowed to the app can reach it.
- They also consider securing the data on the disk using Azure Disk Encryption and KeyVault.

[Read more](https://docs.microsoft.com/azure/security/azure-security-best-practices-vms#vm-authentication-and-access-control) about security practices for VMs.

### Backups

Contoso is going to back up the data on the VMs using the Azure Backup service. [Learn more](https://docs.microsoft.com/azure/backup/backup-introduction-to-azure-backup?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

### Licensing and cost optimization

1. Contoso has existing licensing for their VMs, and will leverage the Azure Hybrid Benefit.  They will convert the existing Azure VMs, to take advantage of this pricing.
2. Contoso will enable Azure Cost Management licensed by Cloudyn, a Microsoft subsidiary. It's a multi-cloud cost management solution that helps to utilize and manage Azure and other cloud resources. [Learn more](https://docs.microsoft.com/azure/cost-management/overview) about Azure Cost Management. 

## Conclusion

In this article, Contoso rehosted the SmartHotel app in Azure by migrating the app VMs to Azure using the Site Recovery service. 
## Next steps

In the next article in the series, we'll show how Contoso rehost the SmartHotel app frontend VM to Azure using the Site Recovery service, and migrate the database to an Azure SQL AlwaysOn availability group.

