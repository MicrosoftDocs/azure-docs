---
title: Use Microsoft Intune MAM on devices that run the Azure mobile app
description: Learn about setting and enforcing app protection policies on devices that run the Azure mobile app.
ms.date: 06/17/2024
ms.topic: how-to
ms.custom:
  - build-2024
---

# Use Microsoft Intune mobile application management (MAM) on devices that run the Azure mobile app

[Microsoft Intune mobile application management (MAM)](/mem/intune/apps/app-management) is a cloud-based service that allows an organization to protect its data at the app level on both company devices and users' personal devices, such as smartphones, tablets, and laptops.

Since the Azure mobile app is an Intune-protected app, app protection policies (APP) can be applied and enforced on devices that run the Azure mobile app.

## App protection policies and settings

Intune [app protection policies (APP)](/mem/intune/apps/app-protection-policy) are rules or sets of action that ensure an organization's data remains safe. Administrators use these policies to control how data is accessed and shared. For an overview of how to create an app protection policy, see [How to create and assign app protection policies](/mem/intune/apps/app-protection-policies).

Available app protection settings are continuously being updated and may vary across platforms. For details about the currently available settings, see [Android app protection policy settings in Microsoft Intune](/mem/intune/apps/app-protection-policy-settings-android) and [iOS app protection policy settings](/mem/intune/apps/app-protection-policy-settings-ios) devices.

## User management

With Intune MAM, you can select and assign groups of users to include and exclude in your policies, allowing you to control who has access to your data in Azure Mobile. For more information on user and group assignments, see [Include and exclude app assignments in Microsoft Intune](/mem/intune/apps/apps-inc-exl-assignments).

An Intune license is required in order for app protection policies to apply correctly to a user or group. If an unlicensed user is included in an app protection policy, the rules of that policy won't be applied to that user.

Only Intune-targeted users and groups will be subject to the rules of the app protection policy. To ensure data remains protected, verify that the necessary groups and users were included in your policy during creation.

Users that are out of compliance with their MAM policy or Conditional Access policy may lose access to data and resources, including full access to the Azure mobile app. When a user is marked as out of compliance, the Azure mobile app may initially try automated remediation to regain compliance. If automatic remediation is disabled or unsuccessful, the user is signed out of the app.

You can use [Microsoft Entra Conditional Access policies in combination with Intune compliance policies](/mem/intune/protect/app-based-conditional-access-intune) to ensure that only managed apps and policy-compliant users can access corporate data.

## User experience

When  Intune-licensed Azure mobile app users are targeted with an Intune MAM policy, they are subject to all rules and actions dictated by their policy. When these users sign in to the Azure Mobile app, policy rules are retrieved and enacted immediately, before allowing access to any corporate data.

For example, a user's MAM policy may specify a 6-digit PIN requirement. When that user first signs into the Azure mobile app, they see a message from Intune MAM that describes their current device state and asks them to set an access PIN.

:::image type="content" source="media/intune-management/intune-intro-message.png" alt-text="Screenshot of an introductory message from Intune MAM in the Azure mobile app.":::   :::image type="content" source="media/intune-management/intune-pin-prompt.png" alt-text="Screenshot of Intune MAM prompting the user to set up a PIN in the Azure mobile app.":::

After the user sets up their PIN, they'll be prompted to enter that PIN every time they sign in. The PIN must be entered in order to use the Azure mobile app.

:::image type="content" source="media/intune-management/intune-pin-enter.png" alt-text="Screenshot of Intune MAM prompting the user to enter their PIN in the Azure mobile app.":::

If a user is marked as out of compliance with their policy (following any remediation steps), they'll be signed out of the app. For example, a user might switch to a different policy-protected account that was marked as out of compliance. In this case, the app signs them out and displays a message notifying the user that they must sign back in.

:::image type="content" source="media/intune-management/intune-sign-in-required.png" alt-text="Screenshot of Intune MAM requiring a user to sign back in to the Azure mobile app.":::

## Next steps

- Learn more about the [Microsoft Intune](/mem/intune/fundamentals/what-is-intune).
- Download the Azure mobile app for free from the [Apple App Store](https://aka.ms/azureapp/ios/doc), [Google Play](https://aka.ms/azureapp/android/doc), or [Amazon App Store](https://aka.ms/azureapp/amazon/doc).
