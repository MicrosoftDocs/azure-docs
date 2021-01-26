---
author: baanders
description: include file for the resources that are needed to create Azure Digital Twins endpoints
ms.service: digital-twins
ms.topic: include
ms.date: 1/26/2021
ms.author: baanders
---

### Prerequisite: Create endpoint resources

To link an endpoint to Azure Digital Twins, the event grid topic, event hub, or Service Bus that you're using for the endpoint needs to exist already.

Use the following chart to see what resources should be set up before creating your endpoint.

| Endpoint type | Required resources | Creation instructions |
| --- | --- | --- |
| Event Grid endpoint | event grid topic | To create the **event grid topic**, follow the steps in [the *Create a custom topic* section](../articles/event-grid/custom-event-quickstart-portal.md#create-a-custom-topic) of the Event Grid *Custom events* quickstart.
| Event Hub endpoint | Event Hubs namespace<br/><br/>event hub<br/><br/>authorization rule | To create the **namespace** and the **event hub**, follow the steps in the Event Hubs [*Create an event hub*](../articles/event-hubs/event-hubs-create.md) quickstart.<br/><br/> To create the **authorization rule**, refer to the Event Hubs [*Authorizing access to Event Hubs resources using Shared Access Signatures*](../articles/event-hubs/authorize-access-shared-access-signature.md) article.
| Service Bus endpoint | Service Bus namespace<br/><br/>Service Bus topic<br/><br/>Authorization rule | To create the **namespace** and the **topic**, follow the steps in the Service Bus [*Create topics and subscriptions*](../articles/service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal.md) quickstart. You do not need to complete the [*Create subscriptions to the topic*](../articles/service-bus-messaging/service-bus-quickstart-topics-subscriptions-portal.md#create-subscriptions-to-the-topic) section.<br/><br/> To create the **authorization rule**, refer to the Service Bus [*Authentication and authorization*](../articles/service-bus-messaging/service-bus-authentication-and-authorization.md#shared-access-signature) article. |