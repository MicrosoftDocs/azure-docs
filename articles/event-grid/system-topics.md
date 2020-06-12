---
title: System topics in Azure Event Grid
description: Describes system topics in Azure Event Grid. 
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: conceptual
ms.date: 06/02/2020
ms.author: spelluru
---

# System topics in Azure Event Grid
Azure services like Azure Storage, Azure Media services, and Azure Event Hubs publish events to the Azure Event Grid service when activities are performed against those services. Those events are represented by **system topics** in Event Grid. For example, a system topic represents **all blob events** published for a **specific storage account**. You can create one or more subscriptions for a system topic to process those events.  

Note that only Azure services can publish events to system topics. Therefore, you don't get an endpoint or access keys that you can use to publish events like you do for custom topics or domains.

## System topics as Azure resources
Previously, the system topic resource was implicit and wasn't exposed to you for simplicity. Now, it's exposed as an Azure resource so that you can:

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

In general, system topic is created in the same resource group that the Azure event source is in. For event subscriptions created at Azure subscription scope, system topic is created under the resource group **Default-EventGrid**. If the resource group doesn't exist, Azure Event Grid creates it before creating the system topic. 

## Next steps
See the following articles: 

- [Create, view, and manage system topics by using Azure portal](create-view-manage-system-topics.md).
- [Create, view, and manage Event Grid system topics by using Azure CLI](create-view-manage-system-topics-cli.md)
- [Create Event Grid system topics by using Azure Resource Manager templates](create-view-manage-system-topics-arm.md)
