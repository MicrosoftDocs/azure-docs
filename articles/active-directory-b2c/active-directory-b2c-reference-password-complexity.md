---
title: Password complexity - Azure Active Directory B2C | Microsoft Docs
description: How to configure complexity requirements for passwords supplied by consumers in Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 02/11/2019
ms.author: marsma
ms.subservice: B2C
---

# Configure complexity requirements for passwords in Azure Active Directory B2C

Azure Active Directory (Azure AD) B2C supports changing the complexity requirements for passwords supplied by an end user when creating an account. By default, Azure AD B2C uses `Strong` passwords. Azure AD B2C also supports configuration options to control the complexity of passwords that customers can use.

## Password rule enforcement

During sign-up or password reset, an end user must supply a password that meets the complexity rules. Password complexity rules are enforced per user flow. It is possible to have one user flow require a four-digit pin during sign-up while another user flow requires an eight character string during sign-up. For example, you may use a user flow with different password complexity for adults than for children.

Password complexity is never enforced during sign-in. Users are never prompted during sign-in to change their password because it doesn't meet the current complexity requirement.

Password complexity can be configured in the following types of user flows:

- Sign-up or Sign-in user flow
- Password Reset user flow

If you are using custom policies, you can ([configure password complexity in a custom policy](active-directory-b2c-reference-password-complexity-custom.md)).

## Configure password complexity

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
4. Select **User flows**.
2. Select a user flow, and click **Properties**.
3. Under **Password complexity**, change the password complexity for this user flow to **Simple**, **Strong**, or **Custom**.

### Comparison Chart

| Complexity | Description |
| --- | --- |
| Simple | A password that is at least 8 to 64 characters. |
| Strong | A password that is at least 8 to 64 characters. It requires 3 out of 4 of lowercase, uppercase, numbers, or symbols. |
| Custom | This option provides the most control over password complexity rules.  It allows configuring a custom length.  It also allows accepting number-only passwords (pins). |

## Custom options

### Character Set

Allows you to accept digits only (pins) or the full character set.

- **Numbers only** allows digits only (0-9) while entering a password.
- **All** allows any letter, number, or symbol.

### Length

Allows you to control the length requirements of the password.

- **Minimum Length** must be at least 4.
- **Maximum Length** must be greater or equal to minimum length and at most can be 64 characters.

### Character classes

Allows you to control the different character types used in the password.

- **2 of 4: Lowercase character, Uppercase character, Number (0-9), Symbol** ensures the password contains at least two character types. For example, a number and a lowercase character.
- **3 of 4: Lowercase character, Uppercase character, Number (0-9), Symbol** ensures the password contains at least two character types. For example, a number, a lowercase character and an uppercase character.
- **4 of 4: Lowercase character, Uppercase character, Number (0-9), Symbol** ensures the password contains all for character types.

    > [!NOTE]
    > Requiring **4 of 4** can result in end-user frustration. Some studies have shown that this requirement does not improve password entropy. See [NIST Password Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html#appA)
