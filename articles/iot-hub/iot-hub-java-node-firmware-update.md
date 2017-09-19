---
title: Device firmware update with Azure IoT Hub (Java/Node) | Microsoft Docs
description: How to use device management on Azure IoT Hub to initiate a device firmware update. You use the Azure IoT device SDK for Node.js to implement a simulated device app and the Azure IoT service SDK for Java to implement a service app that triggers the firmware update.
services: iot-hub
documentationcenter: java
author: v-masebo
manager: timlt
editor: ''

ms.assetid: 70b84258-bc9f-43b1-b7cf-de1bb715f2cf
ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/11/2017
ms.author: v-masebo

---
# Use device management to initiate a device firmware update (Java/Node)
[!INCLUDE [iot-hub-selector-firmware-update](../../includes/iot-hub-selector-firmware-update.md)]

## Introduction
In the [Get started with device management][lnk-dm-getstarted] tutorial, you saw how to use the [device twin][lnk-devtwin] and [direct methods][lnk-c2dmethod] primitives to remotely reboot a device. This tutorial uses the same IoT Hub primitives and shows you how to do an end-to-end simulated firmware update.  This pattern is used in the firmware update implementation for the [Raspberry Pi device implementation sample][lnk-rpi-implementation].

This tutorial shows you how to:

* Create a Java console app that calls the firmwareUpdate direct method in the simulated device app through your IoT hub.
* Create a simulated device app that implements a **firmwareUpdate** direct method. This method initiates a multi-stage process that waits to download the firmware image, downloads the firmware image, and finally applies the firmware image. During each stage of the update, the device uses the reported properties to report on progress.

At the end of this tutorial, you have a Node.js console device app and a Java console back-end app:

**dmpatterns_fwupdate_service.js**, which calls a direct method in the simulated device app, displays the response, and periodically (every 500ms) displays the updated reported properties.

**firmware-update**, which connects to your IoT hub with the device identity created earlier, receives a firmwareUpdate direct method, runs through a multi-state process to simulate a firmware update including: waiting for the image download, downloading the new image, and finally applying the image.

To complete this tutorial, you need the following:

