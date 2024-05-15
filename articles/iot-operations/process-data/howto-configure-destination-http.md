---
title: Send data to an HTTP endpoint from a pipeline
description: Configure a pipeline destination stage to send the pipeline output to an HTTP endpoint for further processing.
author: dominicbetts
ms.author: dobett
ms.subservice: data-processor
ms.topic: how-to
ms.date: 02/16/2024

#CustomerIntent: As an operator, I want to send data from a pipeline to an HTTP endpoint so that I can run custom processing on the output from the pipeline.
---

# Send data to an HTTP endpoint

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Use the _HTTP_ destination to write processed and clean data to an HTTP endpoint for further processing.

When you send data to an HTTP endpoint from a destination stage, any response is discarded.

## Prerequisites

To configure and use this destination pipeline stage, you need:

- A deployed instance of Azure IoT Data Processor (preview).
- An HTTP server that's accessible from the Data Processor instance.

## Configure the destination stage

The HTTP destination stage JSON configuration defines the details of the stage. To author the stage, you can either interact with the form-based UI, or provide the JSON configuration on the **Advanced** tab:

| Field | Type | Description | Required? | Default | Example |
|--|--|--|--|--|--|
| `url` | string | URL for the request. Both HTTP and HTTPS are supported. | Yes |  | `https://contoso.com/some/url/path` |
| `method` | string enum | The HTTP method to use. One of: `POST`, `PUT` | Yes |  | `POST` |
| `request` | [Request](#request) | An object that represents the request body and headers. | No | (empty) | See [Request](#request) |
| `retry` | [Retry](concept-configuration-patterns.md#retry) | The retry mechanism to use if the call fails. | No | (empty) | `{"type": "fixed"}` |
| `authentication` | Authentication type | Authentication information for the endpoint. Supports `none`, `usernamePassword`, and `header` auth types. | No | `{"type": "none"}` | `{"type": "none"}` |

### Request

| Field | Type | Description | Required? | Default | Example |
|--|--|--|--|--|--|
| `body` | Object. | Formatting information, including location where the body is located in the message. | No | (empty) | `{"type": "json", "path": ".payload"}` |
| `headers` | An array of objects. | List of headers to send with the request. Keys and values can be [static or dynamic](concept-configuration-patterns.md#static-and-dynamic-fields). | No | `[]` | See [Examples](#sample-configuration) |

## Sample configuration

The following JSON shows an example definition for an HTTP destination stage:

```json
{
    "displayName": "HTTP Output Example",
    "description": "Sample HTTP output stage",
    "type": "output/http@v1",
    "url": "https://contoso.com/some/url/path",
    "method": "POST",
    "request": {
        "body": {
            "format": "json",
            "path": ".payload",
        },
        "headers": [
            {
                "key": {
                    "type": "static",
                    "value": "asset"
                },
                "value": {
                    "type": "dynamic",
                    "value": ".payload.assetId"
                }
            },
            {
                "key": {
                    "type": "static",
                    "value": "revision"
                },
                "value": {
                    "type": "static",
                    "value": "12"
                }
            }
        ]
    },
    "retry": {
        "type": "fixed",
        "interval": "20s",
        "maxRetries": 4
    },
    "next": ["next-stage-id"]
}
```

## Related content

- [Send data to Azure Data Explorer](../connect-to-cloud/howto-configure-destination-data-explorer.md)
- [Send data to Microsoft Fabric](../connect-to-cloud/howto-configure-destination-fabric.md)
- [Send data to Azure Blob Storage](../connect-to-cloud/howto-configure-destination-blob.md)
- [Publish data to an MQTT broker](howto-configure-destination-mq-broker.md)
- [Send data to the reference data store](howto-configure-destination-reference-store.md)
