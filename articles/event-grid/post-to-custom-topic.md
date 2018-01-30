---
title: Post event to custom Azure Event Grid topic
description: Describes how to post an event to a custom topic for Azure Event Grid
services: event-grid
author: tfitzmac
manager: timlt

ms.service: event-grid
ms.topic: article
ms.date: 01/30/2018
ms.author: tomfitz
---

# Post to custom topic for Azure Event Grid

This article describes how to post an event to a custom topic. It shows the format of the post and event data. The [Service Level Agreement (SLA)](https://azure.microsoft.com/support/legal/sla/event-grid/v1_0/) only applies to posts that match the expected format.

## Endpoint

When sending the HTTP POST to a custom topic, use the URI format: `https://<topic-endpoint>?api-version=2018-01-01`.

For example, a valid URI is: `https://exampletopic.westus2-1.eventgrid.azure.net/api/events?api-version=2018-01-01`.

To get the endpoint for a custom topic with Azure CLI, use:

```azurecli-interactive
az eventgrid topic show --name <topic-name> -g <topic-resource-group> --query "endpoint"
```

To get the endpoint for a custom topic with Azure PowerShell, use:

```powershell
(Get-AzureRmEventGridTopic -ResourceGroupName <topic-resource-group> -Name <topic-name>).Endpoint
```

## Header

In the request, include a header value named `aeg-sas-key` that contains a key for authentication.

For example, a valid header value is `aeg-sas-key: VXbGWce53249Mt8wuotr0GPmyJ/nDT4hgdEj9DpBeRr38arnnm5OFg==`.

To get the key for a custom topic with Azure CLI, use:

```azurecli
az eventgrid topic key list --name <topic-name> -g <topic-resource-group> --query "key1"
```

To get the key for a custom topic with PowerShell, use:

```powershell
(Get-AzureRmEventGridTopicKey -ResourceGroupName <topic-resource-group> -Name <topic-name>).Key1
```

## Event data

For custom topics, the top-level data contains the same fields as standard resource-defined events. One of those properties is a data property that contains properties unique to the custom topic. As event publisher, you determine the properties for that data object. Use the following schema:

```json
[
  {
    "id": string,    
    "eventType": string,
    "subject": string,
    "eventTime": string-in-date-time-format,
    "data":{
      object-unique-to-each-publisher
    },
    "dataVersion": string
  }
]
```

For a description of these properties, see [Azure Event Grid event schema](event-schema.md).

For example, a valid event data schema is:

```json
[{
  "id": "1807",
  "eventType": "recordInserted",
  "subject": "myapp/vehicles/motorcycles",
  "eventTime": "2017-08-10T21:03:07+00:00",
  "data": {
    "make": "Ducati",
    "model": "Monster"
  },
  "dataVersion": "1.0"
}]
```

## Next steps

* For an introduction to routing custom events, see [Create and route custom events with Azure CLI and Event Grid](custom-event-quickstart.md) or [Create and route custom events with Azure PowerShell and Event Grid](custom-event-quickstart-powershell.md).
* For more information about the authentication key, see [Event Grid security and authentication](security-authentication.md).
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
