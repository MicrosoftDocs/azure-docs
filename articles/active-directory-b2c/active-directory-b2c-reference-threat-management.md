---
title: 'Azure Active Directory B2C: Threat management | Microsoft Docs'
description: Learn about detection and mitigation techniques for denial-of-service attacks and password attacks in Azure Active Directory B2C.
services: active-directory-b2c
documentationcenter: ''
author: vigunase
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
# Azure Active Directory B2C: Threat management

Threat management includes protection from attacks against your system and networks. Denial-of-service attacks might affect availability, and make resources unavailable to your resource users. Password attacks lead to unauthorized access to resources. Azure Active Directory B2C has built-in features that can help you protect your data against these threats in multiple ways.

## Denial-of-service attacks

Azure AD B2C uses detection and mitigation techniques such as SYN cookies, and rate and connection limits to protect underlying resources against denial-of-service attacks.

## Password attacks

Azure AD B2C also has mitigations in place for password attacks. The mitigation techniques include brute-force password attacks and dictionary password attacks. Passwords that are set by users are required to be reasonably complex. By using various signals, Azure AD B2C analyzes the integrity of requests. It is designed to intelligently differentiate intended users from hackers and botnets. Azure AD B2C provides a sophisticated strategy to lock accounts based on the passwords entered, in the likelihood of an attack.

For more information, visit the [Microsoft Trust Center](https://www.microsoft.com/trustcenter/security/threatmanagement).