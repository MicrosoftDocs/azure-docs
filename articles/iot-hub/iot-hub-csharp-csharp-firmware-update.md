---
title: Device firmware update with Azure IoT Hub (.NET/.NET) | Microsoft Docs
description: How to use device management on Azure IoT Hub to initiate a device firmware update. You use the Azure IoT device SDK for .NET to implement a simulated device app and the Azure IoT service SDK for .NET to implement a service app that triggers the firmware update.
services: iot-hub
documentationcenter: .net
author: JimacoMS2
manager: timlt
editor: ''

ms.assetid: 
ms.service: iot-hub
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/19/2017
ms.author: v-jamebr

---
# Use device management to initiate a device firmware update (.NET/.NET)
[!INCLUDE [iot-hub-selector-firmware-update](../../includes/iot-hub-selector-firmware-update.md)]

## Introduction
In the [Get started with device management][lnk-dm-getstarted] tutorial, you saw how to use the [device twin][lnk-devtwin] and [direct methods][lnk-c2dmethod] primitives to remotely reboot a device. This tutorial uses the same IoT Hub primitives and shows you how to do an end-to-end simulated firmware update.  This pattern is used in the firmware update implementation for the [Raspberry Pi device implementation sample][lnk-rpi-implementation].

This tutorial shows you how to:

* Create a .NET console app that calls the **firmwareUpdate** direct method in the simulated device app through your IoT hub.
* Create a simulated device app that implements a **firmwareUpdate** direct method. This method initiates a multi-stage process that waits to download the firmware image, downloads the firmware image, and finally applies the firmware image. During each stage of the update, the device uses the reported properties to report on progress.

