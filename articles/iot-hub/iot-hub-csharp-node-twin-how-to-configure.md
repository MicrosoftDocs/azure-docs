---
title: Use Azure IoT Hub device twin properties (.NET/Node) | Microsoft Docs
description: How to use Azure IoT Hub device twins to configure devices. You use the Azure IoT device SDK for Node.js to implement a simulated device app and the Azure IoT service SDK for .NET to implement a service app that modifies a device configuration using a device twin.
services: iot-hub
documentationcenter: .net
author: fsautomata
manager: timlt
editor: ''

ms.assetid: 3c627476-f982-43c9-bd17-e0698c5d236d
ms.service: iot-hub
ms.devlang: node
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 03/30/2017
ms.author: elioda

---
# Use desired properties to configure devices
[!INCLUDE [iot-hub-selector-twin-how-to-configure](../../includes/iot-hub-selector-twin-how-to-configure.md)]

At the end of this tutorial, you will have two console apps:

* **SimulateDeviceConfiguration.js**, a simulated device app that waits for a desired configuration update and reports the status of a simulated configuration update process.
* **SetDesiredConfigurationAndQuery**, a .NET back-end app, which sets the desired configuration on a device and queries the configuration update process.

> [!NOTE]
> The article [Azure IoT SDKs][lnk-hub-sdks] provides information about the Azure IoT SDKs that you can use to build both device and back-end apps.
> 
> 

To complete this tutorial you need the following:

* Visual Studio 2015 or Visual Studio 2017.
* Node.js version 0.10.x or later.
* An active Azure account. If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.

If you followed the [Get started with device twins][lnk-twin-tutorial] tutorial, you already have an IoT hub and a device identity called **myDeviceId**. In that case, you can skip to the [Create the simulated device app][lnk-how-to-configure-createapp] section.

[!INCLUDE [iot-hub-get-started-create-hub](../../includes/iot-hub-get-started-create-hub.md)]

[!INCLUDE [iot-hub-get-started-create-device-identity](../../includes/iot-hub-get-started-create-device-identity.md)]

## Create the simulated device app
In this section, you create a Node.js console app that connects to your hub as **myDeviceId**, waits for a desired configuration update and then reports updates on the simulated configuration update process.

1. Create a new empty folder called **simulatedeviceconfiguration**. In the **simulatedeviceconfiguration** folder, create a new package.json file using the following command at your command prompt. Accept all the defaults.
   
    ```
    npm init
    ```
1. At your command prompt in the **simulatedeviceconfiguration** folder, run the following command to install the **azure-iot-device** and **azure-iot-device-mqtt** packages:
   
    ```
    npm install azure-iot-device azure-iot-device-mqtt --save
    ```
1. Using a text editor, create a new **SimulateDeviceConfiguration.js** file in the **simulatedeviceconfiguration** folder.
1. Add the following code to the **SimulateDeviceConfiguration.js** file, and substitute the **{device connection string}** placeholder with the device connection string you copied when you created the **myDeviceId** device identity:
   
        'use strict';
        var Client = require('azure-iot-device').Client;
        var Protocol = require('azure-iot-device-mqtt').Mqtt;
   
        var connectionString = '{device connection string}';
        var client = Client.fromConnectionString(connectionString, Protocol);
   
        client.open(function(err) {
            if (err) {
                console.error('could not open IotHub client');
            } else {
                client.getTwin(function(err, twin) {
                    if (err) {
                        console.error('could not get twin');
                    } else {
                        console.log('retrieved device twin');
                        twin.properties.reported.telemetryConfig = {
                            configId: "0",
                            sendFrequency: "24h"
                        }
                        twin.on('properties.desired', function(desiredChange) {
                            console.log("received change: "+JSON.stringify(desiredChange));
                            var currentTelemetryConfig = twin.properties.reported.telemetryConfig;
                            if (desiredChange.telemetryConfig &&desiredChange.telemetryConfig.configId !== currentTelemetryConfig.configId) {
                                initConfigChange(twin);
                            }
                        });
                    }
                });
            }
        });
   
    The **Client** object exposes all the methods required to interact with device twins from the device. This code initializes the **Client** object, retrieves the device twin for **myDeviceId**, and then attaches a handler for the update on *desired properties*. The handler verifies that there is an actual configuration change request by comparing the configIds, then invokes a method that starts the configuration change.
   
    Note that for the sake of simplicity, this code uses a hard-coded default for the initial configuration. A real app would probably load that configuration from a local storage.
   
   > [!IMPORTANT]
   > Desired property change events are always emitted once at device connection. Make sure to check that there is an actual change in the desired properties before performing any action.
   > 
   > 
