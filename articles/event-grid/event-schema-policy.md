---
title: Azure Policy as an Event Grid source
description: This article describes how to use Azure Policy as an Event Grid event source. It provides the schema and links to tutorial and how-to articles.
ms.topic: conceptual
author: timwarner-msft
ms.author: timwarner
ms.date: 07/12/2022
---

# Azure Policy as an Event Grid source

This article provides the properties and schema for [Azure Policy](../governance/policy/index.yml)
events. For an introduction to event schemas, see
[Azure Event Grid event schema](./event-schema.md). It also gives you a list of quick starts and
tutorials to use Azure Policy as an event source.

[!INCLUDE [policy-events.md](../../includes/policy/policy-events.md)]

## Event properties

# [Event Grid event schema](#tab/event-grid-event-schema)

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `topic` | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | The fully qualified ID of the resource that the compliance state change is for, including the resource name and resource type. Uses the format, `/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroup>/providers/<ProviderNamespace>/<ResourceType>/<ResourceName>` |
| `eventType` | string | One of the registered event types for this event source. |
| `eventTime` | string | The time the event is generated based on the provider's UTC time. |
| `id` | string | Unique identifier for the event. |
| `data` | object | Azure Policy event data. |
| `dataVersion` | string | The schema version of the data object. The publisher defines the schema version. |
| `metadataVersion` | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |

# [Cloud event schema](#tab/cloud-event-schema)

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `source` | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | The fully qualified ID of the resource that the compliance state change is for, including the resource name and resource type. Uses the format, `/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroup>/providers/<ProviderNamespace>/<ResourceType>/<ResourceName>` |
| `type` | string | One of the registered event types for this event source. |
| `time` | string | The time the event is generated based on the provider's UTC time. |
| `id` | string | Unique identifier for the event. |
| `data` | object | Azure Policy event data. |
| `specversion` | string | CloudEvents schema specification version. |

---

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `timestamp` | string | The time (in UTC) that the resource was scanned by Azure Policy. For ordering events, use this property instead of the top-level `eventTime` or `time` properties. |
| `policyAssignmentId` | string | The resource ID of the policy assignment. |
| `policyDefinitionId` | string | The resource ID of the policy definition. |
| `policyDefinitionReferenceId` | string | The reference ID for the policy definition inside the initiative definition, if the policy assignment is for an initiative. May be empty. |
| `complianceState` | string | The compliance state of the resource with respect to the policy assignment. |
| `subscriptionId` | string | The subscription ID of the resource. |
| `complianceReasonCode` | string | The compliance reason code. May be empty. |

## Next steps

- For a walkthrough routing Azure Policy state change events, see
  [Use Event Grid for policy state change notifications](../governance/policy/tutorials/route-state-change-events.md).
- For an overview of integrating Azure Policy with Event Grid, see
  [React to Azure Policy events by using Event Grid](../governance/policy/concepts/event-overview.md).
- For an introduction to Azure Event Grid, see [What is Event Grid?](./overview.md)
- For more information about creating an Azure Event Grid subscription, see
  [Event Grid subscription schema](./subscription-creation-schema.md).