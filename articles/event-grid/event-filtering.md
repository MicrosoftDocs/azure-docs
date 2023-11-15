---
title: Event filtering for Azure Event Grid
description: Describes how to filter events when creating an Azure Event Grid subscription.
ms.topic: conceptual
ms.custom:
  - devx-track-arm-template
  - ignite-2023
ms.date: 11/02/2023
---

# Understand event filtering for Event Grid subscriptions

This article describes the different ways to filter which events are sent to your endpoint. When creating an event subscription, you have three options for filtering:

* Event types
* Subject begins with or ends with
* Advanced fields and operators

## Azure Resource Manager template

The examples shown in this article are JSON snippets for defining filters in Azure Resource Manager (ARM) templates. For an example of a complete ARM template and deploying an ARM template, see [Quickstart: Route Blob storage events to web endpoint by using an ARM template](blob-event-quickstart-template.md). Here's some more sections around the `filter` section from the example in the quickstart. The ARM template defines the following resources.

- Azure storage account
- System topic for the storage account
- Event subscription for the system topic. You'll see the `filter` subsection in the event subscription section.

In the following example, the event subscription filters for `Microsoft.Storage.BlobCreated` and `Microsoft.Storage.BlobDeleted` events.

```json
{
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-08-01",
      "name": "[parameters('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "StorageV2",
      "properties": {
        "accessTier": "Hot"
      }
    },
    {
      "type": "Microsoft.EventGrid/systemTopics",
      "apiVersion": "2021-12-01",
      "name": "[parameters('systemTopicName')]",
      "location": "[parameters('location')]",
      "properties": {
        "source": "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]",
        "topicType": "Microsoft.Storage.StorageAccounts"
      },
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
      ]
    },
    {
      "type": "Microsoft.EventGrid/systemTopics/eventSubscriptions",
      "apiVersion": "2021-12-01",
      "name": "[format('{0}/{1}', parameters('systemTopicName'), parameters('eventSubName'))]",
      "properties": {
        "destination": {
          "properties": {
            "endpointUrl": "[parameters('endpoint')]"
          },
          "endpointType": "WebHook"
        },
        "filter": {
          "includedEventTypes": [
            "Microsoft.Storage.BlobCreated",
            "Microsoft.Storage.BlobDeleted"
          ]
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.EventGrid/systemTopics', parameters('systemTopicName'))]"
      ]
    }
  ]
}
```

[!INCLUDE [event-filtering](./includes/event-filtering.md)]

## Next steps

* To learn about filtering events with PowerShell and Azure CLI, see [Filter events for Event Grid](how-to-filter-events.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
