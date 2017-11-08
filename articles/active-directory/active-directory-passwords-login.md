---
title: 'Azure AD SSPR from the Windows 10 login screen | Microsoft Docs'
description: Configure Windows 10 login screen Azure AD password reset and I forgot my PIN
services: active-directory
keywords: 
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila
ms.reviewer: sahenry

ms.assetid: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 11/06/2017
ms.author: joflore
ms.custom: it-pro

---
# Azure AD password reset from the login screen

You have already deployed Azure AD self-service password reset (SSPR) but your users still call the helpdesk when they forget their passwords. They do this because they cant get to a web browser to access SSPR. If only they could access SSPR before they logged in...

With the new Windows 10 Fall Creators Update, users with Azure AD joined devices can see a “Reset password” link on their login screen. When they click this link, they will be brought to the same self-Service Password Reset (SSPR) experience they are familiar with 

To enable users to reset their Azure AD password from the Windows 10 login screen the following requirements need to be met:

* Windows 10, version 1709 or newer client that is Azure AD Domain joined.
* Azure AD self-service password reset must be enabled.
* Configure and deploy the setting to enable the Reset password link via one of the following methods.
   * Intune device configuration profile
   * Registry key

## Configure Reset password link using Intune

### Create a device configuration policy in Intune

1. Login to the [Azure portal](https://portal.azure.com) and click on **Intune**.
2. Create a new device configuration profile by going to **Device configuration** > **Profiles** > **Create Profile**
   * Provide a meaningful name for the profile
   * Optionally provide a meaningful description of the profile
   * Platform **Windows 10 and later**
   * Profile type **Custom**

   ![CreateProfile][CreateProfile]

3. Configure **Settings**
   * **Add** the following OMA-URI Setting to enable the Reset password link
      * Provide a meaningful name to explain what the setting is doing
      * Optionally provide a meaningful description of the setting
      * **OMA-URI** set this to `./Vendor/MSFT/Policy/Config/Authentication/AllowAadPasswordReset`
      * **Data type** set this to **Integer**
      * **Value** set this to **1**
      * Click **OK**
   * Click **OK**
4. Click **Create**

### Assign a device configuration policy in Intune

#### Create a group to apply device configuration policy to

1. Login to the [Azure portal](https://portal.azure.com) and click on **Azure Active Directory**.
2. Browse to **Users and groups** > **All groups** > **New group**
3. Provide a name for the group and under **Membership type** choose **Assigned** 
   * Under **Members** choose the Azure AD joined Windows 10 devices that you want to apply the policy to.
   * Click **Select**
4. Click **Create**

More information on creating groups can be found in the article [Manage access to resources with Azure Active Directory groups](active-directory-manage-groups.md).

#### Assign device configuration policy to device group

1. Login to the [Azure portal](https://portal.azure.com) and click on **Intune**.
2. Find the device configuration profile created previously by going to **Device configuration** > **Profiles** > Click on the profile created earlier
3. Assign the profile to a group of devices 
   * Click on **Assignments** > under **Include** > **Select groups to include**
   * Select the group we created previously and click **Select**
   * Click on **Save**

   ![Assignment][Assignment]

You have now created and assigned a device configuration policy to enable the Reset password link on the logon screen using Intune.

## Configure Reset password link using the registry

We recommend using this method only to test the setting change.

1. Login to the Azure AD Domain joined device using administrative credentials
2. Run **regedit** as an administrator
3. Set the following registry key
   * `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\AzureADAccount`
      * `"AllowPasswordReset"=dword:00000001`





Respond on publish to this with link to doc.
https://feedback.azure.com/forums/169401-azure-active-directory/suggestions/8737576-enable-self-service-password-reset-from-windows-10

### Next steps
The following links provide additional information regarding password reset using Azure AD

* [How do I enable PIN reset from the login screen?](https://docs.microsoft.com/intune/device-windows-pin-reset)
* [More information about MDM authentication policies](https://docs.microsoft.com/windows/client-management/mdm/policy-csp-authentication)


[CreateProfile] create-profile.png
[Assignment]
