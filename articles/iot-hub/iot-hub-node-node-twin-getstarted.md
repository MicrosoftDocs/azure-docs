---
title: Get started with Azure IoT Hub device twins (Node) | Microsoft Docs
description: How to use Azure IoT Hub device twins to add tags and then use an IoT Hub query. You use the Azure IoT SDKs for Node.js to implement the simulated device app and a service app that adds the tags and runs the IoT Hub query.
services: iot-hub
documentationcenter: node
author: fsautomata
manager: timlt
editor: ''

ms.assetid: 314c88e4-cce1-441c-b75a-d2e08e39ae7d
ms.service: iot-hub
ms.devlang: node
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/13/2016
ms.author: elioda

---
# Get started with device twins (Node)
[!INCLUDE [iot-hub-selector-twin-get-started](../../includes/iot-hub-selector-twin-get-started.md)]

At the end of this tutorial, you will have two Node.js console apps:

* **AddTagsAndQuery.js**, a Node.js back-end app, which adds tags and queries device twins.
* **TwinSimulatedDevice.js**, a Node.js app which simulates a device that connects to your IoT hub with the device identity created earlier, and reports its connectivity condition.

> [!NOTE]
> The article [Azure IoT SDKs][lnk-hub-sdks] provides information about the Azure IoT SDKs that you can use to build both device and back-end apps.
> 
> 

To complete this tutorial you need the following:

* Node.js version 0.10.x or later.
* An active Azure account. (If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.)

[!INCLUDE [iot-hub-get-started-create-hub](../../includes/iot-hub-get-started-create-hub.md)]

[!INCLUDE [iot-hub-get-started-create-device-identity](../../includes/iot-hub-get-started-create-device-identity.md)]

## Create the service app
In this section, you create a Node.js console app that adds location metadata to the device twin associated with **myDeviceId**. It then queries the device twins stored in the IoT hub selecting the devices located in the US, and then the ones that reporting a cellular connection.

1. Create a new empty folder called **addtagsandqueryapp**. In the **addtagsandqueryapp** folder, create a new package.json file using the following command at your command prompt. Accept all the defaults:
   
    ```
    npm init
    ```
2. At your command prompt in the **addtagsandqueryapp** folder, run the following command to install the **azure-iothub** package:
   
    ```
    npm install azure-iothub --save
    ```
