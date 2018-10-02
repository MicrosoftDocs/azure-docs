---
 title: include file
 description: include file
 services: service-bus-messaging
 author: spelluru
 ms.service: service-bus-messaging
 ms.topic: include
 ms.date: 06/29/2018
 ms.author: spelluru
 ms.custom: include file
---

Make sure that you have already created a Service Bus namespace, as shown [here][namespace-how-to].

1. Sign in to the [Azure portal][azure-portal].
2. In the left navigation pane of the portal, click **Service Bus** (if you don't see **Service Bus**, click **All services**).
3. Click the namespace in which you would like to create the queue. In this case, it is **sbnstest1**.
   
    ![Create a queue][createqueue1]
4. In the namespace window, click **Queues**, then in the **Queues** window, click **+ Queue**.
   
    ![Select Queues][createqueue2]
5. Enter the queue **Name** and leave the other values with their defaults.
   
    ![Select New][createqueue3]
6. At the bottom of the window, click **Create**.

[createqueue1]: ./media/service-bus-create-queue-portal/create-queue1.png
[createqueue2]: ./media/service-bus-create-queue-portal/create-queue2.png
[createqueue3]: ./media/service-bus-create-queue-portal/create-queue3.png

[namespace-how-to]: ../articles/service-bus-messaging/service-bus-create-namespace-portal.md
[azure-portal]: https://portal.azure.com
