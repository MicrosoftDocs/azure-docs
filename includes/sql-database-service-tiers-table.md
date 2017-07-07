<!--
Used in:
sql-database-performance-guidance.md  
sql-database-resource-limits.md
sql-database-service-tiers.md  
-->

### Basic service tier
| **Performance level** | **Basic** |
| --- | :---: |
| Max DTUs | 5 |
| Max database size* |2 GB|
| Max in-memory OLTP storage |N/A |
| Max concurrent workers (requests) |30 |
| Max concurrent logins |30 |
| Max concurrent sessions |300 |
|||

### Standard service tier
| **Performance level** | **S0** | **S1** | **S2** | **S3** |
| --- |---:| ---:|---:|---:|---:|
| Max DTUs | 10 | 20 | 50 | 100 |
| Max database size* | 250 GB| 250 GB | 250 GB | 250 GB |
| Max in-memory OLTP storage | N/A | N/A | N/A | N/A |
| Max concurrent workers (requests)| 60 | 90 | 120 | 200 |
| Max concurrent logins | 60 | 90 | 120 | 200 |
| Max concurrent sessions |600 | 900 | 1200 | 2400 |
||||||

### Premium service tier 
| **Performance level** | **P1** | **P2** | **P4** | **P6** | **P11** | **P15** | 
| --- |---:|---:|---:|---:|---:|---:|
| Max DTUs | 125 | 250 | 500 | 1000 | 1750 | 4000 |
| Max database size* | 500 GB | 500 GB | 500  GB | 500 GB | 4 TB | 4 TB |
| Max in-memory OLTP storage | 1 GB | 2 GB | 4 GB | 8 GB | 14 GB | 32 GB |
| Max concurrent workers (requests)| 200 | 400 | 800 | 1600 | 2400 | 6400 |
| Max concurrent logins | 200 | 400| 800| 1600| 2400| 6400 |
| Max concurrent sessions | 30000| 30000| 30000| 30000| 30000| 30000 |
|||||||

### Premium RS service tier 
| **Performance level** | **PRS1** | **PRS2** | **PRS4** | **PRS6** |
| --- |---:|---:|---:|---:|---:|---:|
| Max DTUs | 125 | 250 | 500 | 1000 |
| Max database size* | 500 GB | 500 GB | 500  GB | 500 GB |
| Max in-memory OLTP storage | 1 GB | 2 GB | 4 GB | 8 GB |
| Max concurrent workers (requests)| 200 | 400 | 800 | 1600 |
| Max concurrent logins | 200 | 400| 800| 1600|
| Max concurrent sessions | 30000| 30000| 30000| 30000|
|||||||

\* Max database size refers to the maximum size of the data in the database. 