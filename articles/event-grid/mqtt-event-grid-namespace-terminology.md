---
title: 'Azure Event Grid namespace MQTT terminology'
description: Learn the key terminology for Azure Event Grid namespace MQTT functionality so that you can correctly configure clients, access control, and topics.
ms.topic: glossary
ms.custom:
  - build-2023
  - ignite-2023
ms.date: 08/27/2026
author: george-guirguis
ms.author: geguirgu
ms.subservice: mqtt
ai-usage: ai-assisted

#customer intent: As an MQTT solution developer, I want to understand the key terms used with Event Grid namespaces so that I can correctly configure clients, access control, and topics.
---

# Azure Event Grid namespace MQTT terminology

This article defines key terms relevant to Event Grid namespaces and MQTT resources.

[!INCLUDE [common-namespace-concepts](./includes/common-namespace-concepts.md)]

## Certificate / cert

A certificate is a form of asymmetric credential. It's a combination of a public key from an asymmetric keypair and a set of metadata that describes the valid uses of the keypair. If the keypair of the issuer is the same keypair as the certificate, the certificate is *self-signed*. Third-party certificate issuers are sometimes called certificate authorities (CA). For more information about client authentication, see [MQTT client authentication](mqtt-client-authentication.md).

## Client

A client is a device or an application that can publish or subscribe to MQTT messages. For more information about client configuration, see [MQTT clients](mqtt-clients.md).

## Client attributes

Client attributes are a set of key-value pairs that provide descriptive information about the client. You use client attributes to create client groups and as variables in topic templates. For example, client type is an attribute that provides the client's type. For more information about client configuration, see [MQTT clients](mqtt-clients.md).

## Client group

A client group is a collection of clients. You can group clients together by using common client attributes. You can give client groups permissions to publish or subscribe to a specific topic space. For more information about client group configuration, see [MQTT client groups](mqtt-client-groups.md).

## Permission bindings

A permission binding grants access to a specific client group to either publish or subscribe on a specific topic space. For more information about permission bindings, see [MQTT access control](mqtt-access-control.md).

## Topic filter

An MQTT topic filter is an MQTT topic that can include wildcards for one or more of its segments, allowing it to match multiple MQTT topics. It simplifies subscription declarations because one topic filter can match multiple topics.

## Topic space

A topic space is a set of topic templates. It simplifies access control management by enabling you to scope publish or subscribe access for a client group to a group of topics at once instead of individual topics. For more information about topic space configuration, see [MQTT topic spaces](mqtt-topic-spaces.md).

## Topic template

Topic templates, an extension of the topic filter, support variables. You use them for fine-grained access control within a client group.

## Next steps

- Learn about [creating an Event Grid namespace](create-view-manage-namespaces.md).
- Learn about [MQTT broker feature in Azure Event Grid](mqtt-overview.md).
- Learn more about [MQTT clients](mqtt-clients.md).
- Learn how to [Publish and subscribe MQTT messages by using Event Grid namespace](mqtt-publish-and-subscribe-portal.md).
