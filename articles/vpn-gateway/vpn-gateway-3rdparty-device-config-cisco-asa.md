---
title: Sample configuration: Cisco ASA device | Microsoft Docs
description: This article provides a sample configuration for Cisco ASA device connecting to Azure VPN gateways.
services: vpn-gateway
documentationcenter: na
author: yushwang
manager: rossort
editor: ''
tags: ''

ms.assetid: a8bfc955-de49-4172-95ac-5257e262d7ea
ms.service: vpn-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/20/2017
ms.author: yushwang

---
# Sample configuration: Cisco ASA device (IKEv2/no BGP)
This article provides sample configurations for Cisco ASA devices connecting to Azure VPN gateways.

## Device at a glance

|                        |                                   |
| ---                    | ---                               |
| Device vendor          | Cisco                             |
| Device model           | ASA (Adaptive Security Appliance) |
| Target version         | 8.4+                              |
| Tested model           | ASA 5505                          |
| Tested version         | 9.2                               |
| IKE version            | **IKEv2**                         |
| BGP                    | **No**                            |
| Azure VPN gateway type | **Route-based** VPN gateway       |
|                        |                                   |

> [!NOTE]
> 1. The configuration below connects a Cisco ASA device to an Azure **route-based** VPN gateway using custom IPsec/IKE policy with "UserPolicyBasedTrafficSelectors" option, as described in [this article](vpn-gateway-connect-multiple-policybased-rm-ps.md).
> 2. It requires ASA devices to use **IKEv2** with access-list-based configurations, not VTI-based.
> 3. Please consult with your VPN device vendor specifications to ensure the policy is supported on your on-premises VPN devices.

## VPN device requirements
Azure VPN gateways use standard IPsec/IKE protocol suites for S2S VPN tunnels. Refer to [About VPN devices](vpn-gateway-about-vpn-devices.md) for the detailed IPsec/IKE protocol parameters and default cryptographic algorithms for Azure VPN gateways. You can optionally specify the exact combination of cryptographic algorithms and key strengths for a specific connection as described in [About cryptographic requirements](vpn-gateway-about-compliance-crypto.md). If you select a specific combination of cryptographic algorithms and key strengths, please make sure you use the corresponding specifications on your VPN devices.

## Single VPN tunnel
This topology consists of a single S2S VPN tunnel between an Azure VPN gateway and your on-premises VPN device. You can optionally configure BGP across the VPN tunnel.

![single tunnel](./media/vpn-gateway-3rdparty-device-config-cisco-asa/singletunnel.png)

