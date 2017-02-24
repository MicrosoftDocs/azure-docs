---
title: Resiliency for recovery from loss of an Azure region technical guidance | Microsoft Docs
description: Understand and design resilient, highly available, fault-tolerant applications, and plan for disaster recovery.
services: ''
documentationcenter: na
author: adamglick
manager: saladki
editor: ''

ms.assetid: f2f750aa-9305-487e-8c3f-1f8fbc06dc47
ms.service: resiliency
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/18/2016
ms.author: aglick

---
# Azure resiliency technical guidance: recovery from a region-wide service disruption
Azure is divided physically and logically into units called regions. A region consists of one or more datacenters that are close. For the current list of regions, see the [Azure regions page](https://azure.microsoft.com/regions/).

Under rare circumstances, it is possible that facilities in an entire region can become inaccessible, for example due to network failures. Facilities can be lost entirely too, for example due to a natural disaster. This article explains the capabilities of Azure to create applications that are distributed across regions. This kind of distribution helps to minimize the possibility that a failure in one region might affect other regions.

## Cloud services
### Resource management
You can distribute compute instances across regions by creating a separate cloud service in each target region, and then publishing the deployment package to each cloud service. However, the distribution of traffic across cloud services in different regions must be implemented by the application developer or with a traffic management service.

Determining the number of spare role instances to deploy in advance for disaster recovery is an important aspect of capacity planning. Having a full-scale secondary deployment ensures that capacity is already available when needed. However, this effectively doubles the cost. A common pattern is to have a small, secondary deployment, large enough to run critical services. This small secondary deployment is a good idea, both to reserve capacity, and for testing the configuration of the secondary environment.

> [!NOTE]
> The subscription quota is not a capacity guarantee. The quota is simply a credit limit. To guarantee capacity, the required number of roles must be defined in the service model, and the roles must be deployed.
>
>

### Load balancing
To load balance traffic across regions requires a traffic management solution. Azure provides [Azure Traffic Manager](https://azure.microsoft.com/services/traffic-manager/). You can also take advantage of third-party services that provide similar traffic management capabilities.

### Strategies
Many alternative strategies are available for implementing distributed compute across regions. These strategies must be tailored to the specific business requirements and circumstances of the application. At a high level, the approaches can be divided into the following categories:

* **Redeploy on disaster**. In this approach, the application is redeployed from scratch at the time of disaster. This redeployment is appropriate for non-critical applications that don’t require a guaranteed recovery time.
* **Warm spare (active/passive)**. A secondary hosted service is created in an alternate region, and roles are deployed to guarantee minimal capacity. However, the roles don’t receive production traffic. This approach is useful for applications that have not been designed to distribute traffic across regions.
* **Hot spare (active/active)**. The application is designed to receive production load in multiple regions. The cloud services in each region might be configured for higher capacity than required for disaster recovery purposes. Alternatively, the cloud services might scale out as necessary at the time of a disaster and failover. This approach requires substantial investment in application design, but it has significant benefits. These include low and guaranteed recovery time, continuous testing of all recovery locations, and efficient usage of capacity.

A complete discussion of distributed design is outside the scope of this article. For more information, see [Disaster recovery and high availability for applications built on Microsoft Azure](https://aka.ms/drtechguide).

## Virtual machines
Recovery of infrastructure as a service (IaaS) virtual machines (VMs) is similar to platform as a service (PaaS) compute recovery in many respects. There are important differences, however, as an IaaS VM consists of both the VM and the VM disk.

* **Use Azure Backup to create cross region backups that are application consistent**.
  [Azure Backup](https://azure.microsoft.com/services/backup/) enables customers to create application consistent backups across multiple VM disks, and support replication of backups across regions. You accomplish this task by choosing to geo-replicate the backup vault at the time of creation. Replication of the backup vault must be configured at the time of creation. It can't be set later. If a region is lost, Microsoft makes the backups available to customers. Customers are able to restore to any of their configured restore points.
* **Separate the data disk from the operating system disk**. An important consideration for IaaS VMs is that you cannot change the operating system disk without re-creating the VM. This process is not a problem if your recovery strategy is to redeploy after disaster. However, it might be a problem if you are using the warm-spare approach to reserve capacity. To implement properly, you must have the correct operating system disk deployed to the primary and secondary locations, and the application data must be stored on a separate drive. If possible, use a standard operating system configuration that can be provided on both locations. After a failover, you must then attach the data drive to your existing IaaS VMs in the secondary DC. Use AzCopy to copy snapshots of each data disk to a remote site.
* **Be aware of potential consistency issues after a geo-failover of multiple VM disks**. Each VM disk is implemented as an Azure Blob storage instance, and each disk has the same geo-replication characteristic. Unless [Azure Backup](https://azure.microsoft.com/services/backup/) is used, there are no guarantees of consistency across disks, because geo-replication is asynchronous and replicates independently. Individual VM disks are guaranteed to be in a crash consistent state after a geo-failover, but not consistent across disks. This might cause problems in some cases (for example, in the case of disk striping).

## Storage
### Recovery by using geo-redundant storage of blob, table, queue, and VM disk storage
In Azure, blobs, tables, queues, and VM disks are all geo-replicated by default. This is referred to as geo-redundant storage. Geo-redundant storage replicates storage data to a paired datacenter that is hundreds of miles apart within a specific geographic region. Geo-redundant storage is designed to provide additional durability in case there is a major datacenter disaster. Microsoft controls when failover occurs, and failover is limited to major disasters in which the original primary location is deemed unrecoverable in a reasonable amount of time. Under some scenarios, this can be several days. Data is typically replicated within a few minutes, although a synchronization interval is not yet covered by a service level agreement.

If a geo-failover occurs, there are no changes to how the account is accessed (the URL and account key will not change). The storage account will, however, be in a different region after failover. This might affect applications that require regional affinity with their storage account. Even for services and applications that don't require a storage account in the same datacenter, the cross-datacenter latency and bandwidth charges might be compelling reasons to move traffic to the failover region temporarily. This might factor into an overall disaster recovery strategy.

In addition to automatic failover provided by geo-redundant storage, Azure has introduced a service that gives you read access to the copy of your data in the secondary storage location. This is called read-access geo-redundant storage.

For more information about both geo-redundant storage and read-access geo-redundant storage, see [Azure Storage replication](../storage/storage-redundancy.md).

### Geo-replication region mappings
It's important to know where your data is geo-replicated, in order to know where to deploy the other instances of your data that require regional affinity with your storage. The following table shows the primary and secondary location pairings.

[!INCLUDE [paired-region-list](../../includes/paired-region-list.md)]

### Geo-replication pricing
Geo-replication is included in current pricing for Azure Storage, as geo-redundant storage. If you don't want your data geo-replicated, you can disable geo-replication for your account. This is called locally redundant storage, and it is charged at a discounted price compared to geo-redundant storage.

### Determine if a geo-failover occurred
If a geo-failover occurs, the failure is posted to the [Azure Service Health Dashboard](https://azure.microsoft.com/status/). Applications can implement an automated means of detecting the failure, however, by monitoring the geo-region for their storage account. This automated detection can be used to trigger other recovery operations, such as the activation of compute resources in the geo-region where their storage moved to. You can perform a query for this event by using the service management API, by using [Get Storage Account Properties](https://msdn.microsoft.com/library/ee460802.aspx). The relevant properties are:

    <GeoPrimaryRegion>primary-region</GeoPrimaryRegion>
    <StatusOfPrimary>[Available|Unavailable]</StatusOfPrimary>
    <LastGeoFailoverTime>DateTime</LastGeoFailoverTime>
    <GeoSecondaryRegion>secondary-region</GeoSecondaryRegion>
    <StatusOfSecondary>[Available|Unavailable]</StatusOfSecondary>

### VM disks and geo-failover
As discussed earlier in the "Virtual machines" section of this article, there are no guarantees for data consistency across VM disks after a failover. To ensure correctness of backups, a backup product such as System Center Data Protection Manager should be used to back up and restore application data.

## Database
### Azure SQL Database
Azure SQL Database provides two types of recovery: Geo-Restore and Active Geo-Replication.

#### Geo-Restore
[Geo-Restore](../sql-database/sql-database-recovery-using-backups.md#geo-restore) is also available with Basic, Standard, and Premium databases. It provides the default recovery option when the database is unavailable because of an incident in the region where your database is hosted. Similar to Point-In-Time Restore, Geo-Restore relies on database backups in geo-redundant Azure Storage. It restores from the geo-replicated backup copy, and therefore is resilient to the storage outages in the primary region. For more information, see [Restore an Azure SQL Database or failover to a secondary](../sql-database/sql-database-disaster-recovery.md).

#### Active Geo-Replication
[Active Geo-Replication](../sql-database/sql-database-geo-replication-overview.md) is available for all database tiers. It’s designed for applications that have more aggressive recovery requirements than Geo-Restore can offer. By using Active Geo-Replication, you can create up to four readable secondaries on servers in different regions. You can initiate failover to any of the secondaries. In addition, Active Geo-Replication can be used to support the application upgrade or relocation scenarios, as well as load balancing for read-only workloads. For details, see [Configure Active Geo-Replication](../sql-database/sql-database-geo-replication-portal.md) and [Fail over to the secondary database](../sql-database/sql-database-geo-replication-failover-portal.md). For details on designing and implementing applications and application upgrade's without downtime, see [Application design for cloud disaster recovery using Active Geo-Replication in SQL Database](../sql-database/sql-database-designing-cloud-solutions-for-disaster-recovery.md) and [Managing rolling upgrades of cloud applications using SQL Database Active Geo-Replication](../sql-database/sql-database-manage-application-rolling-upgrade.md).

### SQL Server on Azure Virtual Machines
Various options are available for recovery and high availability for SQL Server 2012 (and later) that run in an Azure Virtual Machines deployment. For more information, see [High availability and disaster recovery for SQL Server in Azure Virtual Machines](../virtual-machines/windows/sql/virtual-machines-windows-sql-high-availability-dr.md).

## Other Azure platform services
When attempting to run your cloud service in multiple Azure regions, you must consider the implications for each of your dependencies. In the following sections, the service-specific guidance assumes that you must use the same Azure service in an alternate Azure datacenter. This involves both configuration and data-replication tasks.

> [!NOTE]
> In some cases, these steps can help to mitigate a service-specific outage rather than an entire datacenter event. From the application perspective, a service-specific outage might be just as limiting and would require temporary migration of the service to an alternate Azure region.
>
>

### Azure Service Bus
Azure Service Bus uses a unique namespace that does not span Azure regions. So the first requirement is to set up the necessary Service Bus namespaces in the alternate region. However, there are also considerations for the durability of the queued messages. There are several strategies for replicating messages across Azure regions. For the details on these replication strategies and other disaster recovery strategies, see [Best practices for insulating applications against Service Bus outages and disasters](../service-bus-messaging/service-bus-outages-disasters.md). For other availability considerations, see [Service Bus (Availability)](resiliency-technical-guidance-recovery-local-failures.md#other-azure-platform-services).

### Azure App Service
To migrate an Azure App Service application, such as Web Apps or Mobile Apps, to a secondary Azure region, you must have a backup of the website available for publishing. If the outage does not involve the entire Azure datacenter, it might be possible to use FTP to download a recent backup of the site content. Then create a new app in the alternate region, unless you have previously done this to reserve capacity. Publish the site to the new region, and make any necessary configuration changes. These changes might include database connection strings or other region-specific settings. If necessary, add the site’s SSL certificate and change the DNS CNAME record so that the custom domain name points to the redeployed Web Apps URL.

### Azure HDInsight
The data associated with Azure HDInsight is stored by default in Azure Blob storage. HDInsight requires that a Hadoop cluster processing MapReduce jobs must be co-located in the same region as the storage account that contains the data being analyzed. If you use the geo-replication feature available to Azure Storage, you can access your data in the secondary region where the data was replicated if the primary region is no longer available. You can create a Hadoop cluster in the region where the data has been replicated and continue processing it. For other availability considerations, see [HDInsight (Availability)](resiliency-technical-guidance-recovery-local-failures.md#other-azure-platform-services).

### SQL Reporting
Currently, recovering from the loss of an Azure region requires multiple SQL Reporting instances in different Azure regions. These SQL Reporting instances should access the same data, and that data should have its own recovery plan if a disaster occurs. You can also maintain external backup copies of the RDL file for each report.

### Azure Media Services
Azure Media Services has a different recovery approach for encoding and streaming. Typically, streaming is more critical during a regional outage. To prepare, you should have a Media Services account in two different Azure regions. The encoded content should be located in both regions. During a failure, you can redirect the streaming traffic to the alternate region. Encoding can be performed in any Azure region. If encoding is time-sensitive, for example during live event processing, you must be prepared to submit jobs to an alternate datacenter during failures.

### Virtual network
Configuration files provide the quickest way to set up a virtual network in an alternate Azure region. After configuring the virtual network in the primary Azure region, [export the virtual network settings](../virtual-network/virtual-networks-create-vnet-classic-portal.md) for the current network to a network configuration file. For an outage in the primary region, [restore the virtual network](../virtual-network/virtual-networks-create-vnet-classic-portal.md) from the stored configuration file. Then configure other cloud services, virtual machines, or cross-premises settings to work with the new virtual network.

## Checklists for disaster recovery
## Cloud services checklist
1. Review the "Cloud services" section of this article.
2. Create a cross-region disaster recovery strategy.
3. Understand trade-offs in reserving capacity in alternate regions.
4. Use traffic routing tools, such as Azure Traffic Manager.

## Virtual machines checklist
1. Review the "Virtual machines" section of this article.
2. Use [Azure Backup](https://azure.microsoft.com/services/backup/) to create application consistent backups across regions.

## Storage checklist
1. Review the "Storage" section of this article.
2. Don't disable geo-replication of storage resources.
3. Understand the alternate region for geo-replication if a failover occurs.
4. Create custom backup strategies for user-controlled failover strategies.

## Azure SQL Database checklist
1. Review the "Azure SQL Database" section of this article.
2. Use [Geo-Restore](../sql-database/sql-database-recovery-using-backups.md#geo-restore) or [Active Geo-Replication](../sql-database/sql-database-geo-replication-overview.md) as appropriate.

## SQL Server on Azure Virtual Machines checklist
1. Review the "SQL Server on Azure Virtual Machines" section of this article.
2. Use cross-region AlwaysOn Availability Groups or database mirroring.
3. Alternately use backup and restore to Blob storage.

## Service Bus checklist
1. Review the "Azure Service Bus" section of this article.
2. Configure a Service Bus namespace in an alternate region.
3. Consider custom replication strategies for messages across regions.

## App Service checklist
1. Review the "Azure App Service" section of this article.
2. Maintain site backups outside of the primary region.
3. If the outage is partial, attempt to retrieve current site with FTP.
4. Plan to deploy the site to new or existing site in an alternate region.
5. Plan configuration changes for the application and DNS CNAME records.

## HDInsight checklist
1. Review the "Azure HDInsight" section of this article.
2. Create a Hadoop cluster in the region with replicated data.

## SQL Reporting checklist
1. Review the "SQL Reporting" section of this article.
2. Maintain an alternate SQL Reporting instance in a different region.
3. Maintain a separate plan to replicate the target to that region.

## Media Services checklist
1. Review the "Azure Media Services" section of this article.
2. Create a Media Services account in an alternate region.
3. Encode the same content in both regions to support streaming failover.
4. Submit encoding jobs to an alternate region if a service disruption occurs.

## Virtual network checklist
1. Review the "Virtual network" section of this article.
2. Use exported virtual network settings to re-create it in another region.

## Next steps
This article is part of a series focused on [Azure resiliency technical guidance](resiliency-technical-guidance.md). The next article in this series focuses on [recovery from an on-premises datacenter to Azure](resiliency-technical-guidance-recovery-on-premises-azure.md).
