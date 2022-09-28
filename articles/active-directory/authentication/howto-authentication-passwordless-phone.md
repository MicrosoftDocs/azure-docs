---
title: Passwordless sign-in with Microsoft Authenticator - Azure Active Directory
description: Enable passwordless sign-in to Azure AD using Microsoft Authenticator


services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 09/15/2022


ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: librown

ms.collection: M365-identity-device-management
---
# Enable passwordless sign-in with Microsoft Authenticator 

Microsoft Authenticator can be used to sign in to any Azure AD account without using a password. Microsoft Authenticator uses key-based authentication to enable a user credential that is tied to a device, where the device uses a PIN or biometric. [Windows Hello for Business](/windows/security/identity-protection/hello-for-business/hello-identity-verification) uses a similar technology.


This authentication technology can be used on any device platform, including mobile. This technology can also be used with any app or website that integrates with Microsoft Authentication Libraries.

:::image type="content" border="false" source="./media/howto-authentication-passwordless-phone/phone-sign-in-microsoft-authenticator-app-next.png" alt-text="Screenshot that shows an example of a browser sign-in asking for the user to approve the sign-in.":::

People who enabled phone sign-in from Microsoft Authenticator see a message that asks them to tap a number in their app. No username or password is asked for. To complete the sign-in process in the app, a user must next take the following actions:

1. Enter the number they see on the login screen into Microsoft Authenticator dialog.
1. Choose **Approve**.
1. Provide their PIN or biometric.

## Multiple accounts on iOS (preview)

You can enable passwordless phone sign-in for multiple accounts in Microsoft Authenticator on any supported iOS device. Consultants, students, and others with multiple accounts in Azure AD can add each account to Microsoft Authenticator and use passwordless phone sign-in for all of them from the same iOS device. 

Previously, admins might not require passwordless sign-in for users with multiple accounts because it requires them to carry more devices for sign-in. By removing the limitation of one user sign-in from a device, admins can more confidently encourage users to register passwordless phone sign-in and use it as their default sign-in method.

The Azure AD accounts can be in the same tenant or different tenants. Guest accounts aren't supported for multiple account sign-in from one device.

>[!NOTE]
>Multiple accounts on iOS is currently in public preview. Some features might not be supported or have limited capabilities. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). 

## Prerequisites

To use passwordless phone sign-in with Microsoft Authenticator, the following prerequisites must be met:

- Recommended: Azure AD Multi-Factor Authentication, with push notifications allowed as a verification method. Push notifications to your smartphone or tablet help the Authenticator app to prevent unauthorized access to accounts and stop fraudulent transactions. The Authenticator app automatically generates codes when set up to do push notifications so a user has a backup sign-in method even if their device doesn't have connectivity. 
- Latest version of Microsoft Authenticator installed on devices running iOS or Android.
- For Android, the device that runs Microsoft Authenticator must be registered to an individual user. We're actively working to enable multiple accounts on Android. 
- For iOS, the device must be registered with each tenant where it's used to sign in. For example, the following device must be registered with Contoso and Wingtiptoys to allow all accounts to sign in:
  - balas@contoso.com
  - balas@wingtiptoys.com and bsandhu@wingtiptoys
- For iOS, we recommend enabling the option in Microsoft Authenticator to allow Microsoft to gather usage data. It's not enabled by default. To enable it in Microsoft Authenticator, go to **Settings** > **Usage Data**.
  
  :::image type="content" border="true" source="./media/howto-authentication-passwordless-phone/telemetry.png" alt-text="Screenshot of Usage Data in Microsoft Authenticator.":::

To use passwordless authentication in Azure AD, first enable the combined registration experience, then enable users for the passwordless method.

## Enable passwordless phone sign-in authentication methods

Azure AD lets you choose which authentication methods can be used during the sign-in process. Users then register for the methods they'd like to use. The **Microsoft Authenticator** authentication method policy manages both the traditional push MFA method, as well as the passwordless authentication method. 

> [!NOTE]
> If you enabled Microsoft Authenticator passwordless sign-in using Azure AD PowerShell, it was enabled for your entire directory. If you enable using this new method, it supersedes the PowerShell policy. We recommend you enable for all users in your tenant via the new **Authentication Methods** menu, otherwise users who aren't in the new policy can't sign in without a password.

