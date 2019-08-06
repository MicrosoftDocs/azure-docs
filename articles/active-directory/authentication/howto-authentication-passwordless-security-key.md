---
title: Enable passwordless security key sign in for Azure AD (preview) - Azure Active Directory
description: Enable passwordless security key sign in to Azure AD using FIDO2 security keys (preview)

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 08/05/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: librown

ms.collection: M365-identity-device-management
---
# Enable passwordless security key sign in for Azure AD (preview)

## Requirements

* Azure Multi-Factor Authentication
* Combined registration preview with users enabled for SSPR
* FIDO2 security key preview requires compatible FIDO2 security keys
* WebAuthN requires Microsoft Edge on Windows 10 version 1809 or higher
* FIDO2 based Windows sign in requires Azure AD joined Windows 10 version 1809 or higher

## Prepare devices for preview

Devices that you will be piloting with must be running Windows 10 version 1809 or higher. The best experience is on Windows 10 version 1903 or higher.

## Enable security keys for Windows sign in

Organizations may choose to use one or more of the following methods to enable the use of security keys for Windows sign in.

### Enable credential provider via Intune

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Browse to **Microsoft Intune** > **Device enrollment** > **Windows enrollment** > **Windows Hello for Business** > **Properties**.
1. Under **Settings** set **Use security keys for sign-in** to **Enabled**.

Configuration of security keys for sign in, is not dependent on configuring Windows Hello for Business.

#### Enable targeted Intune deployment

To target specific device groups to enable the credential provider, use the following custom settings via Intune. 

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Browse to **Microsoft Intune** > **Device configuration** > **Profiles** > **Create profile**.
1. Configure the new profile with the following settings
   1. Name: Security Keys for Windows Sign-In
   1. Description: Enables FIDO Security Keys to be used during Windows Sign In
   1. Platform: Windows 10 and later
   1. Platform type: Custom
   1. Custom OMA-URI Settings:
      1. Name: Turn on FIDO Security Keys for Windows Sign-In
      1. OMA-URI: ./Device/Vendor/MSFT/PassportForWork/SecurityKey/UseSecurityKeyForSignin
      1. Data Type: Integer
      1. Value: 1 
