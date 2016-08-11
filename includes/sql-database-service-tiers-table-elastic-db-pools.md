![Service tiers for elastic pools](./media/sql-database-service-tiers-table-elastic-db-pools/sql-database-service-tiers-table-elastic-db-pools.png) 

Elastic Pool

|| Basic | Standard | Premium 
:---:|:---:|:---:|:---:|
|eDTUs per pool|100 &nbsp;200 &nbsp;400 &nbsp;800 &nbsp;1200|100 &nbsp;&nbsp; 200 &nbsp;&nbsp; 400 &nbsp;&nbsp; 800&nbsp;&nbsp;1200|125 &nbsp;&nbsp; 250 &nbsp;&nbsp; 500 &nbsp;&nbsp; 1000 &nbsp;&nbsp; 1500|
|Max storage per pool (GB)*|&nbsp;&nbsp;10 &nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;&nbsp;39 &nbsp;&nbsp;&nbsp;73 &nbsp;&nbsp;&nbsp;117|100 &nbsp;&nbsp; 200 &nbsp;&nbsp; 400 &nbsp;&nbsp; 800&nbsp;&nbsp;1200|250 &nbsp;&nbsp; 500 &nbsp;&nbsp; 750 &nbsp;&nbsp;&nbsp; 750 &nbsp;&nbsp;&nbsp;&nbsp; 750|
|Max number of databases per pool|200 &nbsp;400 &nbsp;400 &nbsp;400 &nbsp;400|200 &nbsp;&nbsp; 400 &nbsp;&nbsp; 400 &nbsp;&nbsp; 400&nbsp;&nbsp;&nbsp;400|50 &nbsp;&nbsp;&nbsp;&nbsp; 50 &nbsp;&nbsp;&nbsp;&nbsp; 50 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 50 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 50|
|Max concurrent workers per pool|&nbsp;&nbsp;&nbsp;200 &nbsp;&nbsp; 400 &nbsp;&nbsp;&nbsp;&nbsp; 800 &nbsp;&nbsp;&nbsp; 1600 &nbsp;&nbsp;&nbsp;&nbsp;2400|&nbsp;&nbsp;&nbsp;200 &nbsp;&nbsp; 750 &nbsp;&nbsp;&nbsp;&nbsp; 1300 &nbsp;&nbsp;&nbsp; 1850 &nbsp;&nbsp;&nbsp;&nbsp;2400|&nbsp;&nbsp;200 &nbsp;&nbsp;&nbsp; 750 &nbsp;&nbsp;&nbsp; 1300 &nbsp;&nbsp; 1850 &nbsp;&nbsp;&nbsp;&nbsp; 2400 |
|Max concurrent logins per pool|&nbsp;&nbsp;&nbsp;200 &nbsp;&nbsp; 400 &nbsp;&nbsp;&nbsp;&nbsp; 800 &nbsp;&nbsp;&nbsp; 1600 &nbsp;&nbsp;&nbsp;&nbsp;2400|&nbsp;&nbsp;&nbsp;200 &nbsp;&nbsp; 750 &nbsp;&nbsp;&nbsp;&nbsp; 1300 &nbsp;&nbsp;&nbsp; 1850 &nbsp;&nbsp;&nbsp;&nbsp;2400|&nbsp;&nbsp;200 &nbsp;&nbsp;&nbsp; 750 &nbsp;&nbsp;&nbsp; 1300 &nbsp;&nbsp; 1850 &nbsp;&nbsp;&nbsp;&nbsp; 2400 |
|Max concurrent sessions per pool|4800 &nbsp;9600 &nbsp; 19200 &nbsp; 28800 &nbsp; 28800|4800 &nbsp; 9600 &nbsp; 19200 &nbsp; 28800&nbsp;&nbsp; 28800|4800 &nbsp; 9600 &nbsp;19200 &nbsp;28800 &nbsp;&nbsp; 28800|

Elastic database

|| Basic | Standard | Premium 
:---:|:---:|:---:|:---:|
||&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;S0 &nbsp; &nbsp; S1 &nbsp; &nbsp;&nbsp; S2 &nbsp; &nbsp;&nbsp; S3 &nbsp;&nbsp;&nbsp;&nbsp;| P1 &nbsp;&nbsp;&nbsp;&nbsp; P2 &nbsp;&nbsp;&nbsp;&nbsp; P4 &nbsp;&nbsp;&nbsp; P6/P3 &nbsp;&nbsp; P11 &nbsp;&nbsp; P15|
|Max eDTUs per database|5|&nbsp;&nbsp;10 &nbsp;&nbsp;&nbsp;&nbsp; 20 &nbsp;&nbsp;&nbsp;&nbsp; 50 &nbsp;&nbsp; 100&nbsp;&nbsp;|125 &nbsp;&nbsp;&nbsp; 250 &nbsp;&nbsp; 500 &nbsp;&nbsp; 1000 &nbsp;&nbsp;&nbsp|
|Min eDTUs per database|5|&nbsp;&nbsp;0 &nbsp;&nbsp; 10 &nbsp;&nbsp;&nbsp;&nbsp; 20 &nbsp;&nbsp;&nbsp;&nbsp; 50 &nbsp;&nbsp; 100&nbsp;&nbsp;|0 &nbsp;&nbsp; 125 &nbsp;&nbsp;&nbsp; 250 &nbsp;&nbsp; 500 &nbsp;&nbsp; 1000|
|Max storage per database (GB)*|2|250|500|
|Point-in-time-restore|Any point last 7 days|Any point last 35 days|Any point last 35 days|
|Disaster recovery|Active Geo-Replication|Active Geo-Replication|Active Geo-Replication|