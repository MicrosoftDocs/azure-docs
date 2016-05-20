<properties
	pageTitle="Azure IoT Hub for Java getting started | Microsoft Azure"
	description="Azure IoT Hub with Java getting started tutorial. Use Azure IoT Hub and Java with the Microsoft Azure IoT SDKs to implement an internet of things solution."
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
     ms.date="03/22/2016"
     ms.author="dobett"/>

# Get started with Azure IoT Hub for Java

[AZURE.INCLUDE [iot-hub-selector-get-started](../../includes/iot-hub-selector-get-started.md)]

## Introduction

Azure IoT Hub is a fully managed service that enables reliable and secure bi-directional communications between millions of internet of things (IoT) devices and a solution back end. One of the biggest challenges IoT projects face is how to reliably and securely connect devices to the solution back end. To address this challenge, IoT Hub:

- Offers reliable device-to-cloud and cloud-to-device hyper-scale messaging.
- Enables secure communications using per-device security credentials and access control.
- Includes device libraries for the most popular languages and platforms.

This tutorial shows you how to:

- Use the Azure portal to create an IoT hub.
- Create a device identity in your IoT hub.
- Create a simulated device that sends telemetry to your cloud back end.

At the end of this tutorial you will have three Java console applications:

* **create-device-identity**, which creates a device identity and associated security key to connect your simulated device.
* **read-d2c-messages**, which displays the telemetry sent by your simulated device.
* **simulated-device**, which connects to your IoT hub with the device identity created earlier, and sends a telemetry message every second using the AMQPS protocol.

> [AZURE.NOTE] The article [IoT Hub SDKs][lnk-hub-sdks] provides information about the various SDKs that you can use to build both applications to run on devices and your solution back end.

To complete this tutorial you'll need the following:

+ Java SE 8. <br/> [Prepare your development environment][lnk-dev-setup] describes how to install Java for this tutorial on either Windows or Linux.

+ Maven 3.  <br/> [Prepare your development environment][lnk-dev-setup] describes how to install Maven for this tutorial on either Windows or Linux.

+ An active Azure account. <br/>If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][lnk-free-trial].

[AZURE.INCLUDE [iot-hub-get-started-create-hub](../../includes/iot-hub-get-started-create-hub.md)]

As a final step, click **Settings** on the IoT Hub blade, then **Messaging** on the **Settings** blade. On the **Messaging** blade, make a note of the **Event Hub-compatible name** and the **Event Hub-compatible endpoint**. You will need these values when you create your **read-d2c-messages** application.

![][6]

You have now created your IoT hub and you have the IoT Hub hostname, IoT Hub connection string, Event Hub-compatible name, and Event-Hub compatible endpoint you need to complete the rest of this tutorial.

## Create a device identity

In this section, you'll create a Java console app that creates a new device identity in the identity registry in your IoT hub. A device cannot connect to IoT hub unless it has an entry in the device identity registry. Refer to the **Device Identity Registry** section of the [IoT Hub Developer Guide][lnk-devguide-identity] for more information. When you run this console application, it generates a unique device ID and key that your device can identify itself with when it sends device-to-cloud messages to IoT Hub.

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
      <version>1.0.2</version>
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

