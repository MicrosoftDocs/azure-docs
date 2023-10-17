---
title: include file
description: include file
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.topic: include
ms.date: 08/28/2023
ms.author: barclayn
ms.custom: include file,licensing
---

The following table lists features that are available for authentication in the various versions of Microsoft Entra ID. Plan out your needs for securing user sign-in, then determine which approach meets those requirements. For example, although Microsoft Entra ID Free provides security defaults with multifactor authentication, only Microsoft Authenticator can be used for the authentication prompt, including text and voice calls. This approach may be a limitation if you can't make sure that Authenticator is installed on a user's personal device.

| Feature | Entra ID Free - Security defaults (enabled for all users) | Entra ID Free - Global Administrators only | Office 365 | Entra ID Premium P1 | Entra ID Premium P2 |
| --- |:---:|:---:|:---:|:---:|:---:|
| Protect Azure AD tenant admin accounts with MFA | &#x2705 | :white_check_mark: (*Azure AD Global Administrator* accounts only) | &#x2705 | &#x2705 | &#x2705 |
| Mobile app as a second factor | &#x2705 | &#x2705 | &#x2705 | &#x2705 | &#x2705 |
| Phone call as a second factor | | | &#x2705 | &#x2705 | &#x2705 |
| SMS as a second factor | | &#x2705 | &#x2705 | &#x2705 | &#x2705 |
| Admin control over verification methods | | &#x2705 | &#x2705 | &#x2705 | &#x2705 |
| Fraud alert | | | | &#x2705 | &#x2705 |
| MFA Reports | | | | &#x2705 | &#x2705 |
| Custom greetings for phone calls | | | | &#x2705 | &#x2705 |
| Custom caller ID for phone calls | | | | &#x2705 | &#x2705 |
| Trusted IPs | | | | &#x2705 | &#x2705 |
| Remember MFA for trusted devices | | &#x2705 | &#x2705 | &#x2705 | &#x2705 |
| MFA for on-premises applications | | | | &#x2705 | &#x2705 |
| Conditional Access | | | | &#x2705 | &#x2705 |
| Risk-based Conditional Access | | | | | &#x2705 |
| Self-service password reset (SSPR) |&#x2705|&#x2705|&#x2705|&#x2705|&#x2705|
| SSPR with writeback | | | |&#x2705|&#x2705|