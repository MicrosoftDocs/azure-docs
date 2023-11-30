---
title: 'Enrichments for MQTT Routed Messages'
description: 'An overview of the Enrichments for MQTT Routed Messages and how to configure them.'
ms.topic: conceptual
ms.custom:
  - build-2023
  - ignite-2023
ms.date: 11/15/2023
author: george-guirguis
ms.author: geguirgu
---
# Enrichments for MQTT Routed Messages
The enrichments support enables you to add up to 20 custom key-value properties to your messages before they're sent to the Event Grid custom topic. These enrichments enable you to:

- Add contextual data to your messages. For example, enriching the message with the client's name or the namespace name could provide endpoints with information about the source of the message.
- Reduce computing load on endpoints. For example, enriching the message with the MQTT publish request's payload format indicator or the content type informs endpoints how to process the message's payload without trying multiple parsers first.
- Filter your routed messages through Event Grid event subscriptions based on the added data. For example, enriching a client attribute enables you to filter the messages to be routed to the endpoint based on the different attribute's values.

 

## Configuration

### Enrichment Key:

The enrichment key is a string that needs to comply with these requirements:
- Include only lower-case alphanumerics: only (a-z) and (0-9)
- Must not be `specversion`, `id`, `time`, `type`, `source`, `subject`, `datacontenttype`, `dataschema`, `data`, or `data_base64`.
- Must not start with `azsp`.
- Must not be duplicated.
- Must not be more than 20 characters.

### Enrichment Value:

The enrichment value could be a static string for static enrichments or one of the supported values that represent the client attributes or the MQTT message properties for dynamic enrichment. Enrichment values must not be more than 128 characters. The following list includes the supported values:

#### Client attributes

- ${client.authenticationName}: the name of the publishing client.
- ${client.attributes.x}: an attribute of the publishing client, where x is the attribute key name.

#### MQTT Properties

- ${mqtt.message.userProperties.x}: user properties in the MQTTv5 PUBLISH packet, where x is the user property key name
    - Type: string
    - Use the following variable format instead if your user property includes special characters ${mqtt.message.userProperties['x']}. You still need to escape an apostrophe and backslash as follows: and "PN\t" becomes "PN\\t".
- ${mqtt.message.topicName}: the topic in the MQTT PUBLISH packet.
    - Type: string
- ${mqtt.message.responseTopic}: the response topic in the MQTTv5 PUBLISH packet.
    - Type: string
- ${mqtt.message.correlationData}: the correlation data in the MQTTv5 PUBLISH packet.
    - Type: binary
- ${mqtt.message.pfi}: the payload format indicator in the MQTTv5 PUBLISH packet.
    - Type: integer

### Azure portal configuration

Use the following steps to configure routing enrichments:

1. Go to your namespace in the Azure portal.
2. Under **Routing**, Check **Enable routing**.
3. Under routing topic, select the Event Grid topic that you have created where all MQTT messages will be routed.
4. Under **Message Enrichments**, select **+ Add Enrichment**.
5. Add up to 20 key-value pairs and select their type appropriately.
6. Select **Apply**.

:::image type="content" source="./media/mqtt-routing-enrichment/routing-enrichment-portal-configuration.png" alt-text="Screenshot showing the routing enrichment configuration through the portal.":::

