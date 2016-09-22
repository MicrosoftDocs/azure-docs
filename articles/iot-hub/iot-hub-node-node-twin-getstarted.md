<properties
	pageTitle="Get started with twins | Microsoft Azure"
	description="This tutorial shows you how to use twins"
	services="iot-hub"
	documentationCenter="node"
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

# Tutorial: Get started with IoT Hub twins

## Introduction

Device twins are JSON documents persisted in an IoT hub that are used to store device meta-data and to facilitate the synchronization of device configurations and conditions between an IoT solution's device app and back end.

Common use cases include:

* Solution back ends storing device meta-data.
* Device apps reporting current state information such as available capabilities and device conditions (such as whether the device is connected through wifi).
* Device apps and back ends synchronizing the state of long-running workflows (for example,firmware or configuration updates).
* Solution back ends querying devices based on meta-data, configuration, or conditions.

>AZURE.NOTE Twins are designed for synchronization and for querying  device configurations and conditions. Use [device-to-cloud messages][lnk-d2c] for sequences of timestamped events (such as telemetry streams of time-based sensor data) and [cloud-to-device methods][lnk-methods] for interactive control of devices, such as turning on a fan from a user-controlled app.

A device twin contains *tags*, device meta-data accessible only by the back end, and *desired properties* in a JSON object modifiable by the back end and observable by the device app. A device twin contains *reported properties* in a JSON object modifiable by the device app and readable by the back end. Tags and properties cannot contain arrays, but objects can be nested. Additionally, the app back end can query device twins based on all the above data. 

Refer to [Use device twins to synchronize state and configurations][lnk-twins] for more information about twins and to the [IoT Hub query language][lnk-query] reference for querying.

This tutorial shows you how to:

- Use the Azure portal to create an IoT hub.
- Create a device identity in your IoT hub using the **iothubexplorer** Node.js tool.
- Create a cloud back-end app that adds *tags* to a device twin, and a simulated device that reports its connectivity channel as a *reported property* on the device twin.
- From a back-end app, query devices in the IoT hub using filters on the tags and properties previously created.

At the end of this tutorial, you have two Node.js console applications:

* **AddTagsAndQuery.js**, a Node.js app meant to be run from the cloud, which adds device tags and queries twins.
* **TwinSimulatedDevice.js**, a Node.js app which simulates a device that connects to your IoT hub with the device identity created earlier, and reports its connectivity condition.

> [AZURE.NOTE] The article [IoT Hub SDKs][lnk-hub-sdks] provides information about the various SDKs that you can use to build both device and back-end applications.

To complete this tutorial you need the following:

+ Node.js version 0.12.x or later. <br/> [Prepare your development environment][lnk-dev-setup] describes how to install Node.js for this tutorial on either Windows or Linux.

+ An active Azure account. (If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][lnk-free-trial].)

[AZURE.INCLUDE [iot-hub-get-started-create-hub-pp](../../includes/iot-hub-get-started-create-hub-pp.md)]

## Create the service app

In this section, you create a Node.js console app that adds location meta-data to the twin associated with **myDeviceId**. It then queries the twin collection stored in the hub selecting the devices located in the US, and then the devices that report they are connected using cellular network.

1. Create a new empty folder called **addtagsandqueryapp**. In the **addtagsandqueryapp** folder, create a new package.json file using the following command at your command-prompt. Accept all the defaults:

    ```
    npm init
    ```

2. At your command-prompt in the **addtagsandqueryapp** folder, run the following command to install the **azure-iothub** package:

    ```
    npm install azure-iothub --save
    ```

3. Using a text editor, create a new **AddTagsAndQuery.js** file in the **addtagsandqueryapp** folder.

4. Add the following code to the **AddTagsAndQuery.js** file, and substitute the **{service connection string}** placeholder with the connection string you copied when you created your hub:

        'use strict';
        var iothub = require('azure-iothub');
        var connectionString = '{service hub connection string}';
        var registry = iothub.Registry.fromConnectionString(connectionString);

        registry.getDeviceTwin('myDeviceId', function(err, twin){
            if (err) {
                console.error(err.constructor.name + ': ' + err.message);
            } else {
                var patch = {
                    tags: {
                        location: {
                            region: 'US',
                            plant: 'Redmond43'
                      }
                    }
                };
             
                twin.update(patch, function(err) {
                  if (err) {
                    console.error('Could not update twin: ' + err.constructor.name + ': ' + err.message);
                  } else {
                    console.log(twin.deviceId + ' twin updated successfully');
                    queryTwins();
                  }
                });
            }
        });

    The **Registry** object exposes all the methods required to interact with device twins from the service. The previous code first initializes the **Registry** object, then retrieves the twin for **myDeviceId**, and finally updates its tags with the desired location information.

    After the updating the tags it calls the **queryTwins** function.

