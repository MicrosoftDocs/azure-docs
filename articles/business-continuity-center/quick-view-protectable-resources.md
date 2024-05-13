---
title: Quickstart - View protectable resources in Azure Business Continuity Center
description: Learn how to view protectable resources in Azure Business Continuity Center.
ms.topic: quickstart
ms.service: azure-business-continuity-center
ms.date: 05/15/2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Quickstart: View protectable resources

This quickstart describes how to view protectable resources in Azure Business Continuity Center.

As a business continuity and disaster recovery admin, first identify your critical resources that don't have backups or replications configured. If the protection isn't configured, you can't recover these resources in primary or secondary region in case of any outage, malicious attack, or operational failures, which lead to data loss.

## View unprotected resources

To check the resources that require protection, follow these steps:

1. Go to the **Azure Business Continuity Center** from the [Azure portal](https://portal.azure.com/).

2. Under the **Protection inventory** section, select **Protectable resources**.

   :::image type="content" source="./media/quick-view-protectable-resources/select-protectable-resources.png" alt-text="Screenshot shows the selection of Protectable resources." lightbox="./media/quick-view-protectable-resources/select-protectable-resources.png":::

   A list of resources appears that  aren't protected by any solution across subscription, resource groups, location, type, and more along with their properties. To view the details of each resource, select a *resource name*, *subscription*, or *resource group* from the list.
 
   > [!Note]
   >
   >- Currently, you can view the *unprotected Azure resources* under **Protectable resources** only.
   >- You can also query information on your protectable Azure resources at no additional cost using Azure Resource Graph (ARG). ARG is an Azure service designed to extend Azure Resource Management. It aims to provide efficient resource exploration with the ability to query at scale across a given set of subscriptions.

   Alternatively, you can check for the protectable Azure resources using ARG. To do so, use the *sample query* provided by selecting *Open query*.
 
   :::image type="content" source="./media/quick-view-protectable-resources/sample-query-to-find-protectable-resources.png" alt-text="Screenshot shows how to open sample query to find protectable resources." lightbox="./media/quick-view-protectable-resources/sample-query-to-find-protectable-resources.png":::

## Next step

> [!div class="nextstepaction"]
> [Configure protection for data sources](tutorial-configure-protection-datasource.md).
