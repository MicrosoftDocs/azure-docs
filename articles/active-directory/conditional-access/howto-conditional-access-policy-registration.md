---
title: Conditional Access - Combined security information - Azure Active Directory
description: Create a custom Conditional Access policy for security info registration

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 05/26/2020

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb, rogoya

ms.collection: M365-identity-device-management
---
# Conditional Access: Securing security info registration

Securing when and how users register for Azure Multi-Factor Authentication and self-service password reset is now possible with user actions in Conditional Access policy. This preview feature is available to organizations who have enabled the [combined registration preview](../authentication/concept-registration-mfa-sspr-combined.md). This functionality may be enabled in organizations where they want to use conditions like trusted network location to restrict access to register for Azure Multi-Factor Authentication and self-service password reset (SSPR). For more information about usable conditions, see the article [Conditional Access: Conditions](concept-conditional-access-conditions.md).

## Create a policy to require registration from a trusted location

The following policy applies to all selected users, who attempt to register using the combined registration experience, and blocks access unless they are connecting from a location marked as trusted network.

1. In the **Azure portal**, browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. In Name, Enter a Name for this policy. For example, **Combined Security Info Registration on Trusted Networks**.
1. Under **Assignments**, select **Users and groups**, and select the users and groups you want this policy to apply to.

   > [!WARNING]
   > Users must be enabled for the [combined registration](../authentication/howto-registration-mfa-sspr-combined.md).

1. Under **Cloud apps or actions**, select **User actions**, check **Register security information**.
1. Under **Conditions** > **Locations**.
   1. Configure **Yes**.
   1. Include **Any location**.
   1. Exclude **All trusted locations**.
   1. Select **Done** on the Locations blade.
   1. Select **Done** on the Conditions blade.
1. Under **Conditions** > **Client apps (Preview)**, set **Configure** to **Yes**, and select **Done**.
1. Under **Access controls** > **Grant**.
   1. Select **Block access**.
   1. Then click **Select**.
1. Set **Enable policy** to **On**.
1. Then select **Save**.

At step 6 in this policy, organizations have choices they can make. The policy above requires registration from a trusted network location. Organizations can choose to utilize any available conditions in place of **Locations**. Remember that this policy is a block policy so anything included is blocked and anything that does not match the include is allowed. 

Some may choose to use device state instead of location in step 6 above:

6. Under **Conditions** > **Device state (Preview)**.
   1. Configure **Yes**.
   1. Include **All device state**.
   1. Exclude **Device Hybrid Azure AD joined** and/or **Device marked as compliant**
   1. Select **Done** on the Locations blade.
   1. Select **Done** on the Conditions blade.

> [!WARNING]
> If you use device state as a condition in your policy this may impact guest users in the directory. [Report-only mode](concept-conditional-access-report-only.md) can help determine the impact of policy decisions.
> Note that report-only mode is not applicable for CA policies with "User Actions" scope.

## Next steps

[Conditional Access common policies](concept-conditional-access-policy-common.md)

[Determine impact using Conditional Access report-only mode](howto-conditional-access-report-only.md)

[Simulate sign in behavior using the Conditional Access What If tool](troubleshoot-conditional-access-what-if.md)