To enable the authentication method for passwordless phone sign-in, complete the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com) with an *Authentication Policy Administrator* account.
1. Search for and select *Azure Active Directory*, then browse to **Security** > **Authentication methods** > **Policies**.
1. Under **Microsoft Authenticator**, choose the following options:
   1. **Enable** - Yes or No
   1. **Target** - All users or Select users
1. Each added group or user is enabled by default to use Microsoft Authenticator in both passwordless and push notification modes ("Any" mode). To change this, for each row:
   1. Browse to **...** > **Configure**.
   1. For **Authentication mode** - choose **Any**, or **Passwordless**. Choosing **Push** prevents the use of the passwordless phone sign-in credential. 
1. To apply the new policy, click **Save**. 

   >[!NOTE]
   >If you see an error when you try to save, the cause might be due to the number of users or groups being added. As a workaround, replace the users and groups you are trying to add with a single group, in the same operation, and then click **Save** again.

## User registration and management of Microsoft Authenticator

Users register themselves for the passwordless authentication method of Azure AD by using the following steps:

1. Browse to [https://aka.ms/mysecurityinfo](https://aka.ms/mysecurityinfo).
1. Sign in, then click **Add method** > **Authenticator app** > **Add** to add Microsoft Authenticator.
1. Follow the instructions to install and configure the Microsoft Authenticator app on your device.
1. Select **Done** to complete Authenticator configuration.
1. In **Microsoft Authenticator**, choose **Enable phone sign-in** from the drop-down menu for the account registered.
1. Follow the instructions in the app to finish registering the account for passwordless phone sign-in.

An organization can direct its users to sign in with their phones, without using a password. For further assistance configuring Microsoft Authenticator and enabling phone sign-in, see [Sign in to your accounts using the Microsoft Authenticator app](https://support.microsoft.com/account-billing/sign-in-to-your-accounts-using-the-microsoft-authenticator-app-582bdc07-4566-4c97-a7aa-56058122714c).

> [!NOTE]
> Users who aren't allowed by policy to use phone sign-in are no longer able to enable it within Microsoft Authenticator.

## Sign in with passwordless credential

A user can start to utilize passwordless sign-in after all the following actions are completed:

- An admin has enabled the user's tenant.
- The user has added Microsoft Authenticator as a sign-in method.


The first time a user starts the phone sign-in process, the user performs the following steps:

1. Enters their name at the sign-in page.
2. Selects **Next**.
3. If necessary, selects **Other ways to sign in**.
4. Selects **Approve a request on my Authenticator app**.

The user is then presented with a number. The app prompts the user to authenticate by typing the appropriate number, instead of by entering a password.

After the user has utilized passwordless phone sign-in, the app continues to guide the user through this method. However, the user will see the option to choose another method.

:::image type="content" border="true" source="./media/howto-authentication-passwordless-phone/number.png" alt-text="Screenshot that shows an example of a browser sign-in using the Microsoft Authenticator app.":::

## Known Issues

The following known issues exist.

### Not seeing option for passwordless phone sign-in

In one scenario, a user can have an unanswered passwordless phone sign-in verification that is pending. Yet the user might attempt to sign in again. When this happens, the user might see only the option to enter a password.

To resolve this scenario, the following steps can be used:

1. Open Microsoft Authenticator.
2. Respond to any notification prompts.

Then the user can continue to utilize passwordless phone sign-in.

### Federated Accounts

When a user has enabled any passwordless credential, the Azure AD login process stops using the login\_hint. Therefore the process no longer accelerates the user toward a federated login location.

This logic generally prevents a user in a hybrid tenant from being directed to Active Directory Federated Services (AD FS) for sign-in verification. However, the user retains the option of clicking **Use your password instead**.

### On-premises users

An end user can be enabled for multifactor authentication (MFA) through an on-premises. The user can still create and utilize a single passwordless phone sign-in credential.

If the user attempts to upgrade multiple installations (5+) of Microsoft Authenticator with the passwordless phone sign-in credential, this change might result in an error.


## Next steps

To learn about Azure AD authentication and passwordless methods, see the following articles:

- [Learn how passwordless authentication works](concept-authentication-passwordless.md)
- [Learn about device registration](../devices/overview.md)
- [Learn about Azure AD Multi-Factor Authentication](../authentication/howto-mfa-getstarted.md)
