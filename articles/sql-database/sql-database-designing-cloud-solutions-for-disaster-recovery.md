<properties 
   pageTitle="Designing Cloud Solutions for Disaster Recovery Using SQL Database Geo-Replication"
   description="Learn how to design your cloud solution for disaster recovery by choosing the right failover pattern."
   services="sql-database"
   documentationCenter="" 
   authors="sashan" 
   manager="jeffreyg" 
   editor="monicar"/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-management" 
   ms.date="10/07/2015"
   ms.author="sashan"/>

# Designing Cloud Applications for Business Continuity Using Geo-Replication

There are several ways you can take advantage of geo-replication in SQL Database when designing your application for business continuity. The factors that guide your design include application deployment topology, the service level agreement you are targeting, traffic latency and costs. In this article we look at the common application patterns and discuss the benefits and trade-offs of each option.

## Design pattern 1: Active-passive deployment for disaster recovery with co-located database

This option is best suited for applications with the following characteristics:

+ active instance in a single Azure region
+ strong dependency on read-write (RW) access to data 
+ cross region connectivity between the application logic and the database is not acceptable due to latency and traffic cost    

In this case the application deployment topology is optimized for handling regional disasters when all application components are impacted and need to failover as a unit. For geographic redundancy both the application logic and the database are replicated to another region but not used for application workload under the normal conditions. The application in the secondary region should be configured to use a SQL connection string to the secondary database. Traffic manager is set up to use [failover routing method](traffic-manager-configure-failover-load-balancing.md).  

> [AZURE.NOTE] [Azure traffic manager](traffic-manager-overview.md) is used throughout this article for illustration purposes only. You can use any load balancing solution that supports failover routing method.    
 
