---
title: HTTP Publish of MQTT messages with Azure Event Grid
description: Publish MQTT messages via HTTP with Azure Event Grid for scalable server-to-device communication. Learn how to use the HTTP Publish API effectively.
#customer intent: As a backend developer, I want to publish MQTT messages via HTTP so that I can integrate with Azure Event Grid without maintaining persistent MQTT sessions.  
author: spelluru
contributors: null
ms.topic: concept-article
ms.date: 07/30/2025
ms.author: spelluru
ms.reviewer: spelluru
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:07/30/2025
  - ai-gen-description
---

# HTTP Publish of MQTT messages with Azure Event Grid (preview)

The Azure Event Grid MQTT Broker HTTP Publish API empowers customers to publish MQTT messages using standard HTTP requests. This complements direct MQTT client connections, providing a simple and scalable option for server-side systems that prefer HTTP for server-to-device command-and-control, updates, or retained message management.

> [!NOTE]
> This feature is currently in preview. 

Key benefits:

- Allows backend services to send MQTT messages without keeping persistent MQTT sessions open.
- Helps protect broker stability by limiting per-client MQTT sessions.
- Ensures consistent message processing for both MQTT and HTTP-originated messages.

## When to Use HTTP Publish

Consider HTTP Publish when:

- Your backend services are HTTP-native and need to send device commands or updates over MQTT.
- You want to manage retained messages without opening an MQTT connection.
- You need to scale up publish capacity without exhausting session limits.

## How It Works

1. HTTP clients issue an HTTP POST request with MQTT publish details.
1. Event Grid maps HTTP request parts to standard MQTT PUBLISH packet properties.
1. Messages flow through the Event Grid routing and enrichment pipeline, ensuring delivery guarantees and applying any enrichment or transformation.

## Example: MQTT publish equivalent

```http
PUBLISH Topic Name: devices/CXa-23112/prompt  
QoS: 1  
RETAIN: 0  
Response Topic: devices/CXa-23112/reply  
Correlation Data: >U±¶¶»/  
User Property: Urgency = alert  
User Property: RequestId = 55f4a7ee-b0b4-4d7f-8eb5-2edba2ced5d7  
Payload: Please accept terms of licensing and agreement
```

## Example: HTTP publish request

```http
POST /mqtt/messages?topic=devices%2FCXa-23112%2Fprompt&api-version=2025-02-15-preview HTTP/1.1  
Host: nsname.westus3-1.ts.eventgrid.azure.net  
Authorization: Bearer <ENTRA_TOKEN_HERE>  
mqtt-qos: 1  
mqtt-retain: 0  
mqtt-response-topic: devices%2FCXa-23112%2Freply  
mqtt-correlation-data: PlXCscK2wrbCuy8=  
mqtt-user-properties: W3siVXJnZW5jeSI6ImFsZXJ0In0seyJSZXF1ZXN0SWQiOiI1NWY0YTdlZS1iMGI0LTRkN2YtOGViNS0yZWRiYTJjZWQ1ZDcifV0=  
Content-Type: text/plain;charset=UTF-8  
Date: Sun, 06 Nov 1994 08:49:37 GMT  
Content-Length: 46  

Please accept terms of licensing and agreement
```



## Request parameters

This table describes how HTTP request parts map to MQTT PUBLISH packet properties. Refer to the original documentation for full details.

| **MQTT PUBLISH Part**    | **Type/Values**        | **Location**                               | **Required**       | **Description**                |
|--------------------------|------------------------|--------------------------------------------|--------------------|--------------------------------|
| Topic name               | Percent-encoded string | Query `topic`                              | Yes                | MQTT topic to publish to.      |
| QoS                      | 0 or 1                 | Query `qos` or header `mqtt-qos`           | No [default = 1]   | Quality of Service level.      |
| RETAIN flag              | 0 or 1                 | Query `retain` or header `mqtt-retain`     | No [default = 0]   | Whether to retain the message. |
| Response Topic           | Percent-encoded string | Header `mqtt-response-topic`               | No                 | Response topic if needed.      |
| Correlation Data         | Base64 string          | Header `mqtt-correlation-data`             | No                 | Extra data for tracking.       |
| User Properties          | Base64 JSON Array      | Header `mqtt-user-properties`              | No                 | Custom user properties.        |
| Content Type             | String                 | Header `content-type`                      | No                 | Payload type.                  |
| Message Expiry Interval  | Unsigned integer       | Header `mqtt-message-expiry`               | No                 | Retention period in seconds.   |
| Payload Format Indicator | 0 or 1                 | Header `mqtt-payload-format-indicator`     | No [default = 0]   | Format indicator.              |
| Payload                  | bytes                  | HTTP body                                  | No                 | Message body.                  |

**Notes:**

- Query parameter values override header values if both are present.
- Percent-encoding is required for topic and response topic.
- Correlation Data must be base64-encoded.

## High-level steps for using HTTP Publish

- Step 1: Prepare your Entra ID bearer token for authentication.
- Step 2: Construct your HTTP POST request to your Event Grid MQTT broker endpoint.
- Step 3: Include required query parameters like topic.
- Step 4: Add optional headers for QoS, RETAIN, response topics, user properties, etc.
- Step 5: Add your payload as the HTTP body.
- Step 6: Send the request.
- Step 7: Confirm delivery via logs and metrics in the Event Grid portal.

## Authentication & authorization

- HTTP Publish uses Microsoft Entra ID for authentication.
- Add a Bearer token to the Authorization header.
- The Microsoft Entra Object ID becomes the MQTT clientId.
- The AuthN/AuthZ model aligns with standard MQTT connections.

## Routing and observability

- Metrics and logs include:
  - Protocol: http-publish
  - Request ID
  - Topic
  - Source IP
  - Auth principal

## Best practices

- Use lowercase header keys where possible. HTTP/2 header keys are case-insensitive.
- Monitor throughput — HTTP messages tend to be larger than direct MQTT messages.
- HTTP Publish shares throughput limits with direct MQTT publishes.

## Throttling

Be aware that HTTP Publish counts towards your overall MQTT throughput quota. Monitor your usage to avoid exceeding limits.

## Next step
See [How to publish MQTT messages using HTTP with Azure Event Grid](mqtt-how-to-http-publish.md).
