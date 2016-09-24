<properties 
   pageTitle="Designing Cloud Solutions for Disaster Recovery Using SQL Database Geo-Replication | Microsoft Azure"
   description="Learn how to design your cloud solution for disaster recovery by choosing the right failover pattern."
   services="sql-database"
   documentationCenter="" 
   authors="anosov1960" 
   manager="jhubbard" 
   editor="monicar"/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA" 
   ms.date="07/16/2016"
   ms.author="sashan"/>

# Disaster recovery strategies for applications using SQL Database Elastic Pool 

Over the years we have learned that cloud services are not foolproof and catastrophic incidents can and will happen. SQL Database provides a number of capabilities to provide for the business continuity of your application when these incidents occur. [Elastic pools](sql-database-elastic-pool.md) and standalone databases support the same kind of disaster recovery capabilities. This article describes several DR strategies for elastic pools that leverage these SQL Database business continuity features.

For the purposes of this article we will use the canonical SaaS ISV application pattern:

<i>A modern cloud based web application provisions one SQL database for each end user. The ISV has a large number of customers and therefore uses many databases, known as tenant databases. Because the tenant databases typically have unpredictable activity patterns, the ISV uses an elastic pool to make the database cost very predictable over extended periods of time. The elastic pool also simplifies the performance management when the user activity spikes. In addition to the tenant databases the application also uses several databases to manage user profiles, security, collect usage patterns etc. Availability of the individual tenants does not impact the application’s availability as whole. However, the availability and performance of management databases is critical for the application’s function and if the management databases are offline the entire application is offline.</i>  

In the rest of the paper we will discuss the DR strategies covering a range of scenarios from the cost sensitive startup applications to the ones with stringent availability requirements.  

## Scenario 1. Cost sensitive startup

<i>I am a startup business and am extremely cost sensitive.  I want to simplify deployment and management of the application and I am willing to have a limited SLA for individual customers. But I want to ensure the application as a whole is never offline.</i>

To satisfy the simplicity requirement, you should deploy all tenant databases into one elastic pool in the Azure region of your choice and deploy the management database(s) as geo-replicated standalone database(s). For the disaster recovery of tenants, use geo-restore, which comes at no additional cost. To ensure the availability of the management databases, they should be geo-replicated to another region (step 1). The ongoing cost of the disaster recovery configuration in this scenario is equal to the total cost of the secondary database(s). This configuration is illustrated on the next diagram.

![Figure 1](./media/sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool/diagram-1.png)

In case of an outage in the primary region, the recovery steps to bring your application online are illustrated by the next diagram.

- Immediately failover the management databases (2) to the DR region. 
- Change the the application's connection string to point to the DR region. All new accounts and tenant databases will be created in the DR region. The existing customers will see their data temporarily unavailable.
- Create the elastic pool with the same configuration as the original pool (3). 
- Use geo-restore to create copies of the tenant databases (4). You can consider triggering the individual restores by the end-user connections or use some other application specific priority scheme.

At this point your application is back online in the DR region, but some customers will experience delay when accessing their data.

![Figure 2](./media/sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool/diagram-2.png)

If the outage was temporary, it is possible that the primary region will be recovered by Azure before all the restores are complete in the DR region. In this case, you should orchestrate moving the application back to the primary region. The process will take the steps illustrated on the next diagram.
 
- Cancel all outstanding geo-restore requests.   
- Failover the management database(s) to the primary region (5). Note: After the region’s recovery the old primaries have automatically become secondaries. Now they will switch roles again. 
- Change the the application's connection string to point back to the primary region. Now all new accounts and tenant databases will be created in the primary region. Some existing customers will see their data temporarily unavailable.   
- Set all databases in the DR pool to read-only to ensure they cannot be modified in the DR region (6). 
- For each database in the DR pool that has changed since the recovery, rename or delete the corresponding databases in the primary pool (7). 
- Copy the updated databases from the DR pool to the primary pool (8). 
- Delete the DR pool (9)

At this point your application will be online in the primary region with all tenant databases available in the primary pool.

![Figure 3](./media/sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool/diagram-3.png)

The key **benefit** of this strategy is low ongoing cost for data tier redundancy. Backups are taken automatically by the SQL Database service with no application rewrite and at no additional cost.  The cost is incurred only when the elastic databases are restored. The **trade-off** is that the complete recovery of all tenant databases will take significant time. It will depend on the total number of restores you will initiate in the DR region and overall size of the tenant databases. Even if you prioritize some tenants' restores over others, you will be competing with all the other restores that are initiated in the same region as the service will arbitrate and throttle to minimize the overall impact on the existing customers' databases. In addition, the recovery of the tenant databases cannot start until the new elastic pool in the DR region is created.

## Scenario 2. Mature application with tiered service 

