---
title: Get started with preconfigured solutions | Microsoft Docs
description: Follow this tutorial to learn how to deploy an Azure IoT Suite preconfigured solution.
services: ''
suite: iot-suite
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 6ab38d1a-b564-469e-8a87-e597aa51d0f7
ms.service: iot-suite
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/15/2017
ms.author: dobett

---
# Tutorial: Get started with the preconfigured solutions
## Introduction
Azure IoT Suite [preconfigured solutions][lnk-preconfigured-solutions] combine multiple Azure IoT services to deliver end-to-end solutions that implement common IoT business scenarios. The *remote monitoring* preconfigured solution connects to and monitors your devices. You can use the solution to analyze the stream of data from your devices and to improve business outcomes by making processes respond automatically to that stream of data.

This tutorial shows you how to provision the remote monitoring preconfigured solution. It also walks you through the basic features of the preconfigured solution. You can access many of these features from the solution dashboard that deploys as part of the preconfigured solution:

![Remote monitoring preconfigured solution dashboard][img-dashboard]

To complete this tutorial, you need an active Azure subscription.

> [!NOTE]
> If you don’t have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][lnk_free_trial].
> 
> 

[!INCLUDE [iot-suite-provision-remote-monitoring](../../includes/iot-suite-provision-remote-monitoring.md)]

## View the solution dashboard
The solution dashboard enables you to manage the deployed solution. For example, you can view telemetry, add devices, and configure rules.

1. When the provisioning is complete and the tile for your preconfigured solution indicates **Ready**, click **Launch** to open your remote monitoring solution portal in a new tab.
   
   ![Launch the preconfigured solution][img-launch-solution]
2. By default, the solution portal shows the *solution dashboard*. You can select other views using the left-hand menu.
   
   ![Remote monitoring preconfigured solution dashboard][img-dashboard]

The dashboard displays the following information:

* The map displays the location of each device connected to the solution. When you first run the solution, there are four simulated devices. The simulated devices are implemented as Azure WebJobs, and the solution uses the Bing Maps API to plot information on the map.
* The **Telemetry History** panel plots humidity and temperature telemetry from a selected device in near real time and displays aggregate data such as maximum, minimum, and average humidity.
* The **Alarm History** panel shows recent alarm events when a telemetry value has exceeded a threshold. You can define your own alarms in addition to the examples created by the preconfigured solution.
* The **Jobs** panel displays information about scheduled jobs. You can schedule your own jobs on **Management jobs** page.

## View the device list
The *device list* shows all the registered devices in the solution. From the device list you can view and edit device metadata, add or remove devices, and invoke methods on devices.

1. Click **Devices** in the left-hand menu to show the device list for this solution.
   
   ![Device list in dashboard][img-devicelist]
2. The device list initially shows four simulated devices created by the provisioning process. You can add additional simulated and physical devices to the solution.
3. You can customize the information shown in the device list by clicking **Column editor**. You can add and remove columns that display reported property and tag values. You can also reorder and rename columns:
   
   ![Column editor in dashboard][img-columneditor]
4. To view device details, click a device in the device list.
   
   ![Device details in dashboard][img-devicedetails]

The **Device Details** panel contains six sections:

* A collection of links that enable you to customize the device icon, disable the device, add a rule, invoke a method, or send a command. For a comparison of commands (device-to-cloud messages) and methods (direct methods), see [Cloud-to-device communications guidance][lnk-c2d-guidance].
* The **Device Twin - Tags** section enables you to edit tag values for the device. You can display tag values in the device list and use tag values to filter the device list.
* The **Device Twin - Desired Properties** section enables you to set property values to be sent to the device.
* The **Device Twin - Reported Properties** section shows property values sent from the device.
* The **Device Properties** section shows information from the identity registry such as the device id and authentication keys.
* The **Recent Jobs** section shows information about any jobs that have recently targeted this device.

## Customize the device icon

You can customize the device icon displayed in the device list from the **Device Details** panel as follows:

1. Click the pencil icon to open the **Edit image** panel for a device:
   
   ![Open device image editor][img-startimageedit]
