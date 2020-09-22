---
title: Passwordless sign-in with the Microsoft Authenticator app - Azure Active Directory
description: Enable passwordless sign-in to Azure AD using the Microsoft Authenticator app (preview)

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 11/21/2019

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: librown

ms.collection: M365-identity-device-management
---
# Enable passwordless sign-in with the Microsoft Authenticator app (preview)

The Microsoft Authenticator app can be used to sign in to any Azure AD account without using a password. Similar to the technology of [Windows Hello for Business](/windows/security/identity-protection/hello-for-business/hello-identity-verification), the Microsoft Authenticator uses key-based authentication to enable a user credential that is tied to a device and uses a biometric or PIN. This authentication method can be used on any device platform, including mobile, and with any app or website that integrates with Microsoft authentication libraries. 

![Example of a browser sign-in asking for user to approve the sign-in](./media/howto-authentication-passwordless-phone/phone-sign-in-microsoft-authenticator-app.png)

Instead of seeing a prompt for a password after entering a username, a person who has enabled phone sign-in from the Microsoft Authenticator app will see a message telling them to tap a number in their app. In the app, the user must match the number, choose Approve, then provide their PIN or biometric, then the authentication will complete.

## Prerequisites

- Azure Multi-Factor Authentication, with push notifications allowed as a verification method 
- Latest version of Microsoft Authenticator installed on devices running iOS 8.0 or greater, or Android 6.0 or greater.

> [!NOTE]
> If you enabled Microsoft Authenticator app passwordless sign-in preview using Azure AD PowerShell, it was enabled for your entire directory. If you enable using this new method, it will supercede the PowerShell policy. We recommend enabling for all users in your tenant via the new Authentication Methods, otherwise users not in the new policy will no longer be able to log in passwordlessly. 

## Enable passwordless authentication methods

### Enable the combined registration experience

Registration features for passwordless authentication methods rely on the combined registration feature. Follow the steps in the article [Enable combined security information registration](howto-registration-mfa-sspr-combined.md), to enable combined registration.

### Enable passwordless phone sign-in authentication methods

1. Sign in to the [Azure portal](https://portal.azure.com) with a **global admin** account.
1. Search for and select *Azure Active Directory*. Select **Security** > **Authentication methods** > **Authentication method policy (Preview)**
1. Under **Passwordless phone sign-in**, choose the following options
   1. **Enable** - Yes or No
   1. **Target** - All users or Select users
1. **Save** to set the new policy

## User registration and management of Microsoft Authenticator app

1. Browse to [https://aka.ms/mysecurityinfo](https://aka.ms/mysecurityinfo)
1. Sign in if not already
1. Add an authenticator app by clicking **Add method**, choosing **Authenticator app**, and clicking **Add**
1. Follow the instructions to install and configure the Microsoft Authenticator app on your device
1. Click **Done** to complete Authenticator MFA app setup flow. 
1. In **Microsoft Authenticator**, choose **Enable phone sign-in** from the account drop-down menu
1. Follow the instructions in the app to finish registering for passwordless phone sign-in. 

Organizations can point their users to the article [Sign in with your phone, not your password](../user-help/user-help-auth-app-sign-in.md) for further assistance setting up in the Microsoft Authenticator app and enabling phone sign-in. 

> [!NOTE]
> Users who are not allowed by policy to use phone sign-in are no longer able to enable it within the Microsoft Authenticator app.  

## Sign in with passwordless credential

A user can start to use passwordless sign-in once an admin has enabled their tenant **and** the user has updated their Microsoft Authenticator app to enable phone sign-in.

To start using phone sign-in, after typing a username at the sign-in page and selecting **Next**, users may have to click **Other ways to sign in** then **Approve a request on my Microsoft Authenticator app**. Users are then presented with a number and are prompted in their Microsoft Authenticator app to select the appropriate number to authenticate instead of using their password. Once users have used passwordless phone sign-in, they will be prompted to use it again, until they use choose another method. 

![Example of a browser sign-in using the Microsoft Authenticator app](./media/howto-authentication-passwordless-phone/web-sign-in-microsoft-authenticator-app.png)

## Known Issues

### Not seeing option for passwordless phone sign-in

If a user has an unanswered passwordless phone sign-in verification pending and attempts to sign in again, the user may only see an option to enter a password instead. Open the Microsoft Authenticator and respond to any notification prompts to continue to use passwordless phone sign-in.   

### Federated Accounts

When a user has enabled any passwordless credential, Azure AD logins will stop using login_hint to accelerate the user to a federated login location. This logic prevents users in a hybrid tenant from being directed to AD FS for sign-in verification without the user taking an additional step to click "Use your password instead."

### Azure MFA server

End users who are enabled for MFA through an organization's on-premises Azure MFA server can still create and use a single passwordless phone sign in credential. If the user attempts to upgrade multiple installations (5+) of the Microsoft Authenticator with the credential, this change may result in an error.  

### Device registration

One of the prerequisites to create this new strong credential, is that the device, where the Microsoft Authenticator app is installed, must also be registered within the Azure AD tenant to an individual user. Due to current device registration restrictions, a device can only be registered in a single tenant. This limit means that only one work or school account in the Microsoft Authenticator app can be enabled for phone sign-in.

> [!NOTE]
> Device registration is not the same as device management or "MDM." It only associates a device ID and a user ID together in the Azure AD directory.  

## Next steps

[Learn how passwordless authentication works](concept-authentication-passwordless.md)

[Learn about device registration](../devices/overview.md#getting-devices-in-azure-ad)

[Learn about Azure Multi-Factor Authentication](../authentication/howto-mfa-getstarted.md)