<i>I am a mature SaaS application with tiered service offers and different SLAs for trial customers and for paying customers. For the trial customers, I have to reduce the cost as much as possible. Trial customers can take downtime but I want to reduce its likelihood. For the paying customers, any downtime is a flight risk. So I want to make sure that paying customers are always able to access their data.</i> 

To support this scenario, you should separate the trial tenants from paid tenants by putting them into separate elastic pools. The trial customers would have lower eDTU per tenant and lower SLA with a longer recovery time. The paying customers would be in a pool with higher eDTU per tenant and a higher SLA. To guarantee the lowest recovery time, the paying customers' tenant databases should be geo-replicated. This configuration is illustrated on the next diagram. 

![Figure 4](./media/sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool/diagram-4.png)

As in the first scenario, the management database(s) will be quite active so you use a standalone geo-replicated database for it (1). This will ensure the predictable performance for new customer subscriptions, profile updates and other management operations. The region in which the primaries of the management database(s) reside will be the primary region and the region in which the secondaries of the management database(s) reside will be the DR region.

The paying customers’ tenant databases will have active databases in the “paid” pool provisioned in the primary region. You should provision a secondary pool with the same name in the DR region. Each tenant would be geo-replicated to the secondary pool (2). This will enable a quick recovery of all tenant databases using failover. 

If an outage occurs in the primary region, the recovery steps to bring your application online are illustrated in the next diagram:

![Figure 5](./media/sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool/diagram-5.png)

- Immediately fail over the management database(s) to the DR region (3).
- Change the application’s connection string to point to the DR region. Now all new accounts and tenant databases will be created in the DR region. The existing trial customers will see their data temporarily unavailable.
- Failover the paid tenant's databases to the pool in the DR region to immediately restore their availability (4). Since the failover is a quick metadata level change you may consider an optimization where the individual failovers are triggered on demand by the end user connections. 
- If your secondary pool eDTU size was lower than the primary because the secondary databases only required the capacity to process the change logs while they were secondaries, you should immediately increase the pool capacity now to accommodate the full workload of all tenants (5). 
- Create the new elastic pool with the same name and the same configuration in the DR region for the trial customers' databases (6). 
- Once the trial customers’ pool is created, use geo-restore to restore the individual trial tenant databases into the new pool (7). You can consider triggering the individual restores by the end-user connections or use some other application specific priority scheme.

At this point your application is back online in the DR region. All paying customers have access to their data while the trial customers will experience delay when accessing their data.

When the primary region is recovered by Azure *after* you have restored the application in the DR region you can continue running the application in that region or you can decide to fail back to the primary region. If the primary region is recovered *before* the failover process is completed, you should consider failing back right away. The failback will take the steps illustrated in the next diagram: 
 
![Figure 6](./media/sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool/diagram-6.png)

- Cancel all outstanding geo-restore requests.   
- Failover the management database(s) (8). After the region’s recovery the old primary had automatically become the secondary. Now it becomes the primary again.  
- Failover the paid tenant databases (9). Similarly, after the region’s recovery the old primaries automatically become the secondaries. Now they will become the primaries again. 
- Set the restored trial databases that have changed in the DR region to read-only (10).
- For each database in the trial customers DR pool that changed since the recovery, rename or delete the corresponding database in the trial customers primary pool (11). 
- Copy the updated databases from the DR pool to the primary pool (12). 
- Delete the DR pool (13) 

> [AZURE.NOTE] The failover operation is asynchronous. To minimize the recovery time it is important that you execute the tenant databases' failover command in batches of at least 20 databases. 

The key **benefit** of this strategy is that it provides the highest SLA for the paying customers. It also guarantees that the new trials are unblocked as soon as the trial DR pool is created. The **trade-off** is that this setup will increase the total cost of the tenant databases by the cost of the secondary DR pool for paid customers. In addition, if the secondary pool has a different size, the paying customers will experience lower performance after failover until the pool upgrade in the DR region is completed. 

## Scenario 3. Geographically distributed application with tiered service

<i>I have a mature SaaS application with tiered service offers. I want to offer a very aggressive SLA to my paid customers and minimize the risk of impact when outages occur because even brief interruption can cause customer dissatisfaction. It is critical that the paying customers can always access their data. The trials are free and an SLA is not offered during the trial period. </i> 

To support this scenario, you should have three separate elastic pools. Two equal size pools with high eDTUs per database should be provisioned in two different regions to contain the paid customers' tenant databases. The third pool containing the trial tenants would have a lower eDTUs per database and be provisioned in one of the two region.

To guarantee the lowest recovery time during outages the paying customers' tenant databases should be geo-replicated with 50% of the primary databases in each of the two regions. Similarly, each region would have 50% of the secondary databases. This way if a region is offline only 50% of the paid customers' databases would be impacted and would have to failover. The other databases would remain intact. This configuration is illustrated in the following diagram:

