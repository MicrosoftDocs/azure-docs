---
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: include
ms.date: 10/09/2023
---

SIP trunks between your network and Azure Communications Gateway are multitenant, meaning that traffic from all your customers shares the same trunk. By default, traffic sent from the Azure Communications Gateway contains an X-MS-TenantID header. This header identifies the enterprise that is sending the traffic and can be used by your billing systems.