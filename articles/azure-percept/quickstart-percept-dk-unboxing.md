---
title: Unbox and assemble your Azure Percept DK
description: Learn how to unbox, connect, and power on your Azure Percept DK
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: quickstart
ms.date: 02/16/2021
ms.custom: template-quickstart #Required; leave this attribute/value as-is.
---

# Quickstart: unbox and assemble your Azure Percept DK

Once you have received your Azure Percept DK, reference this guide for information on connecting the components and powering on the device.

## Prerequisites

- Azure Percept DK (devkit)
- P7 screwdriver (optional, used for securing the power cable connector to the carrier board)

## Unbox and assemble your device

1. Unbox the Azure Percept DK components.

    The devkit contains a carrier board, Azure Percept Vision SoM, accessories box containing antennas and cables, and a welcome card with a hex key.

1. Connect the devkit components.

    > [!NOTE]
    > The power adapter port is located on the right side of the carrier board. The remaining ports (2x USB-A, 1x USB-C, and 1x Ethernet) and the power button are located on the left side of the carrier board.

    1. Hand screw both Wi-Fi antennas into the carrier board.

    1. Connect the Vision SoM to the carrier board's USB-C port with the USB-C cable.

    1. Connect the power cable to the power adapter.

    1. Remove any remaining plastic packaging from the devices.

    1. Connect the power adapter/cable to the carrier board and a wall outlet. To fully secure the power cable connector to the carrier board, use a P7 screwdriver (not included in the devkit) to tighten the connector screws.

    1. After plugging the power cable into a wall outlet, the device will automatically power on. The power button on the left side of the carrier board will be illuminated. Please allow some time for the device to boot up.

        > [!NOTE]
        > The power button is for powering off or restarting the device while connected to a power outlet. In the event of a power outage, the device will automatically restart.

For a visual demonstration of the devkit assembly, please see 0:00 through 0:50 of the following video:

</br>

> [!VIDEO https://www.youtube.com/embed/-dmcE2aQkDE]

## Next steps

Now that your devkit is connected and powered on, please see the [Azure Percept DK setup experience walkthrough](./quickstart-percept-dk-set-up.md) to complete device setup. The setup experience allows you to connect your devkit to a Wi-Fi network, set up an SSH login, create an IoT Hub, and provision your devkit to your Azure account. Once you have completed device setup, you will be ready to start prototyping.