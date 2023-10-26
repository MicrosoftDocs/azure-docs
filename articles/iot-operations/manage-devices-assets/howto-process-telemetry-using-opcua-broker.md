---
title: Process telemetry for OPC UA assets
description: How to process telemetry for OPC UA assets by using Azure IoT OPC UA Broker Preview
author: timlt
ms.author: timlt
# ms.subservice: opcua-broker
ms.topic: how-to 
ms.date: 10/24/2023

# CustomerIntent: As an industrial edge IT or operations user, I want to to process telemetry
# from my OPC UA devices, so that I can monitor status and health in my industrial edge environment. 
---

# Process telemetry for OPC UA assets

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

A key task for monitoring your industrial edge environment, is to process the telemetry emitted by assets. In this article, you learn how to subscribe to telemetry emitted by assets in an MQTT broker. 

## Prerequisites

- An installed Azure IoT OPC UA Broker environment, with an MQTT broker.  For more information, see [Install OPC UA Broker](howto-install-opcua-broker-using-helm.md).
- An OPC UA server connected to OPC UA Broker.  For more information, see [Connect an OPC UA server to OPC UA Broker](howto-connect-an-opcua-server.md). 
- One or more OPC UA assets.  For more information, see [Define OPC UA assets using OPC UA Broker](howto-define-opcua-assets.md).

## Subscribe to telemetry 
You can subscribe to telemetry by connecting to an MQTT broker, and subscribing to the topic that the telemetry events are published to. The topic name is constructed using the following pattern
`<Application.Name>/data/opcua-connector/<opcua-connector deployment name>/<Asset.Name>`. In a production environment, Microsoft recommends using MQTT V5 with Quality of Service `AtLeastOnce` (QoS 1) delivery and secured access to the MQTT broker.

For the code sample used in this article, the topic to read telemetry events of the Asset 'thermostat-sample' is `opcuabroker/data/opcua-connector/aio-opcplc-connector/thermostat-sample`. 

