---
title: Azure event grid subscription with template
description: Create an event grid subscription with a Resource Manager template.
services: event-grid
author: tfitzmac
manager: timlt

ms.service: event-grid
ms.topic: article
ms.date: 01/30/2018
ms.author: tomfitz
---

# Use Resource Manager template for Event Grid subscription

This article shows how to use an Azure Resource Manager template to create Event Grid subscriptions. The format you use differs based on whether you are subscribing to resource group events, or events for a particular resource type. Both formats are shown in this article.

## Subscribe to resource group events

When subscribing to resource group events, use `Microsoft.EventGrid/eventSubscriptions` for the resource type. For event point type, use either `WebHook` or `EventHub`.

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {},
    "resources": [
        {
            "type": "Microsoft.EventGrid/eventSubscriptions",
            "name": "mySubscription",
            "apiVersion": "2018-01-01",
            "properties": {
                "destination": {
                    "endpointType": "WebHook",
                    "properties": {
                        "endpointUrl": "https://requestb.in/ynboxiyn"
                    }
                },
                "filter": {
                    "subjectBeginsWith": "",
                    "subjectEndsWith": "",
                    "isSubjectCaseSensitive": false,
                    "includedEventTypes": ["All"]
                }
            }
        }
    ]
}
```

When you deploy this template to a resource group, you subscribe to events for that resource group.

## Subscribe to resource events

When subscribing to resource events, you associate the subscription to the correct resource by including the resource type and name in the subscription definition. For the resource type, use `<provider-namespace>/<resource-type>/providers/eventSubscriptions`. For the name, use `<resource-name>/Microsoft.EventGrid/<subscription-name>`. For event point type, use either `WebHook` or `EventHub`.

The following example shows how to subscribe to Blob storage events.

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "storageName": {
            "type": "string"
        }
    },
    "resources": [
        {
            "type": "Microsoft.Storage/storageAccounts/providers/eventSubscriptions",
            "name": "[concat(parameters('storageName'), '/Microsoft.EventGrid/myStorageSubscription')]",
            "apiVersion": "2018-01-01",
            "properties": {
                "destination": {
                    "endpointType": "WebHook",
                    "properties": {
                        "endpointUrl": "https://requestb.in/ynboxiyn"
                    }
                },
                "filter": {
                    "subjectBeginsWith": "",
                    "subjectEndsWith": "",
                    "isSubjectCaseSensitive": false
                }
            }
        }
    ]
}
```

## Next steps

* For an introduction to Event Grid, see [About Event Grid](overview.md).
* For an introduction to Resource Manager, see [Azure Resource Manager overview](../azure-resource-manager/resource-group-overview.md).
* To get started with Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).