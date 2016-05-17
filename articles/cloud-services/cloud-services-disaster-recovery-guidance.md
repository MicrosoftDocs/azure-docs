<properties
	pageTitle="What to do in the event of an Azure service disruption impacting Azure Cloud Services | Microsoft Azure"
	description="Learn what to do in the event of an Azure service disruption impacting Azure Cloud Services."
	services="cloud-services"
	documentationCenter=""
	authors="adamglick"
	manager="drewm"
	editor=""/>

<tags
	ms.service="cloud-services"
	ms.workload="cloud-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/16/2016"
	ms.author="kmouss;aglick"/>

#What to do in the event of an Azure service disruption impacting Azure Cloud Services

At Microsoft we work hard to make sure our services are always available to you when you need them. Sometimes forces beyond our control impact us in ways that cause unplanned services disruptions.

Microsoft provides a Service Level Agreements(SLAs) for its services as a commitment for uptime and connectivity. The SLA for individual Azure services can be found under [Azure Service Level Agreements](https://azure.microsoft.com/support/legal/sla/).

Azure already has many built-in platform features that support highly available applications. for more on these services please read [Disaster Recovery and High Availability for Azure Applications](https://aka.ms/drtechguide).

This document covers a true Disaster Recovery, when a whole region experiences an outage due to major natural disaster or widespread service interruption. These are rare occurrences; but you must prepare for the possibility that there is an outage of the entire datacenter. When a datacenter goes down, the locally redundant copies of your data are not available. If you have enabled Geo-replication, there are three additional copies of your Azure Storage blobs and tables in a datacenter in a different region. When Microsoft declares the datacenter lost, Azure remaps all of the DNS entries to the geo-replicated datacenter. 

>[AZURE-NOTE]Be aware that you do not have any control over this process, and it will only occur for datacenter-wide failures. Because of this, you must also rely on other application-specific backup strategies to achieve the highest level of availability. For more information, see the section on [Data Strategies for Disaster Recovery](https://aka.ms/drtechguide#DSDR). If you would like to be able to affect your own failover you may want to consider the use of [Read-Access Geo-Redundant Storage (RA-GRS)](../storage/storage-redundancy.md#read-access-geo-redundant-storage) which creates a read-only copy of your data in another region.

To help you handle these rare occurrences, we provide you the following guidance for Azure Cloud Services in the case of an outage of the entire datacenter where your Cloud Services application is deployed. 

##Option 1: Wait for recovery 
In this case, no action on your part is required.  Know that Azure teams are working diligently to restore service availability. You can see the current service status on our [Azure Service Health Dashboard](https://azure.microsoft.com/status/). 

>[AZURE-NOTE]Note: This is the best option if customer hasn’t setup Azure Site Recovery (ASR) or has a secondary deployment in a different region. 

For customers desiring immediate access to their deployed Cloud Services, the below options are available.

>[AZURE-NOTE]Be aware that these options have the possibility of some data loss.     

##Option 2: Re-Deploy your Cloud Service configuration to a new Region 

If you have your original code, you can simply just re-deploy the application and associated configuration and resources to a new Cloud Service in a new region.  

For more detail about how to create and deploy a Cloud Service application please see [How to create and deploy a cloud service](./cloud-services-how-to-create-deploy-portal.md).

Depending on your application data sources, you may need to check the recovery procedures for your application data source. 
  * For Azure Storage data sources please see [Azure Storage replication](../storage/storage-redundancy.md#read-access-geo-redundant-storage) to check on the options available based on the replication model chosen for your application.
  * For SQL Database sources please read [Overview: Cloud business continuity and database disaster recovery with SQL Database](../sql-database/sql-database-business-continuity.md) to check on the options available based on the replication model chosen for your application. 

##Option 3: Use a backup deployment through a Traffic Manager 

This option assume you have already designed your application solution with regional disaster recovery in mind. This option can be used if you already have a secondary Cloud Services application deployment running in a different region and connected through a traffic manager channel. In this case, check the health of the secondary deployment and if all healthy, you can redirect traffic to it through Azure Traffic manager taking advantage traffic routing method and failover order configurations in ATM please see [How to configure Traffic Manager settings](../traffic-manager/traffic-manager-overview.md#how-to-configure-traffic-manager-settings). 

![Balancing Azure Cloud Services across regions with Azure Traffic Manager](./media/cloud-services-disaster-recovery-guidance/using-azure-traffic-manager.png)

##References 

[Disaster Recovery and High Availability for Azure Applications](https://aka.ms/drtechguide)

[Azure Business Continuity Technical Guidance](https://aka.ms/bctechguide)
 
If the instructions are not clear, or if you would like Microsoft to do the operations on your behalf please contact [Customer Support](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
