---
title: Consistency levels and Azure Cosmos DB APIs
description: Understanding the consistency levels across APIs in Azure Cosmos DB.
author: markjbrown
ms.author: mjbrown
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 10/23/2018
ms.reviewer: sngun
---

# Consistency levels and Azure Cosmos DB APIs

Five consistency models offered by Azure Cosmos DB are natively supported by the Azure Cosmos DB SQL API. When you use Azure Cosmos DB, the SQL API is the default. 

Azure Cosmos DB also provides native support for wire protocol-compatible APIs for popular databases. Databases include MongoDB, Apache Cassandra, Gremlin, and Azure Table storage. These databases don't offer precisely defined consistency models or SLA-backed guarantees for consistency levels. They typically provide only a subset of the five consistency models offered by Azure Cosmos DB. For the SQL API, Gremlin API, and Table API, the default consistency level configured on the Azure Cosmos DB account is used. 

The following sections show the mapping between the data consistency requested by an OSS client driver for Apache Cassandra 4.x and MongoDB 3.4. This document also shows the corresponding Azure Cosmos DB consistency levels for Apache Cassandra and MongoDB.

## <a id="cassandra-mapping"></a>Mapping between Apache Cassandra and Azure Cosmos DB consistency levels

This table shows the consistency mapping between the Apache Cassandra and consistency levels in Azure Cosmos DB. For each of Cassandra Read and Write consistency levels, the corresponding Cosmos DB Consistency Level provides stronger, i.e., stricter guarantees.


<table>
<tr> 
  <th rowspan="2">Cassandra Consistency Level</th> 
  <th rowspan="2">Cosmos DB Consistency Level</th> 
  <th colspan="3">Write Consistency Mapping</th> 
  <th colspan="3">Read Consistency Mapping</th> 
</tr> 


 
 <tr> 
  <th>Cassandra</th> 
  <th>Cosmos DB</th> 
  <th>Guarantee</th> 
  <th>From Cassandra</th> 
  <th>To Cosmos DB</th> 
  <th>Guarantee</th> 
 </tr> 
 
  <tr> 
  <td rowspan="6">ALL</td> 
  <td rowspan="6">Strong</td> 
  <td>ALL</td> 
  <td>Strong</td> 
  <td>Linearizability</td> 
  <td>ALL, QUORUM, SERIAL, LOCAL_QUORUM, LOCAL_SERIAL, THREE, TWO, ONE, LOCAL_ONE</td> 
  <td>Strong</td> 
  <td>Linearizability</td> 
 </tr> 
 
 <tr> 
  <td rowspan="2">EACH_QUORUM</td> 
  <td rowspan="2">Strong</td> 
  <td rowspan="2">Linearizability</td> 
  <td>ALL, QUORUM, SERIAL,  LOCAL_QUORUM, LOCAL_SERIAL, THREE, TWO</td> 
  <td>Strong</td> 
  <td >Linearizability</td> 
 </tr> 
 
 <tr>
 <td>LOCAL_ONE, ONE</td>
  <td>Consistent Prefix</td>
   <td>Global Consistent Prefix</td>
 </tr>
 

 <tr> 
  <td rowspan="2">QUORUM, SERIAL</td> 
  <td rowspan="2">Strong</td> 
  <td rowspan="2">Linearizability</td> 
  <td>ALL, QUORUM, SERIAL</td> 
  <td>Strong</td> 
  <td >Linearizability</td> 
 </tr> 

 <tr>
   <td>LOCAL_ONE, ONE, LOCAL_QUORUM, LOCAL_SERIAL, TWO, THREE</td>
   <td>Consistent Prefix</td>
   <td>Global Consistent Prefix</td>
 </tr>
 
 
 <tr> 
 <td>LOCAL_QUORUM, THREE, TWO, ONE, LOCAL_ONE, <b>ANY</b></td> 
  <td>Consistent Prefix</td> 
  <td>Global Consistent Prefix</td> 
  <td>LOCAL_ONE, ONE, TWO, THREE, LOCAL_QUORUM, QUORUM</td> 
  <td>Consistent Prefix</td> 
  <td>Global Consistent Prefix</td>
 </tr> 
 
 
  <tr> 
  <td rowspan="6">EACH_QUORUM</td> 
  <td rowspan="6">Strong</td> 
  <td rowspan="2">EACH_QUORUM</td> 
  <td rowspan="2">Strong</td> 
  <td rowspan="2">Linearizability</td> 
  <td>ALL, QUORUM, SERIAL,  LOCAL_QUORUM, LOCAL_SERIAL, THREE, TWO</td> 
  <td>Strong</td> 
  <td>Linearizability</td> 
 </tr> 
 
 <tr>
 <td>LOCAL_ONE, ONE</td>
  <td>Consistent Prefix</td>
   <td>Global Consistent Prefix</td>
 </tr>
 
 
 
 <tr> 
  <td rowspan="2">QUORUM, SERIAL</td> 
  <td rowspan="2">Strong</td> 
  <td rowspan="2">Linearizability</td> 
  <td>ALL, QUORUM, SERIAL</td> 
  <td>Strong</td> 
  <td>Linearizability</td> 
 </tr> 
 
 <tr>
 <td>LOCAL_ONE, ONE, LOCAL_QUORUM, LOCAL_SERIAL, TWO, THREE</td>
  <td>Consistent Prefix</td>
   <td>Global Consistent Prefix</td>
 </tr>
 
 
  <tr> 
  <td rowspan="2">LOCAL_QUORUM, THREE, TWO, ONE, LOCAL_ONE, ANY</td> 
  <td rowspan="2">Consistent Prefix</td> 
  <td rowspan="2">Global Consistent Prefix</td> 
  <td>ALL</td> 
  <td>Strong</td> 
  <td>Linearizability</td> 
 </tr> 
 
 <tr>
 <td>LOCAL_ONE, ONE, TWO, THREE, LOCAL_QUORUM, QUORUM</td>
  <td>Consistent Prefix</td>
   <td>Global Consistent Prefix</td>
 </tr>


  <tr> 
  <td rowspan="4">QUORUM</td> 
  <td rowspan="4">Strong</td> 
  <td rowspan="2">QUORUM, SERIAL</td> 
  <td rowspan="2">Strong</td> 
  <td rowspan="2">Linearizability</td> 
  <td>ALL, QUORUM, SERIAL</td> 
  <td>Strong</td> 
  <td>Linearizability</td> 
 </tr> 
 
 <tr>
 <td>LOCAL_ONE, ONE, LOCAL_QUORUM, LOCAL_SERIAL, TWO, THREE</td>
  <td>Consistent Prefix</td>
   <td>Global Consistent Prefix</td>
 </tr>
 
 
 <tr> 
  <td rowspan="2">LOCAL_QUORUM, THREE, TWO, ONE, LOCAL_ONE, ANY</td> 
  <td rowspan="2">Consistent Prefix </td> 
  <td rowspan="2">Global Consistent Prefix </td> 
  <td>ALL</td> 
  <td>Strong</td> 
  <td>Linearizability</td> 
 </tr> 
 
 <tr>
 <td>LOCAL_ONE, ONE, TWO, THREE, LOCAL_QUORUM, QUORUM</td>
  <td>Consistent Prefix</td>
   <td>Global Consistent Prefix</td>
 </tr>
 
 <tr> 
  <td rowspan="4">LOCAL_QUORUM, THREE, TWO</td> 
  <td rowspan="4">Bounded Staleness</td> 
  <td rowspan="2">LOCAL_QUORUM, LOCAL_SERIAL, TWO, THREE</td> 
  <td rowspan="2">Bounded Staleness</td> 
  <td rowspan="2">Bounded Staleness.<br/>
