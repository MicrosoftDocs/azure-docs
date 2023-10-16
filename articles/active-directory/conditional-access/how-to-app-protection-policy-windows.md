---
title: Conditional Access - Require app protection policy for Windows
description: Create a Conditional Access policy to require app protection policy for Windows.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 10/04/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: lhuangnorth, jogro

ms.collection: M365-identity-device-management
---
# Require an app protection policy on Windows devices (preview)

App protection policies apply [mobile application management (MAM)](/mem/intune/apps/app-management#mobile-application-management-mam-basics) to specific applications on a device. These policies allow for securing data within an application in support of scenarios like bring your own device (BYOD). In the preview, we support applying policy to the Microsoft Edge browser on Windows 11 devices.

![Screenshot of a browser requiring the user to sign in to their Microsoft Edge profile to access an application.](./media/how-to-app-protection-policy-windows/browser-sign-in-with-edge-profile.png)

## Prerequisites

- [Windows 11 Version 22H2 (OS build 22621)](/windows/release-health/windows11-release-information#windows-11-current-versions) or newer.
- [Configured app protection policy targeting Windows devices](/mem/intune/apps/app-protection-policy-settings-windows).
- Currently unsupported in sovereign clouds.

## User exclusions
[!INCLUDE [active-directory-policy-exclusions](../../../includes/active-directory-policy-exclude-user.md)]

## Create a Conditional Access policy

The following policy is put in to [Report-only mode](howto-conditional-access-insights-reporting.md) to start so administrators can determine the impact they have on existing users. When administrators are comfortable that the policy applies as they intend, they can switch to **On** or stage the deployment by adding specific groups and excluding others.

### Require app protection policy for Windows devices

The following steps help create a Conditional Access policy requiring an app protection policy when using a Windows device. The app protection policy must also be configured and assigned to your users in Microsoft Intune. For more information about how to create the app protection policy, see the article [App protection policy settings for Windows](/mem/intune/apps/app-protection-policy-settings-windows). The following policy includes multiple controls allowing devices to either use app protection policies for mobile application management (MAM) or be managed and compliant with mobile device management (MDM) policies.

> [!TIP]
> App protection policies (MAM) support unmanaged devices:
> 
> - If a device is already managed through mobile device management (MDM), then Intune MAM enrollment is blocked, and app protection policy settings aren't applied. 
> - If a device becomes managed after MAM enrollment, app protection policy settings are no longer applied.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator).
1. Browse to **Protection** > **Conditional Access**.
1. Select **Create new policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose at least your organization's emergency access or break-glass accounts.
1. Under **Target resources** > **Cloud apps** > **Include**, select **Office 365**.
   > [!WARNING]
   > Selecting **All apps** prevents users from signing in.
1. Under **Conditions**:
   1. **Device platforms** set **Configure** to **Yes**.
      1. Under **Include**, **Select device platforms**.
      1. Choose **Windows** only.
      1. Select **Done**.
   1. **Client apps** set **Configure** to **Yes**. 
      1. Select **Browser** only.
1. Under **Access controls** > **Grant**, select **Grant access**.
   1. Select **Require app protection policy** and **Require device to be marked as compliant**.
   1. **For multiple controls** select **Require one of the selected controls**
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After administrators confirm the settings using [report-only mode](howto-conditional-access-insights-reporting.md), they can move the **Enable policy** toggle from **Report-only** to **On**.

> [!TIP]
> Organizations should also deploy a policy that [blocks access from unsupported or unknown device platforms](howto-policy-unknown-unsupported-device.md) along with this policy.

In organizations with existing Conditional Access policies that target: 

- The **All cloud apps** resource.
- The **Mobile apps and desktop clients** condition.
- Use **Require app protection policy** or a **Block access** grant control.

End users are unable to enroll their Windows device in MAM without the following policy changes.

1. Register the **Microsoft Edge Auth** service principal in your tenant using the command `New-MgServicePrincipal -AppId f2d19332-a09d-48c8-a53b-c49ae5502dfc`.
1. Add an exclusion for **Microsoft Edge Auth** to your existing policy targeting **All cloud apps**.

## Sign in to Windows devices

When users attempt to sign in to a site that is protected by an app protection policy for the first time, they're prompted: To access your service, app or website, you may need to sign in to Microsoft Edge using `username@domain.com` or register your device with `organization` if you're already signed in.

Clicking on **Switch Edge profile** opens a window listing their Work or school account along with an option to **Sign in to sync data**.

   ![Screenshot showing the popup in Microsoft Edge asking user to sign in.](./media/how-to-app-protection-policy-windows/browser-sign-in-continue-with-work-or-school-account.png)

This process opens a window offering to allow Windows to remember your account and automatically sign you in to your apps and websites. 

> [!CAUTION]
> You must *CLEAR THE CHECKBOX* **Allow my organization to manage my device**. Leaving this checked enrolls your device in mobile device maangment (MDM) not mobile application management (MAM). 
>
> Don't select **No, sign in to this app only**.

![Screenshot showing the stay signed in to all your apps window. Uncheck the allow my organization to manage my device checkbox.](./media/how-to-app-protection-policy-windows/stay-signed-in-to-all-your-apps.png)

After selecting **OK**, you may see a progress window while policy is applied. After a few moments, you should see a window saying **You're all set**, app protection policies are applied.

## Troubleshooting

### Common issues

In some circumstances, after getting the "you're all set" page you may still be prompted to sign in with your work account. This prompt may happen when: 

- Your profile has been added to Microsoft Edge, but MAM enrollment is still being processed.
- Your profile has been added to Microsoft Edge, but you selected "this app only" on the heads up page.
- You have enrolled into MAM but your enrollment expired or aren't compliant with your organization's requirements.

To resolve these possible scenarios:

- Wait a few minutes and try again in a new tab.
- Contact your administrator to check that Microsoft Intune MAM policies are applying to your account correctly.

#### All apps selected

If your policy for Windows devices targets **All apps** your users aren't able to sign in. Your policy should only target **Office 365**.

### Existing account

There's a known issue where there's a pre-existing, unregistered account, like `user@contoso.com` in Microsoft Edge, or if a user signs in without registering using the Heads Up Page, then the account isn't properly enrolled in MAM. This configuration blocks the user from being properly enrolled in MAM.

## Next steps

- [What is Microsoft Intune app management?](/mem/intune/apps/app-management)
- [App protection policies overview](/mem/intune/apps/app-protection-policy)
