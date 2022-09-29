---
title: Reacting to Azure Policy state change events
description: Use Azure Event Grid to subscribe to Azure Policy events, which allow applications to react to state changes without the need for complicated code.
ms.date: 07/12/2022
ms.topic: conceptual
ms.author: timwarner
author: timwarner-msft
---
# Reacting to Azure Policy state change events

Azure Policy events enable applications to react to state changes. This integration is done without
the need for complicated code or expensive and inefficient polling services. Instead, events are
pushed through [Azure Event Grid](../../../event-grid/index.yml) to subscribers such as
[Azure Functions](../../../azure-functions/index.yml),
[Azure Logic Apps](../../../logic-apps/index.yml), or even to your own custom HTTP listener.
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

[!INCLUDE [policy-events.md](../../../../includes/policy/policy-events.md)]

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
