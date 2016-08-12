<properties
	 pageTitle="Use the Azure portal to manage IoT Hub | Microsoft Azure"
	 description="An overview of how to create and manage Azure IoT hubs through the Azure portal"
	 services="iot-hub"
	 documentationCenter=""
	 authors="nasing"
	 manager="timlt"
	 editor=""/>

<tags
	 ms.service="iot-hub"
	 ms.devlang="na"
	 ms.topic="article"
	 ms.tgt_pltfrm="na"
	 ms.workload="na"
	 ms.date="08/10/2016"
	 ms.author="nasing"/>

# Manage IoT hubs through the Azure portal

## Introduction

This article describes how to get started with Azure IoT Hub through the Azure portal, how to find IoT hubs, and how to create and manage IoT hubs.

## Where to find IoT hubs

There are a number of places in which you can find IoT hubs.

1. **+ New**: **Azure IoT Hub** is an IoT service, and can be found in the category **Internet of Things**, under **+ New**, similar to other services.

2. IoT hubs can also be accessed through the Marketplace as the hero service under **Internet of Things**.

## Create an IoT hub

You can create an IoT hub using the following methods.

1. Creating an IoT hub through the **+ New** option leads to the blade shown in the next screen shot. The steps for creating the IoT hub through this method and through the marketplace are identical.

2. Creating an IoT hub through the Marketplace: Clicking **Create** opens a blade that is identical to the previous blade for the **+New** experience. The next sections lists the several steps involved in creating an IoT hub.

### Choose the name of the IoT hub

To create an IoT hub, you must name the hub. Note that this name must be unique across the hubs. No duplication of hubs is allowed on the back end, so it is recommended that this hub is named as uniquely as possible.

### Choose the pricing tier

You can choose from four tiers: **Free**, **Standard 1** and **Standard 2**, and **Standard S3**. The free tier allows only 500 devices to be connected to the IoT hub and up to 8,000 messages per day.

**Standard S1**: IoT Hubs S1 edition is designed for IoT solutions that have a large number of devices generating relatively small amounts of data per device. Each unit of the S1 edition allows up to 400,000 messages per day across all connected devices.

**Standard S2**: IoT Hub S2 edition is designed for IoT solutions in which devices generate large amounts of data. Each unit of the S2 edition allows up to 6 million messages per day between all connected devices.

**Standard S3**: IoT Hub S3 edition is designed for IoT solutions that generate large amounts of data. Each unit of the S3 edition allows up to 300 million messages per day between all connected devices.

![][4]

> [AZURE.NOTE] IoT Hub only allows one free hub per subscription.

### IoT hub units

An IoT hub unit includes a certain number of messages per day, so choosing the number of IoT units means that the total number of messages supported for this hub is the number of units multiplied by the number of messages per day for that tier. For example, if you want the IoT hub to support ingress of 700,000 messages, you choose two units of the S1 tier.

### Device to cloud partitions and resource group

You can change the number of partitions for an IoT hub. Default partitions are set to 4; however, you can choose a different number of partitions from a drop-down list.

For resource groups, you do not need to explicitly create an empty resource group. When creating a new resource, you can choose to either create a new resource group or use an existing resource group.

![][5]

### Choose subscriptions

Azure IoT Hub automatically shows the list of subscriptions to which the user account is linked. You can choose one of the options here to associate the IoT hub with that subscription.

### Choose the location

The location option provides a list of the regions in which IoT Hub is offered. IoT Hub is available to deploy in the following locations: Australia East, Australia Southeast, Asia East, Asia Southeast, Europe North, Europe West, Japan East, Japan West, US East, US West.

### Create the IoT hub

When all previous steps are complete, the IoT hub is ready to be created. Click **Create** to start the back-end process of creating this IoT hub with the specific options, and to deploy it to the location specified.

Note that it can take a few minutes for the IoT hub to be created as it takes time for the back-end deployment to occur in the appropriate location servers.

## Change the settings of the IoT hub

You can change the settings of an existing IoT hub after it is created. Click the IoT hub name to open the settings page.

![][8]

**Shared Access Policies**: These policies define the permissions for devices and services to connect to IoT Hub. You can access these policies by clicking on **Shared Access Policies** under **Settings**. In this blade, you can either modify existing policies or add a new policy.

### Create a new policy

- Click **Add** to open a blade in which you can enter the new policy name and the permissions that you want to associate with this policy, as shown in the following figure.

	There are several permissions that can be associated with these shared policies. The first two policies, **Registry read** and **Registry write**, grant read and write access rights to the device identity store or the identity registry. Note that choosing the write option automatically chooses the read option as well.

 	The **Service connect** policy grants permission to access the cloud-side endpoints such as the consumer group for services connecting to the IoT hub, while the **Device connect** policy grants permissions for sending and receiving messages on the device-side endpoints of the IoT hub.

- Click **Create** to add this newly created policy to the existing list.

![][10]

## Messaging

Click the **Messaging** policies to display a list of messaging properties for the IoT hub that is being modified. There are two main types of properties that you can modify or copy: **Cloud to Device** and **Device to Cloud**.

