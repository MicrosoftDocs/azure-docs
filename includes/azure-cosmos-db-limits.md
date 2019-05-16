---
author: arramac
ms.service: cosmos-db
ms.topic: include
ms.date: 05/15/2019
ms.author: arramac
---

Azure Cosmos DB is designed to support large scale globally distributed workloads. Many of the values listed here are soft limits designed for scalability, and can be raised by filing a support ticket.

## Storage and throughput

| Resource | Default limit |
| --- | --- |
| Min RU per collection with dedicated throughput |400 |
| Min RU per database with dedicated throughput |400 |
| Min RU per collection created inside a shared database |100 |
| Min RU per GB consumed in Cosmos DB |40 |
| Max RU per collection |1000000 <sup>1</sup>|
| Max RU across all collections per account |1000000 <sup>1</sup>|
| Max RU per partition key |10000 |
| Max storage across all items per partition key|10GB |
| Max storage per collection |50TB <sup>1</sup>|
| Max storage per account |50TB <sup>1</sup>|

## Per-item limits

| Resource | Default limit |
| --- | --- |
| Max size per document |2MB |
| Max length of partition key |2048 bytes |
| Max length of id |1024 bytes |

## Per-collection limits

| Resource | Default limit |
| --- | --- |
| Max stored procedures per collection |100 <sup>1</sup>|
| Max UDFs per collection |25 <sup>1</sup>|
| Max number of paths in indexing policy|100 <sup>1</sup>|
| Max number of unique keys per collection|10 <sup>1</sup>|
| Max number of paths per unique key constraint|16 <sup>1</sup>|

## Per-request limits

| Resource | Default limit |
| --- | --- |
| Max execution time for single operations (CRUD or single paginated query)| 5s |
| Max pre-triggers per request| 1 <sup>1</sup>|
| Max post-triggers per request| 1 <sup>1</sup>|
| Max master token expiry time |15min |
| Minimum resource token expiry time |10min |
| Max resource token expiry time |24h |
| Max clock skew for token authorization| 15min |
 
## SQL query limits

| Resource | Default limit |
| --- | --- |
| Max length of SQL query| 256kb <sup>1</sup>|
| Max response size per query page| 4MB <sup>1</sup>|
| Max JOINs per query| 5 <sup>1</sup>|
| Max ANDs per query| 2000 <sup>1</sup>|
| Max ORs per query| 2000 <sup>1</sup>|
| Max UDFs per query| 10 <sup>1</sup>|
| Max arguments per IN expression| 6000 <sup>1</sup>|
| Max points per polygon| 256 <sup>1</sup>|

## Mongo API-specific limits

| Resource | Default limit |
| --- | --- |
| Max Mongo query memory size | 40MB |
| Max execution time for Mongo operations| 30s |

<sup>1</sup>You can increase these limits by contacting Azure Support.
