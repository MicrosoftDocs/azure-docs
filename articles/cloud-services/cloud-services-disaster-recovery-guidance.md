<properties
	pageTitle="What to do in the event of an Azure service disruption that impacts Azure Cloud Services | Microsoft Azure"
	description="Learn what to do in the event of an Azure service disruption that impacts Azure Cloud Services."
	services="cloud-services"
	documentationCenter=""
	authors="kmouss"
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

#What to do in the event of an Azure service disruption that impacts Azure Cloud Services

At Microsoft, we work hard to make sure that our services are always available to you when you need them. Forces beyond our control sometimes impact us in ways that cause unplanned service disruptions.

Microsoft provides a Service Level Agreement (SLA) for its services as a commitment for uptime and connectivity. The SLA for individual Azure services can be found at [Azure Service Level Agreements](https://azure.microsoft.com/support/legal/sla/).

Azure already has many built-in platform features that support highly available applications. For more about these services, read [Disaster recovery and high availability for Azure applications](../resiliency/resiliency-disaster-recovery-high-availability-azure-applications.md).

This article covers a true disaster recovery scenario, when a whole region experiences an outage due to major natural disaster or widespread service interruption. These are rare occurrences, but you must prepare for the possibility that there is an outage of an entire region. If an entire region experiences a service disruption, the locally redundant copies of your data would temporarily be unavailable. If you have enabled geo-replication, three additional copies of your Azure Storage blobs and tables are stored in a different region. In the event of a complete regional outage or a disaster in which the primary region is not recoverable, Azure remaps all of the DNS entries to the geo-replicated region.

>[AZURE.NOTE]Be aware that you do not have any control over this process, and it will only occur for datacenter-wide service disruptions. Because of this, you must also rely on other application-specific backup strategies to achieve the highest level of availability. For more information, see the section about [Data strategies for disaster recovery](../resiliency/resiliency-disaster-recovery-high-availability-azure-applications.md#DSDR). If you would like to be able to affect your own failover, you might want to consider the use of [read-access geo-redundant storage (RA-GRS)](../storage/storage-redundancy.md#read-access-geo-redundant-storage), which creates a read-only copy of your data in another region.

To help you handle these rare occurrences, we provide the following guidance for Azure virtual machines (VMs) in the case of a service disruption of the entire region where your Azure VM application is deployed.

##Option 1: Wait for recovery
In this case, no action on your part is required. Know that Azure teams are working diligently to restore service availability. You can see the current service status on our [Azure Service Health Dashboard](https://azure.microsoft.com/status/).

>[AZURE.NOTE]This is the best option if a customer hasn’t set up Azure Site Recovery or has a secondary deployment in a different region.

For customers who want immediate access to their deployed cloud services, the following options are available.

>[AZURE.NOTE]Be aware that these options have the possibility of some data loss.     

##Option 2: Re-Deploy your cloud service configuration to a new region

If you have your original code, you can simply just redeploy the application, associated configuration, and associated resources to a new cloud service in a new region.  

For more detail about how to create and deploy a cloud service application, see [How to create and deploy a cloud service](./cloud-services-how-to-create-deploy-portal.md).

Depending on your application data sources, you may need to check the recovery procedures for your application data source.
  * For Azure Storage data sources, see [Azure Storage replication](../storage/storage-redundancy.md#read-access-geo-redundant-storage) to check on the options that are available based on the chose replication model for your application.
  * For SQL Database sources, read [Overview: Cloud business continuity and database disaster recovery with SQL Database](../sql-database/sql-database-business-continuity.md) to check on the options that are available based on the chosen replication model for your application.

##Option 3: Use a backup deployment through Azure Traffic Manager
This option assumes that you have already designed your application solution with regional disaster recovery in mind. You can use this option if you already have a secondary cloud services application deployment that's running in a different region and connected through a traffic manager channel. In this case, check the health of the secondary deployment. If it's healthy, you can redirect traffic to it through Azure Traffic Manager. With this strategy, you can take advantage of the traffic routing method and failover order configurations in Azure Traffic Manager. For more information, see [How to configure Traffic Manager settings](../traffic-manager/traffic-manager-overview.md#how-to-configure-traffic-manager-settings).

![Balancing Azure Cloud Services across regions with Azure Traffic Manager](./media/cloud-services-disaster-recovery-guidance/using-azure-traffic-manager.png)

##Next steps

To learn more about how to implement a disaster recovery and high availability strategy, see [Disaster recovery and high availability for Azure applications](../resiliency/resiliency-disaster-recovery-high-availability-azure-applications.md).

To develop a detailed technical understanding of a cloud platform’s capabilities, see [Azure resiliency technical guidance](../resiliency/resiliency-technical-guidance.md).

If the instructions are not clear, or if you would like Microsoft to do the operations on your behalf please contact [Customer Support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
