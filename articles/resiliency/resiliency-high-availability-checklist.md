<properties
   pageTitle="High availability checklist | Microsoft Azure"
   description="A quick checklist of settings and actions that you can take to ensure you are improving your applications availability with Azure."
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
   ms.date="06/07/2016"
   ms.author="aglick"/>

#High availability checklist
One of the great benefits of using Azure is the ability to increase the availability (and scalability) of your applications with the help of the cloud. To make sure you are making the most of those options, the checklist below is meant to help you with some of the key infrastructure basics to ensuring that your applications are resilient. 

>[AZURE.NOTE] Most of the suggestions below are things that can be implemented at any time in your application and thus are great for "quick fixes". The best long-term solution often involves an application design that is build for the cloud.  For a checklist on these (more design oriented areas, please read our [Availability checklist] (../best-practices-availability-checklist.md).

##Are you using Traffic Manager in front of your resources?
Using Traffic Manager helps you load balance your traffic across regions. You can do this for a number of reasons including latency and availability. If you would like to find out more information on how to use Traffic Manager to increase your resiliency and spread your traffic to multiple regions, read [What is Traffic Manager?](../traffic-manager/traffic-manager-overview.md)

__What happens if you don't use Traffic Manager?__ If you aren't using Traffic Manager in front of your application, you are limited to a single region for your resources. This limits your scale, increases latency to users that are not close to your chosen region, and lowers your protection in the case of a region-wide service disruption.

##Have you avoided using a single virtual machine for any role?
Good design avoids any single point of failure. This is important in all service design (on-premises or in the cloud) but is especially useful in the cloud as you can increase scalability and resiliency though scaling out (adding virtual machines) instead of scaling up (using a more powerful virtual machine). If you would like to find out more information on scalable application design, read [High availability for applications built on Microsoft Azure](./resiliency-high-availability-azure-applications.md).

__What happens if you have a single virtual machine for a role?__ A single machine is a single point of failure. In the best cases, your application will run just fine but this is not a resilient design and any single point of failure increases the chance of downtime if something fails.

##Are you using a load balancer in front of your application's internet-facing VMs?
Load balancers allow you to spread the incoming traffic to your application across an arbitrary number of machines.  You can add/remove machines from your load balancer at any time which works well with Virtual Machine Scale Sets (or Auto Scaling) to allow you to easily handle increases in traffic or VM failures. If you want to know more about load balancers, please read the [Azure Load Balancer overview](../load-balancer/load-balancer-overview.md).

__What happens if you are not using a load balancer in front of your internet-facing VMs?__ Without a load balancer you will not be able to scale out (add more machines) and your only option will be to scale up (increase the size of your web facing machine). You will also face a single point of failure with that web machine. You will also need to write DNS code to notice if you have lost an internet-facing machine and re-map your DNS entry to the new machine you start to take it's place.

##Are you using Availability Sets for your stateless application and web servers?
Putting your machines in an availability set makes your VMs eligible for the Azure VM SLA. Being part of an Availability Set also ensures that your machines are put into different Update Domains (i.e. different host machines that are patched at different times). Without being in an availability set, your VMs could be located on the same host machine and thus there might be a single point of failure that is not visible to you. If you would like to find out more information about increasing the availability of your VMs using Availability Sets, please read [Manage the availability of virtual machines](../virtual-machines/virtual-machines-windows-manage-availability.md).

__What happens if you don't use an Availability Set with your stateless applications and web servers?__ Not using an availability set means that you aren't able to take advantage of the Azure VM SLA. It also means that machines in that layer of your application could all go offline if there is an update on the host machine (the machine that hosts the VMs you are using). 

##Are you using Virtual Machine Scale Sets (VMSS) for your stateless application or web servers?
A good scalable and resilient design uses VMSS to make sure that you can grow/shrink the number of machines in a tier of your application (such as your web tier). VMSS allows you to define how your application tier scales (adding or removing servers based on criteria you choose). If you would like to find out more information on how to use Azure Virtual Machine Scale Sets increase your resiliency to traffic spikes, read [Virtual Machine Scale Sets Overview](../virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md).

__What happens if you don't us a Virtual Machine Scale Set with my stateless application of web server?__ Without a VMSS, you limit your ability to scale without limits and to optimize your use or resources. A design that lacks VMSS has an upper scaling limit that will have to be handled with additional code (or manually). This lack of a VMSS also means that your application can not easily add and remove machines (regardless of scale) to help you handle large spikes of traffic (such as during a promotion or if your site/app/product goes viral).

##Are you using separate storage accounts for each of your virtual machines?
You should always use premium storage for your virtual machines. In addition, you should make sure that you use a separate storage account for each virtual machine. If you would like to find out more information on Azure Storage performance and scalability, read [Microsoft Azure Storage Performance and Scalability Checklist](../storage/storage-performance-checklist.md).

__What happens if you don't use separate storage accounts for each virtual machine?__ A storage account, like many other resources is a single point of failure. Although there are many protections and resiliency features of Azure Storage, a single point of failure is never a good design. For instance, if access rights got corrupted to that account, a storage limit was hit, or you hit an IOPS limit, you could impact all of your virtual machines using that storage account. Additionally, if there was a service disruption that impacted a storage stamp that included that particular storage account you could have multiple virtual machines impacted.

##Are you using load balancers between each tier of your application?
Using load balancers between each tier of your application enables you to easily scale each tier of your application easily and independently. If you would like to find out more information on how to use internal load balancers, read [Internal Load balancer Overview](../load-balancer/load-balancer-internal-overview.md).

__What happens if you don't use load balancers between each tier of your application?__ Without a load balancer between each tier of your application it is difficult to scale your application up or down. This will lead to over, or under provisioning your application and a risk of downtime or poor user experience if you have unexpected changes in traffic or system failures.

##Are you using queues (Service Bus or Storage Queues) between each tier of your application?
A queue is a best practice design principal in a distributed system. Queues allow you to have disconnected tiers in your application and be able to recover from faults in either of the tiers of your application that communicates with the queue. If you would like to know more about queues and which queing service is right for your application, please read [Azure Queues and Service Bus queues - compared and contrasted](../service-bus/service-bus-azure-and-service-bus-queues-compared-contrasted.md).

 __What happens if you don't use a queue between each tier of your application?__ Applications that don't use queues as part of their design will have a difficult time distributing and scaling their workloads. These systems usually run the risk of session/data loss if there is a failure in one of the connected tiers. With the use of a queue, your system can be resilient to the failures of either connected tier.
 
##Are your SQL Databases using active geo-replication? 
Active Geo-Replication enables you to configure up to 4 readable secondary databases in the same, or different, regions. Secondary databases are available in the case of a service disruption or the inability to connect to the primary database. If you want to know more about SQL Database active geo-replication, please read [Overview: SQL Database Active Geo-Replication](../sql-database/sql-database-geo-replication-overview.md).
 
 __What happens if you don't use active geo-replication with your SQL databases?__ Without active geo-replication, if your primary database ever goes offline (planned maintenance, service disruption, hardware failure, etc.) your application database will be offline until you can bring your primary database back online in a healthy state. 
 
##Are you using a cache (Azure Redis Cache) in front of your databases?
If your application has a high database load where most of the database calls are reads, you can increase the speed of your application and decrease the load on your database by implementing a caching layer in front of your database to offload these read operations. You can increase the speed of your application and decrease your database load (thus increasing the scale it can handle) by planing a caching layer in front of your database. If you would like to learn more about the Azure Redis cache, please read [Azure Redis Cache](https://azure.microsoft.com/services/cache/).
 
 __What happens if you don't use a cache in front of your database?__ If your database machine is powerful enough to handle the traffic load you put on it then your application will respond as normal though this may mean that at lower load you will be paying for a database machine that is more expensive than necessary. If your database machine is not powerful enough to handle your load then you will start to experience poor user experience with your application (latency, timeouts, and possibly service downtime).
 
##Have you contacted Microsoft Azure Support if you are expecting a high scale event?
Azure support can help you increase your service limits to deal with planned high traffic events (like new product launches or special holidays). Azure Support may also be able to help you connect with experts who can help you review your design with your account team and help you find the best solution to meet your high scale event needs. If you would like to find out more information on how to contact Azure support, please read the [Azure Support FAQs](https://azure.microsoft.com/support/faq/).

__What happens if you don't contact Azure Support for a high-scale event?__ If you don’t communicate, or plan for, a high traffic event, you risk hitting certain [Azure services limits](../azure-subscription-service-limits.md) and thus creating a poor user experience (or worse, downtime) during your event. Architectural reviews and communicating ahead of surges can help mitigate these risks.

##Are you using a Content Delivery Network (Azure CDN) in front of your web-facing storage blobs and static assets?
Using a CDN helps you take load off your servers by caching your content in the CDN POP/edge locations that are located around the world. You can do this to decrease latency, increase scalability, decrease server load, and as part of a strategy for protection from denial of service(DOS) attacks. If you would like to find out more information on how to use Azure CDN to increase your resiliency and decrease your customer latency, read [Overview of the Azure Content Delivery Network (CDN)](../cdn/cdn-overview.md).

__What happens if you don't use a CDN?__ If you aren't using a CDN then all of your customer traffic comes directly to your resources. This means that you will see higher loads on your servers which decreases their scalability. Additionally, your customers may experiences higher latencies as CDNs offer locations around the world that are likely closer to your customers.

##Next steps:
Is you would like to read more about how to design your applications for high availability, please read [High availability for applications built on Microsoft Azure](./resiliency-high-availability-azure-applications.md).