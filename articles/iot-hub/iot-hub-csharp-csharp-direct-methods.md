---
title: Use Azure IoT Hub direct methods (.NET/.NET) | Microsoft Docs
description: How to use Azure IoT Hub direct methods. You use the Azure IoT device SDK for .NET to implement a simulated device app that includes a direct method and the Azure IoT service SDK for .NET to implement a service app that invokes the direct method.
services: iot-hub
documentationcenter: ''
author: dsk-2015
manager: timlt
editor: ''

ms.assetid: ab035b8e-bff8-4e12-9536-f31d6b6fe425
ms.service: iot-hub
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/18/2017
ms.author: dkshir

---
# Use direct methods (.NET/.NET)
[!INCLUDE [iot-hub-selector-c2d-methods](../../includes/iot-hub-selector-c2d-methods.md)]

In this tutorial, we are going to develop two .NET console apps:

* **CallMethodOnDevice**, a back-end app, which calls a method in the simulated device app and displays the response.
* **SimulateDeviceMethods**, a console app which simulates a device connecting to your IoT hub with the device identity created earlier, and responds to the method called by the cloud.

> [!NOTE]
> The article [Azure IoT SDKs][lnk-hub-sdks] provides information about the Azure IoT SDKs that you can use to build both applications to run on devices and your solution back end.
> 
> 

To complete this tutorial, you need:

* Visual Studio 2015 or Visual Studio 2017.
* An active Azure account. (If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.)

[!INCLUDE [iot-hub-get-started-create-hub](../../includes/iot-hub-get-started-create-hub.md)]

[!INCLUDE [iot-hub-get-started-create-device-identity-portal](../../includes/iot-hub-get-started-create-device-identity-portal.md)]

If you want to create the device identity programmatically instead, read the corresponding section in the [Connect your simulated device to your IoT hub using .NET][lnk-device-identity-csharp] article.


## Create a simulated device app
In this section, you create a .NET console app that responds to a method called by the solution back end.

