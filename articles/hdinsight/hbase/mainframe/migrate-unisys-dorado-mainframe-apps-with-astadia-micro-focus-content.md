Unisys Dorado mainframe systems are full-featured operating environments. You can scale them up vertically to handle mission-critical workloads. But emulating or modernizing these systems into Azure can provide similar or better performance and SLA guarantees. Azure systems also offer added flexibility, reliability, and the benefit of future capabilities.

This architecture uses emulation technology from two Microsoft partners, [Astadia][Astadia] and [Micro Focus][Micro Focus]. The solution provides an accelerated way to move to Azure. There's no need for these steps:

- Rewriting application code.
- Redesigning data architecture or switching from a network-based to a relational-based model.
- Changing application screens.

## Potential use cases

Many cases can benefit from the Astadia and Micro Focus pattern:

- Businesses with Unisys Dorado mainframe systems that can't modify original source code, such as COBOL. Reasons include compliance factors, prohibitive costs, complexity, or other considerations.
- Organizations looking for approaches to modernizing workloads that offer these capabilities:

  - A way to migrate application layer source code.
  - Modern platform as a service (PaaS) services, including:

    - Azure SQL Database with its built-in high availability.
    - Azure Data Factory with its automated and serverless file routing and transformation.

## Architecture

:::image type="complex" source="./media/migrate-unisys-dorado-mainframe-apps-architecture-diagram.png" alt-text="Architecture diagram showing a Unisys Dorado mainframe system working with Azure components and with Astadia and Micro Focus emulation technology." border="false":::
   The diagram contains two areas, one for Azure components, and one for on-premises components. The on-premises area is simple, with icons for a user and a network service. The Azure area is complex. Boxes containing icons fill the Azure area. The boxes represent a virtual network, sets of virtual machines, third-party software, database services, storage solutions, and other components. Arrows connect some boxes. Number and letter labels link parts of the diagram with the description in the document.
:::image-end:::

1. Transport Layer Security (TLS) connections that use port 443 provide access to web-based applications:

   - To minimize the need for retraining, you can avoid modifying the web application presentation layer during migration. But you can also update the presentation layer to align with UX requirements.
   - Azure Bastion hosts help to maximize security. When giving administrators access to VMs, these hosts minimize the number of open ports.
   - Azure ExpressRoute securely connects on-premises and Azure components.

1. The solution uses two sets of two Azure Virtual Machines (VMs):

   - Within each set, one VM runs the web layer, and one runs the application emulation layer.
   - One set of VMs is the primary, active set. The other set is the secondary, passive set.
   - Azure Load Balancer distributes approaching traffic. When the active VM set fails, the standby set comes online. The load balancer then routes traffic to that newly activated set.

1. Astadia OpenTS simulates Unisys mainframe screens. This component runs presentation layer code in Internet Information Services (IIS) and uses ASP.NET. OpenTS can either run on its own VM or on the same VM as other Astadia emulation products.

1. OpenMCS is a program from Astadia that emulates these components:

   - The Unisys Dorado Mainframe Transactional Interface Package (TIP).
   - Other services that Unisys mainframe COBOL programs use.

1. Micro Focus COBOL runs COBOL programs on the Windows server. There's no need to rewrite COBOL code. Micro Focus COBOL can invoke Unisys mainframe facilities through the Astadia emulation components.

1. Astadia OpenDMS emulates the Unisys Dorado mainframe DMS database access technology. With this component, you can migrate tables and data into SQL Database from these systems:

   - Relational-based relational database management systems (RDMSs).
   - Network-based data management software (DMS) databases.

1. An Azure Files share is mounted on the Windows server VM. COBOL programs then have easy access to the Azure Files repository for file processing.

1. With either the Hyperscale or Business Critical service tier, SQL Database provides these capabilities:

   - High input/output operations per second (IOPS).
   - High uptime SLA.

   Azure Private Link provides a private, direct connection from VMs to SQL Database through the Azure network backbone. An autofailover group manages database replication.

1. Data Factory version 2 (V2) provides data movement pipelines that events can trigger. After data from external sources lands in Azure Blob Storage, these pipelines move that data into Azure Files storage. Emulated COBOL programs then process the files.

