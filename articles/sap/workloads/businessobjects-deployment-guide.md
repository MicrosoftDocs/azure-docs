---
title: SAP BusinessObjects BI Platform Deployment on Azure | Microsoft Docs
description: Plan, deploy, and configure SAP BusinessObjects BI Platform on Azure
services: virtual-machines-windows,virtual-network,storage,azure-netapp-files,azure-files
author: dennispadia
manager: juergent
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.workload: infrastructure-services
ms.date: 06/15/2023
ms.author: depadia
---

# SAP BusinessObjects BI platform planning and implementation guide on Azure

The purpose of this guide is to provide guidelines for planning, deploying, and configuring SAP BusinessObjects BI Platform, also known as SAP BOBI Platform on Azure. This guide is intended to cover common Azure services and features that are relevant for SAP BOBI Platform. This guide isn't an exhaustive list of all possible configuration options. It covers solutions common to typical deployment scenarios.

This guide isn't intended to replace the standard SAP BOBI Platform installation and administration guides, operating system, or any database documentation.

## Plan and implement SAP BusinessObjects BI platform on Azure

Microsoft Azure offers a wide range of services including compute, storage, networking, and many others for businesses to build their applications without lengthy procurement cycles. Azure virtual machines (VM) help companies to deploy on-demand and scalable computing resources for different SAP applications like SAP NetWeaver based applications, SAP Hybris, SAP BusinessObjects BI Platform, based on their business need. Azure also supports the cross-premises connectivity, which enables companies to integrate Azure virtual machines into their on-premises domains, their private clouds and their SAP system landscape.

This document provides guidance on planning and implementation consideration for SAP BusinessObjects BI Platform on Azure. It complements the SAP installation documentation and SAP Notes, which represent the primary resources for installations and deployments of SAP BOBI.

### Architecture overview

