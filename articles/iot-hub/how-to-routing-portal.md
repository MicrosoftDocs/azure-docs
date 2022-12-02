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

This article shows you how to create a route and endpoint in your hub in Azure IoT Hub and then delete your route and endpoint. Learn how to use the Azure portal to create routes and endpoints to Azure Event Hubs, Azure Service Bus queues and topics, and Azure Storage.

To learn more about how routing works in IoT Hub, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](/azure/iot-hub/iot-hub-devguide-messages-d2c). To walk through setting up a route that sends messages to storage and then testing on a simulated device, see [Tutorial: Send device data to Azure Storage by using IoT Hub message routing](/azure/iot-hub/tutorial-routing?tabs=portal).

## Prerequisites

The steps that are described in the article require the following prerequisites:

### Azure portal

This article uses the Azure portal to work with IoT Hub and other Azure services. To be more familiar with the portal, see [What is the Azure portal?](/azure/azure-portal/azure-portal-overview)

### IoT hub and an endpoint service

You need an IoT hub created with Azure IoT Hub and at least one other service to serve as an endpoint to your IoT hub route. You can choose which Azure service (Event Hubs, Service Bus queue or topic, or Azure Storage) you use for an endpoint to connect with your IoT hub route.

* An IoT hub in your [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). If you don't have a hub yet, you can follow the steps to [create an IoT hub by using the Azure portal](/azure/iot-hub/iot-hub-create-through-portal).

* (Optional) An Event Hubs resource (namespace and entity). If you need to create a new Event Hubs resource, see [Quickstart: Create an event hub by using the Azure portal](/azure/event-hubs/event-hubs-create).

* (Optional) A Service Bus queue resource (namespace and queue). If you need to create a new Service Bus queue, see [Use the Azure portal to create a Service Bus namespace and queue](/azure/service-bus-messaging/service-bus-quickstart-portal).

* (Optional) A Service Bus topic resource (namespace and topic). If you need to create a new Service Bus topic, see [Use the Azure portal to create a Service Bus topic and subscriptions to the topic](/azure/service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal).

* (Optional) An Azure Storage resource (account and container). If you need to create a new storage account in Azure, see [Create a storage account](/azure/storage/common/storage-account-create?tabs=azure-portal). When you create a storage account, you have many options, but you need only a new container in your account for this article.

