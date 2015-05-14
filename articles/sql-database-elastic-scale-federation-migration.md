<properties 
	pageTitle="Federations migration" 
	description="Outlines the steps to migrate an existing app built with Federations feature to the elastic database model." 
	services="sql-database" 
	documentationCenter="" 
	manager="jeffreyg" 
	authors="sidneyh" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/17/2015" 
	ms.author="sidneyh"/>

# Federations migration 

The Azure SQL Database Federations feature is being retired along with the Web/Business editions in September 2015. At that point in time, applications that utilize the Federations feature will cease to execute. To ensure a successful migration, it is highly encouraged that migration efforts begin as soon as possible to allow for sufficient planning and execution. This document provides the context, examples, and introduction to the Federations Migration Utility that illustrates how to successfully migrate a current Federations application seamlessly to the [Elastic database client library](http://go.microsoft.com/?linkid=9862592) APIs for sharding. The objective of the document is to walk you through the suggested steps to migrate a Federations application without any data movement.

There are three major steps for migrating an existing Federations application to one that uses elastic database tools.

1. [Create Shard Map Manager from a Federation Root] 
2. [Modify the Existing Application]
3. [Switch Out Existing Federation Members]
    

### The migration sample tool
To assist in this process, a [Federations Migration Utility](http://go.microsoft.com/?linkid=9862613) has been created. The utility accomplishes steps 1 and 3. 

## Create a Shard Map Manager from a federation root
The first step in migrating a Federations application is to clone the metadata of a federation root to the constructs of a shard map manager. 

![Clone the federation root to the shard map manager][1]
 
Start with an existing Federations application in a test environment.
 
Use the **Federations Migration Utility** to clone the federation root metadata into the constructs of the elastic database client library's [Shard Map Manager](http://go.microsoft.com/?linkid=9862595). Analogous to a federation root, the Shard Map Manager database is a standalone database that contains the shard maps (i.e., federations), references to shards (i.e., federation members) and respective range mappings. 

The cloning of the federation root to the Shard Map Manager is a copy and translation of metadata. No metadata is altered on the federation root. Note that the cloning of the federation root with the Federations Migration Utility is a point-in-time operation, and any changes to either the federation root or the shard maps will not be reflected in the other respective data store. If changes are made to the federation root during the testing of the new APIs, the Federations Migration Utility can be used to refresh the shard maps to represent the current state. 

![Migrate the existing app to use the Elastic Scale APIs][2]

## Modify the existing application 

With Shard Map Manager in place and the federation members and ranges registered with the Shard Map Manager (done via the migration utility), one can modify the existing Federations application to utilize the elastic database client library. As shown in the figure above, the application connections via these APIs will be routed through the Shard Map Manager to appropriate federation members (now also a shard). Mapping federation members to the Shard Map Manager enables two versions of an application – one that uses Federations and one that uses the elastic database client library — to be executed side-by-side to verify functionality.   

During the migration of the application, there will be two core modifications to the existing application that will need to be made.


#### Change 1: Instantiate a Shard Map Manager object: 

Unlike Federations, Elastic Scale APIs interact with the Shard Map Manager through the **ShardMapManager** class. The instantiation of a **ShardMapManager** object and a shard map can be done as follows:
     
    //Instantiate ShardMapManger Object 
    ShardMapManager shardMapManager = ShardMapManagerFactory.GetSqlShardMapManager(
                            connectionStringSMM, ShardMapManagerLoadPolicy.Lazy); 
    RangeShardMap<T> rangeShardMap = shardMapManager.GetRangeShardMap<T>(shardMapName) 
    
#### Change 2: Route connections to the appropriate shard 

With Federations, a connection is established to a particular federation member with the USE FEDERATION command as follows:  

    USE FEDERATION CustomerFederation(cid=100) WITH RESET, FILTERING=OFF`

With the Elastic Scale APIs, a connection to a particular shard is established via [data dependent routing](sql-database-elastic-scale-data-dependent-routing.md) with the  **OpenConnectionForKey** method on the **RangeShardMap** class. 

    //Connect and issue queries on the shard with key=100 
    using (SqlConnection conn = rangeShardMap.OpenConnectionForKey(100, csb))  
    { 
         using (SqlCommand cmd = new SqlCommand()) 
         { 
            cmd.Connection = conn; 
            cmd.CommandText = "SELECT * FROM customer";
     
            using (SqlDataReader dr = cmd.ExecuteReader()) 
            { 
                  //Perform action on dr 
            } 
        } 
    }

The steps in this section are necessary but may not address all migration scenarios that arise. For more information, please see the [conceptual overview of elastic database tools](sql-database-elastic-scale-introduction.md) and the [API reference](http://go.microsoft.com/?linkid=9862604).

## Switch out existing federation members 

![Switch out the federation members for the shards][3]

Once the application has been modified with the inclusion of the Elastic Scale APIs, the last step in the migration of a Federations application is to **SWITCH OUT** the federation members (for more information, please see the MSDN reference for [ALTER FEDERATION (Azure SQL Database](http://msdn.microsoft.com/library/dn269988(v=sql.120).aspx)). The end result of issuing a **SWITCH OUT** against a particular federation member is the removal of all federation constraints and metadata rendering the federation member as a regular Azure SQL Database, no different than any other Azure SQL Database.  

Note that issuing a **SWITCH OUT** against a federation member is a one-way operation and cannot be undone. Once performed, the resulting database cannot be added back to a federation, and the USE FEDERATION commands will no longer work for this database. 

To perform the switch, an additional argument has been added to the ALTER FEDERATION command in order to SWITCH OUT a federation member.  While the command can be issued against individual Federation members, the Federations Migration Utility provides the functionality to programmatically iterate through each federation member and perform the switch operation. 

Once the switch has been performed on all existing federation members, the migration of the application is done. When all federation members have been switched out, we suggest performing a DROP FEDERATION operation on the root.  This will not affect any of the former members, but will allow the root database to easily migrate off of the Web and Business edition.
  
The Federations Migration Utility provides the abilities to: 

1.    Perform a clone of the federation root to a Shard Map Manager.  One can choose to put the existing Shard Map Manager on a new Azure SQL database (recommended) or on the existing federation root database.
2.    Issue the SWITCH OUT against all federation members in a federation.


## Feature comparison

Although Elastic Scale offers many additional features (for example, [multi-shard querying](sql-database-elastic-scale-multishard-querying.md), [splitting and merging shards](sql-database-elastic-scale-overview-split-and-merge.md), [shard elasticity](sql-database-elastic-scale-elasticity.md), [client-side caching](sql-database-elastic-scale-shard-map-management.md), and more), there are a few noteworthy Federations features that are not supported in elastic database tools.
  
- The use of **FILTERING=ON**. Elastic scale does not currently support row-level filtering. One mitigation is to build the filtering logic into the query issued against the shard as follows: 

        --Example of USE FEDERATION with FILTERING=ON
        USE FEDERATION CustomerFederation(cid=100) WITH RESET, FILTERING=ON 
        SELECT * FROM customer

Yields the same result as:

        --Example of USE FEDERATION with filtering in the WHERE clause 
        USE FEDERATION CustomerFederation(cid=100) WITH RESET, FILTERING=OFF 
        SELECT * FROM customer WHERE CustomerId = 100 

As an alternative, you can also use Row-Level Security (RLS) to help you with filtering. You can find the necessary steps described in the [RLS  blog post](http://azure.microsoft.com/blog/2015/03/02/building-more-secure-middle-tier-applications-with-azure-sql-database-using-row-level-security/). Note that RLS currently does not protect UPDATE and INSERT statements against changes that would place rows outside of the shardlet. If this is a concern for your application, use database constraints or triggers in addition to RLS to enforce these aspects.

- The Elastic Scale **Split** feature is not fully online. During a split operation, each individual shardlet is taken offline during the duration of the move.
- The Elastic Scale split feature requires manual database provisioning and schema management.

## Additional considerations

* Both the Web and Business edition and Federations are being deprecated in fall of 2015.  As part the migration of a Federations application, it is highly recommended to perform performance testing on the Basic, Standard, and Premium editions. 

* Performing the SWITCH OUT statement on a federation member enables the resulting database to take advantage of all of the Azure SQL database features (i.e., new editions, backup, PITR, auditing, etc.) 

[AZURE.INCLUDE [elastic-scale-include](../includes/elastic-scale-include.md)]

<!--Anchors-->
[Create Shard Map Manager from a Federation Root]:#create-shard-map-manager
[Modify the Existing Application]:#Modify-the-Existing-Application
[Switch Out Existing Federation Members]:#Switch-Out-Existing-Federation-Members


<!--Image references-->
[1]: ./media/sql-database-elastic-scale-federation-migration/migrate-1.png
[2]: ./media/sql-database-elastic-scale-federation-migration/migrate-2.png
[3]: ./media/sql-database-elastic-scale-federation-migration/migrate-3.png
