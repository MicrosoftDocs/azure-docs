<!--
Used in:
sql-database-performance-guidance.md 
sql-database-single-database-resources.md 
-->

### Basic service tier
| **Performance level** | **Basic** |
| --- | :---: |
| Max DTUs | 5 |
| Included storage |2 GB|
| Max storage | 2 GB |
| Max in-memory OLTP storage |N/A |
| Max concurrent workers (requests) |30 |
| Max concurrent logins |30 |
| Max concurrent sessions |300 |
|||

### Standard service tier
| **Performance level** | **S0** | **S1** | **S2** | **S3** |
| --- |---:| ---:|---:|---:|---:|
| Max DTUs | 10 | 20 | 50 | 100 |
| Included storage | 250 GB| 250 GB | 250 GB | 250 GB |
| Max storage* | 250 GB| 250 GB | 250 GB | 1 TB |
| Max in-memory OLTP storage | N/A | N/A | N/A | N/A |
| Max concurrent workers (requests)| 60 | 90 | 120 | 200 |
| Max concurrent logins | 60 | 90 | 120 | 200 |
| Max concurrent sessions |600 | 900 | 1200 | 2400 |
||||||

### Standard service tier (continued)
| **Performance level** | **S4** | **S6** | **S7** | **S9** | **S12** |
| --- |---:| ---:|---:|---:|---:|---:|
| Max DTUs | 200 | 400 | 800 | 1600 | 3000 |
| Included storage | 250 GB| 250 GB | 250 GB | 250 GB | 250 GB |
| Max storage* | 1 TB| 1 TB | 1 TB | 1 TB |1 TB |
| Max in-memory OLTP storage | N/A | N/A | N/A | N/A |N/A |
| Max concurrent workers (requests)| 400 | 800 | 1600 | 3200 |6000 |
| Max concurrent logins | 400 | 800 | 1600 | 3200 |6000 |
| Max concurrent sessions |4800 | 9600 | 19200 | 30000 |30000 |
|||||||

### Premium service tier 
| **Performance level** | **P1** | **P2** | **P4** | **P6** | **P11** | **P15** | 
| --- |---:|---:|---:|---:|---:|---:|
| Max DTUs | 125 | 250 | 500 | 1000 | 1750 | 4000 |
| Included storage | 500 GB | 500 GB | 500 GB | 500 GB | 4 TB | 4 TB |
| Max storage* | 1 TB | 1 TB | 1 TB | 1 TB | 4 TB | 4 TB |
| Max in-memory OLTP storage | 1 GB | 2 GB | 4 GB | 8 GB | 14 GB | 32 GB |
| Max concurrent workers (requests)| 200 | 400 | 800 | 1600 | 2400 | 6400 |
| Max concurrent logins | 200 | 400| 800| 1600| 2400| 6400 |
| Max concurrent sessions | 30000| 30000| 30000| 30000| 30000| 30000 |
|||||||

### Premium RS service tier 
| **Performance level** | **PRS1** | **PRS2** | **PRS4** | **PRS6** |
| --- |---:|---:|---:|---:|---:|---:|
| Max DTUs | 125 | 250 | 500 | 1000 |
| Included storage | 500 GB | 500 GB | 500 GB | 500 GB |
| Max storage* | 1 TB | 1 TB | 1 TB | 1 TB |
| Max in-memory OLTP storage | 1 GB | 2 GB | 4 GB | 8 GB |
| Max concurrent workers (requests)| 200 | 400 | 800 | 1600 |
| Max concurrent logins | 200 | 400| 800| 1600|
| Max concurrent sessions | 30000| 30000| 30000| 30000|
|||||||

> [!IMPORTANT]
> \* Storage sizes greater than the amount of included storage are in preview and extra costs apply. For details, see [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/). 
>
>\* In the Premium tier, more than 1 TB of storage is currently available in the following regions: US East2, West US, US Gov Virginia, West Europe, Germany Central, South East Asia, Japan East, Australia East, Canada Central, and Canada East. See [P11-P15 Current Limitations](../articles/sql-database/sql-database-resource-limits.md#current-limitations-of-p11-and-p15-databases-with-a-maximum-size-greater-than-1-tb).  
> 
