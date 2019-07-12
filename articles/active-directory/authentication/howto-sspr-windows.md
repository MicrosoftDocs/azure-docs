---
title: Azure AD self-service password reset for Windows - Azure Active Directory
description: How to enable self-service password reset using forgot password at the Windows login screen 

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 07/11/2019

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: sahenry

ms.collection: M365-identity-device-management
---
# How to: Enable password reset from the Windows login screen

For machines running Windows 7, 8, 8.1, and 10 you can enable users to reset their password at the Windows login screen. Users no longer have to find a device with a web browser to access the [SSPR portal](https://aka.ms/sspr).

![Example Windows 7 and 10 login screens with SSPR link shown](./media/howto-sspr-windows/windows-reset-password.png)

## General prerequisites

- An administrator must enable Azure AD self-service password reset from the Azure portal.
- **Users must register for SSPR before using this feature**
- Network proxy requirements
   - Windows 10 devices 
       - Port 443 to `passwordreset.microsoftonline.com` and `ajax.aspnetcdn.com`
       - Windows 10 devices only support machine-level proxy configuration
   - Windows 7, 8, and 8.1 devices
       - Port 443 to `passwordreset.microsoftonline.com`

## General limitations

- Password reset is not currently supported from a Remote Desktop or from Hyper-V enhanced sessions.
- Account unlock, mobile app notification, and mobile app code are not supported.
- This feature does not work for networks with 802.1x network authentication deployed and the option “Perform immediately before user logon”. For networks with 802.1x network authentication deployed it is recommended to use machine authentication to enable this feature.

## Windows 10 password reset

### Windows 10 specific prerequisites

- Run at least Windows 10, version April 2018 Update (v1803), and the devices must be either:
    - Azure AD joined
    - Hybrid Azure AD joined
- Hybrid Azure AD joined machines must have network connectivity line of sight to a domain controller to use the new password and update cached credentials.
- If using an image, prior to running sysprep ensure that the web cache is cleared for the built-in Administrator prior to performing the CopyProfile step. More information about this step can be found in the support article [Performance poor when using custom default user profile](https://support.microsoft.com/help/4056823/performance-issue-with-custom-default-user-profile).
- The following settings are known to interfere with the ability to use and reset passwords on Windows 10 devices
    - If Ctrl+Alt+Del is required by policy in versions of Windows 10 before v1809, **Reset password** will not work.
    - If lock screen notifications are turned off, **Reset password** will not work.
    - HideFastUserSwitching is set to enabled or 1
    - DontDisplayLastUserName is set to enabled or 1
    - NoLockScreen is set to enabled or 1
    - EnableLostMode is set on the device
    - Explorer.exe is replaced with a custom shell
- The combination of the following specific three settings can cause this feature to not work.
    - Interactive logon: Do not require CTRL+ALT+DEL = Disabled
    - DisableLockScreenAppNotifications = 1 or Enabled
    - IsContentDeliveryPolicyEnforced = 1 or True 

### Enable for Windows 10 using Intune

Deploying the configuration change to enable password reset from the login screen using Intune is the most flexible method. Intune allows you to deploy the configuration change to a specific group of machines you define. This method requires Intune enrollment of the device.

#### Create a device configuration policy in Intune

1. Sign in to the [Azure portal](https://portal.azure.com) and click on **Intune**.
1. Create a new device configuration profile by going to **Device configuration** > **Profiles** > **Create Profile**
   - Provide a meaningful name for the profile
   - Optionally provide a meaningful description of the profile
   - Platform **Windows 10 and later**
   - Profile type **Custom**
1. Configure **Settings**
   - **Add** the following OMA-URI Setting to enable the Reset password link
      - Provide a meaningful name to explain what the setting is doing
      - Optionally provide a meaningful description of the setting
      - **OMA-URI** set to `./Vendor/MSFT/Policy/Config/Authentication/AllowAadPasswordReset`
      - **Data type** set to **Integer**
      - **Value** set to **1**
      - Click **OK**
   - Click **OK**
1. Click **Create**
1. This policy can be assigned to specific users, devices, or groups. More information can be found in the article [Assign user and device profiles in Microsoft Intune](https://docs.microsoft.com/intune/device-profile-assign).

### Enable for Windows 10 using the Registry

1. Sign in to the Windows PC using administrative credentials
1. Run **regedit** as an administrator
1. Set the following registry key
   - `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\AzureADAccount`
      - `"AllowPasswordReset"=dword:00000001`


#### Troubleshooting Windows 10 password reset

The Azure AD audit log will include information about the IP address and ClientType where the password reset occurred.

![Example Windows 7 password reset in the Azure AD Audit log](media/howto-sspr-windows/windows-7-sspr-azure-ad-audit-log.png)

When users reset their password from the login screen of a Windows 10 device, a low-privilege temporary account called `defaultuser1` is created. This account is used to keep the password reset process secure. The account itself has a randomly generated password, doesn’t show up for device sign-in, and will automatically be removed after the user resets their password. Multiple `defaultuser` profiles may exist but can be safely ignored.

## Windows 7, 8, and 8.1 password reset

### Windows 7, 8, and 8.1 specific prerequisites

- Patched Windows 7 or Windows 8.1 Operating System.
- TLS 1.2 enabled using the guidance found in [Transport Layer Security (TLS) registry settings](https://docs.microsoft.com/windows-server/security/tls/tls-registry-settings#tls-12).
- If more than one 3rd party credential provider is enabled on your machine, users will see more than one user profile on the login screen.

> [!WARNING]
> TLS 1.2 must be enabled, not just set to auto negotiate

### Install

1. Download the appropriate installer for the version of Windows you would like to enable.
   - Software is available on the Microsoft download center at [https://aka.ms/sspraddin](https://aka.ms/sspraddin)
1. Sign in to the machine where you would like to install, and run the installer.
1. After installation, a reboot is highly recommended.
1. After the reboot, at the login screen choose a user and click "Forgot password?" to initiate the password reset workflow.
1. Complete the workflow following the onscreen steps to reset your password.

![Example Windows 7 clicked "Forgot password?" SSPR flow](media/howto-sspr-windows/windows-7-sspr.png)

#### Silent installation

- For silent install, use the command “msiexec /i SsprWindowsLogon.PROD.msi /qn”
- For silent uninstall, use the command “msiexec /x SsprWindowsLogon.PROD.msi /qn”

#### Troubleshooting Windows 7, 8, and 8.1 password reset

Events will be logged both on the machine and in Azure AD. Azure AD Events will include information about the IP address and ClientType where the password reset occurred.

![Example Windows 7 password reset in the Azure AD Audit log](media/howto-sspr-windows/windows-7-sspr-azure-ad-audit-log.png)

If additional logging is required, a registry key on the machine can be changed to enable verbose logging. Enable verbose logging for troubleshooting purposes only.

`HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Authentication\Credential Providers\{86D2F0AC-2171-46CF-9998-4E33B3D7FD4F}`

- To enable verbose logging, create a `REG_DWORD: “EnableLogging”`, and set it to 1.
- To disable verbose logging, change the `REG_DWORD: “EnableLogging”` to 0.

## What do users see

Now that you have configured password reset for your Windows devices, what changes for the user? How do they know that they can reset their password at the login screen?

![Example Windows 7 and 10 login screens with SSPR link shown](./media/howto-sspr-windows/windows-reset-password.png)

When users attempt to sign in, they now see a **Reset password** or **Forgot password** link that opens the self-service password reset experience at the login screen. This functionality allows users to reset their password without having to use another device to access a web browser.

Your users will find guidance for using this feature in [Reset your work or school password](../user-help/active-directory-passwords-update-your-own-password.md#reset-password-at-sign-in)

## Next steps

[Plan authentication methods to allow](concept-authentication-methods.md)
