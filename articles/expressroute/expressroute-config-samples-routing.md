---
title: 'Azure ExpressRoute: Router configuration samples'
description: Use these interface and routing configuration samples for Cisco IOS-XE, Juniper MX series, and Arista routers as examples to work with Azure ExpressRoute.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 06/08/2026
ms.author: duau
ai-usage: ai-assisted

customer-intent: As a network engineer, I want to find router configuration samples for connecting my Cisco, Arista, or Juniper router to Azure ExpressRoute so that I can set up peering, BGP, and routing correctly.
---

# Router configuration samples

This article describes interface and routing configuration samples for Cisco IOS-XE, Juniper MX series, and Arista routers when working with Azure ExpressRoute.

> [!IMPORTANT]
> The samples in this article are for guidance only. Work with your vendor's sales/technical team and your networking team to find appropriate configurations to meet your needs. Microsoft doesn't support issues related to configurations listed on this page. Contact your device vendor for support issues.

## MTU and TCP MSS settings on router interfaces

The maximum transmission unit (MTU) for the ExpressRoute interface is 1500, which is the typical default MTU for an Ethernet interface on a router. Unless your router has a different MTU by default, there's no need to specify a value on the router interface.

Unlike an Azure VPN gateway, you don't need to specify the TCP maximum segment size (MSS) for an ExpressRoute circuit.

The router configuration samples in this article apply to all peerings. Review [ExpressRoute peerings](expressroute-circuit-peerings.md) and [ExpressRoute routing requirements](expressroute-routing.md) for more details on routing.

## Configure interfaces and subinterfaces

You need one subinterface per peering in every router that you connect to Microsoft. Identify a subinterface by a VLAN ID or a stacked pair of VLAN IDs and an IP address.

### [Cisco IOS-XE](#tab/cisco)

The samples in this section apply to any router running the IOS-XE OS family.

**Dot1Q interface definition**

This sample defines a subinterface with a single VLAN ID. The VLAN ID is unique per peering. The last octet of your IPv4 address is always an odd number.

```console
interface GigabitEthernet<Interface_Number>.<Number>
 encapsulation dot1Q <VLAN_ID>
 ip address <IPv4_Address><Subnet_Mask>
```

**QinQ interface definition**

This sample defines a subinterface with two VLAN IDs. The outer VLAN ID (s-tag), if used, remains the same across all peerings. The inner VLAN ID (c-tag) is unique per peering. The last octet of your IPv4 address is always an odd number.

```console
interface GigabitEthernet<Interface_Number>.<Number>
 encapsulation dot1Q <s-tag> second-dot1Q <c-tag>
 ip address <IPv4_Address><Subnet_Mask>
```

### [Arista](#tab/arista)

The samples in this section apply to any Arista router.

**Dot1Q interface definition**

This sample defines a subinterface with a single VLAN ID. The VLAN ID is unique per peering. The last octet of your IPv4 address is always an odd number.

```console
interface Ethernet<Interface_Number>.<Number>
 encapsulation dot1Q vlan <VLAN_ID>
 ip address <IPv4_Address>/<Subnet_Mask_Length>
```

**QinQ interface definition**

This sample defines a subinterface with two VLAN IDs. The outer VLAN ID (s-tag), if used, remains the same across all peerings. The inner VLAN ID (c-tag) is unique per peering. The last octet of your IPv4 address is always an odd number.

```console
interface Ethernet<Interface_Number>.<Number>
 encapsulation dot1Q vlan <s-tag> inner <c-tag>
 ip address <IPv4_Address>/<Subnet_Mask_Length>
```

### [Juniper MX](#tab/juniper)

The samples in this section apply to any Juniper MX series router.

**Dot1Q interface definition**

This sample defines a subinterface with a single VLAN ID. The VLAN ID is unique per peering. The last octet of your IPv4 address is always an odd number.

```console
        interfaces {
                vlan-tagging;
                <Interface_Number> {
                        unit <Number> {
                                vlan-id <VLAN_ID>;
                                family inet {
                                        address <IPv4_Address/Subnet_Mask>;
                                }
                        }
                }
        }
```

**QinQ interface definition**

