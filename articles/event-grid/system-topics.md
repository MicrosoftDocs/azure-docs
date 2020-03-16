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
This article describes **system topics** in Azure Event Grid.

## Overview
When you create first event subscription for an Azure event source such as Azure Storage account, the event subscription provisioning process creates an additional resource of type **Microsoft.EventGrid/systemTopics** in the same resource group that has the Azure event source. When the last event subscription to the Azure event source is deleted, the system topic resource is also automatically deleted. 

System topic is not applicable for custom topic scenarios, that is, Event Grid topics and Event Grid domains. This resource is introduced to improve the metrics and diagnostic logs experience for Azure Event resources. This will improve search experience for system topics. 

For regional Azure event sources such as Storage account, system topic is created in the same location as the Azure event source. For global Azure event sources such as Azure subscriptions, resource groups or Azure Maps, system topic is created in **global** location. This feature is currently not enabled for Azure Gov cloud. 
  
For event subscriptions created at Azure subscription scope, system topic is created under the resource group **Default-EventGrid**. If the resource group doesn't exist, Azure Event Grid creates it before creating the system topic. 


## Next steps

* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
