---
title: Use Azure IoT Hub direct methods (.NET/Node) | Microsoft Docs
description: How to use Azure IoT Hub direct methods. You use the Azure IoT device SDK for Node.js to implement a simulated device app that includes a direct method and the Azure IoT service SDK for .NET to implement a service app that invokes the direct method.
services: iot-hub
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: ab035b8e-bff8-4e12-9536-f31d6b6fe425
ms.service: iot-hub
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/12/2017
ms.author: dobett

---
# Use direct methods (Java)

[!INCLUDE [iot-hub-selector-c2d-methods](../../includes/iot-hub-selector-c2d-methods.md)]

In this tutorial, you create two Java console apps:

* **invoke-direct-method**, a Java back-end app that calls a method in the simulated device app and displays the response.
* **simulated-device**, a Java app that simulates a device connecting to your IoT hub with the device identity you create, and that responds to the direct invoked from the back end.

> [!NOTE]
> The article [Azure IoT SDKs][lnk-hub-sdks] provides information about the Azure IoT SDKs that you can use to build both applications to run on devices and your solution back end.

To complete this tutorial, you need:

* Java SE 8. <br/> [Prepare your development environment][lnk-dev-setup] describes how to install Java for this tutorial on either Windows or Linux.
* Maven 3.  <br/> [Prepare your development environment][lnk-dev-setup] describes how to install [Maven][lnk-maven] for this tutorial on either Windows or Linux.
* [Node.js version 0.10.0 or later](http://nodejs.org).

[!INCLUDE [iot-hub-get-started-create-hub](../../includes/iot-hub-get-started-create-hub.md)]

[!INCLUDE [iot-hub-get-started-create-device-identity](../../includes/iot-hub-get-started-create-device-identity.md)]

## Create a simulated device app

In this section, you create a Java console app that responds to a method called by the solution back end.

1. Create an empty folder called iot-java-direct-method. In the iot-java-direct-method folder, create a Maven project called **simulated-device** using the following command at your command prompt. Note this is a single, long command:

1. In the iot-java-direct-method folder, create a Maven project called **simulated-device** using the following command at your command prompt. Note this is a single, long command:

    `mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=simulated-device -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false`

1. At your command prompt, navigate to the simulated-device folder.

1. Using a text editor, open the pom.xml file in the simulated-device folder and add the following dependencies to the **dependencies** node. This dependency enables you to use the iot-device-client package in your app to communicate with your IoT hub:

    ```xml
    <dependency>
      <groupId>com.microsoft.azure.sdk.iot</groupId>
      <artifactId>iot-device-client</artifactId>
      <version>1.3.30</version>
    </dependency>
    ```

    > [!NOTE]
    > You can check for the latest version of **iot-device-client** using [Maven search][lnk-maven-device-search].

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

1. Save and close the pom.xml file.

1. Using a text editor, open the simulated-device\src\main\java\com\mycompany\app\App.java file.

1. Add the following **import** statements to the file:

    ```java
    import com.microsoft.azure.sdk.iot.device.*;
    import com.microsoft.azure.sdk.iot.device.DeviceTwin.*;

    import java.io.IOException;
    import java.net.URISyntaxException;
    import java.util.Scanner;
    ```

1. Add the following class-level variables to the **App** class. Replacing **{youriothubname}** with your IoT hub name, and **{yourdevicekey}** with the device key value you generated in the *Create a device identity* section:

    ```java
    private static String connString = "HostName={youriothubname}.azure-devices.net;DeviceId=myDeviceID;SharedAccessKey={yourdevicekey}";
    private static IotHubClientProtocol protocol = IotHubClientProtocol.MQTT;
    private static String deviceId = "myDeviceId";
    private static final int METHOD_SUCCESS = 200;
    private static final int METHOD_NOT_DEFINED = 404;
    ```

    This sample app uses the **protocol** variable when it instantiates a **DeviceClient** object. Currently, to use direct methods you must use the MQTT protocol.

1. Add the following nested class to the **App** class to return a status code to your IoT hub:

    ```java
    protected static class DirectMethodStatusCallback implements IotHubEventCallback
    {
      public void execute(IotHubStatusCode status, Object context)
      {
        System.out.println("IoT Hub responded to device method operation with status " + status.name());
      }
    }
    ```

1. Add the following nested class to the **App** class to handle the direct method invocations from the solution back end:

    ```java
    protected static class DirectMethodCallback implements com.microsoft.azure.sdk.iot.device.DeviceTwin.DeviceMethodCallback
    {
      @Override
      public DeviceMethodData call(String methodName, Object methodData, Object context)
      {
        DeviceMethodData deviceMethodData;
        switch (methodName)
        {
          case "writeLine" :
          {
            int status = METHOD_SUCCESS;
            System.out.println(new String((byte[])methodData));
            deviceMethodData = new DeviceMethodData(status, "Executed direct method " + methodName);
            break;
          }
          default:
          {
            int status = METHOD_NOT_DEFINED;
            deviceMethodData = new DeviceMethodData(status, "Not defined direct method " + methodName);
          }
        }
        return deviceMethodData;
      }
    }
    ```

1. Add a **main** method to the **App** class to create a **DeviceClient** and listen for direct method invocations:

    ```java
    public static void main(String[] args)
      throws IOException, URISyntaxException
    {
      System.out.println("Starting device sample...");

      DeviceClient client = new DeviceClient(connString, protocol);

      try
      {
        client.open();
        client.subscribeToDeviceMethod(new DirectMethodCallback(), null, new DirectMethodStatusCallback(), null);
        System.out.println("Subscribed to direct methods. Waiting...");
      }
      catch (Exception e)
      {
        System.out.println("On exception, shutting down \n" + " Cause: " + e.getCause() + " \n" +  e.getMessage());
        client.close();
        System.out.println("Shutting down...");
      }

      System.out.println("Press any key to exit...");
      Scanner scanner = new Scanner(System.in);
      scanner.nextLine();
      scanner.close();
      client.close();
      System.out.println("Shutting down...");
    }
    ```

1. Save and close the simulated-device\src\main\java\com\mycompany\app\App.java file

1. Build the **simulated-device** app and correct any errors. At your command prompt, navigate to the simulated-device folder and run the following command:

    `mvn clean package -DskipTests`

## Call a direct method on a device

In this section, you create a Java console app that invokes a direct method in the simulated device app and then displays the response. This console app connects to your IoT Hub to invoke the direct method.

1. In the iot-java-direct-method folder, create a Maven project called **invoke-direct-method** using the following command at your command prompt. Note this is a single, long command:

    `mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=invoke-direct-method -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false`

1. At your command prompt, navigate to the invoke-direct-method folder.

1. Using a text editor, open the pom.xml file in the invoke-direct-method folder and add the following dependency to the **dependencies** node. This dependency enables you to use the iot-service-client package in your app to communicate with your IoT hub:

    ```xml
    <dependency>
      <groupId>com.microsoft.azure.sdk.iot</groupId>
      <artifactId>iot-service-client</artifactId>
      <version>1.5.22</version>
      <type>jar</type>
    </dependency>
    ```

    > [!NOTE]
    > You can check for the latest version of **iot-service-client** using [Maven search][lnk-maven-service-search].

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

1. Save and close the pom.xml file.

1. Using a text editor, open the invoke-direct-method\src\main\java\com\mycompany\app\App.java file.

1. Add the following **import** statements to the file:

    ```java
    import com.microsoft.azure.sdk.iot.service.devicetwin.DeviceMethod;
    import com.microsoft.azure.sdk.iot.service.devicetwin.MethodResult;
    import com.microsoft.azure.sdk.iot.service.exceptions.IotHubException;

    import java.io.IOException;
    import java.util.concurrent.TimeUnit;
    ```

1. Add the following class-level variables to the **App** class. Replace **{youriothubconnectionstring}** with your IoT hub connection string you noted in the *Create an IoT Hub* section:

    ```java
    public static final String iotHubConnectionString = "{youriothubconnectionstring}";
    public static final String deviceId = "myDeviceId";

    public static final String methodName = "writeLine";
    public static final Long responseTimeout = TimeUnit.SECONDS.toSeconds(30);
    public static final Long connectTimeout = TimeUnit.SECONDS.toSeconds(5);
    public static final String payload = "a line to be written";
    ```

1. Add the following code to the **main** method to invoke the method on the simulated device:

    ```java
    System.out.println("Starting sample...");
    DeviceMethod methodClient = DeviceMethod.createFromConnectionString(iotHubConnectionString);

    try
    {
        System.out.println("Invoke direct method");
        MethodResult result = methodClient.invoke(deviceId, methodName, responseTimeout, connectTimeout, payload);

        if(result == null)
        {
            throw new IOException("Direct method invoke returns null");
        }
        System.out.println("Status=" + result.getStatus());
        System.out.println("Payload=" + result.getPayload());
    }
    catch (IotHubException e)
    {
        System.out.println(e.getMessage());
    }

    System.out.println("Shutting down sample...");
    ```

1. Save and close the invoke-direct-method\src\main\java\com\mycompany\app\App.java file

1. Build the **invoke-direct-method** app and correct any errors. At your command prompt, navigate to the invoke-direct-method folder and run the following command:

    `mvn clean package -DskipTests`

## Run the apps

You are now ready to run the console apps.

1. At a command prompt in the simulated-device folder, run the following command to begin listening for method calls from your IoT hub:

    `mvn exec:java -Dexec.mainClass="com.mycompany.app.App"`

    ![Java IoT Hub simulated device app to listen for direct method calls][8]

1. At a command prompt in the invoke-direct-method folder, run the following command to call a method on your simulated device from your IoT hub:

    `mvn exec:java -Dexec.mainClass="com.mycompany.app.App"`

    ![Java IoT Hub service app to call a direct method][7]

1. The simulated device responds to the direct method call:

    ![Java IoT Hub simulated device app responds to the direct method call][9]

## Next steps

In this tutorial, you configured a new IoT hub in the Azure portal, and then created a device identity in the IoT hub's identity registry. You used this device identity to enable the simulated device app to react to methods invoked by the cloud. You also created an app that invokes methods on the device and displays the response from the device.

To explore other IoT scenarios, see [Schedule jobs on multiple devices][lnk-devguide-jobs].

To learn how to extend your IoT solution and schedule method calls on multiple devices, see the [Schedule and broadcast jobs][lnk-tutorial-jobs] tutorial.

<!-- Images. -->
[7]: ./media/iot-hub-java-java-direct-methods/invoke-method.png
[8]: ./media/iot-hub-java-java-direct-methods/device-listen.png
[9]: ./media/iot-hub-java-java-direct-methods/device-respond.png

<!-- Links -->
[lnk-dev-setup]: https://github.com/Azure/azure-iot-sdk-java/blob/master/doc/java-devbox-setup.md
[lnk-maven]: https://maven.apache.org/what-is-maven.html
[lnk-hub-sdks]: iot-hub-devguide-sdks.md

[lnk-devguide-jobs]: iot-hub-devguide-jobs.md
[lnk-tutorial-jobs]: iot-hub-node-node-schedule-jobs.md
[lnk-maven-service-search]: http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22iot-service-client%22%20g%3A%22com.microsoft.azure.sdk.iot%22
[lnk-maven-device-search]: http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22iot-device-client%22%20g%3A%22com.microsoft.azure.sdk.iot%22
