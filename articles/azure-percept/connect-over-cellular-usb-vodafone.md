---
title: Connect Azure Percept over 5G or LTE with USB modem Vodafone
description: This article explains how to connect the Azure Percept DK over 5G or LTE networks using Vodafone USB modem.
author: juhaluoto
ms.author: amiyouss
ms.service: azure-percept
ms.topic: how-to 
ms.date: 09/23/2021
ms.custom: template-how-to
---

# Connect Azure Percept over LTE with USB modem Vodafone USB connect 4G
Here are steps how to connect your Azure Percept using Vodafone USB Connect 4G v2.
More info on this particular modem HW can be found from Vodafone following this page:
https://www.vodafone.com/business/iot/iot-devices/integrated-terminals

## Using the modem to connect
Make sure you have done the Azure Percept DK preparations from here [Connecting using USB modem](./connect-over-cellular-usb.md). No preparation for the USB modem itself needed.   

**1. Plug a SIM card in the Vodafone modem**

**2. Plug the Vodafone modem into the Azure Percept USB A port**

**3. Power-up Azure Percept**

**4. SSH into the Azure Percept DK**

**5. Ensure ModemManager is running**

Write the following command to your SSH prompt:
```
systemctl status ModemManager
```
If all is ok, you will get something like this:

*ModemManager.service - Modem Manager*
*Loaded: loaded (/lib/systemd/system/ModemManager.service; enabled; vendor preset: enabled)*
*Active: active (running) since Mon 2021-08-09 20:52:03 UTC; 23 s ago*

**6. List active modems**

Then let us check that ModemManager can recognize your modem.
```
mmcli --list-modems
```
And you will get something like this, where the modem ID is `0`, but it could be something else:

 */org/freedesktop/ModemManager1/Modem/0 [Alcatel] Mobilebroadband*

**7. Get modem details**

To get the modem status details, you can use the below command and modem ID `0`
```
mmcli --modem 0
```
By default, the modem is disabled (`Status -> state: disabled`)
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
We recommend starting with the default setting: `Modes: current: allowed: 2g, 3g, 4g; preferred: 2g`, which can be set, if not already using: `mmcli --modem 0 --set-allowed-modes='2g|3g|4g' --set-preferred-mode='2g'`.

**8. Enable the modem**

Prior to establish a connection, we need to turn ON the modem's radio(s).
```
mmcli --modem 0 --enable
```
And you should get a respond like this: *successfully enabled the modem*

After some time, the modem should be registering to a cell tower and you should see in the modem status: `Status -> state: registered`, if you run again:
```
mmcli --modem 0
```

**9. Connect using the APN information**

Access Point Name=APN is provided by your cell phone provider, like here for Vodafone:
```
mmcli --modem 0 --simple-connect="apn=internet4gd.gdsp"  
```
and if all ok you will get *successfully connected the modem*

**10. Get the modem status**

You should see `Status -> state: connected` now and a new `Bearer` category at the end of the status message.
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

**11. Get the bearer details**

Bearer details are needed to connect the OS to the packet data connection that the Modem has now established with the cellular network. So at this point the Modem has IP connection, but OS is not yet configured to use it.

```
mmcli --bearer 0
```
Bearer details listed:
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

**12. Bring up the network interface**

```
sudo ip link set dev wwan0 up
```

**13. Configure the network interface**

Using the information provided by the bearer details, replace the IP address (here 162.177.2.0/22) with the one your bearer has:
```
sudo ip address add 162.177.2.0/22 dev wwan0
```

**14. Check IP information**

The IP configuration for this interface should match the ModemManager bearer details.
```
sudo ip address show dev wwan0
```
and see that your bearer IP is listed below:
```
wwan0: <BROADCAST,MULTICAST,NOARP,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UNKNOWN group default qlen 1000
    link/ether c2:12:44:c4:27:3c brd ff:ff:ff:ff:ff:ff
    inet 162.177.2.0/22 scope global wwan0
       valid_lft forever preferred_lft forever
    inet6 fe80::c012:44ff:fec4:273c/64 scope link 
       valid_lft forever preferred_lft forever
```

**15. Setting the default route**

Using the information provided by the bearer again and use the modem's gateway (replace 162.177.2.1) as default destination for network packets:
```
sudo ip route add default via 162.177.2.1 dev wwan0
```
Now you should have enabled Azure Percept to connect to Azure using the LTE modem.


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
   
### Vodafone modem rules to mitigate enumeration issues

In order to prevent the modem to enumerate in a non-supported mode, we suggest using the below UDEV rules to have ModemManager ignore unwanted interfaces.

File to create: `/usr/lib/udev/rules.d/77-mm-vodafone-port-types.rules`, with content as:
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
Once installed, reload UDEV rules and restart ModemManager:
```
udevadm control -R
systemctl restart ModemManager
```
## Next steps
[Connect using USB modem](./connect-over-cellular-usb.md).

Back to the main article on 5G or LTE:

[Connect using 5G or LTE](./connect-over-cellular.md).
