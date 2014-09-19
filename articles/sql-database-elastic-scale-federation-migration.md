<properties title="Migrating Federations to Elastic Scale" pageTitle="Migrating Federations to Elastic Scale" description="Scale Azure SQL Database shards with Elastic Scale APIs, Azure Elastic Scale, SQL Federation Migration, Migrate Federations to Elastic Scale" metaKeywords="sharding scaling, federations, Azure SQL DB sharding, Elastic Scale" services="sql-database" documentationCenter="sql-database" authors="sidneyh@microsoft.com"/>

<tags ms.service="sql-database" ms.workload="sql-database" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="sidneyh" />

#Federations Migration 

The Azure SQL DB federations feature is being retired along with the Web/Business editions in September 2015. At that point in time, applications that utilize the federations feature will cease to execute. To ensure a successful migration, it is highly encouraged that migration efforts begin as soon as possible to allow for sufficient planning and execution. This document provides the context, examples, and introduction to the federations migration utility that will enable one to successfully migrate a current federations application seamlessly to the Azure SQL DB Elastic Scale preview APIs. The objective of the document is to walk you through the suggested steps to migrate a federations application without any data movement.

There are three major steps for migrating an existing federations application to one that uses the Elastic Scale API.

1. [Create a Shard Map Manager from a Federation Root] 
2. [Modify the Existing Application]
3. [Switch Out Existing Federation Members]
    

### The Migration Utility Tool
To assist in this process, a federation migration utility has been created. **[need a link to the tool download]** 
The tool accomplishes steps 1 and 3. 

## Create a Shard Map Manager from a Federation Root
The first step in migrating a federations application is to clone the metadata of a federation root to the constructs of a shard map management. 

![][1]
 
Start with an existing federation application in a test environment.
 
Use the Use the **Federation Migration Utility** to clone the federation root metadata into the constructs of the Elastic Scale Shard Map Manager. Analogous to a federation Root, the Shard Map Manager database is a standalone database that contains the shard maps (i.e., federations), shards (i.e., federation members) and respective range mappings. 

The cloning of the federation root to the Shard Map Manager is a copy and translation of metadata. No metadata is altered on the federation root. Note that the cloning of the federation root with the federation migration utility is a point-in-time operation, and any changes to either the federation root or Shard Map Manager will not be reflected in the other respective data store. If critical changes are made to the federation root during the testing of the new APIs, the federation migration utility can be used to refresh the Shard Map Manager to represent the current state. 

![][2]

## Modify the Existing Application 

With Shard Map Manager in place and the federation members and ranges registered with the Shard Map Manager (done via the migration utility), one can modify their existing application to utilize the Elastic Scale APIs. As shown in Figure 1.1, the application connections via the Elastic Scale APIs will be routed through the Shard Map Manager to appropriate federation members (now also a shard). Mapping federation members to the Shard Map Manager enables two versions of an application – one that uses federations and one that uses Elastic Scale - to be executed side-by-side to verify functionality.   

During the migration of the application, there will be two core modifications to the existing application that will need to be made.


#### Change 1: Instantiate a Shard Map Manager object: 

Unlike federations, Elastic Scale .NET APIs interact with the Shard Map Manager through the **ShardMapManager** class. The instantiation of a **ShardMapManager** object can be done as follows.
     
    //Instantiate ShardMapManger Object 
    ShardMapManager shardMapManager = ShardMapManagerFactory.GetSqlShardMapManager(
                            connectionStringSMM, ShardMapManagerLoadPolicy.Lazy); 
    RangeShardMap<T> rangeShardMap = shardMapManager.GetRangeShardMap<T>(shardMapName) 
    
#### Change 2: Route Connections to the Appropriate Shard 

