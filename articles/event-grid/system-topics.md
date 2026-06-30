---
title: System topics in Azure Event Grid
description: System topics in Azure Event Grid represent events published by Azure services such as Azure Storage and Azure Event Hubs. Explore their lifecycle, location, and management.
ms.topic: concept-article
ms.date: 06/11/2026
ai-usage: ai-assisted
---

# System topics in Azure Event Grid
A system topic in Event Grid represents one or more **events published by Azure services** such as Azure Storage and Azure Event Hubs. For example, a system topic can represent **all blob events** or only **blob created** and **blob deleted** events published for a **specific storage account**. In this example, when a blob is uploaded to the storage account, the Azure Storage service publishes a **blob created** event to the system topic in Event Grid, which then forwards the event to the topic's [subscribers](event-handlers.md) that receive and process the event. 

> [!NOTE] 
> Only Azure services can publish events to system topics. Therefore, you don't get an endpoint or access keys that you can use to publish events like you do for [custom topics](custom-topics.md) or [event domains](event-domains.md).

## Azure services that support system topics
The following Azure services support system topics.

[!INCLUDE [event-sources-system-topics.md](includes/event-sources-system-topics.md)]


## System topics as Azure resources
System topics are visible as Azure resources and provide the following capabilities:

- [View system topics in the Azure portal](create-view-manage-system-topics.md#view-all-system-topics)
- Export Resource Manager templates for system topics and event subscriptions in the Azure portal
- [Set up diagnostic logs for system topics](enable-diagnostic-logs-topic.md#enable-diagnostic-logs-for-event-grid-system-topics)
- [Set up alerts](set-alerts.md) on publish and delivery failures 

> [!NOTE]
> - Azure Event Grid allows only one system topic per source (such as a subscription or resource group).
> - A subscription-level system topic requires a resource group. You can't change the resource group until you delete the system topic or move it to another subscription.
> - Event Grid creates a system topic resource in the same Azure subscription that has the event source. For example, if you create a system topic for a storage account `ContosoStorage` in an Azure subscription `ContosoSubscription`, Event Grid creates the system topic in the `ContosoSubscription`. You can't create a system topic in an Azure subscription that's different from the event source's Azure subscription.

## Lifecycle of system topics
You can create a system topic in two ways: 

- Create an [event subscription on an Azure resource as an extension resource](/rest/api/eventgrid/controlplane-preview/event-subscriptions/create-or-update), which automatically creates a system topic with the name in the format: `<Azure resource name>-<GUID>`. The system topic created in this way is automatically deleted when the last event subscription for the topic is deleted. 
- Create a system topic for an Azure resource, and then create an event subscription for that system topic. When you use this method, you can specify a name for the system topic. The system topic isn't deleted automatically when the last event subscription is deleted. You need to manually delete it. 

    When you use the Azure portal, you're always using this method. When you create an event subscription using the [**Events** page of an Azure resource](blob-event-quickstart-portal.md#subscribe-to-the-blob-storage), the system topic is created first and then the subscription for the topic is created. You can explicitly create a system topic first by using the [**Event Grid System Topics** page](create-view-manage-system-topics.md#create-a-system-topic) and then create a subscription for that topic. 

When you use [CLI](create-view-manage-system-topics-cli.md), [REST](/rest/api/eventgrid/controlplane-preview/event-subscriptions/create-or-update), or [Azure Resource Manager template](create-view-manage-system-topics-arm.md), you can choose either of the above methods. 

> [!IMPORTANT]
> Create a system topic first and then create a subscription on the topic. This approach is the recommended way of creating system topics.

### Failure to create system topics
System topic creation fails if Azure policies prevent the Event Grid service from creating it. For example, a policy might allow creation of only certain resource types (such as Azure Storage and Azure Event Hubs) in the subscription. 

In such cases, event flow functionality continues to work. However, you can't use metrics and diagnostic capabilities of system topics.

If you need this functionality, allow creation of resources of the system topic type, and create the missing system topic as described in the [Lifecycle of system topics](#lifecycle-of-system-topics) section.

## Location and resource group for a system topic
For Azure event sources in a specific region/location, Event Grid creates the system topic in the same location as the Azure event source. For example, if you create an event subscription for an Azure blob storage in East US, Event Grid creates the system topic in East US. For global Azure event sources such as Azure subscriptions, resource groups, or Azure Maps, Event Grid creates the system topic in the **global** location. 

In general, Event Grid creates the system topic in the same resource group as the Azure event source. For event subscriptions at Azure subscription scope, Event Grid creates the system topic in the **Default-EventGrid** resource group in the **West US 2** region. If the resource group doesn't exist, Azure Event Grid creates it before creating the system topic. 

## Related content

- [Create, view, and manage system topics by using Azure portal](create-view-manage-system-topics.md)
- [Create, view, and manage Event Grid system topics by using Azure CLI](create-view-manage-system-topics-cli.md)
- [Create Event Grid system topics by using Azure Resource Manager templates](create-view-manage-system-topics-arm.md)
