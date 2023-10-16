---
 title: include file
 description: include file
 services: event-grid
 author: robece
 ms.service: event-grid
 ms.topic: include
 ms.date: 10/16/2023
 ms.author: robece
 ms.custom: include file
---

## Push and pull delivery

Using HTTP, Event Grid supports push and pull event delivery. With push delivery, you define a destination in an event subscription, a webhook or an Azure service, to which Event Grid sends events. Push delivery is supported in custom topics, system topics, domain topics and partner topics. With pull delivery, subscriber applications connect to Event Grid to consume events. Pull delivery is supported in topics within a namespace.

:::image type="content" source="./media/differences-between-consumption-modes/push-pull-delivery-mechanism.png" alt-text="High-level diagram showing push delivery and pull delivery with the kind of resources involved." lightbox="media/namespace-push-delivery-overview/push-pull-delivery-mechanism.png" border="false":::

### When to use push delivery vs. pull delivery

The following are general guidelines to help you decide when to use pull or push delivery.

#### Pull delivery

- Your applications or services publish events. Event Grid doesn't yet support pull delivery when the source of the events is an [Azure service](event-schema-api-management.md?tabs=cloud-event-schema) or a [partner](partner-events-overview.md) (SaaS) system.
- You need full control as to when to receive events. For example, your application may not up all the time, not stable enough, or you process data at certain times.
- You need full control over event consumption. For example, a downstream service or layer in your consumer application has a problem that prevents you from processing events. In that case, the pull delivery API allows the consumer app to release an already read event back to the broker so that it can be delivered later.
- You want to use [private links](../private-link/private-endpoint-overview.md) when receiving events. This is possible with pull delivery.
- You don't have the ability to expose an endpoint and use push delivery, but you can connect to Event Grid to consume events.

#### Push delivery

- You need to receive events from your applications. Push delivery supports these types of event sources.
- You want to avoid constant polling to determine that a system state change has occurred. You rather use Event Grid to send events to you at the time state changes happen.
- You have an application that can't make outbound calls. For example, your organization may be concerned about data exfiltration. However, your application can receive events through a public endpoint.
