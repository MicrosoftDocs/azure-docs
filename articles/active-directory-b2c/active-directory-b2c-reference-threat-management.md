---
title: Threat management in Azure Active Directory B2C | Microsoft Docs
description: Learn about detection and mitigation techniques for denial-of-service attacks and password attacks in Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 03/27/2016
ms.author: davidmu
ms.component: B2C
---
# Azure Active Directory B2C: Threat management

Threat management includes planning for protection from attacks against your system and networks. Denial-of-service attacks might make resources unavailable to intended users. Password attacks lead to unauthorized access to resources. Azure Active Directory B2C (Azure AD B2C) has built-in features that can help you protect your data against these threats in multiple ways.

## Denial-of-service attacks

Azure AD B2C uses detection and mitigation techniques like SYN cookies, and rate and connection limits to protect underlying resources against denial-of-service attacks.

## Password attacks

Azure AD B2C also has mitigation techniques in place for password attacks. Mitigation includes brute-force password attacks and dictionary password attacks. Passwords that are set by users are required to be reasonably complex. By using various signals, Azure AD B2C analyzes the integrity of requests. Azure AD B2C is designed to intelligently differentiate intended users from hackers and botnets. Azure AD B2C provides a sophisticated strategy to lock accounts based on the passwords entered, in the likelihood of an attack.

For more information, visit the [Microsoft Trust Center](https://www.microsoft.com/trustcenter/default.aspx).
