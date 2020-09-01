---
title: "SQL Server to SQL Managed Instance - migration overview"
description: Learn about the different tools and options available to migrate your SQL Server databases to Azure SQL Managed Instance.
ms.service: sql-database
ms.subservice: migration
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: MashaMSFT
ms.author: mathoma
ms.reviewer: rajpo
ms.date: 08/25/2020
---
# Migration overview: SQL Server to SQL Managed Instance
[!INCLUDE[appliesto--sqlmi](../../includes/appliesto-sqlmi.md)]

Learn about the different migration options to migrate your SQL Server to Azure SQL Managed Instance. 

You can migrate SQL Server running on-premises or on: 

- SQL Server on Virtual Machines  
- Amazon Web Services (AWS) EC2 
- Amazon Relational Database Service (AWS RDS) 
- Compute Engine (Google Cloud Platform - GCP)  
- Cloud SQL for SQL Server (Google Cloud Platform – GCP) 

## Overview
[Azure SQL Managed Instance](../../managed-instance/sql-managed-instance-paas-overview.md) is a recommended target option for SQL Server workloads that require a fully managed service without having to worry about management of virtual machines or their operating systems. SQL Managed Instance enables you to lift-and-shift your on-premises applications to Azure with minimal application or database changes while having complete isolation of your instances with native virtual network (VNet) support. 

## Considerations 

The key factors to consider when evaluating migration options depend on: 
- Number of servers and databases
- Size of databases
- Acceptable business downtime during the migration process 

Based on these factors, choose between an online and offline migration. During an offline migration, your application incurs downtime the entirety of the migration whereas for an online migration, application downtime is limited to the time required to cut over to SQL Managed Instance during the final step of the migration process. 

One of the key benefits of migrating your SQL Servers to Azure SQL MI is that you can move an entire instance or a bunch of databases as part of the migration process. Hence, it is important to carefully plan your migration activities to include the following: 

The migration of all databases that need to be co-located on the same instance. 

The migration of instance-level objects that your application depends on, including logins, credentials, SQL Agent jobs and operators, and server-level triggers 



### Choosing an appropriate managed instance 

Some general guidelines that would help you choose the right service tier and characteristics of Azure SQL MI are below: 