1. Azure Site Recovery provides disaster recovery capabilities. This service mirrors the VMs to a secondary Azure region. In the rare case of an Azure datacenter failure, the system then provides quick failover.

### Legacy architecture

This diagram shows the components that Unisys Sperry OS 1100/2200 mainframe systems typically contain:

:::image type="complex" source="./media/migrate-unisys-dorado-mainframe-apps-original-architecture.png" alt-text="Architecture diagram showing the components that make up a Unisys Dorado mainframe system. Examples include users, middleware, servers, and data storage." border="false":::
   The main part of the diagram is a box that contains several smaller boxes. Those boxes represent communications standards, application servers, data storage, middleware, monitoring components, an operating system, and a printer system. Above the box, icons represent users. Arrows connect the users with the communications box. Below the box, icons represent printers. Arrows connect the printers with the printer system box. Letter labels link parts of the diagram with the description in the document.
:::image-end:::

- On-premises users interact with the mainframe (**A**):

  - Admin users interact through a Universal Terminal System (UTS) terminal emulator.
  - Web interface users interact via a web browser over TLS 1.3 port 443.

  Mainframes use communication standards such as:

  - Internet Protocol version 4 (IPv4)
  - Internet Protocol version 6 (IPv6)
  - Secure Sockets Layer (SSL)/TLS
  - Telnet
  - File Transfer Protocol (FTP)
  - Sockets
  
  In Azure, web browsers replace legacy terminal emulation. On-demand and online users can use these web browsers to access system resources.

- Mainframe applications are in COBOL, Fortran, C, MASM, SSG, Pascal, UCOBOL, and ECL (**B**). In Azure, Micro Focus COBOL recompiles COBOL and other legacy application code to .NET. Micro Focus can also maintain and reprocess original base code whenever that code changes. This architecture doesn't require any changes in the original source code.

- Mainframe batch and transaction loads run on application servers (**C**). For transactions, these servers use TIPs or High Volume TIPs (HVTIPs). In the new architecture:

  - Server topologies handle batch and transaction workloads.
  - An Azure load balancer routes traffic to the server sets.
  - Site Recovery provides high availability (HA) and disaster recovery (DR) capabilities.

- A dedicated server handles workload automation, scheduling, reporting, and system monitoring (**D**). These functions use the same platforms in Azure.

- A printer subsystem manages on-premises printers.

- Database management systems (**E**) follow the eXtended Architecture (XA) specification. Mainframes use relational database systems like RDMS and network-based database systems like DMS II and DMS. The new architecture migrates legacy database structures to SQL Database, which provides DR and HA capabilities.

- Mainframe file structures include Common Internet File System (CIFS), flat files, and virtual tape. These file structures map easily to Azure data constructs within structured files or Blob Storage (**F**). Data Factory provides a modern PaaS data transformation service that fully integrates with this architecture pattern.

### Components

This architecture uses the following components:

- [VMs][What is a virtual machine?] are on-demand, scalable computing resources. An Azure VM provides the flexibility of virtualization but eliminates the maintenance demands of physical hardware.

- [Azure solid-state drive (SSD) managed disks][Introduction to Azure managed disks] are block-level storage volumes that Azure manages. VMs use these disks. Available types include:

  - Ultra Disks
  - Premium SSD Managed Disks
  - Standard SSD Managed Disks
  - Standard hard disk drives (HDD) Managed Disks

  Premium SSDs or Ultra Disks work best with this architecture.

- [Virtual Network][What is Azure Virtual Network?] is the fundamental building block for private networks in Azure. Through Virtual Network, Azure resources like VMs can securely communicate with each other, the internet, and on-premises networks. An Azure virtual network is like a traditional network operating in a datacenter. But an Azure virtual network also provides scalability, availability, isolation, and other benefits of Azure's infrastructure.

- [Virtual network interface cards][Create, change, or delete a network interface] provide a way for VMs to communicate with internet, Azure, and on-premises resources. You can add network interface cards to a VM to give Solaris child VMs their own dedicated network interface devices and IP addresses.

