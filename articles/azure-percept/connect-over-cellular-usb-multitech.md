---
title: Connect Azure Percept DK over LTE by using a MultiTech MultiConnect USB modem 
description: This article explains how to connect Azure Percept DK over 5G or LTE networks by using a MultiTech MultiConnect USB modem.
author: yvonne-dq
ms.author: jluoto
ms.service: azure-percept
ms.topic: how-to 
ms.date: 10/04/2022
ms.custom: template-how-to
---

# Connect Azure Percept DK over LTE by using a MultiTech MultiConnect USB modem 

[!INCLUDE [Retirement note](./includes/retire.md)]

This article discusses how to connect your Azure Percept DK by using a MultiTech MultiConnect (MTCM-LNA3-B03) USB modem. 

> [!Note]
> The MultiTech MultiConnect USB modem comes in a variety of models. In this article, we used model LNA3, which works with Verizon and Vodafone SIM cards, among others. At this time, we're unable to connect to an AT&T network, but we're investigating the issue and will update this article if and when we find the root cause. For more information about the MultiTech MultiConnect USB modem, visit the [MultiTech](https://www.multitech.com/brands/multiconnect-microcell) site.

## Prepare to connect Azure Percept DK
To learn how to prepare Azure Percept DK, go to [Connect Azure Percept DK over 5G or LTE networks by using a USB modem](./connect-over-cellular-usb.md). Be sure to note the comments about the USB cables that should be used. 

### Prepare the modem
Before you begin, your modem must be in Mobile Broadband Interface Model (MBIM) mode. To learn how to prepare the modem, see the [Telit wireless solutions Attention (AT) command reference guide](
https://www.multitech.com/documents/publications/reference-guides/Telit_LE910-V2_Modules_AT_Commands_Reference_Guide_r5.pdf).

In this article, to enable the MBIM interface, we use AT command `AT#USBCFG=<mode>` to configure the correct USB mode.

The AT command reference guide lists all possible modes but, for this article, we're interested in mode `3`. The default mode is `0`.

The easiest way to configure the mode is to connect the MultiTech modem to a PC and use terminal software such as TeraTerm or PuTTY. You can use Windows Device Manager to see which USB port is assigned for the modem. If there are several ports, you might need to test to see which one is responding to AT commands. The COM port settings should be:
* **Baud rate**: 9600 (or 115200)
* **Stop bits**: 1
* **Parity**: None
* **Byte size**: 8
* **Flow control**: No control flow

Here are the AT commands:

To check to see which USB mode MultiTech device is currently running, use:

```
AT#USBCFG?
```

To change to mode 3, use:

```
AT#USBCFG=3
```

If you check again by using the first AT command, you should get: 
`#USBCFG: 3`

After you've set the correct USB mode, you should issue a reset by using:

```
AT#REBOOT
```

At this point, the modem should disconnect and later reconnect to the USB port by using the previously set mode.

## Use the modem to connect

Make sure that you've completed the Azure Percept DK preparations outlined in the [Connect by using a USB modem](./connect-over-cellular-usb.md) article.   

1. Plug a SIM card into the MultiTech modem.

1. Plug the MultiTech modem into the Azure Percept DK USB A port.

1. Power up Azure Percept DK.

1. Connect to Azure Percept DK by using the Secure Shell (SSH) network protocol.

1. Ensure that ModemManager is running by writing the following command to your SSH prompt:

    ```
    systemctl status ModemManager
    ```
    If you're successful, you'll get a result that's similar to the following:

    *ModemManager.service - Modem Manager*
    *Loaded: loaded (/lib/systemd/system/ModemManager.service; enabled; vendor preset: enabled)*
    *Active: active (running) since Mon 2021-08-09 20:52:03 UTC; 23 s ago*

1. List the active modems.

    To check to ensure that ModemManager can recognize your modem, run:

    ```
    mmcli --list-modems
    ```

    You should get a result that's similar to the following:

    ```
    /org/freedesktop/ModemManager1/Modem/0 [Telit] FIH7160
    ```

1. Get the modem details.

    The modem ID here is `0`, but your result might differ. Modem ID (`--modem 0`) is used in the ModemManager commands like this:
    
    ```
    mmcli --modem 0
    ```
    
    By default, the modem is disabled (`Status -> state: disabled`).

    ```
    --------------------------------
      General  |                 path: /org/freedesktop/ModemManager1/Modem/0
              |            device id: f89a480d73f1a9cfef28102a0b44be2a47329c8b
      --------------------------------
      Hardware |         manufacturer: Telit
              |                model: FIH7160
              |    firmware revision: 20.00.525
              |         h/w revision: XMM7160_V1.1_HWID437_MBIM_NAND
              |            supported: gsm-umts, lte
              |              current: gsm-umts, lte
              |         equipment id: xxxx
      --------------------------------
      System   |               device: /sys/devices/platform/soc@0/38200000.usb/xhci-hcd.1.auto/usb3/3-1/3-1.1
              |              drivers: cdc_acm, cdc_mbim
              |               plugin: telit
              |         primary port: cdc-wdm0
              |                ports: cdc-wdm0 (mbim), ttyACM1 (at), ttyACM2 (ignored),
              |                       ttyACM3 (ignored), ttyACM4 (at), ttyACM5 (ignored), ttyACM6 (ignored),
              |                       wwan0 (net)
      --------------------------------
      Status   |       unlock retries: sim-pin2 (3)
              |                state: disabled
              |          power state: on
              |       signal quality: 0% (cached)
      --------------------------------
      Modes    |            supported: allowed: 3g; preferred: none
              |                       allowed: 4g; preferred: none
              |                       allowed: 3g, 4g; preferred: none
              |              current: allowed: 3g, 4g; preferred: none
      --------------------------------
      Bands    |            supported: utran-5, utran-2, eutran-2, eutran-4, eutran-5, eutran-12,
              |                       eutran-13, eutran-17
              |              current: utran-2, eutran-2
      --------------------------------
      IP       |            supported: ipv4, ipv6, ipv4v6
      --------------------------------
      3GPP     |                 imei: xxxxxxxxxxxxxxx
              |        enabled locks: fixed-dialing
      --------------------------------
      3GPP EPS | ue mode of operation: csps-2
      --------------------------------
      SIM      |     primary sim path: /org/freedesktop/ModemManager1/SIM/0
    ```

1. Enable the modem.

    Before you establish a connection, turn on the modem's radio or radios by running the following code:

    ```
    mmcli --modem 0 --enable
    ```

    You should get a response like "successfully enabled the modem."

    After some time, the modem should be registered to a cell tower, and you should see a modem status of `Status -> state: registered` after you run the following code:

    ```
    mmcli --modem 0
    ```

1. Connect by using the access point name (APN) information.

    Your cell phone provider provides an APN, such as the following APN for Verizon:

    ```
    mmcli --modem 0 --simple-connect="apn=vzwinternet"  
    ```

    You should get a response like "successfully enabled the modem."

1. Get the modem status.

    You should now see a status of `Status -> state: connected` and a new `Bearer` category at the end of the status message.

    ```
    mmcli --modem 0
    ```

    ```
    --------------------------------
      General  |                 path: /org/freedesktop/ModemManager1/Modem/0
              |            device id: f89a480d73f1a9cfef28102a0b44be2a47329c8b
      --------------------------------
      Hardware |         manufacturer: Telit
              |                model: FIH7160
              |    firmware revision: 20.00.525
              |         h/w revision: XMM7160_V1.1_HWID437_MBIM_NAND
              |            supported: gsm-umts, lte
              |              current: gsm-umts, lte
              |         equipment id: xxxx
      --------------------------------
      System   |               device: /sys/devices/platform/soc@0/38200000.usb/xhci-hcd.1.auto/usb3/3-1/3-1.1
              |              drivers: cdc_acm, cdc_mbim
              |               plugin: telit
              |         primary port: cdc-wdm0
              |                ports: cdc-wdm0 (mbim), ttyACM1 (at), ttyACM2 (ignored),
              |                       ttyACM3 (ignored), ttyACM4 (at), ttyACM5 (ignored), ttyACM6 (ignored),
              |                       wwan0 (net)
      --------------------------------
      Numbers  |                  own: +1xxxxxxxx
      --------------------------------
      Status   |       unlock retries: sim-pin2 (3)
              |                state: connected
              |          power state: on
              |          access tech: lte
              |       signal quality: 16% (recent)
      --------------------------------
      Modes    |            supported: allowed: 3g; preferred: none
              |                       allowed: 4g; preferred: none
              |                       allowed: 3g, 4g; preferred: none
              |              current: allowed: 3g, 4g; preferred: none
      --------------------------------
      Bands    |            supported: utran-5, utran-2, eutran-2, eutran-4, eutran-5, eutran-12,
              |                       eutran-13, eutran-17
              |              current: utran-2, eutran-2
      --------------------------------
      IP       |            supported: ipv4, ipv6, ipv4v6
      --------------------------------
      3GPP     |                 imei: xxxxxxxxxxxxxxx
              |        enabled locks: fixed-dialing
              |          operator id: 311480
              |        operator name: Verizon
              |         registration: home
      --------------------------------
      3GPP EPS | ue mode of operation: csps-2
      --------------------------------
      SIM      |     primary sim path: /org/freedesktop/ModemManager1/SIM/0
      --------------------------------
      Bearer   |                paths: /org/freedesktop/ModemManager1/Bearer/0
    ```

1. Get the bearer details.

    You need bearer details to connect the operating system to the packet data connection that the modem has now established with the cellular network. At this point, the modem has an IP connection, but the operating system is not yet configured to use it.
  
    ```
    mmcli --bearer 0
    ```

    The bearer details are listed in the following code:

    ```
    ------------------------------------
      General            |           path: /org/freedesktop/ModemManager1/Bearer/0
                        |           type: default
      ------------------------------------
      Status             |      connected: yes
                        |      suspended: no
                        |      interface: wwan0
                        |     ip timeout: 20
      ------------------------------------
      Properties         |            apn: vzwinternet
                        |        roaming: allowed
      ------------------------------------
      IPv4 configuration |         method: static
                        |        address: 100.112.107.46
                        |         prefix: 24
                        |        gateway: 100.112.107.1
                        |            dns: 198.224.166.135, 198.224.167.135
      ------------------------------------
      Statistics         |       duration: 119
                        |       attempts: 1
                        | total-duration: 119
    ```

1. Bring up the network interface.

    ```
    sudo ip link set dev wwan0 up
    ```

1. Configure the network interface.

    By using the information provided by the bearer, replace the IP address (for example, we use 100.112.107.46/24 here) with the one your bearer has:

    ```
    sudo ip address add 100.112.107.46/24 dev wwan0
    ```

1. Check the IP information.

    The IP configuration for this interface should match the ModemManager bearer details. Run:

    ```
    sudo ip address show dev wwan0
    ```

    Your bearer IP is listed as shown here:

    ```
    6: wwan0: <BROADCAST,MULTICAST,NOARP,UP,LOWER_UP> mtu 1428 qdisc pfifo_fast state UNKNOWN group default qlen 1000
        link/ether 1e:fb:08:e9:2a:25 brd ff:ff:ff:ff:ff:ff
        inet 100.112.107.46/24 scope global wwan0
          valid_lft forever preferred_lft forever
        inet6 fe80::1cfb:8ff:fee9:2a25/64 scope link
          valid_lft forever preferred_lft forever
    ```

1. Set the default route.

    Again, by using the information provided by the bearer and using the modem's gateway (replace 100.112.107.1) as the default destination for network packets, run:

    ```
    sudo ip route add default via 100.112.107.1 dev wwan0
    ```

    Azure Percept DK is now connected with the USB modem!

1. Test the connectivity.

    In this article, you're executing a `ping` request through the `wwan0` interface. But you can also use Azure Percept Studio and check to see whether telemetry messages are arriving. Make sure that you're not using an Ethernet cable and that Wi-Fi isn't enabled so that you're using LTE. Run:

    ```
    ping -I wwan0 8.8.8.8
    ```

    You should get a result that's similar to the following:

    ```
    PING 8.8.8.8 (8.8.8.8) from 162.177.2.0 wwan0: 56(84) bytes of data.
    64 bytes from 8.8.8.8: icmp_seq=1 ttl=114 time=111 ms
    64 bytes from 8.8.8.8: icmp_seq=2 ttl=114 time=92.0 ms
    64 bytes from 8.8.8.8: icmp_seq=3 ttl=114 time=88.8 ms
    ^C
    --- 8.8.8.8 ping statistics ---
    3 packets transmitted, 3 received, 0% packet loss, time 4ms
    rtt min/avg/max/mdev = 88.779/97.254/110.964/9.787 ms
    ```


## Debugging

For general information about debugging, see [Connect by using a USB modem](./connect-over-cellular-usb.md).

## Next steps

Depending on the cellular device you have access to, you can connect in one of two ways:

* [Connect by using a USB modem](./connect-over-cellular-usb.md)
* [Connect by using 5G or LTE](./connect-over-cellular.md)
