---
title: 'Azure Event Grid namespace terminology'
description: 'Describes the key terminology relevant for Event Grid namespace and MQTT functionality.'
ms.topic: conceptual
ms.date: 04/26/2023
author: veyaddan
ms.author: veyaddan
---

# Terminology
Key terms relevant for Event Grid namespace and MQTT resources are explained.

| Term | Definition |
| ------------ | ------------ |
| MQTT Broker | An MQTT broker is an intermediary entity that enables MQTT clients to communicate. Specifically, an MQTT broker receives messages published by clients, filters the messages by topic, and distributes them to subscribers.|
| Namespace | A namespace is a declarative space that provides a scope to the resources (certificates, clients, client groups, topic spaces, permission bindings, etc.) inside it. Namespaces are used to organize the resources into logical groups.|
| Client | Client is a device or an application that can publish and/or subscribe MQTT messages |
| Certificate / Cert | Certificate is a form of asymmetric credential. They're a combination of a public key from an asymmetric keypair and a set of metadata describing the valid uses of the keypair. If the keypair of the issuer is the same keypair as the certificate, the certificate is said to be "self-signed". Third-party certificate issuers are sometimes called Certificate Authorities (CA). |
| Client attributes | Client attributes represent a set of key-value pairs that provide descriptive information about the client. Client attributes are used in creating client groups and as variables in Topic Templates. For example, client type is an attribute that provides the client's type. |
| Client group | Client group is a collection of clients.  Clients can be grouped together using common client attribute(s). Client groups can be given permissions to publish and/or subscribe to a specific topic space |
| Topic space | Topic space is a set of topic templates. It's used to simplify access control management by enabling you to grant publish or subscribe access to a group of topics at once instead of individual topics. |
| Topic filter | An MQTT topic filter is an MQTT topic that can include wildcards for one or more of its segments, allowing it to match multiple MQTT topics. It's used to simplify subscriptions declarations as one topic filter can match multiple topics. |
| Topic template | Topic templates are an extension of the topic filter that supports variables. It's used for fine-grained access control within a client group. |
| Permission bindings | A Permission Binding grants access to a specific client group to either publish or subscribe on a specific topic space. |

## Next steps

- [Publish and subscribe MQTT messages using Event Grid namespace](mqtt-publish-and-subscribe-portal.md)
