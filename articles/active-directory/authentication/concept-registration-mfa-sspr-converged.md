---
title: Converged registration for Azure AD SSPR and MFA (Public preview)
description: Azure AD Multi-Factor Authenticaiton and self-service password reset registration (Public preview)

services: active-directory
ms.service: active-directory
ms.component: authentication
ms.topic: conceptual
ms.date: 08/01/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: sahenry, michmcla

---
# Converged registration for self-service password reset and Azure Multi-Factor Authentication (Public preview)

Until now, users were required to register authentication methods for Azure Multi-Factor Authentication (MFA) and self-service password reset (SSPR) in two different portals. Many users were confused by the fact that similar methods were used for both Azure MFA and SSPR and would not register in both portals. This disparity led to some users being unable to use either Azure MFA or SSPR when needed, leading to a helpdesk call, and potentially an upset user. Now, users can register once and get the benefits of both Azure MFA and SSPR, eliminating the need to register their authentication methods for these features twice.  

Before you enable this new experience for your organization, we recommend that you review this article as well as our [end user documentation](https://aka.ms/securityinfoguide) to understand the impact the experience will have on your users. You can use the [end user documentation](https://aka.ms/securityinfoguide) to train and prepare your users for the new experience and ensure a successful rollout.

|     |
| --- |
| Converged registration for self-service password reset and Azure Multi-Factor Authentication is a public preview feature of Azure Active Directory. For more information about previews, see  [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)|
|     |

To enable your users to register authentication methods for both Azure Multi-Factor Authentication and self-service password reset in a single experience, complete the following steps:

1. Sign in to the Azure portal as a global administrator or user administrator.
2. Browse to **Azure Active Directory**, **User settings**, **Manage settings for access panel preview features**.
3. Under **Users can use preview features for registering and managing security info**, you can choose to enable for a **Selected** group of users or for **All** users.

Users can now go to [https://aka.ms/setupsecurityinfo](https://aka.ms/setupsecurityinfo) to register their authentication methods for both MFA and SSPR. To learn more about what your users will see in this new experience, see our [end user documentation](https://aka.ms/securityinfoguide).  

> [!NOTE]
> Once you enable this experience, users who register or confirm their phone number or mobile app through the new experience will have the ability to use them for MFA and SSPR, if those methods are enabled in the MFA and SSPR policies. If you then disable this experience, users who navigate to the previous SSPR registration page at aka.ms/ssprsetup will be required to perform MFA before they can access the page.  

## How it works

If a user has previously registered authentication methods through the separate MFA and SSPR registration experiences, they do not need to register that information again. However, if your settings require users to register for MFA or SSPR, they may see a prompt to review their security info when signing in.

If a user has registered a method that can be used for MFA, they will be prompted to perform MFA before they can access the new experience.

If you have enforced registration for MFA or SSPR and a user has not yet registered, they will be prompted to register when they sign in.

Users who are prompted to register while signing in will see the following experience:

![Converged registration. Set up methods as a new user](./media/concept-registration-mfa-sspr-converged/concept-registration-add-methods.png)

> [!NOTE]
> This experience will only be shown when a user is prompted to register while signing in. Users who go directly to the new experience at aka.ms/setupsecurityinfo will see a different version of the experience, which is described later in this article.

The authentication methods shown will change based on the methods enabled in your MFA or SSPR policies. The user will be asked to register the minimum number of authentication methods needed to be compliant with the MFA policy, SSPR policy, or both. If there is flexibility in which authentication methods the user can register, they can select **Choose security info** to choose other authentication methods.  

> [!NOTE]
> If you enable the use of both mobile app notification and mobile app code, users who register the Microsoft Authenticator app using a notification are able to use both notification and code to verify their identity.

Unlike the previous MFA registration experience, users will not be prompted to register an app password when going through the new registration experience. Instead they should follow the steps listed in our apps passwords tutorial to register app passwords in the new experience.  

Once a user completes registration, their default MFA method will automatically be set. If the user registered an authenticator app, the default method will be set to app. If the user did not register an authenticator app and only registered their phone number, the default method will be set to phone call. Users can change their default by going to [https://aka.ms/setupsecurityinfo](https://aka.ms/setupsecurityinfo) and selecting **Change default**.  

If registration is not enforced, users can manage their own authentication methods at [https://aka.ms/setupsecurityinfo](https://aka.ms/setupsecurityinfo). If a user has previously registered a method that can be used to perform MFA, they will be asked to perform MFA before they can access the page.  

![Converged registration. Edit methods as a registered user](./media/concept-registration-mfa-sspr-converged/concept-registration-edit-methods.png)

On this page, users will see previously registered authentication methods and authentication methods registered for them such as Office phone. Users can also add, edit, or delete their authentication methods (excluding Office phone).  

Audit logs for this new experience exist under the Authentication Methods category of the audit log.  

## Known issues

**Default MFA method is set to phone call when user registers phone using text message**

   * Some users may notice that their default MFA method is set to phone call after they register their phone number using text message. Users can resolve this issue by changing their default method by following the instructions found in the article [Manage your security info (preview)](../user-help/security-info-manage-settings.md#change-your-info).

**User unable to access the new registration experience after admin disables their default method**

   * Some users may not be able to access the new registration experience if their previously registered default MFA method has been disabled by their administrator. Here is an example scenario:
      1. User previously registered their phone number and set their default method to phone call.
      2. Admin disables phone call as an MFA method for the tenant.
      3. User is prompted to register during sign-in because they need to register an additional method to meet the tenant SSPR policy.
      4. User tries to register but cannot access the page due to not having a default method set and is stuck in a loop.

## Next steps

[Learn how to deploy Azure AD self-service password reset](howto-sspr-deployment.md)

[Learn how to require multi-factor authentication when signing in](howto-mfa-getstarted.md)

[End-user authentication method configuration documentation](https://aka.ms/securityinfoguide)