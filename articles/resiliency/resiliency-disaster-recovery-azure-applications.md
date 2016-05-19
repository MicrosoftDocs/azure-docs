<properties
   pageTitle="Disaster Recovery for Azure Applications | Microsoft Azure"
   description="Technical overviews and depth information on designing applications for disaster recovery on Microsoft Azure."
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
   ms.date="05/18/2016"
   ms.author="hanuk;jroth;aglick"/>

#Disaster recovery for applications built on Microsoft Azure

##Introduction to disaster recovery
While high availability is about temporary failure management, disaster recovery (DR) is about the catastrophic loss of application functionality. For example, consider the scenario where a region goes down. In this case, you need to have a plan to run your application or access your data outside of the Azure region. Execution of this plan involves people, processes, and supporting applications that allow the system to function. The business and technology owners, who define its disaster operational mode, determine the level of functionality for the service during a disaster. This can take many forms: completely unavailable, partially available (degraded functionality or delayed processing), or fully available.

##Azure disaster recovery features
As with availability considerations, Azure has [Azure Business Continuity Technical Guidance](https://aka.ms/bctechguide) designed to support disaster recovery. There is also a relationship between some of the availability features of Azure and disaster recovery. For example, the management of roles across fault domains increases the availability of an application. Without that management, an unhandled hardware failure would become a “disaster” scenario. So the correct application of many of the availability features and strategies should be seen as an important part of disaster-proofing your application. However, this section goes beyond general availability issues to more serious (and rarer) disaster events.

##Multiple datacenter regions
Azure maintains datacenters in many different regions around the world. This supports several disaster recovery scenarios, such as the system-provided geo-replication of Azure Storage to secondary regions. It also means that you can easily and inexpensively deploy a cloud service to multiple locations around the world. Compare this with the cost and difficulty of running your own datacenters in multiple regions. Deploying data and services to multiple regions protects your application from major outages in a single region.

##Azure Traffic Manager
Once a region-specific failure occurs, you must redirect traffic to services or deployments in another region. This routing can be done manually, but it is more efficient to use an automated process. Azure Traffic Manager (WATM) is designed for this task. It allows you to automatically manage the fail-over of user traffic to another region in case the primary region fails. Because traffic management is an important part of the overall strategy, it is important to understand the basics of WATM.

In the diagram below, users connect to a URL specified for WATM (__http://myATMURL.trafficmanager.net__) that abstracts the actual site URLs (__http://app1URL.cloudapp.net__ and __http://app2URL.cloudapp.net__). Based on how you configure the criteria for when to route users, they will be sent to the correct actual site when the policy dictates. The policy options are round-robin, performance, or fail-over. For the sake of this article we will only be concerned with the option of fail-over.

###Routing using the Windows Azure Traffic Manager

![Routing using the Azure Traffic Manager](./media/resiliency-disaster-recovery-azure-applications/routing-using-azure-traffic-manager.png "Routing using the Azure Traffic Manager")

_Figure 5 Routing using the Azure Traffic Manager_

When configuring WATM you will provide a new Traffic Manager DNS prefix. This is the URL prefix you will provide to your users to access your service. WATM now abstracts load balancing one level up and not at the region level. The Traffic Manager DNS maps to a CNAME for all the deployments it manages.

Within WATM, you specify the priority of the deployments that users will be routed to when failure occurs. The WATM monitors the endpoints of the deployments and notes when the primary deployment fails. At failure, WATM will analyze the prioritized list of deployments and route users to the next one on the list.

While WATM decides where to go in a fail-over, you can decide if your fail-over domain is dormant or active while NOT in fail-over mode. That functionality has nothing to do with Azure Traffic Manager. WATM detects a failure in the primary site and goes to rollover to the fail-over site. WATM rolls over regardless of whether that site is currently actively serving users or not. More information about dormant or active fail-over domains can be found in later sections of this paper.

For more information on how Azure Traffic Manager works please refer to the following links.
 * [Traffic Manager overview](../traffic-manager/traffic-manager-overview.md)
 * [Configure fail-over routing method](../traffic-manager/traffic-manager-configure-failover-routing-method.md)

##Common Azure disaster scenarios
The following sections cover several different types of disaster scenarios. Region-wide service disruptions are not the only cause of application-wide failures. Poor design or administration errors can also lead to outages. It is important to consider the possible causes of a failure during both the design and testing phases of your recovery plan. A good plan takes advantage of Azure features and augments them with application-specific strategies. The chosen response is dictated by the importance of the application, the RPO, and the RTO.

###Application failure
As mentioned previously, Azure Fabric Controller automatically handles failures resulting from the underlying hardware or operating system software in the host virtual machine. Azure creates a new instance of the role on a functioning server and adds it to the load balancer rotation. If the number of role instances is greater than one, Azure shifts processing to the other running role instances while replacing the failed node.

There are serious application errors that happen independently of any hardware or operating system failures. The application could fail due to the catastrophic exceptions caused by bad logic or data integrity issues. You must incorporate enough telemetry into the code so that a monitoring system can detect failure conditions and notify an application administrator. The administrator with full knowledge of the disaster recovery processes can make a decision to invoke a fail-over process. Alternatively, the administrator could simply accept an availability outage to resolve the critical errors.

###Data corruption
Azure automatically stores your Azure SQL Database and Azure Storage data three times redundantly within different fault domains in the same region. If geo-replication is used, it is stored three additional times in a different region. However, if your users or your application corrupts that data in the primary copy, it quickly replicates to the other copies. Unfortunately, this results in three copies of corrupt data.

To manage potential corruption of your data, you have two options. First, you can manage a custom backup strategy. You can store your backups in Azure or on-premises depending on your business requirements or governance regulations. Another option is to use the new Point in Time Restore database recovery option for SQL database. For more information, see the section on [Data strategies for disaster recovery](#data-strategies-for-disaster-recovery).

##Network outage
When parts of the Azure network are inaccessible, you may not be able to get to your application or data. If one or more role instances are unavailable due to network issues, Azure leverages the remaining available instances of your application. If your application can’t access its data because of an Azure network outage, you can potentially run in a degraded mode locally by using cached data. You need to architect the disaster recovery strategy for running in degraded mode in your application. For some applications, this might not be practical. 

Another option is to store data in an alternate location until connectivity is restored. If degraded mode is not an option, the remaining options are application downtime or fail-over to an alternate region. The design of an application running in degraded mode is a much a business decision as a technical one. This is discussed further in the section on [Degraded application functionality](#degraded-application-functionality).

##Failure of dependent service
Azure provides many services that can experience periodic downtime. Consider Azure Shared Caching as an example. This multi-tenant service provides caching capabilities to your application. It is important to consider what happens in your application if the dependent service is unavailable. In many ways, this scenario is similar to the network outage scenario. However, considering each service independently results in potential improvements to your overall plan.

For example, with caching, there is a relatively new alternative to the multi-tenant Shared Caching model. Azure Caching on roles provides caching to your application from within your cloud service deployment. (This is also the recommended way to use Caching going forward). While it has a limitation of only being accessible from within a single deployment, there are potential disaster recovery benefits. First, the service now runs on roles that are local to your deployment. Therefore, you are better able to monitor and manage the status of the cache as part of your overall management processes for the cloud service. However, this type of caching also exposes new features. One of the new features is high availability for cached data. This helps to preserve cached data in the event that a single node fails by maintaining duplicate copies on other nodes. Note that high availability decreases throughput and increases latency because of the updating of the secondary copy on writes. It also doubles the amount of memory used for each item, so plan for that. This specific example demonstrates that each dependent service might have capabilities that improve your overall availability and resistance to catastrophic failures.

With each dependent service, you should understand the implications of a total outage. In the Caching example, it might be possible to access the data directly from a database until you restore the Caching capabilities. This would be a degraded mode in terms of performance but would provide full functionality with regard to data.

##Region-wide service disruption
The previous failures have primarily been failures that can be managed within the same Azure region. However, you must also prepare for the possibility that there is an outage of the entire region. If a region-wide service disruption occurs, the locally redundant copies of your data are not available. If you have enabled Geo-replication, there are three additional copies of your blobs and tables in a different region. If Microsoft declares the region lost, Azure remaps all of the DNS entries to the geo-replicated region. 

>[AZURE.NOTE]Be aware that you do not have any control over this process, and it will only occur for region-wide service disruption. Because of this, you must also rely on other application-specific backup strategies to achieve the highest level of availability. For more information, see the section on [Data strategies for disaster recovery](#data-strategies-for-disaster-recovery).

##Azure-wide service disruption
In disaster planning, you must consider the entire range of possible disasters. One of the most severe outages would involve all Azure regions simultaneously. As with other outages, you might decide that you will take the risk of temporary downtime in that event. Widespread service disruptions that span regions should be much rarer than isolated service disruptions involving dependent services or single regions. However, for some mission critical applications, you might decide that there must be a backup plan for this scenario as well. The plan for this event could include failing over to services in an [Alternative clouds](#alternative-clouds) or a [hybrid on-premises and cloud solutions](#hybrid-on-premises-and-cloud-solutions).

##Degraded application functionality
A well designed application typically uses a collection of modules that communicate with each other though the implementation of loosely coupled information interchange patterns. A DR-friendly application particularly requires separation of tasks at the module level. This is to prevent an outage of a dependent service from bringing down the entire application. For example, consider a web commerce application for Company Y; the following modules might constitute the application:
 * __Product Catalog__: allows the users to browse products
 * __Shopping Cart__: allows users to add/remove products in their shopping cart
 * __Order Status__: shows the shipping status of user orders
 * __Order Submission__: finalizes the shopping session by submitting the order with payment
 * __Order Processing__: validates the order for data integrity and performs quantity availability check

When a dependent of a module in this application goes down, how does the module function until that part recovers? A well architected system implements isolation boundaries through separation of tasks both at design time and run time. You can categorize every failure as recoverable and non-recoverable. Non-recoverable errors will take down the module, but you can mitigate a recoverable error through alternatives. As discussed in the high availability section, you can hide some problems from users by handling faults and taking alternate actions. During a more serious outage, the application might be completely unavailable. However, a third option is to continue servicing users in degraded mode.

For instance, if the database for hosting orders goes down, the Order Processing module loses its ability to process sales transactions. Depending on the architecture, it might be hard or impossible for the Order Submission and Order Processing parts of the application to continue. If the application is not designed to handle this scenario, the entire application might go offline.

However, in this same scenario, it is possible that the product data is stored in a different location. In that case, the Product Catalog module can still be used for viewing products. In degraded mode, the application continues to be available to users for available functionality like viewing the product catalog. Other parts of the application, however, are unavailable, such as ordering or inventory queries.

Another variation of degraded mode centers on performance rather than capabilities. For example, consider a scenario where the product catalog was being cached with Azure Caching. If Caching became unavailable, it is possible that the application could go directly to the server storage to retrieve product catalog information. But this access might be slower than the cached version. Because of this, the application performance is degraded until the Caching service is fully restored.

Deciding how much of an application will continue to function in degraded mode is both a business and a technical decision. The application must also decide how to inform the users of the temporary problems. In this example, the application could allow viewing products and even adding them to a shopping cart. However, when the user attempts to make a purchase, the application notifies the user that the sales module is down temporarily. It is not ideal for the customer, but it does prevent an application-wide outage.

##Data strategies for disaster recovery
Handling data correctly is the hardest area to get right in any disaster recovery plan. Restoring data is also the part of the recovery process that typically takes the most time. Different choices in degradation modes result in difficult challenges for data recovery from failure and consistency after failure. One of the factors is the need to restore or maintain a copy of the application’s data. You will use this data for reference and transactional purposes at a secondary site. An on-premises setting requires an expensive and lengthy planning process to implement a multi-region disaster recovery strategy. Conveniently, most cloud providers, including Azure, readily allow the deployment of applications to multiple regions. These regions are geographically distributed in such a way that multi-region service disruption should be extremely rare. The strategy for handling data across regions is one of the contributing factors for the success of any disaster recovery plan.

The following sections discuss disaster recovery techniques related to data backups, reference data, and transactional data.

##Backup and restore
Regular backups of application data can support some disaster recovery scenarios. Different storage resources require different techniques.

For the Basic, Standard, and Premium SQL Database tiers, you can take advantage of Point in Time Restore to recover your database. For more information, see [Point in Time Restore for Azure SQL Database](../sql-database/sql-database-business-continuity.md). Another option is to use Active Geo-Replication for SQL Database. This automatically replicates database changes to secondary databases in the same Azure region or even in a different Azure region. This provides a potential alternative to some of the more manual data synchronization techniques presented in this paper. For more information, see [Active Geo-Replication for Azure SQL Database](../sql-database/sql-database-geo-replication-overview.md).

You can also use a more manual approach for backup and restore. Use the DATABASE COPY command to create a copy of the database. You must use this command to get a backup with transactional consistency. You can also leverage the import/export service of Azure SQL Database. This supports exporting databases to BACPAC files that are stored in Azure Blob storage. The built-in redundancy of Azure Storage creates two replicas of the backup file in the same region. However, the frequency of running the backup process determines your RPO, which is the amount of data you might lose in disaster scenarios. For example, you perform a backup at the top of the hour, and disaster occurs two minutes before the top of the hour. You lose 58 minutes of data that happened after the last backup was performed. Also, to protect against a region-wide service disruption, you should copy the BACPAC files to an alternate region. You then have the option of restoring those backups in the alternate region. For more details, see [Overview: Cloud business continuity and database disaster recovery with SQL Database](../sql-database/sql-database-business-continuity.md).

For Azure Storage, you can develop your own custom backup process or use one of many third-party backup tools. Note that there are additional complexities in most application designs where storage resources reference each other. For example, consider a SQL Database that has a column that links to a blob in Azure Storage. If the backups do not happen simultaneously, the database might have the pointer to a blob that was not backed-up before the failure. The application or disaster recovery plan must implement processes to handle this inconsistency after a recovery.

##Reference data pattern for disaster recovery
As mentioned previously, reference data is read-only data that supports application functionality. It typically does not change frequently. Although backup and restore is one method to handle region-wide service disruptions, the RTO is relatively long. When you deploy the application to a secondary region, there are some strategies that improve the RTO for reference data.

Because reference data changes infrequently, you can improve the RTO by maintaining a permanent copy of the reference data in the secondary region. This eliminates the time required to restore backups in the event of a disaster. To meet the multi-region disaster recovery requirements, you must deploy the application and the reference data together on multiple regions. As mentioned in [Reference data pattern for high availability)](./resiliency-high-availability-azure-applications.md#reference-data-pattern-for-high-availability), you can deploy reference data to the role itself, external storage, or a combination of both. The intra compute node reference data deployment model implicitly satisfies the disaster recovery requirements. Reference data deployment to SQL Database requires that you deploy a copy of the reference data to each region. The same strategy applies to Azure Storage. You must deploy a copy of any reference data stored on Azure Storage to the primary and the secondary regions.

###Reference data publication to multiple regions

![Reference data publication to both primary and secondary regions](./media/resiliency-disaster-recovery-azure-applications/reference-data-publication-to-both-primary-and-secondary-regions.png "Reference data publication to both primary and secondary regions")

__Figure 6 Reference data publication to both primary and secondary regions__

As mentioned previously, you must implement your own application-specific backup routines for all data, including reference data. Geo-replicated copies across regions are only used in a region-wide outage. To prevent extended downtime, deploy the mission critical parts of the application’s data to the secondary region. For an example of this topology, see the [Active-Passive model](#active-passive).

##Transactional data pattern for disaster recovery
Implementation of a fully functional disaster mode strategy requires asynchronous replication of the transactional data to the secondary region. The practical time windows within which the replication can occur will determine the RPO characteristics of the application. You might still recover the data lost from the primary region during the replication window. You may also be able to merge with the secondary region later.

The following architecture examples provide some ideas on different ways of handling transactional data in a fail-over scenario. It is important to note that these examples are not exhaustive. For example, intermediate storage locations such as queues could be replaced with Azure SQL Database. The queues themselves could be either Azure Storage or Service Bus queues (see [Azure Queues and Azure Service Bus Queues - Compared and Contrasted](../service-bus/service-bus-azure-and-service-bus-queues-compared-contrasted.md)). Server storage destinations could also vary, such as Azure tables instead of SQL Database. In addition, there might be worker roles that are inserted as intermediaries in various steps. The important thing is not to emulate these architectures exactly, but to consider various alternatives in the recovery of transactional data and related modules.

Consider an application that uses Azure Storage queues to hold transactional data. This allows worker roles to process the transactional data to the server database in a decoupled architecture. As discussed, this requires the transactions to use some form of temporary caching if the front-end roles require the immediate query of that data. Depending on the level of data loss tolerance, you could choose to replicate the queues, the database, or all of the storage resources. With only database replication, if the primary region goes down, you can still recover the data in the queues when the primary region comes back. The following diagram shows an architecture where the server database is synchronized across regions.

###Replicate transactional data in preparation for disaster recovery

![Replicate transactional data in preparation for disaster recovery](./media/resiliency-disaster-recovery-azure-applications/replicate-transactional-data-in-preparation-for-disaster-recovery.png "Replicate transactional data in preparation for Disaster Recovery")

_Figure 7 Replicate transactional data in preparation for disaster recovery_

The biggest challenge to implement the previous architecture is the replication strategy between regions. Azure provides a SQL Data Sync service for this type of replication. However, the service is still in preview and is not recommended for production environments. For more information, see [Business Continuity in Azure SQL Database](../sql-database/sql-database-business-continuity.md). For production applications, you must invest in a third-party solution or create your own replication logic in code. Depending on the architecture, the replication might be bi-directional, which is also more complex. One potential implementation could make use of the intermediate queue in the previous example. The worker role that processes the data to the final storage destination could make the change in both the primary and secondary region. These are not trivial tasks, and complete guidance for replication code is beyond the scope of this paper. The important point is that a lot of your time and testing should focus on how you replicate your data to the secondary region. Additional processing and testing should be done to ensure that the fail-over and recovery processes correctly handle any possible data inconsistencies or duplicate transactions.

>[AZURE.NOTE]Most of this paper focuses on Platform as a Service. However, there are additional replication and availability options for hybrid applications that use Azure Virtual Machines. These hybrid applications use Infrastructure as a Service (IaaS) to host SQL Server on virtual machines in Azure. This allows traditional availability approaches in SQL Server, such as AlwaysOn Availability Groups or Log Shipping. Some techniques, such as AlwaysOn, only work between on-premises SQL Servers and Azure virtual machines. For more information, see [High Availability and Disaster Recovery for SQL Server in Azure Virtual Machines](../virtual-machines/virtual-machines-windows-sql-high-availability-dr.md).

Consider a second architecture that operates in degraded mode. The application on the secondary region deactivates all the functionality, such as reporting, BI, or draining queues. It only accepts the most important types of transactional workflows as defined by business requirements. The system captures the transactions and writes them to queues. The system may postpone processing the data during the initial stage of the outage. If the system on the primary region reactivates within the expected time window, the worker roles in the primary region can drain the queues. This process eliminates the need for database merging. If the primary region outage goes beyond the tolerable window, the application can start processing the queues. In this scenario, the database on the secondary contains incremental transactional data that must be merged once the primary reactivates. The following diagram shows this strategy for temporarily storing transactional data until the primary region is restored.

###Degraded application mode for transaction capture

![Degraded application mode for transaction capture](./media/resiliency-disaster-recovery-azure-applications/degraded-application-mode-for-transaction-capture.png "Degraded application mode for transaction capture")

_Figure 8 Degraded application mode for transaction capture_

For more discussion of data management techniques for resilient Azure applications, see Failsafe: Guidance for Resilient Cloud Architectures.

##Deployment topologies for disaster recovery
Prepare mission critical applications for the possibility of a region-wide service disruption. You do this by incorporating a multi-region deployment strategy into the operational planning. Multi-region deployments might involve IT Pro processes to publish the application and reference data to the secondary region after experiencing a disaster. If the application requires instant fail-over, the deployment process may involve an active/passive or an active/active setup. This type of deployment has existing instances of the application running in the alternate region. As discussed, a routing tool such as the Azure Traffic Manager provides load balancing services at the DNS level. It can detect outages and route the users to different regions when needed.

Part of a successful Azure disaster recovery is architecting that recovery into the solution from the start. The cloud provides additional options for recovering from failures during a disaster that are not available in a traditional hosting provider. Specifically, you can dynamically and quickly allocate resources to a different region. Therefore, you won’t pay a lot for idle resources while waiting for a failure to occur.

The following sections cover different deployment topologies for disaster recovery. Typically, there is a tradeoff in increased cost or complexity for additional availability.

##Single-region deployment
A single-region deployment is not really a disaster recovery topology, but is meant to contrast the other architectures. Single-region deployments are common for applications in Azure. It is not, however, a serious contender for a disaster recovery plan. The following diagram depicts an application running in a single Azure region. As discussed previously, the Azure Fabric Controller and the use of fault and upgrade domains increase availability of the application within the region.

###Single-region deployment

![Single-region deployment](./media/resiliency-disaster-recovery-azure-applications/single-region-deployment.png "Single-region deployment")

_Figure 9 Single-region deployment_

Here it is apparent that the database is a single point of failure. Even though Azure replicates the data across different fault domains to internal replicas, this all occurs in the same region. It cannot withstand a catastrophic failure. If the region goes down, all of the fault domains go down, which includes all service instances and storage resources.

For all but the least critical applications, you must devise a plan to deploy your application across multiple regions. You should also consider RTO and cost constraints in considering which deployment topology to use.

Let’s take a look now at specific patterns to support fail-over across different regions. These examples all use two regions to describe the process.

##Redeploy
In this pattern, only the primary region has applications and databases running. The secondary region is not set up for an automatic fail-over. So when disaster occurs, you must spin up all the parts of the service in the new region. This includes uploading a cloud service to Azure, deploying the cloud services, restoring the data, and changing the DNS to reroute the traffic.

While this is the most affordable of the multi-region options, it has the worst RTO characteristics. In this model, the service package and database backups are stored either on-premises or in the blob storage of the secondary region. However, you must deploy a new service and restore the data before it resumes operation. Even if you fully automate the data transfer from backup storage, spinning up the new database environment consumes a lot of time. Moving data from the backup disk storage to the empty database on the secondary region is the most expensive part of restore. You must do this, however, to bring the new database to an operational state since it is not replicated.

The best approach is to store the service packages in Azure Blob storage in the secondary region. This eliminates the need to upload the package to Azure, which is what happens when you deploy from an on-premises development machine. You can quickly deploy the service packages to a new cloud service from blob storage by using PowerShell scripts.

This option is only practical for non-critical applications that can tolerate a high RTO. For instance, this might work for an application that can be down for several hours, but should be running again within 24 hours.

###Redeploy to a secondary Azure region

![Redeploy to a secondary Azure region](./media/resiliency-disaster-recovery-azure-applications/redeploy-to-a-secondary-azure-region.png "Redeploy to a secondary Azure region")

_Figure 10 Redeploy to a secondary Azure region_

##Active-Passive
The Active/Passive pattern is the choice that many companies favor. This pattern provides improvements to the RTO with a relatively small increase in cost over the redeploy pattern. In this scenario, there is again a primary and a secondary Azure region. All of the traffic goes to the active deployment on the primary region. The secondary region is better prepared for disaster recovery because the database is running on both regions. Additionally, there is a synchronization mechanism in place between them. This standby approach can involve two variations: a database-only approach or a complete deployment in the secondary region.

In the first variation of the Active/Passive pattern, only the primary region has a deployed cloud service application. However, unlike the redeploy pattern, both regions are synchronized with the contents of the database (see the section on [Transactional data pattern for disaster recovery](#transactional-data-pattern-for-disaster-recovery)). When a disaster occurs, there are fewer activation requirements. You start the application in the secondary region, change connection strings to the new database, and change the DNS entries to reroute traffic.

Like the redeploy pattern, you should already have stored the service packages in Azure Blob storage in the secondary region for faster deployment. Unlike the redeployment pattern, you don’t incur the majority of the overhead that database restore operations requires. The database is ready and running. This saves a significant amount of time, making this an affordable and, therefore, the most popular DR pattern.

####Active-Passive - database only

![Active-Passive - database only](./media/resiliency-disaster-recovery-azure-applications/active-passive-database-only.png "Active-Passive - database only")

_Figure 11 Active-Passive - database only_

In the second variation of the Active/Passive pattern, the primary and secondary region have a full deployment. This deployment includes the cloud services and a synchronized database. However, only the primary region is actively handling network requests from the users. The secondary region becomes active only when the primary region experiences a service disruption. In that case, all new network requests route to the secondary region. Azure Traffic Manager can manage this fail-over automatically.

Fail-over occurs faster than the database-only variation because the services are already deployed. This pattern provides a very low RTO; the secondary fail-over region must be ready to go immediately after failure of the primary region.

Along with quicker response, this pattern also has an additional advantage of pre-allocating and deploying backup services. You don’t have to worry about a region not having the space to allocate new instances in a disaster. This is important if your secondary Azure region is nearing capacity. There is no guarantee (SLA) that you will instantly be able to deploy a number of new cloud services in any region.

For the fastest response time with this model, you must have similar scale (number of role instances) in the primary and secondary region. Despite the advantages, paying for unused compute instances is costly, and this is often not the most prudent financial choice. Because of this, it is more common to use a slightly scaled-down version of cloud services on the secondary region. Then you can quickly fail-over and scale out the secondary deployment when necessary. You should automate the fail-over process so that, once the primary region fails, you activate additional instances depending up on the load. This could involve some type of automatic scaling mechanism, such as the AutoScale Preview or the The Autoscaling Application Block. The following diagram shows the model where the primary and secondary region contain a fully deployed cloud service in an Active/Passive pattern.

###Active-Passive - full replica

![Active-Passive - full replica](./media/resiliency-disaster-recovery-azure-applications/active-passive-full-replica.png "Active-Passive - Full Replica")

_Figure 12 Active/Passive - full replica_

##Active-Active
By now, you’re probably figuring out the evolution of the patterns – decreasing the RTO increases costs and complexity. The Active/Active solution actually breaks this tendency with regard to cost. In an Active/Active pattern, the cloud services and database are fully deployed in both regions. Unlike the Active/Passive model, both regions receive user traffic. This option yields the quickest recovery time. The services are already scaled to handle a portion of the load at each region. The DNS is already enabled to use the secondary region. There is additional complexity in determining how to route users to the appropriate region. Round-robin scheduling might be possible. It is more likely that certain users would use a specific region where the primary copy of their data resides.

In case of fail-over, simply disable DNS to the primary region, which routes all traffic to the secondary region. Even in this model, there are some variations. For example, the following diagram shows a model where the primary region owns the master copy of the database. The cloud services in both regions write to that primary database. The secondary deployment can read from the primary or replicated database. Replication in this example happens one way.

####Active-Active

![Active-Active](./media/resiliency-disaster-recovery-azure-applications/active-active.png "Active-Active")

_Figure 13 Active-Active_

There is a downside to the Active/Active architecture in the previous diagram. The second region must access the database in the first region because the master copy resides there. Performance significantly drops off when you access data from outside a region. In cross-region database calls, you should consider some type of batching strategy to improve the performance of these calls. For more information, see [Batching Techniques for SQL Database Applications in Azure](../sql-database/sql-database-use-batching-to-improve-performance.md). An alternative architecture could involve each region accessing its own database directly. In that model, some type of bidirectional replication would be required to synchronize the databases in each region.

In the Active-Active pattern, you might not need as many instances on the primary region as you would in the Active-Passive pattern. If you have ten instances on the primary region in an Active-Passive architecture, you might need only five in each region in an Active-Active architecture. Both regions now share the load. This could be a cost savings over the Active-Passive pattern if you kept a warm standby on the passive region with ten instances waiting for fail-over.

Realize that until you restore the primary region, the secondary region may receive a sudden surge of new users. If there were 10,000 users on each server when the primary region experiences a service disruption, the secondary region suddenly has to handle 20,000 users. Monitoring rules on the secondary region must detect this increase and double the instances in the secondary region. For more information on this, see the section on [Failure detection](#failure-detection).

##Hybrid on-premises and cloud solutions
One additional strategy for disaster recovery is to architect a hybrid application that runs on-premises and in the cloud. Depending on the application, the primary region might be either location. Consider the previous architectures and imagine the primary or secondary region as an on-premises location.

There are some challenges in these hybrid architectures. First, most of this paper has addressed Platform as a Service (PaaS) architecture patterns. Typical PaaS applications in Azure rely on Azure-specific constructs such as roles, cloud services, and the Fabric Controller. To create an on-premises solution for this type of PaaS application would require a significantly different architecture. This might not be feasible from a management or cost perspective.

However, a hybrid solution for disaster recovery has fewer challenges for traditional architectures that have simply moved to the cloud. This is true of architectures that use Infrastructure as a Service (IaaS). IaaS applications use Virtual Machines in the cloud that can have direct on-premises equivalents. The use of virtual networks also allows you to connect machines in the cloud with on-premises network resources. This opens up several possibilities that are not possible with PaaS-only applications. For example, SQL Server can take advantage of disaster recovery solutions such as AlwaysOn Availability Groups and database mirroring. For details, see [High Availability and Disaster Recovery for SQL Server in Azure Virtual Machines](../virtual-mahcines/virtual-machines-windows-sql-high-availability-dr.md).

IaaS solutions also provide an easier path for on-premises applications to use Azure as the fail-over option. You might have a fully functioning application in an existing on-premises region. However, what if you lack the resources to maintain a geographically separate region for fail-over? You might decide to use Virtual Machines and Virtual Networks to get your application running in Azure. Define processes that synchronize data to the cloud. The Azure deployment then becomes the secondary region to use for fail-over. The primary region remains the on-premises application. For more information about IaaS architectures and capabilities, see the [Virtual Machines documentation](https://azure.microsoft.com/documentation/services/virtual-machines/).

##Alternative Clouds
There are situations when even the robustness of Microsoft’s cloud might not be enough for your availability requirements. In the past year or so, there have been a few severe outages of various cloud platforms. This includes Amazon Web Services (AWS) and the Azure platforms. Even the best preparation and design to implement backup systems during a disaster fall short and your entire cloud takes the day off.

You’ll want to compare availability requirements with the cost and complexity of increased availability. Perform a risk analysis, and define the RTO and RPO for your solution. If your application cannot tolerate any downtime, it might make sense for you to consider using another cloud solution. Unless the entire Internet goes down simultaneously, another cloud solution, such as Rackspace or Amazon Web Services, will be still functioning on the rare chance that Azure is completely down.

As with the hybrid scenario, the fail-over deployments in the previous DR architectures can also exist within another cloud solution. Alternative cloud DR sites should only be used for those solutions with an RTO that allows very little, if any, downtime. Note that a solution that uses a DR site outside of Azure will require more work to configure, develop, deploy, and maintain. It is also more difficult to implement best practices in a cross-cloud architecture. Although cloud platforms have similar high-level concepts, the APIs and architectures are different. Should you decide to split your DR among different platforms, it would make sense to architect abstraction layers in the design of the solution. If you do this, you won’t need to develop and maintain two different versions of the same application for different cloud platforms in case of disaster. As with the hybrid scenario, the use of Virtual Machines might be easier in these cases than cloud-specific PaaS designs.

##Automation
Some of the patterns we just discussed require quick activation of off-line deployments as well as restoration of specific parts of a system. Automation, or scripting, supports the ability to activate resources on-demand and deploy solutions rapidly. In this paper, DR-related automation is equated with [Azure PowerShell](https://msdn.microsoft.com/library/azure/jj156055.aspx), but the [Service Management REST API](https://msdn.microsoft.com/library/azure/ee460799.aspx) is also an option. Developing scripts helps to manage the parts of DR that Azure does not transparently handle. This has the benefit of producing consistent results each time, which minimizes the chance of human error. Having pre-defined DR scripts also reduces the time to rebuild a system and its constituent parts in the midst of a disaster. You don’t want to try to manually figure out how to restore your site while it is down and losing money every minute.

Once you create the scripts, test them over and over from start to finish. After you verify their basic functionality, make sure that you test them in [Disaster simulation](#disaster-simulation). This helps uncover flaws in the scripts or processes.

A best practice with automation is to create a repository of Azure DR PowerShell scripts. Cleary mark and categorize them for easy lookup. Designate one person to manage the repository and versioning of the scripts. Document them well with explanations of parameters and examples of script use. Also ensure that you keep this documentation in sync with your Azure deployments. This underscores the purpose of having one person in charge of all parts of the repository.

##Failure Detection
In order to correctly handle problems with availability and disaster recovery, you must be able to detect and diagnose failures. You should do advanced server and deployment monitoring so you can quickly know when a system or its parts are suddenly down. Monitoring tools that look at the overall health of the cloud Service and its dependencies can perform part of this work. One Microsoft tool is [System Center 2012 R2](https://www.microsoft.com/server-cloud/products/system-center-2012-r2/) (SCOM). Other third-party tools, such as AzureWatch, can also provide monitoring capabilities. AzureWatch also allows you to automate scalability. Most monitoring solutions track key performance counters and service availability.

Although these tools are vital, they do not replace the need to plan for fault detection and reporting within a cloud service. You must plan to properly use Azure diagnostics. Custom performance counters or event log entries can also be part of the overall strategy. This provides more data during failures to quickly diagnose the problem and restore full capabilities. It also provides additional metrics for the monitoring tools to use to determine application health. For more information, see [Collect Logging Data by Using Azure Diagnostics](../cloud-services/cloud-services-dotnet-diagnostics.md). For a discussion of how to plan for an overall “health model”, see [Failsafe: Guidance for Resilient Cloud Architectures](https://channel9.msdn.com/Series/FailSafe).

##Disaster simulation
Simulation testing involves creating small real life situations on the actual work floor to observe how the team members react. Simulations also show how effective the solutions are outlined in the recovery plan. Carry out simulations in such a way that the scenarios created do not disrupt actual business while still feeling like “real” situations.

Consider architecting a type of “switchboard” in the application to manually simulate availability issues. For instance, through a soft switch, trigger database access exceptions for an ordering module by causing it to malfunction. Similar lightweight approaches can be taken for other modules at the network interface level.

Any issues that were inadequately addressed are highlighted during simulation. The simulated scenarios must be completely controllable. This means that, even if the recovery plan seems to be failing, you can restore the situation back to normal without causing any significant damage. It’s also important that you inform higher-level management about when and how the simulation exercises will be executed. This plan should include information on the time or resources that may become unproductive while the simulation test is running. When subjecting your disaster recovery plan to a test, it is also important to define how success will be measured.

There are several other techniques that you can use to test disaster recovery plans. However, most of them are simply altered versions of these basic techniques. The main motive behind this testing is to evaluate how feasible and how workable the recovery plan is. Disaster recovery testing focuses on the details to discover holes in the basic recovery plan.

##Next steps
This article is part of a series of articles focused on [Disaster recovery and high availability for applications built on Microsoft Azure](./resiliency-disaster-recovery-high-availability-azure-applications.md). The previous article in this series is [High Availability for applications built on Microsoft Azure](./resiliency-high-availability-azure-applications.md).
