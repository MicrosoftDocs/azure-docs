---
title: Combined registration for Azure AD SSPR and MFA (preview)
description: Azure AD Multi-Factor Authentication and self-service password reset registration (preview)

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 02/15/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sahenry, michmcla

ms.collection: M365-identity-device-management
---
# Combined security information registration (preview)

Before combined registration, users registered authentication methods for Azure Multi-Factor Authentication (MFA) and self-service password reset (SSPR) through two different experiences. Many users were confused that similar methods were used for both Azure MFA and SSPR but they had to register the methods for each feature separately. Now, with combined registration, users can register once and get the benefits of both Azure MFA and SSPR.

Before you enable this new experience for your organization, we recommend that you review this documentation as well as the end user documentation to ensure you understand the functionality and impact of this feature. You can leverage the user documentation to train and prepare your users for the new experience and help to ensure a successful rollout.

|     |
| --- |
| Combined security information registration for Azure Multi-Factor Authentication and Azure AD self-service password reset are public preview features of Azure Active Directory. For more information about previews, see  [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)|
|     |

## Methods available in converged registration

At this time, combined registration supports the following methods and actions for those methods:

|   | Register | Change | Delete | View |
| --- | --- | --- | --- | --- |
| Microsoft Authenticator | Yes (max 5) | No | Yes | Yes |
| Other authenticator app | Yes (max 5) | No | Yes | Yes |
| Hardware token | No | No | Yes | Yes |
| Phone | Yes | Yes | Yes | Yes |
| Alternate phone | Yes | Yes | Yes | Yes |
| Office phone | No | No | No | Yes |
| Email | Yes | Yes | Yes | Yes |
| Security questions | Yes | No | Yes | Yes |
| App passwords | Yes | No | Yes | Yes |

> [!NOTE]
> App passwords are only available to users who have been enforced for MFA. App passwords are not available to users who are enabled for MFA via a conditional access policy.

Users can set the following options as their default method for MFA:

- Microsoft Authenticator – notification
- Authenticator app or hardware token – code
- Phone call
- Text message

As we continue to add more authentication methods such to Azure AD, those methods will be available in combined registration.

## Combined Registration Modes

There are two “modes” of combined registration: Interrupt and Manage. Interrupt mode is a wizard-like experience that is shown to a user when they are prompted to register or refresh their security info while signing in. Manage mode is part of the user’s profile and allows them to manage their security info. For both modes, if a user has previously registered a method that can be used for MFA, they will need to perform MFA before they can access their security info.

### Interrupt Mode

Combined registration respects both MFA and SSPR policies, if both are enabled for your tenant. These policies affect whether a user is interrupted to register during sign in and which methods are available to the user to register.

There are multiple scenarios in which a user would be interrupted to register or refresh their security info while signing in:

* MFA registration enforced through Identity Protection: Users will be asked to register during sign in. They will register MFA methods and SSPR methods (if the user is enabled for SSPR).
* MFA registration enforced through per-user MFA: Users will be asked to register during sign in. They will register MFA methods and SSPR methods (if the user is enabled for SSPR).
* MFA registration enforced through conditional access or other policies: Users will be asked to register when accessing a resource that requires MFA. They will register MFA methods and SSPR methods (if the user is enabled for SSPR).
* SSPR registration enforced: Users will be asked to register during sign in. They will only register SSPR methods
* SSPR refresh enforced: Users are required to review their security info at an interval set by the admin. They will be shown their info and can choose "Looks good" or make changes if needed.

When registration is enforced, users are shown the minimum number of methods needed to be compliant with both MFA and SSPR policies from most to least secure. For example, a user is enabled for SSPR and the SSPR policy required 2 methods to reset and has enabled mobile app code, email, and phone. This user will be required to register two methods and will be shown authenticator app and phone by default. If desired, the user can choose to register email instead of authenticator app or phone.  

The following flowchart describes in detail which methods are shown to a user when they are interrupted to register during sign in:

![INSERT FLOWCHART HERE]()

If you have both MFA and SSPR enabled in your tenant, we recommend that you enforce registration through MFA.

If the SSPR policy requires users to review their security info at a regular interval, the users will be interrupted during sign in and shown all their registered methods. At that point, they can choose “Looks good” if the info is up-to-date or they can choose “Edit info” to make changes.

### Manage mode

Users can access manage mode by going to [https://aka.ms/mysecurityinfo](https://aka.ms/mysecurityinfo) or by choosing “Security info” from My Profile. From there, users can add methods, delete or change existing methods, change their default method, and more.

## Key usage scenarios

### Set up security info during sign in

An admin has enforced registration.

A user has not set up all required security info and navigates to the Azure portal. After entering their username and password, the user is prompted to set up security info. The user then follows the steps shown in the wizard to set up the required security info. The user can choose to set up methods other than what is shown by default if your settings allow. At the end of the wizard, the user reviews the methods they set up and their default method for MFA. To complete the setup process, the user confirms the info and continues to the Azure portal.

### Set up security info from My Profile

An admin has not enforced registration.

A user who has not yet set up all required security info navigates to [https://myprofile.microsoft.com](https://myprofile.microsoft.com). The user then chooses **Security info** from the left-hand navigation. From there, the user chooses to add a method, selects any of the methods available to them, and follows the steps to set up that method. When finished, the user sees the method they just set up on the security info page.

### Delete security info from My Profile

A user who has previously set up at least one method navigates to [https://aka.ms/mysecurityinfo](https://aka.ms/mysecurityinfo). The user chooses to delete one of the previously registered methods. When finished, the user no longer sees that method on the security info page.

### Change default method from My Profile

A user who has previously set up at least one method that can be used for MFA navigates to [https://aka.ms/mysecurityinfo](https://aka.ms/mysecurityinfo). The user changes their current default method to a different default method. When finished, the user sees their new default method on the security info page.

### Set up all enabled methods

From My Profile or during sign in, the user adds all methods available to them from the following list:

* Authenticator app (Microsoft Authenticator or any other authenticator app)
* Phone
* Alternate phone
* Email
* Security questions
* App password

## Next steps

[Enable combined registration in your tenant](howto-registration-mfa-sspr-combined.md)

[Available methods for MFA and SSPR](concept-authentication-methods.md)

[Configure self-service password reset](howto-sspr-deployment.md)

[Configure Azure Multi-Factor Authentication](howto-mfa-getstarted.md)
