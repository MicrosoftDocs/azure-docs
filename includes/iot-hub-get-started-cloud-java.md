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

In this section, you'll create a Java console app that reads device-to-cloud messages from IoT Hub. An IoT hub exposes an [Event Hubs][lnk-event-hubs-overview]-compatible endpoint to enable you to read device-to-cloud messages. To keep things simple, this tutorial creates a basic reader that is not suitable for a high throughput deployment. The [Process device-to-cloud messages][lnk-processd2c-tutorial] tutorial shows you how to process device-to-cloud messages at scale. The [Get Started with Event Hubs][lnk-eventhubs-tutorial] tutorial provides further information on how to process messages from Event Hubs and is applicable to the IoT Hub Event Hub-compatible endpoints.

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

    > [AZURE.NOTE] This method uses a filter when it creates the receiver so that the receiver only reads messages sent to IoT Hub after the receiver starts running. This is useful in a test environment so you can see the current set of messages, but in a production environment your code should make sure that it processes all the messages - see the [How to process IoT Hub device-to-cloud messages][lnk-processd2c-tutorial] tutorial for more information.

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



<!-- Links -->

[lnk-eventhubs-tutorial]: ../articles/event-hubs/event-hubs-csharp-ephcs-getstarted.md
[lnk-devguide-identity]: ../articles/iot-hub/iot-hub-devguide.md#identityregistry
[lnk-event-hubs-overview]: ../articles/event-hubs/event-hubs-overview.md
[lnk-processd2c-tutorial]: ../articles/iot-hub/iot-hub-csharp-csharp-process-d2c.md

