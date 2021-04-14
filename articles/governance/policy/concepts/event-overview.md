---
title: Reacting to Azure Policy state change events
description: Use Azure Event Grid to subscribe to App Policy events, which allow applications to react to state changes without the need for complicated code.
ms.date: 03/29/2021
ms.topic: conceptual
---
# Reacting to Azure Policy state change events

Azure Policy events enable applications to react to state changes. This integration is done without
the need for complicated code or expensive and inefficient polling services. Instead, events are
pushed through [Azure Event Grid](../../../event-grid/index.yml) to subscribers such as
[Azure Functions](../../../azure-functions/index.yml),
[Azure Logic Apps](../../../logic-apps/index.yml), or even to your own custom http listener.
Critically, you only pay for what you use.

Azure Policy events are sent to the Azure Event Grid, which provides reliable delivery services to
your applications through rich retry policies and dead-letter delivery. To learn more, see
[Event Grid message delivery and retry](../../../event-grid/delivery-and-retry.md).

The common Azure Policy event scenario is tracking when the compliance state of a resource changes
during policy evaluation. Event-based architecture is an efficient way to react to these changes
instead of scanning the compliance state of resources on a fixed schedule.

> [!NOTE]
> Azure Policy state change events are sent to Event Grid after an
> [evaluation trigger](../how-to/get-compliance-data.md#evaluation-triggers) finishes resource
> evaluation.

See
[Route policy state change events to Event Grid with Azure CLI](../tutorials/route-state-change-events.md)
for a full tutorial.

:::image type="content" source="../../../event-grid/media/overview/functional-model.png" alt-text="Event Grid model of sources and handlers" lightbox="../../../event-grid/media/overview/functional-model-big.png":::

## Available Azure Policy events

Event grid uses [event subscriptions](../../../event-grid/concepts.md#event-subscriptions) to route
event messages to subscribers. Azure Policy event subscriptions can include three types of events:

| Event type | Description |
| ---------- | ----------- |
| Microsoft.PolicyInsights.PolicyStateCreated | Raised when a policy compliance state is created. |
| Microsoft.PolicyInsights.PolicyStateChanged | Raised when a policy compliance state is changed. |
| Microsoft.PolicyInsights.PolicyStateDeleted | Raised when a policy compliance state is deleted. |

## Event schema

Azure Policy events contain all the information you need to respond to changes in your data. You can
identify an Azure Policy event when the `eventType` property starts with "Microsoft.PolicyInsights".
Additional information about the usage of Event Grid event properties is documented in  
[Event Grid event schema](../../../event-grid/event-schema.md).

| Property | Type | Description |
| -------- | ---- | ----------- |
| `id` | string | Unique identifier for the event. |
| `topic` | string | Full resource path to the event source. This field isn't writeable. Event Grid provides this value. |
| `subject` | string | The fully qualified ID of the resource that the compliance state change is for, including the resource name and resource type. Uses the format, `/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroup>/providers/<ProviderNamespace>/<ResourceType>/<ResourceName>` |
| `data` | object | Azure Policy event data. |
| `data.timestamp` | string | The time (in UTC) that the resource was scanned by Azure Policy. For ordering events, use this property instead of the top-level `eventTime` or `time` properties. |
| `data.policyAssignmentId` | string | The resource ID of the policy assignment. |
| `data.policyDefinitionId` | string | The resource ID of the policy definition. |
| `data.policyDefinitionReferenceId` | string | The reference ID for the policy definition inside the initiative definition, if the policy assignment is for an initiative. May be empty. |
| `data.complianceState` | string | The compliance state of the resource with respect to the policy assignment. |
| `data.subscriptionId` | string | The subscription ID of the resource. |
| `data.complianceReasonCode` | string | The compliance reason code. May be empty. |
| `eventType` | string | One of the registered event types for this event source. |
| `eventTime` | string | The time the event is generated based on the provider's UTC time. |
| `dataVersion` | string | The schema version of the data object. The publisher defines the schema version. |
| `metadataVersion` | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |

Here's an example of a policy state change event:

```json
[{
    "id": "5829794FCB5075FCF585476619577B5A5A30E52C84842CBD4E2AD73996714C4C",
    "topic": "/subscriptions/<SubscriptionID>",
    "subject": "/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroup>/providers/<ProviderNamespace>/<ResourceType>/<ResourceName>",
    "data": {
        "timestamp": "2021-03-27T18:37:42.4496956Z",
        "policyAssignmentId": "<policy-assignment-scope>/providers/microsoft.authorization/policyassignments/<policy-assignment-name>",
        "policyDefinitionId": "<policy-definition-scope>/providers/microsoft.authorization/policydefinitions/<policy-definition-name>",
        "policyDefinitionReferenceId": "",
        "complianceState": "NonCompliant",
        "subscriptionId": "<subscription-id>",
        "complianceReasonCode": ""
    },
    "eventType": "Microsoft.PolicyInsights.PolicyStateChanged",
    "eventTime": "2021-03-27T18:37:42.5241536Z",
    "dataVersion": "1",
    "metadataVersion": "1"
}]
```

For more information, see [Azure Policy events schema](../../../event-grid/event-schema-policy.md).

## Practices for consuming events

Applications that handle Azure Policy events should follow these recommended practices:

> [!div class="checklist"]
> - Multiple subscriptions can be configured to route events to the same event handler, so don't
> assume events are from a particular source. Instead, check the topic of the message to ensure the
> policy assignment, policy definition, and resource the state change event is for.
> - Check the `eventType` and don't assume that all events you receive are the types you expect.
> - Use `data.timestamp` to determine the order of the events in Azure Policy, instead of the
> top-level `eventTime` or `time` properties.
> - Use the subject field to access the resource that had a policy state change.

## Next steps

Learn more about Event Grid and give Azure Policy state change events a try:

- [Route policy state change events to Event Grid with Azure CLI](../tutorials/route-state-change-events.md)
- [Azure Policy schema details for Event Grid](../../../event-grid/event-schema-policy.md)
- [About Event Grid](../../../event-grid/overview.md)