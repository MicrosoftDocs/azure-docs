---
title: Azure Event Grid SDKs
description: Describes the SDKs for Azure Event Grid. These SDKs provide management, publishing and consumption.
services: event-grid
author: tfitzmac
manager: timlt

ms.service: event-grid
ms.topic: article
ms.date: 01/30/2018
ms.author: tomfitz
---

# Event Grid SDKs for management and publishing

Event Grid provides SDKs that enable you to programmatically manage your resources and post events.

## Management SDKs

The management SDKs enable you to create, update, and delete event grid topics and subscriptions. Currently, the following SDKs are available:

* [.NET](https://www.nuget.org/packages/Microsoft.Azure.Management.EventGrid/1.1.0-preview)
* Go
* [Node](https://www.npmjs.com/package/azure-arm-eventgrid)
* [Python](https://pypi.python.org/pypi/azure-mgmt-eventgrid/0.3.0)
* Ruby

## Publish SDKs

The publish SDKs enable you to post events to topics by taking care of authenticating, forming the event, and asynchronously posting to the specified endpoint. Currently, the following SDKs are available:

* [.NET](https://www.nuget.org/packages/Microsoft.Azure.EventGrid/1.0.0-preview)
* Go
* Node
* Python
* Ruby

## Next steps

* For an introduction to Event Grid, see [What is Event Grid?](overview.md)
* For Event Grid commands in Azure CLI, see [Azure CLI](/cli/azure/eventgrid).
* For Event Grid commands in PowerShell, see [PowerShell](/powershell/module/azurerm.eventgrid).