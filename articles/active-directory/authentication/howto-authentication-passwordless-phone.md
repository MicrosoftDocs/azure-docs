---
title: Passwordless sign-in with the Microsoft Authenticator app - Azure Active Directory
description: Enable passwordless sign-in to Azure AD using the Microsoft Authenticator app 

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 04/21/2021

ms.author: justinha
author: justinha
manager: daveba
ms.reviewer: librown

ms.collection: M365-identity-device-management
---
# Enable passwordless sign-in with the Microsoft Authenticator app 

The Microsoft Authenticator app can be used to sign in to any Azure AD account without using a password. Microsoft Authenticator uses key-based authentication to enable a user credential that is tied to a device, where the device uses a PIN or biometric. [Windows Hello for Business](/windows/security/identity-protection/hello-for-business/hello-identity-verification) uses a similar technology.

This authentication technology can be used on any device platform, including mobile. This technology can also be used with any app or website that integrates with Microsoft Authentication Libraries.

:::image type="content" border="false" source="./media/howto-authentication-passwordless-phone/phone-sign-in-microsoft-authenticator-app.png" alt-text="Example of a browser sign-in asking for the user to approve the sign-in.":::

People who enabled phone sign-in from the Microsoft Authenticator app see a message that asks them to tap a number in their app. No username or password is asked for. To complete the sign-in process in the app, a user must next take the following actions:

1. Match the number.
2. Choose **Approve**.
3. Provide their PIN or biometric.

## Prerequisites

To use passwordless phone sign-in with the Microsoft Authenticator app, the following prerequisites must be met:

- Azure AD Multi-Factor Authentication, with push notifications allowed as a verification method.
- Latest version of Microsoft Authenticator installed on devices running iOS 8.0 or greater, or Android 6.0 or greater.
- The device on which the Microsoft Authenticator app is installed must be registered within the Azure AD tenant to an individual user. 

> [!NOTE]
> If you enabled Microsoft Authenticator passwordless sign-in using Azure AD PowerShell, it was enabled for your entire directory. If you enable using this new method, it supercedes the PowerShell policy. We recommend you enable for all users in your tenant via the new *Authentication Methods* menu, otherwise users not in the new policy are no longer be able to sign in without a password.

## Enable passwordless authentication methods

To use passwordless authentication in Azure AD, first enable the combined registration experience, then enable users for the password less method.

### Enable the combined registration experience

Registration features for passwordless authentication methods rely on the combined registration feature. To let users complete the combined registration themselves, follow the steps to [enable combined security information registration](howto-registration-mfa-sspr-combined.md).

### Enable passwordless phone sign-in authentication methods

Azure AD lets you choose which authentication methods can be used during the sign-in process. Users then register for the methods they'd like to use.

To enable the authentication method for passwordless phone sign-in, complete the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com) with a *global administrator* account.
1. Search for and select *Azure Active Directory*, then browse to **Security** > **Authentication methods** > **Policies**.
1. Under **Microsoft Authenticator**, choose the following options:
   1. **Enable** - Yes or No
   1. **Target** - All users or Select users
1. Each added group or user is enabled by default to use Microsoft Authenticator in both passwordless and push notification modes ("Any" mode). To change this, for each row:
   1. Browse to **...** > **Configure**.
   1. For **Authentication mode** - Any, Passwordless, or Push
1. To apply the new policy, select **Save**.

## User registration and management of Microsoft Authenticator

Users register themselves for the passwordless authentication method of Azure AD by using the following steps:

1. Browse to [https://aka.ms/mysecurityinfo](https://aka.ms/mysecurityinfo).
1. Sign in, then add the Authenticator app by selecting **Add method > Authenticator app**, then **Add**.
1. Follow the instructions to install and configure the Microsoft Authenticator app on your device.
1. Select **Done** to complete Authenticator configuration.
1. In **Microsoft Authenticator**, choose **Enable phone sign-in** from the drop-down menu for the account registered.
1. Follow the instructions in the app to finish registering the account for passwordless phone sign-in.

An organization can direct its users to sign in with their phones, without using a password. For further assistance configuring the Microsoft Authenticator app and enabling phone sign-in, see [Sign in to your accounts using the Microsoft Authenticator app](../user-help/user-help-auth-app-sign-in.md).

> [!NOTE]
> Users who aren't allowed by policy to use phone sign-in are no longer able to enable it within the Microsoft Authenticator app.

## Sign in with passwordless credential

A user can start to utilize passwordless sign-in after all the following actions are completed:

- An admin has enabled the user's tenant.
- The user has updated her Microsoft Authenticator app to enable phone sign-in.

The first time a user starts the phone sign-in process, the user performs the following steps:

1. Enters her name at the sign-in page.
2. Selects **Next**.
3. If necessary, selects **Other ways to sign in**.
4. Selects **Approve a request on my Microsoft Authenticator app**.

The user is then presented with a number. The app prompts the user to authenticate by selecting the appropriate number, instead of by entering a password.

After the user has utilized passwordless phone sign-in, the app continues to guide the user through this method. However, the user will see the option to choose another method.

:::image type="content" border="false" source="./media/howto-authentication-passwordless-phone/web-sign-in-microsoft-authenticator-app.png" alt-text="Example of a browser sign-in using the Microsoft Authenticator app.":::

## Known Issues

The following known issues exist.

### Not seeing option for passwordless phone sign-in

In one scenario, a user can have an unanswered passwordless phone sign-in verification that is pending. Yet the user might attempt to sign in again. When this happens, the user might see only the option to enter a password.

To resolve this scenario, the following steps can be used:

1. Open the Microsoft Authenticator app.
2. Respond to any notification prompts.

Then the user can continue to utilize passwordless phone sign-in.

### Federated Accounts

When a user has enabled any passwordless credential, the Azure AD login process stops using the login\_hint. Therefore the process no longer accelerates the user toward a federated login location.

This logic generally prevents a user in a hybrid tenant from being directed to Active Directory Federated Services (AD FS) for sign-in verification. However, the user retains the option of clicking **Use your password instead**.

### Azure MFA server

An end user can be enabled for multi-factor authentication (MFA), through an on-premises Azure MFA server. The user can still create and utilize a single passwordless phone sign-in credential.

If the user attempts to upgrade multiple installations (5+) of the Microsoft Authenticator app with the passwordless phone sign-in credential, this change might result in an error.

### Device registration

Before you can create this new strong credential, there are prerequisites. One prerequisite is that the device on which the Microsoft Authenticator app is installed must be registered within the Azure AD tenant to an individual user.

Currently, a device can only be registered in a single tenant. This limit means that only one work or school account in the Microsoft Authenticator app can be enabled for phone sign-in.

> [!NOTE]
> Device registration is not the same as device management or mobile device management (MDM). Device registration only associates a device ID and a user ID together, in the Azure AD directory.

## Next steps

To learn about Azure AD authentication and passwordless methods, see the following articles:

- [Learn how passwordless authentication works](concept-authentication-passwordless.md)
- [Learn about device registration](../devices/overview.md#getting-devices-in-azure-ad)
- [Learn about Azure AD Multi-Factor Authentication](../authentication/howto-mfa-getstarted.md)
