## Send messages to Event Hubs

In this section, you'll write a Windows console app that sends events to your Event Hub.

1. In Visual Studio, create a new Visual C# Desktop App project using the **Console  Application** project template. Name the project **Sender**.

	![][7]

2. In Solution Explorer, right-click the solution, and then click **Manage NuGet Packages for Solution**. 

3. Click the **Browse** tab, then search for `Microsoft Azure Service Bus`. Ensure that the project name (**Sender**) is specified in the **Version(s)** box. Click **Install**, and accept the terms of use. 

	![][8]

	This downloads, installs, and adds a reference to the <a href="https://www.nuget.org/packages/WindowsAzure.ServiceBus/">Azure Service Bus library NuGet package</a>.

4. Add the following `using` statements at the top of the **Program.cs** file:

	```
	using System.Threading;
	using Microsoft.ServiceBus.Messaging;
	```

5. Add the following fields to the **Program** class, substituting the placeholder values with the name of the Event Hub you created in the previous section, and the namespace-level connection string you saved previously.

	```
	static string eventHubName = "{Event Hub name}";
	static string connectionString = "{send connection string}";
	```

6. Add the following method to the **Program** class:

	```
	static void SendingRandomMessages()
	{
	    var eventHubClient = EventHubClient.CreateFromConnectionString(connectionString, eventHubName);
	    while (true)
	    {
	        try
	        {
	            var message = Guid.NewGuid().ToString();
	            Console.WriteLine("{0} > Sending message: {1}", DateTime.Now, message);
	            eventHubClient.Send(new EventData(Encoding.UTF8.GetBytes(message)));
	        }
	        catch (Exception exception)
	        {
	            Console.ForegroundColor = ConsoleColor.Red;
	            Console.WriteLine("{0} > Exception: {1}", DateTime.Now, exception.Message);
	            Console.ResetColor();
	        }

	        Thread.Sleep(200);
	    }
	}
	```

	This method continuously sends events to your Event Hub with a 200ms delay.

7. Finally, add the following lines to the **Main** method:

	```
	Console.WriteLine("Press Ctrl-C to stop the sender process");
	Console.WriteLine("Press Enter to start now");
	Console.ReadLine();
	SendingRandomMessages();
	```


<!-- Images -->
[7]: ./media/service-bus-event-hubs-getstarted/create-sender-csharp1.png
[8]: ./media/service-bus-event-hubs-getstarted/create-sender-csharp2.png