At most K versions or t time behind.<br/>
Read latest committed value in the region. 
</td> 
  
  <td>QUORUM, LOCAL_QUORUM, LOCAL_SERIAL, TWO, THREE</td> 
  <td>Bounded Staleness</td> 
  <td>Bounded Staleness.<br/>
At most K versions or t time behind. <br/>
Read latest committed value in the region. </td> 
 </tr> 
 
 <tr>
 <td>LOCAL_ONE, ONE</td>
  <td>Consistent Prefix</td>
   <td>Per-region Consistent Prefix</td>
 </tr>
 
 
 <tr> 
  <td>ONE, LOCAL_ONE, ANY</td> 
  <td>Consistent Prefix </td> 
  <td >Per-region Consistent Prefix </td> 
  <td>LOCAL_ONE, ONE, TWO, THREE, LOCAL_QUORUM, QUORUM</td> 
  <td>Consistent Prefix</td> 
  <td>Per-region Consistent Prefix</td> 
 </tr> 
</table>

## <a id="mongo-mapping"></a>Mapping between MongoDB 3.4 and Azure Cosmos DB consistency levels

The following table shows the "read concerns" mapping between MongoDB 3.4 and the default consistency level in Azure Cosmos DB. The table shows multi-region and single-region deployments.

| **MongoDB 3.4** | **Azure Cosmos DB (multi-region)** | **Azure Cosmos DB (single region)** |
| - | - | - |
| Linearizable | Strong | Strong |
| Majority | Bounded staleness | Strong |
| Local | Consistent prefix | Consistent prefix |

## Next steps

Read more about consistency levels and compatibility between Azure Cosmos DB APIs with the open-source APIs. See the following articles:

* [Availability and performance tradeoffs for various consistency levels](consistency-levels-tradeoffs.md)
* [MongoDB features supported by the Azure Cosmos DB's API for MongoDB](mongodb-feature-support.md)
* [Apache Cassandra features supported by the Azure Cosmos DB Cassandra API](cassandra-support.md)