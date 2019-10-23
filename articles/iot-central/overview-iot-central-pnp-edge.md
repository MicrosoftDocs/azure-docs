---
title: What is Azure IoT Central Edge | Microsoft Docs
description: Businesses can now run cloud intelligence directly on IoT devices at the edge managed by Azure IoT Central. This new feature helps businesses connect and manage Edge devices running Azure IoT Edge runtime, deploy edge software modules, publish insights, and take actions at-scale – all from within IoT Central. This article provides an overview of the edge and gateway features of Azure IoT Central.
author: rangv
ms.author: rangv
ms.date: 10/22/2019
ms.topic: overview
ms.service: iot-central
services: iot-central
ms.custom: mvc
manager: rangv
---

# What is Azure IoT Central Edge (preview features)?

[!INCLUDE [iot-central-pnp-original](../../includes/iot-central-pnp-original-note.md)]

Azure IoT Central is a fully managed IoT software-as-a-service solution that makes it easy to create products that connect the physical and digital worlds. IoT Central is expanding its portfolio by supporting Azure IoT Edge devices. 

Businesses can now run cloud intelligence directly on IoT devices at the edge managed by Azure IoT Central. This new feature helps businesses connect and manage Edge devices running Azure IoT Edge runtime, deploy edge software modules, publish insights, and take actions at-scale – all from within IoT Central. [Click here](https://docs.microsoft.com/en-us/azure/iot-edge/about-iot-edge) for Azure IoT Edge Overview

This article provides an overview of the edge and gateway features of Azure IoT Central:

- The typical personas associated with a project.
- Overview of IoT Edge capabilities in IoT Central
- How to create your application.
- How to connect your Azure IoT Edge runtime powered devices to your application.
- How to manage your application.

## Personas

The Azure IoT Central documentation refers to four personas who interact with an Azure IoT Central application:

- A _builder_ is responsible for defining the types of devices that connect to the application and customizing the application for the operator.
- An _operator_ manages the devices connected to the application.
- An _administrator_ is responsible for administrative tasks such as managing users and roles within the application.
- A _device/module developer_ creates the code/module that runs on a device connected to your application.

## Overview of IoT Edge capabilities in IoT Central

The Azure IoT Edge runtime enables custom and cloud logic on IoT Edge devices. IoT Edge device is powered by the runtime, and performs management and communication operations. 

Azure IoT Edge runtime performs following functions:

- Install and update workloads on the device.
- Maintain Azure IoT Edge security standards on the device.
- Ensure that IoT Edge modules are always running.
- Report module health to the cloud for remote monitoring.
- Manage communication between downstream leaf devices and an IoT Edge device, between modules on an IoT Edge device, and between an IoT Edge device and the cloud.

![IoT Central Edge Overview](./media/overview-iot-central-pnp-edge/iotedge.png)

Azure IoT Central performs the following functions: 

- Azure IoT Edge device template support that describes the capabilities an edge device should implement such as 
  1. deployment manifest upload capability which will help manage a manifest for a fleet of devices
  2. modules which will run on the edge device
  3. telemetry each module sends
  4. properties each module reports and 
  5. command each module responds to
  6. Establish relationships between Azure IoT Edge gateway device capability model and downstream device capability model
  7. Cloud properties that are not stored on the edge device
  8. Customizations, dashboards, and forms that are part of your IoT Central application

  [Click here](./tutorial-define-edge-as-leaf-device-type-pnp.md) to Create Azure IoT Edge Device template
   
- Provisioning Azure IoT Edge devices at scale using Azure IoT device provisioning service
- Trigger rules and take actions on Azure IoT Edge devices
- Build dashboards and analytics 
- Continuous data export of telemetry flowing from Edge devices

## Azure IoT Edge Device Types in IoT Central

Azure IoT Central classifies Azure IoT Edge device types as follows:

- Azure IoT Edge device as a leaf device. Edge device could have downstream devices, but downstream devices are not provisioned in IoT Central
- Azure IoT Edge device as a gateway device with downstream devices. Both Edge gateway device and downstream devices are provisioned in IoT Central

![IoT Central Edge Overview](./media/overview-iot-central-pnp-edge/gatewayedge.png)

## Edge Patters Supported in Central

- **Azure IoT Edge as leaf device**
  ![Edge as leaf device](./media/overview-iot-central-pnp-edge/edgeasleafdevice.png)
  Azure IoT Edge device will be provisioned in IoT Central and any downstream devices and its telemetry will be represented as coming from Azure IoT Edge device. Downstream devices if any connected to the edge device will not be provisioned in IoT Central. 

- **Azure IoT Edge Gateway Device connected to Downstream Devices with identity**
  ![Edge with downstream device identity](./media/overview-iot-central-pnp-edge/edgewithdownstreamdeviceidentity.png)
  Azure IoT Edge device will be provisioned in IoT Central along with the downstream devices connected to the edge device. Runtime support provisioning of downstream devices through Edge gateway is planned for the future. IoT Central will light up Cloud First Provisioning of the downstream devices and the credentials are managed manually on the downstream device. Device first provisioning of downstream devices planned for the future semesters. 

- **Azure IoT Edge Gateway Device connected to Downstream Devices with identity provided by Edge Gateway**
  ![Edge with downstream device without identity](./media/overview-iot-central-pnp-edge/edgewithoutdownstreamdeviceidentity.png)
  Azure IoT Edge device will be provisioned in IoT Central along with the downstream devices connected to the edge device. Runtime support of edge gateway providing identity to downstream devices and provisioning of downstream devices is planned for the future. You can bring your own identity translation module and IoT Central will support this pattern. 

  

  



## Next steps

Now that you have an overview of Azure IoT Central, here are suggested next steps:

-  [Click here](./tutorial-define-edge-as-leaf-device-type-pnp.md) to Create Azure IoT Edge Device template
