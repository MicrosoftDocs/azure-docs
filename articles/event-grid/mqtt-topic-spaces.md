---
title: 'Topic Spaces'
description: 'An overview of Topic Spaces and how to configure them.'
ms.topic: conceptual
ms.custom: build-2023
ms.date: 05/23/2023
author: george-guirguis
ms.author: geguirgu
---
# Topic Spaces in Azure Event Grid

A topic space represents multiple topics through a set of topic templates. Topic templates are an extension of MQTT filters that support variables, along with the MQTT wildcards. Each topic space represents the MQTT topics that the same set of clients need to use to communicate. 

[!INCLUDE [mqtt-preview-note](./includes/mqtt-preview-note.md)]

Topic spaces are used to simplify access control management by enabling you to scope publish or subscribe access for a client group, to a group of topics at once instead of managing access for each individual topic. To publish or subscribe to any MQTT topic, you need to:

1. Create a **client** resource for each client that needs to communicate over MQTT.
2. Create a **client group** that includes the clients that need access to publish or subscribe on the same MQTT topic. 
3. Create a **topic space** that includes a topic template that represents the intended topic/topic filter.
4. Create a **permission binding** to grant the client group access to publish or subscribe to the topic space.

## MQTT Topic filter:

An [MQTT topic filter](http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html) is an MQTT topic that can include wildcards for one or more of its segments, allowing it to match multiple MQTT topics. It's used to simplify subscription requests as one topic filter can match multiple topics.

Event Grid supports all the MQTT wildcards defined by the [MQTT specification](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html) as follows:

- +: which matches a single segment.
    - For example, topic filter: "machines/+/alert" matches the following topics:
        - machines/temp/alert
        - machines/humidity/alert
- #: which matches zero or more segments at the end of the topic.
    - For example, topic filter: "machines/#" matches the following topics:
        - machines
        - machines/temp
        - machines/humidity
        - machines/temp/alert etc.

For more information about wildcards, see [Topic Wildcards in the MQTT spc](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html).

## Topic templates

Topic templates are an extension of MQTT filters that support variables, along with the MQTT wildcards. Topic spaces configuration also provides granular access control by allowing you to control the authorization of each client within a client group to publish or subscribe to its own topic. [Learn more about how topic templates provide granular access control.](mqtt-access-control.md#granular-access-control)

## Topic Space Configuration:

Topic Spaces can group up to 10 topic templates. Topic templates support MQTT wildcards (+ and #) and the following variables:

- ${client.authenticationName}: this variable represents the authentication name of the client. [Learn more about client authentication names.](mqtt-clients.md#key-terms-of-client-metadata)
- \${client.attributes.x}: this variable represents an assigned attribute to a client during client creation/update, such as "x" would be equal to the exact string of the attribute key. E.g., if a client has the attribute, a topic template “area/${client.attributes.area}/telemetry”  enables only the clients with the client attribute> “area:section1” to publish on the MQTT topic “area/section1/telemetry”. [Learn more about client attributes.](mqtt-clients.md)

**Note:**

- A variable can represent a portion of a segment or an entire segment but can't cover more than one segment. For example, a topic template could include "machines/${client.authenticationName|.factory1}/temp" matches topics "machines/machine1.factory1/temp", "machines/machine2.factory1/temp", etc.
- Topic templates use special characters \$ and | and these need to be escaped differently based on the shell being used. In PowerShell, \$ can be escaped with vehicles/${dollar}telemetry/#. If you’re using PowerShell, you can escape these special characters as shown in the following examples:

    - '"vehicles/${client.authenticationName|dollar}/#"'

    - 'vehicles/${client.authenticationName"|"dollar}/#'

### Azure portal configuration:

Use the following steps to create a topic space:

- Go to your namespace in the Azure portal.
- Under Topic Spaces, select +Topic Space.
- Assign a Name to your topic space.

> [!NOTE]
> - Topic space name can be 3-50 characters long.
> - Topic space name can include alphanumeric, hyphen(-) and, no spaces.

- Add at least one topic template by selecting +Add topic template.
- Select Create.

:::image type="content" source="./media/mqtt-publish-and-subscribe-portal/create-topic-space.png" alt-text="Screenshot of topic space configuration.":::

### Azure CLI configuration:

Use the following commands to create a topic space:
```azurecli-interactive
az resource create --resource-type Microsoft.EventGrid/namespaces/topicSpaces --id /subscriptions/<Subscription ID>/resourceGroups/<Resource Group>/providers/Microsoft.EventGrid/namespaces/<Namespace Name>/topicSpaces/<Topic Space Name> --is-full-object --api-version 2023-06-01-preview --properties @./resources/TS.json
```

**TS.json:**
```json
{ 
    "properties": {
        "topicTemplates": [
            "segment1/+/segment3/${client.authenticationName}",
            "segment1/${client.attributes.attribute1}/segment3/#"
        ]

    }

}
```

> [!NOTE]
> Topic space configuration updates may take a couple of minutes to propagate.

## Next steps:

Learn more authorization and authentication:

### Quickstart:

- [Publish and subscribe to MQTT messages](mqtt-publish-and-subscribe-portal.md)

### Concepts:

- [Access control](mqtt-access-control.md)
- [Clients](mqtt-clients.md)
- [Client authentication](mqtt-client-authentication.md)
