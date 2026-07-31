---
title: MQTT Shared Subscriptions in Event Grid
description: Azure Event Grid MQTT Broker shared subscriptions enable load-balanced message delivery across consumer groups. Discover how to improve scalability and throughput.
#customer intent: As an IoT solution architect, I want to understand how shared subscriptions work in Event Grid MQTT Broker so that I can design scalable message processing for my telemetry data
author: spelluru
ms.author: spelluru
ms.date: 05/07/2026
ms.topic: concept-article
---

# Shared subscriptions in Azure Event Grid MQTT Broker overview

**Shared subscriptions** in Azure Event Grid MQTT Broker are a **messaging pattern** that enables multiple clients to consume messages from a single topic subscription as a group, allowing the broker to distribute messages across clients in a load-balanced manner. Instead of each subscriber receiving every message, only one client within the shared group receives each message, improving scalability and throughput for backend processing systems.

## How shared subscriptions work

In a standard MQTT subscription, every subscribed client receives a copy of each message. With shared subscriptions, the broker treats a group of clients as a single logical subscriber and distributes messages among them.

- Each application message matching the shared filter is delivered to only one active session within the group
- Distribution is typically load-balanced in a random manner within the group
- A client session might contain both shared and nonshared subscriptions simultaneously
- Multiple groups can subscribe to the same topic independently

## Shared subscription topic format

Shared subscriptions use the following format:

`$share/{group-name}/{topic-filter}`

Components:

- `$share` → Identifies a shared subscription
- `{group-name}` → Logical consumer group
- `{topic-filter}` → Topic or wildcard subscription

Example:

`$share/order-processors/retail/orders/#`

## Key characteristics

- **Load-balanced consumption**: Messages are distributed across clients in the same group to ensure efficient processing.
- **Horizontal scalability**: Consumers can scale out independently without impacting publishers.
- **Independent consumer groups**: Multiple shared groups receive the same messages independently while balancing internally.
- **Mixed subscription support**: A client can maintain both shared and nonshared subscriptions in the same session.

## Example scenario: Retail order processing

Consider a retail order processing scenario using Event Grid MQTT Broker:

- Topic: `retail/orders`
- Shared group: `order-workers`
- Clients: Worker1, Worker2, Worker3

Flow:

1. Orders are published to `retail/orders`
1. All workers subscribe to: `$share/order-workers/retail/orders`
1. Event Grid MQTT Broker distributes:
   - Order 1 → Worker1
   - Order 2 → Worker2
   - Order 3 → Worker3

Each order is processed once, while the system scales horizontally.

:::image type="content" source="media/mqtt-shared-subscriptions/shared-subscription-retail-order-distribution-workflow.png" alt-text="Diagram of Event Grid MQTT Broker distributing three retail orders to three workers using shared subscription group order-workers.":::

## Protocol behavior and constraints

### MQTT version support

- MQTT 5 only feature
- MQTT 3.1.1 clients attempting `$share/...` will be disconnected

### Message delivery semantics

- Each message is delivered to one client per group
- Delivery follows at-least-once semantics (QoS 1)

### Message ordering

- No strict ordering guarantee across group members

### Session behavior

- Session expiry impacts message delivery:
  - If a client disconnects and session expires, messages might be reassigned
  - Persistent sessions improve reliability

## Use cases in Event Grid MQTT Broker

Shared subscriptions are ideal for:

- **High-throughput IoT telemetry processing**: Distribute telemetry or events across multiple processing services.
- **Backend worker pools / microservices**: Enable stateless services to process events without duplication.
- **Unified Namespace (UNS) consumers**: Efficiently consume high-throughput industrial data streams.

## When to use shared subscriptions

Use shared subscriptions when:

- You need parallel message processing.
- A single consumer can't handle the load.
- You want scalable and resilient architectures.
- You want to avoid building custom load balancing.

:::image type="content" source="media/mqtt-shared-subscriptions/shared-subscription-parallel-process-diagram.png" alt-text="Diagram showing shared subscription where a topic distributes messages across multiple consumers for parallel processing.":::

## Related content

- [MQTT broker overview](mqtt-overview.md)
- [MQTT features supported by the Azure Event Grid MQTT broker](mqtt-support.md)
- [Publish and subscribe to MQTT messages](mqtt-publish-and-subscribe-portal.md)