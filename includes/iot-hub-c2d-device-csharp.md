## Receiving messages on the simulated device

In this section, you'll modify the simulated device application you created in [Get started with IoT Hub](https://azure.microsoft.com/documentation/articles/iot-hub-csharp-csharp-getstarted/) to receive cloud-to-device messages from the IoT hub.

1. In Visual Studio, in the **SimulatedDevice** project, add the following method to the **Program** class.

        private static async void ReceiveC2dAsync()
        {
            Console.WriteLine("\nReceiving cloud to device messages from service");
            while (true)
            {
                Message receivedMessage = await deviceClient.ReceiveAsync();
                if (receivedMessage == null) continue;

                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine("Received message: {0}", Encoding.ASCII.GetString(receivedMessage.GetBytes()));
                Console.ResetColor();

                await deviceClient.CompleteAsync(receivedMessage);
            }
        }

    The `ReceiveAsync` method asynchronously returns the received message at the time that it is received by the device. It returns *null* after a specifiable timeout period (in this case, the default of one minute is used). When this happens, the code should continue waiting for new messages. This is the reason for the `if (receivedMessage == null) continue` line.

    The call to `CompleteAsync()` notifies IoT Hub that the message has been successfully processed. The message can be safely removed from the device queue. If something happened that prevented the device app from completing the processing of the message, IoT Hub delivers it again. It is then important that message processing logic in the device app be *idempotent*, so that receiving the same message multiple times produces the same result. An application can also temporarily abandon a message, which results in IoT hub retaining the message in the queue for future consumption. Or, the application can reject a message, which permanently removes the message from the queue. For more information about the cloud-to-device message lifecycle, see the [IoT Hub Developer Guide][IoT Hub Developer Guide - C2D].

> [AZURE.NOTE] When using HTTP/1 instead of AMQP as a transport, the `ReceiveAsync` method returns immediately. The supported pattern for cloud-to-device messages with HTTP/1 is intermittently connected devices that check for messages infrequently (less than every 25 minutes). Issuing more HTTP/1 receives results in IoT Hub throttling the requests. For more information about the differences between AMQP and HTTP/1 support, and IoT Hub throttling, see the [IoT Hub Developer Guide][IoT Hub Developer Guide - C2D].

2. Add the following method in the **Main** method, right before the `Console.ReadLine()` line:

        ReceiveC2dAsync();

> [AZURE.NOTE] For simplicity's sake, this tutorial does not implement any retry policy. In production code, you should implement retry policies (such as exponential backoff), as suggested in the MSDN article [Transient Fault Handling].

<!-- Links -->
[IoT Hub Developer Guide - C2D]: ../articles/iot-hub/iot-hub-devguide.md#c2d

<!-- Images -->
