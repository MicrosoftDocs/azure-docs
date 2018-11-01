---
title: How to manage large sets of topics in Azure Event Grid and publish events to them using Event Domains
description: Shows how to create and manage topics in Azure Event Grid and publish events to them using Event Domains.
services: event-grid
author: banisadr

ms.service: event-grid
ms.author: babanisa
ms.topic: conceptual
ms.date: 10/30/2018
---

# Manage topics and publish events using Event Domains

This article shows how to:

* Create an Event Grid Domain
* Subscribe to topics
* List keys
* Publish events to a Domain

[!INCLUDE [event-grid-preview-feature-note.md](../../includes/event-grid-preview-feature-note.md)]

## Create an Event Domain

Creating an Event Domain can be done via the `eventgrid` extension for [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest). Once you've created a Domain, you can use it to manage large sets of topics.

```azurecli-interactive
# if you haven't already installed the extension, do it now.
# This extension is required for preview features.
az extension add --name eventgrid

az eventgrid domain create \
  -g <my-resource-group> \
  --name <my-domain-name>
  -l <location>
```

Successful creation will return the following:

```json
{
  "endpoint": "https://<my-domain-name>.westus2-1.eventgrid.azure.net/api/events",
  "id": "/subscriptions/<sub-id>/resourceGroups/<my-resource-group>/providers/Microsoft.EventGrid/domains/<my-domain-name>",
  "inputSchema": "EventGridSchema",
  "inputSchemaMapping": null,
  "location": "westus2",
  "name": "<my-domain-name>",
  "provisioningState": "Succeeded",
  "resourceGroup": "<my-resource-group>",
  "tags": null,
  "type": "Microsoft.EventGrid/domains"
}
```

Note the `endpoint` and `id` as they will be required to manage the Domain and publish events.

## Create topics and subscriptions

The Event Grid service automatically creates and manages the corresponding topic in a Domain based on the call to create an event subscription for a Domain topic. There's no separate step to create a topic in a Domain. Similarly, when the last event subscription for a topic is deleted, the topic is deleted as well.

Subscribing to a topic in a domain is the same as subscribing to any other Azure resource:

```azurecli-interactive
az eventgrid event-subscription create \
  --name <event-subscription> \
  --resource-id "/subscriptions/<sub-id>/resourceGroups/<my-resource-group>/providers/Microsoft.EventGrid/domains/<my-domain-name>/topics/<my-topic>" \
  --endpoint https://contoso.azurewebsites.net/api/f1?code=code
```

The resource ID given is the same ID returned when creating the Domain earlier. To specify the topic you want to subscribe to, add `/topics/<my-topic>` to the end of the resource ID.

To create a Domain scope event subscription that receives all events in the Domain, give the domain as the `resource-id` without specifying any topics for example `/subscriptions/<sub-id>/resourceGroups/<my-resource-group>/providers/Microsoft.EventGrid/domains/<my-domain-name>`.

If you need a test endpoint to subscribe your events to, you can always deploy a [pre-built web app](https://github.com/Azure-Samples/azure-event-grid-viewer) that displays the incoming events. You can send your events to your test website at `https://<your-site-name>.azurewebsites.net/api/updates`.

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-event-grid-viewer%2Fmaster%2Fazuredeploy.json" target="_blank"><img src="http://azuredeploy.net/deploybutton.png"/></a>

Permissions that are set for a topic are stored in Azure Active Directory and must be deleted explicitly. Deleting an event subscription won't revoke a users access to create event subscriptions if they have write access on a topic.

## Manage access to topics

Managing access to topics is done via [role assignment](https://docs.microsoft.com/en-us/azure/role-based-access-control/role-assignments-cli). Role assignment uses Role Based Access Check to limit operations on Azure resources to authorized users at a certain scope.

Event Grid has two built-in roles which you can use to assign particular users access on various topics within a domain. These roles are `EventGrid EventSubscription Contributor (Preview)`, which allows for creation and deletion of subscriptions, and `EventGrid EventSubscription Reader (Preview)`, which only allows for listing of event subscriptions.

The following command would limit `alice@contoso.com` to creating and deleting event subscriptions only on topic `foo`:

```azurecli-interactive
az role assignment create --assignee alice@contoso.com --role "EventGrid EventSubscription Contributor (Preview)" --scope /subscriptions/<sub-id>/resourceGroups/<my-resource-group>/providers/Microsoft.EventGrid/domains/<my-domain-name>/topics/foo
```

See [Event Grid security and authentication](./security-authentication.md) for more on:

* Management access control
* Operation types
* Creating custom role definitions

## Publish events to an Event Grid Domain

Publishing events to a Domain is the same as [publishing to a custom topic](./post-to-custom-topic.md). The only difference is that you need to specify the topic you wish each event to go to. The following array of events would result in event with `"id": "1111"` to topic `foo` while event with `"id": "2222"` would be sent to topic `bar`:

```json
[{
  "topic": "foo",
  "id": "1111",
  "eventType": "maintenanceRequested",
  "subject": "myapp/vehicles/diggers",
  "eventTime": "2018-10-30T21:03:07+00:00",
  "data": {
    "make": "Contoso",
    "model": "Small Digger"
  },
  "dataVersion": "1.0"
},
{
  "topic": "bar",
  "id": "2222",
  "eventType": "maintenanceCompleted",
  "subject": "myapp/vehicles/tractors",
  "eventTime": "2018-10-30T21:04:12+00:00",
  "data": {
    "make": "Contoso",
    "model": "Big Tractor"
  },
  "dataVersion": "1.0"
}]
```

To get the keys for a Domain use:

```azurecli-interactive
az eventgrid domain key list \
  -g <my-resource-group> \
  -n <my-domain>
```

And then use your favorite method of making an HTTP POST to publish your events to your Event Grid Domain.

## Next steps

* For more information on high-level concepts in Event Domains and why they're useful, see the [conceptual overview of Event Domains](./event-domains.md).