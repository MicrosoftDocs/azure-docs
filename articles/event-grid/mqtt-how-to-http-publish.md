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
Azure Event Grid now supports publishing MQTT messages via HTTP, enabling backend systems to send messages to devices without maintaining persistent MQTT connections. This approach simplifies integration for applications that prefer stateless communication, leverages secure authentication with Entra ID, and provides scalable, reliable delivery to MQTT clients. In this article, you'll learn how to use the HTTP Publish API, obtain the necessary credentials, and verify message delivery using popular tools like Postman, Bruno, and MQTTX.

This article explains how to publish MQTT messages via HTTP with Azure Event Grid. 

## Get Your Connection Details

- Namespace fully qualified domain name (FQDN). Example: `contoso.westus3-1.ts.eventgrid.azure.net`.
- Topic. Example: `devices/CXa-23112/prompt`.
- Entra ID client credentials.

## Get a bearer token
Run the following Azure CLI command to get a bearer token. 

```bash
az account get-access-token --resource=https://<namespace> --query accessToken -o tsv
```

## Import to Bruno
Use a tool such as Bruno to 

1. Open Bruno.
1. Select **Import Collection**, and then select `EventGrid_HTTP_Publish_Postman_Collection.json`.
1. Go to **Variables** tab:
   - Replace `{{namespace}}` with your namespace FQDN.
   - Replace `{{topic}}` with your MQTT topic.
   - Replace `{{entra_token}}` with your token from Step 2.
1. Select **Send** — you should get 202 or 204.

## Step 4: Verify in MQTTX

- Open MQTTX and connect using your broker’s endpoint, TLS, and your normal MQTT auth.
- Subscribe to the topic you used in the HTTP POST.
- You should see your payload appear.

## Troubleshoot

- **401 Unauthorized?** — Refresh your token.
- **403 Forbidden?** — Check your topic or permissions.
- **Message doesn’t appear?** — Ensure topic is percent-encoded in the URL, check broker routing config, and verify you’re using the same namespace.


# Tutorials:

## Option 1: Using cURL Command

### Step 1: Get Your Connection Details

- **Event Grid Namespace**: e.g., contoso.westus3-1.ts.eventgrid.azure.net
- **Topic**: e.g., devices/CXa-23112/prompt
- **Entra Client ID** and Tenant: for getting your bearer token.
- **Audience (Resource)**: your Event Grid Namespace URL.

### Step 2: Get an Entra ID Token

Use **Azure CLI** or your preferred flow to get a token:

```bash
az account get-access-token \
  --resource=https://contoso.westus3-1.ts.eventgrid.azure.net \
  --query accessToken \
  -o tsv
```

Save this token to use in the Authorization: Bearer `<TOKEN>` header.

### Step 3: Prepare Your HTTP POST Request

Here’s an example using curl to simulate the HTTP Publish.

```bash
curl -X POST "https://contoso.westus3-1.ts.eventgrid.azure.net/mqtt/messages?topic=devices%2FCXa-23112%2Fprompt&api-version=2025-02-15-preview" \
  -H "Authorization: Bearer <ENTRA_TOKEN_HERE>" \
  -H "mqtt-qos: 1" \
  -H "mqtt-retain: 0" \
  -H "mqtt-response-topic: devices%2FCXa-23112%2Freply" \
  -H "mqtt-correlation-data: PlXCscK2wrbCuy8=" \
  -H "mqtt-user-properties: W3siVXJnZW5jeSI6ImFsZXJ0In0seyJSZXF1ZXN0SWQiOiI1NWY0YTdlZS1iMGI0LTRkN2YtOGViNS0yZWRiYTJjZWQ1ZDcifV0=" \
  -H "Content-Type: text/plain;charset=UTF-8" \
  --data-raw "Please accept terms of licensing and agreement"
```

### Step 4: Verify Publish with MQTT Client

Use **MQTTX** or any MQTT library (like paho-mqtt Python) to subscribe to the same topic to confirm delivery.

#### Example MQTTX Steps

1. Create a new connection in MQTTX:
   - Host: contoso.westus3-1.ts.eventgrid.azure.net
   - Port: 8883 (TLS)
   - Client ID: same as your Entra Object ID.
   - Username/Password: N/A — use certificate or token auth if configured.
2. Subscribe to devices/CXa-23112/prompt.
3. Run the HTTP Publish and watch for the message in MQTTX.

### Step 5: Validate Success

- If the publish succeeds, you’ll see:
  - **HTTP Response**: 204 No Content or 202 Accepted (depending on routing rules).
  - MQTT client sees the message instantly.

#### Expected log in your MQTT client

```text
Topic: devices/CXa-23112/prompt
Payload: Please accept terms of licensing and agreement
QoS: 1
```

### Step 6: Handle Failures

- If the token is missing or expired: You’ll get 401 Unauthorized.
- If the topic is invalid or you don’t have rights: 403 Forbidden.
- If routing fails internally: 500 Internal Server Error with diagnostic info.

💡 Check logs in Event Grid Metrics and Diagnostic Logs for delivery status.

## Option 2: Using Postman or Bruno

This helps you test the HTTP Publish feature using:

- Postman or Bruno collection (provided).
- MQTTX or your MQTT client to verify delivery.
- Entra ID for secure auth.