SAP BusinessObjects BI Platform is a self-contained system that can exist on a single Azure virtual machine or can be scaled into a cluster of many Azure Virtual Machines that run different components. SAP BOBI Platform consists of six conceptual tiers: Client Tier, Web Tier, Management Tier, Storage Tier, Processing Tier, and Data Tier. (For more details on each tier, refer Administrator Guide in [SAP BusinessObjects Business Intelligence Platform](https://help.sap.com/docs/r/product/SAP_BUSINESSOBJECTS_BUSINESS_INTELLIGENCE_PLATFORM/4.3/en-US) help portal). Following is the high-level details on each tier:

- **Client Tier:** It contains all desktop client applications that interact with the BI platform to provide different kind of reporting, analytic, and administrative capabilities.
- **Web Tier:** It contains web applications deployed to Java web application servers. Web applications provide BI Platform functionality to end users through a web browser.
- **Management Tier:** It coordinates and controls all the components that makes the BI Platform. It includes Central Management Server (CMS) and the Event Server and associated services
- **Storage Tier:** It's responsible for handling files, such as documents and reports. It also handles report caching to save system resources when user access reports.
- **Processing Tier:** It analyzes data, and produces reports and other output types. It's the only tier that accesses the databases that contain report data.
- **Data Tier:** It consists of the database servers hosting the CMS system databases and Auditing Data Store.

The SAP BI Platform consists of a collection of servers running on one or more hosts. It's essential that you choose the correct deployment strategy based on the sizing, business need and type of environment. For small installation like development or test, you can use a single Azure Virtual Machine for web application server, database server, and all BI Platform servers. In case you're using Database-as-a-Service (DBaaS) offering from Azure, database server runs separately from other components. For medium and large installation, you can have servers running on multiple Azure virtual machines.

The diagram below illustrates the architecture of a large-scale deployment of the SAP BOBI Platform on Azure virtual machines, with each component distributed. To ensure infrastructure resilience against service disruption, VMs can be deployed using either [flexible scale set](./sap-high-availability-architecture-scenarios.md#virtual-machine-scale-set-with-flexible-orchestration), [availability sets](sap-high-availability-architecture-scenarios.md#multiple-instances-of-virtual-machines-in-the-same-availability-set) or [availability zones](sap-high-availability-architecture-scenarios.md#azure-availability-zones).

![SAP BusinessObjects BI Platform Architecture on Azure](./media/businessobjects-deployment-guide/businessobjects-architecture-on-azure.png)

#### Architecture details

- Load balancer

  In SAP BOBI multi-instance deployment, Web application servers (or web tier) are running on two or more hosts. To distribute user load evenly across web servers, you can use a load balancer between end users and web servers. In Azure, you can either use [Azure Load Balancer](../../load-balancer/load-balancer-overview.md) or [Azure Application Gateway](../../application-gateway/overview.md) to manage traffic to your web servers.

- Web application servers

  The web server hosts the web applications of SAP BOBI Platform like CMC and BI Launch Pad. To achieve high availability for web server, you must deploy at least two web application servers to manage redundancy and load balancing. In Azure, these web application servers can be placed either in flexible scale set, availability zones or availability sets for better availability.

  Tomcat is the default web application for SAP BI Platform. To achieve high availability for tomcat, enable session replication using [Static Membership Interceptor](https://tomcat.apache.org/tomcat-9.0-doc/config/cluster-membership.html#Static_Membership_Attributes) in Azure. It ensures that user can access SAP BI web application even when tomcat service is disrupted.

  > [!Important]
  > By default Tomcat uses multicast IP and Port for clustering which is not supported on Azure (SAP Note [2764907](https://launchpad.support.sap.com/#/notes/2764907)).

- BI platform servers

  BI Platform servers include all the services that are part of SAP BOBI application (management tier, processing tier, and storage tier). When a web server receives a request, it detects each BI platform server (specifically, all CMS servers in a cluster) and automatically load balance their requests. In case if one of the BI Platform hosts fails, web server automatically send requests to other host.

  To achieve high availability or redundancy for BI Platform, you must deploy the application in at least two Azure virtual machines. Based on the sizing, you can scale your BI Platform to run on more Azure virtual machines.

- File repository server (FRS)

  File Repository Server contains all reports and other BI documents that have been created. In multi-instance deployment, BI Platform servers are running on multiple virtual machines and each VM should have access to these reports and other BI documents. So, a filesystem needs to be shared across all BI platform servers.

  In Azure, you can either use [Azure Premium Files](../../storage/files/storage-files-introduction.md) or [Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-introduction.md) for File Repository Server. Both of these Azure services have built-in redundancy.

- CMS & audit database

  SAP BOBI Platform requires a database to store its system data, which is referred as CMS database. It's used to store BI platform information such as user, server, folder, document, configuration, and authentication details.

  Azure offers [MySQL Database](https://azure.microsoft.com/services/mysql/) and [Azure SQL database](https://azure.microsoft.com/services/sql-database/) Database-as-a-Service (DBaaS) offering that can be used for CMS database and Audit database. As this being a PaaS offering, customers don't have to worry about operation, availability, and maintenance of the databases. Customer can also choose their own database for CMS and Audit repository based on their business need.

## Support matrix

This section describes supportability of different SAP BOBI component like SAP BusinessObjects BI Platform version, Operating System and, Databases in Azure.

### SAP BusinessObjects BI platform

Azure Infrastructure as a Service (IaaS) enables you to deploy and configure SAP BusinessObjects BI Platform on Azure Compute. It supports following version of SAP BOBI Platform -

- SAP BusinessObjects BI Platform 4.3
- SAP BusinessObjects BI Platform 4.2 SP04+
- SAP BusinessObjects BI Platform 4.1 SP05+

The SAP BI Platform runs on different operating system and databases. Supportability of SAP BOBI platform between Operating System and Database version can be found in [Product Availability Matrix](https://userapps.support.sap.com/sap/support/pam) for SAP BOBI.

### Operating system

Azure supports following operating systems for SAP BusinessObjects BI Platform deployment.

- Microsoft Windows Server
- SUSE Linux Enterprise Server (SLES)
- Red Hat Enterprise Linux (RHEL)
- Oracle Linux (OL)

The operating system version that is listed in [Product Availability Matrix (PAM) for SAP BusinessObjects BI Platform](https://support.sap.com/pam) are supported as long as they're compatible to run on Azure Infrastructure.

### Databases

The BI Platform needs database for CMS and Auditing Data store, which can be installed on any supported databases that are listed in [SAP Product Availability Matrix](https://support.sap.com/pam) that includes the following -

- Microsoft SQL Server

- [Azure SQL Database](https://azure.microsoft.com/services/sql-database/) (Supported database only for SAP BOBI Platform on Windows)

  It's a fully managed SQL Server database engine, based on the latest stable Enterprise Edition of SQL Server. Azure SQL database handles most of the database management functions such as upgrading, patching, and monitoring without user involvement. With Azure SQL Database, you can create a highly available and high-performance data storage layer for the applications and solutions in Azure. For more details, check [Azure SQL Database](/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview) documentation.

- [Azure Database for MySQL](https://azure.microsoft.com/services/mysql/) (Follow same compatibility guidelines as mentioned for MySQL AB in SAP PAM)

  It's a relational database service powered by the MySQL community edition. Being a fully managed Database-as-a-Service (DBaaS) offering, it can handle mission-critical workloads with predictable performance and dynamic scalability. It has built-in high availability, automatic backups, software patching, automatic failure detection, and point-in-time restore for up to 35 days, which substantially reduce operation tasks. For more details, check [Azure Database for MySQL](../../mysql/single-server/overview.md) documentation.

- SAP HANA

- SAP ASE

- IBM DB2

- Oracle (For version and restriction, check SAP Note [2039619](https://launchpad.support.sap.com/#/notes/2039619))

- MaxDB

This document illustrates the guidelines to deploy **SAP BOBI Platform on Windows with Azure SQL Database** and **SAP BOBI Platform on Linux with Azure Database for MySQL**. It's also our recommended approach for running SAP BusinessObjects BI Platform on Azure.

## Sizing

Sizing is a process of determining the hardware requirement to run the application efficiently. For SAP BOBI Platform, sizing needs to be done using SAP sizing tool called [Quick Sizer](https://www.sap.com/about/benchmark/sizing.quick-sizer.html#quick-sizer). The tool provides the SAPS based on the input, which then needs to be mapped to certified Azure virtual machines types for SAP. SAP Note [1928533](https://launchpad.support.sap.com/#/notes/1928533) provides the list of supported SAP products and Azure VM types along with SAPS. For more information on sizing, check [SAP BI Sizing Guide](https://wiki.scn.sap.com/wiki/display/BOBJ/Sizing+and+Deploying+SAP+BusinessObjects+BI+4.x+Platform+and+Add-Ons).

For storage need for SAP BOBI Platform, Azure offers different types of [Managed Disks](../../virtual-machines/managed-disks-overview.md). For SAP BOBI Installation directory, it's recommended to use premium managed disk and for the database that runs on virtual machines, follow the guidance that is provided in [DBMS deployment for SAP workload](dbms-guide-general.md).

Azure supports two DBaaS offering for SAP BOBI Platform data tier - [Azure SQL Database](https://azure.microsoft.com/services/sql-database) (BI Application running on Windows) and [Azure Database for MySQL](https://azure.microsoft.com/services/mysql) (BI Application running on Linux and Windows). So based on the sizing result, you can choose purchasing model that best fits your need.

> [!TIP]
> For quick sizing reference, consider 800 SAPS = 1 vCPU while mapping the SAPS result of SAP BOBI Platform database tier to Azure Database-as-a-Service (Azure SQL Database or Azure Database for MySQL).

### Sizing models for Azure SQL database

Azure SQL Database offers the following three purchasing models:

- vCore-based

  It lets you choose the number of vCores, amount of memory, and the amount and speed of storage. The vCore-based purchasing model also allows you to use [Azure Hybrid Benefit for SQL Server](https://azure.microsoft.com/pricing/hybrid-benefit/) to gain cost savings. This model is suited for customer who value flexibility, control, and transparency.

  There are three [Service Tier Options](/azure/azure-sql/database/service-tiers-vcore#service-tiers) being offered in vCore model that includes - General Purpose, Business Critical, and Hyperscale. The service tier defines the storage architecture, space, I/O limits, and business continuity options related to availability and disaster recovery. Following is high-level details on each service tier option -

  1. **General Purpose** service tier is best suited for Business workloads. It offers budget-oriented, balanced, and scalable compute and storage options. For more information, refer [Resource options and limits](/azure/azure-sql/database/resource-limits-vcore-single-databases#general-purpose---provisioned-compute---gen5).
  2. **Business Critical** service tier offers business applications the highest resilience to failures by using several isolated replicas, and provides the highest I/O performance per database replica. For more information, refer [Resource options and limits](/azure/azure-sql/database/resource-limits-vcore-single-databases#business-critical---provisioned-compute---gen5).
  3. **Hyperscale** service tier is best for business workloads with highly scalable storage and read-scale requirements. It offers higher resilience to failures by allowing configuration of more than one isolated database replica. For more information, refer [Resource options and limits](/azure/azure-sql/database/resource-limits-vcore-single-databases#hyperscale---provisioned-compute---gen5).

- DTU-based

  The DTU-based purchasing model offers a blend of compute, memory, and I/O resources in three service tiers, to support light and heavy database workloads. Compute sizes within each tier provide a different mix of these resources, to which you can add additional storage resources. It's best suited for customers who want simple, preconfigure resource options.

  [Service Tiers](/azure/azure-sql/database/service-tiers-dtu#compare-service-tiers) in the DTU-based purchasing model is differentiated by a range of compute sizes with a fixed amount of included storage, fixed retention period of backups, and fixed price.

- Serverless

  The serverless model automatically scales compute based on workload demand, and bills for the amount of compute used per second. The serverless compute tier automatically pauses databases during inactive periods when only storage is billed, and automatically resumes databases when activity returns. For more information, refer [Resource options and limits](/azure/azure-sql/database/resource-limits-vcore-single-databases#general-purpose---serverless-compute---gen5).

  It's more suitable for intermittent, unpredictable usage with low average compute utilization over time. So this model can be used for nonproduction SAP BOBI deployment.

> [!NOTE]
> For SAP BOBI, it's convenient to use vCore based model and choose either General Purpose or Business Critical service tier based on the business need.

### Sizing models for Azure database for MySQL

Azure Database for MySQL comes with three different pricing tiers. They're differentiated by the amount of compute in vCores, memory per vCore, and the storage technology used to store the date. Following is the high-level details on the options and for more details on different attributes, refer [Pricing Tier](../../mysql/single-server/concepts-pricing-tiers.md) for Azure Database for MySQL.

- Basic

  It's used for the target workloads that require light compute and I/O performance.

- General Purpose

  It's suited for most business workloads that require balanced compute and memory with scalable I/O throughput.

- Memory Optimized

  For high-performance database workloads that require in-memory performance for faster transaction processing and higher concurrency.

> [!NOTE]
> For SAP BOBI, it is convenient to use General Purpose or Memory Optimized pricing tier based on the business workload.

## Azure resources

### Choosing regions

Azure region is one or a collection of data-centers that contains the infrastructure to run and hosts different Azure Services. This infrastructure includes large number of nodes that function as compute nodes or storage nodes, or run network functionality. Not all region offers the same services.

SAP BI Platform contains different components that might require specific VM types, Storage like Azure Files or Azure NetApp Files or Database as a Service (DBaaS) for its data tier that might not be available in certain regions. You can find out the exact information on VM types, Azure Storage types or, other Azure Services in [Products available by region](https://azure.microsoft.com/global-infrastructure/services/) site. If you're already running your SAP systems on Azure, probably you have your region identified. In that case, you need to first investigate that the necessary services are available in those regions to decide the architecture of SAP BI Platform.

### Virtual machine scale sets with flexible orchestration

[Virtual machine scale sets](../../virtual-machine-scale-sets/overview.md) with flexible orchestration provide a logical grouping of platform-managed virtual machines. You have an option to create scale set within region or span it across availability zones. On creating, the flexible scale set within a region with platformFaultDomainCount>1 (FD>1), the VMs deployed in the scale set would be distributed across specified number of fault domains in the same region. On the other hand, creating the flexible scale set across availability zones with platformFaultDomainCount=1 (FD=1) would distribute VMs across specified zone and the scale set would also distribute VMs across different fault domains within the zone on a best effort basis.

**For SAP workload only flexible scale set with FD=1 is supported.** The advantage of using flexible scale sets with FD=1 for cross zonal deployment, instead of traditional availability zone deployment is that the VMs deployed with the scale set would be distributed across different fault domains within the zone in a best-effort manner. To learn more about SAP workload deployment with scale set, see [flexible virtual machine scale deployment guide](./sap-high-availability-architecture-scenarios.md).

### Availability zones

Availability Zones are physically separate locations within an Azure region. Each Availability Zone is made of one or more datacenters equipped with independent power, cooling, and networking.

To achieve high availability on each tier for SAP BI Platform, you can distribute VMs across Availability Zone by implementing high availability framework, which can provide the best SLA in Azure. For Virtual Machine SLA in Azure, check the latest version of [Virtual Machine SLAs](https://azure.microsoft.com/support/legal/sla/virtual-machines/).

For data tier, Azure Database as a Service (DBaaS) service provides high availability framework by default. You just need to select the region and service inherent high availability, redundancy, and resiliency capabilities to mitigate database downtime from planned and unplanned outages, without requiring you to configure any additional components. For more details on the SLA for supported DBaaS offering on Azure, check [High availability in Azure Database for MySQL](../../mysql/single-server/concepts-high-availability.md) and [High availability for Azure SQL Database](/azure/azure-sql/database/high-availability-sla).

### Availability sets

Availability set is a logical grouping capability for isolating Virtual Machine (VM) resources from each other on being deployed. Azure makes sure of the VMs you place within an Availability Set run across multiple physical servers, compute racks, storage units, and network switches. If a hardware or software failure happens, only a subset of your VMs is affected and your overall solution stays operational. So when virtual machines are placed in availability sets, Azure Fabric Controller distributes the VMs over different [Fault](https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/sap/workloads/planning-guide.md#fault-domains) and [Upgrade](https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/sap/workloads/planning-guide.md#upgrade-domains) domains to prevent all VMs from being inaccessible because of infrastructure maintenance or failure within one Fault domain.

SAP BI Platform contains many different components and while designing the architecture you have to make sure that each of this component is resilient of any disruption. It can be achieved by placing Azure virtual machines of each component within availability sets. Keep in mind, when you mix VMs of different VM families within one availability set, you may come across problems that prevent you to include a certain VM type into such availability set. So have separate availability set for Web Application, BI Application for SAP BI Platform as highlighted in Architecture Overview.

Also the number of update and fault domains that can be used by an Azure Availability Set within an Azure Scale unit is finite. So if you keep adding VMs to a single availability set, two or more VMs will eventually end in the same fault or update domain. For more information, see the [Azure Availability Sets](https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/sap/workloads/planning-guide.md#azure-availability-sets) section of the Azure virtual machines planning and implementation for SAP document.

To understand the concept of Azure availability sets and the way availability sets relate to Fault and Upgrade Domains, read [manage availability](../../virtual-machines/availability.md) article.

> [!IMPORTANT]
>
> - The concepts of Azure availability zones and Azure availability sets are mutually exclusive. You can deploy a pair or multiple VMs into either a specific availability zone or an availability set, but you can't do both.
> - If you planning to deploy across availability zones, it is advised to use [flexible scale set with FD=1](./virtual-machine-scale-set-sap-deployment-guide.md) over standard availability zone deployment.

### Virtual machines

Azure Virtual Machine is a service offering that enables you to deploy custom images to Azure as Infrastructure-as-a-Service (IaaS) instances. It simplifies maintaining and operating applications by providing on-demand compute and storage to host, scale, and manage web application and connected applications.

Azure offers varieties of virtual machines for all your application needs. But for SAP workload, Azure has narrowed the selection to different VM families that are suitable for SAP workload and SAP HANA workload more specifically. For more insight, check [What SAP software is supported for Azure deployments](supported-product-on-azure.md).

Based on the SAP BI Platform sizing, you need to map your requirement to Azure Virtual Machine, which is supported in Azure for SAP product. SAP Note [1928533](https://launchpad.support.sap.com/#/notes/1928533) is a good starting point that list out supported Azure VM types for SAP Products on Windows and Linux. Also a point to keep in mind that beyond the selection of purely supported VM types, you also need to check whether those VM types are available in specific region. You can check the availability of VM type on [Products available by region](https://azure.microsoft.com/global-infrastructure/services/) page. For choosing the pricing model, you can refer to [Azure virtual machines for SAP workload](planning-guide.md#azure-virtual-machines-for-sap-workload)

### Storage

Azure Storage is an Azure-managed cloud service that provides storage that is highly available, secure, durable, scalable, and redundant. Some of the storage types have limited use for SAP scenarios. But several Azure Storage types are well suited or optimized for specific SAP workload scenarios. For more information, refer [Azure Storage types for SAP Workload](planning-guide-storage.md) guide, as it highlights different storage options that are suited for SAP.

Azure Storage has different Storage types available for customers and details for the same can be read in the article [What disk types are available in Azure?](../../virtual-machines/disks-types.md). SAP BOBI Platform uses following Azure Storage to build the application -

- Azure-managed disks

  It's a block-level storage volume that is managed by Azure. You can use the disks for SAP BOBI Platform application servers and databases, when installed on Azure virtual machines. There are different types of [Azure Managed Disks](../../virtual-machines/managed-disks-overview.md) available, but it's recommended to use [Premium SSDs](../../virtual-machines/disks-types.md#premium-ssds) for SAP BOBI Platform application and database.

  In below example, Premium SSDs are used for BOBI Platform installation directory. For database installed on virtual machine, you can use managed disks for data and log volume as per the guidelines. CMS and Audit databases are typically small and it doesn’t have the same storage performance requirements as that of other SAP OLTP/OLAP databases.

- Azure Premium Files or Azure NetApp Files

  In SAP BOBI Platform, File Repository Server (FRS) refers to the disk directories where contents like reports, universes, and connections are stored which are used by all application servers of that system. [Azure Premium Files](../../storage/files/storage-files-introduction.md) or [Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-introduction.md) storage can be used as a shared file system for SAP BOBI applications FRS. As this storage offering isn't available all regions, refer to [Products available by region](https://azure.microsoft.com/global-infrastructure/services/) site to find out up-to-date information.

  If the service is unavailable in your region, you can create NFS server from which you can share the file system to SAP BOBI application. But you'll also need to consider its high availability.

![SAP BusinessObjects BI Platform Storage Layout on Azure](media/businessobjects-deployment-guide/businessobjects-storage-layout.png)

### Networking

SAP BOBI is a reporting and analytics BI platform that doesn’t hold any business data. So the system is connected to other database servers from where it fetches all the data and provide insight to users. Azure provides a network infrastructure, which allows the mapping of all scenarios that can be realized with SAP BI Platform like connecting to on-premises system, systems in different virtual network and others. For more information check [Microsoft Azure Networking for SAP Workload](planning-guide.md#azure-networking).

For Database-as-a-Service offering, any newly created database (Azure SQL Database or Azure Database for MySQL) has a firewall that blocks all external connections. To allow access to the DBaaS service from BI Platform virtual machines, you need to specify one or more server-level firewall rules to enable access to your DBaaS server. For more information, see [Firewall rules](../../mysql/single-server/concepts-firewall-rules.md) for Azure Database for MySQL and [Network Access Controls](/azure/azure-sql/database/network-access-controls-overview) section for Azure SQL database.

## Next steps

- [SAP BusinessObjects BI Platform Deployment on Linux](businessobjects-deployment-guide-linux.md)
- [Azure Virtual Machines planning and implementation for SAP](planning-guide.md)
- [Azure Virtual Machines deployment for SAP](deployment-guide.md)
- [Azure Virtual Machines DBMS deployment for SAP](./dbms-guide-general.md)
