<properties
	pageTitle="Azure IoT Hub for Java getting started | Microsoft Azure"
	description="Azure IoT Hub with Java getting started tutorial. Use Azure IoT Hub and Java with the Microsoft Azure IoT SDKs to implement an Internet of Things solution."
	services="iot-hub"
	documentationCenter="java"
	authors="dominicbetts"
	manager="timlt"
	editor=""/>

<tags
     ms.service="iot-hub"
     ms.devlang="java"
     ms.topic="hero-article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="06/23/2016"
     ms.author="dobett"/>

# Get started with Azure IoT Hub for Java

[AZURE.INCLUDE [iot-hub-selector-get-started](../../includes/iot-hub-selector-get-started.md)]

At the end of this tutorial, you will have three Java console applications:

* **create-device-identity**, which creates a device identity and associated security key to connect your simulated device.
* **read-d2c-messages**, which displays the telemetry sent by your simulated device.
* **simulated-device**, which connects to your IoT hub with the device identity created earlier, and sends a telemetry message every second using the AMQPS protocol.

> [AZURE.NOTE] The article [IoT Hub SDKs][lnk-hub-sdks] provides information about the various SDKs that you can use to build both applications to run on devices and your solution back end.

To complete this tutorial you'll need the following:

+ Java SE 8. <br/> [Prepare your development environment][lnk-dev-setup] describes how to install Java for this tutorial on either Windows or Linux.

+ Maven 3.  <br/> [Prepare your development environment][lnk-dev-setup] describes how to install Maven for this tutorial on either Windows or Linux.

+ An active Azure account. (If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][lnk-free-trial].)

[AZURE.INCLUDE [iot-hub-get-started-create-hub](../../includes/iot-hub-get-started-create-hub.md)]

As a final step, make a note of the **Primary key** value, then click **Settings** on the IoT Hub blade, then **Messaging** on the **Settings** blade. On the **Messaging** blade, make a note of the **Event Hub-compatible name** and the **Event Hub-compatible endpoint**. You will need these three values when you create your **read-d2c-messages** application.

![][6]

You have now created your IoT hub, and you have the IoT Hub hostname, IoT Hub connection string, IoT Hub Primary Key, Event Hubs-compatible name, and Event Hubs-compatible endpoint you need to complete the rest of this tutorial.

## Create a device identity

In this section, you'll create a Java console app that creates a new device identity in the identity registry in your IoT hub. A device cannot connect to IoT hub unless it has an entry in the device identity registry. Refer to the **Device Identity Registry** section of the [IoT Hub Developer Guide][lnk-devguide-identity] for more information. When you run this console application, it generates a unique device ID and key that your device can use to identify itself when it sends device-to-cloud messages to IoT Hub.

1. Create a new empty folder called iot-java-get-started. In the iot-java-get-started folder, create a new Maven project called **create-device-identity** using the following command at your command-prompt. Note that this is a single, long command:

    ```
    mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=create-device-identity -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
    ```

2. At your command prompt, navigate to the new create-device-identity folder.

3. Using a text editor, open the pom.xml file in the create-device-identity folder and add the following dependency to the **dependencies** node. This enables you to use the iothub-service-sdk package in your application:

    ```
    <dependency>
      <groupId>com.microsoft.azure.iothub-java-client</groupId>
      <artifactId>iothub-java-service-client</artifactId>
      <version>1.0.7</version>
    </dependency>
    ```
    
4. Save and close the pom.xml file.

5. Using a text editor, open the create-device-identity\src\main\java\com\mycompany\app\App.java file.

6. Add the following **import** statements to the file:

    ```
    import com.microsoft.azure.iot.service.exceptions.IotHubException;
    import com.microsoft.azure.iot.service.sdk.Device;
    import com.microsoft.azure.iot.service.sdk.RegistryManager;

    import java.io.IOException;
    import java.net.URISyntaxException;
    ```

7. Add the following class-level variables to the **App** class, replacing **{yourhubconnectionstring}** with the value your noted earlier:

    ```
    private static final String connectionString = "{yourhubconnectionstring}";
    private static final String deviceId = "myFirstJavaDevice";
    
    ```
    
