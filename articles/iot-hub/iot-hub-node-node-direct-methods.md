---
title: Azure IoT Hub direct methods (Node) | Microsoft Docs
description: How to use Azure IoT Hub direct methods. You use the Azure IoT SDKs for Node.js to implement a simulated device app that includes a direct method and a service app that invokes the direct method.
services: iot-hub
documentationcenter: ''
author: nberdy
manager: timlt
editor: ''

ms.assetid: ea9c73ca-7778-4e38-a8f1-0bee9d142f04
ms.service: iot-hub
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/05/2017
ms.author: nberdy
ms.custom: H1Hack27Feb2017

---
# Use direct methods on your IoT device with Node.js
[!INCLUDE [iot-hub-selector-c2d-methods](../../includes/iot-hub-selector-c2d-methods.md)]

At the end of this tutorial, you have two Node.js console apps:

* **CallMethodOnDevice.js**, which calls a method in the simulated device app and displays the response.
* **SimulatedDevice.js**, which connects to your IoT hub with the device identity created earlier, and responds to the method called by the cloud.

> [!NOTE]
> The article [Azure IoT SDKs][lnk-hub-sdks] provides information about the Azure IoT SDKs that you can use to build both applications to run on devices and your solution back end.
> 
> 

To complete this tutorial, you need the following:

* Node.js version 0.10.x or later.
* An active Azure account. (If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.)

[!INCLUDE [iot-hub-get-started-create-hub](../../includes/iot-hub-get-started-create-hub.md)]

[!INCLUDE [iot-hub-get-started-create-device-identity](../../includes/iot-hub-get-started-create-device-identity.md)]

## Create a simulated device app
In this section, you create a Node.js console app that responds to a method called by the cloud.

1. Create a new empty folder called **simulateddevice**. In the **simulateddevice** folder, create a package.json file using the following command at your command prompt. Accept all the defaults:
   
    ```
    npm init
    ```
2. At your command prompt in the **simulateddevice** folder, run the following command to install the **azure-iot-device** Device SDK package and **azure-iot-device-mqtt** package:
   
    ```
    npm install azure-iot-device azure-iot-device-mqtt --save
    ```
3. Using a text editor, create a new **SimulatedDevice.js** file in the **simulateddevice** folder.
4. Add the following `require` statements at the start of the **SimulatedDevice.js** file:
   
    ```
    'use strict';
   
    var Mqtt = require('azure-iot-device-mqtt').Mqtt;
    var DeviceClient = require('azure-iot-device').Client;
    ```
5. Add a **connectionString** variable and use it to create a **DeviceClient** instance. Replace **{device connection string}** with the device connection string you generated in the *Create a device identity* section:
   
    ```
    var connectionString = '{device connection string}';
    var client = DeviceClient.fromConnectionString(connectionString, Mqtt);
    ```
6. Add the following function to implement the method on the device:
   
    ```
    function onWriteLine(request, response) {
        console.log(request.payload);
   
        response.send(200, 'Input was written to log.', function(err) {
            if(err) {
                console.error('An error ocurred when sending a method response:\n' + err.toString());
            } else {
                console.log('Response to method \'' + request.methodName + '\' sent successfully.' );
            }
        });
    }
    ```
7. Open the connection to your IoT hub and start initialize the method listener:
   
    ```
    client.open(function(err) {
        if (err) {
            console.error('could not open IotHub client');
        }  else {
            console.log('client opened');
            client.onDeviceMethod('writeLine', onWriteLine);
        }
    });
    ```
8. Save and close the **SimulatedDevice.js** file.

> [!NOTE]
> To keep things simple, this tutorial does not implement any retry policy. In production code, you should implement retry policies (such as connection retry), as suggested in the MSDN article [Transient Fault Handling][lnk-transient-faults].
> 
> 

## Call a method on a device
In this section, you create a Node.js console app that calls a method in the simulated device app and then displays the response.

