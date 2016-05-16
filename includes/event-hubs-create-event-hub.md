## Create an Event Hub

1. Log on to the [Azure classic portal][], and click **NEW** at the bottom of the screen.

2. Click on **App Services**, then **Service Bus**, then **Event Hub**, then **Quick Create**.

	![][1]

3. Type a name for your Event Hub, select your desired region, and then click **Create a new Event Hub**.

	![][2]

4. If you didn't explicitly select an existing namespace in a given region, the portal creates a namespace for you (usually ***event hub name*-ns**). Click that namespace (in this example, **eventhub-ns**).

	![][3]

5. At the bottom of the page, click **Connection Information**. Click the copy button (shown in the following figure) to copy the **RootManageSharedAccessKey** connection string to the clipboard. Save this connection string to use later in the tutorial.

	![][4]

Your Event Hub is now created, and you have the connection strings you need to send and receive events.

[1]: ./media/event-hubs-create-event-hub/create-event-hub1.png
[2]: ./media/event-hubs-create-event-hub/create-event-hub2.png
[3]: ./media/event-hubs-create-event-hub/create-event-hub3.png
[4]: ./media/event-hubs-create-event-hub/create-conn-str1.png