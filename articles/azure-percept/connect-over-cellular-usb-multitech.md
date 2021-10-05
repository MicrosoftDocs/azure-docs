---
title: Connect Azure Percept over LTE with USB modem MultiTech Multiconnect
description: This article explains how to connect the Azure Percept DK over 5G or LTE networks using MultiTech USB modem.
author: juhaluoto
ms.author: amiyouss
ms.service: azure-percept
ms.topic: how-to 
ms.date: 09/23/2021
ms.custom: template-how-to
---

# Connect Azure Percept over LTE with USB modem MultiTech Multiconnect 
Here are steps how to connect your Azure Percept using MultiTech Multiconnect (MTCM-LNA3-B03) USB modem. 

> [!Note]
> There are several models and we used LNA3 that works at least with Verizon and Vodafone SIM cards. We were not able to connect to an AT&T network, but we are investigating that and will modify this if we find the root cause. More info on this particular modem HW can be found following this page: https://www.multitech.com/brands/multiconnect-microcell

## Preparation
Make sure you have done the Azure Percept preparations from here [Connecting using USB modem](./connect-over-cellular-usb.md) and that you have noted the comments on USB cables that should be used. 

### Preparation of the modem
In order to get started, we need the modem to be in MBIM mode. How to do it, can be found from AT command reference guide here:
https://www.telit.com/wp-content/uploads/2018/01/Telit-LE910-V2-Modules-AT-Commands-Reference-Guide-r3.pdf

We use AT command `AT#USBCFG=<mode>` to configure the right USB mode to enable MBIM interface.

The AT command reference guide lists all possible modes, but we are interested in mode `3`, the default is `0`.

Easiest way to configure the mode is to connect the MultiTech modem to a PC and use terminal SW like TeraTerm or Putty PC software. Using Windows Device Manager you can see what USB port is assigned for the modem, you might need to test which one is responding to AT commands, if there are several. The COM port settings should be:
Baudrate: 9600 (or 115200)
StopBits: 1
Parity: None
ByteSize: 8
Flow Control: No ctrl flow

And here are the AT commands:
To check which USB mode MultiTech device is currently:
```
AT#USBCFG?
```
Change to mode 3:
```
AT#USBCFG=3
```
And if you check again using first at command you should get: `#USBCFG: 3`

Once you have set the correct USB mode, you should issue a reset with:
```
AT#REBOOT
```
At this point, the modem should disconnect and later reconnect to the USB port using the above set mode.

## Using the modem to connect
Make sure you have done the Azure Percept preparations from here [Connecting using USB modem](./connect-over-cellular-usb.md).   

**1. Plug a SIM card in the MultiTech modem**

**2. Plug the MultiTech modem into the Azure Percept USB A port**

**3. Power-up Azure Percept**

**4. SSH into the Azure Percept DK**

**5. Ensure ModemManager is running**

Write the following command to your SSH prompt:
```
systemctl status ModemManager
```
If all is ok you will get something like this:

*ModemManager.service - Modem Manager*
*Loaded: loaded (/lib/systemd/system/ModemManager.service; enabled; vendor preset: enabled)*
*Active: active (running) since Mon 2021-08-09 20:52:03 UTC; 23 s ago*

**6. List active modems**

You should see in this case that the FIH7160 model has been recognized by ModemManager.
```
mmcli --list-modems
```
And you will get something like this:
  */org/freedesktop/ModemManager1/Modem/0 [Telit] FIH7160*

**7. Get modem details**

The modem ID is here `0`, which could be different in your case. Modem ID (`--modem 0`.) is used in the ModemManager commands like this
```
mmcli --modem 0
```
By default, the modem is disabled (`Status -> state: disabled`)
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

**8. Enable the modem**

Prior to establishing a connection, we need to turn ON the modem's radio(s).
```
mmcli --modem 0 --enable
```
And you should get a respond like this: *successfully enabled the modem*

After some time, the modem should be registering to a cell tower and you should see in the modem status: `Status -> state: registered`, if you run again:
```
mmcli --modem 0
```

**9. Connect using the APN information**

Access Point Name=APN is provided by your cell phone provider, like here for Verizon:
```
mmcli --modem 0 --simple-connect="apn=vzwinternet"  
```
and if all ok you will get *successfully connected the modem*

**10. Get the modem status**

You should see `Status -> state: connected` now and a new `Bearer` category at the end of the status message.
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

**11. Get the bearer details**

Bearer details are needed to connect the OS to the packet data connection that the Modem has now established with the cellular network. So at this point the Modem has IP connection, but OS is not yet configured to use it.
```
mmcli --bearer 0
```
Bearer details listed:
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

**12. Bring up the network interface**

```
sudo ip link set dev wwan0 up
```

**13. Configure the network interface**

Using the information provided by the bearer, replace the IP address (here 100.112.107.46/24) with the one your bearer has:
```
sudo ip address add 100.112.107.46/24 dev wwan0
```

**14. Check IP information**

The IP configuration for this interface should match the ModemManager bearer details.
```
sudo ip address show dev wwan0
```
and see that your bearer IP is listed below:
```
6: wwan0: <BROADCAST,MULTICAST,NOARP,UP,LOWER_UP> mtu 1428 qdisc pfifo_fast state UNKNOWN group default qlen 1000
    link/ether 1e:fb:08:e9:2a:25 brd ff:ff:ff:ff:ff:ff
    inet 100.112.107.46/24 scope global wwan0
       valid_lft forever preferred_lft forever
    inet6 fe80::1cfb:8ff:fee9:2a25/64 scope link
       valid_lft forever preferred_lft forever
```

**15. Setting the default route**

Using the information provided by the bearer again and use the modem's gateway (replace 100.112.107.1) as default destination for network packets:
```
sudo ip route add default via 100.112.107.1 dev wwan0
```
And now your Azure Percept has connection that uses the USB modem!

**16. Test connectivity**

We execute a `ping` request through the `wwan0` interface. But you can also use Azure Percept Studio and check if telemetry messages come (make sure you do not have ethernet cable or Wi-Fi enabled so that you are sure to use LTE)
```
ping -I wwan0 8.8.8.8
```
and you should get
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
In general, see [Connect using USB modem](./connect-over-cellular-usb.md).

## Next steps
[Connect using USB modem](./connect-over-cellular-usb.md).

Back to the main article on 5G or LTE:

[Connect using 5G or LTE](./connect-over-cellular.md).
   

