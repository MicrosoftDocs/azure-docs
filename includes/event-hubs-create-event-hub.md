## Create an Event Hub

1. Log on to the [Azure portal][], and click **New** at the top left of the screen.

2. Click **Data + Analytics**, then click **Event Hubs**.

	![][9]

3. In the **Create namespace** blade, enter a namespace name. The system immediately checks to see if the name is available.

	![](./media/event-hubs-create-event-hub/create-event-hub1.png)

4. After making sure the namespace name is available, choose the pricing tier (Basic or Standard). Also, choose an Azure subscription, resource group, and location in which to create the resource. 

2. Click **Create** to create the namespace.

6. In the Event Hubs namespace list, click the newly-created namespace.

	![][2]

7. In the namespace blade, click **Event Hubs**.

	![][3]

8. At the top of the blade, click **Add Event Hub**.

	![][4]

3. Type a name for your Event Hub, then click **Create**.

	![][5]

4. In the list of Event Hubs, click the newly created Event Hub name. 

	![][6]

5. Back in the namespace blade (not the specific Event Hub blade), click **Shared access policies**, and then click **RootManageSharedAccessKey**.

	![](./media/event-hubs-create-event-hub/create-event-hub7.png)

5. Click the copy button to copy the **RootManageSharedAccessKey** connection string to the clipboard. Save this connection string to use later in the tutorial.

	![][8]

Your Event Hub is now created, and you have the connection strings you need to send and receive events.

[2]: ./media/event-hubs-create-event-hub/create-event-hub2.png
[3]: ./media/event-hubs-create-event-hub/create-event-hub3.png
[4]: ./media/event-hubs-create-event-hub/create-event-hub4.png
[5]: ./media/event-hubs-create-event-hub/create-event-hub5.png
[6]: ./media/event-hubs-create-event-hub/create-event-hub6.png
[8]: ./media/event-hubs-create-event-hub/create-event-hub8.png
[9]: ./media/event-hubs-create-event-hub/create-event-hub9.png

[Azure portal]: https://portal.azure.com/