- **Cloud to Device** settings: This setting has two subsettings: **Cloud to Device TTL** (time-to-live) and **Retention time** for the messages. When the IoT hub is first created, both these settings are created with a default value of one hour. However, you can customize these using the sliders, or type the values.

- **Device to Cloud** settings: This setting has several subsettings, some of which are named/assigned when the IoT hub is created and can only be copied to other subsettings that are customizable. These settings are listed in the next section.

**Partitions**: This value is set when the IoT hub is created and can be changed through this setting.

**Event Hub compatible name and endpoint**: When the IoT hub is created, an Event Hub is created internally which the you may need access to under certain circumstances. This Event Hub name and endpoint cannot be customized but is available for use via the **Copy** button.

**Retention Time**: Set to one day by default but can be customized to other values using the drop-down list. Note that this value is in days for Device to Cloud and not in hours, as is the similar setting for Cloud to Device.

**Consumer Groups**: Consumer Groups are a setting similar to other messaging systems that can be used to pull data in specific ways to connect other applications or services to IoT Hub. Every IoT hub is created with a default consumer group. However, you can add or delete consumer groups to your IoT hubs.

> [AZURE.NOTE] The default consumer group cannot be edited or deleted.

![][11]

## File upload

To use the file upload functionality in IoT Hub, you must first associate an Azure Storage account with your hub. Select the **File upload** settings to display a list of file upload properties for the IoT hub that is being modified.

**Storage container**: Use the portal to select a blob container in a storage account in your current subscription to associate with your IoT Hub. If necessary, you can create a new storage account on the **Storage accounts** blade and new blob container on the **Containers** blade. IoT Hub automatically generates SAS URIs with write permissions to this blob container for devices to use when they upload files.

![][14]

**Receive notifications for uploaded files**: Enable or disable file upload notifications via the toggle.

**SAS TTL**: This setting is the time-to-live of the SAS URIs returned to the device by IoT Hub. Set to one hour by default but can be customized to other values using the slider.

**File notification settings default TTL**: The time-to-live of a file upload notification before it is expired. Set to one day by default but can be customized to other values using the slider.

**File notification maximum delivery count**: The number of times the IoT Hub attempts to deliver a file upload notification. Set to 10 by default but can be customized to other values using the slider.

![][13]

## Pricing and scale

The pricing of an existing IoT hub can be changed through the **Pricing** settings, with the following exceptions:

- In the current implementation, an IoT hub with a free SKU cannot change tiers to one of the paid SKUs, or vice versa.
- There can only be one free tier IoT hub in the subscription.

![][12]

Moving from a higher tier (S2 or S3) to lower tier (S1 or S2) is allowed only when the number of messages sent for that day are not in conflict. For example, if the number of messages per day exceeds 400,000, then the tier for the IoT hub can be changed, but if you change to the S1 tier then the hub is throttled for that day.

## Delete the IoT hub

You can browse to the IoT hub you want to delete by clicking **Browse**, and then choosing the appropriate hub to delete. Click the **Delete** button below the hub name to delete the hub.

## Next steps

Follow these links to learn more about managing Azure IoT Hub:

- [Bulk manage IoT devices][lnk-bulk]
- [Usage metrics][lnk-metrics]
- [Operations monitoring][lnk-monitor]
- [Manage access to IoT Hub][lnk-itpro]

To further explore the capabilities of IoT Hub, see:

- [Designing your solution][lnk-design]
- [Developer guide][lnk-devguide]
- [Exploring device management using the sample UI][lnk-dmui]
- [Simulating a device with the Gateway SDK][lnk-gateway]
- [Secure your IoT solution from the ground up][lnk-securing]


  [4]: ./media/iot-hub-manage-through-portal/create-iothub.png
  [5]: ./media/iot-hub-manage-through-portal/location1.png
  [8]: ./media/iot-hub-manage-through-portal/portal-settings.png
  [10]: ./media/iot-hub-manage-through-portal/shared-access-policies.png
  [11]: ./media/iot-hub-manage-through-portal/messaging-settings.png
  [12]: ./media/iot-hub-manage-through-portal/pricing-error.png
  [13]: ./media/iot-hub-manage-through-portal/file-upload-settings.png
  [14]: ./media/iot-hub-manage-through-portal/file-upload-container-selection.png

[lnk-get-started]: iot-hub-csharp-csharp-getstarted.md
[What is Azure IoT Hub?]: iot-hub-what-is-iot-hub.md

[lnk-bulk]: iot-hub-bulk-identity-mgmt.md
[lnk-metrics]: iot-hub-metrics.md
[lnk-monitor]: iot-hub-operations-monitoring.md
[lnk-itpro]: iot-hub-itpro-info.md

[lnk-design]: iot-hub-guidance.md
[lnk-devguide]: iot-hub-devguide.md
[lnk-dmui]: iot-hub-device-management-ui-sample.md
[lnk-gateway]: iot-hub-linux-gateway-sdk-simulated-device.md
[lnk-securing]: iot-hub-security-ground-up.md