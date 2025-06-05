---
title: IoT asset and device management and control
description: An overview of asset and device management and control options in an Azure IoT solution.
ms.service: azure-iot
services: iot
author: asergaz
ms.author: sergaz
ms.topic: overview
ms.date: 03/24/2025
# Customer intent: As a solution builder or device developer I want a high-level overview of the issues around asset and device management and control so that I can easily find relevant content.
---

# IoT asset and device management and control

This overview introduces the key concepts around managing and controlling assets and devices in a typical Azure IoT solution. Each section includes links to content that provides further detail and guidance.

### [Edge-based solution](#tab/edge)

The following diagram shows a high-level view of the components in a typical [edge-based IoT solution](iot-introduction.md#edge-based-solution). This article focuses on the asset management and control components of an edge-based IoT solution:

<!-- Art Library Source# ConceptArt-0-000-032 -->
:::image type="content" source="media/iot-overview-device-management/iot-edge-management-architecture.svg" alt-text="Diagram that shows the high-level IoT edge-based solution architecture highlighting asset management areas." border="false" lightbox="media/iot-overview-device-management/iot-edge-management-architecture.svg":::

In an edge-based IoT solution, operational technologists (OT) can manage and control assets from the cloud, by leveraging a *Unified registry*. OT users can use the *operations experience web UI*, while IT administrators can use the CLI and Azure portal. To locate and manage assets, OT users can use *Sites*, that are created by the IT administrator and typically group Azure IoT Operations instances by physical location.

Asset management refers to processes such as registering assets and defining asset endpoints. Asset management includes the following tasks:

- Asset endpoint creation
- Asset, tags, and events creation
- Asset endpoints secrets management
- Enabling and disabling assets

In an edge-based IoT solution, *command and control* refers to the processes that let you send commands to assets and optionally receive responses from them. For example, you can:

- Control the cameras pan, tilt, and zoom.
- To save energy, turn off the lights of a building.
- Use MQTT topics to let assets communicate with each other through the broker.

### Components

An edge-based IoT solution can use the following components for asset management and control:

- *Asset endpoints* to describe southbound edge connectivity information for one or more assets.
- *Asset tags* to describe a data point that can be collected from an asset.
- *Asset events* that inform you about state changes to your asset.
- *Data flows* to connect various data sources and perform data operations, simplifying the setup of data paths to move, transform, and enrich data.
- *Operations experience web UI* that lets you create and configure assets in your solution. The web UI simplifies the task of managing assets.
- *Unified registry* that enables the cloud and edge management of assets. Azure Device Registry projects assets defined in your edge environment as Azure resources in the cloud. It provides a single unified registry so that all apps and services that interact with your assets can connect to a single source. Device Registry also manages the synchronization between assets in the cloud and assets as custom resources in Kubernetes on the edge.
- *Schema registry* that lets you define and manage the schema for your assets. Data flows use schemas to deserialize and serialize messages.
- *Akri services* that let you deploy and configure connectivity protocols, such as OPC UA and ONVIF, at the edge. The connector for ONVIF is a service that discovers and registers ONVIF assets such as cameras. The connector for OPC UA is a service that connects to OPC UA servers and registers assets such as robotic arms.
- *Secret Store extension* to sync the secrets down from the cloud and store them on the edge as Kubernetes secrets. Azure IoT Operations uses Azure Key Vault as the managed vault solution on the cloud, and uses [Azure Key Vault Secret Store extension for Kubernetes](/azure/azure-arc/kubernetes/secret-store-extension) to sync the secrets.
- *Sites* that group Azure IoT Operations instances by physical location and make it easier for OT users to locate and manage assets. Your IT administrator creates sites and assigns Azure IoT Operations instances to them. To learn more, see [What is Azure Arc site manager (preview)?](/azure/azure-arc/site-manager/overview).

For more information, see [What is asset management in Azure IoT Operations](../iot-operations/discover-manage-assets/overview-manage-assets.md).

### [Cloud-based solution](#tab/cloud)

The following diagram shows a high-level view of the components in a typical [cloud-based IoT solution](iot-introduction.md#cloud-based-solution). This article focuses on the device management and control components of a cloud-based IoT solution:

<!-- Art Library Source# ConceptArt-0-000-032 -->
:::image type="content" source="media/iot-overview-device-management/iot-cloud-management-architecture.svg" alt-text="Diagram that shows the high-level IoT cloud-based solution architecture highlighting device management areas." border="false" lightbox="media/iot-overview-device-management/iot-cloud-management-architecture.svg":::

IoT Central applications use the IoT Hub and the Device Provisioning Service (DPS) services internally. Therefore, the concepts in a cloud-based IoT solution apply whether you're using IoT Central or IoT Hub.

In a cloud-based IoT solution, device management refers to processes such as provisioning and updating devices. Device management includes the following tasks:

- Device registration.
- Device provisioning.
- Device deployment.
- Device updates.
- Device key management and rotation.
- Device monitoring.
- Enabling and disabling devices.

In a cloud-based IoT solution, *command and control* refers to the processes that let you send commands to devices and receive responses from them. For example, you can send a command to a device to:

- Set a target temperature.
- Request maximum and minimum temperature values for the last two hours.
- Set the sensor data interval to 10 seconds.

### Primitives

A cloud-based IoT solution can use the following primitives for both device management and command and control:

- *Device twins* to share and synchronize state data with the cloud. For example, a device can use the device twin to report the current state of a valve it controls to the cloud and to receive a desired target temperature from the cloud.
- *Digital twins* to represent a device in the digital world. For example, a digital twin can represent a device's physical location, its capabilities, and its relationships with other devices. Digital twins are used in [IoT Plug and Play](overview-iot-plug-and-play.md) and [Azure Digital Twins](../digital-twins/overview.md). To learn more about the differences between device twins and digital twins, see [Understand IoT Plug and Play digital twins](concepts-digital-twin.md). 
- *Direct methods* to receive commands from the cloud. A direct method can have parameters and return a response. For example, the cloud can call a direct method to request the device to reboot in 30 seconds.
- *Cloud-to-device* messages to receive one-way notifications from the cloud. For example, a notification that an update is ready to download.

To learn more, see [Cloud-to-device communications guidance](../iot-hub/iot-hub-devguide-c2d-guidance.md).

---

## Asset and device management

### [Edge-based solution](#tab/edge)

### Asset endpoint creation

Azure IoT Operations uses Azure resources called assets and asset endpoints to connect and manage components of your industrial edge environment. Before you can create an asset, you need to define an asset endpoint profile. An *asset endpoint* is a profile that describes southbound edge connectivity information for one or more assets.

Currently, the southbound connectors available in Azure IoT Operations are the connector for OPC UA, the media connector (preview), and the connector for ONVIF (preview). Asset endpoints are configurations for a connector that enable it to connect to an asset. For example:

- An asset endpoint for OPC UA stores the information you need to connect to an OPC UA server.
- An asset endpoint for the media connector stores the information you need to connect to a media source.

For more information, see [What is the connector for OPC UA?](../iot-operations/discover-manage-assets/overview-opcua-broker.md).

### Asset, tags, and events creation

An *asset* is a logical entity that represents a device or component in the cloud as an Azure Resource Manager resource and at the edge as a Kubernetes custom resource. When you create an asset, you can define its metadata and the datapoints (also called tags) and events that it emits.

Currently, an asset in Azure IoT Operations can be:

- Something connected to an OPC UA server such as a robotic arm.
- A media source such as a camera.

When you define an asset using either the operations experience web UI or Azure IoT Operations CLI, you can configure *tags* and *events* for each asset:

- A *tag* is a description of a data point that can be collected from an asset. OPC UA tags provide real-time or historical data about an asset.
- An *event* is a notification from an OPC UA server that can inform you about state changes to your asset.

 For more information, see [Define assets and asset endpoints](../iot-operations/discover-manage-assets/concept-assets-asset-endpoints.md).

### Asset endpoints secrets management

On an Azure IoT Operations instance deployed with secure settings, you can add secrets to Azure Key Vault, and sync them to the edge to be used in asset endpoints using the operations experience web UI. Secrets are used in asset endpoints for authentication.

For more information, see [Manage secrets for your Azure IoT Operations deployment](../iot-operations/secure-iot-ops/howto-manage-secrets.md).

### [Cloud-based solution](#tab/cloud)

### Device registration

Before a device can connect to an IoT hub, it must be registered. Device registration is the process of creating a device identity in the cloud. Each IoT hub has its own internal device registry. The device identity is used to authenticate the device when it connects to IoT Hub. A device registration entry includes the following properties:

- A unique device ID.
- Authentication information such as symmetric keys or X.509 certificates.
- The type of device. Is it an IoT Edge device or not?

If you think a device is compromised or isn't functioning correctly, you can disable it in the device registry to prevent it from connecting to the cloud. To allow a device to connect back to a cloud after the issue is resolved, you can re-enable it in the device registry. You can also permanently remove a device from the device registry to completely prevent it from connecting to the cloud.

To learn more, see [Understand the identity registry in your IoT hub](../iot-hub/iot-hub-devguide-identity-registry.md).

IoT Central provides a UI to manage the device registry in the underlying IoT hub. To learn more, see [Add a device (IoT Central)](../iot-central/core/howto-manage-devices-individually.md#add-a-device).

### Device provisioning

You must configure each device in your solution with the details of the IoT hub it should connect to. You can manually configure each device in your solution, but this approach might not be practical for a large number of devices. To get around this problem, you can use the Device Provisioning Service (DPS) to automatically register each device with an IoT hub, and then provision each device with the required connection information. If your IoT solution uses multiple IoT hubs, you can use DPS to provision devices to a hub based on criteria such as which is the closest hub to the device. You can configure your DPS with rules for registering and provisioning your devices in advance of physically deploying the device in the field.

If your IoT solution uses IoT Hub, then using DPS is optional. If you're using IoT Central, then your solution automatically uses a DPS instance that IoT Central manages.

To learn more, see [Device provisioning service overview](../iot-dps/about-iot-dps.md).

### Device deployment

In a cloud-based IoT solution, device deployment typically refers to the process of installing software on an IoT Edge device. When an IoT Edge device connects to an IoT hub, it receives a *deployment manifest* that contains details of the modules to run on the device. The deployment manifest also contains configuration information for the modules. There are many standard modules available for IoT Edge devices. You can also create your own custom modules.

To learn more, see [What is Azure IoT Edge?](../iot-edge/about-iot-edge.md)

If you're using IoT Central, you can [manage your deployment manifests](../iot-central/core/howto-manage-deployment-manifests.md) by using the IoT Central UI.

### Device updates

Typically, your IoT solution must include a way to update device software. For an IoT Edge device, you can update the modules that run on the device by updating the deployment manifest.

For a non-IoT Edge device, you need to have a way to update the device firmware. This update process could use a cloud-to-device message to notify the device that a firmware update is available. Then the device runs custom code to download and install the update.

The [Device Update for IoT Hub](../iot-hub-device-update/understand-device-update.md) service provides a managed solution for updating devices. It enables you to upload firmware updates to the cloud and then distribute them to devices. It also lets you monitor the update process and roll back to a previous version if the update fails.

### Device key management and rotation

During the lifecycle of your IoT solution, you might need to roll over the keys used to authenticate devices. For example, you might need to roll over your keys if you suspect that a key is compromised or if a certificate expires:

- [Roll over the keys used to authenticate devices in IoT Hub and DPS](../iot-dps/how-to-roll-certificates.md)
- [Roll over the keys used to authenticate devices in IoT Central](../iot-central/core/how-to-connect-devices-x509.md#roll-your-x509-device-certificates)

### Device monitoring

As part of overall solution monitoring, you might want to monitor the health of your devices. For example, you might want to monitor the health of your devices or detect when a device is no longer connected to the cloud. Options for monitoring devices include:

- Devices use the device twin to report its current state to the cloud. For example, a device can report its current internal temperature or its current battery level.
- Devices can raise alerts by sending telemetry messages to the cloud.
- IoT Hub can [raise events](../iot-hub/iot-hub-event-grid.md) when devices connect or disconnect from the cloud.
- IoT Central can use [rules](../iot-central/core/howto-configure-rules.md) to run actions when specified criteria are met.
- Use machine learning tools to analyze device telemetry streams to identify anomalies that indicate a problem with the device.

To learn more, see [Monitor device connection status (IoT Hub)](../iot-hub/monitor-device-connection-state.md).

### Device migration

If you need to migrate a device from IoT Central to IoT Hub, you can use the Device Migration tool. To learn more, see [Migrate devices from IoT Central to IoT Hub](../iot-central/core/howto-migrate-to-iot-hub.md).

---

## Command and control

### [Edge-based solution](#tab/edge)

Azure IoT Operations includes an enterprise grade, standards compliant MQTT broker. The broker enables bidirectional communication between the edge and the cloud, and powers [event-driven applications](/azure/architecture/guide/architecture-styles/event-driven) at the edge.

Use the MQTT broker to implement command and control solutions that enable you to send commands to your assets either from the cloud or from other edge-based components. Connectors, such as the ONVIF connector, can use MQTT topics to listen for and respond to commands. For example, you can publish a message to a topic in the MQTT broker that's an instruction to a camera to pan left by 20 degrees. The camera can use another topic to publish a message that acknowledges the operation is complete. The [Azure IoT Operations SDKs (preview)](https://github.com/Azure/iot-operations-sdks) includes samples that show how to implement these types of command and control scenarios.

For more information, see [Azure IoT Operations built-in local MQTT broker](../iot-operations/manage-mqtt-broker/overview-broker.md).

### [Cloud-based solution](#tab/cloud)

To send commands to your devices to control their behavior, use:

- *Direct methods* for communications that require immediate confirmation of the result. Direct methods are often used for interactive control of devices such as turning on a fan.

- Device twin *desired properties* for long-running commands intended to put the device into a certain desired state. For example, set the telemetry send interval to 30 minutes.

- *Cloud-to-device messages* for one-way notifications to the device.

To learn more, see [Cloud-to-device communications guidance](../iot-hub/iot-hub-devguide-c2d-guidance.md).

In some scenarios, you can automate device control based on feedback loops. For example, if the device temperature is too high, logic running in the cloud can send a command to turn on a fan. The cloud process can then send a command to turn off the fan when the temperature is back to normal.

It's also possible to run this kind of automation locally. For example, if you're using IoT Edge to implement your gateway device, you can run the logic that controls the device in an IoT Edge module. Running this kind of logic at the edge can reduce latency and provide resilience if there's a network outage.

### Jobs

You can use direct methods, desired properties, and cloud-to-device messages to send commands to individual devices. If you need to send commands to multiple devices, you can use jobs. Jobs let you schedule and send commands and desired property updates to multiple devices at the same time. You can also use jobs to monitor the progress of the commands and to roll back to a previous state if the commands fail.

To learn more, see:

- [Schedule jobs on multiple devices (IoT Hub)](../iot-hub/iot-hub-devguide-jobs.md)
- [Manage devices in bulk in your Azure IoT Central application](../iot-central/core/howto-manage-devices-in-bulk.md)

---

## Related content

- [IoT asset and device development](iot-overview-device-development.md)
- [IoT asset and device connectivity and infrastructure](iot-overview-device-connectivity.md)
- [Choose an Azure IoT service](iot-services-and-technologies.md)