---
title: Create and delete routes and endpoints by using the Azure portal
description: Learn how to create and delete routes and endpoints in Azure IoT Hub by using the Azure portal.
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: how-to
ms.date: 11/11/2022
ms.author: kgremban
---

# Create and delete routes and endpoints by using the Azure portal

This article shows you how to create a route and endpoint in your hub in Azure IoT Hub and then delete your route and endpoint. Learn how to use the Azure portal to create routes that have endpoints in Azure Event Hubs, Azure Service Bus queues, Service Bus topics, Azure Storage, and Azure Cosmos DB.

To learn more about how routing works in IoT Hub, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](/azure/iot-hub/iot-hub-devguide-messages-d2c). To walk through setting up a route that sends messages to storage and then testing on a simulated device, see [Tutorial: Send device data to Azure Storage by using IoT Hub message routing](/azure/iot-hub/tutorial-routing?tabs=portal).

## Prerequisites

The procedures that are described in the article use the following prerequisites:

* The Azure portal
* An IoT hub
* An endpoint service

### Azure portal

This article uses the Azure portal to work with IoT Hub and other Azure services. To learn more about how to use the Azure portal, see [What is the Azure portal?](/azure/azure-portal/azure-portal-overview)

### An IoT hub and an endpoint service

You need an IoT hub created with Azure IoT Hub and at least one other service to serve as an endpoint to your IoT hub route. You can choose which Azure service (Event Hubs, Service Bus queue, Service Bus topic, Azure Storage, Azure Cosmos DB) you use for an endpoint to connect with your IoT hub route.

* An IoT hub in your [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). If you don't have a hub yet, complete the steps to [create an IoT hub by using the Azure portal](/azure/iot-hub/iot-hub-create-through-portal).

* (Optional) An Event Hubs resource (namespace and entity). If you need to create a new Event Hubs resource, see [Quickstart: Create an event hub by using the Azure portal](/azure/event-hubs/event-hubs-create).

* (Optional) A Service Bus queue resource (namespace and queue). If you need to create a new Service Bus queue, see [Use the Azure portal to create a Service Bus namespace and queue](/azure/service-bus-messaging/service-bus-quickstart-portal).

* (Optional) A Service Bus topic resource (namespace and topic). If you need to create a new Service Bus topic, see [Use the Azure portal to create a Service Bus topic and subscriptions to the topic](/azure/service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal).

* (Optional) An Azure Storage resource (account and container). If you need to create a new storage account in Azure, see [Create a storage account](/azure/storage/common/storage-account-create?tabs=azure-portal). When you create a storage account, you have many options, but you need only a new container in your account for this article.

