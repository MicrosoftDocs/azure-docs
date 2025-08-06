---
title: What's new? Azure Event Grid
description: Learn what is new with Azure Event Grid, such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
ms.topic: overview
ms.date: 05/01/2024
ms.custom:
  - build-2025
---

# What's new in Azure Event Grid?

Azure Event Grid receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about the features that are added or updated in a release. 

## May 2025
The following features of Event Grid Namespaces moved from public preview to general availability (GA).

- [Cross-tenant delivery in the basic tier](cross-tenant-delivery-using-managed-identity.md)
    - Event Hubs
    - Service Bus (queues and topics)
    - Storage queues
- MQTT compliance – [Message ordering](mqtt-support.md#message-ordering) is supported now. 
- [MQTT limits](quotas-limits.md) change:
    - Segments per topic/ topic filter: 15 
    - MQTT connect rate per client session:  1 connection attempt per second per client session. 

The following features are released in Preview: 

- [Network Security Perimeter (NSP) support for inbound and outbound communication in Azure Event Grid topics and domains](configure-network-security-perimeter.md) 
- [Managed identity support for webhook delivery](deliver-events-using-managed-identity.md#deliver-events-to-webhooks-using-managed-identity) 
- [Cross-tenant delivery in the basic tier](cross-tenant-delivery-using-managed-identity.md)
    - Webhooks
    - Namespace topics
- [Cross-tenant delivery in the standard tier (Event Grid namespaces)](cross-tenant-delivery-using-managed-identity.md) 
    - Event Hubs
    - Webhooks
    - Blob storage (Dead letter storage)
- [OAuth 2.0 (JSON Web Token) authentication ( Refresh- with Direct upload of (Privacy-Enhanced Mail) PEM certificates)](authenticate-with-namespaces-using-json-web-tokens.md#configure-oauth-20-jwt-authentication-settings-on-your-event-grid-namespace---direct-upload) 
- [Custom Webhook Authentication](authenticate-with-namespaces-using-webhook-authentication.md)
- [Send MQTT events directly to Microsoft Fabric using Azure Event Grid ](mqtt-events-fabric.md)
- MQTT Compliance –  [Supports assigned client identifier](mqtt-support.md#assigned-client-identifiers-preview). 
- [MQTT limit change](quotas-limits.md) – Inbound MQTT publishing requests per session: 1,000 messages per second. 

## November 2024
The following features of Event Grid Namespaces moved from public preview to general availability (GA).

- [Push delivery to Webhooks](namespace-handler-webhook.md)
- [Custom domains](custom-domains-namespaces.md)

The following features are released in Preview: 

- [Forward events from one Azure Event Grid namespace topic to another namespace topic](forward-events-to-another-namespace-topic.md)
- [Network security perimeter in Azure Event Grid](configure-network-security-perimeter.md)

We also published the following new articles:

- [Transport Layer Security support](transport-layer-security.md)
- [Cross-tenant delivery in Azure Event Grid](cross-tenant-delivery-using-managed-identity.md)
- [How to send events from Event Grid Basic to Event Grid namespace topics](handler-event-grid-namespace-topic.md)

## May 2024 

The following features of Event Grid Namespaces moved from public preview to general availability (GA):

- [Last Will and Testament (LWT)](mqtt-support.md#last-will-and-testament-lwt-messages)
- [Push delivery to Azure Event Hubs](namespace-handler-event-hubs.md)

The following features of Event Grid Namespaces are released as public preview features:

- [OAuth 2.0 (JSON Web Token) authentication](oauth-json-web-token-authentication.md)
- [Custom domain names support](custom-domains-namespaces.md)
- [Push delivery to Webhooks](namespace-handler-webhook.md)

## November 2023 

The following features of Event Grid Namespaces moved from public preview to general availability (GA):

- [Pull style event consumption using HTTP](pull-delivery-overview.md)
- [Message Queuing Telemetry Transport (MQTT) v3.1.1 and v5.0 support](mqtt-overview.md)

The following features of Event Grid Namespaces are released as public preview features:

- [Push style event consumption using HTTP](pull-delivery-overview.md)


## May 2023 

The following features are released as public preview features:

- Pull style event consumption using HTTP
- MQTT v3.1.1 and v5.0 support



## Next steps
For an overview of the Azure Event Grid service, see [Azure Event Grid overview](overview.md).