7. Add the following class-level variables to the **App** class, replacing **{yourhubname}** and **{yourhubkey}** with the values your noted earlier:

    ```
    private static final String connectionString = "HostName={yourhubname}.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey={yourhubkey}";
    private static final String deviceId = "javadevice";
    
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

> [AZURE.NOTE] The IoT Hub identity registry only stores device identities to enable secure access to the hub. It stores device IDs and keys to use as security credentials and an enabled/disabled flag that enables you to disable access for an individual device. If your application needs to store other device-specific metadata, it should use an application-specific store. Refer to [IoT Hub Developer Guide][lnk-devguide-identity] for more information.

## Receive device-to-cloud messages

In this section, you'll create a Java console app that reads device-to-cloud messages from IoT Hub. An IoT hub exposes an [Event Hubs][lnk-event-hubs-overview]-compatible endpoint to enable you to read device-to-cloud messages. To keep things simple, this tutorial creates a basic reader that is not suitable for a high throughput deployment. The [Process device-to-cloud messages][lnk-process-d2c-tutorial] tutorial shows you how to process device-to-cloud messages at scale. The [Get Started with Event Hubs][lnk-eventhubs-tutorial] tutorial provides further information on how to process messages from Event Hubs and is applicable to the IoT Hub Event Hub-compatible endpoints.

> [AZURE.NOTE] The Event Hubs-compatible endpoint for reading device-to-cloud messages always uses the AMQPS protocol.

1. In the iot-java-get-started folder you created in the *Create a device identity* section, create a new Maven project called **read-d2c-messages** using the following command at your command-prompt. Note that this is a single, long command:

    ```
    mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=read-d2c-messages -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
    ```

2. At your command prompt, navigate to the new read-d2c-messages folder.

3. Using a text editor, open the pom.xml file in the read-d2c-messages folder and add the following dependency to the **dependencies** node. This enables you to use the eventhubs-client package in your application to read from the Event Hubs-compatible endpoint:

    ```
    <dependency>
      <groupId>com.microsoft.eventhubs.client</groupId>
      <artifactId>eventhubs-client</artifactId>
      <version>1.0</version>
    </dependency>
    ```

4. Save and close the pom.xml file.

5. Using a text editor, open the read-d2c-messages\src\main\java\com\mycompany\app\App.java file.

6. Add the following **import** statements to the file:

    ```
    import java.io.IOException;
    import com.microsoft.eventhubs.client.Constants;
    import com.microsoft.eventhubs.client.EventHubClient;
    import com.microsoft.eventhubs.client.EventHubEnqueueTimeFilter;
    import com.microsoft.eventhubs.client.EventHubException;
    import com.microsoft.eventhubs.client.EventHubMessage;
    import com.microsoft.eventhubs.client.EventHubReceiver;
    import com.microsoft.eventhubs.client.ConnectionStringBuilder;
    ```

7. Add the following class-level variables to the **App** class:

    ```
    private static EventHubClient client;
    private static long now = System.currentTimeMillis();
    ```

8. Add the following nested class inside the **App** class. The application creates two threads to run the **MessageReceiver** to read messages from the two partitions in the Event Hub:

    ```
    private static class MessageReceiver implements Runnable
    {
        public volatile boolean stopThread = false;
        private String partitionId;
    }
    ```

9. Add the following constructor to the **MessageReceiver** class:

    ```
    public MessageReceiver(String partitionId) {
        this.partitionId = partitionId;
    }
    ```

10. Add the following **run** method to the **MessageReceiver** class. This method creates an **EventHubReceiver** instance to read from an Event Hub partition. It loops continuously and prints the message details to the console untill **stopThread** is true.

    ```
    public void run() {
      try {
        EventHubReceiver receiver = client.getConsumerGroup(null).createReceiver(partitionId, new EventHubEnqueueTimeFilter(now), Constants.DefaultAmqpCredits);
        System.out.println("** Created receiver on partition " + partitionId);
        while (!stopThread) {
          EventHubMessage message = EventHubMessage.parseAmqpMessage(receiver.receive(5000));
          if(message != null) {
            System.out.println("Received: (" + message.getOffset() + " | "
                + message.getSequence() + " | " + message.getEnqueuedTimestamp()
                + ") => " + message.getDataAsString());
          }
        }
        receiver.close();
      }
      catch(EventHubException e) {
        System.out.println("Exception: " + e.getMessage());
      }
    }
    ```

    > [AZURE.NOTE] This method uses a filter when it creates the receiver so that the receiver only reads messages sent to IoT Hub after the receiver starts running. This is useful in a test environment so you can see the current set of messages, but in a production environment your code should make sure that it processes all the messages - see the [How to process IoT Hub device-to-cloud messages][lnk-process-d2c-tutorial] tutorial for more information.

11. Modify the signature of the **main** method to include the exceptions shown below:

    ```
    public static void main( String[] args ) throws IOException
    ```

12. Add the following code to the **main** method in the **App** class. This code creates an **EventHubClient** instance to connect to the Event Hub-compatible endpoint on your IoT hub. It then creates two threads to read from the two partitions. Replace **{youriothubkey}**, **{youreventhubcompatiblenamespace}**, and **{youreventhubcompatiblename}** with the values you noted previously. The value of the **{youreventhubcompatiblenamespace}** placeholder comes from the **Event Hub-compatible endpoint** - it takes the form **xxxxnamespace** (in other words, remove the **sb://** prefix and **.servicebus.windows.net** suffix from the Event Hub-compatible endpoint value from the portal).

    ```
    String policyName = "iothubowner";
    String policyKey = "{youriothubkey}";
    String namespace = "{youreventhubcompatiblenamespace}";
    String name = "{youreventhubcompatiblename}";
    try {
      ConnectionStringBuilder csb = new ConnectionStringBuilder(policyName, policyKey, namespace);
      client = EventHubClient.create(csb.getConnectionString(), name);
    }
    catch(EventHubException e) {
        System.out.println("Exception: " + e.getMessage());
    }
    
    MessageReceiver mr0 = new MessageReceiver("0");
    MessageReceiver mr1 = new MessageReceiver("1");
    Thread t0 = new Thread(mr0);
    Thread t1 = new Thread(mr1);
    t0.start(); t1.start();

    System.out.println("Press ENTER to exit.");
    System.in.read();
    mr0.stopThread = true;
    mr1.stopThread = true;
    client.close();
    ```

    > [AZURE.NOTE] This code assumes you created your IoT hub in the F1 (free) tier. A free IoT hub has two partitions named "0" and "1". If you created your IoT hub using one of the other pricing tiers, you should adjust the code to create a **MessageReceiver** for each partition.

13. Save and close the App.java file.

14. To build the **read-d2c-messages** application using Maven, execute the following command at the command-prompt in the read-d2c-messages folder:

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
      <version>1.0.2</version>
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
    import java.io.IOException;
    import java.net.URISyntaxException;
    import java.security.InvalidKeyException;
    import java.util.Random;
    import javax.naming.SizeLimitExceededException;
    import com.google.gson.Gson;
    ```

