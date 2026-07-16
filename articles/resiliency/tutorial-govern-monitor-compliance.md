---
title: Tutorial - Govern and view compliance
description: This tutorial describes how to configure protection for your datasources, which are currently not protected by any solution using Resiliency in Azure.
ms.topic: tutorial
ms.date: 11/19/2025
ms.service: resiliency
ms.custom:
  - ignite-2023
  - ignite-2024
author: AbhishekMallick-MS
ms.author: v-mallicka
---


# Tutorial – Govern and view compliance

This tutorial describes how to govern and view the compliance state for your Azure environment in Resiliency in Azure.

[!INCLUDE [Resiliency rebranding announcement updates.](../../includes/resiliency-announcement.md)]

Resiliency in Azure helps you govern your Azure environment to ensure that all your resources are compliant from a backup and replication perspective. 

Some of the governance capabilities of Resiliency include: 

- View and assign Azure Policies for protection 
- View compliance of your resources on all the built-in Azure Policies for protection. 
- View all datasources that aren't configured for protection. 

## Supported scenarios 

Learn more the [supported and unsupported scenarios](resiliency-support-matrix.md). 

## Azure Policies for protection 

To view all the Azure Policies that are available for protection, go to **Governance** > **Azure Policies for protection**. This displays all the built-in and custom Azure Policy definitions for backup and Azure Site Recovery that are available for assignment to your subscriptions and resource groups. 

Selecting any of the definitions allows you to assign the policy to a scope. 
   :::image type="content" source="./media/tutorial-govern-monitor-compliance/protection-policy.png" alt-text="Screenshot shows protection policy for backup." lightbox="./media/tutorial-govern-monitor-compliance/protection-policy.png":::


## Protection compliance 

To view the compliance of your resources based on the various built-in policies that you assigned to your Azure environment, go to **Governance** > **Protection compliance**. You can view the percentage of resources that are compliant on all policies, and the policies that have one or more noncompliant resources. 

   :::image type="content" source="./media/tutorial-govern-monitor-compliance/protection-compliance.png" alt-text="Screenshot shows protection compliance page for backup." lightbox="./media/tutorial-govern-monitor-compliance/protection-compliance.png":::

Selecting **Protection inventory** > **Protectable resource** allows you to view all your resources that aren't configured for backup and replication.  

## Next steps 

[View protectable resources](./tutorial-view-protectable-resources.md).
