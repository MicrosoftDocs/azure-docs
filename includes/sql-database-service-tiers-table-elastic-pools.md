<!--
Used in:
sql-database-elastic-pool.md 
-->
 
### Basic elastic pool limits

| eDTUs per pool | **50** | **100** | **200** | **300** | **400** | **800** | **1200** | **1600** |
|:---|---:|---:|---:| ---: | ---: | ---: | ---: | ---: |
| Included storage per pool | 5 GB | 10 GB | 20 GB | 29 GB | 39 GB | 78 GB | 117 GB | 156 GB |
| Max storage per pool | 5 GB | 10 GB | 20 GB | 29 GB | 39 GB | 78 GB | 117 GB | 156 GB |
| Max In-Memory OLTP storage per pool | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| Max number DBs per pool | 100 | 200 | 500 | 500 | 500 | 500 | 500 | 500 |
| Max concurrent workers (requests) per pool | 100 | 200 | 400 | 600 | 800 | 1600 | 2400 | 3200 |
| Max concurrent logins per pool | 100 | 200 | 400 | 600 | 800 | 1600 | 2400 | 3200 |
| Max concurrent sessions per pool | 30000 | 30000 | 30000 | 30000 |30000 | 30000 | 30000 | 30000 |
| Min eDTUs per database | 0, 5 | 0, 5 | 0, 5 | 0, 5 | 0, 5 | 0, 5 | 0, 5 | 0, 5 |
| Max eDTUs per database | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 |
| Max storage per database | 2 GB | 2 GB | 2 GB | 2 GB | 2 GB | 2 GB | 2 GB | 2 GB | 
||||||||

### Standard elastic pool limits

| eDTUs per pool | **50** | **100** | **200** | **300** | **400** | **800**| 
|:---|---:|---:|---:| ---: | ---: | ---: | 
| Included storage per pool | 50 GB | 100 GB| 200 GB | 300 GB| 400 GB | 800 GB | 
| Max storage per pool* | 500 GB| 750 GB| 1 TB | 1.25 TB | 1.5 TB | 2 TB | 
| Max In-Memory OLTP storage per pool | N/A | N/A | N/A | N/A | N/A | N/A | 
| Max number DBs per pool | 100 | 200 | 500 | 500 | 500 | 500 | 
| Max concurrent workers (requests) per pool | 100 | 200 | 400 | 600 | 800 | 1600 |
| Max concurrent logins per pool | 100 | 200 | 400 | 600 | 800 | 1600 |
| Max concurrent sessions per pool | 30000 | 30000 | 30000 | 30000 | 30000 | 30000 |
| Min eDTUs per database** | 0, 10, 20, 50 | 0, 10, 20, 50, 100 | 0, 10, 20, 50, 100, 200 | 0, 10, 20, 50, 100, 200, 300 | 0, 10, 20, 50, 100, 200, 300, 400 | 0, 10, 20, 50, 100, 200, 300, 400, 800 |
| Max eDTUs per database** | 10, 20, 50 | 10, 20, 50, 100 | 10, 20, 50, 100, 200 | 10, 20, 50, 100, 200, 300 | 10, 20, 50, 100, 200, 300, 400 | 10, 20, 50, 100, 200, 300, 400, 800 | 
| Max storage per database* | 500 GB | 750 GB | 1 TB | 1 TB | 1 TB | 1 TB |
||||||||

### Standard elastic pool limits (continued) 

| eDTUs per pool | **1200** | **1600** | **2000** | **2500** | **3000** |
|:---|---:|---:|---:| ---: | ---: |
| Included storage per pool | 1.2 TB | 1.6 TB | 2 TB | 2.4 TB | 2.9 TB | 
| Max storage per pool* | 2.5 TB | 3 TB | 3.5 TB | 4 TB | 4 TB |
| Max In-Memory OLTP storage per pool | N/A | N/A | N/A | N/A | N/A | 
| Max number DBs per pool | 500 | 500 | 500 | 500 | 500 | 
| Max concurrent workers (requests) per pool | 2400 | 3200 | 4000 | 5000 | 6000 |
| Max concurrent logins per pool | 2400 | 3200 | 4000 | 5000 | 6000 |
| Max concurrent sessions per pool | 30000 | 30000 | 30000 | 30000 | 30000 | 
| Min eDTUs per database** | 0, 10, 20, 50, 100, 200, 300, 400, 800, 1200 | 0, 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600 | 0, 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600, 2000 | 0, 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600, 2000, 2500 | 0, 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600, 2000, 2500, 3000 |
| Max eDTUs per database** | 10, 20, 50, 100, 200, 300, 400, 800, 1200 | 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600 | 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600, 2000 | 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600, 2000, 2500 | 10, 20, 50, 100, 200, 300, 400, 800, 1200, 1600, 2000, 2500, 3000 | 
| Max storage per database* | 1 TB | 1 TB | 1 TB | 1 TB | 1 TB | 
||||||||

### Premium elastic pool limits

