---
title: Introduction to Device Update for Azure IoT Hub
description: Learn how the Azure Device Update service for IoT Hub enables you to deploy over-the-air updates for your IoT devices.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 11/20/2024
ms.topic: overview
ms.service: azure-iot-hub
ms.subservice: device-update
---

# What is Device Update for IoT Hub?

As Internet of Things (IoT) solutions become increasingly widespread, it's essential that the devices forming these solutions are easy to connect and manage at scale. Azure Device Update for IoT Hub is a service that enables you to deploy over-the-air updates for your IoT devices.

Device Update for IoT Hub is an end-to-end platform for publishing, distributing, and managing over-the-air updates for everything from tiny sensors to gateway-level devices. To realize the full benefits of IoT-enabled digital transformation, Device Update provides capabilities to operate, maintain, and update devices at scale, such as:

- Rapid response to security threats.
- New feature deployments to achieve business objectives.
- Integrated updates with no added costs for developing and maintaining an update platform.

## Supported IoT devices

Device Update for IoT Hub is a cloud-hosted solution for connecting virtually any device. Device Update offers optimized update deployment and streamlined operations through integration with [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/), making it easy to adopt on any existing IoT Hub-based solution, including Azure IoT Edge devices.

Device Update supports configuring, building, and deploying over-the-air updates for a broad range of IoT operating systems and common microcontroller unit (MCU) class devices. [Eclipse ThreadX](https://github.com/eclipse-threadx) real-time operating system offers [Device Update samples](https://github.com/eclipse-threadx/samples/tree/PublicPreview/ADU) codeveloped with semiconductor partners including STMicroelectronics, NXP, Renesas, and Microchip. Device Update also provides a [Raspberry Pi](device-update-raspberry-pi.md) reference Yocto image and a [Device Update agent simulator](device-update-simulator.md) binary.

Device Update agents are built and provided for various [Linux operating systems](support.md#linux-operating-systems). Device Update is also extensible via provided open-source code if you're not running Eclipse ThreadX or supported Linux platforms. You can port the agent to the distribution you're running.

Device Update works with IoT Plug and Play and can manage any device that supports the required IoT Plug and Play interfaces. For more information, see [Device Update for IoT Hub and IoT Plug and Play](device-update-plug-and-play.md).

<a name="support-for-a-wide-range-of-update-artifacts"></a>
## Supported update types

Device Update for IoT Hub supports two forms of updates, *package-based* and *image-based*. The method you choose depends on your specific use case and device environment.

- Package-based updates are targeted to alter only a specific device component or application. These updates have lower bandwidth consumption and shorter download and install times, allowing for less device downtime and avoiding the overhead of creating images.

- Image-based updates provide a high level of confidence in the device end-state, allowing easier replication between preproduction and production environments or between A/B failover models. Image-based updates avoid the challenges of managing packages and their dependencies.

## Management and deployment controls

You can use Device Update management and deployment controls to maximize productivity and save valuable time.

### Management and reporting tools

- An update management experience integrated with Azure IoT Hub.
- Programmatic APIs to enable automation and custom portal experiences.
- Subscription- and role-based access controls available through the Azure portal.
- At-a-glance update compliance and status views across heterogenous device fleets.
- Azure CLI support for creating and managing Device Update resources, groups, and deployments.

### Control over deployment details

- Gradual update rollout through device grouping and update scheduling controls.
- Support for resilient device updates (A/B) to deliver seamless rollback.
- Automatic rollback to a defined fallback version for managed devices that meet the rollback criteria.
- Delta updates (public preview) that allow you to generate smaller updates representing only the changes between the current image and target image, which can reduce bandwidth and download time.
- On-premises content cache and nested edge support to enable updating cloud disconnected devices.

### Global security

Device Update uses comprehensive cloud-to-edge security developed for Microsoft Azure, so you don't need to configure security yourself. Microsoft Azure supports more than a billion IoT devices around the world. Device Update builds on this support and the proven reliability of the Windows Update platform, so devices can be seamlessly updated on a global scale. For more information, see [Device Update security model](device-update-security.md).

### Automatic device grouping

Device Update for IoT Hub includes the ability to group devices based on compatibility properties and device twin tags, and specify which devices to update. You can also view the status of deployments and make sure each device updates successfully.

### Troubleshooting features

Troubleshooting features include agent check and device sync to help you diagnose and repair devices. When an update failure happens, Device Update can identify the devices that failed to update and provide related failure details. This ability saves you from having to spend time trying to manually pinpoint the source.

## Device Update workflows

Device Update functionality consists of three areas: *agent integration*, *importing*, and *management*.

<a name="device-update-agent"></a>
### Agent integration

When a device receives an update command, the Device Update *agent* executes the requested `download`, `install`, or `apply` update phase. During each phase, the agent returns the deployment status to Device Update via IoT Hub so you can view the current status of the deployment. If there are no updates in progress, the agent returns `Idle` status. You can cancel a deployment at any time.

The following diagram shows how the Device Update management service uses IoT Hub device twin properties to orchestrate the agent update workflow.

:::image type="content" source="media/understand-device-update/client-agent-workflow.png" alt-text="Diagram of Device Update agent workflow." border="false":::

1. Device Update management sets the update command property value to `applyDeployment`, or `cancel` to reset.
1. The Device Update agent reads the update command property value and executes the desired command.
1. The agent sets the update status property value to `DeploymentInprogress`. When the agent is inactive, it sets the property value to `Idle`.

For more information, see [Device Update for IoT Hub agent overview](device-update-agent-overview.md).

### Importing

You *import* your updates into Device Update to prepare them for deployment to devices. Device Update supports importing a single update per device, a full image that updates an entire OS partition, or an [APT manifest](device-update-apt-manifest.md) that describes the individual packages that you want to update on a device.

To import updates into Device Update, you first create an import manifest describing the update, then upload the manifest and the update file or files to an Azure Storage container. After that, you can use the Azure portal or the [Device Update REST API](/rest/api/deviceupdate/) to initiate the asynchronous update import process. Device Update uploads the files, processes them, and makes them available for distribution to IoT devices.

For sensitive content, you can protect the download by using a shared access signature (SAS), such as an ad-hoc SAS for Azure Blob Storage. For more information, see [Grant limited access to Azure Storage resources using SAS](/azure/storage/common/storage-sas-overview).

The following diagram shows how Device Update imports an update.

:::image type="content" source="media/understand-device-update/import-update.png" alt-text="Diagram of Device Update for IoT Hub importing workflow." border="false":::

1. A developer creates an update and manifest with compatibility data.
1. The developer imports the update and manifest to Device Update.
1. Device Update processes the update.
1. The update with compatibility data is now ready for distribution.

For more information about importing, see [Import updates into Device Update for IoT Hub](import-concepts.md).

### Management

After you import an update, you can view compatible updates for your devices and device classes.

Device Update supports the concept of *groups* via tags in IoT Hub. Deploying an update to a test group first is a good way to reduce the risk of issues during a production rollout. For more information about Device Update groups, see [Device groups](device-update-groups.md).

In Device Update, *deployments* connect the right content to a specific set of compatible devices. Device Update orchestrates the process of sending commands to each device, instructing the devices to download and install updates, and getting status back. For information about measuring update compliance, see [Device Update compliance](device-update-compliance.md).

The following diagram illustrates the Device Update grouping and deployment workflow.

:::image type="content" source="media/understand-device-update/manage-deploy-updates.png" alt-text="Diagram of Device Update for IoT Hub grouping and deployment workflow." border="false":::

1. The operator can view applicable updates for devices.
1. Device Update queries for devices from IoT Hub.
1. The operator initiates an update for specified devices.
1. IoT Hub messages the devices to download and install the update.
1. The devices receive the commands to install the update.
1. The update is downloaded and installed.
1. Update status is returned to Device Update via IoT Hub.


## Related content

- [Tutorial: Device Update using the simulator agent](device-update-simulator.md)
- [Tutorial: Device Update for Azure IoT Hub using the Raspberry Pi 3 B+ reference image](device-update-raspberry-pi.md)
- [Device Update REST API](/rest/api/deviceupdate/)
