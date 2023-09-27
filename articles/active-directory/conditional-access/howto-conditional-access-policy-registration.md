---
title: Control security information registration with Conditional Access
description: Create a custom Conditional Access policy for security info registration

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 07/18/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: calebb, lhuangnorth

ms.collection: M365-identity-device-management
---
# Common Conditional Access policy: Securing security info registration

Securing when and how users register for Microsoft Entra multifactor authentication and self-service password reset is possible with user actions in a Conditional Access policy. This feature is available to organizations who have enabled the [combined registration](../authentication/concept-registration-mfa-sspr-combined.md). This functionality allows organizations to treat the registration process like any application in a Conditional Access policy and use the full power of Conditional Access to secure the experience. Users signing in to the Microsoft Authenticator app or enabling passwordless phone sign-in are subject to this policy.

Some organizations in the past may have used trusted network location or device compliance as a means to secure the registration experience. With the addition of [Temporary Access Pass](../authentication/howto-authentication-temporary-access-pass.md) in Microsoft Entra ID, administrators can provide time-limited credentials to their users that allow them to register from any device or location. Temporary Access Pass credentials satisfy Conditional Access requirements for multifactor authentication.

## Template deployment

Organizations can choose to deploy this policy using the steps outlined below or using the [Conditional Access templates](concept-conditional-access-policy-common.md#conditional-access-templates). 

## Create a policy to secure registration

The following policy applies to the selected users, who attempt to register using the combined registration experience. The policy requires users to be in a trusted network location, do multifactor authentication or use Temporary Access Pass credentials.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator).
1. Browse to **Protection** > **Conditional Access**.
1. Select **Create new policy**.
1. In Name, Enter a Name for this policy. For example, **Combined Security Info Registration with TAP**.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**.

      > [!WARNING]
      > Users must be enabled for the [combined registration](../authentication/howto-registration-mfa-sspr-combined.md).

   1. Under **Exclude**.
      1. Select **All guest and external users**.
      1. Select **Directory roles** and choose **Global Administrator**
      
         > [!NOTE]
         > Temporary Access Pass does not work for guest users.

      1. Select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
1. Under **Target resources** > **User actions**, check **Register security information**.
1. Under **Conditions** > **Locations**. 
   1. Set **Configure** to **Yes**. 
      1. Include **Any location**.
      1. Exclude **All trusted locations**.
1. Under **Access controls** > **Grant**. 
   1. Select **Grant access**, **Require multifactor authentication**.
   1. Select **Select**.
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After administrators confirm the settings using [report-only mode](howto-conditional-access-insights-reporting.md), they can move the **Enable policy** toggle from **Report-only** to **On**.

Administrators will now have to issue Temporary Access Pass credentials to new users so they can satisfy the requirements for multifactor authentication to register. Steps to accomplish this task, are found in the section [Create a Temporary Access Pass in the Microsoft Entra admin centerl](../authentication/howto-authentication-temporary-access-pass.md#create-a-temporary-access-pass).

Organizations may choose to require other grant controls with or in place of **Require multifactor authentication** at step 8a. When selecting multiple controls, be sure to select the appropriate radio button toggle to require **all** or **one** of the selected controls when making this change.

### Guest user registration

For [guest users](../external-identities/what-is-b2b.md) who need to register for multifactor authentication in your directory you may choose to block registration from outside of [trusted network locations](concept-conditional-access-conditions.md#locations) using the following guide.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator).
1. Browse to **Protection** > **Conditional Access**.
1. Select **Create new policy**.
1. In Name, Enter a Name for this policy. For example, **Combined Security Info Registration on Trusted Networks**.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All guest and external users**.
1. Under **Target resources** > **User actions**, check **Register security information**.
1. Under **Conditions** > **Locations**.
   1. Configure **Yes**.
   1. Include **Any location**.
   1. Exclude **All trusted locations**.
1. Under **Access controls** > **Grant**.
   1. Select **Block access**.
   1. Then click **Select**.
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After administrators confirm the settings using [report-only mode](howto-conditional-access-insights-reporting.md), they can move the **Enable policy** toggle from **Report-only** to **On**.

## Next steps

[Conditional Access templates](concept-conditional-access-policy-common.md)

[Determine effect using Conditional Access report-only mode](howto-conditional-access-insights-reporting.md)

[Use report-only mode for Conditional Access to determine the results of new policy decisions.](concept-conditional-access-report-only.md)

[Require users to reconfirm authentication information](../authentication/concept-sspr-howitworks.md#reconfirm-authentication-information)
