---
title: Map custom field to Azure Event Grid schema
description: This article describes how to convert your custom schema to the Azure Event Grid schema when your event data doesn't match Event Grid schema.  
services: event-grid
author: spelluru
manager: timlt

ms.service: event-grid
ms.topic: conceptual
ms.date: 01/23/2020
ms.author: spelluru
---

# Map custom fields to Event Grid schema

If your event data doesn't match the expected [Event Grid schema](event-schema.md), you can still use Event Grid to route event to subscribers. This article describes how to map your schema to the Event Grid schema.

[!INCLUDE [requires-azurerm](../../includes/requires-azurerm.md)]

## Install preview feature

[!INCLUDE [event-grid-preview-feature-note.md](../../includes/event-grid-preview-feature-note.md)]

## Original event schema

Let's suppose you have an application that sends events in the following format:

```json
[
  {
    "myEventTypeField":"Created",
    "resource":"Users/example/Messages/1000",
    "resourceData":{"someDataField1":"SomeDataFieldValue"}
  }
]
```

Although that format doesn't match the required schema, Event Grid enables you to map your fields to the schema. Or, you can receive the values in the original schema.

## Create custom topic with mapped fields

When creating a custom topic, specify how to map fields from your original event to the event grid schema. There are three values you use to customize the mapping:

* The **input schema** value specifies the type of schema. The available options are CloudEvents schema, custom event schema, or Event Grid schema. The default value is Event Grid schema. When creating custom mapping between your schema and the event grid schema, use custom event schema. When events are in the CloudEvents schema, use Cloudevents schema.

* The **mapping default values** property specifies default values for fields in the Event Grid schema. You can set default values for `subject`, `eventtype`, and `dataversion`. Typically, you use this parameter when your custom schema doesn't include a field that corresponds to one of those three fields. For example, you can specify that data version is always set to **1.0**.

* The **mapping fields** value maps fields from your schema to the event grid schema. You specify values in space-separated key/value pairs. For the key name, use the name of the event grid field. For the value, use the name of your field. You can use key names for `id`, `topic`, `eventtime`, `subject`, `eventtype`, and `dataversion`.

To create a custom topic with Azure CLI, use:

```azurecli-interactive
# If you have not already installed the extension, do it now.
# This extension is required for preview features.
az extension add --name eventgrid

az eventgrid topic create \
  -n demotopic \
  -l eastus2 \
  -g myResourceGroup \
  --input-schema customeventschema \
  --input-mapping-fields eventType=myEventTypeField \
  --input-mapping-default-values subject=DefaultSubject dataVersion=1.0
```

For PowerShell, use:

```azurepowershell-interactive
# If you have not already installed the module, do it now.
# This module is required for preview features.
Install-Module -Name AzureRM.EventGrid -AllowPrerelease -Force -Repository PSGallery

New-AzureRmEventGridTopic `
  -ResourceGroupName myResourceGroup `
  -Name demotopic `
  -Location eastus2 `
  -InputSchema CustomEventSchema `
  -InputMappingField @{eventType="myEventTypeField"} `
  -InputMappingDefaultValue @{subject="DefaultSubject"; dataVersion="1.0" }
```

## Subscribe to event grid topic

When subscribing to the custom topic, you specify the schema you would like to use for receiving the events. You specify the CloudEvents schema, custom event schema, or Event Grid schema. The default value is Event Grid schema.

The following example subscribes to an event grid topic and uses the Event Grid schema. For Azure CLI, use:

```azurecli-interactive
topicid=$(az eventgrid topic show --name demoTopic -g myResourceGroup --query id --output tsv)

az eventgrid event-subscription create \
  --source-resource-id $topicid \
  --name eventsub1 \
  --event-delivery-schema eventgridschema \
  --endpoint <endpoint_URL>
```

The next example uses the input schema of the event:

```azurecli-interactive
az eventgrid event-subscription create \
  --source-resource-id $topicid \
  --name eventsub2 \
  --event-delivery-schema custominputschema \
  --endpoint <endpoint_URL>
```

The following example subscribes to an event grid topic and uses the Event Grid schema. For PowerShell, use:

```azurepowershell-interactive
$topicid = (Get-AzureRmEventGridTopic -ResourceGroupName myResourceGroup -Name demoTopic).Id

New-AzureRmEventGridSubscription `
  -ResourceId $topicid `
  -EventSubscriptionName eventsub1 `
  -EndpointType webhook `
  -Endpoint <endpoint-url> `
  -DeliverySchema EventGridSchema
```

The next example uses the input schema of the event:

```azurepowershell-interactive
New-AzureRmEventGridSubscription `
  -ResourceId $topicid `
  -EventSubscriptionName eventsub2 `
  -EndpointType webhook `
  -Endpoint <endpoint-url> `
  -DeliverySchema CustomInputSchema
```

## Publish event to topic

You're now ready to send an event to the custom topic, and see the result of the mapping. The following script to post an event in the [example schema](#original-event-schema):

For Azure CLI, use:

```azurecli-interactive
endpoint=$(az eventgrid topic show --name demotopic -g myResourceGroup --query "endpoint" --output tsv)
key=$(az eventgrid topic key list --name demotopic -g myResourceGroup --query "key1" --output tsv)

event='[ { "myEventTypeField":"Created", "resource":"Users/example/Messages/1000", "resourceData":{"someDataField1":"SomeDataFieldValue"} } ]'

curl -X POST -H "aeg-sas-key: $key" -d "$event" $endpoint
```

For PowerShell, use:

```azurepowershell-interactive
$endpoint = (Get-AzureRmEventGridTopic -ResourceGroupName myResourceGroup -Name demotopic).Endpoint
$keys = Get-AzureRmEventGridTopicKey -ResourceGroupName myResourceGroup -Name demotopic

$htbody = @{
    myEventTypeField="Created"
    resource="Users/example/Messages/1000"
    resourceData= @{
        someDataField1="SomeDataFieldValue"
    }
}

$body = "["+(ConvertTo-Json $htbody)+"]"
Invoke-WebRequest -Uri $endpoint -Method POST -Body $body -Headers @{"aeg-sas-key" = $keys.Key1}
```

Now, look at your WebHook endpoint. The two subscriptions delivered events in different schemas.

The first subscription used event grid schema. The format of the delivered event is:

```json
{
  "id": "aa5b8e2a-1235-4032-be8f-5223395b9eae",
  "eventTime": "2018-11-07T23:59:14.7997564Z",
  "eventType": "Created",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "topic": "/subscriptions/<subscription-id>/resourceGroups/myResourceGroup/providers/Microsoft.EventGrid/topics/demotopic",
  "subject": "DefaultSubject",
  "data": {
    "myEventTypeField": "Created",
    "resource": "Users/example/Messages/1000",
    "resourceData": {
      "someDataField1": "SomeDataFieldValue"
    }
  }
}
```

These fields contain the mappings from the custom topic. **myEventTypeField** is mapped to **EventType**. The default values for **DataVersion** and **Subject** are used. The **Data** object contains the original event schema fields.

The second subscription used the input event schema. The format of the delivered event is:

```json
{
  "myEventTypeField": "Created",
  "resource": "Users/example/Messages/1000",
  "resourceData": {
    "someDataField1": "SomeDataFieldValue"
  }
}
```

Notice that the original fields were delivered.

## Next steps

* For information about event delivery and retries, [Event Grid message delivery and retry](delivery-and-retry.md).
* For an introduction to Event Grid, see [About Event Grid](overview.md).
* To quickly get started using Event Grid, see [Create and route custom events with Azure Event Grid](custom-event-quickstart.md).