1. Add the following methods before the `client.open()` invocation:
   
        var initConfigChange = function(twin) {
            var currentTelemetryConfig = twin.properties.reported.telemetryConfig;
            currentTelemetryConfig.pendingConfig = twin.properties.desired.telemetryConfig;
            currentTelemetryConfig.status = "Pending";
   
            var patch = {
            telemetryConfig: currentTelemetryConfig
            };
            twin.properties.reported.update(patch, function(err) {
                if (err) {
                    console.log('Could not report properties');
                } else {
                    console.log('Reported pending config change: ' + JSON.stringify(patch));
                    setTimeout(function() {completeConfigChange(twin);}, 60000);
                }
            });
        }
   
        var completeConfigChange =  function(twin) {
            var currentTelemetryConfig = twin.properties.reported.telemetryConfig;
            currentTelemetryConfig.configId = currentTelemetryConfig.pendingConfig.configId;
            currentTelemetryConfig.sendFrequency = currentTelemetryConfig.pendingConfig.sendFrequency;
            currentTelemetryConfig.status = "Success";
            delete currentTelemetryConfig.pendingConfig;
   
            var patch = {
                telemetryConfig: currentTelemetryConfig
            };
            patch.telemetryConfig.pendingConfig = null;
   
            twin.properties.reported.update(patch, function(err) {
                if (err) {
                    console.error('Error reporting properties: ' + err);
                } else {
                    console.log('Reported completed config change: ' + JSON.stringify(patch));
                }
            });
        };
   
    The **initConfigChange** method updates the reported properties on the local device twin object with the configuration update request and sets the status to **Pending**, then updates the device twin on the service. After successfully updating the device twin, it simulates a long running process that terminates in the execution of **completeConfigChange**. This method updates the local reported properties setting the status to **Success** and removing the **pendingConfig** object. It then updates the device twin on the service.
   
    Note that, to save bandwidth, reported properties are updated by specifying only the properties to be modified (named **patch** in the above code), instead of replacing the whole document.
   
   > [!NOTE]
   > This tutorial does not simulate any behavior for concurrent configuration updates. Some configuration update processes might be able to accommodate changes of target configuration while the update is running, some might have to queue them, and some could reject them with an error condition. Make sure to consider the desired behavior for your specific configuration process, and add the appropriate logic before initiating the configuration change.
   > 
   > 
1. Run the device app:
   
        node SimulateDeviceConfiguration.js
   
    You should see the message `retrieved device twin`. Keep the app running.

## Create the service app
In this section, you will create a .NET console app that updates the *desired properties* on the device twin associated with **myDeviceId** with a new telemetry configuration object. It then queries the device twins stored in the IoT hub and shows the difference between the desired and reported configurations of the device.

