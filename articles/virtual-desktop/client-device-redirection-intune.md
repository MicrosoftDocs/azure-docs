---
title: Configure client device redirection settings for Windows App and the Remote Desktop app using Microsoft Intune
description: Learn how to configure redirection settings for iOS/iPadOS Windows App, Android Remote Desktop client and Android Windows App (preview) using Microsoft Intune.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 01/15/2025
---

# Configure client device redirection settings for Windows App and the Remote Desktop app using Microsoft Intune

> [!IMPORTANT]
> Configure redirection settings for the **Remote Desktop app on Android** and **Windows App on Android** using Microsoft Intune are currently in PREVIEW. Configure redirection settings for **Windows App on iOS/iPadOS** using Microsoft Intune is generally available. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

> [!TIP]
> This article contains information for multiple products that use the Remote Desktop Protocol (RDP) to provide remote access to Windows desktops and applications.

Redirection of resources and peripherals from a user's local device to a remote session from Azure Virtual Desktop or Windows 365 over the Remote Desktop Protocol (RDP), such as the clipboard, camera, and audio, is normally governed by central configuration of a host pool and its session hosts. Client device redirection is configured for Windows App and the Remote Desktop app using a combination of Microsoft Intune app configuration policies, app protection policies, and Microsoft Entra Conditional Access on a user's local device.

These features enable you to achieve the following scenarios:

- Apply redirection settings at a more granular level based on criteria you specify. For example, you might want to have different settings depending on which security group a user is in, the operating system of device they're using, or if users use both corporate and personal devices to access a remote session.

- Provide an extra layer of protection against misconfigured redirection on the host pool or session host.

- Apply extra security settings to Windows App and the Remote Desktop app, such as, require a PIN, block third-party keyboards, and restrict cut, copy, and paste operations between other apps on the client device.

If the redirection settings on a client device conflict with the host pool RDP properties and session host for Azure Virtual Desktop, or Cloud PC for Windows 365, the more restrictive setting between the two takes effect. For example, if the session host disallows drive redirection and the client device allowing drive redirection, drive redirection is disallowed. If the redirection settings on session host and client device are both the same, the redirection behavior is consistent.

> [!IMPORTANT]
> Configuring redirection settings on a client device isn't a substitute for correctly configuring your host pools and session hosts based on your requirements. Using Microsoft Intune to configure Windows App and the Remote Desktop app might not be suitable for workloads requiring a higher level of security. 
> 
> Workloads with higher security requirements should continue to set redirection at the host pool or session host, where all users of the host pool would have the same redirection configuration. A Data Loss Protection (DLP) solution is recommended and redirection should be disabled on session hosts whenever possible to minimize the opportunities for data loss. 

At a high-level, there are three areas to configure:

- **Intune app configuration policies**: used to manage redirection settings for Windows App and the Remote Desktop app on a client device. There are two types of app configuration policies; a managed apps policy is used to manage settings for an application, whether the client device is enrolled or unenrolled, and a managed devices policy is used in addition to manage settings on an enrolled device. Use filters to target users based on specific criteria.

- **Intune app protection policies**: used to specify security requirements that must be met by the application and the client device. Use filters to target users based on specific criteria.

- **Conditional Access policies**: used to control access to Azure Virtual Desktop and Windows 365 based only if the criteria set in app configuration policies and app protection policies are met.

## Supported platforms and enrollment types

The following table shows which application you can manage based on the device platform and enrollment type:

For Windows App:

| Device platform | Managed devices | Unmanaged devices |
|--|:--:|:--:|
| iOS and iPadOS | ✅ | ✅ |
| Android | ✅ | ✅ |


For the Remote Desktop app:

| Device platform | Managed devices | Unmanaged devices |
|--|:--:|:--:|
| Android | ✅ | ✅ |

## Example scenarios

The values you specify in filters and policies depend on your requirements, so you need to determine what's best for your organization. Here are some example scenarios of what you need to configure to achieve them.

### Scenario 1

Users in a group are allowed drive redirection when connecting from their Windows corporate device, but drive redirection is disallowed on their iOS/iPadOS or Android corporate device. To achieve this scenario:

1. Make sure your session hosts or Cloud PCs, and host pools settings are configured to allow drive redirection.

1. Create device filter for managed apps for iOS and iPadOS, and a separate filter for Android.

1. For iOS and iPadOS only, create an app configuration policy for managed devices.

1. Create an app configuration policy for managed apps with drive redirection disabled. You can create a single policy for both iOS/iPadOS and Android, or create a separate policy for iOS/iPadOS and Android.

1. Create two app protection policies, one for iOS/iPadOS and one for Android.

### Scenario 2

