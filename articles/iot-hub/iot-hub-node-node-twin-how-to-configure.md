<properties
	pageTitle="Use twin properties | Microsoft Azure"
	description="This tutorial shows you how to use twin properties"
	services="iot-hub"
	documentationCenter=".net"
	authors="fsautomata"
	manager="timlt"
	editor=""/>

<tags
     ms.service="iot-hub"
     ms.devlang="node"
     ms.topic="article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="09/13/2016"
     ms.author="elioda"/>

# Tutorial: Use desired properties to configure devices

## Introduction

Azure IoT Hub is a fully managed service that helps enable reliable and secure bi-directional communications between millions of IoT devices and an application back end. In [Get started with IoT Hub twins][lnk-twin-tutorial], you learned how to set device meta-data from your solution back end using *tags*, report device conditions from a device app using *reported properties*, and query this information using a SQL-like language.

In this tutorial, you learn how to use the the twin's *desired properties* in conjunction with *reported properties*, to remotely configure large sets of devices. More specifically, this tutorial shows how twin's reported and desired properties enable a multi-step configuration of a device application setting, and provide the required visibility to the solution back end of the status of this operation across all devices.

At a high level, this tutorial follows the *desired state pattern* for device management. The fundamental idea of this pattern is to have the solution back end specify the desired state for the managed devices, instead of sending specific commands. This puts the device in charge of establishing the best way to reach the desired state (very important in IoT scenarios where specific device conditions affect the ability to immediately carry out specific commands), while continually reporting to the back end the current state and potential error conditions. This enables the back end to have full visibility of the state of the configuration process across large sets of devices.
You can find more information regarding the role of the desired state pattern in device management in [Overview of Azure IoT Hub device management][lnk-dm-overview].

>AZURE.NOTE In scenarios where devices are controlled in a more interactive fashion (turn on a fan from a user-controlled app), consider using [cloud-to-device methods][lnk-methods].

In this tutorial, the application back end changes the telemetry configuration of a target device. The configuration is represented in the device twin's desired properties in the following way:

        {
            ...
            "properties": {
                ...
                "desired": {
                    "telemetryConfig": {
                        "configId": "{id of the configuration}",
                        "sendFrequency": "{config}"
                    }
                }
                ...
            }
            ...
        }

You assign ids to configuration changes to simplify the tracking of long running configuration update processes.

On the device-side, you assume that the device app should follow a multi-step process to apply a configuration update (for example, requiring a software module restart), which in this tutorial is simulated by a simple delay. In order to keep track of the update process, the application reports information using the following object in the twin's reported properties:

        {
            "properties": {
                ...
                "reported": {
                    "telemetryConfig": {
                        "changeId": "{id of the active configuration}",
                        "sendFrequency": "{active configuration}",
                        "status": "{Success | Pending | Error}",
                        "pendingConfig": {
                            "changeId": "{id of the pending configuration}",
                            "sendFrequency": "{pending configuration}"
                        }
                    }
                }
                ...
            }
        }

Note how the **telemetryConfig** property mirrors its desired counterpart, but adds information about the status of the configuration update process, and distinguishes between active and pending configurations.

This tutorial shows you how to:

- Use the Azure portal to create an IoT hub.
- Create a device identity in your IoT hub using the **iothubexplorer** Node.js tool.
- Create a simulated device that receives configuration updates from the back end and reports multiple updates as *reported properties* on the configuration update process.
- Create a back-end app that updates the desired configuration of a device, and then queries the configuration update process.

At the end of this tutorial, you have two Node.js console applications:

* **SimulateDeviceConfiguration.js**, a simulated device app that waits for a desired configuration update and reports the status of a simulated configuration update process.
* **SetDesiredConfigurationAndQuery.js**, a Node.js app meant to be run from the cloud, which sets the desired configuration on a device and queries the configuration update process.

> [AZURE.NOTE] The article [IoT Hub SDKs][lnk-hub-sdks] provides information about the various SDKs that you can use to build both device and back-end applications.

To complete this tutorial you need the following:

+ Node.js version 0.12.x or later. <br/> [Prepare your development environment][lnk-dev-setup] describes how to install Node.js for this tutorial on either Windows or Linux.

