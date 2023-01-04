---
title: Introduction to Device Update for Azure IoT Hub
description: Device Update for IoT Hub is a service that enables you to deploy over-the-air updates for your IoT devices.
author: vimeht
ms.author: vimeht
ms.date: 10/31/2022
ms.topic: overview
ms.service: iot-hub-device-update
---

# What is Device Update for IoT Hub?

Device Update for Azure IoT Hub is a service that enables you to deploy over-the-air updates for your IoT devices.

As Internet of Things (IoT) solutions continue to be adopted at increasing rates, it's essential that the devices forming these solutions are easy to connect and manage at scale. Device Update for IoT Hub is an end-to-end platform that customers can use to publish, distribute, and manage over-the-air updates for everything from tiny sensors to gateway-level devices.

To realize the full benefits of IoT-enabled digital transformation, customers need the ability to operate, maintain, and update devices at scale. Device Update for IoT Hub unlocks capabilities like:

* Rapidly responding to security threats
* Deploying new features to obtain business objectives
* Avoiding the extra development and maintenance costs of building your own update platforms.

## Support for a wide range of IoT devices

Device Update for IoT Hub offers optimized update deployment and streamlined operations through integration with [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/). This integration makes it easy to adopt Device Update on any existing solution. It provides a cloud-hosted solution to connect virtually any device. Device Update supports a broad range of IoT operating systems—including Linux and [Azure RTOS](https://azure.microsoft.com/services/rtos/) (real-time operating system)—and is extensible via open source. We're codeveloping Device Update for IoT Hub offerings with our semiconductor partners, including STMicroelectronics, NXP, Renesas, and Microchip. See the [samples](https://github.com/azure-rtos/samples/tree/PublicPreview/ADU) of key semiconductors evaluation boards that include the get started guides to learn how to configure, build, and deploy the over-the-air updates to MCU class devices.

Both a Device Update agent simulator binary and Raspberry Pi reference Yocto images are provided.
Device Update agents are built and provided for Ubuntu Server 18.04, Ubuntu Server 20.04, and Debian 10. Device Update for IoT Hub also provides open-source code if you aren't
running one of the above platforms. You can port the agent to the distribution you're running.

Device Update for IoT Hub also supports updating Azure IoT Edge devices.

Device Update works with IoT Plug and Play and can manage any device that supports the required IoT Plug and Play interfaces. For more information, see [Device Update for IoT Hub and IoT Plug and Play](device-update-plug-and-play.md).

## Support for a wide range of update artifacts

Device Update for IoT Hub supports two forms of updates – package-based and image-based.

*Package-based updates* are targeted updates that alter only a specific component or application on the device. This update type leads to lower consumption of bandwidth and helps reduce the time to download and install the update. Package updates typically allow for less downtime of devices when applying an update and avoid the overhead of creating images.

*Image-based updates* provide a higher level of confidence in the end-state of the device. It's typically easier to replicate the results of an image update between a pre-production environment and a production environment, since it doesn’t pose the same challenges as packages and their dependencies. Due to the atomic nature of image updates, one can also adopt an A/B failover model easily.

There's no one right answer, and you might choose differently based on your specific use cases. Device Update for IoT Hub supports both image and package forms of updating, allowing you to choose the right updating model for your device environment.

## Flexible features for updating devices

Device Update for IoT Hub provides powerful and flexible features, including:

* Management and reporting tools.

  * An update management experience that is integrated with Azure IoT Hub.
  * Programmatic APIs to enable automation and custom portal experiences.
  * Subscription- and role-based access controls available through the Azure portal.
  * At-a-glance update compliance and status views across heterogenous device fleets.
  * Azure CLI support for creating and managing Device Update resources, groups, and deployments from the command line.

* Detailed control over the update deployment process.

  * Gradual update rollout through device grouping and update scheduling controls.
  * Support for resilient device updates (A/B) to deliver seamless rollback.
  * Automatic rollback to a defined fallback version for managed devices that meet the rollback criteria.
  * Delta updates (public preview) that allow you to generate smaller updates that represent only the changes between the current image and target image, which can reduce bandwidth for downloading updates to devices.

* Troubleshooting features to help you diagnose and repair devices, including agent check and device sync.

* On-premises content cache and nested edge support to enable updating cloud disconnected devices.

* Automatic grouping of devices based on their compatibility properties and device twin tags.

With Device Update for IoT Hub management and deployment controls, users can maximize productivity and save valuable time. Device Update for IoT Hub includes the ability to group devices and specify to which devices an update should be deployed. Users also can view the status of deployments and make sure each device successfully applies updates.

When an update failure happens, Device Update for IoT Hub helps users to identify the devices that failed to apply the update and see related failure details. The ability to identify which devices failed to update means countless manual hours saved trying to pinpoint the source.

### Best-in-class security at global scale

Microsoft Azure supports more than a billion IoT devices around the world—a number that’s growing rapidly by the day. Device Update for IoT Hub builds upon this experience and the proven reliability demonstrated by the Windows Update platform, so devices can be seamlessly updated on a global scale.

Device Update for IoT Hub uses comprehensive cloud-to-edge security developed for Microsoft Azure, so customers don’t need to spend time figuring out how to build it themselves from the ground up. For more information, see [Device Update security model](device-update-security.md).

## Device Update workflows

Device Update functionality can be broken down into three areas: agent integration, importing, and management.

### Device Update agent

When an update command is received on a device, the *Device Update agent* executes the requested phase of updating (either Download, Install and Apply). During each phase, the agent returns the deployment status to Device Update via IoT Hub so you can view the current status of a deployment. If there are no updates in progress, the status is returned as “Idle”. A deployment can be canceled at any time.

:::image type="content" source="media/understand-device-update/client-agent-workflow.png" alt-text="Diagram of Device Update agent workflow." lightbox="media/understand-device-update/client-agent-workflow.png":::

For more information, see [Device Update for IoT Hub agent overview](device-update-agent-overview.md).

### Importing

*Importing* is how your updates are ingested into Device Update so they can be deployed to devices. Device Update supports rolling out a single update per device. This support makes it ideal for full-image updates that update an entire OS partition, or an [APT manifest](device-update-apt-manifest.md) that describes the individual packages you want to update on your device.

To import updates into Device Update, you first create an import manifest describing the update, then upload the update file(s) and the import manifest to an Azure Storage container. After that, you can use the Azure portal or the [Device Update REST API](/rest/api/deviceupdate/) to initiate the asynchronous process of update import. Device Update uploads the files, processes them, and makes them available for distribution to IoT devices.

For sensitive content, protect the download using a shared access signature (SAS), such as an ad-hoc SAS for Azure Blob Storage. For more information, see [Grant limited access to Azure Storage resources using SAS](../storage/common/storage-sas-overview.md).

:::image type="content" source="media/understand-device-update/import-update.png" alt-text="Diagram of Device Update for IoT Hub importing workflow." lightbox="media/understand-device-update/import-update.png":::

For more information, see [Import updated into Device Update for IoT Hub](import-concepts.md).

### Grouping and deployment

After importing an update, you can view compatible updates for your devices and device
classes.

Device Update supports the concept of *groups* via tags in IoT Hub. Deploying an update to a test group first is a good way to reduce the risk of issues during a production rollout.

In Device Update, *deployments* are a way of connecting the
right content to a specific set of compatible devices. Device Update orchestrates the process of sending commands to each device, instructing them to download and install the updates and getting status back.

:::image type="content" source="media/understand-device-update/manage-deploy-updates.png" alt-text="Diagram of Device Update for IoT Hub grouping and deployment workflow." lightbox="media/understand-device-update/manage-deploy-updates.png":::

For more information about deployment concepts, see [Device Update compliance](device-update-compliance.md).

For more information about Device Update groups, see [Device groups](device-update-groups.md).

## Next steps

Get started with Device Update by trying a sample:

[Tutorial: Device Update using the simulator agent](device-update-simulator.md)