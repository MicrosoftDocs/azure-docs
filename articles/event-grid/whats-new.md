---
title: What's new? Azure Event Grid
description: Learn what is new with Azure Event Grid, such as the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.
ms.topic: overview
ms.custom: build-2023
ms.date: 05/23/2023
---

# What's new in Azure Event Grid?

Azure Event Grid receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about the features that are added or updated in a release. 

## May 2023 

The following features have been released as public preview features in May 2023:

- Pull.style event consumption using HTTP
- MQTT v3.1.1 and v5.0 support

[!INCLUDE [mqtt-pull-preview-note](./includes/mqtt-pull-preview-note.md)]


Here are the articles that we recommend you read through to learn about these features. 

### Pull delivery using HTTP (preview)

- [Introduction to pull delivery of events](pull-delivery-overview.md)
- [Publish and subscribe using namespace topics](publish-events-using-namespace-topics.md)
- [Create, view, and manage namespaces](create-view-manage-namespaces.md)
- [Create, view, and manage namespace topics](create-view-manage-namespace-topics.md)
- [Create, view, and manage event subscriptions](create-view-manage-event-subscriptions.md)

### MQTT messaging (preview)

- [Introduction to MQTT messaging in Azure Event Grid](mqtt-overview.md)
- Publish and subscribe to MQTT messages on Event Grid namespace - [Azure portal](mqtt-publish-and-subscribe-portal.md), [CLI](mqtt-publish-and-subscribe-cli.md)
- Tutorial: Route MQTT messages to Azure Event Hubs from Azure Event Grid - [Azure portal](mqtt-routing-to-event-hubs-portal.md), [CLI](mqtt-routing-to-event-hubs-cli.md)
- [Event Grid namespace terminology](mqtt-event-grid-namespace-terminology.md)
- [Client authentication](mqtt-client-authentication.md)
- [Access control for MQTT clients](mqtt-access-control.md)
- [MQTT clients](mqtt-clients.md)
- [MQTT client groups](mqtt-client-groups.md)
- [Topic spaces](mqtt-topic-spaces.md)
- Routing MQTT messages
    - [Routing MQTT messages](mqtt-routing.md)
    - [Event schema for MQTT routed messages](mqtt-routing-event-schema.md)
    - [Filtering of MQTT Routed Messages](mqtt-routing-filtering.md)
    - [Routing enrichments](mqtt-routing-enrichment.md)
- [MQTT Support in Azure Event Grid](mqtt-support.md)
- [MQTT clients - life cycle events](mqtt-client-life-cycle-events.md)
- [Client authentication using CA certificate chain](mqtt-certificate-chain-client-authentication.md)
- [Customer enabled disaster recovery in Azure Event Grid](custom-disaster-recovery-client-side.md)
- [How to establish multiple sessions for a single client](mqtt-establishing-multiple-sessions-per-client.md)
- [Monitoring data reference for MQTT delivery](monitor-mqtt-delivery-reference.md)

## Next steps
See [Azure Event Grid overview](overview.md).