Users in a group who have an Android device running the latest version of Android are allowed drive redirection, but the same users who's device is running an older version of Android are disallowed drive redirection. To achieve this scenario:

1. Make sure your session hosts or Cloud PCs, and host pools settings are configured to allow drive redirection.

1. Create two device filters:

   1. A device filter for managed apps for Android, where the version of version is set to the latest version number of Android.

   1. A device filter for managed apps for Android, where the version of version is set to a version number older than the latest version of Android.

1. Create two app configuration policies:

   1. An app configuration policy for managed apps with drive redirection enabled. Assign it one or more groups with the filter for the latest version number of Android.

   1. An app configuration policy for managed apps with drive redirection disabled. Assign it one or more groups with the filter for the older version number of Android.

1. Create an app protection policy, one combined for iOS/iPadOS and Android.

### Scenario 3

Users in a group using an unmanaged iOS/iPadOS device to connect to a remote session are allowed clipboard redirection, but the same users using an unmanaged Android device are disallowed clipboard redirection. To achieve this scenario:

1. Make sure your session hosts or Cloud PCs, and host pools settings are configured to allow clipboard redirection.

1. Create two device filters:

   1. A device filter for managed apps for iOS and iPadOS, where the device management type is unmanaged.

   1. A device filter for managed apps for Android, where the device management type is unmanaged.

1. Create two app configuration policies:

   1. An app configuration policy for managed apps with clipboard redirection enabled. Assign it one or more groups with the filter for unmanaged iOS or iPadOS devices.

   1. An app configuration policy for managed apps with clipboard redirection disabled. Assign it one or more groups with the filter for unmanaged Android devices.

1. Create an app protection policy, one combined for iOS/iPadOS and Android.

## Recommended policy settings

Here are some recommended policy settings you should use with Intune and Conditional Access. The settings you use should be based on your requirements.

- Intune:
   - Disable all redirection on personal devices.
   - Require PIN access to app.
   - Block third-party keyboards.
   - Specify a minimum device operating system version.
   - Specify a minimum Windows App and/or Remote Desktop app version number.
   - Block jailbroken/rooted devices.
   - Require a mobile threat defense (MTD) solution on devices, with no threats detected.

- Conditional Access:
    - Block access unless criteria set in Intune mobile application management policies are met.
    - Grant access, requiring one or more of the following options:
      - Require multifactor authentication.
      - Require an Intune app protection policy.

## Prerequisites

Before you can configure redirection settings on a client device using Microsoft Intune and Conditional Access, you need:

- An existing host pool with session hosts, or Cloud PCs.

- At least one security group containing users to apply the policies to.

- To use Windows App with enrolled devices on iOS and iPadOS, you need to add each app to Intune from the App Store. For more information, see [Add iOS store apps to Microsoft Intune](/mem/intune/apps/store-apps-ios).

- A client device running one of the following versions of Windows App or the Remote Desktop app:
   - For Windows App:
      - iOS/iPadOS: 11.0.8 or later.
      - Android: 1.0.145 or later.

   - Remote Desktop app:
      - Android: 10.0.19.1279 or later.

- The latest version of:
   - iOS/iPadOS: Microsoft Authenticator app
   - Android: Company Portal app, installed in the same profile as Windows App for personal devices. Both apps need to either be in a personal profile or in a work profile, not one in each profile.

- There are more Intune prerequisites for configuring app configuration policies, app protection policies, and Conditional Access policies. For more information, see:
   - [App configuration policies for Microsoft Intune](/mem/intune/apps/app-configuration-policies-overview).
   - [How to create and assign app protection policies](/mem/intune/apps/app-protection-policies).
   - [Use app-based Conditional Access policies with Intune](/mem/intune/protect/app-based-conditional-access-intune).
   
> [!IMPORTANT]
> Intune mobile application management (MAM) functionality isn't currently supported on Android 15 by Remote Desktop or Windows App (preview). MAM runs on older versions of Android. Support for MAM on Android 15 for Windows App (preview) will be supported in an upcoming release.

## Create a managed app filter

By creating a managed app filter, you can apply redirection settings only when the criteria set in the filter are matched, allowing you to narrow the assignment scope of a policy. If you don't configure a filter, the redirection settings apply to all users. What you specify in a filter depends on your requirements.

