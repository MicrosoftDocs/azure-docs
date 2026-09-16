---
title: Create, view, and manage Azure Event Grid namespaces
description: Learn how to create, view, and manage Azure Event Grid namespaces in the Azure portal, including enabling MQTT and configuring throughput units.
author: robece
ms.topic: how-to
ms.custom:
  - build-2023
  - ignite-2023
ms.author: robece
ms.date: 08/26/2026
ai-usage: ai-assisted
# Customer intent: As an Azure developer or administrator, I want to create, view, and manage an Event Grid namespace so that I can group related messaging resources and manage them as a single unit.
---

# Create, view, and manage Azure Event Grid namespaces

A namespace in Azure Event Grid is a logical container for one or more topics, clients, client groups, topic spaces, and permission bindings. A namespace gives you a unique, addressable space so that you can have multiple resources in the same Azure region and manage related resources as a single unit in your Azure subscription.

This article shows you how to use the Azure portal to create, view, and manage an Azure Event Grid namespace.

## Prerequisites

- An Azure account with an active subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).

## Create an Event Grid namespace

Use the following steps to create an Event Grid namespace in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the **search box**, enter **Event Grid Namespaces** and select **Event Grid Namespaces** from the results.

    :::image type="content" source="media/create-view-manage-namespaces/portal-search-box-namespaces.png" alt-text="Screenshot showing Event Grid Namespaces in the search results.":::
1. On the **Event Grid Namespaces** page, select **+ Create** on the toolbar. 

    :::image type="content" source="media/create-view-manage-namespaces/namespace-create-button.png" alt-text="Screenshot showing Event Grid Namespaces page with the Create button on the toolbar selected.":::
1. On the **Basics** page, follow these steps.
    1. Select the **Azure subscription** in which you want to create the namespace.
    1. Select an existing **resource group** or create a resource group.
    1. Enter a **name** for the namespace.
    1. Select the region or **location** where you want to create the namespace. 
    1. If the selected region supports availability zones, enable or disable the **Availability zones** checkbox. The checkbox is selected by default if the region supports availability zones. However, you can uncheck and disable availability zones if needed. You can't change the selection once the namespace is created.
    1. Use the slider or text box to specify the number of **throughput units** for the namespace. Throughput units (TUs) define the ingress and egress event rate capacity in namespaces.
    1. Select **Next: Networking** at the bottom of the page. 
    
        :::image type="content" source="media/create-view-manage-namespaces/create-namespace-basics-page.png" alt-text="Screenshot showing the Basics tab of Create namespace page.":::        
1. Follow steps from [Configure IP firewall](configure-firewall.md) or [Configure private endpoints](mqtt-configure-private-endpoints.md) to configure IP firewall or private endpoints for the namespace, and then select **Next: Security** at the bottom of the page.
1. On the **Security** page, create a managed identity by following instructions from [Enable managed identity for a namespace](event-grid-namespace-managed-identity.md), and then select **Next: Tags** at the bottom of the page. 
1. On the **Tags** tab, add tags if you need them. Then, select **Next: Review + create** at the bottom of the page.
1. On the **Review + create** tab, review your settings, and then select **Create**.
1. On the **Deployment succeeded** page, select **Go to resource** to go to your namespace.

## View an Event Grid namespace

Use the following steps to open an existing Event Grid namespace.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the **search box**, enter **Event Grid Namespaces** and select **Event Grid Namespaces** from the results.

    :::image type="content" source="media/create-view-manage-namespaces/portal-search-box-namespaces.png" alt-text="Screenshot showing Event Grid Namespaces in the search results.":::
1. On the **Event Grid Namespaces** page, select your namespace. 

    :::image type="content" source="media/create-view-manage-namespaces/select-namespace.png" alt-text="Screenshot showing selection of a namespace in the Event Grid namespaces list.":::
1. The **Event Grid Namespace** page for your namespace appears.

    :::image type="content" source="media/create-view-manage-namespaces/namespace-home-page.png" alt-text="Screenshot that shows the Event Grid Namespace page for your namespace." lightbox="media/create-view-manage-namespaces/namespace-home-page.png":::

## Enable MQTT on an Event Grid namespace

To enable the MQTT capabilities in the Azure Event Grid namespace, select **Configuration** and check the option **Enable MQTT**.

:::image type="content" source="media/create-view-manage-namespaces/enable-mqtt.png" alt-text="Screenshot showing Event Grid MQTT settings.":::

> [!NOTE]
> After you enable MQTT, you can't disable it.

## Configure throughput units (TUs) for a namespace

You can configure throughput units (TUs) for a namespace either manually or by enabling autoscale:

- To manually set the number of TUs for a namespace, see [Configure manual scale for an Azure Event Grid namespace](namespace-enable-manual-scale.md).
- To let Event Grid automatically adjust TUs based on workload demand, see [Enable autoscale for an Event Grid namespace](namespace-enable-autoscale.md).

## Delete an Event Grid namespace

When you no longer need a namespace, delete it to remove the namespace and all its nested resources.

1. Follow the steps in the [View an Event Grid namespace](#view-an-event-grid-namespace) section to list all the namespaces, and then select the namespace that you want to delete.
1. On the **Overview** page, select **Delete** on the toolbar.

    :::image type="content" source="media/create-view-manage-namespaces/delete-namespace.png" alt-text="Screenshot showing how to delete an Event Grid namespace.":::
1. On the confirmation page, enter the name of the resource, and then select **Delete** to confirm the deletion. This action deletes the namespace and all the nested topics, subscriptions, and MQTT resources.

    :::image type="content" source="media/create-view-manage-namespaces/delete-namespace-confirmation.png" alt-text="Screenshot showing how to confirm an Event Grid namespace deletion.":::

## Related content

- [Create, view, and manage namespace topics](create-view-manage-namespace-topics.md)
- [Publish and subscribe to MQTT messages on an Event Grid namespace with the Azure portal](mqtt-publish-and-subscribe-portal.md)
