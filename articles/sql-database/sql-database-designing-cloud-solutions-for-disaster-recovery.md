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

# Designing Cloud Solutions for Disaster Recovery Using Geo-Replication

There are several ways you can take advantage of the SQL Database Geo-Replication feature when designing your application for business continuity. The choice depends on several factors, but the main goal is to optimize it for specific application patterns. Other factors include ease of failover management, your application’s service level agreement, and traffic latency and costs. In this article we look at the common design patterns and discuss the trade-off of the specific options.

## Design pattern 1: Active-passive deployment with co-located database configuration

This option is best suited for applications with a single active deployment in one of the Azure regions. The application requires co-location of the application logic and the database in the same region. For example this could be required because of a chatty interface between the two. It also designed to avoid additional traffic cost. For geographic redundancy both the application logic and the database are replicated to another region but not used for an application workload. The application logic in the secondary region uses the SQL connection to the secondary database. 

The following diagram shows this configuration before the outage. The traffic manager is configured with a failover profile and directs the user traffic to the active deployment in the primary region.
![Figure 1](./media/sql-database-designing-cloud-solutions-for-disaster-recovery/pattern1-1.png)
After the outage the traffic manager detects the connectivity failure to the primary region and switches the user traffic to the application instance deployed in the secondary region. It is important that you initiate the database failover as soon as the outage is detected. As a result, the application logic and the database will remain co-located, but are now in the secondary region. This is illustrated by the next diagram.	
![Figure 2](./media/sql-database-designing-cloud-solutions-for-disaster-recovery/pattern1-2.png)
> [AZURE.NOTE] [Azure traffic manager](https://azure.microsoft.com/en-us/documentation/articles/traffic-manager-overview/) is used here for illustration purposes only. You can choose any other traffic manager or load balancer solution. 

The key **advantage** of this approach is that the SQL connection is configured once during the application deployment in each region and it doesn’t change after failover.  The main **tradeoff** is that the redundant application instance in the secondary region is only used for failover. 

## Design pattern 2: Active-active deployment with non co-located database configuration
This option is best suited for applications designed for load balancing the end user traffic across multiple regions. For example, it allows routing based on the end user physical location to minimize the latency. In this case each region has an active instance of the application logic connected to the same database in the primary region. The database is geo-replicated between the primary and a secondary region for disaster recovery. The following diagram illustrates this configuration before the outage. The traffic manager is configured with a performance profile. It directs the user traffic to the application instance closest to the end user geographic location.

![Figure 3](./media/sql-database-designing-cloud-solutions-for-disaster-recovery/pattern2-1.png)

After the outage is detected you initiate the database failover, which will change the location of the primary database. The traffic manager will exclude the offline application instance from the routing table but will continue routing the end user traffic to the remaining online instances. Because the primary database is now in a different region all online instances must change the SQL connection parameters to connect to the new primary. It is important that you make this change prior to initiating the database failover. 
![Figure 4](./media/sql-database-designing-cloud-solutions-for-disaster-recovery/pattern2-2.png)

The key **advantage** of this approach is that you can scale the application logic to any number of instance to achieve the optimal end user performance. The main **tradeoff** is that the traffic between the application instances and database have varying latency and cost. In addition, the application instances must be able to dynamically change the SQL connection string after the database failover.    

## Design pattern 3: Active-passive deployment with non co-located database configuration
This design pattern is best suited for applications that are extremely sensitive to the data loss and would only consider the database failover if the outage is permanent. In this pattern the application relies on the read-only secondary database to remain online. The application logic is deployed in both primary and secondary locations and co-located with the database. The databases are geo-replicated between the primary and secondary locations. 
> [AZURE.NOTE] Because it requires read-only access to the secondary this pattren require using [Active geo-replication](https://msdn.microsoft.com/library/azure/dn741339.aspx). 
The following diagram illustrates this configuration before the outage. 

As in the first pattern, the traffic manager is configured with a failover profile and directs the user traffic to the active deployment in the primary region.

![Figure 5](./media/sql-database-designing-cloud-solutions-for-disaster-recovery/pattern3-1.png)

After the outage the traffic manager detects the connectivity failure to the primary region and switches the user traffic to the application instance in the secondary region. It is important that you do not initiate the database failover after the outage is detected. The application in the secondary regions should operate in the read-only mode as it is connected to the secondary database. This is illustrated by the following diagram.

![Figure 6](./media/sql-database-designing-cloud-solutions-for-disaster-recovery/pattern3-2.png)

One the outage in the primary region is mitigated the traffic manager will detect the restoration of connectivity to the primary region and will switch the user traffic back to the application instance in the primary region. That application instance should operate in the read-write mode as it is connected to the primary database. 

The key **advantage** of this approach is that it avoids data loss if the outage is temporary. The recovery to the read-only is quick, does not require the database failover and the downtime depends on how quickly the traffic manager detects the connectivity failure, which is configurable. The main **tradeoff** is that the application must be able to operate in read-only mode. The recovery of the read-write operations requires the recovery of the primary region, which means the full data access may be disabled for hours or even days. In case of a permanent outage the database failover will be required similar to the pattern #2. 


## Summary

Your specific DR strategy can combine or extend these patterns to best fit the needs of your application.  To help guide your decision the table below compares the choices based on the estimated data loss or recovery point objective (RPO) and estimated recovery time (ERT).

| Pattern | RPO | ERT 
| --- |--- | --- 
| Active-passive deployment with co-located database configuration | < 5 sec | Failure detection time 
+ failover API call + application verification test 
| Active-active deployment with non co-located database configuration | < 5 sec | Failure detection time 
+ failover API call + SQL connection string change + application verification test
| Active-passive deployment with non co-located database configuration | read-only RPO < 5 sec 
read-write RPO = zero |  ERT (read-only) = connectivity failure detection time 
+ application verification test
ERT (read-write) = time to mitigate the outage 

Fundamentally the strategy you choose will be based on what SLA you want to offer to your customers and what aspect of the application design you want to optimize for. 


