---
title: Connect to your Azure Percept DK over SSH
description: Learn how to SSH into your Azure Percept DK with PuTTY
author: elqu20
ms.author: v-elqu
ms.service: rtos #temporary, will update to azure-percept once available
ms.topic: how-to
ms.date: 02/03/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Connect to your Azure Percept DK over SSH

Follow the steps below to set up an SSH connection to your Azure Percept DK through [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html).

## Prerequisites

- [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html)
- Host PC
- Azure Percept DK

## Initiate the SSH connection

1. Power on your device.

1. If your device is already connected to a network over Ethernet or Wi-Fi, skip to the next step. Otherwise, open your network and internet settings and connect to the device's SoftAP hotspot:

    1. SSID: scz-xxxx (where xxxx is the last four digits of the devkit's Wi-Fi MAC address)
    1. password = santacruz

    > [!NOTE]
    > The password listed above is the default SoftAP password for builds released prior to 12/08/2020. If you manually set your SoftAP password through the OOBE, enter that password here. If your device build was released after 12/08/2020 and you did not manually set your SoftAP password, enter the device-specific, TPM-derived SoftAP password. This unique password was printed on your devkit's welcome card.

1. Open PuTTY. Enter the following and click **Open** to SSH into your devkit:

    1. Host Name: 10.1.1.1
    1. Port: 22
    1. Connection Type: SSH

    > [!NOTE]
    > The **Host Name** is your device's IP address. If your device is connected to the SoftAP, your IP address will be 10.1.1.1. If your device is connected over Ethernet, use the local IP address of the device, which you can get from the Ethernet router or hub. If your device is connected over Wi-Fi, you must use the IP address that was provided during the OOBE.

    :::image type="content" source="./media/how-to-ssh-into-percept-dk/ssh-putty.png" alt-text="PuTTY session configuration window.":::

1. Log in to the PuTTY terminal. If you set up an SSH username and password during the OOBE, enter those login credentials when prompted. Otherwise, enter the following:  

    1. login as: root
    1. Password: p@ssw0rd

    :::image type="content" source="./media/how-to-ssh-into-percept-dk/putty-terminal.png" alt-text="PuTTY terminal window.":::  

## Next steps

After successfully connecting to your Azure Percept DK through SSH, you may perform a variety of tasks, including troubleshooting, USB updates, and running the DiagTool or SoftAP Tool.

[comment]: # (Add links to OOBE and next step articles when available.)
[comment]: # (Update ms.service)