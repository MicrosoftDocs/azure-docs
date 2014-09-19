<properties title="Splitting and Merging with Elastic Scale" pageTitle="Splitting and Merging with Elastic Scale" description="Splitting and Merging with Elastic Scale" metaKeywords="sharding scaling, Azure SQL Database sharding, elastic scale, splitting and merging elastic scale" services="sql-database" documentationCenter="sql-database" authors="sidneyh@microsoft.com"/>

<tags ms.service="sql-database" ms.workload="sql-database" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/02/2014" ms.author="sidneyh" />

#1 Splitting and Merging with Elastic Scale

So far, applications built on Azure SQL Database were facing challenges when their data sizes or processing needs did no longer fit a single scale unit in Azure SQL Database. This was in contrast to the cloud promise of elastic and transparently scalable capacity for any kind of computing resource. Examples of this were cloud applications that went viral or where a particular set of tenants grew beyond the limits of a single Azure SQL DB database. Azure SQL DB Elastic Scale has been designed to address these challenges at the data tier of applications, and the Elastic Scale Split/Merge Service discussed in the following plays a key role to accomplish this goal for applications built on Azure SQL DB. 

For the subsequent discussion of the Split/Merge Service, we focus on the dimension of scale-out and scale-in through changes in the number of Azure DB databases and balancing the distribution of shardlets among them (see Sharding Overview and/or Glossary [link]). With the current choices between Azure SQL DB editions, capacity can also be managed by scaling up or down the capacity of a single Azure SQL DB database. The scale-up/down dimension of elastic capacity management is not covered by Split/Merge – see Shard Elasticity instead [link]. 

##2 Scenarios for Split/Merge 

With capacity needs fluctuating in tandem with business momentum, applications need the ability to stretch flexibly beyond the capacity limits of a single Azure SQL DB database. This applies in the following scenarios: 

* Grow Capacity – Splitting Ranges: Customers need the ability to grow aggregate capacity at the data tier as capacity needs keep increasing. In this scenario, the application provides the additional capacity by sharding the data and by distributing it across incrementally more databases until capacity needs are fulfilled. The ‘split’ feature of the Elastic Scale Split/Merge Service addresses this scenario. The SPLIT functionality in Federations for Azure Db was targeted at a similar scenario. 

* Shrink Capacity – Merging Ranges: Many customers face fluctuating capacity needs due to the seasonal nature of their business. In addition to the grow capability, this mandates the ability to easily scale back to fewer scale units when business slows. The ‘merge’ feature in the Elastic Scale Split/Merge Service covers this requirement. 

* Manage Hotspots – Moving Shardlets: With a sharded application that stores multiple tenants per database, the allocation of shardlets to shards may over time lead to capacity bottlenecks on some shards. This requires re-allocating shardlets or moving busy shardlets to new or less utilized shards. 

In the following, we will refer to any processing in the service along these capabilities as **split/merge/move** requests. 

Figure 1: Conceptual Overview of Split/Merge 
Note:  Not all Grow Capacity scenarios require the Split/Merge service. For example if you periodically create new shards in your environment to store new data with increasing sharding key values, you can use the Shard Map Management client APIs to direct new data ranges to newly created shards.  Split/Merge service is needed only when existing data needs to be moved as well.
##3 Concepts & Key Features
**Customer-Hosted Services**: Split/Merge is delivered as a customer-hosted service. After downloading the Azure Cloud Service package for Split/Merge from NuGet, it is your responsibility to deploy the package and host the service in your Microsoft Azure subscription. The package you download from NuGet contains a configuration template that you need to complete with the information for your specific deployment. The Split/Merge tutorial [link] contains detailed instructions how to customize the template and how to deploy and run the service in Microsoft Azure.
**Shard Map Integration**: The Split/Merge service interacts with the shard map of the application. When using the Split/Merge service to split or merge ranges or to move shardlets between shards, the service automatically keeps the shard map up to date. To do so, the service connects to the shard map manager database of the application and maintains ranges and mappings as split/merge/move requests progress. This ensures that the shard map always presents an up-to-date view when Split/Merge operations are going on. Split, merge and shardlet movement operations are implemented by moving a batch of shardlets from the source shard to the target shard. During the shardlet movement operation the shardlets subject to the current batch are marked as offline in the shard map and are unavailable for data-dependent routing connections using the OpenConnectionForKey API. 

