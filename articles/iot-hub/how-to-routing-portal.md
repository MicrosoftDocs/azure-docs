---
title: Create and delete routes and endpoints by using the Azure portal
description: Learn how to create and delete routes and endpoints in Azure IoT Hub by using the Azure portal.
author: kgremban
ms.service: iot-hub
services: iot-hub
ms.topic: how-to
ms.date: 12/15/2022
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

In IoT Hub, you can create a route to send messages or capture events. Each route has a data source and an endpoint. The data source is where messages or event logs originate. The endpoint is where the messages or event logs end up. You choose locations for the data source and endpoint when you create a new route in your IoT hub. Then, you use routing queries to filter messages or events before they go to the endpoint.

You can use an event hub, a Service Bus queue or topic, a storage account, or an Azure Cosmos DB resource to be the endpoint for your IoT hub route. An instance of the service that you use to create your endpoint must first exist in your Azure account.

In the Azure portal, you can create a route and endpoint at the same time. If you use the Azure CLI or Azure PowerShell, you must create an endpoint first, and then create a route.

Decide which route type you want to create: an event hub, a Service Bus queue or topic, a storage account, or an Azure Cosmos DB resource. For the service you choose to use, complete the steps to create a route and an endpoint.

# [Event Hubs](#tab/eventhubs)

To learn how to create an Event Hubs resource, see [Quickstart: Create an event hub by using the Azure portal](../event-hubs/event-hubs-create.md).

1. In the Azure portal, go to your IoT hub. In the resource menu under **Hub settings**,  select **Message routing**.

1. In **Message routing**, on the **Routes** tab, select **Add**.

   :::image type="content" source="media/how-to-routing-portal/message-routing-add.png" alt-text="Screenshot that shows location of the Add button, to add a new route in your IoT hub.":::

1. In **Add a route**, enter or select these values:

   * **Name**: Enter a unique name for your route. It might be helpful to include the endpoint type in the name, such as *my-event-hubs-route*.

   * **Endpoint**: Select **Add endpoint**, and then select **Event hubs**.

      :::image type="content" source="media/how-to-routing-portal/add-endpoint-event-hubs.png" alt-text="Screenshot that shows location of the Add endpoint dropdown.":::

1. In **Add an event hub endpoint**, enter or select these values:

   * **Endpoint name**: Enter a unique name for your endpoint. The endpoint name appears in your IoT hub.

   * **Event hub namespace**: Select the namespace you created in your Event Hubs resource.

   * **Event hub instance**: Select the event hub you created in your Event Hubs resource.

1. Select **Create**.

   :::image type="content" source="media/how-to-routing-portal/add-event-hub.png" alt-text="Screenshot that shows all options to select on the Add an event hub endpoint pane.":::

1. In **Add a route**, leave all default values and select **Save**.

1. In **Message routing**, on the **Routes** tab, confirm that your new route appears.

   :::image type="content" source="media/how-to-routing-portal/see-new-route.png" alt-text="Screenshot that shows the new route you created on the Message routing pane." lightbox="media/how-to-routing-portal/see-new-route.png":::

# [Service Bus queue](#tab/servicebusqueue)

To learn how to create a Service Bus queue, see [Use the Azure portal to create a Service Bus namespace and queue](../service-bus-messaging/service-bus-quickstart-portal.md).

1. In the Azure portal, go to your IoT hub. In the resource menu under **Hub settings**,  select **Message routing**.

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

1. In **Message routing**, on the **Routes** tab, confirm that your new route appears.

   :::image type="content" source="media/how-to-routing-portal/see-new-service-bus-route.png" alt-text="Screenshot that shows the new Service Bus queue route you created on the Message routing pane." lightbox="media/how-to-routing-portal/see-new-service-bus-route.png":::

# [Service Bus topic](#tab/servicebustopic)

To learn how to create a Service Bus topic, see [Use the Azure portal to create a Service Bus topic and subscriptions to the topic](../service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal.md).

1. In the Azure portal, go to your IoT hub. In the resource menu under **Hub settings**,  select **Message routing**.

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

1. In **Message routing**, on the **Routes** tab, confirm that your new route appears.

   :::image type="content" source="media/how-to-routing-portal/see-new-service-bus-topic-route.png" alt-text="Screenshot that shows your new Service Bus topic route on the Message routing pane." lightbox="media/how-to-routing-portal/see-new-service-bus-topic-route.png":::

# [Azure Storage](#tab/azurestorage)

