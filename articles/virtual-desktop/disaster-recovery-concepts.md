---
title: Azure Virtual Desktop disaster recovery concepts
description: Understand what a disaster recovery plan for Azure Virtual Desktop is and how each plan works.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 04/01/2024
ms.author: helohr
---

# Azure Virtual Desktop disaster recovery concepts

Azure Virtual Desktop has grown tremendously as a remote and hybrid work solution in recent years. Because so many users now work remotely, organizations require solutions with high deployment speed and reduced costs. Users also need to have a remote work environment with guaranteed availability and resiliency that lets them access their virtual machines even during disasters. This document describes disaster recovery plans that we recommend for keeping your organization up and running.

To prevent system outages or downtime, every system and component in your Azure Virtual Desktop deployment must be fault-tolerant. Fault tolerance is when you have a duplicate configuration or system in another Azure region that takes over for the main configuration during an outage. This secondary configuration or system reduces the impact of a localized outage. There are many ways you can set up fault tolerance, but this article will focus on the methods currently available in Azure.

## Azure Virtual Desktop infrastructure

In order to figure out which areas to make fault-tolerant, we first need to know who's responsible for maintaining each area. You can divide responsibility in the Azure Virtual Desktop service into two areas: Microsoft-managed and customer-managed. Metadata like the host pools, application groups, and workspaces is controlled by Microsoft. The metadata is always available and doesn't require extra setup by the customer to replicate host pool data or configurations. We've designed the gateway infrastructure that connects people to their session hosts to be a global, highly resilient service managed by Microsoft. Meanwhile, customer-managed areas involve the virtual machines (VMs) used in Azure Virtual Desktop and the settings and configurations unique to the customer's deployment. The following table gives a clearer idea of which areas are managed by which party.

| Managed by Microsoft    | Managed by customer |
|-------------------------|-------------------|
| Load balancer           | Network           |
| Session broker          | Session hosts     |
| Gateway                 | Storage           |
| Diagnostics             | User profile data |
| Cloud identity platform | Identity          |

In this article, we're going to focus on customer-managed components, as these are settings you can configure yourself.

## Disaster recovery basics

In this section, we'll discuss actions and design principles that can protect your data and prevent having huge data recovery efforts after small outages or full-blown disasters. For smaller outages, following certain smaller steps can help prevent them from becoming bigger disasters. Let's go over some basic terms that will help you when you start setting up your disaster recovery plan.

When you design a disaster recovery plan, you should keep the following three things in mind:

- High availability: distributing infrastructure so smaller, more localized outages don't interrupt your entire deployment. Designing with HA in mind can minimize outage impact and avoid the need for a full disaster recovery.
- Business continuity: how an organization can keep operating during outages of any size.
- Disaster recovery: the process of getting back to operation after a full outage.

Azure has many built-in, free-of-charge features that can deliver high availability at many levels. The first feature is [availability sets](../virtual-machines/availability-set-overview.md), which distribute VMs across different fault and update domains within Azure. Next are [availability zones](../availability-zones/az-region.md), which are physically isolated and geographically distributed groups of data centers that can reduce the impact of an outage. Finally, distributing session hosts across multiple [Azure regions](../best-practices-availability-paired-regions.md) provides even more geographical distribution, which further reduces outage impact. All three features provide a certain level of protection within Azure Virtual Desktop, and you should carefully consider them along with any cost implications.

Basically, the disaster recovery strategy we recommend for Azure Virtual Desktop is to deploy resources across multiple availability zones within a region. If you need more protection, you can also deploy resources across multiple paired Azure regions.

## Design and implement a disaster recovery plan

Azure Virtual Desktop doesn't have any native feature for managing disaster recovery. The following table lists the technology areas you need to consider as part of your disaster recovery strategy and links to other Microsoft documentation that provides guidance for each area:

|Technology area |Documentation link |
|---------|---------|
|Active-passive vs active-active plans | [Active-Active vs. Active-Passive](/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr#active-active-vs-active-passive)   |
|Session host resiliency   | [Multiregion Business Continuity and Disaster Recovery](/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr)    |
|Disaster recovery plans    | [Multiregion Business Continuity and Disaster Recovery](/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr#architecture-diagrams)        |
|Azure Site Recovery     | [Failover and failback](/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr#failover-and-failback)         |
|Network connectivity    | [Multiregion Business Continuity and Disaster Recovery](/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr#prerequisites)   |
|User profiles    | [Design recommendations](/azure/cloud-adoption-framework/scenarios/azure-virtual-desktop/eslz-business-continuity-and-disaster-recovery#design-recommendations)     |
|Files share storage    |  [Storage](/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr#storage)       |
|Identity provider   | [Identity](/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr#identity)     |
|Backup    |  [Backup](/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr#backup)     |


## Next steps

For more in-depth information about disaster recovery in Azure, check out these articles:

- [Cloud Adoption Framework Azure Virtual Desktop business continuity and disaster recovery documentation](/azure/cloud-adoption-framework/scenarios/wvd/eslz-business-continuity-and-disaster-recovery)

- [Azure Virtual Desktop Handbook: Disaster Recovery](https://azure.microsoft.com/resources/azure-virtual-desktop-handbook-disaster-recovery/)
