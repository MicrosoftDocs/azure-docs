---
title: Custom Webhook Authentication for MQTT clients
description: "Custom webhook authentication for MQTT clients: Securely validate device connections to Azure Event Grid using dynamic HTTP endpoints and flexible authorization."
#customer intent: As a solution architect, I want to set up custom webhook authentication for MQTT clients so that I can centralize and control device access policies.
ms.topic: concept-article
ms.custom: build-2024
ms.date: 03/23/2026
author: Connected-Seth
ms.author: seshanmugam
ms.reviewer: spelluru
ms.subservice: mqtt
---

# Custom webhook authentication for Message Queuing Telemetry Transport (MQTT) clients

This article explains how to authenticate with Azure Event Grid namespaces by using either a webhook or an Azure function. 

By using webhook authentication, external HTTP endpoints, such as webhooks or functions, can dynamically verify MQTT connections. It uses Microsoft Entra ID JSON Web Token validation for secure access. 

When a client tries to connect, the broker calls a user-defined HTTP endpoint to check credentials like Shared Access Signature tokens, usernames, passwords, or even Certificate Revocation List checks. The webhook reviews the request and responds with a decision to permit or deny the connection, and it can include metadata for detailed authorization. This method allows for flexible, centralized authentication policies that suit various device groups and scenarios. 

## How does this work? 

Devices/ applications connect using `MQTT CONNECT` and the entire connect of the Connect Package is forwarded on to Webhook  for validation. Instead of Event Grid directly validating client credentials (username/password, SAS tokens, etc.), Event Grid calls your webhook endpoint during `MQTT CONNECT` to decide: 

- Should this client be authenticated? 
- What client identity (`clientAuthenticationName`) should Event Grid assume? 
- What attributes should be associated with this client session? 
- When does this authentication expire? 

## Authentication flow 

This section provides a high-level flow:  

1. Event Grid calls the webhook with a managed identity token.  
1. Event Grid passes the client cert and its chain to Webhook.
1. The webhook validates the caller, returns allow or deny, and provides attributes.

Event Grid performs two validations: 

- Validate caller (Event Grid → Webhook) 

    Your webhook must verify that the request really came from your Event Grid Namespace. Event Grid uses its managed identity to request an Entra ID JSON Web Token (JWT) targeting your Webhook API App Registration. Your webhook must validate this JWT’s issuer, audience, signature, and expiration. 

- Validate client credentials (Device → Event Grid) 

    During `MQTT CONNECT`, devices provide credentials (typically a JWT). Event Grid forwards that data to your webhook. Your webhook validates the credentials based on its custom logic.

    :::image type="content" source="./media/mqtt-client-webhook-authentication/webhook-authentication-flow.svg" alt-text="Diagram showing the webhook authentication flow." lightbox="./media/mqtt-client-webhook-authentication/webhook-authentication-flow.svg":::
 

## Next steps
- See [Publish and subscribe to MQTT message using Event Grid](mqtt-publish-and-subscribe-portal.md).
- See [Authenticate with namespaces using JSON Web Tokens](authenticate-with-namespaces-using-json-web-tokens.md).
