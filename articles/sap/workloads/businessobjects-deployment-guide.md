---
title: SAP BusinessObjects BI platform on Azure overview
description: Learn about the architecture, components, Azure resources, and sizing considerations for SAP BusinessObjects BI platform on Azure.
author: dennispadia
manager: juergent
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: concept-article
ms.date: 03/20/2026
ms.author: depadia
# Customer intent: As an IT administrator, I want to plan and deploy the SAP BusinessObjects BI platform on Azure so that I can use Azure's scalable resources and connectivity to enhance business intelligence reporting and analytics within my organization.
---

# SAP BusinessObjects BI platform on Azure overview

SAP BusinessObjects BI (BOBI) platform is a business intelligence platform for reporting, analytics, and data visualization. When you deploy SAP BOBI platform on Azure, you can use scalable compute, managed storage, and database services to simplify deployment and reduce operational overhead.

This article helps you plan, deploy, and configure SAP BOBI platform on Azure by covering common deployment scenarios and the Azure services that support them.

## Architecture and deployment considerations

Microsoft Azure offers a wide range of services, including compute, storage, and networking, so you can build applications without lengthy procurement cycles. Azure virtual machines (VMs) help you deploy on-demand and scalable computing resources for different SAP applications. These applications include SAP NetWeaver-based applications, SAP Hybris, and SAP BusinessObjects BI platform based on your business needs. Azure also supports cross-premises connectivity, which enables you to integrate Azure VMs into your on-premises domains, private clouds, and SAP system landscape.

This section provides guidance on planning and implementation considerations for SAP BusinessObjects BI platform on Azure. It complements the SAP installation documentation and SAP Notes, which represent the primary resources for installations and deployments of SAP BOBI.

### Architecture overview

