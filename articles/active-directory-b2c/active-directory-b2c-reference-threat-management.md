---
title: Threat Management for Azure B2C | Microsoft Docs
description: DOS attacks and Password Attacks detection and mitigation techniques in Azure B2C.
services: active-directory-b2c
documentationcenter: ''
author: Vinothini Gunasekaran
manager: Ajith Alexander
editor: ''

ms.assetid: 6df79878-65cb-4dfc-98bb-2b328055bc2e
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/27/2016
ms.author: 

---
# Azure AD B2C: Threat Management
## Denial of Service Attack
A denial of Service attack can affect the availability and makes the resource unavailable to the intended users. Azure AD B2C uses Detection and Mitigation techniques such as SYN cookies, rate and connection limits, to protect the underlying resources against these attacks.  

## Password Attacks

Azure AD B2C also has mitigations in place for password attacks.  This includes both brute-force password attacks and dictionary password attacks.  Passwords set by users are required to be of reasonable complexity.  Azure AD B2C analyzes the integrity of requests to intelligently differentiate between intended users from hackers and botnets, using a variety of signals. B2C provides a sophisticated strategy to lock accounts based on the passwords entered, on the likelihood of an attack.

### [More information on Microsoft's Threat Management](https://www.microsoft.com/en-us/trustcenter/security/threatmanagement)
