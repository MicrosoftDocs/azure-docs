---
title: Choose an Azure IoT service
description: Describes the collection of technologies and services you can use to build Azure IoT cloud-based and edge-based solutions.
author: asergaz
ms.service: azure-iot
services: iot
ms.topic: product-comparison
ms.date: 03/26/2025
ms.author: sergaz
#Customer intent: As a newcomer to IoT, I want to understand what Azure IoT services are available, and which one to select based on my IoT solution.
---

# Choose an Azure IoT service

Azure IoT technologies and services provide you with options to create a wide variety of IoT solutions that enable digital transformation for your organization. This article compares the following Azure IoT services:

- [Azure IoT Operations](../iot-operations/index.yml)
- [Azure IoT Edge](../iot-edge/index.yml)
- [Azure IoT Hub](../iot-hub/index.yml)
- [Azure IoT Central](../iot-central/index.yml)

## Choose a solution type

In a *cloud-based IoT solution*, your IoT devices connect directly to the cloud where their messages are processed and analyzed. You monitor and control your devices directly from the cloud. For example:

- To evaluate your cloud-based IoT solution, use IoT Central, a managed IoT application platform.
- To build a custom cloud-based IoT solution from scratch, use Azure IoT platform services such as IoT Hub, [Device Provisioning Service](../iot-dps/about-iot-dps.md), and [Azure Digital Twins](../digital-twins/index.yml).

In an *edge-based IoT solution*, your IoT assets connect to an edge environment that processes their messages before forwarding them to the cloud for storage and analysis. You typically monitor and control your assets from the cloud, through the edge runtime environment. It's also possible to monitor and control your assets directly from the edge. For example:

- For a single pane of glass to manage your edge-based solution with [Azure Arc](/azure/azure-arc/overview), and remove barriers between Operational technology (OT) and IT systems, use Azure IoT Operations.
- To expand IoT Hub capabilities, and bring analytics and intelligence to the edge, use IoT Edge.

In a *hybrid IoT solution*, you combine cloud-based and edge-based components to meet your specific requirements. For example: 

- To follow Microsoft's [adaptive cloud approach](#adaptive-cloud-approach) to integrate cloud and edge components, use Azure IoT Operations.
- To manage some devices connected directly to the cloud and others on the edge, use IoT Hub and IoT Edge.

## Choose adaptive cloud

The [adaptive cloud](/azure/adaptive-cloud/) approach unifies siloed teams, distributed sites, and disparate systems into a single operations, security, application, and data model. This approach enables you to use the same cloud and AI technologies to manage and monitor edge-based, cloud-based, and hybrid IoT solutions.

Solutions based on IoT Hub, IoT Central, and IoT Edge offer limited support for an adaptive cloud approach. Although IoT Hub, IoT Central, and IoT Edge instances are themselves Azure resources, they don't natively expose capabilities, such as device management and data transformation, as resources you can manage as standard Azure resources.

In contrast, solutions based on Azure IoT Operations provide a unified management experience for all the components in your solution. Azure IoT Operations uses Azure Arc-enabled services to manage and monitor your edge-based solution as if it were a cloud-based solution. For example, assets and data transformations running on the edge are exposed as cloud resources in Azure. This approach enables you to use standard Azure technologies to manage and monitor your entire edge-based solution.

## Device and asset comparisons

The following table summarizes current options for assets, devices, and connectivity:

| Current offerings (GA)          | Cloud-based solution | Edge-based solution |
|---------------------------------|----------------------|---------------------|
| Connected object types          | IoT devices                                          | IoT devices, and assets (a broader set of physical or virtual entities that includes IoT devices)                                     |
| Device connectivity protocols   | HTTP, AMQP, MQTT v3.1.1                              | HTTP, AMQP, MQTT v3.1.1, MQTT v5. In [Azure IoT Operations](../iot-operations/overview-iot-operations.md), connectors enable other protocols. Azure IoT Operations includes connector for OPC UA, media connector, and connector for ONVIF. Custom connectors are possible.                          |
| Device implementation           | Microsoft IoT device SDKs and embedded device SDKs   | Microsoft IoT device SDKs and embedded device SDKs |
| Device management               | [IoT DPS](../iot-dps/index.yml), [Device Update](../iot-hub-device-update/index.yml), [IoT Central](../iot-central/index.yml)  | In Azure IoT Operations, use [Azure Device Registry](../iot-operations/discover-manage-assets/overview-manage-assets.md). Use Akri to enable automated asset/device discovery with native protocols. In [IoT Edge](../iot-edge/index.yml), use [IoT DPS](../iot-dps/index.yml) for large-scale device management.|

