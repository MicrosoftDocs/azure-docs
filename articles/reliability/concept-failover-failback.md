---
title: Failover and failback
description: Learn about failover and failback, which are fundamental concepts of reliability.
ms.service: azure
ms.subservice: azure-reliability
ms.topic: conceptual
ms.date: 02/26/2025
ms.author: anaharris
author: anaharris-ms
ms.custom: subject-reliability
---

# What are failover and failback?

This article provides a general overview of how both *failover* and *failback* operate in a cloud environment. However, to understand failover, you should first understand redundancy and replication. To learn about those concepts before continuing with this article, see [Redundancy, replication, and backup](./concept-redundancy-replication-backup.md).

A common reason for maintaining redundant copies of both applications and data replicas is to be able to perform a *failover*. With failover, you can redirect traffic and requests from unhealthy instances to healthy ones. Then, once the original instances become healthy again, you can perform a *failback* to return to the original configuration.

## Active and passive instance roles

In the context of failover, an *instance* can be a single component, like a database, or a collection of multiple components that make up a service deployment in a region. Over an entire solution, you might fail over different parts of that solution in different ways and in different situations.

A component, or collection of components that's configured for failover and failback, requires multiple instances. Each of those instances assumes a particular *role*:

- *Primary* or *active* instances actively do work, like serving incoming requests from clients. Typically there's one primary instance at a time.
- *Secondary* or *passive* instances are inactive, but are ready to be switched to become the primary if required. There might be several secondary instances.

There are a number of ways to configure passive instances. Each way involves tradeoffs between recovery time and other factors, like cost and operational complexity:

- *Hot standbys*, which are designed to be ready to accept production traffic at any time.
- *Warm standbys*, which are designed to be nearly ready to accept production traffic, but that might require some configuration changes or scaling operations to complete before they can accept traffic.
- *Pilot light standbys*, which are partially deployed in a minimal configuration, and require significant preparation to be completed before they can accept production traffic.
- *Cold standbys*, which might not be deployed at all, and rely on components to be deployed before they can accept production traffic.

> [!TIP]
> Some solutions are built to use an *active-active* approach, which means multiple instances all serve requests. An active-active system doesn't require failover, because all of the instances are actively serving requests at all times.

## Failover scopes

Different situations require different failover strategies. To illustrate these possible strategies, consider an example solution that consists of an application that accesses data from a database. You configure the solution for failover by creating redundant copies of your application server and multiple replicas of the database. Next, you configure:

- Zone redundancy by placing copies and replicas in different availability zones within an Azure region.
- Geo redundancy by using a global load balancer to fail over between regions.

Here's a simplified diagram that illustrates the overall architecture in normal operations:

<!-- Art Library Source# ConceptArt-0-000-042 -->
:::image type="content" source="media/concept-failover-failback/failover-normal.svg" alt-text="Diagram showing a solution architecture that uses multiple replicas of a database in different availability zones, in two separate regions." border="false":::

Different situations might trigger different failover events in this solution. Each of these corresponds to a *failover scope*, which represents the granularity of the components that fail over:

- **A database replica failover** might occur when the active database replica becomes unavailable. The passive replica is promoted to become the active replica. Typically, applications can quickly reroute their requests to the new active replica:

    <!-- Art Library Source# ConceptArt-0-000-042 -->
    :::image type="content" source="media/concept-failover-failback/failover-replica.svg" alt-text="Diagram showing the solution architecture where the passive replica has been promoted to be the new active replica." border="false":::

- **An availability zone failover** might occur if a complete availability zone experiences an outage. This type of outage requires all traffic to be routed to the web server in the remaining zone, and also ensures that the database replica in the surviving zone becomes the active replica if it's not already:

    <!-- Art Library Source# ConceptArt-0-000-042 -->
    :::image type="content" source="media/concept-failover-failback/failover-zone.svg" alt-text="Diagram showing the solution architecture where one availability zone is unavailable." border="false":::

- **A region failover** might occur if there's a catastrophic loss of the entire primary Azure region.

    <!-- Art Library Source# ConceptArt-0-000-042 -->
    :::image type="content" source="media/concept-failover-failback/failover-region.svg" alt-text="Diagram showing the solution architecture where one region is unavailable." border="false":::

While each of these scopes provides for a type of failover, they might have distinct failover requirements and processes. Also, Microsoft might be responsible for some failover scopes, such as when you use zone-redundant services, while you might be responsible for failover at wider scopes, like failing over between Azure regions.

## Failover and business continuity planning

Part of business continuity planning is designing your failover strategies, including the different scopes at which you can fail over.

Generally, your business continuity plans should include automated failover procedures within or between availability zones. This type of failover forms part of your high availability strategy. For example, if the active replica of a database fails, an automated process can promote a passive replica to become the active replica. Then, the web servers communicate with the new active replica. Similarly, if an availability zone fails, many solutions are built to automatically recover by using the remaining zones.

Different failover procedures are employed for disaster scenarios, such as in the unlikely event of a full region outage. In the case of a region outage, you might switch the incoming web requests to use the second region, as well as trigger a failover of the database to a replica in the secondary region.

Keep in mind that including failover procedures in your business continuity planning requires you to do more detailed design and testing. For more information, see [What are business continuity, high availability, and disaster recovery?](./concept-business-continuity-high-availability-disaster-recovery.md).

## Planned and unplanned failovers

*Unplanned failovers* are those that are performed during an outage of a component, so that you can restore service by using another instance. Unplanned failovers sometimes result in downtime or data loss, depending on how a solution is designed. Unplanned failovers require something to detect the failure and to make a decision about when to trigger the failover.

