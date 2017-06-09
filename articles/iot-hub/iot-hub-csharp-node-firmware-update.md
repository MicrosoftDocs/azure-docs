---
title: Device firmware update with Azure IoT Hub (.NET/Node) | Microsoft Docs
description: How to use device management on Azure IoT Hub to initiate a device firmware update. You use the Azure IoT device SDK for Node.js to implement a simulated device app and the Azure IoT service SDK for .NET to implement a service app that triggers the firmware update.
services: iot-hub
documentationcenter: .net
author: juanjperez
manager: timlt
editor: ''

ms.assetid: 70b84258-bc9f-43b1-b7cf-de1bb715f2cf
ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/17/2017
ms.author: juanpere

---
# Use device management to initiate a device firmware update (.NET/Node)
[!INCLUDE [iot-hub-selector-firmware-update](../../includes/iot-hub-selector-firmware-update.md)]

## Introduction
In the [Get started with device management][lnk-dm-getstarted] tutorial, you saw how to use the [device twin][lnk-devtwin] and [direct methods][lnk-c2dmethod] primitives to remotely reboot a device. This tutorial uses the same IoT Hub primitives and shows you how to do an end-to-end simulated firmware update.  This pattern is used in the firmware update implementation for the [Raspberry Pi device implementation sample][lnk-rpi-implementation].

This tutorial shows you how to:

* Create a .NET console app that calls the firmwareUpdate direct method in the simulated device app through your IoT hub.
* Create a simulated device app that implements a **firmwareUpdate** direct method. This method initiates a multi-stage process that waits to download the firmware image, downloads the firmware image, and finally applies the firmware image. During each stage of the update, the device uses the reported properties to report on progress.

At the end of this tutorial, you have a Node.js console device app and a .NET (C#) console back-end app:

**dmpatterns_fwupdate_service.js**, which calls a direct method in the simulated device app, displays the response, and periodically (every 500ms) displays the updated reported properties.

**TriggerFWUpdate**, which connects to your IoT hub with the device identity created earlier, receives a firmwareUpdate direct method, runs through a multi-state process to simulate a firmware update including: waiting for the image download, downloading the new image, and finally applying the image.

To complete this tutorial, you need the following:

* Visual Studio 2015 or Visual Studio 2017.
* Node.js version 0.12.x or later, <br/>  [Prepare your development environment][lnk-dev-setup] describes how to install Node.js for this tutorial on either Windows or Linux.
* An active Azure account. (If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.)

Follow the [Get started with device management](iot-hub-csharp-node-device-management-get-started.md) article to create your IoT hub and get your IoT Hub connection string.

[!INCLUDE [iot-hub-get-started-create-hub](../../includes/iot-hub-get-started-create-hub.md)]

[!INCLUDE [iot-hub-get-started-create-device-identity](../../includes/iot-hub-get-started-create-device-identity.md)]

## Trigger a remote firmware update on the device using a direct method
In this section, you create a .NET console app (using C#) that initiates a remote firmware update on a device. The app uses a direct method to initiate the update and uses device twin queries to periodically get the status of the active firmware update.

1. In Visual Studio, add a Visual C# Windows Classic Desktop project to the current solution by using the **Console Application** project template. Name the project **TriggerFWUpdate**.

    ![New Visual C# Windows Classic Desktop project][img-createapp]

1. In Solution Explorer, right-click the **TriggerFWUpdate** project, and then click **Manage NuGet Packages...**.
1. In the **NuGet Package Manager** window, select **Browse**, search for **microsoft.azure.devices**, select **Install** to install the **Microsoft.Azure.Devices** package, and accept the terms of use. This procedure downloads, installs, and adds a reference to the [Azure IoT service SDK][lnk-nuget-service-sdk] NuGet package and its dependencies.

    ![NuGet Package Manager window][img-servicenuget]
1. Add the following `using` statements at the top of the **Program.cs** file:
   
        using Microsoft.Azure.Devices;
        using Microsoft.Azure.Devices.Shared;
        
1. Add the following fields to the **Program** class. Replace the multiple placeholder values with the IoT Hub connection string for the hub that you created in the previous section and the Id of your device.
   
        static RegistryManager registryManager;
        static string connString = "{iot hub connection string}";
        static ServiceClient client;
        static JobClient jobClient;
        static string targetDevice = "{deviceIdForTargetDevice}";
        
1. Add the following method to the **Program** class:
   
        public static async Task QueryTwinFWUpdateReported()
        {
            Twin twin = await registryManager.GetTwinAsync(targetDevice);
            Console.WriteLine(twin.Properties.Reported.ToJson());
        }
        
1. Add the following method to the **Program** class:

        public static async Task StartFirmwareUpdate()
        {
            client = ServiceClient.CreateFromConnectionString(connString);
            CloudToDeviceMethod method = new CloudToDeviceMethod("firmwareUpdate");
            method.ResponseTimeout = TimeSpan.FromSeconds(30);
            method.SetPayloadJson(
                @"{
                    fwPackageUri : 'https://someurl'
                }");

            CloudToDeviceMethodResult result = await client.InvokeDeviceMethodAsync(targetDevice, method);

            Console.WriteLine("Invoked firmware update on device.");
        }

1. Finally, add the following lines to the **Main** method:
   
        registryManager = RegistryManager.CreateFromConnectionString(connString);
        StartFirmwareUpdate().Wait();
        QueryTwinFWUpdateReported().Wait();
        Console.WriteLine("Press ENTER to exit.");
        Console.ReadLine();
        
1. In the Solution Explorer, open the **Set StartUp projects...** and make sure the **Action** for **TriggerFWUpdate** project is **Start**.

1. Build the solution.

[!INCLUDE [iot-hub-device-firmware-update](../../includes/iot-hub-device-firmware-update.md)]

## Run the apps
You are now ready to run the apps.

1. At the command prompt in the **manageddevice** folder, run the following command to begin listening for the reboot direct method.
   
    ```
    node dmpatterns_fwupdate_device.js
    ```
2. In Visual Studio, right-click on the **TriggerFWUpdate** projectRun to the C# console app, select **Debug** and **Start new instance**.

3. You see the device response to the direct method in the console.

    ![Firmware updated successfully][img-fwupdate]

## Next steps
In this tutorial, you used a direct method to trigger a remote firmware update on a device and used the reported properties to follow the progress of the firmware update.

To learn how to extend your IoT solution and schedule method calls on multiple devices, see the [Schedule and broadcast jobs][lnk-tutorial-jobs] tutorial.

<!-- images -->
[img-servicenuget]: media/iot-hub-csharp-node-firmware-update/servicesdknuget.png
[img-createapp]: media/iot-hub-csharp-node-firmware-update/createnetapp.png
[img-fwupdate]: media/iot-hub-csharp-node-firmware-update/fwupdated.png

[lnk-devtwin]: iot-hub-devguide-device-twins.md
[lnk-c2dmethod]: iot-hub-devguide-direct-methods.md
[lnk-dm-getstarted]: iot-hub-node-node-device-management-get-started.md
[lnk-tutorial-jobs]: iot-hub-node-node-schedule-jobs.md

[lnk-dev-setup]: https://github.com/Azure/azure-iot-sdk-node/blob/master/doc/node-devbox-setup.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-transient-faults]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx
[lnk-rpi-implementation]: https://github.com/Azure/azure-iot-sdk-c/tree/master/iothub_client/samples/iothub_client_sample_mqtt_dm/pi_device
[lnk-nuget-service-sdk]: https://www.nuget.org/packages/Microsoft.Azure.Devices/