## IoT services comparisons

The following table summarizes current service and edge application options:

| Current offerings (GA)    | Cloud-based solution | Edge-based solution |
|---------------------------|----------------------|---------------------|
| Services                  | [IoT Hub](../iot-hub/index.yml), [IoT DPS](../iot-dps/index.yml), [IoT Hub Device Update](../iot-hub-device-update/index.yml), [Azure Digital Twins](../digital-twins/index.yml) | [Azure IoT Operations](../iot-operations/overview-iot-operations.md), with [Azure Device Registry](../iot-operations/discover-manage-assets/overview-manage-assets.md). You can also use [IoT Edge](../iot-edge/index.yml).  |
| Edge applications options | None                                                  | [DAPR](../iot-operations/create-edge-apps/howto-deploy-dapr.md) (distributed application runtime apps). With [IoT Edge](../iot-edge/index.yml), you can use IoT Edge modules.           |

## Deployment comparisons

The following table summarizes current deployment options:

| Current offerings (GA) | Cloud-based solution | Edge-based solution |
|------------------------|----------------------|---------------------|
| Topology               | Devices connect directly to cloud messaging services such as [IoT Hub](../iot-hub/index.yml). Managed in the cloud using Azure Resource Manager (ARM) or IoT service SDKs.  | [Azure IoT Operations](../iot-operations/overview-iot-operations.md) provides a way to connect assets to an on-premises Kubernetes cluster. Assets connect to the Azure IoT Operations MQTT broker, either directly over standard networking protocols, or through intermediate devices. Managed in the cloud using Azure Arc-enabled services. You can also use [IoT Edge](../iot-edge/index.yml), which runs on a gateway device like an industrial PC, and provides cloud connectivity for devices by connecting to [IoT Hub](../iot-hub/index.yml). |
| Infrastructure         | Cloud services like [IoT Hub](../iot-hub/index.yml), and standard computing devices that contain a CPU/MPU, or constrained and embedded devices that contain an MCU. | [Azure IoT Operations](../iot-operations/overview-iot-operations.md), which runs on a Kubernetes cluster, and assets or devices that connect to the cluster. You can also use [IoT Edge](../iot-edge/index.yml), which runs on a gateway device like a Raspberry Pi or an industrial PC, and devices that connect to the gateway device. Devices can include standard computing devices that contain a CPU/MPU, or constrained and embedded devices that contain an MCU. |

## Security comparisons

The following table summarizes current security options:

| Current offerings (GA)  | Cloud-based solution | Edge-based solution |
|-------------------------|----------------------|---------------------|
| Authentication          | SAS, X.509                                                                         | SAS, X.509, and SAT (security account tokens) for on-cluster authentication |
| Authorization           | Proprietary within current service offerings like [IoT Hub](../iot-hub/index.yml)  | Azure IoT Operations uses [Microsoft Entra ID](/entra/fundamentals/whatis) identity for role-based access control (RBAC). [IoT Edge](../iot-edge/index.yml) uses a proprietary authorization scheme that communicates with [IoT Hub](../iot-hub/index.yml) but handles authorization locally. |

## Next steps

For a hands-on experience, try one of the quickstarts:

- [Manage your devices and workloads with Azure Iot Operations](../iot-operations/get-started-end-to-end-sample/quickstart-deploy)
- [Create an Azure IoT Central application](../iot-central/core/quick-deploy-iot-central.md)
- [Send telemetry from a device to an IoT hub](../iot-hub/quickstart-send-telemetry-cli.md)