For more information about the routing configuration, go to [Routing Azure portal configuration](mqtt-routing.md#azure-portal-configuration).


### Azure CLI configuration

Use the command and payload during namespace creation/update to configure routing enrichments:

```azurecli-interactive
az resource create --resource-type Microsoft.EventGrid/namespaces --id /subscriptions/<Subscription ID>/resourceGroups/<Resource Group>/providers/Microsoft.EventGrid/namespaces/<Namespace Name> --is-full-object --api-version 2023-06-01-preview --properties @./resources/NS.json
```

NS.json

```json
{
  "properties": {
    "topicSpacesConfiguration": {
        "state": "Enabled",
        "routeTopicResourceId": "/subscriptions/<Subscription ID>/resourceGroups/<Resource Group>/providers/Microsoft.EventGrid/topics/<Event Grid Topic name>",
        "routingEnrichments": {
            "static": [
                {
                    "key": "namespaceid",
                    "value": "123",
                    "valueType": "string"
                }
            ],
            "dynamic": [
                {
                    "key": "clientname",
                    "value": "${client.authenticationName}"
                },
                {
                    "key": "clienttype",
                    "value": "${client.attributes.type}"
                },
                {
                    "key": "address",
                    "value": "${mqtt.message.userProperties['client.address']}"
                },
                {
                    "key": "region",
                    "value": "${mqtt.message.userProperties.location}"
                },
                {
                    "key": "mqtttopic",
                    "value": "${mqtt.message.topicName}"
                },
                {
                    "key": "mqttresponsetopic",
                    "value": "${mqtt.message.responseTopic}"
                },
                {
                    "key": "mqttcorrelationdata",
                    "value": "${mqtt.message.correlationData}"
                },
                {
                    "key": "mqttpfi",
                    "value": "${mqtt.message.pfi}"
                }
            ]
        }
    }
},
"location": "eastus2euap",
"tags": {},
}
```

For more information about the routing configuration, go to [Routing Azure CLI configuration.](mqtt-routing.md#azure-cli-configuration)

### Sample Output

The following CloudEvent is a sample output of a MQTTv5 message with PFI=0 after applying the previous enrichment configuration:

```json
{
    "specversion": "1.0",
	"id": "9aeb0fdf-c01e-0131-0922-9eb54906e20", // unique id stamped by the service
	"time": "2019-11-18T15:13:39.4589254Z", // timestamp when messages was received by the service
	"type": "MQTT.EventPublished", // set type for all MQTT messages enveloped by the service
	"source": "testnamespace", // namespace name
	"subject": "campus/buildings/building17", // topic of the MQTT publish request
	"namespaceid": "123", // static enrichment
	"clientname": "client1", // dynamic enrichment of the name of the publishing client
	"clienttype": "operator", // dynamic enrichment of an attribute of the publishing client
	"address": "1 Microsoft Way, Redmond, WA 98052", // dynamic enrichment of a user property in the MQTT publish request
	"region": "North America", // dynamic enrichment of another user property in the MQTT publish request
	"mqtttopic": "campus/buildings/building17", // dynamic enrichment of the topic of the MQTT publish request
	"mqttresponsetopic": "campus/buildings/building17/response", // dynamic enrichment of the response topic of the MQTT publish request
	"mqttcorrelationdata": "cmVxdWVzdDE=", // dynamic enrichment of the correlation data of the MQTT publish request encoded in base64
	"mqttpfi": 0, // dynamic enrichment of the payload format indicator of the MQTT publish request
	"datacontenttype": "application/octet-stream", //content type of the MQTT publish request
	"data_base64": 
    {
	    IlRlbXAiOiAiNzAiLAoiaHVtaWRpdHkiOiAiNDAiCg==
	}
}
```

### Handling special cases:

- Unspecified client attributes/user properties: if a dynamic enrichment pointed to a client attribute/user property that doesn’t exist, the enrichment will include the specified key with an empty string for a value. For example, `emptyproperty`: "".
- Arrays: Arrays in client attributes and duplicate user properties are transformed to a comma-separated string. For example: if the enriched client attribute is set to be “array”: “value1”, “value2”, “value3”, the resulting enriched property will be `array`: `value1,value2,value3`. Another example: if the same MQTT publish request has the following user properties > "userproperty1": "value1", "userproperty1": "value2", resulting enriched property will be `userproperty1`: `value1,value2`.

## Next steps:

Use the following articles to learn more about routing:

### QuickStart:

- [Route MQTT messages to Event Hubs](mqtt-routing-to-event-hubs-portal.md)

### Concepts:

- [Routing Event Schema](mqtt-routing-event-schema.md)
- [Routing Filtering](mqtt-routing-filtering.md)
- [Routing Enrichments](mqtt-routing-enrichment.md)
