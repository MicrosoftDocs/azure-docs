---
title: Rehost a Contoso on-premises app by migrating to an Azure VM and Azure SQL Database Managed Instance | Microsoft Docs
description: Learn how Contoso rehosts an on-premises app on Azure VMs and by using Azure SQL Database Managed Instance.
services: site-recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 07/12/2018
ms.author: raynew

---

# Contoso migration: Rehost an on-premises app on Azure VMs and Azure SQL Database Managed Instance

This article shows you how Contoso migrates its SmartHotel app front-end VM to Azure VMs by using the Azure Site Recovery service and how it migrates the app database to an Azure SQL Database Managed Instance.

> [!NOTE]
> Azure SQL Database Managed Instance currently is in preview.

This article is one in a series of articles that document how the fictitious company Contoso migrates its on-premises resources to the Microsoft Azure cloud. The series includes background information and a series of scenarios that illustrate how to set up a migration infrastructure and run different types of migrations. Scenarios grow in complexity. Articles will be added to the series over time.


Article | Details | Status
--- | --- | ---
[Article 1: Overview](contoso-migration-overview.md) | An overview of Contoso's migration strategy, the article series, and the sample apps that are used in the series. | Available
[Article 2: Deploy an Azure infrastructure](contoso-migration-infrastructure.md) | Contoso prepares its on-premises infrastructure and its Azure infrastructure for migration. The same infrastructure is used for all migration articles. | Available
[Article 3: Assess on-premises resources for migration to Azure](contoso-migration-assessment.md) | Contoso runs an assessment of an on-premises two-tier SmartHotel app running on VMware. Contoso assesses app VMs by using the [Azure Migrate](migrate-overview.md) service. It assesses the app SQL Server database by using [Data Migration Assistant](https://docs.microsoft.com/sql/dma/dma-overview?view=sql-server-2017). | Available
Article 4: Rehost an app on Azure VMs and a SQL Database Managed Instance | Contoso runs a lift-and-shift migration to Azure for the on-premises SmartHotel app. Contoso migrates the app front-end VM by using [Azure Site Recovery](https://docs.microsoft.com/azure/site-recovery/site-recovery-overview). Contoso migrates the app database to an Azure SQL Database Managed Instance (preview) by using the [Azure Database Migration Service](https://docs.microsoft.com/azure/dms/dms-overview). | This article
[Article 5: Rehost an app on Azure VMs](contoso-migration-rehost-vm.md) | Contoso migrates the SmartHotel app VMs to Azure VMs by using the Site Recovery service. | Available
[Article 6: Rehost an app on Azure VMs and SQL Server AlwaysOn availability group](contoso-migration-rehost-vm-sql-ag.md) | Contoso migrates the SmartHotel app. Contoso uses Site Recovery to migrate the app VMs. It uses the Database Migration Service to migrate the app database to a SQL Server cluster that's protected by an AlwaysOn availability group. | Available
[Article 7: Rehost a Linux app on Azure VMs](contoso-migration-rehost-linux-vm.md) | Contoso completes a lift-and-shift migration of the Linux osTicket app to Azure VMs by using Site Recovery. | Available
[Article 8: Rehost a Linux app on Azure VMs and Azure MySQL](contoso-migration-rehost-linux-vm-mysql.md) | Contoso migrates the Linux osTicket app to Azure VMs by using Site Recovery and migrates the app database to an Azure MySQL Server instance by using MySQL Workbench. | Available
[Article 9: Refactor an app in Azure web apps and Azure SQL database](contoso-migration-refactor-web-app-sql.md) | Contoso migrates the SmartHotel app to an Azure web app and migrates the app database to an Azure SQL Server instance. | Available
[Article 10: Refactor a Linux app on Azure web apps and Azure MySQL](contoso-migration-refactor-linux-app-service-mysql.md) | Contoso migrates the Linux osTicket app to Azure web apps in multiple sites, integrated with GitHub for continuous delivery. Contoso migrates the app database to an Azure MySQL instance. | Available
[Article 11: Refactor Team Foundation Services on Visual Studio Team Services](contoso-migration-tfs-vsts.md) | Contoso migrates its on-premises Team Foundation Server deployment by migrating it to Visual Studio Team Services (Team Services) in Azure. | Available
[Article 12: Rearchitect an app on Azure containers and Azure SQL Database](contoso-migration-rearchitect-container-sql.md) | Contoso migrates and rearchitects its SmartHotel app to Azure. Contoso rearchitects the app web tier as a Windows container and rearchitects the app database in an Azure SQL Database. | Available
[Article 13: Rebuild an app in Azure](contoso-migration-rebuild.md) | Contoso rebuilds its SmartHotel app by using a range of Azure capabilities and services, including App Services, Azure Kubernetes Services, Azure Functions, Cognitive Services, and Cosmos DB. | Available


You can download the sample SmartHotel app that's used in this article from [GitHub](https://github.com/Microsoft/SmartHotel360).

## On-premises architecture

Here's a diagram that shows the current Contoso on-premises infrastructure:

![Contoso architecture](./media/contoso-migration-rehost-vm-sql-managed-instance/contoso-architecture.png)  

- Contoso has one main datacenter. The datacenter is located in the city of New York in the Eastern United States.
- Contoso has three additional local branches across the United States.
- The main datacenter is connected to the internet with a fiber Metro Ethernet connection (500 MBps).
- Each branch is connected locally to the internet by using business-class connections with IPsec VPN tunnels back to the main datacenter. The setup allows Contoso's entire network to be permanently connected. It also optimizes internet connectivity.
- The main datacenter is fully virtualized with VMware. Contoso has two ESXi 6.5 virtualization hosts that are managed by vCenter Server 6.5.
- Contoso uses Active Directory for identity management. It uses DNS servers on the internal network.
- The domain controllers in the datacenter run on VMware VMs. The domain controllers at local branches run on physical servers.

## Business drivers

Contoso's IT leadership team has worked closely with the company's business partners to understand what the business wants to achieve with this migration:

- **Address business growth**: Contoso is growing. As a result, pressure has increased on the company's on-premises systems and infrastructure.
- **Increase efficiency**: Contoso needs to remove unnecessary procedures and streamline processes for its developers and users. The business needs IT to be fast and to not waste time or money, so the company can deliver faster on customer requirements.
- **Increase agility**:  Contoso IT needs to be more responsive to the needs of the business. It must be able to react faster than the changes that occur in the marketplace for the company to be successful in a global economy. IT at Contoso must not get in the way or become a business blocker.
- **Scale**: As the company's business grows successfully, Contoso IT must provide systems that can grow at the same pace.

## Migration goals

The Contoso cloud team has identified goals for this migration. The goals are used to determine the best migration method.

- After migration, the app in Azure should have the same performance capabilities that the app has today in Contoso's on-premises VMWare environment. Moving to the cloud doesn't mean that app performance is less critical.
- Contoso doesn’t want to invest in the app. The app is critical and important to the business, but Contoso simply wants to move the app in its current form to the cloud.
- Database administration tasks should be minimized after the app is migrated.
- Contoso doesn't want to use an Azure SQL Database for this app. It's looking for alternatives.

## Proposed architecture

In this scenario:

- Contoso wants to migrate its two-tier on-premises travel app.
- The app is tiered across two VMs (**WEBVM** and **SQLVM**) and located on a VMware ESXi (version 6.5) host: **contosohost1.contoso.com**. 
- The VMware environment is managed by vCenter Server 6.5 (**vcenter.contoso.com**) running on a VM.
- Contoso migrates the app database (SmartHotelDB) to an Azure SQL Database Managed Instance.
- Contoso migrates the on-premises VMware VMs to an Azure VM.
- Contoso has an on-premises datacenter (**contoso-datacenter**) and an on-premises domain controller (**contosodc1**).
- The on-premises VMs in the Contoso datacenter will be decommissioned when the migration is finished.

![Scenario architecture](media/contoso-migration-rehost-vm-sql-managed-instance/architecture.png) 

### Azure services

Service | Description | Cost
--- | --- | ---
[Database Management Service](https://docs.microsoft.com/azure/dms/dms-overview) | The Database Management Service enables seamless migrations from multiple database sources to Azure data platforms with minimal downtime. | Learn about [supported regions](https://docs.microsoft.com/azure/dms/dms-overview#regional-availability) and get [pricing details](https://azure.microsoft.com/pricing/details/database-migration/).
[Azure SQL Database Managed Instance](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance) | Managed Instance is a managed database service that represents a fully managed SQL Server instance in the Azure cloud. It uses the same code as the latest version of SQL Server Database Engine and has the latest features, performance improvements, and security patches. | Using Azure SQL Database Managed Instances running in Azure incurs charges based on capacity. [Learn more](https://azure.microsoft.com/pricing/details/sql-database/managed/). 
[Azure Site Recovery](https://docs.microsoft.com/azure/site-recovery/) | The service orchestrates and manages migration and disaster recovery for Azure VMs and on-premises VMs and physical servers.  | During replication to Azure, Azure Storage charges are incurred.  Azure VMs are created and incur charges when failover occurs. [Learn more](https://azure.microsoft.com/pricing/details/site-recovery/) about charges and pricing.

 ## Migration process

Contoso will migrate both the web and the data tiers of its SmartHotel app to Azure by completing these steps:

1. Contoso already has its Azure infrastructure in place, so it just needs to add a couple of specific Azure components for this scenario.
2. The data tier will be migrated by using the Data Migration Service. Data Migration Service connects to the on-premises SQL Server VM across a site-to-site VPN connection between the Contoso datacenter and Azure. Then, it migrates the database.
3. The web tier will be migrated by using a lift-and-shift migration with Azure Site Recovery. The process entails preparing the on-premises VMware environment, setting up and enabling replication, and migrating the VMs by failing them over to Azure.

     ![Migration architecture](media/contoso-migration-rehost-vm-sql-managed-instance/migration-architecture.png) 

## Prerequisites

Here's what Contoso needs for this scenario.

Requirements | Details
--- | ---
**Enroll in preview** | You must be enrolled in the SQL Database Managed Instance Limited Public Preview. You need an Azure subscription to [sign up](https://portal.azure.com#create/Microsoft.SQLManagedInstance). Signup can take a few days to complete, so make sure you do it before you begin to deploy this scenario.
**Azure subscription** | You should have already created a subscription when  you performed the assessment in the first article in this series. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/).<br/><br/> If you create a free account, you're the administrator of your subscription and can perform all actions.<br/><br/> If you use an existing subscription and you're not the administrator, you need to work with the admin to assign you Owner or Contributor permissions.<br/><br/> If you need more granular permissions, review [this article](../site-recovery/site-recovery-role-based-linked-access-control.md). 
**Site ecovery (on-premises)** | Your on-premises vCenter server should be running version 5.5, 6.0, or 6.5<br/><br/> An ESXi host running version 5.5, 6.0 or 6.5<br/><br/> One or more VMware VMs running on the ESXi host.<br/><br/> VMs must meet [Azure requirements](https://docs.microsoft.com/azure/site-recovery/vmware-physical-azure-support-matrix#azure-vm-requirements).<br/><br/> Supported [network](https://docs.microsoft.com/azure/site-recovery/vmware-physical-azure-support-matrix#network) and [storage](https://docs.microsoft.com/azure/site-recovery/vmware-physical-azure-support-matrix#storage) configuration.
**Database Management Service** | For the Database Management Service, you need a [compatible on-premises VPN device](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpn-devices).<br/><br/> You must be able to configure the on-premises VPN device. It must have an externally facing public IPv4 address, and the address can't be located behind a NAT device.<br/><br/> Make sure you have access to your on-premises SQL Server database.<br/><br/> The Windows Firewall should be able to access the source database engine. [Learn more](https://docs.microsoft.com/sql/database-engine/configure-windows/configure-a-windows-firewall-for-database-engine-access).<br/><br/> If there's a firewall in front of your database machine, add rules to allow access to the database, and to files via SMB port 445.<br/><br/> The credentials used to connect to the source SQL Server and target Managed Instance must be members of the sysadmin server role.<br/><br/> You need a network share in your on-premises database that the Database Management Service can use to back up the source database.<br/><br/> Make sure that the service account running the source SQL Server instance has write privileges on the network share.<br/><br/> Make a note of a Windows user (and password) that has full control privilege on the network share. The Azure Database Migration Service impersonates these user credentials to upload backup files to the Azure Storage container.<br/><br/> The SQL Server Express installation process sets the TCP/IP protocol to **Disabled** by default. Make sure that it's enabled.

## Scenario steps

Here's how Contoso is going to set up the deployment:

> [!div class="checklist"]
> * **Step 1: Set up a SQL Database Managed Instance**: They need a pre-created Managed Instance to which the on-premises SQL Server database will migrate.
> * **Step 2: Prepare the Database Management Service**: They need to register the Database Migration provider, create an instance, and then create a Database Management Service project. They also need to set up SA URI for the Database Management Service. A shared access signature (SAS) Uniform Resource Identifier (URI) provides delegated access to resources in your Storage account, so that you can grant limited permissions to storage objects. They set up an SAS URI so that the Database Management Service can access the Storage account container to which the service uploads the SQL Server back-up files.
> * **Step 3: Prepare Azure for Site Recovery**: For Site Recovery, they must create a Storage account to hold replicated data, and create a Recovery Services vault.
> * **Step 4: Prepare on-premises VMware for Site Recovery**: Contoso will prepare accounts for VM discovery and agent installation, and prepare to connect to Azure VMs after failover.
> * **Step 5: Replicate VMs**: To set up replication, they configure the Site Recovery source and target environment, set up a replication policy, and start replicating VMs to Azure Storage.
> * **Step 6: Migrate the database by using the Database Management Service**: Now they can migrate the database.
> * **Step 7: Migrate the VMs by using Site Recovery**: They run a test failover to make sure everything's working, and then run a full failover to migrate the VMs to Azure.

## Step 1: Prepare a SQL Database Managed Instance

To set up an Azure SQL Database Managed Instance, Contoso needs a subnet:

- The subnet must be dedicated. It must be empty and not contain any other cloud service, and it mustn't be a gateway subnet.
- After the Managed Instance is created, you mustn't add resources to it.
- The subnet mustn't have an NSG associated with it.
- The subnet must have a User Route Table (UDR) with 0.0.0.0/0 Next Hop Internet as the only route assigned to it. 
- Optional custom DNS: If custom DNS is specified on the VNet, Azure's recursive resolvers IP address (such as 168.63.129.16) must be added to the list. [Learn more](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-custom-dns).
- The subnet mustn't have a service endpoint (storage or SQL) associated with it. Service endpoints should be disabled on the virtual network.
- The subnet must have minimum of 16 IP addresses. [Learn more](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-vnet-configuration#determine-the-size-of-subnet-for-managed-instances) about sizing the Managed Instance subnet.
- In Contoso's hybrid environment, custom DNS settings are required. Contoso configures DNS settings to use one or more of the company's Azure DNS servers. Learn more about [DNS customization](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-custom-dns).

### Set up a virtual network for the Managed Instance

Contoso sets up the VNet as follows: 

1. Contoso creates a new VNet (VNET-SQLMI-EU2) in the primary East US 2 region, in the ContosoNetworkingRG resource group.
2. Contoso assigns an address space of 10.235.0.0/24, ensuring that the range doesn't overlap with any other networks in the Contoso enterprise.
2. They add two subnets to the network:
    - SQLMI-DS-EUS2 (10.235.0.0.25)
    - SQLMI-SAW-EUS2 (10.235.0.128/29). This subnet will be used to attach directory to the Managed Instance (SQLMI).

    ![Managed Instance network](media/contoso-migration-rehost-vm-sql-managed-instance/mi-vnet.png)

6. After the VNet and subnets are deployed, Contoso peers networks as follows:

    - Peers VNET-SQLMI-EUS2 with VNET-HUB-EUS2 (the hub VNet for the East US 2).
    - Peers VNET-SQLMI-EUS2 with VNET-PROD-EUS2 (the production network).

    ![Network peering](media/contoso-migration-rehost-vm-sql-managed-instance/mi-peering.png)

7. Contoso sets custom DNS settings. DNS point first to Contoso's Azure domain controllers. Azure DNS is secondary. The Contoso Azure domain controllers are located as follows:

    - Located in the PROD-DC-EUS2 subnet, in the East US 2 production network (VNET-PROD-EUS2)
    - CONTOSODC3 address: 10.245.42.4
    - CONTOSODC4 address: 10.245.42.5
    - Azure DNS resolver: 168.63.129.16

     ![Network DNS](media/contoso-migration-rehost-vm-sql-managed-instance/mi-dns.png)

*Need more help?*

- [Get an overview](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance) of Azure SQL Database Managed Instances.
- Learn how to [create a VNet for a SQL Database Managed Instance](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-vnet-configuration#create-a-new-virtual-network-for-managed-instances).
- Learn how to [set up peering](https://docs.microsoft.com/azure/virtual-network/virtual-network-manage-peering).
- Learn how to [update Azure Active Directory DNS settings](https://docs.microsoft.com/azure/active-directory-domain-services/active-directory-ds-getting-started-dns).

### Set up routing

The Managed Instance is placed in a private VNet. Contoso needs a route table for the VNet to communicate with the Azure Management Service. If the VNet can't communicate with the service that manages it, it becomes inaccessible.

Factors that Contoso considers:

- The route table contains a set of rules (routes) that specify how packets sent from Managed Instance should be routed in the VNet.
- The route table is associated with subnets in which Managed Instances are deployed. Each packet that leaves a subnet is handled based on the associated route table.
- A subnet can be associated with only a single route table.
- There are no additional charges for creating route tables in Microsoft Azure.

 To set up routing:

1. Contoso creates a user-defined route table. Contoso creates the route table in the ContosoNetworkingRG resource group.

    ![Route table](media/contoso-migration-rehost-vm-sql-managed-instance/mi-route-table.png)

2. To comply with Managed Instance requirements, after the route table (**MIRouteTable**) is deployed, Contoso adds a route that has an address prefix of 0.0.0.0/0. The **Next hop type** option is set to **Internet**.

    ![Route table prefix](media/contoso-migration-rehost-vm-sql-managed-instance/mi-route-table-prefix.png)
    
3. Contoso associates the route table with the SQLMI-DB-EUS2 subnet (in the VNET-SQLMI-EUS2 network). 

    ![Route table subnet](media/contoso-migration-rehost-vm-sql-managed-instance/mi-route-table-subnet.png)
    
*Need more help?*

Learn how to [set up routes for a Managed Instance](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-create-tutorial-portal#create-new-route-table-and-a-route).

### Create a Managed Instance

Now, Contoso can provision a SQL Database Managed Instance:

1. Because the Managed Instance serves a business app, Contoso deploys it in the company's primary East US 2 region, in the ContosoRG resource group.
2. Contoso selects a pricing tier, size compute, and storage for the instance. Learn more about [pricing](https://azure.microsoft.com/pricing/details/sql-database/managed/).

    ![Managed Instance](media/contoso-migration-rehost-vm-sql-managed-instance/mi-create.png)

3. After the Managed Instance is deployed, two new resources appear in the ContosoRG resource group:

    - A virtual cluster, in case Contoso has multiple Managed Instances.
    - The SQL Server Database Managed Instance. 

    ![Managed Instance](media/contoso-migration-rehost-vm-sql-managed-instance/mi-resources.png)

*Need more help?*

Learn how to [provision a Managed Instance](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-create-tutorial-portal).

## Step 2: Prepare the Database Management Service

To prepare the Database Management Service, Contoso needs to do a few things:

- Register the Database Management Service provider in Azure.
- Provide the Database Management Service with access to Azure Storage for uploading the backup files used to migrate a database. To provide access to Azure Storage, Contoso creates an Azure Blob storage container. Contoso generates a shared access signature (SAS) URI for the Blob storage container. 
- Create a Database Management Service project.

Then, Contoso completes the following steps:

1. Contoso registers the Database Migration provider under its subscription.
    ![Database Management Service register](media/contoso-migration-rehost-vm-sql-managed-instance/dms-subscription.png)

2. Contoso creates a Blob storage container. Contoso generates an SAS URI so that the Database Management Service can access it.

    ![SAS URI](media/contoso-migration-rehost-vm-sql-managed-instance/dms-sas.png)

3. Finally, Contoso creates a Database Management Service instance. 

    ![Database Management Service instance](media/contoso-migration-rehost-vm-sql-managed-instance/dms-instance.png)

4. Contoso places the Database Management Service instance in the PROD-DC-EUS2 subnet of the VNET-PROD-DC-EUS2 VNet.
    - Contoso places the Database Management Service there because it must be in a VNet that can access the on-premises SQL Server VM via a VPN gateway.
    - The VNET-PROD-EUS2 is peered to VNET-HUB-EUS2 and is allowed to use remote gateways. The remote gateway setting ensures that the Database Management Service can communicate as required.

        ![Database Management Service network](media/contoso-migration-rehost-vm-sql-managed-instance/dms-network.png)

*Need more help?*

- Learn how to [set up the Database Management Service](https://docs.microsoft.com/azure/dms/quickstart-create-data-migration-service-portal).
- Learn how to [create and use SAS](https://docs.microsoft.com/azure/storage/blobs/storage-dotnet-shared-access-signature-part-2).


## Step 3: Prepare Azure for the Site Recovery service

Several Azure elements are required for Contoso to set up Site Recovery for migration of its web tier VM (WEBMV):

- A VNet in which failed-over resources are located.
- A Storage account to hold replicated data. 
- A Recovery Services vault in Azure.

Contoso sets up Site Recovery as follows:

1. Because the VM is a web front end to the SmartHotel app, Contoso will fail over the VM to its existing production network (VNET-PROD-EUS2) and subnet (PROD-FE-EUS2). The network and subnet are located in the primary East US 2 region. Contoso set up the network when it [deployed the Azure infrastructure](contoso-migration-infrastructure.md).
2. Contoso creates a Storage account (contosovmsacc20180528). Contoso is using a general-purpose account, with standard storage and locally redundant storage replication.

    ![Site Recovery storage](media/contoso-migration-rehost-vm-sql-managed-instance/asr-storage.png)

3. With the network and Storage account in place, Contoso creates a vault (ContosoMigrationVault). Contoso places the vault in the ContosoFailoverRG resource group, in the primary East US 2 region.

    ![Recovery Services vault](media/contoso-migration-rehost-vm-sql-managed-instance/asr-vault.png)

*Need more help?*

Learn how to [set up Azure for Site Recovery](https://docs.microsoft.com/azure/site-recovery/tutorial-prepare-azure).


## Step 4: Prepare on-premises VMware for Site Recovery

To prepare VMware for Site Recovery, Contoso must complete these tasks:

- Prepare an account on the vCenter Server instance or vSphere ESXi host. The account automates VM discovery.
- Prepare an account that allows automatic installation of the Mobility Service on VMware VMs that Contoso wants to replicate.
- Prepare on-premises VMs to connect to Azure VMs when they're created after failover.


### Prepare an account for automatic discovery

Site Recovery needs access to VMware servers to:

- Automatically discover VMs. A minimum of a read-only account is required.
- Orchestrate replication, failover, and failback. Contoso needs an account that can run operations such as creating and removing disks and turning on VMs.

Contoso sets up the account by completing these tasks:

1. Creates a role at the vCenter level.
2. Assigns the required permissions to that role.

*Need more help?*

Learn how to [create and assign a role for automatic discovery](https://docs.microsoft.com/azure/site-recovery/vmware-azure-tutorial-prepare-on-premises#prepare-an-account-for-automatic-discovery).

### Prepare an account for Mobility Service installation

The Mobility Service must be installed on the VM that Contoso wants to replicate:

- Site Recovery can do an automatic push installation of this component when Contoso enables replication for the VM.
- For automatic push installation, Contoso needs to prepare an account that Site Recovery will use to access the VM.
- Contoso specifies this account when Contoso sets up replication in the Azure console.
- Contoso needs a domain or local account with permissions to install on the VM.

*Need more help*

Learn how to [create an account for push installation of the Mobility Service](https://docs.microsoft.com/azure/site-recovery/vmware-azure-tutorial-prepare-on-premises#prepare-an-account-for-mobility-service-installation).

### Prepare to connect to Azure VMs after failover

After failover to Azure, Contoso wants to be able to connect to the replicated VMs in Azure. To connect to the replicated VMs in Azure, Contoso must complete a few tasks on the on-premises VM before the migration: 

1. For access over the internet, Contoso enables RDP on the on-premises VM before failover. Contoso ensures that TCP and UDP rules are added for the **Public** profile, and that RDP is allowed in **Windows Firewall** > **Allowed Apps** for all profiles.
2. For access over Contoso's site-to-site VPN, Contoso enables RDP on the on-premises machine. Contoso allows RDP in **Windows Firewall** > **Allowed apps and features** for **Domain and Private** networks.
3. Contoso sets the operating system's SAN policy on the on-premises VM to **OnlineAll**.

In addition, when Contoso runs a failover, it needs to check the items:

- There should be no Windows updates pending on the VM when a failover is triggered. If Windows updates are pending, Contoso won't be able to log in to the virtual machine until the update completes.
- After failover, Contoso should check **Boot diagnostics** to view a screenshot of the VM. If this doesn't work, Contoso should check that the VM is running, and then review these [troubleshooting tips](http://social.technet.microsoft.com/wiki/contents/articles/31666.troubleshooting-remote-desktop-connection-after-failover-using-asr.aspx).

## Step 5: Replicate the on-premises VMs to Azure by using Site Recovery

Before running a migration to Azure, Contoso needs to set up replication and enable replication for their on-premises VM.

### Set a replication goal

1. In the vault, under the vault name (**ContosoVMVault**), Contoso sets a replication goal (**Getting Started** > **Site Recovery** > **Prepare infrastructure**).
2. Contoso specifies that its machines are located on-premises, that they're VMware VMs, and that Contoso wants to replicate to Azure.

    ![Replication goal](./media/contoso-migration-rehost-vm-sql-managed-instance/replication-goal.png)

### Confirm deployment planning

To continue, Contoso needs to confirm that it has completed deployment planning. To confirm, Contoso selects **Yes, I have done it**. In this deployment, Contoso is migrating only a single VM, and doesn't need deployment planning.

### Set up the source environment

Now, Contoso needs to configure its source environment. To do this, Contoso downloads an OVF template. Contoso uses the template to deploy the configuration server and its associated components as a highly available, on-premises VMware VM. Components on the server include:

- The configuration server that coordinates communications between on-premises and Azure. The configuration server manages data replication.
- The process server that acts as a replication gateway. The process server receives replication data; optimizes replication date by using caching, compression, and encryption; and sends replication date to Azure Storage.
- The process server also installs the Mobility Service on VMs that you want to replicate. The process server performs automatic discovery of on-premises VMware VMs.
- After the configuration server VM is created and started, Contoso registers it in the vault.

Contoso completes the following steps:

1. Contoso download the OVF template from the Azure portal (**Prepare Infrastructure** > **Source** > **Configuration Server**).
    
    ![Download OVF](./media/contoso-migration-rehost-vm-sql-managed-instance/add-cs.png)

2. Contoso imports the template into VMware to create and deploy the VM.

    ![OVF template](./media/contoso-migration-rehost-vm-sql-managed-instance/vcenter-wizard.png)

3.  When Contoso turns on the VM for the first time, it boots up into a Windows Server 2016 installation experience. Contoso accepts the license agreement, and enter an administrator password.
4. When the installation finishes, Contoso signs in to the VM as the administrator. At first-time sign-in, the Azure Site Recovery Configuration Tool runs by default.
5. In the tool, Contoso specifies a name to use when registering the configuration server in the vault.
6. The tool checks that the VM can connect to Azure. After the connection is established, Contoso selects **Sign in** to sign in to the Azure subscription. The credentials must have access to the vault in which the configuration server is registered. 

    [Register configuration server](./media/contoso-migration-rehost-vm-sql-managed-instance/config-server-register2.png)

7. The tool performs some configuration tasks and reboots. Contoso signs in to the machine again. The Configuration Server Management Wizard starts automatically.
8. In the wizard, Contoso selects the NIC to receive replication traffic. This setting can't be changed after it's configured.
9. Contoso selects the subscription, resource group, and vault in which to register the configuration server:

    ![vault](./media/contoso-migration-rehost-vm-sql-managed-instance/cswiz1.png)

10. Contoso downloads and installs MySQL Server and VMWare PowerCLI. Then, Contoso validates the server settings.
11. After validation, Contoso specifies the FQDN or IP address of the vCenter Server instance or vSphere host. Contoso leaves the default port and enters a display name for the vCenter Server in Azure.
12. Contoso must specify the account that Contoso created earlier so that Site Recovery can automatically discover VMware VMs that are available for replication. 
13. Contoso specifies the credentials for automatically installing the Mobility Service when replication is enabled. For Windows machines, the account needs local administrator privileges on the VMs. 

    ![vCenter](./media/contoso-migration-rehost-vm-sql-managed-instance/cswiz2.png)

7. When registration finishes, in the Azure portal, Contoso verifies again that the configuration server and VMware server are listed on the **Source** page in the vault. Discovery can take 15 minutes or more. 
8. Site Recovery connects to VMware servers by using the specified settings. Site Recovery discovers VMs.

### Set up the target

Now, Contoso needs to configure the target replication environment:

1. In **Prepare infrastructure** > **Target**, Contoso selects the target settings.
2. Site Recovery checks that there's a Storage account and network in the specified target.

### Create a replication policy

After the source and target are set up, Contoso is ready to create a replication policy, and then associate it with the configuration server:

1. In  **Prepare infrastructure** > **Replication Settings** > **Replication Policy** >  **Create and Associate**, Contoso creates the **ContosoMigrationPolicy** policy.
2. Contoso uses the default settings:
    - **RPO threshold**: Default of 60 minutes. This value defines how often recovery points are created. An alert is generated if continuous replication exceeds this limit.
    - **Recovery point retention**. Default of 24 hours. This value specifies how long the retention window is for each recovery point. Replicated VMs can be recovered to any point in a window.
    - **App-consistent snapshot frequency**. Default of 1 hour. This value specifies the frequency at which application-consistent snapshots are created.
 
    ![Create replication policy](./media/contoso-migration-rehost-vm-sql-managed-instance/replication-policy.png)

5. The policy is automatically associated with the configuration server. 

    ![Associate replication policy](./media/contoso-migration-rehost-vm-sql-managed-instance/replication-policy2.png)

*Need more help?*

- You can read a full walkthrough of all these steps in [Set up disaster recovery for on-premises VMware VMs](https://docs.microsoft.com/azure/site-recovery/vmware-azure-tutorial).
- Detailed instructions are available to help you [set up the source environment](https://docs.microsoft.com/azure/site-recovery/vmware-azure-set-up-source), [deploy the configuration server](https://docs.microsoft.com/azure/site-recovery/vmware-azure-deploy-configuration-server), and [configure replication settings](https://docs.microsoft.com/azure/site-recovery/vmware-azure-set-up-replication).

### Enable replication

Now, Contoso can start replicating the WebVM.

1. In **Replicate application** > **Source** > **Replicate**, Contoso selects the source settings.
2. Contoso indicates that it wants to enable virtual machines, selects the vCenter server, and sets the configuration server:

 ![Enable replication](./media/contoso-migration-rehost-vm-sql-managed-instance/enable-replication1.png)
 
3. Contoso specifies the target settings, including the resource group and network in which the Azure VM will be located after failover. Contoso specifies the Storage account in which replicated data is stored.

     ![Enable replication](./media/contoso-migration-rehost-vm-sql-managed-instance/enable-replication2.png)

4. Contoso selects the WebVM for replication. Site Recovery installs the Mobility Service on each VM when replication is enabled. 

    ![Enable replication](./media/contoso-migration-rehost-vm-sql-managed-instance/enable-replication3.png)

5. Contoso checks that the correct replication policy is selected. Then, it enables replication for WEBVM. Contoso tracks replication progress in **Jobs**. After the **Finalize Protection** job runs, the machine is ready for failover.
6. In **Essentials** in the Azure portal, Contoso can see the structure for the VMs replicating to Azure:

    ![Infrastructure view](./media/contoso-migration-rehost-vm-sql-managed-instance/essentials.png)

*Need more help?*

You can read a full walkthrough of all these steps in [Enable replication](https://docs.microsoft.com/azure/site-recovery/vmware-azure-enable-replication).

## Step 6: Migrate the database by using the Database Management Service

Contoso needs to create a Database Management Service project, and then migrate the database.

### Create a Database Management Service project

1. Contoso creates a Database Management Service project. Contoso specifies the source server type as **SQL Server**. Contoso specifies the target as **Azure SQL Database Managed Instance**.

     ![Database Management Service project](./media/contoso-migration-rehost-vm-sql-managed-instance/dms-project.png)

2. After creating the project, the Migration Wizard opens.

### Migrate the database 

1. In the Migration Wizard, Contoso specifies the source VM on which the on-premises database is located, and the credentials to access it:

    ![Database Management Service source](./media/contoso-migration-rehost-vm-sql-managed-instance/dms-wizard-source.png)

2. Contoso selects the database to migrate (SmartHotel.Registration):

    ![Database Management Service source database](./media/contoso-migration-rehost-vm-sql-managed-instance/dms-wizard-sourcedb.png)

3. As a target, Contoso specifies the name of the Managed Instance in Azure, and the access credentials:

    ![Database Management Service target](./media/contoso-migration-rehost-vm-sql-managed-instance/dms-target-details.png)

4. In **New Activity** > **Run Migration**, Contoso specifies settings to run migration:
    - Source and target credentials.
    - The database to migrate.
    - The network share Contoso created on the on-premises VM. The Database Management Service takes source backups to this share.
        - The service account running the source SQL Server instance must have write privileges on this share.
        - Specify the FQDN path to the share.
    - The SAS URI that provides the Database Management Service with access to the Storage account container to which the service uploads the backup files for migration.

        ![Database Management Service settings](./media/contoso-migration-rehost-vm-sql-managed-instance/dms-migration-settings.png)

5. Contoso saves the migration, and then runs it.
6. In **Overview**, Contoso monitors the migration status.

    ![Database Management Service monitor](./media/contoso-migration-rehost-vm-sql-managed-instance/dms-monitor1.png)

7. When migration is finished, Contoso verifies that the target databases exist on the Managed Instance.

    ![Database Management Service monitor](./media/contoso-migration-rehost-vm-sql-managed-instance/dms-monitor2.png)

## Step 7: Migrate the VM by using Site Recovery

Contoso runs a quick test failover, and then migrates the VM.

### Run a test failover

Before migrating WEBVM, a test failover helps make sure that everything works as expected:

1. Contoso runs a test failover to the latest available point in time (**Latest processed**).
2. Contoso selects **Shut down machine before beginning failover**. With this setting, Site Recovery attempts to shut down the source VM before triggering the failover. Failover continues even if shutdown fails. 
3. Test failover runs: 
    1. A prerequisites check runs to make sure that all the conditions required for migration are in place.
    2. Failover processes the data so that an Azure VM can be created. If the latest recovery point is selected, a recovery point is created from the data.
    3.  Azure VM is created by using the data processed in the preceding step.
3. When the failover finishes, the replica Azure VM appears in the Azure portal. Contoso verifies that everything is working properly. The VM is the appropriate size, it's connected to the correct network, and it's running. 
4. After verifying the test failover, Contoso cleans up the failover. Then, it records and saves any observations. 

### Migrate the VM

1. After verifying that the test failover worked as expected, Contoso creates a recovery plan for migration. Contoso adds WEBVM to the plan:

     ![Recovery plan](./media/contoso-migration-rehost-vm-sql-managed-instance/recovery-plan.png)

2. Contoso runs a failover on the plan. Contoso selects the latest recovery point. Contoso specifies that Site Recovery should try to shut down the on-premises VM before triggering the failover.

    ![Failover](./media/contoso-migration-rehost-vm-sql-managed-instance/failover1.png)

3. After the failover, Contoso verifies that the Azure VM appears as expected in the Azure portal.

   ![Recovery plan](./media/contoso-migration-rehost-vm-sql-managed-instance/failover2.png)

4. After verifying the VM in Azure, Contoso completes the migration to finish the migration process, stop replication for the VM, and stop Site Recovery billing for the VM.

    ![Failover](./media/contoso-migration-rehost-vm-sql-managed-instance/failover3.png)

### Update the connection string

As the final step in the migration process, Contoso updates the connection string of the application to point to the migrated database running on their Managed Instance.

1. In the Azure portal, Contoso finds the connection string by selecting **Settings** > **Connection Strings**.

    ![Failover](./media/contoso-migration-rehost-vm-sql-managed-instance/failover4.png)  

2. Contoso updates the string with the user name and password of the SQL Database Managed Instance.
3. After the string is configured, Contoso replaces the current connection string in the web.config file of their application.
4. After updating the file and saving it, Contoso restarts IIS on WEBVM. Contoso does this by running `IISRESET /RESTART` in a Command Prompt window.
5. After IIS has been restarted, the app uses the database running on the SQL Database Managed Instance.
6. At this point, Contoso can shut down the SQLVM machine on-premises. The migration has been completed.

*Need more help?*

- Learn how to [run a test failover](https://docs.microsoft.com/azure/site-recovery/tutorial-dr-drill-azure). 
- Learn how to [create a recovery plan](https://docs.microsoft.com/azure/site-recovery/site-recovery-create-recovery-plans).
- Learn how to [fail over to Azure](https://docs.microsoft.com/azure/site-recovery/site-recovery-failover).

## Clean up after migration

With the migration complete, the SmartHotel app is running on an Azure VM and the SmartHotel database is available on the Azure SQL Database Managed Instance.  

Now, Contoso needs to do the following cleanup tasks:  

- Remove the WEBVM machine from the vCenter inventory.
- Remove the SQLVM machine from the vCenter inventory.
- Remove WEBVM and SQLVM from local backup jobs.
- Update internal documentation to show the new location and IP address for WEBVM.
- Remove SQLVM from internal documentation. Alternatively, Contoso could mark the documentation to show SQLVM as deleted and no longer in the VM inventory.
- Review any resources that interact with the decommissioned VMs. Update any relevant settings or documentation to reflect the new configuration.

## Review the deployment

With the migrated resources in Azure, Contoso needs to fully operationalize and secure its new infrastructure.

### Security

The Contoso security team reviews the Azure VMs and SQL Database Managed Instance to check for any security issues with its implementation.

- The security team reviews the network security groups that are used to control access for the VM. Network security groups help ensure that only traffic that is allowed to the app can pass.
- Contoso's security team also is considering securing the data on the disk by using Azure Disk Encryption and Azure Key Vault.
- The security team enables threat detection on the SQL Database Managed Instance. Threat detection sends an alert to Contoso's security team/service desk system to open a ticket if a threat is detected. [Learn more](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-threat-detection).

     ![Managed Instance security](./media/contoso-migration-rehost-vm-sql-managed-instance/mi-security.png)  

For more information about security practices for VMs, see [Security best practices for IaaS workloads in Azure](https://docs.microsoft.com/azure/security/azure-security-best-practices-vms#vm-authentication-and-access-control).

### Backups

Contoso backs up the data on WEBVM by using the Azure Backup service. Learn more about [Azure Backup](https://docs.microsoft.com/azure/backup/backup-introduction-to-azure-backup?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

### Licensing and cost optimization

- Contoso has an existing licensing for WEBVM and takes advantage of the Azure Hybrid Benefit. Contoso converts the existing Azure VM to take advantage of this pricing.
- Contoso enables Azure Cost Management licensed by Cloudyn, a Microsoft subsidiary. Cost Management is a multi-cloud cost management solution that helps you utilize and manage Azure and other cloud resources. Learn more about [Azure Cost Management](https://docs.microsoft.com/azure/cost-management/overview). 


## Conclusion

In this article, Contoso rehosts the SmartHotel app in Azure by migrating the app front-end VM to Azure by using the Site Recovery service. Contoso migrates the on-premises database to an Azure SQL Database Managed Instance by using the Azure Database Management Service.

## Next steps

In the next article in the series, Contoso [rehosts the SmartHotel app on Azure VMs](contoso-migration-rehost-vm.md) by using the Azure Site Recovery service.

