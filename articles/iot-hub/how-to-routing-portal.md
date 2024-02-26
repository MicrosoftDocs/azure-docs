---
title: Create and delete routes and endpoints in Azure portal
titleSuffix: Azure IoT Hub
description: Learn how to create and delete routes and endpoints in Azure IoT Hub by using the Azure portal for message routing.
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: how-to
ms.date: 05/22/2023
ms.author: kgremban
---

# Create and delete routes and endpoints by using the Azure portal

This article shows you how to create a route and endpoint in your hub in Azure IoT Hub and then delete your route and endpoint. Learn how to use the Azure portal to create routes and endpoints for Azure Event Hubs, Azure Service Bus queues and topics, Azure Storage, and Azure Cosmos DB.

To learn more about how routing works in IoT Hub, see [Use IoT Hub message routing to send device-to-cloud messages to different endpoints](./iot-hub-devguide-messages-d2c.md). To walk through setting up a route that sends messages to storage and then testing on a simulated device, see [Tutorial: Send device data to Azure Storage by using IoT Hub message routing](./tutorial-routing.md?tabs=portal).

## Prerequisites

The procedures that are described in the article use the following resources:

* The Azure portal
* An IoT hub
* An endpoint service in Azure

### Azure portal

This article uses the Azure portal to work with IoT Hub and other Azure services. To learn more about how to use the Azure portal, see [What is the Azure portal?](../azure-portal/azure-portal-overview.md).

### IoT hub

To create an IoT hub route, you need an IoT hub that you created by using Azure IoT Hub. Device messages and events originate in your IoT hub.

Be sure to have the following hub resource to use when you create your IoT hub route:

* An IoT hub in your [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). If you don't have a hub yet, you can follow the steps to [create an IoT hub by using the Azure portal](./iot-hub-create-through-portal.md).

### Endpoint service

To create an IoT hub route, you need at least one other Azure service to use as an endpoint to the route. The endpoint receives device messages and events. You can choose which Azure service you use for an endpoint to connect with your IoT hub route: Event Hubs, Service Bus queues or topics, Azure Storage, or Azure Cosmos DB.

Be sure to have *one* of the following resources to use when you create an endpoint your IoT hub route:

* An Event Hubs resource (namespace and entity). If you need to create a new Event Hubs resource, see [Quickstart: Create an event hub by using the Azure portal](../event-hubs/event-hubs-create.md).

* A Service Bus queue resource (namespace and queue). If you need to create a new Service Bus queue, see [Use the Azure portal to create a Service Bus namespace and queue](../service-bus-messaging/service-bus-quickstart-portal.md).

* A Service Bus topic resource (namespace and topic). If you need to create a new Service Bus topic, see [Use the Azure portal to create a Service Bus topic and subscriptions to the topic](../service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal.md).

* An Azure Storage resource (account and container). If you need to create a new storage account in Azure, see [Create a storage account](../storage/common/storage-account-create.md?tabs=azure-portal). When you create a storage account, you have many options, but you need only a new container in your account for this article.

