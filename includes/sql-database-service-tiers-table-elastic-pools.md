<!--
Used in:
sql-database-elastic-pool.md   
sql-database-resource-limits.md
sql-database-service-tiers.md  
-->
 
### Basic elastic pool limits

| Pool size (eDTUs)  | **50** | **100** | **200** | **300** | **400** | **800** | **1200** | **1600** |
|:---|---:|---:|---:| ---: | ---: | ---: | ---: | ---: |
| Max data storage per pool* | 5 GB | 10 GB | 20 GB | 29 GB | 39 GB | 78 GB | 117 GB | 156 GB |
| Max In-Memory OLTP storage per pool* | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |
| Max number DBs per pool | 100 | 200 | 500 | 500 | 500 | 500 | 500 | 500 |
| Max concurrent workers per pool | 100 | 200 | 400 | 600 | 800 | 1600 | 2400 | 3200 |
| Max concurrent logins per pool | 100 | 200 | 400 | 600 | 800 | 1600 | 2400 | 3200 |
| Max concurrent sessions per pool | 30000 | 30000 | 30000 | 30000 |30000 | 30000 | 30000 | 30000 |
| Min eDTUs per database | {0, 5} | {0, 5} | {0, 5} | {0, 5} | {0, 5} | {0, 5} | {0, 5} | {0, 5} | {0, 5} |
| Max eDTUs per database | {5} | {5} | {5} | {5} | {5} | {5} | {5} | {5} | {5} |
||||||||

### Standard elastic pool limits

| Pool size (eDTUs)  | **50** | **100** | **200** | **300** | **400** | **800** | 
|:---|---:|---:|---:| ---: | ---: | ---: | 
| Max data storage per pool* | 50 GB| 100 GB| 200 GB | 300 GB| 400 GB | 800 GB | 
| Max In-Memory OLTP storage per pool* | N/A | N/A | N/A | N/A | N/A | N/A | 
| Max number DBs per pool | 100 | 200 | 500 | 500 | 500 | 500 | 
| Max concurrent workers per pool | 100 | 200 | 400 | 600 |  800 | 1600 |
| Max concurrent logins per pool | 100 | 200 | 400 | 600 |  800 | 1600 |
| Max concurrent sessions per pool | 30000 | 30000 | 30000 | 30000 | 30000 | 30000 |
| Min eDTUs per database | {0,10,20,<br>50} | {0,10,20,<br>50,100} | {0,10,20,<br>50,100} | {0,10,20,<br>50,100} | {0,10,20,<br>50,100} | {0,10,20,<br>50,100} |
| Max eDTUs per database | {10,20,<br>50} | {10,20,<br>50,100} | {10,20,<br>50,100} | {10,20,<br>50,100} | {10,20,<br>50,100} | {10,20,<br>50,100} | 
||||||||

### Standard elastic pool limits (continued) 

| Pool size (eDTUs)  |  **1200** | **1600** | **2000** | **2500** | **3000** |
|:---|---:|---:|---:| ---: | ---: |
| Max data storage per pool* | 1.2 TB | 1.6 TB | 2 TB | 2.4 TB | 2.9 TB | 
| Max In-Memory OLTP storage per pool* | N/A | N/A | N/A | N/A | N/A | 
| Max number DBs per pool | 500 | 500 | 500 | 500 | 500 | 500 |
| Max concurrent workers per pool |  2400 | 3200 | 4000 | 5000 | 6000 |
| Max concurrent logins per pool |  2400 | 3200 | 4000 | 5000 | 6000 |
| Max concurrent sessions per pool | 30000 | 30000 | 30000 | 30000 | 30000 | 
| Min eDTUs per database | {0,10,20,<br>50,100} | {0,10,20,<br>50,100} | {0,10,20,<br>50,100} | {0,10,20,<br>50,100} | {0,10,20,<br>50,100} |
| Max eDTUs per database | {10,20,<br>50,100} | {10,20,<br>50,100} | {10,20,<br>50,100} | {10,20,<br>50,100} | {10,20,<br>50,100} | 
||||||||

### Premium elastic pool limits

