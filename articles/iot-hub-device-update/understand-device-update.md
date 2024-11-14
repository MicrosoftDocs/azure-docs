---
title: Introduction to Device Update for Azure IoT Hub
description: Learn how the Device Update service for IoT Hub enables you to deploy over-the-air updates for your IoT devices.
author: vimeht
ms.author: vimeht
ms.date: 11/13/2024
ms.topic: overview
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Device Update for IoT Hub

Device Update for Azure IoT Hub is a service that enables you to deploy over-the-air updates for your IoT devices.

As Internet of Things (IoT) solutions become increasingly widespread, it's essential that the devices forming these solutions are easy to connect and manage at scale. Device Update for IoT Hub is an end-to-end platform for publishing, distributing, and managing over-the-air updates for everything from tiny sensors to gateway-level devices.

To realize the full benefits of IoT-enabled digital transformation, Device Update for IoT Hub provides capabilities to operate, maintain, and update devices at scale, such as:

- Rapidly responding to security threats.
- Deploying new features to achieve business objectives.
- Avoiding the development and maintenance costs of creating an update platform.

## IoT device support

Device Update is a cloud-hosted solution for connecting virtually any device. Device Update for IoT Hub offers optimized update deployment and streamlined operations through integration with [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/), making it easy to adopt on any existing IoT Hub-based solution.

