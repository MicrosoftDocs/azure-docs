---
title: Connect Azure Percept over 5G or LTE networks using a gateway
description: This article explains how to connect the Azure Percept DK over 5G or LTE networks using cellular gateway.
author: juhaluoto
ms.author: amiyouss
ms.service: azure-percept
ms.topic: how-to 
ms.date: 09/23/2021
ms.custom: template-how-to
---
# Connect Azure Percept over 5G or LTE networks using a gateway
A gateway that connects to the internet over 5G or LTE and provides ethernet ports is a simple way of connecting Azure Percept to the internet. In this case, Azure Percept is not even aware that it is connected over 5G or LTE, all it knows that its ethernet port has connectivity and it routes all traffic through that.  


## 5G/LTE gateway topology overview
Below you can see how a 5G/LTE gateway can be easily paired with the Azure Percept DK.

:::image type="Image" source="media/connect-over-cellular/topology.png" alt-text="This diagram shows how the Azure Percept DK connects to a 5G/LTE gateway via Ethernet." lightbox="media/connect-over-cellular/topology-expanded.png":::

## Considerations when connecting to a 5G or LTE gateway
Here are some important points to consider when connecting the Azure Percept DK to a 5G/LTE gateway.
- Set up the gateway first and then validate that it's receiving a connection via the SIM. It will then be easier to troubleshoot any issues found while connecting the Azure Percept DK.
- Ensure both ends of the Ethernet cable are firmly connected to the gateway and Azure Percept DK.
- Follow the [default instructions](./how-to-connect-over-ethernet.md) for connecting the Azure Percept DK over Ethernet.
- If your 5G/LTE plan has a quota, it's recommended that you optimize how much data your Azure Percept DK models send to the cloud.
- Ensure you have a [properly configured firewall](./concept-security-configuration.md) that blocks externally originated inbound traffic.

## Considerations when doing SSH to the devkit
To SSH into the dev kit via a 5G/LTE ethernet gateway, you have these options:
- **Using the dev kit's Wi-Fi access point**. If you have Wi-Fi disabled, you can re-enable it by rebooting your dev kit. From there, you can connect to the dev kit's Wi-Fi access point and follow [how to SSH into Azure Percept DK](./how-to-ssh-into-percept-dk.md).
- **Using a Ethernet connection to a local network (LAN)**. With this option, you'll unplug your dev kit from the 5G/LTE gateway and plug it into LAN router. For more information, see [How to Connect over Ethernet](./how-to-connect-over-ethernet.md). 
- **Using the gateway's remote access features**. Many 5G/LTE gateways include remote access managers that can be used to connect to devices on the network via SSH. Check with manufacturer of your 5G/LTE gateway to see if it has this feature. Here's an example of a remote access manager for [Cradlepoint 5G/LTE gateways](https://customer.cradlepoint.com/s/article/NCM-Remote-Connect-LAN-Manager).
- **Using the dev kit's serial port**. The Azure Percept DK includes a serial connection port that can be used to connect directly to the device. See [Connect your Azure Percept DK over serial](./how-to-connect-to-percept-dk-over-serial.md) for detailed instructions.

## Next steps
Depending on what cellular device you might have access to, you might want to consider connecting over a USB mode:

[Connect using USB modem](./connect-over-cellular-usb.md).

Back to the main article on 5G or LTE:

[Connect using 5G or LTE](./connect-over-cellular.md).