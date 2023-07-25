---
title: Reacting to Azure Policy state change events
description: Use Azure Event Grid to subscribe to Azure Policy events, which allow applications to react to state changes without the need for complicated code.
ms.date: 07/12/2022
ms.topic: conceptual
ms.author: davidsmatlak
author: davidsmatlak
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
[Event Grid message delivery and retry](../../../event-grid/delivery-and-retry.md). Event Grid takes 
care of the proper routing, filtering, and multicasting of the events to destinations via Event Grid Subscriptions. 

> [!NOTE]
> Azure Policy state change events are sent to Event Grid after an
> [evaluation trigger](../how-to/get-compliance-data.md#evaluation-triggers) finishes resource
> evaluation.

There are two primary entities using Event Grid: 
- Events: These can be anything a user may want to react to – includes if a policy compliance state is
   created, changed, and deleted of a resource such as a VM or a file in storage.
- Event Grid Subscriptions: These are user configured entities that direct the proper set of events
   from a publisher to a subscriber. Subscriptions can filter events based on the resource path the event
   originated from as well as the type of event.
  > Can choose scope: Azure subscription and Management group 

The common Azure Policy event scenario is tracking when the compliance state of a resource changes
during policy evaluation. Event-based architecture is an efficient way to react to these changes
instead of scanning the compliance state of resources on a fixed schedule.

Another scenario is to automatically trigger remediation tasks without manually ticking off 'create 
remediation task' on the policy portal page. Event Grid checks for compliance state and resources that are currently 
non-compliant can be remedied. Learn more about [remediation structure](../concepts/remediation-structure.md).
  > Remediation requires a managed identity and policies must be in Modify or DeployIfNotExists effect. [Learn more about
effect types](../concepts/effects.md).

The last scenario to consider is to use event grid as an audit system to enforce configurations to 
store state changes. This can be helpful to understand to check reason for non-compliancy over time.

## Event Grid Benefits
Event Grid has a few benefits for customers and services in the Azure ecosystem: 
- Automation: Event Grid provides an automated way to trigger tasks and alerts based on compliance events
- Latency: Event Grid aims to deliver policy events with sub-second latency meaning services and user
applications can react to policy compliance events in real-time.
- Durable delivery: Each message is promptly delivered by Event Grid with a 30 second default delay and 
  least once for each matching subscription. Event Grid retries transmission of an event if a subscriber's endpoint
  fails to acknowledge receipt of it or if it doesn't, according to a predetermined retry schedule and retry policy.
- Custom event producer: Event producers and consumers need not be Azure or Microsoft services. Leveraging Azure
  Policy Event Grid, a change in a resource tag can trigger an Azure Function or the creation of a new storage blob
  can trigger custom commands through service bus, or the control messaging on who responds to the state change. 
  > Any 3rd party service can onboard Policy Event Grid as a publisher of events or can consumer events be pushed to Event grid. 

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