+ An active Azure account. (If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][lnk-free-trial].)

[AZURE.INCLUDE [iot-hub-get-started-create-hub-pp](../../includes/iot-hub-get-started-create-hub-pp.md)]

## Create the simulated device app

In this section, you create a Node.js console app that connects to your hub as **myDeviceId**, waits for a desired configuration update and then reports updates on the simulated configuration update process.

1. Create a new empty folder called **simulatedeviceconfiguration**. In the **simulatedeviceconfiguration** folder, create a new package.json file using the following command at your command-prompt. Accept all the defaults:

    ```
    npm init
    ```

2. At your command-prompt in the **simulatedeviceconfiguration** folder, run the following command to install the **azure-iot-device**, and **azure-iot-device-mqtt** package:

    ```
    npm install azure-iot-device azure-iot-device-mqtt --save
    ```

3. Using a text editor, create a new **SimulateDeviceConfiguration.js** file in the **simulatedeviceconfiguration** folder.

4. Add the following code to the **SimulateDeviceConfiguration.js** file, and substitute the **{device connection string}** placeholder with the connection string you copied when you created the **myDeviceId** device identity:

        'use strict';
        var Client = require('azure-iot-device').Client;
        var Protocol = require('azure-iot-device-mqtt').Mqtt;

        var connectionString = '{device connection string}';
        var client = Client.fromConnectionString(connectionString, Protocol);

        client.open(function(err) {
            if (err) {
                console.error('could not open IotHub client');
            } else {
                client.getDeviceTwin(function(err, twin) {
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

    The **Client** object exposes all the methods required to interact with device twins from the device. The previous code, after it initializes the **Client** object, retrieves the twin for **myDeviceId**, and attaches a handler for the update on desired properties. The handler verifies that there is an actual configuration change request by comparing the configIds, then invokes a method that starts the configuration change.

    Note that for the sake of simplicity, the previous code uses a hard-coded default for the inital configuration. A real app would probably load that configuration from a local storage.
    
> [AZURE.IMPORTANT] Since desired property change events are always emitted once at device connection, the handler function has to verify that there is an actual change in the desired properties.

5. Add the following methods before the `client.open()` invocation:

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

    The **initConfigChange** method updates reported properties on the local twin object with the config update request and sets the status to **Pending**, then creates a patch to update the device twin on the service. After successfully updating the twin, it simulates a long running process that terminates in the execution of **completeConfigChange**. This method updates the local twin's reported properties setting the status to **Success** and removing the **pendingConfig** object. It then updates the twin on the service.

> [AZURE.NOTE] This tutorial does not simulate any behavior for concurrent configuration updates. Some configuration update processes might be able to accommodate changes of target configuration while running, others might have to queue them, and others could reject them with an error condition. The device app code should deal with the above conditions by reporting changes of the configuration update status accordingly.

6. Run the device app:

        node SimulateDeviceConfiguration.js

    You should see the message `retrieve device twin`. Keep the app running.

## Create the service app

In this section, you create a Node.js console app that updates the *desired properties* on the twin associated with **myDeviceId** with a new telemetry configuration object. It then queries the twin collection stored in the hub and shows the difference between the desired and reported configurations of the device.

1. Create a new empty folder called **setdesiredandqueryapp**. In the **setdesiredandqueryapp** folder, create a new package.json file using the following command at your command-prompt. Accept all the defaults:

    ```
    npm init
    ```

2. At your command-prompt in the **setdesiredandqueryapp** folder, run the following command to install the **azure-iothub** package:

    ```
    npm install azure-iothub node-uuid --save
    ```

3. Using a text editor, create a new **SetDesiredAndQuery.js** file in the **addtagsandqueryapp** folder.

4. Add the following code to the **SetDesiredAndQuery.js** file, and substitute the **{service connection string}** placeholder with the connection string you copied when you created your hub:

        'use strict';
        var iothub = require('azure-iothub');
        var uuid = require('node-uuid');
        var connectionString = '{service connection string}';
        var registry = iothub.Registry.fromConnectionString(connectionString);
         
        registry.getDeviceTwin('myDeviceId', function(err, twin){
            if (err) {
                console.error(err.constructor.name + ': ' + err.message);
            } else {
                var newConfigId = uuid.v4();
                var newFrequency = process.argv[2] || "5m";
                var patch = {
                    properties: {
                        desired: {
                            telemetryConfig: {
                                configId: newConfigId,
                                sendFrequency: newFrequency
                            }
                        }
                    }
                }
                twin.update(patch, function(err) {
                    if (err) {
                        console.error('Could not update twin: ' + err.constructor.name + ': ' + err.message);
                    } else {
                        console.log(twin.deviceId + ' twin updated successfully');
                    }
                });
                setInterval(queryTwins, 10000);
            }
        });
            

    The **Registry** object exposes all the methods required to interact with device twins from the service. The previous code, after it initializes the **Registry** object, retrieves the twin for **myDeviceId**, and updates its desired properties with a new telemetry configuration object. After that, it calls the **queryTwins** function event 10 seconds.

    In the previous code, the app only changes the configuration of a single device. Use [Jobs][lnk-devguide-jobs] to simultaneously change the desired state of large sets of devices.

> [AZURE.IMPORTANT] In a real back-end app, you use queries to generate user-facing reports across many devices, which are not generated at such a high frequency. If your solution requires real-time notifications of device events use [device-to-cloud messages][lnk-d2c].

7. Add the following code right before the `registry.getDeviceTwin()` invocation to implement the **queryTwins** function:

        var queryTwins = function() {
            var query = registry.createQuery("SELECT * FROM devices WHERE deviceId = 'myDeviceId'", 100);
            query.nextAsTwin(function(err, results) {
                if (err) {
                    console.error('Failed to fetch the results: ' + err.message);
                } else {
                    console.log();
                    results.forEach(function(twin) {
                        var desiredConfig = twin.properties.desired.telemetryConfig;
                        var reportedConfig = twin.properties.reported.telemetryConfig;
                        console.log("Config report for: " + twin.deviceId);
                        console.log("Desired: ");
                        console.log(JSON.stringify(desiredConfig, null, 2));
                        console.log("Reported: ");
                        console.log(JSON.stringify(reportedConfig, null, 2));
                    });
                }
            });
        };

    The previous code queries the twin collection on the hub and prints the desired and reported telemetry configurations. Refer to the [IoT Hub query language][lnk-query] to learn how to generate rich reports across all your devices.


8. With **SimulateDeviceConfiguration.js** running, run the application with:

        node SetDesiredAndQuery.js 5m

    You should see the reported configuration change from **Success** to **Pending** to **Success** again with the new active send frequency of five minutes instead of 24 hours.

> [AZURE.IMPORTANT] There is a delay of up to a minute between the device report operation and the query result. This is to enable the query infrastructure to work at very high scale. To retrieve consistent views of a single twin use the **getDeviceTwin** method in the **Registry** class.

# Next steps

In this tutorial, you set a desired configuration as *desired properties* from a back-end application, and wrote a simulated device app to detect that change and simulate a multi-step update process reporting its status as *reported properties* to the twin.

To continue exploring other IoT scenarios see:

- [Connecting your device][lnk-connect-device]
- [Getting started with device management][lnk-device-management]
- [Getting started with the Gateway SDK][lnk-gateway-SDK]

To learn how to extend your IoT solution to send telemetry from devices follow the [Get started with IoT Hub][lnk-iothub-getstarted] tutorial. To learn how to schedule or perform operations on large sets of devices see the [Use jobs to schedule and broadcast device operations][lnk-schedule-jobs] tutorial.


<!-- links -->
[lnk-hub-sdks]: iot-hub-devguide-sdks.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[lnk-devguide-jobs]: iot-hub-devguide-jobs.md
[lnk-query]: iot-hub-devguide-query-language.md
[lnk-d2c]: iot-hub-devguide-messaging.md#device-to-cloud-messages
[lnk-methods]: iot-hub-devguide-direct-methods.md
[lnk-dm-overview]: iot-hub-device-management-overview.md
[lnk-twin-tutorial]: iot-hub-node-node-twin-getstarted.md
[lnk-schedule-jobs]: iot-hub-schedule-jobs.md