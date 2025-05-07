---
title: What is Azure Business Continuity Center?
description: Azure Business Continuity Center is a cloud-native unified business continuity and disaster recovery (BCDR) management platform in Azure that enables you to manage your protection estate across solutions and environments.
ms.topic: overview
ms.service: azure-business-continuity-center
ms.date: 11/19/2024
ms.custom:
  - mvc
  - ignite-2023
  - ignite-2024
author: jyothisuri
ms.author: jsuri
---
# What is Azure Business Continuity Center?
 
The Azure Business Continuity Center is a cloud-native unified business continuity and disaster recovery (BCDR) management platform in Azure that enables you to manage your protection estate across solutions and environments. It provides a unified experience with consistent views, seamless navigation, and supporting information to provide a holistic view of your business continuity estate for better discoverability with the ability to do core activities.

## Why should I use Azure Business Continuity Center?

Some of the key benefits you get with Azure Business Continuity Center include:

- **Single pane of glass to manage BCDR protection**: Azure Business Continuity Center is designed to function well across a large and distributed, Azure, and Hybrid environment. You can use Azure Business Continuity Center to efficiently manage backup and replication spanning multiple workload types, vaults, subscriptions, regions, and [Azure Lighthouse](/azure/lighthouse/overview) tenants. It enables you to identify gaps in your current protection estate and fix it. You can also understand your protection settings across multiple protection policies.

- **Action center**: Azure Business Continuity Center provides at scale views for your protection across Azure, Hybrid, and Edge environments along with the ability to perform the core actions across the solutions. 

- **At-scale and unified monitoring capabilities**: Azure Business Continuity (ABC) center provides at-scale unified monitoring capabilities across the solutions that help you to view [jobs](tutorial-monitor-operate.md), [alerts](tutorial-monitor-alerts-metrics.md), and [reports](tutorial-reporting-for-data-insights.md) across all vaults and manage them across subscriptions, resource groups, and regions from a single view.

- **BCDR protection posture**: ABC center evaluates your current configuration and proactively notifies you of any gap in it with respect to Security configurations (currently applicable to Azure Backup). 

- **Audit Compliance**: With ABC center, you can view and use built-in [Azure  Policies](/azure/governance/policy/overview) available for your BCDR management at scale and view compliance against the applied policies. You can also create custom Azure Policies for BCDR management and view compliance in Azure Business Continuity Center.

## What can I manage with ABC center? 

Azure Business Continuity center allows you to manage data sources protected across the solutions. You can manage these resources from different environments, such as Azure and on-premises. Learn about the [supported scenarios and limitations](business-continuity-center-support-matrix.md).


## Get started



To get started with using Azure Business Continuity Center:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Search for Business Continuity center in the search box, and then go to the Azure Business Continuity Center dashboard.

   :::image type="content" source="./media/business-continuity-center-overview/search-business-continuity-center-service.png" alt-text="Screenshot shows how to search for Business Continuity Center in the Azure portal." lightbox="./media/business-continuity-center-overview/search-business-continuity-center-service.png":::

## Next steps

To learn more about Azure Business Continuity Center and how it works, see:

- [Design BCDR capabilities](/azure/cloud-adoption-framework/ready/landing-zone/design-area/management-business-continuity-disaster-recovery)
- [Review the protectable resources](/azure/backup/backup-architecture)
- [Review the protection summary]()
