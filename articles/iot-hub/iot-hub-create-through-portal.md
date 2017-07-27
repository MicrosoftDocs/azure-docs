---
title: Use the Azure portal to create an IoT Hub | Microsoft Docs
description: How to create, manage, and delete Azure IoT hubs through the Azure portal. Includes information about pricing tiers, scaling, security, and messaging configuration.
services: iot-hub
documentationcenter: ''
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 0909cd2b-4c1e-49e0-b68a-75532caf0a6a
ms.service: iot-hub
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/26/2017
ms.author: dobett

---
# Create an IoT hub using the Azure portal

[!INCLUDE [iot-hub-resource-manager-selector](../../includes/iot-hub-resource-manager-selector.md)]

This article describes:

* How to find the IoT Hub service in the Azure portal.
* How to create and manage IoT hubs.

## Where to find the IoT Hub service

You can find the IoT Hub service in the following locations in the portal:

* Choose **+ New**, then choose **Internet of Things**.
* In the Marketplace, choose **Internet of Things**.

## Create an IoT hub

You can create an IoT hub using the following methods:

* The **+ New** option opens the blade shown in the following screen shot. The steps for creating the IoT hub through this method and through the marketplace are identical.
* In the Marketplace, choose **Create** to open the blade shown in the following screen shot.

The following sections describe the several steps to create an IoT hub:

### Choose the name of the IoT hub

To create an IoT hub, you must name the IoT hub. This name must be unique across all IoT hubs.

[!INCLUDE [iot-hub-pii-note-naming-hub](../../includes/iot-hub-pii-note-naming-hub.md)]

### Choose the pricing tier

You can choose from four tiers: **Free**, **Standard 1** and **Standard 2**, and **Standard S3**. The free tier allows only 500 devices to be connected to the IoT hub and up to 8,000 messages per day.

**Standard S1**: Use the S1 edition for IoT solutions with a large number of devices that each generate small amounts of data. Each unit of the S1 edition allows up to 400,000 messages per day across all connected devices.

**Standard S2**: Use the S2 edition for IoT solutions in which devices generate large amounts of data. Each unit of the S2 edition allows up to 6 million messages per day between all connected devices.

**Standard S3**: Use the S3 edition for IoT solutions that generate large amounts of data. Each unit of the S3 edition allows up to 300 million messages per day between all connected devices.

![][4]

> [!NOTE]
> IoT Hub only allows one free hub per Azure subscription.

### IoT hub units

The number of messages allowed per unit per day depends on your hub's pricing tier. For example, if you want the IoT hub to support ingress of 700,000 messages, you choose two S1 tier units.

### Device to cloud partitions and resource group

You can change the number of partitions for an IoT hub. The default number of partitions is 4, you can choose a different number from the drop-down list.

You do not need to explicitly create an empty resource group. When you create a resource, you can choose either to create a new, or use an existing resource group.

![][5]

### Choose subscription

Azure IoT Hub automatically lists the Azure subscriptions the user account is linked to. You can choose the Azure subscription to associate the IoT hub to.

### Choose the location

The location option provides a list of the regions where IoT Hub is available.

### Create the IoT hub

When all previous steps are complete, you can create the IoT hub. Click **Create** to start the back-end process to create and deploy the IoT hub with the options you chose.

It can take a few minutes to create the IoT hub as it takes time for the back-end deployment to run on the appropriate location servers.

## Change the settings of the IoT hub

You can change the settings of an existing IoT hub after it is created from the IoT Hub blade.

![][8]

**Shared access policies**: These policies define the permissions for devices and services to connect to IoT Hub. You can access these policies by clicking **Shared access policies** under **General**. In this blade, you can either modify existing policies or add a new policy.

### Create a policy

* Click **Add** to open a blade. Here you can enter the new policy name and the permissions that you want to associate with this policy, as shown in the following figure:

    There are several permissions that can be associated with these shared policies. The **Registry read** and **Registry write** policies grant read and write access rights to the identity registry. Choosing the write option automatically chooses the read option.

    The **Service connect** policy grants permission to access service endpoints such as **Receive device-to-cloud**. The **Device connect** policy grants permissions for sending and receiving messages using the IoT Hub device-side endpoints.

* Click **Create** to add this newly created policy to the existing list.

![][10]

## Endpoints

Click **Endpoints** to display a list of endpoints for the IoT hub that you are modifying. There are two types of endpoints: endpoints that are built into the IoT hub, and endpoints that you add to the IoT hub after its creation.

