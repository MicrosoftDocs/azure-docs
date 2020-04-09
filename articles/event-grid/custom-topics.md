---
title: Custom topics in Azure Event Grid
description: Describes custom topics in Azure Event Grid. 
services: event-grid
author: spelluru

ms.service: event-grid
ms.topic: conceptual
ms.date: 03/16/2020
ms.author: spelluru
---

# Custom topics in Azure Event Grid
Subscribe to custom topics to respond to application events.

## Azure portal tutorials
|Title  |Description  |
|---------|---------|
| [Quickstart: create and route custom events with the Azure portal](custom-event-quickstart-portal.md) | Shows how to use the portal to send custom events. |
| [Quickstart: route custom events to Azure Queue storage](custom-event-to-queue-storage.md) | Describes how to send custom events to a Queue storage. |
| [How to: post to custom topic](post-to-custom-topic.md) | Shows how to post an event to a custom topic. |


## Azure CLI tutorials
|Title  |Description  |
|---------|---------|
| [Quickstart: create and route custom events with Azure CLI](custom-event-quickstart.md) | Shows how to use Azure CLI to send custom events. |
| [Azure CLI: create Event Grid custom topic](./scripts/event-grid-cli-create-custom-topic.md)|Sample script that creates a custom topic. The script retrieves the endpoint and a key.|
| [Azure CLI: subscribe to events for a custom topic](./scripts/event-grid-cli-subscribe-custom-topic.md)|Sample script that creates a subscription for a custom topic. It sends events to a WebHook.|

## Azure PowerShell tutorials
|Title  |Description  |
|---------|---------|
| [Quickstart: create and route custom events with Azure PowerShell](custom-event-quickstart-powershell.md) | Shows how to use Azure PowerShell to send custom events. |
| [PowerShell: create Event Grid custom topic](./scripts/event-grid-powershell-create-custom-topic.md)|Sample script that creates a custom topic. The script retrieves the endpoint and a key.|
| [PowerShell: subscribe to events for a custom topic](./scripts/event-grid-powershell-subscribe-custom-topic.md)|Sample script that creates a subscription for a custom topic. It sends events to a WebHook.|

## ARM template tutorials
|Title  |Description  |
|---------|---------|
| [Resource Manager template: custom topic and WebHook endpoint](https://github.com/Azure/azure-quickstart-templates/tree/master/101-event-grid) | A Resource Manager template that creates a custom topic and subscription for that custom topic. It sends events to a WebHook. |
|
| [Resource Manager template: custom topic and Event Hubs endpoint](https://github.com/Azure/azure-quickstart-templates/tree/master/101-event-grid-event-hubs-handler)| A Resource Manager template that creates a subscription for a custom topic. It sends events to an Azure Event Hubs. |
| [Event schema](event-schema.md) | Shows fields in custom events. |

## Next steps
See the following articles: 

- [System topics](system-topics.md)
- [Domains](event-domains.md)