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
| Storage included* |2 GB|
| Storage max* | 2 GB |
| Max in-memory OLTP storage |N/A |
| Max concurrent workers (requests) |30 |
| Max concurrent logins |30 |
| Max concurrent sessions |300 |
|||

### Standard service tier
| **Performance level** | **S0** | **S1** | **S2** | **S3** |
| --- |---:| ---:|---:|---:|---:|
| Max DTUs | 10 | 20 | 50 | 100 |
| Storage included* | 250 GB| 250 GB | 250 GB | 250 GB |
| Storage max* | 250 GB| 250 GB | 250 GB | 1 TB |
| Max in-memory OLTP storage | N/A | N/A | N/A | N/A |
| Max concurrent workers (requests)| 60 | 90 | 120 | 200 |
| Max concurrent logins | 60 | 90 | 120 | 200 |
| Max concurrent sessions |600 | 900 | 1200 | 2400 |
||||||

### Premium service tier 
| **Performance level** | **P1** | **P2** | **P4** | **P6** | **P11** | **P15** | 
| --- |---:|---:|---:|---:|---:|---:|
| Max DTUs | 125 | 250 | 500 | 1000 | 1750 | 4000 |
| Storage included* | 500 GB | 500 GB | 500 GB | 500 GB | 4 TB | 4 TB |
| Storage max* | 1 TB | 1 TB | 1 TB | 1 TB | 4 TB | 4 TB |
| Max in-memory OLTP storage | 1 GB | 2 GB | 4 GB | 8 GB | 14 GB | 32 GB |
| Max concurrent workers (requests)| 200 | 400 | 800 | 1600 | 2400 | 6400 |
| Max concurrent logins | 200 | 400| 800| 1600| 2400| 6400 |
| Max concurrent sessions | 30000| 30000| 30000| 30000| 30000| 30000 |
|||||||

### Premium RS service tier 
| **Performance level** | **PRS1** | **PRS2** | **PRS4** | **PRS6** |
| --- |---:|---:|---:|---:|---:|---:|
| Max DTUs | 125 | 250 | 500 | 1000 |
| Storage included* | 500 GB | 500 GB | 500 GB | 500 GB |
| Storage max* | 1 TB | 1 TB | 1 TB | 1 TB |
| Max in-memory OLTP storage | 1 GB | 2 GB | 4 GB | 8 GB |
| Max concurrent workers (requests)| 200 | 400 | 800 | 1600 |
| Max concurrent logins | 200 | 400| 800| 1600|
| Max concurrent sessions | 30000| 30000| 30000| 30000|
|||||||

> [!IMPORTANT]
> \* Storage limits only refer to the data in the database. Storage max sizes greater than the storage included are in preview. **Storage included** is the amount of storage that is provided a database or pool for no additional cost. **Storage max** is the maximum amount of storage that a user can provision for a database. If the storage max size set exceeds the amount of storage included, then an additional cost for the extra storage applies. This extra storage cost is an amount paid above the price paid based on DTUs.
>
> The price of extra storage is based on the amount of extra storage provisioned and the service tier of the database. It is determined by computing the product between the amount of extra storage for the database and the unit price of extra storage for the service tier. 
>
> For example, suppose an S3 database has set its storage max to 1 TB. The amount of storage included is 250 GB. So, the extra storage amount is the storage max less the storage included which is 1 TB – 250 GB = 1024 GB – 250 GB = 774 GB. S3 is in the Standard tier, and the unit price for extra storage in this tier is approximately $0.085/GB/month during the preview. Therefore, the price of the extra storage is 774 GB * $0.085/GB/month = $65.79/month during the preview. The total price of the S3 database is the summation of its DTU price and extra storage price. The price of an S3 without any extra storage is $150/month. Therefore, the total price for S3 with 1 TB is $150/month + $65.79/month = $215.79/month.
>