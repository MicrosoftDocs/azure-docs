---
title: include file
description: include file
services: iot-hub
author: chrissie926
ms.service: iot-hub
ms.topic: include
ms.date: 08/07/2019
ms.author: menchi
ms.custom: include file
---

## Create a module identity

In this section, you create a .NET console app that creates a device identity and a module identity in the identity registry in your hub. A device or module can't connect to hub unless it has an entry in the identity registry. For more information, see the [Identity Registry section of the IoT Hub developer guide](../articles/iot-hub/iot-hub-devguide-identity-registry.md).

When you run this console app, it generates a unique ID and key for both device and module. Your device and module use these values to identify themselves when it sends device-to-cloud messages to IoT Hub. The IDs are case-sensitive.

1. Open Visual Studio, and select **Create a new project**.

1. In **Create a new project**, select **Console App (.NET Framework)**.

1. Select **Next** to open **Configure your new project**. Name the project *CreateIdentities*, then select **Next**. 

   :::image type="content" source="./media/iot-hub-get-started-create-module-identity-csharp/configure-createidentities-project.png" alt-text="Screenshot that shows the 'Configure your new project' popup with 'CreateIdentities'." lightbox="./media/iot-hub-get-started-create-module-identity-csharp/configure-createidentities-project.png":::

1. Keep the default .NET Framework option and select **Create** to create your project.

1. In Visual Studio, open **Tools** > **NuGet Package Manager** > **Manage NuGet Packages for Solution**. Select the **Browse** tab.

1. Search for **Microsoft.Azure.Devices**. Select it and then select **Install**.

    ![Install Azure IoT Hub .NET service SDK current version](./media/iot-hub-get-started-create-module-identity-csharp/install-service-sdk.png)

1. Add the following `using` statements at the top of the **Program.cs** file:

   ```csharp
   using Microsoft.Azure.Devices;
   using Microsoft.Azure.Devices.Common.Exceptions;
   ```

1. Add the following fields to the **Program** class. Replace the placeholder value with the IoT Hub connection string for the hub that you created in the previous section.

   ```csharp
   const string connectionString = "<replace_with_iothub_connection_string>";
   const string deviceID = "myFirstDevice";
   const string moduleID = "myFirstModule";
   ```

1. Add the following code to the **Main** class.

   ```csharp
   static void Main(string[] args)
   {
       AddDeviceAsync().Wait();
       AddModuleAsync().Wait();
   }
   ```

1. Add the following methods to the **Program** class:

    ```csharp
    private static async Task AddDeviceAsync()
    {
       RegistryManager registryManager = 
         RegistryManager.CreateFromConnectionString(connectionString);
       Device device;

       try
       {
           device = await registryManager.AddDeviceAsync(new Device(deviceID));
       }
       catch (DeviceAlreadyExistsException)
        {
            device = await registryManager.GetDeviceAsync(deviceID);
        }

        Console.WriteLine("Generated device key: {0}", 
          device.Authentication.SymmetricKey.PrimaryKey);
    }

    private static async Task AddModuleAsync()
    {
        RegistryManager registryManager = 
          RegistryManager.CreateFromConnectionString(connectionString);
        Module module;

        try
        {
            module = 
              await registryManager.AddModuleAsync(new Module(deviceID, moduleID));
        }
        catch (ModuleAlreadyExistsException)
        {
            module = await registryManager.GetModuleAsync(deviceID, moduleID);
        }

        Console.WriteLine("Generated module key: {0}", module.Authentication.SymmetricKey.PrimaryKey);
    }
    ```

    The `AddDeviceAsync` method creates a device identity with ID **myFirstDevice**. If that device ID already exists in the identity registry, the code simply retrieves the existing device information. The app then displays the primary key for that identity. You use this key in the simulated device app to connect to your hub.

    The `AddModuleAsync` method creates a module identity with ID **myFirstModule** under device **myFirstDevice**. If that module ID already exists in the identity registry, the code simply retrieves the existing module information. The app then displays the primary key for that identity. You use this key in the simulated module app to connect to your hub.

   [!INCLUDE [iot-hub-pii-note-naming-device](iot-hub-pii-note-naming-device.md)]

1. Run this app, and make a note of the device key and module key.

> [!NOTE]
> The IoT Hub identity registry only stores device and module identities to enable secure access to the hub. The identity registry stores device IDs and keys to use as security credentials. The identity registry also stores an enabled/disabled flag for each device that you can use to disable access for that device. If your app needs to store other device-specific metadata, it should use an application-specific store. There is no enabled/disabled flag for module identities. For more information, see [IoT Hub developer guide](../articles/iot-hub/iot-hub-devguide-identity-registry.md).
