<!--
Used in:
sql-database-performance-guidance.md 
sql-database-single-database-resources.md 
-->

### Basic service tier
| **Performance level** | **Basic** |
| :--- | --: |
| Max DTUs | 5 |
| Included storage (GB) | 2 |
| Max storage choices (GB) | 2 |
| Max in-memory OLTP storage (GB) |N/A |
| Max concurrent workers (requests) | 30 |
| Max concurrent logins | 30 |
| Max concurrent sessions | 300 |
|||

### Standard service tier
| **Performance level** | **S0** | **S1** | **S2** | **S3** |
| :--- |---:| ---:|---:|---:|---:|
| Max DTUs** | 10 | 20 | 50 | 100 |
| Included storage (GB) | 250 | 250 | 250 | 250 |
| Max storage choices (GB)* | 250 | 250 | 250 | 250, 500, 750, 1024 |
| Max in-memory OLTP storage (GB) | N/A | N/A | N/A | N/A |
| Max concurrent workers (requests)| 60 | 90 | 120 | 200 |
| Max concurrent logins | 60 | 90 | 120 | 200 |
| Max concurrent sessions |600 | 900 | 1200 | 2400 |
||||||

### Standard service tier (continued)
| **Performance level** | **S4** | **S6** | **S7** | **S9** | **S12** |
| :--- |---:| ---:|---:|---:|---:|---:|
| Max DTUs** | 200 | 400 | 800 | 1600 | 3000 |
| Included storage (GB) | 250 | 250 | 250 | 250 | 250 |
| Max storage choices (GB)* | 250, 500, 750, 1024 | 250, 500, 750, 1024 | 250, 500, 750, 1024 | 250, 500, 750, 1024 | 250, 500, 750, 1024 |
| Max in-memory OLTP storage (GB) | N/A | N/A | N/A | N/A |N/A |
| Max concurrent workers (requests)| 400 | 800 | 1600 | 3200 |6000 |
| Max concurrent logins | 400 | 800 | 1600 | 3200 |6000 |
| Max concurrent sessions |4800 | 9600 | 19200 | 30000 |30000 |
|||||||

### Premium service tier 
| **Performance level** | **P1** | **P2** | **P4** | **P6** | **P11** | **P15** | 
| :--- |---:|---:|---:|---:|---:|---:|
| Max DTUs | 125 | 250 | 500 | 1000 | 1750 | 4000 |
| Included storage (GB) | 500 | 500 | 500 | 500 | 4096 | 4096 |
| Max storage choices (GB)* | 500, 750, 1024 | 500, 750, 1024 | 500, 750, 1024 | 500, 750, 1024 | 4096 | 4096 |
| Max in-memory OLTP storage (GB) | 1 | 2 | 4 | 8 | 14 | 32 |
| Max concurrent workers (requests)| 200 | 400 | 800 | 1600 | 2400 | 6400 |
| Max concurrent logins | 200 | 400 | 800 | 1600 | 2400 | 6400 |
| Max concurrent sessions | 30000 | 30000 | 30000 | 30000 | 30000 | 30000 |
|||||||


> [!IMPORTANT]
> \* Storage sizes greater than the amount of included storage are in preview and extra costs apply. For details, see [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/). 
>
>\* In the Premium tier, more than 1 TB of storage is currently available in the following regions: Australia East, Australia Southeast, Brazil South, Canada Central, Canada East, Central US, France Central, Germany Central, Japan East, Japan West, Korea Central, North Central US, North Europe, South Central US, South East Asia, UK South, UK West, US East2, West US, US Gov Virginia, and West Europe. See [P11-P15 Current Limitations](../articles/sql-database/sql-database-resource-limits.md#single-database-limitations-of-p11-and-p15-when-the-maximum-size-greater-than-1-tb).  
> 
>\*\* Max DTUs per database starting at 200 DTUs and higher in Standard are in preview.
>

