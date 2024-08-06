---
title: Connector for OPC UA message format
description: Understand the structure of the OPC UA messages published to the MQTT broker by the connector for OPC UA.
author: dominicbetts
ms.author: dobett
ms.subservice: azure-opcua-connector
ms.topic: conceptual
ms.date: 08/05/2024

# CustomerIntent: As an industrial edge IT or operations user, I want to understand the structure of the messages that the connector for OPC UA publishes so that I can process the messages.
---

# Connector for OPC UA message format

The connector for OPC UA publishes messages from OPC UA servers to the MQTT broker in JSON format. Each message has a payload and a collection of properties that are a part of the MQTT user properties section. The payload contains the telemetry data from the OPC UA server, and the properties provide metadata about the message.

## Payload

The payload of an OPC UA message is a JSON object that contains the telemetry data from the OPC UA server. The following example shows the payload of a message from the sample thermostat asset used in the quickstarts. Use the following command to subscribe to messages in the `azure-iot-operations/data` topic:

```console
mosquitto_sub --host aio-mq-dmqtt-frontend --port 8883 --topic "azure-iot-operations/data/#" -v --debug --cafile /var/run/certs/ca.crt -D CONNECT authentication-method 'K8S-SAT' -D CONNECT authentication-data $(cat /var/run/secrets/tokens/mq-sat)
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

## User properties

The headers in the messages published by the connector for OPC UA are based on the [CloudEvents specification for OPC UA](https://github.com/cloudevents/spec/blob/main/cloudevents/extensions/opcua.md). The headers from an OPC UA message become user properties in a message published to the MQTT broker. The following example shows the user properties of a message from the sample thermostat asset used in the quickstarts. Use the following command to subscribe to messages in the `azure-iot-operations/data` topic:

```console
mosquitto_sub --host aio-mq-dmqtt-frontend --port 8883 --topic "azure-iot-operations/data/#" -V mqttv5 -F %P --cafile /var/run/certs/ca.crt -D CONNECT authentication-method 'K8S-SAT' -D CONNECT authentication-data $(cat /var/run/secrets/tokens/mq-sat)
```

The output from the previous command looks like the following example:

```output
uuid:813740c3-48f3-4332-a7cf-bf5424918b8d externalAssetId:813740c3-48f3-4332-a7cf-bf5424918b8d serverToConnectorMilliseconds:0.3153 id:908fb134-2619-42a5-9aa2-4826bac5b3e0 specversion:1.0 type:ua-keyframe source:urn:OpcPlc:opcplc-000000 time:2024-08-05T14:19:08.8738457Z datacontenttype:application/json subject:813740c3-48f3-4332-a7cf-bf5424918b8d sequence:9768 traceparent:00-4eb4313536bc006c918e936686921cfc-4ee795f6fdd5fae7-01 recordedtime:2024-08-05 14:19:08.874 +00:00
uuid:813740c3-48f3-4332-a7cf-bf5424918b8d externalAssetId:813740c3-48f3-4332-a7cf-bf5424918b8d serverToConnectorMilliseconds:0.3561 id:a4acba23-ff15-4b1b-9544-e07deb4e941b specversion:1.0 type:ua-keyframe source:urn:OpcPlc:opcplc-000000 time:2024-08-05T14:19:09.8746396Z datacontenttype:application/json subject:813740c3-48f3-4332-a7cf-bf5424918b8d sequence:9769 traceparent:00-388697f77c2dcb5e9b30589c0a4cef6e-de9351186ff5833e-01 recordedtime:2024-08-05 14:19:09.875 +00:00
uuid:813740c3-48f3-4332-a7cf-bf5424918b8d externalAssetId:813740c3-48f3-4332-a7cf-bf5424918b8d serverToConnectorMilliseconds:0.3423 id:875739f2-c8f0-4a17-bd4a-d40343ff2a50 specversion:1.0 type:ua-keyframe source:urn:OpcPlc:opcplc-000000 time:2024-08-05T14:19:10.8754860Z datacontenttype:application/json subject:813740c3-48f3-4332-a7cf-bf5424918b8d sequence:9770 traceparent:00-7c65a93fa7668bbe0cdfd051168c88ac-ab86b83fb1b7944f-01 recordedtime:2024-08-05 14:19:10.875 +00:00
uuid:813740c3-48f3-4332-a7cf-bf5424918b8d externalAssetId:813740c3-48f3-4332-a7cf-bf5424918b8d serverToConnectorMilliseconds:0.3277 id:255ea77e-b313-43be-9ec0-44b98bb1c632 specversion:1.0 type:ua-keyframe source:urn:OpcPlc:opcplc-000000 time:2024-08-05T14:19:11.8765569Z datacontenttype:application/json subject:813740c3-48f3-4332-a7cf-bf5424918b8d sequence:9771 traceparent:00-5851e56a6f358ab5e1af1d798f7580a1-bf6dfbda8196cba0-01 recordedtime:2024-08-05 14:19:11.877 +00:00
```

The subject field contains the name of the asset that the message is related to. The sequence field contains the sequence number of the message.

> [!NOTE]
> There's a known issue for assets created using the operations experience web UI where the subject property for any messages sent by the asset is set to the `externalAssetId` value. In this case, the `subject` is a GUID rather than a friendly asset name.