2. Either upload a new image or use one of the existing images and then click **Save**:
   
   ![Edit device image editor][img-imageedit]
3. The image you selected now displays in the **Icon** column for the device.

> [!NOTE]
> The image is stored in blob storage. A tag in the device twin contains a link to the image in blob storage.
> 
> 

## Invoke a method on a device
From the **Device Details** panel, you can invoke methods on the device. When a device first starts, it sends information about the methods it supports to the solution.

1. Click **Methods** in the **Device Details** panel for the selected device:
   
   ![Device methods in dashboard][img-devicemethods]
2. Select **Reboot** in the method list.
3. Click **Invoke Method**.
4. You can see the status of the method invocation in the method history.
   
   ![Method status in dashboard][img-pingmethod]

The solution tracks the status of each method it invokes. When the device completes the method, you see a new entry in the method history table.

Some methods start asynchronous jobs on the device. For example, the **InitiateFirmwareUpdate** method starts an asynchronous task to perform the update. The device uses reported properties to report on the status of the firmware update as it progresses.

## Send a command to a device
From the **Device Details** panel, you can send commands to the device. When a device first starts, it sends information about the commands it supports to the solution.

1. Click **Commands** in the **Device Details** panel for the selected device:
   
   ![Device commands in dashboard][img-devicecommands]
2. Select **PingDevice** from the command list.
3. Click **Send Command**.
4. You can see the status of the command in the command history.
   
   ![Command status in dashboard][img-pingcommand]

The solution tracks the status of each command it sends. Initially the result is **Pending**. When the device reports that it has executed the command, the result is set to **Success**.

## Add a new simulated device
When you deploy the preconfigured solution, you automatically provision four sample devices that you can see in the device list. These devices are *simulated devices* running in an Azure WebJob. Simulated devices make it easy for you to experiment with the preconfigured solution without the need to deploy real, physical devices. If you do want to connect a real device to the solution, see the [Connect your device to the remote monitoring preconfigured solution][lnk-connect-rm] tutorial.

The following steps show you how to add a simulated device to the solution:

1. Navigate back to the device list.
2. To add a device, click **+ Add A Device** in the bottom left corner.
   
   ![Add a device to the preconfigured solution][img-adddevice]
3. Click **Add New** on the **Simulated Device** tile.
   
   ![Set new device details in dashboard][img-addnew]
   
   In addition to creating a new simulated device, you can also add a physical device if you choose to create a **Custom Device**. To learn more about connecting physical devices to the solution, see [Connect your device to the IoT Suite remote monitoring preconfigured solution][lnk-connect-rm].
4. Select **Let me define my own Device ID**, and enter a unique device ID name such as **mydevice_01**.
5. Click **Create**.
   
   ![Save a new device][img-definedevice]
6. In step 3 of **Add a simulated device**, click **Done** to return to the device list.
7. You can view your device **Running** in the device list.
   
    ![View new device in device list][img-runningnew]
8. You can also view the simulated telemetry from your new device on the dashboard:
   
    ![View telemetry from new device][img-runningnew-2]

## Device properties
The remote monitoring preconfigured solution uses [device twins][lnk-device-twin] to synchronize device metadata between devices and the solution back end. A device twin is a JSON document stored in IoT Hub that stores property values for an individual device. Devices regularly send metadata to the solution back end as *reported properties* to store in the device twin. The solution back end can set *desired properties* in the device twin to send metadata updates to devices. The reported properties show the most recent metadata values sent by the device. For more information, see [Device identity registry, device twin, and DocumentDB][lnk-devicemetadata].

> [!NOTE]
> The solution also uses a DocumentDB database to store device-specific data related to commands and methods.
> 
> 

1. Navigate back to the device list.
2. Select your new device in the **Devices List**, and then click **Edit** to edit the **Device Twin - Desired Properties**:
   
   ![Edit device desired properties][img-editdevice]
3. Set the **Desired Property Name** to **Latitude** and set the value to **47.639521**. Then click **Save Changes to Device Registry**:
   
    ![Edit device desired property][img-editdevice2]