- [Azure Files][What is Azure Files?] is a service that's part of [Azure Storage][Introduction to the core Azure Storage services]. Azure Files offers fully managed file shares in the cloud. Azure file shares are accessible via the industry standard Server Message Block (SMB) protocol. You can mount these file shares concurrently by cloud or on-premises deployments. Windows, Linux, and macOS clients can access these file shares.

- [Blob Storage][Introduction to Azure Blob storage] is a service that's part of Storage. Blob Storage provides optimized cloud object storage that manages massive amounts of unstructured data.

- [SQL Database][What is Azure SQL Database?] is a fully managed PaaS database engine. With AI-powered, automated features, SQL Database handles database management functions like upgrading, patching, backups, and monitoring. SQL Database offers 99.99 percent availability and runs on the latest stable version of the SQL Server database engine and patched operating system. Because SQL Database offers built-in PaaS capabilities, you can focus on domain-specific database administration and optimization activities that are critical for your business.

- [Data Factory][What is Azure Data Factory?] is a hybrid data integration service. You can use this fully managed, serverless solution to create, schedule, and orchestrate extract-transform-load (ETL) and extract-load-transform (ELT) workflows.

- [IIS][Internet Information Server with Windows 2019] is an extensible web server. Its modular architecture provides a flexible web hosting environment.

- [Load Balancer][What is Azure Load Balancer?] distributes inbound traffic to back-end pool instances. Load Balancer directs traffic according to configured load-balancing rules and health probes. The back-end pool instances can be Azure VMs or instances in an Azure Virtual Machine Scale Set.

- [ExpressRoute][What is Azure ExpressRoute?] extends on-premises networks into the Microsoft cloud. By using a connectivity provider, ExpressRoute establishes private connections to cloud components like Azure services and Microsoft 365.

- [Azure Bastion][What is Azure Bastion?] provides secure and seamless Remote Desktop Protocol (RDP) and Secure Shell (SSH) access to VMs. This service uses SSL without exposing public IP addresses.

- [Private Link][What is Azure Private Link?] provides a private endpoint in a virtual network. You can use the private endpoint to connect to Azure PaaS services or to customer or partner services.

- [Azure network security groups][Network security groups] filter traffic in an Azure virtual network. Security rules determine the type of traffic that can flow to and from Azure resources in the network.

- [Site Recovery][About Site Recovery] keeps applications and workloads running during outages. This service works by replicating VMs from a primary site to a secondary location.

- An [autofailover group][Use auto-failover groups to enable transparent and coordinated failover of multiple databases] manages the replication and failover of databases to another region. With this feature, you can start failover manually. You can also set up a user-defined policy to delegate failover to Azure.

## Considerations

The following considerations, based on the [Microsoft Azure Well-Architected Framework][Microsoft Azure Well-Architected Framework], apply to this solution:

### Availability considerations

- Availability sets for VMs ensure enough VMs are available to meet mission-critical batch process needs.
- Load Balancer improves reliability by rerouting traffic to a spare VM set if the active set fails.
- Various Azure components provide reliability across geographic regions through HA and DR:

  - Site Recovery
  - The Business Critical service tier of SQL Database
  - Azure Storage redundancy
  - Azure Files redundancy

### Operational considerations

- Besides scalability and availability, these Azure PaaS components also provide updates to services:

  - SQL Database
  - Data Factory
  - Azure Storage
  - Azure Files

- Consider using [Azure Resource Manager templates (ARM templates)][What are ARM templates?] to automate deployment of Azure components such as Storage accounts, VMs, and Data Factory.

- Consider using [Azure Monitor][Azure Monitor overview] to increase monitoring in these areas:

  - Tracking the state of infrastructure.
  - Monitoring external dependencies.
  - App troubleshooting and telemetry through [Application Insights][What is Application Insights?].
  - Network component management through [Azure Network Watcher][What is Azure Network Watcher?].

### Performance considerations

- SQL Database, Storage accounts, and other Azure PaaS components provide high performance in these areas:

  - Data reads and writes.
  - Hot storage access.
  - Long-term data storage.

