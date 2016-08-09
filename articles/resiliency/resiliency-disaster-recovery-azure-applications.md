<properties
   pageTitle="Disaster recovery for Azure applications | Microsoft Azure"
   description="Technical overview and in-depth information about designing applications for disaster recovery on Microsoft Azure."
   services=""
   documentationCenter="na"
   authors="adamglick"
   manager="hongfeig"
   editor=""/>

<tags
   ms.service="resiliency"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/01/2016"
   ms.author="aglick"/>

#Disaster recovery for applications built on Microsoft Azure

Whereas high availability is about temporary failure management, disaster recovery (DR) is about the catastrophic loss of application functionality. For example, consider the scenario where a region goes down. In this case, you need to have a plan to run your application or access your data outside the Azure region. Execution of this plan involves people, processes, and supporting applications that allow the system to function. The business and technology owners who define the system's operational mode for a disaster also determine the level of functionality for the service during a disaster. The level of functionality can take a few forms: completely unavailable, partially available (degraded functionality or delayed processing), or fully available.

##Azure disaster recovery features

As with availability considerations, Azure has [resiliency technical guidance](./resiliency-technical-guidance.md) that's designed to support disaster recovery. There is also a relationship between some of the availability features of Azure and disaster recovery. For example, the management of roles across fault domains increases the availability of an application. Without that management, an unhandled hardware failure would become a “disaster” scenario. So the correct application of availability features and strategies is an important part of disaster-proofing your application. However, this article goes beyond general availability issues to more serious (and rarer) disaster events.

##Multiple datacenter regions

Azure maintains datacenters in many regions around the world. This infrastructure supports several disaster recovery scenarios, such as the system-provided geo-replication of Azure Storage to secondary regions. It also means that you can easily and inexpensively deploy a cloud service to multiple locations around the world. Compare this with the cost and difficulty of running your own datacenters in multiple regions. Deploying data and services to multiple regions helps protect your application from major outages in a single region.

##Azure Traffic Manager

When a region-specific failure occurs, you must redirect traffic to services or deployments in another region. You can do this routing manually, but it's more efficient to use an automated process. Azure Traffic Manager is designed for this task. You can use it to automatically manage the failover of user traffic to another region in case the primary region fails. Because traffic management is an important part of the overall strategy, it's important to understand the basics of Traffic Manager.

In the following diagram, users connect to a URL that's specified for Traffic Manager (__http://myATMURL.trafficmanager.net__) and that abstracts the actual site URLs (__http://app1URL.cloudapp.net__ and __http://app2URL.cloudapp.net__). Based on how you configure the criteria for when to route users, users will be sent to the correct actual site when the policy dictates. The policy options are round-robin, performance, or failover. For the sake of this article, we will be concerned with only the failover option.

![Routing via Azure Traffic Manager](./media/resiliency-disaster-recovery-azure-applications/routing-using-azure-traffic-manager.png)

When you're configuring Traffic Manager, you provide a new Traffic Manager DNS prefix. This is the URL prefix that you'll provide to your users to access your service. Traffic Manager now abstracts load balancing one level up and not at the region level. The Traffic Manager DNS maps to a CNAME for all the deployments that it manages.

Within Traffic Manager, you specify the priority of the deployments that users will be routed to when failure occurs. Traffic Manager monitors the endpoints of the deployments and notes when the primary deployment fails. At failure, Traffic Manager analyzes the prioritized list of deployments and routes users to the next one on the list.

Although Traffic Manager decides where to go in a failover, you can decide whether your failover domain is dormant or active while you're not in failover mode. That functionality has nothing to do with Azure Traffic Manager. Traffic Manager detects a failure in the primary site and rolls over to the failover site. Traffic Manager rolls over regardless of whether that site is currently serving users or not.

For more information on how Azure Traffic Manager works, refer to:

 * [Traffic Manager overview](../traffic-manager/traffic-manager-overview.md)
 * [Configure failover routing method](../traffic-manager/traffic-manager-configure-failover-routing-method.md)

##Azure disaster scenarios

The following sections cover several different types of disaster scenarios. Region-wide service disruptions are not the only cause of application-wide failures. Poor design or administration errors can also lead to outages. It's important to consider the possible causes of a failure during both the design and testing phases of your recovery plan. A good plan takes advantage of Azure features and augments them with application-specific strategies. The chosen response is dictated by the importance of the application, the recovery point objective (RPO), and the recovery time objective (RTO).

