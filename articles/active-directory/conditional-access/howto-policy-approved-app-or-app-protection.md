---
title: Conditional Access - Require approved app or app protection policy
description: Create a custom Conditional Access policy require approved app or app protection policy

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 08/22/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: calebb, lhuangnorth, spunukol

ms.collection: M365-identity-device-management
---
# Common Conditional Access policy: Require approved client apps or app protection policy

People regularly use their mobile devices for both personal and work tasks. While making sure staff can be productive, organizations also want to prevent data loss from applications on devices they may not manage fully. 

With Conditional Access, organizations can restrict access to [approved (modern authentication capable) client apps with Intune app protection policies](concept-conditional-access-grant.md#require-app-protection-policy). For older client apps that may not support app protection policies, administrators can restrict access to [approved client apps](concept-conditional-access-grant.md#require-approved-client-app).

> [!WARNING]
> App protection policies are supported on iOS and Android only.
>
> Not all applications that are supported as approved applications or support application protection policies. For a list of some common client apps, see [App protection policy requirement](concept-conditional-access-grant.md#require-app-protection-policy). If your application is not listed there, contact the application developer.
> 
> In order to require approved client apps for iOS and Android devices, these devices must first register in Azure AD.

> [!NOTE]
> "Require one of the selected controls" under grant controls is like an OR clause. This is used within policy to enable users to utilize apps that support either the **Require app protection policy** or **Require approved client app** grant controls. **Require app protection policy** is enforced when the app supports that grant control.

For more information about the benefits of using app protection policies, see the article [App protection policies overview](/mem/intune/apps/app-protection-policy).

## Create a Conditional Access policy

The policies below are put in to [Report-only mode](howto-conditional-access-insights-reporting.md) to start so administrators can determine the impact they'll have on existing users. When administrators are comfortable that the policies apply as they intend, they can switch to **On** or stage the deployment by adding specific groups and excluding others.

### Require approved client apps or app protection policy with mobile devices

The following steps will help create a Conditional Access policy requiring an approved client app **or** an app protection policy when using an iOS/iPadOS or Android device. This policy will also prevent the use of Exchange ActiveSync clients using basic authentication on mobile devices. This policy works in tandem with an [app protection policy created in Microsoft Intune](/mem/intune/apps/app-protection-policies).

Organizations can choose to deploy this policy using the steps outlined below or using the [Conditional Access templates (Preview)](concept-conditional-access-policy-common.md#conditional-access-templates-preview). 

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

### Block Exchange ActiveSync on all devices

This policy will block all Exchange ActiveSync clients using basic authentication from connecting to Exchange Online.

1. Sign in to the **Azure portal** as a Conditional Access Administrator, Security Administrator, or Global Administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and exclude at least one account to prevent yourself from being locked out. If you don't exclude any accounts, you can't create the policy.
   1. Select **Done**.
1. Under **Cloud apps or actions**, select **Select apps**.
   1. Select **Office 365 Exchange Online**.
   1. Select **Select**.
1. Under **Conditions** > **Client apps**, set **Configure** to **Yes**.
   1. Uncheck all options except **Exchange ActiveSync clients**.
   1. Select **Done**.
1. Under **Access controls** > **Grant**, select **Grant access**.
   1. Select **Require app protection policy**
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After confirming your settings using [report-only mode](howto-conditional-access-insights-reporting.md), an administrator can move the **Enable policy** toggle from **Report-only** to **On**.

## Next steps

[App protection policies overview](/intune/apps/app-protection-policy)

[Conditional Access common policies](concept-conditional-access-policy-common.md)

[Migrate approved client app to application protection policy in Conditional Access](migrate-approved-client-app.md)
