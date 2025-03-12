---
title: What is the connector for ONVIF (preview)?
description: The connector for ONVIF (preview) in Azure IoT Central discovers and registers ONVIF cameras connected to Azure IoT Operations and enables you to manage them.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.topic: overview
ms.date: 11/04/2024

#CustomerIntent: As an industrial edge IT or operations user, I want to understand what the connector for ONVIF is so that I can determine whether I can use it in my industrial IoT solution.
---

# What is the Azure IoT Operations connector for ONVIF (preview)?

The connector for ONVIF (preview) for Azure IoT Operations discovers [ONVIF conformant](https://www.onvif.org/profiles-add-ons-specifications/) cameras connected to your Azure IoT Operations instance and registers them in the Azure Device Registry. After the camera is registered, examples of management operations include:

- Retrieving and updating the configuration of the camera to adjust the output image configuration.
- Controlling the camera pan, tilt, and zoom (PTZ).

The [media connector](overview-media-connector.md) can access the media sources exposed by these cameras.

Together, the media connector, connector for ONVIF, Azure IoT Operations, and companion services enable you to use Azure IoT Operations to implement use cases such as:

- Wait and dwell time tracking to track the time spent in line by customers.
- Order accuracy to track that the correct orders are packed by comparing items to POS receipt.
- Defect detection and quality assurance by cameras to detect any defects in products on the assembly line.
- Safety monitoring such as collision detection, safety zone detection, and personal safety equipment detection.

## Manage and control cameras

The connector for ONVIF enables you to:

- Read camera information and capabilities.
- Discover the media URIs exposed by the ONVIF camera.
- Configure ONVIF devices, for example by updating setting or selecting presets.
- Control the camera hardware by using PTZ commands.

## How does it relate to Azure IoT Operations?

The connector for ONVIF is part of Azure IoT Operations. The connector deploys to an Arc-enabled Kubernetes cluster on the edge as part of an Azure IoT Operations deployment. The connector interacts with other Azure IoT Operations elements, such as:

- _Asset endpoints_ that are custom resources in your Kubernetes cluster, define connections to assets such as cameras. An asset endpoint configuration includes the URL of the media source, the type of media source, and any credentials needed to access the media source. The media connector uses an asset endpoint to access the media source.

- _Assets_, in Azure IoT Operations are logical entities that you create to represent real assets such as cameras. An Azure IoT Operations ONVIF camera asset identifies the ONVIF network service the camera exposes, such as PTZ.

- The MQTT broker that you can use to publish messages from the connectors to other local or cloud-based components in your solution.

- The Azure Device Registry that stores information about local assets in the cloud.

## ONVIF compliance

ONVIF has several categories for compliance, such as discovery, device, media, imaging, analytics, events, and pan-tilt-zoom (PTZ) services. To learn more, see [ONVIF - Profiles, Add-ons, and Specifications](https://www.onvif.org/profiles-add-ons-specifications/).

The connector for ONVIF in Azure IoT Operations focuses on support for camera devices that implement the following profiles:

- [Profile S for basic video streaming](https://www.onvif.org/profiles/profile-s/)
- [Profile T for advanced video streaming](https://www.onvif.org/profiles/profile-t/)

The connector enables support for the following capabilities:

- Discovery of device information and capabilities.
- Monitoring events from devices.
- Discovery of the media URIs exposed by a device. The connector for ONVIF makes these URIs available to the media connector.
- Imaging control such as filters and receiving  motion and tampering events.
- Controlling device PTZ.

## Next step

> [!div class="nextstepaction"]
> [How to use the connector for ONVIF](howto-use-onvif-connector.md)
