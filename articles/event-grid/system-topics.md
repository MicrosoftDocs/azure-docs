---
title: System topics in Azure Event Grid
description: Describes system topics in Azure Event Grid. 
ms.topic: conceptual
ms.date: 09/24/2020
---

# System topics in Azure Event Grid
A system topic in Event Grid represents one or more events published by Azure services such as Azure Storage and Azure Event Hubs. For example, a system topic may represent **all blob events** or only **blob created** and **blob deleted** events published for a **specific storage account**. In this example, when a blob is uploaded to the storage account, the Azure Storage service publishes a **blob created** event to the system topic in Event Grid, which then forwards the event to topic's [subscribers](event-handlers.md) that receive and process the event. 

> [!NOTE] 
> Only Azure services can publish events to system topics. Therefore, you don't get an endpoint or access keys that you can use to publish events like you do for custom topics or domains.

## Azure services that support system topics
Here is the current list of Azure services that support creation of system topics on them.

- [Azure App Configuration](event-schema-app-configuration.md)
- [Azure App Service](event-schema-app-service.md)
- [Azure Blob Storage](event-schema-blob-storage.md)
- [Azure Communication Services](event-schema-communication-services.md) 
- [Azure Container Registry](event-schema-container-registry.md)
- [Azure Event Hubs](event-schema-event-hubs.md)
- [Azure IoT Hub](event-schema-iot-hub.md)
- [Azure Key Vault](event-schema-key-vault.md)
- [Azure Machine Learning](event-schema-machine-learning.md)
- [Azure Maps](event-schema-azure-maps.md)
- [Azure Media Services](event-schema-media-services.md)
- [Azure resource groups](event-schema-resource-groups.md)
- [Azure Service Bus](event-schema-service-bus.md)
- [Azure SignalR](event-schema-azure-signalr.md)
- [Azure subscriptions](event-schema-subscriptions.md)
- [Azure Cache for Redis](event-schema-azure-cache.md)

## System topics as Azure resources
In the past, a system topic was implicit and wasn't exposed for simplicity. System topics are now visible as Azure resources and provide the following capabilities:

- [View system topics in the Azure portal](create-view-manage-system-topics.md#view-all-system-topics)
- Export Resource Manager templates for system topics and event subscriptions in the Azure portal
- [Set up diagnostic logs for system topics](enable-diagnostic-logs-topic.md#enable-diagnostic-logs-for-a-system-topic)
- Set up alerts on publish and delivery failures 

## Lifecycle of system topics
You can create a system topic in two ways: 

- Create an [event subscription on an Azure resource as an extension resource](/rest/api/eventgrid/version2020-06-01/eventsubscriptions/createorupdate), which automatically creates a system topic with the name in the format: `<Azure resource name>-<GUID>`. The system topic created in this way is automatically deleted when the last event subscription for the topic is deleted. 
- Create a system topic for an Azure resource, and then create an event subscription for that system topic. When you use this method, you can specify a name for the system topic. The system topic isn't deleted automatically when the last event subscription is deleted. You need to manually delete it. 

    When you use the Azure portal, you are always using this method. When you create an event subscription using the [**Events** page of an Azure resource](blob-event-quickstart-portal.md#subscribe-to-the-blob-storage), the system topic is created first and then the subscription for the topic is created. You can explicitly create a system topic first by using the [**Event Grid System Topics** page](create-view-manage-system-topics.md#create-a-system-topic) and then create a subscription for that topic. 

When you use [CLI](create-view-manage-system-topics-cli.md), [REST](/rest/api/eventgrid/version2020-06-01/eventsubscriptions/createorupdate), or [Azure Resource Manager template](create-view-manage-system-topics-arm.md), you can choose either of the above methods. We recommend that you create a system topic first and then create a subscription on the topic, as this is the latest way of creating system topics.

The system topic creation fails if you have set up Azure policies in such a way that the Event Grid service can't create it. For example, you may have a policy that allows creation of only certain types of resources (for example: Azure Storage, Azure Event Hubs, etc.) in the subscription. 

## Location and resource group for a system topic
For Azure event sources that are in a specific region/location, system topic is created in the same location as the Azure event source. For example, if you create an event subscription for an Azure blob storage in East US, the system topic is created in East US. For global Azure event sources such as Azure subscriptions, resource groups, or Azure Maps, Event Grid creates the system topic in **global** location. 

In general, system topic is created in the same resource group that the Azure event source is in. For event subscriptions created at Azure subscription scope, system topic is created in the **Default-EventGrid** resource group in the **West US 2** region. If the resource group doesn't exist, Azure Event Grid creates it before creating the system topic. 

## Next steps
See the following articles: 

- [Create, view, and manage system topics by using Azure portal](create-view-manage-system-topics.md).
- [Create, view, and manage Event Grid system topics by using Azure CLI](create-view-manage-system-topics-cli.md)
- [Create Event Grid system topics by using Azure Resource Manager templates](create-view-manage-system-topics-arm.md)
