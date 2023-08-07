---
author: aybatra
ms.author: aybatra
ms.date: 03/08/2023
ms.service: vpn-gateway
ms.topic: include
---

| Tunnel Type | Authentication Mechanism
| --- | --- |
| OpenVPN | Any subset of Azure AD, Radius Auth and Azure Certificate | 
| SSTP | Radius Auth/ Azure Certificate |
| IKEv2 | Radius Auth/ Azure Certificate |
| IKEv2 and OpenVPN | Radius Auth/ Azure Certificate/ Azure AD and Radius Auth/ Azure AD and Azure Certificate|
| IKEv2 and SSTP | Radius Auth/ Azure Certificate |