---
title: Enable combined security information registration - Azure Active Directory
description: Learn how to simplify the end-user experience with combined Azure AD Multi-Factor Authentication and self-service password reset registration.

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 01/27/2021

ms.author: justinha
author: justinha
manager: daveba
ms.reviewer: rhicock

ms.collection: M365-identity-device-management
---
# Enable combined security information registration in Azure Active Directory

Before combined registration, users registered authentication methods for Azure AD Multi-Factor Authentication and self-service password reset (SSPR) separately. People were confused that similar methods were used for Azure AD Multi-Factor Authentication and SSPR but they had to register for both features. Now, with combined registration, users can register once and get the benefits of both Azure AD Multi-Factor Authentication and SSPR.

> [!NOTE]
> Starting on August 15th 2020, all new Azure AD tenants will be automatically enabled for combined registration. Tenants created after this date will be unable to utilize the legacy registration workflows.

To make sure you understand the functionality and effects before you enable the new experience, see the [Combined security information registration concepts](concept-registration-mfa-sspr-combined.md).

![Combined security information registration enhanced experience](media/howto-registration-mfa-sspr-combined/combined-security-info-more-required.png)

## Enable combined registration

To enable combined registration, complete these steps:

1. Sign in to the Azure portal as a user administrator or global administrator.
2. Go to **Azure Active Directory** > **User settings** > **Manage user feature preview settings**.
3. Under **Users can use the combined security information registration experience**, choose to enable for a **Selected** group of users or for **All** users.

   ![Enable the combined security info experience for users](media/howto-registration-mfa-sspr-combined/enable-the-combined-security-info.png)

> [!NOTE]
> After you enable combined registration, users who register or confirm their phone number or mobile app through the new experience can use them for Azure AD Multi-Factor Authentication and SSPR, if those methods are enabled in the Azure AD Multi-Factor Authentication and SSPR policies.
>
> If you then disable this experience, users who go to the previous SSPR registration page at `https://aka.ms/ssprsetup` are required to perform multi-factor authentication before they can access the page.

If you have configured the *Site to Zone Assignment List* in Internet Explorer, the following sites have to be in the same zone:

* *[https://login.microsoftonline.com](https://login.microsoftonline.com)*
* *[https://mysignins.microsoft.com](https://mysignins.microsoft.com)*
* *[https://account.activedirectory.windowsazure.com](https://account.activedirectory.windowsazure.com)*

## Conditional Access policies for combined registration

To secure when and how users register for Azure AD Multi-Factor Authentication and self-service password reset, you can use user actions in Conditional Access policy. This functionality may be enabled in organizations that want users to register for Azure AD Multi-Factor Authentication and SSPR from a central location, such as a trusted network location during HR onboarding.

> [!NOTE]
> This policy applies only when a user accesses a combined registration page. This policy doesn't enforce MFA enrollment when a user accesses other applications.
>
> You can create an MFA registration policy by using [Azure Identity Protection - Configure MFA Policy](../identity-protection/howto-identity-protection-configure-mfa-policy.md).

For more information about creating trusted locations in Conditional Access, see [What is the location condition in Azure Active Directory Conditional Access?](../conditional-access/location-condition.md#named-locations)

### Create a policy to require registration from a trusted location

Complete the following steps to create a policy that applies to all selected users that attempt to register using the combined registration experience, and blocks access unless they are connecting from a location marked as trusted network:

1. In the **Azure portal**, browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **+ New policy**.
1. Enter a name for this policy, such as *Combined Security Info Registration on Trusted Networks*.
1. Under **Assignments**, select **Users and groups**. Choose the users and groups you want this policy to apply to, then select **Done**.

   > [!WARNING]
   > Users must be enabled for combined registration.

1. Under **Cloud apps or actions**, select **User actions**. Check **Register security information**, then select **Done**.

    ![Create a conditional access policy to control security info registration](media/howto-registration-mfa-sspr-combined/require-registration-from-trusted-location.png)

1. Under **Conditions** > **Locations**, configure the following options:
   1. Configure **Yes**.
   1. Include **Any location**.
   1. Exclude **All trusted locations**.
1. Select **Done** on the *Locations* window, then select **Done** on the *Conditions* window.
1. Under **Access controls** > **Grant**, choose **Block access**, then **Select**.
1. Set **Enable policy** to **On**.
1. To finalize the policy, select **Create**.

## Next steps

If you need help, see [troubleshoot combined security info registration](howto-registration-mfa-sspr-combined-troubleshoot.md) or learn [What is the location condition in Azure AD Conditional Access?](../conditional-access/location-condition.md)

Once users are enabled for combined registration, you can then [enable self-service password reset](tutorial-enable-sspr.md) and [enable Azure AD Multi-Factor Authentication](tutorial-enable-azure-mfa.md).

If needed, learn how to [force users to re-register authentication methods](howto-mfa-userdevicesettings.md#manage-user-authentication-options).
