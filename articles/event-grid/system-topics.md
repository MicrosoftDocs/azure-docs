---
title: System topics in Azure Event Grid
description: Describes system topics in Azure Event Grid. 
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: conceptual
ms.date: 03/16/2020
ms.author: spelluru
---

# System topics in Azure Event Grid
The Azure Event Grid service creates system topics when you create a first event subscription for an Azure event source. This article describes **system topics** in Azure Event Grid.

## Overview
When you create first event subscription for an Azure event source such as Azure Storage account, the event subscription provisioning process creates an additional resource of type **Microsoft.EventGrid/systemTopics** in the same resource group that has the Azure event source. When the last event subscription to the Azure event source is deleted, the system topic resource is also automatically deleted.

System topic isn't applicable to custom topic scenarios, that is, Event Grid topics and Event Grid domains. This will improve the search experience. 

For regional Azure event sources such as Storage account, system topic is created in the same location as the Azure event source. For global Azure event sources such as Azure subscriptions, resource groups or Azure Maps, system topic is created in **global** location. This feature is currently not enabled for Azure Gov cloud. 
  
For event subscriptions created at Azure subscription scope, system topic is created under the resource group **Default-EventGrid**. If the resource group doesn't exist, Azure Event Grid creates it before creating the system topic. 

When you try to delete the resource with the storage account, you'll see the system topic in the list of affected resources.  

![Delete resource group](./media/system-topics/delete-resource-group.png)

## Next steps
See the following articles: 

- [Custom topics](event-sources.md#custom-topics)
- [Domains](event-domains.md)