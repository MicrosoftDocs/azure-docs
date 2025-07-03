---
title: Connect industrial assets using the connector for OPC UA
description: Use the connector for OPC UA to connect to OPC UA servers and exchange messages and data with the MQTT broker in a Kubernetes cluster.
author: dominicbetts
ms.author: dobett
ms.subservice: azure-opcua-connector
ms.topic: overview
ms.date: 10/22/2024

# CustomerIntent: As an industrial edge IT or operations user, I want to to understand what the connector for OPC UA is and how it works with OPC UA industrial assets to enable me to add them as resources to my Kubernetes cluster.
ms.service: azure-iot-operations
---

# What is the connector for OPC UA?

OPC UA (OPC Unified Architecture) is a standard developed by the [OPC Foundation](https://opcfoundation.org/) to enable the exchange of data between industrial components at the edge and with the cloud. OPC UA provides a consistent, secure, documented standard based on widely used data formats. Industrial components can implement the OPC UA standard to enable universal data exchange.

The connector for OPC UA is a part of Azure IoT Operations. The connector for OPC UA connects to OPC UA servers to retrieve data that it publishes to topics in the MQTT broker. The connector for OPC UA enables your industrial OPC UA environment to ingress data into your local workloads running on a Kubernetes cluster, and into your cloud workloads.

The connector for OPC UA is a client application that runs as a middleware service in Azure IoT Operations. The connector for OPC UA connects to OPC UA servers, lets you browse the server address space, and monitor data changes and events in connected assets. Operations teams and developers use the connector for OPC UA to streamline the task of connecting OPC UA assets to their industrial solution at the edge.

## Capabilities

As part of Azure IoT Operations, the connector for OPC UA is a native Kubernetes application that:

- Connects existing OPC UA servers and assets to a native Kubernetes cluster at the edge.
- Publishes JSON-encoded messages from OPC UA servers in OPC UA PubSub format, using a JSON payload. By using this standard format for data exchange, you can reduce the risk of future compatibility issues.
- Connects to Azure Arc-enabled services in the cloud.

### Other features

The connector for OPC UA supports the following features as part of Azure IoT Operations:

- Simultaneous connections to multiple OPC UA servers configured by using Kubernetes `AssetEndpointProfile` custom resources (CRs).
- Publish OPC UA data value changes in OPC UA PubSub format with JSON encoding.
- Publish message headers as user properties in the MQTT message. The headers in the messages published by the connector for OPC UA are based on the [CloudEvents specification for OPC UA](https://github.com/cloudevents/spec/blob/main/cloudevents/extensions/opcua.md).
- Publish OPC UA events with predefined event fields.
- Asset definition by using Kubernetes Asset CRs
- Payload compression including `gzip` and `brotli`.
- Automatic reconnection to OPC UA servers.
- Integrated [OpenTelemetry](https://opentelemetry.io/) compatible observability.
- OPC UA transport encryption.
- Anonymous authentication and authorization based on username and password.
- `AssetEndpointProfile` and `Asset` CRs configurable by using Azure REST API and the operations experience web UI.

## How it works

The two main components of the connector for OPC UA are the application and the discovery handler.

The connector for OPC UA application:

- Creates a session to the OPC UA server for each asset that you define.
- All the tags of the asset are configured with the same publishing interval. This interval determines how frequently the connector publishes data to an MQTT broker topic.
- Creates a separate subscription in the session for each 1,000 tags.
- Creates a separate subscription for each event defined in the asset.
- Implements retry logic to establish connections to endpoints that don't respond after a specified number of keep-alive requests. For example, there could be a nonresponsive endpoint in your environment when an OPC UA server stops responding because of a power outage.

## Connector for OPC UA message format

The connector for OPC UA publishes messages from OPC UA servers to the MQTT broker as JSON. Each message has a payload and a collection of properties that are a part of the MQTT user properties section. The payload contains the messages from the OPC UA server, and the properties provide metadata.

### Payload

The payload of an OPC UA message is a JSON object that contains the messages from the OPC UA server. The following example shows the payload of a message from the sample thermostat asset used in the quickstarts. Use the following command to subscribe to messages in the `azure-iot-operations/data` topic:

```console
mosquitto_sub --host aio-broker --port 18883 --topic "azure-iot-operations/data/#" -v --debug --cafile /var/run/certs/ca.crt -D CONNECT authentication-method 'K8S-SAT' -D CONNECT authentication-data $(cat /var/run/secrets/tokens/broker-sat)
```

The output from the previous command looks like the following example:

```output
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/thermostat', ... (152 bytes))
{"temperature":{"SourceTimestamp":"2024-07-29T15:02:17.1858435Z","Value":4558},"Tag 10":{"SourceTimestamp":"2024-07-29T15:02:17.1858869Z","Value":4558}}
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/thermostat', ... (152 bytes))
{"temperature":{"SourceTimestamp":"2024-07-29T15:02:18.1838125Z","Value":4559},"Tag 10":{"SourceTimestamp":"2024-07-29T15:02:18.1838523Z","Value":4559}}
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/thermostat', ... (152 bytes))
{"temperature":{"SourceTimestamp":"2024-07-29T15:02:19.1834363Z","Value":4560},"Tag 10":{"SourceTimestamp":"2024-07-29T15:02:19.1834879Z","Value":4560}}
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/thermostat', ... (152 bytes))
{"temperature":{"SourceTimestamp":"2024-07-29T15:02:20.1861251Z","Value":4561},"Tag 10":{"SourceTimestamp":"2024-07-29T15:02:20.1861709Z","Value":4561}}
Client $server-generated/05a22b94-c5a2-4666-9c62-837431ca6f7e received PUBLISH (d0, q0, r0, m0, 'azure-iot-operations/data/thermostat', ... (152 bytes))
{"temperature":{"SourceTimestamp":"2024-07-29T15:02:21.1856798Z","Value":4562},"Tag 10":{"SourceTimestamp":"2024-07-29T15:02:21.1857211Z","Value":4562}}
```

### User properties

The headers in the messages published by the connector for OPC UA are based on the [CloudEvents specification for OPC UA](https://github.com/cloudevents/spec/blob/main/cloudevents/extensions/opcua.md). The headers from an OPC UA message become user properties in the message published to the MQTT broker. The following example shows the user properties of a message from the sample thermostat asset used in the quickstarts. Use the following command to subscribe to messages in the `azure-iot-operations/data` topic:

```console
mosquitto_sub --host aio-broker --port 18883 --topic "azure-iot-operations/data/#" -V mqttv5 -F %P --cafile /var/run/certs/ca.crt -D CONNECT authentication-method 'K8S-SAT' -D CONNECT authentication-data $(cat /var/run/secrets/tokens/broker-sat)
```

The output from the previous command looks like the following example:

```output
uuid:0000aaaa-11bb-cccc-dd22-eeeeee333333 externalAssetId:0000aaaa-11bb-cccc-dd22-eeeeee333333 serverToConnectorMilliseconds:0.3153 id:1111bbbb-22cc-dddd-ee33-ffffff444444 specversion:1.0 type:ua-keyframe source:urn:OpcPlc:opcplc-000000 time:2024-08-05T14:19:08.8738457Z datacontenttype:application/json subject:0000aaaa-11bb-cccc-dd22-eeeeee333333 sequence:9768 traceparent:00-4eb4313536bc006c918e936686921cfc-4ee795f6fdd5fae7-01 recordedtime:2024-08-05 14:19:08.874 +00:00
uuid:0000aaaa-11bb-cccc-dd22-eeeeee333333 externalAssetId:0000aaaa-11bb-cccc-dd22-eeeeee333333 serverToConnectorMilliseconds:0.3561 id:1111bbbb-22cc-dddd-ee33-ffffff444444 specversion:1.0 type:ua-keyframe source:urn:OpcPlc:opcplc-000000 time:2024-08-05T14:19:09.8746396Z datacontenttype:application/json subject:0000aaaa-11bb-cccc-dd22-eeeeee333333 sequence:9769 traceparent:00-388697f77c2dcb5e9b30589c0a4cef6e-de9351186ff5833e-01 recordedtime:2024-08-05 14:19:09.875 +00:00
uuid:0000aaaa-11bb-cccc-dd22-eeeeee333333 externalAssetId:0000aaaa-11bb-cccc-dd22-eeeeee333333 serverToConnectorMilliseconds:0.3423 id:1111bbbb-22cc-dddd-ee33-ffffff444444 specversion:1.0 type:ua-keyframe source:urn:OpcPlc:opcplc-000000 time:2024-08-05T14:19:10.8754860Z datacontenttype:application/json subject:0000aaaa-11bb-cccc-dd22-eeeeee333333 sequence:9770 traceparent:00-7c65a93fa7668bbe0cdfd051168c88ac-ab86b83fb1b7944f-01 recordedtime:2024-08-05 14:19:10.875 +00:00
uuid:0000aaaa-11bb-cccc-dd22-eeeeee333333 externalAssetId:0000aaaa-11bb-cccc-dd22-eeeeee333333 serverToConnectorMilliseconds:0.3277 id:1111bbbb-22cc-dddd-ee33-ffffff444444 specversion:1.0 type:ua-keyframe source:urn:OpcPlc:opcplc-000000 time:2024-08-05T14:19:11.8765569Z datacontenttype:application/json subject:0000aaaa-11bb-cccc-dd22-eeeeee333333 sequence:9771 traceparent:00-5851e56a6f358ab5e1af1d798f7580a1-bf6dfbda8196cba0-01 recordedtime:2024-08-05 14:19:11.877 +00:00
```

The subject field contains the name of the asset that the message is related to. The sequence field contains the sequence number of the message.

> [!NOTE]
> For assets created in the operations experience web UI, the subject property for any messages sent by the asset is set to the `externalAssetId` value. In this case, the `subject` property contains a GUID rather than a friendly asset name.
