---
title: How to manage authentication methods - Azure Active Directory
description: Learn about the Authentication methods policy and different ways to manage authentication methods.

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 10/07/2022

ms.author: justinha
author: justinha
manager: amycolannino

ms.collection: M365-identity-device-management
ms.custom: contperf-fy20q4

# Customer intent: As an identity administrator, I want to understand what authentication options are available in Azure AD and how I can manage them.
---
# How to manage authentication methods for Azure Active Directory

Azure Active Directory (Azure AD) provides several authentication methods to support a range of sign-in scenarios. Administrators can specifically configure each method to meet goals for user experience and security. This topic explains how you can manage authentication methods for Azure AD, and how configuration options affect user sign-in. 

## Authentication methods policy

The Authentication methods policy is the recommended way to manage authentication methods, including modern methods like passwordless authentication. [Authentication Policy Administrators](../roles/permissions-reference.md#authentication-policy-administrator) can edit this policy to enable authentication methods for specific users and groups. Each method also has configuration parameters to control how that method can be used. These parameters help administrators customize the sign-in experience for their organization. <!---they will add ability to specify roles in addition to users and groups. Also, they will add ability to exclude, just like CA.--->

For example, if you want to enable phone sign-in, you can also specify whether an office phone can be used in addition to a mobile phone. If you want to enable passwordless authentication with Microsoft Authenticator, you can add the location of the sign-in request, or the name of the application that requires the sign-in. These options provide more context for users when they sign-in, and improve the security posture for the organization.

To manage the Authentication methods policy, click **Security** > **Authentication methods** > **Policies**.

:::image type="content" border="true" source="./media/how-to-authentication-methods-manage/authentication-methods-policy.png" alt-text="Screenshot of Authentication methods policy.":::

## MFA and password settings

Two other policies, located in **Multifactor authentication** settings and **Password reset** settings, provide a legacy way to manage some authentication methods for all users in the tenant. You can't control who uses an enabled authentication method, or how the method can be used. A [Global Administrator](../roles/permissions-reference.md#global-administrator) is needed to manage these policies. 

To manage **Multifactor authentication** methods across the tenant, click **Security** > **Multifactor Authentication** > **Additional cloud-based multifactor authentication settings**.

:::image type="content" border="true" source="./media/how-to-authentication-methods-manage/service-settings.png" alt-text="Screenshot of MFA service settings.":::

To manage **Password reset** authentication methods across the tenant, click **Password reset** > **Authentication methods**.

:::image type="content" border="true" source="./media/how-to-authentication-methods-manage/password-reset.png" alt-text="Screenshot of password reset settings.":::

## How policies interact

A user who is enabled for an authentication method in _any_ policy can register for that method and use it to sign in. 

## Transition between policies


## Next steps

- [What authentication and verification methods are available in Azure Active Directory?](concept-authentication-methods.md)
- [How Azure AD Multi-Factor Authentication works](concept-mfa-howitworks.md)
- [Microsoft Graph REST API](/graph/api/resources/authenticationmethods-overview)
