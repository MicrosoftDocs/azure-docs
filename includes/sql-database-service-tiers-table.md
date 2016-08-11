![Service Tiers and Performance Levels](./media/sql-database-service-tiers-table/sql-database-service-tiers-table.png)

|| Basic | Standard | Premium 
:---:|:---:|:---:|:---:|
||&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;S0 &nbsp; &nbsp; S1 &nbsp; &nbsp;&nbsp; S2 &nbsp; &nbsp;&nbsp; S3 &nbsp;&nbsp;&nbsp;&nbsp;| P1 &nbsp;&nbsp;&nbsp;&nbsp; P2 &nbsp;&nbsp;&nbsp;&nbsp; P4 &nbsp;&nbsp;&nbsp; P6/P3 &nbsp;&nbsp; P11 &nbsp;&nbsp; P15|
|DTUs|5|&nbsp;&nbsp;10 &nbsp;&nbsp;&nbsp;&nbsp; 20 &nbsp;&nbsp;&nbsp;&nbsp; 50 &nbsp;&nbsp; 100&nbsp;&nbsp;|125 &nbsp;&nbsp;&nbsp; 250 &nbsp;&nbsp; 500 &nbsp;&nbsp; 1000 &nbsp;&nbsp;&nbsp; 1750 &nbsp;&nbsp;&nbsp;&nbsp; 4000|
|Max Database Size|2|250 &nbsp;&nbsp; 250 &nbsp;&nbsp; 250 &nbsp;&nbsp; 250&nbsp;&nbsp;|500 &nbsp;&nbsp;&nbsp; 500 &nbsp;&nbsp;&nbsp; 500 &nbsp;&nbsp;&nbsp; 500 &nbsp;&nbsp;&nbsp; 1000 &nbsp;&nbsp;&nbsp; 1000|
|Max in-memory OLTP storage (GB)|2|250 &nbsp;&nbsp; 250 &nbsp;&nbsp; 250 &nbsp;&nbsp; 250&nbsp;&nbsp;|500 &nbsp;&nbsp;&nbsp; 500 &nbsp;&nbsp;&nbsp; 500 &nbsp;&nbsp;&nbsp; 500 &nbsp;&nbsp;&nbsp; 1000 &nbsp;&nbsp;&nbsp; 1000|
|Max concurrent workers|N/A|N/A|&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 2 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 4 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 8 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 14 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  32|
|Max concurrent logins|30|&nbsp;60 &nbsp;&nbsp;&nbsp; 90 &nbsp;&nbsp;&nbsp; 120 &nbsp;&nbsp;&nbsp; 200&nbsp;&nbsp;|&nbsp;&nbsp;200 &nbsp;&nbsp;&nbsp; 400 &nbsp; 800 &nbsp; 1600 &nbsp;&nbsp; 2400 &nbsp;&nbsp; 6400|
|Max concurrent sessions|300|600 &nbsp; 900 &nbsp; 1200 &nbsp; 2400&nbsp;&nbsp;|2400 &nbsp;4800 &nbsp; 9600 &nbsp;19200 &nbsp;32000 &nbsp;32000|
|Point-in-time-restore|Any point last 7 days|Any point last 35 days|Any point last 35 days|
|Disaster recovery|Active Geo-Replication|Active Geo-Replication|Active Geo-Replication|
