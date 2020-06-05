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


## When you use Azure portal 
When you use the Azure portal to create an event subscription for an event raised by an Azure source (for example: Azure Storage account), the portal creates a system topic for the Azure resource and then creates a subscription for the system topic. You specify the name of the system topic if you are creating an event subscription on the Azure resource for the first time. From the second time onwards, the system topic name is displayed for you in the read-only mode. 

You can create a system topic in two ways using the Azure portal:

- Using the **Events** page of the Azure resource page. See [Quickstart: Route Blob storage events to web endpoint with the Azure portal](blob-event-quickstart-portal#subscribe-to-the-blob-storage.md) for detailed steps. 
- Using the **Event Grid System Topics** page. See [Create, view, and manage system topics](create-view-manage-system-topics.md). This article also shows you how to view all the system topics, view details about a system topic, and delete a system topic. 

Event Grid didn't create system topics for Azure sources (Azure Storage, Azure Event Hubs, etc.) that were created before Mar, 15, 2020. If you created a subscription for an event raised by Azure sources between 3/15/2020 and 6/2/2020, the Event Grid service automatically created a system topic with a **randomly generated name**. After 6/2/2020, you can specify a name for the system topic while creating an event subscription for an Azure source. 

The system topics created by using the Azure portal on or after 6/2/2020 aren't automatically deleted when you delete the last event subscription for the Azure source. You can use the above **Event Grid System Topic** page to delete it.

The system topics that were created before 6/2/2020 are automatically deleted when you delete the last event subscription for the Azure source. But, you can also delete it manually using the **Event Grid System Topic** page too. 

For step-by-step instruction on creating, viewing, and managing system topics using the Azure portal, see [Create, view, and manage system topics](create-view-manage-system-topics.md). 

> [!NOTE]
> You can use the system topic name to discover metrics and diagnostic logs.

## PowerShell, CLI, and Resource Manager template
When you use PowerShell, CLI, and Resource Manager templates, you can create a system topic for an Azure source (for example: Azure Storage) in two ways:

- Create a system topic separately, and then create an event subscription for that system topic
- Create an event subscription on the Azure resource, which internally creates a system topic for you 

When you use the first approach, the system topic isn't deleted when the last event subscription for that system topic is deleted. You will need to delete the system topic separately using commands or scripts. 

When you use the second approach, the system topic is automatically deleted when the last event subscription is deleted. 

## Location and resource group
For Azure event sources that are in a specific region/location, system topic is created in the same location as the Azure event source. For example, if you create an event subscription for an Azure blob storage in East US, the system topic is created in East US. For global Azure event sources such as Azure subscriptions, resource groups, or Azure Maps, Event Grid creates the system topic in **global** location. 

In general, system topic is created in the same resource group that the Azure event source is in. For event subscriptions created at Azure subscription scope, system topic is created under the resource group **Default-EventGrid**. If the resource group doesn't exist, Azure Event Grid creates it before creating the system topic. 

## Next steps
See the following article: [Create, view, and manage system topics](create-view-manage-system-topics.md).