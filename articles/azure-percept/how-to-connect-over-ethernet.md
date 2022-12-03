---
title: Connect to Azure Percept DK over Ethernet
description: This guide shows users how to connect to the Azure Percept DK setup experience when connected over an Ethernet connection.
author: yvonne-dq
ms.author: wendyowen
ms.service: azure-percept
ms.topic: how-to 
ms.date: 10/06/2021
ms.custom: template-how-to
---

# Connect to Azure Percept DK over Ethernet

[!INCLUDE [Retirement note](./includes/retire.md)]

In this how-to guide you'll learn how to launch the Azure Percept DK setup experience over an Ethernet connection. It's a companion to the [Quick Start: Set up your Azure Percept DK and deploy your first AI model](./quickstart-percept-dk-set-up.md) guide. See each option outlined below and choose which one is most appropriate for your environment.

## Prerequisites

- An Azure Percept DK 
- A Windows, Linux, or OS X based host computer with Wi-Fi or ethernet capability and a web browser
- Network cable

## Identify your dev kit's IP address

The key to running the Azure Percept DK setup experience over an Ethernet connection is finding your dev kit's IP address. This article covers three options:
1. From your network router
1. Via SSH
1. Via the Nmap tool

### From your network router
The fastest way to identify your dev kits's IP address is to look it up on your network router.
1. Plug the Ethernet cable into the dev kit and the other end into the router.
1. Power on your Azure Percept DK.
1. Look for a sticker on the network router specifying access instructions

    **Here are examples of router stickers**

    :::image type="content" source="media/how-to-connect-over-ethernet/router-sticker-01.png" alt-text="example sticker from a network router":::

    :::image type="content" source="media/how-to-connect-over-ethernet/router-sticker-02.png" alt-text="another example sticker from a network router":::

1. On your computer that is connected to Ethernet or Wi-Fi, open a web browser.
1. Type the browser address for the router as found on the sticker.
1. When prompted, enter the name and password for the router as found on the sticker.
1. Once in the router interface, select My Devices (or something similar, depending on your router).
1. Find the Azure Percept dev kit in the list of devices
1. Copy the IP address of the Azure Percept dev kit

### Via SSH
It's possible to find your dev kits's IP address by connecting to the dev kit over SSH.

> [!NOTE]
> Using the SSH method of identifying your dev kit's IP address requires that you are able to connect to your dev kit's Wi-Fi access point. If this is not possible for you, please use one of the other methods.

1. Plug the ethernet cable into the dev kit and the other end into the router
1. Power on your Azure Percept dev kit
1. Connect to your dev kit over SSH. See [Connect to your Azure Percept DK over SSH](./how-to-ssh-into-percept-dk.md) for detailed instruction on how to connect to your dev kit over SSH.
1. To list the ethernet local network IP address, type the bellow command in your SSH terminal window:

    ```bash
    ip a | grep eth1
    ```

    :::image type="content" source="media/how-to-connect-over-ethernet/ssh-local-network-address.png" alt-text="example of identifying local network IP in SSH terminal":::


1. The dev kit's IP address is displayed after ‘inet’. Copy the IP address.

### Using the Nmap tool
You can also use free tools found on the Web to identify your dev kit's IP address. In these instructions, we cover a tool called Nmap.
1. Plug the ethernet cable into the dev kit and the other end into the router.
1. Power on your Azure Percept dev kit.
1. On your host computer, download and install the [Free Nmap Security Scanner](https://nmap.org/download.html) that is needed for your platform (Windows/Mac/Linux).
1. Obtain your computer’s “Default Gateway” - [How to Find Your Default Gateway](https://www.noip.com/support/knowledgebase/finding-your-default-gateway/)
1. Open the Nmap application 
1. Enter your Default Gateway into the *Target* box and append **/24** to the end. Change *Profile* to **Quick scan** and select the **Scan** button.
    
    :::image type="content" source="media/how-to-connect-over-ethernet/nmap-tool.png" alt-text="example of the Nmap tool input":::
 
1. In the results, find the Azure Percept dev kit in the list of devices – similar to **apd-xxxxxxxx**
1. Copy the IP address of the Azure Percept dev kit 

## Launch the Azure Percept DK setup experience
1. Plug the ethernet cable into the dev kit and the other end into the router.
1. Power on your Azure Percept dev kit.
1. Open a web browser and paste the dev kit's IP address. The setup experience should launch in the browser.

## Next steps
- [Complete the set up experience](./quickstart-percept-dk-set-up.md)
