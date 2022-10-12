---
title: How to manage authentication methods - Azure Active Directory
description: Learn about the Authentication methods policy and different ways to manage authentication methods.

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 10/11/2022

ms.author: justinha
author: justinha
manager: amycolannino

ms.collection: M365-identity-device-management
ms.custom: contperf-fy20q4

# Customer intent: As an identity administrator, I want to understand what authentication options are available in Azure AD and how I can manage them.
---
# How to manage authentication methods for Azure Active Directory

Azure Active Directory (Azure AD) provides several authentication methods to support a range of sign-in scenarios. Administrators can specifically configure each method to meet their goals for user experience and security. This topic explains how to manage authentication methods for Azure AD, and how configuration options affect user sign-in. 

## Authentication methods policy

The Authentication methods policy is the recommended way to manage authentication methods, including modern methods like passwordless authentication. [Authentication Policy Administrators](../roles/permissions-reference.md#authentication-policy-administrator) can edit this policy to enable authentication methods for specific users and groups. 

Each method also has configuration parameters to control how that method can be used. These parameters help administrators customize the sign-in experience for their organization. 

<!---they will add ability to specify roles in addition to users and groups. Also, they will add ability to exclude, just like CA.--->

For example, if you enable **Phone sign-in**, you can also specify whether an office phone can be used in addition to a mobile phone. 

Or let's say you want to enable passwordless authentication with Microsoft Authenticator. You can configure parameters like adding location or the application that requires the sign-in. These options provide more context for users when they sign-in and help prevent accidental MFA approvals.

To manage the Authentication methods policy, click **Security** > **Authentication methods** > **Policies**.

:::image type="content" border="true" source="./media/how-to-authentication-methods-manage/authentication-methods-policy.png" alt-text="Screenshot of Authentication methods policy.":::

## MFA and SSPR settings

Two other policies, located in **Multifactor authentication** settings and **Password reset** settings, provide a legacy way to manage some authentication methods for all users in the tenant. You can't control who uses an enabled authentication method, or how the method can be used. A [Global Administrator](../roles/permissions-reference.md#global-administrator) is needed to manage these policies. 

To manage these MFA methods across the tenant, click **Security** > **Multifactor Authentication** > **Additional cloud-based multifactor authentication settings**.

:::image type="content" border="true" source="./media/how-to-authentication-methods-manage/service-settings.png" alt-text="Screenshot of MFA service settings.":::

To manage authentication methods for self-service password reset (SSPR) across the tenant, click **Password reset** > **Authentication methods**. The **Mobile phone** option in this policy allows either voice call or SMS to be sent to a mobile phone. The **Office phone** option allows only voice call.

:::image type="content" border="true" source="./media/how-to-authentication-methods-manage/password-reset.png" alt-text="Screenshot of password reset settings.":::

>[!NOTE]
>OATH tokens and security questions can be enabled only for all users in the tenant by using these policies. 

## How policies work together

Settings aren't synchronized between the policies, which allows administrators to manage each policy independently. By default, each policy respects the settings in the other policies. A user who is enabled for an authentication method in _any_ policy can register that method. 

Let's walk through an example where a user wants to register Microsoft Authenticator. The registration process first checks Authentication methods policy. The user can register Microsoft Authenticator if they, or any group where they have membership, is enabled for it. 

If not, the registration process checks **Multifactor Authentication**. Any user can register Microsoft Authenticator if one of these settings is enabled for MFA:

- **Notification through mobile app** 
- **Verification code from mobile app or hardware token**

If the user can't register Microsoft Authenticator based on either of those policies, the registration process checks which authentication methods are enabled for **Password reset**. Any user can register Microsoft Authenticator if any of these settings are enabled for SSPR:

- **Mobile app notification**
- **Mobile app code**
- **Mobile phone**

## Migration between policies

The Authentication methods policy provides a migration path toward unified administration of all three policies. This migration gives organizations a way to centralize management of authentication methods in a single place.

To view the migration options, open the Authentication methods policy and click **Manage migration**.



The following table describes each option.

| Option | Description |
|:-------|:------------|
| Pre-migration | The Authentication methods policy is used only for authentication.<br>Legacy policy settings are respected.      |
| Migration in progress | The Authentication methods policy is used for authentication and SSPR.<br>Legacy policy settings are respected.     |
| Migration complete | Only the Authentication methods policy is used for authentication and SSPR.<br>Legacy policy settings are ignored.  |



## Next steps

- [What authentication and verification methods are available in Azure Active Directory?](concept-authentication-methods.md)
- [How Azure AD Multi-Factor Authentication works](concept-mfa-howitworks.md)
- [Microsoft Graph REST API](/graph/api/resources/authenticationmethods-overview)