This sample defines a subinterface with two VLAN IDs. The outer VLAN ID (s-tag), if used, remains the same across all peerings. The inner VLAN ID (c-tag) is unique per peering. The last octet of your IPv4 address is always an odd number.

```console
        interfaces {
                <Interface_Number> {
                        flexible-vlan-tagging;
                        unit <Number> {
                                vlan-tags outer <S-tag> inner <C-tag>;
                                family inet {
                                        address <IPv4_Address/Subnet_Mask>;
                                }
                        }
                }
        }
```

---

## Set up eBGP sessions

You must set up a BGP session with Microsoft for every peering. Set up a BGP session by using the following sample. If the IPv4 address that you use for your subinterface is a.b.c.d, then the IP address of the BGP neighbor (Microsoft) is a.b.c.d+1. The last octet of the BGP neighbor's IPv4 address is always an even number.

### [Cisco IOS-XE](#tab/cisco)

```console
router bgp <Customer_ASN>
 bgp log-neighbor-changes
 neighbor <IP#2_used_by_Azure> remote-as 12076
 !
 address-family ipv4
 neighbor <IP#2_used_by_Azure> activate
 exit-address-family
!
```

### [Arista](#tab/arista)

```console
router bgp <Customer_ASN>
 neighbor <IP#2_used_by_Azure> remote-as 12076
 !
 address-family ipv4
  neighbor <IP#2_used_by_Azure> activate
!
```

### [Juniper MX](#tab/juniper)

```console
        routing-options {
                autonomous-system <Customer_ASN>;
        }
        protocols {
                bgp {
                        group <Group_Name> {
                                peer-as 12076;
                                neighbor <IP#2_used_by_Azure>;
                        }
                }
        }
```

---

## Set up prefixes to be advertised over the BGP session

Configure your router to advertise select prefixes to Microsoft by using the following sample.

### [Cisco IOS-XE](#tab/cisco)

```console
router bgp <Customer_ASN>
 bgp log-neighbor-changes
 neighbor <IP#2_used_by_Azure> remote-as 12076
 !
 address-family ipv4
    network <Prefix_to_be_advertised> mask <Subnet_mask>
    neighbor <IP#2_used_by_Azure> activate
 exit-address-family
!
```

### [Arista](#tab/arista)

```console
router bgp <Customer_ASN>
 neighbor <IP#2_used_by_Azure> remote-as 12076
 !
 address-family ipv4
  network <Prefix_to_be_advertised>/<Subnet_mask_length>
  neighbor <IP#2_used_by_Azure> activate
!
```

### [Juniper MX](#tab/juniper)

```console
        policy-options {
                policy-statement <Policy_Name> {
                        term 1 {
                                from protocol OSPF;
                                route-filter;
                                <Prefix_to_be_advertised/Subnet_Mask> exact;
                                then {
                                        accept;
                                }
                        }
                }
        }
        protocols {
                bgp {
                        group <Group_Name> {
                                export <Policy_Name>;
                                peer-as 12076;
                                neighbor <IP#2_used_by_Azure>;
                        }
                }
        }
```

---

## Route maps

Use route maps and prefix lists to filter prefixes propagated into your network. See the following sample, and ensure that you have the appropriate prefix lists set up.

### [Cisco IOS-XE](#tab/cisco)

```console
router bgp <Customer_ASN>
 bgp log-neighbor-changes
 neighbor <IP#2_used_by_Azure> remote-as 12076
 !
 address-family ipv4
    network <Prefix_to_be_advertised> mask <Subnet_mask>
    neighbor <IP#2_used_by_Azure> activate
    neighbor <IP#2_used_by_Azure> route-map <MS_Prefixes_Inbound> in
 exit-address-family
!
route-map <MS_Prefixes_Inbound> permit 10
 match ip address prefix-list <MS_Prefixes>
!
```

### [Arista](#tab/arista)

```console
router bgp <Customer_ASN>
 neighbor <IP#2_used_by_Azure> remote-as 12076
 !
 address-family ipv4
  network <Prefix_to_be_advertised>/<Subnet_mask_length>
  neighbor <IP#2_used_by_Azure> activate
  neighbor <IP#2_used_by_Azure> route-map <MS_Prefixes_Inbound> in
!
route-map <MS_Prefixes_Inbound> permit 10
 match ip address prefix-list <MS_Prefixes>
!
```