SAP BusinessObjects BI platform can run on a single Azure VM or scale into a multi‑VM cluster with distributed components. SAP BOBI platform consists of six conceptual tiers. For more information about each tier, see the [SAP BusinessObjects Business Intelligence Platform Guide](https://help.sap.com/docs/r/product/SAP_BUSINESSOBJECTS_BUSINESS_INTELLIGENCE_PLATFORM/4.3/en-US). The following list provides high-level details on each tier:

- **Client Tier:** Contains all desktop client applications that interact with the BI platform to provide different kinds of reporting, analytic, and administrative capabilities.
- **Web Tier:** Contains web applications deployed to Java web application servers. Web applications provide BI platform functionality to users through a web browser.
- **Management Tier:** Coordinates and controls all the components that make up the BI platform. It includes Central Management Server (CMS) and the Event Server and associated services.
- **Storage Tier:** Handles files, such as documents and reports. It also handles report caching to save system resources when users access reports.
- **Processing Tier:** Analyzes data and produces reports and other output types. It's the only tier that accesses the databases that contain report data.
- **Data Tier:** Consists of the database servers hosting the CMS system databases and Auditing Data Store.

The SAP BI platform consists of a collection of servers running on one or more hosts. It's essential that you choose the correct deployment strategy based on sizing, business need, and type of environment. For small installations, such as development or test, you can use a single Azure VM for the web application server, database server, and all BI platform servers. If you're using a Database-as-a-Service (DBaaS) offering from Azure, the database server runs separately from other components. For medium and large installations, you can have servers running on multiple Azure VMs.

The following diagram illustrates the architecture of a large-scale deployment of the SAP BOBI platform on Azure VMs, with each component distributed. To ensure infrastructure resilience against service disruption, you can deploy VMs by using either [flexible scale sets](./sap-high-availability-architecture-scenarios.md#virtual-machine-scale-set-with-flexible-orchestration), [availability sets](sap-high-availability-architecture-scenarios.md#multiple-instances-of-virtual-machines-in-the-same-availability-set), or [availability zones](sap-high-availability-architecture-scenarios.md#azure-availability-zones).

:::image type="content" source="./media/businessobjects-deployment-guide/businessobjects-architecture-on-azure.png" alt-text="Diagram that shows SAP BusinessObjects BI platform architecture on Azure.":::

#### Architecture details

- **Load balancer**

  In SAP BOBI multi-instance deployment, web application servers (or web tier) run on two or more hosts. To distribute user load evenly across web servers, you can use a load balancer between users and web servers. In Azure, you can use either [Azure Load Balancer](../../load-balancer/load-balancer-overview.md) or [Azure Application Gateway](../../application-gateway/overview.md) to manage traffic to your web servers.

- **Web application servers**

  The web server hosts the web applications of SAP BOBI platform, like Central Management Console (CMC) and BI Launch Pad. To achieve high availability for the web server, you must deploy at least two web application servers to manage redundancy and load balancing. In Azure, these web application servers can be placed in a flexible scale set, availability zones, or availability sets for better availability.

  Tomcat is the default web application for SAP BI platform. To achieve high availability for Tomcat, enable session replication by using [Static Membership Interceptor](https://tomcat.apache.org/tomcat-9.0-doc/config/cluster-membership.html#Static_Membership_Attributes) in Azure. This configuration ensures that a user can access the SAP BI web application even when the Tomcat service is disrupted.

  > [!IMPORTANT]
  > By default, Tomcat uses multicast IP and Port for clustering, which isn't supported on Azure (SAP Note [2764907](https://launchpad.support.sap.com/#/notes/2764907)).

- **BI platform servers**

  BI platform servers include all the services that are part of the SAP BOBI application (management tier, processing tier, and storage tier). When a web server receives a request, it detects each BI platform server (specifically, all CMS servers in a cluster) and automatically load-balances requests. If one of the BI platform hosts fails, the web server automatically sends requests to another host.

  To achieve high availability or redundancy for the BI platform, you must deploy the application in at least two Azure VMs. Based on sizing, you can scale your BI platform to run on more Azure VMs.

- **File repository server (FRS)**

  File Repository Server contains all reports and other BI documents that are created. In multi-instance deployment, BI platform servers run on multiple VMs, and each VM must have access to these reports and other BI documents. A file system needs to be shared across all BI platform servers.

  In Azure, you can use either [Azure Premium Files](../../storage/files/storage-files-introduction.md) or [Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-introduction.md) for File Repository Server. Both of these Azure services have built-in redundancy.

- **CMS and audit database**

  SAP BOBI platform requires a database to store its system data, which is referred to as the CMS database. It stores BI platform information such as user, server, folder, document, configuration, and authentication details.

  Azure offers [Azure Database for MySQL](https://azure.microsoft.com/services/mysql/) and [Azure SQL Database](https://azure.microsoft.com/services/sql-database/) as DBaaS offerings for the CMS database and Audit database. As DBaaS offerings, you don't have to worry about operation, availability, and maintenance of the databases. You can also choose your own database for CMS and Audit repository based on your business needs.

## Support matrix

This section describes the supportability of different SAP BOBI components, including SAP BusinessObjects BI platform versions, operating systems, and databases in Azure.

### SAP BusinessObjects BI platform

Azure Infrastructure as a Service (IaaS) enables you to deploy and configure SAP BusinessObjects BI platform on Azure Compute. It supports the following versions of SAP BOBI platform:

- SAP BusinessObjects BI Platform 4.3
- SAP BusinessObjects BI Platform 4.2 SP04+
- SAP BusinessObjects BI Platform 4.1 SP05+

The SAP BI platform runs on different operating systems and databases. For information about supported combinations of SAP BOBI platform, operating system, and database versions, see the [Product Availability Matrix](https://userapps.support.sap.com/sap/support/pam) for SAP BOBI.

### Operating system

Azure supports the following operating systems for SAP BusinessObjects BI platform deployment:

- Microsoft Windows Server
- SUSE Linux Enterprise Server (SLES)
- Red Hat Enterprise Linux (RHEL)
- Oracle Linux (OL)

The operating system versions that are listed in the [Product Availability Matrix (PAM) for SAP BusinessObjects BI Platform](https://support.sap.com/pam) are supported as long as they're compatible to run on Azure infrastructure.

### Databases

The BI platform depends on a database for the CMS and auditing data store. The supported database options are defined in the [SAP Product Availability Matrix](https://support.sap.com/pam). Supported databases include:

- Microsoft SQL Server

- [Azure SQL Database](https://azure.microsoft.com/services/sql-database/) (supported only for SAP BOBI platform on Windows)

  Azure SQL Database is a fully managed SQL Server database engine, based on the latest stable Enterprise Edition of SQL Server. Azure SQL Database handles most of the database management functions such as upgrading, patching, and monitoring without user involvement. With Azure SQL Database, you can create a highly available and high-performance data storage layer for the applications and solutions in Azure. For more information, see the [Azure SQL Database](/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview) documentation.

- [Azure Database for MySQL](https://azure.microsoft.com/services/mysql/) (follow the same compatibility guidelines as mentioned for MySQL AB in SAP PAM)

  Azure Database for MySQL is a relational database service powered by the MySQL community edition. As a fully managed Database-as-a-Service (DBaaS) offering, it can handle mission-critical workloads with predictable performance and dynamic scalability. It has built-in high availability, automatic backups, software patching, automatic failure detection, and point-in-time restore for up to 35 days, which substantially reduce operation tasks. For more information, see the [Azure Database for MySQL](/azure/mysql/single-server/overview) documentation.

- SAP HANA

- SAP ASE

- IBM DB2

- Oracle (For version and restriction, check SAP Note [2039619](https://launchpad.support.sap.com/#/notes/2039619))

- MaxDB

This article describes the guidelines to deploy **SAP BOBI platform on Windows with Azure SQL Database** and **SAP BOBI platform on Linux with Azure Database for MySQL**. It's also the recommended approach for running SAP BusinessObjects BI platform on Azure.

## Sizing

Sizing is the process of determining the hardware requirements to run the application efficiently. For the SAP BOBI platform, use the SAP sizing tool called [Quick Sizer](https://www.sap.com/about/benchmark/sizing.quick-sizer.html#quick-sizer). The tool provides SAPS based on the input, which you then map to certified Azure VM types for SAP. SAP Note [1928533](https://launchpad.support.sap.com/#/notes/1928533) provides the list of supported SAP products and Azure VM types along with SAPS. For more information about sizing, see the [SAP BI Sizing Guide](https://wiki.scn.sap.com/wiki/display/BOBJ/Sizing+and+Deploying+SAP+BusinessObjects+BI+4.x+Platform+and+Add-Ons).

For the storage needs of SAP BOBI platform, Azure offers different types of [managed disks](/azure/virtual-machines/managed-disks-overview). For the SAP BOBI installation directory, use a premium managed disk. For the database that runs on VMs, follow the guidance in [DBMS deployment for SAP workload](dbms-guide-general.md).

Azure supports two DBaaS offerings for the SAP BOBI platform data tier: [Azure SQL Database](https://azure.microsoft.com/services/sql-database) (BI application running on Windows) and [Azure Database for MySQL](https://azure.microsoft.com/services/mysql) (BI application running on Linux and Windows). Based on the sizing result, you can choose the purchasing model that best fits your need.

> [!TIP]
> For quick sizing reference, consider 800 SAPS = 1 vCPU while mapping the SAPS result of SAP BOBI Platform database tier to Azure Database-as-a-Service (Azure SQL Database or Azure Database for MySQL).

### Sizing models for Azure SQL database

Azure SQL Database offers the following three purchasing models:

- **vCore-based**

  The vCore-based model lets you choose the number of vCores, amount of memory, and the amount and speed of storage. The vCore-based purchasing model also lets you use [Azure Hybrid Benefit for SQL Server](https://azure.microsoft.com/pricing/hybrid-benefit/) to gain cost savings. This model is suited for you if you value flexibility, control, and transparency.

  Three [service tier options](/azure/azure-sql/database/service-tiers-vcore#service-tiers) are offered in the vCore model: General Purpose, Business Critical, and Hyperscale. The service tier defines the storage architecture, space, I/O limits, and business continuity options related to availability and disaster recovery. The following list provides high-level details on each service tier option:

  - **General Purpose** service tier is best suited for business workloads. It offers budget-oriented, balanced, and scalable compute and storage options. For more information, see [Resource options and limits](/azure/azure-sql/database/resource-limits-vcore-single-databases#general-purpose---provisioned-compute---gen5).
  - **Business Critical** service tier offers business applications the highest resilience to failures by using several isolated replicas, and provides the highest I/O performance per database replica. For more information, see [Resource options and limits](/azure/azure-sql/database/resource-limits-vcore-single-databases#business-critical---provisioned-compute---gen5).
  - **Hyperscale** service tier is best for business workloads with highly scalable storage and read-scale requirements. It offers higher resilience to failures by allowing configuration of more than one isolated database replica. For more information, see [Resource options and limits](/azure/azure-sql/database/resource-limits-vcore-single-databases#hyperscale---provisioned-compute---gen5).

- **DTU-based**

  The DTU-based purchasing model offers a blend of compute, memory, and I/O resources in three service tiers, to support light and heavy database workloads. Compute sizes within each tier provide a different mix of these resources, to which you can add more storage resources. This model is best suited if you want simple, preconfigured resource options.

  DTU‑based [service tiers](/azure/azure-sql/database/service-tiers-dtu#compare-service-tiers) differ by compute size with a fixed resource allocation for:

  - Included storage
  - Retention period of backups
  - Pricing

- **Serverless**

  The serverless model automatically scales compute based on workload demand and bills for the amount of compute used per second. The serverless compute tier automatically pauses databases during inactive periods when only storage is billed, and automatically resumes databases when activity returns. For more information, see [Resource options and limits](/azure/azure-sql/database/resource-limits-vcore-single-databases#general-purpose---serverless-compute---gen5).

  The serverless model is more suitable for intermittent, unpredictable usage with low average compute utilization over time. You can use this model for nonproduction SAP BOBI deployment.

> [!NOTE]
> For SAP BOBI, it's convenient to use the vCore-based model and choose either General Purpose or Business Critical service tier based on the business need.

### Sizing models for Azure Database for MySQL

Azure Database for MySQL comes with three different pricing tiers. They differ based on the number of vCores, the amount of memory per vCore, and the storage technology used for data storage. The following list provides high-level details on the options. For more information about different attributes, see the [pricing tier](/azure/mysql/single-server/concepts-pricing-tiers) documentation for Azure Database for MySQL.

- **Basic**: Used for target workloads that require light compute and I/O performance.

- **General Purpose**: Suited for most business workloads that require balanced compute and memory with scalable I/O throughput.

- **Memory Optimized**: Designed for high-performance database workloads that require in-memory performance for faster transaction processing and higher concurrency.

> [!NOTE]
> For SAP BOBI, it's convenient to use General Purpose or Memory Optimized pricing tier based on the business workload.

## Azure resources

### Region selection

An Azure region is one or a collection of datacenters that contains the infrastructure to run and host different Azure services. This infrastructure includes a large number of nodes that function as compute nodes or storage nodes, or run network functionality. Not all regions offer the same services.

Some SAP BI platform components depend on specific VM types, storage services like Azure Files or Azure NetApp Files, or DBaaS for the data tier that may not be available in certain regions. You can find the exact information on VM types, Azure Storage types, or other Azure services on the [Products available by region](https://azure.microsoft.com/global-infrastructure/services/) site. If you're already running your SAP systems on Azure, then your region is identified. In that case, first investigate that the necessary services are available in those regions to decide the architecture of SAP BI platform.

### Virtual machine scale sets with flexible orchestration

[Virtual machine scale sets](/azure/virtual-machine-scale-sets/overview) with flexible orchestration provide a logical grouping of platform-managed VMs. You can create a scale set within a region or span it across availability zones. When you create a flexible scale set within a region and set `platformFaultDomainCount` to a value greater than `1` (FD>1), Azure distributes the VMs in the scale set across the specified number of fault domains in that region. When you create a flexible scale set across availability zones with platformFaultDomainCount=1 (FD=1), the VMs are distributed across the specified zone. The scale set also distributes VMs across different fault domains within the zone on a best-effort basis.

**For SAP workloads, only flexible scale set with FD=1 is supported**. Compared to traditional availability zone deployments, flexible scale sets with FD=1 provide better fault distribution. VMs in the scale set are placed across multiple fault domains within each zone on a best‑effort basis. To learn more about SAP workload deployment with scale sets, see [flexible virtual machine scale set deployment guide](./sap-high-availability-architecture-scenarios.md).

### Availability zones

Availability zones are physically separate locations within an Azure region. Each availability zone consists of one or more datacenters equipped with independent power, cooling, and networking.

To achieve high availability on each tier for SAP BI platform, you can distribute VMs across availability zones by implementing a high-availability framework, which can provide the best SLA in Azure. For VM SLA in Azure, see the latest version of [VM SLAs](https://azure.microsoft.com/support/legal/sla/virtual-machines/).

For the data tier, Azure DBaaS provides a high-availability framework by default. You just need to select the region, and the service's inherent high availability, redundancy, and resiliency capabilities mitigate database downtime from planned and unplanned outages, without requiring you to configure any extra components. For more information about SLA for supported DBaaS offerings on Azure, see [High availability in Azure Database for MySQL](/azure/mysql/single-server/concepts-high-availability). See also, [High availability for Azure SQL Database](/azure/azure-sql/database/high-availability-sla).

### Availability sets

An availability set is a logical grouping capability for isolating VM resources from each other when deployed. Azure ensures that the VMs you place within an availability set run across multiple physical servers, compute racks, storage units, and network switches. If a hardware or software failure happens, only a subset of your VMs is affected and your overall solution stays operational. When VMs are placed in availability sets, Azure Fabric Controller distributes the VMs over different [fault](https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/sap/workloads/planning-guide.md#fault-domains) and [upgrade](https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/sap/workloads/planning-guide.md#upgrade-domains) domains to prevent all VMs from being inaccessible because of infrastructure maintenance or failure within one fault domain.

SAP BI platform contains many different components. When you design the architecture, ensure that each component is resilient to disruption. You can achieve resilience by placing Azure VMs of each component within availability sets. Mixing VM families in the same availability set may cause compatibility issues that prevent some VM types from being added. Use separate availability sets for web application and BI application for SAP BI platform as highlighted in the architecture overview.

The number of update and fault domains available to an Azure availability set within an Azure scale unit is finite. If you keep adding VMs to a single availability set, two or more VMs eventually end up in the same fault or update domain. For more information, see the [Azure availability sets](https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/sap/workloads/planning-guide.md#azure-availability-sets) section of the Azure VMs planning and implementation for SAP document.

For an overview of Azure availability sets and how they relate to fault and update domains, see the [Manage availability](/azure/virtual-machines/availability) article.

> [!IMPORTANT]
>
> - The concepts of Azure availability zones and Azure availability sets are mutually exclusive. You can deploy a pair or multiple VMs into either a specific availability zone or an availability set, but you can't do both.
>
> - If you're planning to deploy across availability zones, use [flexible scale set with FD=1](./virtual-machine-scale-set-sap-deployment-guide.md) over standard availability zone deployment.

### VMs

Azure VM is a service offering that enables you to deploy custom images to Azure as IaaS instances. It reduces the complexity of application maintenance and operations through on‑demand compute and storage for:

- Hosting
- Scaling
- Managing web applications
- Managing connected applications

Azure offers various VMs for all your application needs. However, for SAP workloads, Azure narrowed the selection to different VM families that are suitable for SAP workloads and SAP HANA workloads specifically. For more information, see [What SAP software is supported for Azure deployments](supported-product-on-azure.md).

Based on the SAP BI platform sizing, map your requirement to an Azure VM that is supported in Azure for SAP products. SAP Note [1928533](https://launchpad.support.sap.com/#/notes/1928533) is a good starting point that lists supported Azure VM types for SAP products on Windows and Linux. Keep in mind that beyond the selection of supported VM types, you also need to check whether those VM types are available in a specific region. You can check the availability of VM types on the [Products available by region](https://azure.microsoft.com/global-infrastructure/services/) page. For choosing the pricing model, see [Azure VMs for SAP workload](planning-guide.md#azure-virtual-machines-for-sap-workload).

### Storage

Azure Storage is an Azure-managed cloud service that provides highly available, secure, durable, scalable, and redundant storage. Some storage types offer limited support for SAP workloads. However, several Azure Storage types are well suited or optimized for specific SAP workload scenarios. For more information, see the [Azure Storage types for SAP workload](planning-guide-storage.md) guide, as it highlights different storage options that are suited for SAP.

Azure Storage has different storage types available. For more information, see the [What disk types are available in Azure?](/azure/virtual-machines/disks-types) article. SAP BOBI platform uses the following Azure Storage to build the application:

- Azure managed disks

  A managed disk is a block-level storage volume that Azure manages. You can use the disks for SAP BOBI platform application servers and databases when installed on Azure VMs. There are different types of [Azure managed disks](/azure/virtual-machines/managed-disks-overview) available, but [Premium SSDs](/azure/virtual-machines/disks-types#premium-ssds) are recommended for SAP BOBI platform application and database.

  In the following example, Premium SSDs are used for the BOBI platform installation directory. For a database installed on a VM, you can use managed disks for data and log volumes per the guidelines. CMS and Audit databases are typically small and don't have the same storage performance requirements as other SAP OLTP/OLAP databases.

- Azure Premium Files or Azure NetApp Files

  In SAP BOBI platform, File Repository Server (FRS) refers to the disk directories where content, such as reports, universes, and connections, is stored. This content is used by all application servers of that system. [Azure Premium Files](../../storage/files/storage-files-introduction.md) or [Azure NetApp Files](../../azure-netapp-files/azure-netapp-files-introduction.md) storage can be used as a shared file system for SAP BOBI application FRS. Because these storage offerings aren't available in all regions, see the [Products available by region](https://azure.microsoft.com/global-infrastructure/services/) site for up-to-date information.

  If the service is unavailable in your region, you can create an NFS server from which you can share the file system to SAP BOBI application. However, you also need to consider its high availability.

:::image type="content" source="media/businessobjects-deployment-guide/businessobjects-storage-layout.png" alt-text="Diagram that shows SAP BusinessObjects BI platform storage layout on Azure.":::

### Networking

SAP BOBI is a reporting and analytics BI platform that doesn't hold any business data. The system is connected to other database servers where it fetches all the data and provides insights to users. Azure provides a networking infrastructure that supports all scenarios for the SAP BI platform. Scenarios such as connecting to on-premises systems, systems in different virtual networks, and more. For more information, see [Microsoft Azure Networking for SAP workload](planning-guide.md#azure-networking).

For Database-as-a-Service offerings, any newly created database (Azure SQL Database or Azure Database for MySQL) has a firewall that blocks all external connections. To allow access to the DBaaS service from BI platform VMs, specify one or more server-level firewall rules to enable access to your DBaaS server. For more information, see [Firewall rules](/azure/mysql/single-server/concepts-firewall-rules) for Azure Database for MySQL and the [network access controls](/azure/azure-sql/database/network-access-controls-overview) section for Azure SQL Database.

## Related content

- [SAP BusinessObjects BI platform deployment on Linux](businessobjects-deployment-guide-linux.md)
- [Azure VMs planning and implementation for SAP](planning-guide.md)
- [Azure VMs deployment for SAP](deployment-guide.md)
- [Azure VMs DBMS deployment for SAP](./dbms-guide-general.md)
