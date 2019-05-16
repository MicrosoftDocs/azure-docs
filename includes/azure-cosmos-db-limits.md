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
| Min RU per container with dedicated throughput |400 |
| Min RU per database with dedicated throughput |400 |
| Min RU per container created inside a shared database |100 |
| Min RU per GB consumed in Cosmos DB |40 |
| Max RU per container |1000000 <sup>1</sup>|
| Max RU per shared database |1000000 <sup>1</sup>|
| Max RU per partition key |10000 |
| Max storage across all items per partition key|10GB |

## Control plane operations

| Resource | Default limit |
| --- | --- |
| Max database accounts per subscription |50 <sup>1</sup>|
| Max regions per database account |30 <sup>1</sup>|
| Max number of regional failovers |1/hour <sup>1</sup>|


## Per-item limits

| Resource | Default limit |
| --- | --- |
| Max size per item |2MB |
| Max length of partition key |2048 bytes |
| Max length of id |1024 bytes |

## Per-container limits

| Resource | Default limit |
| --- | --- |
| Max stored procedures per container |100 <sup>1</sup>|
| Max UDFs per container |25 <sup>1</sup>|
| Max number of paths in indexing policy|100 <sup>1</sup>|
| Max number of unique keys per container|10 <sup>1</sup>|
| Max number of paths per unique key constraint|16 <sup>1</sup>|

## Per-request limits

| Resource | Default limit |
| --- | --- |
| Max execution time for single operations (CRUD or single paginated query)| 5s |
| Max request size (stored procedure, CRUD)|2MB |
| Max response size (e.g., paginated query) |4MB |
| Max pre-triggers per request| 1 |
| Max post-triggers per request| 1 |
| Max master token expiry time |15min |
| Min resource token expiry time |10min |
| Max resource token expiry time |24h <sup>1</sup>|
| Max clock skew for token authorization| 15min |
 
## SQL query limits

| Resource | Default limit |
| --- | --- |
| Max length of SQL query| 256kb <sup>1</sup>|
| Max JOINs per query| 5 <sup>1</sup>|
| Max ANDs per query| 2000 <sup>1</sup>|
| Max ORs per query| 2000 <sup>1</sup>|
| Max UDFs per query| 10 <sup>1</sup>|
| Max arguments per IN expression| 6000 <sup>1</sup>|
| Max points per polygon| 4096 <sup>1</sup>|

## Mongo API-specific limits

| Resource | Default limit |
| --- | --- |
| Max Mongo query memory size | 40MB |
| Max execution time for Mongo operations| 30s |

<sup>1</sup>You can increase these limits by contacting Azure Support.
