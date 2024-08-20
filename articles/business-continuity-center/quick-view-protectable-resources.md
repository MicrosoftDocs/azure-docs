---
title: Quickstart - View protectable resources in Azure Business Continuity Center
description: Learn how to view protectable resources in Azure Business Continuity Center.
ms.topic: quickstart
ms.service: azure-business-continuity-center
ms.date: 05/15/2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Quickstart: Identify the protection status of resources in Azure Business Continuity Center

This quickstart describes how to identify the protection status of resources in Azure Business Continuity Center.

As a Business Continuity and Disaster Recovery (BCDR) administrator, safeguarding your critical resources is a crucial step in your business continuity journey. In the event of an outage, malicious attack, or operational failure, it's essential that these resources can be recovered in either the primary or secondary region to prevent data loss.

Azure Business Continuity Center provides two key views to help you manage your protection details:

- **Protectable resources**: This lists the resources that are currently not protected, allowing you to configure protection for them.
- **Protected items**: This shows the data sources that are already protected, enabling you to perform actions such as recovery and failover.


## Identify unprotected resources

To identify the resources that are currently not protected, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to the **Business Continuity Center** > **Protection inventory** > **Protectable resources**.

   :::image type="content" source="./media/quick-view-protectable-resources/select-protectable-resources.png" alt-text="Screenshot shows the selection of Protectable resources." lightbox="./media/quick-view-protectable-resources/select-protectable-resources.png":::

   A list of resources appears that  aren't protected by any solution across subscription, resource groups, location, type, and more along with their properties. To view the details of each resource, select a *resource name*, *subscription*, or *resource group* from the list.
 
   > [!Note]
   >
   >- Currently, you can view the *unprotected Azure resources* under **Protectable resources** only.
   >- You can also query information on your protectable Azure resources at no additional cost using Azure Resource Graph (ARG). ARG is an Azure service designed to extend Azure Resource Management. It aims to provide efficient resource exploration with the ability to query at scale across a given set of subscriptions.

   Alternatively, you can check for the protectable Azure resources using Azure Resource Group (ARG). To do so, use the *sample query* provided in the Azure portal by selecting *Open query*.
 
   :::image type="content" source="./media/quick-view-protectable-resources/sample-query-to-find-protectable-resources.png" alt-text="Screenshot shows how to open sample query to find protectable resources." lightbox="./media/quick-view-protectable-resources/sample-query-to-find-protectable-resources.png":::

## Identify protected items

To view the protected items, go to **Business Continuity Center** > **Protection inventory** > **Protected items**.

:::image type="content" source="./media/quick-view-protectable-resources/view-protected-items.png" alt-text="Screenshot shows how to view protected items." lightbox="./media/quick-view-protectable-resources/view-protected-items.png":::

The list of all the protected items across the supported solution, subscription, resource groups, location, type, and so on, appears along with their protection status.








## Next step

> [!div class="nextstepaction"]
> [Configure protection for data sources](tutorial-configure-protection-datasource.md).
