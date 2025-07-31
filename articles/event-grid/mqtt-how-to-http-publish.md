---
title: How to Publish MQTT Messages via HTTP with Azure Event Grid
description: Explains how to publish MQTT messages via HTTP with Azure Event Grid for scalable server-to-device communication. Learn how to use the HTTP Publish API effectively.
#customer intent: As a backend developer, I want to publish MQTT messages via HTTP so that I can integrate with Azure Event Grid without maintaining persistent MQTT sessions.  
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

# How to Publish MQTT Messages via HTTP with Azure Event Grid
Azure Event Grid now supports publishing MQTT messages via HTTP, enabling backend systems to send messages to devices without maintaining persistent MQTT connections. This approach simplifies integration for applications that prefer stateless communication, uses secure authentication with Entra ID, and provides scalable, reliable delivery to MQTT clients. In this article, you learn how to use the HTTP Publish API, obtain the necessary credentials, and verify message delivery using popular tools like Bruno, and MQTTX.

This article explains how to publish MQTT messages via HTTP with Azure Event Grid. 

## Get Your Connection Details

- Namespace fully qualified domain name (FQDN). Example: `contoso.westus3-1.ts.eventgrid.azure.net`.
- Topic. Example: `devices/CXa-23112/prompt`.
- Entra ID client credentials.

## Get a bearer token
Run the following Azure CLI command to get a bearer token. 

```bash
az account get-access-token --resource=https://<namespaceFQDN> --query accessToken -o tsv
```

Save this token to use in the `Authorization: Bearer <TOKEN>` header. 

# [cURL](#tab/curl)

Here’s an example cURL command to simulate the HTTP Publish. 

```http
curl -X POST "https://contoso.westus3-1.ts.eventgrid.azure.net/mqtt/messages?topic=devices%2XXXX-0000%2Fprompt&api-version=2025-02-15-preview" \ 
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

- Topic is percent-encoded. 
- Add optional headers for QoS, retain flag, response topic, user properties. 
- Payload goes in the request body. 

# [Bruno](#tab/brno)

## Import to Bruno
1. Open Bruno.
1. Select **Import Collection**, and then select `EventGrid_HTTP_Publish_Postman_Collection.json`.
1. Go to **Variables** tab:
   - Replace `{{namespace}}` with your namespace FQDN.
   - Replace `{{topic}}` with your MQTT topic.
   - Replace `{{entra_token}}` with your token from Step 2.
1. Select **Send**. You should get 202 or 204.

---

## Step 4: Verify in MQTTX
Use MQTTX or any MQTT library (like paho-mqtt Python) to subscribe to the same topic to confirm delivery. 

1. Create a new connection in MQTTX:
    1. `Host: contoso.westus3-1.ts.eventgrid.azure.net`
    1. `Port: 8883 (TLS)`
    1. `Client ID: same as your Entra Object ID` 
    1. `Username/Password: N/A — use certificate or token auth if configured`   
- Subscribe to the topic you used in the HTTP POST command.
- Run the **HTTP Publish** and watch for the message in MQTTX. You should see your payload appear.

If the publish **succeeds**, you see: 

- **HTTP Response**: 204 No Content or 202 Accepted (depending on routing rules). 
- MQTT client sees the message instantly. 

## Troubleshoot

- **401 Unauthorized?** — If the token is missing or expired: You get 401 Unauthorized. Refresh your token.
- **403 Forbidden?** — If the topic is invalid or you don’t have rights: 403 Forbidden. Check your topic or permissions.
- **500 Internal Server Error** - If routing fails internally, check metrics and diagnostic Logs for your Event Grid namespace. 
- **Message doesn’t appear?** — Ensure topic is percent-encoded in the URL, check broker routing config, and verify you’re using the same namespace.


