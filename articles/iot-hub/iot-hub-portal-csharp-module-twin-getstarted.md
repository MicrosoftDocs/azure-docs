---
title: Get started with Azure IoT Hub module identity and module twin (portal and .NET) | Microsoft Docs
description: Learn how to create module identity and update module twin using the portal and .NET.
author: dominicbetts
manager: timlt
ms.service: iot-hub
services: iot-hub
ms.devlang: csharp
ms.topic: conceptual
ms.date: 04/26/2018
ms.author: dobett
---
# Get started with IoT Hub module identity and module twin using the portal and .NET device

> [!NOTE]
> [Module identities and module twins](iot-hub-devguide-module-twins.md) are similar to Azure IoT Hub device identity and device twin, but provide finer granularity. While Azure IoT Hub device identity and device twin enable the back-end application to configure a device and provides visibility on the device’s conditions, a module identity and module twin provide these capabilities for individual components of a device. On capable devices with multiple components, such as operating system based devices or firmware devices, it allows for isolated configuration and conditions for each component.
>

In this tutorial, you will learn:

1. how to create a module identity in the portal. 
1. how to use .NET device SDK update the module twin from your device.

> [!NOTE]
> For information about the Azure IoT SDKs that you can use to build both applications to run on devices, and your solution back end, see [Azure IoT SDKs][lnk-hub-sdks].
>

To complete this tutorial, you need the following:

* Visual Studio 2015 or Visual Studio 2017.
* An active Azure account. (If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.)

[!INCLUDE [iot-hub-get-started-create-hub](../../includes/iot-hub-get-started-create-hub.md)]

## Create a device identity in the portal

