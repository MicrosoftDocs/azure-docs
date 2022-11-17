---
title: How to migrate to the Authentication methods policy - Azure Active Directory
description: Learn about how to centrally manage multifactor authentication (MFA) and self-service password reset (SSPR) settings in the Authentication methods policy.

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 11/17/2022

ms.author: justinha
author: justinha
manager: amycolannino

ms.collection: M365-identity-device-management
ms.custom: contperf-fy20q4

# Customer intent: As an identity administrator, I want to understand what authentication options are available in Azure AD and how I can manage them.
---
# How to migrate MFA and SSPR policy settings to the Authentication methods policy for Azure AD

You can migrate Azure Active Directory (Azure AD) policy settings that separately control multifactor authentication (MFA) and self-service password reset (SSPR) to unified management with the Authentication methods policy. You can migrate policy settings on your own schedule, and the process is fully reversible. You can continue to use tenant-wide MFA and SSPR policies while you configure authentication methods more precisely for users and groups in the Authentication methods policy. You can complete the migration whenever you're ready to manage all authentication methods together in the Authentication methods policy. 

For more information about how these policies work together during migration, see [Manage authentication methods for Azure AD](concept-authentication-methods-manage.md).

## Before you begin

Begin by doing an audit of your existing policy settings for each authentication method that's available for users. If you roll back during migration, you'll want a record of the authentication method settings from each of these policies:

- MFA policy
- SSPR policy (if used)
- Authentication methods policy (if used)

If you aren't using SSPR and aren't yet using the Authentication methods policy, you only need to get settings from the MFA policy. 

### MFA policy

