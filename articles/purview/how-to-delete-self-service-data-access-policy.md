---
title: Delete self-service policies 
description: This article describes how to delete auto-generated self-service policies 
author: bjspeaks
ms.author: blessonj
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: how-to
ms.date: 09/27/2021
---
# How to delete self-service data access policies

In an Azure Purview catalog, you can now request access to datasets and self-service policies get auto-generated if the  data source is enabled for **data use governance**.

This guide describes how to delete self-service data access policies that have been auto-generated when data access request is approved.

## Prerequisites

> [!IMPORTANT]
> To delete self-service policies, make sure that the below prerequisites are completed.

Self-service policies must exist for them to be deleted. Refer to the articles below to create
self-service policies

- [Enable Data Use Governance](./tutorial-data-owner-policies-storage.md)
- [Create a self-service data access workflow](./how-to-workflow-self-service-data-access-hybrid.md)
- [Approve self-service data access request](how-to-workflow-manage-requests-approvals.md)

## Permission

Only users with **Policy Admin** privilege can delete self-service data access policies.

## Steps to delete self-service data access policies

### Step 1: Open the Azure portal and launch the Azure purview studio 

The Azure Purview studio can be launched as shown below or by using using the url directly.

:::image type="content" source="./media/how-to-delete-self-service-data-access-policy/Purview-Studio-launch-pic-1.png" alt-text="Launch the Azure Purview Studio":::

### Step 2: Open the policy management tab

Click the policy management tab to launch the self-service access policies.

:::image type="content" source="./media/how-to-delete-self-service-data-access-policy/Purview-Studio-self-service-tab-pic-2.png" alt-text="Click policy management tab":::

### Step 3: Open the self-service access policies tab

:::image type="content" source="./media/how-to-delete-self-service-data-access-policy/Purview-Studio-self-service-tab-pic-3.png" alt-text="Click open the self-service access policies tab":::


### Step 4: Select the policies to be deleted

The policies can be sorted by the different fields. once sorted, select the policies that need to be deleted.

:::image type="content" source="./media/how-to-delete-self-service-data-access-policy/Purview-Studio-selecting-policy-pic-4.png" alt-text="select the policy to be deleted":::

### Step 5: Delete the policy

Click the delete button to delete policies that need to be removed. 

:::image type="content" source="./media/how-to-delete-self-service-data-access-policy/Purview-Studio-press-delete-pic-5.png" alt-text="Delete policy":::

click **OK** on the confirmation dialog box to delete the policy. Refresh the screen to check whether the policies have been deleted.

## Next steps

- [Self-service data access policy](./concept-self-service-data-access-policy.md)
