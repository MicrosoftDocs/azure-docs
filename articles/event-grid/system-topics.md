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


## What are system topics? 
Azure services like Storage, Media services, and Event Hubs publish events to the Event Grid service when activities are performed against those services. For example, when a blob is uploaded to an Azure Storage account, the Azure Storage service publishes a **blob created** event to the Event Grid service. A **system topic** represents some or all of these events from an Azure source. For example, a system topic may represent all blob events or some blob events (for example: only blob created event) published for a specific storage account. You can create one or more subscriptions for these system topics.  

The system topics are different from custom topics or domains in that only internal Azure services can publish to them. Therefore, you don't see an endpoint or a Shared Access Signature (SAS) key for a system topic. 

## Why system topic is an Azure resource now? 
Previously, the system topic resource was implicit and was not exposed to you for simplicity. Now, it's exposed as an Azure resource so that you can view and manage system topics yourself, set up diagnostic logs, set up alerts etc. for them. 

## How can I create, manage, and delete system topics? 
You can create a system topic in two ways: 

- Create an event subscription on an Azure resource, which internally creates a system topic for you. The system topic is automatically deleted when the last event subscription is deleted. The Event Grid service automatically created a system topic with a **randomly generated name** (`<Azure resource name>-<GUID>`). 

    When you use the [Azure portal](create-view-manage-system-topics.md), you are always using this approach. The system topic is created first whether you are using the **Events** page of an Azure resource to create an event subscription or the **Event Grid System Topics** page. 
- Create a system topic for an Azure resource, and then create an event subscription for that system topic. You can specify a name for the system topic. The system topic isn't deleted automatically when the last event subscription is deleted. You need to manually delete it. 

    When you use [CLI](create-view-manage-system-topics-cli.md), REST, or [Azure Resource Manager template](create-view-manage-system-topics-arm.md), you can choose either of these approaches. We recommend that you create a system topic on an Azure resource first and then create a subscription on the topic, as this is the latest way of creating system topics.

## Where is the system topic created? 
For Azure event sources that are in a specific region/location, system topic is created in the same location as the Azure event source. For example, if you create an event subscription for an Azure blob storage in East US, the system topic is created in East US. For global Azure event sources such as Azure subscriptions, resource groups, or Azure Maps, Event Grid creates the system topic in **global** location. 

In general, system topic is created in the same resource group that the Azure event source is in. For event subscriptions created at Azure subscription scope, system topic is created under the resource group **Default-EventGrid**. If the resource group doesn't exist, Azure Event Grid creates it before creating the system topic. 

## Next steps
See the following articles: 

- [Create, view, and manage system topics by using Azure portal](create-view-manage-system-topics.md).
- [Create, view, and manage Event Grid system topics by using Azure CLI](create-view-manage-system-topics-cli.md)
- [Create Event Grid system topics by using Azure Resource Manager templates](create-view-manage-system-topics-arm.md)
