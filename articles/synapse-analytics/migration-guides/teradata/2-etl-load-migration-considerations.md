---
title: "Data migration, ETL, and load for Teradata migrations"
description: Learn how to plan your data migration from Teradata to Azure Synapse Analytics to minimize the risk and impact on users. 
ms.service: azure-synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
author: ajagadish-24
ms.author: ajagadish

ms.date: 06/01/2022
---

# Data migration, ETL, and load for Teradata migrations

This article is part two of a seven-part series that provides guidance on how to migrate from Teradata to Azure Synapse Analytics. The focus of this article is best practices for ETL and load migration.

## Data migration considerations

### Initial decisions for data migration from Teradata

When migrating a Teradata data warehouse, you need to ask some basic data-related questions. For example:

- Should unused table structures be migrated?

- What's the best migration approach to minimize risk and user impact?

- When migrating data marts: stay physical or go virtual?

The next sections discuss these points within the context of migration from Teradata.

#### Migrate unused tables?

> [!TIP]
> In legacy systems, it's not unusual for tables to become redundant over time&mdash;these don't need to be migrated in most cases.

It makes sense to only migrate tables that are in use in the existing system. Tables that aren't active can be archived rather than migrated, so that the data is available if necessary in future. It's best to use system metadata and log files rather than documentation to determine which tables are in use, because documentation can be out of date.

If enabled, Teradata system catalog tables and logs contain information that can determine when a given table was last accessed&mdash;which can in turn be used to decide whether a table is a candidate for migration.

Here's an example query on `DBC.Tables` that provides the date of last access and last modification:

```sql
SELECT TableName, CreatorName, CreateTimeStamp, LastAlterName,
LastAlterTimeStamp, AccessCount, LastAccessTimeStamp 
FROM DBC.Tables t
WHERE DataBaseName = 'databasename'
```

