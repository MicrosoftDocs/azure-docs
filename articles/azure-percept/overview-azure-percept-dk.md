---
title: Azure Percept DK and Vision device overview
description: Learn more about the Azure Percept DK and Azure Percept Vision
author: yvonne-dq
ms.author: davej
ms.service: azure-percept
ms.topic: conceptual
ms.date: 10/06/2022
ms.custom: template-concept, ignite-fall-2021
---

# Azure Percept DK and Vision device overview

[!INCLUDE [Retirement note](./includes/retire.md)]

Azure Percept DK is an edge AI development kit designed for developing vision and audio AI solutions with [Azure Percept Studio](./overview-azure-percept-studio.md). 

</br>

> [!VIDEO https://www.youtube.com/embed/Qj8NGn-7s5A]

## Key features

- Run AI at the edge. With built-in hardware acceleration, the dev kit can run AI models without a connection to the cloud.

- Hardware root of trust security built in. Learn more about [Azure Percept security](./overview-percept-security.md).

- Seamless integration with [Azure Percept Studio](https://go.microsoft.com/fwlink/?linkid=2135819) and other Azure services, such as Azure IoT Hub, Azure Cognitive Services, and [Live Video Analytics](../azure-video-analyzer/video-analyzer-docs/overview.md).

- Compatible with [Azure Percept Audio](./overview-azure-percept-audio.md), an optional accessory for building AI audio solutions.

- Support for third-party AI tools, such as ONNX and TensorFlow.

- Integration with the 80/20 railing system, which allows for endless device mounting configurations. Learn more about [80/20 integration](./overview-8020-integration.md).

## Hardware components

- Azure Percept DK carrier board:
	- NXP iMX8m processor
	- Trusted Platform Module (TPM) version 2.0
	- Wi-Fi and Bluetooth connectivity
	- For more information, see the [Azure Percept DK datasheet](./azure-percept-dk-datasheet.md)

- Azure Percept Vision system-on-module (SoM):
	- Intel Movidius Myriad X (MA2085) vision processing unit (VPU)
	- RGB camera sensor
	- For more information, see the [Azure Percept Vision datasheet](./azure-percept-vision-datasheet.md)

## Getting started with Azure Percept DK

- Set up your dev kit:
	- [Unbox and assemble the Azure Percept DK](./quickstart-percept-dk-unboxing.md)
	- [Complete the Azure Percept DK setup experience](./quickstart-percept-dk-set-up.md)

- Start building vision and audio solutions:
	- [Create a no-code vision solution in Azure Percept Studio](./tutorial-nocode-vision.md)
	- [Create a no-code speech solution in Azure Percept Studio](./tutorial-no-code-speech.md) (Azure Percept Audio accessory required)

