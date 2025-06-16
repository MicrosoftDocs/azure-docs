---
title: Redundancy, replication, and backup
description: Learn about redundancy, replication, and backup, which are fundamental concepts of reliability.
ms.service: azure
ms.subservice: azure-reliability
ms.topic: conceptual
ms.date: 02/26/2025
ms.author: anaharris
author: anaharris-ms
ms.custom: subject-reliability
---

# What are redundancy, replication, and backup?

We often think about the cloud as a globally distributed, ubiquitous system. However, in reality the cloud is made up of hardware running in datacenters. Resiliency requires that you account for some of the risks associated with the physical locations in which your cloud-hosted components run.

This article provides a general introduction to redundancy, replication, and backup, which are methods that are used to create workloads that are resilient to physical risks causing service disruption, outage, or data loss.

*Redundancy* is the ability to maintain multiple identical copies of a service component, and to use those copies in a way that prevents any one component from becoming a single point of failure.

*Replication or data redundancy* is the ability to maintain multiple copies of data, called replicas.

*Backup* is the ability to maintain a timestamped copy of data that can be used to restore data that has been lost.

From a reliability perspective, an important way to mitigate many risks is to include some form of redundancy, replication, or backup in your [business continuity planning](./concept-business-continuity-high-availability-disaster-recovery.md).

> [!NOTE]
> This article doesn't provide design guidance or detailed information about individual Azure services. For information about how specific Azure services work from a reliability perspective, [see each service's reliability guide](./overview-reliability-guidance.md).

## Redundancy

Redundancy consists of deploying multiple *instances* of a *component*. While redundancy is straightforward to understand, in some situations, it can become complex to implement.

