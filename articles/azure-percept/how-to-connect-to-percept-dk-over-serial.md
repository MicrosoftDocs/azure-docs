---
title: Connect to your Azure Percept DK over serial
description: Learn how to set up a serial connection to your Azure Percept DK with PuTTY and a USB to TTL serial cable
author: elqu20
ms.author: v-elqu
ms.service: azure-percept
ms.topic: how-to
ms.date: 02/03/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Connect to your Azure Percept DK over serial

Follow the steps below to set up a serial connection to your Azure Percept DK through [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html).

> [!WARNING]
> Do **NOT** attempt to connect your devkit over serial except in extreme failure cases (e.g. you bricked your device). Taking apart the carrier board enclosure to connect the serial cable is very difficult and will break your Wi-Fi antenna cables.

## Prerequisites

- [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)
- Host PC
- Azure Percept DK
- [USB to TTL serial cable](https://www.adafruit.com/product/954)

    :::image type="content" source="./media/how-to-connect-to-percept-dk-over-serial/usb-serial-cable.png" alt-text="USB to TTL serial cable.":::

## Initiate the serial connection

1. If your carrier board is connected to an 80/20 rail, remove it from the rail using the hex key (included in the devkit welcome card).

1. Remove the screws on the underside of the carrier board enclosure and extract the motherboard.

    > [!WARNING]
    > Removing the motherboard will break your Wi-Fi antenna cables. Do **NOT** proceed with the serial connection unless it is the last resort to recover your device.

1. Remove the heatsink.

1. Remove the jumper board from the GPIO pins.

    > [!TIP]
    > Note the orientation of the jumper board prior to removing it. For example, draw an arrow on or attach a sticker to the jumper board pointing towards the circuitry for reference. The jumper board is not keyed and may be accidentally connected backwards when reassembling your carrier board.

1. Connect the [USB to TTL serial cable](https://www.adafruit.com/product/954) to the GPIO pins on the motherboard as shown below. Please note that the red wire is not connected.

    - Connect the black cable (GND) to pin 6.
    - Connect the white cable (RX) to pin 8.
    - Connect the green cable (TX) to pin 10.

    :::image type="content" source="./media/how-to-connect-to-percept-dk-over-serial/serial-connection-carrier-board.png" alt-text="Carrier board serial pin connections.":::

1. Power on your devkit and connect the USB side of the serial cable to your PC.

1. In Windows, go to **Start** -> **Windows Update settings** -> **View optional updates** -> **Driver updates**. Look for a Serial to USB update in the list, check the box next to it, and click **Download and Install**.  

1. Next, open the Windows Device Manager (**Start** -> **Device Manager**). Go to **Ports** and click **USB to UART** to open **Properties**. Note which COM port your device is connected to.

1. Click the **Port Settings** tab. Make sure **Bits per second** is set to 115200.

1. Open PuTTY. Enter the following and click **Open** to connect to your devkit via serial:

    1. Serial line: COM[port #]
    1. Speed: 115200
    1. Connection Type: Serial

    :::image type="content" source="./media/how-to-connect-to-percept-dk-over-serial/putty-serial-session.png" alt-text="PuTTY session window with serial parameters selected.":::

## Next steps

To update an unbootable device over serial with the [USB to TTL serial cable](https://www.adafruit.com/product/954), please see the USB update guide for non-standard situations.

[comment]: # (Add link to USB update guide when available.)