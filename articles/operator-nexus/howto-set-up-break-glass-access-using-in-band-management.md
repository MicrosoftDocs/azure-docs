---
title: How to set up Break-Glass access using In-Band management in Azure Operator Nexus Network Fabric
description: Learn how to How to set up Break-Glass access using In-Band management 
author: sushantjrao
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 02/24/2025
ms.custom: template-how-to
---

# Break-Glass access using In-Band management

In the Nexus Network Fabric (NNF), there is an out-of-band management network where most Fabric devices are connected to management switches via management ports (Ma1). The only exceptions are the Terminal Server and Aggregation Management Switches.
To address the potential single point of failure posed by the management switch, Microsoft team has provided the In-band Management Break Glass Access feature. 

## In-Band management break glass access
The In-band management break glass access feature provides a backup mechanism for the operations team to access Arista devices in the event of a primary management path failure. This feature allows operators to SSH into Arista devices using the loopback IP over the control plane VLAN / In-band management VRF, ensuring continuity of device management.

### Primary and backup paths

•	**Primary path:** The default method for accessing Arista devices is via the MA1 interface, which is used for management operations under normal conditions.

•	**Backup path:** In cases where the primary path is unavailable, the break glass access allows operators to SSH to the device using the loopback IP over the control plane VLAN / In-band management VRF.

The in-band management path is applicable only to devices configured and participating in BGP, excluding management switches and Network Packet Brokers (NPB). NPB does not support routing, and it is recommended against creating complex workarounds to enable such capability. The in-band management path relies on BGP because it provides dynamic routing, redundancy and resilience, ensuring that management traffic can be reliably routed through the network.

To support in-band management, a new loopback interface (lo6) is created on network devices. The addresses of these loopback interfaces will be advertised to the Provider Edge (PE) via the INFRA-MGMT VRF from the Customer Edge (CE). Customer IP addresses will be advertised to the Top of Rack (ToR) switches from the CEs via the default VRF.

## Set up Break-Glass access using In-Band management

### Assign IPv4 and IPv6 addresses to loopback interfaces

On Customer Edge (CE) devices and Top of Rack (ToR) switches, assign IPv4 and IPv6 addresses to loopback interfaces.

Example configuration for CE:

```json
	interface Loopback6
 description "Inband Management"
 vrf INFRA-MGMT
 ip address 10.x.x.64/32
 ipv6 address fda0:d59c:df09:2::x/128
```

Example configuration for ToR:

```json
interface Loopback6
 description "Inband Management"
 ip address 10.x.x.66/32
 ipv6 address fda0:d59c:df09:2::x/128
 ```

 ### Update prefix-lists

Add loopback addresses to prefix-lists and create IPv6 prefix if not already created.

Example:

```json
ip prefix-list loopback
 seq 10 permit 10.XX.X.34/32
 seq 20 permit 10.XX.X.115/32
 seq 30 permit 10.XX.X.117/32
 seq 40 permit 10.XX.X.64/27 le 32
ipv6 prefix-list loopback_v6
 seq 10 permit fda0:d59c:df09:2::/64 eq 128
```


### Assign IPv6 addresses to CE-ToR interfaces

Configure Ethernet interfaces on CE and ToR devices.

Example for CE:

```json
interface Ethernet5/1
 description "AR-CE1(fab5-AR-CE1):Et9/1 to CR1-TOR1(fab5-CP1-TOR1)-Port23"
 mtu 9214
 no switchport
 ip address 10.x.x.1/31
 ipv6 address fda0:d59c:df09:c::x/127
```

Example for ToR:

```json
interface Ethernet23/1
 description "CR1-TOR1(fab5-CP1-TOR1):Et23/1 to AR-CE1(fab5-AR-CE1)-Port05"
 mtu 9214
 no switchport
 ip address 10.x.x.0/31
 ipv6 address fda0:d59c:df09:c::x/127
```

### Configure CE_TOR_UNDERLAY peer group

Enable auto-local-addr for the peer group.

Example:

```json
neighbor CE_TOR_UNDERLAY auto-local-addr
```

### Configure IPv6 address family in BGP

Activate the CE_TOR_UNDERLAY peer group under the IPv6 address family.

Example:

```json
address-family ipv6
 neighbor CE_TOR_UNDERLAY activate
```

### Update adv_loopback RCF

Include IPv6 prefix list in the adv_loopback function.

Example:

```json
router general
 control-functions
 code unit adv_loopback
 function adv_loopback() {
  @SEQ_10 {if prefix match prefix_list_v4 loopback {
   return true;
  }}
  @SEQ_20 {if prefix match prefix_list_v6 loopback_v6 {
   return true;
  }}
 }
 ```

### Redistribute under Global BGP

Redistribute connected and static routes using the adv_loopback route-map.

Example:

```json
router bgp 65000
 redistribute connected route-map adv_loopback
8.	Create SOO Community:
Example:
ip extcommunity-list aon-soo permit soo 100:100
9.	Create Route-Maps for Leaking Routes:
Create policies for leaking routes between default and INFRA-MGMT VRFs and assign SOO.
Example:
route-map leak_default_infra permit 10
 match ip address prefix-list loopback
 match source-protocol bgp
 set extcommunity extcommunity-list aon-soo
```

### Redistribute BGP leaked routes

Redistribute BGP leaked routes in default and INFRA_MGMT VRFs.

Example:

```json
router general
 vrf default
 leak routes source-vrf INFRA-MGMT subscribe-policy leak_infra_default
 vrf INFRA-MGMT
 leak routes source-vrf default subscribe-policy leak_default_infra
 ```

### Define Trusted Source IP prefixes

Define and use trusted source IP prefixes for both IPv4 and IPv6 to enhance security and management.

Example:

```json
ip prefix-list trusted_sources
 seq 10 permit 10.x.x.0/16
 seq 20 permit 192.x.x.0/16
ipv6 prefix-list trusted_sources_v6
 seq 10 permit fda0:d59c:df09::/48
```

> [!Note]
> For new deployments, provide a list of trusted IP prefixes or use default resources created by the system. <br> For existing deployments, ensure configurations are in place during upgrades and use PATCH operations to update the network Fabric.