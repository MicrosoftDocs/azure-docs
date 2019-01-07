---
title: Manage threats to resources and data in Azure Active Directory B2C | Microsoft Docs
description: Learn about detection and mitigation techniques for denial-of-service attacks and password attacks in Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 11/01/2018
ms.author: davidmu
ms.component: B2C
---
# Manage threats to resources and data in Azure Active Directory B2C

Azure Active Directory (Azure AD) B2C has built-in features that can help you protect against threats to your resources and data. These threats include denial-of-service attacks and password attacks. Denial-of-service attacks might make resources unavailable to intended users. Password attacks lead to unauthorized access to resources. 

## Denial-of-service attacks

Azure AD B2C defends against SYN flood attacks using a SYN cookie. Azure AD B2C also protects against denial-of-service attacks by using limits for rates and connections.

## Password attacks

Passwords that are set by users are required to be reasonably complex. Azure AD B2C has mitigation techniques in place for password attacks. Mitigation includes brute-force password attacks and dictionary password attacks. By using various signals, Azure AD B2C analyzes the integrity of requests. Azure AD B2C is designed to intelligently differentiate intended users from hackers and botnets. 

Azure AD B2C uses a sophisticated strategy to lock accounts. The accounts are locked based on the IP of the request and the passwords entered. The duration of the lockout also increases based on the likelihood that it's an attack. After a password is tried 10 times unsuccessfully, a one-minute lockout occurs. The next time a login is unsuccessful after the account is unlocked, another one-minute lockout occurs and continues for each unsuccessful login. Entering the same password repeatedly doesn't count as multiple unsuccessful logins. 

The first 10 lockout periods are one minute long. The next 10 lockout periods are slightly longer and increase in duration after every 10 lockout periods. The lockout counter resets to zero after a successful login when the account isn’t locked. Lockout periods can last up to five hours. 

Currently, you can't:

- Trigger a lockout with fewer than 10 failed logins
- Retrieve a list of locked out accounts
- Configure the lock out policy

For more information, visit the [Microsoft Trust Center](https://www.microsoft.com/trustcenter/default.aspx).
