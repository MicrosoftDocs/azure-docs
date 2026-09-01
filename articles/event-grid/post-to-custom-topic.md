---
title: Post Events to Azure Event Grid Custom Topics
description: Discover how to post events to Azure Event Grid custom topics with step-by-step guidance on authentication, event schema, and sample requests.
#customer intent: As a developer, I want to know how to publish events to an Azure Event Grid custom topic
ms.topic: how-to
ms.date: 08/27/2026
ai-usage: ai-assisted
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:07/29/2025
  - ai-gen-description
---

# Publish events to Azure Event Grid custom topics by using access keys

An Event Grid custom topic is an endpoint that your applications send their own events to, so that Event Grid can route those events to interested subscribers. This article shows you how to publish events to a custom topic by using access keys, which authenticate your requests without setting up Microsoft Entra ID. You get the topic endpoint and access key, format an event payload, send a sample event, and review the response.

The [Service Level Agreement (SLA)](https://azure.microsoft.com/support/legal/sla/event-grid/v1_0/) applies only to posts that match the expected format.

## Prerequisites

- An Azure Event Grid custom topic. To create one, see [Send custom events to a web endpoint by using the Azure portal](custom-event-quickstart-portal.md).
- [Azure CLI](/cli/azure/install-azure-cli), [Azure PowerShell](/powershell/azure/install-azure-powershell), or access to the [Azure portal](https://portal.azure.com) to retrieve the topic endpoint and access key.
- A tool that can send HTTP POST requests, such as `curl`.

> [!NOTE]
> Microsoft Entra authentication provides better authentication support than access key or shared access signature (SAS) token authentication. By using Microsoft Entra authentication, the Microsoft Entra identity provider validates the identity, so you don't handle keys in your code. You also benefit from security features built into the Microsoft identity platform, such as Conditional Access, that help improve your application's security. For more information, see [Authenticate publishing clients using Microsoft Entra ID](authenticate-with-microsoft-entra-id.md).

## Get the topic endpoint

To publish events to a custom topic, send an HTTP POST request by using the following URI format: `https://<topic-endpoint>?api-version=2018-01-01`. For example, a valid URI is: `https://exampletopic.westus2-1.eventgrid.azure.net/api/events?api-version=2018-01-01`. To get the endpoint for a custom topic, use the Azure portal, Azure CLI, or Azure PowerShell.

# [Azure portal](#tab/azure-portal)

Find the topic's endpoint on the **Overview** tab of the **Event Grid Topic** page in the Azure portal.

:::image type="content" source="./media/post-to-custom-topic/topic-endpoint.png" alt-text="Screenshot of the Event Grid topic page in the Azure portal with the topic endpoint highlighted." lightbox="./media/post-to-custom-topic/topic-endpoint.png":::

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az eventgrid topic show --name <topic-name> -g <topic-resource-group> --query "endpoint"
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
(Get-AzEventGridTopic -ResourceGroupName <topic-resource-group> -Name <topic-name>).Endpoint
```

---

## Get the access key

In the request, include a header value named `aeg-sas-key` that contains a key for authentication. For example, a valid header value is `aeg-sas-key: xxxxxxxxxxxxxxxxxxxxxxx`. To get the key for a custom topic, use the Azure portal, Azure CLI, or Azure PowerShell.

# [Azure portal](#tab/azure-portal)

To get the access key for the custom topic, select the **Access keys** tab on the **Event Grid Topic** page in the Azure portal.

:::image type="content" source="./media/post-to-custom-topic/custom-topic-access-keys.png" alt-text="Screenshot that shows the Access Keys tab of the Event Grid topic page on the Azure portal." lightbox="./media/post-to-custom-topic/custom-topic-access-keys.png":::

# [Azure CLI](#tab/azure-cli)

```azurecli
az eventgrid topic key list --name <topic-name> -g <topic-resource-group> --query "key1"
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
(Get-AzEventGridTopicKey -ResourceGroupName <topic-resource-group> -Name <topic-name>).Key1
```

---

## Format the event payload

Format each event as a JSON object. The top-level fields are the same as standard resource-defined events, and the `data` property holds the properties that are unique to your custom topic. As the publisher, you define the contents of the `data` object. For a description of each property, see [Azure Event Grid event schema](event-schema.md).

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

Keep these size limits in mind when you build the payload:

- The event array can have a total size of up to 1 MB.
- The maximum size for a single event is 1 MB. Events over 64 KB incur charges in 64-KB increments.
- A batch can contain a maximum of 5,000 events.

The following example shows a valid event payload:

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

## Send a sample event

This section shows how to send a sample event to the custom topic.

# [Azure portal](#tab/azure-portal)

1. In the [Azure portal](https://portal.azure.com), launch Cloud Shell.
1. In the Cloud Shell, run the commands from the Azure PowerShell or Azure CLI in the **Bash** or **PowerShell** session.

    :::image type="content" source="./media/post-to-custom-topic/cloud-shell.png" alt-text="Screenshot that shows the Cloud Shell in the Azure portal." lightbox="./media/post-to-custom-topic/cloud-shell.png":::

# [Azure CLI](#tab/azure-cli)

```azurecli
endpoint=$(az eventgrid topic show --name <topic name> -g <resource group name> --query "endpoint" --output tsv)

key=$(az eventgrid topic key list --name <topic name> -g <resource group name> --query "key1" --output tsv)

event='[ {"id": "'"$RANDOM"'", "eventType": "recordInserted", "subject": "myapp/vehicles/motorcycles", "eventTime": "'`date +%Y-%m-%dT%H:%M:%S%z`'", "data":{ "make": "Ducati", "model": "Monster"},"dataVersion": "1.0"} ]'

curl -X POST -H "aeg-sas-key: $key" -d "$event" $endpoint
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
$resourceGroupName = "<resource group name>"
$topicName = "<topic name>"

$endpoint = (Get-AzEventGridTopic -ResourceGroupName $resourceGroupName -Name $topicName).Endpoint

$keys = Get-AzEventGridTopicKey -ResourceGroupName $resourceGroupName -Name $topicName

$eventID = Get-Random 99999
#Date format should be SortableDateTimePattern (ISO 8601)
$eventDate = Get-Date -Format s

#Construct body using Hashtable
$htbody = @{
    id= $eventID
    eventType="recordInserted"
    subject="myapp/vehicles/motorcycles"
    eventTime= $eventDate
    data= @{
        make="Ducati"
        model="Monster"
    }
    dataVersion="1.0"
}

#Use ConvertTo-Json to convert event body from Hashtable to JSON Object
#Append square brackets to the converted JSON payload since they are expected in the event's JSON payload syntax
$body = "["+(ConvertTo-Json $htbody)+"]"

Invoke-WebRequest -Uri $endpoint -Method POST -Body $body -Headers @{"aeg-sas-key" = $keys.Key1}
```

---

## Review the response

After you post to the topic endpoint, you receive a response. The response is a standard HTTP response code. Some common responses are:

| Result                             | Response              |
| ---------------------------------- | --------------------- |
| Success                            | 200 OK                |
| Event data has incorrect format    | 400 Bad Request       |
| Invalid access key                 | 401 Unauthorized      |
| Incorrect endpoint                 | 404 Not Found         |
| Array or event exceeds size limits | 413 Payload Too Large |

For errors, the message body uses the following format:

```json
{
    "error": {
        "code": "<HTTP status code>",
        "message": "<description>",
        "details": [{
            "code": "<HTTP status code>",
            "message": "<description>"
    }]
  }
}
```

## Related content

* [Monitor Event Grid message delivery](monitor-event-delivery.md): Learn how to track and troubleshoot event deliveries.
* [Event Grid security and authentication](security-authentication.md): Understand how to secure your events with authentication keys.
* [Event Grid subscription schema](subscription-creation-schema.md): Step-by-step guidance on creating an Event Grid subscription.
