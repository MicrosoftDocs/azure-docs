---
title: Get started with Azure Percept Audio
description: Learn how to connect your Azure Percept Audio device to your Azure Percept DK
author: elqu20
ms.author: v-elqu
ms.service: azure-percept
ms.topic: quickstart
ms.date: 02/18/2021
ms.custom: template-quickstart #Required; leave this attribute/value as-is.
---

# Azure Percept Audio setup

Azure Percept Audio works out of the box with Azure Percept DK. No unique setup is required.

## Prerequisites

- Azure Percept DK (devkit)
- Azure Percept Audio
- [Azure subscription](https://azure.microsoft.com/free/)
- [Azure Percept DK setup experience](./quickstart-percept-dk-setup.md): you connected your devkit to a Wi-Fi network, created an IoT Hub, and connected your devkit to the IoT Hub

## Connecting your devices

1. Connect the Azure Percept Audio device to the Azure Percept DK carrier board with the included USB Micro Type-B to USB Type-A cable. Connect the Micro Type-B end of the cable to Audio SoM and the Type-A end to the Percept DK carrier board.

1. Power on the devkit.

    1. LED L01 on the Audio SoM will change to solid green to indicate that the device was powered on.
    1. LED L02 will change to blinking green to indicate that the Audio SoM is authenticating.

1. Wait for the authentication process to complete--this can take up to 3 minutes.

1. You are ready to begin prototyping when you see one of the following:

    - LED L01 turns off and L02 turns white. This indicates that authentication is complete, and the devkit has not been configured with a keyword yet.
    - All three LEDs turn blue. This indicates that authentication is complete, and the devkit is configured with a keyword.

    > [!NOTE]
    > Reach out to support if your devkit does not authenticate.

## Next steps

Create a [no-code speech solution](./tutorial-nocode-speech.md).