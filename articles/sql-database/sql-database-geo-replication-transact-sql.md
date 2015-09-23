<properties 
    pageTitle="Geo-Replication for Azure SQL Database using Transact-SQL" 
    description="Geo-Replication for Azure SQL Database using Transact-SQL" 
    services="sql-database" 
    documentationCenter="" 
    authors="carl" 
    manager="jeffreyg" 
    editor=""/>

<tags
    ms.service="sql-database"
    ms.devlang="NA"
    ms.topic="article"
    ms.tgt_pltfrm="???"
    ms.workload="data-management" 
    ms.date="09/18/2015"
    ms.author="carlrab"/>

# Geo-Replication for Azure SQL Database using Transact-SQL

**Single database**

> [AZURE.SELECTOR]
- [Azure Preview Portal](sql-database-geo-replication-portal.md)
- [PowerShell](sql-database-geo-replication-powershell.md)
- [Transact-SQL](sql-database-geo-replication-transact-sql.md)


This article shows you how to configure Geo-Replication for SQL Database with Transact-SQL.



> [AZURE.NOTE] Anything noteworthy?


To configure Geo-Replication you need the following:

- An Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.

- SQL Server Management Studio - ...





## Add secondary database

The command serves to make the local database into a Geo-Replication primary (assuming that it is not already) and begin replicating data from it to a secondary database with the same name on another “partner” server. 

*COVER single databases and elastic databases

### Add readable secondary


### Add non-readable secondary



## Remove secondary database

The operation permanently terminates the replication to the secondary database and change the role of the secondary to the regular read-write database. If the connectivity to secondary database is broken the command succeeds but the secondary will become read-write after connectivity is restored.  




## Initiate a planned failover from the primary database to the secondary database

The secondary database can be switched to primary and vice versa. It is designed for planned failover such as during the DR drills. The command performs the following workflow: 

1. Temporarily switch replication to synchronous mode. This will cause all outstanding transactions to be flushed to the secondary; 

2. Switch the roles of the two databases in the geo-replication relationship.  

This sequence guarantees that no data loos will occur. There is a short period during which both databases are unavailable (on the order of 0 to 25 seconds) while the roles are switched. The entire operation should take less than a minute to complete under normal circumstances. 

NOTE:  If the primary database is unavailable when the command is issued it will fail with the error message indicating that the primary server is not available. In rare cases it is possible that the operation cannot complete and may appear stuck. In this case the user can call the force failover command and accept data loss. 




## Initiate an unplanned failover from the primary database to the secondary database

### Cleanup

### Allow/disallow data loss


In the case on an outage when the primary is no longer available the secondary database can be switched to primary using forced failover. It is designed for disaster recovery when restoring availability of the database is critical and some data loss is acceptable.  

When forced failover is invoked, the specified secondary database immediately becomes a primary database and begins accepting write transactions. As soon as the original primary database is able to reconnect with this new primary database after the forced failover operation, an incremental backup is taken on the original primary database and it is made into a secondary for the new primary database; subsequently, it is merely a replica of the new primary. But because Point In Time Restore is not supported on the secondary databases, if the user wishes to recovery data committed to the old primary database which had not been replicated to the new primary database, she has to engage CSS to restore a database to the know log backup. 

NOTE: If the command is issued when the both primary and secondary are online the old primary will become the new secondary but data synchronization will not be attempted. So some data loss may occur. 


If the primary database has multiple secondaries the command will partially succeed. The secondary on which the command was executed will become primary. The old primary however will remain primary, i.e. the two primaries will end up in inconsistent state and connected by a suspended replication link. The user will have to manually repair this configuration using a “remove secondary” API on either of these primary databases. 




## Monitor Geo-Replication configuration and health

Monitoring tasks include monitoring of the geo-replication configuration and monitoring data replication health.  




## Copy a database

A new database is created in the same or different logical server using a default or user selected service objective, including a named elastic pool.  


## Monitor a database copy

Since the database copy process is asynchronous the user can monitor the copy state transitions and the completion time.  



## Setup Geo-Replication Transact-SQL script


    Some T-SQL here?



    

## Next steps

- [Disaster Recovery Drills](sql-database-disaster-recovery-drills.md)




## Additional resources

- [Business Continuity Overview](sql-database-business-continuity.md)
- [SQL Database documentation](https://azure.microsoft.com/documentation/services/sql-database/)
