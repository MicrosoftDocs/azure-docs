## Receiving messages from the simulated device

In this section, you'll modify the simulated device application you created in [Get started with IoT Hub] to receive cloud-to-device messages from the IoT hub.

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

    The `ReceiveAsync` method asynchronously returns the received message at the time that it is received by the device. It returns *null* after a specifiable timeout period (in this case the default of 1 minute is used). When this happens, we want the code to continue waiting for new messages. This is the reason for the `if (receivedMessage == null) continue` line.

    The call to `CompleteAsync()` notifies IoT Hub that the message has been successfully processed and that it can be safely removed from the device queue. If something happened that prevented the device app from completing the processing of the message, IoT Hub will deliver it again; it is then important that message processing logic in the device app be *idempotent*, i.e. receiving multiple times the same message should produce the same result. An application can also temporarily `Abandon` a message, which will have IoT hub retain the message in the queue for future consumption; or `Reject` a message, which will permanently remove the message from the queue. Refer to [IoT Hub Developer Guide][IoT Hub Developer Guide - C2D] for more information on the cloud-to-device message lifecycle.

> [AZURE.NOTE] When using HTTP/1 instead of AMQP as a transport, the `ReceiveAsync` will return immediately. The supported pattern for cloud-to-device messages with HTTP/1 is intermittently connected devices that check for messages infrequently (i.e. less than every 25 mins). Issuing more HTTP/1 receives will result in IoT Hub throttling the requests. Refer to [IoT Hub Developer Guide][IoT Hub Developer Guide - C2D] for more information on the differences between AMQP and HTTP/1 support, and IoT Hub throttling.

2. Add the following method in the **Main** method right before the `Console.ReadLine()` line:

        ReceiveC2dAsync();

> [AZURE.NOTE] For simplicity's sake, this tutorial does not implement any retry policy. In production code, it is reccommended to implement retry policies (such as exponential backoff), as suggested in the MSDN article [Transient Fault Handling].

<!-- Links -->
[IoT Hub Developer Guide - C2D]: iot-hub-devguide.md#c2d

<!-- Images -->


