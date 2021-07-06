---
title: Connecting Azure Percept Over Cellular Networks
description: This article explains how to connect the Azure Percept DK over cellular networks.
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: conceptual 
ms.date: 05/20/2021
ms.custom: template-concept 
---

# Connect the Azure Percept DK over cellular networks

The benefits of connecting Edge AI devices over cellular (LTE and 5G) networks are many. Scenarios where Edge AI is most effective are in places where Wi-Fi and LAN connectivity are limited, such as smart cities, autonomous vehicles, and agriculture. Additionally, cellular networks provide better security than Wi-Fi. Lastly, using IoT devices that run AI at the Edge provides a way to optimize the bandwidth on cellular networks. Where only necessary information is sent to the cloud while most of the data is processed on the device. Today, the Azure Percept DK isn't able to connect directly to cellular networks. However, they can connect to cellular gateways using the built-in Ethernet and Wi-Fi capabilities. This article covers how this works.

## Options for connecting the Azure Percept DK over cellular networks
With additional hardware, you can connect the Azure Percept DK using cellular connectivity like LTE or 5G. There are two primary options supported today:
- **Cellular Wi-Fi hotspot device** - where the dev kit is connected to the Wi-Fi network that the Wi-Fi hotspot provides. In this case, the dev kit connects to the network like any other Wi-Fi network. For more instructions, follow the [Azure Percept DK Setup Guide](./quickstart-percept-dk-set-up.md) and select the cellular Wi-Fi network broadcasted from the hotspot.
- **Cellular Ethernet gateway device** - here the dev kit is connected to the cellular gateway over Ethernet, which takes advantage of the improved security compared to Wi-Fi connections. The rest of this article goes into more detail on how a network like this is configured.

## Cellular gateway topology
:::image type="Image" source="media/connect-over-cellular/topology.png" alt-text="This diagram shows how the Azure Percept DK connects to a cellular gateway via Ethernet.":::

In the above diagram, you can see how a cellular gateway can be easily paired with the Azure Percept DK.

## Considerations when connecting to a cellular gateway
Here are some important points to consider when connecting the Azure Percept DK to a cellular gateway.
- Set up the gateway first and then validate that it's receiving a connection via the SIM. It will then be easier to troubleshoot any issues found while connecting the Azure Percept DK.
- Ensure both ends of the Ethernet cable are firmly connected to the gateway and Azure Percept DK.
- Follow the [default instructions](./how-to-connect-over-ethernet.md) for connecting the Azure Percept DK over Ethernet.
- If your cellular plan has a quota, it's recommended that you optimize how much data your Azure Percept DK models send to the cloud.
- Ensure you have a [properly configured firewall](./concept-security-configuration.md) that blocks externally originated inbound traffic.

## SSH over a cellular network
To SSH into the dev kit via a cellular ethernet gateway, you have these options:
- **Using the dev kit's Wi-Fi access point**. If you have Wi-Fi disabled, you can re-enable it by rebooting your dev kit. From there, you can connect to the dev kit's Wi-Fi access point and follow [these SSH procedures](./how-to-ssh-into-percept-dk.md).
- **Using a Ethernet connection to a local network (LAN)**. With this option, you'll unplug your dev kit from the cellular gateway and plug it into LAN router. For more information, see [How to Connect over Ethernet](./how-to-connect-over-ethernet.md). 
- **Using the gateway's remote access features**. Many cellular gateways include remote access managers that can be used to connect to devices on the network via SSH. Check with manufacturer of your cellular gateway to see if it has this feature. Here's an example of a remote access manager for [Cradlepoint cellular gateways](https://customer.cradlepoint.com/s/article/NCM-Remote-Connect-LAN-Manager).
- **Using the dev kit's serial port**. The Azure Percept DK includes a serial connection port that can be used to connect directly to the device. See [Connect your Azure Percept DK over serial](./how-to-connect-to-percept-dk-over-serial.md) for detailed instructions.

## Considerations when selecting a cellular gateway device
Cellular gateways support different technologies that impact the maximum data rate for downloads and uploads. The advertised data rates provide guidance for decision making but are usually never reached. Here is some guidance for selecting the right gateway for your needs.
 
- **LTE CAT-1** provides up to 10 Mbps down and 5 Mbps up. It is enough for default Azure Percept Devkit features such as object detection and creating a voice assistant. However, it may not be enough for solutions that require video streaming data up to the cloud.
- **LTE CAT-3 and 4** provides up to 100 Mbps down and 50 Mbps up, which is enough for streaming video to the cloud. However, it is not enough to stream full HD quality video.
- **LTE CAT-5 and higher** provides data rates high enough for streaming HD video for a single device. If you need to connect multiple devices to a single gateway, you will want to consider 5G.
- **5G** gateways will best position your scenarios for the future. They have data rates and bandwidth to support high data throughput for multiple devices at a time. Additionally, also provide lower latency for data transfer.


## Next steps
If you have a cellular gateway and would like to connect your Azure Percept DK to it, follow these next steps.
- [How to Connect your Azure Percept DK over Ethernet](./how-to-connect-over-ethernet.md)