To learn about filters and how to create them, see [Use filters when assigning your apps, policies, and profiles in Microsoft Intune](/mem/intune/fundamentals/filters) and [Managed app filter properties](/mem/intune/fundamentals/filters-device-properties#managed-app-properties).

## Create an app configuration policy for managed devices

For iOS and iPadOS devices that are enrolled only, you need to create an [app configuration policy for managed devices](/mem/intune/apps/app-configuration-policies-overview#managed-devices) for Windows App. This step isn't needed for Android.

To create and apply an app configuration policy for managed devices, follow the steps in [Add app configuration policies for managed iOS/iPadOS devices](/mem/intune/apps/app-configuration-policies-use-ios) and use the following settings:

- On the **Basics** tab, for **targeted app**, select **Windows App** from the list. You need to have added the app to Intune from the App Store for it to show in this list.

- On the **Settings** tab, for the **Configuration settings format** drop-down list, select **Use configuration designer**, then enter the following settings exactly as shown:

   | Configuration key | Value type | Configuration value |
   |--|--|--|
   | `IntuneMAMUPN` | String | `{{userprincipalname}}` |
   | `IntuneMAMOID` | String | `{{userid}}` | 
   | `IntuneMAMDeviceID` | String | `{{deviceID}}` |

- On the **Assignments** tab, assign the policy to the security group containing the users to apply the policy to. You must apply the policy to a group of users to have the policy take effect. For each group, you can optionally select a filter to be more specific in the app configuration policy targeting.

## Create an app configuration policy for managed apps

You need to create a separate [app configuration policy for managed apps](/mem/intune/apps/app-configuration-policies-overview#managed-devices) for Windows App (iOS/iPadOS) and the Windows App (preview) or Remote Desktop app (Android), which enables you to provide configuration settings. Don't configure both Android and iOS in the same configuration policy or you won't be able to configure policy targeting based on managed and unmanaged devices.

To create and apply an app configuration policy for managed apps, follow the steps in [App configuration policies for Intune App SDK managed apps](/mem/intune/apps/app-configuration-policies-managed-app) and use the following settings:

- On the **Basics** tab, select **Select public apps**, then search for and select **Remote Desktop** for Android and **Windows App** for iOS/iPadOS. Select **Select custom apps**, then type in **com.microsoft.rdc.androidx.beta** in the Bundle or Package ID field under More Apps for **Windows App (preview)** for Android.

- On the **Settings** tab, expand **General configuration settings**, then enter the following name and value pairs for each redirection setting you want to configure exactly as shown. These values correspond to the RDP properties listed on [Supported RDP properties](/azure/virtual-desktop/rdp-properties#device-redirection), but the syntax is different: 

   | Name | Description | Value |
   |--|--|--|
   | `audiocapturemode` |  Indicates whether audio input redirection is enabled. | `0`: Audio capture from the local device is disabled.<br /><br />`1`: Audio capture from the local device and redirection to an audio application in the remote session is enabled. |
   | `camerastoredirect` |  Determines whether camera redirection is enabled.  | `0`: Camera redirection is disabled.<br /><br />`1`: Camera redirection is enabled.  |
   | `drivestoredirect` |  Determines whether disk drive redirection is enabled. | `0`: Disk drive redirection is disabled.<br /><br />`1`: Disk drive redirection is enabled.  |
   | `redirectclipboard` | Determines whether clipboard redirection is enabled. | `0`: Clipboard redirection on local device is disabled in remote session.<br /><br />`1`: Clipboard redirection on local device is enabled in remote session.  |

   Here's an example of how the settings should look:

   :::image type="content" source="media/client-device-redirection-intune/create-app-configuration-policy-settings-redirection.png" alt-text="A screenshot showing redirection name and values pairs in Intune.":::

- On the **Assignments** tab, assign the policy to the security group containing the users to apply the policy to. You must apply the policy to a group of users to have the policy take effect. For each group, you can optionally select a filter to be more specific in the app configuration policy targeting.

## Create an app protection policy

You need to create a separate [app protection policy](/mem/intune/apps/app-protection-policy) for Windows App (iOS/iPadOS) and the Remote Desktop app (Android), which enable you to control how data is accessed and shared by apps on mobile devices. Don't configure both Android and iOS/iPadOS in the same protection policy or you won't be able to configure policy targeting based on managed and unmanaged devices.

To create and apply an app protection policy, follow the steps in [How to create and assign app protection policies](/mem/intune/apps/app-protection-policies) and use the following settings. 

- On the **Apps** tab, select **Select public apps**, then search for and select **Remote Desktop** for Android and **Windows App** for iOS/iPadOS. Select **Select custom apps**, then type in **com.microsoft.rdc.androidx.beta** in the Bundle or Package ID field under More Apps for **Windows App (preview)** for Android.
  
- On the **Data protection** tab, only the following settings are relevant to Windows App and the Remote Desktop app. The other settings don't apply as Windows App and the Remote Desktop app interact with the session host and not with data in the app. On mobile devices, unapproved keyboards are a source of keystroke logging and theft. 

   - For iOS and iPadOS, you can configure the following settings:

      - **Send org data to other apps**. Set to **None** to enable [screen capture protection](screen-capture-protection.md). 
      - **Restrict cut, copy, and paste between other apps**
      - **Third-party keyboards**

   - For Android, you can configure the following settings:

      - **Restrict cut, copy, and paste between other apps**
      - **Screen capture and Google Assistant**
      - **Approved keyboards**

   > [!TIP]
   > If you disable clipboard redirection in an app configuration policy, you should set **Restrict cut, copy, and paste between other apps** to **Blocked**.

- On the **Conditional launch** tab, we recommend you add the following conditions:

   | Condition | Condition type | Value | Action |
   |--|--|--|--|
   | Min app version | App condition | Based on your requirements. | Block access |
   | Min OS version | Device condition | Based on your requirements. | Block access |
   | Primary MTD service | Device condition | Based on your requirements.<br /><br />Your MTD connector must be set up. For **Microsoft Defender for Endpoint**, [configure Microsoft Defender for Endpoint in Intune](/mem/intune/protect/advanced-threat-protection-configure). | Block access |
   | Max allowed device threat level | Device condition | Secured | Block access |

   For version details, see [What's new in Windows App](/windows-app/whats-new?tabs=ios-ipados), and [What's new in the Remote Desktop client for Android and Chrome OS](whats-new-client-android-chrome-os.md).

   For more information about the available settings, see [Conditional launch in iOS app protection policy settings](/mem/intune/apps/app-protection-policy-settings-ios#conditional-launch) and [Conditional launch in Android app protection policy settings](/mem/intune/apps/app-protection-policy-settings-android#conditional-launch).

- On the **Assignments** tab, assign the policy to the security group containing the users to apply the policy to. You must apply the policy to a group of users to have the policy take effect. For each group, you can optionally select a filter to be more specific in the app configuration policy targeting.

## Create a Conditional Access policy

Creating a Conditional Access policy enables you to restrict access to a remote session only when an app protection policy is applied with Windows App and the Remote Desktop app. If you create a second Conditional Access policy, you can also block access using a web browser.

To create and apply a Conditional Access policy, follow the steps in [Set up app-based Conditional Access policies with Intune](/mem/intune/protect/app-based-conditional-access-intune-create). The following settings provide an example, but you should adjust them based on your requirements:

1. For the first policy to grant access to a remote session only when an app protection policy is applied with Windows App and the Remote Desktop app:

   - For **Assignments**, include the security group containing the users to apply the policy to. You must apply the policy to a group of users to have the policy take effect.

   - For **Target resources**, select to apply the policy to **Cloud apps**, then for **Include**, select **Select apps**. Search for and select **Azure Virtual Desktop** and **Windows 365**. You only have Azure Virtual Desktop in the list if you [registered the `Microsoft.DesktopVirtualization` resource provider on a subscription](prerequisites.md#azure-account-with-an-active-subscription) in your Microsoft Entra tenant.

   - For **Conditions**:
      - Select **Device platforms**, then include **iOS** and **Android**.
      - Select **Client apps**, then include **Mobile apps and desktop clients**.

   - For **Access controls**, select **Grant access**, then check the box for **Require app protection policy** and select the radio button for **Require all the selected controls**.

   - For **Enable policy**, set it to **On**.

1. For the second policy to block access to a remote session using a web browser:

   - For **Assignments**, include the security group containing the users to apply the policy to. You must apply the policy to a group of users to have the policy take effect.

   - For **Target resources**, select to apply the policy to **Cloud apps**, then for **Include**, select **Select apps**. Search for and select **Azure Virtual Desktop** and **Windows 365**. You only have Azure Virtual Desktop in the list if you [registered the `Microsoft.DesktopVirtualization` resource provider on a subscription](prerequisites.md#azure-account-with-an-active-subscription) in your Microsoft Entra tenant. The cloud app for Windows 365 also covers Microsoft Dev Box.

   - For **Conditions**:
      - Select **Device platforms**, then include **iOS** and **Android**.
      - Select **Client apps**, then include  **Browser**.

   - For **Access controls**, select **Block access**, then select the radio button for **Require all the selected controls**.

   - For **Enable policy**, set it to **On**.

## Verify the configuration

Now that you configure Intune to manage device redirection on personal devices, you can verify your configuration by connecting to a remote session. What you should test depends on whether you configured policies to apply to enrolled or unenrolled devices, which platforms, and the redirection and data protection settings you set. Verify that you can only perform the actions you can perform match what you expect.

## Known issues

- Windows App exits without warning if Company Portal and Windows App aren't installed in the same profile. Install both apps either in a personal profile or both apps in a work profile.
