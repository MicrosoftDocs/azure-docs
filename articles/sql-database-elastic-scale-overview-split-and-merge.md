<properties 
	pageTitle="Splitting and Merging with Elastic Scale" 
	description="Explains how to manipulate shards and move data via a self-hosted service using Elastic Scale APIs." 
	services="sql-database" 
	documentationCenter="" 
	manager="stuartozer" 
	authors="torsteng" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/03/2015" 
	ms.author="torsteng"/>

# Splitting and Merging with Elastic Scale

Applications built on Azure SQL Database face challenges when their data or processing needs no longer fit a single scale unit in Azure SQL Database. Examples include applications that go viral or where a particular set of tenants grow beyond the limits of a single Azure SQL DB database. The Elastic Scale **Split/Merge Service** greatly eases this pain. 

This discussion of the Split/Merge Service manages scale-in and scale-out by changing the number of Azure DB databases and balancing the distribution of **shardlets** among them. (For term definitions, see [Elastic Scale Glossary](./sql-database-elastic-scale-glossary.md)). 

With the current choices between Azure SQL DB editions, capacity can also be managed by scaling up or down the capacity of a single Azure SQL DB database. The scale-up/down dimension of elastic capacity management is not covered by Split/Merge – see Shard Elasticity instead [Elastic Scale Shard Elasticity](./sql-database-elastic-scale-elasticity.md)). 

## Scenarios for Split/Merge 
Applications need to stretch flexibly beyond the limits of a single Azure SQL DB database, as illustrated by the following scenarios: 

* **Grow Capacity – Splitting Ranges**: The ability to grow aggregate capacity at the data tier addresses increasing capacity needs. In this scenario, the application provides the additional capacity by sharding the data and by distributing it across incrementally more databases until capacity needs are fulfilled. The ‘split’ feature of the Elastic Scale Split/Merge Service addresses this scenario. 

* **Shrink Capacity – Merging Ranges**: Capacity fluctuates due to the seasonal nature of a business. This scenario underlines the need to easily scale back to fewer scale units when business slows. The ‘merge’ feature in the Elastic Scale Split/Merge Service covers this requirement. 

* **Manage Hotspots – Moving Shardlets**: With multiple tenants per database, the allocation of shardlets to shards can lead to capacity bottlenecks on some shards. This requires re-allocating shardlets or moving busy shardlets to new or less utilized shards. 

In the following, we will refer to any processing in the service along these capabilities as **split/merge/move** requests. 


Figure 1: Conceptual Overview of Split/Merge


![Overview][1] 


**Note**:  Not all **Grow Capacity** scenarios require the Split/Merge service. For example if you periodically create new shards in your environment to store new data with increasing sharding key values, you can use the Shard Map Management client APIs to direct new data ranges to newly created shards. Split/Merge service is needed only when existing data needs to be moved as well.

## Concepts & Key Features

**Customer-Hosted Services**: Split/Merge is delivered as a customer-hosted service. You must deploy and host the service in your Microsoft Azure subscription. The package you download from NuGet contains a configuration template to complete with the information for your specific deployment. See the  [Split-Merge tutorial](./sql-database-elastic-scale-configure-deploy-split-and-merge.md) for details. Since the service runs in your Azure subscription, you can control and configure most security aspects of the service. The default template includes the options to configure SSL, certificate-based client authentication, DoS guarding and IP restrictions. You can find more information on the security aspects in the following document [Elastic Scale Security Considerations](./sql-database-elastic-scale-configure-security.md).

The default deployed service runs with one worker and one web role. Each uses the A1 VM size in Azure Cloud Services. While you cannot modify these settings when deploying the package, you could change them after a successful deployment in the running cloud service, (through the Azure portal). Note that the worker role must not be configured for more than a single instance for technical reasons. 

**Shard Map Integration**: The Split/Merge service interacts with the shard map of the application. When using the Split/Merge service to split or merge ranges or to move shardlets between shards, the service automatically keeps the shard map up to date. To do so, the service connects to the shard map manager database of the application and maintains ranges and mappings as split/merge/move requests progress. This ensures that the shard map always presents an up-to-date view when Split/Merge operations are going on. Split, merge and shardlet movement operations are implemented by moving a batch of shardlets from the source shard to the target shard. During the shardlet movement operation the shardlets subject to the current batch are marked as offline in the shard map and are unavailable for data-dependent routing connections using the **OpenConnectionForKey** API. 

**Consistent Shardlet Connections**: When data movement starts for a new batch of shardlets, any shard-map provided data-dependent routing connections to the shard storing the shardlet are killed and subsequent connections from the shard map APIs to the these shardlets are blocked while the data movement is in progress in order to avoid inconsistencies. Connections to other shardlets on the same shard will also get killed, but will succeed again immediately on retry. Once the batch is moved, the shardlets are marked online again for the target shard and the source data is removed from the source shard. The service goes through these steps for every batch until all shardlets have been moved. This will lead to several connection kill operations during the course of the complete split/merge/move operation.   