| eDTUs per pool | **125** | **250** | **500** | **1000** | **1500**| 
|:---|---:|---:|---:| ---: | ---: | 
| Included storage per pool | 250 GB | 500 GB | 750 GB | 1 TB | 1.5 TB | 
| Max storage per pool* | 1 TB | 1 TB | 1 TB | 1 TB | 1.5 TB |
| Max In-Memory OLTP storage per pool | 1 GB| 2 GB| 4 GB| 10 GB| 12 GB| 
| Max number DBs per pool | 50 | 100 | 100 | 100 | 100 | 
| Max concurrent workers per pool (requests) | 200 | 400 | 800 | 1600 | 2400 | 
| Max concurrent logins per pool | 200 | 400 | 800 | 1600 | 2400 |
| Max concurrent sessions per pool | 30000 | 30000 | 30000 | 30000 | 30000 | 
| Min eDTUs per database | 0, 25, 50, 75, 125 | 0, 25, 50, 75, 125, 250 | 0, 25, 50, 75, 125, 250, 500 | 0, 25, 50, 75, 125, 250, 500, 1000 | 0, 25, 50, 75, 125, 250, 500, 1000, 1500 | 
| Max eDTUs per database | 25, 50, 75, 125 | 25, 50, 75, 125, 250 | 25, 50, 75, 125, 250, 500 | 25, 50, 75, 125, 250, 500, 1000 | 25, 50, 75, 125, 250, 500, 1000, 1500 |
| Max storage per database* | 1 TB | 1 TB | 1 TB | 1 TB | 1 TB | 
||||||||

### Premium elastic pool limits (continued) 

| eDTUs per pool | **2000** | **2500** | **3000** | **3500** | **4000**|
|:---|---:|---:|---:| ---: | ---: | 
| Included storage per pool | 2 TB | 2.5 TB | 3 TB | 3.5 TB | 4 TB |
| Max storage per pool* | 2 TB | 2.5 TB | 3 TB | 3.5 TB | 4 TB |
| Max In-Memory OLTP storage per pool | 16 GB | 20 GB | 24 GB | 28 GB | 32 GB |
| Max number DBs per pool | 100 | 100 | 100 | 100 | 100 | 
| Max concurrent workers (requests) per pool | 3200 | 4000 | 4800 | 5600 | 6400 |
| Max concurrent logins per pool | 3200 | 4000 | 4800 | 5600 | 6400 |
| Max concurrent sessions per pool | 30000 | 30000 | 30000 | 30000 | 30000 | 
| Min eDTUs per database | 0, 25, 50, 75, 125, 250, 500, 1000, 1750 | 0, 25, 50, 75, 125, 250, 500, 1000, 1750 | 0, 25, 50, 75, 125, 250, 500, 1000, 1750 | 0, 25, 50, 75, 125, 250, 500, 1000, 1750 | 0, 25, 50, 75, 125, 250, 500, 1000, 1750, 4000 | 
| Max eDTUs per database | 25, 50, 75, 125, 250, 500, 1000, 1750 | 25, 50, 75, 125, 250, 500, 1000, 1750 | 25, 50, 75, 125, 250, 500, 1000, 1750 | 25, 50, 75, 125, 250, 500, 1000, 1750 | 25, 50, 75, 125, 250, 500, 1000, 1750, 4000 | 
| Max storage per database* | 1 TB | 1 TB | 1 TB | 1 TB | 1 TB | 
||||||||

### Premium RS elastic pool limits

| eDTUs per pool | **125** | **250** | **500** | **1000** |
|:---|---:|---:|---:| ---: | ---: | 
| Included storage per pool | 250 GB| 500 GB | 750 GB | 750 GB |
| Max storage per pool* | 1 TB | 1 TB | 1 TB | 1 TB | 
| Max In-Memory OLTP storage per pool | 1 GB | 2 GB | 4 GB | 10 GB |
| Max number DBs per pool | 50 | 100 | 100 | 100 |
| Max concurrent workers (requests) per pool | 200 | 400 | 800 | 1600 |
| Max concurrent logins per pool | 200 | 400 | 800 | 1600 |
| Max concurrent sessions per pool | 30000 | 30000 | 30000 | 30000 |
| Min eDTUs per database | 0, 25, 50, 75, 125 | 0, 25, 50, 75, 125, 250 | 0, 25, 50, 75, 125, 250, 500 | 0, 25, 50, 75, 125, 250, 500, 1000 |
| Max eDTUs per database | 25, 50, 75, 125 | 25, 50, 75, 125, 250 | 25, 50, 75, 125, 250, 500 | 25, 50, 75, 125, 250, 500, 1000 | 
| Max storage per database* | 1 TB | 1 TB | 1 TB | 1 TB | 
||||||||

> [!IMPORTANT]
> \* Storage sizes greater than the amount of included storage are in preview and extra costs apply. For details, see the [SQL Database pricing page](https://azure.microsoft.com/pricing/details/sql-database/). Storage sizes greater than the amount of included storage are in preview and extra costs apply. For details, see the [SQL Database pricing page](https://azure.microsoft.com/pricing/details/sql-database/).
>
> In the Premium tier, more than 1 TB of storage is currently available in the following regions: US East2, West US, US Gov Virginia, West Europe, Germany Central, South East Asia, Japan East, Australia East, Canada Central, and Canada East. 
>
>\*\* Min/max eDTUs per database starting at 200 eDTUs and higher in **Standard** pools are in preview.
>
