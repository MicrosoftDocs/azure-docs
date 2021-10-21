---
title: Conditional Access - Combined security information - Azure Active Directory
description: Create a custom Conditional Access policy for security info registration

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 07/28/2021

ms.author: joflore
author: MicrosoftGuyJFlo
manager: karenhoran
ms.reviewer: calebb

ms.collection: M365-identity-device-management
---
# Conditional Access: Securing security info registration

Securing when and how users register for Azure AD Multi-Factor Authentication and self-service password reset is possible with user actions in a Conditional Access policy. This feature is available to organizations who have enabled [combined security information registration](../authentication/concept-registration-mfa-sspr-combined.md). This functionality allows organizations to treat the registration process like any application in a Conditional Access policy and use the full power of Conditional Access to secure the experience. Users signing in to the Microsoft Authenticator app or enabling passwordless phone sign-in are subject to this policy.

Organizations may find that they need to take multiple approaches to securing registration based on their user personas and whether the organization has [guest users](../external-identities/what-is-b2b.md). An organization may choose to require other grant controls in addition to or in place of the examples below. When selecting multiple controls be sure to select the appropriate radio button toggle to require **all** or **one** of the selected controls when making this change.

> [!WARNING]
> If you use Temporary Acess Pass (**require multi-factor authentication**) or **device state** as a condition in your policy this may impact guest users in the directory. [Report-only mode](concept-conditional-access-report-only.md) can help determine the impact of policy decisions.
> Note that report-only mode is not applicable for CA policies with **User Actions** scope. 

## Create a policy to secure registration using Temporary Access Pass

The following policy applies to the selected users, who attempt to register using the combined registration experience. The policy requires users to perform multi-factor authentication or use Temporary Access Pass credentials. With the addition of [Temporary Access Pass](../authentication/howto-authentication-temporary-access-pass.md) in Azure AD, administrators can provision time-limited credentials to their users that allow them to register from any device or location. Temporary Access Pass credentials satisfy Conditional Access requirements for multi-factor authentication.

1. In the **Azure portal**, browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. In Name, Enter a Name for this policy. For example, **Combined Security Info Registration with TAP**.
1. Under **Assignments**, select **Users and groups**, and select the users and groups you want this policy to apply to.
   1. Under **Include**, select **All users**.

      > [!WARNING]
      > Users must be enabled for the [combined registration](../authentication/howto-registration-mfa-sspr-combined.md).

   1. Under **Exclude**.
      1. Select **All guest and external users**.
      
         > [!NOTE]
         > Temporary Access Pass does not work for guest users.

      1. Select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
1. Under **Cloud apps or actions**, select **User actions**, check **Register security information**.
1. Under **Access controls** > **Grant**.
   1. Select **Grant access**.
   1. Select **Require multi-factor authentication**.
   1. Click **Select**.
1. Set **Enable policy** to **On**.
1. Then select **Create**.

Administrators will now have to issue Temporary Access Pass credentials to new users so they can satisfy the requirements for multi-factor authentication to register. Steps to accomplish this task, are found in the section [Create a Temporary Access Pass in the Azure AD Portal](../authentication/howto-authentication-temporary-access-pass.md#create-a-temporary-access-pass).

## Create a policy to require registration from a trusted location

The following policy applies to the selected users, who attempt to register using the combined registration experience, and blocks access unless they are connecting from a [trusted network location](concept-conditional-access-conditions.md#locations).

1. In the **Azure portal**, browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. In Name, Enter a Name for this policy. For example, **Combined Security Info Registration on Trusted Networks**.
1. Under **Assignments**, select **Users and groups**, and select the users and groups you want this policy to apply to.
   1. Under **Include**, select **All users**.

      > [!WARNING]
      > Users must be enabled for the [combined registration](../authentication/howto-registration-mfa-sspr-combined.md).

   1. Under **Exclude**.
      1. Select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
1. Under **Cloud apps or actions**, select **User actions**, check **Register security information**.

   > [!WARNING]
   > Users must be enabled for the [combined registration](../authentication/howto-registration-mfa-sspr-combined.md).

1. Under **Cloud apps or actions**, select **User actions**, check **Register security information**.
1. Under **Conditions** > **Locations**.
   1. Configure **Yes**.
   1. Include **Any location**.
   1. Exclude **All trusted locations**.
   1. Select **Done** on the Locations blade.
   1. Select **Done** on the Conditions blade.
1. Under **Conditions** > **Client apps**, set **Configure** to **Yes**, and select **Done**.
1. Under **Access controls** > **Grant**.
   1. Select **Block access**.
   1. Then click **Select**.
1. Set **Enable policy** to **On**.
1. Then select **Save**.

## Create a policy to require registration from a compliant device

The following policy applies to the selected users, who attempt to register using the combined registration experience, and blocks access unless they are connecting from a device that is marked as compliant.

1. In the **Azure portal**, browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. In Name, Enter a Name for this policy. For example, **Combined Security Info Registration from Compliant Devices**.
1. Under **Assignments**, select **Users and groups**, and select the users and groups you want this policy to apply to.
   1. Under **Include**, select **All users**.

      > [!WARNING]
      > Users must be enabled for the [combined registration](../authentication/howto-registration-mfa-sspr-combined.md).

   1. Under **Exclude**.
      1. Select **All guest and external users**.
      1. Select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
1. Under **Cloud apps or actions**, select **User actions**, check **Register security information**.
1. Under **Conditions** > **Client apps**, set **Configure** to **Yes**, and select **Done**.
1. Under **Conditions** > **Filter for devices**.
   1. Configure **Yes**.
   2. Select **Exclude filtered devices from policy**
   3. Create an expression.
      1. **Property** set to **IsCompliant**.
      2. **Operator** set to **Equals**.
      3. **Value** set to **True**.
   4. Select **Done** on the **Filter for devices** blade.
   5. Select **Done** on the Conditions blade.
4. Under **Access controls** > **Grant**.
   1. Select **Block access**.
   1. Then click **Select**.
5. Set **Enable policy** to **On**.
6. Then select **Save**.

## Next steps

[Conditional Access common policies](concept-conditional-access-policy-common.md)

[Determine impact using Conditional Access report-only mode](howto-conditional-access-insights-reporting.md)

[Simulate sign in behavior using the Conditional Access What If tool](troubleshoot-conditional-access-what-if.md)

[Require users to reconfirm authentication information](../authentication/concept-sspr-howitworks.md#reconfirm-authentication-information)