1. This policy can be assigned to specific users, devices, or groups. More information can be found in the article [Assign user and device profiles in Microsoft Intune](https://docs.microsoft.com/intune/device-profile-assign).

![Intune custom device configuration policy creation](./media/howto-authentication-passwordless-security-key/intune-custom-profile.png)

### Enable credential provider via provisioning package

For devices not managed by Intune, a provisioning package can be installed to enable the functionality. The Windows Configuration Designer app can be installed from the [Microsoft Store](https://www.microsoft.com/store/apps/9nblggh4tx22).

1. Launch the Windows Configuration Designer.
1. Select **File** > **New project**.
1. Give your project a name and take note of the path where your project is created.
1. Select **Next**.
1. Leave **Provisioning package** selected as the **Selected project workflow** and select **Next**.
1. Select **All Windows desktop editions** under **Choose which settings to view and configure** and select **Next**.
1. Select **Finish**.
1. In your newly created project, browse to **Runtime settings** > **WindowsHelloForBusiness** > **SecurityKeys** > **UseSecurityKeyForSignIn**.
1. Set **UseSecurityKeyForSignIn** to **Enabled**.
1. Select **Export** > **Provisioning package**
1. Leave the defaults in the **Build** window under **Describe the provisioning package** and select **Next**.
1. Leave the defaults in the **Build** window under **Select security details for the provisioning package** and select **Next**.
1. Take note of or change the path in the **Build** windows under **Select where to save the provisioning package** and select **Next**.
1. Select **Build** on the **Build the provisioning package** page.
1. Save the two files created (ppkg and cat) to a location where you can apply them to machines later.
1. Follow the guidance in the article [Apply a provisioning package](https://docs.microsoft.com/windows/configuration/provisioning-packages/provisioning-apply-package), to apply the provisioning package you created.

## Obtain FIDO2 security keys

See the section FIDO2 Security Keys, in the article [What is passwordless?](concept-authentication-passwordless.md) for more information about supported keys and manufacturers.

> [!NOTE]
> If you purchase and plan to use NFC based security keys you will need a supported NFC reader.

## Enable passwordless authentication method

### Enable the combined registration experience

Registration features for passwordless authentication methods rely on the combined registration preview. Follow the steps in the article [Enable combined security information registration (preview)](howto-registration-mfa-sspr-combined.md), to enable the combined registration preview.

### Enable new passwordless authentication method

1. Sign in to the [Azure portal](https://portal.azure.com)
1. Browse to **Azure Active Directory** > **Security** > **Authentication methods** > **Authentication method policy (Preview)**
1. Under each **Method**, choose the following options
   1. **Enable** - Yes or No
   1. **Target** - All users or Select users
1. **Save** each method

> [!WARNING]
> The FIDO2 “Key restriction policies” do not work yet. This functionality will be available before general availability, please do not change these policies from default.

> [!NOTE]
> You don’t need to opt in to both of the passwordless methods (if you want to preview only one passwordless method, you can enable only that method). We encourage you try out both methods since they both have their own benefits.

## User registration and management of FIDO2 security keys

1. Browse to [https://myprofile.microsoft.com](https://myprofile.microsoft.com)
1. Sign in if not already
1. Click **Security Info**
   1. If the user already has at least one Azure Multi-Factor Authentication method registered, they can immediately register a FIDO2 security key.
   1. If they don’t have at least one Azure Multi-Factor Authentication method registered, they must add one.
1. Add a FIDO2 Security key by clicking **Add method** and choosing **Security key**
1. Choose **USB device** or **NFC device**
1. Have your key ready and choose **Next**
1. A box will appear and ask you to create/enter a PIN for your security key, then perform the required gesture for your key either biometric or touch.
1. You will be returned to the combined registration experience and asked to provide a meaningful name for your token so you can identify which one if you have multiple. Click **Next**.
1. Click **Done** to complete the process

### Manage security key biometric, PIN, or reset security key

* Windows 10 version 1809
   * Companion software from the security key vendor is required
* Windows 10 version 1903 or higher
   * Users can open **Windows Settings** on their device > **Accounts** > **Security Key**
   * Users can change their PIN, update biometrics, or reset their security key

## User registration and management of Microsoft Authenticator app

To configure the Microsoft Authenticator app for phone sign in, follow the guidance in the article [Sign in to your accounts using the Microsoft Authenticator app](../user-help/user-help-auth-app-sign-in.md).

## Sign in with passwordless credential

### Sign in at the lock screen

In the example below a user Bala Sandhu has already provisioned their FIDO2 security key. Bala can choose the security key credential provider from the Windows 10 lock screen and insert the security key to sign into Windows.

![Security key sign in at the Windows 10 lock screen](./media/howto-authentication-passwordless-security-key/fido2-windows-10-1903-sign-in-lock-screen.png)

### Sign in on the web

In the example below a user has already provisioned their FIDO2 security key. The user can choose to sign in on the web with their FIDO2 security key inside of the Microsoft Edge browser on Windows 10 version 1809 or higher.

![Security key sign in Microsoft Edge](./media/howto-authentication-passwordless-security-key/fido2-windows-10-1903-edge-sign-in.png)

## Known issues

### Security key provisioning

Administrator provisioning and de-provisioning of security keys is not available in the public preview.

### Hybrid Azure AD join

Users relying on WIA SSO that use managed credentials like FIDO2 security keys or passwordless sign in with Microsoft Authenticator app need to Hybrid Join on Windows 10 to get the benefits of SSO. However, security keys only work for Azure Active Directory Joined machines for now. We recommend you only try out FIDO2 security keys for the Windows lock screen on pure Azure Active Directory Joined machines. This limitation doesn’t apply for the web.

### UPN changes

We are working on supporting a feature that allows UPN change on hybrid AADJ and AADJ devices. If a user’s UPN changes, you can no longer modify FIDO2 security keys to account for that. So the only approach is to reset the device and the user has to re-register.

## Next steps

[Learn about device registration](../devices/overview.md)

[Learn about Azure Multi-Factor Authentication](../authentication/howto-mfa-getstarted.md)
