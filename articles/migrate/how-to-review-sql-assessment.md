---
title: Review SQL assessment with Azure Migrate | Microsoft Docs
description: Describes how to review SQL Azure assessment with the Azure Migrate 
author: rashi-ms
ms.author: v-uhabiba
ms.manager: abhemraj
ms.service: azure-migrate
ms.topic: how-to
ms.date: 04/17/2025
ms.custom: engagement-fy23
monikerRange: migrate
---

# Review SQL assessment

In this article, you'll explore the concepts of a SQL assessment, its characteristics, and how to review an SQL assessment for different migration targets. The SQL assessment provides a comprehensive report that allows you to compare the migration of your on-premises workloads to available SQL targets. The report outlines various migration strategies for SQL deployments. 

**Recommended Deployment**:

The deployment involves selecting an Azure SQL deployment type that is highly compatible with your SQL instance. This is based on your migration preferences and cost considerations. If your instance is suitable for SQL Server on Azure VM, Azure SQL Managed Instance, and Azure SQL Database, the target deployment type minimizes migration readiness issues while optimizing cost. 

> [!NOTE]
> Migrating instances to SQL Server on Azure VM is the preferred approach for migrating SQL Server instances. When SQL Server credentials are unavailable, the Azure SQL assessment provides right-sized lift-and-shift, recommendations, specifically suggesting a move to SQL Server on Azure VM.

## Azure readiness for SQL workloads

Azure SQL readiness for SQL instances and databases is based on a feature compatibility check with SQL Server on Azure VM, Azure SQL Database, and Azure SQL Managed Instance. The assessment evaluates the features currently used by the source SQL Server workloads such as SQL Agent jobs, linked servers, and the user database schemas (including tables, views, triggers, stored procedures, etc.) to identify potential compatibility issues.

**Azure readiness** | **Probable compatibility issues** | **Details** | **Recommended remediation guidance**
    --- | --- | --- | --- 
    Ready datastore | No compatibility issues found | Instance is ready for the target deployment type (SQL Server on Azure VM or Azure SQL Database or Azure SQL Managed Instance) | N/A
    Ready  | Noncritical compatibility issues | Deprecated or unsupported features that don't block the migration to a specific target deployment type | Recommended remediation guidance provided
    Ready with conditions | Compatibility issues that might block migration to a specific target| | Recommended remediation guidance provided
    Ready with conditions | In the recommended deployment strategy, for both Azure SQL Managed Instance, and SQL Server on Azure VM readiness reports, if even one database within a SQL instance isn't ready for a particular target deployment type, the entire instance is marked as Ready with conditions for that deployment type| Instance is marked as Ready with conditions for that deployment type | Recommended remediation guidance provided
    Not ready  | No suitable configuration found| The assessment couldn't find a SQL Server on Azure VM, Azure SQL Managed Instance, Azure SQL DB configuration that meets the desired configuration and performance characteristics. For example, if the assessment can't find a disk for the required size, it marks the instance as unsuitable | Review the recommendation to make the instance/server ready for the desired target deployment type
    Unknown| Discovery in progress or discovery issues| The assessment couldn't compute the readiness for that SQL instance| N/A
    
> [!NOTE]
> In the recommended deployment strategy, migrating instances to SQL Server on Azure VM is the preferred approach for migrating SQL Server instances. 

## Security readiness

If the database or instance is marked as Ready for the target deployment type - Azure SQL Managed Instance, it's automatically considered Ready for Microsoft Defender for SQL. If marked Ready for SQL Server on Azure VM, it's considered Ready for Microsoft Defender for SQL if it's running any of the supported versions:

- SQL Server versions 2012, 2014, 2016, 2017, 2019, 2022
- For all other versions, it's marked as Ready with conditions.

## Target rightsizing

After determining readiness and the recommended Azure SQL deployment type, the assessment computes a service tier and Azure SQL configuration (SKU size) to meet or exceed on-premises SQL Server performance. This calculation is based on whether you use on-premises or performance-based sizing criteria.


Sizing criteria | Details| Data
--- | --- | ---
As on-premises   | Recommendations based on on-premises SQL Server configuration alone.  | The Azure SQL configuration is based on the on-premises SQL Server configuration, which includes allocated cores, total memory, and database sizes.
Performance-based   | The Azure SQL configuration is based on performance data of SQL instances and databases including CPU utilization, Memory usage, IOPS (Data and Log files), throughput, and latency of IO operations for both data and log files.

## Rightsizing for Azure SQL Managed Instance and Azure SQL Database 

**As on-premises sizing calculation**

The assessment computes and identifies a service tier and Azure SQL configuration (SKU sizes) that can meet or exceed the on-premises SQL instance configuration. Azure Migrate collects the following SQL instance configuration datapoints from on-premises servers:

* vCores (allocated)
* Memory (allocated)
* Total DB size and database file organizations (DB size is calculated by adding all the data and log files)

The assessment aggregates all the configuration datapoints to identify the best match across available Azure SQL service tiers. It selects a configuration that meets or exceeds the SQL instance requirements while optimizing cost efficiency.

**Performance-based sizing calculation**

The assessment computes and identifies a service tier and Azure SQL configuration (SKU size) that can meet or exceed the on-premises SQL instance performance requirements based on following datapoints:

* vCores (allocated) and CPU utilization (%)
    * CPU utilization for a SQL instance is the percentage of allocated CPU resources used by the instance on the SQL server.
    * CPU utilization for a database is the percentage of allocated CPU resources by the database on the SQL instance.