8. Modify the signature of the **main** method to include the exceptions shown below:

    ```
    public static void main( String[] args ) throws IOException, URISyntaxException, Exception
    ```
    
9. Add the following code as the body of the **main** method. This code creates a device called *javadevice* in your IoT Hub identity registry if doesn't already exist. It then displays the device id and key that you will need later:

    ```
    RegistryManager registryManager = RegistryManager.createFromConnectionString(connectionString);

    Device device = Device.createFromId(deviceId, null, null);
    try {
      device = registryManager.addDevice(device);
    } catch (IotHubException iote) {
      try {
        device = registryManager.getDevice(deviceId);
      } catch (IotHubException iotf) {
        iotf.printStackTrace();
      }
    }
    System.out.println("Device id: " + device.getDeviceId());
    System.out.println("Device key: " + device.getPrimaryKey());
    ```

10. Save and close the App.java file.

11. To build the **create-device-identity** application using Maven, execute the following command at the command-prompt in the create-device-identity folder:

    ```
    mvn clean package -DskipTests
    ```

12. To run the **create-device-identity** application using Maven, execute the following command at the command-prompt in the create-device-identity folder:

    ```
    mvn exec:java -Dexec.mainClass="com.mycompany.app.App"
    ```

13. Make a note of the **Device id** and **Device key**. You will need these later when you create an application that connects to IoT Hub as a device.

> [AZURE.NOTE] The IoT Hub identity registry only stores device identities to enable secure access to the hub. It stores device IDs and keys to use as security credentials and an enabled/disabled flag that you can use to disable access for an individual device. If your application needs to store other device-specific metadata, it should use an application-specific store. Refer to [IoT Hub Developer Guide][lnk-devguide-identity] for more information.

## Receive device-to-cloud messages

In this section, you'll create a Java console app that reads device-to-cloud messages from IoT Hub. An IoT hub exposes an [Event Hub][lnk-event-hubs-overview]-compatible endpoint to enable you to read device-to-cloud messages. To keep things simple, this tutorial creates a basic reader that is not suitable for a high throughput deployment. The [Process device-to-cloud messages][lnk-process-d2c-tutorial] tutorial shows you how to process device-to-cloud messages at scale. The [Get Started with Event Hubs][lnk-eventhubs-tutorial] tutorial provides further information on how to process messages from Event Hubs and is applicable to the IoT Hub Event Hubs-compatible endpoints.

> [AZURE.NOTE] The Event Hubs-compatible endpoint for reading device-to-cloud messages always uses the AMQPS protocol.

1. In the iot-java-get-started folder you created in the *Create a device identity* section, create a new Maven project called **read-d2c-messages** using the following command at your command-prompt. Note that this is a single, long command:

    ```
    mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=read-d2c-messages -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
    ```

2. At your command prompt, navigate to the new read-d2c-messages folder.

3. Using a text editor, open the pom.xml file in the read-d2c-messages folder and add the following dependency to the **dependencies** node. This enables you to use the eventhubs-client package in your application to read from the Event Hubs-compatible endpoint:

    ```
    <dependency> 
        <groupId>com.microsoft.azure</groupId> 
        <artifactId>azure-eventhubs</artifactId> 
        <version>0.7.1</version> 
    </dependency>
    ```

4. Save and close the pom.xml file.

5. Using a text editor, open the read-d2c-messages\src\main\java\com\mycompany\app\App.java file.

6. Add the following **import** statements to the file:

    ```
    import java.io.IOException;
    import com.microsoft.azure.eventhubs.*;
    import com.microsoft.azure.servicebus.*;
    
    import java.io.IOException;
    import java.nio.charset.Charset;
    import java.time.*;
    import java.util.Collection;
    import java.util.concurrent.ExecutionException;
    import java.util.function.*;
    import java.util.logging.*;
    ```

