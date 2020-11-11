---
author: msmimart
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 03/11/2020
ms.author: mimart
---
## Disable email verification

By default, Azure Active Directory B2C (Azure AD B2C) verifies your customer's email address for local accounts (accounts for users who sign up with email address or username). Azure AD B2C ensures valid email addresses by requiring customers to verify them during the sign-up process. It also prevents malicious actors from using automated processes to generate fraudulent accounts in your applications.

Some application developers prefer to skip email verification during the sign-up process and instead have customers verify their email address later. To support this, Azure AD B2C can be configured to disable email verification. Doing so creates a smoother sign-up process and gives developers the flexibility to differentiate customers that have verified their email address from customers that have not.

> [!WARNING]
> Disabling email verification in the sign-up process may lead to spam. If you disable the default Azure AD B2C-provided email verification, we recommend that you implement a replacement verification system.
