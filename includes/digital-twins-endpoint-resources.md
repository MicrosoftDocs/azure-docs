---
author: baanders
description: include file for the resources that are needed to create Azure Digital Twins endpoints
ms.service: digital-twins
ms.topic: include
ms.date: 1/26/2021
ms.author: baanders
---

### Prerequisite: Create endpoint resources

To link an endpoint to Azure Digital Twins, the event grid topic, event hub, or Service Bus topic that you're using for the endpoint needs to exist already.

Use the following chart to see what resources should be set up before creating your endpoint.

| Endpoint type | Required resources (linked to creation instructions) |
| --- | --- |
| Event Grid endpoint | [event grid topic](../articles/event-grid/custom-event-quickstart-portal.md#create-a-custom-topic) |
| Event Hubs endpoint | [Event&nbsp;Hubs&nbsp;namespace](../articles/event-hubs/event-hubs-create.md)<br/><br/>[event hub](../articles/event-hubs/event-hubs-create.md)<br/><br/>(Optional) [authorization rule](../articles/event-hubs/authorize-access-shared-access-signature.md) for key-based authentication | 
| Service Bus endpoint | [Service Bus namespace](../articles/service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal.md)<br/><br/>[Service Bus topic](../articles/service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal.md)<br/><br/> (Optional) [authorization rule](../articles/service-bus-messaging/service-bus-authentication-and-authorization.md#shared-access-signature) for key-based authentication|
