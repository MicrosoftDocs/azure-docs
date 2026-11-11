---
title: Namespace addressing for Azure Service Bus REST APIs
description: Learn how to address Service Bus entities over HTTPS and use AtomPub descriptions for namespace discovery and entity management.
author: EldertGrootenboer
ms.author: egrootenboer
ms.service: azure-service-bus
ms.topic: concept-article
ms.date: 10/13/2026
---

# Namespace addressing for Azure Service Bus REST APIs

The Service Bus service endpoint identifies a namespace, and the URL path identifies an entity within that namespace. Use this endpoint for the [entity and messaging REST operations](/rest/api/servicebus/service-bus-runtime-rest). Use [Azure Resource Manager APIs](/rest/api/servicebus/controlplane/namespaces) to manage Azure resources such as namespaces.

## Namespace and entity addresses

In Azure public cloud, a Service Bus entity address has the following format:

```text
https://{serviceNamespace}.servicebus.windows.net/{path}
```

Replace `{serviceNamespace}` with your namespace name and `{path}` with the entity path. For example, a queue named `orders` in a namespace named `your-namespace` has the address `https://your-namespace.servicebus.windows.net/orders`. Use the endpoint suffix for your Azure cloud when connecting outside Azure public cloud.

An entity path can contain multiple segments separated by `/`, such as `test`, `test/test2`, or `test/test2/test3`. The complete path is the entity name. Multiple entities can share the same prefix. For current name-length limits, see [Service Bus quotas](service-bus-quotas.md).

Subscriptions belong to a topic, and rules belong to a subscription:

| Entity | Address |
| --- | --- |
| Topic | `https://{serviceNamespace}.servicebus.windows.net/{topic-name}` |
| Subscription | `https://{serviceNamespace}.servicebus.windows.net/{topic-name}/subscriptions/{subscription-name}` |
| Rule | `https://{serviceNamespace}.servicebus.windows.net/{topic-name}/subscriptions/{subscription-name}/rules/{rule-name}` |

Use a single name segment for a subscription or rule.

## Discovery and entity operations

The entity REST APIs use the namespace path to distinguish discovery from operations on an existing entity:

| Request | Purpose |
| --- | --- |
| `GET` on a path without an entity | Discover immediate children as an AtomPub feed. |
| `GET` on an existing entity path | Retrieve an AtomPub entry containing the entity description. |
| `PUT` on a path without an entity | Create an entity using an AtomPub entry containing its description. |
| `PUT` on an existing entity path with `If-Match: *` | Update the entity. Supply all desired property values; omitted values use service defaults. |
| `DELETE` on an existing entity path | Delete the entity. |
| `DELETE` on a path without an entity | Return success without deleting an entity. |

Discovery returns only immediate children. If a queue has the path `A/B/C`, a `GET` request to `/` returns `A`, and a `GET` request to `/A` returns `A/B`. To list entities of a particular kind in a flat view, use [Enumeration](/rest/api/servicebus/enumeration).

For request headers, authorization requirements, and response codes, see [Entities discovery](/rest/api/servicebus/entities-discovery), [Get entity](/rest/api/servicebus/get-entity), [Create or update entity](/rest/api/servicebus/update-entity), and [Delete entity](/rest/api/servicebus/delete-entity).

## Entity descriptions

Entity management requests wrap an XML entity description in an AtomPub entry. The description element identifies the entity type:

| Entity | Description element |
| --- | --- |
| Queue | `QueueDescription` |
| Topic | `TopicDescription` |
| Subscription | `SubscriptionDescription` |
| Rule | `RuleDescription` |

For example, the following entry describes a queue with a one-minute lock duration:

```xml
<?xml version="1.0" encoding="utf-8"?>
<entry xmlns="http://www.w3.org/2005/Atom">
  <content type="application/xml">
    <QueueDescription xmlns="http://schemas.microsoft.com/netservices/2010/10/servicebus/connect">
      <LockDuration>PT1M</LockDuration>
    </QueueDescription>
  </content>
</entry>
```

Omitted properties use their default values. When updating an entity, include the properties you want to preserve, as described in [Create or update entity](/rest/api/servicebus/update-entity).

> [!NOTE]
> The historical XML model corresponds to the `QueueDescription`, `TopicDescription`, `SubscriptionDescription`, and `RuleDescription` types in the retired `WindowsAzure.ServiceBus` library. For new .NET applications, use [Azure.Messaging.ServiceBus](/dotnet/api/azure.messaging.servicebus).

## Next steps

- [Service Bus REST APIs and client libraries](service-bus-rest-overview.md)
- [HTTP message headers and properties](service-bus-rest-message-properties.md)
- [Service Bus REST API reference](/rest/api/servicebus/)
