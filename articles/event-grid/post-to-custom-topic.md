---
title: Post event to custom Azure Event Grid topic
description: This article describes how to post an event to a custom topic. It shows the format of the post and event data.
ms.topic: concept-article
ms.date: 06/18/2024 
#customer intent: As a developer, I want to know how to publish events to an Azure Event Grid custom topic
---

# Publish events to Azure Event Grid custom topics using access keys

This article describes how to post an event to a custom topic using an access key. It shows the format of the post and event data. The [Service Level Agreement (SLA)](https://azure.microsoft.com/support/legal/sla/event-grid/v1_0/) only applies to posts that match the expected format.


> [!NOTE]
> Microsoft Entra authentication provides a superior authentication support than that's offered by access key or Shared Access Signature (SAS) token authentication. With Microsoft Entra authentication, the identity is validated against Microsoft Entra identity provider. As a developer, you won't have to handle keys in your code if you use Microsoft Entra authentication. you'll also benefit from all security features built into the Microsoft identity platform, such as Conditional Access, that can help you improve your application's security stance. For more information, see [Authenticate publishing clients using Microsoft Entra ID](authenticate-with-microsoft-entra-id.md).

## Endpoint

When sending the HTTP POST to a custom topic, use the URI format: `https://<topic-endpoint>?api-version=2018-01-01`. For example, a valid URI is: `https://exampletopic.westus2-1.eventgrid.azure.net/api/events?api-version=2018-01-01`. To get the endpoint for a custom topic using Azure CLI, use:

# [Azure portal](#tab/azure-portal)
You can find the topic's endpoint on the **Overview** tab of the **Event Grid Topic** page in the Azure portal. 

:::image type="content" source="./media/post-to-custom-topic/topic-endpoint.png" alt-text="Screenshot that shows the Event Grid topic page on the Azure portal with the topic endpoint highlighted." lightbox="./media/post-to-custom-topic/topic-endpoint.png":::

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az eventgrid topic show --name <topic-name> -g <topic-resource-group> --query "endpoint"
```

# [Azure PowerShell](#tab/azure-powershell)

```powershell
(Get-AzEventGridTopic -ResourceGroupName <topic-resource-group> -Name <topic-name>).Endpoint
```

---

## Header

In the request, include a header value named `aeg-sas-key` that contains a key for authentication. For example, a valid header value is `aeg-sas-key: xxxxxxxxxxxxxxxxxxxxxxx`. To get the key for a custom topic using Azure CLI, use:

# [Azure portal](#tab/azure-portal)
To get the access key for the custom topic, select **Access keys** tab on the **Event Grid Topic** page in the Azure portal. 

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

## Event data

For custom topics, the top-level data contains the same fields as standard resource-defined events. One of those properties is a `data` property that contains properties unique to the custom topic. As an event publisher, you determine properties for that data object. Here's the schema:

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

For a description of these properties, see [Azure Event Grid event schema](event-schema.md). When a client sends events to an Event Grid topic, the array can have a total size of up to 1 MB. The maximum allowed size for an event is also 1 MB. Events over 64 KB are charged in 64-KB increments. When a client receives events in a batch, the maximum allowed number of events is 5,000 per batch.

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

## Send the sample event 
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

## Response

After posting to the topic endpoint, you receive a response. The response is a standard HTTP response code. Some common responses are:

|Result  |Response  |
|---------|---------|
|Success  | 200 OK  |
|Event data has incorrect format | 400 Bad Request |
|Invalid access key | 401 Unauthorized |
|Incorrect endpoint | 404 Not Found |
|Array or event exceeds size limits | 413 Payload Too Large |

For errors, the message body has the following format:

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

* For information about monitoring event deliveries, see [Monitor Event Grid message delivery](monitor-event-delivery.md).
* For more information about the authentication key, see [Event Grid security and authentication](security-authentication.md).
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md).