7. Add the following class-level variables to the **App** class. Replace **{youriothubkey}**, **{youreventhubcompatibleendpoint}**, and **{youreventhubcompatiblename}** with the values you noted previously:

    ```
    private static String connStr = "Endpoint={youreventhubcompatibleendpoint};EntityPath={youreventhubcompatiblename};SharedAccessKeyName=iothubowner;SharedAccessKey={youriothubkey}";
    ```

8. Add the following **receiveMessages** method to the **App** class. This method creates an **EventHubClient** instance to connect to the Event Hubs-compatible endpoint and then asynchronously creates a **PartitionReceiver** instance to read from an Event Hub partition. It loops continuously and prints the message details until the application terminates.

    ```
    private static EventHubClient receiveMessages(final String partitionId)
    {
      EventHubClient client = null;
      try {
        client = EventHubClient.createFromConnectionStringSync(connStr);
      }
      catch(Exception e) {
        System.out.println("Failed to create client: " + e.getMessage());
        System.exit(1);
      }
      try {
        client.createReceiver( 
          EventHubClient.DEFAULT_CONSUMER_GROUP_NAME,  
          partitionId,  
          Instant.now()).thenAccept(new Consumer<PartitionReceiver>()
        {
          public void accept(PartitionReceiver receiver)
          {
            System.out.println("** Created receiver on partition " + partitionId);
            try {
              while (true) {
                Iterable<EventData> receivedEvents = receiver.receive(100).get();
                int batchSize = 0;
                if (receivedEvents != null)
                {
                  for(EventData receivedEvent: receivedEvents)
                  {
                    System.out.println(String.format("Offset: %s, SeqNo: %s, EnqueueTime: %s", 
                      receivedEvent.getSystemProperties().getOffset(), 
                      receivedEvent.getSystemProperties().getSequenceNumber(), 
                      receivedEvent.getSystemProperties().getEnqueuedTime()));
                    System.out.println(String.format("| Device ID: %s", receivedEvent.getProperties().get("iothub-connection-device-id")));
                    System.out.println(String.format("| Message Payload: %s", new String(receivedEvent.getBody(),
                      Charset.defaultCharset())));
                    batchSize++;
                  }
                }
                System.out.println(String.format("Partition: %s, ReceivedBatch Size: %s", partitionId,batchSize));
              }
            }
            catch (Exception e)
            {
              System.out.println("Failed to receive messages: " + e.getMessage());
            }
          }
        });
      }
      catch (Exception e)
      {
        System.out.println("Failed to create receiver: " + e.getMessage());
      }
      return client;
    }
    ```

    > [AZURE.NOTE] This method uses a filter when it creates the receiver so that the receiver only reads messages sent to IoT Hub after the receiver starts running. This is useful in a test environment so you can see the current set of messages, but in a production environment your code should make sure that it processes all the messages - see the [How to process IoT Hub device-to-cloud messages][lnk-process-d2c-tutorial] tutorial for more information.

9. Modify the signature of the **main** method to include the exception shown below:

    ```
    public static void main( String[] args ) throws IOException
    ```

10. Add the following code to the **main** method in the **App** class. This code creates the two **EventHubClient** and **PartitionReceiver** instances and enables you to close the application when you have finished processing messages:

    ```
    EventHubClient client0 = receiveMessages("0");
    EventHubClient client1 = receiveMessages("1");
    System.out.println("Press ENTER to exit.");
    System.in.read();
    try
    {
      client0.closeSync();
      client1.closeSync();
      System.exit(0);
    }
    catch (ServiceBusException sbe)
    {
      System.exit(1);
    }
    ```

    > [AZURE.NOTE] This code assumes you created your IoT hub in the F1 (free) tier. A free IoT hub has two partitions named "0" and "1".

11. Save and close the App.java file.

12. To build the **read-d2c-messages** application using Maven, execute the following command at the command-prompt in the read-d2c-messages folder:

    ```
    mvn clean package -DskipTests
    ```

## Create a simulated device app

In this section, you'll create a Java console app that simulates a device that sends device-to-cloud messages to an IoT hub.

