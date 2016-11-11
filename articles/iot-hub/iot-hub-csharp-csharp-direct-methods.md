---
title: Use direct methods | Microsoft Docs
description: This tutorial shows you how to use direct methods
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
ms.date: 10/05/2016
ms.author: nberdy

---
# Tutorial: Use direct methods
[!INCLUDE [iot-hub-selector-c2d-methods](../../includes/iot-hub-selector-c2d-methods.md)]

At the end of this tutorial, you will have a .NET and a Node.js console application:

* **CallMethodOnDevice.sln**, a .NET app meant to be run from the back end, which calls a method on the simulated device and displays the response.
* **SimulatedDevice.js**, a Node.js app which simulates a device that connects to your IoT hub with the device identity created earlier, and responds to the method called by the cloud.

> [!NOTE]
> The article [Azure IoT SDKs][lnk-hub-sdks] provides information about the various SDKs that you can use to build both applications to run on devices and your solution back end.
> 
> 

To complete this tutorial you need the following:

* Microsoft Visual Studio 2015.
* Node.js version 0.10.x or later.
* An active Azure account. (If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.)

[!INCLUDE [iot-hub-get-started-create-hub-pp](../../includes/iot-hub-get-started-create-hub-pp.md)]

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
5. Add a **connectionString** variable and use it to create a device client. Replace **{device connection string}** with the connection string you generated in the *Create a device identity* section:
   
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
In this section, you create a Node.js console app that calls a method on the simulated device and then displays the response.

1. In Visual Studio, add a Visual C# Windows Classic Desktop project to the current solution by using the **Console Application** project template. Make sure the .NET Framework version is 4.5.1 or later. Name the project **CallMethodOnDevice**.
   
    ![New Visual C# Windows Classic Desktop project][10]
2. In Solution Explorer, right-click the **CallMethodOnDevice** project, and then click **Manage Nuget Packages**.
3. In the **Nuget Package Manager** window, select **Browse**, search for **microsoft.azure.devices**, select **Install** to install the **Microsoft.Azure.Devices** package, and accept the terms of use. This procedure downloads, installs, and adds a reference to the [Microsoft Azure IoT Service SDK][lnk-nuget-service-sdk] Nuget package and its dependencies.
   
    ![Nuget Package Manager window][11]

4. Add the following `using` statements at the top of the **Program.cs** file:
   
        using System.Threading.Tasks;
        using Microsoft.Azure.Devices;
5. Add the following fields to the **Program** class. Replace the placeholder value with the connection string for the IoT hub that you created in the previous section.
   
        static ServiceClient serviceClient;
        static string connectionString = "{iot hub connection string}";
6. Add the following method to the **Program** class:
   
        private static async Task InvokeMethod()
        {
            var methodInvocation = new CloudToDeviceMethod("writeLine") { ResponseTimeout = TimeSpan.FromSeconds(30) };
            methodInvocation.SetPayloadJson("'a line to be written'");

            var response = await serviceClient.InvokeDeviceMethodAsync("myDeviceId", methodInvocation);

            Console.WriteLine("Response status: {0}, payload:", response.Status);
            Console.WriteLine(response.GetPayloadAsJson());
        }
   
    This method invokes a direct method with name `writeLine` on the `myDeviceId` device. Then, it writes the response provided by the device on the console. Note how it is possible to specify a timeout value for the device to respond.
7. Finally, add the following lines to the **Main** method:
   
        serviceClient = ServiceClient.CreateFromConnectionString(connectionString);
        InvokeMethod().Wait();
        Console.WriteLine("Press Enter to exit.");
        Console.ReadLine();

## Run the applications
You are now ready to run the applications.

1. At a command-prompt in the **simulateddevice** folder, run the following command to start listening for method calls from your IoT Hub:
   
    ```
    node SimulatedDevice.js
    ```
   
    ![][7]
2. Now that the device is connected and waiting for method invocations, run the .NET **CallMethodOnDevice** app to invoke the method on the simulated device. You should see the device response written in the console.
   
    ![][8]
3. You will see the device react to the method by printing out the message and the application which called the method display the response from the device:
   
    ![][9]

## Next steps
In this tutorial, you configured a new IoT hub in the Azure portal, and then created a device identity in the hub's identity registry. You used this device identity to enable the simulated device app to react to methods invoked by the cloud. You also created an app that invokes methods on the device and displays the response from the device. 

To continue getting started with IoT Hub and to explore other IoT scenarios, see:

* [Get started with IoT Hub]
* [Schedule jobs on multiple devices][lnk-devguide-jobs]

To learn how to extend your IoT solution and schedule method calls on multiple devices, see the [Schedule and broadcast jobs][lnk-tutorial-jobs] tutorial.

<!-- Images. -->
[7]: ./media/iot-hub-csharp-csharp-direct-methods/run-simulated-device.png
[8]: ./media/iot-hub-csharp-csharp-direct-methods/netserviceapp.png
[9]: ./media/iot-hub-csharp-csharp-direct-methods/methods-output.png

[10]: ./media/iot-hub-csharp-csharp-direct-methods/create-identity-csharp1.png
[11]: ./media/iot-hub-csharp-csharp-direct-methods/create-identity-csharp2.png

<!-- Links -->
[lnk-transient-faults]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx

[lnk-dev-setup]: https://github.com/Azure/azure-iot-sdks/blob/master/doc/get_started/node-devbox-setup.md

[lnk-hub-sdks]: iot-hub-devguide-sdks.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-portal]: https://portal.azure.com/
[lnk-nuget-service-sdk]: https://www.nuget.org/packages/Microsoft.Azure.Devices/

[lnk-devguide-jobs]: iot-hub-devguide-jobs.md
[lnk-tutorial-jobs]: iot-hub-schedule-jobs.md
[lnk-devguide-methods]: iot-hub-devguide-direct-methods.md
[lnk-devguide-mqtt]: iot-hub-mqtt-support.md

[Send Cloud-to-Device messages with IoT Hub]: iot-hub-csharp-csharp-c2d.md
[Process Device-to-Cloud messages]: iot-hub-csharp-csharp-process-d2c.md
[Get started with IoT Hub]: iot-hub-node-node-getstarted.md
