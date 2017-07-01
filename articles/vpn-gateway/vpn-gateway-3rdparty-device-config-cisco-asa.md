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
| On-premises VPN device IP    | On-prem device public IP     |
| *VNet BGP ASN                | 65010                        |
| *Azure BGP peer IP           | 10.12.255.30                 |
| *On-premises BGP ASN         | 65050                        |
| *On-premises BGP peer IP     | 10.52.255.254                |
|                              |                              |

* (*) Optional parameters for BGP only.

### IPsec/IKE policy & parameters

The table below lists the IPsec/IKE algorithms and parameters used in the sample. Please consult your VPN device specifications to make sure all algorithms listed above are supported by your VPN device models and firmware versions.

| **IPsec/IKEv2**  | **Value**                            |
| ---              | ---                                  |
| IKEv2 Encryption | AES256                               |
| IKEv2 Integrity  | SHA384                               |
| DH Group         | DHGroup24                            |
| IPsec Encryption | AES256                               |
| IPsec Integrity  | SHA1                                 |
| PFS Group        | PFS24                                |
| QM SA Lifetime   | 7200 seconds                         |
| Traffic Selector | UsePolicyBasedTrafficSelectors $True |
| Pre-Shared Key   | PreSharedKey                         |
|                  |                                      |

- (*) On some device, IPsec integrity must be "null" if GCM-AES is used as IPsec encryption algorithm.

### Device notes

>[!NOTE]
>
> 1. IKEv2 support requires ASA version 8.4 and above.
> 2. Higher DH and PFS group support (beyond Group 5) requires ASA version 9.x.
> 3. IPsec encryption with AES-GCM and IPsec integrity with SHA-256, SHA-384, SHA-512 support requires ASA version 9.x on newer ASA hardware; ASA 5505, 5501, 5520, 5540, 5550, 5580 are **not** supported.
>


### Sample device configurations
The script below provides a sample configuration based on the topology and parameters listed above. The S2S VPN tunnel configuration consists of the following parts:

1. Interfaces & routes
2. Access lists
3. IKE policy and parameters (Phase 1 or Main Mode)
4. IPsec policy and parameters (Phase 2 or Quick Mode)
5. Other parameters (TCP MSS clamping, etc.)

>[!IMPORTANT] Please make sure you complete the additional configuration listed below and replace the placeholders with the actual values:
> 
> - Interface configuration for both inside and outside interfaces
> - Routes for your inside/private and outside/public networks
> - Ensure all names and policy numbers are unique on the device
> - Ensure the cryptographic algorithms are supported on your device
> - Replace the following place holders with the actual values
>   - Outside interface name: "outside"
>   - Azure Gateway Public IP
>   - OnRrem Device Public IP
>   - IKE Pre-Shared Key
>   - VNet and local network gateway names
>   - VNet and on-premises network address prefixes
>   - Proper netmasks

#### Sample configuration

