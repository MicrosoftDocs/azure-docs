---
title: Troubleshooting Azure AD Authentication Strengths
description: Learn how to resolve errors when using Azure AD Authentication Strengths.

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 08/23/2022

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# Troubleshooting Azure AD Authentication Strengths

This topic covers errors you might see when you use Azure Active Directory (Azure AD) Authentication Strengths and how to resolve them.  

## User sign in error when using a restricted FIDO2 security key
An admin can restrict access to specific security keys. When a user tries to sign in by using a key they are not allowed to use, a **You can't get there from here** error appears:

:::image type="content" border="true" source="./media/troubleshoot-authentication-strengths/restricted-security-key.png" alt-text="Screenshot of a sign-in error when using a restricted FIDO2 security key.":::

## Next steps

- [Azure AD Authentication Strengths overview](concept-authentication-strengths.md)