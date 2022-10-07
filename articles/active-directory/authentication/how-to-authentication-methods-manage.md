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

Azure Active Directory (Azure AD) provides various authentication methods to support different scenarios for sign-in. Each method can be configured specifically to meet customer goals for the sign-in experience and security. This topic explains how you can manage authentication methods for Azure AD, and how configuration options affect user sign-in. 

## Authentication methods policy

The Authentication methods policy is the recommended way to manage authentication methods, including modern methods like passwordless authentication. [Authentication Policy Administrators](../roles/permissions-reference.md#authentication-policy-administrator) can use this policy to enable authentication methods for specific users and groups. Each method also has configuration parameters to control how that method can be used. 

For example, you can enable phone sign-in, and optionally specify whether an office phone can be used in addition to a mobile phone. If you enable passwordless authentication with Microsoft Authenticator, you can add the location of the sign-in request, or the name of the application that requires the sign-in. These options help can customers further improve security and tailor the sign-in experience for their users.

To view the Authentication methods policy, click **Security** > **Authentication methods** > **Policies**.

:::image type="content" border="true" source="./media/how-to-authentication-methods-manage/authentication-methods-policy.png" alt-text="Screenshot of Authentication methods policy.":::

## MFA and password settings

Two other policies provide a legacy way to manage some authentication methods for the entire tenant. They are the **Multifactor authentication** settings and **Password reset** settings. These policies affect all users in tenant. There's no granular control over who uses each authentication method, and no configuration parameters to control how a method can be used. They can be managed only by a [Global Administrator](../roles/permissions-reference.md#global-administrator). 

To see the authentication methods that can be enabled for the tenant for **Multifactor authentication**, sign in to the Azure AD portal, and click **Security** > **Multifactor Authentication** > **Additional cloud-based multifactor authentication settings**.

::image type="content" border="true" source="./media/concept-authentication-strengths/service-settings.png" alt-text="Screenshot of MFA service settings.":::

To see the authentication methods that can be enabled for the tenant for  **Password reset**, sign in to the Azure AD portal, and click **Password reset** > **Authentication methods**.

## How policies interact

A user who is enabled for an authentication method in _any_ policy can sign in by using that method. 

## Transition between policies


## Next steps

- [What authentication and verification methods are available in Azure Active Directory?](concept-authentication-methods.md)
- [How Azure AD Multi-Factor Authentication works](concept-mfa-howitworks.md)
- [Microsoft Graph REST API](/graph/api/resources/authenticationmethods-overview)
