---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.topic: include
ms.date: 11/06/2023
---

<!-- 
For clarity of structure, a separate markdown file is used to describe how to validate the app.

[!INCLUDE [validate-event-driven-app](includes/quickstart-deploy-event-driven-app/validate-event-driven-app.md)]

-->

1. Send a message to the `lower-case` queue with Service Bus Explorer. For more information, see the [Send a message to a queue or topic](../../../service-bus-messaging/explorer.md#send-a-message-to-a-queue-or-topic) section of [Use Service Bus Explorer to run data operations on Service Bus](../../../service-bus-messaging/explorer.md).

1. Confirm that there's a new message sent to the `upper-case` queue. For more information, see the [Peek a message](../../../service-bus-messaging/explorer.md#peek-a-message) section of [Use Service Bus Explorer to run data operations on Service Bus](../../../service-bus-messaging/explorer.md).