| Pool size (eDTUs)  | **125** | **250** | **500** | **1000** | **1500** | 
|:---|---:|---:|---:| ---: | ---: | 
| Max data storage per pool* | 250 GB| 500 GB| 750 GB| 750 GB| 750 GB| 
| Max In-Memory OLTP storage per pool* | 1 GB| 2 GB| 4 GB| 10 GB| 12 GB| 
| Max number DBs per pool | 50 | 100 | 100 | 100 | 100 |  
| Max concurrent workers per pool | 200 | 400 | 800 | 1600 |  2400 | 
| Max concurrent logins per pool | 200 | 400 | 800 | 1600 |  2400 |
| Max concurrent sessions per pool | 30000 | 30000 | 30000 | 30000 | 30000 | 
| Min eDTUs per database | {0,25,50,75,<br>125} | {0,25,50,75,<br>125,250} | {0,25,50,75,<br>125,250,500} | {0,25,50,75,<br>125,250,500,<br>1000} | {0,25,50,75,<br>125,250,500,<br>1000,1500} | 
| Max eDTUs per database | {25,50,75,<br>125} | {25,50,75,<br>125,250} | {25,50,75,<br>125,250,500} | {25,50,75,<br>125,250,500,<br>1000} | {25,50,75,<br>125,250,500,<br>1000,1500} |  
||||||||

### Premium elastic pool limits (continued) 

| Pool size (eDTUs)  |  **2000** | **2500** | **3000** | **3500** | **4000** |
|:---|---:|---:|---:| ---: | ---: | 
| Max data storage per pool* | 750 GB | 750 GB | 750 GB | 750 GB | 750 GB |
| Max In-Memory OLTP storage per pool* | 16 GB | 20 GB | 24 GB | 28 GB | 32 GB |
| Max number DBs per pool | 100 | 100 | 100 | 100 | 100 | 
| Max concurrent workers per pool |  3200 | 4000 | 4800 | 5600 | 6400 |
| Max concurrent logins per pool |  3200 | 4000 | 4800 | 5600 | 6400 |
| Max concurrent sessions per pool | 30000 | 30000 | 30000 | 30000 | 30000 | 
| Min eDTUs per database | {0,25,50,75,<br>125,250,500,<br>1000,1750} | {0,25,50,75,<br>125,250,500,<br>1000,1750} | {0,25,50,75,<br>125,250,500,<br>1000,1750} | {0,25,50,75,<br>125,250,500,<br>1000,1750} |  {0,25,50,75,<br>125,250,500,<br>1000,1750,4000} | 
| Max eDTUs per database | {25,50,75,<br>125,250,500,<br>1000,1750} | {25,50,75,<br>125,250,500,<br>1000,1750} | {25,50,75,<br>125,250,500,<br>1000,1750} | {25,50,75,<br>125,250,500,<br>1000,1750} | {25,50,75,<br>125,250,500,<br>1000,1750,4000} | 
||||||||

### Premium RS elastic pool limits

| Pool size (eDTUs)  | **125** | **250** | **500** | **1000** |
|:---|---:|---:|---:| ---: | ---: | 
| Max data storage per pool* | 250 GB| 500 GB | 750 GB | 750 GB |
| Max In-Memory OLTP storage per pool* | 1 GB | 2 GB | 4 GB | 10 GB |
| Max number DBs per pool | 50 | 100 | 100 | 100 |
| Max concurrent workers per pool | 200 | 400 | 800 | 1600 |
| Max concurrent logins per pool | 200 | 400 | 800 | 1600 |
| Max concurrent sessions per pool | 30000 | 30000 | 30000 | 30000 |
| Min eDTUs per database | {0,25,50,75,<br>125} | {0,25,50,75,<br>125,250} | {0,25,50,75,<br>125,250,500} | {0,25,50,75,<br>125,250,500,<br>1000} |
| Max eDTUs per database | {25,50,75,<br>125} | {25,50,75,<br>125,250} | {25,50,75,<br>125,250,500} | {25,50,75,<br>125,250,500,<br>1000} | 
||||||||

> [!IMPORTANT]
>\* Pooled databases share pool storage, so data storage in an elastic pool is limited to the smaller of the remaining pool storage or max storage per database.
>
