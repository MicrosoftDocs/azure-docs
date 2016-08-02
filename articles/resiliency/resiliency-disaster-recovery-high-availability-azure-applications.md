<properties
   pageTitle="Disaster Recovery and High Availability for Azure Applications | Microsoft Azure"
   description="Technical overviews and depth information on designing applications for high availability and disaster recovery of applications built on Microsoft Azure."
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

#Disaster recovery and high availability for applications built on Microsoft Azure

##Introduction

This article focuses on high availability for applications running in Azure. An overall strategy for high availability also includes the aspect of disaster recovery. Planning for failures and disasters in the cloud requires you to recognize the failures quickly. You then implement a strategy that matches your tolerance for the application’s downtime. Additionally, you have to consider the extent of data loss the application can tolerate without causing adverse business consequences as it is restored.

Most companies say they are prepared for temporary and large-scale failures. However, before you answer that question for yourself, does your company rehearse these failures? Do you test the recovery of databases to ensure you have the correct processes in place? Probably not. That’s because successful disaster recovery starts with lots of planning and architecting to implement these processes. Just like many other non-functional requirements, such as security, disaster recovery rarely gets the up-front analysis and time allocation it requires. Also, most companies don’t have the budget for geographically distributed regions with redundant capacity. Consequently, even mission critical applications are frequently excluded from proper disaster recovery planning.

Cloud platforms, such as Azure, provide geographically dispersed regions around the world. These platforms also provide capabilities that support availability and a variety of disaster recovery scenarios. Now, every mission critical cloud application can be given due consideration for disaster proofing of the system. Azure has resiliency and disaster recovery built in to many of its services. You must study these platform features carefully, and supplement with application strategies.

