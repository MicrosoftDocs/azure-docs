---
title: Connect Azure Percept over 5G or LTE networks using a USB Modem
description: This article explains how to connect the Azure Percept DK over 5G or LTE networks using USB modem.
author: juhaluoto
ms.author: amiyouss
ms.service: azure-percept
ms.topic: how-to 
ms.date: 09/03/2021
ms.custom: template-how-to
---
# Connect Azure Percept over 5G or LTE networks using a USB Modem

Here below you can find steps to prepare and connect Azure Percept DK using USB modems to 5G or LTE networks. These instructions are applicable to only the special Azure Percept DK SW that you can download following the instruction here below. This special Azure Percept image includes ModemManager open-source SW that supports wide variety of USB modems. NOTE, this image does not support OTA updates to the OS or other SW. With this SW, you can use simple cost efficient LTE USB modem or more sophisticated 5G modems to connect your Azure Percept to internet and Azure. 

> [!Note]
> These instructions are intended to be used with USB modems that support MBIM interface. Before obtaining a USB modem, please ensure it supports MBIM interface. Then make sure it is listed in the ModemManager supported modem list. ModemManager SW can be used with other interfaces, but we focused on MBIM interface. More info on ModemManager can be found here: https://www.freedesktop.org/wiki/Software/ModemManager/


:::image type="Image" source="media/connect-over-cellular/azure-percept-all-modems.png" alt-text="USB modems connected to Azure Percept.":::

## Setting up the Devkit for using USB Modem

- **Download Azure Percept SW image that supports ModemManager** - [Azure Percept 5G SW image files zipped](https://aka.ms/azpercept5gimage) to download the 3 files needed to update your Azure Percept SW to support USB modems
- **Update your Azure Percept with the downloaded files using USB method** - Follow [How-to-update-via-USB](./how-to-update-via-usb.md) to update your devkit with the special LTE/5G enabled Azure Percept SW you downloaded in the previous step. Remember to ONLY use the files downloaded in *the previous step* and not the ones pointed in the how-to-update-via-USB!
- **Go through the normal set up process** - [quickstart-percept-dk-set-up](./quickstart-percept-dk-set-up.md) to follow through the setup process if it is not familiar to you. The setup experience is not different on this ModemManager enabled version of Azure Percept.
- **Connect to your Azure Percept over SSH** - [how-to-ssh-into-percept-dk](./how-to-ssh-into-percept-dk.md) for instructions

## Step by step instructions for connecting three different modems

Here below you can find instructions for three different USB modems. First one is a simple LTE CAT-4 USB dongle (Vodafone) that does not have any special features. The instructions for this modem can be used for similar simple cost efficient USB modems. The second one (MultiTech) is an example of a USB modem that has different USB modes of operation. For this type of modem, you have to enable the proper USB mode first to enable the MBIM interface that ModemManager supports. The third one is a 5G modem (Quectel DK) and it also has different modes and you have to enable the proper MBIM mode first.  

### Vodafone USB Connect 4G v2 modem
:::image type="Image" source="media/connect-over-cellular/vodafone-usb-modem-75.png" alt-text="Vodafone USB modem":::

Here are the instructions for connecting your Azure Percept DK using a simple USB modem like the Vodafone USB Connect 4G v2.

[Connecting using Vodafone Connect 4G vs USB modem](./connect-over-cellular-usb-vodafone.md).   

### MultiTech Multiconnect USB modem
:::image type="Image" source="media/connect-over-cellular/multitech-usb-modem-75.png" alt-text="MultiTech USB modem":::

Here are the instructions for connecting your Azure Percept DK using a simple USB modem like the MultiTech USB modem (MTCM-LNA3-B03).

[Connecting using MultiTech USB modem](./connect-over-cellular-usb-multitech.md).   

### Quectel 5G developer kit
:::image type="Image" source="media/connect-over-cellular/quectel-5-g-dk-75.png" alt-text="Quectel 5G DK":::

Here are the instructions for connecting your Azure Percept DK using a 5G USB modem like Quectel RM500Q-GL.

[Connecting using Quectel 5G Developer Kit](./connect-over-cellular-usb-quectel.md). 

## How to make your LTE/5G connection recover from reboot 
With the above instructions you can configure the USB modem to connect to the network, but if you reboot your device you have to reconnect again manually. We are working on a solution for improving this. If you are interested in getting more info please send a mail to azpercept5G@microsoft.com with a short note referencing here. 

## Debugging information 
Always remember to check that your SIM card works on the specific HW you intend to use. Several carriers limit the data only IoT SIM cards to work on only one device. So if that is the case, you have to make sure your device IMEI/Serial number is listed in the SIM card "allowed device list" by the carrier.

### ModemManager Debug mode

ModemManager's debug mode can be enabled by editing file `/lib/systemd/system/ModemManager.service` at line: `ExecStart=/usr/sbin/ModemManager [...]` , and appending `--debug`, just like in the below example:
```  
[...]  
ExecStart=/usr/sbin/ModemManager [...] --debug  
[...]  
```
You will then need to reload services and restart ModemManager for changes to take effect:
```
systemctl daemon-reload
systemctl restart ModemManager
```
And here are few commands that allow you to see the logs and clean the log files:
```
journalctl -u ModemManager.service
journalctl --rotate
journalctl --vacuum-time=1s

```

### Reliability and stability enhancement

#### Strict mode
To prevent ModemManager from interacting with non-modem serial interfaces, you can restrict which interfaces are probed (to determine which are modems) by changing [filter policies](https://www.freedesktop.org/software/ModemManager/api/latest/ch03s02.html). We recommend using the `STRICT` mode

For this, you would need to edit `/lib/systemd/system/ModemManager.service` at line: `ExecStart=/usr/sbin/ModemManager [...]` , and add `--filter-policy=STRICT` , just like in the below example:
```
[...]
ExecStart=/usr/sbin/ModemManager --filter-policy=STRICT
[...]
```
You will then need to reload services and restart ModemManager for changes to take effect:
```
systemctl daemon-reload
systemctl restart ModemManager
```

## Next steps
Now check out the instructions for different USB modems:

[Connect using Vodafone Connect 4G vs USB modem](./connect-over-cellular-usb-vodafone.md)

[Connect using MultiTech USB modem](./connect-over-cellular-usb-multitech.md)

[Connect using Quectel 5G Developer Kit](./connect-over-cellular-usb-quectel.md)

Back to the main article on 5G or LTE:

[Connect using 5G or LTE](./connect-over-cellular.md).

[Connect using cellular gateway](./connect-over-cellular-gateway.md).
