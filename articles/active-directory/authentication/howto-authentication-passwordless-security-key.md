---
title: Enable passwordless security key sign-in for Azure AD (preview) - Azure Active Directory
description: Enable passwordless security key sign-in to Azure AD using FIDO2 security keys (preview)

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 08/05/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: librown, aakapo

ms.collection: M365-identity-device-management
---
# Enable passwordless security key sign to Windows 10 devices (preview)

This document focuses on enabling security key based passwordless authentication Windows 10 devices.

For enterprises that use passwords today and have a shared PC environment, security keys provide a seamless way for workers to authenticate without entering a username or password. Security keys provide improved productivity for workers, and have better security.

Users can authenticate to their Windows PC or authenticate in their web browser using supported FIDO2 security keys.

## Requirements

| Device Type | Azure AD joined | Hybrid Azure AD joined |
| --- | --- | --- |
| [Azure Multi-Factor Authentication](howto-mfa-getstarted.md) | X | X |
| [Combined security information registration preview](concept-registration-mfa-sspr-combined.md) | X | X |
| Compatible [FIDO2 security keys](concept-authentication-passwordless.md#fido2-security-keys) | X | X |
| WebAuthN requires Microsoft Edge on Windows 10 version 1809 or higher | X | X |
| [Azure AD joined devices](../devices/concept-azure-ad-join.md) require Windows 10 version 1809 or higher | X |   |
| [Hybrid Azure AD joined devices](../devices/concept-azure-ad-join-hybrid.md) require Windows 10 Insider Build 18945 or higher |   | X |
| Hybrid deployments require at least one Domain Controller running the Windows Server Insider skip ahead build. <br> **Or** have fully patched Windows Server 2016/2019 Domain Controllers. |   | X |
| [Microsoft Intune](https://docs.microsoft.com/intune/fundamentals/what-is-intune) (Optional) | X | X |
| Provisioning package (Optional) | X | X |
| Group Policy (Optional) |   | X |

### Known limitations

- Windows Server Active Directory Domain Services (AD DS) domain-joined (on-premises only devices) deployment **not supported**.
- RDP, VDI, and Citrix scenarios are **not supported** using security key.
- S/MIME is **not supported** using security key.
- “Run as“ is **not supported** using security key.
- Log in to a server using security key is **not supported**.

## Prepare devices for preview

Azure AD joined devices that you will be piloting with must be running Windows 10 version 1809 or higher. The best experience is on Windows 10 version 1903 or higher.

Hybrid Azure AD joined devices that you will be piloting with must be running Windows 10 Insider Build 18945 or newer.

## Enable security keys for Windows sign-in

Organizations may choose to use one or more of the following methods to enable the use of security keys for Windows sign-in based on their organization's requirements.

- [Enable with Intune](#enable-credential-provider-with-intune)
   - [Targeted Intune deployment](#enable-targeted-intune-deployment)
- [Enable with a provisioning package](#enable-credential-provider-with-a-provisioning-package)
- [Enable with Group Policy (Hybrid Azure AD joined devices only)](#enable-credential-provider-with-group-policy)

### Enable with Intune

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Browse to **Microsoft Intune** > **Device enrollment** > **Windows enrollment** > **Windows Hello for Business** > **Properties**.
1. Under **Settings** set **Use security keys for sign-in** to **Enabled**.

Configuration of security keys for sign-in, is not dependent on configuring Windows Hello for Business.

#### Targeted Intune deployment

To target specific device groups to enable the credential provider, use the following custom settings via Intune.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Browse to **Microsoft Intune** > **Device configuration** > **Profiles** > **Create profile**.
1. Configure the new profile with the following settings
   1. Name: Security Keys for Windows Sign-In
   1. Description: Enables FIDO Security Keys to be used during Windows Sign In
   1. Platform: Windows 10 and later
   1. Profile type: Custom
   1. Custom OMA-URI Settings:
      1. Name: Turn on FIDO Security Keys for Windows Sign-In
      1. OMA-URI: ./Device/Vendor/MSFT/PassportForWork/SecurityKey/UseSecurityKeyForSignin
      1. Data Type: Integer
      1. Value: 1 
1. This policy can be assigned to specific users, devices, or groups. More information can be found in the article [Assign user and device profiles in Microsoft Intune](https://docs.microsoft.com/intune/device-profile-assign).

![Intune custom device configuration policy creation](./media/howto-authentication-passwordless-security-key/intune-custom-profile.png)

### Enable with a provisioning package

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

### Enable with Group Policy

You can configure the following Group Policy settings to enable FIDO security key sign-in **only for hybrid Azure AD joined devices** in your enterprise.

The setting can be found under **Computer Configuration** > **Administrative Templates** > **System** > **Logon** > **Turn on security key sign-in**.

- Setting this policy to **Enabled** will allow users to sign in with security keys.
- Setting this policy to **Disabled** or **Not Configured** will stop users from signing in with security keys.

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

* Windows 10 version 1903 or higher
   * Users can open **Windows Settings** on their device > **Accounts** > **Security Key**
   * Users can change their PIN, update biometrics, or reset their security key

## Sign in with passwordless credential

### Sign in at the lock screen

In the example below a user Bala Sandhu has already provisioned their FIDO2 security key. Bala can choose the security key credential provider from the Windows 10 lock screen and insert the security key to sign into Windows.

![Security key sign in at the Windows 10 lock screen](./media/howto-authentication-passwordless-security-key/fido2-windows-10-1903-sign-in-lock-screen.png)

### Sign in on the web

In the example below a user has already provisioned their FIDO2 security key. The user can choose to sign in on the web with their FIDO2 security key inside of the Microsoft Edge browser on Windows 10 version 1809 or higher.

![Security key sign-in Microsoft Edge](./media/howto-authentication-passwordless-security-key/fido2-windows-10-1903-edge-sign-in.png)

## Troubleshooting and feedback

If you would like to share feedback or encounter issues while previewing this feature, please share via the Windows Feedback Hub app.

1. Launch **Feedback Hub** and make sure you're signed in.
1. Submit feedback under the following categorization:
   1. Category: Security and Privacy 
   1. Subcategory: FIDO
1. To capture logs, use **Recreate my Problem**.

## Known issues

### Offline unlock and sign in

If you have not used your security key to sign in to your device while online, you will not be able to use it to sign in or unlock offline. 

### Security key provisioning

Administrator provisioning and de-provisioning of security keys is not available in the public preview.

### UPN changes

We are working on supporting a feature that allows UPN change on hybrid AADJ and AADJ devices. If a user’s UPN changes, you can no longer modify FIDO2 security keys to account for the change. The resolution is to reset the device and the user has to re-register.

## Next steps

[Enable access to on-premises resources for Azure AD and hybrid Azure AD devices](howto-authentication-passwordless-on-premises.md)

[Learn more about device registration](../devices/overview.md)

[Learn more about Azure Multi-Factor Authentication](../authentication/howto-mfa-getstarted.md)