![][11]

### Built-in endpoints

There are two built-in endpoints: **Cloud to device feedback** and **Events**.

* **Cloud to device feedback** settings: This setting has two subsettings: **Cloud to Device TTL** (time-to-live) and **Retention time** (in hours) for the messages. When your first create an IoT hub, both these settings have the default value of one hour. To adjust these settings, use the sliders or type the values.
* **Events** settings: This setting has several subsettings, some of which are read-only. The following list describes these settings:

  * **Partitions**: A default value is set when the IoT hub is created. You can change the number of partitions through this setting.

  * **Event Hub-compatible name and endpoint**: When the IoT hub is created, an Event Hub is created internally that you may need access to under certain circumstances. You cannot customize the Event Hub-compatible name and endpoint values but you can copy them by clicking **Copy**.

  * **Retention Time**: Set to one day by default but you can change it using the drop-down list. This value is in days for the device-to-cloud setting.

  * **Consumer Groups**: Consumer groups enable multiple readers to read messages independently from the IoT hub. Every IoT hub is created with a default consumer group. However, you can add or delete consumer groups to your IoT hubs using this setting.

  > [!NOTE]
  > The default consumer group cannot be edited or deleted.

### Custom endpoints

You can add custom endpoints on your IoT hub using the portal. From the **Endpoints** blade, click **Add** at the top to open the **Add endpoint** blade. Enter the required information, then click **OK**. Your custom endpoint is now listed in the main **Endpoints** blade.

![][13]

You can read more about custom endpoints in [Reference - IoT hub endpoints][lnk-devguide-endpoints].

## Routes

Click **Routes** to manage how IoT Hub dispatches your device-to-cloud messages.

![][14]

You can add routes to your IoT hub by clicking **Add** at the top of the **Routes*** blade, entering the required information, and clicking **OK**. Your route is then listed in the main **Routes** blade. You can edit a route by clicking it in the list of routes. To enable a route, click it in the list of routes and set the **Enabled** toggle to **Off**. To save the change, click **OK** at the bottom of the blade.

![][15]

## Pricing and scale

The pricing of an existing IoT hub can be changed through the **Pricing** settings, with the following exceptions:

* In the current implementation, an IoT hub with a free SKU cannot change tiers to one of the paid SKUs, or vice versa.
* There can only be one free tier IoT hub in the Azure subscription.

![][12]

You can move from a higher to lower tier only when the number of messages sent that day do exceed the quota for the lower tier. For example, if the number of messages per day exceeds 400,000, then the tier for the IoT hub can be changed. However, if you change to the S1 tier then the IoT hub is throttled for that day.

## Delete the IoT hub

You can browse to the IoT hub you want to delete by clicking **Browse**, and then choosing the appropriate hub to delete. To delete the IoT hub, click the **Delete** button below the IoT hub name.

## Next steps

Follow these links to learn more about managing Azure IoT Hub:

* [Bulk manage IoT devices][lnk-bulk]
* [IoT Hub metrics][lnk-metrics]
* [Operations monitoring][lnk-monitor]

To further explore the capabilities of IoT Hub, see:

* [IoT Hub developer guide][lnk-devguide]
* [Simulating a device with IoT Edge][lnk-iotedge]
* [Secure your IoT solution from the ground up][lnk-securing]

[4]: ./media/iot-hub-create-through-portal/create-iothub.png
[5]: ./media/iot-hub-create-through-portal/location1.png
[8]: ./media/iot-hub-create-through-portal/portal-settings.png
[10]: ./media/iot-hub-create-through-portal/shared-access-policies.png
[11]: ./media/iot-hub-create-through-portal/messaging-settings.png
[12]: ./media/iot-hub-create-through-portal/pricing-error.png
[13]: ./media/iot-hub-create-through-portal/endpoint-creation.png
[14]: ./media/iot-hub-create-through-portal/routes-list.png
[15]: ./media/iot-hub-create-through-portal/route-edit.png

[lnk-bulk]: iot-hub-bulk-identity-mgmt.md
[lnk-metrics]: iot-hub-metrics.md
[lnk-monitor]: iot-hub-operations-monitoring.md

[lnk-devguide]: iot-hub-devguide.md
[lnk-iotedge]: iot-hub-linux-iot-edge-simulated-device.md
[lnk-securing]: iot-hub-security-ground-up.md
[lnk-devguide-endpoints]: iot-hub-devguide-endpoints.md
