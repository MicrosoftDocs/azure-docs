---
title: Get started with Azure IoT Hub device management (.NET/Node) | Microsoft Docs
description: How to use Azure IoT Hub device management to initiate a remote device reboot. You use the Azure IoT device SDK for Node.js to implement a simulated device app that includes a direct method and the Azure IoT service SDK for .NET to implement a service app that invokes the direct method.
services: iot-hub
documentationcenter: .net
author: juanjperez
manager: timlt
editor: ''

ms.assetid: e044006d-ffd6-469b-bc63-c182ad066e31
ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/17/2016
ms.author: juanpere

---
# Get started with device management (.NET/Node)

[!INCLUDE [iot-hub-selector-dm-getstarted](../../includes/iot-hub-selector-dm-getstarted.md)]

This tutorial shows you how to:

* Use the Azure portal to create an IoT Hub and create a device identity in your IoT hub.
* Create a simulated device app that contains a direct method that reboots that device. Direct methods are invoked from the cloud.
* Create a .NET console app that calls the reboot direct method in the simulated device app through your IoT hub.

At the end of this tutorial, you have a Node.js console device app and a .NET (C#) console back-end app:

**dmpatterns_getstarted_device.js**, which connects to your IoT hub with the device identity created earlier, receives a reboot direct method, simulates a physical reboot, and reports the time for the last reboot.

**TriggerReboot**, which calls a direct method in the simulated device app, displays the response, and displays the updated reported properties.

To complete this tutorial, you need the following:

* Visual Studio 2015 or Visual Studio 2017.
* Node.js version 0.12.x or later, <br/>  [Prepare your development environment][lnk-dev-setup] describes how to install Node.js for this tutorial on either Windows or Linux.
* An active Azure account. (If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.)

[!INCLUDE [iot-hub-get-started-create-hub](../../includes/iot-hub-get-started-create-hub.md)]

[!INCLUDE [iot-hub-get-started-create-device-identity](../../includes/iot-hub-get-started-create-device-identity.md)]

## Trigger a remote reboot on the device using a direct method
In this section, you create a .NET console app (using C#) that initiates a remote reboot on a device using a direct method. The app uses device twin queries to discover the last reboot time for that device.

1. In Visual Studio, add a Visual C# Windows Classic Desktop project to a new solution by using the **Console App (.NET Framework)** project template. Make sure the .NET Framework version is 4.5.1 or later. Name the project **TriggerReboot**.

    ![New Visual C# Windows Classic Desktop project][img-createapp]

2. In Solution Explorer, right-click the **TriggerReboot** project, and then click **Manage NuGet Packages**.
3. In the **NuGet Package Manager** window, select **Browse**, search for **microsoft.azure.devices**, select **Install** to install the **Microsoft.Azure.Devices** package, and accept the terms of use. This procedure downloads, installs, and adds a reference to the [Azure IoT service SDK][lnk-nuget-service-sdk] NuGet package and its dependencies.

    ![NuGet Package Manager window][img-servicenuget]
4. Add the following `using` statements at the top of the **Program.cs** file:
   
        using Microsoft.Azure.Devices;
        
5. Add the following fields to the **Program** class. Replace the placeholder value with the IoT Hub connection string for the hub that you created in the previous section and the target device.
   
        static RegistryManager registryManager;
        static string connString = "{iot hub connection string}";
        static ServiceClient client;
        static JobClient jobClient;
        static string targetDevice = "{deviceIdForTargetDevice}";
        
6. Add the following method to the **Program** class.  This code gets the device twin for the rebooting device and outputs the reported properties.
   
        public static async Task QueryTwinRebootReported()
        {
            Twin twin = await registryManager.GetTwinAsync(targetDevice);
            Console.WriteLine(twin.Properties.Reported.ToJson());
        }
        
7. Add the following method to the **Program** class.  This code initiates the reboot on the device using a direct method.

        public static async Task StartReboot()
        {
            client = ServiceClient.CreateFromConnectionString(connString);
            CloudToDeviceMethod method = new CloudToDeviceMethod("reboot");
            method.ResponseTimeout = TimeSpan.FromSeconds(30);

            CloudToDeviceMethodResult result = await client.InvokeDeviceMethodAsync(targetDevice, method);

            Console.WriteLine("Invoked firmware update on device.");
        }

7. Finally, add the following lines to the **Main** method:
   
        registryManager = RegistryManager.CreateFromConnectionString(connString);
        StartReboot().Wait();
        QueryTwinRebootReported().Wait();
        Console.WriteLine("Press ENTER to exit.");
        Console.ReadLine();
        
8. Build the solution.

## Create a simulated device app
In this section, you will

* Create a Node.js console app that responds to a direct method called by the cloud
* Trigger a simulated device reboot
* Use the reported properties to enable device twin queries to identify devices and when they last rebooted

1. Create a new empty folder called **manageddevice**.  In the **manageddevice** folder, create a package.json file using the following command at your command prompt.  Accept all the defaults:
   
    ```
    npm init
    ```
2. At your command prompt in the **manageddevice** folder, run the following command to install the **azure-iot-device** Device SDK package and **azure-iot-device-mqtt** package:
   
    ```
    npm install azure-iot-device azure-iot-device-mqtt --save
    ```
3. Using a text editor, create a new **dmpatterns_getstarted_device.js** file in the **manageddevice** folder.
4. Add the following 'require' statements at the start of the **dmpatterns_getstarted_device.js** file:
   
    ```
    'use strict';
   
    var Client = require('azure-iot-device').Client;
    var Protocol = require('azure-iot-device-mqtt').Mqtt;
    ```
5. Add a **connectionString** variable and use it to create a **Client** instance.  Replace the connection string with your device connection string.  
   
    ```
    var connectionString = 'HostName={youriothostname};DeviceId=myDeviceId;SharedAccessKey={yourdevicekey}';
    var client = Client.fromConnectionString(connectionString, Protocol);
    ```
6. Add the following function to implement the direct method on the device
   
    ```
    var onReboot = function(request, response) {
   
        // Respond the cloud app for the direct method
        response.send(200, 'Reboot started', function(err) {
            if (!err) {
                console.error('An error occured when sending a method response:\n' + err.toString());
            } else {
                console.log('Response to method \'' + request.methodName + '\' sent successfully.');
            }
        });
   
        // Report the reboot before the physical restart
        var date = new Date();
        var patch = {
            iothubDM : {
                reboot : {
                    lastReboot : date.toISOString(),
                }
            }
        };
   
        // Get device Twin
        client.getTwin(function(err, twin) {
            if (err) {
                console.error('could not get twin');
            } else {
                console.log('twin acquired');
                twin.properties.reported.update(patch, function(err) {
                    if (err) throw err;
                    console.log('Device reboot twin state reported')
                });  
            }
        });
   
        // Add your device's reboot API for physical restart.
        console.log('Rebooting!');
    };
    ```
7. Add the following code to open the connection to your IoT hub and start the direct method listener:
   
    ```
    client.open(function(err) {
        if (err) {
            console.error('Could not open IotHub client');
        }  else {
            console.log('Client opened.  Waiting for reboot method.');
            client.onDeviceMethod('reboot', onReboot);
        }
    });
    ```
8. Save and close the **dmpatterns_getstarted_device.js** file.
   
> [!NOTE]
> To keep things simple, this tutorial does not implement any retry policy. In production code, you should implement retry policies (such as an exponential backoff), as suggested in the MSDN article [Transient Fault Handling][lnk-transient-faults].


## Run the apps
You are now ready to run the apps.

1. At the command prompt in the **manageddevice** folder, run the following command to begin listening for the reboot direct method.
   
    ```
    node dmpatterns_getstarted_device.js
    ```
2. Run the C# console app **TriggerReboot**. Right-click the **TriggerReboot** project, select **Debug**, and then select **Start new instance**.

3. You see the device response to the direct method in the console.

[!INCLUDE [iot-hub-dm-followup](../../includes/iot-hub-dm-followup.md)]

<!-- images and links -->
[img-output]: media/iot-hub-get-started-with-dm/image6.png
[img-dm-ui]: media/iot-hub-get-started-with-dm/dmui.png
[img-servicenuget]: media/iot-hub-csharp-node-device-management-get-started/servicesdknuget.png
[img-createapp]: media/iot-hub-csharp-node-device-management-get-started/createnetapp.png

[lnk-dev-setup]: https://github.com/Azure/azure-iot-sdk-node/blob/master/doc/node-devbox-setup.md

[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[Azure portal]: https://portal.azure.com/
[Using resource groups to manage your Azure resources]: ../azure-portal/resource-group-portal.md
[lnk-dm-github]: https://github.com/Azure/azure-iot-device-management

[lnk-devtwin]: iot-hub-devguide-device-twins.md
[lnk-c2dmethod]: iot-hub-devguide-direct-methods.md
[lnk-transient-faults]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx
[lnk-nuget-service-sdk]: https://www.nuget.org/packages/Microsoft.Azure.Devices/