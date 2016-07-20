<properties
	pageTitle="Customizing preconfigured solutions | Microsoft Azure"
	description="Provides guidance on how to customize the Azure IoT Suite preconfigured solutions."
	services=""
    suite="iot-suite"
	documentationCenter=".net"
	authors="stevehob"
	manager="timlt"
	editor=""/>

<tags
     ms.service="iot-suite"
     ms.devlang="dotnet"
     ms.topic="article"
     ms.tgt_pltfrm="na"
     ms.workload="na"
     ms.date="06/27/2016"
     ms.author="stevehob"/>

# Customize a preconfigured solution

The preconfigured solutions provided with the Azure IoT Suite demonstrate the services within the suite working together to deliver an end-to-end solution. From this starting point, there are a variety of places in which you can extend and customize the solution for specific scenarios. The following sections describe these common customization points.

## Finding the source code

The source code for the preconfigured solutions is available on GitHub in the following repositories:

- Remote Monitoring: [https://www.github.com/Azure/azure-iot-remote-monitoring](https://github.com/Azure/azure-iot-remote-monitoring)
- Predictive Maintenance: [https://github.com/Azure/azure-iot-predictive-maintenance](https://github.com/Azure/azure-iot-predictive-maintenance)

The source code for the preconfigured solutions is provided to demonstrate the patterns and practices used to implement the end-to-end functionality of an IoT solution using Azure IoT Suite. You can find more information about how to build and deploy the solutions in the GitHub repositories.

## Changing the preconfigured rules

The remote monitoring solution includes three [Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/) jobs to implement device information, telemetry and rules logic displayed  for the solution.

The three stream analytics jobs and their syntax is described in depth in the [Remote monitoring preconfigured solution walkthrough](iot-suite-remote-monitoring-sample-walkthrough.md). 

You can edit these jobs directly to alter the logic, or add logic specific to your scenario. You can find the Stream Analytics jobs as follows:
 
1. Go to [Azure portal](https://portal.azure.com).
2. Navigate to the resource group with the same name as your IoT solution. 
3. Select the Azure Stream Analytics job you'd like to modify. 
4. Stop the job by selecting **Stop**in the set of commands. 
5. Edit the inputs, query, and outputs.

    A simple modification is to change the query for the **Rules** job to use a **"<"** instead of a **">"**. The solution portal will still show **">"** when you edit a rule, but you'll notice the behavior is flipped due to the change in the underlying job.

6. Start the job

> [AZURE.NOTE] The remote monitoring dashboard depends on specific data, so altering the jobs can cause the dashboard to fail.

## Adding your own rules

In addition to changing the preconfigured Azure Stream Analytics jobs, you can use the Azure portal to add new jobs or add new queries to existing jobs.

## Customizing devices

One of the most common extension activities is working with devices specific to your scenario. There are several methods for working with devices. These methods include altering a simulated device to match your scenario, or using the [IoT Device SDK][] to connect your physical device to the solution.

For a step-by-step guide to adding devices to the remote monitoring preconfigured solution, see [Iot Suite Connecting Devices](iot-suite-connecting-devices.md) and the [remote monitoring C SDK Sample](https://github.com/Azure/azure-iot-sdks/tree/master/c/serializer/samples/remote_monitoring) that is designed to work with the remote monitoring preconfigured solution.

### Creating your own simulated device

Included in the remote monitoring solution source code (referenced above), is a .NET simulator. This simulator is the one provisioned as part of the solution and can be altered to send different metadata, telemetry or respond to different commands.

The preconfigured simulator in the remote monitoring preconfigured solution is a cooler device that emits temperature and humidity telemetry, you can modify the simulator in the [Simulator.WebJob](https://github.com/Azure/azure-iot-remote-monitoring/tree/master/Simulator/Simulator.WebJob ) project when you've forked the GitHub repository.

### Available locations for simulated devices

The default set of locations is in Seattle/Redmond, Washington, United States of America. You can change these locations in [SampleDeviceFactory.cs][lnk-sample-device-factory].


### Building and using your own (physical) device

The [Azure IoT SDKs](https://github.com/Azure/azure-iot-sdks) provide libraries for connecting numerous device types (languages and operating systems) into IoT solutions.

## Modifying dashboard limits

### Number of devices displayed in dashboard dropdown

The default is 200. You can change this number in [DashboardController.cs][lnk-dashboard-controller].

### Number of pins to display in Bing Map control

The default is 200. You can change this number in [TelemetryApiController.cs][lnk-telemetry-api-controller-01].

### Time period of telemetry graph

The default is 10 minutes. You can change this in [TelmetryApiController.cs][lnk-telemetry-api-controller-02].

## Manually setting up application roles

The following procedure describes how to add **Admin** and **ReadOnly** application roles to a preconfigured solution. Note that preconfigured solutions provisioned from the azureiotsuite.com site already include the **Admin** and **ReadOnly** roles.

Members of the **ReadOnly** role can see the dashboard and the device list, but are not allowed to add devices, change device attributes, or send commands.  Members of the **Admin** role have full access to all the functionality in the solution.

1. Go to the [Azure classic portal][lnk-classic-portal].

2. Select **Active Directory**.

3. Click the name of the AAD tenant you used when you provisioned your solution.

4. Click **Applications**.

5. Click the name of the application that matches your preconfigured solution name. If you don't see your application in the list, select **Applications my company owns** in the **Show** drop down and click the check mark.

6.  At the bottom of the page, click **Manage Manifest** and then **Download Manifest**.

7. This downloads a .json file to your local machine.  Open this file for editing in a text editor of your choice.

8. On the third line of the .json file, you will find:

  ```
  "appRoles" : [],
  ```
  Replace this with the following:

  ```
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

10.  In the Azure Management Portal, at the bottom of the page, select **Manage Manifest** then **Upload Manifest** to upload the .json file you saved in the previous step.

11. You have now added the **Admin** and **ReadOnly** roles to your application.

12. To assign one of these roles to a user in your directory, see [Permissions on the azureiotsuite.com site][lnk-permissions].

## Feedback

Do you have a customization you'd like to see covered in this document? Please add feature suggestions to [User Voice](https://feedback.azure.com/forums/321918-azure-iot), or comment on this article below. 

## Next steps

For more information about IoT devices, see the [Azure IoT Developer Site](https://azure.microsoft.com/develop/iot/) to find links and documentation.

[IoT Device SDK]: https://azure.microsoft.com/documentation/articles/iot-hub-sdks-summary/
[lnk-permissions]: iot-suite-permissions.md
[lnk-dashboard-controller]: https://github.com/Azure/azure-iot-remote-monitoring/blob/3fd43b8a9f7e0f2774d73f3569439063705cebe4/DeviceAdministration/Web/Controllers/DashboardController.cs#L27
[lnk-telemetry-api-controller-01]: https://github.com/Azure/azure-iot-remote-monitoring/blob/3fd43b8a9f7e0f2774d73f3569439063705cebe4/DeviceAdministration/Web/WebApiControllers/TelemetryApiController.cs#L27
[lnk-telemetry-api-controller-02]: https://github.com/Azure/azure-iot-remote-monitoring/blob/e7003339f73e21d3930f71ceba1e74fb5c0d9ea0/DeviceAdministration/Web/WebApiControllers/TelemetryApiController.cs#L25 
[lnk-sample-device-factory]: https://github.com/Azure/azure-iot-remote-monitoring/blob/master/Common/Factory/SampleDeviceFactory.cs#L40
[lnk-classic-portal]: https://manage.windowsazure.com
