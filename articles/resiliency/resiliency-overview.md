---
title: What is Resiliency?
description: Resiliency is a cloud-native unified business continuity and disaster recovery (BCDR) management platform in Azure that enables you to manage your protection estate across solutions and environments.
ms.topic: overview
ms.service: resiliency
ms.date: 11/19/2025
ms.custom:
  - mvc
  - ignite-2023
  - ignite-2024
author: AbhishekMallick-MS
ms.author: v-mallicka
---
# What is Resiliency?
 
Resiliency in Azure is a cloud-native unified experience for resiliency posture management that enables you to manage your protection estate across solutions and environments. It provides a unified experience with consistent views, seamless navigation, and supporting information to provide a holistic view of your resiliency estate for better discoverability with the ability to do core activities.

[!INCLUDE [Resiliency rebranding announcement updates.](../../includes/resiliency-announcement.md)]

## Expanded scope and capabilities of Resiliency in Azure

Azure Business Continuity Center (ABCC) is now Resiliency in Azure, indicating a broader scope and expanded capabilities. The platform, originally focused on backup and disaster recovery, now includes built-in resiliency experiences that integrate Zonal Resiliency and High Availability, Backup & Disaster Recovery, and Ransomware Protection within a single solution.

Resiliency in Azure consolidates all aspects of resiliency into one platform:

- **Infrastructure Resiliency**: Protect from infrastructure outages with zonal resiliency.
- **Data Resiliency**: Ensure backup and disaster recovery meet Recovery Point Objective (RPO)/Recovery Time Objective (RTO).
- **Cyber Recovery**: Secure backups and enable at-scale recovery during cyberattacks.

Existing Azure Business Continuity Center capabilities continue to be available. Resiliency in Azure can be used to manage backup and disaster recovery at scale from a single interface across environments and solutions. It allows configuration of backups and replication, defining protection policies, monitoring operations, and reviewing configurations. Security features include immutability, soft delete, Multi-user authorization, Private endpoint, Customer Managed keys (CMK), and the Threat Detection for Virtual Machines (VMs) to help protect datasources from ransomware.

To try out the Zonal Resiliency feature, fill out [this enrollment form](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbR9NW9IkjD2RCnDQwsmIfABFUNU5MWUVaN1FWWDYxMFY1VTNBM1FPVDM3OC4u&route=shorturl).

## Why should I use Resiliency in Azure?

Some of the key benefits you get with Resiliency include:

- **Single pane of glass to manage BCDR protection**: Resiliency experiences are designed to function well across a large and distributed, Azure, and Hybrid environment. You can use Resiliency to efficiently manage backup and replication spanning multiple workload types, vaults, subscriptions, regions, and [Azure Lighthouse](/azure/lighthouse/overview) tenants. It enables you to identify gaps in your current protection estate and fix it. You can also understand your protection settings across multiple protection policies.

- **Action center**: Resiliency in Azure provides at scale views for your protection across Azure, Hybrid, and Edge environments along with the ability to perform the core actions across the solutions. 

- **At-scale and unified monitoring capabilities**: Resiliency in Azure provides at-scale unified monitoring capabilities across the solutions that help you to view [jobs](tutorial-monitor-operate.md), [alerts](tutorial-monitor-alerts-metrics.md), and [reports](tutorial-reporting-for-data-insights.md) across all vaults and manage them across subscriptions, resource groups, and regions from a single view.

- **BCDR protection posture**: Resiliency in Azure evaluates your current configuration and proactively notifies you of any gap in it with respect to Security configurations (currently applicable to Azure Backup). 

- **Audit Compliance**: With Resiliency in Azure, you can view and use built-in [Azure  Policies](/azure/governance/policy/overview) available for your BCDR management at scale and view compliance against the applied policies. You can also create custom Azure Policies for BCDR management and view compliance in Resiliency.

## What can I manage with Resiliency? 

Resiliency in Azure allows you to manage data sources protected across the solutions. You can manage these resources from different environments, such as Azure and on-premises. Learn about the [supported scenarios and limitations](resiliency-support-matrix.md).


## Get started

To get started with using Resiliency, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for Resiliency in the search box, and then go to the Resiliency dashboard.

   :::image type="content" source="./media/business-continuity-center-overview/search-business-continuity-center-service.png" alt-text="Screenshot shows how to search for Business Continuity Center in the Azure portal." lightbox="./media/business-continuity-center-overview/search-business-continuity-center-service.png":::

## Next steps

To learn more about Resiliency and how it works, see:

- [Design BCDR capabilities](/azure/cloud-adoption-framework/ready/landing-zone/design-area/management-business-continuity-disaster-recovery)
- [Review the protectable resources](tutorial-view-protectable-resources.md)
- [Review the protection summary](tutorial-monitor-protection-summary.md)