**Managing Shardlet Availability**: Limiting the connection killing to the current batch of shardlets as discussed above restricts the scope of unavailability to one batch of shardlets at a time. This is preferred over an approach where the complete shard would remain offline for all its shardlets during the course of a split/merge operation. The size of a batch, defined as the number of distinct shardlets to move at a time, is a configuration parameter. It can be defined for each split/merge operation depending on the application’s availability and performance needs. Note that the range that is being locked in the shard map may be larger than the batch size specified. This is because the service picks the range size such that the actual number of sharding key values in the data approximately matches the batch size. This is important to remember in particular for sparsely populated sharding keys. 

**Metadata Storage**: The Split/Merge service uses a database to maintain its status and to keep logs during request processing. The user creates this database in their subscription and provides the connection string for it in the configuration file for the service deployment. Administrators from the user’s organization can also connect to this database to review request progress and to investigate detailed information regarding potential failures.

**Sharding-Awareness**: The Split/Merge service differentiates between (1) sharded tables, (2) reference tables, and (3) normal tables. The semantics of a split/merge/move operation depend on the type of the table used and are defined as follows: 

* **Sharded tables**: Split/Merge/Move operations move shardlets from source to target shard. After successful completion of the overall request, those shardlets are no longer present on the source. Note that the target tables need to exist on the target shard and must not contain data in the target range prior to processing of the operation. 

-    **Reference tables**: For reference tables, the split, merge and move operations copy the data from the source to the target shard. Note, however, that no changes occur on the target shard for a given table if any row is already present in this table on the target. The table has to be empty for any reference table copy operation to get processed.

-    **Other Tables**: Other tables can be present on either the source or the target of a split/merge operation. Split/merge disregards these tables for any data movement or copy operations. Note, however, that they can interfere with these operations in case of constraints.

The information on reference vs. sharded tables is provided by the **SchemaInfo** APIs on the shard map. The following example illustrates the use of these APIs on a given shard map manager object smm: 

    // Create the schema annotations 
    SchemaInfo schemaInfo = new SchemaInfo(); 

    // Reference tables 
    schemaInfo.Add(new ReferenceTableInfo("dbo", "region")); 
    schemaInfo.Add(new ReferenceTableInfo("dbo", "nation")); 

    // Sharded tables 
    schemaInfo.Add(new ShardedTableInfo("dbo", "customer", "C_CUSTKEY")); 
    schemaInfo.Add(new ShardedTableInfo("dbo", "orders", "O_CUSTKEY")); 

    // Publish 
    smm.GetSchemaInfoCollection().Add(Configuration.ShardMapName, schemaInfo); 

The tables ‘region’ and ‘nation’ are defined as reference tables and will be copied with split/merge/move operations. ‘customer’ and ‘orders’ in turn are defined as sharded tables. C_CUSTKEY and O_CUSTKEY serve as the sharding key. 

**Referential Integrity**: The Split/Merge service analyzes dependencies between tables and uses foreign key-primary key relationships to stage the operations for moving reference tables and shardlets. In general, reference tables are copied first in dependency order, then shardlets are copied in order of their dependencies within each batch. This is necessary so that FK-PK constraints on the target shard are honored as the new data arrives. 

**Shard Map Consistency and Eventual Completion**: In the presence of failures, the Split/Merge service resumes operations after any outage and aims to complete any in progress requests. However, there may be unrecoverable situations, e.g., when the target shard is lost or compromised beyond repair. Under those circumstances, some shardlets that were supposed to be moved may continue to reside on the source shard. The service ensures that shardlet mappings are only updated after the necessary data has been successfully copied to the target. Shardlets are only deleted on the source once all their data has been copied to the target and the corresponding mappings have been updated successfully. The deletion operation happens in the background while the range is already online on the target shard. The Split/Merge service always ensures correctness of the mappings stored in the shard map.

## Getting the Service Binaries