1. In Visual Studio, add a Visual C# Windows Classic Desktop project to the current solution by using the **Console Application** project template. Name the project **SimulateDeviceMethods**.
   
    ![New Visual C# Windows Classic device app][img-createdeviceapp]
    
1. In Solution Explorer, right-click the **SimulateDeviceMethods** project, and then click **Manage NuGet Packages...**.
1. In the **NuGet Package Manager** window, select **Browse** and search for **microsoft.azure.devices.client**. Select **Install** to install the **Microsoft.Azure.Devices.Client** package, and accept the terms of use. This procedure downloads, installs, and adds a reference to the [Azure IoT device SDK][lnk-nuget-client-sdk] NuGet package and its dependencies.
   
    ![NuGet Package Manager window Client app][img-clientnuget]
1. Add the following `using` statements at the top of the **Program.cs** file:
   
        using Microsoft.Azure.Devices.Client;
        using Microsoft.Azure.Devices.Shared;

1. Add the following fields to the **Program** class. Replace the placeholder value with the device connection string that you noted in the previous section.
   
        static string DeviceConnectionString = "HostName=<yourIotHubName>.azure-devices.net;DeviceId=<yourIotDeviceName>;SharedAccessKey=<yourIotDeviceAccessKey>";
        static DeviceClient Client = null;

1. Add the following to implement the direct method on the device:

        static Task<MethodResponse> WriteLineToConsole(MethodRequest methodRequest, object userContext)
        {
            Console.WriteLine();
            Console.WriteLine("\t{0}", methodRequest.DataAsJson);
            Console.WriteLine("\nReturning response for method {0}", methodRequest.Name);

            string result = "'Input was written to log.'";
            return Task.FromResult(new MethodResponse(Encoding.UTF8.GetBytes(result), 200));
        }

1. Finally, add the following code to the **Main** method to open the connection to your IoT hub and initialize the method listener:
   
        try
        {
            Console.WriteLine("Connecting to hub");
            Client = DeviceClient.CreateFromConnectionString(DeviceConnectionString, TransportType.Mqtt);

            // setup callback for "writeLine" method
            Client.SetMethodHandlerAsync("writeLine", WriteLineToConsole, null).Wait();
            Console.WriteLine("Waiting for direct method call\n Press enter to exit.");
            Console.ReadLine();

            Console.WriteLine("Exiting...");

            // as a good practice, remove the "writeLine" handler
            Client.SetMethodHandlerAsync("writeLine", null, null).Wait();
            Client.CloseAsync().Wait();
        }
        catch (Exception ex)
        {
            Console.WriteLine();
            Console.WriteLine("Error in sample: {0}", ex.Message);
        }
        
1. In the Visual Studio Solution Explorer, right-click your solution, and then click **Set StartUp Projects...**. Select **Single startup project**, and then select the **SimulateDeviceMethods** project in the dropdown menu.        

> [!NOTE]
> To keep things simple, this tutorial does not implement any retry policy. In production code, you should implement retry policies (such as connection retry), as suggested in the MSDN article [Transient Fault Handling][lnk-transient-faults].
> 
> 

## Call a direct method on a device
In this section, you create a .NET console app that calls a method in the simulated device app and then displays the response.

1. In Visual Studio, add a Visual C# Windows Classic Desktop project to the current solution by using the **Console Application** project template. Make sure the .NET Framework version is 4.5.1 or later. Name the project **CallMethodOnDevice**.
   
    ![New Visual C# Windows Classic Desktop project][img-createserviceapp]
2. In Solution Explorer, right-click the **CallMethodOnDevice** project, and then click **Manage NuGet Packages...**.
3. In the **NuGet Package Manager** window, select **Browse**, search for **microsoft.azure.devices**, select **Install** to install the **Microsoft.Azure.Devices** package, and accept the terms of use. This procedure downloads, installs, and adds a reference to the [Azure IoT service SDK][lnk-nuget-service-sdk] NuGet package and its dependencies.
   
    ![NuGet Package Manager window][img-servicenuget]

4. Add the following `using` statements at the top of the **Program.cs** file:
   
        using System.Threading.Tasks;
        using Microsoft.Azure.Devices;
5. Add the following fields to the **Program** class. Replace the placeholder value with the IoT Hub connection string for the hub that you created in the previous section.
   
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

1. In the Visual Studio Solution Explorer, right-click your solution, and then click **Set StartUp Projects...**. Select **Single startup project**, and then select the **CallMethodOnDevice** project in the dropdown menu.

## Run the applications
You are now ready to run the applications.

1. Run the .NET device app **SimulateDeviceMethods**. It should start listening for method calls from your IoT Hub: 

    ![Device app run][img-deviceapprun]
1. Now that the device is connected and waiting for method invocations, run the .NET **CallMethodOnDevice** app to invoke the method in the simulated device app. You should see the device response written in the console.
   
    ![Service app run][img-serviceapprun]
1. The device then reacts to the method by printing this message:
   
    ![Direct method invoked on the device][img-directmethodinvoked]

## Next steps
In this tutorial, you configured a new IoT hub in the Azure portal, and then created a device identity in the IoT hub's identity registry. You used this device identity to enable the simulated device app to react to methods invoked by the cloud. You also created an app that invokes methods on the device and displays the response from the device. 

To continue getting started with IoT Hub and to explore other IoT scenarios, see:

* [Get started with IoT Hub]
* [Schedule jobs on multiple devices][lnk-devguide-jobs]

To learn how to extend your IoT solution and schedule method calls on multiple devices, see the [Schedule and broadcast jobs][lnk-tutorial-jobs] tutorial.

<!-- Images. -->
[img-createdeviceapp]: ./media/iot-hub-csharp-csharp-direct-methods/create-device-app.png
[img-clientnuget]: ./media/iot-hub-csharp-csharp-direct-methods/device-app-nuget.png
[img-createserviceapp]: ./media/iot-hub-csharp-csharp-direct-methods/create-service-app.png
[img-servicenuget]: ./media/iot-hub-csharp-csharp-direct-methods/service-app-nuget.png
[img-deviceapprun]: ./media/iot-hub-csharp-csharp-direct-methods/run-device-app.png
[img-serviceapprun]: ./media/iot-hub-csharp-csharp-direct-methods/run-service-app.png
[img-directmethodinvoked]: ./media/iot-hub-csharp-csharp-direct-methods/direct-method-invoked.png

<!-- Links -->
[lnk-transient-faults]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx

[lnk-hub-sdks]: iot-hub-devguide-sdks.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-nuget-client-sdk]: https://www.nuget.org/packages/Microsoft.Azure.Devices.Client/
[lnk-nuget-service-sdk]: https://www.nuget.org/packages/Microsoft.Azure.Devices/

[lnk-device-identity-csharp]: iot-hub-csharp-csharp-getstarted.md#DeviceIdentity_csharp

[lnk-devguide-jobs]: iot-hub-devguide-jobs.md
[lnk-tutorial-jobs]: iot-hub-node-node-schedule-jobs.md

[Get started with IoT Hub]: iot-hub-node-node-getstarted.md