### [Juniper MX](#tab/juniper)

```console
        policy-options {
                prefix-list MS_Prefixes {
                        <IP_Prefix_1/Subnet_Mask>;
                        <IP_Prefix_2/Subnet_Mask>;
                }
                policy-statement <MS_Prefixes_Inbound> {
                        term 1 {
                                from {
                                        prefix-list MS_Prefixes;
                                }
                                then {
                                        accept;
                                }
                        }
                }
        }
        protocols {
                bgp {
                        group <Group_Name> {
                                export <Policy_Name>;
                                import <MS_Prefixes_Inbound>;
                                peer-as 12076;
                                neighbor <IP#2_used_by_Azure>;
                        }
                }
        }
```

---

## Configure BFD

### [Cisco IOS-XE](#tab/cisco)

You configure BFD in two places: one at the interface level and another at BGP level. This example uses the QinQ interface.

```console
interface GigabitEthernet<Interface_Number>.<Number>
 bfd interval 300 min_rx 300 multiplier 3
 encapsulation dot1Q <s-tag> second-dot1Q <c-tag>
 ip address <IPv4_Address><Subnet_Mask>

router bgp <Customer_ASN>
 bgp log-neighbor-changes
 neighbor <IP#2_used_by_Azure> remote-as 12076
 !
 address-family ipv4
    neighbor <IP#2_used_by_Azure> activate
    neighbor <IP#2_used_by_Azure> fall-over bfd
 exit-address-family
!
```

### [Arista](#tab/arista)

You configure BFD in two places: one at the interface level and another at BGP level. This example uses the QinQ interface.

```console
interface Ethernet<Interface_Number>.<Number>
 bfd interval 300 min-rx 300 multiplier 3
 encapsulation dot1Q vlan <s-tag> inner <c-tag>
 ip address <IPv4_Address>/<Subnet_Mask_Length>

router bgp <Customer_ASN>
 neighbor <IP#2_used_by_Azure> remote-as 12076
 !
 address-family ipv4
  network <Prefix_to_be_advertised>/<Subnet_mask_length>
  neighbor <IP#2_used_by_Azure> activate
  neighbor <IP#2_used_by_Azure> bfd
!
```

### [Juniper MX](#tab/juniper)

Configure BFD under the protocol BGP section only.

```console
        protocols {
                bgp {
                        group <Group_Name> {
                                peer-as 12076;
                                neighbor <IP#2_used_by_Azure>;
                                bfd-liveness-detection {
                                        minimum-interval 300;
                                        multiplier 3;
                                }
                        }
                }
        }
```

---

## Configure MACSec

For MACSec configuration, Connectivity Association Key (CAK) and Connectivity Association Key Name (CKN) must match with configured values via PowerShell commands.

### [Cisco IOS-XE](#tab/cisco)

This article doesn't include a MACSec sample for Cisco IOS-XE. See your Cisco documentation for MACSec configuration on IOS-XE routers.

### [Arista](#tab/arista)

```console
mac security
   profile <Profile_Name>
      cipher <Cipher_Name E.g. aes256-gcm>
      key <Connectivity_Association_Key_Name> 7 <Connectivity_Association_Key>
      key derivation padding append
      sci
   !
!
interface Ethernet<Interface_Number>
   mac security profile <Profile_Name>
```

### [Juniper MX](#tab/juniper)

```console
        security {
                macsec {
                        connectivity-association <Connectivity_Association_Name> {
                                cipher-suite gcm-aes-xpn-128;
                                security-mode static-cak;
                                pre-shared-key {
                                        ckn <Connectivity_Association_Key_Name>;
                                        cak <Connectivity_Association_Key>; ## SECRET-DATA
                                }
                        }
                        interfaces {
                                <Interface_Number> {
                                        connectivity-association <Connectivity_Association_Name>;
                                }
                        }
                }
        }
```

---

## Next steps

- [ExpressRoute prerequisites and checklist](expressroute-prerequisites.md)
- [Configure peering for an ExpressRoute circuit](expressroute-howto-routing-portal-resource-manager.md)
- [Configure MACsec on ExpressRoute Direct ports](expressroute-howto-macsec.md)
- [ExpressRoute FAQ](expressroute-faqs.md)