Start by documenting which methods are available in the legacy MFA policy. Sign in as a [Global Administrator](../roles/permissions-reference.md#global-administrator), and click **Security** > **Multifactor Authentication** > **Additional cloud-based multifactor authentication settings** to view the settings. These settings are tenant-wide, so there's no need for user or group information. 

For each method, note whether or not it's enabled for the tenant. The following table lists methods available in the legacy MFA policy and corresponding methods in the Authentication method policy. 

| Multifactor authentication policy | Authentication method policy |
|-----------------------------------|------------------------------|
| Call to phone                     | Phone calls                   |
| Text message to phone             | SMS<br>Microsoft Authenticator      |
| Notification through mobile app   | Microsoft Authenticator             |
| Verification code from mobile app or hardware token   | Third party software OATH tokens<br>Hardware OATH tokens (not yet available)<br>Microsoft Authenticator |

### SSPR policy

To get the authentication methods available in the legacy SSPR policy, click **Password reset** > **Authentication methods**. The following table lists the available methods in the legacy SSPR policy and corresponding methods in the Authentication method policy. Record which users are in scope for SSPR (either all users, one specific group, or no users) and the authentication methods they can use. While security questions aren't yet available to manage in the Authentication methods policy, make sure you record them for later when they are. 

| SSPR authentication methods | Authentication method policy |
|-----------------------------|------------------------------|
| Mobile app notification     | Microsoft Authenticator      |
| Mobile app code             | Microsoft Authenticator      |
| Email                       | Email OTP                    |
| Mobile phone                | Phone calls<br>SMS            |
| Office phone                | Phone calls                   |
| Security questions          | Not yet available; copy questions for later use  |

### Authentication methods policy

To check settings in the Authentication methods policy, sign in as an [Authentication Policy Administrator](../roles/permissions-reference.md#authentication-policy-administrator) and click **Security** > **Authentication methods** > **Policies**. A new tenant has all methods **Off** by default, which makes migration easier because legacy policy settings don't need to be merged with existing settings. 

The Authentication methods policy has other methods that aren't available in the legacy policies, such as FIDO2 security key, Temporary Access Pass, and Azure AD certificate-based authentication. These methods aren't in scope for migration and you won't need to make any changes to them if you have them configured already. 

If you've enabled other methods in the Authentication methods policy, write down users and groups who can or can't use those methods, and any configuration parameters that govern how the method can be used. For example, you can configure Microsoft Authenticator to provide location in push notifications. Make a record of which users and groups are enabled for similar configuration parameters associated with each method. 

## Start the migration 

After you capture available authentication methods from the policies you are currently using, you can start the migration. Open the Authentication methods policy, click **Manage migration**, and click **Migration in progress**. You'll want to set this option before you make any changes as it will apply your new policy to both sign-in and password reset scenarios.

:::image type="content" border="true" source="./media/how-to-authentication-methods-manage/manage-migration.png" alt-text="Screenshot of Migration in progress.":::


The next step is to update the Authentication methods policy to match your audit. You'll want to review each method one-by-one. If your tenant is only using the legacy MFA policy, and isn't using SSPR, this is a straightforward process - you can enabled each method for all users and precisely match your existing policy. 

If your tenant is using both MFA and SSPR, you'll need to consider each method: 

- If the method is enabled in both legacy policies, enable it for all users in the Authentication methods policy. 
- If the method is off in both legacy policies, leave it off for all users in the Authentication methods policy. 
- If the method is enabled only in one policy, you'll need to decide whether or not it should be available in all situations.

Where the policies match, you can easily match your current state. Where there is a mismatch, you will need to decide whether to enable or disable the method altogether. For example, suppose **Notification through mobile app** is enabled to allow push notifications for MFA. In the legacy SSPR policy, the **Mobile app notification** method isn't enabled. In that case, the legacy policies allow push notifications for MFA but not SSPR. 

In the Authentication methods policy, you'll then need to choose whether to enable **Microsoft Authenticator** for both SSPR and MFA or disable it (we recommend enabling Microsoft Authenticator). 

As you update each method in the Authentication methods policy, some methods have configurable parameters that allows you want to control how that method can be used. For example, if you enable **Phone calls** as authentication method, you can choose to allow both office phone and mobile phones, or mobile only. Step through the process to configure each authentication method from your audit. 

Note that you aren't required to match your existing policy! This is a great opportunity to review your enabled methods and choose a new policy that maximizes security and usability for your tenant. Just note that disabling methods for users who are already using them may require those users to register new authentication methods and prevent them from using previously-registered methods.

The next sections cover specific migration guidance for each method.

### Email one-time passcode

There are two controls for **Email one-time passcode**:

Targeting using include and exclude in the configuration's **Enable and target** section is used to enable email OTP for members of a tenant for use in **Password reset**.

There is a separate **Allow external users to use email OTP** control in the **Configure** section that controls use of email OTP for sign-in by B2B users. The authentication method cannot be disabled if this is enabled.

### Microsoft Authenticator

If **Notification through mobile app** is enabled in the legacy MFA policy, enable **Microsoft Authenticator** for **All users** in the Authentication methods policy. Set the authentication mode to **Any** to allow either push notifications or passwordless authentication. 

If **Verification code from mobile app or hardware token** is enabled in the legacy MFA policy, set **Allow use of Microsoft Authenticator OTP** to **Yes**. 

:::image type="content" border="true" source="./media/how-to-authentication-methods-manage/one-time-password.png" alt-text="Screenshot of Microsoft Authenticator OTP.":::

### SMS and phone calls

In the legacy MFA policy, there are separate controls for **SMS** and **Phone calls**. In the legacy SSPR policy, however, there's a **Mobile phone** control that enables mobile phones for both SMS and voice calls. Another control for **Office phone** enables an office phone only for voice call.

The Authentication methods policy has controls for **SMS** and **Phone calls**, matching the legacy MFA policy. If your tenant is using SSPR and **Mobile phone** is enabled, you'll want to enable both **SMS** and **Phone calls** in the Authentication methods policy. If your tenant is using SSPR and **Office phone** is enabled, you'll want to enable **Phone calls** in the Authentication methods policy, and ensure that the **Office phone** option is enabled. 

### OATH tokens

The OATH token controls in the legacy MFA and SSPR policies were single controls that enabled the use of three different types of OATH tokens: the Microsoft Authenticator app, third-party software OATH TOTP code generator apps, and hardware OATH tokens.

The Authentication methods policy has granular control with separate controls for each type of OATH token. Use of OTP from Microsoft Authenticator is controlled by the **Allow use of Microsoft Authenticator OTP**  control in the **Microsoft Authenticator** section of the policy. Third-party apps are controlled by the **Third party software OATH tokens** section of the policy. 

Another control for **Hardware OATH tokens** is coming soon. If you are using hardware OATH tokens, now in public preview, you should hold off on migrating OATH tokens and do not complete the migration process.

### Security questions

A control for **Security questions** is coming soon. If you are using security questions, and don't want to disable them, make sure to keep them enabled in the legacy SSPR policy until the new control is available. You _can_ finish migration as described in the next section with security questions enabled.

## Finish the migration 

After you update the Authentication methods policy, go through the legacy MFA and SSPR policies and remove each authentication method one-by-one. Test and validate the changes for each method. 

When you determine that MFA and SSPR work as expected and you no longer need the legacy MFA and SSPR policies, you can change the migration process to **Migration Complete**. In this mode, Azure AD only follows the Authentication methods policy. No changes can be made to the legacy policies if **Migration Complete** is set, except for security questions in the SSPR policy. If you need to go back to the legacy policies for some reason, you can move the migration state back to **Migration in Progress** at any time.

:::image type="content" border="true" source="./media/how-to-authentication-methods-manage/migration-complete.png" alt-text="Screenshot of Migration complete.":::

## Next steps

- [Manage authentication methods for Azure AD](concept-authentication-methods-manage.md)
- [What authentication and verification methods are available in Azure Active Directory?](concept-authentication-methods.md)
- [How Azure AD Multi-Factor Authentication works](concept-mfa-howitworks.md)
- [Microsoft Graph REST API](/graph/api/resources/authenticationmethods-overview)