7. Add the following code at the end of  **AddTagsAndQuery.js** to implement the **queryTwins** function:

        var queryTwins = function() {
            var query = registry.createQuery("SELECT * FROM devices WHERE tags.location.plant = 'Redmond43'", 100);
            query.nextAsTwin(function(err, results) {
                if (err) {
                    console.error('Failed to fetch the results: ' + err.message);
                } else {
                    console.log("Devices in Redmond43: " + results.map(function(twin) {return twin.deviceId}).join(','));
                }
            });
            
            query = registry.createQuery("SELECT * FROM devices WHERE tags.building = '43' AND properties.reported.connectivity.type = 'cellular'", 100);
            query.nextAsTwin(function(err, results) {
                if (err) {
                    console.error('Failed to fetch the results: ' + err.message);
                } else {
                    console.log("Devices in Redmond43 using cellular network: " + results.map(function(twin) {return twin.deviceId}).join(','));
                }
            });
        };

    The previous code executes two queries: the first selects only the twins of devices located in the **Redmond43** plant, and the second refines the query to select only the devices that are also connected through cellular network.

    Note that the previous code, when it creates the **query** object, specifies a maximum number of returned documents. The **query** object contains a **hasMoreResults** boolean property that you can use to invoke the **nextAsTwin** methods multiple times to retrieve all results. A method called **next** is available for results that are not twins for example, results of aggregation queries.

8. Run the application with:

        node AddTagsAndQuery.js

    You should see one device in the results for the query asking for all devices located in **Redmond43** and none for the query that restricts the results to devices that use a cellular network.

    ![][1]

In the next section you create a device app that reports the connectivity information and changes the result of the query in the previous section.

# Create the device app

In this section, you create a Node.js console app that connects to your hub as **myDeviceId**, and then updates its twin's reported properties to contain the information that it is connected using a cellular network.

1. Create a new empty folder called **reportconnectivity**. In the **reportconnectivity** folder, create a new package.json file using the following command at your command-prompt. Accept all the defaults:

    ```
    npm init
    ```

2. At your command-prompt in the **reportconnectivity** folder, run the following command to install the **azure-iot-device**, and **azure-iot-device-mqtt** package:

    ```
    npm install azure-iot-device azure-iot-device-mqtt --save
    ```

3. Using a text editor, create a new **ReportConnectivity.js** file in the **reportconnectivity** folder.

4. Add the following code to the **ReportConnectivity.js** file, and substitute the **{device connection string}** placeholder with the connection string you copied when you created the **myDeviceId** device identity:

        'use strict';
        var Client = require('azure-iot-device').Client;
        var Protocol = require('azure-iot-device-mqtt').Mqtt;

        var connectionString = '{device connection string}';
        var client = Client.fromConnectionString(connectionString, Protocol);

        client.open(function(err) {
        if (err) {
            console.error('could not open IotHub client');
        }  else {
            console.log('client opened');

            client.getDeviceTwin(function(err, twin) {
            if (err) {
                console.error('could not get twin');
            } else {
                var patch = {
                    connectivity: {
                        type: 'cellular'
                    }
                };

                twin.properties.reported.update(patch, function(err) {
                    if (err) {
                        console.error('could not update twin');
                    } else {
                        console.log('twin state reported');
                        process.exit();
                    }
                });
            }
            });
        }
        });

    The **Client** object exposes all the methods you require to interact with device twins from the device. The previous code, after it initializes the **Client** object, retrieves the twin for **myDeviceId** and updates its reported property with the connectivity information.

5. Run the device app

        node ReportConnectivity.js

    You should see the message `twin state reported`.

6. Now that the device reported its connectivity information, it should appear in both queries. Go back in the **addtagsandqueryapp** folder and run the queries again:

        node AddTagsAndQuery.js

    This time **myDeviceId** should appear in both query results.

    ![][3]

# Next steps
In this tutorial, you configured a new IoT hub in the portal, and then created a device identity in the hub's identity registry. You added device meta-data as tags from a back-end application, and wrote a simulated device app to report device connectivity information in the device twin. You also learned how to query this information using the IoT Hub SQL-like query language.

To continue getting started with IoT Hub and to explore other IoT scenarios see:

- [Connecting your device][lnk-connect-device]
- [Getting started with device management][lnk-device-management]
- [Getting started with the Gateway SDK][lnk-gateway-SDK]

To learn how to extend your IoT solution to send telemetry from devices follow the [Get started with IoT Hub][lnk-iothub-getstarted] tutorial. To learn about twin's desired properties follow the [Use desired properties to configure devices][lnk-twin-how-to-configure] tutorial.

<!-- images -->
[1]: media/iot-hub-node-node-twin-getstarted/service1.png
[3]: media/iot-hub-node-node-twin-getstarted/service2.png


<!-- links -->
[lnk-hub-sdks]: iot-hub-sdks-summary.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[lnk-d2c]: iot-hub-devguide-messaging.md#device-to-cloud-messages
[lnk-methods]: iot-hub-devguide-direct-methods.md
[lnk-twins]: iot-hub-devguide-device-twins.md
[lnk-query]: iot-hub-devguide-query-language.md

[lnk-iothub-getstarted]: iot-hub-node-node-getstarted.md
[lnk-device-management]: iot-hub-device-management-get-started.md
[lnk-gateway-SDK]: iot-hub-linux-gateway-sdk-get-started.md
[lnk-connect-device]: https://azure.microsoft.com/develop/iot/

[lnk-twin-how-to-configure]: iot-hub-node-node-twin-how-to-configure.md



