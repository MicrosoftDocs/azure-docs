---
title: System topics in Azure Event Grid
description: Describes system topics in Azure Event Grid. 
ms.topic: conceptual
ms.custom: build-2023
ms.date: 04/27/2023
---

# System topics in Azure Event Grid
A system topic in Event Grid represents one or more **events published by Azure services** such as Azure Storage and Azure Event Hubs. For example, a system topic may represent **all blob events** or only **blob created** and **blob deleted** events published for a **specific storage account**. In this example, when a blob is uploaded to the storage account, the Azure Storage service publishes a **blob created** event to the system topic in Event Grid, which then forwards the event to topic's [subscribers](event-handlers.md) that receive and process the event. 

> [!NOTE] 
> Only Azure services can publish events to system topics. Therefore, you don't get an endpoint or access keys that you can use to publish events like you do for [custom topics](custom-topics.md) or [event domains](event-domains.md).

## Azure services that support system topics
Here's the current list of Azure services that support creation of system topics on them.

[!INCLUDE [event-sources-system-topics.md](includes/event-sources-system-topics.md)]


## System topics as Azure resources
System topics are visible as Azure resources and provide the following capabilities:

- [View system topics in the Azure portal](create-view-manage-system-topics.md#view-all-system-topics)
- Export Resource Manager templates for system topics and event subscriptions in the Azure portal
- [Set up diagnostic logs for system topics](enable-diagnostic-logs-topic.md#enable-diagnostic-logs-for-event-grid-system-topics)
- [Set up alerts](set-alerts.md) on publish and delivery failures 

> [!NOTE]
> - Only one Azure Event Grid system topic is allowed per source (like subscription, resource group, etc.).
> - A resource group is required for subscription-level system topic and can't be changed until deleted or moved to another subscription.  
> - Event Grid creates a system topic resource in the same Azure subscription that has the event source. For example, if you create a system topic for a storage account `ContosoStorage` in an Azure subscription `ContosoSubscription`, Event Grid creates the system topic in the `ContosoSubscription`. It's not possible to create a system topic in an Azure subscription that's different from the event source's Azure subscription.

## Lifecycle of system topics
You can create a system topic in two ways: 

- Create an [event subscription on an Azure resource as an extension resource](/rest/api/eventgrid/controlplane-preview/event-subscriptions/create-or-update), which automatically creates a system topic with the name in the format: `<Azure resource name>-<GUID>`. The system topic created in this way is automatically deleted when the last event subscription for the topic is deleted. 
- Create a system topic for an Azure resource, and then create an event subscription for that system topic. When you use this method, you can specify a name for the system topic. The system topic isn't deleted automatically when the last event subscription is deleted. You need to manually delete it. 

    When you use the Azure portal, you're always using this method. When you create an event subscription using the [**Events** page of an Azure resource](blob-event-quickstart-portal.md#subscribe-to-the-blob-storage), the system topic is created first and then the subscription for the topic is created. You can explicitly create a system topic first by using the [**Event Grid System Topics** page](create-view-manage-system-topics.md#create-a-system-topic) and then create a subscription for that topic. 

When you use [CLI](create-view-manage-system-topics-cli.md), [REST](/rest/api/eventgrid/controlplane-preview/event-subscriptions/create-or-update), or [Azure Resource Manager template](create-view-manage-system-topics-arm.md), you can choose either of the above methods. 

> [!IMPORTANT]
> We recommend that you create a system topic first and then create a subscription on the topic, as it's the latest way of creating system topics.

### Failure to create system topics
The system topic creation fails if you have set up Azure policies in such a way that the Event Grid service can't create it. For example, you may have a policy that allows creation of only certain types of resources (for example: Azure Storage, Azure Event Hubs, and so on.) in the subscription. 

In such cases, event flow functionality is preserved. However, metrics and diagnostic functionalities of system topics are unavailable.

If you require this functionality, allow creation of resources of the system topic type, and create the missing system topic as described in the [Lifecycle of system topics](#lifecycle-of-system-topics) section.

## Location and resource group for a system topic
For Azure event sources that are in a specific region/location, system topic is created in the same location as the Azure event source. For example, if you create an event subscription for an Azure blob storage in East US, the system topic is created in East US. For global Azure event sources such as Azure subscriptions, resource groups, or Azure Maps, Event Grid creates the system topic in **global** location. 

In general, system topic is created in the same resource group that the Azure event source is in. For event subscriptions created at Azure subscription scope, system topic is created in the **Default-EventGrid** resource group in the **West US 2** region. If the resource group doesn't exist, Azure Event Grid creates it before creating the system topic. 

## Next steps
See the following articles: 

- [Create, view, and manage system topics by using Azure portal](create-view-manage-system-topics.md).
- [Create, view, and manage Event Grid system topics by using Azure CLI](create-view-manage-system-topics-cli.md)
- [Create Event Grid system topics by using Azure Resource Manager templates](create-view-manage-system-topics-arm.md)