4. In the **Device Details** panel, the new latitude value initially shows as a desired property, and the old latitude value shows as a reported property:
   
    ![View reported property][img-editdevice3]
5. Currently, simulated devices in the preconfigured solution only process the **Desired.Config.TemperatureMeanValue** and the **Desired.Config.TelemetryInterval** desired properties. A real device should read all desired properties from the IoT hub, make the changes to its configuration, and report the new values to the hub as reported properties.

On the **Device Details** panel, you can also edit the **Device Twin - Tags** in the same way that you edit **Device Twin - Desired Properties**. However, unlike desired properties, tags do not synchronize with the device. Tags only exist in the device twin in the IoT hub. Tags are useful for building custom filters in the device list.

## Sort the device list

You can sort the device list by clicking next to a column heading. The first click sorts in ascending order, the second click sorts in descending order:

![Sort device list][img-sortdevices]

## Filter the device list

In the device list, you can create, save, and reload filters to display a customized list of devices connected to your hub. To create a filter:

1. Click the edit filter icon above the list of devices:
   
   ![Open the filter editor][img-editfiltericon]
2. In the **Filter editor**, add the fields, operators, and values to filter the device list. You can add multiple clauses to refine your filter. Click **Filter** to apply the filter:
   
   ![Create a filter][img-filtereditor]
3. In this example, the list is filtered by manufacturer and model number:
   
   ![Filtered list][img-filterelist]
4. To save your filter with a custom name, click the **Save as** icon:
   
   ![Save a filter][img-savefilter]
5. To reapply a filter you saved previously, click the **Open saved filter** icon:
   
   ![Open a filter][img-openfilter]

You can create filters based on device id, device state, desired properties, reported properties, and tags.

> [!NOTE]
> In the **Filter editor**, you can use the **Advanced view** to edit the query text directly.
> 
> 

## Add a rule for the new device
There are no rules for the new device you just added. In this section, you add a rule that triggers an alarm when the temperature reported by the new device exceeds 47 degrees. Before you start, notice that the telemetry history for the new device on the dashboard shows the device temperature never exceeds 45 degrees.

1. Navigate back to the device list.
2. To add a rule for the device, select your new device in the **Devices List**, and then click **Add rule**.
3. Create a rule that uses **Temperature** as the data field and uses **AlarmTemp** as the output when the temperature exceeds 47 degrees:
   
    ![Add a device rule][img-adddevicerule]
4. To save your changes, click **Save and View Rules**.
5. Click **Commands** in the device details pane for the new device.
   
   ![Add a device rule][img-adddevicerule2]
6. Select **ChangeSetPointTemp** from the command list and set **SetPointTemp** to 45. Then click **Send Command**:
   
   ![Add a device rule][img-adddevicerule3]
7. Navigate back to the solution dashboard. After a short time, you will see a new entry in the **Alarm History** pane when the temperature reported by your new device exceeds the 47-degree threshold:
   
   ![Add a device rule][img-adddevicerule4]
8. You can review and edit all your rules on the **Rules** page of the dashboard:
   
    ![List device rules][img-rules]
9. You can review and edit all the actions that can be taken in response to a rule on the **Actions** page of the dashboard:
   
    ![List device actions][img-actions]

> [!NOTE]
> It is possible to define actions that can send an email message or SMS in response to a rule or integrate with a line-of-business system through a [Logic App][lnk-logic-apps]. For more information, see the [Connect Logic App to your Azure IoT Suite Remote Monitoring preconfigured solution][lnk-logicapptutorial].
> 
> 

## Disable and remove devices
You can disable a device, and after it is disabled you can remove it:

![Disable and remove a device][img-disable]

