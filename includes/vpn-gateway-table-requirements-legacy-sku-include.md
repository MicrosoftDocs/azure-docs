---
 title: Include file
 description: Include file
 services: vpn-gateway
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.topic: include
 ms.date: 08/06/2024
 ms.author: cherylmc
 ms.custom: include file
---
The following table lists the requirements for policy-based and route-based VPN gateways. This table applies to both the Azure Resource Manager and classic deployment models. For the classic model, policy-based VPN gateways are the same as static gateways, and route-based gateways are the same as dynamic gateways.

| Capability or feature | Policy-based Basic VPN Gateway | Route-based Basic VPN Gateway | Route-based Standard VPN Gateway | Route-based High Performance VPN Gateway |
| --- | --- | --- | --- | --- |
| Site-to-site (S2S) connectivity | Policy-based VPN configuration | Route-based VPN configuration | Route-based VPN configuration | Route-based VPN configuration |
| Point-to-site (P2S) connectivity | Not supported | Supported (can coexist with S2S) | Supported (can coexist with S2S) | Supported (can coexist with S2S) |
| Authentication method | Pre-shared key | Pre-shared key for S2S connectivity. Certificates for P2S connectivity. | Pre-shared key for S2S connectivity. Certificates for P2S connectivity. | Pre-shared key for S2S connectivity. Certificates for P2S connectivity. |
| Maximum number of S2S connections | 1 | 10 | 10 | 30 |
| Maximum number of P2S connections | Not supported | 128 | 128 | 128 |
| Active routing support (Border Gateway Protocol) | Not supported | Not supported | Supported | Supported |