* Memory (allocated) and memory utilization (%)
* Read IO/s and Write IO/s (Data and Log files)
    * Read IO/s and Write IO/s at a SQL instance level are calculated by adding the Read IO/s and Write IO/s of all databases discovered within that instance.
* Read MB/s and Write MB/s (Throughput)
* Latency of IO operations
* Total DB size and database file organizations
    * Database size is calculated by adding the data sizes of all data and log files.
* Always On Failover Cluster Instance network subnet configuration (Single Subnet or Multi-Subnet)
* Always On Availability Group configurations
    * Network configuration of participating instances (Single Subnet or Multi-Subnet)
    * Number and type of secondary replicas.
        * Availability Mode: Synchronous Commit vs Asynchronous Commit
        * Connection Mode: Read-only vs None

The assessment aggregates all the configuration and performance data to identify the best match across various Azure SQL service tiers and configurations, selecting a setup that meets or exceeds the SQL instance's performance requirements while optimizing cost.


## Rightsizing for instances to SQL Server on Azure VM configuration

**As on-premises sizing calculation**

The instances to SQL Server on Azure VM assessment report outline the ideal approach for migrating SQL Server instances to SQL Server on Azure VM, adhering to the best practices. [Learn more](/azure/azure-sql/virtual-machines/windows/performance-guidelines-best-practices-checklist?preserve-view=true&view=azuresql#vm-size).

**Storage sizing**

For storage sizing, the assessment maps each disk on the on-premises instance to an Azure disk:

* The required disk size is the sum of the SQL Data and SQL Log drives.
* The assessment recommends creating a storage disk pool for all SQL Log and SQL Data drives. For temporary drives, it suggests storing the files on the local drive.
* If the assessment can't find a disk that meets the required size, it marks the instance as unsuitable for migrating to SQL Server on Azure VM.
* If the environment type is Production, the assessment attempts to map each disk to a premium disk. For nonproduction environments, it looks for a suitable disk, which might be either a Premium or Standard SSD disk. If multiple eligible disks are available, the assessment selects the disk with the lowest cost.

**Compute sizing**

After identifying storage disks, the assessment considers CPU and memory requirements of the instance to find a suitable VM SKU in Azure:

* The assessment uses allocated cores and memory to determine an appropriate Azure VM size.
* If a suitable size is found, Azure Migrate applies the storage calculations to verify disk-VM compatibility. 
* If multiple eligible Azure VM sizes are available, the assessment recommends the one with the lowest cost.

> [!NOTE]
> Azure SQL assessments are designed to deliver the best performance for your SQL workloads. The VM series list includes only VMs optimized for running your SQL Server on Azure Virtual Machines (VMs). [Learn more](/azure/azure-sql/virtual-machines/windows/performance-guidelines-best-practices-checklist?preserve-view=true&view=azuresql#vm-size).

## Performance-based sizing calculation

If the source is a SQL Server Always On Failover Cluster Instance (FCI), the assessment report outlines the approach for migrating to a two-node SQL Server Failover Cluster Instance. This approach preserves high availability and disaster recovery objectives while adhering to the best practices. [Learn more](/azure/azure-sql/virtual-machines/windows/hadr-cluster-best-practices?view=azuresql&preserve-view=true&tabs=windows2012).

**Storage sizing**

For storage sizing, the assessment maps each disk on the on-premises instance to an Azure disk:

* The minimum disk size required is the sum of the SQL Data and SQL Log drives.
* The IO/s and throughput requirements are determined by adding read and write IO/s and read and write throughput. Candidate disks are then identified based on their ability to meet the required throughput and are mapped to required size. 
* The assessment recommends creating a storage disk pool for all SQL Log and SQL Data drives. For temp drives, it suggests storing the files in the local drive.
* If the source is a SQL Server Always On Failover Cluster Instance, a shared disk configuration is selected.
*  If the environment type is Production, the assessment attempts to map each disk to a premium disk. For nonproduction environments, it looks for a suitable disk, which might be either a Premium or Standard SSD disk. If multiple eligible disks are available, the assessment selects the disk with the lowest cost.

If the environment type is Production, the assessment attempts to map each disk to a premium disk. For nonproduction environments, it looks for a suitable disk, which might be either a Premium or Standard SSD disk. If multiple eligible disks are available, the assessment selects the disk with the lowest cost.

**Compute sizing**

After identifying storage disks, the assessment considers CPU and memory requirements of the instance to find a suitable VM SKU in Azure:

* The assessment calculates effective utilized cores and memory to determine a suitable Azure VM size. The effective utilized RAM or memory for an instance is calculated by aggregating the buffer cache (buffer pool size in MB) for all the databases running on the instance.
* If multiple eligible Azure VM sizes are available, the one with the lowest cost is recommended.
* If the source is a SQL Server Always On Failover Cluster Instance, the compute size is used for a second Azure VM to meet the need for two nodes.

## Rightsizing for lift and shift migration to Azure VM

For lift and shift migration, refer to the compute and storage sizing [here](/azure/migrate/concepts-assessment-calculation#calculate-sizing-as-is-on-premises).

### Recommendation details

After the readiness and sizing calculation are complete, the optimization preference is applied to determine the recommended target and configuration. The recommendation details include a thorough explanation of the readiness and sizing calculations behind the recommendation.

### Migration guidance

This section provides guidance on configuring the target resource and the steps for migration. The steps are tailored to the specific source and the target deployment combinations. This guidance especially useful for users planning to migrate Always On Failover Cluster Instances (FCI) and Availability Groups (AG).