7. Add the following class-level variables to the **App** class, replacing **{youriothubname}** with your IoT hub name, and **{yourdeviceid}** and **{yourdevicekey}** with the device values you generated in the *Create a device identity* section:

    ```
    private static String connString = "HostName={youriothubname}.azure-devices.net;DeviceId={yourdeviceid};SharedAccessKey={yourdevicekey}";
    private static IotHubClientProtocol protocol = IotHubClientProtocol.AMQPS;
    private static boolean stopThread = false;
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
        System.out.println("IoT Hub responded to message with status " + status.name());
      
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
          DeviceClient client;
          client = new DeviceClient(connString, protocol);
          client.open();
        
          while (!stopThread) {
            double currentWindSpeed = avgWindSpeed + rand.nextDouble() * 4 - 2;
            TelemetryDataPoint telemetryDataPoint = new TelemetryDataPoint();
            telemetryDataPoint.deviceId = "myFirstDevice";
            telemetryDataPoint.windSpeed = currentWindSpeed;
      
            String msgStr = telemetryDataPoint.serialize();
            Message msg = new Message(msgStr);
            System.out.println(msgStr);
        
            Object lockobj = new Object();
            EventCallback callback = new EventCallback();
            client.sendEventAsync(msg, callback, lockobj);
    
            synchronized (lockobj) {
              lockobj.wait();
            }
            Thread.sleep(1000);
          }
          client.close();
        } catch (Exception e) {
          e.printStackTrace();
        }
      }
    }
    ```

    This method sends a new device-to-cloud message one second after the IoT hub acknowledges the previous message. The message contains a JSON-serialized object with the deviceId and a randomly generated number to simulate a wind speed sensor.

11. Replace the **main** method with the following code that creates a thread to send device-to-cloud messages to your IoT hub:

    ```
    public static void main( String[] args ) throws IOException, URISyntaxException {
    
      MessageSender ms0 = new MessageSender();
      Thread t0 = new Thread(ms0);
      t0.start(); 
    
      System.out.println("Press ENTER to exit.");
      System.in.read();
      ms0.stopThread = true;
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

1. At a command-prompt in the read-d2c folder, run the following command to begin monitoring your IoT hub:

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

In this tutorial, you configured a new IoT hub in the portal and then created a device identity in the hub's identity registry. You used this device identity to enable the simulated device app to send device-to-cloud messages to the hub and created an app that displays the messages received by the hub. You can continue to explore IoT hub features and other IoT scenarios in the following tutorials:

- [Send Cloud-to-Device messages with IoT Hub][lnk-c2d-tutorial] shows how to send messages to devices, and process the delivery feedback produced by IoT Hub.
- [Process Device-to-Cloud messages][lnk-process-d2c-tutorial] shows how to reliably process telemetry and interactive messages coming from devices.
- [Uploading files from devices][lnk-upload-tutorial] describes a pattern that makes use of cloud-to-device messages to facilitate file uploads from devices.

<!-- Images. -->
[6]: ./media/iot-hub-java-java-getstarted/create-iot-hub6.png
[7]: ./media/iot-hub-java-java-getstarted/runapp1.png
[8]: ./media/iot-hub-java-java-getstarted/runapp2.png
[43]: ./media/iot-hub-csharp-csharp-getstarted/usage.png

<!-- Links -->
[lnk-transient-faults]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx

[lnk-eventhubs-tutorial]: ../event-hubs/event-hubs-csharp-ephcs-getstarted.md
[lnk-devguide-identity]: iot-hub-devguide.md#identityregistry
[lnk-event-hubs-overview]: ../event-hubs/event-hubs-overview.md

[lnk-dev-setup]: https://github.com/Azure/azure-iot-sdks/blob/master/java/device/doc/devbox_setup.md
[lnk-c2d-tutorial]: iot-hub-csharp-csharp-c2d.md
[lnk-process-d2c-tutorial]: iot-hub-csharp-csharp-process-d2c.md
[lnk-upload-tutorial]: iot-hub-csharp-csharp-file-upload.md

[lnk-hub-sdks]: iot-hub-sdks-summary.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-portal]: https://portal.azure.com/