* An Azure Cosmos DB resource (account, database, and container). If you need to create a new instance of Azure Cosmos DB, see [Create an Azure Cosmos DB account](../cosmos-db/nosql/quickstart-portal.md#create-account). For the API option, select **Azure Cosmos DB for NoSQL**.

## Create a route and endpoint

Routes send messages or event logs to an Azure service for storage or processing. Each route has a data source, where the messages or event logs originate, and an endpoint, where the messages or event logs end up. You can use routing queries to filter messages or events before they go to the endpoint. The endpoint can be an event hub, a Service Bus queue or topic, a storage account, or an Azure Cosmos DB resource.

1. In the [Azure portal](https://portal.azure.com), go to your IoT hub.

2. In the resource menu under **Hub settings**,  select **Message routing** then select **Add**.

   :::image type="content" source="media/how-to-routing-portal/message-routing-add.png" alt-text="Screenshot that shows location of the Add button, to add a new route in your IoT hub.":::

3. On the **Endpoint** tab, select an existing endpoint or create a new one by providing the following information:

   # [Cosmos DB](#tab/cosmosdb)

   | Parameter | Value |
   | --------- | ----- |
   | **Endpoint type** | Select **Cosmos DB (preview)**. |
   | **Endpoint name** | Provide a unique name for a new endpoint, or select **Select existing** to choose an existing Storage endpoint. |
   | **Cosmos DB account** | Use the drop-down menu to select an existing Cosmos DB account in your subscription. |
   | **Database** | Use the drop-down menu to select an existing database in your Cosmos DB account. |
   | **Collection** | Use the drop-down menu to select an existing collection (or container). |
   | **Generate a synthetic partition key for messages** | Select **Enable** to support data storage for high-scale scenarios. Otherwise, select **Disable** For more information, see [Partitioning and horizontal scaling in Azure Cosmos DB](../cosmos-db/partitioning-overview.md) and [Synthetic partition keys](../cosmos-db/nosql/synthetic-partition-keys.md). |
   | **Partition key name** | If you enable synthetic partition keys, provide a name for the partition key. The partition key property name is defined at the container level and can't be changed once it has been set. |
   | **Partition key template** | Provide a template that is used to configure the synthetic partition key value. The generated partition key value is automatically added to the partition key property for each new Cosmos DB record. |

   :::image type="content" source="media/how-to-routing-portal/add-cosmos-db-endpoint.png" alt-text="Screenshot that shows details of the Add a Cosmos DB endpoint form." lightbox="media/how-to-routing-portal/add-cosmos-db-endpoint.png":::

   # [Event Hubs](#tab/eventhubs)

   | Parameter | Value |
   | --------- | ----- |
   | **Endpoint type** | Select **Event Hubs**. |
   | **Endpoint name** | Provide a unique name for a new endpoint, or select **Select existing** to choose an existing Event Hubs endpoint. |
   | **Event Hubs namespace** | Use the drop-down menu to select an existing Event Hubs namespace in your subscription. |
   | **Event hub instance** | Use the drop-down menu to select an existing event hub in your namespace. |

   :::image type="content" source="media/how-to-routing-portal/add-event-hub.png" alt-text="Screenshot that shows all options for creating an Event Hubs endpoint.":::

   # [Service Bus topic](#tab/servicebustopic)

   | Parameter | Value |
   | --------- | ----- |
   | **Endpoint type** | Select **Service Bus topic**. |
   | **Endpoint name** | Provide a unique name for a new endpoint, or select **Select existing** to choose an existing Service Bus topic endpoint. |
   | **Service Bus namespace** | Use the drop-down menu to select an existing Service Bus namespace in your subscription. |
   | **Service Bus topic** | Use the drop-down menu to select an existing topic in your namespace. |

   :::image type="content" source="media/how-to-routing-portal/add-service-bus-topic-endpoint.png" alt-text="Screenshot that shows the Add a Service Bus topic endpoint pane with correct options selected.":::

   # [Service Bus queue](#tab/servicebusqueue)

   | Parameter | Value |
   | --------- | ----- |
   | **Endpoint type** | Select **Service Bus queue**. |
   | **Endpoint name** | Provide a unique name for a new endpoint, or select **Select existing** to choose an existing Service Bus queue endpoint. |
   | **Service Bus namespace** | Use the drop-down menu to select an existing Service Bus namespace in your subscription. |
   | **Service Bus queue** | Use the drop-down menu to select an existing queue in your namespace. |

   :::image type="content" source="media/how-to-routing-portal/add-service-bus-endpoint.png" alt-text="Screenshot that shows the Add a service bus queue endpoint pane with correct options selected.":::

   # [Storage](#tab/storage)

   | Parameter | Value |
   | --------- | ----- |
   | **Endpoint type** | Select **Storage**. |
   | **Endpoint name** | Provide a unique name for a new endpoint, or select **Select existing** to choose an existing Storage endpoint. |
   | **Azure Storage container** | Select **Pick a container**. Follow the prompts to select an existing storage account and container in your subscription. |

   :::image type="content" source="media/how-to-routing-portal/add-storage-endpoint.png" alt-text="Screenshot that shows the Add a storage endpoint pane with the correct options selected.":::

   ---

4. Select **Create + next** to create the endpoint and continue to create a route.

5. On the **Route** tab, create a new route to your endpoint by providing the following information:

   | Parameter | Value |
   | --------- | ----- |
   | **Name** | Provide a unique name for the route. |
   | **Data source** | Use the drop-down menu to select a data source for the route. You can route data from telemetry messages or [non-telemetry events](./iot-hub-devguide-messages-d2c.md#non-telemetry-events) |
   | **Routing query** | Optionally, add a query to filter the data before routing. For more information, see [IoT Hub message routing query syntax](./iot-hub-devguide-routing-query-syntax.md). |

   :::image type="content" source="./media/how-to-routing-portal/create-route.png" alt-text="Screenshot that shows all options for adding a route.":::

6. If you added a routing query, use the **Test** feature to provide a sample message and test the route against it.

7. If you want to add a message enrichment to your route, select **Create + add enrichments**. For more information, see [Message enrichments](./iot-hub-message-enrichments-overview.md). If not, select **Create + skip enrichments**.

8. Back on the **Message routing** overview, confirm that your new route appears on the **Routes** tab, and that your new endpoint appears on the **Custom endpoints** tab.

## Update a route

To update a route in the Azure portal:

1. In the Azure portal, go to your IoT hub.

2. In the resource menu under **Hub settings**,  select **Message routing**.

3. In the **Routes** tab, select the route that you want to modify.

4. You can change the following parameters of an existing route:

    * **Endpoint**: You can create a new endpoint or select a different existing endpoint.
    * **Data source**.
    * **Enable route**.
    * **Routing query**.

5. Select **Save**.

## Delete a route

To delete a route in the Azure portal:

1. In **Message routing** for your IoT hub, select the route to delete.

1. Select **Delete**.

   :::image type="content" source="media/how-to-routing-portal/delete-route-portal.png" alt-text="Screenshot that shows where and how to delete an existing IoT hub route." lightbox="media/how-to-routing-portal/delete-route-portal.png":::

## Update a custom endpoint

To update a custom endpoint in the Azure portal:

1. In the Azure portal, go to your IoT hub.

2. In the resource menu under **Hub settings**,  select **Message routing**.

3. In the **Custom endpoints** tab, select the endpoint that you want to modify.

4. You can change the following parameters of an existing endpoint:

   # [Cosmos DB](#tab/cosmosdb)

   * **Generate a synthetic partition key for messages**
   * **Partition key name**
   * **Partition key template**

   # [Event Hubs](#tab/eventhubs)

   * **Event Hub status**
   * **Retention time (hrs)**

   # [Service Bus topic](#tab/servicebustopic)

   You can't modify a Service Bus topic endpoint.

   # [Service Bus queue](#tab/servicebusqueue)

   You can't modify a Service Bus queue endpoint.

   # [Storage](#tab/storage)

   * **Batch frequency**
   * **Chunk size window**
   * **File name format**

   ---

5. Select **Save**.

## Delete a custom endpoint

To delete a custom endpoint in the Azure portal:

1. In the Azure portal, go to your IoT hub.

2. In the resource menu under **Hub settings**,  select **Message routing**.

3. In the **Custom endpoints** tab, use the checkbox to select the endpoint that you want to delete.

4. Select **Delete**.

   :::image type="content" source="media/how-to-routing-portal/delete-endpoint-portal.png" alt-text="Screenshot that shows where and how to delete an existing Event Hubs endpoint." lightbox="media/how-to-routing-portal/delete-endpoint-portal.png":::

## Next steps

To learn more about message routing, see [Tutorial: Send device data to Azure Storage by using IoT Hub message routing](./tutorial-routing.md?tabs=portal). In the tutorial, you create a storage route and test it with a device in your IoT hub.
