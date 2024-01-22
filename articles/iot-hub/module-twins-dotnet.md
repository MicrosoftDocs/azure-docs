---
title: Get started with module identity and module twins (.NET)
titleSuffix: Azure IoT Hub
description: Learn how to create module identities and update module twins using the Azure IoT Hub SDKs for .NET.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.devlang: csharp
ms.topic: how-to
ms.date: 08/07/2019
ms.custom: amqp, devx-track-csharp, devx-track-dotnet
---

# Get started with IoT Hub module identity and module twin (.NET)

[!INCLUDE [iot-hub-selector-module-twin-getstarted](../../includes/iot-hub-selector-module-twin-getstarted.md)]

[Module identities and module twins](iot-hub-devguide-module-twins.md) are similar to Azure IoT Hub device identity and device twin, but provide finer granularity. While Azure IoT Hub device identity and device twin enable the back-end application to configure a device and provide visibility on the device's conditions, a module identity and module twin provide these capabilities for individual components of a device. On capable devices with multiple components, such as operating system devices or firmware devices, module identities and module twins allow for isolated configuration and conditions for each component.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-whole.md)]

At the end of this article, you have two .NET console apps:

* **CreateIdentities**: creates a device identity, a module identity, and associated security key to connect your device and module clients.

* **UpdateModuleTwinReportedProperties**: sends updated module twin, reported properties to your IoT hub.

> [!NOTE]
> See [Azure IoT SDKs](iot-hub-devguide-sdks.md) for more information about the SDK tools available to build both device and back-end apps.

## Prerequisites

* Visual Studio.

* An IoT hub. Create one with the [CLI](iot-hub-create-using-cli.md) or the [Azure portal](iot-hub-create-through-portal.md).

## Module authentication

You can use symmetric keys or X.509 certificates to authenticate module identities. For X.509 certificate authentication, the module's certificate *must* have its common name (CN) formatted like `CN=<deviceid>/<moduleid>`. For example:

```bash
openssl req -new -key d1m1.key.pem -out d1m1.csr -subj "/CN=device01\/module01"
```

## Get the IoT hub connection string

[!INCLUDE [iot-hub-howto-module-twin-shared-access-policy-text](../../includes/iot-hub-howto-module-twin-shared-access-policy-text.md)]

[!INCLUDE [iot-hub-include-find-registryrw-connection-string](../../includes/iot-hub-include-find-registryrw-connection-string.md)]

[!INCLUDE [iot-hub-get-started-create-module-identity-csharp](../../includes/iot-hub-get-started-create-module-identity-csharp.md)]

## Update the module twin using .NET device SDK

Now let's communicate to the cloud from your simulated device. Once a module identity is created, a module twin is implicitly created in IoT Hub. In this section, you create a .NET console app on your simulated device that updates the module twin reported properties.

To retrieve your module connection string, navigate to your [IoT hub](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Devices%2FIotHubs) then select **Devices**. Find and select **myFirstDevice** to open it and then select **myFirstModule** to open it. In **Module Identity Details**, copy the **Connection string (primary key)** and save it for the console app.

:::image type="content" source="./media/module-twins-dotnet/module-identity-detail.png" alt-text="Screenshot that shows the 'Module Identity Details' page." lightbox="./media/module-twins-dotnet/module-identity-detail.png":::

1. In Visual Studio, add a new project to your solution by selecting **File** > **New** > **Project**. In **Create a new project**, select **Console App (.NET Framework)**, and select **Next**.

1. In **Configure your new project**, name the project *UpdateModuleTwinReportedProperties*, then select **Next**.

   :::image type="content" source="./media/module-twins-dotnet/configure-update-twins-csharp1.png" alt-text="Screenshot that shows the 'Configure your new project' popup." lightbox="./media/module-twins-dotnet/configure-update-twins-csharp1.png":::

1. Keep the default .NET Framework option and select **Create** to create your project.

1. In Visual Studio, open **Tools** > **NuGet Package Manager** > **Manage NuGet Packages for Solution**. Select the **Browse** tab.

1. Search for and select **Microsoft.Azure.Devices.Client**, and then select **Install**.

   :::image type="content" source="./media/module-twins-dotnet/install-client-sdk.png" alt-text="Screenshot that shows the 'Microsoft.Azure.Devices.Client' selected and the 'Install' button highlighted." lightbox="./media/module-twins-dotnet/install-client-sdk.png":::

1. Add the following `using` statements at the top of the **Program.cs** file:

    ```csharp
    using Microsoft.Azure.Devices.Client;
    using Microsoft.Azure.Devices.Shared;
    using System.Threading.Tasks;
    using Newtonsoft.Json;
    ```

1. Add the following fields to the **Program** class. Replace the placeholder value with the module connection string.

    ```csharp
    private const string ModuleConnectionString = "<Your module connection string>";
    private static ModuleClient Client = null;
    static void ConnectionStatusChangeHandler(ConnectionStatus status, 
      ConnectionStatusChangeReason reason)
    {
        Console.WriteLine("Connection Status Changed to {0}; the reason is {1}", 
          status, reason);
    }
    ```

1. Add the following method **OnDesiredPropertyChanged** to the **Program** class:

    ```csharp
    private static async Task OnDesiredPropertyChanged(TwinCollection desiredProperties, 
      object userContext)
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

1. Add the following lines to the **Main** method:

    ```csharp
    static void Main(string[] args)
    {
        Microsoft.Azure.Devices.Client.TransportType transport = 
          Microsoft.Azure.Devices.Client.TransportType.Amqp;

        try
        {
            Client = 
              ModuleClient.CreateFromConnectionString(ModuleConnectionString, transport);
            Client.SetConnectionStatusChangesHandler(ConnectionStatusChangeHandler);
            Client.SetDesiredPropertyUpdateCallbackAsync(OnDesiredPropertyChanged, null).Wait();

            Console.WriteLine("Retrieving twin");
            var twinTask = Client.GetTwinAsync();
            twinTask.Wait();
            var twin = twinTask.Result;
            Console.WriteLine(JsonConvert.SerializeObject(twin.Properties)); 

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
        Console.ReadLine();
        Client.CloseAsync().Wait();
    }
    ```

    Now you know how to retrieve the module twin and update reported properties with AMQP protocol.

1. Optionally, you can add these statements to the **Main** method to send an event to IoT Hub from your module. Place these lines below the `try catch` block.

    ```csharp
    Byte[] bytes = new Byte[2];
    bytes[0] = 0;
    bytes[1] = 1;
    var sendEventsTask = Client.SendEventAsync(new Message(bytes));
    sendEventsTask.Wait();
    Console.WriteLine("Event sent to IoT Hub.");
    ```

## Run the apps

You can now run the apps.

1. In Visual Studio, in **Solution Explorer**, right-click your solution, and then select **Set StartUp projects**.

1. Under **Common Properties**, select **Startup Project.**

1. Select **Multiple startup projects**, and then select **Start** as the action for the apps, and **OK** to accept your changes.

1. Press **F5** to start the apps.

## Next steps

To continue getting started with IoT Hub and to explore other IoT scenarios, see:

* [Getting started with device management](device-management-node.md)

* [Getting started with IoT Edge](../iot-edge/quickstart-linux.md)
