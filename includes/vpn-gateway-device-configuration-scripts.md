---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 01/09/2019
 ms.author: cherylmc
 ms.custom: include file
---
| **Vendor** | **Device family** | **Firmware version** |
| --- | --- | --- |
|Cisco | ISR| IOS 15.1 (Preview)|
|Cisco | ASA | ASA ( * ) RouteBased (IKEv2- No BGP) for ASA below 9.8 |
|Cisco | ASA | ASA RouteBased (IKEv2 - No BGP) for ASA 9.8+ |
|Juniper | SRX_GA | 12.x|
|Juniper | SSG_GA | ScreenOS 6.2.x|
|Juniper | JSeries_GA | JunOS 12.x|
|Juniper | SRX | JunOS 12.x RouteBased BGP |
|Ubiquiti| EdgeRouter| EdgeOS v1.10x RouteBased VTI|
|Ubiquiti| EdgeRouter| EdgeOS v1.10x RouteBased BGP|

> [!NOTE]
> ( * ) Required: NarrowAzureTrafficSelectors (enable UsePolicyBasedTrafficSelectors option) and CustomAzurePolicies (IKE/IPsec)
>
