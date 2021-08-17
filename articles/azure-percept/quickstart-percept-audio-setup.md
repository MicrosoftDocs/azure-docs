---
title: Set up Azure Percept Audio
description: Learn how to connect your Azure Percept Audio device to your Azure Percept DK
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: quickstart
ms.date: 03/25/2021
---

# Azure Percept Audio setup

Azure Percept Audio works out of the box with Azure Percept DK. No unique setup is required.

## Prerequisites

- Azure Percept DK (devkit)
- Azure Percept Audio
- [Azure subscription](https://azure.microsoft.com/free/)
- [Azure Percept DK setup experience](./quickstart-percept-dk-set-up.md): you connected your devkit to a Wi-Fi network, created an IoT Hub, and connected your devkit to the IoT Hub
- Speaker or headphones that can connect to a 3.5-mm audio jack (optional)

## Connecting your devices

1. Connect the Azure Percept Audio device to the Azure Percept DK carrier board with the included Micro USB to USB Type-A cable. Connect the Micro USB end of the cable to the Audio interposer (developer) board and the Type-A end to the Percept DK carrier board.

1. (Optional) connect your speaker or headphones to your Azure Percept Audio device via the audio jack, labeled "Line Out." This will allow you to hear audio responses.

1. Power on the dev kit by connecting it to the power adaptor. LED L02 will change to blinking white, which indicates that the device was powered on and is authenticating.

1. Wait for the authentication process to complete, which takes up to 5 minutes.

1. You're ready to begin prototyping when you see one of the following LED states:

    - LED L02 will change to solid white, indicating that the authentication is complete and the devkit is configured without a keyword.
    - All three LEDs turn blue, indicating that the authentication is complete and the devkit is configured with a keyword.

## Next steps

Create a [no-code speech solution](./tutorial-no-code-speech.md) in [Azure Percept Studio](https://go.microsoft.com/fwlink/?linkid=2135819).
