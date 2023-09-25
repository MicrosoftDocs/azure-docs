---
title: Does my Microsoft Entra sign-in page accept Microsoft accounts 
description: How on-screen messaging reflects username lookup during sign-in 
services: active-directory
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
ms.topic: overview
ms.date: 06/24/2022
ms.author: barclayn
ms.reviewer: kexia
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Sign-in options for Microsoft accounts in Microsoft Entra ID

The Microsoft 365 sign-in page for Microsoft Entra ID, part of Microsoft Entra, supports work or school accounts and Microsoft accounts, but depending on the user's situation, it could be one or the other or both. For example, the Microsoft Entra sign-in page supports:

* Apps that accept sign-ins from both types of account
* Organizations that accept guests

## Identification
You can tell if the sign-in page your organization uses supports Microsoft accounts by looking at the hint text in the username field. If the hint text says "Email, phone, or Skype", the sign-in page supports Microsoft accounts.

![Difference between account sign-in pages](./media/signin-account-support/ui-prompt.png)

[Additional sign-in options work only for personal Microsoft accounts](https://azure.microsoft.com/updates/microsoft-account-signin-options/) but can't be used for signing in to work or school account resources.

## Next steps

[Customize your sign-in branding](../fundamentals/add-custom-domain.md)
