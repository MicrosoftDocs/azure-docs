---
title: Azure CLI - Create, view, and manage system topics in Azure Event Grid
description: This article shows how to use Azure CLI to create, view, and delete system topics. 
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: conceptual
ms.date: 06/02/2020
ms.author: spelluru
---

# Azure CLI - Create, view, and manage system topics in Azure Event Grid
This article shows you how to create and manage system topics using Azure portal, PowerShell, and CLI. For an overview of system topics, see [System topics](system-topics.md).

## Create a system topic
To create a system topic on an Azure source first and then create an event subscription for that topic, see the following reference topics:

- [az eventgrid system-topic create](/cli/azure/ext/eventgrid/eventgrid/system-topic?view=azure-cli-latest#ext-eventgrid-az-eventgrid-system-topic-create)
- [az eventgrid system-topic event-subscription create](/cli/azure/ext/eventgrid/eventgrid/system-topic/event-subscription?view=azure-cli-latest#ext-eventgrid-az-eventgrid-system-topic-event-subscription-create)

To create a system topic (implicitly) when creating an event subscription for an Azure source, use the [az eventgrid event-subscription create](/cli/azure/ext/eventgrid/eventgrid/event-subscription?view=azure-cli-latest#ext-eventgrid-az-eventgrid-event-subscription-create) method. 

## View all system topics
To view all system topics and details of a selected system topic, use the following commands:

- [az eventgrid system-topic list](/cli/azure/ext/eventgrid/eventgrid/system-topic?view=azure-cli-latest#ext-eventgrid-az-eventgrid-system-topic-list)
- [az eventgrid system-topic show](/cli/azure/ext/eventgrid/eventgrid/system-topic?view=azure-cli-latest#ext-eventgrid-az-eventgrid-system-topic-show)

## Delete a system topic
To delete a system topic, use the following command: 

- [az eventgrid system-topic delete](/cli/azure/ext/eventgrid/eventgrid/system-topic?view=azure-cli-latest#ext-eventgrid-az-eventgrid-system-topic-delete)

## Create an event subscription 
To create an event subscription using the system topic you already created, use the following command: 

- [az eventgrid system-topic event-subscription create](/cli/azure/ext/eventgrid/eventgrid/system-topic/event-subscription?view=azure-cli-latest#ext-eventgrid-az-eventgrid-system-topic-event-subscription-create)

## Next steps
See the [System topics in Azure Event Grid](system-topics.md) section to learn more about system topics and topic types supported by Azure Event Grid. 
