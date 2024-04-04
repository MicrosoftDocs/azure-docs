---
title: Device management using direct methods (.NET)
titleSuffix: Azure IoT Hub
description: How to use Azure IoT Hub direct methods with the .NET SDK for device management tasks including invoking a remote device reboot.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.devlang: csharp
ms.topic: how-to
ms.date: 08/20/2019
ms.custom: mqtt, devx-track-csharp, devx-track-dotnet
---

# Get started with device management (.NET)

[!INCLUDE [iot-hub-selector-dm-getstarted](../../includes/iot-hub-selector-dm-getstarted.md)]

[!INCLUDE [iot-hub-include-dm-getstarted](../../includes/iot-hub-include-dm-getstarted.md)]

This article shows you how to create:

* **SimulateManagedDevice**: a simulated device app with a direct method that reboots the device and reports the last reboot time. Direct methods are invoked from the cloud.

* **TriggerReboot**: a .NET console app that calls the direct method in the simulated device app through your IoT hub. It displays the response and updated reported properties.

## Prerequisites

* Visual Studio.

* An IoT hub. Create one with the [CLI](iot-hub-create-using-cli.md) or the [Azure portal](iot-hub-create-through-portal.md).

* A registered device. Register one in the [Azure portal](iot-hub-create-through-portal.md#register-a-new-device-in-the-iot-hub).

* Make sure that port 8883 is open in your firewall. The device sample in this article uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](../iot/iot-mqtt-connect-to-iot-hub.md#connecting-to-iot-hub).

## Create a device app with a direct method

In this section, you:

* Create a .NET console app that responds to a direct method called by the cloud.

* Trigger a simulated device reboot.

* Use the reported properties to enable device twin queries to identify devices and when they were last rebooted.

To create the simulated device app, follow these steps:

1. Open Visual Studio and select **Create a new project**, then find and select the **Console App (.NET Framework)** project template, then select **Next**.

1. In **Configure your new project**, name the project *SimulateManagedDevice*, then select **Next**.

   :::image type="content" source="./media/iot-hub-csharp-csharp-device-management-get-started/configure-device-app.png" alt-text="Screenshot that shows how to name a new Visual Studio project." lightbox="./media/iot-hub-csharp-csharp-device-management-get-started/configure-device-app.png":::

1. Keep the default .NET Framework version, then select **Create**.

1. In Solution Explorer, right-click the new **SimulateManagedDevice** project, and then select **Manage NuGet Packages**.

1. Select **Browse**, then search for and select **Microsoft.Azure.Devices.Client**. Select **Install**.

   :::image type="content" source="./media/iot-hub-csharp-csharp-device-management-get-started/create-device-nuget-devices-client.png" alt-text="Screenshot that shows how to install the Microsoft.Azure.Devices.Client package." lightbox="./media/iot-hub-csharp-csharp-device-management-get-started/create-device-nuget-devices-client.png":::

   This step downloads, installs, and adds a reference to the [Azure IoT device SDK](https://www.nuget.org/packages/Microsoft.Azure.Devices.Client/) NuGet package and its dependencies.

1. Add the following `using` statements at the top of the **Program.cs** file:

    ```csharp
    using Microsoft.Azure.Devices.Client;
    using Microsoft.Azure.Devices.Shared;
    ```

1. Add the following fields to the **Program** class. Replace the `{device connection string}` placeholder value with the device connection string you saw when you registered a device in the IoT Hub:

    ```csharp
    static string DeviceConnectionString = "{device connection string}";
    static DeviceClient Client = null;
    ```

1. Add the following to implement the direct method on the device:

   ```csharp
   static Task<MethodResponse> onReboot(MethodRequest methodRequest, object userContext)
   {
       // In a production device, you would trigger a reboot 
       //   scheduled to start after this method returns.
       // For this sample, we simulate the reboot by writing to the console
       //   and updating the reported properties.
       try
       {
           Console.WriteLine("Rebooting!");

           // Update device twin with reboot time. 
           TwinCollection reportedProperties, reboot, lastReboot;
           lastReboot = new TwinCollection();
           reboot = new TwinCollection();
           reportedProperties = new TwinCollection();
           lastReboot["lastReboot"] = DateTime.Now;
           reboot["reboot"] = lastReboot;
           reportedProperties["iothubDM"] = reboot;
           Client.UpdateReportedPropertiesAsync(reportedProperties).Wait();
       }
       catch (Exception ex)
       {
           Console.WriteLine();
           Console.WriteLine("Error in sample: {0}", ex.Message);
       }

       string result = @"{""result"":""Reboot started.""}";
       return Task.FromResult(new MethodResponse(Encoding.UTF8.GetBytes(result), 200));
   }
   ```

1. Finally, add the following code to the **Main** method to open the connection to your IoT hub and initialize the method listener:

   ```csharp
   try
   {
       Console.WriteLine("Connecting to hub");
       Client = DeviceClient.CreateFromConnectionString(DeviceConnectionString, 
         TransportType.Mqtt);

       // setup callback for "reboot" method
       Client.SetMethodHandlerAsync("reboot", onReboot, null).Wait();
       Console.WriteLine("Waiting for reboot method\n Press enter to exit.");
       Console.ReadLine();

       Console.WriteLine("Exiting...");

       // as a good practice, remove the "reboot" handler
       Client.SetMethodHandlerAsync("reboot", null, null).Wait();
       Client.CloseAsync().Wait();
   }
   catch (Exception ex)
   {
       Console.WriteLine();
       Console.WriteLine("Error in sample: {0}", ex.Message);
   }
   ```

1. In Solution Explorer, right-click your solution, and then select **Set StartUp Projects**.

1. For **Common Properties** > **Startup Project**, Select **Single startup project**, and then select the **SimulateManagedDevice** project. Select **OK** to save your changes.

1. Select **Build** > **Build Solution**.

> [!NOTE]
> To keep things simple, this article does not implement any retry policy. In production code, you should implement retry policies (such as an exponential backoff), as suggested in [Transient fault handling](/azure/architecture/best-practices/transient-faults).

## Get the IoT hub connection string

[!INCLUDE [iot-hub-howto-device-management-shared-access-policy-text](../../includes/iot-hub-howto-device-management-shared-access-policy-text.md)]

[!INCLUDE [iot-hub-include-find-service-connection-string](../../includes/iot-hub-include-find-service-connection-string.md)]

## Create a service app to trigger a reboot

In this section, you create a .NET console app, using C#, that initiates a remote reboot on a device using a direct method. The app uses device twin queries to discover the last reboot time for that device.

1. Open Visual Studio and select **Create a new project**.

1. In **Create a new project**, find and select the **Console App (.NET Framework)** project template, and then select **Next**.

1. In **Configure your new project**, name the project *TriggerReboot*, then select **Next**.

   :::image type="content" source="./media/iot-hub-csharp-csharp-device-management-get-started/create-trigger-reboot-configure.png" alt-text="Screenshot that shows how to configure a new Visual Studio project." lightbox="./media/iot-hub-csharp-csharp-device-management-get-started/create-trigger-reboot-configure.png":::

1. Accept the default version of the .NET Framework, then select **Create** to create the project.

1. In **Solution Explorer**, right-click the **TriggerReboot** project, and then select **Manage NuGet Packages**.

1. Select **Browse**, then search for and select **Microsoft.Azure.Devices**. Select **Install** to install the **Microsoft.Azure.Devices** package.

   :::image type="content" source="./media/iot-hub-csharp-csharp-device-management-get-started/create-trigger-reboot-nuget-devices.png" alt-text="Screenshot that shows how to install the Microsoft.Azure.Devices package." lightbox="./media/iot-hub-csharp-csharp-device-management-get-started/create-trigger-reboot-nuget-devices.png":::

   This step downloads, installs, and adds a reference to the [Azure IoT service SDK](https://www.nuget.org/packages/Microsoft.Azure.Devices/) NuGet package and its dependencies.

1. Add the following `using` statements at the top of the **Program.cs** file:

   ```csharp
   using Microsoft.Azure.Devices;
   using Microsoft.Azure.Devices.Shared;
   ```

1. Add the following fields to the **Program** class. Replace the `{iot hub connection string}` placeholder value with the IoT Hub connection string you copied previously in [Get the IoT hub connection string](#get-the-iot-hub-connection-string).

   ```csharp
   static RegistryManager registryManager;
   static string connString = "{iot hub connection string}";
   static ServiceClient client;
   static string targetDevice = "myDeviceId";
   ```

1. Add the following method to the **Program** class.  This code gets the device twin for the rebooting device and outputs the reported properties.

   ```csharp
   public static async Task QueryTwinRebootReported()
   {
       Twin twin = await registryManager.GetTwinAsync(targetDevice);
       Console.WriteLine(twin.Properties.Reported.ToJson());
   }
   ```

1. Add the following method to the **Program** class.  This code initiates the reboot on the device using a direct method.

   ```csharp
   public static async Task StartReboot()
   {
       client = ServiceClient.CreateFromConnectionString(connString);
       CloudToDeviceMethod method = new CloudToDeviceMethod("reboot");
       method.ResponseTimeout = TimeSpan.FromSeconds(30);

       CloudToDeviceMethodResult result = await 
         client.InvokeDeviceMethodAsync(targetDevice, method);

       Console.WriteLine("Invoked firmware update on device.");
   }
   ```

1. Finally, add the following lines to the **Main** method:

   ```csharp
   registryManager = RegistryManager.CreateFromConnectionString(connString);
   StartReboot().Wait();
   QueryTwinRebootReported().Wait();
   Console.WriteLine("Press ENTER to exit.");
   Console.ReadLine();
   ```

1. Select **Build** > **Build Solution**.

> [!NOTE]
> This article performs only a single query for the device's reported properties. In production code, we recommend polling to detect changes in the reported properties.

## Run the apps

You're now ready to run the apps.

1. To run the .NET device app **SimulateManagedDevice**, in Solution Explorer, right-click the **SimulateManagedDevice** project, select **Debug**, and then select **Start new instance**. The app should start listening for method calls from your IoT hub.

1. After that the device is connected and waiting for method invocations, right-click the **TriggerReboot** project, select **Debug**, and then select **Start new instance**.

   You should see **Rebooting** written in the **SimulatedManagedDevice** console and the reported properties of the device, which include the last reboot time,  written in the **TriggerReboot** console.

   ![Service and device app run](./media/iot-hub-csharp-csharp-device-management-get-started/combinedrun.png)

[!INCLUDE [iot-hub-dm-followup](../../includes/iot-hub-dm-followup.md)]