> [!NOTE]
> The following commands run within the Kubernetes cluster. To run the commands from another machine, [forward the port](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/#forward-a-local-port-to-a-port-on-the-pod) of the MQTT broker and update the command parameters to `-h localhost -p <local-port>`.

To verify that telemetry is published to Azure IoT MQ, run the following command:

```bash
# Subscribing to telemetry events of Asset 'thermostat-sample' on AIO MQ
AIO_MQ_USERNAME="$(</tmp/e4i/secrets/mqtt_username)"
AIO_MQ_PASSWORD="$(</tmp/e4i/secrets/mqtt_password)"
mosquitto_sub -h aio-mq-dmqtt-frontend.default -p 1883 -q 1 -V mqttv5 -t opcua/data/opc-ua-connector/opc-ua-connector/thermostat-sample -u $AIO_MQ_USERNAME -P $AIO_MQ_PASSWORD | jq '.'
```

To verify that telemetry is published to Mosquitto, run the following command:

```bash
# Subscribing to all telemetry events sent by the deployed OPC UA Connector to Mosquitto
mosquitto_sub -h mosquitto.opcuabroker -p 1883 -q 1 -V mqttv5 -t opcua/data/opc-ua-connector/opc-ua-connector/# | jq '.'
```

The commands should generate output like the following example.  The output shows all telemetry events from all assets configured on the module named `opc-ua-connector`. 

```json
{
  "Timestamp": "2023-03-21T08:51:03.5502849Z",
  "Payload": {
    "dtmi:com:example:Thermostat:temperature;1": {
      "SourceTimestamp": "2023-03-21T08:51:02.6950444Z",
      "Value": 41
    },
    "dtmi:com:example:Thermostat:pressure;1": {
      "SourceTimestamp": "2023-03-21T08:51:02.6950689Z",
      "Value": 41
    }
  },
  "DataSetWriterName": "thermostat-sample-2",
  "SequenceNumber": 379
}
{
  "Timestamp": "2023-03-21T08:51:03.5502855Z",
  "Payload": {
    "dtmi:com:example:Thermostat:temperature;1": {
      "SourceTimestamp": "2023-03-21T08:51:02.6950444Z",
      "Value": 41
    },
    "dtmi:com:example:Thermostat:pressure;1": {
      "SourceTimestamp": "2023-03-21T08:51:02.6950689Z",
      "Value": 41
    }
  },
  "DataSetWriterName": "thermostat-sample-2",
  "SequenceNumber": 380
}
{
  "Timestamp": "2023-03-21T08:51:04.25094Z",
  "Payload": {
    "dtmi:com:example:Thermostat:temperature;1": {
      "SourceTimestamp": "2023-03-21T08:51:03.6958564Z",
      "Value": 42
    }
  },
  "DataSetWriterName": "thermostat-sample",
  "SequenceNumber": 229
}
{
  "Timestamp": "2023-03-21T08:51:04.2509419Z",
  "Payload": {
    "dtmi:com:example:Thermostat:temperature;1": {
      "SourceTimestamp": "2023-03-21T08:51:03.6958564Z",
      "Value": 42
    }
  },
  "DataSetWriterName": "thermostat-sample",
  "SequenceNumber": 230
}
```

## Payload format
OPC UA Connector generates OPC UA PubSub V1.05 compliant JSON.  To generate JSON, OPC UA Connector uses the JSON Encoder from the OPC UA stack, with the following configuration:

* Network message content: Dataset Message Header | Single DataSet Message | Publisher ID
* Dataset message content: Sequence Number | Timestamp | Dataset Writer Name
* Dataset field content: Status Code | Source Timestamp
* Dataset message type: Delta Frame

## MQTT user properties
To allow downstream services to process the payload, OPC UA Broker adds MQTT user properties to each message it emits.

> [!div class="mx-tdBreakAll"]
> | User property     | User property in upcoming release | Description                                                                 |
> | ----------------- | --------------------------------- | --------------------------------------------------------------------------- |
> | MQTT-Enqueue-Time | mqtt-enqueue-time                | The MQTT enqueue time is added to the message shortly before the message is send to the MQTT broker. This field can be used to measure the latency from OPC UA Connector to a subscriber connected of the message.                       |
> | asset-uuid        |                                   | The Asset uuid is the universal unique identifier that can be assigned to an Asset. To assign an uuid to an Asset the label `microsoft.iotoperations/uuid` can be set in the Assets metadata.                                            |
> | external-asset-id |                                   | The external Asset id can be used to store and transport a link to the same Asset in another system. To assign an external Asset id to an Asset the label `microsoft.iotoperations/external-asset-id` can be set in the Assets metadata. |
> | traceparent       | traceparent                       | The traceparent field is a way to track requests across services. It has four parts: version, trace-id, parent-id and trace-flags. The parts are separated by dashes. |

> [!NOTE]
> If the labels for `uuid` and `external-asset-id` are added after the asset is deployed, they are only picked up after a restart of `opcua-connector`.

### Value changes
Whenever there's a change in values, OPC UA Connector generates a payload that contains one JSON object with the following structure:

```json
{
  "Timestamp": "2023-03-21T08:51:03.5502855Z",
  "Payload": {
    "dtmi:com:example:Thermostat:temperature;1": {
      "SourceTimestamp": "2023-03-21T08:51:02.6950444Z",
      "Value": 41
    },
    "dtmi:com:example:Thermostat:pressure;1": {
      "SourceTimestamp": "2023-03-21T08:51:02.6950689Z",
      "Value": 41
    }
  },
  "DataSetWriterName": "thermostat-sample-2",
  "SequenceNumber": 380
}
```

### Events
Whenever there are events, OPC UA Connector generates a payload that contains one JSON object with the following structure:

```json
{
  "Timestamp": "2023-03-21T08:51:03.5502855Z",
  "Payload": {
    "dtmi:com:example:Thermostat:serverEvents;1": {
      "eventId": "07785B86F3B58346A886547D94D9797F",
      "eventType"{
        "id":3035
      },
      "sourceNode": {
        "id":2253
      },
      "sourceName": "Internal",
      "time":"2023-03-21T08:51:02.6950444Z",
      "receiveTime": "2023-03-21T08:51:02.6950444Z",
      "message": "Events lost due to queue overflow",
      "severity":  100
    }
  },
  "DataSetWriterName": "thermostat-sample-2",
  "SequenceNumber": 380
}
```

## Elements of OPC UA PubSub format

> [!div class="mx-tdBreakAll"]
> | Name                                                | Mandatory | Datatype         | Comment                                                                                                                |
> | --------------------------------------------------- | --------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
> | Timestamp                                           | true      | String           | OPC UA Connector generated timestamp when it received the OPC UA data value change notification from the OPC UA Server |
> | Payload                                             | true      | Object           | Object containing one element for each OPC UA node with a data change                                                  |
> | Payload.<AssetType.spec.schema.@id>                 | true      | String           | Object with a key name of the datapoint's DTDL @id in the AssetType's schema to which the OPC UA node is mapped to     |
> | Payload.<AssetType.spec.schema.@id>.SourceTimestamp | true      | String           | OPC UA data source system (typically OPC UA Server) generated timestamp of the OPC UA node data value change           |
> | Payload.<AssetType.spec.schema.@id>.Value           | true      | Any              | New value of the OPC UA node                                                                                           |
> | Payload.<AssetType.spec.schema.@id>.StatusCode      | false     | Unsigned Integer | Status if OPC UA node value monitoring of the OPC UA Server, will be omitted if it is Good (0)                         |
> | DataSetWriterName                                   | true      | String           | Name of the Asset the telemetry belongs to                                                                             |
> | SequenceNumber                                      | true      | Unsigned Integer | OPC UA Connector generated sequence number of messages                                                                 |

## Related content

- [Uninstall OPC UA Broker using helm](howto-uninstall-opcua-broker-using-helm.md)