<properties title="Azure Elastic Scale Glossary" pageTitle="Azure Elastic Scale Glossary" description="Scale Azure SQL Database shards with elastic scale APIs, Azure elastic scale, SQL Federation Migration, about Azure SQL Elastic Scale" metaKeywords="sharding,elastic scale, Azure SQL DB sharding" services="sql-database" documentationCenter="sql-database" authors="sidneyh@microsoft.com"/>

<tags ms.service="sql-database" ms.workload="sql-database" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/02/2014" ms.author="sidneyh" />

#Elastic Scale Glossary
The following terms are defined for the Elastic Scale feature of Azure SQL Database.

![Elastic Scale terms][1]

**database**: An Azure SQL database. 

**data-dependent routing**: The functionality that enables an application to connect to a shard given a specific sharding key. Compare to **Multi-Shard Query**.

**global shard map**: The set of mappings between sharding keys and their respective shards within a **shard set**. The GSM is stored in the **shard map manager**. Compare to **local shard map**.

**list shard map**: A shard map in which sharding keys are mapped individually. Compare to **range shard map**.   

**local shard map**: Stored on a shard, the local shard map contains mappings for the shardlets that reside on the shard.

**multi-shard query**: The ability to issue a query against multiple shards; results sets are returned using UNION ALL semantics (also known as “fan-out query”). Compare to **Data Dependent Routing**.

**range shard map**: A shard map in which the shard distribution strategy is based on multiple ranges of contiguous values. 

**reference tables**: Tables that are not sharded but are replicated across shards. 

**shard**: An Azure SQL database that stores data from a sharded data set. 

**shard elasticity** (SE): The ability to perform both **horizontal scaling** and **vertical scaling**.

**sharding key**: A column value that determines how data is distributed across shards. The value type can be one of the following: int, bigint, varbinary, or uniqueidentifier. 

**shard set**: The complete set of shards that are attributed to the same shard map in the shard map manager.  

**shardlet**: All of the data associated with a single value of a sharding key on a shard. A shardlet is the smallest unit of data movement possible when redistributing sharded tables. 

**shard map**: The set of mappings between sharding keys and their respective shards.

**Shard Map Manager**: A management object and data store that contains the shard map(s), shard locations, and mappings for one or more shard sets.

**shard set**:The collection of shards that belong to the same shard map in the shard map manager. 

**split** (Verb): To split a single shard into two. A sharding key is provided by the user as the split point.

**Split and Merge service (SMS)**: A customer-hosted cloud service that enables customers to split and merge one or more shardlets. 

**horizontal scaling**: The act of scaling out (or in) a collection of shards by adding or removing shards to a shard map.

**vertical scaling**: The act of scaling up (or down) the performance level of an individual shard. For example, changing a shard from Standard to Premium (as required for performance reasons).**merge**: The act of creating one shard from two shards.

**point move** (Verb): The act of moving a single shardlet to a different shard. 

**shard**: (Verb) The act of horizontally partitioning identically structured data across multiple databases based on a sharding key.

**split**: (Verb) The act of splitting a single shard into two. A sharding key is provided by the user as the split point.

 

[AZURE.INCLUDE [elastic-scale-include](../includes/elastic-scale-include.md)]  

<!--Image references-->
[1]: ./media/sql-database-elastic-scale-glossary/glossary.png