When beginning to understand redundancy, it's easiest to consider redundancy in relation to stateless components, which are components that don't store any data. Although most real-world solutions do require managing state, in this section, we discuss redundancy in terms of an example stateless application programming interface (API). The example API accepts input, does work on that input, and then returns an output, without storing any data. In the subsequent section, [Replication: Redundancy for data](#replication-redundancy-for-data), we'll add considerations for stateful redundancy.

### Scenario: Stateless redundancy

In this example, a stateless API component is deployed to a virtual machine. To avoid downtime for the API component if there's a hardware failure on the physical host, the example implements a redundant solution that:

- Deploys multiple copies of the API instance. 
- Implements a *load balancer* to distribute requests among API instances.

<!-- Art Library Source# ConceptArt-0-000-042 -->
:::image type="content" source="media/concept-redundancy-replication-backup/redundancy.svg" alt-text="Diagram showing three instances of a component, with a load balancer that distributes traffic between them." border="false":::

The load balancer monitors the health of each instance to send requests only to healthy instances.

<!-- Art Library Source# ConceptArt-0-000-042 -->
:::image type="content" source="media/concept-redundancy-replication-backup/redundancy-failure.svg" alt-text="Diagram showing three instances of a component, one of which has failed while the remaining two continue to function." border="false":::

### Redundancy considerations

When implementing redundant solutions, such as in the above scenario, it's important to take the following into consideration:

- **Resource costs.** By definition, redundancy involves having multiple copies of something, which increases the total cost to host the solution.

- **Performance.** The wider a geographic area you distribute the copies of the things, the more risks you help to mitigate. However, requests from clients will take longer to travel longer distances because they have to traverse more network infrastructure, and this increases the *network latency*.

   In most real-world situations, the network latency is inconsequential for short distances, like within a datacenter or even going between datacenters across a city. But if you distribute copies across a long distance, then network latency can become more significant.

- **Consistency of instances.** It's important to keep instances consistent with each other, and to avoid configuring instances individually because you might accidentally introduce differences between the instances. If there are differences between instances, then requests might be processed differently depending on which instance serves them. This can cause difficult-to-diagnose bugs and behaviors.

- **Distribution of work.** When you have multiple instances of a component, you need to distribute work among them. You might spread work across all of the instances equally, or you might send requests to a single *primary* instance and only use a secondary instance if the primary instance is unavailable.

   For components that receive incoming requests, load balancers are often used to send those requests to instances. However, sometimes components work independently and don't receive requests from clients, so in these situations, instances might need to coordinate their work with each other.

- **Health monitoring.** The health of each instance determines whether that instance can do its work, and health monitoring is important to enable fast recovery if there's a problem.

   Load balancers typically perform health monitoring. For components that don't include a load balancer, you might have an external component that watches the health of all instances, or each instance might monitor the health of other instances.

### Physical locations in the cloud

The need for redundancy is clear when you understand that, even in a cloud environment, an instance or a piece of data is stored in a specific physical location.

For example:

- A virtual machine runs in a single physical place at any one time.
- Data is stored at a specific physical location, such as on a solid-state drive (SSD) or hard disk that's connected to servers.

Even if there are multiple copies of a piece of data or instances of a component, each copy is tied to the physical hardware that it's stored on.

A cloud environment's physical location as whole can be organized into physical scopes. At each physical scope, there are potential risks that could compromise the components or data within that scope. Here's a non-exhaustive list risks that can be defined in terms of physical scope:

| Physical scope | Possible risk |
|---|---|
| A specific piece of hardware, like a disk or server | Hardware failure |
| A rack in a datacenter | Top-of-rack network switch outage |
| A datacenter | Problem with the building's cooling system |
| A group of datacenters, which in Azure is called an *availability zone* | City-wide electrical storm |
| The wider geographical area that the datacenter is in, such as a city, which is an Azure *region* | Widespread natural disaster |

From a reliability perspective, an important way to mitigate the risks associated with a physical scope is to spread instances of a component across different physical scopes. Azure services with built-in redundancy may offer you one or more of the following three ways to deploy redundant instances:

- *Local redundancy* places instances in multiple parts of a single Azure datacenter and protects against hardware failures that might affect a single instance. Local redundancy typically provides the lowest cost and latency. However, a datacenter failure could mean that all of the instances are unavailable.

- *Zone redundancy* spreads instances across multiple availability zones in a single Azure region. Zone redundancy protects against datacenter failures, in addition to hardware failures.

- *Geo-redundancy* places instances across multiple Azure regions and provides protection against large-scale regional outages. Geo-redundancy comes at a higher cost and requires consideration of your wider solution design and how you'll switch between instances of your components in each region. You also need to consider latency, which is described in [Synchronous and asynchronous replication](#synchronous-and-asynchronous-replication).

### How redundancy works in Azure: Compute services

Redundancy is employed in almost every part of Azure. As an example of how Azure implements redundancy, consider the services that run compute workloads.

In Azure, an individual virtual machine (VM) runs on a single physical host in an Azure datacenter. You can provide instructions to Azure to ensure that the VM runs in the place you expect, such as the region and availability zone, and in some situations, you might even want to [place it on a host that's dedicated to you](/azure/virtual-machines/dedicated-hosts).

It's common to run multiple instances of a virtual machine. In that scenario, you can choose to either manage them individually, or by using a [Virtual Machine Scale Set](/azure/virtual-machine-scale-sets/overview). When you use a scale set, you can still see the individual VMs that underpin it, but the scale set provides a range of capabilities to help to manage redundant VMs. These capabilities include automatic placement of the VMs based on rules you specify, such as by spreading them across [fault domains](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-manage-fault-domains) within the region or availability zone.

There are many other Azure compute services that rely on virtual machines to perform compute tasks. Compute services generally offer various redundancy settings that determine how the virtual machines are distributed. For example, a service might provide a zone redundancy setting, which you can enable to automatically distribute virtual machines across availability zones and configure load balancing.

## Replication: Redundancy for data

Redundancy, when applied to state (data), is called replication. With replication, you can maintain multiple real-time or near-real-time copies of live data, called *replicas*. To improve resiliency to risks, you can distribute replicas over different locations. If one replica becomes unavailable, the system might *fail over* so that another replica takes over its function.

There are different types of replication, and each places different priorities on data consistency, performance, and cost. Each replication type affects two key metrics used in discussions of business continuity: *recovery time objective* (RTO), which is the maximum amount of downtime you can tolerate in a disaster scenario, and *recovery point objective* (RPO), which is the maximum amount of data loss you can tolerate in a disaster scenario. To learn more about these metrics and how they relate to business continuity, see [What are business continuity, high availability, and disaster recovery?](./concept-business-continuity-high-availability-disaster-recovery.md).

Due to the importance of replication in meeting functional and performance requirements, most database systems and other data-storage products and services include some kind of replication as a tightly integrated feature. The types of replication they offer are usually based on their architecture and the ways they're intended to be used. To learn about the types of replication supported by Azure services, see [Azure service reliability guides](./overview-reliability-guidance.md).

> [!IMPORTANT]
> Replication isn't the same as backup. Replication synchronizes all changes among multiple replicas and doesn't maintain old copies of data.
>
> Suppose you accidentally delete some data. The deletion operation is replicated to each replica, and your data is deleted everywhere. In this situation, you probably need to restore the deleted data from a backup. Backup is described later in this article.

### Synchronous and asynchronous replication

When you replicate data, any changes to that data must be kept in sync between replicas. There are a couple of primary challenges when attempting to maintain consistency when data changes:

- *Latency.* Updating a replica takes time, and the further apart the replicas are, the longer it takes to transmit data across the distance between the replicas and receive an acknowledgment.

- *Change management*. Data may change while replicas are being synchronized and so managing the consistency of the data can become complex.

To address these challenges, there are two main ways that you can replicate data changes and manage data consistency:

- **Synchronous replication** requires updates to take place on multiple replicas before the update is considered complete. The following diagram illustrates how synchronous replication works:

    <!-- Art Library Source# ConceptArt-0-000-042 -->
    :::image type="content" source="media/concept-redundancy-replication-backup/synchronous-replication.svg" alt-text="Diagram showing synchronous replication between two replicas." border="false":::

    In this example, the following sequence of steps occurs:

    1. A client changes the data, and the request is sent to replica 1, which processes the request and stores the changed data.
    1. Replica 1 sends the changes to replica 2, which processes the request and stores the changed data.
    1. Replica 2 acknowledges the change back to replica 1.
    1. Replica 1 acknowledges the change back to the client.

    Synchronous replication can guarantee consistency, which means it can support an RPO of zero. However, this comes at the cost of performance. The further apart your replicas are geographically and the more network hops that need to be traversed, the more latency will be introduced by the replication process.

- **Asynchronous replication** happens in the background. The following diagram illustrates how asynchronous replication works:

    <!-- Art Library Source# ConceptArt-0-000-042 -->
    :::image type="content" source="media/concept-redundancy-replication-backup/asynchronous-replication.svg" alt-text="Diagram showing asynchronous replication between two replicas." border="false":::

    In this example, the following sequence of steps occurs:

    1. A client changes the data, and the request is sent to replica 1.
    1. Replica 1 processes the request, stores the changed data, and immediately acknowledges the change back to the client.
    1. At some point later in time, replica 1 synchronizes the change to replica 2.

    Because asynchronous replication happens outside of transaction flows, it removes replication as a constraint on application performance. However, if you need to fail over to another replica, it might not have the latest data, and so your RPO must be greater than zero. The exact RPO that asynchronous replication can support depends on the replication frequency.

### Replica roles

In many replication systems, replicas can take on different roles, which helps to coordinate changes to data and reduces the chance of conflicts.  There are two main types of roles, *active* and *passive*. There are two common ways of distributing replicas with these roles:

- **Active-passive** replication means that you have one *active* replica, which is responsible for acting as the source of truth. Any changes made to the data must be applied to that replica. Any other replicas act in a *passive* role, which means they receive updates to the data from the active replica, but they don't process changes directly from clients. Passive replicas aren't used for live traffic unless a *failover* occurs and the replicas' roles change. The following diagram shows an active-passive system with one passive replica:

    <!-- Art Library Source# ConceptArt-0-000-042 -->
    :::image type="content" source="media/concept-redundancy-replication-backup/replica-roles-active-passive.svg" alt-text="Diagram showing active-passive replication between two replicas." border="false":::

    In an active-passive system, the length of time that it takes to fail over determines the RTO. Commonly, the RTO for an active-passive system is measured in minutes.

    Some replication solutions also support *read-only replicas*, which enables you to read (but not write) data from the passive replicas. This approach can be useful to get more utilization from your replicas, such as when you need to perform analytics or reporting on data without affecting the primary replica that you're using for your application's transactional work. Several Azure services support read-only replicas, including [Azure Storage with the read access GRS (RA-GRS) replication type](../storage/common/storage-redundancy.md#read-access-to-data-in-the-secondary-region), and [Azure SQL Database active geo-replication](/azure/azure-sql/database/active-geo-replication-overview?view=azuresql&preserve-view=true).

- **Active-active** replication enables using multiple active replicas for live traffic simultaneously, and any of the replicas can process requests:

    <!-- Art Library Source# ConceptArt-0-000-042 -->
    :::image type="content" source="media/concept-redundancy-replication-backup/replica-roles-active-active.svg" alt-text="Diagram showing active-active replication between two replicas." border="false":::

    Active-active replication enables a high level of performance because the system can use the resources on all of the replicas. Active-active replication can support an RTO of zero in some situations. However, these benefits come at the cost of complicating data consistency, because simultaneous competing changes on multiple replicas might need to be reconciled asynchronously.

Complex data services can combine both active-active and active-passive replication. For example, they might deploy one set of replicas in one Azure region and another in a different region. Within each region, a single active replica serves requests while one or more passive replicas stand by for failover. Meanwhile, both regions operate in an active-active model, allowing traffic to be distributed across them.

### How replication works in Azure data services

Each Azure service that stores data offers some form of replication. However, each service may use a different approach that's specific to the service's architecture and intended uses.

As an example, Azure Storage can provide both synchronous and asynchronous replication through a set of capabilities:

- Multiple copies of your data are replicated synchronously within your primary region. You can choose whether to place replicas on different physical hardware in a single datacenter in locally redundant storage (LRS) or spread them across multiple availability zones for zone-redundant storage (ZRS).
- If your primary region is paired and you enable geo-redundant storage (GRS), the data is also replicated to the paired region. Because paired regions are geographically distant, this replication happens asynchronously to reduce the impact on your application throughput.
- You can choose to use zone-redundant storage and geo-redundant storage simultaneously by using the geo-zone-redundant storage tier (GZRS). Data within the region is replicated synchronously, and data across regions is replicated asynchronously.

For more information, see [Azure Storage redundancy](/azure/storage/common/storage-redundancy).

Another example is Azure Cosmos DB, which also provides replication. All Azure Cosmos DB databases have multiple replicas. When you distribute replicas globally, it supports multi-region writes, where clients can write to a replica in any of the regions you use. Those write operations are synchronously replicated within the region, and then replicated asynchronously across other regions. Azure Cosmos DB provides a conflict resolution mechanism in case there are write conflicts across the different replicas. To learn more, see [Global data distribution with Azure Cosmos DB - under the hood](/azure/cosmos-db/global-dist-under-the-hood).

If you use virtual machines, you can use [Azure Site Recovery](/azure/site-recovery/site-recovery-overview) to replicate virtual machines and their disks between availability zones or to another Azure region.

When you're designing an Azure solution, consult the [reliability guides for each service](./overview-reliability-guidance.md) to understand how that service provides redundancy and replication, including across different locations.

## Backup

Backup takes a copy of your data at a specific point in time. If there's a problem, you can *restore* the backup later. However, any changes to your data that happened after the backup was taken won't be in the backup, and might be lost.

By using backup, you can provide solutions to back up and recover your data within or to the Microsoft Azure cloud. Backup can protect you from a variety of risks, including:

- Catastrophic losses of hardware or other infrastructure.
- Data corruption and deletion.
- Cyberattacks, such as ransomware.

> [!IMPORTANT]
> It's critical that you test and verify your backup and restore processes regularly, alongside your other recovery steps. Testing ensures that your backups are comprehensive and error-free, and that your processes restore them correctly. Tests are also important to ensure your team understands the processes to follow. To learn more, see [Testing and drills](./concept-business-continuity-high-availability-disaster-recovery.md#testing-and-drills).

### How backup affects your requirements

When used as part of a disaster recovery strategy, backups typically support an RTO and RPO that are measured in hours:

- RTO is influenced by the time it takes for you to initiate and complete your recovery processes, including restoring a backup and validating that the restoration completed successfully. Depending on the size of the backup and how many backup files need to be read from, it's common to take several hours or even longer to fully restore a backup.

- RPO is influenced by the frequency of your backup process. If you take backups more frequently, it means you lose less data if you have to restore from a backup. However, backups require storage, and in some situations, they might affect the performance of the service while backups are being taken. For this reason, you need to consider the backup frequency and find the right balance for your organization's requirements. Backup frequency should be a consideration in business continuity planning.

Some backup systems support more complex backup requirements, including multiple backup tiers with different retention periods, and differential or incremental backups that are faster to save and consume less storage.

### Backup in Azure services

Many Azure services provide backup capabilities for your data.

[Azure Backup](/azure/backup/backup-overview) is a dedicated backup solution for several key Azure services, including virtual machines, Azure Storage, and Azure Kubernetes Service (AKS).

Also, many managed databases provide their own backup capabilities as part of the service, such as:

- [Azure SQL Database provides automated backups](/azure/azure-sql/database/automated-backups-overview).
- [Azure Cosmos DB provides both continuous and periodic backup capabilities](/azure/cosmos-db/online-backup-and-restore).
- [Azure Key Vault enables you to download a backup of the data in your vault](/azure/key-vault/general/backup).
- [Azure App Service provides both automatic and custom backup for web applications, and can also back up their databases](/azure/app-service/manage-backup).

## Backup vs. replication

Backup and replication each protect you against different risks, and the two approaches are complementary to each other.

Replication supports day-to-day resiliency and is commonly used in a high availability strategy. Some replication approaches require little to no downtime or data loss and support a low RTO and RPO. However, replication doesn't protect you against risks that result in data loss or corruption.

In contrast, backup is often a last line of defense against catastrophic risks. Backups often require a relatively high RTO and RPO, although the way you configure backups affects exactly how high they'll be. A total restore from a backup is often part of a disaster recovery plan.

## Preparing components for redundancy

When you design a system that uses redundancy as part of its architecture, it's important to also consider how to:

- Duplicate resource configuration for consistency.
- Manage capacity during instance failures by over provisioning.

### Duplicate resource configuration

In cloud environments, the configuration of each of your resources is critical. For example, when you create a network load balancer, you configure a variety of settings that affect how it works; and when you deploy a function by using Azure Functions, you configure settings related to security, performance, and application configuration settings. Every resource in Azure has some sort of configuration that drives its behavior.

When you're managing redundant copies of resources in different places, it's important that you control their configuration. Many settings will need to be set up the same way across each copy, so that the resources behave in the same way. But some settings might be different between each copy, such as references to a specific region's virtual network.

A common approach to keeping consistency in your resources is to use infrastructure as code (IaC), such as Bicep or Terraform. These tools enable you to create files that define a resource, and you can reuse those definitions for each instance of the resource. By using IaC, you can reduce the burden of creating and managing multiple instances of resources for resiliency purposes, and there are many other benefits as well. To learn more, see [What is infrastructure as code (IaC)?](/devops/deliver/what-is-infrastructure-as-code) and [Recommendations for using infrastructure as code](/azure/well-architected/operational-excellence/infrastructure-as-code-design).

### Manage capacity with over-provisioning

When an instance fails, your overall system capacity might be different from the capacity that's required during healthy operations. For example, suppose you typically have six instances of a web server to process your incoming web traffic, and those instances are spread equally among three Azure availability zones in a region:

<!-- Art Library Source# ConceptArt-0-000-042 -->
:::image type="content" source="media/concept-redundancy-replication-backup/capacity-management.svg" alt-text="Diagram showing three availability zones with two instances of the web server each, for a total of six instances of capacity." border="false":::

If an availability zone experiences an outage, you might temporarily lose two instances and be left with only four web server instances. If your application is typically busy and requires all six instances to keep up with your normal traffic, then running at a reduced capacity might affect the performance of your solution.

To prepare for failures, you can *over-provision* the capacity of your service. Over-provisioning allows the solution to tolerate some degree of capacity loss and still continue to function without degraded performance.

To over-provision instances of your web server to account for the failure of one availability zone, follow these steps:

1. Determine the number of instances your peak workload requires.
1. Retrieve the over-provision instance count by multiplying the peak workload instance count by a factor of [(zones/(zones-1)].
1. Round up the result to the nearest whole number.

> [!NOTE]
> The following table assumes that you're using three availability zones and you want to account for the loss in capacity of one of those zones. If your requirements are different, adjust the formula accordingly.

| Peak workload instance count | Factor of [(zones/(zones-1)] |Formula | Instances to provision (Rounded) |
|-------|---------|---------|--------|
|3|3/2 or 1.5|(3 x 1.5 = 4.5)|5 instances|
|4|3/2 or 1.5|(4 x 1.5 = 6)|6 instances|
|5|3/2 or 1.5|(5 x 1.5 = 7.5)|8 instances|
|6|3/2 or 1.5|(6 x 1.5 = 9)|9 instances|
|7|3/2 or 1.5|(7 x 1.5 = 10.5)|11 instances|
|8|3/2 or 1.5|(8 x 1.5 = 12)|12 instances|
|9|3/2 or 1.5|(9 x 1.5 = 13.5)|14 instances|
|10|3/2 or 1.5|(10 x 1.5 = 15)|15 instances|

In the preceding example, the peak workload requires six instances of the web server, so over-provisioning requires a total of nine instances:

<!-- Art Library Source# ConceptArt-0-000-042 -->
:::image type="content" source="media/concept-redundancy-replication-backup/capacity-management-over-provisioning.svg" alt-text="Diagram showing over-provisioning the web servers, for a total of nine instances of capacity." border="false":::

## Next steps

Learn about [failover and failback](./concept-failover-failback.md).
