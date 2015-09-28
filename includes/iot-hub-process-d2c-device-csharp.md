## Send interactive messages from simulated device

In this section, you'll modify the simulated device application to send interactive device-to-cloud messages to the IoT hub.

1. In Visual Studio, in the **SimulatedDevice** project, add the following method to the **Program** class.
   
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

                Thread.Sleep(10000);
            }
        }

    This method is very similar to the `SendDeviceToCloudMessagesAsync()` method that was created in the [Get started with IoT Hub], the only differences being that the `MessageId` system property, and a user property called `messageType` are now set.
    The `MessageId` property is set to a globally unique id (guid), that will be used to deduplicate message receives. The `messageType` property is used to distinguish interactive from data point messages. This information is passed in message properties, instead that in the message body, so that the event processor in the back-end does not have to deserialize the whole message just to perform routing.

> [AZURE.NOTE] It is important that the `MessageId`, used to deduplicate interactive messages, be created in the device, as intermittent network communications (or other failures) could result in multiple retrasmissions of the same message from the device. A semantic message id (e.g. a hash of the relevant message data fields) could also be used, as opposed to a guid.

2. Add the following method in the **Main** method right before the `Console.ReadLine()` line:

        SendDeviceToCloudInteractiveMessagesAsync();

> [AZURE.NOTE] For simplicity's sake, this tutorial does not implement any retry policy. In production code, it is reccommended to implement retry policies (such as exponential backoff), as suggested in the MSDN article [Transient Fault Handling].

<!-- Links -->
[Get started with IoT Hub]: iot-hub-csharp-csharp-getstarted.md
[IoT Hub Developer Guide - C2D]: iot-hub-devguide.md#c2d

<!-- Images -->
[10]: ./media/iot-hub-getstarted-cloud-csharp/create-identity-csharp1.png
[12]: ./media/iot-hub-getstarted-cloud-csharp/create-identity-csharp3.png

[20]: ./media/iot-hub-getstarted-cloud-csharp/create-storage1.png
[21]: ./media/iot-hub-getstarted-cloud-csharp/create-storage2.png
[22]: ./media/iot-hub-getstarted-cloud-csharp/create-storage3.png




