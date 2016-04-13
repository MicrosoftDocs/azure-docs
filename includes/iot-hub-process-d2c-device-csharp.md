## Send interactive messages from simulated device

In this section, you'll modify the simulated device application you created in the [Get started with IoT Hub] tutorial to send interactive device-to-cloud messages to the IoT hub.

1. In Visual Studio, in the **SimulatedDevice** project, add the following method to the **Program** class.

    ```
    private static async void SendDeviceToCloudInteractiveMessagesAsync()
    {
      while (true)
      {
        var interactiveMessageString = "Alert message!";
        var interactiveMessage = new Message(Encoding.ASCII.GetBytes(interactiveMessageString));
        interactiveMessage.Properties["messageType"] = "interactive";
        interactiveMessage.MessageId = Guid.NewGuid().ToString();

        await deviceClient.SendEventAsync(interactiveMessage);
        Console.WriteLine("{0} > Sending interactive message: {1}", DateTime.Now, interactiveMessageString);

        Task.Delay(10000).Wait();
      }
    }
    ```

    This method is very similar to the **SendDeviceToCloudMessagesAsync** method in **SimulatedDevice** project. The only differences are that you now set the **MessageId** system property, and a user property called **messageType**.
    The code assigns a globally unique identifier (guid) to the **MessageId** property, that Service Bus can use to deduplicate the messages it receives. The sample uses the **messageType** property to distinguish interactive from data point messages. The application passes this information in message properties instead of in the message body, so that the event processor does not need to deserialize the message to perform message routing.

    > [AZURE.NOTE] It is important to create the **MessageId** used to deduplicate interactive messages in the device code because intermittent network communications, or other failures, could result in multiple retransmissions of the same message from that device. You can also use a semantic message id - such as a hash of the relevant message data fields - in place of a guid.

2. Add the following method in the **Main** method right before the `Console.ReadLine()` line:

    ````
    SendDeviceToCloudInteractiveMessagesAsync();
    ````

    > [AZURE.NOTE] For the sake of simplicity, this tutorial does not implement any retry policy. In production code, you should implement a retry policy such as exponential backoff, as suggested in the MSDN article [Transient Fault Handling].

<!-- Links -->
[Transient Fault Handling]: https://msdn.microsoft.com/library/hh675232.aspx
[Get started with IoT Hub]: ../articles/iot-hub/iot-hub-csharp-csharp-getstarted.md






