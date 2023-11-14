---
title: Tutorial - View protectable resources
description: In this tutorial, learn how to view your resources that are currently not protected by any solution using Azure Business Continuity center.
ms.topic: tutorial
ms.date: 10/19/2023
ms.service: backup
ms.custom:
  - ignite-2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Tutorial: View protectable resources (preview)

This tutorial shows you how to view your resources that are currently not protected by any solution, using Azure Business Continuity (ABC) center (preview). 

## Prerequisites

Before you start this tutorial:

- Review supported regions for ABC Center.
- Ensure you have the required resource permissions to view them in the ABC center.

## View protectable resources

As a business continuity and disaster recovery admin, the first stage in the journey is to identify your critical resources that do not have backup or replication configured.  In case of any outage, malicious attack, or operational failures, these resources can’t be recovered in primary or secondary region, which can then lead to data loss. 

Follow these steps:

1. Go to the Azure Business Continuity Center from the Azure portal.
1. Select **Protectable resources** under the **Protection inventory** section. 

    :::image type="content" source="./media/tutorial-view-protectable-resources/protection-inventory.png" alt-text="Screenshot showing **Protectable resources** option." lightbox="./media/tutorial-view-protectable-resources/protection-inventory.png":::
 
In this view, you can see a list of all the resources which are not protected by any solution across subscription, resource groups, location, type, and more along with their properties. To view further details for each resource, you can select any resource name, subscription, or resource group from the list.

> [!NOTE]
> Currently, you can only view the unprotected Azure resources under **Protectable resources**.
 

## Customize the view

By default, only Azure Virtual machines are shown in the **Protectable resources** list.You can change the filters to view other resources.

- To look for specific resources, you can use various filters, such as subscriptions, resource groups, location, and resource type, and more. 
    :::image type="content" source="./media/tutorial-view-protectable-resources/filter.png" alt-text="Screenshot showing the filtering options." lightbox="./media/tutorial-view-protectable-resources/filter.png":::
- You can also search by resource name to get information specific to the single resource.
    :::image type="content" source="./media/tutorial-view-protectable-resources/filter-name.png" alt-text="Screenshot showing filter by name option." lightbox="./media/tutorial-view-protectable-resources/filter-name.png":::


## Next steps

For more information about Azure Business Continuity center and how it works, check out [Configure protection from ABC center](./tutorial-configure-protection-datasource.md).
