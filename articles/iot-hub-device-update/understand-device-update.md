---
title: Introduction to Device Update for Azure IoT Hub | Microsoft Docs
description: Device Update for IoT Hub is a service that enables you to deploy over-the-air updates (OTA) for your IoT devices.
author: vimeht
ms.author: vimeht
ms.date: 2/11/2021
ms.topic: overview
ms.service: iot-hub-device-update
---

# Device Update for IoT Hub (Preview) Overview

Device Update for IoT Hub is a service that enables you to deploy over-the-air updates (OTA) for your IoT devices.

As organizations look to further enable productivity and operational efficiency, Internet of Things (IoT) solutions continue to be adopted at increasing rates. This makes it essential that the devices forming these solutions are built on a foundation of reliability and security and are easy to connect and manage at scale. Device Update for IoT Hub is an end-to-end platform that customers can use to publish, distribute, and manage over-the-air updates for everything from tiny sensors to gateway-level devices. 

To realize the full benefits of IoT-enabled digital transformation, customers need this ability to operate, maintain, and update devices at scale. Explore the benefits of implementing Device Update for IoT Hub, which include being able to rapidly respond to security threats and deploy new features to obtain business objectives without incurring the extra development and maintenance costs of building your own update platforms.

## Support for a wide range of IoT devices


Device Update for IoT Hub is designed to offer optimized update deployment and streamlined operations through integration with [Azure IoT Hub](https://azure.microsoft.com/en-us/services/iot-hub/). This integration makes it easy to adopt Device Update on any existing solution. It provides a cloud-hosted solution to connect virtually any device. Device Update supports a broad range of IoT operating systems—including Linux and [Azure RTOS](https://azure.microsoft.com/en-us/services/rtos/) (real-time operating system)—and is extensible via open source. We are codeveloping Device Update for IoT Hub offerings with our semiconductor partners, including STMicroelectronics, NXP, Renesas, and Microchip. See the [samples](https://github.com/azure-rtos/samples/tree/PublicPreview/ADU) of key semiconductors evaluation boards that includes the get started guides to learn how to configure, build, and deploy the over-the-air (OTA) updates to MCU class devices. 

Both a Device Update Agent Simulator binary and Raspberry Pi reference Yocto images are provided.
Device Update for IoT Hub also supports updating Azure IoT Edge devices. A Device Update Agent is provided for Ubuntu Server 18.04 amd64
platform. Device Update for IoT Hub also provides open-source code if you are not
running one of the above platforms. You can port the agent to the distribution you
are running.

Device Update works with IoT Plug and Play (PnP) and can manage any device that supports
the required PnP interfaces. For more information, see [Device Update for IoT Hub and
IoT Plug and Play](device-update-plug-and-play.md).

## Support for a wide range of update artifacts

Device Update for IoT Hub supports two forms of updates – image-based
and package-based.

Package-based updates are targeted updates that alter only a specific component
or application on the device. This leads to lower consumption of
bandwidth and helps reduce the time to download and install the update. Package
updates typically allow for less downtime of devices when applying an update and
avoid the overhead of creating images.

Image updates provide a higher level of confidence in the end-state
of the device. It is typically easier to replicate the results of an
image-update between a pre-production environment and a production environment,
since it doesn’t pose the same challenges as packages and their dependencies.
Due to their atomic nature, one can also adopt an A/B failover model easily.

There is no one right answer, and you might choose differently based on
your specific use cases. Device Update for IoT Hub supports both image and package
form of updating, allowing you to choose the right updating model
for your device environment.

## Flexible features for updating devices

Device Update for IoT Hub features provide a powerful and flexible experience, including:

* Update management UX integrated with Azure IoT Hub
* Gradual update rollout through device grouping and update scheduling controls
* Programmatic APIs to enable automation and custom portal experiences
* At-a-glance update compliance and status views across heterogenous device fleets
* Support for resilient device updates (A/B) to deliver seamless rollback
* Subscription and role-based access controls available through the Azure.com portal
* On-premise content cache and Nested Edge support to enable updating cloud disconnected devices
* Detailed update management and reporting tools 

With Device Update for IoT Hub management and deployment controls, users can maximize productivity and save valuable time. Device Update for IoT Hub includes the ability to group devices and specify
to which devices an update should be deployed. Users also can view the status of update deployments and make sure each device successfully applies updates.

When an update failure happens, Device Update for IoT Hub also allows users to identify the devices that failed to apply the update plus see related failure details. The ability to identify which devices failed to update means countless manual hours saved trying to pinpoint the source.

### Best-in-class security at global scale

Microsoft Azure supports more than a billion IoT devices around the world—a number that’s growing rapidly by the day. Device Update for IoT Hub builds upon this experience and the proven reliability demonstrated by the Windows Update platform, so devices can be seamlessly updated on a global scale.

Device Update for IoT Hub uses comprehensive cloud-to-edge security that is developed for Microsoft Azure, so customers don’t need to spend time figuring out how to build it in themselves from the ground up.


## Device Update workflows

Device Update functionality can be broken down into three areas: Agent Integration,
Importing, and Management.

### Device Update Agent

When an update command is received on a device, it will execute the requested
phase of updating (either Download, Install and Apply). During each phase,
status is returned to Device Update via IoT Hub so you can view the current status of a
deployment. If there are no updates in progress, the status is returned as “Idle”. A deployment can be canceled at any time.

:::image type="content" source="media/understand-device-update/client-agent-workflow.png" alt-text="Diagram of Device Update agent workflow." lightbox="media/understand-device-update/client-agent-workflow.png":::

[Learn More](device-update-agent-overview.md) about device update agent. 

### Importing

Importing is how your updates are ingested into Device Update so they can be deployed to devices. Device Update supports rolling out a single update per device. This makes it ideal for
full-image updates that update an entire OS partition at once, or an apt Manifest that describes all the packages you want to update
on your device. To import updates into Device Update, you first create an import manifest 
describing the update, then upload the update file(s) and the import 
manifest to an Internet-accessible location. After that, you can use the Azure portal or the [Device Update Import
REST API](https://github.com/Azure/iot-hub-device-update/tree/main/docs/publish-api-reference) to initiate the asynchronous process of update import. Device Update uploads the files, processes
them, and makes them available for distribution to IoT devices.

For sensitive content, protect the download using a shared access signature (SAS), such as an ad-hoc SAS for Azure Blob Storage. [Learn more about
SAS](https://docs.microsoft.com/azure/storage/common/storage-sas-overview)

:::image type="content" source="media/understand-device-update/import-update.png" alt-text="Diagram of Device Update for IoT Hub importing workflow." lightbox="media/understand-device-update/import-update.png":::

[Learn More](import-concepts.md) about importing updates. 

### Grouping and deployment

After importing an update, you can view compatible updates for your devices and device
classes.

Device Update supports the concept of **Groups** via tags in IoT Hub. Deploying an update
out to a test group first is a good way to reduce the risk of issues during a
production rollout.

In Device Update, deployments are a way of connecting the
right content to a specific set of compatible devices. Device Update orchestrates the
process of sending commands to each device, instructing them to download and
install the updates and getting status back.

:::image type="content" source="media/understand-device-update/manage-deploy-updates.png" alt-text="Diagram of Device Update for IoT Hub grouping and deployment workflow." lightbox="media/understand-device-update/manage-deploy-updates.png":::

[Learn more](device-update-compliance.md) about deployment concepts

[Learn more](device-update-groups.md) about device update groups


## Next steps

> [!div class="nextstepaction"]
> [Create device update account and instance](create-device-update-account.md)
