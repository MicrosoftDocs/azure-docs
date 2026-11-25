---
title: Topic spaces in the Azure Event Grid MQTT broker
description: Learn how topic spaces in the Azure Event Grid MQTT broker use topic templates and variables to group MQTT topics and simplify access control.
ms.topic: concept-article
ms.custom:
  - build-2023
  - ignite-2023
ms.date: 08/26/2026
author: george-guirguis
ms.author: geguirgu
ms.subservice: mqtt
ai-usage: ai-assisted

#customer intent: As a solution architect, I want to understand how topic spaces work so that I can group related MQTT topics and manage client access efficiently.
---
# Topic spaces in the Azure Event Grid MQTT broker

A *topic space* represents multiple topics through a set of topic templates. Topic templates extend MQTT topic filters with support for variables, in addition to the standard MQTT wildcards. Each topic space represents the MQTT topics that the same set of clients use to communicate.

Topic spaces simplify access control by letting you grant publish or subscribe access to a group of topics at once, instead of managing access for each individual topic. The access control model combines four resources to grant a client group access to publish or subscribe to a topic space:

- **Client**: Represents a device or application that communicates over MQTT.
- **Client group**: Groups the clients that need the same access to the same set of MQTT topics.
- **Topic space**: Groups one or more topic templates that represent the intended topics or topic filters.
- **Permission binding**: Grants a client group publish or subscribe access to a topic space.

For more information, see [Access control for MQTT clients](mqtt-access-control.md).

This article explains how MQTT topic filters, topic templates, and topic space configuration work together, so that you can group related topics and manage client access efficiently.

## MQTT topic filters

An [MQTT topic filter](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html) is an MQTT topic that can include wildcards for one or more of its segments, so that it matches multiple MQTT topics. Topic filters simplify subscription requests, because one topic filter can match multiple topics.

The MQTT broker supports all the MQTT wildcards defined by the [MQTT specification](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html):

- `+` matches a single segment. For example, the topic filter `machines/+/alert` matches these topics:
  - `machines/temp/alert`
  - `machines/humidity/alert`
- `#` matches zero or more segments at the end of the topic. For example, the topic filter `machines/#` matches these topics:
  - `machines`
  - `machines/temp`
  - `machines/humidity`
  - `machines/temp/alert`

For more information about wildcards, see [Topic wildcards in the MQTT specification](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html).

## Topic templates

Topic templates extend MQTT topic filters with support for variables, in addition to the MQTT wildcards. Topic space configuration also provides granular access control by letting you control the authorization of each client within a client group to publish or subscribe to its own topic. For more information, see [how topic templates provide granular access control](mqtt-access-control.md#granular-access-control).

## Topic space configuration

A topic space can group up to 10 topic templates. Topic templates support the MQTT wildcards (`+` and `#`) and the following variables:

- `${client.authenticationName}`: Represents the authentication name of the client. For more information, see [key terms of client metadata](mqtt-clients.md#key-terms-of-client-metadata).
- `${client.attributes.x}`: Represents an attribute assigned to a client when the client is created or updated, where `x` is the exact string of the attribute key. For example, if a client has the attribute `area:section1`, the topic template `area/${client.attributes.area}/telemetry` enables only clients with that attribute to publish on the MQTT topic `area/section1/telemetry`. For more information, see [MQTT clients](mqtt-clients.md).

> [!NOTE]
> - Topics that start with `$` are reserved for internal use.
> - A variable can represent a portion of a segment or an entire segment, but it can't cover more than one segment. For example, the topic template `machines/${client.authenticationName|.factory1}/temp` matches topics such as `machines/machine1.factory1/temp` and `machines/machine2.factory1/temp`.
> - Topic templates use the special characters `$` and `|`, which you might need to escape depending on the shell that you use. For example, in PowerShell, escape these characters as shown in the following examples:
>     - `"vehicles/${client.authenticationName|dollar}/#"`
>     - `vehicles/${client.authenticationName"|"dollar}/#`

To create a topic space in the Azure portal or with the Azure CLI, see [Publish and subscribe to MQTT messages](mqtt-publish-and-subscribe-portal.md). When you name a topic space, use these rules:

- A topic space name can be 3-50 characters long.
- A topic space name can include alphanumeric characters and hyphens (`-`), with no spaces.

:::image type="content" source="./media/mqtt-publish-and-subscribe-portal/create-topic-space.png" alt-text="Screenshot of the topic space configuration in the Azure portal.":::

The following Azure CLI example creates a topic space that has two topic templates:

```azurecli-interactive
az eventgrid namespace topic-space create -g myRG --namespace-name myNS -n myTopicSpace --topic-templates ['segment1/+/segment3/${client.authenticationName}', "segment1/${client.attributes.attribute1}/segment3/#"]
```

> [!NOTE]
> Topic space configuration updates might take a couple minutes to propagate.

## Related content

- [Publish and subscribe to MQTT messages](mqtt-publish-and-subscribe-portal.md)
- [Access control for MQTT clients](mqtt-access-control.md)
- [MQTT clients](mqtt-clients.md)
- [MQTT client authentication](mqtt-client-authentication.md)
