---
title: Connect Azure Percept over 5G or LTE with USB modem Quectel RM500
description: This article explains how to connect the Azure Percept DK over 5G or LTE networks using Quectel USB modem.
author: juhaluoto
ms.author: amiyouss
ms.service: azure-percept
ms.topic: how-to 
ms.date: 09/03/2021
ms.custom: template-how-to
---
# Connect Azure Percept over 5G or LTE with USB modem Quectel 5G RM500-GL 

Here are steps on how to connect your Azure Percept using Quectel RM500-GL 5G modem. You can contact Quectel local sales team for more details on this 5G modem developer kit:

northamerica-sales@quectel.com – for NA customers

sales@quectel.com – for global customers

> [!Note] 
> about 5G modems and USB cables
> This is applicable only for 5G modems. 5G modems require more power than LTE modems. Also the USB cable can become a bottleneck for best possible 5G data rates. In order to supply enough and consistent power to a 5G modem, you should make sure the USB cable is not too long and can withstand at least 3A current. For maximum throughput, you should use USB 3.1 Gen2 cables and make sure there is a USB-IF logo stating the certification. So as a summary: 
> **For Power:**
> - Max amperage should be equal or greater than 3 Amp
> - Less than 1 m long
> - When using 5G modems, only one USB A port on Azure Percept DK should be active
>  
> **For throughput:**
> - USB 3.1 Gen2
> - USB-IF certified

## Preparation
Make sure you have done the Azure Percept preparations from here [Connecting using USB modem](./connect-over-cellular-usb.md) and that you have noted the comments on USB cables that should be used. 

### Preparation of the modem
In order to get started, we need the modem to be in MBIM mode. An undocumented but standard Quectel AT command can be used for this: `AT+QCFG="usbnet"`.

The `usbnet` property can be set to four different values, from `0` to `3`:
- `0` for **NDIS / PPP / QMI mode** (supported by `qmi_wwan` driver, enabled with `CONFIG_USB_NET_QMI_WWAN=y|m`)
- `1` for **CDC Ethernet mode** (supported in Linux when `CONFIG_USB_NET_CDCETHER=y|m`)
- `2` for **MBIM mode** (supported in Linux when `CONFIG_USB_NET_CDC_MBIM=y|m`)
- `3` for **RNDIS mode**

Easiest way to configure the mode is to connect the Quectel 5G modem to a PC and use terminal SW like TeraTerm or Quectel's own PC software like QCOM. Using Windows Device Manager you can see what USB port is assigned for AT commands and use that. The COM port settings should be:
Baudrate: 115200
StopBits: 1
Parity: None
ByteSize: 8
Flow Control: No ctrl flow

And here are the AT commands:
To check which USB mode Quectel device is:
```
AT+QCFG="usbnet"
```
Change to mode 2:
```
AT+QCFG="usbnet",2
```
And if you check again using first at command you should get: "+QCFG: "usbnet",2"

Once you have set the correct USB mode, you should issue hardware reset with:
```
AT+CFUN=1,1
```
At this point, the modem should disconnect and later reconnect to the USB port.


## Using the modem to connect

**1. Put a SIM card in the Quectel modem**

**2. Plug the Quectel modem to Azure Percept USB port. Remember to use a proper USB cable!**

**3. Power-up Azure Percept**

**4. Ensure ModemManager is running**

```
systemctl status ModemManager
```
You should get something like this:
```
* ModemManager.service - Modem Manager
   Loaded: loaded (/lib/systemd/system/ModemManager.service; enabled; vendor pre set: enabled)
   Active: active (running) since Mon 2021-08-09 20:52:03 UTC; 23s ago
[...]
```
If not, then you should make sure you have flashed the correct image to your Azure Percept (5G enabled).

**5. List active modems**

When you list the modems, you should see that the Quectel modem has been recognized and is now handled by ModemManager.
```
mmcli --list-modems
```
And you get something like this:
```
 /org/freedesktop/ModemManager1/Modem/0 [Quectel] RM500Q-GL
```
The modem ID is here `0`, which is used in the following commands to address it (that is: `--modem 0`.)

**6. Get modem details**