To learn how to create an Azure Storage resource (with container), see [Create a storage account](./tutorial-routing.md?tabs=portal#create-a-storage-account).

1. In the Azure portal, go to your IoT hub. In the resource menu under **Hub settings**,  select **Message routing**.

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

1. In **Message routing**, on the **Routes** tab, confirm that your new route appears.

   :::image type="content" source="media/how-to-routing-portal/see-new-storage-route.png" alt-text="Screenshot that shows your new storage route on the Message routing pane." lightbox="media/how-to-routing-portal/see-new-storage-route.png":::

# [Azure Cosmos DB](#tab/cosmosdb)

To learn how to create an Azure Cosmos DB resource, see [Create an Azure Cosmos DB account](../cosmos-db/nosql/quickstart-portal.md#create-account).

1. In the Azure portal, go to your IoT hub. In the resource menu under **Hub settings**,  select **Message routing**.

1. In **Message routing**, go to your IoT hub resource and select the **Custom endpoints** tab.

1. Select **Add**, and then select **CosmosDB**.

   :::image type="content" source="media/how-to-routing-portal/add-cosmos-db-endpoint.png" alt-text="Screenshot that shows location of the Add button on the Message routing pane on the Custom endpoints tab of the IoT Hub resource.":::

1. In **Add a Cosmos DB endpoint**, enter or select this information:

   * **Endpoint name**: Enter a unique name for your endpoint.

   * **Cosmos DB account**: Select your Azure Cosmos DB account.

   * **Database**: Select your Azure Cosmos DB database.
  
   * **Collection**: Select your Azure Cosmos DB collection.

   * **Generate a synthetic partition key for messages**: Select **Enable** if needed.

     To effectively support high-scale scenarios, you can enable [synthetic partition keys](../cosmos-db/nosql/synthetic-partition-keys.md) for the Cosmos DB endpoint. You can specify the partition key property name in **Partition key name**. The partition key property name is defined at the container level and can't be changed once it has been set.  

     You can configure the synthetic partition key value by specifying a template in **Partition key template** based on your estimated data volume. The generated partition key value is automatically added to the partition key property for each new Cosmos DB record.

     For more information about partitioning, see [Partitioning and horizontal scaling in Azure Cosmos DB](../cosmos-db/partitioning-overview.md).

   :::image type="content" source="media/how-to-routing-portal/add-cosmos-db-endpoint-form.png" alt-text="Screenshot that shows details of the Add a Cosmos DB endpoint form." lightbox="media/how-to-routing-portal/add-cosmos-db-endpoint-form.png":::  

   > [!CAUTION]
   > If you're using the system assigned managed identity for authenticating to Cosmos DB, you must use Azure CLI or Azure PowerShell to assign the Cosmos DB Built-in Data Contributor built-in role definition to the identity. Role assignment for Cosmos DB isn't currently supported from the Azure portal. For more information about the various roles, see [Configure role-based access for Azure Cosmos DB](../cosmos-db/how-to-setup-rbac.md). To understand assigning roles via CLI, see [Manage Azure Cosmos DB SQL role resources.](/cli/azure/cosmosdb/sql/role)

1. Select **Save**.
  
1. In **Message routing**, on the **Routes** tab, confirm that your new route appears.

   :::image type="content" source="media/how-to-routing-portal/cosmos-db-confirm.png" alt-text="Screenshot that shows a new Azure Cosmos DB route in the IoT Hub Message routing pane." lightbox="media/how-to-routing-portal/cosmos-db-confirm.png":::  

---

## Update a route

To update a route in the Azure portal:

1. In **Message routing** for your IoT hub, select the route.

1. You can make any of the following changes to an existing route:

    * For **Endpoint**, select a different endpoint or create a new endpoint.
  
       You can't modify an existing endpoint, but you can create a new endpoint for your IoT hub route, and you can change the endpoint that your route uses.

    * For **Data source**, select a new source.
    * For **Enable route**, enable or disable your route.
    * In **Routing query**, create or change queries.

1. Select **Save**.

   :::image type="content" source="media/how-to-routing-portal/update-route.png" alt-text="Screenshot that shows where and how to modify an existing IoT hub route.":::

## Delete a route

To delete a route in the Azure portal:

1. In **Message routing** for your IoT hub, select the route to delete.

1. Select **Delete**.

   :::image type="content" source="media/how-to-routing-portal/delete-route-portal.png" alt-text="Screenshot that shows where and how to delete an existing IoT hub route." lightbox="media/how-to-routing-portal/delete-route-portal.png":::

## Delete a custom endpoint

To delete a custom endpoint in the Azure portal:

1. In **Message routing** for your IoT hub, select the **Custom endpoints** tab.

1. Select the endpoint to delete.

1. Select **Delete**.

   :::image type="content" source="media/how-to-routing-portal/delete-endpoint-portal.png" alt-text="Screenshot that shows where and how to delete an existing Event Hubs endpoint." lightbox="media/how-to-routing-portal/delete-endpoint-portal.png":::

## Next steps

In this how-to article, you learned how to create a route and an endpoint for Event Hubs, Service Bus queues and topics, Azure Storage, and Azure Cosmos DB.

To learn more about message routing, see [Tutorial: Send device data to Azure Storage by using IoT Hub message routing](./tutorial-routing.md?tabs=portal). In the tutorial, you create a storage route and test it with a device in your IoT hub.