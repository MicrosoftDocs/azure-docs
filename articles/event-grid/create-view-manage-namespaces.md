---
title: Create, view, and manage Azure Event Grid namespaces (Preview)
description: This article describes how to create, view and manage namespaces
author: robece
ms.topic: how-to
ms.custom: build-2023
ms.author: robece
ms.date: 05/23/2023
---

# Create, view, and manage namespaces (Preview)

A namespace in Azure Event Grid is a logical container for one or more topics, clients, client groups, topic spaces and permission bindings. It provides a unique namespace, allowing you to have multiple resources in the same Azure region. With an Azure Event Grid namespace you can group now together related resources and manage them as a single unit in your Azure subscription.

[!INCLUDE [mqtt-pull-preview-note](./includes/mqtt-pull-preview-note.md)]

This article shows you how to use the Azure portal to create, view and manage an Azure Event Grid namespace.

## Create a namespace

1. Sign-in to the [Azure portal](https://portal.azure.com).
1. In the **search box**, enter **Event Grid Namespaces** and select **Event Grid Namespaces** from the results.

    :::image type="content" source="media/configure-firewall-mqtt/portal-search-box-namespaces.png" alt-text="Screenshot showing Event Grid Namespaces in the search results.":::
1. On the **Event Grid Namespaces** page, select **+ Create** on the toolbar. 

    :::image type="content" source="media/configure-firewall-mqtt/namespace-create-button.png" alt-text="Screenshot showing Event Grid Namespaces page with the Create button on the toolbar selected.":::
1. On the **Basics** page, follow these steps.
    1. Select the **Azure subscription** in which you want to create the namespace.
    1. Select an existing **resource group** or create a resource group.
    1. Enter a **name** for the namespace.
    1. Select the region or **location** where you want to create the namespace. 
    1. If the selected region supports availability zones, the **Availability zones** checkbox can be enabled or disabled. The checkbox is selected by default if the region supports availability zones. However, you can uncheck and disable availability zones if needed. The selection cannot be changed once the namespace is created.
    1. Use the slider or text box to specify the number of **throughput units** for the namespace.
    1. Select **Next: Networking** at the bottom of the page. 
    
        :::image type="content" source="media/configure-firewall-mqtt/create-namespace-basics-page.png" alt-text="Screenshot showing the Basics tab of Create namespace page.":::        
1. Follow steps from [Configure IP firewall](configure-ip-firewall-mqtt.md) or [Configure private endpoints](configure-private-endpoints-mqtt.md) to configure IP firewall or private endpoints for the namespace, and then select **Next: Security** at the bottom of the page.
1. On the **Security** page, create a managed identity by following instructions from [Enable managed identity for a namespace](event-grid-namespace-managed-identity.md), and then select **Next: Tags** at the bottom of the page. 
1. On the **Tags** tab, add the tags in case you need them. Then, select **Next: Review + create** at the bottom of the page.
6. On the **Review + create** tab, review your settings and select **Create**.

## View a namespace

1. Sign-in to the Azure portal.
2. In the **search box**, enter **Event** and select **Event Grid**.

    :::image type="content" source="media/create-view-manage-namespaces/search-event-grid.png" alt-text="Screenshot showing Event Grid the search results in the Azure portal.":::
3. In the **Overview** page, select **View** in any of the namespace cards available in the MQTT events or Custom events sections.

    :::image type="content" source="media/create-view-manage-namespaces/overview-view.png" alt-text="Screenshot showing Event Grid overview page." lightbox="media/create-view-manage-namespaces/overview-view.png":::
4. In the **View** page, you can filter the namespace list by Azure subscription and resource groups, and select **Apply**.

    :::image type="content" source="media/create-view-manage-namespaces/filter-subscription.png" alt-text="Screenshot showing Event Grid filter in resource list.":::
5. Select the namespace from the list of resources in the subscription.

    :::image type="content" source="media/create-view-manage-namespaces/namespace-resource-in-list.png" alt-text="Screenshot showing Event Grid resource in list.":::
6. Explore the namespace settings.

    :::image type="content" source="media/create-view-manage-namespaces/namespace-features.png" alt-text="Screenshot showing Event Grid resource settings." lightbox="media/create-view-manage-namespaces/namespace-features.png":::

## Enable MQTT

If you want to enable the MQTT capabilities in the Azure Event Grid namespace, select **Configuration** and check the option **Enable MQTT**.

:::image type="content" source="media/create-view-manage-namespaces/enable-mqtt.png" alt-text="Screenshot showing Event Grid MQTT settings.":::

> [!NOTE]
> Please note once MQTT is enabled it cannot be disabled.

## Configure throughput units (TUs) for a namespace

If you already created a namespace and want to increase or decrease TUs, follow the next steps:

1. Navigate to the Azure portal and select the Azure Event Grid namespace you would like to configure the throughput units.
2. On the **Event Grid Namespace** page, select **Scale** on the left navigation menu.
3. Enter the number of TUs in the edit box or use the scroller to increase or decrease the number.
4. Select **Apply** to apply the changes.

    :::image type="content" source="media/create-view-manage-namespaces/namespace-scale.png" alt-text="Screenshot showing Event Grid scale page.":::

    > [!NOTE]
    > For quotas and limits for resources in a namespace including maximum TUs in a namespace, See [Azure Event Grid quotas and limits](quotas-limits.md).

## Delete a namespace

1. Follow instructions from the [View a namespace](#view-a-namespace) section to view all the namespaces, and select the namespace that you want to delete from the list.
2. On the **Overview** page, select **Delete** on the toolbar.

    :::image type="content" source="media/create-view-manage-namespaces/delete-namespace.png" alt-text="Screenshot showing how to delete an Event Grid namespace.":::
3. On the confirmation page, type the name of the resource and select **Delete** to confirm the deletion. It deletes the namespace and also all the nested topics, subscriptions, and MQTT resources.

    :::image type="content" source="media/create-view-manage-namespaces/delete-namespace-confirmation.png" alt-text="Screenshot showing how to confirm an Event Grid namespace deletion.":::

## Next steps

- See the [Create, view, and manage namespaces topics](create-view-manage-namespace-topics.md) steps to learn more about the namespaces topics in Azure Event Grid.
- See the [Quickstart: Publish and subscribe to MQTT messages on Event Grid Namespace with Azure portal](mqtt-publish-and-subscribe-portal.md) section to learn how to use namespaces in IoT solutions supported by Azure Event Grid.
