---
title: Combined registration for SSPR and Azure AD Multi-Factor Authentication - Azure Active Directory
description: Learn about the combined registration experience for Azure Active Directory to let users register for both Azure AD Multi-Factor Authentication and self-service password reset

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 09/23/2022

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: tilarso

ms.collection: M365-identity-device-management
---
# Combined security information registration for Azure Active Directory overview

Before combined registration, users registered authentication methods for Azure AD Multi-Factor Authentication and self-service password reset (SSPR) separately. People were confused that similar methods were used for multifactor authentication and SSPR but they had to register for both features. Now, with combined registration, users can register once and get the benefits of both multifactor authentication and SSPR. We recommend this video on [How to enable and configure SSPR in Azure AD](https://www.youtube.com/watch?v=rA8TvhNcCvQ)

> [!NOTE]
> Effective Oct. 1st, 2022, we will begin to enable combined registration for all users in Azure AD tenants created before August 15th, 2020. Tenants created after this date are enabled with combined registration. 

This article outlines what combined security registration is. To get started with combined security registration, see the following article:

> [!div class="nextstepaction"]
> [Enable combined security registration](howto-registration-mfa-sspr-combined.md)

![My Account showing registered Security info for a user](media/concept-registration-mfa-sspr-combined/combined-security-info-defaults-registered.png)

Before enabling the new experience, review this administrator-focused documentation and the user-focused documentation to ensure you understand the functionality and effect of this feature. Base your training on the [user documentation](https://support.microsoft.com/account-billing/set-up-your-security-info-from-a-sign-in-prompt-28180870-c256-4ebf-8bd7-5335571bf9a8) to prepare your users for the new experience and help to ensure a successful rollout.

Azure AD combined security information registration is available for Azure US Government but not Azure China 21Vianet.

> [!IMPORTANT]
> Users that are enabled for both the original preview and the enhanced combined registration experience see the new behavior. Users that are enabled for both experiences see only the My Account experience. The *My Account* aligns with the look and feel of combined registration and provides a seamless experience for users. Users can see My Account by going to [https://myaccount.microsoft.com](https://myaccount.microsoft.com).
>
> You can set **Require users to register when signing in** to **Yes** to require all users to register when signing in, ensuring that all users are protected.
>
> You might encounter an error message while trying to access the Security info option, such as, "Sorry, we can't sign you in". Confirm that you don't have any configuration or group policy object that blocks third-party cookies on the web browser.

*My Account* pages are localized based on the language settings of the computer accessing the page. Microsoft stores the most recent language used in the browser cache, so subsequent attempts to access the pages continue to render in the last language used. If you clear the cache, the pages re-render.

If you want to force a specific language, you can add `?lng=<language>` to the end of the URL, where `<language>` is the code of the language you want to render.

![Set up SSPR or other security verification methods](media/howto-registration-mfa-sspr-combined/combined-security-info-my-profile.png)

## Methods available in combined registration

Combined registration supports the authentication methods and actions in the following table.

| Method | Register | Change | Delete |
| --- | --- | --- | --- |
| Microsoft Authenticator | Yes (maximum of 5) | No | Yes |
| Other authenticator app | Yes (maximum of 5) | No | Yes |
| Hardware token | No | No | Yes |
| Phone | Yes | Yes | Yes |
| Alternate phone | Yes | Yes | Yes |
| Office phone* | Yes | Yes | Yes |
| Email | Yes | Yes | Yes |
| Security questions | Yes | No | Yes |
| App passwords* | Yes | No | Yes |
| FIDO2 security keys*| Yes | Yes | Yes |

> [!NOTE]
> <b>Office phone</b> can only be registered in *Interrupt mode* if the users *Business phone* property has been set. Office phone can be added by users in *Managed mode from the [Security info](https://mysignins.microsoft.com/security-info)* without this requirement.  <br />
> <b>App passwords</b> are available only to users who have been enforced for Azure AD Multi-Factor Authentication. App passwords are not available to users who are enabled for Azure AD Multi-Factor Authentication by a Conditional Access policy. <br />
> <b>FIDO2 security keys</b>, can only be added in *Managed mode only from the [Security info](https://mysignins.microsoft.com/security-info) page*

Users can set one of the following options as the default multifactor authentication method. 

- Microsoft Authenticator – push notification or passwordless
- Authenticator app or hardware token – code
- Phone call
- Text message

>[!NOTE]
>Virtual phone numbers are not supported for Voice calls or SMS messages.

Third party authenticator apps do not provide push notification. As we continue to add more authentication methods to Azure AD, those methods become available in combined registration.

## Combined registration modes

There are two modes of combined registration: interrupt and manage.

- **Interrupt mode** is a wizard-like experience, presented to users when they register or refresh their security info at sign-in.
- **Manage mode** is part of the user profile and allows users to manage their security info.

For both modes, users who have previously registered a method that can be used for Azure AD Multi-Factor Authentication need to perform multifactor authentication before they can access their security info. Users must confirm their information before continuing to use their previously registered methods. 



### Interrupt mode

Combined registration adheres to both multifactor authentication and SSPR policies, if both are enabled for your tenant. These policies control whether a user is interrupted for registration during sign-in and which methods are available for registration. If only an SSPR policy is enabled, then users will be able to skip the registration interruption and complete it at a later time.

The following are sample scenarios where users might be prompted to register or refresh their security info:

- *Multifactor Authentication registration enforced through Identity Protection:* Users are asked to register during sign-in. They register multifactor authentication methods and SSPR methods (if the user is enabled for SSPR).
- *Multifactor Authentication registration enforced through per-user multifactor authentication:* Users are asked to register during sign-in. They register multifactor authentication methods and SSPR methods (if the user is enabled for SSPR).
- *Multifactor Authentication registration enforced through Conditional Access or other policies:* Users are asked to register when they use a resource that requires multifactor authentication. They register multifactor authentication methods and SSPR methods (if the user is enabled for SSPR).
- *SSPR registration enforced:* Users are asked to register during sign-in. They register only SSPR methods.
- *SSPR refresh enforced:* Users are required to review their security info at an interval set by the admin. Users are shown their info and can confirm the current info or make changes if needed.

When registration is enforced, users are shown the minimum number of methods needed to be compliant with both multifactor authentication and SSPR policies, from most to least secure. Users going through combined registration where both MFA and SSPR registration is enforced and the SSPR policy requires two methods will first be required to register an MFA method as the first method and can select another MFA or SSPR specific method as the second registered method (e.g. email, security questions etc.)

Consider the following example scenario:

- A user is enabled for SSPR. The SSPR policy requires two methods to reset and has enabled Authenticator app, email, and phone.
- When the user chooses to register, two methods are required:
   - The user is shown Authenticator app and phone by default.
   - The user can choose to register email instead of Authenticator app or phone.

The following flowchart describes which methods are shown to a user when interrupted to register during sign-in:

![Combined security info flowchart](media/concept-registration-mfa-sspr-combined/combined-security-info-flow-chart.png)

If you have both multifactor authentication and SSPR enabled, we recommend that you enforce multifactor authentication registration.

If the SSPR policy requires users to review their security info at regular intervals, users are interrupted during sign-in and shown all their registered methods. They can confirm the current info if it's up to date, or they can make changes if they need to. Users must perform multi-factor authentication when accessing this page.

### Manage mode

Users can access manage mode by going to [https://aka.ms/mysecurityinfo](https://aka.ms/mysecurityinfo) or by selecting **Security info** from My Account. From there, users can add methods, delete or change existing methods, change the default method, and more.

## Key usage scenarios

### Set up security info during sign-in

An admin has enforced registration.

A user has not set up all required security info and goes to the Azure portal. After the user enters the user name and password, the user is prompted to set up security info. The user then follows the steps shown in the wizard to set up the required security info. If your settings allow it, the user can choose to set up methods other than those shown by default. After users complete the wizard, they review the methods they set up and their default method for multifactor authentication. To complete the setup process, the user confirms the info and continues to the Azure portal.

### Set up security info from My Account

An admin has not enforced registration.

A user who hasn't yet set up all required security info goes to [https://myaccount.microsoft.com](https://myaccount.microsoft.com). The user selects **Security info** in the left pane. From there, the user chooses to add a method, selects any of the methods available, and follows the steps to set up that method. When finished, the user sees the method that was set up on the Security info page.

### Set up other methods after partial registration

If a user has partially satisfied MFA or SSPR registration due to existing authentication method registrations performed by the user or admin, users will only be asked to register additional information allowed by the Authentication methods policy settings when registration is required. If more than one other authentication method is available for the user to choose and register, an option on the registration experience titled **I want to set up another method** will be shown and allow the user to set up their desired authentication method.  

:::image type="content" border="true" source="./media/concept-registration-mfa-sspr-combined/other-method.png" alt-text="Screenshot of how to set up another method." :::  

### Delete security info from My Account

A user who has previously set up at least one method navigates to [https://aka.ms/mysecurityinfo](https://aka.ms/mysecurityinfo). The user chooses to delete one of the previously registered methods. When finished, the user no longer sees that method on the Security info page.

### Change the default method from My Account

A user who has previously set up at least one method that can be used for multifactor authentication navigates to [https://aka.ms/mysecurityinfo](https://aka.ms/mysecurityinfo). The user changes the current default method to a different default method. When finished, the user sees the new default method on the Security info page.

### Switch directory

An external identity such as a B2B user may need to switch the directory to change the security registration information for a third-party tenant. 
In addition, users who access a resource tenant may be confused when they change settings in their home tenant but don't see the changes reflected in the resource tenant. 

For example, a user sets Microsoft Authenticator app push notification as the primary authentication to sign-in to home tenant and also has SMS/Text as another option. 
This user is also configured with SMS/Text option on a resource tenant. 
If this user removes SMS/Text as one of the authentication options on their home tenant, they get confused when access to the resource tenant asks them to respond to SMS/Text message. 

To switch the directory in the Azure portal, click the user account name in the upper right corner and click **Switch directory**.

![External users can switch directory.](media/concept-registration-mfa-sspr-combined/switch-directory.png)

Or, you can specify a tenant by URL to access security information.

`https://mysignins.microsoft.com/security-info?tenant=<Tenant Name>`

`https://mysignins.microsoft.com/security-info/?tenantId=<Tenant ID>`

## Next steps

To get started, see the tutorials to [enable self-service password reset](tutorial-enable-sspr.md) and [enable Azure AD Multi-Factor Authentication](tutorial-enable-azure-mfa.md).

Learn how to [enable combined registration in your tenant](howto-registration-mfa-sspr-combined.md) or [force users to re-register authentication methods](howto-mfa-userdevicesettings.md#manage-user-authentication-options).

You can also review the [available methods for Azure AD Multi-Factor Authentication and SSPR](concept-authentication-methods.md).
