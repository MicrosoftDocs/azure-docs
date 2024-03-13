---
title: Get started with module identity and module twins (Portal)
titleSuffix: Azure IoT Hub
description: Learn how to create module identities and update module twins using the Azure portal and the IoT device SDK for .NET.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.devlang: csharp
ms.topic: how-to
ms.date: 08/20/2019
ms.custom: amqp, devx-track-csharp, devx-track-dotnet
---
# Get started with IoT Hub module identity and module twin using the Azure portal and a .NET device

[!INCLUDE [iot-hub-selector-module-twin-getstarted](../../includes/iot-hub-selector-module-twin-getstarted.md)]

[Module identities and module twins](iot-hub-devguide-module-twins.md) are similar to Azure IoT Hub device identity and device twin, but provide finer granularity. While Azure IoT Hub device identity and device twin enable the back-end application to configure a device and provide visibility on the device's conditions, a module identity and module twin provide these capabilities for individual components of a device. On capable devices with multiple components, such as operating system devices or firmware devices, module identities and module twins allow for isolated configuration and conditions for each component.

[!INCLUDE [iot-hub-basic](../../includes/iot-hub-basic-whole.md)]

In this article, you will learn how to:

* Create a module identity in the portal.

* Use a .NET device SDK to update the module twin from your device.

> [!NOTE]
> See [Azure IoT SDKs](iot-hub-devguide-sdks.md) for more information about the SDK tools available to build both device and back-end apps.

## Prerequisites

* Visual Studio.

* An IoT hub. Create one with the [CLI](iot-hub-create-using-cli.md) or the [Azure portal](iot-hub-create-through-portal.md).

* A registered device. Register one in the [Azure portal](iot-hub-create-through-portal.md#register-a-new-device-in-the-iot-hub).

## Module authentication

You can use symmetric keys or X.509 certificates to authenticate module identities. For X.509 certificate authentication, the module's certificate *must* have its common name (CN) formatted like `CN=<deviceid>/<moduleid>`. For example:

```bash
openssl req -new -key d1m1.key.pem -out d1m1.csr -subj "/CN=device01\/module01"
```

## Create a module identity in the portal

Within one device identity, you can create up to 20 module identities. To add an identity, follow these steps:

1. From your existing device in the Azure portal, choose **Add Module Identity** to create your first module identity.

1. Enter the name *myFirstModule*. Save your module identity.

   :::image type="content" source="./media/module-twins-portal-dotnet/add-module-identity.png" alt-text="Screenshot that shows the 'Module Identity Details' page." lightbox="./media/module-twins-portal-dotnet/add-module-identity.png":::

    Your new module identity appears at the bottom of the screen. Select it to see module identity details.

   :::image type="content" source="./media/module-twins-portal-dotnet/module-identity-details.png" alt-text="Screenshot that shows the Module Identity Details menu.":::

Save the **Connection string (primary key)**. You use it in the next section to set up your module on the device in a console app.

## Update the module twin using .NET device SDK

Now let's communicate to the cloud from your simulated device. Once a module identity is created, a module twin is implicitly created in IoT Hub. In this section, you create a .NET console app on your simulated device that updates the module twin reported properties.

### Create a Visual Studio project

To create an app that updates the module twin, reported properties, follow these steps:

1. In Visual Studio, select **Create a new project**, then choose **Console App (.NET Framework)**, and select **Next**.

1. In **Configure your new project**, enter *UpdateModuleTwinReportedProperties* as the **Project name**. Select **Next** to continue.

   :::image type="content" source="./media/module-twins-portal-dotnet/configure-twins-project.png" alt-text="Screenshot showing the 'Configure your new project' popup.":::

1. Keep the default .NET framework, then select **Create**.

### Install the latest Azure IoT Hub .NET device SDK

Module identity and module twin is only available in the IoT Hub pre-release device SDKs. To install it, follow these steps:

1. In Visual Studio, open **Tools** > **NuGet Package Manager** > **Manage NuGet Packages for Solution**.

1. Select **Browse**, and then select **Include prerelease**. Search for *Microsoft.Azure.Devices.Client*. Select the latest version and install.

   :::image type="content" source="./media/module-twins-dotnet/install-client-sdk.png" alt-text="Screenshot showing how to install the Microsoft.Azure.Devices.Client." lightbox="./media/module-twins-dotnet/install-client-sdk.png":::

   Now you have access to all the module features.

### Create UpdateModuleTwinReportedProperties console app

To create your app, follow these steps:

1. Add the following `using` statements at the top of the **Program.cs** file:

  ```csharp
  using Microsoft.Azure.Devices.Client;
  using Microsoft.Azure.Devices.Shared;
  using Newtonsoft.Json;
  ```

2. Add the following fields to the **Program** class. Replace the placeholder value with the module connection string you saved previously.

  ```csharp
  private const string ModuleConnectionString = "<Your module connection string>";
  private static ModuleClient Client = null;
  ```

3. Add the following method **OnDesiredPropertyChanged** to the **Program** class:

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

4. Finally, replace the **Main** method with the following code:

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
  
  You can build and run this app by using **F5**.

Now you know how to retrieve the module twin and update reported properties with AMQP protocol. 

## Next steps

To continue getting started with IoT Hub and to explore other IoT scenarios, see:

* [Getting started with device management (Node.js)](device-management-node.md)

* [Getting started with IoT Edge](../iot-edge/quickstart-linux.md)
