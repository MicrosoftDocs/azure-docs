<properties
 pageTitle="Use direct methods | Microsoft Azure"
 description="This tutorial shows you how to use direct methods"
 services="iot-hub"
 documentationCenter=""
 authors="nberdy"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="09/30/2016"
 ms.author="nberdy"/>

# Tutorial: Use direct methods

## Introduction

Azure IoT Hub is a fully managed service that enables reliable and secure bi-directional communications between millions of IoT devices and an application back end. Previous tutorials ([Get started with IoT Hub] and [Send Cloud-to-Device messages with IoT Hub]) illustrate the basic device-to-cloud and cloud-to-device messaging functionality of IoT Hub. IoT Hub also gives you the ability to invoke non-durable methods on devices from the cloud. Methods represent a request-reply interaction with a device similar to an HTTP call in that they succeed or fail immediately (after a user-specified timeout) to let the user know the status of the call. [Invoke a direct method on a device][lnk-devguide-methods] describes methods in more detail and offers guidance about when to use methods versus cloud-to-device messages.

This tutorial shows you how to:

- Use the Azure portal to create an IoT hub and create a device identity in your IoT hub.
- Create a simulated device that has a direct method which can be called by the cloud.
- Create a console application that calls a direct method on the simulated device via your IoT hub.

At the end of this tutorial, you have two Node.js console applications:

* **CallMethodOnDevice.js**, which calls a method on the simulated device and displays the response.
* **SimulatedDevice.js**, which connects to your IoT hub with the device identity created earlier, and responds to the method called by the cloud.

> [AZURE.NOTE] The article [IoT Hub SDKs][lnk-hub-sdks] provides information about the various SDKs that you can use to build both applications to run on devices and your solution back end.

To complete this tutorial, you need the following:

+ Node.js version 0.10.x or later.

+ An active Azure account. (If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][lnk-free-trial].)

[AZURE.INCLUDE [iot-hub-get-started-create-hub-pp](../../includes/iot-hub-get-started-create-hub-pp.md)]

## Create a simulated device app

In this section, you create a Node.js console app that responds to a method called by the cloud.

1. Create a new empty folder called **simulateddevice**. In the **simulateddevice** folder, create a package.json file using the following command at your command-prompt. Accept all the defaults:

    ```
    npm init
    ```

2. At your command-prompt in the **simulateddevice** folder, run the following command to install the **azure-iot-device** Device SDK package and **azure-iot-device-mqtt** package:

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

5. Add a **connectionString** variable and use it to create a device client. Replace **{youriothostname}** with the name of the IoT hub you created the *Create an IoT Hub* section. Replace **{yourdevicekey}** with the device key value you generated in the *Create a device identity* section:

    ```
    var connectionString = 'HostName={youriothostname};DeviceId=myDeviceId;SharedAccessKey={yourdevicekey}';
    var client = DeviceClient.fromConnectionString(connectionString, Mqtt);
    ```

6. Add the following function to implement the method on the device:

    ```
    function onWriteLine(request, response) {
        var requestbody = JSON.parse(request.body);
        console.log(requestbody);

        // add some properties to the response
        response.properties = {
            'LineStatus': 'Written'
        };

        response.write('"Input was written to log."');

        response.end(200, function(err) {
            if(!!err) {
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

> [AZURE.NOTE] To keep things simple, this tutorial does not implement any retry policy. In production code, you should implement retry policies (such as connection retry), as suggested in the MSDN article [Transient Fault Handling][lnk-transient-faults].

## Call a method on a device

In this section, you create a Node.js console app that calls a method on the simulated device and then displays the response.

1. Create a new empty folder called **callmethodondevice**. In the **callmethodondevice** folder, create a package.json file using the following command at your command-prompt. Accept all the defaults:

    ```
    npm init
    ```

2. At your command-prompt in the **callmethodondevice** folder, run the following command to install the **azure-iothub** package:

    ```
    npm install azure-iothub --save
    ```

3. Using a text editor, create a **CallMethodOnDevice.js** file in the **callmethodondevice** folder.

4. Add the following `require` statements at the start of the **CallMethodOnDevice.js** file:

    ```
    'use strict';

    var Client = require('azure-iothub').Client;
    ```

5. Add the following variable declaration and replace the placeholder value with the connection string for your IoT hub:

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
        payload: 'a line to be written',
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

7. Save and close the **CallMethodOnDevice.js** file.

## Run the applications

You are now ready to run the applications.

1. At a command-prompt in the **simulateddevice** folder, run the following command to start listening for method calls from your IoT Hub:

    ```
    node SimulatedDevice.js
    ```

    ![][8]
	
2. At a command-prompt in the **callmethodondevice** folder, run the following command to begin monitoring your IoT hub:

    ```
    node CallMethodOnDevice.js 
    ```

	![][7]
	
3. You will see the device react to the method by printing out the message and the application which called the method display the response from the device:

	![][9]
	
## Next steps

In this tutorial, you configured a new IoT hub in the portal, and then created a device identity in the hub's identity registry. You used this device identity to enable the simulated device app to react to methods invoked by the cloud. You also created an app that invokes methods on the device and displays the response from the device. 

To continue getting started with IoT Hub and to explore other IoT scenarios, see:

- [Get started with IoT Hub]
- [Schedule jobs on multiple devices][lnk-devguide-jobs]

To learn how to extend your IoT solution and schedule method calls on multiple devices, see the [Schedule and broadcast jobs][lnk-tutorial-jobs] tutorial.

<!-- Images. -->
[7]: ./media/iot-hub-c2d-methods/run-simulated-device.png
[8]: ./media/iot-hub-c2d-methods/run-callmethodondevice.png
[9]: ./media/iot-hub-c2d-methods/methods-output.png

<!-- Links -->
[lnk-transient-faults]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx

[lnk-dev-setup]: https://github.com/Azure/azure-iot-sdks/blob/master/doc/get_started/node-devbox-setup.md

[lnk-hub-sdks]: iot-hub-devguide-sdks.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-portal]: https://portal.azure.com/

[lnk-devguide-jobs]: iot-hub-devguide-jobs.md
[lnk-tutorial-jobs]: iot-hub-schedule-jobs.md
[lnk-devguide-methods]: iot-hub-devguide-direct-methods.md

[Send Cloud-to-Device messages with IoT Hub]: iot-hub-csharp-csharp-c2d.md
[Process Device-to-Cloud messages]: iot-hub-csharp-csharp-process-d2c.md
[Get started with IoT Hub]: iot-hub-node-node-getstarted.md