* (Optional) An Azure Cosmos DB resource (account, database, and container). If you need to create a new instance of Azure Cosmos DB, see [Create an Azure Cosmos DB account](/azure/cosmos-db/nosql/quickstart-portal#create-account). For the API option, select **Azure Cosmos DB for NoSQL**.

## Create a route

In IoT Hub, you can create a route to send messages or capture events. Each route has an endpoint where the messages or events end up, and a data source where the messages or events originate. You choose these locations when you create a new route in your IoT hub. Then, you use routing queries to filter messages or events before they go to the endpoint.

You can use an event hub, a Service Bus queue or topic, or an Azure storage account to be the endpoint for your IoT hub route. An instance of the service that you use for your endpoint must first exist in your Azure account.

Decide which route type (event hub, Service Bus queue or topic, Azure storage account, or Azure Cosmos DB resource) you want to create. For the service you choose to use, complete the steps to create an endpoint.

# [Event Hubs](#tab/eventhubs)

To learn how to create an Event Hubs resource, see [Quickstart: Create an event hub by using the Azure portal](/azure/event-hubs/event-hubs-create).

In the Azure portal, you can create a route and endpoint at the same time. If you use the Azure CLI or Azure PowerShell, you must create an endpoint first, and then create a route.

1. In the Azure portal, go to your IoT hub. In the left menu under **Hub settings**,  select **Message routing**.

1. In **Message routing**, on the **Routes** tab, select **Add**.

   :::image type="content" source="media/how-to-routing-portal/message-routing-add.png" alt-text="Screenshot that shows location of the Add button, to add a new route in your IoT hub.":::

1. In **Add a route**, enter or select these values:

   * **Name**: Enter a unique name for your route. It might be helpful to include the endpoint type in the name, such as *my-event-hubs-route*.

   * **Endpoint**: Select **Add endpoint**, and then select **Event hubs**.

      :::image type="content" source="media/how-to-routing-portal/add-endpoint-event-hubs.png" alt-text="Screenshot that shows location of the Add endpoint dropdown.":::

1. In **Add an event hub endpoint**, enter or select these values:

   * **Endpoint name**: Enter a unique name for your endpoint. The endpoint name displays in your IoT hub.

   * **Event hub namespace**: Select the namespace you created in your Event Hubs resource.

   * **Event hub instance**: Select the event hub you created in your Event Hubs resource.

1. Select **Create**.

   :::image type="content" source="media/how-to-routing-portal/add-event-hub.png" alt-text="Screenshot that shows all options to select on the Add an event hub endpoint pane.":::

1. In **Add a route**, leave all default values and select **Save**.

1. In **Message routing**, on the **Routes** tab, check that your new route appears.

   :::image type="content" source="media/how-to-routing-portal/see-new-route.png" alt-text="Screenshot that shows the new route you created on the Message routing pane." lightbox="media/how-to-routing-portal/see-new-route.png":::

# [Service Bus queue](#tab/servicebusqueue)

To learn how to create a Service Bus queue, see [Use the Azure portal to create a Service Bus namespace and queue](/azure/service-bus-messaging/service-bus-quickstart-portal).

1. In the Azure portal, go to your IoT hub. In the left menu under **Hub settings**,  select **Message routing**.

1. In **Message routing**, on the **Routes** tab, select **Add**.

   :::image type="content" source="media/how-to-routing-portal/message-routing-add.png" alt-text="Screenshot that shows location of the add button, to add a new route in your IoT hub.":::

1. In **Add a route**, enter or select these values:

   * **Name**: Enter a unique name for your route. It might be helpful to include the endpoint type in the name, such as *my-service-bus-route*.

   * **Endpoint**: Select **Add endpoint**, and then select **Service bus queue**.

1. In **Add a service bus endpoint**, enter or select these values:

   * **Endpoint name**: Enter a unique name for your endpoint.

   * **Service bus namespace**: Select your Service Bus namespace.

   * **Service bus queue**: Select your Service Bus queue.

1. Leave all other default values and select **Create**.

   :::image type="content" source="media/how-to-routing-portal/add-service-bus-endpoint.png" alt-text="Screenshot that shows the Add a service bus endpoint pane with correct options selected.":::

1. In **Add a route**, leave all default values and select **Save**.

1. In **Message routing**, on the **Routes** tab, check that your new route appears.

   :::image type="content" source="media/how-to-routing-portal/see-new-service-bus-route.png" alt-text="Screenshot that shows the new service bus queue route you created on the Message routing pane." lightbox="media/how-to-routing-portal/see-new-service-bus-route.png":::

# [Service Bus topic](#tab/servicebustopic)

To learn how to create a Service Bus topic, see [Use the Azure portal to create a Service Bus topic and subscriptions to the topic](/azure/service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal).

1. In the Azure portal, go to your IoT hub. In the left menu under **Hub settings**,  select **Message routing**.

1. In **Message routing**, on the **Routes** tab, select **Add**.

   :::image type="content" source="media/how-to-routing-portal/message-routing-add.png" alt-text="Screenshot that shows location of the add button, to add a new route in your IoT hub.":::

1. In **Add a route**, enter or select these values:

   * **Name**: Enter a unique name for your route. It might be helpful to include the endpoint type in the name, such as *my-service-bus-route*.

   * **Endpoint**: Select **Add endpoint**, and then select **Service bus topic**.

1. In **Add a service bus endpoint**, enter or select these values:

   * **Endpoint name**: Enter a unique name for your endpoint.

   * **Service bus namespace**: Select your Service Bus namespace.

   * **Service Bus Topic**: Select your Service Bus topic.

1. Leave all other default values and select **Create**.

   :::image type="content" source="media/how-to-routing-portal/add-service-bus-topic-endpoint.png" alt-text="Screenshot that shows the Add a service bus endpoint pane with correct options selected.":::

1. In **Add a route**, leave all default values and select **Save**.

1. In **Message routing**, on the **Routes** tab, check that your new route appears.

   :::image type="content" source="media/how-to-routing-portal/see-new-service-bus-topic-route.png" alt-text="Screenshot that shows your new Service Bus topic route on the Message routing pane." lightbox="media/how-to-routing-portal/see-new-service-bus-topic-route.png":::

# [Azure Storage](#tab/azurestorage)

To learn how to create an Azure Storage resource (with container), see [Create a storage account](/azure/iot-hub/tutorial-routing?tabs=portal#create-a-storage-account).

1. In the Azure portal, go to your IoT hub. In the left menu under **Hub settings**,  select **Message routing**.

1. In **Message routing**, on the **Routes** tab, select **Add**.

   :::image type="content" source="media/how-to-routing-portal/message-routing-add.png" alt-text="Screenshot that shows location of the Add button, to add a new route in your IoT hub.":::

1. In **Add a route**, enter or select these values:

   * **Name**: Enter a unique name for your route. It might be helpful to include the endpoint type in the name, such as *my-storage-route*.

   * **Endpoint**: Select **Add endpoint**, and then select **Storage**.

1. In **Add a storage endpoint**, enter or select these values:

   * **Endpoint name**: Enter a unique name for your endpoint.

   * **Pick a container**: Select your storage account and the storage account container.

1. In **Add a storage endpoint**, leave all other default values and select **Create**.

   :::image type="content" source="media/how-to-routing-portal/add-storage-endpoint.png" alt-text="Screenshot that shows the Add a storage endpoint pane with the correct options selected.":::

1. In **Add a route**, leave all default values and select **Save**.

1. In **Message routing**, on the **Routes** tab, check that your new route appears.

   :::image type="content" source="media/how-to-routing-portal/see-new-storage-route.png" alt-text="Screenshot that shows your new storage route on the Message routing pane." lightbox="media/how-to-routing-portal/see-new-storage-route.png":::

# [Azure Cosmos DB](#tab/cosmosdb)

To learn how to create an Azure Cosmos DB resource, see [Create an Azure Cosmos DB account](/azure/cosmos-db/nosql/quickstart-portal#create-account).

1. In the Azure portal, go to your IoT hub. In the left menu under **Hub settings**,  select **Message routing**.

1. In **Message routing**, go to your IoT hub resource and select the **Custom endpoints** tab.

1. Select **Add**, and then select **CosmosDB**.

   :::image type="content" source="media/how-to-routing-portal/add-cosmos-db-endpoint.png" alt-text="Screenshot that shows location of the Add button on the Message routing pane on the Custom endpoints tab of the IoT Hub resource.":::

1. In **Add a Cosmos DB endpoint**, enter or select this information:

   * **Endpoint name**: Enter a unique name for your endpoint.

   * **Cosmos DB account**: Select your Azure Cosmos DB account.

   * **Database**: Select your Azure Cosmos DB database.
  
   * **Collection**: Select your Azure Cosmos DB collection.

   * **Partition key name** and **Partition key template**: These values are created automatically based on your previous selections. You can leave the auto-generated values or you can change the partition template based on your business logic. For more information about partitioning, see [Partitioning and horizontal scaling in Azure Cosmos DB](/azure/cosmos-db/partitioning-overview).

   :::image type="content" source="media/how-to-routing-portal/add-cosmos-db-endpoint-form.png" alt-text="Screenshot that shows details of the Add a Cosmos DB endpoint form." lightbox="media/how-to-routing-portal/add-cosmos-db-endpoint-form.png":::  

1. Select **Save**.
  
1. In **Message routing**, on the **Routes** tab, check that your new route appears.

   :::image type="content" source="media/how-to-routing-portal/cosmos-db-confirm.png" alt-text="Screenshot that shows a new Azure Cosmos DB route in the IoT Hub Message routing pane." lightbox="media/how-to-routing-portal/cosmos-db-confirm.png":::  

---

## Update a route

To update a route in the Azure portal, select your route in **Message routing** in your IoT hub and changing the properties.

You can make changes to an existing route:

* Select a different endpoint or create a new endpoint in **Endpoint**.
* Select a new source in **Date source**.
* Enable or disable your route under **Enable route**.
* Create or change queries under **Routing query**.

:::image type="content" source="media/how-to-routing-portal/update-route.png" alt-text="Screenshot that shows where and how to modify an existing IoT hub route.":::

After you make any changes, select **Save**.

> [!NOTE]
> Although you can't modify an existing endpoint, you can create new ones for your IoT hub route and change the endpoint that your route uses by changing the value for **Endpoint**.

## Delete a route

To delete a route in the Azure portal:

1. In **Message routing** for your IoT hub, select the checkbox for the route to delete.

1. In the command bar, select **Delete**.

:::image type="content" source="media/how-to-routing-portal/delete-route-portal.png" alt-text="Screenshot that shows where and how to delete an existing IoT hub route." lightbox="media/how-to-routing-portal/delete-route-portal.png":::

## Delete a custom endpoint

To delete a custom endpoint in the Azure portal:

1. In **Message routing** for your IoT hub, select the **Custom endpoints** tab.

1. Select the checkbox for the Event Hubs endpoint to delete.

1. In the command bar, select **Delete**.

:::image type="content" source="media/how-to-routing-portal/delete-endpoint-portal.png" alt-text="Screenshot that shows where and how to delete an existing Event Hubs endpoint." lightbox="media/how-to-routing-portal/delete-endpoint-portal.png":::

## Next steps

In this how-to article, you learned how to create a route and endpoint for Event Hubs, a Service Bus queue, a Service Bus topic, Azure Storage, and Azure Cosmos DB.

To learn more about message routing, see [Tutorial: Send device data to Azure Storage by using IoT Hub message routing](/azure/iot-hub/tutorial-routing?tabs=portal). In the tutorial, you create a storage route and test it with a device in your IoT hub.
