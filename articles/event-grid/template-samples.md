---
title: Azure Resource Manager template samples - Event Grid | Microsoft Docs
description: This article provides a list of Azure Resource Manager template samples for Azure Event Grid on GitHub.
ms.topic: sample
ms.custom: devx-track-arm-template
ms.date: 09/28/2021
---

# Azure Resource Manager templates for Event Grid

For the JSON syntax and properties to use in a template, see [Microsoft.EventGrid resource types](/azure/templates/microsoft.eventgrid/allversions). The following table includes links to Azure Resource Manager templates for Event Grid.

## Event Grid subscriptions
- [Custom topic and subscription with WebHook endpoint](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.eventgrid/event-grid) - Deploys an Event Grid custom topic. Creates a subscription to that custom topic that uses a WebHook endpoint. 
- [Custom topic subscription with EventHub endpoint](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.eventgrid/event-grid-event-hubs-handler) - Creates an Event Grid subscription to a custom topic. The subscription uses an Event Hub for the endpoint. 
- [Azure subscription or resource group subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.eventgrid/event-grid-resource-events-to-webhook) - Subscribes to events for a resource group or Azure subscription. The resource group you specify as the target during deployment is the source of events. The subscription uses a WebHook for the endpoint. 
- [Blob storage account and subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.eventgrid/event-grid-subscription-and-storage) - Deploys an Azure Blob storage account and subscribes to events for that storage account. 

## Next steps
See the following samples:

- [PowerShell samples](powershell-samples.md)
- [CLI samples](scripts/cli-subscribe-custom-topic.md)
