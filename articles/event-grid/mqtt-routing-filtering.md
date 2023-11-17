---
title: 'Filtering of MQTT Routed Messages'
description: 'Describes how to filter MQTT Routed Messages.'
ms.topic: conceptual
ms.custom:
  - build-2023
  - ignite-2023
ms.date: 11/15/2023
author: george-guirguis
ms.author: geguirgu
---
# Filtering of MQTT Routed Messages
You can use the Event Grid Subscription’s filtering capability to filter the routed MQTT messages.



## Topic filtering

You can filter on the messages’ MQTT topics through filtering on the "subject" property in the Cloud Event schema. Event Grid Subscriptions supports free simple subject filtering by specifying a starting or ending value for the subject. For example,

- If each vehicle is publishing its location on its own topic (vehicles/vehicle1/gps, vehicles/vehicle2/gps, etc.), you can use the filter: subject ends with "gps" to route only all the location messages.
- If machines from each section of each factory are publishing on topics that mimic the factory hierarchy (for example, factory1/area2/machine4/telemetry), you can use the filter: subject begins with "factory1/area2/" to route only the messages that belong to facotry1 and area 2 to a specific endpoint. You can replicate this configuration to route messages from other factories/areas to different endpoints.

You can also take advantage of the [Event Subscription’s advanced filtering](event-filtering.md) to filter based on the MQTT topic through filtering on the subject property in the Cloud Event Schema. Advanced filters enable you to set more complex filters by specifying a comparison operator, key, and value.

## Payload filtering

For MQTT v5 messages of content type= “application/json; charset=utf-8” or of a payload format indicator=1, the payload will be forwarded in the data object, and the message will be serialized as a JSON (or a JSON string if the payload isn't a JSON). Setting the content type and/or the payload format indicator enables you to filter on your payload properties as is forwarded within the data field as is.

### JSON payload

If you send a JSON payload, it will be serialized as a proper JSON and you'll be able to filter on each property in your JSON, using Event Subscription’s advanced filtering.

For example: if you send the following payload: 
```json
{
	"Temp": 70,
	"humidity": 40
}
```

You can use the following filter to filter all the messages with temperature value over a 100:
```azurecli-interactive
"advancedFilters": [{
    "operatorType": "NumberGreaterThan",
    "key": "data.Temp",
    "value": 100
}]
```


### Non-JSON payload

If you send a non-JSON payload that is still UFT-8, it will be serialized as a JSON string. For example, if you send the following payload:

```json
{
	Hello Contoso.
}
```
You can use the following filter to filter all the messages that include the word “Contoso”:
```azurecli-interactive
"advancedFilters": [{
    "operatorType": "StringContains",
    "key": "data",
    "value": "Contoso"
}]
```

### Enrichment filtering

Enrichments are added to your routed CloudEvent’s attributes, and you can filter on them using [Event Subscription’s advanced filtering](event-filtering.md).

For example, if you added the following enrichment:

```json
{
	"key": "clienttype",
	"value": "${client.attributes.type}"
}
```
																
You can use the following filter to filter all the messages coming from your clients of type “sensor”:

```azurecli-interactive
"advancedFilters": [{"
    operatorType": "StringContains",
    "key": "clienttype", 
    "value": "sensor"
}]
```


## Next steps:
Use the following articles to learn more about routing:

### QuickStart:
- [Route MQTT messages to Event Hubs](mqtt-routing-to-event-hubs-portal.md)

### Concepts:
- [Routing](mqtt-routing.md)
- [Routing Enrichments](mqtt-routing-enrichment.md)
- [Routing Event Schema](mqtt-routing-event-schema.md)
