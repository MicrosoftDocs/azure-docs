---
title: Include file
description: Include file
author: dominicbetts
ms.topic: include
ms.date: 07/02/2026
ms.author: dobett
ms.service: azure-iot-operations
---

The following JSON snippet shows an example additional configuration:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "MQTT Device Endpoint Config Schema",
  "description": "The JSON schema for the MQTT device endpoint additional configuration field",
  "type": "object",
  "properties": {
    "useBuiltInMqttBroker": {
      "type": "boolean",
      "default": false,
      "description": "Whether to use the built-in AIO broker as the inbound endpoint"
    },
    "assetDiscoveryConfiguration": {
      "type": "object",
      "description": "Configuration options for discovering assets via MQTT topics.",
      "properties": {
        "topicFilter": {
          "type": "string",
          "description": "The MQTT topic filter to subscribe to. This supports single level wildcard (+)"
        },
        "assetLevel": {
          "type": "integer",
          "minimum": 1,
          "default": 1,
          "description": "The level in topic tree where MQTT Connector looks for asset name. If single level wildcard (+) is used, please map this to it's position in topic filter."
        },
        "topicMappingPrefix": {
          "type": "string",
          "description": "A prefix used to map incoming topic to UNS topic. This will be used as prefix for the destination topic on the discovered dataset."
        }
      }
    },
    "externalBrokerConfiguration": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "External Broker Configuration Schema",
      "type": "object",
      "description": "Configuration options for external MQTT broker connections.",
      "properties": {
        "keepAlive": {
          "type": "integer",
          "default": 60,
          "description": "The keep alive interval in seconds for the MQTT connection."
        },
        "receiveMax": {
          "type": "integer",
          "default": 65535,
          "maximum": 65535,
          "description": "The maximum number of in-flight QoS 1 and QoS 2 publishes that the client is willing to process concurrently."
        },
        "receivePacketSizeMax": {
          "title": "Maximum received packet size",
          "type": "integer",
          "description": "The maximum packet size in bytes that the client is willing to accept."
        },
        "sessionExpiry": {
          "type": "integer",
          "default": 3600,
          "description": "The expiry of the session in seconds."
        },
        "connectionTimeout": {
          "type": "integer",
          "default": 30,
          "description": "The connection timeout in seconds for the MQTT connection."
        }
      },
      "required": ["receiveMax", "receivePacketSizeMax"]
    }
  }
}
```

You can save the previous JSON snippet to a standalone file or embed it in the *connector-metadata.json* file for the MQTT connector. If you embed it in the *connector-metadata.json* file, use the `additionalConfigurationSchema` property inside an `inboundEndpoints` array entry.


To learn more, see [Akri operator and connector contract > ADDITIONAL_CONNECTOR_CONFIGURATION](https://github.com/Azure/iot-operations-sdks/blob/main/doc/akri_connector/Akri%20operator%20and%20connector%20contract.md).