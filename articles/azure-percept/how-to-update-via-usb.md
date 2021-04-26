---
title: Update your Azure Percept DK over a USB connection
description: Learn how to update the Azure Percept DK over a USB connection
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: how-to
ms.date: 03/18/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# How to update Azure Percept DK over a USB connection

Although using over-the-air (OTA) updates is the best method of keeping your dev kit's operating system and firmware up to date, there are scenarios where updating (or "flashing") the dev kit over a USB connection is necessary:

- An OTA update is not possible due to connectivity or other technical issues
- The device needs to be reset back to its factory state

This guide will show you how to successfully update your dev kit's operating system and firmware over a USB connection.

> [!WARNING]
> Updating your dev kit over USB will delete all existing data on the device, including AI models and containers.
>
> Follow all instructions in order. Skipping steps could put your dev kit in an unusable state.

## Prerequisites

- An Azure Percept DK
- A Windows, Linux, or OS X based host computer with Wi-Fi capability and an available USB-C or USB-A port
- A USB-C to USB-A cable (optional, sold separately)
- An SSH login, created during the [Azure Percept DK setup experience](./quickstart-percept-dk-set-up.md)

## Download software tools and update files

1. [NXP UUU tool](https://github.com/NXPmicro/mfgtools/releases). Download the **Latest Release** uuu.exe file (for Windows) or the uuu file (for Linux) under the **Assets** tab.

1. [7-Zip](https://www.7-zip.org/). This software will be used for extracting the raw image file from its XZ compressed file. Download and install the appropriate .exe file.

1. [Download the update files](https://go.microsoft.com/fwlink/?linkid=2155734). They are all contained in a zip file that you will extract in the next section.

1. Ensure all three build artifacts are present:
    - Azure-Percept-DK-*&lt;version number&gt;*.raw.xz
    - fast-hab-fw.raw
    - emmc_full.txt

## Set up your environment

1. Create a folder/directory on the host computer in a location that is easy to access via command line.

1. Copy the UUU tool (**uuu.exe** or **uuu**) to the new folder.

1. Extract the previously downloaded update files to the new folder that contains the UUU tool.

## Update your device

1. [SSH into your dev kit](./how-to-ssh-into-percept-dk.md).

1. Next, open a Windows command prompt (**Start** > **cmd**) or a Linux terminal and navigate to the folder where the update files and UUU tool are stored. Enter the following command in the command prompt or terminal to prepare your computer to receive a flashable device:

    - Windows:

        ```console
        uuu -b emmc_full.txt fast-hab-fw.raw Azure-Percept-DK-<version number>.raw 
        ```

    - Linux:

        ```bash
        sudo ./uuu -b emmc_full.txt fast-hab-fw.raw Azure-Percept-DK-<version number>.raw
        ```

1. Disconnect the Azure Percept Vision device from the carrier board's USB-C port.

1. Connect the supplied USB-C cable to the carrier board's USB-C port and to the host computer's USB-C port. If your computer only has a USB-A port, connect a USB-C to USB-A cable (sold separately) to the carrier board and host computer.

1. In the SSH client prompt, enter the following commands:

    1. Set the device to USB update mode:

        ```bash
        sudo flagutil    -wBfRequestUsbFlash    -v1
        ```

    1. Reboot the device. The update installation will begin.

        ```bash
        sudo reboot -f
        ```

1. Navigate back to the other command prompt or terminal. When the update is finished, you will see a message with ```Success 1    Failure 0```:

    > [!NOTE]
    > After updating, your device will be reset to factory settings and you will lose your Wi-Fi connection and SSH login.

1. Once the update is complete, power off the carrier board. Unplug the USB cable from the PC.  

## Next steps

Work through the [Azure Percept DK setup experience](./quickstart-percept-dk-set-up.md) to reconfigure your device.
