---
title: Microsoft Azure Multi-Factor Authentication User States
description: Learn about user states in Azure MFA.
services: multi-factor-authentication
documentationcenter: ''
author: kgremban
manager: femila

ms.assetid: 0b9fde23-2d36-45b3-950d-f88624a68fbd
ms.service: multi-factor-authentication
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/26/2017
ms.author: kgremban
ms.reviewer: yossib
ms.custom: it-pro
---

# How to require two-step verification for a user or group

There are two approaches for requiring two-step verification. The first option is to enable each individual user for Azure Multi-Factor Authentication (MFA). When users are enabled individually, they always perform two-step verification (with some exceptions, like when they sign in from trusted IP addresses or if the remembered devices feature is turned on). The second option is to set up a conditional access policy that requires two-step verification under certain conditions.

>[!TIP] 
>Choose one of these methods to require two-step verification, not both. Enabling a user for Azure MFA overrides any conditional access policies.

## Which option is right for you

**Enabling Azure MFA by changing user states** is the traditional approach for requiring two-step verification. It works for both Azure MFA in the cloud and Azure MFA Server. All the users that you enable have the same experience, which is to perform two-step verification every time they sign in. Enabling a user overrides any conditional access policies that may affect that user. 

**Enabling Azure MFA with a conditional access policy** is a more flexible approach for requiring two-step verification. It only work for Azure MFA in the cloud, though, and conditional access is a [paid feature of Azure Active Directory](https://www.microsoft.com/cloud-platform/azure-active-directory-features). You can create conditional access policies that apply to groups as well as individual users. High-risk groups can be given more restrictions than low-risk groups, or two-step verification can be required only for high-risk cloud apps and skipped for low-risk ones. 

Both of these options prompt users to register for Azure Multi-Factor Authentication the first time that they sign in after the requirements turn on. Both options also work with the configurable [Azure Multi-Factor Authentication settings](multi-factor-authentication-whats-next.md)

## Enable Azure MFA by changing user status

User accounts in Azure Multi-Factor Authentication have the following three distinct states:

| Status | Description | Non-browser apps affected |
|:---:|:---:|:---:|
| Disabled |The default state for a new user not enrolled Azure Multi-Factor Authentication (MFA). |No |
| Enabled |The user has been enrolled in Azure MFA, but has not registered. They will be prompted to register the next time they sign in. |No.  They continue to work until the registration process is completed. |
| Enforced |The user has been enrolled and has completed the registration process for Azure MFA. |Yes.  Apps require app passwords. |

A user's state reflects whether an admin has enrolled them in Azure MFA, and whether they completed the registration process.

All users start out *disabled*. When you enroll users in Azure MFA, their state changes *enabled*. When enabled users sign in and complete the registration process, their state changes to *enforced*.  

### View the status for a user

Use the following steps to access the page where you can view and manage user states:

1. Sign in to the [Azure portal](https://portal.azure.com) as an administrator.
2. Go to **Azure Active Directory** > **Users and groups** > **All users**.
3. Select **Multi-Factor Authentication**.
   ![Select Multi-Factor Authentication](./media/multi-factor-authentication-get-started-user-states/selectmfa.png)
4. A new page, which displays the user states, opens.
   ![multi-factor authentication user status - screenshot](./media/multi-factor-authentication-get-started-user-states/userstate1.png)

### Change the status for a user

1. Use the preceding steps to get to the multi-factor authentication users page.
2. Find the user that you want to enable for Azure MFA. You may need to change the view at the top. 
   ![Find user - screenshot](./media/multi-factor-authentication-get-started-cloud/enable1.png)
3. Check the box next to their name.
4. On the right, under quick steps, choose **Enable** or **Disable**.
   ![Enable selected user - screenshot](./media/multi-factor-authentication-get-started-cloud/user1.png)

   >[!TIP]
   >*Enabled* users automatically switch to *enforced* when they register for Azure MFA. You shouldn't manually change the user state to enforced. 

5. Confirm your selection in the pop-up window that opens. 

After you enable users, you should notify them via email. Tell them that they'll be asked to register the next time they sign in. Also, if your organization uses non-browser apps that don't support modern authentication, they'll need to create app passwords. You can also include a link to our [Azure MFA end-user guide](./end-user/multi-factor-authentication-end-user.md) to help them get started.

### Use PowerShell
To change the user status state using [Azure AD PowerShell](/powershell/azure/overview), change `$st.State`. There are three possible states:

* Enabled
* Enforced
* Disabled  

Don't move users directly to the *Enforced* state. Non-browser-based apps will stop working because the user has not gone through MFA registration and obtained an [app password](multi-factor-authentication-whats-next.md#app-passwords). 

Using PowerShell is a good option when you need to bulk enabling users. Create a PowerShell script that loops through a list of users and enables them:

        $st = New-Object -TypeName Microsoft.Online.Administration.StrongAuthenticationRequirement
        $st.RelyingParty = "*"
        $st.State = “Enabled”
        $sta = @($st)
        Set-MsolUser -UserPrincipalName bsimon@contoso.com -StrongAuthenticationRequirements $sta

Here is an example:

    $users = "bsimon@contoso.com","jsmith@contoso.com","ljacobson@contoso.com"
    foreach ($user in $users)
    {
        $st = New-Object -TypeName Microsoft.Online.Administration.StrongAuthenticationRequirement
        $st.RelyingParty = "*"
        $st.State = “Enabled”
        $sta = @($st)
        Set-MsolUser -UserPrincipalName $user -StrongAuthenticationRequirements $sta
    }

## Enable Azure MFA with a conditional access policy

Conditional access is a paid feature of Azure Active Directory, with many possible configuration options. These steps walk through one way to create a policy. For more information, read about [Conditional Access in Azure Active Directory](../active-directory/active-directory-conditional-access-azure-portal.md).

1. Sign in to the [Azure portal](https://portal.azure.com) as an administrator.
2. Go to **Azure Active Directory** > **Conditional access**.
3. Select **New policy**.
4. Under **Assignments**, select **Users and groups**. Use the **Include** and **Exclude** tabs to specify which users and groups will be managed by the policy.
5. Under **Assignments**, select **Cloud apps**. Choose to include **All cloud apps**.
6. Under **Access controls**, select **Grant**. Choose **Require multi-factor authentication**.
7. Turn **Enable policy** to **On** and then select **Save**.

The other options in the conditional access policy allow you to specify exactly when two-step verification should be required. For example, you could make a policy that states: when contractors try to access our procurement app from untrusted networks on devices that are not domain-joined, require two-step verification. 

## Next steps

- Get tips on the [Best practices for conditional access](../active-directory/active-directory-conditional-access-best-practices.md)

- Manage Multi-Factor Authentication settings for [your users and their devices](multi-factor-authentication-manage-users-and-devices.md)