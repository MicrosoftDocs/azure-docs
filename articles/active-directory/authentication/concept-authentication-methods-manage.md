---
title: Manage authentication methods
description: Learn about the authentication methods policy and different ways to manage authentication methods.

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 09/24/2023

ms.author: justinha
author: justinha
ms.reviewer: jpettere
manager: amycolannino

ms.collection: M365-identity-device-management
ms.custom: contperf-fy20q4

# Customer intent: As an identity administrator, I want to understand what authentication options are available in Microsoft Entra ID and how I can manage them.
---
# Manage authentication methods for Microsoft Entra ID

Microsoft Entra ID allows the use of a range of authentication methods to support a wide variety of sign-in scenarios. Administrators can specifically configure each method to meet their goals for user experience and security. This topic explains how to manage authentication methods for Microsoft Entra ID, and how configuration options affect user sign-in and password reset scenarios. 

## Authentication methods policy

The Authentication methods policy is the recommended way to manage authentication methods, including modern methods like passwordless authentication. [Authentication Policy Administrators](../roles/permissions-reference.md#authentication-policy-administrator) can edit this policy to enable authentication methods for all users or specific groups. 

Methods enabled in the Authentication methods policy can typically be used anywhere in Microsoft Entra ID, for both authentication and password reset scenarios. The exception is that some methods are inherently limited to use in authentication, such as FIDO2 and Windows Hello for Business, and others are limited to use in password reset, such as security questions. For more control over which methods are usable in a given authentication scenario, consider using the **Authentication Strengths** feature.

Most methods also have configuration parameters to more precisely control how that method can be used. For example, if you enable **Voice calls**, you can also specify whether an office phone can be used in addition to a mobile phone.
 
Or let's say you want to enable passwordless authentication with Microsoft Authenticator. You can set extra parameters like showing the user sign-in location or the name of the app being signed into. These options provide more context for users when they sign-in and help prevent accidental MFA approvals.

To manage the Authentication methods policy, sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Authentication Policy Administrator](../roles/permissions-reference.md#authentication-policy-administrator) and browse to **Protection** > **Authentication methods** > **Policies**.

:::image type="content" border="true" source="./media/concept-authentication-methods-manage/authentication-methods-policy.png" alt-text="Screenshot of Authentication methods policy.":::

Only the [converged registration experience](concept-registration-mfa-sspr-combined.md) is aware of the Authentication methods policy. Users in scope of the Authentication methods policy but not the converged registration experience won't see the correct methods to register.

## Legacy MFA and SSPR policies

Two other policies, located in **Multifactor authentication** settings and **Password reset** settings, provide a legacy way to manage some authentication methods for all users in the tenant. You can't control who uses an enabled authentication method, or how the method can be used. A [Global Administrator](../roles/permissions-reference.md#global-administrator) is needed to manage these policies. 

>[!Important]
>In March 2023, we announced the deprecation of managing authentication methods in the legacy multifactor authentication and self-service password reset (SSPR) policies. Beginning September 30, 2025, authentication methods can't be managed in these legacy MFA and SSPR policies. We recommend customers use the manual migration control to migrate to the Authentication methods policy by the deprecation date.

To manage the legacy MFA policy, select **Security** > **Multifactor authentication** > **Additional cloud-based multifactor authentication settings**.

:::image type="content" border="true" source="./media/concept-authentication-methods-manage/service-settings.png" alt-text="Screenshot of MFA service settings.":::

To manage authentication methods for self-service password reset (SSPR), click **Password reset** > **Authentication methods**. The **Mobile phone** option in this policy allows either voice calls or text message to be sent to a mobile phone. The **Office phone** option allows only voice calls. 

:::image type="content" border="true" source="./media/concept-authentication-methods-manage/password-reset.png" alt-text="Screenshot of password reset settings.":::

## How policies work together

Settings aren't synchronized between the policies, which allows administrators to manage each policy independently. Microsoft Entra ID respects the settings in all of the policies so a user who is enabled for an authentication method in _any_ policy can register and use that method. To prevent users from using a method, it must be disabled in all policies.

Let's walk through an example where a user who belongs to the Accounting group wants to register Microsoft Authenticator. The registration process first checks the Authentication methods policy. If the Accounting group is enabled for Microsoft Authenticator, the user can register it. 

If not, the registration process checks the legacy MFA policy. In that policy, any user can register Microsoft Authenticator if one of these settings is enabled for MFA:

- **Notification through mobile app** 
- **Verification code from mobile app or hardware token**

If the user can't register Microsoft Authenticator based on either of those policies, the registration process checks the legacy SSPR policy. In that policy too, a user can register Microsoft Authenticator if the user is enabled for SSPR and any of these settings are enabled:

- **Mobile app notification**
- **Mobile app code**

For users who are enabled for **Mobile phone** for SSPR, the independent control between policies can impact sign-in behavior. Where the other policies have separate options for text message and voice calls, the **Mobile phone** for SSPR enables both options. As a result, anyone who uses **Mobile phone** for SSPR can also use voice calls for password reset, even if the other policies don't allow voice calls. 

Similarly, let's suppose you enable **Voice calls** for a group. After you enable it, you find that even users who aren't group members can sign-in with a voice call. In this case, it's likely those users are enabled for **Mobile phone** in the legacy SSPR policy or **Call to phone** in the legacy MFA policy.  

## Migration between policies 

The Authentication methods policy provides a migration path toward unified administration of all authentication methods. All desired methods can be enabled in the Authentication methods policy. Methods in the legacy MFA and SSPR policies can be disabled. Migration has three settings to let you move at your own pace, and avoid problems with sign-in or SSPR during the transition. After migration is complete, you'll centralize control over authentication methods for both sign-in and SSPR in a single place, and the legacy MFA and SSPR policies will be disabled.

>[!Note]
>Security questions can only be enabled today by using the legacy SSPR policy. In the future, it will be made available in the Authentication methods policy. If you're using security questions, and don't want to disable them, make sure to keep them enabled in the legacy SSPR policy until the new control is available in the future. You can migrate the remainder of your authentication methods and still manage security questions in the legacy SSPR policy.

To view the migration options, open the Authentication methods policy and click **Manage migration**.

:::image type="content" border="true" source="./media/concept-authentication-methods-manage/manage-migration.png" alt-text="Screenshot of migration options.":::

The following table describes each option.

| Option | Description |
|:-------|:------------|
| Pre-migration | The Authentication methods policy is used only for authentication.<br>Legacy policy settings are respected.      |
| Migration in Progress | The Authentication methods policy is used for authentication and SSPR.<br>Legacy policy settings are respected.     |
| Migration Complete | Only the Authentication methods policy is used for authentication and SSPR.<br>Legacy policy settings are ignored.  |

Tenants are set to either Pre-migration or Migration in Progress by default, depending on their tenant's current state. If you start in Pre-migration, you can move to any of the states at any time. If you started in Migration in Progress, you can move between Migration in Progress and Microsoft Complete at any time, but won't be allowed to move to Pre-migration. If you move to Migration Complete, and then choose to roll back to an earlier state, we'll ask why so we can evaluate performance of the product.

:::image type="content" border="true" source="./media/concept-authentication-methods-manage/reason.png" alt-text="Screenshot of reasons for rollback.":::

>[!NOTE]
>After all authentication methods are fully migrated, the following elements of the legacy SSPR policy remain active:
> - The **Number of methods required to reset** control: admins can continue to change how many authentication methods must be verified before a user can perform SSPR.
> - The SSPR administrator policy: admins can continue to register and use any methods listed under the legacy SSPR administrator policy or methods they're enabled to use in the Authentication methods policy.
> 
> In the future, both of these features will be integrated with the Authentication methods policy.

## Known issues and limitations
- In recent updates we removed the ability to target individual users. Previously targeted users will remain in the policy but we recommend moving them to a targeted group.
- Registration of FIDO2 security keys may fail for some users if the FIDO2 Authentication method policy is targeted for a group and the overall Authentication methods policy has more than 20 groups configured. We're working on increasing the policy size limit and in the mean time recommend limiting the number of group targets to no more than 20.

## Next steps

- [How to migrate MFA and SSPR policy settings to the Authentication methods policy](how-to-authentication-methods-manage.md)
- [What authentication and verification methods are available in Microsoft Entra ID?](concept-authentication-methods.md)
- [How Microsoft Entra multifactor authentication works](concept-mfa-howitworks.md)
- [Microsoft Graph REST API](/graph/api/resources/authenticationmethods-overview)
