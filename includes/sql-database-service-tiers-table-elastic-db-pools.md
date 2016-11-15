
### Basic elastic pool limits



| Pool size (eDTUs)  | **50** | **100** | **200** | **300** | **400** | **800** | **1200** | **1600** |
|:---|---:|---:|---:| ---: | ---: | ---: | ---: | ---: |
| Max storage per pool* | 5 GB| 10 GB| 20 GB| 29 GB| 39 GB| 73 GB| 117 GB| 156 GB|
| Max DBs per pool | 100 | 200 | 500 | 500 | 500 | 500 | 500 | 500 |
| Max concurrent workers per pool | 100 | 200 | 400 | 600 | 800 | 1600 | 2400 | 3200 |
| Max concurrent logins per pool | 100 | 200 | 400 | 600 | 800 | 1600 | 2400 | 3200 |
| Max concurrent sessions per pool | 2400 | 4800 | 9600 | 14400 |19200 | 32000 | 32000 | 32000 |
| Min eDTUs per database | 0, 5 | 0, 5 | 0, 5 | 0, 5 | 0, 5 | 0, 5 | 0, 5 | 0, 5 | 0, 5 |
| Max eDTUs per database | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 | 5 |
||||||||

Point-in-time-restore: Any point last 7 days 

### Standard elastic pool limits

| Pool size (eDTUs)  | **50** | **100** | **200** | **300** | **400** | **800** | 
|:---|---:|---:|---:| ---: | ---: | ---: | ---: |---: |---: |---: |---: |
| Max storage per pool* | 50 GB| 100 GB| 200 GB | 300 GB| 400 GB | 800 GB | 
| Max DBs per pool | 100 | 200 | 500 | 500 | 500 | 500 | 
| Max concurrent workers per pool | 100 | 200 | 400 | 600 |  800 | 1600 |
| Max concurrent logins per pool | 100 | 200 | 400 | 600 |  800 | 1600 |
| Max concurrent sessions per pool | 1200 | 2400 | 4800 | 9600 | 14400 | 19200 |
| Min eDTUs per database | 0,10 | 0,10,20 | 0,10,20,50 | 0,10,20,50,100 | 0,10,20,50,100 | 0,10,20,50,100 |
| Max eDTUs per database | 10 | 10,20 | 10,20,50,100 | 10,20,50,100 | 10,20,50,100 | 10,20,50,100 | 
||||||||

### Standard elastic pool limits (continued)

| Pool size (eDTUs)  |  **1200** | **1600** | **2000** | **2500** | **3000** |
|:---|---:|---:|---:| ---: | ---: | ---: | ---: |---: |---: |---: |---: |
| Max storage per pool* | 1.2 TB | 1.6 TB | 2 TB | 2.5 TB | 3 TB |
| Max DBs per pool | 500 | 500 | 500 | 500 | 500 | 500 |
| Max concurrent workers per pool |  2400 | 3200 | 4000 | 5000 | 6000 |
| Max concurrent logins per pool |  2400 | 3200 | 4000 | 5000 | 6000 |
| Max concurrent sessions per pool | 32000 | 32000 | 32000 | 32000 | 32000 | 32000 |
| Min eDTUs per database | 0,10,20,50,100 | 0,10,20,50,100 | 0,10,20,50,100 | 0,10,20,50,100 | 0,10,20,50,100 |0,10,20,50,100 |
| Max eDTUs per database | 10,20,50,100 | 10,20,50,100 | 10,20,50,100 | 10,20,50,100 |10,20,50,100 |10,20,50,100 |
||||||||

Point-in-time-restore: Any point last 35 days 

### Premium elastic pool limits

| Pool size (eDTUs)  | **125** | **250** | **500** | **1000** | **1500** | 
|:---|---:|---:|---:| ---: | ---: | ---: | ---: |---: |---: |---: |
| Max storage per pool* | 250 GB| 500 GB| 750 GB| 750 GB| 750 GB| 
| Max DBs per pool | 50 | 100 | 100 | 100 | 100 |  
| Max concurrent workers per pool | 200 | 400 | 800 | 1600 |  2400 | 
| Max concurrent logins per pool | 200 | 400 | 800 | 1600 |  2400 |
| Max concurrent sessions per pool | 4800 | 9600 | 19200 | 32000 | 32000 | 
| Min eDTUs per database | 0,125 | 0,125,250 | 0,125,250,500 | 0,125,250,500,1000 | 0,125,250,500,1000 | 
| Max eDTUs per database | 125 | 125,250 | 125,250,500 | 125,250,500,1000 | 125,250,500,1000 |  
||||||||

### Premium elastic pool limits (continued)

| Pool size (eDTUs)  |  **2000** | **2500** | **3000** | **3500** | **4000** |
|:---|---:|---:|---:| ---: | ---: | ---: | ---: |---: |---: |---: |---: |
| Max storage per pool* | 750 GB| 750 GB| 750 GB| 750 GB| 750 GB|
| Max DBs per pool | 100 | 100 | 100 | 100 | 100 | 100 |
| Max concurrent workers per pool |  3200 | 4000 | 4800 | 5600 | 6400 |
| Max concurrent logins per pool |  3200 | 4000 | 4800 | 5600 | 6400 |
| Max concurrent sessions per pool | 32000 | 32000 | 32000 | 32000 | 32000 | 32000 |
| Min eDTUs per database | 0,125,250,500,<br>1000,1750 | 0,125,250,500,<br>1000,1750 | 0,125,250,500,<br>1000,1750 | 0,125,250,500,<br>1000,1750 | 0,125,250,500,<br>1000,1750 | 0,125,250,500,<br>1000,1750,4000 |
| Max eDTUs per database | 125,250,500,<br>1000,1750 | 125,250,500,<br>1000,1750 | 125,250,500,<br>1000,1750 | 125,250,500,<br>1000,1750 | 125,250,500,<br>1000,1750 | 125,250,500,<br>1000,1750,4000 |
||||||||

Point-in-time-restore: Any point last 35 days 


* Elastic database share pool storage, so database storage is limited to the smaller of the remaining pool storage or max storage per database
