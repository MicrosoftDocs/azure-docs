<properties
 pageTitle="Use the IoT Hub device management UI | Microsoft Azure"
 description="Walkthrough of using the Azure IoT Hub device management UI"
 services="iot-hub"
 documentationCenter=""
 authors="dominicbetts"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="06/08/2016"
 ms.author="dobett"/>

# Explore Azure IoT Hub device management using the sample UI

Interacting with the sample device management UI will help you to solidify the concepts and capabilities covered in the Azure IoT Hub device management [Overview][lnk-dm-overview] and [Get started][lnk-get-started] articles. This article walks you through each of the three main device management concepts – *device twin*, *device queries*, and *device jobs* – as represented in the sample device management web UI.

Developers looking to build their own device management interactive experience can fork the sample UI codebase to use as a basis for a custom project. You can review the full project code and readme documents that detail additional developer capabilities in the [Azure IoT device management UI][lnk-dm-github] GitHub repository.

## Prerequisites

Before starting this tutorial, you should complete the steps in the [Get started with Azure IoT Hub device management][lnk-get-started] article. If you have not done so, please return and complete all steps in this article before proceeding.

When you have completed the "Get started" tutorial, you will have the following running on your test system:

- Six **iotdm\_simple\_sample** simulated devices running in console/terminal windows, each with a successful "REGISTERED" message.

- The device management sample UI application built and running locally at <http://127.0.0.1:3003>.

## Default Devices View

The default home screen for the device management sample UI is the **Devices** view which includes the following 5 components:

![][1]

1.  *Navigation buttons*: **Devices** view (selected), **Job History** view, and **Add a Device** view.

2. *Device search*: Find and edit a single device by device ID.

3.  *Device actions*: **Edit** action, **Delete** action, and **Export** action.

4.  *Device jobs*: **Reboot** device, **Firmware Update**, and **Factory Reset**.

5.  *Device grid filter*: Filter editor for building and saving custom views of the device grid.

6.  *Device grid*: View all devices registered with your IoT Hub instance with the default properties (**Device ID**, **Status**, and **Tags**).

The [device management overview][lnk-dm-overview] introduced the *device twin* concept which represents a physical (or simulated) device in the Azure IoT hub. From the device grid you can select any registered device from the device list to view and edit the device twin for that device.

Enter this detailed view on your first simulated device, **Device11-7ce4a850**, by selecting the corresponding device row and then clicking the **Edit** button (you can also double-click the row or enter the device ID in the search box).

You are now viewing the full representation of the device twin components where you can update writeable properties and run other device operations as detailed below:

![][2]

1.  **Edit a Device Twin**: This includes an **Enabled/Disabled** toggle for the device.

2.  **Service Properties**: This includes device **Tags**.

3.  **Device Properties**: Click to expand this section.

4.  **Refresh** button: Retrieve the most recent device twin properties and values.

To proceed, click **Cancel** in the bottom-right corner of this view to return to the default device list page.

## Use device queries to filter the device view

Device queries are a powerful way to quickly locate a device or a group of devices with a particular property (such as a particular tag). The sample UI uses device queries to populate the device listing on the default device list page. The sample UI enables you to add and remove service properties in the table and filter on some of these properties.

Perform the following steps to create a customer filter on the "bacon" service property tag:

1.  Click on the funnel icon to open the device query edit view:

    ![][3]

2.  Click **+ Add a filter** to expand the editor. Select **Tags** from the property dropdown and enter **bacon** into the text field and click **Apply**. The device list now displays only the three devices with the "bacon" tag:

    ![][4]

3.  In the query title field (next to the funnel icon), name the query **Only Bacon** and click **Save**:

    ![][5]

4.  Click the funnel icon to exit the device query editor.

## Use a device job to simulate device reboots 

As you learned in the device management overview, device jobs enable you to orchestrate simple or complex actions on one or more physical devices. In this section you will create a device job in the sample UI to perform a reboot operation on all simulation devices with the "bacon" tag:

1.  From the **Only Bacon** device query list, click on each device row to mark it for the reboot job operation:

    ![][6]

2.  Click the **Reboot** button in the device jobs toolbar to create the reboot job. After confirming **Yes**, click the **Job History** hyperlink in the resulting **Job for Device has started** dialogue to navigate to the Device Jobs view.

    ![][7]

You have now created a single parent job that spawns three child jobs, each one performs the reboot operation on one of the three "bacon" tagged devices:

![][8]

Refreshing this screen after a few moments changes the status of the parent job and the three child jobs to **completed**, indicating that the reboot operations were successful and confirmed by the simulated devices. Use the **Device ID** column to determine which jobs are associated with which devices.


> [AZURE.NOTE] If your child jobs return the status "failed", check that your simulated devices are still running on your test system. If not, run the simulate.bat or simulate.sh script again and repeat the reboot device job steps above.

## Next steps

You’ve now completed a guided exploration of the device management concepts as using the sample device management UI experience. If you want to gain a more advanced understanding of the device management APIs and experiment with some code examples, visit the following developer tutorials and resources:

- [How to use the device twin][lnk-tutorial-twin]
- [How to find device twins using queries][lnk-tutorial-queries]
- [How to use device jobs to update device firmware][lnk-tutorial-jobs]
- [Enable managed devices behind an IoT gateway][lnk-dm-gateway]
- [Introducing the Azure IoT Hub device management client library][lnk-library-c]

To further explore the capabilities of IoT Hub, see:

- [Designing your solution][lnk-design]
- [Developer guide][lnk-devguide]
- [Simulating a device with the Gateway SDK][lnk-gateway]
- [Using the Azure Portal to manage IoT Hub][lnk-portal]

[1]: media/iot-hub-device-management-ui-sample/image1.png
[2]: media/iot-hub-device-management-ui-sample/image2.png
[3]: media/iot-hub-device-management-ui-sample/image3.png
[4]: media/iot-hub-device-management-ui-sample/image4.png
[5]: media/iot-hub-device-management-ui-sample/image5.png
[6]: media/iot-hub-device-management-ui-sample/image6.png
[7]: media/iot-hub-device-management-ui-sample/image7.png
[8]: media/iot-hub-device-management-ui-sample/image8.png

[lnk-dm-overview]: iot-hub-device-management-overview.md
[lnk-get-started]: iot-hub-device-management-get-started.md
[lnk-dm-github]: https://github.com/Azure/azure-iot-device-management/

[lnk-tutorial-twin]: iot-hub-device-management-device-twin.md
[lnk-tutorial-queries]: iot-hub-device-management-device-query.md
[lnk-tutorial-jobs]: iot-hub-device-management-device-jobs.md
[lnk-dm-gateway]: iot-hub-gateway-device-management.md
[lnk-library-c]: iot-hub-device-management-library.md

[lnk-design]: iot-hub-guidance.md
[lnk-devguide]: iot-hub-devguide.md
[lnk-gateway]: iot-hub-linux-gateway-sdk-simulated-device.md
[lnk-portal]: iot-hub-manage-through-portal.md