---
title: Connect to your Azure Percept DK over SSH
description: Learn how to SSH into your Azure Percept DK with PuTTY
author: elqu20
ms.author: v-elqu
ms.service: azure-percept
ms.topic: how-to
ms.date: 02/03/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Connect to your Azure Percept DK over SSH

Follow the steps below to set up an SSH connection to your Azure Percept DK through [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html).

## Prerequisites

- A Windows, Linux, or OS X based host computer with Wi-Fi capability
- An SSH client
	- If your host computer runs Windows, [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) is an effective SSH client, and will be used throughout this guide.
	- If your host computer runs Linux or OS X, SSH services are included in those operating systems and can be run without a separate client application. Check your operating system product documentation for more information on how to run SSH services.
- Azure Percept DK
- Set up a SSH login account during the [Azure Percept DK on-boarding experience](./quickstart-percept-dk-set-up.md)

## Initiate the SSH connection

1. Power on your Azure Percept DK (dev kit)

1. If your dev kit is already connected to a network over Ethernet or Wi-Fi, skip to the next step. Otherwise, connect your host computer directly to the dev kit’s Wi-Fi access point, just like connecting to any other Wi-Fi network:
    - **network name**: scz-xxxx (where “xxxx” is the last four digits of the dev kit’s MAC network address)
    - **password**: can be found on the Welcome Card that came with the dev kit

    > [!WARNING]
    > While connected to the Azure Percept DK Wi-Fi access point, your host computer will temporarily lose its connection to the Internet. Active video conference calls, web streaming, or other network-based experiences will be interrupted until step 3 of the Azure Percept DK on-boarding experience is completed.

1. Open PuTTY. Enter the following and click **Open** to SSH into your devkit:

    1. Host Name: 10.1.1.1
    1. Port: 22
    1. Connection Type: SSH

    > [!NOTE]
    > The **Host Name** is your device's IP address. If your dev kit is connected to the dev kit's Wi-Fi access point, the IP address will be 10.1.1.1. If your dev kit is connected over Ethernet, use the local IP address of the device, which you can get from the Ethernet router or hub. If your device is connected over Wi-Fi, you must use the IP address that was provided collected during the [Azure Percept DK on-boarding experience](./quickstart-percept-dk-set-up.md).

    :::image type="content" source="./media/how-to-ssh-into-percept-dk/ssh-putty.png" alt-text="Image.":::

1. Log in to the PuTTY terminal with the SSH username and password created during the on-boarding experience.

## Next steps

After successfully connecting to your Azure Percept DK through SSH, you may perform a variety of tasks, including troubleshooting, USB updates, and running the DiagTool or SoftAP Tool.