---
title: Get started with Azure IoT Hub device twins (Java)
titleSuffix: Azure IoT Hub
description: How to use Azure IoT Hub device twins and the Azure IoT SDKs for Java to create and simulate devices, add tags to device twins, and execute IoT Hub queries. 
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.devlang: java
ms.topic: how-to
ms.date: 02/17/2023
ms.custom: mqtt, devx-track-java, devx-track-extended-java
---

# Get started with device twins (Java)

[!INCLUDE [iot-hub-selector-twin-get-started](../../includes/iot-hub-selector-twin-get-started.md)]

This article shows you how to:

* Use a simulated device app to report its connectivity channel as a reported property on the device twin.

* Query devices from your back-end app using filters on the tags and properties previously created.

In this article, you create two Java console apps:

* **add-tags-query**: a back-end app that adds tags and queries device twins.
* **simulated-device**: a simulated device app that connects to your IoT hub and reports its connectivity condition.

> [!NOTE]
> See [Azure IoT SDKs](iot-hub-devguide-sdks.md) for more information about the SDK tools available to build both device and back-end apps.

## Prerequisites

* An IoT hub. Create one with the [CLI](iot-hub-create-using-cli.md) or the [Azure portal](iot-hub-create-through-portal.md).

* A registered device. Register one in the [Azure portal](iot-hub-create-through-portal.md#register-a-new-device-in-the-iot-hub).

* [Java SE Development Kit 8](/java/azure/jdk/). Make sure you select **Java 8** under **Long-term support** to get to downloads for JDK 8.

* [Maven 3](https://maven.apache.org/download.cgi)

* Make sure that port 8883 is open in your firewall. The device sample in this article uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](../iot/iot-mqtt-connect-to-iot-hub.md#connecting-to-iot-hub).

## Get the IoT hub connection string

[!INCLUDE [iot-hub-howto-twin-shared-access-policy-text](../../includes/iot-hub-howto-twin-shared-access-policy-text.md)]

[!INCLUDE [iot-hub-include-find-custom-connection-string](../../includes/iot-hub-include-find-custom-connection-string.md)]

## Create a device app that updates reported properties

In this section, you create a Java console app that connects to your hub as **myDeviceId**, and then updates its device twin's reported properties to confirm that it's connected using a cellular network.

1. In the **iot-java-twin-getstarted** folder, create a Maven project named **simulated-device** using the following command at your command prompt:

   ```cmd/sh
   mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=simulated-device -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
   ```

1. At your command prompt, navigate to the **simulated-device** folder.

1. Using a text editor, open the **pom.xml** file in the **simulated-device** folder and add the following dependencies to the **dependencies** node. This dependency enables you to use the **iot-device-client** package in your app to communicate with your IoT hub.

   ```xml
   <dependency>
     <groupId>com.microsoft.azure.sdk.iot</groupId>
     <artifactId>iot-device-client</artifactId>
     <version>1.17.5</version>
   </dependency>
   ```

   > [!NOTE]
   > You can check for the latest version of **iot-device-client** using [Maven search](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22iot-device-client%22%20g%3A%22com.microsoft.azure.sdk.iot%22).

1. Add the following dependency to the **dependencies** node. This dependency configures a NOP for the Apache [SLF4J](https://www.slf4j.org/) logging facade, which is used by the device client SDK to implement logging. This configuration is optional, but, if you omit it, you may see a warning in the console when you run the app. For more information about logging in the device client SDK, see [Logging](https://github.com/Azure/azure-iot-sdk-java/blob/main/iothub/device/iot-device-samples/readme.md#logging) in the *Samples for the Azure IoT device SDK for Java* readme file.

   ```xml
   <dependency>
     <groupId>org.slf4j</groupId>
     <artifactId>slf4j-nop</artifactId>
     <version>1.7.28</version>
   </dependency>
   ```

1. Add the following **build** node after the **dependencies** node. This configuration instructs Maven to use Java 1.8 to build the app:

   ```xml
   <build>
     <plugins>
       <plugin>
         <groupId>org.apache.maven.plugins</groupId>
         <artifactId>maven-compiler-plugin</artifactId>
         <version>3.3</version>
         <configuration>
           <source>1.8</source>
           <target>1.8</target>
         </configuration>
       </plugin>
     </plugins>
   </build>
   ```

1. Save and close the **pom.xml** file.

1. Using a text editor, open the **simulated-device\src\main\java\com\mycompany\app\App.java** file.

1. Add the following **import** statements to the file:

   ```java
   import com.microsoft.azure.sdk.iot.device.*;
   import com.microsoft.azure.sdk.iot.device.DeviceTwin.*;

   import java.io.IOException;
   import java.net.URISyntaxException;
   import java.util.Scanner;
   ```

1. Add the following class-level variables to the **App** class. Replace `{yourdeviceconnectionstring}` with the device connection string you saw when you registered a device in the IoT Hub:

   ```java
   private static String connString = "{yourdeviceconnectionstring}";
   private static IotHubClientProtocol protocol = IotHubClientProtocol.MQTT;
   private static String deviceId = "myDeviceId";
   ```

   This sample app uses the **protocol** variable when it instantiates a **DeviceClient** object.

1. Add the following method to the **App** class to print information about twin updates:

   ```java
   protected static class DeviceTwinStatusCallBack implements IotHubEventCallback {
       @Override
       public void execute(IotHubStatusCode status, Object context) {
         System.out.println("IoT Hub responded to device twin operation with status " + status.name());
       }
     }
   ```

1. Replace the code in the **main** method with the following code to:

   * Create a device client to communicate with IoT Hub.

   * Create a **Device** object to store the device twin properties.

   ```java
   DeviceClient client = new DeviceClient(connString, protocol);

   // Create a Device object to store the device twin properties
   Device dataCollector = new Device() {
     // Print details when a property value changes
     @Override
     public void PropertyCall(String propertyKey, Object propertyValue, Object context) {
       System.out.println(propertyKey + " changed to " + propertyValue);
     }
   };
   ```

1. Add the following code to the **main** method to create a **connectivityType** reported property and send it to IoT Hub:

   ```java
   try {
     // Open the DeviceClient and start the device twin services.
     client.open();
     client.startDeviceTwin(new DeviceTwinStatusCallBack(), null, dataCollector, null);

     // Create a reported property and send it to your IoT hub.
     dataCollector.setReportedProp(new Property("connectivityType", "cellular"));
     client.sendReportedProperties(dataCollector.getReportedProp());
   }
   catch (Exception e) {
     System.out.println("On exception, shutting down \n" + " Cause: " + e.getCause() + " \n" + e.getMessage());
     dataCollector.clean();
     client.closeNow();
     System.out.println("Shutting down...");
   }
   ```

1. Add the following code to the end of the **main** method. Waiting for the **Enter** key allows time for IoT Hub to report the status of the device twin operations.

   ```java
   System.out.println("Press any key to exit...");

   Scanner scanner = new Scanner(System.in);
   scanner.nextLine();

   dataCollector.clean();
   client.close();
   ```

1. Modify the signature of the **main** method to include the exceptions as follows:

   ```java
   public static void main(String[] args) throws URISyntaxException, IOException
   ```

1. Save and close the **simulated-device\src\main\java\com\mycompany\app\App.java** file.

1. Build the **simulated-device** app and correct any errors. At your command prompt, navigate to the **simulated-device** folder and run the following command:

   ```cmd/sh
   mvn clean package -DskipTests
   ```

## Create a service app that updates desired properties and queries twins

In this section, you create a Java app that adds location metadata as a tag to the device twin in IoT Hub associated with **myDeviceId**. The app queries IoT hub for devices located in the US and then queries devices that report a cellular network connection.

1. On your development machine, create an empty folder named **iot-java-twin-getstarted**.

1. In the **iot-java-twin-getstarted** folder, create a Maven project named **add-tags-query** using the following command at your command prompt:

   ```cmd/sh
   mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=add-tags-query -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
   ```

1. At your command prompt, navigate to the **add-tags-query** folder.

1. Using a text editor, open the **pom.xml** file in the **add-tags-query** folder and add the following dependency to the **dependencies** node. This dependency enables you to use the **iot-service-client** package in your app to communicate with your IoT hub:

   ```xml
   <dependency>
     <groupId>com.microsoft.azure.sdk.iot</groupId>
     <artifactId>iot-service-client</artifactId>
     <version>1.17.1</version>
     <type>jar</type>
   </dependency>
   ```

   > [!NOTE]
   > You can check for the latest version of **iot-service-client** using [Maven search](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22iot-service-client%22%20g%3A%22com.microsoft.azure.sdk.iot%22).

1. Add the following **build** node after the **dependencies** node. This configuration instructs Maven to use Java 1.8 to build the app.

   ```xml
   <build>
     <plugins>
       <plugin>
         <groupId>org.apache.maven.plugins</groupId>
         <artifactId>maven-compiler-plugin</artifactId>
         <version>3.3</version>
         <configuration>
           <source>1.8</source>
           <target>1.8</target>
         </configuration>
       </plugin>
     </plugins>
   </build>
   ```

1. Save and close the **pom.xml** file.

1. Using a text editor, open the **add-tags-query\src\main\java\com\mycompany\app\App.java** file.

1. Add the following **import** statements to the file:

   ```java
   import com.microsoft.azure.sdk.iot.service.devicetwin.*;
   import com.microsoft.azure.sdk.iot.service.exceptions.IotHubException;

   import java.io.IOException;
   import java.util.HashSet;
   import java.util.Set;
   ```

1. Add the following class-level variables to the **App** class. Replace `{youriothubconnectionstring}` with the IoT hub connection string you copied in [Get the IoT hub connection string](#get-the-iot-hub-connection-string).

   ```java
   public static final String iotHubConnectionString = "{youriothubconnectionstring}";
   public static final String deviceId = "myDeviceId";

   public static final String region = "US";
   public static final String plant = "Redmond43";
   ```

1. Update the **main** method signature to include the following `throws` clause:

   ```java
   public static void main( String[] args ) throws IOException
   ```

1. Replace the code in the **main** method with the following code to create the **DeviceTwin** and **DeviceTwinDevice** objects. The **DeviceTwin** object handles the communication with your IoT hub. The **DeviceTwinDevice** object represents the device twin with its properties and tags:

   ```java
   // Get the DeviceTwin and DeviceTwinDevice objects
   DeviceTwin twinClient = DeviceTwin.createFromConnectionString(iotHubConnectionString);
   DeviceTwinDevice device = new DeviceTwinDevice(deviceId);
   ```

1. Add the following `try/catch` block to the **main** method:

   ```java
   try {
     // Code goes here
   } catch (IotHubException e) {
     System.out.println(e.getMessage());
   } catch (IOException e) {
     System.out.println(e.getMessage());
   }
   ```

1. To update the **region** and **plant** device twin tags in your device twin, add the following code in the `try` block:

   ```java
   // Get the device twin from IoT Hub
   System.out.println("Device twin before update:");
   twinClient.getTwin(device);
   System.out.println(device);

   // Update device twin tags if they are different
   // from the existing values
   String currentTags = device.tagsToString();
   if ((!currentTags.contains("region=" + region) && !currentTags.contains("plant=" + plant))) {
     // Create the tags and attach them to the DeviceTwinDevice object
     Set<Pair> tags = new HashSet<Pair>();
     tags.add(new Pair("region", region));
     tags.add(new Pair("plant", plant));
     device.setTags(tags);

     // Update the device twin in IoT Hub
     System.out.println("Updating device twin");
     twinClient.updateTwin(device);
   }

   // Retrieve the device twin with the tag values from IoT Hub
   System.out.println("Device twin after update:");
   twinClient.getTwin(device);
   System.out.println(device);
   ```

1. To query the device twins in IoT hub, add the following code to the `try` block after the code you added in the previous step. The code runs two queries. Each query returns a maximum of 100 devices.

   ```java
   // Query the device twins in IoT Hub
   System.out.println("Devices in Redmond:");

   // Construct the query
   SqlQuery sqlQuery = SqlQuery.createSqlQuery("*", SqlQuery.FromType.DEVICES, "tags.plant='Redmond43'", null);

   // Run the query, returning a maximum of 100 devices
   Query twinQuery = twinClient.queryTwin(sqlQuery.getQuery(), 100);
   while (twinClient.hasNextDeviceTwin(twinQuery)) {
     DeviceTwinDevice d = twinClient.getNextDeviceTwin(twinQuery);
     System.out.println(d.getDeviceId());
   }

   System.out.println("Devices in Redmond using a cellular network:");

   // Construct the query
   sqlQuery = SqlQuery.createSqlQuery("*", SqlQuery.FromType.DEVICES, "tags.plant='Redmond43' AND properties.reported.connectivityType = 'cellular'", null);

   // Run the query, returning a maximum of 100 devices
   twinQuery = twinClient.queryTwin(sqlQuery.getQuery(), 3);
   while (twinClient.hasNextDeviceTwin(twinQuery)) {
     DeviceTwinDevice d = twinClient.getNextDeviceTwin(twinQuery);
     System.out.println(d.getDeviceId());
   }
   ```

1. Save and close the **add-tags-query\src\main\java\com\mycompany\app\App.java** file

1. Build the **add-tags-query** app and correct any errors. At your command prompt, navigate to the **add-tags-query** folder and run the following command:

   ```cmd/sh
   mvn clean package -DskipTests
   ```

## Run the apps

You are now ready to run the console apps.

1. At a command prompt in the **add-tags-query** folder, run the following command to run the **add-tags-query** service app:

    ```cmd/sh
    mvn exec:java -Dexec.mainClass="com.mycompany.app.App"
    ```

    ![Screenshot that shows the output from the command to run the add tags query service app.](./media/device-twins-java/service-app-1.png)

    You can see the **plant** and **region** tags added to the device twin. The first query returns your device, but the second does not.

2. At a command prompt in the **simulated-device** folder, run the following command to add the **connectivityType** reported property to the device twin:

    ```cmd/sh
    mvn exec:java -Dexec.mainClass="com.mycompany.app.App"
    ```

    ![The device client adds the connectivity Type reported property](./media/device-twins-java/device-app-1.png)

3. At a command prompt in the **add-tags-query** folder, run the following command to run the **add-tags-query** service app a second time:

    ```cmd/sh
    mvn exec:java -Dexec.mainClass="com.mycompany.app.App"
    ```

    ![Java IoT Hub service app to update tag values and run device queries](./media/device-twins-java/service-app-2.png)

    Now that your device has sent the **connectivityType** property to IoT Hub, the second query returns your device.

In this article, you:

* Added device metadata as tags from a back-end app
* Reported device connectivity information in the device twin
* Queried the device twin information, using SQL-like IoT Hub query language

## Next steps

To learn how to:

* Send telemetry from devices, see [Quickstart: Send telemetry from an IoT Plug and Play device to Azure IoT Hub](../iot-develop/quickstart-send-telemetry-iot-hub.md?pivots=programming-language-java)

* Configure devices using device twin's desired properties, see [Tutorial: Configure your devices from a back-end service](tutorial-device-twins.md)

* Control devices interactively, such as turning on a fan from a user-controlled app, see [Quickstart: Control a device connected to an IoT hub](./quickstart-control-device.md?pivots=programming-language-java)
