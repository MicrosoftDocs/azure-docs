---
title: Azure Virtual Desktop disaster recovery concepts
description: Learn how to design and implement a disaster recovery plan for Azure Virtual Desktop to keep your organization up and running.
ms.topic: how-to
author: sipastak
ms.author: sipastak
ms.date: 06/28/2024
---

# Azure Virtual Desktop business continuity and disaster recovery concepts

Many users now work remotely, so organizations require solutions with high availability, rapid deployment speed, and reduced costs. Users also need to have a remote work environment with guaranteed availability and resiliency that lets them access their resources even during disasters.

To prevent system outages or downtime, every system and component in your Azure Virtual Desktop deployment must be fault-tolerant. Fault tolerance is when you have a duplicate configuration or system in another Azure region that takes over for the main configuration during an outage. This secondary configuration or system reduces the impact of a localized outage. There are many ways you can set up fault tolerance, but this article focuses on the methods currently available in Azure for dealing with business continuity and disaster recovery (BCDR).

Responsibility for components that make up Azure Virtual Desktop are divided between those components that are Microsoft-managed, and those components that are customer-managed, or partner managed.

The following components are customer-managed or partner-managed:

- Session host virtual machines
- Profile management, usually with FSLogix
- Applications
- User data
- User identities

To learn about the Microsoft-managed components and how they're designed to be resilient, see [Azure Virtual Desktop service architecture and resilience](service-architecture-resilience.md).

## Business continuity and disaster recovery basics

When you design a disaster recovery plan, you should keep the following three things in mind:

- High availability: distributed infrastructure so smaller, more localized outages don't interrupt your entire deployment. Designing with high availability in mind can minimize outage impact and avoid the need for a full disaster recovery.
- Business continuity: how an organization can keep operating during outages of any size.
- Disaster recovery: the process of getting back to operation after a full outage.

Azure Virtual Desktop doesn't have any native features for managing disaster recovery scenarios, but you can use many other Azure services for each scenario depending on your requirements, such as [Availability sets](../virtual-machines/availability-set-overview.md), [availability zones](../availability-zones/az-region.md), Azure Site Recovery, and [Azure Files data redundancy](../storage/files/files-redundancy.md) options for user profiles and data.

You can also distribute session hosts across multiple [Azure regions](../best-practices-availability-paired-regions.md) provides even more geographical distribution, which further reduces outage impact. All these and other Azure features provide a certain level of protection within Azure Virtual Desktop, and you should carefully consider them along with any cost implications.

We have further documentation that goes into much more detail about each of the technology areas you need to consider as part of your business continuity and disaster recovery strategy and how to plan for and mitigate disruption to your organization based on your requirements. The following table lists the technology areas you need to consider as part of your disaster recovery strategy and links to other Microsoft documentation that provides guidance for each area:

| Technology area | Documentation link |
|--|--|
| Active-passive vs active-active plans | [Active-Active vs. Active-Passive](/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr#active-active-vs-active-passive) |
| Session host resiliency | [Multiregion Business Continuity and Disaster Recovery](/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr) |
| Disaster recovery plans | [Multiregion Business Continuity and Disaster Recovery](/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr#architecture-diagrams) |
| Azure Site Recovery | [Failover and failback](/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr#failover-and-failback) |
| Network connectivity | [Multiregion Business Continuity and Disaster Recovery](/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr#prerequisites) |
| User profiles | [Design recommendations](/azure/cloud-adoption-framework/scenarios/azure-virtual-desktop/eslz-business-continuity-and-disaster-recovery#design-recommendations) |
| Files share storage | [Storage](/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr#storage) |
| Identity provider | [Identity](/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr#identity) |
| Backup | [Backup](/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr#backup) |

## Related content

For more in-depth information about disaster recovery in Azure, check out these articles:

- [Cloud Adoption Framework: Azure Virtual Desktop business continuity and disaster recovery documentation](/azure/cloud-adoption-framework/scenarios/wvd/eslz-business-continuity-and-disaster-recovery)

- [Azure Architecture Center: Multiregion Business Continuity and Disaster Recovery (BCDR) for Azure Virtual Desktop](/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr)
