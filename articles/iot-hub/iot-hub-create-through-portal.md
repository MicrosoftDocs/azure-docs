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
ms.date: 05/02/2017
ms.author: dobett

---
# Create an IoT hub using the Azure portal
[!INCLUDE [iot-hub-resource-manager-selector](../../includes/iot-hub-resource-manager-selector.md)]

## Introduction
This article describes how to find the IoT Hub service in the Azure portal, and how to create and manage IoT hubs.

## Where to find IoT hubs
There are various places where you can find IoT hubs.

1. **+ New**: **Azure IoT Hub** is an IoT service, and can be found in the category **Internet of Things**, under **+ New**, similar to other services.
2. IoT hubs can also be accessed through the Marketplace as the hero service under **Internet of Things**.

## Create an IoT hub
You can create an IoT hub using the following methods:

* Creating an IoT hub through the **+ New** option leads to the blade shown in the next screen shot. The steps for creating the IoT hub through this method and through the marketplace are identical.
* Creating an IoT hub through the Marketplace: Clicking **Create** opens a blade that is identical to the previous blade for the **+New** experience. The next sections list the several steps involved in creating an IoT hub.

### Choose the name of the IoT hub
To create an IoT hub, you must name the IoT hub. This name must be unique across the IoT hubs. No duplication of hubs is allowed on the solution back end, so it is recommended that this hub is named as uniquely as possible.

### Choose the pricing tier
You can choose from four tiers: **Free**, **Standard 1** and **Standard 2**, and **Standard S3**. The free tier allows only 500 devices to be connected to the IoT hub and up to 8,000 messages per day.

**Standard S1**: IoT Hubs S1 edition is designed for IoT solutions that have a large number of devices generating relatively small amounts of data per device. Each unit of the S1 edition allows up to 400,000 messages per day across all connected devices.

**Standard S2**: IoT Hub S2 edition is designed for IoT solutions in which devices generate large amounts of data. Each unit of the S2 edition allows up to 6 million messages per day between all connected devices.

**Standard S3**: IoT Hub S3 edition is designed for IoT solutions that generate large amounts of data. Each unit of the S3 edition allows up to 300 million messages per day between all connected devices.

![][4]

> [!NOTE]
> IoT Hub only allows one free hub per Azure subscription.
> 
> 

### IoT hub units
The number of messages allowed per unit per day depends on your hub's pricing tier. For example, if you want the IoT hub to support ingress of 700,000 messages, you choose two S1 tier units.

### Device to cloud partitions and resource group
You can change the number of partitions for an IoT hub. Default partitions are set to 4; however, you can choose a different number of partitions from a drop-down list.

For resource groups, you do not need to explicitly create an empty resource group. When creating a resource, you can choose to either create a new resource group or use an existing resource group.

![][5]

### Choose subscriptions
Azure IoT Hub automatically shows the list of Azure subscriptions to which the user account is linked. You can choose one of the options here to associate the IoT hub with that Azure subscription.

### Choose the location
The location option provides a list of the regions in which IoT Hub is offered. IoT Hub is available to deploy in the following locations: Australia East, Australia Southeast, Asia East, Asia Southeast, Europe North, Europe West, Japan East, Japan West, US East, US West.

### Create the IoT hub
When all previous steps are complete, the IoT hub is ready to be created. Click **Create** to start the back-end process of creating this IoT hub with the specific options, and to deploy it to the location specified.

It can take a few minutes for the IoT hub to be created as it takes time for the back-end deployment to occur in the appropriate location servers.

## Change the settings of the IoT hub
You can change the settings of an existing IoT hub after it is created from the IoT Hub blade.

![][8]

**Shared access policies**: These policies define the permissions for devices and services to connect to IoT Hub. You can access these policies by clicking **Shared access policies** under **General**. In this blade, you can either modify existing policies or add a new policy.

### Create a policy
* Click **Add** to open a blade. Here you can enter the new policy name and the permissions that you want to associate with this policy, as shown in the following figure:
  
    There are several permissions that can be associated with these shared policies. The first two policies, **Registry read** and **Registry write**, grant read and write access rights to the device identity store or the identity registry. Choosing the write option automatically chooses the read option as well.
  
     The **Service connect** policy grants permission to access the cloud-side endpoints such as the consumer group for services connecting to the IoT hub. The **Device connect** policy grants permissions for sending and receiving messages on the device-side endpoints of the IoT hub.
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

    * **Consumer Groups**: Consumer groups are a setting similar to other messaging systems that can be used to pull data in specific ways to connect other applications or services to IoT Hub. Every IoT hub is created with a default consumer group. However, you can add or delete consumer groups to your IoT hubs using this setting.

    > [!NOTE]
    > The default consumer group cannot be edited or deleted.
    > 
    > 

### Custom endpoints
You can add custom endpoints on your IoT hub using the portal. From the **Endpoints** blade, click **Add** at the top to open the **Add endpoint** blade. Enter the required information, then click **OK**. Your custom endpoint is now listed in the main **Endpoints** blade.

![][13]

You can read more about custom endpoints in [Reference - IoT hub endpoints][lnk-devguide-endpoints].

## Routes
Click **Routes** to manage how IoT Hub dispatches your device-to-cloud messages.

![][14]

You can add routes to your IoT hub by clicking **Add** at the top of the **Routes*** blade, entering the required information, and clicking **OK**. Your route is then listed in the main **Routes** blade. You can edit a route by clicking it in the list of routes. To enable a route, click it in the list of routes and set the **Enabled** toggle to **Off**. Click **OK** at the bottom of the blade to save the change.

![][15]

## Pricing and scale
The pricing of an existing IoT hub can be changed through the **Pricing** settings, with the following exceptions:

* In the current implementation, an IoT hub with a free SKU cannot change tiers to one of the paid SKUs, or vice versa.
* There can only be one free tier IoT hub in the Azure subscription.

![][12]

Moving from a higher tier (S2 or S3) to lower tier (S1 or S2) is allowed only when the number of messages sent for that day are not in conflict. For example, if the number of messages per day exceeds 400,000, then the tier for the IoT hub can be changed. However, if you change to the S1 tier then the IoT hub is throttled for that day.

## Delete the IoT hub
You can browse to the IoT hub you want to delete by clicking **Browse**, and then choosing the appropriate hub to delete. Click the **Delete** button below the IoT hub name to delete the IoT hub.

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
