---
title: Connect to Azure Percept DK over serial
description: How to set up a serial connection to your Azure Percept DK with a USB to TTL serial cable
author: yvonne-dq
ms.author: davej
ms.service: azure-percept
ms.topic: how-to
ms.date: 10/04/2022
ms.custom: template-how-to, ignite-fall-2021
---

# Connect to Azure Percept DK over serial

[!INCLUDE [Retirement note](./includes/retire.md)]

Follow the steps below to set up a serial connection to your Azure Percept DK through [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html).

> [!WARNING]
> **If you have a private preview dev kit** we do **NOT** recommend attempting to connect your dev kit over serial except in extreme failure cases (e.g. you bricked your device). Connecting over serial requires that the private preview dev kit be disassembled to access the GPIO pins. Taking apart the carrier board enclosure is very difficult and could break the Wi-Fi antenna cables.

## Prerequisites

- [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)
- Host PC
- Azure Percept DK
- [USB to TTL serial cable](https://www.adafruit.com/product/954)

    :::image type="content" source="./media/how-to-connect-to-percept-dk-over-serial/usb-serial-cable.png" alt-text="USB to TTL serial cable.":::

## Start the serial connection

1. Connect the [USB to TTL serial cable](https://www.adafruit.com/product/954) to the three GPIO pins on the motherboard as shown below.

    :::image type="content" source="./media/how-to-connect-to-percept-dk-over-serial/apdk-serial-pins.jpg" alt-text="Carrier board serial pin connections.":::

1. Power on your dev kit and connect the USB side of the serial cable to your PC.

1. In Windows, go to **Start** -> **Windows Update settings** -> **View optional updates** -> **Driver updates**. Look for a Serial to USB update in the list, check the box next to it, and select **Download and Install**.  

1. Next, open the Windows Device Manager (**Start** -> **Device Manager**). Go to **Ports** and select **USB to UART** to open **Properties**. Note which COM port your device is connected to.

1. Select the **Port Settings** tab. Make sure **Bits per second** is set to 115200.

1. Open PuTTY. Enter the following and select **Open** to connect to your devkit via serial:

    1. Serial line: COM[port #]
    1. Speed: 115200
    1. Connection Type: Serial

    :::image type="content" source="./media/how-to-connect-to-percept-dk-over-serial/putty-serial-session.png" alt-text="PuTTY session window with serial parameters selected.":::