**Consistent Shardlet Connections**: When data movement starts for a new batch of shardlets, any shard-map provided data-dependent routing connections to those shardlets are killed and subsequent connections from the shard map APIs to the these shardlets are blocked while the data movement is in progress in order to avoid inconsistencies. Once the batch has been moved, the shardlets are marked online again for the target shard and the source data is removed lazily from the source shard. The service goes through these steps for every batch until all shardlets have been moved. This will lead to several connection kill operations during the course of the complete split/merge/move operation.  

**Managing Shardlet Availability**: Limiting the connection killing to the current batch of shardlets as discussed above helps to contain the scope of unavailability to a batch of shardlets at a time. This is preferred over an approach where the complete shard would remain offline for all its shardlets during the course of a split/merge operation. The size of a batch – defined as the number of distinct shardlets to move at a time -- is a configuration parameter that can be defined for each split/merge operation depending on the application’s availability and performance needs. 

**Metadata Storage**: The Split/Merge service uses a database to maintain its status and to keep logs during request processing. Administrators can also connect to this database to review request progress and to investigate detailed information regarding potential failures.

**Sharding-Awareness**: The Split/Merge service differentiates between (1) sharded tables, (2) reference tables, and (3) normal tables. The semantics of a split/merge/move operation depend on the type of the table used and are defined as follows: 

* **Sharded tables**: Split/Merge/Move operations move shardlets from source to target shard. After successful completion of the overall request, those shardlets are no longer present on the source. Note that the target tables need to exist on the target shard and must not contain data in the target range prior to processing of the operation.  

* **Reference tables**:
	* **Split and Move Operations**: For reference tables, the split and move operations copy the data from the source to the target shard. Note, however, that no changes occur on the target shard for a given table if any row is already present in this table on the target.
	* **Merge**: The merge operation does not perform any operation on reference tables. We assume that the data is already present on the target shard. 
* **Normal Tables**: Normal tables are tables present on either the source or the target of a split/merge operation. Split/merge disregards these tables for any data movement or copy operations. Note, however, that they can interfere with these operations in case of constraints. 

The information on reference vs. sharded tables is provided by the SchemaInfo APIs on the shard map. The following example illustrates the use of these APIs on a given shard map manager object smm:  

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

**Referential Integrity**: The Split/Merge service analyzes dependencies between tables and uses foreign key-primary key relationships to stage the operations for moving reference tables and shardlets. In general, reference tables are copied first, then shardlets are copied in order of their dependencies within each batch. This is necessary so that FK-PK constraints on the target shard are honored as the new data arrives. 

**Eventual Completion**: In the presence of failures, the Split/Merge service resumes operations after any outage and aims to complete any in progress requests. However, there may be unrecoverable situations, e.g., when the target shard is lost or compromised beyond repair. Under those circumstances, some shardlets that were supposed to be moved may continue to reside on the source shard. The service ensures that shardlet mappings are only updated after the necessary data has been successfully copied to the target. Shardlets are only deleted on the source once all their data has been copied to the target and the corresponding mappings have been updated successfully. The Split/Merge service always ensures correctness of the mappings stored in the shard map. 
##4 Getting the Service Binaries

The service binaries for Split/Merge are provided through NuGet. Follow these steps on your client machine to get access to your copy of the Split/Merge binaries: 

1. Download nuget.exe from http://www.nuget.org/nuget.exe.
2. Open a command prompt and navigate to the directory where you downloaded nuget.exe. 
3. Add the Elastic Scale Myget package source using the following command: 

		nuget sources add -Name ElasticScaleMyget -Source https://www.myget.org/F/elasticscale-preview/api/v2 -UserName <your myget user name> -Password <your myget password>

4. (Optional) List the available Split-Merge packages with the below command: 
		nuget list Microsoft.Azure.SqlDatabase.ElasticScale.Service.SplitMerge -Pre -All
5. Download the latest Split-Merge package into the current directory with the below command: 
		nuget install Microsoft.Azure.SqlDatabase.ElasticScale.Service.SplitMerge -Pre  

This will download the Split-Merge bits to the current directory. The Split-Merge Service files are in the “service” directory, and the Split-Merge Powershell scripts (and required client dlls) are in the “powershell” directory. 

