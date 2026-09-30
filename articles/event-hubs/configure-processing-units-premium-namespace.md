---
title: Configure processing units for a premium tier Event Hubs namespace
description: This article provides instructions for configuring processing units for a premium tier Event Hubs namespace.
ms.topic: how-to
ms.date: 08/25/2026
ai-usage: ai-assisted
# Customer intent: As an administrator, I want to know how to scale processing units for a namespace up and down.
---

# Configure processing units for a premium tier Azure Event Hubs namespace

Azure Event Hubs Premium allocates isolated compute, memory, and storage capacity to your namespace in units called processing units (PUs). This article shows you how to set the number of PUs when you create a premium namespace and how to scale the PUs for an existing namespace.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
- At least the **Contributor** role on the Event Hubs namespace or the resource group that contains it. For more information, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles).
- To scale an existing namespace, an Event Hubs namespace in the **Premium** tier. To create one, see [Create an event hub using Azure portal](event-hubs-create.md).

## Configure processing units when creating a namespace

You can configure the number of PUs (1, 2, 4, 6, 8, 10, 12, or 16) when you create a premium namespace. Set the value on the **Basics** page of the creation wizard, as shown in the following image:

:::image type="content" source="media/configure-processing-units-premium-namespace/event-hubs-auto-inflate-premium.png" alt-text="Screenshot that shows the processing units setting on the Create namespace page.":::

## Configure processing units for an existing namespace

To update the number of PUs for an existing premium namespace, follow these steps:

1. On the **Event Hubs Namespace** page for your namespace, select **Scale** under **Settings** on the left menu.
1. Update the value for **Processing Units**.
1. Select **Save**.

    :::image type="content" source="media/configure-processing-units-premium-namespace/scale-settings-premium.png" alt-text="Screenshot that shows the Scale page of an existing premium namespace with the processing units configured.":::

## Related content

To learn more about processing units and the Event Hubs Premium tier, see the following articles:

- [Event Hubs Premium](event-hubs-premium-overview.md)
- [Event Hubs scalability](event-hubs-scalability.md)