1. In Visual Studio, add a Visual C# Windows Classic Desktop project to the current solution by using the **Console Application** project template. Name the project **SetDesiredConfigurationAndQuery**.
   
    ![New Visual C# Windows Classic Desktop project][img-createapp]
1. In Solution Explorer, right-click the **SetDesiredConfigurationAndQuery** project, and then click **Manage NuGet Packages...**.
1. In the **NuGet Package Manager** window, select **Browse**, search for **microsoft.azure.devices**, select **Install** to install the **Microsoft.Azure.Devices** package, and accept the terms of use. This procedure downloads, installs, and adds a reference to the [Azure IoT service SDK][lnk-nuget-service-sdk] NuGet package and its dependencies.
   
    ![NuGet Package Manager window][img-servicenuget]
1. Add the following `using` statements at the top of the **Program.cs** file:
   
        using Microsoft.Azure.Devices;
        using System.Threading;
        using Newtonsoft.Json;
1. Add the following fields to the **Program** class. Replace the placeholder value with the IoT Hub connection string for the hub that you created in the previous section.
   
        static RegistryManager registryManager;
        static string connectionString = "{iot hub connection string}";
1. Add the following method to the **Program** class:
   
        static private async Task SetDesiredConfigurationAndQuery()
        {
            var twin = await registryManager.GetTwinAsync("myDeviceId");
            var patch = new {
                    properties = new {
                        desired = new {
                            telemetryConfig = new {
                                configId = Guid.NewGuid().ToString(),
                                sendFrequency = "5m"
                            }
                        }
                    }
                };
   
            await registryManager.UpdateTwinAsync(twin.DeviceId, JsonConvert.SerializeObject(patch), twin.ETag);
            Console.WriteLine("Updated desired configuration");
   
            try
            {
                while (true)
                {
                    var query = registryManager.CreateQuery("SELECT * FROM devices WHERE deviceId = 'myDeviceId'");
                    var results = await query.GetNextAsTwinAsync();
                    foreach (var result in results)
                    {
                        Console.WriteLine("Config report for: {0}", result.DeviceId);
                        Console.WriteLine("Desired telemetryConfig: {0}", JsonConvert.SerializeObject(result.Properties.Desired["telemetryConfig"], Formatting.Indented));
                        Console.WriteLine("Reported telemetryConfig: {0}", JsonConvert.SerializeObject(result.Properties.Reported["telemetryConfig"], Formatting.Indented));
                        Console.WriteLine();
                    }
                    Thread.Sleep(10000);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
            }
        }
   
    The **Registry** object exposes all the methods required to interact with device twins from the service. This code initializes the **Registry** object, retrieves the device twin for **myDeviceId**, and then updates its desired properties with a new telemetry configuration object.
    After that, it queries the device twins stored in the IoT hub every 10 seconds, and prints the desired and reported telemetry configurations. Refer to the [IoT Hub query language][lnk-query] to learn how to generate rich reports across all your devices.
   
   > [!IMPORTANT]
   > This application queries IoT Hub every 10 seconds for illustrative purposes. Use queries to generate user-facing reports across many devices, and not to detect changes. If your solution requires real-time notifications of device events, use [twin notifications][lnk-twin-notifications].
   > 
   > 
1. Finally, add the following lines to the **Main** method:
   
        registryManager = RegistryManager.CreateFromConnectionString(connectionString);
        SetDesiredConfigurationAndQuery().Wait();
        Console.WriteLine("Press any key to quit.");
        Console.ReadLine();
1. In the Solution Explorer, open the **Set StartUp projects...** and make sure the **Action** for **SetDesiredConfigurationAndQuery** project is **Start**. Build the solution.
1. With **SimulateDeviceConfiguration.js** running, run the .NET application from Visual Studio using **F5** and you should see the reported configuration change from **Success** to **Pending** to **Success** again with the new active send frequency of five minutes instead of 24 hours.

 ![Device configured successfully][img-deviceconfigured]
   
   > [!IMPORTANT]
   > There is a delay of up to a minute between the device report operation and the query result. This is to enable the query infrastructure to work at very high scale. To retrieve consistent views of a single device twin use the **getDeviceTwin** method in the **Registry** class.
   > 
   > 

## Next steps
In this tutorial, you set a desired configuration as *desired properties* from the solution back end, and wrote a device app to detect that change and simulate a multi-step update process reporting its status through the reported properties.

Use the following resources to learn how to:

* send telemetry from devices with the [Get started with IoT Hub][lnk-iothub-getstarted] tutorial,
* schedule or perform operations on large sets of devices see the [Schedule and broadcast jobs][lnk-schedule-jobs] tutorial.
* control devices interactively (such as turning on a fan from a user-controlled app), with the [Use direct methods][lnk-methods-tutorial] tutorial.

<!-- images -->
[img-servicenuget]: media/iot-hub-csharp-node-twin-how-to-configure/servicesdknuget.png
[img-createapp]: media/iot-hub-csharp-node-twin-how-to-configure/createnetapp.png
[img-deviceconfigured]: media/iot-hub-csharp-node-twin-how-to-configure/deviceconfigured.png

<!-- links -->
[lnk-hub-sdks]: iot-hub-devguide-sdks.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-nuget-service-sdk]: https://www.nuget.org/packages/Microsoft.Azure.Devices/1.1.0/

[lnk-devguide-jobs]: iot-hub-devguide-jobs.md
[lnk-query]: iot-hub-devguide-query-language.md
[lnk-twin-notifications]: iot-hub-devguide-device-twins.md#back-end-operations
[lnk-methods]: iot-hub-devguide-direct-methods.md
[lnk-dm-overview]: iot-hub-device-management-overview.md
[lnk-twin-tutorial]: iot-hub-node-node-twin-getstarted.md
[lnk-schedule-jobs]: iot-hub-node-node-schedule-jobs.md
[lnk-dev-setup]: https://github.com/Azure/azure-iot-sdk-node/blob/master/doc/node-devbox-setup.md
[lnk-connect-device]: https://azure.microsoft.com/develop/iot/
[lnk-device-management]: iot-hub-node-node-device-management-get-started.md
[lnk-iothub-getstarted]: iot-hub-node-node-getstarted.md
[lnk-methods-tutorial]: iot-hub-node-node-direct-methods.md

[lnk-guid]: https://en.wikipedia.org/wiki/Globally_unique_identifier

[lnk-how-to-configure-createapp]: iot-hub-node-node-twin-how-to-configure.md#create-the-simulated-device-app
