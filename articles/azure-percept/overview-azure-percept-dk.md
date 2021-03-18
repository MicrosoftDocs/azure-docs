---
title: Azure Percept DK overview
description: Learn more about the Azure Percept DK
author: elqu20
ms.author: v-elqu
ms.service: azure-percept
ms.topic: conceptual
ms.date: 02/18/2021
ms.custom: template-concept #Required; leave this attribute/value as-is.
---

# Azure Percept DK overview

Azure Percept DK is an edge AI and IoT development kit designed for developing vision and audio AI proof of concepts. When combined with [Azure Percept Studio](./overview-azure-percept-studio.md) and [Azure Percept Audio](./overview-azure-percept-audio.md), it becomes a powerful yet simple-to-use platform for building edge AI solutions for a wide range of vision or audio AI applications. It is available for purchase at the [Microsoft online store](https://go.microsoft.com/fwlink/p/?LinkId=2155270).

> [!div class="nextstepaction"]
> [Buy now](https://go.microsoft.com/fwlink/p/?LinkId=2155270)

:::image type="content" source="./media/overview-azure-percept-dk/dk-image.png" alt-text="Azure Percept DK device.":::

## Key Features

- **The ability to run AI at the edge**. With built-in hardware acceleration, it can run vision AI models without a connection to the cloud.
- **Hardware root of trust security built in**. See this overview of [Azure Percept Security](./overview-percept-security.md) for more details.
- **Seamless integration with [Azure Percept Studio](https://go.microsoft.com/fwlink/?linkid=2135819)** and other Azure services. Such as, Azure IoT Hub, Azure Cognitive Services and [Live Video Analytics](https://docs.microsoft.com/azure/media-services/live-video-analytics-edge/overview)
- **Seamless integration with optional [Azure Percept Audio](./overview-azure-percept-audio.md)**
- **Support for the top AI platforms**. Such as ONNX and TensorFlow.
- **Integration with the 80/20 railing system**. Making it easier to build prototypes in production environments. Learn more about [80/20 integration](./overview-8020-integration.md).

## Hardware Components

- The Azure Percept DK carrier board
	- NXP iMX8m processor
	- Trusted Platform Module (TPM) version 2.0
	- WiFi and Bluetooth connectivity
	- See the full [data sheet](./azure-percept-dk-datasheet.md)
- The Azure Percept Vision system on module (SoM)
	- Intel Movidius Myriad X (MA2085) vision processing unit (VPU)
	- RGB camera sensor with the ability to add a second
	- See the full [data sheet](./azure-percept-vision-datasheet.md)

## Get Started with the Azure Percept DK

- Complete these Quick Starts
	- [Unbox and assemble the Azure Percept DK](./quickstart-percept-dk-unboxing.md)
	- [Set up the Azure Percept DK and run your first vision AI model](./quickstart-percept-dk-set-up.md)
- Start building proof of concepts with these tutorials
	- [Create a no-code vision solution in Azure Percept Studio](./tutorial-nocode-vision.md)
	- [Create a voice assistant in Azure Percept Studio](./tutorial-no-code-speech.md)

## Next steps

> [!div class="nextstepaction"]
> [Buy an Azure Percept DK from the Microsoft online store](https://go.microsoft.com/fwlink/p/?LinkId=2155270)
