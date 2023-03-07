---
title: Azure Percept Audio device overview
description: Learn more about Azure Percept Audio
author: yvonne-dq
ms.author: davej
ms.service: azure-percept
ms.topic: conceptual
ms.date: 10/06/2022
ms.custom: template-concept #Required; leave this attribute/value as-is.
---

# Azure Percept Audio device overview

[!INCLUDE [Retirement note](./includes/retire.md)]

Azure Percept Audio is an accessory device that adds speech AI capabilities to [Azure Percept DK](./overview-azure-percept-dk.md). It contains a preconfigured audio processor and a four-microphone linear array, enabling you to use voice commands, keyword spotting, and far field speech with the help of Azure Cognitive Services. It is integrated out-of-the-box with Azure Percept DK, [Azure Percept Studio](https://go.microsoft.com/fwlink/?linkid=2135819), and other Azure edge management services. 
</br>

> [!VIDEO https://www.youtube.com/embed/Qj8NGn-7s5A]

## Azure Percept Audio components

Azure Percept Audio contains the following major components:

- Production-ready Azure Percept Audio device (SoM) with a four-microphone linear array and audio processing via XMOS Codec
- Developer (interposer) board: 2x buttons, 3x LEDs, Micro USB, and 3.5 mm audio jack
- Required cables: FPC cable, USB Micro Type-B to USB-A
- Welcome card
- Mechanical mounting plate with integrated 80/20 1010 series mount

## Compute capabilities ​

Azure Percept Audio passes audio input through the speech stack that runs on the CPU of the Azure Percept DK carrier board in a hybrid edge-cloud manner. Therefore, Azure Percept Audio requires a carrier board with an OS that supports the speech stack in order to perform. ​

The audio processing is done as follows: ​

- Azure Percept Audio: captures and converts the audio and sends it to the DK and audio jack.

- Azure Percept DK: the speech stack performs beam forming and echo cancellation and processes the incoming audio to optimize for speech. After processing, it performs keyword spotting.

- Cloud: processes natural language commands and phrases, keyword verification, and retraining. ​

- Offline: if the device is offline, it will detect the keyword and capture internet connection status telemetry. An increased false accept rate for keyword spotting may be observed as keyword verification in the cloud cannot be performed. ​

## Getting started

- [Assemble your Azure Percept DK](./quickstart-percept-dk-unboxing.md)
- [Connect your Azure Percept Audio device to your devkit](./quickstart-percept-audio-setup.md)
- [Complete the Azure Percept DK setup experience](./quickstart-percept-dk-set-up.md)

## Build a no-code prototype

Build a [no-code speech solution](./tutorial-no-code-speech.md) in [Azure Percept Studio](https://go.microsoft.com/fwlink/?linkid=2135819) using Azure Percept voice assistant templates for hospitality, healthcare, inventory, and automotive scenarios.

### Manage your no-code speech solution

- [Configure your voice assistant in Azure Percept Studio](./how-to-manage-voice-assistant.md)
- [Configure your voice assistant in Iot Hub](./how-to-configure-voice-assistant.md)
- [Azure Percept Audio troubleshooting](./troubleshoot-audio-accessory-speech-module.md)

## Additional technical information

- [Azure Percept Audio datasheet](./azure-percept-audio-datasheet.md)
- [Button and LED behavior](./audio-button-led-behavior.md)

