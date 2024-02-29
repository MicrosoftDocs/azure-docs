---
title: Configure processing units for a premium Azure Event Hubs namespace
description: Provides instructions for configuring processing units for a premium tier Event Hubs namespace. 
ms.topic: article
ms.date: 05/26/2021
---

# Configure processing units for a premium tier Azure Event Hubs namespace
This article provides instructions for configuring processing units (PUs) for a premium tier Azure Event Hubs namespace. To learn more about the **premium** tier, see [Event Hubs Premium](event-hubs-premium-overview.md).

## Configure processing units when creating a namespace
You can configure the number of processing units (PUs) for your namespace (1, 2, 4, 8, or 16), which you can update after creating the namespace. 

:::image type="content" source="./media/configure-processing-units-premium-namespace/event-hubs-auto-inflate-prem.png" alt-text="Screenshot of enabling when creating a premium namespace":::

## Configure processing units for an existing namespace
To update the number of PUs for an existing premium namespace, follow these steps: 

1. On the **Event Hubs Namespace** page for your namespace, select **Scale** under **Settings** on the left menu. 
1. Update the value for **processing units**, and select **Save**. 

    :::image type="content" source="./media/configure-processing-units-premium-namespace/scale-settings-prem.png" alt-text="Screenshot of enabling auto-inflate for an existing premium namespace":::

## Next steps
To learn more about processing units and Event Hubs premium tier, see the following articles.

- [Event Hubs Premium](event-hubs-premium-overview.md)
- [Event Hubs scalability](event-hubs-scalability.md)