Device Update supports a broad range of IoT operating systems, including [Eclipse ThreadX](https://github.com/eclipse-threadx) real-time operating system, and is extensible via open source. Device Update for IoT Hub also supports updating Azure IoT Edge devices. 

Microsoft codeveloped Device Update for IoT Hub offerings with semiconductor partners including STMicroelectronics, NXP, Renesas, and Microchip. To learn how to configure, build, and deploy over-the-air updates to microcontroller unit (MCU) class devices, download the [Eclipse ThreadX samples](https://github.com/eclipse-threadx/samples/tree/PublicPreview/ADU) for key semiconductor evaluation boards. Both a Device Update agent simulator binary and Raspberry Pi reference Yocto images are provided. For getting started guides, see [Get started with Eclipse ThreadX and Azure IoT](https://github.com/eclipse-threadx/getting-started).

Device Update agents are built and provided for various [Linux operating systems](support.md#linux-operating-systems). Device Update for IoT Hub also provides open-source code if you're not running Eclipse ThreadX or supported Linux platforms. You can port the agent to the distribution you're running.

Device Update works with IoT Plug and Play and can manage any device that supports the required IoT Plug and Play interfaces. For more information, see [Device Update for IoT Hub and IoT Plug and Play](device-update-plug-and-play.md).

<a name="support-for-a-wide-range-of-update-artifacts"></a>
## Supported update types

Device Update for IoT Hub supports two forms of updates, *package-based* and *image-based*. The method you choose depends on your specific use case and device environment.

- Package-based updates are targeted to alter only a specific device component or application. Package-based updates have lower bandwidth consumption and shorter download and install times, allowing for less device downtime. Package-based updates avoid the overhead of creating images.

- Image-based updates provide a high level of confidence in the device end-state, allowing easier replication between preproduction and production environments or between A/B failover models. Image-based updates avoid the challenges of managing packages and their dependencies.

## Flexible features

You can use Device Update for IoT Hub management and deployment controls to maximize productivity and save valuable time. Device Update for IoT Hub provides many powerful and flexible features.

### Management and reporting tools

- An update management experience integrated with Azure IoT Hub
- Programmatic APIs to enable automation and custom portal experiences
- Subscription- and role-based access controls available through the Azure portal
- At-a-glance update compliance and status views across heterogenous device fleets
- Azure CLI support for creating and managing Device Update resources, groups, and deployments

### Control over update deployment details

- Gradual update rollout through device grouping and update scheduling controls
- Support for resilient device updates (A/B) to deliver seamless rollback
- Automatic rollback to a defined fallback version for managed devices that meet the rollback criteria
- Delta updates (public preview) that allow you to generate smaller updates representing only the changes between the current image and target image, which can reduce bandwidth and download time
- On-premises content cache and nested edge support to enable updating cloud disconnected devices

### Troubleshooting features

Troubleshooting features including agent check and device sync can help you diagnose and repair devices. When an update failure happens, Device Update can identify the devices that failed to update and provide related failure details. The ability to identify which devices failed to update means you save manual hours trying to pinpoint the source.

### Automatic device grouping

Device Update for IoT Hub includes the ability to group devices based on compatibility properties and device twin tags, and specify which devices to update. Users also can view the status of deployments and make sure each device updates successfully.

## Global security

Device Update uses comprehensive cloud-to-edge security developed for Microsoft Azure, so you don't need to configure security yourself. Microsoft Azure supports more than a billion IoT devices around the world. Device Update for IoT Hub builds on this support and the proven reliability of the Windows Update platform, so devices can be seamlessly updated on a global scale. For more information, see [Device Update security model](device-update-security.md).

## Device Update workflows

Device Update functionality consists of three areas: agent integration, importing, and management.

### Device Update agent

When a device receives an update command, the Device Update *agent* executes the requested update phase, either `download`, `install`, or `apply`. During each phase, the agent returns the deployment status to Device Update via IoT Hub so you can view the current status of the deployment. If there are no updates in progress, the agent returns `Idle` status. You can cancel a deployment at any time.

The following diagram shows how the Device Update management service uses IoT Hub device twin properties to orchestrate the agent update workflow.

:::image type="content" source="media/understand-device-update/client-agent-workflow.png" alt-text="Diagram of Device Update agent workflow." border="false":::

1. Device Update management sets the update command property value to `applyDeployment`, or `cancel` to reset.
1. The Device Update agent reads the update command property value and executes the desired command.
1. The agent sets the update status property value to `DeploymentInprogress`. When the agent is inactive, it sets the property value to `Idle.

For more information, see [Device Update for IoT Hub agent overview](device-update-agent-overview.md).

### Import

*Importing* ingests your updates into Device Update so they can be deployed to devices. Device Update supports rolling out a single update per device. You can import a full image that update an entire OS partition, or an [APT manifest](device-update-apt-manifest.md) that describes the individual packages you want to update on your device.

To import updates into Device Update, you first create an import manifest describing the update, then upload the update file or files and the import manifest to an Azure Storage container. After that, you can use the Azure portal or the [Device Update REST API](/rest/api/deviceupdate/) to initiate the asynchronous update import process. Device Update uploads the files, processes them, and makes them available for distribution to IoT devices.

For sensitive content, you can protect the download by using a shared access signature (SAS), such as an ad-hoc SAS for Azure Blob Storage. For more information, see [Grant limited access to Azure Storage resources using SAS](/azure/storage/common/storage-sas-overview).

The following diagram shows how Device Update imports an update.

:::image type="content" source="media/understand-device-update/import-update.png" alt-text="Diagram of Device Update for IoT Hub importing workflow." border="false":::

1. A developer creates an update and manifest with compatibility data.
1. The developer imports the update and manifest to Device Update.
1. Device Update processes the update.
1. The update with compatibility data is now ready for distribution.

For more information about importing, see [Import updates into Device Update for IoT Hub](import-concepts.md).

### Grouping and deployment

After you import an update, you can view compatible updates for your devices and device classes.

Device Update supports the concept of *groups* via tags in IoT Hub. Deploying an update to a test group first is a good way to reduce the risk of issues during a production rollout. For more information about Device Update groups, see [Device groups](device-update-groups.md).

In Device Update, *deployments* are the way to connect the right content to a specific set of compatible devices. Device Update orchestrates the process of sending commands to each device, instructing the devices to download and install the updates, and getting status back. For information about measuring update compliance, see [Device Update compliance](device-update-compliance.md).


The following diagram illustrates the Device Update grouping and deployment workflow.

1. The operator can view applicable updates for devices.
1. Device Update queries for devices from IoT Hub.
1. The operator initiates an update for specified devices.
1. IoT Hub messages the devices to download and install the update.
1. The devices receive the commands to install the update.
1. The update is downloaded and installed.
1. Update status is returned to Device Update via IoT Hub.

:::image type="content" source="media/understand-device-update/manage-deploy-updates.png" alt-text="Diagram of Device Update for IoT Hub grouping and deployment workflow." border="false":::

## Related content

[Tutorial: Device Update using the simulator agent](device-update-simulator.md)
[Device Update REST API](/rest/api/deviceupdate/)
[Device Update for IoT Hub supported platforms](support.md)
[Eclipse ThreadX](https://github.com/eclipse-threadx)
