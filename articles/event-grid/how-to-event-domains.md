---
title: Publish events with event domains with Azure Event Grid
description: Shows how to manage large sets of topics in Azure Event Grid and publish events to them using event domains.
services: event-grid
author: femila

ms.service: event-grid
ms.author: femila
ms.topic: conceptual
ms.date: 10/22/2019
---

# Manage topics and publish events using event domains

This article shows how to:

* Create an Event Grid domain
* Subscribe to event grid topics
* List keys
* Publish events to a domain

To learn about event domains, see [Understand event domains for managing Event Grid topics](event-domains.md).

[!INCLUDE [requires-azurerm](../../includes/requires-azurerm.md)]

## Install preview feature

[!INCLUDE [event-grid-preview-feature-note.md](../../includes/event-grid-preview-feature-note.md)]

## Create an Event Domain

To manage large sets of topics, create an event domain.

# [Azure CLI](#tab/azurecli)

```azurecli-interactive
# If you haven't already installed the extension, do it now.
# This extension is required for preview features.
az extension add --name eventgrid

az eventgrid domain create \
  -g <my-resource-group> \
  --name <my-domain-name> \
  -l <location>
```

# [PowerShell](#tab/powershell)
```azurepowershell-interactive
# If you have not already installed the module, do it now.
# This module is required for preview features.
Install-Module -Name AzureRM.EventGrid -AllowPrerelease -Force -Repository PSGallery

New-AzureRmEventGridDomain `
  -ResourceGroupName <my-resource-group> `
  -Name <my-domain-name> `
  -Location <location>
```
---

Successful creation returns the following values:

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

Note the `endpoint` and `id` as they're required to manage the domain and publish events.

## Manage access to topics

Managing access to topics is done via [role assignment](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-cli). Role assignment uses role-based access control to limit operations on Azure resources to authorized users at a certain scope.

Event Grid has two built-in roles, which you can use to assign particular users access on various topics within a domain. These roles are `EventGrid EventSubscription Contributor (Preview)`, which allows for creation and deletion of subscriptions, and `EventGrid EventSubscription Reader (Preview)`, which only allows for listing of event subscriptions.

# [Azure CLI](#tab/azurecli)
The following Azure CLI command limits `alice@contoso.com` to creating and deleting event subscriptions only on topic `demotopic1`:

```azurecli-interactive
az role assignment create \
  --assignee alice@contoso.com \
  --role "EventGrid EventSubscription Contributor (Preview)" \
  --scope /subscriptions/<sub-id>/resourceGroups/<my-resource-group>/providers/Microsoft.EventGrid/domains/<my-domain-name>/topics/demotopic1
```

# [PowerShell](#tab/powershell)
The following PowerShell command limits `alice@contoso.com` to creating and deleting event subscriptions only on topic `demotopic1`:

```azurepowershell-interactive
New-AzureRmRoleAssignment `
  -SignInName alice@contoso.com `
  -RoleDefinitionName "EventGrid EventSubscription Contributor (Preview)" `
  -Scope /subscriptions/<sub-id>/resourceGroups/<my-resource-group>/providers/Microsoft.EventGrid/domains/<my-domain-name>/topics/demotopic1
```
---

For more information about managing access for Event Grid operations, see [Event Grid security and authentication](./security-authentication.md).

## Create topics and subscriptions

The Event Grid service automatically creates and manages the corresponding topic in a domain based on the call to create an event subscription for a domain topic. There's no separate step to create a topic in a domain. Similarly, when the last event subscription for a topic is deleted, the topic is deleted as well.

Subscribing to a topic in a domain is the same as subscribing to any other Azure resource. For the source resource ID, specify the event domain ID returned when creating the domain earlier. To specify the topic you want to subscribe to, add `/topics/<my-topic>` to the end of the source resource ID. To create a domain scope event subscription that receives all events in the domain, specify the event domain ID without specifying any topics.

Typically, the user you granted access to in the preceding section would create the subscription. To simplify this article, you create the subscription. 

# [Azure CLI](#tab/azurecli)

```azurecli-interactive
az eventgrid event-subscription create \
  --name <event-subscription> \
  --source-resource-id "/subscriptions/<sub-id>/resourceGroups/<my-resource-group>/providers/Microsoft.EventGrid/domains/<my-domain-name>/topics/demotopic1" \
  --endpoint https://contoso.azurewebsites.net/api/updates
```

# [PowerShell](#tab/powershell)

```azurepowershell-interactive
New-AzureRmEventGridSubscription `
  -ResourceId "/subscriptions/<sub-id>/resourceGroups/<my-resource-group>/providers/Microsoft.EventGrid/domains/<my-domain-name>/topics/demotopic1" `
  -EventSubscriptionName <event-subscription> `
  -Endpoint https://contoso.azurewebsites.net/api/updates
```

---

If you need a test endpoint to subscribe your events to, you can always deploy a [pre-built web app](https://github.com/Azure-Samples/azure-event-grid-viewer) that displays the incoming events. You can send your events to your test website at `https://<your-site-name>.azurewebsites.net/api/updates`.

<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure-Samples%2Fazure-event-grid-viewer%2Fmaster%2Fazuredeploy.json" target="_blank"><img src="https://azuredeploy.net/deploybutton.png"/></a>

Permissions that are set for a topic are stored in Azure Active Directory and must be deleted explicitly. Deleting an event subscription won't revoke a users access to create event subscriptions if they have write access on a topic.


## Publish events to an Event Grid Domain

Publishing events to a domain is the same as [publishing to a custom topic](./post-to-custom-topic.md). However, instead of publishing to the custom topic, you publish all events to the domain endpoint. In the JSON event data, you specify the topic you wish the events to go to. The following array of events would result in event with `"id": "1111"` to topic `demotopic1` while event with `"id": "2222"` would be sent to topic `demotopic2`:

```json
[{
  "topic": "demotopic1",
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
  "topic": "demotopic2",
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

# [Azure CLI](#tab/azurecli)
To get the domain endpoint with Azure CLI, use

```azurecli-interactive
az eventgrid domain show \
  -g <my-resource-group> \
  -n <my-domain>
```

To get the keys for a domain, use:

```azurecli-interactive
az eventgrid domain key list \
  -g <my-resource-group> \
  -n <my-domain>
```

# [PowerShell](#tab/powershell)
To get the domain endpoint with PowerShell, use

```azurepowershell-interactive
Get-AzureRmEventGridDomain `
  -ResourceGroupName <my-resource-group> `
  -Name <my-domain>
```

To get the keys for a domain, use:

```azurepowershell-interactive
Get-AzureRmEventGridDomainKey `
  -ResourceGroupName <my-resource-group> `
  -Name <my-domain>
```
---

And then use your favorite method of making an HTTP POST to publish your events to your Event Grid domain.

## Next steps

* For more information on high-level concepts in Event domains and why they're useful, see the [conceptual overview of Event Domains](event-domains.md).