- The use of VMs in this architecture aligns with the framework's [performance efficiency pillar][Overview of the performance efficiency pillar], since you can optimize the VM configuration to boost performance.

### Scalability considerations

Various Azure PaaS components provide scalability:

- SQL Database
- Data Factory
- Azure Storage
- Azure Files

### Security considerations

All the components in this architecture work with Azure security components as needed. Examples include network security groups, virtual networks, and TLS encryption.

## Pricing

To estimate the cost of implementing this solution, use the [Azure pricing calculator][Pricing calculator].

- [VM pricing][VM pricing] depends on your compute capacity. This solution helps you [optimize VM costs][Optimize VM costs] in these ways:

  - Turning off VMs that aren't in use.
  - Scripting a schedule for known usage patterns.

- For SQL Database:

  - Use the Hyperscale or Business Critical service tier for high input/output operations per second (IOPS) and high uptime SLA.
  - You pay for [computing power and a SQL license][Azure SQL Database pricing]. But if you have [Azure Hybrid Benefit][Azure Hybrid Benefit], you can [use your on-premises SQL Server license][Azure Hybrid Benefit FAQ].
- With ExpressRoute, you pay a [monthly port fee and outbound data transfer charges][Azure ExpressRoute pricing].
- Azure Storage costs depend on [data redundancy options and volume][Azure Storage Overview pricing].
- Azure Files pricing depends on many factors: [data volume, data redundancy, transaction volume, and the number of file sync servers][Azure Files Pricing] that you use.
- For SSD managed disk pricing, see [Managed disks pricing][Managed Disks pricing].
- With Site Recovery, you pay for each [protected instance][Azure Site Recovery pricing].
- For IIS software plan charges, see [Internet Information Services pricing][Internet Information Services pricing].

- Other services are free with your Azure subscription, but you pay for usage and traffic:

  - With Data Factory, your [activity run volume determines the cost][Data Factory pricing].
  - For Virtual Network, [IP addresses carry a nominal charge][Virtual Network pricing].
  - Private Link costs depend on [endpoints and data volume][Azure Private Link pricing].
  - Load Balancer [rules and traffic incur charges][Load Balancing pricing].
  - With Azure Bastion, the [outbound data transfer volume determines the price][Azure Bastion pricing].

- [Contact Astadia][Contact Astadia] for pricing information on OpenTS, OpenMCS, and OpenDMS.
- [Contact Micro Focus][Contact Micro Focus] for pricing on Micro Focus COBOL.

## Next steps

- Contact [legacy2azure@microsoft.com][Email address for information on migrating legacy systems to Azure] for more information.
- See the [Azure Friday tech talk with Astadia on mainframe modernization][Azure is the new mainframe].

## Related resources

- [Mainframe rehosting on Azure virtual machines][Mainframe rehosting on Azure virtual machines]
- Reference architectures:

  - [Unisys mainframe migration to Azure using Asysco][Unisys mainframe migration]
  - [Micro Focus Enterprise Server on Azure VMs][Micro Focus Enterprise Server on Azure VMs]
  - [Modernize mainframe & midrange data][Modernize mainframe & midrange data]
  - [Migrate IBM mainframe applications to Azure with TmaxSoft OpenFrame][Migrate IBM mainframe applications to Azure with TmaxSoft OpenFrame]

