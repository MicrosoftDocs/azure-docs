---
title: Migrate approved client app to application protection policy in Conditional Access 
description: The approved client app control is going away. Migrate to App protection policies.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 03/28/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: jogro

ms.collection: M365-identity-device-management
---
# Migrate approved client app to application protection policy in Conditional Access

In this article, you learn how to migrate from the approved client app Conditional Access grant to the application protection policy grant. App protection policies provide the same data loss and protection as approved client app policies, but with other benefits. For more information about the benefits of using app protection policies, see the article [App protection policies overview](/mem/intune/apps/app-protection-policy). 

The approved client app grant is retiring in early March 2026. Organizations must transition all current Conditional Access policies that use only the Require Approved Client App grant to Require Approved Client App or Application Protection Policy by March 2026. Additionally, for any new Conditional Access policy, only apply the Require application protection policy grant. 

After March 2026, Microsoft will stop enforcing require approved client app control, and it will be as if this grant isn't selected. Use the following steps before March 2026 to protect your organization’s data. 

## Edit an existing Conditional Access policy

Require approved client apps or app protection policy with mobile devices 

The following steps make an existing Conditional Access policy require an approved client app or an app protection policy when using an iOS/iPadOS or Android device. This policy works in tandem with an app protection policy created in Microsoft Intune. 

Organizations can choose to update their policies using the following steps.

1. Sign in to the **Azure portal** as a Conditional Access Administrator, Security Administrator, or Global Administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select a policy that uses the approved client app grant.
1. Under **Access controls** > **Grant**, select **Grant access**.
   1. Select **Require approved client app** and **Require app protection policy**
   1. **For multiple controls** select **Require one of the selected controls**
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After confirming your settings using [report-only mode](howto-conditional-access-insights-reporting.md), an administrator can move the **Enable policy** toggle from **Report-only** to **On**.

Repeat the previous steps on all of your policies that use the approved client app grant. 

> [!WARNING] 
> Not all applications that are supported as approved applications or support application protection policies. For a list of some common client apps, see [App protection policy requirement](concept-conditional-access-grant.md#require-app-protection-policy). If your application is not listed there, contact the application developer. 

## Create a Conditional Access policy

Require app protection policy with mobile devices 

The following steps help create a Conditional Access policy requiring an approved client app or an app protection policy when using an iOS/iPadOS or Android device. This policy works in tandem with an [app protection policy created in Microsoft Intune](/mem/intune/apps/app-protection-policies). 

Organizations can choose to deploy this policy using the following steps.

1. Sign in to the **Azure portal** as a Conditional Access Administrator, Security Administrator, or Global Administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and exclude at least one account to prevent yourself from being locked out. If you don't exclude any accounts, you can't create the policy.
1. Under **Cloud apps or actions**, select **All cloud apps**.
1. Under **Conditions** > **Device platforms**, set **Configure** to **Yes**.
   1. Under **Include**, **Select device platforms**.
   1. Choose **Android** and **iOS**
   1. Select **Done**.
1. Under **Access controls** > **Grant**, select **Grant access**.
   1. Select **Require approved client app** and **Require app protection policy**
   1. **For multiple controls** select **Require one of the selected controls**
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After confirming your settings using [report-only mode](howto-conditional-access-insights-reporting.md), an administrator can move the **Enable policy** toggle from **Report-only** to **On**.

> [!NOTE] 
> If an app does not support **Require app protection policy**, end users trying to access resources from that app will be blocked.

## Next steps

For more information on application protection policies, see: 

[App protection policies overview](/mem/intune/apps/app-protection-policy)