![Figure 4](./media/sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool/diagram-7.png)

As in the previous scenarios, the management database(s) will be quite active so you should configure them as standalone geo-replicated database(s) (1). This will ensure the predictable performance of the new customer subscriptions, profile updates and other management operations. Region A would be the primary region for the management database(s) and the region B will be used for recovery of the management database(s).

The paying customers’ tenant databases will be also geo-replicated but with primaries and secondaries split between region A and region B (2). This way the tenant primary databases impacted by the outage can failover to the other region and become available. The other half of the tenant databases will not be impacted at all. 

The next diagram illustrates the recovery steps to take if  an outage occurs in region A.

![Figure 5](./media/sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool/diagram-8.png)

- Immediately fail over the management databases to region B (3).
- Change the application’s connection string to point to the management database(s) in region B. Modify the management database(s) to make sure the new accounts and tenant databases will be created in region B and the existing tenant databases will be found there as well. The existing trial customers will see their data temporarily unavailable.
- Failover the paid tenant's databases to pool 2 in region B to immediately restore their availability (4). Since the failover is a quick metadata level change you may consider an optimization where the individual failovers are triggered on demand by the end user connections. 
- Since now pool 2 contains only primary  databases the total workload in the pool will increase so you should immediately increase its eDTU size (5). 
- Create the new elastic pool with the same name and the same configuration in the region B for the trial customers' databases (6). 
- Once the pool is created use geo-restore to restore the individual trial tenant database into the pool (7). You can consider triggering the individual restores by the end-user connections or use some other application specific priority scheme.


> [AZURE.NOTE] The failover operation is asynchronous. To minimize the recovery time it is important that you execute the tenant databases' failover command in batches of at least 20 databases. 

At this point your application is back online in region B. All paying customers have access to their data while the trial customers will experience delay when accessing their data.

When region A is recovered you need to decide if you want to use region B for trial customers or failback to using the trial customers pool in region A. One criteria could be the % of trial tenant databases modified since the recovery. Regardless of that decision you will need to re-balance the paid tenants between two pools. the next diagram illustrates the process when the trial tenant databases fail back to region A.  
 
![Figure 6](./media/sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool/diagram-9.png)

- Cancel all outstanding geo-restore requests to trial DR pool.   
- Failover the management database (8). After the region’s recovery, the old primary had automatically became the secondary. Now it becomes the primary again.  
- Select which paid tenant databases will fail back to pool 1 and initiate failover to their secondaries (9). After the region’s recovery all databases in pool 1 automatically became secondaries. Now 50% of them will become primaries again. 
- Reduce the size of pool 2 to the original eDTU (10).
- Set all restored trial databases in the region B to read-only (11).
- For each database in the trial DR pool that has changed since the recovery rename or delete the corresponding database in the trial primary pool (12). 
- Copy the updated databases from the DR pool to the primary pool (13). 
- Delete the DR pool (14) 

The key **benefits** of this strategy are:

- It supports the most aggressive SLA for the paying customers because it ensures that an outage cannot impact more than 50% of the tenant databases. 
- It guarantees that the new trials are unblocked as soon as the trail DR pool is created during the recovery. 
- It allows more efficient use of the pool capacity as 50% of secondary databases in pool 1 and pool 2 are guaranteed to be less active then the primary databases.

The main **trade-offs** are:

- The CRUD operations against the management database(s) will have lower latency for the end users connected to region A than for the end users connected to region B as they will be executed against the primary of the management database(s).
- It requires more complex design of the management database. For example, each tenant record would have to have a location tag that needs to be changed during failover and failback.  
- The paying customers may experience lower performance than usual until the pool upgrade in region B is completed. 

## Summary

This article focuses on the disaster recovery strategies for the database tier used by a SaaS ISV multi-tenant application. The strategy you choose should be based on the needs of the application, such as the business model, the SLA you want to offer to your customers, budget constraint etc.. Each described strategy outlines the benefits and trade-off so you could make an informed decision. Also, your specific application will likely include other Azure components. So you should review their business continuity guidance and orchestrate the recovery of the database tier with them. To learn more about managing recovery of database applications in Azure, refer to [Designing cloud solutions for disaster recovery](./sql-database-designing-cloud-solutions-for-disaster-recovery.md) .  


## Next steps

- To learn about Azure SQL Database automated backups, see [SQL Database automated backups](sql-database-automated-backups.md)
- For a business continuity overview and scenarios, see [Business continuity overview](sql-database-business-continuity.md)
- To learn about using automated backups for recovery, see [restore a database from the service-initiated backups](sql-database-recovery-using-backups.md)
- To learn about faster recovery options, see [Active-Geo-Replication](sql-database-geo-replication-overview.md)  
- To learn about using automated backups for archiving, see [database copy](sql-database-copy.md)
