---
title: Connect Azure Percept DK over 5G and LTE networks by using a USB modem
description: This article explains how to connect Azure Percept DK over 5G and LTE networks by using a USB modem.
author: yvonne-dq
ms.author: jluoto
ms.service: azure-percept
ms.topic: how-to 
ms.date: 10/04/2022
ms.custom: template-how-to
---

# Connect Azure Percept DK over 5G and LTE networks by using a USB modem

[!INCLUDE [Retirement note](./includes/retire.md)]

This article discusses how to connect Azure Percept DK to 5G or LTE networks by using a USB modem. 

> [!NOTE]
> The information in this article applies only to special Azure Percept DK software that you can download according to the instructions in the next section. A special Azure Percept DK image includes ModemManager open-source software, which supports a wide variety of USB modems. The image doesn't support over-the-air (OTA) updates to the operating system or other software. With ModemManager open-source software, you can use a simple, cost-efficient LTE USB modem or more sophisticated 5G modems to connect Azure Percept DK to the internet and Azure. 
>
> The instructions in this article are intended to be used with USB modems that support a Mobile Broadband Interface Model (MBIM) interface. Before you obtain a USB modem, make sure that it supports the MBIM interface. Also make sure that it's listed in the ModemManager list of supported modems. ModemManager software can be used with other interfaces, but in this article we focus on the MBIM interface. For more information, go to the [freedesktop.org ModemManager](https://www.freedesktop.org/wiki/Software/ModemManager/) page.


:::image type="Image" source="media/connect-over-cellular/azure-percept-all-modems-v2.png" alt-text="A photographic illustration of Azure Precept DK using USB modems to connect to 5G and LTE networks.":::

## Set up Azure Percept DK to use a USB modem

1. [Download the Azure Percept 5G software image](https://aka.ms/azpercept5gimage) that supports ModemManager. 

   These three files are needed to update your Azure Percept DK software to support USB modems.

1. [Update the Azure Percept DK software](./how-to-update-via-usb.md) with the special 5G/LTE-enabled Azure Percept DK software that you downloaded in the preceding step. 

   > [!IMPORTANT]
   > Follow the instructions in [Update Azure Percept DK over a USB-C connection](./how-to-update-via-usb.md), but be sure to use *only* the files that you downloaded in the preceding step, and not the files that are mentioned in the article.

1. Follow the normal process to [set up the Azure Percept DK device](./quickstart-percept-dk-set-up.md), if it's unfamiliar to you. 

   The setup experience is not different on this ModemManager-enabled version of Azure Percept DK.

1. [Connect to Azure Percept DK by using the Secure Shell (SSH) network protocol](./how-to-ssh-into-percept-dk.md).

## Connect to a modem

The next three sections have instructions for connecting to various USB modems.  

### Vodafone USB Connect 4G v2 modem

This Vodafone USB modem is a simple LTE CAT-4 USB dongle that has no special features. The instructions for this modem can be used for other similar, simple, cost-efficient USB modems.

:::image type="Image" source="media/connect-over-cellular/vodafone-usb-modem-75.png" alt-text="Illustration of the top and bottom views of a Vodafone 4G v2 USB modem.":::

For instructions for connecting your Azure Percept DK by using a simple USB modem such as the Vodafone USB Connect 4G v2, see [Connect by using the Vodafone Connect 4G v2 USB modem](./connect-over-cellular-usb-vodafone.md).   

### MultiTech Multiconnect USB modem

This MultiTech USB modem offers several USB modes of operation. For this type of modem, you first have to enable the proper USB mode before you enable the MBIM interface that ModemManager supports.

:::image type="Image" source="media/connect-over-cellular/multitech-usb-modem-75.png" alt-text="Illustration of the MultiTech Multiconnect USB modem.":::

To connect Azure Percept DK by using a simple USB modem such as the MultiTech USB modem (MTCM-LNA3-B03), follow the instructions in [Connect by using the MultiTech USB modem](./connect-over-cellular-usb-multitech.md).

### Quectel 5G developer kit

The third modem is the Quectel 5G DK. It also offers several modes, and you have to enable the proper MBIM mode first.

:::image type="Image" source="media/connect-over-cellular/quectel-5-g-dk-75.png" alt-text="Illustration of the Quectel 5G DK USB modem.":::

For instructions for connecting your Azure Percept DK by using a 5G USB modem such as Quectel RM500Q-GL, see [Connect by using Quectel 5G Developer Kit](./connect-over-cellular-usb-quectel.md). 

## Help your 5G or LTE connection recover from reboot 
You can configure the USB modem to connect to the network, but if you reboot your device, you have to reconnect again manually. We're currently working on a solution to improve this experience. For more information, contact [our support team](mailto:azpercept5G@microsoft.com) with a short note referencing this issue. 

## Debugging information 
Check to ensure that your SIM card works on the specific hardware that you intend to use. Several carriers limit the data-only IoT SIM cards to work on only one device. For this reason, make sure that your device International Mobile Equipment Identity (IMEI) or serial number is listed on the carrier's SIM card allowed device list.

### ModemManager debug mode

You can enable the ModemManager debug mode by editing the */lib/systemd/system/ModemManager.service* file at the `ExecStart=/usr/sbin/ModemManager [...]` line by appending `--debug`, as shown in the following example:

```  
[...]  
ExecStart=/usr/sbin/ModemManager [...] --debug  
[...]  
```

For your changes to take effect, reload the services and restart ModemManager, as shown here:

```
systemctl daemon-reload
systemctl restart ModemManager
```

By running the following commands, you can view the logs and clean the log files:

```
journalctl -u ModemManager.service
journalctl --rotate
journalctl --vacuum-time=1s

```

### Enhance reliability and stability

To prevent ModemManager from interacting with non-modem serial interfaces, you can restrict the interfaces to be probed (to determine which are modems) by changing the [filter policies](https://www.freedesktop.org/software/ModemManager/api/latest/ch03s02.html). 

We recommend that you use the `STRICT` mode.

To do so, edit the */lib/systemd/system/ModemManager.service* file at the `ExecStart=/usr/sbin/ModemManager [...]` line by appending `--filter-policy=STRICT`, as shown in the following example:

```
[...]
ExecStart=/usr/sbin/ModemManager --filter-policy=STRICT
[...]
```
For your changes to take effect, reload the services and restart ModemManager, as shown here:

```
systemctl daemon-reload
systemctl restart ModemManager
```

## Next steps

* [Connect by using 5G or LTE](./connect-over-cellular.md)
* [Connect by using a cellular gateway](./connect-over-cellular-gateway.md)