In addition to the main application instances you should consider deploying a small [worker role application](cloud-services-choose-me.md#tellmecs) that monitors your primary database by issuing periodic T-SQL read-only (RO) commands. You can use it to automatically trigger failover, to generate an alert on your application's admin console or both. To ensure that monitoring is not impacted by region-wide outages you should deploy the monitoring application instances to each region and have them connected to the database in the other region but only the instance in the secondary region needs to be active.

> [AZURE.NOTE] If you are using [Active geo-replication](https://msdn.microsoft.com/library/azure/dn741339.aspx) you can have both monitoring applications active and probe both primary and secondary databases. The latter can be used to detect a failure in the secondary region and alert when the application is not protected.     

The following diagram shows this configuration before an outage. 

![Figure 1](./media/sql-database-designing-cloud-solutions-for-disaster-recovery/pattern1-1.png)

After an outage in the primary region the monitoring application detects that the primary database is not accessible and registers an alert. Depending on your application SLA you can decide how many consecutive monitoring probes should fail before it declares a database outage. To achieve coordinated failover of the application end-point and the database you should have the monitoring application perform the following steps: 

1. [update the status of the primary end-point](https://msdn.microsoft.com/library/hh758250.aspx) to trigger end-point failover.
2. call the secondary database to [initiate database failover](https://msdn.microsoft.com/library/azure/dn509573.aspx) 

After failover the application will process the user requests in the secondary region but will remain co-located with the database because the primary database will now be in the secondary region. This is illustrated by the next diagram. In all diagrams solid lines indicates active connections, dotted lines indicate suspended connections and stop signs indicate action triggers. 


![Figure 2](./media/sql-database-designing-cloud-solutions-for-disaster-recovery/pattern1-2.png)

If an outage happens in the secondary region the replication link between the primary and the secondary database will be suspended and the monitoring application will register an alert that the primary database is exposed. This will not impact the application's performance but it will operate exposed and therefore at higher risk in case both regions fail in succession. 

> [AZURE.NOTE] We only recommend deployment configurations with a single DR region. This is because most of the Azure geographies have two regions. These configurations will not protect your application from a catastrophic failure of both regions. In an unlikely event of such a failure you can recover your databases in a third region using [geo-restore operation](sql-database-disaster-recovery.md#recovery-using-geo-restore).
 
Once the outage is mitigated the secondary database will be automatically synchronized with the primary. During synchronization performance of the primary could be slightly impacted depending on the amount of data that needs to be synchronized. The following diagram illustrates an outage in the secondary region.

![Figure 3](./media/sql-database-designing-cloud-solutions-for-disaster-recovery/pattern1-3.png)


The key **advantages** of this design pattern are:

+ the SQL connection string is set during the application deployment in each region and it doesn’t change after failover
+ the application's performance is not impacted by failover as the application and the database are always co-located 

The main **tradeoff** is that the redundant application instance in the secondary region is only used for disaster recovery. 

## Design pattern 2: Active-active deployment for application load balancing
This option is best suited for applications with the following characteristics:

+ high ratio of database reads to writes
+ database write latency does not impact the end user experience  
+ read-only logic can be separated from read-write logic by using a different connection string 
+ read-only logic does not depend on data being fully synchronized with the latest updates  

If your applications has these characteristics load balancing the end user connections across multiple application instances in different regions can improve performance and the end-user experience. To achieve that each region should have an active instance of the application with the read-write (RW) logic connected to the primary database in the primary region. The read-only (RO) logic should be connected to a secondary database in the same region as the application instance. Traffic manager should be set up to use [round-robin routing](traffic-manager-configure-round-robin-load-balancing.md) or [performance routing](traffic-manager-configure-performance-load-balancing.md) with [end-point monitoring](traffic-manager-monitoring.md) enabled for each application instance.

As in pattern #1, you should consider deploying a similar monitoring application. But unlike pattern #1 it will not be responsible for triggering the end-point failover. 

> [AZURE.NOTE] While this pattern uses more than one secondary database only one of the secondaries would be used for failover for the reasons noted earlier. Because this pattern requires read-only access to the secondary it requires [Active geo-replication](https://msdn.microsoft.com/library/azure/dn741339.aspx). 

Traffic manager should be configured for performance routing to direct the user connections to the application instance closest to the user's geographic location. The following diagram illustrates this configuration before an outage. 
![Figure 4](./media/sql-database-designing-cloud-solutions-for-disaster-recovery/pattern2-1.png)

If a database outage is detected in the primary region you initiate failover of the primary database to one of the secondary regions, which will change the location of the primary database. Traffic manager will automatically exclude the offline end-point from the routing table but will continue routing the end user traffic to the remaining online instances. Because the primary database is now in a different region all online instances must change their read-write SQL connection string to connect to the new primary. It is important that you make this change prior to initiating the database failover. The read-only SQL connection strings should remain unchanged as they always point to the database in the same region. The failover steps are:  

1. change read-write SQL connection strings to point to the new primary
2. call the designated secondary database to [initiate database failover](https://msdn.microsoft.com/
3. /library/azure/dn509573.aspx) 

The following diagram illustrates the new configuration after the failover.
![Figure 5](./media/sql-database-designing-cloud-solutions-for-disaster-recovery/pattern2-2.png)

In case of an outage in one of the secondary regions traffic manager will automatically remove the offline end-point in that region from the routing table. The replication channel to the secondary database in that region will be suspended. Because the remaining regions will get additional user traffic the application's performance may be impacted during the outage. Once the outage is mitigated the secondary database in the impacted region will be immediately synchronized with the primary. During synchronization performance of the primary could be slightly impacted depending on the amount of data that needs to be synchronized. The following diagram illustrates an outage in one of the secondary regions.

![Figure 6](./media/sql-database-designing-cloud-solutions-for-disaster-recovery/pattern2-3.png)

The key **advantage** of this this design pattern is that you can scale the application workload across multiple secondaries to achieve the optimal end user performance. The **tradeoffs** of this option are:

+ read-write connections between the application instances and database have varying latency and cost
+ application performance is impacted during the outage
+ application instances are required to dynamically change the SQL connection string after database failover.  

> [AZURE.NOTE] A similar approach can be used to offload specialized workloads such as reporting jobs, business intelligence tools or backups. Typically these workloads consume significant database resources therefore it is recommended that you designate one of the secondary databases for them with the performance level matched to the anticipated workload. 

## Design pattern 3: Active-passive deployment for data preservation  
This option is best suited for applications with the following characteristics:

+ any data loss is high business risk, the database failover can only be used as a last resort if the outage is permanent
+ the application can operate in "read-only mode" for a period of time 

In this pattern the application switches to read-only mode when connected to the secondary database. The application logic in the primary region is co-located with the primary database and operates in read-write mode (RW), the application logic in the secondary region is co-located with the secondary database and is ready to operate in read-only  mode (RO).  Traffic manager should be set up to use [failover routing](traffic-manager-configure-failover-load-balancing.md) with [end-point monitoring](traffic-manager-monitoring.md) enabled for both application instances.

The following diagram illustrates this configuration before an outage. 
![Figure 7](./media/sql-database-designing-cloud-solutions-for-disaster-recovery/pattern3-1.png)

When traffic manager detects a connectivity failure to the primary region it will automatically switch user traffic to the application instance in the secondary region. With this pattern it is important that you **do not** initiate database failover after the outage is detected. The application in the secondary region is activated and operates in read-only mode using the secondary database. This is illustrated by the following diagram.

![Figure 8](./media/sql-database-designing-cloud-solutions-for-disaster-recovery/pattern3-2.png)

Once the outage in the primary region is mitigated traffic manager will detect the restoration of connectivity in the primary region and will switch user traffic back to the application instance in the primary region. That application instance resumes and operates in read-write mode using the primary database. 

> [AZURE.NOTE] Because this pattern requires read-only access to the secondary it requires [Active geo-replication](https://msdn.microsoft.com/library/azure/dn741339.aspx). 

In case of an outage in the secondary region traffic manager will mark the application end-point in the primary region as degraded and the replication channel will be suspended. However it will not impact the application's performance during the outage. Once the outage is mitigated the secondary database will be immediately synchronized with the primary. During synchronization performance of the primary could be slightly impacted depending on the amount of data that needs to be synchronized. 

![Figure 8](./media/sql-database-designing-cloud-solutions-for-disaster-recovery/pattern3-3.png)

This design pattern has several **advantages**:

+ it avoids data loss during the temporary outages
+ it does not require you to deploy a monitoring application as the recovery is  triggered by traffic manager 
+ downtime depends only on how quickly traffic manager detects the connectivity failure, which is configurable.

The **tradeoffs** are:

+ application must be able to operate in read-only mode
+ it is required to dynamically switch to it when it is connected to a read-only database
+ resumption of read-write operations requires recovery of the primary region, which means full data access may be disabled for hours or even days. 

> [AZURE.NOTE] In case of a permanent service outage in the region you will have to manually activate database failover and accept the data loss. The application will be functional in the secondary region with read-write access to the database. 

## Summary

Your specific DR strategy can combine or extend these patterns to best meet the needs of your application.  As mentioned earlier, the strategy you choose will be based on the SLA you want to offer to your customers and the application deployment topology. To help guide your decision the table below compares the choices based on the estimated data loss or recovery point objective (RPO) and estimated recovery time (ERT).

| Pattern | RPO | ERT 
| :--- |:--- | :--- 
| Active-passive deployment for disaster recovery with co-located database access | Read-write access < 5 sec | Failure detection time + failover API call + application verification test 
| Active-active deployment for application load balancing | Read-write access < 5 sec | Failure detection time + failover API call + SQL connection string change + application verification test
| Active-passive deployment for data preservation | Read-only access < 5 sec Read-write access = zero |  Read-only access = connectivity failure detection time + application verification test <br>Read-write access = time to mitigate the outage 




