---
title: IoT asset and device connectivity and infrastructure 
description: An overview of asset and device connectivity and infrastructure in an Azure IoT solution, including gateways and protocols such as MQTT and OPC UA.
ms.service: azure-iot
services: iot
author: dominicbetts
ms.author: dobett
ms.topic: overview
ms.date: 06/16/2025
# Customer intent: As a solution builder or device developer I want a high-level overview of the issues around asset and device connectivity and infrastructure so that I can easily find relevant content.
---

# IoT asset and device connectivity and infrastructure

This overview introduces the key concepts around how physical assets and devices connect to a typical Azure IoT solution. The article also introduces infrastructure elements such as gateways and bridges. Each section includes links to content that provides further detail and guidance.

### [Edge-based solution](#tab/edge)

The following diagram shows a high-level view of the components in a typical [edge-based IoT solution](iot-introduction.md#edge-based-solution). This article focuses on the connectivity between the physical assets and the edge runtime environment shown in the diagram:

<!-- Art Library Source# ConceptArt-0-000-032 -->
:::image type="content" source="media/iot-overview-device-connectivity/iot-edge-connectivity-architecture.svg" alt-text="Diagram that shows the high-level IoT edge-based solution architecture highlighting device connectivity areas." border="false" lightbox="media/iot-overview-device-connectivity/iot-edge-connectivity-architecture.svg":::

### [Cloud-based solution](#tab/cloud)

The following diagram shows a high-level view of the components in a typical [cloud-based IoT solution](iot-introduction.md#cloud-based-solution). This article focuses on the connectivity between the devices and the IoT cloud services, including gateways and bridges shown in the diagram:

<!-- Art Library Source# ConceptArt-0-000-032 -->
:::image type="content" source="media/iot-overview-device-connectivity/iot-cloud-connectivity-architecture.svg" alt-text="Diagram that shows the high-level IoT cloud-based solution architecture highlighting device connectivity areas." border="false" lightbox="media/iot-overview-device-connectivity/iot-cloud-connectivity-architecture.svg":::

IoT Central applications use the IoT Hub and the Device Provisioning Service (DPS) services internally. Therefore, the concepts in a cloud-based IoT solution apply whether you're using IoT Central or IoT Hub.

---

## Communication methods

### [Edge-based solution](#tab/edge)

The following diagram summarizes the device connection options for an edge-based IoT solution. The diagram shows how category 2 and 3 devices connect to the Azure IoT Operations edge runtime environment. An Azure Arc-enabled Kubernetes cluster hosts the runtime environment.

:::image type="content" source="media/iot-overview-device-connectivity/edge-based-devices.svg" alt-text="Diagram that shows devices in an edge-based solution." lightbox="media/iot-overview-device-connectivity/edge-based-devices.svg" border="false":::

To exchange data with edge-based services, assets use industry standards such as:

- **OPC UA data points and events**. OPC UA *data points* are values streamed from the OPC UA server, such as temperature. OPC UA *events* represent state changes. The connector for OPC UA is an Azure IoT Operations service that connects to OPC UA servers to retrieve their data and publishes it to topics in the MQTT broker. [OPC Foundation](https://opcfoundation.org/)

- **MQTT messaging**. MQTT allows a single broker to serve tens of thousands of clients simultaneously, with lightweight publish-subscribe messaging, topic creation, and management. Many IoT devices support MQTT natively out of the box. The MQTT broker underpins the messaging layer in Azure IoT Operations and supports both MQTT v3.1.1 and MQTT v5. [MQTT](https://mqtt.org/).

- **ONVIF media specifications** (preview). The connector for ONVIF in Azure IoT Operations discovers ONVIF conformant cameras and registers them in the Azure Device Registry. The connector enables capabilities like retrieving and updating the configuration of the camera to adjust the output image configuration, or controlling the camera pan, tilt, and zoom.  [ONVIF](https://www.onvif.org/)

- **Media streaming protocols such as RTSP, RTCP, SRT, HLS, and JPEG over HTTP** (preview). The media connector makes images and video from media sources such as IP cameras available to other Azure IoT Operations components. It can also capture snapshots from a video stream or from an image URL and publish them to an MQTT topic, or proxy a live video stream from a camera to an endpoint that an operator can access.

Once asset data is received, Azure IoT Operations uses *data flows* to process and route data to cloud endpoints or other edge components.

### [Cloud-based solution](#tab/cloud)

Azure IoT devices use the following primitives to exchange data with cloud services:

- *Device-to-cloud* messages to send time series data to the cloud. For example, temperature data collected from a sensor attached to the device.
- *Device twins* to share and synchronize state data with the cloud. For example, a device can use the device twin to report the current state of a valve it controls to the cloud and to receive a desired target temperature from the cloud.
- *Digital twins* to represent a device in the digital world. For example, a digital twin can represent a device's physical location, its capabilities, and its relationships with other devices.
- *File uploads* for media files such as captured images and video. Intermittently connected devices can send data in batches. Devices can compress uploads to save bandwidth.
- *Direct methods* to receive commands from the cloud. A direct method can have parameters and return a response. For example, the cloud can call a direct method to request the device to reboot.
- *Cloud-to-device* messages receive one-way notifications from the cloud. For example, a notification that an update is ready to download.

To learn more, see [Device-to-cloud communications guidance](../iot-hub/iot-hub-devguide-d2c-guidance.md) and [Cloud-to-device communications guidance](../iot-hub/iot-hub-devguide-c2d-guidance.md).

---

## Device endpoints

### [Edge-based solution](#tab/edge)

Azure IoT Operations uses *connectors* to discover, manage, and ingress data from physical assets in an edge-based solution.

- The connector for OPC UA is a data ingress and protocol translation service that enables Azure IoT Operations to ingress data from your assets. The broker receives sensor data and events from your assets and publishes the data to topics in the MQTT broker. The broker is based on the widely used OPC UA standard.
- The media connector (preview) is a service that makes media from media sources such as edge-attached cameras available to other Azure IoT Operations components.
- The connector for ONVIF (preview) is a service that discovers and registers ONVIF assets such as cameras. The connector enables you to manage and control ONVIF assets such as cameras connected to your cluster.
- The SQL connector (preview) is a service that connects to SQL databases and ingresses data from them.
- The REST connector (preview) is a service that connects to REST APIs and ingresses data from them.

To learn more, see [What is asset management in Azure IoT Operations](../iot-operations/discover-manage-assets/overview-manage-assets.md).

### [Cloud-based solution](#tab/cloud)

An Azure IoT hub exposes a collection of per-device endpoints that let devices exchange data with the cloud. These endpoints include:

- *Send device-to-cloud messages*. A device uses this endpoint to send device-to-cloud messages.
- *Retrieve and update device twin properties*. A device uses this endpoint to access its device twin properties.
- *Receive direct method requests*. A device uses this endpoint to listen for direct method requests.

Every IoT hub has a unique hostname that you use to connect devices to the hub. The hostname is in the format `iothubname.azure-devices.net`. If you use one of the device SDKs, you don't need to know the full names of the individual endpoints because the SDKs provide higher level abstractions. However, the device does need to know the hostname of the IoT hub to which it's connecting.

A device can establish a secure connection to an IoT hub:

- Directly, in which case you must provide the device with a connection string that includes the hostname.
- Indirectly by using DPS, in which case the device connects to a well-known DPS endpoint to retrieve the connection string for the IoT hub it's assigned to.

The advantage of using DPS is that you don't need to configure all of your devices with connection-strings that are specific to your IoT hub. Instead, you configure your devices to connect to a well-known, common DPS endpoint where they discover their connection details. To learn more, see [Device Provisioning Service](../iot-dps/about-iot-dps.md).

To learn more about implementing automatic reconnections to endpoints, see [Manage device reconnections to create resilient applications](./concepts-manage-device-reconnections.md).

---

## Authentication

### [Edge-based solution](#tab/edge)

Connectors in Azure IoT Operations manage the authentication to physical devices and assets. This authentication can be anonymous or use usernames passwords where the values are stored as Azure Key Vault secrets. Access to the Azure Key Vault is configured with a user-assigned managed identity.

Some connectors, such as the connector for OPC UA, establish certificate-based trust relationships with a physical asset. For example, the connector for OPC UA is an OPC UA client application that uses a single OPC UA application instance certificate for all the sessions it establishes to collect data from OPC UA servers. By default, the connector uses [cert-manager](https://cert-manager.io/) to manage its application instance certificate.

To learn more about security in your edge-based IoT solution, see [Security best practices for edge-based IoT solutions](iot-overview-security.md?tabs=edge).

### [Cloud-based solution](#tab/cloud)

A device connection string provides a device with the information it needs to connect securely to an IoT hub. The connection string includes the following information:

- The hostname of the IoT hub.
- The device ID registered with the IoT hub.
- The security information the device needs to establish a secure connection to the IoT hub.

Azure IoT devices use TLS to verify the authenticity of the IoT hub or DPS endpoint they're connecting to. The device SDKs rely on the device's trusted certificate store to include the DigiCert Global Root G2 TLS certificate they currently need to establish a secure connection to the IoT hub. To learn more, see [Transport Layer Security (TLS) support in IoT Hub](../iot-hub/iot-hub-tls-support.md) and [TLS support in Azure IoT Hub Device Provisioning Service (DPS)](../iot-dps/tls-support.md).

Azure IoT devices can use either shared access signature (SAS) tokens or X.509 certificates to authenticate themselves to an IoT hub. X.509 certificates are recommended in a production environment. To learn more about device authentication, see:

- [Authenticate devices to IoT Hub by using X.509 CA certificates](../iot-hub/iot-hub-x509ca-overview.md)
- [Authenticate devices to IoT Hub by using SAS tokens](../iot-hub/iot-hub-dev-guide-sas.md#use-sas-tokens-as-a-device)
- [DPS symmetric key attestation](../iot-dps/concepts-symmetric-key-attestation.md)
- [DPS X.509 certificate attestation](../iot-dps/concepts-x509-attestation.md)
- [DPS trusted platform module attestation](../iot-dps/concepts-tpm-attestation.md)
- [Device authentication concepts in IoT Central](../iot-central/core/concepts-device-authentication.md)

All data exchanged between a device and an IoT hub is encrypted.

To learn more about security in your cloud-based IoT solution, see [Security best practices for cloud-based IoT solutions](iot-overview-security.md?tabs=cloud) and [Security architecture for Azure IoT Hub](/azure/well-architected/service-guides/azure-iot-hub#security).

---

## Protocols

### [Edge-based solution](#tab/edge)

To exchange data with service endpoints in the edge run time, assets use industry standards such as:

- [MQTT v3.1.1](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/mqtt-v3.1.1.html) and [MQTT v5.0](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html)
- [OPC UA](https://opcfoundation.org/)
- [ONVIF](https://www.onvif.org/) (preview)
- SQL (preview)
- REST (preview)
- Media streaming protocols such as RTSP, RTCP, SRT, HLS, and JPEG over HTTP (preview).

### [Cloud-based solution](#tab/cloud)

An IoT device can use one of several network protocols when it connects to an IoT Hub or DPS endpoint:

- [MQTT](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/mqtt-v3.1.1.pdf)
- MQTT over WebSockets
- [Advanced Message Queuing Protocol (AMQP)](https://docs.oasis-open.org/amqp/core/v1.0/os/amqp-core-complete-v1.0-os.pdf)
- AMQP over WebSockets
- HTTPS

> [!NOTE]
> IoT Hub has limited feature support for MQTT. If your solution needs MQTT v3.1.1 or v5 support, use the [MQTT support in Azure Event Grid](../event-grid/mqtt-overview.md). For more information, see [Compare MQTT support in IoT Hub and Event Grid](../iot/iot-mqtt-connect-to-iot-hub.md#compare-mqtt-support-in-iot-hub-and-event-grid).

To learn more about how to choose a protocol for your devices to connect to the cloud, see:

- [Protocol support in Azure IoT Hub](../iot-hub/iot-hub-devguide-protocols.md)
- [Communicate with DPS using the MQTT protocol](iot-mqtt-connect-to-iot-dps.md)
- [Communicate with DPS using the HTTPS protocol (symmetric keys)](../iot-dps/iot-dps-https-sym-key-support.md)
- [Communicate with DPS using the HTTPS protocol (X.509)](../iot-dps/iot-dps-https-x509-support.md)

---

## Connection patterns

### [Edge-based solution](#tab/edge)

### Connection through edge servers

Azure IoT Operations enables a one-to-many connection pattern at the edge. A single deployment can ingest data from multiple physical assets at the edge, then handle communication with the cloud.

The OPC UA standard is built around client applications connecting to servers. The connector for OPC UA is a client application that runs as a  service in Azure IoT Operations edge run time. The connector for OPC UA connects to OPC UA servers, lets you browse the server address space, and monitor data changes and events in connected physical assets. Operations teams and developers use the connector for OPC UA to streamline the task of connecting OPC UA servers to their industrial solution at the edge.

The media connector can process video streams (RTSP) directly from cameras. It can also access media servers where multiple cameras store their videos or images. When the media connector connects to a single external media server, it can save, process, or route the snapshots or video streams to an edge or cloud endpoint.

### [Cloud-based solution](#tab/cloud)

There are two broad categories of connection patterns that IoT devices use to connect to the cloud:

### Persistent connections

Persistent connections are required when your solution needs *command and control* capabilities. In command and control scenarios, your IoT solution sends commands to devices to control their behavior in near real time. Persistent connections maintain a network connection to the cloud and reconnect whenever there's a disruption. Use either the MQTT or the AMQP protocol for persistent device connections to an IoT hub. The IoT device SDKs enable both the MQTT and AMQP protocols for creating persistent connections to an IoT hub.

### Ephemeral connections

Ephemeral connections are brief connections for devices to send sensor data to your IoT hub. After a device sends the sensor data, it drops the connection. The device reconnects when it has more sensor data to send. Ephemeral connections aren't suitable for command and control scenarios. A device client can use the HTTP API if all it needs to do is send sensor data.

---

## Edge gateways

Edge gateways (sometimes referred to as field gateways) are typically deployed on-premises and close to your assets and IoT devices. Edge gateways run on your edge runtime environment and handle communication with the cloud on behalf of your assets and IoT devices. Edge gateways can:

- Do protocol translation. For example, enabling Bluetooth enabled devices to connect to the cloud.
- Manage offline and disconnected scenarios. For example, buffering sensor data when the cloud endpoint is unreachable.
- Filter, compress, or aggregate asset and device data before sending it to the cloud.
- Run AI at the edge to remove the latency associated with running AI models on behalf of assets and devices in the cloud. For example, using computer vision AI to detect anomalies in a production line and automatically stopping the line to prevent defects.

### [Edge-based solution](#tab/edge)

The Azure IoT Operations is an edge runtime environment that can act as a gateway by using the MQTT broker. A physical device can connect directly to the MQTT broker in the edge runtime environment. The MQTT broker can then use a data flow to forward data to a cloud service.

Data flows provide data transformation and data contextualization capabilities before routing messages to various locations including cloud endpoints.

Azure IoT Operations runs on Azure Arc-enabled Kubernetes clusters. This environment enables fully automated machine learning operations in hybrid mode, including training and AI model deployment steps that transition seamlessly between cloud and edge. To learn more, see [Introduction to Kubernetes compute target in Azure Machine Learning](/azure/machine-learning/how-to-attach-kubernetes-anywhere).

### [Cloud-based solution](#tab/cloud)

You can use Azure IoT Edge to deploy an edge gateway to your on-premises environment. IoT Edge provides a set of features that enable you to deploy and manage edge gateways at scale. IoT Edge also provides a set of modules that you can use to implement common gateway scenarios. To learn more, see [What is Azure IoT Edge?](../iot-edge/about-iot-edge.md)

An IoT Edge device can maintain a [persistent connection](#persistent-connections) to an IoT hub. The gateway forwards device sensor data to IoT Hub. This option enables command and control of the downstream devices connected to the IoT Edge device.

Azure IoT Edge allows you to deploy complex event processing, machine learning, image recognition, and other high value AI models. Azure services like Azure Stream Analytics and Azure Machine Learning can be run on-premises via the containerized Linux workloads. To learn more, see [Perform image classification at the edge with Custom Vision Service](../iot-edge/tutorial-deploy-custom-vision.md).

---

## Bridges

A device bridge enables devices that are connected to a non-Microsoft cloud to connect to your IoT solution. Examples of non-Microsoft clouds include [Sigfox](https://www.sigfox.com/), [Particle Device Cloud](https://www.particle.io/), and [The Things Network](https://www.thethingsnetwork.org/).

The open source IoT Central Device Bridge acts as a translator that forwards device data to an IoT Central application. To learn more, see [Azure IoT Central Device Bridge](https://github.com/Azure/iotc-device-bridge). There are non-Microsoft bridge solutions, such as [Tartabit IoT Bridge](/shows/internet-of-things-show/onboarding-constrained-devices-into-azure-using-tartabits-iot-bridge), for connecting devices to an IoT hub.

## Related content

- [IoT asset and device development](iot-overview-device-development.md)
- [IoT asset and device management and control](iot-overview-device-management.md)
- [Choose an Azure IoT service](iot-services-and-technologies.md)
