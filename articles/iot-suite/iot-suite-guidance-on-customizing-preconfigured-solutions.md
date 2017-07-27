---
title: Customizing preconfigured solutions | Microsoft Docs
description: Provides guidance on how to customize the Azure IoT Suite preconfigured solutions.
services: ''
suite: iot-suite
documentationcenter: .net
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 4653ae53-4110-4a10-bd6c-7dc034c293a8
ms.service: iot-suite
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/15/2017
ms.author: corywink

---
# Customize a preconfigured solution

The preconfigured solutions provided with the Azure IoT Suite demonstrate the services within the suite working together to deliver an end-to-end solution. From this starting point, there are various places in which you can extend and customize the solution for specific scenarios. The following sections describe these common customization points.

## Find the source code

The source code for the preconfigured solutions is available on GitHub in the following repositories:

* Remote Monitoring: [https://www.github.com/Azure/azure-iot-remote-monitoring](https://github.com/Azure/azure-iot-remote-monitoring)
* Predictive Maintenance: [https://github.com/Azure/azure-iot-predictive-maintenance](https://github.com/Azure/azure-iot-predictive-maintenance)
* Connected factory: [https://github.com/Azure/azure-iot-connected-factory](https://github.com/Azure/azure-iot-connected-factory)

The source code for the preconfigured solutions is provided to demonstrate the patterns and practices used to implement the end-to-end functionality of an IoT solution using Azure IoT Suite. You can find more information about how to build and deploy the solutions in the GitHub repositories.

## Change the preconfigured rules

The remote monitoring solution includes three [Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/) jobs to handle device information, telemetry, and rules logic in the solution.

The three stream analytics jobs and their syntax are described in depth in the [Remote monitoring preconfigured solution walkthrough](iot-suite-remote-monitoring-sample-walkthrough.md). 

You can edit these jobs directly to alter the logic, or add logic specific to your scenario. You can find the Stream Analytics jobs as follows:

1. Go to [Azure portal](https://portal.azure.com).
2. Navigate to the resource group with the same name as your IoT solution. 
3. Select the Azure Stream Analytics job you'd like to modify. 
4. Stop the job by selecting **Stop** in the set of commands. 
5. Edit the inputs, query, and outputs.
   
    A simple modification is to change the query for the **Rules** job to use a **"<"** instead of a **">"**. The solution portal still shows **">"** when you edit a rule, but notice how the behavior is flipped due to the change in the underlying job.
6. Start the job

> [!NOTE]
> The remote monitoring dashboard depends on specific data, so altering the jobs can cause the dashboard to fail.

## Add your own rules

In addition to changing the preconfigured Azure Stream Analytics jobs, you can use the Azure portal to add new jobs or add new queries to existing jobs.

## Customize devices

One of the most common extension activities is working with devices specific to your scenario. There are several methods for working with devices. These methods include altering a simulated device to match your scenario, or using the [IoT Device SDK][IoT Device SDK] to connect your physical device to the solution.

For a step-by-step guide to adding devices, see the [Iot Suite Connecting Devices](iot-suite-connecting-devices.md) article and the [remote monitoring C SDK Sample](https://github.com/Azure/azure-iot-sdk-c/tree/master/serializer/samples/remote_monitoring). This sample is designed to work with the remote monitoring preconfigured solution.

### Create your own simulated device

Included in the [remote monitoring solution source code](https://github.com/Azure/azure-iot-remote-monitoring), is a .NET simulator. This simulator is the one provisioned as part of the solution and you can alter it to send different metadata, telemetry, and respond to different commands and methods.

The preconfigured simulator in the remote monitoring preconfigured solution simulates a cooler device that emits temperature and humidity telemetry. You can modify the simulator in the [Simulator.WebJob](https://github.com/Azure/azure-iot-remote-monitoring/tree/master/Simulator/Simulator.WebJob) project when you've forked the GitHub repository.

### Available locations for simulated devices

The default set of locations is in Seattle/Redmond, Washington, United States of America. You can change these locations in [SampleDeviceFactory.cs][lnk-sample-device-factory].

### Add a desired property update handler to the simulator

You can set a value for a desired property for a device in the solution portal. It is the responsibility of the device to handle the property change request when the device retrieves the desired property value. To add support for a property value change through a desired property, you need to add a handler to the simulator.

The simulator contains handlers for the **SetPointTemp** and **TelemetryInterval** properties that you can update by setting desired values in the solution portal.

The following example shows the handler for the **SetPointTemp** desired property in the **CoolerDevice** class:

```csharp
protected async Task OnSetPointTempUpdate(object value)
{
    var telemetry = _telemetryController as ITelemetryWithSetPointTemperature;
    telemetry.SetPointTemperature = Convert.ToDouble(value);

    await SetReportedPropertyAsync(SetPointTempPropertyName, telemetry.SetPointTemperature);
}
```

This method updates the telemetry point temperature and then reports the change back to IoT Hub by setting a reported property.

You can add your own handlers for your own properties by following the pattern in the preceding example.

You must also bind the desired property to the handler as shown in the following example from the **CoolerDevice** constructor:

```csharp
_desiredPropertyUpdateHandlers.Add(SetPointTempPropertyName, OnSetPointTempUpdate);
```

Note that **SetPointTempPropertyName** is a constant defined as "Config.SetPointTemp".

### Add support for a new method to the simulator

You can customize the simulator to add support for a new [method (direct method)][lnk-direct-methods]. There are two key steps required:

- The simulator must notify the IoT hub in the preconfigured solution with details of the method.
- The simulator must include code to handle the method call when you invoke it from the **Device details** panel in the solution explorer or through a job.

The remote monitoring preconfigured solution uses *reported properties* to send details of supported methods to IoT hub. The solution back end maintains a list of all the methods supported by each device along with a history of method invocations. You can view this information about devices and invoke methods in the solution portal.

To notify the IoT hub that a device supports a method, the device must add details of the method to the **SupportedMethods** node in the reported properties:

```json
"SupportedMethods": {
  "<method signature>": "<method description>",
  "<method signature>": "<method description>"
}
```

The method signature has the following format: `<method name>--<parameter #0 name>-<parameter #1 type>-...-<parameter #n name>-<parameter #n type>`. For example, to specify the **InitiateFirmwareUpdate** method expects a string parameter named **FwPackageURI**, use the following method signature:

```json
InitiateFirmwareUpate--FwPackageURI-string: "description of method"
```

For a list of supported parameter types, see the **CommandTypes** class in the Infrastructure project.

To delete a method, set the method signature to `null` in the reported properties.

> [!NOTE]
> The solution back end only updates information about supported methods when it receives a *device information* message from the device.

The following code sample from the **SampleDeviceFactory** class in the Common project shows how to add a method to the list of **SupportedMethods** in the reported properties sent by the device:

```csharp
device.Commands.Add(new Command(
    "InitiateFirmwareUpdate",
    DeliveryType.Method,
    "Updates device Firmware. Use parameter 'FwPackageUri' to specifiy the URI of the firmware file, e.g. https://iotrmassets.blob.core.windows.net/firmwares/FW20.bin",
    new[] { new Parameter("FwPackageUri", "string") }
));
```

This code snippet adds details of the **InitiateFirmwareUpdate** method including text to display in the solution portal and details of the required method parameters.

The simulator sends reported properties, including the list of supported methods, to IoT Hub when the simulator starts.

Add a handler to the simulator code for each method it supports. You can see the existing handlers in the **CoolerDevice** class in the Simulator.WebJob project. The following example shows the handler for **InitiateFirmwareUpdate** method:

```csharp
public async Task<MethodResponse> OnInitiateFirmwareUpdate(MethodRequest methodRequest, object userContext)
{
    if (_deviceManagementTask != null && !_deviceManagementTask.IsCompleted)
    {
        return await Task.FromResult(BuildMethodRespose(new
        {
            Message = "Device is busy"
        }, 409));
    }

    try
    {
        var operation = new FirmwareUpdate(methodRequest);
        _deviceManagementTask = operation.Run(Transport).ContinueWith(async task =>
        {
            // after firmware completed, we reset telemetry
            var telemetry = _telemetryController as ITelemetryWithTemperatureMeanValue;
            if (telemetry != null)
            {
                telemetry.TemperatureMeanValue = 34.5;
            }

            await UpdateReportedTemperatureMeanValue();
        });

        return await Task.FromResult(BuildMethodRespose(new
        {
            Message = "FirmwareUpdate accepted",
            Uri = operation.Uri
        }));
    }
    catch (Exception ex)
    {
        return await Task.FromResult(BuildMethodRespose(new
        {
            Message = ex.Message
        }, 400));
    }
}
```

Method handler names must start with `On` followed by the name of the method. The **methodRequest** parameter contains any parameters passed with the method invocation from the solution back end. The return value must be of type **Task&lt;MethodResponse&gt;**. The **BuildMethodResponse** utility method helps you create the return value.

Inside the method handler, you could:

- Start an asynchronous task.
- Retrieve desired properties from the *device twin* in IoT Hub.
- Update a single reported property using the **SetReportedPropertyAsync** method in the **CoolerDevice** class.
- Update multiple reported properties by creating a **TwinCollection** instance and calling the **Transport.UpdateReportedPropertiesAsync** method.

The preceding firmware update example performs the following steps:

- Checks the device is able to accept the firmware update request.
- Asynchronously initiates the firmware update operation and resets the telemetry when the operation is complete.
- Immediately returns the "FirmwareUpdate accepted" message to indicate the request was accepted by the device.

### Build and use your own (physical) device

The [Azure IoT SDKs](https://github.com/Azure/azure-iot-sdks) provide libraries for connecting numerous device types (languages and operating systems) into IoT solutions.

## Modify dashboard limits

### Number of devices displayed in dashboard dropdown

The default is 200. You can change this number in [DashboardController.cs][lnk-dashboard-controller].

### Number of pins to display in Bing Map control

The default is 200. You can change this number in [TelemetryApiController.cs][lnk-telemetry-api-controller-01].

### Time period of telemetry graph

The default is 10 minutes. You can change this value in [TelmetryApiController.cs][lnk-telemetry-api-controller-02].

## Manually set up application roles

The following procedure describes how to add **Admin** and **ReadOnly** application roles to a preconfigured solution. Note that preconfigured solutions provisioned from the azureiotsuite.com site already include the **Admin** and **ReadOnly** roles.

Members of the **ReadOnly** role can see the dashboard and the device list, but are not allowed to add devices, change device attributes, or send commands.  Members of the **Admin** role have full access to all the functionality in the solution.

1. Go to the [Azure classic portal][lnk-classic-portal].
2. Select **Active Directory**.
3. Click the name of the AAD tenant you used when you provisioned your solution.
4. Click **Applications**.
5. Click the name of the application that matches your preconfigured solution name. If you don't see your application in the list, select **Applications my company owns** in the **Show** dropdown and click the check mark.
6. At the bottom of the page, click **Manage Manifest** and then **Download Manifest**.
7. This procedure downloads a .json file to your local machine. Open this file for editing in a text editor of your choice.
8. On the third line of the .json file, you can see:

   ```json
   "appRoles" : [],
   ```
   Replace this line with the following code:

   ```json
   "appRoles": [
   {
   "allowedMemberTypes": [
   "User"
   ],
   "description": "Administrator access to the application",
   "displayName": "Admin",
   "id": "a400a00b-f67c-42b7-ba9a-f73d8c67e433",
   "isEnabled": true,
   "value": "Admin"
   },
   {
   "allowedMemberTypes": [
   "User"
   ],
   "description": "Read only access to device information",
   "displayName": "Read Only",
   "id": "e5bbd0f5-128e-4362-9dd1-8f253c6082d7",
   "isEnabled": true,
   "value": "ReadOnly"
   } ],
   ```

9. Save the updated .json file (you can overwrite the existing file).
10. In the Azure classic portal, at the bottom of the page, select **Manage Manifest** then **Upload Manifest** to upload the .json file you saved in the previous step.
11. You have now added the **Admin** and **ReadOnly** roles to your application.
12. To assign one of these roles to a user in your directory, see [Permissions on the azureiotsuite.com site][lnk-permissions].

## Feedback

Do you have a customization you'd like to see covered in this document? Add feature suggestions to [User Voice](https://feedback.azure.com/forums/321918-azure-iot), or comment on this article. 

## Next steps

To learn more about the options for customizing the preconfigured solutions, see:

* [Connect Logic App to your Azure IoT Suite Remote Monitoring preconfigured solution][lnk-logicapp]
* [Use dynamic telemetry with the remote monitoring preconfigured solution][lnk-dynamic]
* [Device information metadata in the remote monitoring preconfigured solution][lnk-devinfo]
* [Customize how the connected factory solution displays data from your OPC UA servers][lnk-cf-customize]

[lnk-logicapp]: iot-suite-logic-apps-tutorial.md
[lnk-dynamic]: iot-suite-dynamic-telemetry.md
[lnk-devinfo]: iot-suite-remote-monitoring-device-info.md

[IoT Device SDK]: https://azure.microsoft.com/documentation/articles/iot-hub-sdks-summary/
[lnk-permissions]: iot-suite-permissions.md
[lnk-dashboard-controller]: https://github.com/Azure/azure-iot-remote-monitoring/blob/3fd43b8a9f7e0f2774d73f3569439063705cebe4/DeviceAdministration/Web/Controllers/DashboardController.cs#L27
[lnk-telemetry-api-controller-01]: https://github.com/Azure/azure-iot-remote-monitoring/blob/3fd43b8a9f7e0f2774d73f3569439063705cebe4/DeviceAdministration/Web/WebApiControllers/TelemetryApiController.cs#L27
[lnk-telemetry-api-controller-02]: https://github.com/Azure/azure-iot-remote-monitoring/blob/e7003339f73e21d3930f71ceba1e74fb5c0d9ea0/DeviceAdministration/Web/WebApiControllers/TelemetryApiController.cs#L25 
[lnk-sample-device-factory]: https://github.com/Azure/azure-iot-remote-monitoring/blob/master/Common/Factory/SampleDeviceFactory.cs#L40
[lnk-classic-portal]: https://manage.windowsazure.com
[lnk-direct-methods]: ../iot-hub/iot-hub-devguide-direct-methods.md
[lnk-cf-customize]: iot-suite-connected-factory-customize.md