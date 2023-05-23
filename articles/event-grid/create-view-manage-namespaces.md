---
title: Create, view, and manage Azure Event Grid namespaces
description: This article describes how to create, view and manage namespaces
author: robece
ms.topic: how-to
ms.custom: build-2023
ms.author: robece
ms.date: 05/23/2023
---

# Create, view, and manage namespaces

A namespace in Azure Event Grid is a logical container for one or more topics, clients, client groups, topic spaces and permission bindings. It provides a unique namespace, allowing you to have multiple resources in the same Azure region. With an Azure Event Grid namespace you can group now together related resources and manage them as a single unit in your Azure subscription.

Please follow the next sections to create, view and manage an Azure Event Grid namespace.

## Create a namespace

1. Sign-in to the Azure portal.

2. In the **search box**, enter **Event Grid** and select Event Grid service.
  
    :::image type="content" source="media/create-view-manage-namespaces/search-event-grid.png" alt-text="Screenshot showing Event Grid the search results in the Azure portal.":::

3. In the **Overview** page, select **Create** in any of the namespace cards available in the MQTT events or Custom events sections.

    :::image type="content" source="media/create-view-manage-namespaces/overview-create.png" alt-text="Screenshot showing Event Grid overview.":::

4. On the **Basics** tab, select the Azure subscription, resource group, name, location, [availability zone](concepts.md#availability-zones), and [throughput units](concepts-pull-delivery.md#throughput-units) for your Event Grid namespace.

    :::image type="content" source="media/create-view-manage-namespaces/namespace-creation-basics.png" alt-text="Screenshot showing Event Grid namespace creation basic tab.":::

5. On the **Tags** tab, add the tags in case you need them.

    :::image type="content" source="media/create-view-manage-namespaces/namespace-creation-tags.png" alt-text="Screenshot showing Event Grid namespace creation tags tab.":::

6. On the **Review + create** tab, review your settings and select **Create**.

    :::image type="content" source="media/create-view-manage-namespaces/namespace-creation-review.png" alt-text="Screenshot showing Event Grid namespace creation review + create tab.":::

## View a namespace

1. Sign-in to the Azure portal.

2. In the **search box**, enter **Event Grid** and select Event Grid service.

    :::image type="content" source="media/create-view-manage-namespaces/search-event-grid.png" alt-text="Screenshot showing Event Grid the search results in the Azure portal.":::

3. In the **Overview** page, select **View** in any of the namespace cards available in the MQTT events or Custom events sections.

    :::image type="content" source="media/create-view-manage-namespaces/overview-view.png" alt-text="Screenshot showing Event Grid overview page.":::

4. In the **View** page, filter by the subscription you want to explore resources and select Apply.

    :::image type="content" source="media/create-view-manage-namespaces/filter-subscription.png" alt-text="Screenshot showing Event Grid filter in resource list.":::

5. Select the namespace from the list of resources in the subscription.

    :::image type="content" source="media/create-view-manage-namespaces/namespace-resource-in-list.png" alt-text="Screenshot showing Event Grid resource in list.":::

6. Explore the namespace settings.

    :::image type="content" source="media/create-view-manage-namespaces/namespace-features.png" alt-text="Screenshot showing Event Grid resource settings.":::

## Enable MQTT

In case you want to enable the MQTT capabilities in the Azure Event Grid namespace, you will need to select **Configuration** and check the option **Enable MQTT**.

  :::image type="content" source="media/create-view-manage-namespaces/enable-mqtt.png" alt-text="Screenshot showing Event Grid MQTT settings.":::

> [!NOTE]
> Please note once MQTT is enabled it cannot be disabled.

## Configure throughput units (TUs) in created namespace

If you already created a namespace and want to increase or decrease TUs, follow the next steps:

1. Navigate to the Azure portal and select the Azure Event Grid namespace you would like to configure the throughput units.
2. Once you have opened the resource, select the “Scale” blade.
3. Select the number of TUs you want to increase or decrease.
4. Select “Save” to apply the changes.
5. The throughput units will then be enabled and available for use in your namespace.

:::image type="content" source="media/create-view-manage-namespaces/namespace-scale.png" alt-text="Screenshot showing Event Grid scale blade.":::

## Delete a namespace

1. Follow instructions from the [View a namespace](#view-a-namespace) section to view all the namespaces, and select the namespace that you want to delete from the list.

2. On the **Overview** page, select **Delete** on the toolbar.

    :::image type="content" source="media/create-view-manage-namespaces/delete-namespace.png" alt-text="Screenshot showing how to delete an Event Grid namespace.":::

3. On the confirmation page, type the name of the resource and select **Delete** to confirm the deletion. It deletes the namespace and also all the nested topics, subscriptions, and MQTT resources.

    :::image type="content" source="media/create-view-manage-namespaces/delete-namespace-confirmation.png" alt-text="Screenshot showing how to confirm an Event Grid namespace deletion.":::

## Next steps

- See the [Create, view, and manage namespaces topics](create-view-manage-namespace-topics.md) steps to learn more about the namespaces topics in Azure Event Grid.
- See the [Quickstart: Publish and subscribe to MQTT messages on Event Grid Namespace with Azure portal](mqtt-publish-and-subscribe-portal.md) section to learn how to use namespaces in IoT solutions supported by Azure Event Grid.