Refer to [Single tunnel setup](vpn-gateway-3rdparty-device-config-overview.md#singletunnel) for detailed, step-by-step instructions to build the Azure configurations.

### Network and VPN gateway information
This section list the parameters for the this sample.

| **Parameter**                | **Value**                    |
| ---                          | ---                          |
| VNet address prefixes        | 10.11.0.0/16<br>10.12.0.0/16 |
| Azure VPN gateway IP         | Azure gateway public IP      |
| On-premises address prefixes | 10.51.0.0/16<br>10.52.0.0/16 |
| On-premises VPN device IP    | Device outside public IP     |
| *VNet BGP ASN                | 65010                        |
| *Azure BGP peer IP           | 10.12.255.30                 |
| *On-premises BGP ASN         | 65050                        |
| *On-premises BGP peer IP     | 10.52.255.254                |
|                              |                              |

* (*) Optional parameters for BGP only.

### IPsec/IKE policy & parameters

The table below lists the IPsec/IKE algorithms and parameters used in the following sample.

| **IPsec/IKEv2**  | **Value**                            |
| ---              | ---                                  |
| IKEv2 Encryption | AES256                               |
| IKEv2 Integrity  | SHA384                               |
| DH Group         | DHGroup24                            |
| IPsec Encryption | AES256                               |
| IPsec Integrity  | SHA256                               |
| PFS Group        | PFS24                                |
| QM SA Lifetime   | 7200 seconds                         |
| Traffic Selector | UsePolicyBasedTrafficSelectors $True |
| Pre-Shared Key   | Pre Shared Key                       |
|                  |                                      |

> [!IMPORTANT]
> Please consult your VPN device specifications to make sure all algorithms listed above are supported by your VPN device models and firmware versions.

### Sample device configurations
The script below provides a sample configuration based on the topology and parameters listed above. The S2S VPN tunnel configuration consists of the following parts:

1. Interfaces & routes
2. Access lists
3. IKE policy and parameters (Phase 1 or Main Mode)
4. IPsec policy and parameters (Phase 2 or Quick Mode)
5. Other parameters (TCP MSS clamping, etc.)


>[IMPORTANT] Please make sure you complete the additional configuration listed below and replace the placeholders with the actual values:
> 
> - Interface configuration for both inside and outside interfaces
> - Routes for your inside and outside networks
> - Ensure all names and policy numbers are unique on the device
> - Ensure the cryptographic algorithms are supported on your device
> - Replace the following place holders with the actual values
>   - Outside interface name: "outside"
>   - Azure gateway public IP
>   - Device outside public IP
>   - Pre Shared Key

```
! Sample ASA configuration for connecting to Azure VPN gateway
!
! Tested hardware: ASA5505
! Tested version:  ASA Version 9.2(4)
!
! ==> Interface & route configurations
!
!     > Device outside public IP address on the outside interface or vlan
!     > Private IP address(es) on the inside interface or vlan
!     > Route to connect to Azure gateway IP address
!
!     > Example
!
!       interface Ethernet0/0
!        switchport access vlan 2
!
!       interface vlan 1
!        nameif inside
!        security-level 100
!        ip address 10.51.0.1 255.255.255.0
!
!       interface vlan 2
!        nameif outside
!        security-level 0
!        ip address <Device outside public IP> <netmask>
!
!       route outside 0.0.0.0 0.0.0.0 <NextHop IP> 1
!
! ==> Access lists
!
!     > Most firewall devices deny all traffic by default. Create access lists for
!       (1) Allowing S2S VPN tunnels between the ASA and the Azure gateway IP addresses
!       (2) Constructing traffic selectors for the IPsec SA's
!
access-list outside_access_in extended permit ip host <Azure gateway public IP> host <Device outside public IP>
!
object-group network Azure-TestVNet1
 description Azure virtual network TestVNet1 prefixes
 network-object 10.11.0.0 255.255.0.0
 network-object 10.12.0.0 255.255.0.0
object-group network LNG-Site5
 description On-Premises network Site5 prefixes
 network-object 10.51.0.0/16
 network-object 10.52.0.0/16
!
access-list Azure-TestVNet1-ACL extended permit ip object-group LNG-Site5 object-group Azure-TestVNet1
!
!     > No NAT required between the on-premises network and Azure VNet
!
nat (inside,outside) source static LNG-Site5 LNG-Site5 destination static Azure-TestVNet1 Azure-TestVNet1
!
! ==> IKEv2 configuration
!
!     > General IKEv2 configuration
!
group-policy DfltGrpPolicy attributes
 vpn-tunnel-protocol ikev1 ikev2
!
crypto isakmp identity address
crypto ikev2 enable outside
!
!     > Define IKEv2 Phase 1/Main Mode policy
!
crypto ikev2 policy 1
 encryption       aes-256
 integrity        sha384
 prf              sha384
 group            24
 lifetime seconds 86400
!
!     > Set connection type and pre-shared key
!
tunnel-group <Azure gateway public IP> type ipsec-l2l
tunnel-group <Azure gateway public IP> ipsec-attributes
 ikev2 remote-authentication <Pre Shared Key> 
 ikev2 local-authentication  <Pre Shared Key> 
!
! ==> IPsec configuration
!
!     > IKEv2 Phase 2/Quick Mode proposal
!
crypto ipsec ikev2 ipsec-proposal AES256-SHA256
 protocol esp encryption aes-256
 protocol esp integrity  sha-256
!
!     > Set access list & traffic selectors, PFS, IPsec protposal, SA lifetime
!
crypto map outside-map 1 match address Azure-TestVNet1-ACL
crypto map outside-map 1 set pfs group24
crypto map outside-map 1 set peer <Azure VPN gateway IP>
crypto map outside-map 1 set ikev2 ipsec-proposal AES256-SHA256
crypto map outside-map 1 set security-association lifetime seconds 7200
crypto map outside-map interface outside
!
! ==> Set TCP MSS to 1350
!
sysopt connection tcpmss 1350
!
```

## Next steps
See [Configuring Active-Active VPN Gateways for Cross-Premises and VNet-to-VNet Connections](vpn-gateway-activeactive-rm-powershell.md) for steps to configure active-active cross-premises and VNet-to-VNet connections.