- Based on the baseline CPU usage, you can provision a managed instance that matches the number of cores that you are using on SQL Server, having in mind that CPU characteristics might need to be scaled to match [VM characteristics where the managed instance is installed](https://review.docs.microsoft.com/en-us/azure/azure-sql/managed-instance/resource-limits?branch=master#hardware-generation-characteristics). 
- Based on the baseline memory usage, choose [the service tier that has matching memory](https://review.docs.microsoft.com/en-us/azure/azure-sql/managed-instance/resource-limits?branch=master#hardware-generation-characteristics). The amount of memory cannot be directly chosen, so you would need to select the managed instance with the amount of vCores that has matching memory (for example, 5.1 GB/vCore in Gen5). 
- Based on the baseline IO latency of the file subsystem, choose between the General Purpose (latency greater than 5 ms) and Business Critical (latency less than 3 ms) service tiers. 
- Based on baseline throughput, pre-allocate the size of data or log files to get expected IO performance. 

You can choose compute and storage resources at deployment time and then change it afterward without introducing downtime for your application using the [Azure portal](https://review.docs.microsoft.com/en-us/azure/azure-sql/database/scale-resources?branch=master).

> [!IMPORTANT]
> It is important to keep your destination VNet and subnet in accordance with [managed instance VNet requirements](https://review.docs.microsoft.com/en-us/azure/azure-sql/managed-instance/connectivity-architecture-overview?branch=release-ignite-arc-data#network-requirements). Any discrepancy in the VNet requirements can prevent you from creating new instances or using those that you already created. Learn more about [creating new](https://review.docs.microsoft.com/en-us/azure/azure-sql/managed-instance/virtual-network-subnet-create-arm-template?branch=release-ignite-arc-data) and [configuring existing](https://review.docs.microsoft.com/en-us/azure/azure-sql/managed-instance/vnet-existing-add-subnet?branch=release-ignite-arc-data) networks. 

### Encryption 
When you're migrating a database protected by Transparent Data Encryption to a managed instance using native restore option, the corresponding certificate from the on-premises or Azure VM SQL Server needs to be migrated before database restore. For detailed steps, see Migrate a TDE cert to a managed instance. 

Restore of system databases is not supported. To migrate instance-level objects (stored in master or msdb databases), we recommend to script them out and run T-SQL scripts on the destination instance. 


## Migration options

The following table describes data migration options and corresponding recommendations: 


|Migration option  |When to use  |Description  |Considerations  |
|---------|---------|---------|---------|
|[Azure Database Migration Service - online](/azure/dms/tutorial-sql-server-managed-instance-online) | Best suited for customers wanting to migrate databases at scale using a first party database migration service with minimal downtime.  </br> </br> Supported sources: </br> - SQL Server (2005 - 2019) on-premies or Azure VM </br> - AWS EC2 </br> - AWS RDS </br> - GCP Compute SQL Server VM  Azure Database Migration Service is a first party Azure service that supports online migrations at scale to Azure SQL Managed Instance from all supported source SQL Server versions. The only downtime in this option is the time required to cutover to the target Azure SQL Managed Instance (which in the time taken for the final transaction log backup to be restored).  | - Migrations at scale can be automated via [PowerShell](/azure/dms/howto-sql-server-to-azure-sql-mi-powershell). </br> - Application changes to update connection strings after the cutover needs to be factored in.  </br> - Monitoring and cutover status is available in the online migration mode.  |
|[Azure Database Migration Service - offline](/azure/dms/tutorial-sql-server-to-managed-instance) | Best suited for customers looking to migrate databases at scale using a first party database migration service and can accommodate downtime during the migration process.  </br> </br> Supported sources: </br> - SQL Server (2005 - 2019) on-premies or Azure VM </br> - AWS EC2 </br> - AWS RDS </br> - GCP Compute SQL Server VM | Azure Database Migration Service supports SQL Server migration to Azure SQL Managed Instance in the offline mode for applications that can afford downtime during the migration process. Unlike the online mode above that is a continuous migration process, offline mode runs a one-off migration step to restore a full database backup from the source to the target. DMS can also create a full backup file for you before starting the migration.  |  - Migrations at scale can be automated via [PowerShell](/azure/dms/howto-sql-server-to-azure-sql-mi-powershell). </br> - Time to complete migration is a size of data operation (based on the backup and restore time) and requires business to allow sufficient downtime.  |
| [Native backup and restore](../../managed-instance/restore-sample-database-quickstart.md) | For customers who want to migrate individual line-of-business application databases in a quick and easy migration process without requiring a separate migration service or tool.  </br> </br> Supported sources: </br> - SQL Server (2005 - 2019) on-premies or Azure VM </br> - AWS EC2 </br> - AWS RDS </br> - GCP Compute SQL Server VM   | Azure SQL Managed Instance supports RESTORE of native SQL Server database backups (.bak files) which makes it the easiest migration option for customers who can provide full database backups in Azure storage.|The SQL Server backup operation uses multiple threads to optimize data transfer to Azure Blob storage services. However the performance depends on various factors, such as ISV bandwidth and size of the database and hence the downtime should accommodate the time required to perform a backup and restore. |
|[Transactional replication](../../managed-instance/replication-transactional-overview.md) | This option is suitable for customers to migrate databases to Azure SQL Managed Instance by continuously publishing changes from source database tables to target Azure SQL Managed Instance database tables. This option is also suitable for partial migration of selected tables (subset of database) to Azure SQL Managed Instance.  </br> - SQL Server (2012 - 2019) on-premies or Azure VM with some limitations </br> - AWS EC2  </br> - GCP Compute SQL Server VM |Transactional Replication enables you to replicate data from source SQL Server database table(s) to Azure SQL Managed Instance by providing a publisher-subscriber type migration option while maintaining transactional consistency. | </br> - Setup is relatively complex compared to other migration options listed above.   </br> - Provides a continuous replication option to migrate data (without taking the databases offline).  </br> - It's possible to [monitor replication activity](/sql/relational-databases/replication/monitor/monitoring-replication).    |
|[Bulk copy](/sql/relational-databases/import-export/import-and-export-bulk-data-by-using-the-bcp-utility-sql-server)| Suitable for customers to migrate looking to migrate database to Azure SQL Managed Instance manually by performing an export of the source database tables into a data file. This option is also suitable for partial data migration of a subset of data from the source SQL Server to Azure SQL Managed Instance.  </br> </br> Supported sources: </br> - SQL Server (2005 - 2019) on-premies or Azure VM </br> - AWS EC2 </br> - AWS RDS </br> - GCP Compute SQL Server VM      | The [bulk copy program (bcp) utility](/sql/tools/bcp-utility) copies data between an instance of Microsoft SQL Server and a data file in a user-specified format. In this context, bcp utility can be used to both export data from a source SQL Server to a data file and to import the data file back into Azure SQL Managed Instance.  |   </br> - This option requires downtime as data needs to be exported at the source and imported at the destination.   </br> - The file formats and data types used in the export / import will need to be consistent with table schemas.        |

## Feature interoperability 

There are additional considerations when migrating workloads that rely on other SQL Server features. 

### SQL Server Integration Services (SSIS)

f you use SSIS packages in your source SQL Server, you can migrate the SSIS packages / projects in SSISDB to SSISDB in Azure SQL Managed Instance using [Azure Database Migration Service (DMS)](/azure/dms/how-to-migrate-ssis-packages-managed-instance). 

Migration of SSIS is only supported if the SSIS packages are in SSISDB (in a project deployment model) that is available in SQL Server 2012 and above. For legacy SSIS packages below SQL Server 2012 (package deployment model), they would need to be converted before migrating them to Azure SQL Managed Instance. For more information, see the article Converting projects to the project deployment model.

### SQL Server Reporting Services (SSRS)

SSRS reports can be migrated to paginated reports in Power BI. We recommend you use the [RDL Migration Tool](https://github.com/microsoft/RdlMigration) to help prepare, and migrate your reports. This tool was developed by Microsoft to help customers migrate RDL reports from their SSRS servers to Power BI. It is available on GitHub, and it documents an end-to-end walkthrough of the migration scenario. 

### High availability

SQL Server instances that rely on the high availability features Always On failover cluster instances and Always On availability groups become obsolete on the target Azure SQL Managed Instance as High Availability architecture is already built into both [General Purpose (standard availability model)](../../database/high-availability-sla.md#basic-standard-and-general-purpose-service-tier-availability.md) and [Business Critical (premium availability model)](../../database/high-availability-sla.md#premium-and-business-critical-service-tier-availability) SQL Managed Instance. The premium availability model also provides read scale out that allows connecting into one of the secondary nodes for read only purposes. 

Beyond the high availability architecture that is included in Azure SQL Managed Instance, there is also [auto-failover groups](../../database/auto-failover-group-overview.md) feature that allows you to manage the replication and failover of a group of all databases in a managed instance to another region. 

### SQL Agent jobs 

Azure DMS supports migration of [SQL Agent jobs](/azure/dms/howto-sql-server-to-azure-sql-mi-powershell#offline-migrations) when run in offline mode. The source SQL Agent jobs can also be scripted in T-SQL using SQL Server Management Studio and manually re-created in the target SQL Managed Instance. 

   > [!IMPORTANT]
   > Currently, Azure DMS only supports jobs with T-SQL subsystem steps. Jobs with SSIS package steps will have to be manually migrated. 

### Logins and groups 

SQL logins from source SQL Server can be moved to Azure SQL Managed Instance using DMS in offline mode. DMS (offline mode) has a “Select logins” blade in the Migration Wizard that is populated with SQL logins from the source SQL Server. 

Windows users and groups can also be migrated using DMS by enabling the corresponding toggle button in the DMS Configuration page. 

Alternatively, you can leverage this [PowerShell utility tool](https://github.com/microsoft/DataMigrationTeam/tree/master/IP%20and%20Scripts/MoveLogins) that was built by Microsoft Data Migration Architects to help customers migrate their on-premises Windows and SQL logins to Azure SQL Managed Instance. The utility is a PowerShell script that creates a T-SQL command script to re-create logins and select database users from an on-premises SQL Server to Azure SQL Managed Instance. The tool allows automatic mapping of Windows AD accounts to Azure AD accounts or it can do UPN lookups for each login against the on-premises Windows Active Directory. The tool optionally moves SQL Server native logins as well. Custom server and database roles are scripted, as well as role membership and database role and user permissions. Contained databases are not yet supported and only a subset of possible SQL Server permissions are scripted. 

## Partners

The following partners can provide alternative methods for migration as well: 

:::row:::
   :::column span="":::
      [:::image type="content" source="media/sql-server-to-managed-instance-overview/Blitzz_logo_84.png" alt-text="Blitzz":::](https://www.blitzz.io/product)
   :::column-end:::
   :::column span="":::
      [:::image type="content" source="media/sql-server-to-managed-instance-overview/blueprint_logo.png" alt-text="Blueprint":::](https://bpcs.com/what-we-do)
   :::column-end:::
   :::column span="":::
      [:::image type="content" source="media/sql-server-to-managed-instance-overview/Cognizant-220.1.png" alt-text="Cognizant":::](https://www.cognizant.com/partners/microsoft)
   :::column-end:::   
:::row-end:::
:::row:::
   :::column span="":::
      [:::image type="content" source="media/sql-server-to-managed-instance-overview/commvault-220.png" alt-text="Commvault":::](https://www.commvault.com/supported-technologies/microsoft)
   :::column-end:::   
   :::column span="":::
      [:::image type="content" source="media/sql-server-to-managed-instance-overview/DataSunrise_database_security_logo.png" alt-text="DataSunrise":::](https://www.datasunrise.com/)
   :::column-end:::
   :::column span="":::
      [:::image type="content" source="media/sql-server-to-managed-instance-overview/dbbest-logo.png" alt-text="DBBTest":::](https://www.dbbest.com/)
   :::column-end:::   
:::row-end:::
:::row:::
   :::column span="":::
      [:::image type="content" source="media/sql-server-to-managed-instance-overview/DXC_logo_cropped.png" alt-text="DXC":::](https://www.dxc.technology/application_services/offerings/139843/142343-application_services_for_microsoft_azure)
   :::column-end:::
   :::column span="":::
     [:::image type="content" source="media/sql-server-to-managed-instance-overview/InfosysLogo.png" alt-text="Infosys":::](https://www.infosys.com/services/)
   :::column-end:::
   :::column span="":::
      [:::image type="content" source="media/sql-server-to-managed-instance-overview/nayatech_migVisor_logo_small.png" alt-text="MigVisor":::](https://www.migvisor.com/)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      [:::image type="content" source="media/sql-server-to-managed-instance-overview/querysurge_logo-84.png" alt-text="Querysurge":::](https://www.querysurge.com/company/partners/microsoft)
   :::column-end:::
   :::column span="":::
     [:::image type="content" source="media/sql-server-to-managed-instance-overview/quest_logo_cropped1.png" alt-text="Quest":::](https://www.quest.com/products/shareplex/)
   :::column-end:::   
   :::column span="":::
     [:::image type="content" source="media/sql-server-to-managed-instance-overview/rhipe-logo-small_final1.png" alt-text="Rhipe":::](https://www.rhipe.com/services/azure-migration/)
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
     [:::image type="content" source="media/sql-server-to-managed-instance-overview/scalability-experts-logo3.png" alt-text="Scalability Experts":::](http://www.scalabilityexperts.com/products/index.html)
   :::column-end:::   
   :::column span="":::
     [:::image type="content" source="media/sql-server-to-managed-instance-overview/wipro-220.png" alt-text="Wipro":::](https://www.wipro.com/analytics/)
   :::column-end:::
   :::column span="":::
     [:::image type="content" source="media/sql-server-to-managed-instance-overview/Zen3-logo-220.png" alt-text="Zen":::](https://www.zen3.com/cloud-migration/)
   :::column-end:::
:::row-end:::


## Next steps

To start migrating your SQL Server to Azure SQL Managed Instance, see the [Database Migration Assistant guide](sql-server-to-managed-instance-guide.md).

- For a matrix of the Microsoft and third-party services and tools that are available to assist you with various database and data migration scenarios as well as specialty tasks, see the article [Service and tools for data migration.](../../../dms/dms-tools-matrix.md)

- To learn more about Azure SQL see:
   - [Deployment options](../../azure-sql-iaas-vs-paas-what-is-overview.md)
   - [SQL Server on Azure VMs](../../virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview.md)
   - [Azure total Cost of Ownership Calculator](https://azure.microsoft.com/pricing/tco/calculator/) 


- To learn more about the framework and adoption cycle for Cloud migrations, see
   -  [Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/contoso-migration-scale)
   -  [Best practices for costing and sizing workloads migrate to Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs) 

- For information about licensing, see
   - [Bring your own license with the Azure Hybrid Benefit](../../virtual-machines/windows/licensing-model-azure-hybrid-benefit-ahb-change.md)
   - [Get free extended support for SQL Server 2008 and SQL Server 2008 R2](../../windows/sql-server-2008-extend-end-of-support.md)


- To assess the Application access layer, see [Data Access Migration Toolkit (Preview)](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit)
- For details on how to perform Data Access Layer A/B testing see [Database Experimentation Assistant](/sql/dea/database-experimentation-assistant-overview).