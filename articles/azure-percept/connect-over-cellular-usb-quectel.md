---
title: Connect Azure Percept DK over 5G or LTE by using a Quectel RM500 5G modem
description: This article explains how to connect Azure Percept DK over 5G or LTE networks by using a Quectel 5G modem.
author: yvonne-dq
ms.author: jluoto
ms.service: azure-percept
ms.topic: how-to 
ms.date: 10/04/2022
ms.custom: template-how-to
---
# Connect Azure Percept DK over 5G or LTE by using a Quectel RM500-GL 5G modem  

[!INCLUDE [Retirement note](./includes/retire.md)]

This article discusses how to connect Azure Percept DK over 5G or LTE by using a Quectel RM500-GL 5G modem. 

For more information about this 5G modem dev kit, contact your Quectel local sales team:

* For North American customers: northamerica-sales@quectel.com
* For global customers: sales@quectel.com

> [!Note] 
> **About USB cables for 5G modems**:  
> 5G modems require more power than LTE modems, and the wrong USB cable can be a bottleneck to realizing the best possible 5G data rates. To supply sufficient, consistent power to a 5G modem, make sure that the USB cable meets the following standards:  
> **Power:**
> - Max amperage should be equal to or greater than 3 amperes.
> - The cable length should be less than 1 meter.
> - When you use a 5G modem, only one USB A port on Azure Percept DK should be active.
>  
> **Throughput:**
> - USB 3.1 Gen2
> - USB-IF certified

## Prepare to connect Azure Percept DK
To learn how to prepare Azure Percept DK, go to [Connect Azure Percept DK over 5G or LTE networks by using a USB modem](./connect-over-cellular-usb.md). Be sure to note the comments about the USB cables that should be used. 

### Prepare the modem
Before you begin, your modem must be in Mobile Broadband Interface Model (MBIM) mode. An undocumented but standard Quectel Attention (AT) command can be used for this: `AT+QCFG="usbnet"`.

The `usbnet` property can be set to four different values, from `0` to `3`:
- `0` for **NDIS / PPP / QMI mode** (supported by `qmi_wwan` driver, enabled with `CONFIG_USB_NET_QMI_WWAN=y|m`)
- `1` for **CDC Ethernet mode** (supported in Linux when `CONFIG_USB_NET_CDCETHER=y|m`)
- `2` for **MBIM mode** (supported in Linux when `CONFIG_USB_NET_CDC_MBIM=y|m`)
- `3` for **RNDIS mode**

The easiest way to configure the mode is to connect the Quectel 5G modem to a PC and use terminal software, such as TeraTerm, or Quectel's own PC software, such as QCOM. You can use Windows Device Manager to see which USB port is assigned for the modem. The COM port settings should be:
* **Baud rate**: 115200
* **Stop bits**: 1
* **Parity**: None
* **Byte size**: 8
* **Flow control**: No control flow

Here are the AT commands:

To check to see which USB mode Quectel device is currently running, use:

```
AT+QCFG="usbnet"
```

To change to mode 2, use:

```
AT+QCFG="usbnet",2
```

If you check again by using the first AT command, you should get:

