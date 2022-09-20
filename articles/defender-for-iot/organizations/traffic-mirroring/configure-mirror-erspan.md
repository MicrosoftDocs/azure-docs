---
title: Configure an encapsulated remote switched port analyzer (ERSPAN) - Sample - Microsoft Defender for IoT
description: This article describes traffic mirroring methods for OT monitoring with Microsoft Defender for IoT.
ms.date: 09/20/2022
ms.topic: how-to
---

# Configure an encapsulated remote switched port analyzer (ERSPAN)

ERSPAN transports mirrored traffic over an IP network. A source router encapsulates the traffic and sends it over the network. At the destination router, the packet is decapsulated and sent to the destination interface. 

An ERSPAN session consists of a source session, routable traffic encapsulated in generic routing encapsulation (GRE), as well as a destination session. ERSPAN source sessions and destination sessions are configured separately on different switches. 

Between the "source" switch and the "destination" switch, traffic is encapsulated in generic routing encapsulation (GRE) and can be routed over layer 3 networks.  

ERSPAN sources may include the following: 

Ethernet ports and port channels 

VLANs (all supported interfaces in the VLAN are ERSPAN sources). 

Fabric port channels  

Satellite ports and host interface port channels  

ERSPAN implementation depends on the equipment vendor 

## Configure ERSPAN

Newly installed Defender for IoT sensors have ERSPAN (GRE header stripping) disabled by default. Follow these steps to turn it on: 

Note: The sensor monitoring interface does not have an allocated IP address. When ERSPAN support is enabled for the sensor interface, GRE headers will be stripped from the monitored traffic. 

Enabling ERSPAN support requires setting up the erspan interfaces and enabling the rcdcap component: 

Login by SSH  

Edit interfaces in network.properties 

sudo nano /var/cyberx/properties/network.properties 

 

Edit monitor_erspan_interfaces=<interfaces you want to monitor with this feature> 
(No need to run interfaces-apply after this step) 

Run - sudo cyberx-xsense-components-enable -n "rcdcap" 

All passive traffic dissectors will restart. 

Verifying your configuration 

In ifconfig you will see a new interface with erspan. 

This renames and clones the original interface. The empty one shown is empty. 

Example configuration (Cisco Switch) 

Note: Use your receiving router as the GRE tunnel's destination and mirror the input interface to your D4IoT sensor's monitor interface. 

## Sample configuration on a Cisco switch

```cli
monitor session 1 type erspan-source 
description ERSPAN to D4IoT 
erspan-id 32                              # required, # between 1-1023 
vrf default                               # required 
destination ip 172.1.2.3                  # IP address of destination 
source interface port-channel1 both       # Port(s) to be sniffed 
filter vlan 1                             # limit VLAN(s) (optional) 
no shut                                   # enable 

monitor erspan origin ip-address 172.1.2.1 global 
```

## Next steps