This article outlines the necessary architecture steps you must take to disaster-proof an Azure deployment. Then you can implement the larger business continuity process. A business continuity plan is a roadmap for continuing operations under adverse conditions. This could be a failure with technology, such as a downed service, or a natural disaster, such as a storm or power outage. Application resiliency for disasters is only a subset of the larger disaster recovery process, as described in this NIST document: [Contingency Planning Guide for Information Technology Systems](https://www.fismacenter.com/sp800-34.pdf).

The following sections define different levels of failures, techniques to deal with them, and architectures that support these techniques. This information provides input to your disaster recovery processes and procedures, to ensure your disaster recovery strategy works correctly and efficiently.

##Characteristics of resilient cloud applications

A well architected application can withstand capability failures at a tactical level, and it can also tolerate strategic system-wide failures at the region level. The following sections define the terminology referenced throughout the document to describe various aspects of resilient cloud services.

###High availability

A highly available cloud application implements strategies to absorb the outage of dependencies, like the managed services offered by the cloud platform. Despite possible failures of the cloud platform’s capabilities, this approach permits the application to continue to exhibit the expected functional and non-functional systemic characteristics. This is covered in-depth in the Channel 9 video series, [Failsafe: Guidance for Resilient Cloud Architectures](https://channel9.msdn.com/Series/FailSafe).

When you implement the application, you must consider the probability of a capability outage. Additionally, consider the impact an outage will have on the application from the business perspective, before diving deep into the implementation strategies. Without due consideration to the business impact and the probability of hitting the risk condition, the implementation can be expensive and potentially unnecessary.

Consider an automotive analogy for high availability. Even quality parts and superior engineering does not prevent occasional failures. For example, when your car gets a flat tire, the car still runs, but it is operating with degraded functionality. If you planned for this potential occurrence, you can use one of those thin-rimmed spare tires until you reach a repair shop. Although the spare tire does not permit fast speeds, you can still operate the vehicle until you replace the tire. Similarly, a cloud service that plans for potential loss of capabilities can prevent a relatively minor problem from bringing down the entire application. This is true even if the cloud service must run with degraded functionality.

There are a few key characteristics of highly available cloud services: availability, scalability, and fault tolerance. Although these characteristics are interrelated, it is important to understand each, and how they contribute to the overall availability of the solution.

###Availability

An available application considers the availability of its underlying infrastructure and dependent services. Available applications remove single points of failure through redundancy and resilient design. When you broaden the scope to consider availability in Azure, it is important to understand the concept of the effective availability of the platform. Effective availability considers the Service Level Agreements (SLA) of each dependent service, and their cumulative effect on the total system availability.

System availability is the measure of the percentage of a time window the system will be able to operate. For example, the availability SLA of at least two instances of a web or worker role in Azure is 99.95 percent (out of 100 percent). It does not measure the performance or functionality of the services running on those roles. However, the effective availability of your cloud service is also affected by the various SLAs of the other dependent services. The more moving parts within the system, the more care you must take to ensure the application can resiliently meet the availability requirements of its end users.

Consider the following SLAs for an Azure service that uses Azure services: Compute, Azure SQL Database, and Azure Storage.

|Azure service|SLA   |Potential minutes downtime/month (30 days)|
|:------------|:-----|:----------------------------------------:|
|Compute      |99.95%|21.6 minutes                              |
|SQL Database |99.99%|4.3  minutes                              |
|Storage      |99.90%|43.2 minutes                              |

You must plan for all services to potentially go down at different times. In this simplified example, the total number of minutes per month that the application could be down is 108 minutes. A 30-day month has a total of 43,200 minutes. 108 minutes is .25 percent of the total number of minutes in a 30-day month (43,200 minutes). This gives you an effective availability of 99.75 percent for the cloud service.

However, using availability techniques described in this paper can improve this. For example, if you design your application to continue running when the SQL Database is unavailable, you can remove that from the equation. This might mean that the application runs with reduced capabilities, so there are also business requirements to consider. For a complete list of Azure SLAs, see [Service Level Agreements](https://azure.microsoft.com/support/legal/sla/).

###Scalability

Scalability directly affects availability. An application that fails under increased load is no longer available. Scalable applications are able to meet increased demand with consistent results, in acceptable time windows. When a system is scalable, it scales horizontally or vertically to manage increases in load while maintaining consistent performance. In basic terms, horizontal scaling adds more machines of the same size (processor, memory, and bandwidth), while vertical scaling increases the size of the existing machines. For Azure, you have vertical scaling options for selecting various machine sizes for compute. However, changing the machine size requires a re-deployment. Therefore, the most flexible solutions are designed for horizontal scaling. This is especially true for compute, because you can easily increase the number of running instances of any web or worker role. These additional instances handle increased traffic through the Azure Web portal, PowerShell scripts, or code. Base this decision on increases in specific monitored metrics. In this scenario, user performance or metrics do not suffer a noticeable drop under load. Typically, the web and worker roles store any state externally. This allows for flexible load balancing and graceful handling of any changes to instance counts. Horizontal scaling also works well with services, such as Azure Storage, which do not provide tiered options for vertical scaling.

Cloud deployments should be seen as a collection of scale-units. This allows the application to be elastic in servicing the throughput needs of end users. The scale units are easier to visualize at the web and application server level. This is because Azure already provides stateless compute nodes through web and worker roles. Adding more compute scale-units to the deployment will not cause any application state management side effects, because compute scale-units are stateless. A storage scale-unit is responsible for managing a partition of data (structured or unstructured). Examples of storage scale-units include Azure Table partition, Azure Blob container, and Azure SQL Database. Even the usage of multiple Azure Storage accounts has a direct impact on the application scalability. You must design a highly scalable cloud service to incorporate multiple storage scale-units. For instance, if an application uses relational data, partition the data across several SQL databases. Doing so allows the storage to keep up with the elastic compute scale-unit model. Similarly, Azure Storage allows data partitioning schemes that require deliberate designs to meet the throughput needs of the compute layer. For a list of best practices for designing scalable cloud services, see [Best Practices for the Design of Large-Scale Services on Azure Cloud Services](https://azure.microsoft.com/blog/best-practices-for-designing-large-scale-services-on-windows-azure/).

###Fault tolerance

Applications should assume that every dependent cloud capability can and will go down at some point in time. A fault tolerant application detects and maneuvers around failed elements, to continue and return the correct results within a specific timeframe. For transient error conditions, a fault tolerant system will employ a retry policy. For more serious faults, the application can detect problems and fail over to alternative hardware or contingency plans until the failure is corrected. A reliable application can properly manage the failure of one or more parts, and continue operating properly. Fault tolerant applications can use one or more design strategies, such as redundancy, replication, or degraded functionality.

##Disaster recovery

A cloud deployment might cease to function due to a systemic outage of the dependent services or the underlying infrastructure. Under such conditions, a business continuity plan triggers the disaster recovery process. This process typically involves both operations personnel and automated procedures in order to reactivate the application in an available region. This requires the transfer of application users, data, and services to the new region. It also involves the use of backup media or ongoing replication.

Consider the previous analogy that compared high availability to the ability to recover from a flat tire through the use of a spare. In contrast, disaster recovery involves the steps taken after a car crash, where the car is no longer operational. In that case, the best solution is to find an efficient way to change cars, by calling a travel service or a friend. In this scenario, there is likely going to be a longer delay in getting back on the road. There is also more complexity in repairing and returning to the original vehicle. In the same way, disaster recovery to another region is a complex task that typically involves some downtime and potential loss of data. To better understand and evaluate disaster recovery strategies, it is important to define two terms: recovery time objective (RTO) and recovery point objective (RPO).

###Recovery time objective

The RTO is the maximum amount of time allocated for restoring application functionality. This is based on business requirements, and it is related to the importance of the application. Critical business applications require a low RTO.

###Recovery point objective

The RPO is the acceptable time window of lost data due to the recovery process. For example, if the RPO is one hour, you must completely back up or replicate the data at least every hour. Once you bring up the application in an alternate region, the backup data may be missing up to an hour of data. Like RTO, critical applications target a much smaller RPO.

##Checklist

Let’s summarize the key points that have been covered in this article (and its related articles on [high availability](./resiliency-high-availability-azure-applications.md) and [disaster recovery](./resiliency-disaster-recovery-azure-applications.md) for Azure applications). This summary will act as a checklist of items you should consider for your own availability and disaster recovery planning. These are best practices that have been useful for customers seeking to get serious about implementing a successful solution.

1. Conduct a risk assessment for each application, because each can have different requirements. Some applications are more critical than others and would justify the extra cost to architect them for disaster recovery.
1. Use this information to define the RTO and RPO for each application.
1. Design for failure, starting with the application architecture.
1. Implement best practices for high availability, while balancing cost, complexity, and risk.
1. Implement disaster recovery plans and processes.
  * Consider failures that span the module level all the way to a complete cloud outage.
  * Establish backup strategies for all reference and transactional data.
  * Choose a multi-site disaster recovery architecture.
1. Define a specific owner for disaster recovery processes, automation, and testing. The owner should manage and own the entire process.
1. Document the processes so they are easily repeatable. Although there is one owner, multiple people should be able to understand and follow the processes in an emergency.
1. Train the staff to implement the process.
1. Use regular disaster simulations for both training and validation of the process.

##Summary

When hardware or applications fail within Azure, the techniques and strategies for managing them are different than when failure occurs on on-premises systems. The main reason for this is that cloud solutions typically have more dependencies on infrastructure that is distributed across an Azure region, and managed as separate services. You must deal with partial failures using high availability techniques. To manage more severe failures, possibly due to a disaster event, use disaster recovery strategies.

Azure detects and handles many failures, but there are many types of failures that require application-specific strategies. You must actively prepare for and manage the failures of applications, services, and data.

When creating your application’s availability and disaster recovery plan, consider the business consequences of the application’s failure. Defining the processes, policies, and procedures to restore critical systems after a catastrophic event takes time, planning, and commitment. And once you establish the plans, you cannot stop there. You must regularly analyze, test, and continually improve the plans based on your application portfolio, business needs, and the technologies available to you. Azure provides new capabilities and raises new challenges to creating robust applications that withstand failures.

##Additional resources

[High availability for applications built on Microsoft Azure](resiliency-high-availability-azure-applications.md)

[Disaster recovery for applications built on Microsoft Azure](resiliency-disaster-recovery-azure-applications.md)

[Azure resiliency technical guidance](resiliency-technical-guidance.md)

[Overview: Cloud business continuity and database disaster recovery with SQL Database](../sql-database/sql-database-business-continuity.md)

[High availability and disaster recovery for SQL Server in Azure Virtual Machines](../virtual-machines/virtual-machines-windows-sql-high-availability-dr.md)

[Failsafe: Guidance for resilient cloud architectures](https://channel9.msdn.com/Series/FailSafe)

[Best Practices for the design of large-scale services on Azure Cloud Services](https://azure.microsoft.com/blog/best-practices-for-designing-large-scale-services-on-windows-azure/)

##Next steps

This article is part of a series of articles focused on disaster recovery and high availability for Azure applications. The next article in this series is [High availability for applications built on Microsoft Azure](resiliency-high-availability-azure-applications.md).
