---
title: Glossary of terms 
titleSuffix: Azure SQL Database & SQL Managed Instance 
description: A glossary of terms for working with Azure SQL Database, Azure SQL Managed Instance, and SQL on Azure VM. 
services: sql-database
ms.service: sql-database
ms.subservice: service-overview
ms.custom: sqldbrb=4
ms.devlang: 
ms.topic: reference
author: MashaMSFT
ms.author: mathoma
ms.reviewer: 
ms.date: 5/18/2021
---
# Azure SQL glossary of terms
[!INCLUDE[appliesto-asf](./includes/appliesto-asf.md)] 

## Azure SQL Database

|Context|Term|Definition|
|:---|:---|:---|
|Azure service|Azure SQL Database or SQL databases|[Azure SQL Database](database/sql-database-paas-overview.md) is a fully managed platform as a service (PaaS) database engine that handles most of the database management functions such as upgrading, patching, backups, and monitoring without user involvement.|
|Server entity| SQL server | An Azure [SQL server](database/logical-servers.md) is a logical construct that acts as a central administrative point for a collection of Azure SQL databases. All databases managed by an Azure SQL server are created in the same region as the server. There are no guarantees regarding location of the databases in relation to the SQL server that manages them. There is no instance-level access or instance features for Azure SQL databases. |
|Deployment option ||Azure SQL databases may be deployed individually or as part of an elastic pool. You may move existing SQL databases in and out of elastic pools. |
||Elastic pool|[Elastic pools](database/elastic-pool-overview.md) are a simple, cost-effective solution for managing and scaling multiple databases that have varying and unpredictable usage demands. The databases in an elastic pool are on a single logical server. The databases share a set number of resources at a set price.|
||Single database|If you deploy [single databases](database/single-database-overview.md), each database is isolated and portable. Each has its own service tier within your selected purchasing model and a guaranteed compute size.|
|Purchasing model|| Azure SQL Database has two purchasing models. The purchasing model defines how you scale your database and how you are billed for compute, storage, and IO resources. |
||DTU-based purchasing model|The [Database Transaction Unit (DTU)-based purchasing model](database/service-tiers-dtu.md) is based on a bundled measure of compute, storage, and I/O resources. Compute sizes are expressed in DTUs for single databases and in elastic database transaction units (eDTUs) for elastic pools. |
||vCore-based purchasing model (recommended)| A virtual core (vCore) represents a logical CPU. The [vCore-based purchasing model](database/service-tiers-vcore.md) offers greater control over the hardware configuration to better match compute and memory requirements of the workload, pricing discounts for [Azure Hybrid Benefit (AHB)](../azure-hybrid-benefit.md) and [Reserved Instance (RI)](reserved-capacity-overview.md), and greater transparency in hardware details. |
|Service tier|| The service tier defines the storage architecture, storage and I/O limits, and business continuity options. Options for service tiers vary by purchasing model. |
||DTU-based service tiers | [Basic, Standard, and Premium service tiers](database/service-tiers-dtu.md#compare-the-dtu-based-service-tiers) are available in the DTU-based purchasing model.|
||vCore-based service tiers (recommended) |[General Purpose, Business Critical, and Hyperscale service tiers](database/service-tiers-sql-database-vcore#service-tiers) are available in the vCore-based purchasing model (recommended).|
|Compute tier|| The compute tier determines whether resources are continuously available or autoscaled. Compute tier availability varies by purchasing model and service tier. |
||Provisioned compute|The [provisioned compute tier](database/service-tiers-sql-database-vcore.md#compute-tiers) provides a specific amount of compute resources that are continuously provisioned independent of workload activity. Under the provisioned compute tier you are billed at a fixed price per hour.
||Serverless compute| The [serverless compute tier](database/serverless-tier-overview.md) autoscales compute resources based on workload activity and bills for the amount of compute used per second. SQL Database serverless is currently available in the vCore purchasing model's  General Purpose service tier with Generation 5 hardware.|
|Hardware generation| Available hardware configurations | The vCore-based purchasing model allows you to select the appropriate hardware generation for your workload. [Hardware configuration options](database/service-tiers-sql-database-vcore.md#hardware-generations) include Gen5, M-series, Fsv2-series, and DC-series.|
|Compute size (service objective) ||Compute size (service objective) is the maximum amount of CPU, memory, and storage resources available for a single database or elastic pool.
||vCore-based sizing options| Configure the compute size for your database or elastic pool by selecting the appropriate service tier, compute tier, and hardware generation for your workload. For sizing options and resource limits in the vCore-based purchasing model, see [vCore single databases](database/resource-limits-vcore-single-databases.md), and [vCore elastic pools](database/resource-limits-vcore-elastic-pools.md).|
||DTU-based sizing options| Configure the compute size for your database or elastic pool by selecting the appropriate service tier and selecting the maximum data size and number of DTUs. When using an elastic pool, configure the reserved eDTUs for the pool, and optionally configure per-database settings. For sizing options and resource limits in the DTU-based purchasing model, see [DTU single databases](database/resource-limits-dtu-single-databases.md) and [DTU elastic pools](database/resource-limits-dtu-elastic-pools.md).

## Azure SQL Managed Instance

|Context|Term|More information|
|:---|:---|:---|
|Azure service|Azure SQL Managed Instance or SQL managed instances| [Azure SQL Managed Instance](managed-instance/sql-managed-instance-paas-overview.md) is a fully managed platform as a service (PaaS) deployment option of Azure SQL. It gives you an instance of SQL Server but removes much of the overhead of managing a virtual machine. Most of the features available in SQL Server are available in SQL Managed Instance. |
|Server entity|Managed instance or instance| Each managed instance is itself an instance of SQL Server. Databases created on a managed instance are colocated with one another, and you may run cross-database queries. You can connect to the managed instance and use instance-level features such as linked servers and the SQL Server Agent. |
|Deployment option ||Azure SQL managed instances may be deployed individually or as part of an instance pools (preview). Managed instances cannot currently be moved into, between, or out of instance pools.|
||Instance pool (preview)|[Instance pools](managed-instance/instance-pools-overview.md) allow you to deploy multiple managed instances into a single virtual cluster. Instance pools enable you to migrate smaller and less compute-intensive workloads to the cloud without consolidating them in a single larger managed instance. |
||Single instance| A single [managed instance](managed-instance/sql-managed-instance-paas-overview.md) provides a dedicated virtual cluster for one managed instance.   |
|Purchasing model|vCore-based purchasing model| Azure SQL Managed Instance is available under the [vCore-based purchasing model](managed-instance/service-tiers-managed-instance-vcore.md). |
|Service tier| vCore-based service tiers| Azure SQL Managed Instance offers two service tiers. Both service tiers guarantee 99.99% availability and enable you to independently select storage size and compute capacity. Select either the [General Purpose or Business Critical service tier](managed-instance/sql-managed-instance-paas-overview.md#service-tiers) for a managed instance based upon your performance and latency requirements.|
|Compute tier|Provisioned compute| Azure SQL managed instances run under the [provisioned compute](managed-instance/service-tiers-managed-instance-vcore.md#compute-tiers) tier. SQL Managed Instance provides a specific amount of compute resources that are continuously provisioned independent of workload activity, and bills for the amount of compute provisioned at a fixed price per hour. |
|Hardware generation|Available hardware configurations| Azure SQL Managed Instance [hardware generations](managed-instance/service-tiers-managed-instance-vcore.md#hardware-generations) include standard-series (Gen5), premium-series, and memory optimized premium-series hardware generations. |
|Compute size | vCore-based sizing options | Compute size (service objective) is the maximum amount of CPU, memory, and storage resources available for a single managed instance or instance pool. Configure the compute size for your managed instance by selecting the appropriate service tier and hardware generation for your workload. Learn about [resource limits for managed instances](managed-instance/resource-limits.md). |

## SQL Server on Azure VM
|Context|Term|More information|
|:---|:---|:---|
|Azure service|SQL Server on Azure VM or SQL virtual machines| [SQL Server on Azure VM](virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview.md) enables you to use full versions of SQL Server in the cloud without having to manage any on-premises hardware. SQL virtual machines (VMs) simplify licensing costs when you pay as you go. You have both SQL Server and OS access with automated manageability features for SQL Server with Azure SQL VMs.|
| Server entity | Virtual machine or VM | Azure virtual machines run in many geographic regions around the world. They also offer various machine sizes. The virtual machine image gallery allows you to create a SQL Server VM with the right version, edition, and operating system.  |
| Image | Windows VMs or Linux VMs | You can choose to deploy SQL Server onto [Windows-based images](/virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview.md) or [Linux-based images](/virtual-machines/linux/sql-server-on-linux-vm-what-is-iaas-overview.md). Image selection specifies both the OS version and SQL Server edition for your SQL Server on Azure VM. |
| Pricing |  | Pricing for SQL Server on Azure VM is based on SQL Server licensing, operating system (OS), and virtual machine cost. You can [reduce costs](/virtual-machines/windows/pricing-guidance.md#reduce-costs) by optimizing your VM size and shutting down your VM when possible. |
| | SQL Server licensing cost | Choose the appropriate [free](/virtual-machines/windows/pricing-guidance.md#free-licensed-sql-server-editions) or [paid](/virtual-machines/windows/pricing-guidance.md#paid-sql-server-editions) SQL Server edition for your usage and requirements. For paid editions, you may [pay per usage](/virtual-machines/windows/pricing-guidance.md#pay-per-usage) (also known as pay as you go)  or bring your own license [(BYOL)](/virtual-machines/windows/pricing-guidance.md#byol).  |
| | OS and virtual machine cost  | OS and virtual machine cost is based upon factors including your choice of image, VM size, and storage configuration. |
| VM configuration |  | You need to make choices for VM configuration in multiple areas, including security, storage, and high availability/disaster recovery. Use this [quick checklist](/virtual-machines/windows/performance-guidelines-best-practices-checklist.md) of a series of best practices and guidelines to navigate these choices. |
|  | VM size | [VM size](/virtual-machines/windows/performance-guidelines-best-practices-vm-size.md) determines processing power, memory, and storage capacity. You can [collect a performance baseline](l/virtual-machines/windows/performance-guidelines-best-practices-collect-baseline.md) to help select the best VM size for your workload.  |
|  | Storage configuration | Your storage configuration options are determined by your selection of VM size and selection of storage settings including disk type, caching settings, and disk striping. Learn how to choose a VM size with [enough storage scalability](/virtual-machines/windows/performance-guidelines-best-practices-storage.md) for your workload and a mixture of disks (usually in a storage pool) that meet the capacity and performance requirements of your business. |
|  | Security considerations | You can enable Microsoft Defender for SQL, integrate Azure Key Vault, control access, and secure connections to your SQL Server on Azure VM. Learn [security guidelines](virtual-machines/windows/security-considerations-best-practices.md) to establish secure access to SQL Server in Azure VMs. |
| IaaS Agent extension | | The SQL Server [IaaS Agent extension](/virtual-machines/windows/sql-server-iaas-agent-extension-automate-management.md) (SqlIaasExtension) runs on SQL Server on Windows Azure VMs to automate management and administration tasks. There is no additional cost associated with the extension. |
| | Automated patching | [Automated Patching](/virtual-machines/windows/automated-patching.md) establishes a maintenance window for an Azure virtual machine running SQL Server. Automated Updates can only be installed during this maintenance window.  |
| | Automated backup | [Automated Backup v2](/virtual-machines/windows/automated-backup.md) automatically configures Managed Backup to Microsoft Azure for all existing and new databases on an Azure VM running SQL Server 2016 or later Standard, Enterprise, or Developer editions. |