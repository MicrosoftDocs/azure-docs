---
title: Get started with Azure IoT
description: Guidance on how to get started on your IoT journey. Why you should start with the application platform as a service (aPaaS) model.
author: dominicbetts
ms.service: iot-fundamentals
services: iot-fundamentals
ms.topic: overview
ms.date: 08/23/2022
ms.author: dobett
---

# Get started with Azure IoT

IoT solutions require a combination of technologies to connect devices, events, and actions to cloud applications. Microsoft provides open-source [Device SDKs](../iot-develop/about-iot-sdks.md) that you can use to build the apps that run on your devices. However, there are many options for building and deploying your IoT cloud solutions. To simplify onboarding to Azure IoT, the recommended approach aims to accelerate time to value and eliminate key challenges.

## Start as high as you can, with Azure IoT Central

You should start your IoT journey with Azure IoT Central, the Azure application platform as a service (aPaaS) offering. Starting as high as possible in the Azure IoT technology stack lets you focus your time on using IoT data to create business value instead of simply getting your IoT data.

:::image type="content" source="media/iot-solution-options/azure-iot-central.svg" alt-text="Diagram that shows how Azure IoT Central is built on top of PaaS services." border="false":::

IoT Central accelerates assembly and operation by pre-assembling platform as a service (PaaS) components. With an out-of-the box web UI and API surface, you can easily monitor device conditions, create rules, and manage millions of devices and their data remotely throughout their life cycles. Furthermore, you can act on device insights by extending IoT intelligence into line-of-business applications. Azure IoT Central also offers built-in disaster recovery, multitenancy, global availability, and a predictable cost structure.

## Go as low as you must, with powerful Azure PaaS Services

Some scenarios may need a higher degree of control and customization than Azure IoT Central provides. In these cases, Azure also offers individual platform as a service (PaaS) cloud services that you can use to build a custom IoT solution:

:::image type="content" source="media/iot-solution-options/azure-iot-onboarding.png" alt-text="Diagram that shows key Azure IoT PaaS services that you can use to build a custom solution." border="false":::

## Next steps

For a more comprehensive comparison of the PaaS and aPaaS solution approaches, see [What's the difference between aPaaS and PaaS solution offerings?](iot-solution-apaas-paas.md).

For a more comprehensive explanation of the different services and platforms, and how they're used, see [Azure IoT services and technologies](iot-services-and-technologies.md).

To learn more about the key attributes of successful IoT solutions, see the [8 attributes of successful IoT solutions](https://aka.ms/8attributes) white paper.

For an in-depth discussion of IoT architecture, see the [Microsoft Azure IoT Reference Architecture](/azure/architecture/reference-architectures/iot).

To learn about the device migration tool, see [Migrate devices from Azure IoT Central to Azure IoT Hub](../iot-central/core/howto-migrate-to-iot-hub.md).