1. In the iot-java-get-started folder you created in the *Create a device identity* section, create a new Maven project called **simulated-device** using the following command at your command-prompt. Note that this is a single, long command:

    ```
    mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=simulated-device -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
    ```

2. At your command prompt, navigate to the new simulated-device folder.

3. Using a text editor, open the pom.xml file in the simulated-device folder and add the following dependencies to the **dependencies** node. This enables you to use the iothub-java-client package in your application to communicate with your IoT hub and to serialize Java objects to JSON:

    ```
    <dependency>
      <groupId>com.microsoft.azure.iothub-java-client</groupId>
      <artifactId>iothub-java-device-client</artifactId>
      <version>1.0.8</version>
    </dependency>
    <dependency>
      <groupId>com.google.code.gson</groupId>
      <artifactId>gson</artifactId>
      <version>2.3.1</version>
    </dependency>
    ```

4. Save and close the pom.xml file.

5. Using a text editor, open the simulated-device\src\main\java\com\mycompany\app\App.java file.

6. Add the following **import** statements to the file:

    ```
    import com.microsoft.azure.iothub.DeviceClient;
    import com.microsoft.azure.iothub.IotHubClientProtocol;
    import com.microsoft.azure.iothub.Message;
    import com.microsoft.azure.iothub.IotHubStatusCode;
    import com.microsoft.azure.iothub.IotHubEventCallback;
    import com.microsoft.azure.iothub.IotHubMessageResult;
    import com.google.gson.Gson;
    import java.io.IOException;
    import java.net.URISyntaxException;
    import java.util.Random;
    import java.util.concurrent.Executors;
    import java.util.concurrent.ExecutorService;
    ```

7. Add the following class-level variables to the **App** class, replacing **{youriothubname}** with your IoT hub name, and **{yourdevicekey}** with the device key value you generated in the *Create a device identity* section:

    ```
    private static String connString = "HostName={youriothubname}.azure-devices.net;DeviceId=myFirstJavaDevice;SharedAccessKey={yourdevicekey}";
    private static IotHubClientProtocol protocol = IotHubClientProtocol.AMQPS;
    private static String deviceId = "myFirstJavaDevice";
    private static DeviceClient client;
    ```

    This sample application uses the **protocol** variable when it instantiates a **DeviceClient** object. You can use either the HTTPS or AMQPS protocol to communicate with IoT Hub.

8. Add the following nested **TelemetryDataPoint** class inside the **App** class to specify the telemetry data your device sends to your IoT hub:

    ```
    private static class TelemetryDataPoint {
      public String deviceId;
      public double windSpeed;
        
      public String serialize() {
        Gson gson = new Gson();
        return gson.toJson(this);
      }
    }
    ```

9. Add the following nested **EventCallback** class inside the **App** class to display the acknowledgement status that the IoT hub returns when it processes a message from the simulated device. This method also notifies the main thread in the application when the message has been processed:

    ```
    private static class EventCallback implements IotHubEventCallback
    {
      public void execute(IotHubStatusCode status, Object context) {
        System.out.println("IoT Hub responded to message with status: " + status.name());
      
        if (context != null) {
          synchronized (context) {
            context.notify();
          }
        }
      }
    }
    ```

10. Add the following nested **MessageSender** class inside the **App** class. The **run** method in this class generates sample telemetry data to send to your IoT hub and waits for an acknowledgement before sending the next message:

    ```
    private static class MessageSender implements Runnable {
      public volatile boolean stopThread = false;
      
      public void run()  {
        try {
          double avgWindSpeed = 10; // m/s
          Random rand = new Random();
          
          while (!stopThread) {
            double currentWindSpeed = avgWindSpeed + rand.nextDouble() * 4 - 2;
            TelemetryDataPoint telemetryDataPoint = new TelemetryDataPoint();
            telemetryDataPoint.deviceId = deviceId;
            telemetryDataPoint.windSpeed = currentWindSpeed;
            
            String msgStr = telemetryDataPoint.serialize();
            Message msg = new Message(msgStr);
            System.out.println("Sending: " + msgStr);
            
            Object lockobj = new Object();
            EventCallback callback = new EventCallback();
            client.sendEventAsync(msg, callback, lockobj);
            
            synchronized (lockobj) {
              lockobj.wait();
            }
            Thread.sleep(1000);
          }
        } catch (InterruptedException e) {
          System.out.println("Finished.");
        }
      }
    }
    ```

    This method sends a new device-to-cloud message one second after the IoT hub acknowledges the previous message. The message contains a JSON-serialized object with the deviceId and a randomly generated number to simulate a wind speed sensor.

