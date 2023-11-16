---
title: 'Event Schema for MQTT Routed Messages'
description: 'An overview of the Event Schema for MQTT Routed Messages.'
ms.topic: conceptual
ms.custom:
  - build-2023
  - ignite-2023
ms.date: 11/15/2023
author: george-guirguis
ms.author: geguirgu
---
# Event Schema for MQTT Routed Messages



MQTT Messages are routed to an Event Grid topic as CloudEvents according to the following logic:

For MQTT v3 messages or MQTT v5 messages of a payload format indicator=0, the payload will be forwarded in the data_base64 object and encoded as a base 64 string according to the following schema sample.

```json
{
	"specversion": "1.0",
	"id": "9aeb0fdf-c01e-0131-0922-9eb54906e20", // unique id stamped by the service.
	"time": "2019-11-18T15:13:39.4589254Z", // timestamp when the message was received by the service.
	"type": "MQTT.EventPublished", // set type for all MQTT messages enveloped by the service.
	"source": "testnamespace", // namespace name
	"subject": "campus/buildings/building17", // topic of the MQTT publish request.
	"data_base64": 
    {
		IlRlbXAiOiAiNzAiLAoiaHVtaWRpdHkiOiAiNDAiCg==
	}
}
```

For MQTT v5 messages of content type= “application/json; charset=utf-8” or of a payload format indicator=1, the payload will be forwarded in the data object, and the message will be serialized as a JSON (or a JSON string if the payload isn't a JSON). Setting the content type and/or the payload format indicator enables you to filter on your payload properties as the payload is forwarded within the data field as is. Learn more about [filtering on the message's payload.](mqtt-routing-filtering.md#payload-filtering)

```json
{
	"specversion": "1.0",
	"id": "9aeb0fdf-c01e-0131-0922-9eb54906e20", // unique id stamped by the service.
	"time": "2019-11-18T15:13:39.4589254Z", // timestamp when the message was received by the service.
	"type": "MQTT.EventPublished", // set type for all MQTT messages enveloped by the service.
	"source": "testnamespace", // namespace name
	"subject": "campus/buildings/building17", // topic of the MQTT publish request. 
	"data": 
    {
		"Temp": 70,
		"humidity": 40
	}
}
```

For MQTT v5 messages that are already enveloped in a CloudEvent according to the [MQTT Protocol Binding for CloudEvents](https://github.com/cloudevents/spec/blob/v1.0/mqtt-protocol-binding.md) whether using the binary content mode or the structured content mode in JSON encoding (utf-8), the event will be forwarded with the original default CloudEvents attributes after enrichments according to the following schema sample.

```json
{
	"specverion": "1.0",
	"id": "9aeb0fdf-c01e-0131-0922-9eb54906e20", // original id stamped by the client. 
	"time": "2019-11-18T15:13:39.4589254Z", // timestamp when the message was received by the client
	"type": "Custom.Type", // original type value stamped by the client.
	"source": "Custom.Source", // original source value stamped by the client.
	"subject": " Custom.Subject", // original subjectvalue stamped by the client.
	"data": 
    {
		"Temp": "70",
		"humidity": "40"
	}
}
```

## Next steps:

Use the following articles to learn more about routing:

### QuickStart:

- [Route MQTT messages to Event Hubs](mqtt-routing-to-event-hubs-portal.md)

### Concepts:

- Routing
- [Routing Filtering](mqtt-routing-filtering.md)
- [Routing Enrichments](mqtt-routing-enrichment.md)