If logging is enabled and the log history is accessible, other information, such as SQL query text, is available in table DBQLogTbl and associated logging tables. For more information, see [Teradata log history](https://docs.teradata.com/reader/wada1XMYPkZVTqPKz2CNaw/PuQUxpyeCx4jvP8XCiEeGA).

#### What is the best migration approach to minimize risk and impact on users?

This question comes up frequently because companies may want to lower the impact of changes on the data warehouse data model to improve agility. Companies often see an opportunity to further modernize or transform their data during an ETL migration. This approach carries a higher risk because it changes multiple factors simultaneously, making it difficult to compare the outcomes of the old system versus the new. Making data model changes here could also affect upstream or downstream ETL jobs to other systems. Because of that risk, it's better to redesign on this scale after the data warehouse migration.

Even if a data model is intentionally changed as part of the overall migration, it's good practice to migrate the existing model as-is to Azure Synapse, rather than do any re-engineering on the new platform. This approach minimizes the effect on existing production systems, while benefiting from the performance and elastic scalability of the Azure platform for one-off re-engineering tasks.

When migrating from Teradata, consider creating a Teradata environment in a VM within Azure as a stepping-stone in the migration process.

>[!TIP]
>Migrate the existing model as-is initially, even if a change to the data model is planned in the future.

#### Use a VM Teradata instance as part of a migration

One optional approach for migrating from an on-premises Teradata environment is to leverage the Azure environment to create a Teradata instance in a VM within Azure, collocated with the target Azure Synapse environment. This is possible because Azure provides cheap cloud storage and elastic scalability.

With this approach, standard Teradata utilities, such as Teradata Parallel Data Transporter&mdash;or third-party data replication tools, such as Attunity Replicate&mdash;can be used to efficiently move the subset of Teradata tables that need to be migrated to the VM instance. Then, all migration tasks can take place within the Azure environment. This approach has several benefits:

- After the initial replication of data, migration tasks don't impact the source system.

- The Azure environment has familiar Teradata interfaces, tools, and utilities.

- The Azure environment provides network bandwidth availability between the on-premises source system and the cloud target system.

- Tools like Azure Data Factory can efficiently call utilities like Teradata Parallel Transporter to migrate data quickly and easily.

- The migration process is orchestrated and controlled entirely within the Azure environment.

#### When migrating data marts: stay physical or go virtual?

> [!TIP]
> Virtualizing data marts can save on storage and processing resources.

In legacy Teradata data warehouse environments, it's common practice to create several data marts that are structured to provide good performance for ad hoc self-service queries and reports for a given department or business function within an organization. As such, a data mart typically consists of a subset of the data warehouse and contains aggregated versions of the data in a form that enables users to easily query that data with fast response times via user-friendly query tools such as Microsoft Power BI, Tableau, or MicroStrategy. This form is typically a dimensional data model. One use of data marts is to expose the data in a usable form, even if the underlying warehouse data model is something different, such as a data vault.

You can use separate data marts for individual business units within an organization to implement robust data security regimes, by only allowing users to access specific data marts that are relevant to them, and eliminating, obfuscating, or anonymizing sensitive data.

If these data marts are implemented as physical tables, they'll require additional storage resources to store them, and additional processing to build and refresh them regularly. Also, the data in the mart will only be as up to date as the last refresh operation, and so may be unsuitable for highly volatile data dashboards.

> [!TIP]
> The performance and scalability of Azure Synapse enables virtualization without sacrificing performance.

With the advent of relatively low-cost scalable MPP architectures, such as Azure Synapse, and the inherent performance characteristics of such architectures, it may be that you can provide data mart functionality without having to instantiate the mart as a set of physical tables. This is achieved by effectively virtualizing the data marts via SQL views onto the main data warehouse, or via a virtualization layer using features such as views in Azure or the [visualization products of Microsoft partners](../../partner/data-integration.md). This approach simplifies or eliminates the need for additional storage and aggregation processing and reduces the overall number of database objects to be migrated.

There's another potential benefit to this approach. By implementing the aggregation and join logic within a virtualization layer, and presenting external reporting tools via a virtualized view, the processing required to create these views is "pushed down" into the data warehouse, which is generally the best place to run joins, aggregations, and other related operations on large data volumes.

The primary drivers for choosing a virtual data mart implementation over a physical data mart are:

- More agility: a virtual data mart is easier to change than physical tables and the associated ETL processes.

- Lower total cost of ownership: a virtualized implementation requires fewer data stores and copies of data.

- Elimination of ETL jobs to migrate and simplify data warehouse architecture in a virtualized environment.

- Performance: although physical data marts have historically been more performant, virtualization products now implement intelligent caching techniques to mitigate.

### Data migration from Teradata

#### Understand your data

Part of migration planning is understanding in detail the volume of data that needs to be migrated since that can impact decisions about the migration approach. Use system metadata to determine the physical space taken up by the "raw data" within the tables to be migrated. In this context, "raw data" means the amount of space used by the data rows within a table, excluding overheads such as indexes and compression. This is especially true for the largest fact tables since these will typically comprise more than 95% of the data.

You can get an accurate number for the volume of data to be migrated for a given table by extracting a representative sample of the data&mdash;for example, one million rows&mdash;to an uncompressed delimited flat ASCII data file. Then, use the size of that file to get an average raw data size per row of that table. Finally, multiply that average size by the total number of rows in the full table to give a raw data size for the table. Use that raw data size in your planning.

## ETL migration considerations

### Initial decisions regarding Teradata ETL migration

> [!TIP]
> Plan the approach to ETL migration ahead of time and leverage Azure facilities where appropriate.

For ETL/ELT processing, legacy Teradata data warehouses may use custom-built scripts using Teradata utilities such as BTEQ and Teradata Parallel Transporter (TPT), or third-party ETL tools such as Informatica or Ab Initio. Sometimes, Teradata data warehouses use a combination of ETL and ELT approaches that's evolved over time. When planning a migration to Azure Synapse, you need to determine the best way to implement the required ETL/ELT processing in the new environment while minimizing the cost and risk involved. To learn more about ETL and ELT processing, see [ELT vs ETL design approach](../../sql-data-warehouse/design-elt-data-loading.md).

The following sections discuss migration options and make recommendations for various use cases. This flowchart summarizes one approach:

:::image type="content" source="../media/2-etl-load-migration-considerations/migration-options-flowchart.png" border="true" alt-text="Flowchart of migration options and recommendations."::: 

The first step is always to build an inventory of ETL/ELT processes that need to be migrated. As with other steps, it's possible that the standard "built-in" Azure features make it unnecessary to migrate some existing processes. For planning purposes, it's important to understand the scale of the migration to be performed.

In the preceding flowchart, decision 1 relates to a high-level decision about whether to migrate to a totally Azure-native environment. If you're moving to a totally Azure-native environment, we recommend that you re-engineer the ETL processing using [Pipelines and activities in Azure Data Factory](../../../data-factory/concepts-pipelines-activities.md?msclkid=b6ea2be4cfda11ec929ac33e6e00db98&tabs=data-factory) or [Azure Synapse Pipelines](../../get-started-pipelines.md?msclkid=b6e99db9cfda11ecbaba18ca59d5c95c). If you're not moving to a totally Azure-native environment, then decision 2 is whether an existing third-party ETL tool is already in use.

In the Teradata environment, some or all ETL processing may be performed by custom scripts using Teradata-specific utilities like BTEQ and TPT. In this case, your approach should be to re-engineer using Data Factory.

> [!TIP]
> Leverage investment in existing third-party tools to reduce cost and risk.

If a third-party ETL tool is already in use, and especially if there's a large investment in skills or several existing workflows and schedules use that tool, then decision 3 is whether the tool can efficiently support Azure Synapse as a target environment. Ideally, the tool will include "native" connectors that can leverage Azure facilities like PolyBase or [COPY INTO](/sql/t-sql/statements/copy-into-transact-sql), for the most efficient data loading. There's a way to call an external process, such as PolyBase or `COPY INTO`, and pass in the appropriate parameters. In this case, leverage existing skills and workflows, with Azure Synapse as the new target environment.

If you decide to retain an existing third-party ETL tool, there may be benefits to running that tool within the Azure environment (rather than on an existing on-premises ETL server) and having Azure Data Factory handle the overall orchestration of the existing workflows. One particular benefit is that less data needs to be downloaded from Azure, processed, and then uploaded back into Azure. So, decision 4 is whether to leave the existing tool running as-is or move it into the Azure environment to achieve cost, performance, and scalability benefits.

### Re-engineer existing Teradata-specific scripts

If some or all the existing Teradata warehouse ETL/ELT processing is handled by custom scripts that utilize Teradata-specific utilities, such as BTEQ, MLOAD, or TPT, these scripts need to be recoded for the new Azure Synapse environment. Similarly, if ETL processes were implemented using stored procedures in Teradata, then these will also have to be recoded.

> [!TIP]
> The inventory of ETL tasks to be migrated should include scripts and stored procedures.

Some elements of the ETL process are easy to migrate, for example by simple bulk data load into a staging table from an external file. It may even be possible to automate those parts of the process, for example, by using PolyBase instead of fast load or MLOAD. If the exported files are Parquet, you can use a native Parquet reader, which is a faster option than PolyBase. Other parts of the process that contain arbitrary complex SQL and/or stored procedures will take more time to re-engineer.

One way of testing Teradata SQL for compatibility with Azure Synapse is to capture some representative SQL statements from Teradata logs, then prefix those queries with `EXPLAIN`, and then&mdash;assuming a like-for-like migrated data model in Azure Synapse&mdash;run those `EXPLAIN` statements in Azure Synapse. Any incompatible SQL will generate an error, and the error information can determine the scale of the recoding task.

[Microsoft partners](/azure/sql-data-warehouse/sql-data-warehouse-partner-data-integration) offer tools and services to migrate Teradata SQL and stored procedures to Azure Synapse.

### Use third-party ETL tools

As described in the previous section, in many cases the existing legacy data warehouse system will already be populated and maintained by third-party ETL products. For a list of Microsoft data integration partners for Azure Synapse, see [Data integration partners](/azure/sql-data-warehouse/sql-data-warehouse-partner-data-integration).

## Data loading from Teradata

### Choices available when loading data from Teradata

> [!TIP]
> Third-party tools can simplify and automate the migration process and therefore reduce risk.

When it comes to migrating data from a Teradata data warehouse, there are some basic questions associated with data loading that need to be resolved. You'll need to decide how the data will be physically moved from the existing on-premises Teradata environment into Azure Synapse in the cloud, and which tools will be used to perform the transfer and load. Consider the following questions, which are discussed in the next sections.

- Will you extract the data to files, or move it directly via a network connection?

- Will you orchestrate the process from the source system, or from the Azure target environment?

- Which tools will you use to automate and manage the process?

#### Transfer data via files or network connection?

> [!TIP]
> Understand the data volumes to be migrated and the available network bandwidth since these factors influence the migration approach decision.

Once the database tables to be migrated have been created in Azure Synapse, you can move the data to populate those tables out of the legacy Teradata system and into the new environment. There are two basic approaches:

- **File extract**: extract the data from the Teradata tables to flat files, normally in CSV format, via BTEQ, Fast Export, or Teradata Parallel Transporter (TPT). Use TPT whenever possible since it's the most efficient in terms of data throughput.

  This approach requires space to land the extracted data files. The space could be local to the Teradata source database (if sufficient storage is available), or remote in Azure Blob Storage. The best performance is achieved when a file is written locally, since that avoids network overhead.

  To minimize the storage and network transfer requirements, it's good practice to compress the extracted data files using a utility like gzip.

  Once extracted, the flat files can either be moved into Azure Blob Storage (collocated with the target Azure Synapse instance) or loaded directly into Azure Synapse using PolyBase or [COPY INTO](/sql/t-sql/statements/copy-into-transact-sql). The method for physically moving data from local on-premises storage to the Azure cloud environment depends on the amount of data and the available network bandwidth.

  Microsoft provides different options to move large volumes of data, including AZCopy for moving files across the network into Azure Storage, Azure ExpressRoute for moving bulk data over a private network connection, and Azure Data Box where the files are moved to a physical storage device that's then shipped to an Azure data center for loading. For more information, see [data transfer](/azure/architecture/data-guide/scenarios/data-transfer).

- **Direct extract and load across network**: the target Azure environment sends a data extract request, normally via a SQL command, to the legacy Teradata system to extract the data. The results are sent across the network and loaded directly into Azure Synapse, with no need to land the data into intermediate files. The limiting factor in this scenario is normally the bandwidth of the network connection between the Teradata database and the Azure environment. For very large data volumes this approach may not be practical.

There's also a hybrid approach that uses both methods. For example, you can use the direct network extract approach for smaller dimension tables and samples of the larger fact tables to quickly provide a test environment in Azure Synapse. For the large volume historical fact tables, you can use the file extract and transfer approach using Azure Data Box.

#### Orchestrate from Teradata or Azure?

The recommended approach when moving to Azure Synapse is to orchestrate the data extract and loading from the Azure environment using [Azure Synapse Pipelines](../../get-started-pipelines.md?msclkid=b6e99db9cfda11ecbaba18ca59d5c95c) or [Azure Data Factory](../../../data-factory/introduction.md?msclkid=2ccc66eccfde11ecaa58877e9d228779), as well as associated utilities, such as PolyBase or [COPY INTO](/sql/t-sql/statements/copy-into-transact-sql), for most efficient data loading. This approach leverages the Azure capabilities and provides an easy method to build reusable data loading pipelines.

Other benefits of this approach include reduced impact on the Teradata system during the data load process since the management and loading process is running in Azure, and the ability to automate the process by using metadata-driven data load pipelines.

#### Which tools can be used?

The task of data transformation and movement is the basic function of all ETL products. If one of these products is already in use in the existing Teradata environment, then using the existing ETL tool may simplify data migration from Teradata to Azure Synapse. This approach assumes that the ETL tool supports Azure Synapse as a target environment. For more information on tools that support Azure Synapse, see [Data integration partners](/azure/sql-data-warehouse/sql-data-warehouse-partner-data-integration).

If you're using an ETL tool, consider running that tool within the Azure environment to benefit from Azure cloud performance, scalability, and cost, and free up resources in the Teradata data center. Another benefit is reduced data movement between the cloud and on-premises environments.

## Summary

To summarize, our recommendations for migrating data and associated ETL processes from Teradata to Azure Synapse are:

- Plan ahead to ensure a successful migration exercise.

- Build a detailed inventory of data and processes to be migrated as soon as possible.

- Use system metadata and log files to get an accurate understanding of data and process usage. Don't rely on documentation since it may be out of date.

- Understand the data volumes to be migrated, and the network bandwidth between the on-premises data center and Azure cloud environments.

- Consider using a Teradata instance in an Azure VM as a stepping stone to offload migration from the legacy Teradata environment.

- Leverage standard "built-in" Azure features to minimize the migration workload.

- Identify and understand the most efficient tools for data extraction and loading in both Teradata and Azure environments. Use the appropriate tools in each phase of the process.

- Use Azure facilities, such as [Azure Synapse Pipelines](../../get-started-pipelines.md?msclkid=b6e99db9cfda11ecbaba18ca59d5c95c) or [Azure Data Factory](../../../data-factory/introduction.md?msclkid=2ccc66eccfde11ecaa58877e9d228779), to orchestrate and automate the migration process while minimizing impact on the Teradata system.

## Next steps

To learn more about security access operations, see the next article in this series: [Security, access, and operations for Teradata migrations](3-security-access-operations.md).