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

The following table lists features that are available for authentication in the various versions of Microsoft Entra ID. Plan out your needs for securing user sign-in, then determine which approach meets those requirements. For example, although Microsoft Entra ID Free provides security defaults with multifactor authentication, only Microsoft Authenticator can be used for the authentication prompt, including text and voice calls. This approach might be a limitation if you can't make sure that Authenticator is installed on a user's personal device.

| Feature | Entra ID Free - Security defaults (enabled for all users) | Entra ID Free - Global Administrators only | Office 365 | Entra ID Premium P1 | Entra ID Premium P2 |
| --- |:---:|:---:|:---:|:---:|:---:|
| Protect Azure AD tenant admin accounts with MFA | :white_check_mark: | :white_check_mark: (*Azure AD Global Administrator* accounts only) | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Mobile app as a second factor | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Phone call as a second factor | | | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| SMS as a second factor | | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Admin control over verification methods | | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| Fraud alert | | | | :white_check_mark: | :white_check_mark: |
| MFA Reports | | | | :white_check_mark: | :white_check_mark: |
| Custom greetings for phone calls | | | | :white_check_mark: | :white_check_mark: |
| Custom caller ID for phone calls | | | | :white_check_mark: | :white_check_mark: |
| Trusted IPs | | | | :white_check_mark: | :white_check_mark: |
| Remember MFA for trusted devices | | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| MFA for on-premises applications | | | | :white_check_mark: | :white_check_mark: |
| Conditional Access | | | | :white_check_mark: | :white_check_mark: |
| Risk-based Conditional Access | | | | | :white_check_mark: |
| Self-service password reset (SSPR) | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| SSPR with writeback | | | | :white_check_mark: | :white_check_mark: |