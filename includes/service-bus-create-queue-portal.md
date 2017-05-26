Please ensure that you have already created a Service Bus namespace, as shown [here][namespace-how-to].

1. Log on to the [Azure portal][azure-portal].
2. In the left navigation pane of the portal, click **Service Bus** (if you don't see **Service Bus**, click **More services**).
3. Select the namespace that you would like to create the queue in. In this case, it is **nstest1**.
   
    ![Create a queue][createqueue1]
4. In the **Service Bus namespace** blade, select **Queues**, then click **Add queue**.
   
    ![Select Queues][createqueue2]
5. Enter the **Queue Name** and leave the other values with their defaults.
   
    ![Select New][createqueue3]
6. At the bottom of the blade, click **Create**.

[createqueue1]: ./media/service-bus-create-queue-portal/create-queue1.png
[createqueue2]: ./media/service-bus-create-queue-portal/create-queue2.png
[createqueue3]: ./media/service-bus-create-queue-portal/create-queue3.png

[namespace-how-to]: ../articles/service-bus-messaging/service-bus-create-namespace-portal.md
[azure-portal]: https://portal.azure.com
