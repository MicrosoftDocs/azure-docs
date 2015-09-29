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
   ms.date="09/01/2015"
   ms.author="sashan"/>

# Designing Cloud Applications for Business Continuity Using Geo-Replication

There are several ways you can take advantage of the SQL Database Geo-Replication feature when designing your application for business continuity. The choice depends on several factors, but the main goal is to optimize it for your specific application. The factors that will guide your design choice include the application deployment topology, the service level agreement you are targeting, traffic latency and costs. In this article we look at the common application patterns and discuss the trade-offs of the different options.

## Design pattern 1: Active-passive deployment for disaster recovery with co-located database

This option is best suited for applications with the following characteristics:

+ active instance in a single Azure region
+ strong dependency on read-write (RW) access to data 
+ cross region connectivity between the application logic and the database is not acceptable due to latency and traffic cost    

In this case the application deployment topology is optimized for handling regional disasters when all application components are impacted and need to failover as a unit. For geographic redundancy both the application logic and the database are replicated to another region but not used for application workload under the normal conditions. The application in the secondary region should configured to use a SQL connection string to the secondary database. 

The following diagram shows this configuration before an outage. Traffic manager is configured with a failover profile and directs the user connections to the application instance in the primary region.

> [AZURE.NOTE] [Azure traffic manager](././traffic-manager/traffic-manager-overview/) is used here for illustration purposes only. You can use any load balancing solution. 

![Figure 1](./media/sql-database-designing-cloud-solutions-for-disaster-recovery/pattern1-1.png)

After an outage in the primary region traffic manager detects that connectivity in the primary region failed and switches the user traffic to the application instance in the secondary region. In the meantime you initiate the database failover as soon as the database outage is detected. After failover the application will process the user requests in the secondary region but will remain co-located with the database because the primary database will now be in the secondary region. This is illustrated by the next diagram.	

