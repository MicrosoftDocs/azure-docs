<properties title="Azure Elastic Scale Glossary" pageTitle="Azure Elastic Scale Glossary" description="Scale Azure SQL Database shards with elastic scale APIs, Azure elastic scale, SQL Federation Migration, about Azure SQL Elastic Scale" metaKeywords="sharding,elastic scale, Azure SQL DB sharding" services="sql-database" documentationCenter="sql-database" authors="sidneyh@microsoft.com"/>

<tags ms.service="sql-database" ms.workload="sql-database" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/02/2014" ms.author="sidneyh" />

#Elastic Scale Glossary
**Database** – SQL Azure database 

**Sharding Key**: An attribute of a shard - a column value (int, bigint, varbinary, uniqueidentifier) that determines how the data is sharded into a one or more shardlets. 

**Shard Map Manager**: A management service and data store that contains the shard map(s), shard locations, and mappings for one or more shard sets. 

**Shardlet**: All of the data associated with a single value of a sharding key - including all rows within one or more sharded tables that share that key. All of the data associated with a shardlet must be co-located within a single shard. A shardlet is the smallest unit of data movement possible when redistributing sharded tables. 

**Shard**: A logical container of zero or more shardlets. A shard resides on an Azure SQL database and individual shards can be of different SQL DB editions (i.e., basic, standard, or premium). 

**Shard Set**: A collection of one or more shards. 

**Reference tables**: Replicated tables that enable consistent join semantics across a set of shards.  Reference tables themselves are not sharded. 

**Global Shard Set**: The complete set of shards that are attributed to the same shard map in the shard map manager.  

**Shard Set**: One or more shards that share the same schema and sharding key.

**Global Shard Map** (GSM or Shard Map): A global shard map is the set of mappings between sharding keys and their respective shards within a shard set. 

**Local Shard Map** (LSM): A shard map specific to the individual shard on which the data resides.

**List Shard Map**: The shard key is directly associated to an individual shard (one-customer per shard model).  A lookup is done to get the shard connection details.  

**Range Shard Map**: Shard distribution strategy based on multiple ranges of low and high values. 

**Data Dependent Routing** (DDR): The functionality that enables an application to determine which physical database to connect to in order to process a transaction.


**Multi-Shard Query** (MSQ): The ability to issue an interactive query against multiple shards; results sets are returned using UNION ALL semantics (also known as “fan-out query”). 


**Split/Merge** (S/M) Service: A customer-hosted cloud service that enables customers to split, merge, and perform point move operations on one or more shardlets. 


**Shard Elasticity** (SE): The ability to vertically scale the performance level of a single shard and/or horizontally scale a shard map by adding/removing shards.


##Verbs

**Split**: The act of creating two shards from one by splitting the source shard by the shard key.

**Merge**: The act of creating one shard from two adjacent shards 

**Point move**: The act of moving a single shardlet to a different shard. 

**Shard**: The act of horizontally partitioning identically structured data across multiple physical databases based on a key.
