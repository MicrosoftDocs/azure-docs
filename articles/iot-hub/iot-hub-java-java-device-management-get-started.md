---
title: Get started with Azure IoT Hub device management (Java) | Microsoft Docs
description: How to use Azure IoT Hub device management to initiate a remote device reboot. You use the Azure IoT device SDK for Java to implement a simulated device app that includes a direct method and the Azure IoT service SDK for Java to implement a service app that invokes the direct method.
services: iot-hub
documentationcenter: .java
author: dominicbetts
manager: timlt
editor: ''

ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/12/2017
ms.author: dobett

---
# Get started with device management (Java)

[!INCLUDE [iot-hub-selector-dm-getstarted](../../includes/iot-hub-selector-dm-getstarted.md)]

Back-end apps can use Azure IoT Hub primitives, such as [device twin][lnk-devtwin] and [direct methods][lnk-c2dmethod], to remotely start and monitor device management actions on devices. This tutorial shows you how a back-end app and a device app can work together to initiate and monitor a remote device reboot using IoT Hub.

Use a direct method to initiate device management actions (such as reboot, factory reset, and firmware update) from a back-end app in the cloud. The device is responsible for:

* Handling the method request sent from IoT Hub.
* Initiating the corresponding device-specific action on the device.
* Providing status updates through reported properties to IoT Hub.

You can use a back-end app in the cloud to run device twin queries to report on the progress of your device management actions.

This tutorial shows you how to:

* Use the Azure portal to create an IoT Hub and create a device identity in your IoT hub.
* Create a simulated device app that implements a direct method to reboot the device. Direct methods are invoked from the cloud.
* Create an app that invokes the reboot direct method in the simulated device app through your IoT hub. This app then monitors the reported properties from the device to see when the reboot operation is complete.

At the end of this tutorial, you have two Java console apps:

**simulated-device**, which connects to your IoT hub with the device identity created earlier, receives a reboot direct method, simulates a physical reboot, and reports the time of the last reboot through a reported property.

**trigger-reboot**, which calls a direct method in the simulated device app, displays the response, and displays the updated reported properties.

> [!NOTE]
> The article [Azure IoT SDKs][lnk-hub-sdks] provides information about the Azure IoT SDKs that you can use to build both applications to run on devices and your solution back end.

To complete this tutorial, you need:

* Java SE 8. <br/> [Prepare your development environment][lnk-dev-setup] describes how to install Java for this tutorial on either Windows or Linux.
* Maven 3.  <br/> [Prepare your development environment][lnk-dev-setup] describes how to install [Maven][lnk-maven] for this tutorial on either Windows or Linux.
* [Node.js version 0.10.0 or later](http://nodejs.org).

[!INCLUDE [iot-hub-get-started-create-hub](../../includes/iot-hub-get-started-create-hub.md)]

[!INCLUDE [iot-hub-get-started-create-device-identity](../../includes/iot-hub-get-started-create-device-identity.md)]

## Trigger a remote reboot on the device using a direct method

In this section, you create a Java console app that invokes the reboot direct method in the simulated device app and then displays the response. The app then polls the reported properties sent from the device to determine when the reboot is complete. This console app connects to your IoT Hub to invoke the direct method and read the reported properties.

1. Create an empty folder called dm-get-started. In the dm-get-started folder, create a Maven project called **trigger-reboot** using the following command at your command prompt. Note this is a single, long command:

1. In the dm-get-started folder, create a Maven project called **trigger-reboot** using the following command at your command prompt. Note this is a single, long command:

    `mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=trigger-reboot -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false`

1. At your command prompt, navigate to the trigger-reboot folder.

1. Using a text editor, open the pom.xml file in the trigger-reboot folder and add the following dependency to the **dependencies** node. This dependency enables you to use the iot-service-client package in your app to communicate with your IoT hub:

    ```xml
    <dependency>
      <groupId>com.microsoft.azure.sdk.iot</groupId>
      <artifactId>iot-service-client</artifactId>
      <version>1.2.17</version>
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

1. Using a text editor, open the trigger-reboot\src\main\java\com\mycompany\app\App.java file.

1. Add the following **import** statements to the file:

    ```java
    import com.microsoft.azure.sdk.iot.service.devicetwin.DeviceMethod;
    import com.microsoft.azure.sdk.iot.service.devicetwin.MethodResult;
    import com.microsoft.azure.sdk.iot.service.exceptions.IotHubException;
    import com.microsoft.azure.sdk.iot.service.devicetwin.DeviceTwin;
    import com.microsoft.azure.sdk.iot.service.devicetwin.DeviceTwinDevice;

    import java.io.IOException;
    import java.util.concurrent.TimeUnit;
    import java.util.concurrent.Executors;
    import java.util.concurrent.ExecutorService;
    ```

1. Add the following class-level variables to the **App** class. Replace **{youriothubconnectionstring}** with your IoT hub connection string you noted in the *Create an IoT Hub* section:

    ```java
    public static final String iotHubConnectionString = "{youriothubconnectionstring}";
    public static final String deviceId = "myDeviceId";

    private static final String methodName = "reboot";
    private static final Long responseTimeout = TimeUnit.SECONDS.toSeconds(30);
    private static final Long connectTimeout = TimeUnit.SECONDS.toSeconds(5);
    ```

1. Add the following nested class to the **App** class to implement a thread that reads the reported properties from the device twin every 10 seconds:

    ```java
    private static class ShowReportedProperties implements Runnable {
      public void run() {
        try {
          DeviceTwin deviceTwins = DeviceTwin.createFromConnectionString(iotHubConnectionString);
          DeviceTwinDevice twinDevice = new DeviceTwinDevice(deviceId);
          while (true) {
            System.out.println("Get reported properties from device twin");
            deviceTwins.getTwin(twinDevice);
            System.out.println(twinDevice.reportedPropertiesToString());
            Thread.sleep(10000);
          }
        } catch (Exception ex) {
          System.out.println("Exception reading reported properties: " + ex.getMessage());
        }
      }
    }
    ```

1. Add the following code to the **main** method to invoke the reboot direct method on the simulated device:

    ```java
    System.out.println("Starting sample...");
    DeviceMethod methodClient = DeviceMethod.createFromConnectionString(iotHubConnectionString);

    try
    {
      System.out.println("Invoke reboot direct method");
      MethodResult result = methodClient.invoke(deviceId, methodName, responseTimeout, connectTimeout, null);

      if(result == null)
      {
        throw new IOException("Invoke direct method reboot returns null");
      }
      System.out.println("Invoked reboot on device");
      System.out.println("Status for device:   " + result.getStatus());
      System.out.println("Message from device: " + result.getPayload());
    }
    catch (IotHubException e)
    {
        System.out.println(e.getMessage());
    }
    ```

1. Add the following code to the **main** method to start the thread to poll the reported properties from the simulated device:

    ```java
    ShowReportedProperties showReportedProperties = new ShowReportedProperties();
    ExecutorService executor = Executors.newFixedThreadPool(1);
    executor.execute(showReportedProperties);
    ```

1. Add the following code to the **main** method to to enable you to stop the app:

    ```java
    System.out.println("Press ENTER to exit.");
    System.in.read();
    executor.shutdownNow();
    System.out.println("Shutting down sample...");
    ```

1. Save and close the trigger-reboot\src\main\java\com\mycompany\app\App.java file.

1. Build the **trigger-reboot** app and correct any errors. At your command prompt, navigate to the trigger-reboot folder and run the following command:

    `mvn clean package -DskipTests`

## Create a simulated device app

In this section, you create a Java console app that simulates a device. The app listens for the reboot direct method call from your IoT hub and immediately responds to that call. The app then sleeps for a while to simulate the reboot process before it updates the reported property with the time the reboot completed.

## Run the apps

You are now ready to run the apps.

## Customize and extend the device management actions

Your IoT solutions can expand the defined set of device management patterns or enable custom patterns by using the device twin and cloud-to-device method primitives. Other examples of device management actions include factory reset, firmware update, software update, power management, network and connectivity management, and data encryption.

## Device maintenance windows

Typically, you configure devices to perform actions at a time that minimizes interruptions and downtime.  Device maintenance windows are a commonly used pattern to define the time when a device should update its configuration. Your back-end solutions can use the desired properties of the device twin to define and activate a policy on your device that enables a maintenance window. When a device receives the maintenance window policy, it can use the reported property of the device twin to report the status of the policy. The back-end app can then use device twin queries to attest to compliance of devices and each policy.

## Next steps

In this tutorial, you used a direct method to trigger a remote reboot on a device. You used the reported properties to report the last reboot time from the device, and queried the device twin to discover the last reboot time of the device from the cloud.

To continue getting started with IoT Hub and device management patterns such as remote over the air firmware update, see:

[Tutorial: How to do a firmware update][lnk-fwupdate]

To learn how to extend your IoT solution and schedule method calls on multiple devices, see the [Schedule and broadcast jobs][lnk-tutorial-jobs] tutorial.

To continue getting started with IoT Hub, see [Getting started with IoT Edge][lnk-gateway-SDK].

<!-- images and links -->
[img-output]: media/iot-hub-get-started-with-dm/image6.png
[img-dm-ui]: media/iot-hub-get-started-with-dm/dmui.png
[img-servicenuget]: media/iot-hub-csharp-node-device-management-get-started/servicesdknuget.png
[img-createapp]: media/iot-hub-csharp-node-device-management-get-started/createnetapp.png

<!-- Links -->

[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[Azure portal]: https://portal.azure.com/
[Using resource groups to manage your Azure resources]: ../azure-portal/resource-group-portal.md
[lnk-dm-github]: https://github.com/Azure/azure-iot-device-management
[lnk-gateway-SDK]: iot-hub-linux-gateway-sdk-get-started.md

[lnk-devtwin]: iot-hub-devguide-device-twins.md
[lnk-c2dmethod]: iot-hub-devguide-direct-methods.md

[lnk-dev-setup]: https://github.com/Azure/azure-iot-sdk-java/blob/master/doc/java-devbox-setup.md

[lnk-hub-sdks]: iot-hub-devguide-sdks.md

[lnk-devguide-jobs]: iot-hub-devguide-jobs.md
[lnk-tutorial-jobs]: iot-hub-node-node-schedule-jobs.md
[lnk-maven-service-search]: http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22iot-service-client%22%20g%3A%22com.microsoft.azure.sdk.iot%22
[lnk-maven-device-search]: http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22iot-device-client%22%20g%3A%22com.microsoft.azure.sdk.iot%22