Now you have your IoT Hub. Open [portal](https://portal.azure.com) and navigate to your IoT Hub. Click on IoT Devices, and then click add to create a device identity. Name it **MyFirstDevice**. 

  ![Create device identity][8]

After save, in your device identity list, you can see MyFirstDevice identity is successfuly created.

  ![Device id created][11]

Now click on the row. You will see device details.

  ![Device details][10]

## Create a module identity in the portal

Within one device identity, you can create up to 20 module identities. Click the **Add Module Identity** button on top to create your first module identity called **myFirstModule**. 

  ![Device details][9]

Save and click the just created module identity. You can see the module identity details. Save the connect string - primary key. It will be used in the next section where you set up your module on the device.

  ![Device details][12]

## Update the module twin using .NET device SDK

You've successfully created the module identity in your IoT Hub. Let's try to communicate to the cloud from your simulated device. Once a module identity is created, a module twin is implicitly created in IoT Hub. In this section, you will create a .NET console app on your simulated device that updates the module twin reported properties.

## Create a Visual Studio project

In Visual Studio, add a Visual C# Windows Classic Desktop project to the existing solution by using the **Console App (.NET Framework)** project template. Make sure the .NET Framework version is 4.6.1 or later. Name the project **UpdateModuleTwinReportedProperties**.

  ![Create a visual studio project][13]

## Install the latest Azure IoT Hub .NET device SDK

Module identity and module twin is in public preview. It's only availble in the IoT Hub prerelease device SDKs. In Visual Studio, open tools > Nuget package manager > manage Nuget packages for solution. Search Microsoft.Azure.Devices.Client. Make sure you've checked include prerelease check box. Select the latest version and install. Now you have access to all the module features. 

  ![Install Azure IoT Hub .NET service SDK V1.16.0-preview-005][14]

## Get your module connection string

Login to [Azure portal][lnk-portal]. Navigate to your IoT Hub and click IoT Devices. Find myFirstDevice, open it and you see myFirstModule was successfuly created. Copy the module connection string. It is needed in the next step.

  ![Azure portal module detail][15]

## Create UpdateModuleTwinReportedProperties console app

Add the following `using` statements at the top of the **Program.cs** file:

```csharp
using Microsoft.Azure.Devices.Client;
using Microsoft.Azure.Devices.Shared;
```

Add the following fields to the **Program** class. Replace the placeholder value with the module connection string.

```csharp
private const string ModuleConnectionString = "<Your module connection string>";
private static ModuleClient Client = null;
```

Add the following method **OnDesiredPropertyChanged** to the **Program** class:

```csharp
private static async Task OnDesiredPropertyChanged(TwinCollection desiredProperties, object userContext)
    {
        Console.WriteLine("desired property change:");
        Console.WriteLine(JsonConvert.SerializeObject(desiredProperties));
        Console.WriteLine("Sending current time as reported property");
        TwinCollection reportedProperties = new TwinCollection
        {
            ["DateTimeLastDesiredPropertyChangeReceived"] = DateTime.Now
        };

        await Client.UpdateReportedPropertiesAsync(reportedProperties).ConfigureAwait(false);
    }
```

Finally, add the following lines to the **Main** method:

```csharp
static void Main(string[] args)
{
    Microsoft.Azure.Devices.Client.TransportType transport = Microsoft.Azure.Devices.Client.TransportType.Amqp;

    try
    {
        Client = ModuleClient.CreateFromConnectionString(ModuleConnectionString, transport);
        Client.SetConnectionStatusChangesHandler(ConnectionStatusChangeHandler);
        Client.SetDesiredPropertyUpdateCallbackAsync(OnDesiredPropertyChanged, null).Wait();

        Console.WriteLine("Retrieving twin");
        var twinTask = Client.GetTwinAsync();
        twinTask.Wait();
        var twin = twinTask.Result;
        Console.WriteLine(JsonConvert.SerializeObject(twin));

        Console.WriteLine("Sending app start time as reported property");
        TwinCollection reportedProperties = new TwinCollection();
        reportedProperties["DateTimeLastAppLaunch"] = DateTime.Now;

        Client.UpdateReportedPropertiesAsync(reportedProperties);
    }
    catch (AggregateException ex)
    {
        Console.WriteLine("Error in sample: {0}", ex);
    }

    Console.WriteLine("Waiting for Events.  Press enter to exit...");
    Console.ReadKey();
    Client.CloseAsync().Wait();
}

private static void ConnectionStatusChangeHandler(ConnectionStatus status, ConnectionStatusChangeReason reason)
{
    Console.WriteLine($"Status {status} changed: {reason}");
}
```

This code sample shows you how to retrieve the module twin and update reported properties with AMQP protocol. In public preview, we only support AMQP for module twin operations.

## Run the apps

You are now ready to run the apps. In Visual Studio, in Solution Explorer, right-click your solution, and then click **Set StartUp projects**. Select **Multiple startup projects**, and then select **Start** as the action for the console app. And then press F5 to start both apps running. 

## Next steps

To continue getting started with IoT Hub and to explore other IoT scenarios, see:

* [Get started with IoT Hub module identity and module twin using .NET backup and .NET device][lnk-csharp-csharp-getstarted]
* [Getting started with IoT Edge][lnk-iot-edge]


<!-- Images. -->
[8]:./media\iot-hub-portal-csharp-module-twin-getstarted/create-device-id.JPG
[9]:./media\iot-hub-portal-csharp-module-twin-getstarted/create-module-id.JPG
[10]:./media\iot-hub-portal-csharp-module-twin-getstarted/device-details.JPG
[11]:./media\iot-hub-portal-csharp-module-twin-getstarted/device-id-created.JPG
[12]:./media\iot-hub-portal-csharp-module-twin-getstarted/module-details.JPG
[13]: ./media\iot-hub-csharp-csharp-module-twin-getstarted/update-twins-csharp1.JPG
[14]: ./media\iot-hub-csharp-csharp-module-twin-getstarted/install-sdk.png
[15]: ./media\iot-hub-csharp-csharp-module-twin-getstarted/module-detail.JPG
<!-- Links -->
[lnk-hub-sdks]: iot-hub-devguide-sdks.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-portal]: https://portal.azure.com/

[lnk-csharp-csharp-getstarted]: iot-hub-csharp-csharp-module-twin-getstarted.md
[lnk-iot-edge]: ../iot-edge/tutorial-simulate-device-linux.md