1. Create a new empty folder called **callmethodondevice**. In the **callmethodondevice** folder, create a package.json file using the following command at your command prompt. Accept all the defaults:
   
    ```
    npm init
    ```
2. At your command prompt in the **callmethodondevice** folder, run the following command to install the **azure-iothub** package:
   
    ```
    npm install azure-iothub --save
    ```
3. Using a text editor, create a **CallMethodOnDevice.js** file in the **callmethodondevice** folder.
4. Add the following `require` statements at the start of the **CallMethodOnDevice.js** file:
   
    ```
    'use strict';
   
    var Client = require('azure-iothub').Client;
    ```
5. Add the following variable declaration and replace the placeholder value with the IoT Hub connection string for your hub:
   
    ```
    var connectionString = '{iothub connection string}';
    var methodName = 'writeLine';
    var deviceId = 'myDeviceId';
    ```
6. Create the client to open the connection to your IoT hub.
   
    ```
    var client = Client.fromConnectionString(connectionString);
    ```
7. Add the following function to invoke the device method and print the device response to the console:
   
    ```
    var methodParams = {
        methodName: methodName,
        payload: 'hello world',
        timeoutInSeconds: 30
    };
   
    client.invokeDeviceMethod(deviceId, methodParams, function (err, result) {
        if (err) {
            console.error('Failed to invoke method \'' + methodName + '\': ' + err.message);
        } else {
            console.log(methodName + ' on ' + deviceId + ':');
            console.log(JSON.stringify(result, null, 2));
        }
    });
    ```
8. Save and close the **CallMethodOnDevice.js** file.

## Run the apps
You are now ready to run the apps.

1. At a command prompt in the **simulateddevice** folder, run the following command to start listening for method calls from your IoT Hub:
   
    ```
    node SimulatedDevice.js
    ```
   
    ![][7]
2. At a command prompt in the **callmethodondevice** folder, run the following command to begin monitoring your IoT hub:
   
    ```
    node CallMethodOnDevice.js 
    ```
   
    ![][8]
3. You will see the device react to the method by printing out the message and the application which called the method display the response from the device:
   
    ![][9]

## Next steps
In this tutorial, you configured a new IoT hub in the Azure portal, and then created a device identity in the IoT hub's identity registry. You used this device identity to enable the simulated device app to react to methods invoked by the cloud. You also created an app that invokes methods on the device and displays the response from the device. 

To continue getting started with IoT Hub and to explore other IoT scenarios, see:

* [Get started with IoT Hub]
* [Schedule jobs on multiple devices][lnk-devguide-jobs]

To learn how to extend your IoT solution and schedule method calls on multiple devices, see the [Schedule and broadcast jobs][lnk-tutorial-jobs] tutorial.

<!-- Images. -->
[7]: ./media/iot-hub-node-node-direct-methods/run-simulated-device.png
[8]: ./media/iot-hub-node-node-direct-methods/run-callmethodondevice.png
[9]: ./media/iot-hub-node-node-direct-methods/methods-output.png

<!-- Links -->
[lnk-transient-faults]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx

[lnk-dev-setup]: https://github.com/Azure/azure-iot-sdk-node/tree/master/doc/node-devbox-setup.md

[lnk-hub-sdks]: iot-hub-devguide-sdks.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-portal]: https://portal.azure.com/

[lnk-devguide-jobs]: iot-hub-devguide-jobs.md
[lnk-tutorial-jobs]: iot-hub-node-node-schedule-jobs.md
[lnk-devguide-methods]: iot-hub-devguide-direct-methods.md
[lnk-devguide-mqtt]: iot-hub-mqtt-support.md

[Send Cloud-to-Device messages with IoT Hub]: iot-hub-csharp-csharp-c2d.md
[Process Device-to-Cloud messages]: iot-hub-csharp-csharp-process-d2c.md
[Get started with IoT Hub]: iot-hub-node-node-getstarted.md