## Run jobs
You can schedule jobs to perform bulk operations on your devices. You create a job for a list of devices. This list can contain all your devices or it can be a filtered list you created using the [filter tools](#filter-the-device-list) in the device list. A job can invoke a method on every device in the list or it can update the device twin for every device in the device list.

### Create a job to invoke a method

The following steps show you how to create a job that invokes the firmware update method on every device in a list. The method is only invoked on devices that support the method:

1. Use the filter tools on the device list to create a list of devices to receive the firmware update:
   
   ![Open the filter editor][img-editfiltericon]
2. On your filtered list, click **Job scheduler**:
   
   ![Open the job scheduler][img-clickjobscheduler]
3. On the **Schedule job** panel, click **Invoke Method**.
4. On the **Invoke Method** page, enter then details of the method to invoke, and then click **Schedule**:
   
   ![Configure method job][img-invokemethodjob]

The **InitiateFirmwareUpdate** method starts a task asynchronously on the device and immediately returns. The firmware update process then uses reported properties to report on the update process as it runs.

### Create a job to edit the device twin

The following steps show you how to create a job that edits the device twin on every device in a list:

1. Use the filter tools on the device list to create a list of devices to receive device twin edits:
   
   ![Open the filter editor][img-editfiltericon]
2. On your filtered list, click **Job scheduler**:
   
   ![Open the job scheduler][img-clickjobscheduler]
3. On the **Schedule job** panel, click **Edit Device Twin**.
4. On the **Edit Device Twin** page, enter then details of the **Desired Properties** and **Tags** to edit, and then click **Schedule**:
   
   ![Configure method job][img-edittwinjob]

### Monitor the job
You can monitor the status of the jobs you schedule on the **Management Jobs** page. The **Job Details** panel displays information about the selected job:
   
   ![View job status][img-jobstatus]

You can also view information about jobs on the **Dashboard**:
   
   ![View jobs on the dashboard][img-jobdashboard]


## Behind the scenes
When you deploy a preconfigured solution, the deployment process creates multiple resources in the Azure subscription you selected. You can view these resources in the Azure [portal][lnk-portal]. The deployment process creates a **resource group** with a name based on the name you choose for your preconfigured solution:

![Preconfigured solution in the Azure portal][img-portal]

You can view the settings of each resource by selecting it in the list of resources in the resource group.

You can also view the source code for the preconfigured solution. The remote monitoring preconfigured solution source code is in the [azure-iot-remote-monitoring][lnk-rmgithub] GitHub repository:

* The **DeviceAdministration** folder contains the source code for the dashboard.
* The **Simulator** folder contains the source code for the simulated device.
* The **EventProcessor** folder contains the source code for the back-end process that handles the incoming telemetry.

When you are done, you can delete the preconfigured solution from your Azure subscription on the [azureiotsuite.com][lnk-azureiotsuite] site. This site enables you to easily delete all the resources that were provisioned when you created the preconfigured solution.

> [!NOTE]
> To ensure that you delete everything related to the preconfigured solution, delete it on the [azureiotsuite.com][lnk-azureiotsuite] site and do not delete the resource group in the portal.
> 
> 

## Next Steps
Now that you’ve deployed a working preconfigured solution, you can continue getting started with IoT Suite by reading the following articles:

* [Remote monitoring preconfigured solution walkthrough][lnk-rm-walkthrough]
* [Connect your device to the remote monitoring preconfigured solution][lnk-connect-rm]
* [Permissions on the azureiotsuite.com site][lnk-permissions]

[img-launch-solution]: media/iot-suite-getstarted-preconfigured-solutions/launch.png
[img-dashboard]: media/iot-suite-getstarted-preconfigured-solutions/dashboard.png
[img-devicelist]: media/iot-suite-getstarted-preconfigured-solutions/devicelist.png
[img-devicedetails]: media/iot-suite-getstarted-preconfigured-solutions/devicedetails.png
[img-devicecommands]: media/iot-suite-getstarted-preconfigured-solutions/devicecommands.png
[img-devicemethods]: media/iot-suite-getstarted-preconfigured-solutions/devicemethods.png
[img-pingcommand]: media/iot-suite-getstarted-preconfigured-solutions/pingcommand.png
[img-pingmethod]: media/iot-suite-getstarted-preconfigured-solutions/pingmethod.png
[img-adddevice]: media/iot-suite-getstarted-preconfigured-solutions/adddevice.png
[img-addnew]: media/iot-suite-getstarted-preconfigured-solutions/addnew.png
[img-definedevice]: media/iot-suite-getstarted-preconfigured-solutions/definedevice.png
[img-runningnew]: media/iot-suite-getstarted-preconfigured-solutions/runningnew.png
[img-runningnew-2]: media/iot-suite-getstarted-preconfigured-solutions/runningnew2.png
[img-rules]: media/iot-suite-getstarted-preconfigured-solutions/rules.png
[img-editdevice]: media/iot-suite-getstarted-preconfigured-solutions/editdevice.png
[img-editdevice2]: media/iot-suite-getstarted-preconfigured-solutions/editdevice2.png
[img-editdevice3]: media/iot-suite-getstarted-preconfigured-solutions/editdevice3.png
[img-adddevicerule]: media/iot-suite-getstarted-preconfigured-solutions/addrule.png
[img-adddevicerule2]: media/iot-suite-getstarted-preconfigured-solutions/addrule2.png
[img-adddevicerule3]: media/iot-suite-getstarted-preconfigured-solutions/addrule3.png
[img-adddevicerule4]: media/iot-suite-getstarted-preconfigured-solutions/addrule4.png
[img-actions]: media/iot-suite-getstarted-preconfigured-solutions/actions.png
[img-portal]: media/iot-suite-getstarted-preconfigured-solutions/portal.png
[img-disable]: media/iot-suite-getstarted-preconfigured-solutions/solutionportal_08.png
[img-columneditor]: media/iot-suite-getstarted-preconfigured-solutions/columneditor.png
[img-startimageedit]: media/iot-suite-getstarted-preconfigured-solutions/imagedit1.png
[img-imageedit]: media/iot-suite-getstarted-preconfigured-solutions/imagedit2.png
[img-sortdevices]: media/iot-suite-getstarted-preconfigured-solutions/sortdevices.png
[img-editfiltericon]: media/iot-suite-getstarted-preconfigured-solutions/editfiltericon.png
[img-filtereditor]: media/iot-suite-getstarted-preconfigured-solutions/filtereditor.png
[img-filterelist]: media/iot-suite-getstarted-preconfigured-solutions/filteredlist.png
[img-savefilter]: media/iot-suite-getstarted-preconfigured-solutions/savefilter.png
[img-openfilter]:  media/iot-suite-getstarted-preconfigured-solutions/openfilter.png
[img-clickjobscheduler]: media/iot-suite-getstarted-preconfigured-solutions/clickscheduler.png
[img-invokemethodjob]: media/iot-suite-getstarted-preconfigured-solutions/invokemethodjob.png
[img-edittwinjob]: media/iot-suite-getstarted-preconfigured-solutions/edittwinjob.png
[img-jobstatus]: media/iot-suite-getstarted-preconfigured-solutions/jobstatus.png
[img-jobdashboard]: media/iot-suite-getstarted-preconfigured-solutions/jobdashboard.png

[lnk_free_trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-preconfigured-solutions]: iot-suite-what-are-preconfigured-solutions.md
[lnk-azureiotsuite]: https://www.azureiotsuite.com
[lnk-logic-apps]: https://azure.microsoft.com/documentation/services/app-service/logic/
[lnk-portal]: http://portal.azure.com/
[lnk-rmgithub]: https://github.com/Azure/azure-iot-remote-monitoring
[lnk-devicemetadata]: iot-suite-what-are-preconfigured-solutions.md#device-identity-registry-device-twin-and-documentdb
[lnk-logicapptutorial]: iot-suite-logic-apps-tutorial.md
[lnk-rm-walkthrough]: iot-suite-remote-monitoring-sample-walkthrough.md
[lnk-connect-rm]: iot-suite-connecting-devices.md
[lnk-permissions]: iot-suite-permissions.md
[lnk-c2d-guidance]: ../iot-hub/iot-hub-devguide-c2d-guidance.md
[lnk-device-twin]: ../iot-hub/iot-hub-devguide-device-twins.md