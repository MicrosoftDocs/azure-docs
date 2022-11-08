---
title: Connect Azure Percept over 5G or LTE networks
description: This article explains how to connect the Azure Percept DK over 5G or LTE networks.
author: yvonne-dq
ms.author: jluoto
ms.service: azure-percept
ms.topic: how-to 
ms.date: 10/04/2022
ms.custom: template-how-to
---

# Connect Azure Percept over 5G or LTE networks

[!INCLUDE [Retirement note](./includes/retire.md)]

The benefits of connecting Edge AI devices over 5G/LTE networks are many. Scenarios where Edge AI is most effective are in places where Wi-Fi and LAN connectivity are limited, such as smart cities, autonomous vehicles, and agriculture. Additionally, 5G/LTE networks provide better security than Wi-Fi. Lastly, using IoT devices that run AI at the Edge provides a way to optimize the bandwidth on 5G/LTE networks. Only the necessary information is sent to the cloud while most of the data is processed on the device. Today, Azure Percept DK even supports direct connection to 5G/LTE networks using a simple USB modem. Below more about the different options.

## Options for connecting Azure Percept DK over 5G or LTE networks
With additional hardware, you can connect the Azure Percept DK using 5G/LTE connectivity. There are three options supported today, you can find a link to more details for each option:
- **USB 5G/LTE Modem device** - We have now released a new SW image that supports open-source ModemManger SW that adds USB modem support to our Linux Operating System. This allows you to connect your Azure Percept over LTE or 5G networks using various often inexpensive USB modems. More info here [Connecting using USB modem](./connect-over-cellular-usb.md).   
- **5G/LTE Ethernet gateway device** - Here Azure Percept is connected to the 5G/LTE gateway over Ethernet. More info here [Connecting using cellular gateway](./connect-over-cellular-gateway.md).
- **5G/LTE Wi-Fi hotspot device** - Where Azure Percept is connected to the Wi-Fi network that the Wi-Fi hotspot provides. In this case, the dev kit connects to the network like any other Wi-Fi network. For more instructions, follow the [Azure Percept DK Setup Guide](./quickstart-percept-dk-set-up.md) and select the 5G/LTE Wi-Fi network broadcasted from the hotspot.


## Considerations when selecting a 5G or LTE device in general
5G/LTE devices whether they are USB modems or ethernet gateways support different technologies that impact the maximum data rate for downloads and uploads. The advertised data rates provide guidance for decision making but are rarely reached in real world. Here is some guidance for selecting the right device for your needs.
 
- **LTE CAT-1** provides up to 10 Mbps down and 5 Mbps up. It is enough for default Azure Percept Devkit features such as object detection and creating a voice assistant. However, it may not be enough for solutions that require video streaming data up to the cloud.
- **LTE CAT-3 and 4** provides up to 100 Mbps down and 50 Mbps up, which is enough for streaming video to the cloud. However, it is not enough to stream full HD quality video.
- **LTE CAT-5 and higher** provides data rates high enough for streaming HD video for a single device. If you need to connect multiple devices to a single gateway, you will want to consider 5G.
- **5G** gateways will best position your scenarios for the future. They have data rates and bandwidth to support high data throughput for multiple devices at a time. Additionally, also provide lower latency for data transfer.


## Next steps
Depending on what cellular device you might have access to, follow these links to connect your Azure Percept dev kit:

[Connect using cellular gateway](./connect-over-cellular-gateway.md).

[Connect using USB modem](./connect-over-cellular-usb.md).
