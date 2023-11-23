---
title: Tutorial - Govern and view compliance
description: This tutorial describes how to configure protection for your data sources which are currently not protected by any solution using Azure Business Continuity center.
ms.topic: tutorial
ms.date: 10/19/2023
ms.service: azure-business-continuity-center
ms.custom:
  - ignite-2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---


# Tutorial – Govern and view compliance (preview)

Azure Business Continuity center  (preview) helps you govern your Azure environment to ensure that all your resources are compliant from a backup and replication perspective. 

These are some of the governance capabilities of Azure Business Continuity center: 

- View and assign Azure Policies for protection 
- View compliance of your resources on all the built-in Azure Policies for protection. 
- View all datasources that haven't been configured for protection. 

## Supported scenarios 

Learn more the [supported and unsupported scenarios](business-continuity-center-support-matrix.md). 

## Azure Policies for protection 

To view all the Azure Policies that are available for protection, select the **Azure Policies for protection** menu item. This displays all the built-in and custom Azure Policy definitions for backup and Azure Site Recovery that are available for assignment to your subscriptions and resource groups. 

Selecting any of the definitions allows you to assign the policy to a scope. 
   :::image type="content" source="./media/tutorial-govern-monitor-compliance/protection-policy.png" alt-text="Screenshot shows protection policy for backup." lightbox="./media/tutorial-govern-monitor-compliance/protection-policy.png":::


## Protection compliance 

Selecting the **Protection compliance** option helps you view the compliance of your resources based on the various built-in policies that you've assigned to your Azure environment. You can view the percentage of resources that are compliant on all policies, as well as the policies that have one or more non-compliant resources. 

   :::image type="content" source="./media/tutorial-govern-monitor-compliance/protection-compliance.png" alt-text="Screenshot shows protection compliance page for backup."  lightbox="./media/tutorial-govern-monitor-compliance/protection-compliance.png":::

Selecting the **Protectable resource** option allows you to view all your resources that haven't been configured for backup and replication.  

## Next steps 

[View protectable resources](./tutorial-view-protectable-resources.md).
