<properties
	pageTitle="Create an IoT Hub Java client | Microsoft Azure"
	description="Follow this tutorial to get build a IoT Hub Java client that uses Microsoft Azure IoT device SDK for Java* to communicate with the Azure IoT Hub."
	services="iot-hub"
	documentationCenter="java"
	authors="dominicbetts"
	manager="timlt"
	editor=""/>

<tags
     ms.service="iot-hub"
     ms.devlang="java"
     ms.topic="article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="11/26/2015"
     ms.author="dobett"/>
     
# Create an Azure IoT Hub client application using Java

This article describes how to create a client application that uses the [Microsoft Azure IoT device SDK for Java][lnk-java-sdk] to communicate with Azure IoT Hub. The tutorial shows you how to create and build the project using the [Maven][apache-maven] tool. You can follow these instructions on either a Windows or Linux machine.

You can view the [Java API docs][lnk-java-api-docs] for reference.

## Installation

See [Prepare your development environment][devbox-setup] for information about prerequisites and setting up your development environment on Windows or on Linux.

> [AZURE.NOTE] It's important that you complete the steps in [Prepare your development environment][devbox-setup] before you start this tutorial to install the prerequisites and to add the necessary JAR files to your local Maven repository.

## Create the project

1. In your command-line tool, execute the following command to create a new, empty Maven project in a suitable location on your development machine:

    ```
    mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=iot-device -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
    ```

    > [AZURE.NOTE] This is a single, long command. Make sure you copy the complete command if you want to paste it into you command-line tool.

    This command creates a project folder named *iot-device* that has the standard Maven project structure. For more information, see [Maven in 5 Minutes][maven-five-minutes] on the Apache website.

2. Open the **pom.xml** file in the iot-device folder in a text editor.

3. Add the following new **dependency** section after the existing one to include the required client libraries:

    ```
    <dependency>
      <groupId>com.microsoft.azure.iothub-java-client</groupId>
      <artifactId>iothub-java-client</artifactId>
      <version>1.0.0-preview.4</version>
    </dependency>
    ```

4. Add the following **build** section after the **dependencies** section so that the final JAR file includes the dependencies and the manifest identifies the **main** class.

    ```
    <build>
      <plugins>
        <plugin>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-shade-plugin</artifactId>
          <executions>
            <execution>
              <phase>package</phase>
              <goals>
                <goal>shade</goal>
              </goals>
            </execution>
          </executions>
          <configuration>
            <finalName>${artifactId}-${version}-with-deps</finalName>
          </configuration>
        </plugin>
        <plugin>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-jar-plugin</artifactId>
          <version>2.6</version>
          <configuration>
            <archive>
              <manifest>
                <addClasspath>true</addClasspath>
                <mainClass>com.mycompany.app.App</mainClass>
              </manifest>
            </archive>
          </configuration>
        </plugin>
      </plugins>
    </build>
    ```

5. Save the **pom.xml** file.

## Create the application

1. Open the **App.java** file in the iot-device/src/main/java/com/mycompany/app folder in a text editor.

2. Add the following **import** statements, which include the IoT device libraries, after the **package** statement:

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
    import java.util.Scanner;
    
    import javax.naming.SizeLimitExceededException;
    ```

3. Add the following **EventCallback** class as a nested class inside the **App** class. The **execute** method in the **EventCallback** class is invoked when the device receives an acknowledgment from your IoT hub in response to a device-to-cloud message.

    ```
    protected static class EventCallback
        implements IotHubEventCallback
    {
      public void execute(IotHubStatusCode status, Object context)
      {
        Integer i = (Integer) context;
        System.out.println("IoT Hub responded to message " + i.toString()
            + " with status " + status.name());
      }
    }
    ```

4. Add the following **MessageCallback** class as a nested class inside the **App** class. The **execute** method in the **MessageCallback** class enables you to send a feedback message to your IoT hub in response to a cloud-to-device message received by the device.

    ```
    protected static class MessageCallback
        implements com.microsoft.azure.iothub.MessageCallback
    {
      public IotHubMessageResult execute(Message msg,
          Object context)
      {
        System.out.println(
            "Received message with content: " + new String(msg.getBytes(), Message.DEFAULT_IOTHUB_MESSAGE_CHARSET));
    
          return IotHubMessageResult.COMPLETE;
      }
    }
    ```

5. Replace the  existing **main** method with the following code that:

  - Creates a **DeviceClient** instance.
  - Initializes the message callback for cloud-to-device messages.
  - Opens the **DeviceClient** to enable it to send device-to-cloud messages and receive cloud-to-device messages.
  - Sends ten sample messages to your IoT hub.

    Replace `<your device connection string>` with a valid device connection string. You can provision a device and retrieve its connection string using either the [DeviceExplorer][lnk-device-explorer] tool or the [IoT Hub Explorer][lnk-iothub-explorer] tool.

    ```
    public static void main( String[] args ) throws IOException, URISyntaxException
    {
      String connString = "<your device connection string>";
      IotHubClientProtocol protocol = IotHubClientProtocol.AMQPS;
    
      DeviceClient client = new DeviceClient(connString, protocol);
    
      MessageCallback messageCallback = new MessageCallback();
      client.setMessageCallback(messageCallback, null);
    
      client.open();
    
      for (int i = 0; i < 10; ++i)
      {
        String msgStr = "Event Message " + Integer.toString(i);
        try
        {
          Message msg = new Message(msgStr);
          msg.setProperty("messageCount", Integer.toString(i));
          System.out.println(msgStr);
    
          EventCallback eventCallback = new EventCallback();
          client.sendEventAsync(msg, eventCallback, i);
        }
        catch (Exception e)
        {
        }
      }
    
      System.out.println("Press any key to exit...");
      Scanner scanner = new Scanner(System.in);
      scanner.nextLine();
    
      client.close();
    }
    ```

6. To compile the code and package it into a JAR file, execute the following command at a command prompt in the **iot-device** project folder:

    ```
    mvn package
    ```

7. To run the application, execute the following command at a command prompt in the **iot-device** project folder:

    ```
    java -jar target/iot-device-1.0-SNAPSHOT-with-deps.jar
    ```

8. You can use the [DeviceExplorer][lnk-device-explorer] tool to monitor the device-to-cloud messages that your IoT hub receives and to send cloud-to-device messages to your device from your IoT hub.

## Change logging granularity

To change the logging granularity, include the following line in your `config.properties` file:

```
.level = {LOGGING_LEVEL}
```

> [AZURE.NOTE]  You can read an explanation of the different [logging levels] 
(http://docs.oracle.com/javase/7/docs/api/java/util/logging/Level.html).

Then, set the JVM property `java.util.logging.config.file={Path to your config.properties file}`.

To log AMQP frames, set the environment variable `PN_TRACE_FRM=1` in your command environment.


[lnk-java-sdk]: https://github.com/Azure/azure-iot-sdks/blob/master/java/device/readme.md
[lnk-java-api-docs]: http://azure.github.io/azure-iot-sdks/java/device/api_reference/index.html
[apache-maven]: https://maven.apache.org/index.html
[maven-five-minutes]: https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html
[devbox-setup]: https://github.com/Azure/azure-iot-sdks/blob/master/java/device/doc/devbox_setup.md
[lnk-device-explorer]: https://github.com/Azure/azure-iot-sdks/blob/master/tools/DeviceExplorer/doc/how_to_use_device_explorer.md
[lnk-iothub-explorer]: https://github.com/Azure/azure-iot-sdks/blob/master/tools/iothub-explorer/doc/provision_device.md

