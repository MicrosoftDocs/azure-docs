---
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: include
ms.date: 01/10/2022
---

Some endpoints might add parameters in the following headers to an in-dialog message when those parameters weren't present in the dialog-creating message. In that case, Azure Communications Gateway will strip them, because this behavior isn't permitted by RFC 3261.

* Request URI
* To header
* From header