By default, the modem is disabled (`Status -> state: disabled`), see status:
```
mmcli --modem 0
```
And you should get something like this:
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

**7. Enable the modem**

Prior to establish a connection, we need to turn ON the modem's radio(s).
```
mmcli --modem 0 --enable
```
And you should get this:
```
successfully enabled the modem
```
After some time, the modem should be registering to a cell tower and you should see in the modem status: `Status -> state: registered`. You can check this again using:
```
mmcli --modem 0
```

**8. Connect using the APN information**

Usually, the modems will provide which APN to use (see `3GPP EPS -> initial bearer APN` information) so you can use it to establish a connection. Otherwise, consult with your cell phone provider for the APN to use. Here is the ModemManager command to connect using, for example,  Verizon APN `APN=vzwinternet`
```
mmcli --modem 0 --simple-connect="apn=vzwinternet"
```
And again you should get this:
```
successfully connected the modem
```

**9. Get the modem status**

Now, you should see `Status -> state: connected` and a new `Bearer` category at the end of the status message.
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

**10. Get the bearer details**

The bearer resulting from the above `--simple-connect` is here at path: `/org/freedesktop/ModemManager1/Bearer/1`.
This is the one we are querying the modem information about the active connection. The initial bearer is not attached to an active connection and will thus not hold any IP information.
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
Some details about:
- `Status -> interface: wwan0` - list which Linux network interface matches this modem.
- `IPv4 configuration` - provides the IP configuration for the above interface to set for it to be usable.

**11. Check modem network interface status**

The network interface should be `DOWN` by default.
```
ip link show dev wwan0
```
Results in:
```
4: wwan0: <BROADCAST,MULTICAST,NOARP> mtu 1500 qdisc noop state DOWN mode DEFAULT group default qlen 1000
    link/ether ce:92:c2:b8:1e:f2 brd ff:ff:ff:ff:ff:ff
```

**12. Bring up the interface**

```
sudo ip link set dev wwan0 up
```

**13. Check IP information**

You should see the interface as `UP,LOWER_UP` with no IP information by default.
```
sudo ip address show dev wwan0
```
```
4: wwan0: <BROADCAST,MULTICAST,NOARP,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UNKNOWN group default qlen 1000
    link/ether ce:92:c2:b8:1e:f2 brd ff:ff:ff:ff:ff:ff
    inet6 fe80::cc92:c2ff:feb8:1ef2/64 scope link 
       valid_lft forever preferred_lft forever
```

**14. Issue a DHCP request**

This is a feature specific, but not limited to, the Quectel module. Usually the IP information is to be set manually to the interface or through a network manager daemon supporting ModemManager (for example, NetworkManager.), but here we can simply use the dhclient on the Quectel modem:
```
sudo dhclient wwan0
```

**15. Check IP information**

The IP configuration for this interface should match the ModemManager bearer details.
```
sudo ip address show dev wwan0
```
And results:
```
4: wwan0: <BROADCAST,MULTICAST,NOARP,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UNKNOWN group default qlen 1000
    link/ether ce:92:c2:b8:1e:f2 brd ff:ff:ff:ff:ff:ff
    inet 25.21.113.165/30 brd 25.21.113.167 scope global wwan0
       valid_lft forever preferred_lft forever
    inet6 fe80::cc92:c2ff:feb8:1ef2/64 scope link 
       valid_lft forever preferred_lft forever
```

**16. Check interface routes**

Notice the DHCP client also set a default route for packets to go through the `wwan0` interface.
```
ip route show dev wwan0
```
like this:
```
default via 25.21.113.166 
25.21.113.164/30 proto kernel scope link src 25.21.113.165
```
So now you have established a connection to Azure using the Quectel Modem!


**17. Test connectivity**

We execute a `ping` request through the `wwan0` interface.
```
ping -I wwan0 8.8.8.8
```
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
See [Connect using USB modem](./connect-over-cellular-usb.md).

## Next steps
[Connect using USB modem](./connect-over-cellular-usb.md).

Back to the main article on 5G or LTE:

[Connect using 5G or LTE](./connect-over-cellular.md).  