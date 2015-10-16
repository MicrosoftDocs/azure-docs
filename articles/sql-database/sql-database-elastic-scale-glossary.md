<properties 
    pageTitle="Elastic database tools glossary" 
    description="Explanation of terms used for elastic database tools" 
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
    ms.date="07/24/2015" 
    ms.author="sidneyh"/>

# Elastic Database tools glossary
The following terms are defined for the Elastic Database tools, a feature of Azure SQL Database. The tools include the client library, the split-merge tool, elastic pools, and queries.

![Elastic Scale terms][1]

**Database**: An Azure SQL database. 

**Data dependent routing**: The functionality that enables an application to connect to a shard given a specific sharding key. Compare to **Multi-Shard Query**.

**Global shard map**: The map between sharding keys and their respective shards within a **shard set**. The global shard map is stored in the **shard map manager**. Compare to **local shard map**.

**List shard map**: A shard map in which sharding keys are mapped individually. Compare to **Range Shard Map**.   

**Local shard map**: Stored on a shard, the local shard map contains mappings for the shardlets that reside on the shard.

**Multi-shard query**: The ability to issue a query against multiple shards; results sets are returned using UNION ALL semantics (also known as “fan-out query”). Compare to **data dependent routing**.

**Range shard map**: A shard map in which the shard distribution strategy is based on multiple ranges of contiguous values. 

**Reference tables**: Tables that are not sharded but are replicated across shards. For example, zip codes can be stored in a reference table. 

**Shard**: An Azure SQL database that stores data from a sharded data set. 

**Shard elasticity**: The ability to perform both **horizontal scaling** and **vertical scaling**.

**Sharded tables**: Tables that are sharded, i.e., whose data is distributed across shards based on their sharding key values. 

**Sharding key**: A column value that determines how data is distributed across shards. The value type can be one of the following: **int**, **bigint**, **varbinary**, or **uniqueidentifier**. 

**Shard set**: The collection of shards that are attributed to the same shard map in the shard map manager.  

**Shardlet**: All of the data associated with a single value of a sharding key on a shard. A shardlet is the smallest unit of data movement possible when redistributing sharded tables. 

**Shard map**: The set of mappings between sharding keys and their respective shards.

**Shard map manager**: A management object and data store that contains the shard map(s), shard locations, and mappings for one or more shard sets.

![Mappings][2]


##Verbs

**Horizontal scaling**: The act of scaling out (or in) a collection of shards by adding or removing shards to a shard map, as shown below.

![Horizontal and vertical scaling][3]

**Merge**: The act of moving shardlets from two shards to one shard and updating the shard map accordingly.

**Shardlet move**: The act of moving a single shardlet to a different shard. 

**Shard**: The act of horizontally partitioning identically structured data across multiple databases based on a sharding key.

**Split**: The act of moving several shardlets from one shard to another (typically new) shard. A sharding key is provided by the user as the split point.

**Vertical Scaling**: The act of scaling up (or down) the performance level of an individual shard. For example, changing a shard from Standard to Premium (which results in more computing resources). 

[AZURE.INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]  

<!--Image references-->
[1]: ./media/sql-database-elastic-scale-glossary/glossary.png
[2]: ./media/sql-database-elastic-scale-glossary/mappings.png
[3]: ./media/sql-database-elastic-scale-glossary/h_versus_vert.png
 