The service binaries for Split/Merge are provided through [Nuget](http://www.nuget.org/packages/Microsoft.Azure.SqlDatabase.ElasticScale.Service.SplitMerge/). See the step-by-step [Split-Merge tutorial](./sql-database-elastic-scale-configure-deploy-split-and-merge.md) for more information about downloading the binaries.

## The Split/Merge User Interface

Besides its worker role, the Split/Merge service package also includes a web role that can be used to submit Split/Merge requests in an interactive way. The main components of the user interface are as follows:

-    Operation Type: The operation type is a radio button that controls the kind of operation performed by the service for this request. You can choose between the split, merge and move scenarios discussed in Concepts and Key Features. In addition, you can also cancel a previously submitted operation.

-    Shard Map: The next section of request parameters cover information about the shard map and the database hosting your shard map. In particular, you need to provide the name of the Azure SQL Database server and database hosting the shardmap, credentials to connect to the shard map database, and finally the name of the shard map. Currently, the operation only accepts a single set of credentials. These credentials need to have sufficient permissions to perform changes to the shard map as well as to the user data on the shards.

-    Source Range (Split/Merge): For split and merge operation, a request needs to have the low and high key of the source range on the source shard. Currently, you need to specifiy the keys exactly as they occur in the mappings in your shard map. You can use the GetMappings.ps1 PowerShell script to retrieve the current mappings in a given shard map.

-    Split Key and Behavior (Split): For split operations, you also need to define at which point you want to split the source range. You do this by providing the sharding key where you want the split to occur. Use the radio button next to define whether you want the lower part of the range (excluding the split key) to move, or whether you want the upper part to move (including the split key).

-    Source Shardlet (Move): Move operations are different from split or merge operations as they do not require a range to describe the source. A source for move is simply identified by the sharding key value that you plan to move.

-    Target Shard (Split): Once you have provided the information on the source of your split operation, you need to define where you want the data to be copied to by providing the Azure SQL Db server and database name for the target.

-    Target Range (Merge): Merge operations instead move shardlets to an existing shard. You identify the existing shard by providing the range boundaries of the existing range that you want to merge with.

-    Batch Size: The batch size controls the number of shardlets that will go offline at a time during the data movement. This is an integer value where you can use smaller values when you are sensitive to long periods of downtime for shardlets. Larger values will increase the time that a given shardlet is offline but may improve performance.

-    Operation Id (Cancel): If you have an ongoing operation that is no longer needed, you can cancel the operation by providing its operation ID in this field. You can retrieve the operation ID from the request status table (see Section 8.1) or from the output in the web browser where you submitted the request.


## Requirements and Limitations 

The current implementation of the Split/Merge service is subject to the following requirements and limitations: 

* Currently, the shards need to exist and be registered in the shard map before a Split/Merge operation on these shards can be performed. 

* The Split/Merge service currently does not create tables or any other database objects automatically as part of its operations. This means that the schema for all sharded tables and reference tables need to exist on the target shard prior to any split/merge/move operation. Sharded tables in particular are required to be empty in the range where new shardlets are to be added by a split/merge/move operation. Otherwise, the operation will fail the initial consistency check on the target shard. Also note that reference data is only copied if the reference table is empty and that there are no consistency guarantees with regard to other concurrent write operations on the reference tables. We recommend that – at the time of running split/merge operations – there are no other write operations making changes to the reference tables.

* The service currently relies on row identity established by a unique index or key that includes the sharding key to improve performance and reliability for large shardlets. This allows the service to move data at an even finer granularity than just the sharding key value. This helps to reduce the maximum amount of log space and locks that are required during the operation. Consider creating a unique index or a primary key including the sharding key on a given table if you want to use that table with split/merge/move requests. For performance reasons, the sharding key should be the leading column in the key or the index.

* During the course of request processing, some shardlet data may be present both on the source and the target shard. This is currently necessary to protect against failures during the shardlet movement. As explained above, the integration of Split/Merge with the Elastic Scale shard map ensures, that connections through the data dependent routing APIs using the **OpenConnectionForKey** method on the shard map do not see any inconsistent intermediate states. However, when connecting to the source or the target shards without using the **OpenConnectionForKey** method, inconsistent intermediate states might be visible when split/merge/move requests are going on. These connections may show partial or duplicate results depending on the timing or the shard underlying the connection. This limitation currently includes the connections made by Elastic Scale Multi-Shard-Queries.

* The Split/Merge service currently does not support multiple role instances for its worker role. This precludes high availability configurations in Azure using failure or upgrade domains which depend on the ability to run multiple role instances. Also, the metadata database for Split/Merge must not be shared between different instances. For example, an instance of the Split/Merge service running in staging needs to point to a different metadata database than the instance running in production.
 

## Billing 

Since the Split/Merge service runs as a cloud service in your Microsoft Azure subscription, regular charges for cloud services apply for your instance of Split/Merge. Unless you frequently perform split/merge/move operations, we recommend to delete your Split/Merge cloud service. That will help save costs for running or deployed cloud service instances. You can re-deploy and start your readily runnable configuration whenever you need to perform Split/Merge operations. 
  
## Monitoring 
### Status Tables 

The Split/Merge Service provides the **RequestStatus** table in the metadata store database for monitoring of completed and ongoing requests. The table lists a row for each Split/Merge request that has been submitted to this instance of the Split/Merge service. It gives the following information for each request:

* **Timestamp**: The time and date when the request was started.

* **OperationId**: A GUID that uniquely identifies the request. This request can also be used to cancel the operation while it is still ongoing.

* **Status**: The current state of the request. For ongoing requests, it also lists the current phase in which the request is.

* **CancelRequest**: A flag that indicates whether the request has been cancelled.

* **Progress**: A percentage estimate of completion for the operation. A value of 50 indicates that the operation is approximately 50% complete.

* **Details**: An XML value that provides a more detailed progress report. The progress report is periodically updated as sets of rows are copied from source to target. In case of failures or exceptions, this column also includes more detailed information about the failure.


### Azure Diagnostics 

The service template for Split/Merge is pre-configured to use WAD (Windows Azure Diagnostic) storage for additional detailed logging and diagnostics storage. You control the configuration for WAD such as the storage account and credentials through your service configuration file for Split/Merge. The WAD configuration for the service follows the guidance from [Cloud Service Fundamentals](http://code.msdn.microsoft.com/windowsazure/Cloud-Service-Fundamentals-4ca72649). It includes the definitions to log Performance Counters, IIS logs, Windows Event Logs, and Split/Merge application event logs. You can easily access these logs from the Visual Studio Server Explorer in the Azure part of the Explorer tree:

![Azure Diagnostics][2]   

The WADLogsTable highlighted in the figure above contains the detailed events from the Split/Merge service’s application log. Note, however, that the default configuration provided as part of the downloaded package is geared towards a production deployment. As a consequence, the interval at which logs and counters are pulled from the service instances is large (5 minutes). For test and development, you can lower the interval by adjusting the diagnostics settings of the web or the worker role to your needs. You can do this by right-clicking on the role in the Visual Studio Server Explorer (see above) and then adjust the Transfer Period in the dialog for the Diagnostics configuration settings:

![Configuration][3]


The different tabs in the dialog control the different log types – each of them has their own Transfer period setting. 
Visibility into the logs and the counters in WAD will typically be required for the Microsoft teams in case there are issues with your Split/Merge service deployment. You can use tools such as the [Azure Storage Explorer](http://azurestorageexplorer.codeplex.com/) to export WAD logs into easily sharable CSV files. 

## Performance

Performance of your split, merge and move operations depend on a variety of factors. In general, better performance is to be expected from the higher, more performant service tiers in Azure SQL Database. Higher IO, CPU and memory allocations for the higher service tiers will benefit the bulk copy and delete operations that the Split/Merge service is using internally. For that reason, it might be compelling to increase the service tier just for a given set of databases for a well-defined limited period of time in order to quickly complete scheduled Split/Merge Service operations for ranges hosted on these databases.

Note that the service also performs validation queries as part of its normal operations. These validation queries, among other things, check for unexpected presence of data in the target range and ensure that any split/merge/move operation starts from a consistent state. These queries all work over sharding key ranges defined by the scope of the split/merge/move operation and the batch size provided as part of the request definition. These queries perform best when an index is present that has the sharding key as the leading column. 

In addition, a uniqueness property with the sharding key as the leading column will allow the service to use an optimized approach that limits resource consumption in terms of log space and memory. This uniqueness property is required to move large data sizes (typically above 1GB). 

## Best Practices & Troubleshooting 
-    Consider defining a test tenant and exercise your most important split/merge/move operations with the test tenant across several shards. This will help you ensure that all metadata is defined correctly in your shard map and that the operations do not violate constraints or foreign keys.
-    Keep the test tenant data size above the maximum data size of your largest tenant to ensure you are not encountering data size related issues. This will also help you assess an upper bound on the time it takes to move a single tenant around. 
-    The Split/Merge service requires the ability to remove data from the source shard once the data has been successfully copied to the target. Inspect your schema closely to make sure that your schema allows the deletions. For instance, delete triggers can prevent the service from deleting the data on the source and may cause operations to fail.
-    Ensure that the sharding key is the leading column in your primary key or unique index definition. That will ensure the best performance for the split/merge validation queries and for the actual data movement and deletion operations which always operate on sharding key ranges.
-    For performance and cost reasons, collocating your split/merge service in the region and data center where your databases reside is typically the best choice. 

[AZURE.INCLUDE [elastic-scale-include](../includes/elastic-scale-include.md)]

## References 

* [Split-Merge tutorial](./sql-database-elastic-scale-configure-deploy-split-and-merge.md)

* [Elastic Scale Security Considerations](./sql-database-elastic-scale-configure-security.md)  


<!--Anchors-->
<!--Image references-->
[1]:./media/sql-database-elastic-scale-split-and-merge/split-merge-overview.png
[2]:./media/sql-database-elastic-scale-split-and-merge/diagnostics.png
[3]:./media/sql-database-elastic-scale-split-and-merge/diagnostics-config.png
