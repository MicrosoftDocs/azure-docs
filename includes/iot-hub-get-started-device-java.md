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

<!-- Links -->
[lnk-transient-faults]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx
