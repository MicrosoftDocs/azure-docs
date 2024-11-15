---
title: Configure processing units for a premium Azure Event Hubs namespace
description: Provides instructions for configuring processing units for a premium tier Event Hubs namespace. 
ms.topic: article
ms.date: 05/26/2021
---

# Configure processing units for a premium tier Azure Event Hubs namespace
This article provides instructions for configuring processing units (PUs) for a premium tier Azure Event Hubs namespace. To learn more about the **premium** tier, see [Event Hubs Premium](event-hubs-premium-overview.md).

## Configure processing units when creating a namespace
You can configure the number of processing units (PUs) for your namespace (1, 2, 4, 6, 8, 10, 12, or 16) at the time of creating a premium namespace. You see the setting on **Basics** page of the creation wizard as shown in the following image: 

:::image type="content" source="media/configure-processing-units-premium-namespace/event-hubs-auto-inflate-premium.png" alt-text="Screenshot that shows the Processing settings units on the Create Namespace wizard.":::

## Configure processing units for an existing namespace
To update the number of PUs for an existing premium namespace, follow these steps: 

1. On the **Event Hubs namespace** page for your namespace, select **Scale** under **Settings** on the left menu. 
1. Update the value for **processing units**, and select **Save**. 

    :::image type="content" source="media/configure-processing-units-premium-namespace/scale-settings-premium.png" alt-text="Screenshot of the Scale page of an existing premium namespace with processing units are configured.":::

## Next steps
To learn more about processing units and Event Hubs premium tier, see the following articles.

- [Event Hubs Premium](event-hubs-premium-overview.md)
- [Event Hubs scalability](event-hubs-scalability.md)

