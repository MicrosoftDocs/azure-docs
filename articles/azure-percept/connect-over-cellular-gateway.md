---
title: Connect Azure Percept DK over 5G and LTE networks by using a gateway
description: This article explains how to connect Azure Percept DK over 5G and LTE networks by using a cellular gateway.
author: yvonne-dq
ms.author: jluoto
ms.service: azure-percept
ms.topic: how-to 
ms.date: 10/04/2022
ms.custom: template-how-to
---
# Connect Azure Percept DK over 5G and LTE networks by using a gateway

[!INCLUDE [Retirement note](./includes/retire.md)]

A simple way to connect Azure Percept to the internet is to use a gateway that connects to the internet over 5G or LTE and provides Ethernet ports. In this case, Azure Percept isn't even aware that it's connected over 5G or LTE. It "knows" only that its Ethernet port has connectivity and it's routing all traffic through that port.  


## Overview of 5G and LTE gateway topology

The following diagram shows how a 5G or LTE gateway can be easily paired with Azure Percept DK (development kit).

:::image type="Image" source="media/connect-over-cellular/topology-v2.png" alt-text="Diagram showing how Azure Percept DK connects to a 5G or LTE gateway via Ethernet." lightbox="media/connect-over-cellular/topology-expanded-v2.png":::

## If you're connecting to a 5G or LTE gateway

If you're connecting the Azure Percept DK to a 5G or LTE gateway, consider the following important points:
- Set up the gateway first, and then validate that it's receiving a connection via the SIM. Following this order makes it easier to troubleshoot any issues you find when you connect Azure Percept DK.
- Make sure that both ends of the Ethernet cable are firmly connected to the gateway and Azure Percept DK.
- Follow the [default instructions](./how-to-connect-over-ethernet.md) for connecting Azure Percept DK over Ethernet.
- If your 5G or LTE plan has a quota, we recommend that you optimize for the amount of data that your Azure Percept DK models send to the cloud.
- Make sure that you have a [properly configured firewall](./concept-security-configuration.md) that blocks externally originated inbound traffic.

## If you're connecting to the dev kit via SSH protocol

If you're using the Secure Shell (SSH) network protocol to connect with the dev kit via a 5G or LTE Ethernet gateway, use one of the following options:
- **Use the dev kit's Wi-Fi access point**: If you have Wi-Fi disabled, you can re-enable it by rebooting your dev kit. From there, you can connect to the dev kit's Wi-Fi access point and follow the instructions in [Connect to Azure Percept DK over SSH](./how-to-ssh-into-percept-dk.md).
- **Use an Ethernet connection to a local area network (LAN)**: With this option, you unplug your dev kit from the 5G or LTE gateway and plug it into a LAN router. For more information, see [Connect to Azure Percept DK over Ethernet](./how-to-connect-over-ethernet.md). 
- **Use the gateway's remote access features**: Many 5G and LTE gateways include remote access managers that can be used to connect to devices on the network via SSH. Check with the 5G or LTE gateway manufacturer to see whether it has this feature. For an example of a remote access manager, see [Cradlepoint 5G and LTE gateways](https://customer.cradlepoint.com/s/article/NCM-Remote-Connect-LAN-Manager).
- **Use the dev kit's serial port**: Azure Percept DK includes a serial connection port that can be used to connect directly to the device. For more information, see [Connect to Azure Percept DK over serial cable](./how-to-connect-to-percept-dk-over-serial.md).

## Next steps
Depending on the cellular device you have access to, you can connect in one of two ways:

* [Connect by using a USB modem](./connect-over-cellular-usb.md)
* [Connect by using 5G or LTE](./connect-over-cellular.md)