###Application failure

Azure Traffic Manager automatically handles failures that result from the underlying hardware or operating system software in the host virtual machine. Azure creates a new instance of the role on a functioning server and adds it to the load-balancer rotation. If the number of role instances is greater than one, Azure shifts processing to the other running role instances while replacing the failed node.

There are serious application errors that happen independently of any hardware or operating system failures. The application might fail due to the catastrophic exceptions caused by bad logic or data integrity issues. You must incorporate enough telemetry into the code so that a monitoring system can detect failure conditions and notify an application administrator. An administrator who has full knowledge of the disaster recovery processes can make a decision to invoke a failover process. Alternatively, an administrator can simply accept an availability outage to resolve the critical errors.

###Data corruption

Azure automatically stores your Azure SQL Database and Azure Storage data three times redundantly within different fault domains in the same region. If you use geo-replication, the data is stored three additional times in a different region. However, if your users or your application corrupts that data in the primary copy, the data quickly replicates to the other copies. Unfortunately, this results in three copies of corrupt data.

To manage potential corruption of your data, you have two options. First, you can manage a custom backup strategy. You can store your backups in Azure or on-premises, depending on your business requirements or governance regulations. Another option is to use the new point-in-time restore option for recovering a SQL database. For more information, see the section on [data strategies for disaster recovery](#data-strategies-for-disaster-recovery).

###Network outage

When parts of the Azure network are inaccessible, you might not be able to get to your application or data. If one or more role instances are unavailable due to network issues, Azure uses the remaining available instances of your application. If your application can’t access its data because of an Azure network outage, you can potentially run in degraded mode locally by using cached data. You need to architect the disaster recovery strategy for running in degraded mode in your application. For some applications, this might not be practical.

Another option is to store data in an alternate location until connectivity is restored. If degraded mode is not an option, the remaining options are application downtime or failover to an alternate region. The design of an application running in degraded mode is as much a business decision as a technical one. This is discussed further in the section on [degraded application functionality](#degraded-application-functionality).

###Failure of a dependent service

Azure provides many services that can experience periodic downtime. Consider [Azure Redis Cache](https://azure.microsoft.com/services/cache/) as an example. This multitenant service provides caching capabilities to your application. It's important to consider what happens in your application if the dependent service is unavailable. In many ways, this scenario is similar to the network outage scenario. However, considering each service independently results in potential improvements to your overall plan.

Azure Redis Cache provides caching to your application from within your cloud service deployment, which provides disaster recovery benefits. First, the service now runs on roles that are local to your deployment. Therefore, you're better able to monitor and manage the status of the cache as part of your overall management processes for the cloud service. This type of caching also exposes new features. One of the new features is high availability for cached data. This helps to preserve cached data if a single node fails by maintaining duplicate copies on other nodes.

Note that high availability decreases throughput and increases latency because of the updating of the secondary copy on writes. It also doubles the amount of memory that's used for each item, so plan for that. This specific example demonstrates that each dependent service might have capabilities that improve your overall availability and resistance to catastrophic failures.

With each dependent service, you should understand the implications of a service disruption. In the caching example, it might be possible to access the data directly from a database until you restore your cache. This would be a degraded mode in terms of performance but would provide full functionality with regard to data.

###Region-wide service disruption

The previous failures have primarily been failures that can be managed within the same Azure region. However, you must also prepare for the possibility that there is a service disruption of the entire region. If a region-wide service disruption occurs, the locally redundant copies of your data are not available. If you have enabled geo-replication, there are three additional copies of your blobs and tables in a different region. If Microsoft declares the region lost, Azure remaps all of the DNS entries to the geo-replicated region.

>[AZURE.NOTE] Be aware that you don't have any control over this process, and it will occur only for region-wide service disruption. Because of this, you must rely on other application-specific backup strategies to achieve the highest level of availability. For more information, see the section on [data strategies for disaster recovery](#data-strategies-for-disaster-recovery).

###Azure-wide service disruption

In disaster planning, you must consider the entire range of possible disasters. One of the most severe service disruptions would involve all Azure regions simultaneously. As with other service disruptions, you might decide that you'll take the risk of temporary downtime in that event. Widespread service disruptions that span regions should be much rarer than isolated service disruptions that involve dependent services or single regions.

However, for some mission-critical applications, you might decide that there must be a backup plan for this scenario as well. The plan for this event might include failing over to services in an [alternative cloud](#alternative-cloud) or a [hybrid on-premises and cloud solution](#hybrid-on-premises-and-cloud-solution).

###Degraded application functionality

A well-designed application typically uses a collection of modules that communicate with each other though the implementation of loosely coupled information-interchange patterns. A DR-friendly application requires separation of tasks at the module level. This is to prevent the disruption of a dependent service from bringing down the entire application. For example, consider a web commerce application for Company Y. The following modules might constitute the application:

 * __Product Catalog__ allows users to browse products.
 * __Shopping Cart__ allows users to add/remove products in their shopping cart.
 * __Order Status__ shows the shipping status of user orders.
 * __Order Submission__ finalizes the shopping session by submitting the order with payment.
 * __Order Processing__ validates the order for data integrity and performs a quantity availability check.

When a dependent of a module in this application goes down, how does the module function until that part recovers? A well-architected system implements isolation boundaries through separation of tasks both at design time and at runtime. You can categorize every failure as recoverable and non-recoverable. Non-recoverable errors will take down the module, but you can mitigate a recoverable error through alternatives. As discussed in the high-availability section, you can hide some problems from users by handling faults and taking alternate actions. During a more serious service disruption, the application might be completely unavailable. However, a third option is to continue servicing users in degraded mode.

For instance, if the database for hosting orders goes down, the Order Processing module loses its ability to process sales transactions. Depending on the architecture, it might be hard or impossible for the Order Submission and Order Processing parts of the application to continue. If the application is not designed to handle this scenario, the entire application might go offline.

However, in this same scenario, it's possible that the product data is stored in a different location. In that case, the Product Catalog module can still be used for viewing products. In degraded mode, the application continues to be available to users for available functionality like viewing the product catalog. Other parts of the application, however, are unavailable, such as ordering or inventory queries.

Another variation of degraded mode centers on performance rather than capabilities. For example, consider a scenario where the product catalog is being cached through Azure Redis Cache. If caching becomes unavailable, the application might go directly to the server storage to retrieve product catalog information. But this access might be slower than the cached version. Because of this, the application performance is degraded until the caching service is fully restored.

Deciding how much of an application will continue to function in degraded mode is both a business decision and a technical decision. The application must also decide how to inform the users of the temporary problems. In this example, the application might allow viewing products and even adding them to a shopping cart. However, when the user attempts to make a purchase, the application notifies the user that the sales module is temporarily inaccessible. It isn't ideal for the customer, but it does prevent an application-wide service disruption.

##Data strategies for disaster recovery

Handling data correctly is the hardest area to get right in any disaster recovery plan. Restoring data is also the part of the recovery process that typically takes the most time. Different choices in degradation modes result in difficult challenges for data recovery from failure and consistency after failure.

One of the factors is the need to restore or maintain a copy of the application’s data. You will use this data for reference and transactional purposes at a secondary site. An on-premises setting requires an expensive and lengthy planning process to implement a multiple-region disaster recovery strategy. Conveniently, most cloud providers, including Azure, readily allow the deployment of applications to multiple regions. These regions are geographically distributed in such a way that multiple-region service disruption should be extremely rare. The strategy for handling data across regions is one of the contributing factors for the success of any disaster recovery plan.

The following sections discuss disaster recovery techniques related to data backups, reference data, and transactional data.

###Backup and restore

Regular backups of application data can support some disaster recovery scenarios. Different storage resources require different techniques.

For the Basic, Standard, and Premium SQL Database tiers, you can take advantage of point-in-time restore to recover your database. For more information, see [Overview: Cloud business continuity and database disaster recovery with SQL Database](../sql-database/sql-database-business-continuity.md). Another option is to use Active Geo-Replication for SQL Database. This automatically replicates database changes to secondary databases in the same Azure region or even in a different Azure region. This provides a potential alternative to some of the more manual data synchronization techniques presented in this article. For more information, see [Overview: SQL Database Active Geo-Replication](../sql-database/sql-database-geo-replication-overview.md).

You can also use a more manual approach for backup and restore. Use the DATABASE COPY command to create a copy of the database. You must use this command to get a backup with transactional consistency. You can also use the import/export service of Azure SQL Database. This supports exporting databases to BACPAC files that are stored in Azure Blob storage.

The built-in redundancy of Azure Storage creates two replicas of the backup file in the same region. However, the frequency of running the backup process determines your RPO, which is the amount of data you might lose in disaster scenarios. For example, imagine that you perform a backup at the top of the hour, and a disaster occurs two minutes before the top of the hour. You lose 58 minutes of data that happened after the last backup was performed. Also, to protect against a region-wide service disruption, you should copy the BACPAC files to an alternate region. You then have the option of restoring those backups in the alternate region. For more details, see [Overview: Cloud business continuity and database disaster recovery with SQL Database](../sql-database/sql-database-business-continuity.md).

For Azure Storage, you can develop your own custom backup process or use one of many third-party backup tools. Note that most application designs have additional complexities where storage resources reference each other. For example, consider a SQL database that has a column that links to a blob in Azure Storage. If the backups do not happen simultaneously, the database might have the pointer to a blob that was not backed up before the failure. The application or disaster recovery plan must implement processes to handle this inconsistency after a recovery.

###Reference data pattern for disaster recovery

Reference data is read-only data that supports application functionality. It typically does not change frequently. Although backup and restore is one method to handle region-wide service disruptions, the RTO is relatively long. When you deploy the application to a secondary region, some strategies can improve the RTO for reference data.

Because reference data changes infrequently, you can improve the RTO by maintaining a permanent copy of the reference data in the secondary region. This eliminates the time required to restore backups in the event of a disaster. To meet the multiple-region disaster recovery requirements, you must deploy the application and the reference data together in multiple regions. As mentioned in [Reference data pattern for high availability](./resiliency-high-availability-azure-applications.md#reference-data-pattern-for-high-availability), you can deploy reference data to the role itself, to external storage, or to a combination of both.

The reference data deployment model within compute nodes implicitly satisfies the disaster recovery requirements. Reference data deployment to SQL Database requires that you deploy a copy of the reference data to each region. The same strategy applies to Azure Storage. You must deploy a copy of any reference data that's stored in Azure Storage to the primary and secondary regions.

![Reference data publication to both primary and secondary regions](./media/resiliency-disaster-recovery-azure-applications/reference-data-publication-to-both-primary-and-secondary-regions.png)

You must implement your own application-specific backup routines for all data, including reference data. Geo-replicated copies across regions are used only in a region-wide service disruption. To prevent extended downtime, deploy the mission-critical parts of the application’s data to the secondary region. For an example of this topology, see the [active-passive model](#active-passive).

###Transactional data pattern for disaster recovery

Implementation of a fully functional disaster mode strategy requires asynchronous replication of the transactional data to the secondary region. The practical time windows within which the replication can occur will determine the RPO characteristics of the application. You might still recover the data that was lost from the primary region during the replication window. You might also be able to merge with the secondary region later.

The following architecture examples provide some ideas on different ways of handling transactional data in a failover scenario. It's important to note that these examples are not exhaustive. For example, intermediate storage locations such as queues might be replaced with Azure SQL Database. The queues themselves might be either Azure Storage or Azure Service Bus queues (see [Azure queues and Service Bus queues--compared and contrasted](../service-bus/service-bus-azure-and-service-bus-queues-compared-contrasted.md)). Server storage destinations might also vary, such as Azure tables instead of SQL Database. In addition, worker roles might be inserted as intermediaries in various steps. The important thing is not to emulate these architectures exactly, but to consider various alternatives in the recovery of transactional data and related modules.

####Replication of transactional data in preparation for disaster recovery

Consider an application that uses Azure Storage queues to hold transactional data. This allows worker roles to process the transactional data to the server database in a decoupled architecture. This requires the transactions to use some form of temporary caching if the front-end roles require the immediate query of that data. Depending on the level of data-loss tolerance, you might choose to replicate the queues, the database, or all of the storage resources. With only database replication, if the primary region goes down, you can still recover the data in the queues when the primary region comes back.

The following diagram shows an architecture where the server database is synchronized across regions.

![Replication of transactional data in preparation for disaster recovery](./media/resiliency-disaster-recovery-azure-applications/replicate-transactional-data-in-preparation-for-disaster-recovery.png)

The biggest challenge to implementing this architecture is the replication strategy between regions. The Azure SQL Data Sync service enables this type of replication. However, the service is still in preview and is not recommended for production environments. For more information, see [Overview: Cloud business continuity and database disaster recovery with SQL Database](../sql-database/sql-database-business-continuity.md). For production applications, you must invest in a third-party solution or create your own replication logic in code. Depending on the architecture, the replication might be bidirectional, which is also more complex.

One potential implementation might make use of the intermediate queue in the previous example. The worker role that processes the data to the final storage destination might make the change in both the primary region and the secondary region. These are not trivial tasks, and complete guidance for replication code is beyond the scope of this article. The important point is that a lot of your time and testing should focus on how you replicate your data to the secondary region. Additional processing and testing can help ensure that the failover and recovery processes correctly handle any possible data inconsistencies or duplicate transactions.

>[AZURE.NOTE] Most of this paper focuses on platform as a service (PaaS). However, additional replication and availability options for hybrid applications use Azure Virtual Machines. These hybrid applications use infrastructure as a service (IaaS) to host SQL Server on virtual machines in Azure. This allows traditional availability approaches in SQL Server, such as AlwaysOn Availability Groups or Log Shipping. Some techniques, such as AlwaysOn, work only between on-premises SQL Server instances and Azure virtual machines. For more information, see [High availability and disaster recovery for SQL Server in Azure Virtual Machines](../virtual-machines/virtual-machines-windows-sql-high-availability-dr.md).

####Degraded application mode for transaction capture

Consider a second architecture that operates in degraded mode. The application on the secondary region deactivates all the functionality, such as reporting, business intelligence (BI), or draining queues. It accepts only the most important types of transactional workflows, as defined by business requirements. The system captures the transactions and writes them to queues. The system might postpone processing the data during the initial stage of the service disruption. If the system on the primary region is reactivated within the expected time window, the worker roles in the primary region can drain the queues. This process eliminates the need for database merging. If the primary region service disruption goes beyond the tolerable window, the application can start processing the queues.

In this scenario, the database on the secondary contains incremental transactional data that must be merged after the primary is reactivated. The following diagram shows this strategy for temporarily storing transactional data until the primary region is restored.

![Degraded application mode for transaction capture](./media/resiliency-disaster-recovery-azure-applications/degraded-application-mode-for-transaction-capture.png)

For more discussion of data management techniques for resilient Azure applications, see [Failsafe: Guidance for Resilient Cloud Architectures](https://channel9.msdn.com/Series/FailSafe).

##Deployment topologies for disaster recovery

You must prepare mission-critical applications for the possibility of a region-wide service disruption. You do this by incorporating a multiple-region deployment strategy into the operational planning.

Multiple-region deployments might involve IT-pro processes to publish the application and reference data to the secondary region after a disaster. If the application requires instant failover, the deployment process might involve an active/passive setup or an active/active setup. This type of deployment has existing instances of the application running in the alternate region. A routing tool such as Azure Traffic Manager provides load-balancing services at the DNS level. It can detect service disruptions and route the users to different regions when needed.

Part of a successful Azure disaster recovery is architecting that recovery into the solution from the start. The cloud provides additional options for recovering from failures during a disaster that are not available in a traditional hosting provider. Specifically, you can dynamically and quickly allocate resources to a different region. Therefore, you won’t pay a lot for idle resources while you're waiting for a failure to occur.

The following sections cover different deployment topologies for disaster recovery. Typically, there's a tradeoff in increased cost or complexity for additional availability.

###Single-region deployment

A single-region deployment is not really a disaster recovery topology, but is meant to contrast with the other architectures. Single-region deployments are common for applications in Azure. However, this type of deployment is not a serious contender for a disaster recovery plan.

The following diagram depicts an application running in a single Azure region. Azure Traffic Manager and the use of fault and upgrade domains increase availability of the application within the region.

![Single-region deployment](./media/resiliency-disaster-recovery-azure-applications/single-region-deployment.png)

Here, it's apparent that the database is a single point of failure. Even though Azure replicates the data across different fault domains to internal replicas, this all occurs in the same region. The application cannot withstand a catastrophic failure. If the region goes down, all of the fault domains go down--including all service instances and storage resources.

For all but the least critical applications, you must devise a plan to deploy your applications across multiple regions. You should also consider RTO and cost constraints in considering which deployment topology to use.

Let’s take a look now at specific patterns to support failover across different regions. These examples all use two regions to describe the process.

###Redeployment to a secondary Azure region

In the pattern of redeployment to a secondary region, only the primary region has applications and databases running. The secondary region is not set up for an automatic failover. So when a disaster occurs, you must spin up all the parts of the service in the new region. This includes uploading a cloud service to Azure, deploying the cloud service, restoring the data, and changing DNS to reroute the traffic.

Although this is the most affordable of the multiple-region options, it has the worst RTO characteristics. In this model, the service package and database backups are stored either on-premises or in the Azure Blob storage instance of the secondary region. However, you must deploy a new service and restore the data before it resumes operation. Even if you fully automate the data transfer from backup storage, spinning up the new database environment consumes a lot of time. Moving data from the backup disk storage to the empty database on the secondary region is the most expensive part of the restore process. You must do this, however, to bring the new database to an operational state because it isn't replicated.

The best approach is to store the service packages in Blob storage in the secondary region. This eliminates the need to upload the package to Azure, which is what happens when you deploy from an on-premises development machine. You can quickly deploy the service packages to a new cloud service from Blob storage by using PowerShell scripts.

This option is practical only for non-critical applications that can tolerate a high RTO. For instance, this might work for an application that can be down for several hours but should be running again within 24 hours.

![Redeployment to a secondary Azure region](./media/resiliency-disaster-recovery-azure-applications/redeploy-to-a-secondary-azure-region.png)

###Active-passive

The active-passive pattern is the choice that many companies favor. This pattern provides improvements to the RTO with a relatively small increase in cost over the redeployment pattern.
In this scenario, there is again a primary and a secondary Azure region. All of the traffic goes to the active deployment on the primary region. The secondary region is better prepared for disaster recovery because the database is running on both regions. Additionally, a synchronization mechanism is in place between them. This standby approach can involve two variations: a database-only approach or a complete deployment in the secondary region.

####Database only

In the first variation of the active-passive pattern, only the primary region has a deployed cloud service application. However, unlike the redeployment pattern, both regions are synchronized with the contents of the database. (For more information, see the section on [transactional data pattern for disaster recovery](#transactional-data-pattern-for-disaster-recovery).) When a disaster occurs, there are fewer activation requirements. You start the application in the secondary region, change connection strings to the new database, and change the DNS entries to reroute traffic.

Like the redeployment pattern, you should have already stored the service packages in Azure Blob storage in the secondary region for faster deployment. Unlike the redeployment pattern, you don’t incur the majority of the overhead that database restore operation requires. The database is ready and running. This saves a significant amount of time, making this an affordable DR pattern. It's also the most popular DR pattern.

![Active-passive, database only](./media/resiliency-disaster-recovery-azure-applications/active-passive-database-only.png)

####Full replica

In the second variation of the active-passive pattern, both the primary region and the secondary region have a full deployment. This deployment includes the cloud services and a synchronized database. However, only the primary region is actively handling network requests from the users. The secondary region becomes active only when the primary region experiences a service disruption. In that case, all new network requests route to the secondary region. Azure Traffic Manager can manage this failover automatically.

Failover occurs faster than the database-only variation because the services are already deployed. This pattern provides a very low RTO. The secondary failover region must be ready to go immediately after failure of the primary region.

Along with a quicker response time, this pattern has the advantage of pre-allocating and deploying backup services. You don’t have to worry about a region not having the space to allocate new instances in a disaster. This is important if your secondary Azure region is nearing capacity. There is no guarantee (service-level agreement) that you will instantly be able to deploy a number of new cloud services in any region.

For the fastest response time with this model, you must have similar scale (number of role instances) in the primary and secondary regions. Despite the advantages, paying for unused compute instances is costly, and this might not be the most prudent financial choice. Because of this, it's more common to use a slightly scaled-down version of cloud services on the secondary region. Then you can quickly fail over and scale out the secondary deployment if necessary. You should automate the failover process so that after the primary region is inaccessible, you activate additional instances, depending on the load. This might involve the use of an autoscaling mechanism like [virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md).

The following diagram shows the model where the primary and secondary regions contain a fully deployed cloud service in an active-passive pattern.

![Active-passive, full replica](./media/resiliency-disaster-recovery-azure-applications/active-passive-full-replica.png)

###Active-active

By now, you’re probably figuring out the evolution of the patterns: decreasing the RTO increases costs and complexity. The active-active solution actually breaks this tendency with regard to cost.

In an active-active pattern, the cloud services and database are fully deployed in both regions. Unlike the active-passive model, both regions receive user traffic. This option yields the quickest recovery time. The services are already scaled to handle a portion of the load at each region. DNS is already enabled to use the secondary region. There's additional complexity in determining how to route users to the appropriate region. Round-robin scheduling might be possible. It's more likely that certain users would use a specific region where the primary copy of their data resides.

In case of failover, simply disable DNS to the primary region. This routes all traffic to the secondary region.

Even in this model, there are some variations. For example, the following diagram shows a model where the primary region owns the master copy of the database. The cloud services in both regions write to that primary database. The secondary deployment can read from the primary or replicated database. Replication in this example happens one way.

![Active-active](./media/resiliency-disaster-recovery-azure-applications/active-active.png)

There is a downside to the active-active architecture in the preceding diagram. The second region must access the database in the first region because the master copy resides there. Performance significantly drops off when you access data from outside a region. In cross-region database calls, you should consider some type of batching strategy to improve the performance of these calls. For more information, see [How to use batching to improve SQL Database application performance](../sql-database/sql-database-use-batching-to-improve-performance.md).

An alternative architecture might involve each region accessing its own database directly. In that model, some type of bidirectional replication is required to synchronize the databases in each region.

In the active-active pattern, you might not need as many instances on the primary region as you would in the active-passive pattern. If you have 10 instances on the primary region in an active-passive architecture, you might need only 5 in each region in an active-active architecture. Both regions now share the load. This might be a cost savings over the active-passive pattern if you keep a warm standby on the passive region with 10 instances waiting for failover.

Realize that until you restore the primary region, the secondary region might receive a sudden surge of new users. If there are 10,000 users on each server when the primary region experiences a service disruption, the secondary region suddenly has to handle 20,000 users. Monitoring rules on the secondary region must detect this increase and double the instances in the secondary region. For more information on this, see the section on [failure detection](#failure-detection).

##Hybrid on-premises and cloud solution

One additional strategy for disaster recovery is to architect a hybrid application that runs on-premises and in the cloud. Depending on the application, the primary region might be either location. Consider the previous architectures and imagine the primary or secondary region as an on-premises location.

There are some challenges in these hybrid architectures. First, most of this article has addressed PaaS architecture patterns. Typical PaaS applications in Azure rely on Azure-specific constructs such as roles, cloud services, and Traffic Manager. To create an on-premises solution for this type of PaaS application would require a significantly different architecture. This might not be feasible from a management or cost perspective.

However, a hybrid solution for disaster recovery has fewer challenges for traditional architectures that have simply moved to the cloud. This is true of architectures that use IaaS. IaaS applications use virtual machines in the cloud that can have direct on-premises equivalents. You can also use virtual networks to connect machines in the cloud with on-premises network resources. This opens up several possibilities that are not possible with PaaS-only applications. For example, SQL Server can take advantage of disaster recovery solutions such as AlwaysOn Availability Groups and database mirroring. For details, see [High availability and disaster recovery for SQL Server in Azure virtual machines](../virtual-machines/virtual-machines-windows-sql-high-availability-dr.md).

IaaS solutions also provide an easier path for on-premises applications to use Azure as the failover option. You might have a fully functioning application in an existing on-premises region. However, what if you lack the resources to maintain a geographically separate region for failover? You might decide to use virtual machines and virtual networks to get your application running in Azure. In that case, define processes that synchronize data to the cloud. The Azure deployment then becomes the secondary region to use for failover. The primary region remains the on-premises application. For more information about IaaS architectures and capabilities, see the [Virtual Machines documentation](https://azure.microsoft.com/documentation/services/virtual-machines/).

##Alternative cloud

There are situations where even the robustness of the Microsoft Cloud might not meet internal compliance rules or policies that your organization requires. Even the best preparation and design to implement backup systems during a disaster fall short if there's a global service disruption of a cloud service provider.

You’ll want to compare availability requirements with the cost and complexity of increased availability. Perform a risk analysis, and define the RTO and RPO for your solution. If your application cannot tolerate any downtime, it might make sense for you to consider using another cloud solution. Unless the entire Internet goes down, another cloud solution might still be available if Azure becomes globally inaccessible.

As with the hybrid scenario, the failover deployments in the previous disaster recovery architectures can also exist within another cloud solution. Alternative cloud DR sites should be used only for solutions whose RTO allows very little, if any, downtime. Note that a solution that uses a DR site outside Azure will require more work to configure, develop, deploy, and maintain. It's also more difficult to implement best practices in a cross-cloud architecture. Although cloud platforms have similar high-level concepts, the APIs and architectures are different.

If you decide to split your DR among different platforms, it would make sense to architect abstraction layers in the design of the solution. If you do this, you won’t need to develop and maintain two different versions of the same application for different cloud platforms in case of disaster. As with the hybrid scenario, the use of Azure Virtual Machines or Azure Container Service might be easier in these cases than the use of cloud-specific PaaS designs.

##Automation

Some of the patterns that we just discussed require quick activation of offline deployments as well as restoration of specific parts of a system. Automation, or scripting, supports the ability to activate resources on demand and deploy solutions rapidly. In this article, DR-related automation is equated with [Azure PowerShell](https://msdn.microsoft.com/library/azure/jj156055.aspx), but the [Service Management REST API](https://msdn.microsoft.com/library/azure/ee460799.aspx) is also an option.

Developing scripts helps to manage the parts of DR that Azure does not transparently handle. This has the benefit of producing consistent results each time, which minimizes the chance of human error. Having predefined DR scripts also reduces the time to rebuild a system and its constituent parts in the midst of a disaster. You don’t want to try to manually figure out how to restore your site while it's down and losing money every minute.

After you create the scripts, test them repeatedly from start to finish. After you verify their basic functionality, make sure that you test them in [disaster simulation](#disaster-simulation). This helps uncover flaws in the scripts or processes.

A best practice with automation is to create a repository of PowerShell scripts or command-line interface (CLI) scripts for Azure disaster recovery. Clearly mark and categorize them for easy lookup. Designate one person to manage the repository and versioning of the scripts. Document them well with explanations of parameters and examples of script use. Also ensure that you keep this documentation in sync with your Azure deployments. This underscores the purpose of having one person in charge of all parts of the repository.

##Failure detection

To correctly handle problems with availability and disaster recovery, you must be able to detect and diagnose failures. You should do advanced server and deployment monitoring so you can quickly know when a system or its parts are suddenly down. Monitoring tools that look at the overall health of the cloud service and its dependencies can perform part of this work. One Microsoft tool is [System Center 2016](https://www.microsoft.com/en-us/server-cloud/products/system-center-2016/). Third-party tools can also provide monitoring capabilities. Most monitoring solutions track key performance counters and service availability.

Although these tools are vital, they do not replace the need to plan for fault detection and reporting within a cloud service. You must plan to properly use Azure Diagnostics. Custom performance counters or event-log entries can also be part of the overall strategy. This provides more data during failures to quickly diagnose the problem and restore full capabilities. It also provides additional metrics that the monitoring tools can use to determine application health. For more information, see [Enabling Azure Diagnostics in Azure Cloud Services](../cloud-services/cloud-services-dotnet-diagnostics.md). For a discussion of how to plan for an overall “health model,” see [Failsafe: Guidance for Resilient Cloud Architectures](https://channel9.msdn.com/Series/FailSafe).

##Disaster simulation

Simulation testing involves creating small real-life situations on the work floor to observe how the team members react. Simulations also show how effective the solutions are in the recovery plan. Carry out simulations in such a way that the created scenarios don't disrupt actual business while still feeling like real situations.

Consider architecting a type of “switchboard” in the application to manually simulate availability issues. For instance, through a soft switch, trigger database access exceptions for an ordering module by causing it to malfunction. You can take similar lightweight approaches for other modules at the network interface level.

The simulation highlights any issues that were inadequately addressed. The simulated scenarios must be completely controllable. This means that, even if the recovery plan seems to be failing, you can restore the situation back to normal without causing any significant damage. It’s also important that you inform higher-level management about when and how the simulation exercises will be executed. This plan should include information on the time or resources that might become unproductive while the simulation test is running. When you're subjecting your disaster recovery plan to a test, it's also important to define how success will be measured.

There are several other techniques that you can use to test disaster recovery plans. However, most of them are simply altered versions of these basic techniques. The main motive behind this testing is to evaluate how feasible and how workable the recovery plan is. Disaster recovery testing focuses on the details to discover holes in the basic recovery plan.

##Next steps

This article is part of a series of articles focused on [disaster recovery and high availability for applications built on Microsoft Azure](./resiliency-disaster-recovery-high-availability-azure-applications.md). The previous article in this series is [High availability for applications built on Microsoft Azure](./resiliency-high-availability-azure-applications.md).
