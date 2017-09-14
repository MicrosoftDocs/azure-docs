---
title: 'Password complexity - Azure AD B2C | Microsoft Docs'
description: How to configure complexity requirements for passwords supplied by consumers in Azure Active Directory B2C
services: active-directory-b2c
documentationcenter: ''
author: saeedakhter-msft
manager: krassk
editor: parakhj

ms.assetid: 53ef86c4-1586-45dc-9952-dbbd62f68afc
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/16/2017
ms.author: saeeda

---

# Azure AD B2C: Configure complexity requirements for passwords

Azure Active Directory B2C (Azure AD B2C) supports changing the complexity requirements for passwords supplied by an end user when creating an account.  By default, Azure AD B2C uses `Strong` passwords.  Azure AD B2C also supports configuration options to control the complexity of passwords that customers can use.

To enable this feature in your tenant, please contact Microsoft support.

## When password rules are enforced

During sign-up or password reset, an end user must supply a password that meets the complexity rules.  Password complexity rules are enforced per policy.  It is possible to have one policy require a four-digit pin during sign-up while another policy requires a eight character string during sign-up.  For example, you may use a policy with different password complexity for adults than for children.

Password complexity is never enforced during sign-in.  Users are never prompted during sign-in to change their password because it doesn't meet the current complexity requirement.

Here are the types of policies where password complexity can be configured:

* Sign-up or Sign-in Policy
* Password Reset Policy
* Custom Policy ([Configure password complexity in custom policy](active-directory-b2c-reference-password-complexity-custom.md))

## How to configure password complexity

1. Follow these steps to [navigate to Azure AD B2C settings](active-directory-b2c-app-registration.md#navigate-to-b2c-settings).
1. Open **Sign-up or sign-in polices**.
1. Select a policy, and click **Edit**.
1. Open **Password complexity**.
1. Change the password complexity for this policy to **Simple**, **Strong**, or **Custom**.

### Comparison Chart

| Complexity | Description |
| --- | --- |
| Simple | A password that is at least 8 to 64 characters. |
| Strong | A password that is at least 8 to 64 characters. It requires 3 out of 4 of lowercase, uppercase, numbers, or symbols. |
| Custom | This option provides the most control over password complexity rules.  It allows configuring a custom length.  It also allows accepting number-only passwords (pins). |

## Options available under custom

### Character Set

Allows you to accept digits only (pins) or the full character set.

* **Numbers only** allows digits only (0-9) while entering a password.
* **All** allows any letter, number, or symbol.

### Length

Allows you to control the length requirements of the password.

* **Minimum Length** must be at least 4.
* **Maximum Length** must be greater or equal to minimum length and at most can be 64 characters.

### Character classes

Allows you to control the different character types used in the password.

* **2 of 4: Lowercase character, Uppercase character, Number (0-9), Symbol** ensures the password contains at least two character types. For example, a number and a lowercase character.
* **3 of 4: Lowercase character, Uppercase character, Number (0-9), Symbol** ensures the password contains at least two character types. For example, a number, a lowercase character and an uppercase character.
* **4 of 4: Lowercase character, Uppercase character, Number (0-9), Symbol** ensures the password contains all for character types.

    > [!NOTE]
    > Requiring **4 of 4** can result in end-user frustration. Some studies have shown that this requirement does not improve password entropy. See [NIST Password Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html#appA)