The Split/Merge Tutorial available here explains next steps for configuration and deployment to Azure: https://microsoft.sharepoint.com/teams/ElasticScaleOLTP/Shared%20Documents/Documentation/Public%20Preview/Split-Merge%20Service%20Tutorial.docx?web=1  

##5  Requirements and Limitations 

The current implementation of the Split/Merge service is subject to the following requirements and limitations: 

* Currently, the shards need to exist and registered in the shard map before a Split/Merge operation on these shards can be performed. 

* The Split/Merge service currently does not create tables or any other database objects automatically as part of its operations. This means that all sharded tables and reference tables need to exist on the target shard prior to any split/merge/move operation. Sharded tables in particular are required to be empty in the range where new shardlets are to be added by a split/merge/move operation. Otherwise, the operation will fail the initial consistency check on the target shard. Also note that reference data is only copied if the reference table is empty. 

* The service currently relies on row identity established by a unique index or key to ensureidempotence of its operations. Consider creating a unique index or a primary key on a table if you want to use that table with for split/merge/move requests. 
	* TODO: Filtered unique index  

* During the course of request processing, some shardlet data may be present both on the source and the target shard. This is currently necessary to protect against failures during the shardlet movement. As explained above, the integration of Split/Merge with the Elastic Scale shard map ensures, that connections through the data dependent routing APIs using the **OpenConnectionForKey** method on the shard map do not see any inconsistent intermediate states. However, when connecting to the source or the target shards without using the OpenConnectionForKey method, inconsistent intermediate states might be visible when split/merge/move requests are going on. These connections may show partial or duplicate results depending on the timing or the shard underlying the connection. This limitation currently includes the connections made by Elastic Scale Multi-Shard-Queries.

* The Split/Merge service currently does not support multiple role instances for its worker role. This precludes high availability configurations in Azure using failure or upgrade domains which depend on the ability to run multiple role instances. 

##6 Billing 

Since the Split/Merge service runs as a cloud service in your Microsoft Azure subscription, regular charges for cloud services apply for your instance of Split/Merge.  
##7 Monitoring 
###7.1 Status Tables 

The Split/Merge Service provides the following tables in the metadata store database for monitoring of completed and ongoing requests: 

* **RequestStatus**: This table lists a row for each Split/Merge request that has been submitted to this instance of the Split/Merge service. It give the following information for each request: 
	* Timestamp: The time and date when the request was started. 
	* OperationId: A GUID that uniquely identifies the request.
* Status: The current state of the request. For ongoing requests, it also lists the current phase in which the request is. 
* CancelRequest: A flag that indicates whether the request has been cancelled.
* Progress: A percentage estimate of completion for the operation. A value of 50 indicates that the operation is approximately 50% complete. 
* Details: An XML value that provides a more detailed progress report. The progress report is periodically updated as sets of rows are copied from source to target. * PendingWorkflows: This tables serves as a queue for incoming requests.  

###7.2 Azure Diagnostics 

The service template for Split/Merge is pre-configured to use WAD (Windows Azure Diagnostic) storage for additional detailed logging and diagnostics storage. You control the configuration for WAD such as the storage account and credentials through your service configuration file for Split/Merge.   
##8 Best Practices

* Consider defining a test tenant and exercise your most important split/merge/move operations with the test tenant across several shards. This will help you ensure that all metadata is defined correctly in your shardmap and that the operations do not violate constraints or foreign keys. 

* Keep the test tenant data size above the maximum data size of your largest tenant to ensure you are not encountering data size related issues. This will also help you assess an upper bound on the time it takes to move a single tenant around.  

* Ability to delete data range that was moved from sharded tables o Make sure that constraints do not prevent that

##9 Troubleshooting 

##10 References 

* Step-by-step Tutorial for Split/Merge: https://microsoft.sharepoint.com/teams/ElasticScaleOLTP/Shared%20Documents/Documentation/Public%20Preview/Split-Merge%20Service%20Tutorial.docx?web=1 (work in progress) 

* Security Configuration: https://microsoft.sharepoint.com/teams/ElasticScaleOLTP/Shared%20Documents/Documentation/Public%20Preview/Service%20Security%20Configurations.docx?web=1 (work in progress) 
