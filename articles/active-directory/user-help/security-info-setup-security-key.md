---
title: Set up and use a security key (preview) - Azure Active Directory | Microsoft Docs
description: How to set up your security info to verify your identity using a Fast Identity Online (FIDO2) security key.
services: active-directory
author: eross-msft
manager: daveba
ms.reviewer: librown

ms.service: active-directory
ms.workload: identity
ms.subservice: user-help
ms.topic: conceptual
ms.date: 07/01/2019
ms.author: lizross
ms.collection: M365-identity-device-management
---

# Set up and use a security key (Preview)

You can use security keys as a passwordless sign-in method within your organization. A security key is a physical device that's used with a unique PIN to sign-in to your work or school account. Because security keys require you to have the physical device and something only you know, it's considered a stronger authentication method than a username and password.

[!INCLUDE [preview-notice](../../../includes/active-directory-end-user-preview-notice-security-key.md)]

>[!Important]
>This content is intended for users. If you're an administrator, you can find more information about how to set up and manage your Azure Active Directory (Azure AD) environment in the [Azure Active Directory Documentation](https://docs.microsoft.com/azure/active-directory).

## What is a security key?

We currently support several designs and providers of security keys using the [Fast Identity Online (FIDO)](https://fidoalliance.org/fido2/) (FIDO2) passwordless authentication method. This method allows you to sign in to your work or school account once to get access to all of your organization's cloud-based resources and supported browsers.

Your administrator or your organization will provide you with a security key if they require it for your work or school account. There are different types of security keys that you can use, like a USB key that you plug in to your device or an NFC key that you tap on an NFC reader. You can find out more information about your security key, including what type it is, from the manufacturer's documentation.

> [!Note]
> If you're unable to use a FIDO2 security key, there are other passwordless authentication methods you can use such as the Microsoft Authenticator app or Windows Hello. For more information about the Microsoft Authenticator app, see [What is the Microsoft Authenticator app?](https://docs.microsoft.com/azure/active-directory/user-help/user-help-auth-app-overview). For more information about Windows Hello, see [Windows Hello overview](https://www.microsoft.com/windows/windows-hello).

## Supported configurations

If this feature is turned on by your administrator and organization during our public preview, you can use security keys with your work or school account, on devices running Windows 10, version 1903 and the Microsoft Edge browser.

## How to set up and use your security key

You must prepare your security key to work with Windows and your PIN number before you can sign in to your account.

1. Before you begin, double-check that:

    a. Your administrator has turned on this feature for use within your organization.
    
    b. You have received a compatible security key from your administrator or your organization.

2. Go to the **My Profile** page at https://myprofile.microsoft.com and sign in if you haven't already done so.

3. Select **Security Info** from the left navigation pane.



User registration and management of FIDO2 security keys
Browse to https://myprofile.microsoft.com
Sign in if not already
Click Security Info
If the user already has at least one Azure Multi-Factor Authentication method registered, they can immediately register a FIDO2 security key.
If they don’t have at least one Azure Multi-Factor Authentication method registered, they must add one.
Add a FIDO2 Security key by clicking Add method and choosing Security key
Choose USB device or NFC device
Have your key ready and choose Next
A box will appear and ask you to create/enter a PIN for your security key, then perform the required gesture for your key either biometric or touch.
You will be returned to the combined registration experience and asked to provide a meaningful name for your token so you can identify which one if you have multiple. Click Next.
Click Done to complete the process
Manage security key biometric, PIN, or reset security key
Windows 10 version 1809
Companion software from the security key vendor is required
Windows 10 version 1903 or higher
Users can open Windows Settings on their device > Accounts > Security Key
Users can change their PIN, update biometrics, or reset their security key

User registration and management of Microsoft Authenticator app (https://docs.microsoft.com/en-us/azure/active-directory/authentication/howto-authentication-passwordless-enable#user-registration-and-management-of-microsoft-authenticator-app)
To configure the Microsoft Authenticator app for phone sign in, follow the guidance in the article Sign in to your accounts using the Microsoft Authenticator app.

Sign in with passwordless credentials
Sign in at the lock screen
In the example below a user Bala Sandhu has already provisioned their FIDO2 security key. Bala can choose the security key credential provider from the Windows 10 lock screen and insert the security key to sign into Windows.

Security key sign in at the Windows 10 lock screen

Sign in on the web
In the example below a user has already provisioned their FIDO2 security key. The user can choose to sign in on the web with their FIDO2 security key inside of the Microsoft Edge browser on Windows 10 version 1809 or higher.

Security key sign in Microsoft Edge

For information about signing in using the Microsoft Authenticator app see the article, Sign in to your accounts using the Microsoft Authenticator app.

Known issues
FIDO2 security keys
Security key provisioning
Administrator provisioning and de-provisioning of security keys is not available in the public preview.

Hybrid Azure AD join
Users relying on WIA SSO that use managed credentials like FIDO2 security keys or passwordless sign in with Microsoft Authenticator app need to Hybrid Join on Windows 10 to get the benefits of SSO. However, security keys only work for Azure Active Directory Joined machines for now. We recommend you only try out FIDO2 security keys for the Windows lock screen on pure Azure Active Directory Joined machines. This limitation doesn’t apply for the web.

UPN changes
We are working on supporting a feature that allows UPN change on hybrid AADJ and AADJ devices. If a user’s UPN changes, you can no longer modify FIDO2 security keys to account for that. So the only approach is to reset the device and the user has to re-register.

Authenticator app
AD FS integration
When a user has enabled the Microsoft Authenticator passwordless credential, authentication for that user will always default to sending a notification for approval. This logic prevents users in a hybrid tenant from being directed to ADFS for sign in verification without the user taking an additional step to click “Use your password instead.” This process will also bypass any on-premises Conditional Access policies, and Pass-through authentication flows. The exception to this process is if a login_hint is specified, a user will be autoforwarded to AD FS, and bypass the option to use the passwordless credential.

Azure MFA server
End users who are enabled for MFA through an organization’s on-premises Azure MFA server can still create and use a single passwordless phone sign in credential. If the user attempts to upgrade multiple installations (5+) of the Microsoft Authenticator with the credential, this change may result in an error.

Device registration
One of the prerequisites to create this new, strong credential, is that the device where it resides is registered within the Azure AD tenant, to an individual user. Due to device registration restrictions, a device can only be registered in a single tenant. This limit means that only one work or school account in the Microsoft Authenticator app can be enabled for phone sign in.







Because your data is stored locally, you're prompted to insert and touch your personal security key device during sign-in.

## How to reset a Microsoft-compatible security key?

You can reset your Microsoft-compatible security key from the **Windows Settings** app.

>[!IMPORTANT]
>Resetting your security key deletes everything from the key, resetting it to factory defaults.
>
> **All data and credentials will be cleared.**

### To reset your security key

1. Open the Windows Settings app, select **Accounts**, select **Sign-in options**, select **Security Key**, and then select **Manage**.

2. Follow the on-screen instructions, based on your specific security key manufacturer. If your key manufacturer isn't listed in the on-screen instructions, refer to the manufacturer's site for more information.
 



Follow the instructions in the Settings app and look for specific instructions based on your security key manufacturer below:

|Security key manufacturer</br> | Reset instructions </br> |
| --- | --- | 
|Yubico | **USB:** Remove and re-insert the security key. When the LED on the security key begins flashing, touch the metal contact  <br> **NFC:** Tap the security key on the reader <br>|
|Feitian | Touch the blinking fingerprint sensor twice to reset the key|
|HID | Tap the card on the reader twice to reset it |


## Next steps

- For more information about alternate passwordless authentication methods, see [What is the Microsoft Authenticator app?](https://docs.microsoft.com/azure/active-directory/user-help/user-help-auth-app-overview) and [Windows Hello overview](https://www.microsoft.com/windows/windows-hello).

- Detailed info about [Microsoft-compliant security keys](https://docs.microsoft.com/windows/security/identity-protection/hello-for-business/microsoft-compatible-security-key)