With federations, a connection is established to a particular federation member with the USE FEDERATION command as follows:  

    USE FEDERATION CustomerFederation(cid=100) WITH RESET, FILTERING=OFF`

With the Elastic Scale APIs, a connection to a particular shard is established via the **RangeShardMap** class. 

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

The steps in this section are necessary but may not address all of migration scenarios that arise. For more information, please see the conceptual overview of Elastic Scale and the API reference.

## Switch Out Existing Federation Members 

![][3]

Once the application has been modified with the inclusion of the Elastic Scale APIs and constructs, the last step in the migration of a Federation application is to **switch out** the federation members. The end result of issuing a SWITCH OUT against a particular federation member is the removal of all federation constraints and metadata rendering the federation member as a regular Azure SQL database, no different than any other Azure SQL DB. 

Note that issuing a **SWITCH OUT** against a Federation member is a one-way operation and cannot be undone. Once performed, the resulting database cannot be added back to a Federation, and the USE FEDERATION commands can no longer be issued against the database. 

To perform the switch, an additional argument has been added to the ALTER FEDERATION command in order to SWITCH OUT a Federation member (for more information, please see the MSDN reference for [ALTER FEDERATION (Azure SQL Database](http://msdn.microsoft.com/en-us/library/azure/hh597475.aspx)).  While the command can be issued against individual Federation members, the federation migration utility provides the functionality to programmatically iterate through each federation member and perform the switch. 

Once the switch has been performed on all existing federation members, the migration of the application is done.  
The federation migration utility provides the abilities to: 

1.    Perform a clone of the federation root to a Shard Map Manager.  One can choose to put the existing Shard Map Manager on a new Azure SQL DB (recommended) or on the existing federation root database.
2.    Issue the SWITCH OUT against all federation members in a federation.
3.    Both 1 and 2. 

##Feature Comparison  
Although Elastic Scale offers many features (for example, multi-shard query, merge, client-side caching, shard elasticity, and more), there are a few noteworthy federations features that are not supported in Elastic Scale.
  
1. The use of **FILTERING=ON**. Elastic scale does not currently support row-level filtering. One mitigation is to build the filtering logic into the query issued against the shard as follows: 

        --Example of USE FEDERATION with FILTERING=ON
        USE FEDERATION CustomerFederation(cid=100) WITH RESET, FILTERING=ON SELECT * FROM customer

Yields the same result as:

        --Example of USE FEDERATION with filtering in the WHERE clause 
        USE FEDERATION CustomerFederation(cid=100) WITH RESET, FILTERING=OFF 
        SELECT * FROM customer WHERE CustomerId = 100 

2. The Elastic Scale **Split** feature is not fully online. During a split operation, each individual shardlet is taken offline during the duration of the move.
3. The Elastic Scale split feature requires database provisioning and schema management.

## Additional Considerations

* Both the Web and Business edition and Federations are being deprecated in fall of 2015.  As part the migration of a Federations application, it is highly recommended to perform performance testing on the Basic, Standard, and Premium editions. 

* Performing the SWITCH OUT statement on a Federation member enables the resulting database to take advantage of all of the Azure SQL DB features (i.e., new editions, backup, PITR, auditing, etc.) 

##Getting Started 
To build and run this utility, you must have Visual Studio 2012 or Visual Studio 2013 installed. 

Use the following steps to run the utility: 

1. Download and extract the .zip file.
2. Open the solution file in Visual Studio.
3. Build the solution, which automatically installs the Elastic Scale NuGet packages.
4. Run the application. 

###Running the Sample 
To run the utility, hit F5 or choose the **Debug | Start Debugging** menu command.  
A console application opens that walks through a series of menu options and prompts.  


<!--Anchors-->
[Create a Shard Map Manager from a Federation Root]: #Create-a-Shard-Map-Manager-from-a-Federation-Root
[Modify the Existing Application]:#Modify-the-Existing-Application
[Switch Out Existing Federation Members]: #Switch-Out-Existing-Federation-members


<!--Image references-->
[1]: ./media/sql-database-elastic-scale-federation-migration/migrate-1.png
[2]: ./media/sql-database-elastic-scale-federation-migration/migrate-2.png
[3]: ./media/sql-database-elastic-scale-federation-migration/migrate-3.png

