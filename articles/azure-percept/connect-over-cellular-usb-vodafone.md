---
title: Connect Azure Percept DK over 5G and LTE by using a Vodafone USB modem 
description: This article explains how to connect Azure Percept DK over 5G and LTE networks by using a Vodafone USB modem.
author: yvonne-dq
ms.author: jluoto
ms.service: azure-percept
ms.topic: how-to 
ms.date: 10/04/2022
ms.custom: template-how-to
---

# Connect Azure Percept DK over 5G and LTE by using a Vodafone USB Connect 4G v2 modem

[!INCLUDE [Retirement note](./includes/retire.md)]

This article discusses how to connect Azure Percept DK by using a Vodafone USB Connect 4G v2 modem.

For more information about this modem, go to the [Vodafone Integrated Terminals](https://www.vodafone.com/business/iot/iot-devices/integrated-terminals) page.

## Use the modem to connect

Before you begin, make sure that you've prepared Azure Percept DK for [connecting by using a USB modem](./connect-over-cellular-usb.md). No preparation for the USB modem itself is required.   

1. Plug a SIM card into the Vodafone modem.

1. Plug the Vodafone modem into the Azure Percept USB A port.

1. Power up Azure Percept DK.

1. Connect to Azure Percept DK by using the Secure Shell (SSH) network protocol.

1. Ensure that ModemManager is running by writing the following command to your SSH prompt:

    ```
    systemctl status ModemManager
    ```

    If you're successful, you'll get a result that's similar to the following:

    ```
    ModemManager.service - Modem Manager
    Loaded: loaded (/lib/systemd/system/ModemManager.service; enabled; vendor preset: enabled)
    Active: active (running) since Mon 2021-08-09 20:52:03 UTC; 23 s ago
    ```

1. List the active modems.

    To check to ensure that ModemManager can recognize your modem, run:

    ```
    mmcli --list-modems
    ```

    You should get a result that's similar to the following. Here the modem ID is `0`, but your result might differ.

    ```
    /org/freedesktop/ModemManager1/Modem/0 [Alcatel] Mobilebroadband
    ```

1. Get the modem details.

    To get the modem status details, run the following command (where modem ID is `0`).

    ```
    mmcli --modem 0
    ```

    By default, the modem is disabled (`Status -> state: disabled`).

    ```
      --------------------------------
      General  |                 path: /org/freedesktop/ModemManager1/Modem/0
              |            device id: 20a6021958444bcb6f6589b47fd264932c340e69
      --------------------------------
      Hardware |         manufacturer: Alcatel
              |                model: Mobilebroadband
              |    firmware revision: MPSS.JO.2.0.2.c1.7-00004-9607_
              |       carrier config: default
              |         h/w revision: 0
              |            supported: gsm-umts, lte
              |              current: gsm-umts, lte
              |         equipment id: xxx
      --------------------------------
      System   |               device: /sys/devices/platform/soc@0/38200000.usb/xhci-hcd.1.auto/usb3/3-1/3-1.2
              |              drivers: option, cdc_mbim
              |               plugin: generic
              |         primary port: cdc-wdm0
              |                ports: cdc-wdm0 (mbim), ttyUSB0 (at), ttyUSB1 (qcdm), 
              |                       ttyUSB2 (at), wwan0 (net)
      --------------------------------
      Status   |       unlock retries: sim-pin2 (3)
              |                state: disabled
              |          power state: on
              |       signal quality: 0% (cached)
      --------------------------------
      Modes    |            supported: allowed: 2g; preferred: none
              |                       allowed: 3g; preferred: none
              |                       allowed: 4g; preferred: none
              |                       allowed: 2g, 3g; preferred: 3g
              |                       allowed: 2g, 3g; preferred: 2g
              |                       allowed: 2g, 4g; preferred: 4g
              |                       allowed: 2g, 4g; preferred: 2g
              |                       allowed: 3g, 4g; preferred: 4g
              |                       allowed: 3g, 4g; preferred: 3g
              |                       allowed: 2g, 3g, 4g; preferred: 4g
              |                       allowed: 2g, 3g, 4g; preferred: 3g
              |                       allowed: 2g, 3g, 4g; preferred: 2g
              |              current: allowed: 2g, 3g, 4g; preferred: 2g
      --------------------------------
      Bands    |            supported: egsm, dcs, pcs, g850, utran-4, utran-5, utran-2, eutran-2, 
              |                       eutran-4, eutran-5, eutran-7, eutran-12, eutran-13, eutran-71
              |              current: egsm, dcs, pcs, g850, utran-4, utran-5, utran-2, eutran-2, 
              |                       eutran-4, eutran-5, eutran-7, eutran-12, eutran-13, eutran-71
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

    We recommend that you start with the default setting: 
    
    `Modes: current: allowed: 2g, 3g, 4g; preferred: 2g`. 
    
    If you're not already using this setting, run:
    
     `mmcli --modem 0 --set-allowed-modes='2g|3g|4g' --set-preferred-mode='2g'`.

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

    Your cell phone provider provides an APN, such as the following APN for Vodafone:

    ```
    mmcli --modem 0 --simple-connect="apn=internet4gd.gdsp"  
    ```

    You should get a response like "successfully connected the modem."

1. Get the modem status.

    You should now see a status of `Status -> state: connected` and a new `Bearer` category at the end of the status message.

    ```
    mmcli --modem 0
    ```

    ```
      --------------------------------
      General  |                 path: /org/freedesktop/ModemManager1/Modem/0-mobile.
              |            device id: 20a6021958444bcb6f6589b47fd264932c340e69
      --------------------------------
      Hardware |         manufacturer: Alcatel
              |                model: Mobilebroadband
              |    firmware revision: MPSS.JO.2.0.2.c1.7-00004-9607_
              |       carrier config: default
              |         h/w revision: 0
              |            supported: gsm-umts, lte
              |              current: gsm-umts, lte
              |         equipment id: xxx
      --------------------------------
      System   |               device: /sys/devices/platform/soc@0/38200000.usb/xhci-hcd.1.auto/usb3/3-1/3-1.2
              |              drivers: option, cdc_mbim
              |               plugin: generic
              |         primary port: cdc-wdm0
              |                ports: cdc-wdm0 (mbim), ttyUSB0 (at), ttyUSB1 (qcdm), 
              |                       ttyUSB2 (at), wwan0 (net)
      --------------------------------
      Numbers  |                  own: xxx
      --------------------------------
      Status   |       unlock retries: sim-pin2 (10)
              |                state: connected
              |          power state: on
              |          access tech: lte
              |       signal quality: 19% (recent)
      --------------------------------
      Modes    |            supported: allowed: 2g; preferred: none
              |                       allowed: 3g; preferred: none
              |                       allowed: 4g; preferred: none
              |                       allowed: 2g, 3g; preferred: 3g
              |                       allowed: 2g, 3g; preferred: 2g
              |                       allowed: 2g, 4g; preferred: 4g
              |                       allowed: 2g, 4g; preferred: 2g
              |                       allowed: 3g, 4g; preferred: 4g
              |                       allowed: 3g, 4g; preferred: 3g
              |                       allowed: 2g, 3g, 4g; preferred: 4g
              |                       allowed: 2g, 3g, 4g; preferred: 3g
              |                       allowed: 2g, 3g, 4g; preferred: 2g
              |              current: allowed: 2g, 3g, 4g; preferred: 2g
      --------------------------------
      Bands    |            supported: egsm, dcs, pcs, g850, utran-4, utran-5, utran-2, eutran-2, 
              |                       eutran-4, eutran-5, eutran-7, eutran-12, eutran-13, eutran-71
              |              current: egsm, dcs, pcs, g850, utran-4, utran-5, utran-2, eutran-2, 
              |                       eutran-4, eutran-5, eutran-7, eutran-12, eutran-13, eutran-71
      --------------------------------
      IP       |            supported: ipv4, ipv6, ipv4v6
      --------------------------------
      3GPP     |                 imei: xxxxxxxxxxxxxxx
              |        enabled locks: fixed-dialing
              |          operator id: 302220
              |        operator name: TELUS
              |         registration: roaming
      --------------------------------
      3GPP EPS | ue mode of operation: csps-2
      --------------------------------
      SIM      |     primary sim path: /org/freedesktop/ModemManager1/SIM/0
      --------------------------------
      Bearer   |                paths: /org/freedesktop/ModemManager1/Bearer/0
    ```

1. Get the bearer details.

    You need the bearer details to connect the operating system to the packet data connection that the modem has now established with the cellular network. At this point, the modem has an IP connection, but the operating system is not yet configured to use it.

    ```
    mmcli --bearer 0
    ```

    The bearer details are listed in the following code:

    ```
      --------------------------------
      General            |       path: /org/freedesktop/ModemManager1/Bearer/0
                        |       type: default
      --------------------------------
      Status             |  connected: yes
                        |  suspended: no
                        |  interface: wwan0
                        | ip timeout: 20
      --------------------------------
      Properties         |        apn: internet4gd.gdsp
                        |    roaming: allowed
      --------------------------------
      IPv4 configuration |     method: static
                        |    address: 162.177.2.0
                        |     prefix: 22
                        |    gateway: 162.177.2.1
                        |        dns: 10.177.0.34, 10.177.0.210
                        |        mtu: 1500
      --------------------------------
      Statistics         |   attempts: 1
    ```

1. Bring up the network interface.

    ```
    sudo ip link set dev wwan0 up
    ```

1. Configure the network interface.

    By using the information provided by the bearer, replace the IP address (for example, we use 162.177.2.0/22 here) with the one your bearer has:

    ```
    sudo ip address add 162.177.2.0/22 dev wwan0
    ```

1. Check the IP information.

    The IP configuration for this interface should match the ModemManager bearer details. Run:

    ```
    sudo ip address show dev wwan0
    ```

    Your bearer IP is listed as shown here:

    ```
    wwan0: <BROADCAST,MULTICAST,NOARP,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UNKNOWN group default qlen 1000
        link/ether c2:12:44:c4:27:3c brd ff:ff:ff:ff:ff:ff
        inet 162.177.2.0/22 scope global wwan0
          valid_lft forever preferred_lft forever
        inet6 fe80::c012:44ff:fec4:273c/64 scope link 
          valid_lft forever preferred_lft forever
    ```

1. Set the default route.

    Again, by using the information provided by the bearer and using the modem's gateway (replace 162.177.2.1) as the default destination for network packets, run:

    ```
    sudo ip route add default via 162.177.2.1 dev wwan0
    ```

    Azure Percept DK is now enabled to connect to Azure by using the LTE modem.


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
   
### Vodafone modem rules to mitigate enumeration issues

To prevent the modem from enumerating in a non-supported mode, we suggest that you apply the following userspace/dev (udev) rules to have ModemManager ignore unwanted interfaces.

Create a */usr/lib/udev/rules.d/77-mm-vodafone-port-types.rules* file with the following content:

```
ACTION!="add|change|move|bind", GOTO="mm_vodafone_port_types_end"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="1bbb", GOTO="mm_vodafone_generic_vendorcheck"
GOTO="mm_vodafone_port_types_end"

LABEL="mm_vodafone_generic_vendorcheck"
SUBSYSTEMS=="usb", ATTRS{bInterfaceNumber}=="?*", ENV{.MM_USBIFNUM}="$attr{bInterfaceNumber}"

# Interface 1 is QDCM (ignored) and interfaces 3 and 4 are MBIM Control and Data.
ATTRS{idVendor}=="1bbb", ATTRS{idProduct}=="00b6", ENV{.MM_USBIFNUM}=="00", ENV{ID_MM_PORT_TYPE_AT_PRIMARY}="1"
ATTRS{idVendor}=="1bbb", ATTRS{idProduct}=="00b6", ENV{.MM_USBIFNUM}=="01", ENV{ID_MM_PORT_IGNORE}="1"
ATTRS{idVendor}=="1bbb", ATTRS{idProduct}=="00b6", ENV{.MM_USBIFNUM}=="02", ENV{ID_MM_PORT_AT_SECONDARY}="1"

GOTO="mm_vodafone_port_types_end"

LABEL="mm_vodafone_port_types_end"
```

After they're installed, reload the udev rules and restart ModemManager:

```
udevadm control -R
systemctl restart ModemManager
```

## Next steps

Depending on the cellular device you have access to, you can connect in one of two ways:

* [Connect by using a USB modem](./connect-over-cellular-usb.md)
* [Connect by using 5G or LTE](./connect-over-cellular.md)
