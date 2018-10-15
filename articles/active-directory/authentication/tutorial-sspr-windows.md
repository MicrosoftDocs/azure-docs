---
title: Azure AD SSPR from the Windows 10 login screen
description: In this tutorial, you will enable password reset at the Windows 10 login screen to reduce helpdesk calls.

services: active-directory
ms.service: active-directory
ms.component: authentication
ms.topic: tutorial
ms.date: 07/11/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: sahenry

# Customer intent: How, as an Azure AD Administrator, do I enable password reset for Windows 10 users on the login screen to reduce helpdesk calls?
---
# Tutorial: Azure AD password reset from the login screen

In this tutorial, you enable users to reset their passwords from the Windows 10 login screen. With the new Windows 10 April 2018 Update, users with **Azure AD joined** or **hybrid Azure AD joined** devices can use a “Reset password” link on their login screen. When users click this link, they are brought to the same self-service password reset (SSPR) experience they are familiar with.

> [!div class="checklist"]
> * Configure Reset password link using Intune
> * Optionally configure using the Windows Registry
> * Understand what your users will see

## Prerequisites

* Windows 10 April 2018 Update, or newer client that is:
   * [Azure AD joined](../device-management-azure-portal.md)
   or 
   * [Hybrid Azure AD joined](../device-management-hybrid-azuread-joined-devices-setup.md)
* Azure AD self-service password reset must be enabled.

## Configure Reset password link using Intune

Deploying the configuration change to enable password reset from the login screen using Intune is the most flexible method. Intune allows you to deploy the configuration change to a specific group of machines you define. This method requires Intune enrollment of the device.

### Create a device configuration policy in Intune

1. Sign in to the [Azure portal](https://portal.azure.com) and click on **Intune**.
2. Create a new device configuration profile by going to **Device configuration** > **Profiles** > **Create Profile**
   * Provide a meaningful name for the profile
   * Optionally provide a meaningful description of the profile
   * Platform **Windows 10 and later**
   * Profile type **Custom**

3. Configure **Settings**
   * **Add** the following OMA-URI Setting to enable the Reset password link
      * Provide a meaningful name to explain what the setting is doing
      * Optionally provide a meaningful description of the setting
      * **OMA-URI** set to `./Vendor/MSFT/Policy/Config/Authentication/AllowAadPasswordReset`
      * **Data type** set to **Integer**
      * **Value** set to **1**
      * Click **OK**
   * Click **OK**
4. Click **Create**

### Assign a device configuration policy in Intune

#### Create a group to apply device configuration policy to

1. Sign in to the [Azure portal](https://portal.azure.com) and click on **Azure Active Directory**.
2. Browse to **Users and groups** > **All groups** > **New group**
3. Provide a name for the group and under **Membership type** choose **Assigned**
   * Under **Members**, choose the Azure AD joined Windows 10 devices that you want to apply the policy to.
   * Click **Select**
4. Click **Create**

More information on creating groups can be found in the article [Manage access to resources with Azure Active Directory groups](../fundamentals/active-directory-manage-groups.md).

#### Assign device configuration policy to device group

1. Sign in to the [Azure portal](https://portal.azure.com) and click on **Intune**.
2. Find the device configuration profile created previously by going to **Device configuration** > **Profiles** > Click on the profile created earlier
3. Assign the profile to a group of devices 
   * Click on **Assignments** > under **Include** > **Select groups to include**
   * Select the group created previously and click **Select**
   * Click on **Save**

   ![Assignment][Assignment]

You have now created and assigned a device configuration policy to enable the Reset password link on the login screen using Intune.

## Configure Reset password link using the registry

1. Log in to the Windows PC using administrative credentials
2. Run **regedit** as an administrator
3. Set the following registry key
   * `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\AzureADAccount`
      * `"AllowPasswordReset"=dword:00000001`

## What do users see

Now that the policy is configured and assigned, what changes for the user? How do they know that they can reset their password at the login screen?

![LoginScreen][LoginScreen]

When users attempt to log in, they now see a Reset password link that opens the self-service password reset experience at the login screen. This functionality allows users to reset their password without having to use another device to access a web browser.

Your users will find guidance for using this feature in [Reset your work or school password](../user-help/active-directory-passwords-update-your-own-password.md#reset-password-at-sign-in)

## Common issues

When testing this functionality using Hyper-V, the "Reset password" link does not appear.

* Go to the VM you are using to test click on **View** and then uncheck **Enhanced session**.

When testing this functionality using Remote Desktop, the "Reset password" link does not appear.

* Password reset is not currently supported from a Remote Desktop.

If the Windows lock screen is disabled using a registry key or group policy, **Reset password** will not be available.

If Ctrl+Alt+Del is required by policy, or Lock screen notifications are turned off, **Reset password** will not work. Windows 10 19H1 will resolve this requirement.

The Azure AD audit log will include information about the IP address and ClientType where the password reset occurred.

![Example logon screen password reset in the Azure AD audit log](media/tutorial-sspr-windows/windows-sspr-azure-ad-audit-log.png)

## Clean up resources

If you decide you no longer want to use the functionality you have configured as part of this tutorial, delete the Intune device configuration profile that you created or the registry key.

## Next steps

In this tutorial, you have enabled users to reset their passwords from the Windows 10 login screen. Continue on to the next tutorial to see how Azure Identity Protection can be integrated into the self-service password reset and Multi-Factor Authentication experiences.

> [!div class="nextstepaction"]
> [Evaluate risk at sign in](tutorial-risk-based-sspr-mfa.md)

[Assignment]: ./media/tutorial-sspr-windows/profile-assignment.png "Assign Intune device configuration policy to a group of Windows 10 devices"
[LoginScreen]: ./media/tutorial-sspr-windows/logon-reset-password.png "Reset password link at the Windows 10 login screen"