* (Optional) An Azure Cosmos DB resource (account, database, and container). If you need to create a new instance of Azure Cosmos DB, see [Create an Azure Cosmos DB account](/azure/cosmos-db/nosql/quickstart-portal#create-account). For the API option, select **Azure Cosmos DB for NoSQL**.

## Create a route

In IoT Hub, you can create a route to send messages or capture events. Each route has an endpoint where the messages or events end up, and a data source where the messages or events originate. You choose these locations when you create a new route in your IoT hub. Then, you use routing queries to filter messages or events before they go to the endpoint.

You can use an event hub, a Service Bus queue or topic, or an Azure storage account to be the endpoint for your IoT hub route. The service that you use as your endpoint must first exist in your Azure account.

In the Azure portal, go to your IoT hub. In the left menu under **Hub settings**,  select **Message routing**. In the **Message routing** command bar,  select **Add**.

:::image type="content" source="media/how-to-routing-portal/message-routing-add.png" alt-text="Screenshot that shows location of the add button, to add a new route in your IoT hub.":::

Next, decide which route type (event hubs, Service Bus queue or topic, or Azure storage) you want to create. For the service you choose to use, complete the steps to create an endpoint.

# [Event Hubs](#tab/eventhubs)

To learn how to create an Event Hubs resource, see [Quickstart: Create an event hub by using the Azure portal](/azure/event-hubs/event-hubs-create).

In the Azure portal, you can create a route and endpoint at the same time. If you use the Azure CLI or PowerShell, you must create an endpoint first, and then create a route.

1. In the **Add a route** blade that appears, create a unique **Name**. Optionally, you might want to include the endpoint type in the name, such as **my-event-hubs-route**.

1. For **Endpoint**, select the **+ Add endpoint** dropdown and select **Event hubs**.

   :::image type="content" source="media/how-to-routing-portal/add-endpoint-event-hubs.png" alt-text="Screenshot that shows location of the Add endpoint dropdown.":::

1. A new pane, **Add an event hub endpoint**, opens. Create an **Endpoint name** for your IoT hub. This will display in your IoT hub.
   
   For **Event hub namespace**, select the namespace you previously created in your Event Hubs resource from the dropdown.

   For **Event hub instance**, select the event hub you created in your Event Hubs resource from the dropdown.

   Select **Create** at the bottom and you'll go back to the **Add a route** pane.

   :::image type="content" source="media/how-to-routing-portal/add-event-hub.png" alt-text="Screenshot that shows all options to select on the Add an event hub endpoint pane.":::

1. Leave all the other values as their defaults on the **Add a route** pane.

1. Select **Save** at the bottom to create your new route. You should now see the route on your **Message routing** pane. 
   
   :::image type="content" source="media/how-to-routing-portal/see-new-route.png" alt-text="Screenshot that shows the new route you created on the Message routing pane." lightbox="media/how-to-routing-portal/see-new-route.png":::

# [Service Bus queue](#tab/servicebusqueue)

If you need to create a Service Bus queue, see [Use Azure portal to create a Service Bus namespace and a queue](/azure/service-bus-messaging/service-bus-quickstart-portal).

1. In the **Add a route** blade that appears, create a unique **Name**. Optionally, you might want to include the endpoint type in the name, such as **my-service-bus-route**.

1. For **Endpoint**, select the **+ Add endpoint** dropdown and select **Service bus queue**.

1. A new pane appears called **Add a service bus endpoint**. Think of a unique name for the **Endpoint name** field.

1. Select the dropdown for **Service bus namespace** and select your service bus.

1. Select the dropdown for **Service bus queue** and select your service bus queue.

1. Leave all other values in their default states and select **Create** at the bottom.

   :::image type="content" source="media/how-to-routing-portal/add-service-bus-endpoint.png" alt-text="Screenshot that shows the Add a service bus endpoint pane with correct options selected.":::

1. Leave all the other values as their defaults on the **Add a route** pane.

1. Select **Save** at the bottom to create your new route. You should now see the route on your **Message routing** pane.

   :::image type="content" source="media/how-to-routing-portal/see-new-service-bus-route.png" alt-text="Screenshot that shows the new service bus queue route you created on the Message routing pane." lightbox="media/how-to-routing-portal/see-new-service-bus-route.png":::

# [Service Bus topic](#tab/servicebustopic)

If you need to create a Service Bus topic, see [Use the Azure portal to create a Service Bus topic and subscriptions to the topic](/azure/service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal).

1. In the **Add a route** blade that appears, create a unique **Name**. Optionally, you might want to include the endpoint type in the name, such as **my-service-bus-topic-route**.

1. For **Endpoint**, select the **+ Add endpoint** dropdown and select **Service bus topic**.

1. A new pane appears called **Add a service bus endpoint**. Think of a unique name for the **Endpoint name** field.

1. Select the dropdown for **Service bus namespace** and select your service bus.

1. Select the dropdown for **Service Bus Topic** and select your Service Bus topic.

1. Leave all other values in their default states and select **Create** at the bottom.

   :::image type="content" source="media/how-to-routing-portal/add-service-bus-topic-endpoint.png" alt-text="Screenshot that shows the Add a service bus endpoint pane with correct options selected.":::

1. Leave all the other values as their defaults on the **Add a route** pane.

1. Select **Save** at the bottom to create your new route. You should now see the route on your **Message routing** pane.

   :::image type="content" source="media/how-to-routing-portal/see-new-service-bus-topic-route.png" alt-text="Screenshot that shows your new Service Bus topic route on the Message routing pane." lightbox="media/how-to-routing-portal/see-new-service-bus-topic-route.png":::

# [Azure Storage](#tab/azurestorage)

If you need to create an Azure storage resource (with container), see [Create a storage account](/azure/iot-hub/tutorial-routing?tabs=portal#create-a-storage-account).

1. In the **Add a route** blade that appears, create a unique **Name**. Optionally, you might want to include the endpoint type in the name, such as **my-service-bus-topic-route**.

1. For **Endpoint**, select **Add endpoint**, and then select **Storage**.

1. In **Add a storage endpoint**, enter a unique name for **Endpoint name**.

1. Select **Pick a container**. Select your storage account and the storage account container. You return to the  pane.

1. In **Add a storage endpoint**, leave all other default values. Select **Create**.

   :::image type="content" source="media/how-to-routing-portal/add-storage-endpoint.png" alt-text="Screenshot that shows the Add a storage endpoint pane with correct options selected.":::

1. Leave all the other values as their defaults on the **Add a route** pane.

1. Select **Save** at the bottom to create your new route. You should now see the route on your **Message routing** pane.

   :::image type="content" source="media/how-to-routing-portal/see-new-storage-route.png" alt-text="Screenshot that shows your new storage route on the Message routing pane." lightbox="media/how-to-routing-portal/see-new-storage-route.png":::

# [Azure Cosmos DB](#tab/cosmosdb)

If you need to create a Azure Cosmos DB resource, see [Create an Azure Cosmos DB account](/azure/cosmos-db/nosql/quickstart-portal#create-account).

1. Go to your IoT hub resource on the **Message routing** pane and select the **Custom endpoints** tab.

1. Select **+ Add**, then select **CosmosDB** in the dropdown menu.

   :::image type="content" source="media/how-to-routing-portal/add-cosmos-db-endpoint.png" alt-text="Screenshot that shows location of the Add button on the Message routing pane in the Custom endpoint tab of the IoT Hub resource.":::

1. Complete the fields in the form **Add a Cosmos DB endpoint**.

   * **Endpoint name**: Enter a unique name.

   * **Cosmos DB account**, **Database**, and **Collection** — select your Azure Cosmos DB account, database, and collection from the dropdowns.

   * **Partition key name** and **Partition key template** — these will fill in automatically, based on the previous selections, or you can change the partition template based on your business logic. For more information on partitioning, see [Partitioning and horizontal scaling in Azure Cosmos DB](/azure/cosmos-db/partitioning-overview).

   :::image type="content" source="media/how-to-routing-portal/add-cosmos-db-endpoint-form.png" alt-text="Screenshot that shows details of the Add a Cosmos DB endpoint form." lightbox="media/how-to-routing-portal/add-cosmos-db-endpoint-form.png":::  

   * Select **Save** at the bottom of the form. You should now see the route on your **Message routing** pane.

   :::image type="content" source="media/how-to-routing-portal/cosmos-db-confirm.png" alt-text="Screenshot that shows a new Azure Cosmos DB route in the IoT Hub Message routing pane." lightbox="media/how-to-routing-portal/cosmos-db-confirm.png":::  

---

## Update a route

Updating a route in the Azure portal is as easy as selecting your route from the **Message routing** menu in your IoT hub and changing the properties.

You can make changes to an existing route:

* Select a different endpoint from the **Endpoint** dropdown or create a new endpoint
* Select a new source from the **Date source** dropdown
* Enable or disable your route in the **Enable route** section
* Create or change queries in the **Routing query** section

:::image type="content" source="media/how-to-routing-portal/update-route.png" alt-text="Screenshot that shows where and how to modify an existing IoT hub route.":::

Select **Save** at the bottom after making changes.

> [!NOTE]
> Although you can't modify an existing endpoint, you can create new ones for your IoT hub route and change the endpoint your route uses with the **Endpoint** dropdown.

## Delete a route

To delete a route in the Azure portal:

1. Check the box next to your route located in the **Message routing** menu.

1. Select **Delete**.

:::image type="content" source="media/how-to-routing-portal/delete-route-portal.png" alt-text="Screenshot that shows where and how to delete an existing IoT hub route." lightbox="media/how-to-routing-portal/delete-route-portal.png":::

## Delete a custom endpoint

To delete a custom endpoint in the Azure portal:

1. From the **Message routing** menu, select the **Custom endpoints** tab.

1. Check the box next to your Event hubs endpoint.

1. Select the **Delete** button.

:::image type="content" source="media/how-to-routing-portal/delete-endpoint-portal.png" alt-text="Screenshot that shows where and how to delete an existing Event Hubs endpoint." lightbox="media/how-to-routing-portal/delete-endpoint-portal.png":::

## Next steps

In this how-to article, you learned how to create a route and endpoint for your Event Hubs, Service Bus queue or topic, and Azure Storage.

To further your exploration into message routing, see [Tutorial: Send device data to Azure Storage using IoT Hub message routing](/azure/iot-hub/tutorial-routing?tabs=portal). In this tutorial, you'll create a storage route and test it with a device in your IoT hub.