3. Using a text editor, create a new **AddTagsAndQuery.js** file in the **addtagsandqueryapp** folder.
4. Add the following code to the **AddTagsAndQuery.js** file, and substitute the **{iot hub connection string}** placeholder with the IoT Hub connection string you copied when you created your hub:
   
        'use strict';
        var iothub = require('azure-iothub');
        var connectionString = '{iot hub connection string}';
        var registry = iothub.Registry.fromConnectionString(connectionString);
   
        registry.getTwin('myDeviceId', function(err, twin){
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
   
    The **Registry** object exposes all the methods required to interact with device twins from the service. The previous code first initializes the **Registry** object, then retrieves the device twin for **myDeviceId**, and finally updates its tags with the desired location information.
   
    After the updating the tags it calls the **queryTwins** function.
5. Add the following code at the end of  **AddTagsAndQuery.js** to implement the **queryTwins** function:
   
        var queryTwins = function() {
            var query = registry.createQuery("SELECT * FROM devices WHERE tags.location.plant = 'Redmond43'", 100);
            query.nextAsTwin(function(err, results) {
                if (err) {
                    console.error('Failed to fetch the results: ' + err.message);
                } else {
                    console.log("Devices in Redmond43: " + results.map(function(twin) {return twin.deviceId}).join(','));
                }
            });
   
            query = registry.createQuery("SELECT * FROM devices WHERE tags.location.plant = 'Redmond43' AND properties.reported.connectivity.type = 'cellular'", 100);
            query.nextAsTwin(function(err, results) {
                if (err) {
                    console.error('Failed to fetch the results: ' + err.message);
                } else {
                    console.log("Devices in Redmond43 using cellular network: " + results.map(function(twin) {return twin.deviceId}).join(','));
                }
            });
        };
   
    The previous code executes two queries: the first selects only the device twins of devices located in the **Redmond43** plant, and the second refines the query to select only the devices that are also connected through cellular network.
   
    Note that the previous code, when it creates the **query** object, specifies a maximum number of returned documents. The **query** object contains a **hasMoreResults** boolean property that you can use to invoke the **nextAsTwin** methods multiple times to retrieve all results. A method called **next** is available for results that are not device twins for example, results of aggregation queries.
6. Run the application with:
   
        node AddTagsAndQuery.js
   
    You should see one device in the results for the query asking for all devices located in **Redmond43** and none for the query that restricts the results to devices that use a cellular network.
   
    ![][1]

In the next section you create a device app that reports the connectivity information and changes the result of the query in the previous section.

## Create the device app
In this section, you create a Node.js console app that connects to your hub as **myDeviceId**, and then updates its device twin's reported properties to contain the information that it is connected using a cellular network.

> [!NOTE]
> At this time, device twins are accessible only from devices that connect to IoT Hub using the MQTT protocol. Please refer to the [MQTT support][lnk-devguide-mqtt] article for instructions on how to convert existing device app to use MQTT.
> 
> 

1. Create a new empty folder called **reportconnectivity**. In the **reportconnectivity** folder, create a new package.json file using the following command at your command prompt. Accept all the defaults:
   
    ```
    npm init
    ```
2. At your command prompt in the **reportconnectivity** folder, run the following command to install the **azure-iot-device**, and **azure-iot-device-mqtt** package:
   
    ```
    npm install azure-iot-device azure-iot-device-mqtt --save
    ```
3. Using a text editor, create a new **ReportConnectivity.js** file in the **reportconnectivity** folder.
4. Add the following code to the **ReportConnectivity.js** file, and substitute the **{device connection string}** placeholder with the device connection string you copied when you created the **myDeviceId** device identity:
   
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
   
            client.getTwin(function(err, twin) {
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
   
    The **Client** object exposes all the methods you require to interact with device twins from the device. The previous code, after it initializes the **Client** object, retrieves the device twin for **myDeviceId** and updates its reported property with the connectivity information.
5. Run the device app
   
        node ReportConnectivity.js
   
    You should see the message `twin state reported`.
6. Now that the device reported its connectivity information, it should appear in both queries. Go back in the **addtagsandqueryapp** folder and run the queries again:
   
        node AddTagsAndQuery.js
   
    This time **myDeviceId** should appear in both query results.
   
    ![][3]

## Next steps
In this tutorial, you configured a new IoT hub in the Azure portal, and then created a device identity in the IoT hub's identity registry. You added device metadata as tags from a back-end app, and wrote a simulated device app to report device connectivity information in the device twin. You also learned how to query this information using the SQL-like IoT Hub query language.

Use the following resources to learn how to:

* send telemetry from devices with the [Get started with IoT Hub][lnk-iothub-getstarted] tutorial,
* configure devices using device twin's desired properties with the [Use desired properties to configure devices][lnk-twin-how-to-configure] tutorial,
* control devices interactively (such as turning on a fan from a user-controlled app), with the [Use direct methods][lnk-methods-tutorial] tutorial.

<!-- images -->
[1]: media/iot-hub-node-node-twin-getstarted/service1.png
[3]: media/iot-hub-node-node-twin-getstarted/service2.png

<!-- links -->
[lnk-hub-sdks]: iot-hub-devguide-sdks.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[lnk-d2c]: iot-hub-devguide-messaging.md#device-to-cloud-messages
[lnk-methods]: iot-hub-devguide-direct-methods.md
[lnk-twins]: iot-hub-devguide-device-twins.md
[lnk-query]: iot-hub-devguide-query-language.md
[lnk-identity]: iot-hub-devguide-identity-registry.md

[lnk-iothub-getstarted]: iot-hub-node-node-getstarted.md
[lnk-device-management]: iot-hub-node-node-device-management-get-started.md
[lnk-iot-edge]: iot-hub-linux-iot-edge-get-started.md
[lnk-connect-device]: https://azure.microsoft.com/develop/iot/

[lnk-twin-how-to-configure]: iot-hub-node-node-twin-how-to-configure.md
[lnk-dev-setup]: https://github.com/Azure/azure-iot-sdk-node/tree/master/doc/node-devbox-setup.md

[lnk-methods-tutorial]: iot-hub-node-node-direct-methods.md
[lnk-devguide-mqtt]: iot-hub-mqtt-support.md
