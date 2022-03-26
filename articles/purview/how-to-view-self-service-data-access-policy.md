---
title: View self-service policies 
description: This article describes how to view auto-generated self-service policies 
author: bjspeaks
ms.author: blessonj
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 09/27/2021
---
# How to view self-service data access policies

In an Azure Purview catalog, you can now request access to datasets and self-service policies get auto-generated if the  data source is enabled for **data use governance**.

This guide describes how to view self-service data access policies that have been auto-generated when data access request is approved.

## Prerequisites

> [!IMPORTANT]
> To view self-service policies, make sure that the below prerequisites are completed.

Self-service policies must exist for them to be viewed. Refer to the articles below to create
self-service policies

- [Enable Data Use Governance](./tutorial-data-owner-policies-storage.md)
- [Create a self-service data access workflow](./how-to-workflow-self-service-data-access-hybrid.md)
- [Approve self-service data access request](how-to-workflow-manage-requests-approvals.md)

## Permission

Only users with **Policy Admin** privilege can delete self-service data access policies.

## Steps to view self-service data access policies

### Step 1: Open the Azure portal and launch the Azure purview studio 

The Azure Purview studio can be launched as shown below or by using using the url directly.

:::image type="content" source="./media/how-to-view-self-service-data-access-policy/Purview-Studio-launch-pic-1.png" alt-text="Launch the Azure Purview studio.":::

### Step 2: Open the policy management tab

Click the policy management tab to launch the self-service access policies.

:::image type="content" source="./media/how-to-view-self-service-data-access-policy/Purview-Studio-self-service-tab-pic-2.png" alt-text="Click open the policy management tab":::

### Step 3: Open the self-service access policies tab

:::image type="content" source="./media/how-to-view-self-service-data-access-policy/Purview-Studio-self-service-tab-pic-3.png" alt-text="Click open the self-service access policies tab":::


### Step 4: View the self-service policies

The policies can be sorted by the different fields.The policy can be filtered based on data source type and sorted by any of the columns on display

:::image type="content" source="./media/how-to-view-self-service-data-access-policy/Purview-Studio-self-service-tab-pic-4.png" alt-text="sorting and filtering display data":::

## Next steps

- [Self-service data access policy](./concept-self-service-data-access-policy.md)