* The latest [Java SE Development Kit 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) 
* [Maven 3](https://maven.apache.org/install.html) 
* Node.js version 4.0.x or later, <br/>  [Prepare your development environment][lnk-dev-setup] describes how to install Node.js for this tutorial on either Windows or Linux.
* An active Azure account. (If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.)

Follow the [Get started with device management](iot-hub-csharp-node-device-management-get-started.md) article to create your IoT hub and get your IoT Hub connection string.

[!INCLUDE [iot-hub-get-started-create-hub](../../includes/iot-hub-get-started-create-hub.md)]

[!INCLUDE [iot-hub-get-started-create-device-identity](../../includes/iot-hub-get-started-create-device-identity.md)]

> [!NOTE]
> To utilize payload parameters recieved by the simulated Node device, in the above code replace `var fwPackageUri = request.payload.fwPackageUri;` with `var fwPackageUri = JSON.parse(request.payload).fwPackageUri;`, else `fwPackageUri` will be undefined.
> 
> 

## Trigger a remote firmware update on the device using a direct method
In this section, you create a Java console app that initiates a remote firmware update on a device. The app uses a direct method to initiate the update and uses device twin queries to periodically get the status of the active firmware update.

1. Create an empty folder called fw-get-started.

1. In the fw-get-started folder, create a Maven project called **firmware-update** using the following command at your command prompt. Note this is a single, long command:

    `mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=firmware-update -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false`

1. At your command prompt, navigate to the firmware-update folder.

1. Using a text editor, open the pom.xml file in the firmware-update folder and add the following dependency to the **dependencies** node. This dependency enables you to use the iot-service-client package in your app to communicate with your IoT hub:

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

1. Using a text editor, open the firmware-update\src\main\java\com\mycompany\app\App.java source file.

1. Add the following **import** statements to the file:

    ```java
    import com.microsoft.azure.sdk.iot.service.devicetwin.DeviceMethod;
    import com.microsoft.azure.sdk.iot.service.devicetwin.MethodResult;
    import com.microsoft.azure.sdk.iot.service.exceptions.IotHubException;
    import com.microsoft.azure.sdk.iot.service.devicetwin.DeviceTwin;
    import com.microsoft.azure.sdk.iot.service.devicetwin.DeviceTwinDevice;

    import java.io.IOException;
    import java.util.concurrent.TimeUnit;
    ```

1. Add the following class-level variables to the **App** class. Replace **{youriothubconnectionstring}** with your IoT hub connection string you noted in the *Create an IoT Hub* section:

    ```java
    public static final String iotHubConnectionString = "{youriothubconnectionstring}";
    public static final String deviceId = "myDeviceId";

    private static final String methodName = "firmwareUpdate";
    private static final Long responseTimeout = TimeUnit.SECONDS.toSeconds(30);
    private static final Long connectTimeout = TimeUnit.SECONDS.toSeconds(5);
    ```

1. To implement a thread that reads the reported properties from the device twin, add the following nested class to the **App** class:

    ```java
    public static void ShowReportedProperties() 
    {
        try 
        {
          DeviceTwin deviceTwins = DeviceTwin.createFromConnectionString(iotHubConnectionString);
          DeviceTwinDevice twinDevice = new DeviceTwinDevice(deviceId);
          
          Boolean firmwareUpdated = false;
          Integer timeoutCycle = 0;
    
          while (!firmwareUpdated)
          {
            if (timeoutCycle > 5)
            {
              System.out.println("Operation timed out");
              break;
            }
    
            Thread.sleep(10000);
              
            deviceTwins.getTwin(twinDevice);
              
            if(twinDevice.reportedPropertiesToString().contains("status=applyComplete"))
            {
              System.out.println("Get reported properties from device twin");
              System.out.println(twinDevice.reportedPropertiesToString());
              firmwareUpdated = true;
            }
            else
            {
              timeoutCycle++;
            }
          }
        } catch (Exception ex) {
            System.out.println("Exception reading reported properties: " + ex.getMessage());
        }
    }
    ```

1. Modify the signature of the **main** method to throw the following exceptions:

    ```java
    public static void main( String[] args ) throws IOException
    ```

1. To invoke the reboot direct method on the simulated device, add the following code to the **main** method:

    ```java
    System.out.println("Starting sample...");
    DeviceMethod methodClient = DeviceMethod.createFromConnectionString(iotHubConnectionString);

    try
    {
      System.out.println("Invoked firmware update on device.");

      String payload = "{ \"fwPackageUri\" : \"https://someurl\" }";

      MethodResult result = methodClient.invoke(deviceId, methodName, responseTimeout, connectTimeout, payload);

      if(result == null)
      {
        throw new IOException("Invoke direct method reboot returns null");
      }

      System.out.println("Status for device:   " + result.getStatus());
      System.out.println("Message from device: " + result.getPayload());
    }
    catch (IotHubException e)
    {
      System.out.println(e.getMessage());
    }
    ```

1. To poll the reported properties from the simulated device, add the following code to the **main** method:

    ```java
    ShowReportedProperties();
    ```

1. To enable you to stop the app, add the following code to the **main** method:

    ```java
    System.out.println("Press ENTER to exit.");
    System.in.read();
    System.out.println("Shutting down sample...");
    ```

1. Save and close the firmware-update\src\main\java\com\mycompany\app\App.java file.

1. Build the **firmware-update** back-end app and correct any errors. At your command prompt, navigate to the firmware-update folder and run the following command:

    `mvn clean package -DskipTests`

[!INCLUDE [iot-hub-device-firmware-update](../../includes/iot-hub-device-firmware-update.md)]

## Run the apps
You are now ready to run the apps.

1. At the command prompt in the **manageddevice** folder, run the following command to begin listening for the firmware update direct method.
   
    ```
    node dmpatterns_fwupdate_device.js
    ```
1. At a command prompt in the firmware-update folder, run the following command to invoke the firmware update and query the device twins on your simulated device from your IoT hub:

    `mvn exec:java -Dexec.mainClass="com.mycompany.app.App"`

3. You see the device response to the direct method in the console.

    ![Firmware updated successfully][img-fwupdate]

## Next steps
In this tutorial, you used a direct method to trigger a remote firmware update on a device and used the reported properties to follow the progress of the firmware update.

To learn how to extend your IoT solution and schedule method calls on multiple devices, see the [Schedule and broadcast jobs][lnk-tutorial-jobs] tutorial.

<!-- images -->
[img-fwupdate]: media/iot-hub-java-node-firmware-update/fwupdated.png

[lnk-devtwin]: iot-hub-devguide-device-twins.md
[lnk-c2dmethod]: iot-hub-devguide-direct-methods.md
[lnk-dm-getstarted]: iot-hub-node-node-device-management-get-started.md
[lnk-tutorial-jobs]: iot-hub-node-node-schedule-jobs.md

[lnk-dev-setup]: https://github.com/Azure/azure-iot-sdk-node/blob/master/doc/node-devbox-setup.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-transient-faults]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx
[lnk-rpi-implementation]: https://github.com/Azure/azure-iot-sdk-c/tree/master/iothub_client/samples/iothub_client_sample_mqtt_dm/pi_device