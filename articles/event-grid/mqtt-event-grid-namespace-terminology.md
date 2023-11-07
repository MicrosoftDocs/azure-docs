---
title: 'Azure Event Grid namespace MQTT functionality terminology'
description: 'Describes the key terminology relevant for Event Grid namespace MQTT functionality.'
ms.topic: conceptual
ms.custom: build-2023
ms.date: 05/23/2023
author: veyaddan
ms.author: veyaddan
---

# Terminology
Key terms relevant for Event Grid namespace and MQTT resources are explained.

[!INCLUDE [mqtt-preview-note](./includes/mqtt-preview-note.md)]

## Namespace

An Event Grid namespace is a declarative space that provides a scope to all the nested resources or subresources such as topics, certificates, clients, client groups, topic spaces, permission bindings.  

| Resource   | Protocol supported |
| :--- | :---: |
| Namespace topics | HTTP |
| Topic Spaces | MQTT |
| Clients | MQTT |
| Client Groups | MQTT |
| CA Certificates | MQTT |
| Permission bindings | MQTT |

Using the namespace, you can organize the subresources into logical groups and manage them as a single unit in your Azure subscription.  Deleting a namespace deletes all the subresources encompassed within the namespace.

It gives you a unique FQDN.  A Namespace exposes two endpoints:

- An HTTP endpoint to support general messaging requirements using Namespace Topics.
- An MQTT endpoint for IoT messaging or solutions that use MQTT.
  
A Namespace also provides DNS-integrated network endpoints and a range of access control and network integration management features such as IP ingress filtering and private links. It's also the container of managed identities used for all contained resources that use them.

Namespace is a tracked resource with 'tags' and a 'location' properties, and once created can be found on resources.azure.com.  

The name of the namespace can be 3-50 characters long.  It can include alphanumeric, and hyphen(-), and no spaces.  The name needs to be unique per region.

## Client

Client is a device or an application that can publish and/or subscribe MQTT messages.  For more information about client configuration, see [MQTT clients](mqtt-clients.md).

## Certificate / Cert

Certificate is a form of asymmetric credential. They're a combination of a public key from an asymmetric keypair and a set of metadata describing the valid uses of the keypair. If the keypair of the issuer is the same keypair as the certificate, the certificate is said to be "self-signed". Third-party certificate issuers are sometimes called Certificate Authorities (CA).  For more information about client authentication, see [MQTT client authentication](mqtt-client-authentication.md).

## Client attributes

Client attributes represent a set of key-value pairs that provide descriptive information about the client. Client attributes are used in creating client groups and as variables in Topic Templates. For example, client type is an attribute that provides the client's type.  For more information about client configuration, see [MQTT clients](mqtt-clients.md).

## Client group

Client group is a collection of clients.  Clients can be grouped together using common client attribute(s). Client groups can be given permissions to publish and/or subscribe to a specific topic space.  For more information about client groups configuration, see [MQTT client groups](mqtt-client-groups.md).

## Topic space

Topic space is a set of topic templates. It's used to simplify access control management by enabling you to scope publish or subscribe access for a client group, to a group of topics at once instead of individual topics.  For more information about topic spaces configuration, see [MQTT topic spaces](mqtt-topic-spaces.md).

## Topic filter

An MQTT topic filter is an MQTT topic that can include wildcards for one or more of its segments, allowing it to match multiple MQTT topics. It's used to simplify subscriptions declarations as one topic filter can match multiple topics.

## Topic template

Topic templates are an extension of the topic filter that supports variables. It's used for fine-grained access control within a client group.

## Permission bindings

A Permission Binding grants access to a specific client group to either publish or subscribe on a specific topic space.  For more information about permission bindings, see [MQTT access control](mqtt-access-control.md).

## Throughput units

Throughput units (TUs) control the capacity of Azure Event Grid namespace and allow user to control capacity of their namespace resource for message ingress and egress. For more information about limits, see [Azure Event Grid quotas and limits](quotas-limits.md).

## Next steps
- Learn about [creating an Event Grid namespace](create-view-manage-namespaces.md)
- Learn about [MQTT support in Event Grid](mqtt-overview.md)
- Learn more about [MQTT clients](mqtt-clients.md)
- Learn how to [Publish and subscribe MQTT messages using Event Grid namespace](mqtt-publish-and-subscribe-portal.md)
