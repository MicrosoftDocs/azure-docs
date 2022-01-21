---
title: Don't send your middle-tier OBO token to any non-audience party
description: Include file warning that access tokens acquired by the middle-tier shouldn't be sent to any party except that which is identified by the audience claim.
services: active-directory
author: brianmel
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: include
ms.date: 12/7/2021
ms.author: brianmel
ms.reviewer: brianmel
ms.custom: aaddev
---

> [!WARNING]
Access tokens issued to the middle-tier are intended for *use _only_* by the middle-tier and shouldn't be sent to any party other than the resource audience for which it was acquired. Relaying tokens from a middle-tier to a client (in place of the client getting the tokens themselves) is discouraged due to increased risk of token interception over compromised SSL/TLS channels, inability to satisfy token binding, and Conditional Access scenarios requiring claims step-up (for example, MFA, Sign-in Frequency), and incompatibility with admin-configured device-based policies (for example, MDM, location-based policies). 
