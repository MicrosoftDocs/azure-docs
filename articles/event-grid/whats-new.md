---
title: What's New? Azure Event Grid
description: Learn what's new with Azure Event Grid, such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
ms.topic: overview
ms.date: 07/30/2025
ms.custom:
  - build-2025
---

# What's new in Azure Event Grid?

Azure Event Grid receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about the features that are added or updated in a release.

## July 2025

The following features of Event Grid namespaces moved from public preview to general availability (GA):

- [OAuth 2.0 (JSON Web Token) authentication (Refresh: Direct upload of (Privacy-Enhanced Mail) PEM certificates)](authenticate-with-namespaces-using-json-web-tokens.md#configure-oauth-20-jwt-authentication-settings-on-your-event-grid-namespace---direct-upload)
- [Custom webhook authentication](authenticate-with-namespaces-using-webhook-authentication.md)
- Message Queuing Telemetry Transport (MQTT) compliance: [Support for assigned client identifier](mqtt-support.md#assigned-client-identifiers)
- [MQTT limit change](quotas-limits.md): Inbound MQTT publishing requests per session: 1,000 messages per second

The following features are released in preview:

- MQTT compliance: [MQTT Retain support](mqtt-retain.md)
- [HTTP Publish of MQTT messages in Event Grid](mqtt-http-publish.md)

## May 2025

The following features of Event Grid namespaces moved from public preview to GA:

- [Cross-tenant delivery in the Basic tier](cross-tenant-delivery-using-managed-identity.md):
    - Azure Event Hubs
    - Azure Service Bus (queues and topics)
    - Azure Storage queues
- MQTT compliance: [Message ordering](mqtt-support.md#message-ordering) now supported
- [MQTT limits](quotas-limits.md) change:
    - Segments per topic/topic filter: 15
    - MQTT connect rate per client session: 0 connection attempts per second per client session

The following features are released in preview:

- [Network security perimeter support for inbound and outbound communication in Event Grid topics and domains](configure-network-security-perimeter.md)
- [Managed identity support for webhook delivery](deliver-events-using-managed-identity.md#deliver-events-to-webhooks-using-managed-identity)
- [Cross-tenant delivery in the Basic tier](cross-tenant-delivery-using-managed-identity.md):
    - Webhooks
    - Namespace topics
- [Cross-tenant delivery in the Standard tier (Event Grid namespaces)](cross-tenant-delivery-using-managed-identity.md):
    - Event Hubs
    - Webhooks
    - Azure Blob Storage (dead letter storage)
- [OAuth 2.0 (JSON Web Token) authentication (Refresh: Direct upload of PEM certificates)](authenticate-with-namespaces-using-json-web-tokens.md#configure-oauth-20-jwt-authentication-settings-on-your-event-grid-namespace---direct-upload)
- [Custom webhook authentication](authenticate-with-namespaces-using-webhook-authentication.md)
- [Send MQTT events directly to Microsoft Fabric by using Event Grid](mqtt-events-fabric.md)
- MQTT compliance: [Supports assigned client identifier](mqtt-support.md#assigned-client-identifiers)
- [MQTT limit change](quotas-limits.md): Inbound MQTT publishing requests per session: 1,000 messages per second

## November 2024

The following features of Event Grid namespaces moved from public preview to GA:

- [Push delivery to webhooks](namespace-handler-webhook.md)
- [Custom domains](custom-domains-namespaces.md)

The following features are released in preview:

- [Forward events from one Event Grid namespace topic to another namespace topic](forward-events-to-another-namespace-topic.md)
- [Network security perimeter in Event Grid](configure-network-security-perimeter.md)

We also published the following new articles:

- [Transport Layer Security support](transport-layer-security.md)
- [Cross-tenant delivery in Event Grid](cross-tenant-delivery-using-managed-identity.md)
- [Send events from Event Grid Basic to Event Grid namespace topics](handler-event-grid-namespace-topic.md)

## May 2024

The following features of Event Grid namespaces moved from public preview to GA:

- [Last Will and Testament](mqtt-support.md#last-will-and-testament-messages)
- [Push delivery to Event Hubs](namespace-handler-event-hubs.md)

The following features of Event Grid namespaces are released as public preview features:

- [OAuth 2.0 (JSON Web Token) authentication](oauth-json-web-token-authentication.md)
- [Custom domain name support](custom-domains-namespaces.md)
- [Push delivery to webhooks](namespace-handler-webhook.md)

## November 2023

The following features of Event Grid namespaces moved from public preview to GA:

- [Pull-style event consumption by using HTTP](pull-delivery-overview.md)
- [MQTT v3.1.1 and v5.0 support](mqtt-overview.md)

The following features of Event Grid namespaces are released as public preview features:

- [Push-style event consumption by using HTTP](pull-delivery-overview.md)

## May 2023

The following features are released as public preview features:

- Pull-style event consumption by using HTTP
- MQTT v3.1.1 and v5.0 support

## Related content

- For an overview of Event Grid, see [Azure Event Grid overview](overview.md).