[About Site Recovery]: /azure/site-recovery/site-recovery-overview
[Astadia]: https://www.astadia.com/
[Azure Bastion pricing]: https://azure.microsoft.com/pricing/details/azure-bastion/
[Azure ExpressRoute pricing]: https://azure.microsoft.com/pricing/details/expressroute/
[Azure Files Pricing]: https://azure.microsoft.com/pricing/details/storage/files/
[Azure Hybrid Benefit]: https://azure.microsoft.com/pricing/hybrid-benefit/
[Azure Hybrid Benefit FAQ]: https://azure.microsoft.com/pricing/hybrid-benefit/faq/
[Azure Monitor overview]: /azure/azure-monitor/overview
[Azure is the new mainframe]: https://channel9.msdn.com/Shows/Azure-Friday/Azure-is-the-new-mainframe/
[Azure Private Link pricing]: https://azure.microsoft.com/pricing/details/private-link/
[Azure Site Recovery pricing]: https://azure.microsoft.com/pricing/details/site-recovery/
[Azure SQL Database pricing]: https://azure.microsoft.com/pricing/details/sql-database/single/
[Azure Storage Overview pricing]: https://azure.microsoft.com/pricing/details/storage/
[Contact Astadia]: https://www.astadia.com/contact
[Contact Micro Focus]: https://www.microfocus.com/en-us/contact
[Create, change, or delete a network interface]: /azure/virtual-network/virtual-network-network-interface
[Data Factory pricing]: https://azure.microsoft.com/pricing/details/data-factory/
[Email address for information on migrating legacy systems to Azure]: mailto:legacy2azure@microsoft.com
[Internet Information Server with Windows 2019]: https://azuremarketplace.microsoft.com/marketplace/apps/cloudwhizsolutions.internet-information-server-with-windows-2019-cw
[Internet Information Services pricing]: https://azuremarketplace.microsoft.com/marketplace/apps/cloudwhizsolutions.internet-information-server-with-windows-2019-cw?tab=PlansAndPrice
[Introduction to Azure Blob storage]: /azure/storage/blobs/storage-blobs-introduction
[Introduction to Azure managed disks]: /azure/virtual-machines/managed-disks-overview
[Introduction to the core Azure Storage services]: /azure/storage/common/storage-introduction
[Load Balancing pricing]: https://azure.microsoft.com/pricing/details/load-balancer/
[Mainframe rehosting on Azure virtual machines]: /azure/virtual-machines/workloads/mainframe-rehosting/overview
[Managed Disks pricing]: https://azure.microsoft.com/pricing/details/managed-disks/
[Micro Focus]: https://www.microfocus.com/home
[Micro Focus Enterprise Server on Azure VMs]: /azure/architecture/example-scenario/mainframe/micro-focus-server
[Microsoft Azure Well-Architected Framework]: /azure/architecture/framework/
[Migrate IBM mainframe applications to Azure with TmaxSoft OpenFrame]: /azure/architecture/solution-ideas/articles/migrate-mainframe-apps-with-tmaxsoft-openframe
[Modernize mainframe & midrange data]: /azure/architecture/reference-architectures/migration/modernize-mainframe-data-to-azure
[Network security groups]: /azure/virtual-network/network-security-groups-overview
[Overview of the performance efficiency pillar]: /azure/architecture/framework/scalability/overview
[Pricing calculator]: https://azure.microsoft.com/pricing/calculator/
[Unisys mainframe migration]: /azure/architecture/reference-architectures/migration/unisys-mainframe-migration
[Optimize VM costs]: /azure/architecture/framework/cost/optimize-vm
[Use auto-failover groups to enable transparent and coordinated failover of multiple databases]: /azure/azure-sql/database/auto-failover-group-overview
[Virtual Network pricing]: https://azure.microsoft.com/pricing/details/virtual-network/
[VM pricing]: https://azure.microsoft.com/pricing/details/virtual-machines/linux/
[What are ARM templates?]: /azure/azure-resource-manager/templates/overview
[What is Application Insights?]: /azure/azure-monitor/app/app-insights-overview
[What is Azure Bastion?]: /azure/bastion/bastion-overview
[What is Azure Data Factory?]: /azure/data-factory/introduction
[What is Azure ExpressRoute?]: /azure/expressroute/expressroute-introduction
[What is Azure Files?]: /azure/storage/files/storage-files-introduction
[What is Azure Load Balancer?]: /azure/load-balancer/load-balancer-overview
[What is Azure Network Watcher?]: /azure/network-watcher/network-watcher-monitoring-overview
[What is Azure Private Link?]: /azure/private-link/private-link-overview
[What is Azure SQL Database?]: /azure/azure-sql/database/sql-database-paas-overview
[What is Azure Virtual Network?]: /azure/virtual-network/virtual-networks-overview
[What is a virtual machine?]: https://azure.microsoft.com/overview/what-is-a-virtual-machine/