In contrast, *planned failovers* are those that you proactively trigger. You might do this in anticipation of something happening, like a virtual machine that's going to be patched and rebooted. Planned failovers might have lower tolerance for downtime and data loss, because they're part of regular maintenance procedures.

## How failover works

Failover generally consists of the following steps, which can be performed manually or by an automated system. The specific details for each of these steps depend on the particular system.

1. **Detect a failure (unplanned failovers only).** An automated failover requires that something detects when an instance is unavailable, which is typically based on some sort of health check. Different services define their health in different ways. For example, some services proactively send *heartbeat* events between instances. Others require a separate component to probe each instance at a regular interval. It often takes some time for health monitors to detect an instance has failed, and it's often important to give a grace period in case the instance was simply busy and couldn't respond.

1. **Choose to fail over.** At some point a decision will be made to perform a failover. The decision could be made by an automated tool, or manually. Your organization's risk tolerance might affect how quickly this decision is made. If you have a low tolerance for risk, you might choose to fail over quickly if there's any indication of a problem. If you have a higher risk tolerance, you might choose to wait to see if the issue can be resolved before failing over.

1. **Select a new primary instance.** One of the remaining instances should become the new primary.

    In some situations, you might have predefined which instance should become the new primary, or you might only have one instance to switch to.

    In other situations, there's an automated process by which the system selects a new primary instance. There are a number of *consensus algorithms* used in distributed computing, including for *leader election*. These algorithms are implemented within the relevant services, such as databases. In some systems, it's important for each instance to be made aware of the new primary replica and so the results of the selection are announced to each replica automatically.

1. **Redirect requests.** Configure your environment so that requests are directed to the healthy instances, or to the new primary instance.

    To achieve this, you might need to update other systems so they know where to send requests. This might involve updating a load balancing system to exclude the unhealthy instance. In other situations, the domain name system (DNS) is commonly used as a way to send requests to an active instance of a system. As part of the failover process, you typically need to update DNS records so that requests are routed to the new primary instance. DNS has the concept of a *time-to-live* (TTL), which instructs clients on how often they should check for updated DNS records. If your TTL is set to a long value, it can take time for clients to receive information about the failover, and they might continue to send requests to the old primary.

Because failover processes can include delays, it's important for you to plan your failover procedures to meet your requirements for downtime (your recovery point objective, or RTO) and data loss (your recovery point objective, or RPO). To learn more, see [What are business continuity, high availability, and disaster recovery?](./concept-business-continuity-high-availability-disaster-recovery.md).

## Failback

*Failback* is the process of reinstating and redirecting traffic back to the original primary instance.

In some situations, it's not necessary to fail back at all because each instance is equally capable of acting as the primary. However, there are some situations where it's important to fail back, such as when you need to run your applications from a particular Azure region and have failed over to another region temporarily during a regional outage.

Sometimes, failback is handled in the same way as a failover. However, failback can also be more complex than failover, for several reasons:

- **Data synchronization issues.** During, and even after, a regular failover, the previous primary instance might have still performed some work or written some data to a data store. Part of the failback process is to ensure data consistency and integrity across your solution, including managing any conflicts or duplications between the primary and secondary instances.

    It's common for data synchronization issues to require manual intervention. If you don't need the conflicting data, you might choose to reset the database or other state.

- **Remediation steps.** If any remediation steps were attempted on the primary before failover occurred, they might have left the primary instance in an unknown state.

    If there's a risk of the primary instance being in an inconsistent state, you might need to destroy and redeploy the primary instance so that it's at a known good state before you fail back.

- **Extra downtime.** Downtime during the failback process can be longer than during a failover because of reconfigurations required or operations to restore data consistency.

    You can mitigate this issue by running failback processes during a maintenance window or by advising users of the change ahead of time. Also, you might be able to perform some of the preparatory operations while the system is online, and minimize the downtime required.

- **Risk tolerance.** If the failover occurred because of an outage, the organization's tolerance for downtime or other risks during failback can be lower.

    Business stakeholders should be kept informed of the situation throughout the process, and should be made fully aware of the need for failback and the consequences of the failback procedures. You might be able to negotiate a suitable time to make the changes.

## Failover and failback in Azure services

While it's important to understand how failover in general works, keep in mind that each Azure service can approach failover and failback differently. For information about how specific Azure services work from a reliability perspective, [see each service's reliability guide](./overview-reliability-guidance.md).

Many Azure services handle certain types of failover automatically. For example, when you use Azure services that are configured to be zone-redundant, Microsoft automatically performs failover between availability zones for you. To learn more, see [What are availability zones?](./availability-zones-overview.md) and the [Azure service reliability guides](./overview-reliability-guidance.md).

If you use virtual machines, [Azure Site Recovery](/azure/site-recovery/site-recovery-overview) replicates virtual machines and their disks between availability zones or to another Azure region, and can perform failover for you.

When you design your own solution that combines multiple Azure services together, your failover requirements might become more complex. Suppose you're designing a solution with an application tier and database, and you want to create a multi-region active/passive architecture. During an outage in the primary region, it's important that your application and database both fail over to the secondary region together. Depending on the exact services you use, you might need to plan your own failover approach to switch between the deployments in each region. Azure provides global traffic routing and load balancing through Azure Front Door and Azure Traffic Manager, and you can select the technology that meets your failover requirements. Each service supports monitoring the health of each regional instance of your application and you can configure it to automatically reroute traffic to the healthy instance.

## Next steps

- Learn about the [shared responsibility for reliability](./concept-shared-responsibility.md).
- Learn about [Recommendations for highly available multi-region design](/azure/well-architected/reliability/highly-available-multi-region-design) in the Azure Well-Architected Framework.
