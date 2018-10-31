---
title: Threat management in Azure Active Directory B2C | Microsoft Docs
description: Learn about detection and mitigation techniques for denial-of-service attacks and password attacks in Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 10/31/2018
ms.author: davidmu
ms.component: B2C
---
# Azure Active Directory B2C: Threat management

Threat management includes planning for protection from attacks against your system and networks. Denial-of-service attacks might make resources unavailable to intended users. Password attacks lead to unauthorized access to resources. Azure Active Directory B2C (Azure AD B2C) has built-in features that can help you protect your data against these threats in multiple ways.

## Denial-of-service attacks

Azure AD B2C uses detection and mitigation techniques like SYN cookies, and rate and connection limits to protect underlying resources against denial-of-service attacks.

## Password attacks

Passwords that are set by users are required to be reasonably complex. Azure AD B2C has mitigation techniques in place for password attacks. Mitigation includes brute-force password attacks and dictionary password attacks. By using various signals, Azure AD B2C analyzes the integrity of requests. Azure AD B2C is designed to intelligently differentiate intended users from hackers and botnets. 

Azure AD B2C uses a sophisticated strategy to lock accounts based on the IP of the request and the passwords entered. The duration of the lockout also increases based on the likelihood that it's an attack. After ten unsuccessful attempts, a one minute lockout occurs. The next unsuccessful attempt after the account is unlocked triggers another one minute lockout and continues for each unsuccessful attempt. Entering the same password repeatedly does not qualify as multiple unsuccessful attempts. 

The first ten lockout periods are one minute long, the next ten lockout periods are slightly longer with the periods increasing in duration after every ten lockout periods. The lockout counter resets to zero after a successful login when the account isn’t locked. The maximum is five hours per lockout period. 

Currently, you can't:

- Trigger a lockout with fewer than ten failed login attempts
- Retrieve a list of locked out accounts
- Configure the lock out policy

For more information, visit the [Microsoft Trust Center](https://www.microsoft.com/trustcenter/default.aspx).