```
! Sample ASA configuration for connecting to Azure VPN gateway
!
! Tested hardware: ASA 5505
! Tested version:  ASA version 9.2(4)
!
! Replace the following place holders with your actual values:
!   - Interface names - default are "outside" and "inside"
!   - <Azure_Gateway_Public_IP>
!   - <OnPrem_Device_Public_IP>
!   - <Pre_Shared_Key>
!   - <VNetName>*
!   - <LNGName>* ==> LocalNetworkGateway - the Azure resource that represents the
!     on-premises network, specifies network prefixes, device public IP, BGP info, etc.
!   - <PrivateIPAddress> ==> Replace it with a private IP address if applicable
!   - <Netmask> ==> Replace it with appropriate netmasks
!   - <Nexthop> ==> Replace it with the actual nexthop IP address
!
! (*) Must be unique names in the configuration
!
! ==> Interface & route configurations
!
!     > <OnPrem_Device_Public_IP> address on the outside interface or vlan
!     > <PrivateIPAddress> on the inside interface or vlan; e.g., 10.51.0.1/24
!     > Route to connect to <Azure_Gateway_Public_IP> address
!
!     > Example
!
!       interface Ethernet0/0
!        switchport access vlan 2
!       exit
!
!       interface vlan 1
!        nameif inside
!        security-level 100
!        ip address <PrivateIPAddress> <Netmask>
!       exit
!
!       interface vlan 2
!        nameif outside
!        security-level 0
!        ip address <OnPrem_Device_Public_IP> <Netmask>
!       exit
!
!       route outside 0.0.0.0 0.0.0.0 <NextHop IP> 1
!
! ==> Access lists
!
!     > Most firewall devices deny all traffic by default. Create access lists to
!       (1) Allow S2S VPN tunnels between the ASA and the Azure gateway public IP address
!       (2) Construct traffic selectors as part of IPsec policy or proposal
!
access-list outside_access_in extended permit ip host <Azure_Gateway_Public_IP> host <OnPrem_Device_Public_IP>
!
!     > Object group that consists of all VNet prefixes (e.g., 10.11.0.0/16 &
!       10.12.0.0/16)
!
object-group network Azure-<VNetName>
 description Azure virtual network <VNetName> prefixes
 network-object 10.11.0.0 255.255.0.0
 network-object 10.12.0.0 255.255.0.0
exit
!
!     > Object group that corresponding to the <LNGName> prefixes.
!       E.g., 10.51.0.0/16 and 10.52.0.0/16. Note that LNG = "local network gateway".
!       In Azure network resource, a local network gateway defines the on-premises
!       network properties (address prefixes, VPN device IP, BGP ASN, etc.)
!
object-group network <LNGName>
 description On-Premises network <LNGName> prefixes
 network-object 10.51.0.0 255.255.0.0
 network-object 10.52.0.0 255.255.0.0
exit
!
!     > Specify the access-list between the Azure VNet and your on-premises network.
!       This access list defines the IPsec SA traffic selectors.
!
access-list Azure-<VNetName>-acl extended permit ip object-group <LNGName> object-group Azure-<VNetName>
!
!     > No NAT required between the on-premises network and Azure VNet
!
nat (inside,outside) source static <LNGName> <LNGName> destination static Azure-<VNetName> Azure-<VNetName>
!
! ==> IKEv2 configuration
!
!     > General IKEv2 configuration - enable IKEv2 for VPN
!
group-policy DfltGrpPolicy attributes
 vpn-tunnel-protocol ikev1 ikev2
exit
!
crypto isakmp identity address
crypto ikev2 enable outside
!
!     > Define IKEv2 Phase 1/Main Mode policy
!       - Make sure the policy number is not used
!       - integrity and prf must be the same
!       - DH group 14 and above require ASA version 9.x.
!
crypto ikev2 policy 1
 encryption       aes-256
 integrity        sha384
 prf              sha384
 group            24
 lifetime seconds 86400
exit
!
!     > Set connection type and pre-shared key
!
tunnel-group <Azure_Gateway_Public_IP> type ipsec-l2l
tunnel-group <Azure_Gateway_Public_IP> ipsec-attributes
 ikev2 remote-authentication pre-shared-key <Pre_Shared_Key> 
 ikev2 local-authentication  pre-shared-key <Pre_Shared_Key> 
exit
!
! ==> IPsec configuration
!
!     > IKEv2 Phase 2/Quick Mode proposal
!       - AES-GCM and SHA-2 requires ASA version 9.x on newer ASA models. ASA
!         5505, 5510, 5520, 5540, 5550, 5580 are not supported.
!       - ESP integrity must be null if AES-GCM is configured as ESP encryption
!
crypto ipsec ikev2 ipsec-proposal AES-256
 protocol esp encryption aes-256
 protocol esp integrity  sha-1
exit
!
!     > Set access list & traffic selectors, PFS, IPsec protposal, SA lifetime
!       - This sample uses "Azure-<VNetName>-map" as the crypto map name
!       - ASA supports only one crypto map per interface, if you already have
!         an existing crypto map assigned to your outside interface, you must use
!         the same crypto map name, but with a different sequence number for
!         this policy
!       - "match address" policy uses the access-list "Azure-<VNetName>-acl" defined 
!         previously
!       - "ipsec-proposal" uses the proposal "AES-256" defined previously 
!       - PFS groups 14 and beyond requires ASA version 9.x.
!
crypto map Azure-<VNetName>-map 1 match address Azure-<VNetName>-acl
crypto map Azure-<VNetName>-map 1 set pfs group24
crypto map Azure-<VNetName>-map 1 set peer <Azure_Gateway_Public_IP>
crypto map Azure-<VNetName>-map 1 set ikev2 ipsec-proposal AES-256
crypto map Azure-<VNetName>-map 1 set security-association lifetime seconds 7200
crypto map Azure-<VNetName>-map interface outside
!
! ==> Set TCP MSS to 1350
!
sysopt connection tcpmss 1350
!
```

## Next steps
See [Configuring Active-Active VPN Gateways for Cross-Premises and VNet-to-VNet Connections](vpn-gateway-activeactive-rm-powershell.md) for steps to configure active-active cross-premises and VNet-to-VNet connections.