> [AZURE.NOTE] To detect database outage you can configure an [Elastic database job](https://azure.microsoft.com/en-us/documentation/articles/sql-database-elastic-jobs-overview/) running in either region to cross-check connectivity and responsiveness of the primary and secondary databases. If you need to perform additional non-SQL operation as part of each probe you may want to deploy a web role to periodically call a custom script.  

![Figure 2](./media/sql-database-designing-cloud-solutions-for-disaster-recovery/pattern1-2.png)

In case of an outage in the secondary region traffic manager will mark the the application end-point in the primary region as degraded and the replication channel will be suspended. However it will not impact the application's performance during the outage. Once the outage is mitigated the secondary database will be immediately synchronized with the primary. During synchronization performance of the primary could be slightly impacted depending on the amount of data that needs to be synchronized. The following diagram illustrates an outage in the secondary region.

![Figure 2](./media/sql-database-designing-cloud-solutions-for-disaster-recovery/pattern1-3.png)


The key **advantage** of this design pattern is that the SQL connection is configured once during the application deployment in each region and it doesn’t change after failover.  The main **tradeoff** is that the redundant application instance in the secondary region is only used for disaster recovery. 

## Design pattern 2: Active-active deployment for application load balancing
This option is best suited for applications with the following characteristics:

+ high ratio of reads to writes
+ write latency does not directly impact the end user experience  
+ the read-only logic can be separated from the read-write logic by using a different connection string 
+ the read-only logic does not depend on the data being fully synchronized with the latest version  

If your applications has these characteristics load balancing the end user connections across multiple application instances in different regions can improve performance and the end-user experience. To achieve that each region should have an active instance of the application with the read-write (RW) logic connected to the primary database in the primary region. The read-only (RO) logic should be connected to a secondary database in the same region as the application instance. 

> [AZURE.NOTE] Because this pattern requires read-only access to the secondary it requires [Active geo-replication](https://msdn.microsoft.com/library/azure/dn741339.aspx). 

Traffic manager should be configured with a performance profile to direct the user connections to the application instance closest to the user's geographic location. The following diagram illustrates this configuration before an outage. 
![Figure 3](./media/sql-database-designing-cloud-solutions-for-disaster-recovery/pattern2-1.png)

If a database outage is detected in the primary region you initiate failover of the primary database to one of the secondary regions. It will change the location of the primary database. Traffic manager will exclude the offline application instance from the routing table but will continue routing the end user traffic to the remaining online instances. Because the primary database is now in a different region all online instances must change their read-write SQL connection string to connect to the new primary. It is important that you make this change prior to initiating the database failover. The read-only SQL connection strings should remain unchanged as they always point to the database in the same region. The following diagram illustrates the new configuration after the failover.
![Figure 4](./media/sql-database-designing-cloud-solutions-for-disaster-recovery/pattern2-2.png)

In case of an outage in one of the secondary regions traffic manager will automatically remove the application instance's end-point in that region from the routing table. The replication channel to the secondary database in that region will be suspended. Because of the lost capacity the application instances in the remaining regions will have additional user traffic so the application's performance will be impacted during the outage. Once the outage is mitigated the secondary database in the impacted region will be immediately synchronized with the primary. During synchronization performance of the primary could be slightly impacted depending on the amount of data that needs to be synchronized. The following diagram illustrates an outage in one of the secondary regions.

![Figure 4](./media/sql-database-designing-cloud-solutions-for-disaster-recovery/pattern2-3.png)

The key **advantage** of this this design pattern is that you can scale the application logic to any number of instance to achieve the optimal end user performance. The **tradeoffs** of this option are:

+ read-write connections between the application instances and database have varying latency and cost
+ application performance is impacted during the outage
+ application instances must be able to dynamically change the SQL connection string after the database failover.  

> [AZURE.NOTE] A similar approach can be used to offload specialized workloads such as reporting jobs, business intelligence tools or backups. Typically these workloads consume significant database resources therefore it is recommended that you designate one of the secondary databases for them with the performance level matched to the anticipated workload. 

## Design pattern 3: Active-passive deployment for data preservation  
This option is best suited for applications with the following characteristics:

+ any data loss is high business risk, the database failover can only be used as a last resort if the outage is permanent
+ the application can operate in "read-only mode" for a period of time 

In this pattern the application relies on the read-only secondary when operating in read-only mode. The application logic in the primary region is co-located with the primary database and operates in read-write mode (RW), the application logic in the secondary region is co-located with the secondary database and is ready to operate in read-only  mode (RO).  

As in the first pattern, traffic manager is configured with a failover profile and directs the user traffic to the active deployment in the primary region. The following diagram illustrates this configuration before an outage. 
![Figure 5](./media/sql-database-designing-cloud-solutions-for-disaster-recovery/pattern3-1.png)

If traffic manager detects a connectivity failure to the primary region it switches user traffic to the application instance in the secondary region. With this pattern it is important that you **do not** initiate database failover after the outage is detected. The application in the secondary region is activated and operates in read-only mode using the secondary database. This is illustrated by the following diagram.

![Figure 6](./media/sql-database-designing-cloud-solutions-for-disaster-recovery/pattern3-2.png)

Once the outage in the primary region is mitigated traffic manager will detect the restoration of connectivity in the primary region and will switch user traffic back to the application instance in the primary region. That application instance resumes and operates in read-write mode using the primary database. 

> [AZURE.NOTE] Because this pattern requires read-only access to the secondary it requires [Active geo-replication](https://msdn.microsoft.com/library/azure/dn741339.aspx). 

In case of an outage in the secondary region traffic manager will mark the application end-point in the primary region as degraded and the replication channel will be suspended. However it will not impact the application's performance during the outage. Once the outage is mitigated the secondary database will be immediately synchronized with the primary. During synchronization performance of the primary could be slightly impacted depending on the amount of data that needs to be synchronized. This behavior is identical to design pattern 1.

The key **advantage** of this this design pattern is that it avoids data loss if the outage is temporary. The recovery of the application in read-only mode is quick, does not require database failover; the downtime depends only on how quickly traffic manager detects the connectivity failure, which is configurable. The main **tradeoff** is that the application must be able to operate in read-only mode. Resumption of read-write operations requires recovery of the primary region, which means full data access may be disabled for hours or even days. In case of a permanent outage database failover will be required similar to pattern #1. 

## Summary

Your specific DR strategy can combine or extend these patterns to best meet the needs of your application.  As mentioned earlier, the strategy you choose will be based on the SLA you want to offer to your customers and the application deployment topology. To help guide your decision the table below compares the choices based on the estimated data loss or recovery point objective (RPO) and estimated recovery time (ERT).

| Pattern | RPO | ERT 
| :--- |:--- | :--- 
| Active-passive deployment for disaster recovery with co-located database access | Read-write access < 5 sec | Failure detection time + failover API call + application verification test 
| Active-active deployment for application load balancing | Read-write access < 5 sec | Failure detection time + failover API call + SQL connection string change + application verification test
| Active-passive deployment for data preservation | Read-only access < 5 sec Read-write access = zero |  Read-only access = connectivity failure detection time + application verification test <br>Read-write access = time to mitigate the outage 