```
+QCFG: "usbnet",2`
```

After you've set the correct USB mode, issue a hardware reset by using:

```
AT+CFUN=1,1
```

At this point, the modem should disconnect and later reconnect to the USB port.


## Use the modem to connect

1. Put a SIM card in the Quectel modem.

1. Plug the Quectel modem into the Azure Percept DK USB port. Be sure to use a proper USB cable.

1. Power up Azure Percept DK.

1. Ensure that ModemManager is running.

      ```
      systemctl status ModemManager
      ```
   
      If you're successful, you'll get a result that's similar to the following:

      ```
      * ModemManager.service - Modem Manager
         Loaded: loaded (/lib/systemd/system/ModemManager.service; enabled; vendor pre set: enabled)
         Active: active (running) since Mon 2021-08-09 20:52:03 UTC; 23s ago
      [...]
      ```

      If you're unsuccessful, make sure that you've flashed the correct image to Azure Percept DK (5G enabled).

1. List the active modems.

      When you list the modems, you'll see that the Quectel modem has been recognized and is now handled by ModemManager.

      ```
      mmcli --list-modems
      ```
   
      You should get a result that's similar to the following:

      ```
      /org/freedesktop/ModemManager1/Modem/0 [Quectel] RM500Q-GL
      ```

      The modem ID here is `0`, which is used in the following commands to address it (that is, `--modem 0`).

1. Get the modem details.

      By default, the modem is disabled (`Status -> state: disabled`). To view the status, run:

      ```
      mmcli --modem 0
      ```
      
      You should get a result that's similar to the following:

      ```
      General  |                    path: /org/freedesktop/ModemManager1/Modem/0
               |               device id: 8e3fb84e3755524d25dfa6f3f1943dc568958a2b
      -----------------------------------
      Hardware |            manufacturer: Quectel
               |                   model: RM500Q-GL
               |       firmware revision: RM500QGLABR11A04M4G
               |          carrier config: CDMAless-Verizon
               | carrier config revision: 0A010126
               |            h/w revision: RM500Q-GL
               |               supported: gsm-umts, lte, 5gnr
               |                 current: gsm-umts, lte, 5gnr
               |            equipment id: xxxx
      -----------------------------------
      System   |                  device: /sys/devices/platform/soc@0/38200000.usb/xhci-hcd.1.auto/usb4/4-1/4-1.1
               |                 drivers: option, cdc_mbim
               |                  plugin: quectel
               |            primary port: cdc-wdm0
               |                   ports: cdc-wdm0 (mbim), ttyUSB0 (qcdm), ttyUSB1 (gps),
               |                          ttyUSB2 (at), ttyUSB3 (at), wwan0 (net)
      -----------------------------------
      Numbers  |                     own: +1xxxx
      -----------------------------------
      Status   |          unlock retries: sim-pin2 (3)
               |                   state: disabled
               |             power state: on
               |          signal quality: 0% (cached)
      -----------------------------------
      Modes    |               supported: allowed: 3g; preferred: none
               |                          allowed: 4g; preferred: none
               |                          allowed: 3g, 4g; preferred: 4g
               |                          allowed: 3g, 4g; preferred: 3g
               |                          allowed: 5g; preferred: none
               |                          allowed: 3g, 5g; preferred: 5g
               |                          allowed: 3g, 5g; preferred: 3g
               |                          allowed: 4g, 5g; preferred: 5g
               |                          allowed: 4g, 5g; preferred: 4g
               |                          allowed: 3g, 4g, 5g; preferred: 5g
               |                          allowed: 3g, 4g, 5g; preferred: 4g
               |                          allowed: 3g, 4g, 5g; preferred: 3g
               |                 current: allowed: 3g, 4g, 5g; preferred: 5g
      -----------------------------------
      Bands    |               supported: utran-1, utran-3, utran-4, utran-6, utran-5, utran-8,
               |                          utran-2, eutran-1, eutran-2, eutran-3, eutran-4, eutran-5, eutran-7,
               |                          eutran-8, eutran-12, eutran-13, eutran-14, eutran-17, eutran-18,
               |                          eutran-19, eutran-20, eutran-25, eutran-26, eutran-28, eutran-29,
               |                          eutran-30, eutran-32, eutran-34, eutran-38, eutran-39, eutran-40,
               |                          eutran-41, eutran-42, eutran-43, eutran-46, eutran-48, eutran-66,
               |                          eutran-71, utran-19
               |                 current: utran-1, utran-3, utran-4, utran-6, utran-5, utran-8,
               |                          utran-2, eutran-1, eutran-2, eutran-3, eutran-4, eutran-5, eutran-7,
               |                          eutran-8, eutran-12, eutran-13, eutran-14, eutran-17, eutran-18,
               |                          eutran-19, eutran-20, eutran-25, eutran-26, eutran-28, eutran-29,
               |                          eutran-30, eutran-32, eutran-34, eutran-38, eutran-39, eutran-40,
               |                          eutran-41, eutran-42, eutran-43, eutran-46, eutran-48, eutran-66,
               |                          eutran-71, utran-19
      -----------------------------------
      IP       |               supported: ipv4, ipv6, ipv4v6
      -----------------------------------
      3GPP     |                    imei: xxxxxxxxxxxxxxx
               |           enabled locks: fixed-dialing
      -----------------------------------
      3GPP EPS |    ue mode of operation: csps-1
               |      initial bearer apn: ims
               |  initial bearer ip type: ipv4v6
      -----------------------------------
      SIM      |        primary sim path: /org/freedesktop/ModemManager1/SIM/0
      ```

1. Enable the modem.

      Prior to establishing a connection, turn on the modem's radio or radios by running:

      ```
      mmcli --modem 0 --enable
      ```

      You should get a response that's similar to the following:

      ```
      successfully enabled the modem
      ```
   
      After some time, the modem should be registered to a cell tower, and you should see a modem status of `Status -> state: registered` after you run the following code:
   
      ```
      mmcli --modem 0
      ```

1. Connect by using the access point name (APN) information.

      Usually, modems provide the APN to use (see `3GPP EPS -> initial bearer APN` information), so you can use it to establish a connection. If the modem doesn't provide an APN, consult with your cell phone provider for the APN to use. 
      
      Here is the ModemManager command for connecting by using, for example, the Verizon APN `APN=vzwinternet`.

      ```
      mmcli --modem 0 --simple-connect="apn=vzwinternet"
      ```

      Again, you should get a response that's similar to the following:

      ```
      successfully connected the modem
      ```

1. Get the modem status.

      You should now see a status of `Status -> state: connected` and a new `Bearer` category at the end of the status message.
 
      ```
      mmcli -m 0
      ```

      ```
      -----------------------------------
      General  |                    path: /org/freedesktop/ModemManager1/Modem/0
               |               device id: 8e3fb84e3755524d25dfa6f3f1943dc568958a2b
      -----------------------------------
      Hardware |            manufacturer: Quectel
               |                   model: RM500Q-GL
               |       firmware revision: RM500QGLABR11A04M4G
               |          carrier config: CDMAless-Verizon
               | carrier config revision: 0A010126
               |            h/w revision: RM500Q-GL
               |               supported: gsm-umts, lte, 5gnr
               |                 current: gsm-umts, lte, 5gnr
               |            equipment id: xxx
      -----------------------------------
      System   |                  device: /sys/devices/platform/soc@0/38200000.usb/xhci-hcd.1.auto/usb4/4-1/4-1.1
               |                 drivers: option, cdc_mbim
               |                  plugin: quectel
               |            primary port: cdc-wdm0
               |                   ports: cdc-wdm0 (mbim), ttyUSB0 (qcdm), ttyUSB1 (gps),
               |                          ttyUSB2 (at), ttyUSB3 (at), wwan0 (net)
      -----------------------------------
      Numbers  |                     own: +1xxxx
      -----------------------------------
      Status   |          unlock retries: sim-pin2 (3)
               |                   state: connected
               |             power state: on
               |             access tech: lte
               |          signal quality: 12% (recent)
      -----------------------------------
      Modes    |               supported: allowed: 3g; preferred: none
               |                          allowed: 4g; preferred: none
               |                          allowed: 3g, 4g; preferred: 4g
               |                          allowed: 3g, 4g; preferred: 3g
               |                          allowed: 5g; preferred: none
               |                          allowed: 3g, 5g; preferred: 5g
               |                          allowed: 3g, 5g; preferred: 3g
               |                          allowed: 4g, 5g; preferred: 5g
               |                          allowed: 4g, 5g; preferred: 4g
               |                          allowed: 3g, 4g, 5g; preferred: 5g
               |                          allowed: 3g, 4g, 5g; preferred: 4g
               |                          allowed: 3g, 4g, 5g; preferred: 3g
               |                 current: allowed: 3g, 4g, 5g; preferred: 5g
      -----------------------------------
      Bands    |               supported: utran-1, utran-3, utran-4, utran-6, utran-5, utran-8,
               |                          utran-2, eutran-1, eutran-2, eutran-3, eutran-4, eutran-5, eutran-7,
               |                          eutran-8, eutran-12, eutran-13, eutran-14, eutran-17, eutran-18,
               |                          eutran-19, eutran-20, eutran-25, eutran-26, eutran-28, eutran-29,
               |                          eutran-30, eutran-32, eutran-34, eutran-38, eutran-39, eutran-40,
               |                          eutran-41, eutran-42, eutran-43, eutran-46, eutran-48, eutran-66,
               |                          eutran-71, utran-19
               |                 current: utran-1, utran-3, utran-4, utran-6, utran-5, utran-8,
               |                          utran-2, eutran-1, eutran-2, eutran-3, eutran-4, eutran-5, eutran-7,
               |                          eutran-8, eutran-12, eutran-13, eutran-14, eutran-17, eutran-18,
               |                          eutran-19, eutran-20, eutran-25, eutran-26, eutran-28, eutran-29,
               |                          eutran-30, eutran-32, eutran-34, eutran-38, eutran-39, eutran-40,
               |                          eutran-41, eutran-42, eutran-43, eutran-46, eutran-48, eutran-66,
               |                          eutran-71, utran-19
      -----------------------------------
      IP       |               supported: ipv4, ipv6, ipv4v6
      -----------------------------------
      3GPP     |                    imei: xxxxxxxxxxxxxxx
               |           enabled locks: fixed-dialing
               |             operator id: 311480
               |           operator name: Verizon
               |            registration: home
               |                     pco: 0: (partial) '27058000FF0100'

      -----------------------------------
      3GPP EPS |    ue mode of operation: csps-1
               |     initial bearer path: /org/freedesktop/ModemManager1/Bearer/0
               |      initial bearer apn: ims
               |  initial bearer ip type: ipv4v6
      -----------------------------------
      SIM      |        primary sim path: /org/freedesktop/ModemManager1/SIM/0
      -----------------------------------
      Bearer   |                   paths: /org/freedesktop/ModemManager1/Bearer/1

      ```

1. Get the bearer details.

      The bearer resulting from the preceding step, `--simple-connect`, is at path `/org/freedesktop/ModemManager1/Bearer/1`.

      This is the bearer that we're querying for modem information about the active connection. The initial bearer isn't attached to an active connection and, therefore, holds no IP information.

      ```
      mmcli --bearer 1
      ```

      ```
      --------------------------------
      General            |       path: /org/freedesktop/ModemManager1/Bearer/1
                           |       type: default
      --------------------------------
      Status             |  connected: yes
                           |  suspended: no
                           |  interface: wwan0
                           | ip timeout: 20
      --------------------------------
      Properties         |        apn: fast.t-mobile.com
                           |    roaming: allowed
      --------------------------------
      IPv4 configuration |     method: static
                           |    address: 25.21.113.165
                           |     prefix: 30
                           |    gateway: 25.21.113.166
                           |        dns: 10.177.0.34, 10.177.0.210
                           |        mtu: 1500
      --------------------------------
      Statistics         |   attempts: 1
      ```

      Here are descriptions of some key details:
      - `Status -> interface: wwan0`: Lists which Linux network interface matches this modem.
      - `IPv4 configuration`: Provides the IP configuration for the preceding interface to set for it to be usable.

1. Check the status of the modem network interface.

      By default, the network interface displays `DOWN`.

      ```
      ip link show dev wwan0
      ```

      You should get a result that's similar to the following:

      ```
      4: wwan0: <BROADCAST,MULTICAST,NOARP> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
         link/ether ce:92:c2:b8:1e:f2 brd ff:ff:ff:ff:ff:ff
      ```

1. Bring up the interface.

      ```
      sudo ip link set dev wwan0 up
      ```

1. Check the IP information.

      By default, the interface displays `UP,LOWER_UP`, with no IP information.

      ```
      sudo ip address show dev wwan0
      ```

      ```
      4: wwan0: <BROADCAST,MULTICAST,NOARP,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UNKNOWN group default qlen 1000
         link/ether ce:92:c2:b8:1e:f2 brd ff:ff:ff:ff:ff:ff
         inet6 fe80::cc92:c2ff:feb8:1ef2/64 scope link 
            valid_lft forever preferred_lft forever
      ```

1. Issue a DHCP request.

      This feature is specific to, but not limited to, the Quectel module. The IP information is usually to be set manually to the interface or through a network manager daemon that supports ModemManager (for example, NetworkManager), but here you can simply use the dhclient on the Quectel modem:

      ```
      sudo dhclient wwan0
      ```

1. Check the IP information.

      The IP configuration for this interface should match the ModemManager bearer details.

      ```
      sudo ip address show dev wwan0
      ```

      You should get a result that's similar to the following:

      ```
      4: wwan0: <BROADCAST,MULTICAST,NOARP,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UNKNOWN group default qlen 1000
         link/ether ce:92:c2:b8:1e:f2 brd ff:ff:ff:ff:ff:ff
         inet 25.21.113.165/30 brd 25.21.113.167 scope global wwan0
            valid_lft forever preferred_lft forever
         inet6 fe80::cc92:c2ff:feb8:1ef2/64 scope link 
            valid_lft forever preferred_lft forever
      ```

1. Check the interface routes.

      Notice that the DHCP client also set a default route for packets to go through the `wwan0` interface.

      ```
      ip route show dev wwan0
      ```

      You should get a result that's similar to the following:

      ```
      default via 25.21.113.166 
      25.21.113.164/30 proto kernel scope link src 25.21.113.165
      ```

      You've now established a connection to Azure Percept DK by using the Quectel modem!


1. Test connectivity.

      Execute a `ping` request through the `wwan0` interface.

      ```
      ping -I wwan0 8.8.8.8
      ```

      You should get a result that's similar to the following:

      ```
      PING 8.8.8.8 (8.8.8.8) from 25.21.113.165 wwan0: 56(84) bytes of data.
      64 bytes from 8.8.8.8: icmp_seq=1 ttl=114 time=137 ms
      64 bytes from 8.8.8.8: icmp_seq=2 ttl=114 time=114 ms
      ^C
      --- 8.8.8.8 ping statistics ---
      2 packets transmitted, 2 received, 0% packet loss, time 2ms
      rtt min/avg/max/mdev = 113.899/125.530/137.162/11.636 ms
      ```

## Debugging

For general information about debugging, see [Connect by using a USB modem](./connect-over-cellular-usb.md).

## Next steps

Depending on the cellular device you have access to, you can connect in one of two ways:

* [Connect by using a USB modem](./connect-over-cellular-usb.md)
* [Connect by using 5G or LTE](./connect-over-cellular.md)