At the end of this tutorial, you have a .NET (C#) console device app and a .NET (C#) console back-end app:

* **SimulatedDeviceFwUpdate**, which connects to your IoT hub with the device identity created earlier, receives the **firmwareUpdate** direct method, runs through a multi-state process to simulate a firmware update including: waiting for the image download, downloading the new image, and finally applying the image.

* **TriggerFWUpdate**, which uses the service SDK to remotely invoke the **firmwareUpdate** direct method on the simulated device, displays the response, and periodically (every 500ms) displays the updated reported properties.

To complete this tutorial, you need the following:

* Visual Studio 2015 or Visual Studio 2017.
* An active Azure account. (If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.)

Follow the [Get started with device management](iot-hub-csharp-csharp-device-management-get-started.md) article to create your IoT hub and get your IoT Hub connection string.

[!INCLUDE [iot-hub-get-started-create-hub](../../includes/iot-hub-get-started-create-hub.md)]

[!INCLUDE [iot-hub-get-started-create-device-identity-portal](../../includes/iot-hub-get-started-create-device-identity-portal.md)]

## Trigger a remote firmware update on the device using a direct method
In this section, you create a .NET console app (using C#) that initiates a remote firmware update on a device. The app uses a direct method to initiate the update and uses device twin queries to periodically get the status of the active firmware update.

1. In Visual Studio, add a Visual C# Windows Classic Desktop project to the current solution by using the **Console Application** project template. Name the project **TriggerFWUpdate**.

    ![New Visual C# Windows Classic Desktop project][img-createserviceapp]

2. In Solution Explorer, right-click the **TriggerFWUpdate** project, and then click **Manage NuGet Packages**.
3. In the **NuGet Package Manager** window, select **Browse**, search for **microsoft.azure.devices**, select **Install** to install the **Microsoft.Azure.Devices** package, and accept the terms of use. This procedure downloads, installs, and adds a reference to the [Azure IoT service SDK][lnk-nuget-service-sdk] NuGet package and its dependencies.

    ![NuGet Package Manager window][img-servicenuget]
4. Add the following `using` statements at the top of the **Program.cs** file:

    ```csharp   
    using Microsoft.Azure.Devices;
    using Microsoft.Azure.Devices.Shared;
    ```

5. Add the following fields to the **Program** class. Replace the multiple placeholder values with the IoT Hub connection string for the hub that you created in the previous section and the ID of your device.
   
    ```csharp   
    static RegistryManager registryManager;
    static string connString = "{iot hub connection string}";
    static ServiceClient client;
    static string targetDevice = "{deviceIdForTargetDevice}";
    ```
        
6. Add the following method to the **Program** class. This method polls the device twin for updated status every 500 milliseconds. It writes to the console only when status has actually changed. For this sample, to prevent consuming extra IoT Hub messages in your subscription, polling stops when the device reports a status of **applyComplete** or an error.  
   
    ```csharp   
    public static async Task QueryTwinFWUpdateReported(DateTime startTime)
    {
        DateTime lastUpdated = startTime;

        while (true)
        {
            Twin twin = await registryManager.GetTwinAsync(targetDevice);

            if (twin.Properties.Reported.GetLastUpdated().ToUniversalTime() > lastUpdated.ToUniversalTime())
            {
                lastUpdated = twin.Properties.Reported.GetLastUpdated().ToUniversalTime();
                Console.WriteLine("\n" + twin.Properties.Reported["iothubDM"].ToJson());

                var status = twin.Properties.Reported["iothubDM"]["firmwareUpdate"]["status"].Value;
                if ((status == "downloadFailed") || (status == "applyFailed") || (status == "applyComplete"))
                {
                    Console.WriteLine("\nStop polling.");
                    return;
                }
            }
            await Task.Delay(500);
        }
    }
    ```
        
7. Add the following method to the **Program** class:

    ```csharp   
    public static async Task StartFirmwareUpdate()
    {
        client = ServiceClient.CreateFromConnectionString(connString);
        CloudToDeviceMethod method = new CloudToDeviceMethod("firmwareUpdate");
        method.ResponseTimeout = TimeSpan.FromSeconds(30);
        method.SetPayloadJson(
            @"{
               fwPackageUri : 'https://someurl'
            }");

        CloudToDeviceMethodResult result = await client.InvokeDeviceMethodAsync(targetDevice, method);

        Console.WriteLine("Invoked firmware update on device.");
    }
    ```

8. Finally, add the following lines to the **Main** method. This creates a registry manager to read the device twin with, starts the polling task on a worker thread, and then triggers the firmware update.
   
    ```csharp   
    registryManager = RegistryManager.CreateFromConnectionString(connString);

    Task queryTask = Task.Run(() => (QueryTwinFWUpdateReported(DateTime.Now)));

    StartFirmwareUpdate().Wait();
    Console.WriteLine("Press ENTER to exit.");
    Console.ReadLine();
    ```
        
9. Build the solution.

## Create a simulated device app
In this section, you:

* Create a .NET console app that responds to a direct method called by the cloud
* Simulate a firmware update triggered by a backend service through a direct method
* Use the reported properties to enable device twin queries to identify devices and when they last completed a firmware update

1. In Visual Studio, add a Visual C# Windows Classic Desktop project to the current solution by using the **Console Application** project template. Name the project **SimulateDeviceFWUpdate**.
   
    ![New Visual C# Windows Classic device app][img-createdeviceapp]
    
2. In Solution Explorer, right-click the **SimulateDeviceFWUpdate** project, and then click **Manage NuGet Packages**.
3. In the **NuGet Package Manager** window, select **Browse** and search for **microsoft.azure.devices.client**. Select **Install** to install the **Microsoft.Azure.Devices.Client** package, and accept the terms of use. This procedure downloads, installs, and adds a reference to the [Azure IoT device SDK][lnk-nuget-client-sdk] NuGet package and its dependencies.
   
    ![NuGet Package Manager window Client app][img-clientnuget]
4. Add the following `using` statements at the top of the **Program.cs** file:
   
    ```csharp   
    using Newtonsoft.Json.Linq;
    using Microsoft.Azure.Devices.Client;
    using Microsoft.Azure.Devices.Shared;
    ```

5. Add the following fields to the **Program** class. Replace the placeholder value with the device connection string that you noted in the **Create a device identity** section.
   
    ```csharp   
    static string DeviceConnectionString = "HostName=<yourIotHubName>.azure-devices.net;DeviceId=<yourIotDeviceName>;SharedAccessKey=<yourIotDeviceAccessKey>";
    static DeviceClient Client = null;
    ```

6. Add the following method to report status back to the cloud through the device twin: 

    ```csharp   
    static async Task reportFwUpdateThroughTwin(Twin twin, TwinCollection fwUpdateValue)
    {
        try
        {
            TwinCollection patch = new TwinCollection();
            TwinCollection iothubDM = new TwinCollection();

            iothubDM["firmwareUpdate"] = fwUpdateValue;
            patch["iothubDM"] = iothubDM;

            await Client.UpdateReportedPropertiesAsync(patch);
            Console.WriteLine("Twin state reported: {0}", fwUpdateValue["status"]);
        }
        catch 
        {
            Console.WriteLine("Error updating device twin");
            throw;
        }
    }
    ```

7. Add the following method to simulate downloading the firmware image:
        
    ```csharp   
    static async Task<byte[]> simulateDownloadImage(string imageUrl)
    {
        var image = "[fake image data]";

        Console.WriteLine("Downloading image from " + imageUrl);

        await Task.Delay(4000);

        return Encoding.ASCII.GetBytes(image);
            
    }
    ```

8. Add the following method to simulate applying the firmware image to the device:
        
    ```csharp   
    static async Task simulateApplyImage(byte[] imageData)
    {
        if (imageData == null)
        {
            throw new ArgumentNullException();
        }

        await Task.Delay(4000);

    }
    ```
 
9.  Add the following method to simulate waiting to download the firmware image. Update status to **waiting** and clear other firmware update properties on the twin. These properties are cleared to remove any existing values from prior firmware updates. This is necessary because reported properties are sent as a PATCH operation (a delta) and not a PUT operation (a complete set of properties that replaces all of the previous values). Typically, devices are informed of an available update and an administrator defined policy causes the device to start downloading and applying the update. This function is where the logic to enable that policy should run. 
        
    ```csharp   
    static async Task waitToDownload(Twin twin, string fwUpdateUri)
    {
        var now = DateTime.Now;
        TwinCollection status = new TwinCollection();
        status["fwPackageUri"] = fwUpdateUri;
        status["status"] = "waiting";
        status["error"] = null;
        status["startedWaitingTime"] = DateTime.Now;
        status["downloadCompleteTime"] = null;
        status["startedApplyingImage"] = null;
        status["lastFirmwareUpdate"] = null;

        await reportFwUpdateThroughTwin(twin, status);

        await Task.Delay(2000);
    }
    ```

10. Add the following method to perform the download. It updates the status to **downloading** through the device twin, calls the simulate download method, and reports a status of **downloadComplete** or **downloadFailed** through the twin depending on the results of the download operation. 
        
    ```csharp   
    static async Task<byte[]> downloadImage(Twin twin, string fwUpdateUri)
    {
        try
        {
            TwinCollection statusUpdate = new TwinCollection();
            statusUpdate["status"] = "downloading";
            await reportFwUpdateThroughTwin(twin, statusUpdate);

            byte[] imageData = await simulateDownloadImage(fwUpdateUri);

            statusUpdate = new TwinCollection();
            statusUpdate["status"] = "downloadComplete";
            statusUpdate["downloadCompleteTime"] = DateTime.Now;
            await reportFwUpdateThroughTwin(twin, statusUpdate);
            return imageData;
        }
        catch (Exception ex)
        {
            TwinCollection statusUpdate = new TwinCollection();
            statusUpdate["status"] = "downloadFailed";
            statusUpdate["error"] = new TwinCollection();
            statusUpdate["error"]["code"] = ex.GetType().ToString();
            statusUpdate["error"]["message"] = ex.Message;
            await reportFwUpdateThroughTwin(twin, statusUpdate);
            throw;
        }
    }
    ```

11. Add the following method to apply the image. It updates the status to **applying** through the device twin, calls the simulate apply image method, and updates status to **applyComplete** or **applyFailed** through the twin depending on the results of the apply operation. 
        
    ```csharp   
    static async Task applyImage(Twin twin, byte[] imageData)
    {
        try
        {
            TwinCollection statusUpdate = new TwinCollection();
            statusUpdate["status"] = "applying";
            statusUpdate["startedApplyingImage"] = DateTime.Now;
            await reportFwUpdateThroughTwin(twin, statusUpdate);

            await simulateApplyImage(imageData);

            statusUpdate = new TwinCollection();
            statusUpdate["status"] = "applyComplete";
            statusUpdate["lastFirmwareUpdate"] = DateTime.Now;
            await reportFwUpdateThroughTwin(twin, statusUpdate);
        }
        catch (Exception ex)
        {
            TwinCollection statusUpdate = new TwinCollection();
            statusUpdate["status"] = "applyFailed";
            statusUpdate["error"] = new TwinCollection();
            statusUpdate["error"]["code"] = ex.GetType().ToString();
            statusUpdate["error"]["message"] = ex.Message;
            await reportFwUpdateThroughTwin(twin, statusUpdate);
            throw;
        }
    }
    ```

12. Add the following method to sequence the firmware update operation from waiting to download the image through applying the image to the device:
        
    ```csharp   
    static async Task doUpdate(string fwUpdateUrl)
    {
        try
        {
            Twin twin = await Client.GetTwinAsync();
            await waitToDownload(twin, fwUpdateUrl);
            byte[] imageData = await downloadImage(twin, fwUpdateUrl);
            await applyImage(twin, imageData);
        }
        catch (Exception ex)
        {
            Console.WriteLine();
            Console.WriteLine("Error during update: {0}", ex.Message);
        }
    }
    ```

13. Add the following method to handle the **updateFirmware** direct method from the cloud. It extracts the URL to the firmware update from the message payload and passes it to the **doUpdate** task, which it starts on another threadpool thread. It then immediately returns the method response to the cloud.
        
    ```csharp   
    static Task<MethodResponse> onFirmwareUpdate(MethodRequest methodRequest, object userContext)
    {
        string fwUpdateUrl = (string)JObject.Parse(methodRequest.DataAsJson)["fwPackageUri"];
        Console.WriteLine("\nMethod: {0} triggered by service, URI is: {1}", methodRequest.Name, fwUpdateUrl);

        Task updateTask = Task.Run(() => (doUpdate(fwUpdateUrl)));

        string result = "'FirmwareUpdate started.'";
        return Task.FromResult(new MethodResponse(Encoding.UTF8.GetBytes(result), 200));
    }
    ```
> [!NOTE]
> This method triggers the simulated update to run as a **Task** and then immediately responds to the method call, informing the service that the firmware update has been started. Update status and completion will be sent to the service through the reported properties of the device twin. We respond to the method call when starting the update, rather than after its completion, because:
> * A real update process is very likely to take longer than the method call timeout.
> * A real update process is very likely to require a reboot, which would re-launch this app making the **MetodRequest** object unavailable. (Updating reported properties, however, is possible even after a reboot.) 

14. Finally, add the following code to the **Main** method to open the connection to your IoT hub and initialize the method listener:
   
    ```csharp   
    try
    {
        Console.WriteLine("Connecting to hub");
        Client = DeviceClient.CreateFromConnectionString(DeviceConnectionString, TransportType.Mqtt);
        
        // setup callback for "firmware update" method
        Client.SetMethodHandlerAsync("firmwareUpdate", onFirmwareUpdate, null).Wait();
        Console.WriteLine("Waiting for firmware update direct method call\n Press enter to exit.");
        Console.ReadLine();

        Console.WriteLine("Exiting...");

        // as a good practice, remove the firmware update handler
        Client.SetMethodHandlerAsync("firmwareUpdate", null, null).Wait();
        Client.CloseAsync().Wait();
    }
    catch (Exception ex)
    {
        Console.WriteLine();
        Console.WriteLine("Error in sample: {0}", ex.Message);
    }
    ```
        
15. Build the solution.       

> [!NOTE]
> To keep things simple, this tutorial does not implement any retry policy. In production code, you should implement retry policies (such as an exponential backoff), as suggested in the MSDN article [Transient Fault Handling][lnk-transient-faults].


## Run the apps
You are now ready to run the apps.
1. Run the .NET device app **SimulatedDeviceFWUpdate**.  Right-click the **SimulatedDeviceFWUpdate** project, select **Debug**, and then select **Start new instance**. It should start listening for method calls from your IoT Hub: 

2. Once the device is connected and waiting for method invocations, run the .NET **TriggerFWUpdate** app to invoke the firmware update method in the simulated device app. Right-click the **TriggerFWUpdate** project, select **Debug**, and then select **Start new instance**. You should see update sequence written in the **SimulatedDeviceFWUpdate** console and also the sequence reported through the reported properties of the device in the **TriggerFWUpdate** console. Note that the process takes several seconds to complete. 
   
    ![Service and device app run][img-combinedrun]


## Next steps
In this tutorial, you used a direct method to trigger a remote firmware update on a device and used the reported properties to follow the progress of the firmware update.

To learn how to extend your IoT solution and schedule method calls on multiple devices, see the [Schedule and broadcast jobs][lnk-tutorial-jobs] tutorial.

<!-- images -->
[img-servicenuget]: media/iot-hub-csharp-csharp-firmware-update/servicesdknuget.png
[img-clientnuget]: media/iot-hub-csharp-csharp-firmware-update/clientsdknuget.png
[img-createserviceapp]: media/iot-hub-csharp-csharp-firmware-update/createserviceapp.png
[img-createdeviceapp]: media/iot-hub-csharp-csharp-firmware-update/createdeviceapp.png
[img-combinedrun]: media/iot-hub-csharp-csharp-firmware-update/combinedrun.png

[lnk-devtwin]: iot-hub-devguide-device-twins.md
[lnk-c2dmethod]: iot-hub-devguide-direct-methods.md
[lnk-dm-getstarted]: iot-hub-csharp-csharp-device-management-get-started.md
[lnk-tutorial-jobs]: iot-hub-csharp-node-schedule-jobs.md

[lnk-dev-setup]: https://github.com/Azure/azure-iot-sdk-node/blob/master/doc/node-devbox-setup.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-transient-faults]: https://msdn.microsoft.com/library/hh680901(v=pandp.50).aspx
[lnk-rpi-implementation]: https://github.com/Azure/azure-iot-sdk-c/tree/master/iothub_client/samples/iothub_client_sample_mqtt_dm/pi_device
[lnk-nuget-client-sdk]: https://www.nuget.org/packages/Microsoft.Azure.Devices.Client/
[lnk-nuget-service-sdk]: https://www.nuget.org/packages/Microsoft.Azure.Devices/