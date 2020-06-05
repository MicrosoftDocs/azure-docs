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
System topics are the topics created for Azure services such as Azure Storage and Azure Event Hubs. You can create system topics using the Azure portal, PowerShell, CLI, or Azure Resource Manager template.  

> [!NOTE]
> This feature is currently not enabled for Azure Government cloud. 

## Create system topics
You can create a system topic in two ways: 

- Create a system topic for an Azure resource, and then create an event subscription for that system topic.
- Create an event subscription on an Azure resource, which internally creates a system topic for you.

When you use the first approach, the system topic isn't automatically deleted when the last event subscription for that system topic is deleted. When you use the second approach, the system topic is automatically deleted when the last event subscription is deleted. 

For detailed instructions on creating system topics using Azure portal, PowerShell, or CLI, see the following articles:

- [Create, view, and manage system topics by using Azure portal](create-view-manage-system-topics.md).
- [Create, view, and manage Event Grid system topics by using Azure CLI](create-view-manage-system-topics-cli.md)
- [Create Event Grid system topics by using Azure Resource Manager templates](create-view-manage-system-topics-arm.md)

## System topic name
Event Grid didn't create system topics for Azure sources (Azure Storage, Azure Event Hubs, etc.) that were created before Mar, 15, 2020. If you created a subscription for an event raised by Azure sources between 3/15/2020 and 6/2/2020, the Event Grid service automatically created a system topic with a **randomly generated name**. After 6/2/2020, you can specify a name for the system topic while creating an event subscription for an Azure source. 

## Location and resource group
For Azure event sources that are in a specific region/location, system topic is created in the same location as the Azure event source. For example, if you create an event subscription for an Azure blob storage in East US, the system topic is created in East US. For global Azure event sources such as Azure subscriptions, resource groups, or Azure Maps, Event Grid creates the system topic in **global** location. 

In general, system topic is created in the same resource group that the Azure event source is in. For event subscriptions created at Azure subscription scope, system topic is created under the resource group **Default-EventGrid**. If the resource group doesn't exist, Azure Event Grid creates it before creating the system topic. 

## Next steps
See the following articles: 

- [Create, view, and manage system topics by using Azure portal](create-view-manage-system-topics.md).
- [Create, view, and manage Event Grid system topics by using Azure CLI](create-view-manage-system-topics-cli.md)
- [Create Event Grid system topics by using Azure Resource Manager templates](create-view-manage-system-topics-arm.md)
