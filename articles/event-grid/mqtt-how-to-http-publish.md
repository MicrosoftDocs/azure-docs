---
title: Publish MQTT Messages via HTTP with Azure Event Grid
description: Explains how to publish MQTT messages via HTTP with Azure Event Grid for scalable server-to-device communication. Learn how to use the HTTP Publish API effectively.
#customer intent: As a back-end developer, I want to publish MQTT messages via HTTP so that I can integrate with Azure Event Grid without maintaining persistent MQTT sessions.
author: spelluru
contributors: null
ms.topic: how-to
ms.date: 07/30/2025
ms.author: spelluru
ms.reviewer: spelluru
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:07/30/2025
  - ai-gen-description
---

# Publish MQTT messages via HTTP with Azure Event Grid

Azure Event Grid now supports publishing Message Queuing Telemetry Transport (MQTT) messages via HTTP. Event Grid enables back-end systems to send messages to devices without maintaining persistent MQTT connections. This approach simplifies integration for applications that prefer stateless communication. It uses secure authentication with Microsoft Entra ID and provides scalable, reliable delivery to MQTT clients. In this article, you learn how to use the HTTP Publish API. You also learn how to obtain the necessary credentials and verify message delivery by using popular tools like Bruno and MQTTX.

This article explains how to publish MQTT messages via HTTP with Event Grid.

## Get your connection details

- **Namespace fully qualified domain name (FQDN)**: An example is `contoso.westus3-1.ts.eventgrid.azure.net`.
- **Topic**: An example is `devices/CXa-23112/prompt`.
- **Credentials**: Microsoft Entra ID client credentials.

## Role Assignments

The identity used to make the HTTP Publish request must have the Azure RBAC role [`EventGrid TopicSpaces Publisher`](mqtt-client-microsoft-entra-token-and-rbac.md#authorization-to-grant-access-permissions) for MQTT message publisher access.

## Get a bearer token

Run the following Azure CLI command to get a bearer token:

```bash
az account get-access-token --resource=https://eventgrid.azure.net --query accessToken -o tsv
```

Save this token to use in the `Authorization: Bearer <TOKEN>` header. 

## Publish messages by using HTTP

### [Curl](#tab/curl)

Here's an example curl command to simulate HTTP Publish:

```http
curl -X POST "https://contoso.westus3-1.ts.eventgrid.azure.net/mqtt/messages?topic=devices%2XXXX-0000%2Fprompt&api-version=2025-08-01-preview" \ 
  -H "Authorization: Bearer <ENTRA_TOKEN_HERE>" \ 
  -H "mqtt-qos: 1" \ 
  -H "mqtt-retain: 0" \ 
  -H "mqtt-response-topic: devices%2XXXX-00000%2Freply" \ 
  -H "mqtt-correlation-data: XXXXXXX" \ 
  -H "mqtt-user-properties: XXXXXXXXXXXX" \ 
  -H "Content-Type: text/plain;charset=UTF-8" \ 
  --data-raw "Please accept terms of licensing and agreement" 
```

In this sample command:

- Topic is percent encoded.
- Optional headers are added for Quality of Service (QoS), the `RETAIN` flag, response topic, and user properties.
- Payload goes in the request body.

### [Bruno](#tab/brno)

### Import to Bruno

1. Open Bruno.
1. Select **Import Collection**, and then select `EventGrid_HTTP_Publish_Postman_Collection.json`. Here's the content for the JSON file:

    ```json
    {
      "info": {
        "name": "Event Grid MQTT Broker - HTTP Publish",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      "item": [
        {
          "name": "HTTP Publish to MQTT Broker",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{entra_token}}"
              },
              {
                "key": "mqtt-qos",
                "value": "1"
              },
              {
                "key": "mqtt-retain",
                "value": "0"
              },
              {
                "key": "mqtt-response-topic",
                "value": "devices%2FCXa-23112%2Freply"
              },
              {
                "key": "mqtt-correlation-data",
                "value": "PlXCscK2wrbCuy8="
              },
              {
                "key": "mqtt-user-properties",
                "value": "[{\"Urgency\":\"alert\"},{\"RequestId\":\"55f4a7ee-b0b4-4d7f-8eb5-2edba2ced5d7\"}]"
              },
              {
                "key": "Content-Type",
                "value": "text/plain;charset=UTF-8"
              }
            ],
            "url": {
              "raw": "https://{{namespace}}/mqtt/messages?topic={{topic}}&api-version=2025-08-01-preview",
              "host": [
                "{{namespace}}"
              ],
              "path": [
                "mqtt",
                "messages"
              ],
              "query": [
                {
                  "key": "topic",
                  "value": "{{topic}}"
                },
                {
                  "key": "api-version",
                  "value": "2025-02-15-preview"
                }
              ]
            },
            "body": {
              "mode": "raw",
              "raw": "Please accept terms of licensing and agreement"
            }
          }
        }
      ],
      "variable": [
        {
          "key": "namespace",
          "value": "contoso.westus3-1.ts.eventgrid.azure.net"
        },
        {
          "key": "topic",
          "value": "devices/CXa-23112/prompt"
        },
        {
          "key": "entra_token",
          "value": "<ENTRA_TOKEN_HERE>"
        }
      ]
    }
    ```

1. On the **Variables** tab:

   - Replace `{{namespace}}` with your namespace FQDN.
   - Replace `{{topic}}` with your MQTT topic.
   - Replace `{{entra_token}}` with your token from step 2.
1. Select **Send**. You should see either "202 Accepted" or "204 No Content."

---

## Verify in MQTTX

Use MQTTX or any MQTT library (like `paho-mqtt` Python) to subscribe to the same topic to confirm delivery.

1. Create a new connection in MQTTX:

    - `Host: contoso.westus3-1.ts.eventgrid.azure.net`
    - `Port: 8883 (TLS)`
    - `Client ID: same as your Entra Object ID`
    - `Username/Password: N/A — use certificate or token auth if configured`
1. Subscribe to the topic that you used in the HTTP `POST` command.
1. Run **HTTP Publish** and watch for the message in MQTTX. Your payload should appear.

If publishing succeeds, you see:

- **HTTP Response**: "204 No Content" or "202 Accepted" (depending on routing rules).
- **Message appears**: The MQTT client sees the message instantly.

## Troubleshoot

- **401 Unauthorized**: If the token is missing or expired, you see "401 Unauthorized." Refresh your token.
- **403 Forbidden**: If the topic is invalid or you don't have rights, you see "403 Forbidden." Check your topic or permissions.
- **500 Internal Server Error**: If routing fails internally, check the metrics and diagnostic logs for your Event Grid namespace.
- **Message doesn't appear**: If the message doesn't appear, ensure that the topic is percent encoded in the URL. Check the broker routing configuration, and verify that you're using the same namespace.

## Related content

- For an overview of this feature, see [HTTP Publish of MQTT messages with Azure Event Grid](mqtt-http-publish.md).