11. Replace the **main** method with the following code that creates a thread to send device-to-cloud messages to your IoT hub:

    ```
    public static void main( String[] args ) throws IOException, URISyntaxException {
      client = new DeviceClient(connString, protocol);
      client.open();

      MessageSender sender = new MessageSender();

      ExecutorService executor = Executors.newFixedThreadPool(1);
      executor.execute(sender);

      System.out.println("Press ENTER to exit.");
      System.in.read();
      executor.shutdownNow();
      client.close();
    }
    ```

12. Save and close the App.java file.

13. To build the **simulated-device** application using Maven, execute the following command at the command-prompt in the simulated-device folder:

    ```
    mvn clean package -DskipTests
    ```

> [AZURE.NOTE] To keep things simple, this tutorial does not implement any retry policy. In production code, you should implement retry policies (such as an exponential backoff), as suggested in the MSDN article [Transient Fault Handling][lnk-transient-faults].

## Run the applications

You are now ready to run the applications.

1. At a command-prompt in the read-d2c folder, run the following command to begin monitoring the first partition in your IoT hub:

    ```
    mvn exec:java -Dexec.mainClass="com.mycompany.app.App"
    ```

    ![][7]

2. At a command-prompt in the simulated-device folder, run the following command to begin sending telemetry data to your IoT hub:

    ```
    mvn exec:java -Dexec.mainClass="com.mycompany.app.App" 
    ```

    ![][8]

3. The **Usage** tile in the [Azure portal][lnk-portal] shows the number of messages sent to the hub:

    ![][43]

## Next steps

In this tutorial, you configured a new IoT hub in the portal, and then created a device identity in the hub's identity registry. You used this device identity to enable the simulated device app to send device-to-cloud messages to the hub. You also created an app that displays the messages received by the hub. 

To continue getting started with IoT Hub and to explore other IoT scenarios see:

- [Connecting your device][lnk-connect-device]
- [Getting started with device management][lnk-device-management]
- [Getting started with the Gateway SDK][lnk-gateway-SDK]

To learn how to extend your your IoT solution and process device-to-cloud messages at scale, see the [Process device-to-cloud messages][lnk-process-d2c-tutorial] tutorial.

<!-- Images. -->
[6]: ./media/iot-hub-java-java-getstarted/create-iot-hub6.png
[7]: ./media/iot-hub-java-java-getstarted/runapp1.png
[8]: ./media/iot-hub-java-java-getstarted/runapp2.png
[43]: ./media/iot-hub-java-java-getstarted/usage.png

<!-- Links -->
[lnk-transient-faults]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx

[lnk-eventhubs-tutorial]: ../event-hubs/event-hubs-csharp-ephcs-getstarted.md
[lnk-devguide-identity]: iot-hub-devguide.md#identityregistry
[lnk-event-hubs-overview]: ../event-hubs/event-hubs-overview.md

[lnk-dev-setup]: https://github.com/Azure/azure-iot-sdks/blob/master/doc/get_started/java-devbox-setup.md
[lnk-process-d2c-tutorial]: iot-hub-csharp-csharp-process-d2c.md

[lnk-hub-sdks]: iot-hub-sdks-summary.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-portal]: https://portal.azure.com/

[lnk-device-management]: iot-hub-device-management-get-started.md
[lnk-gateway-SDK]: iot-hub-linux-gateway-sdk-get-started.md
[lnk-connect-device]: https://azure.microsoft.com/develop/iot/