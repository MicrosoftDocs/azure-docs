---
title: Conditional Access - Require app protection policy for Windows
description: Create a Conditional Access policy to require app protection policy for Windows

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 07/14/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: lhuangnorth, jogro

ms.collection: M365-identity-device-management
---
# Require an app protection policy on Windows devices (preview)

App protection policies apply mobile application management (MAM) to specific applications on a device. These policies allow for securing data within an application in support of scenarios like bring your own device (BYOD). In the preview, we support applying policy to the Microsoft Edge browser on Windows 11 devices.

![Screenshot of a browser requiring the user to sign in to their Microsoft Edge profile to access an application.](./media/how-to-app-protection-policy-windows/browser-sign-in-with-edge-profile.png)

## Prerequisites

The following requirements must be met before you can apply an [app protection policy] to Windows client devices:

- Ensure your Windows client version is Windows 11, build 10.0.22621 (22H2) or newer.
- Ensure your device isn't managed, including:
   - Not Azure AD joined or enrolled in Mobile Device Management (MDM) for the same tenant
as your MAM user.
   - Not Azure AD registered (workplace joined) with more than two users besides the MAM user. There's a limit of no more than [three Azure AD registered users to a device](../devices/faq.yml#i-can-t-add-more-than-3-azure-ad-user-accounts-under-the-same-user-session-on-a-windows-10-11-device--why).
- Clients must be running Microsoft Edge build v115.0.1901.155 or newer.
   - You can check the version by going to `edge://settings/help` in the address bar.
- Clients must have the **Enable MAM on Edge desktop platforms** flag enabled.
   - You can enable this going to `edge://flags/#edge-desktop-mam` in the address bar.
   - Enable **Enable MAM on Edge desktop platforms**
   - Click the **Restart** button at the bottom of the window.

## User exclusions
[!INCLUDE [active-directory-policy-exclusions](../../../includes/active-directory-policy-exclude-user.md)]

## Create a Conditional Access policy

The following policy is put in to [Report-only mode](howto-conditional-access-insights-reporting.md) to start so administrators can determine the impact they have on existing users. When administrators are comfortable that the policy applies as they intend, they can switch to **On** or stage the deployment by adding specific groups and excluding others.

### Require app protection policy for Windows devices

The following steps help create a Conditional Access policy requiring an app protection policy when using a Windows device. The app protection policy must also be configured and assigned to your users in Microsoft Intune. For more information about how to create the app protection policy, see the article [Preview: App protection policy settings for Windows](/mem/intune/apps/app-protection-policy-settings-windows).

1. Sign in to the **Azure portal** as a Conditional Access Administrator, Security Administrator, or Global Administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select **All users**.
   1. Under **Exclude**, select **Users and groups** and choose at least your organization's emergency access or break-glass accounts.
1. Under **Cloud apps or actions**, select **Office 365**.
1. Under **Conditions**:
   1. **Device platforms**, set **Configure** to **Yes**.
      1. Under **Include**, **Select device platforms**.
      1. Choose **Windows** only.
      1. Select **Done**.
   1. **Client apps**, set **Configure** to **Yes**. 
      1. Select **Browser** only.
1. Under **Access controls** > **Grant**, select **Grant access**.
   1. Select **Require app protection policy**
   1. **For multiple controls** select **Require one of the selected controls**
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After confirming your settings using [report-only mode](howto-conditional-access-insights-reporting.md), an administrator can move the **Enable policy** toggle from **Report-only** to **On**.

## Signing in on Windows devices

When users attempt to sign in to a site that is protected by an app protection policy for the first time, they're prompted: 

> To access your service, app or website, you may need to sign in to Microsoft Edge using `username@domain.com` or register your device with `organization` if you are already signed in.

Clicking on **Switch Edge profile** opens a window listing their Work or school account along with an option to **Sign in to sync data**.

   ![Screenshot showing the popup in Microsoft Edge asking user to sign in.](./media/how-to-app-protection-policy-windows/browser-sign-in-continue-with-work-or-school-account.png)

This process opens a window offering to allow Windows to remember your account and automatically sign you in to your apps and websites. 

> [!CAUTION]
> You must *UNCHECK* the box **Allow my organization to manage my device**. Leaving this checked enrolls your device in mobile device maangment (MDM) not mobile application management (MAM).

![Screenshot showing the stay signed in you all your apps window. Uncheck the allow my organization to manage my device checkbox.](./media/how-to-app-protection-policy-windows/stay-signed-in-to-all-your-apps.png)

After selecting **OK** you may see a progress window while policy is applied, then you should see a window saying "you're all set". At this point, app protection policies are applied.

## Troubleshooting

### Common issues

In some circumstances, after getting the "you're all set" page you may still be prompted to sign in with your work account. This prompt may happen when: 

- Your profile has been added to Microsoft Edge, but MAM enrollment is still being processed.
- Your profile has been added to Microsoft Edge, but you selected "this app only" on the heads up page.
- You have enrolled into MAM but your enrollment expired or aren't compliant with your organization's requirements.

To resolve these possible scenarios:

- Wait a few minutes and try again in a new tab.
- Go to **Settings** > **Accounts** > **Access work or school**, then add the account there.
- Contact your administrator to check that Microsoft Intune MAM policies are applying to your account correctly.

### Existing account

If there's a pre-existing, unregistered account, like `user@contoso.com` in Microsoft Edge or if a user signs in without registering using the Heads Up Page, then the account isn't properly enrolled in MAM. This configuration permanently blocks the user from being properly enrolled in MAM.

## Next steps

- [What is Microsoft Intune app management?](/mem/intune/apps/app-management)
- [App protection policies overview](/mem/intune/apps/app-protection-policy)
