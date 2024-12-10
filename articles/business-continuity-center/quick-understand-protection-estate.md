---
title: Quickstart - Understand the protection estate in Azure Business Continuity Center
description: Learn how to identify the resources with no protection and the ones which are protected in Azure Business Continuity Center.
ms.topic: quickstart
ms.service: azure-business-continuity-center
ms.custom:
  - ignite-2024
ms.date: 11/19/2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Quickstart: Understand the protection estate

This quickstart describes how to identify the protected and unprotected resources/items in Azure Business Continuity Center.

As a Business Continuity and Disaster Recovery (BCDR) administrator, safeguarding your critical resources is a crucial step in your business continuity journey. In the event of an outage, malicious attack, or operational failure, it's essential that these resources can be recovered in either the primary or secondary region to prevent data loss.

Azure Business Continuity Center provides the following two key views to help you manage your protection details:

- **Protectable resources**: Lists the resources that are currently not protected. You can configure protection for them.
- **Protected items**: Shows the resources that are already protected. Allows you to perform actions such as recovery and failover.


## Identify unprotected resources

To identify the resources that are currently not protected, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to the **Business Continuity Center** > **Protection inventory** > **Protectable resources**.

   :::image type="content" source="./media/quick-understand-protection-estate/select-protectable-resources.png" alt-text="Screenshot shows the selection of Protectable resources." lightbox="./media/quick-understand-protection-estate/select-protectable-resources.png":::

   A list of resources that  aren't protected appears. This list includes the details by solution across subscription, resource groups, location, type, and more along with their properties. To view the details of each resource, select a *resource name*, *subscription*, or *resource group* from the list.
 
   > [!Note]
   >
   >- Currently, you can view the *unprotected Azure resources* under **Protectable resources** only.
   >- You can also query information on your protectable Azure resources by  using Azure Resource Graph (ARG) at no additional cost. ARG is an Azure service designed to extend Azure Resource Management. It aims to provide efficient resource exploration with the ability to query at scale across a given set of subscriptions.

   To check for the protectable Azure resources using Azure Resource Graph (ARG), use the *sample query* provided in the Azure portal by selecting **Open query**.
 
   :::image type="content" source="./media/quick-understand-protection-estate/sample-query-to-find-protectable-resources.png" alt-text="Screenshot shows how to open sample query to find protectable resources." lightbox="./media/quick-understand-protection-estate/sample-query-to-find-protectable-resources.png":::

## Identify protected items

To view the protected items, go to **Business Continuity Center** > **Protection inventory** > **Protected items**.

:::image type="content" source="./media/quick-understand-protection-estate/view-protected-items.png" alt-text="Screenshot shows how to view protected items." lightbox="./media/quick-understand-protection-estate/view-protected-items.png":::

The list of all the protected items across the supported solution, subscription, resource groups, location, type, and so on, appears along with their protection status.


## Next step

[Configure protection for resources](tutorial-configure-protection-datasource.md).
