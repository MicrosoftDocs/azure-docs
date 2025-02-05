---
title: Screen capture protection in Azure Virtual Desktop
description: Learn how to enable screen capture protection in Azure Virtual Desktop (preview) to help prevent sensitive information from being captured on client devices.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 01/15/2025
---

# Enable screen capture protection in Azure Virtual Desktop

Screen capture protection, alongside [watermarking](watermarking.md), helps prevent sensitive information from being captured on client endpoints through a specific set of operating system (OS) features and APIs. When you enable screen capture protection, remote content is automatically blocked in screenshots and screen sharing.

There are two supported scenarios for screen capture protection:

- **Block screen capture on client**: prevents screen capture from the local device of applications running in the remote session.

- **Block screen capture on client and server**: prevents screen capture from the local device of applications running in the remote session, but also prevents tools and services within the session host capturing the screen.

When screen capture protection is enabled, users can't share their remote window using local collaboration software, such as Microsoft Teams. With Teams, neither the local Teams app or using [Teams with media optimization](teams-on-avd.md) can share protected content.

> [!TIP]
> - To increase the security of your sensitive information, you should also disable clipboard, drive, and printer redirection. Disabling redirection helps prevent users from copying content from the remote session. To learn about supported redirection values, see [Device redirection](rdp-properties.md#device-redirection).
>
> - To discourage other methods of screen capture, such as taking a photo of a screen with a physical camera, you can enable [watermarking](watermarking.md), where admins can use a QR code to trace the session.

## Determine your configuration

The steps to configure screen capture protection depend on which platforms your users are connecting from: 

- For Windows and macOS devices running Windows App or Remote Desktop client, you configure screen capture protection on session hosts using Intune or Group Policy. Windows App and the Remote Desktop client enforces screen capture protection settings from a session host without additional configuration.

- For iOS/iPadOS and Android devices running Windows App, you block screen capture on the local device by [configuring an Intune app protection policy](client-device-redirection-intune.md), part of [mobile application management](/mem/intune/fundamentals/deployment-plan-protect-apps) (MAM). If you also want to block screen capture from within the session host, you also need to configure screen capture protection on session hosts using Intune or Group Policy.

Here's a summary of the configuration steps needed for each platform:

| Platform | Block screen capture on client | Block screen capture on client and server |
|--|--|--|
| Windows | Configure session hosts with Intune or Group Policy | Configure session hosts with Intune or Group Policy |
| macOS | Configure session hosts with Intune or Group Policy | Configure session hosts with Intune or Group Policy |
| iOS/iPadOS | Configure the local device with Intune MAM | Configure the local device with Intune MAM and session hosts with Intune or Group Policy |
| Android | Configure the local device with Intune MAM | Configure the local device with Intune MAM and session hosts with Intune or Group Policy |

## Prerequisites

- For scenarios where you need to configure session hosts, those session hosts must be running a Windows 11, version 22H2 or later, or Windows 10, version 22H2 or later.

- Users must connect to Azure Virtual Desktop with Windows App or the Remote Desktop app to use screen capture protection. The following table shows supported scenarios:

   - Windows App:
   
      | Platform | Minimum version | Desktop session | RemoteApp session | 
      |--|--|--|--|
      | Windows App on Windows | Any | Yes | Yes. Local device OS must be Windows 11, version 22H2 or later. |
      | Windows App on macOS | Any | Yes | Yes |
      | Windows App on iOS/iPadOS | 11.0.8 | Yes | Yes |
      | Windows App on Android (preview)&sup1; | 1.0.145 | Yes | Yes |

      1. Doesn't include support for Chrome OS.

   - Remote Desktop client:

      | Platform | Minimum version | Desktop session | RemoteApp session | 
      |--|--|--|--|
      | Windows (desktop client) | 1.2.1672 | Yes | Yes. Local device OS must be Windows 11, version 22H2 or later. |
      | Windows (Azure Virtual Desktop Store app) | Any | Yes | Yes. Local device OS must be Windows 11, version 22H2 or later. |
      | macOS | 10.7.0 or later | Yes | Yes |

   If a user tries to connect with a different app or version, such as Windows App in a web browser, the connection is denied and shows an error message with the code `0x1151`.

- To configure Microsoft Intune, you need:

   - Microsoft Entra ID account that is assigned the [Policy and Profile manager](/mem/intune/fundamentals/role-based-access-control-reference#policy-and-profile-manager) built-in RBAC role.

   - A group containing the devices you want to configure.

- To configure Group Policy, you need:

   - A domain account that is a member of the **Domain Admins** security group.

   - A security group or organizational unit (OU) containing the devices you want to configure.

## Enable screen capture protection on session hosts

Select the relevant tab for your scenario.

# [Microsoft Intune](#tab/intune)

To configure screen capture protection on session hosts using Microsoft Intune:

1. Sign in to the [Microsoft Intune admin center](https://endpoint.microsoft.com/).

1. [Create or edit a configuration profile](/mem/intune/configuration/administrative-templates-windows) for **Windows 10 and later** devices, with the **Settings catalog** profile type.

1. In the settings picker, browse to **Administrative templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**.

   :::image type="content" source="media/administrative-template/azure-virtual-desktop-intune-settings-catalog.png" alt-text="A screenshot showing the Azure Virtual Desktop options in the Microsoft Intune portal." lightbox="media/administrative-template/azure-virtual-desktop-intune-settings-catalog.png":::

1. Check the box for **Enable screen capture protection**, then close the settings picker.

1. Expand the **Administrative templates** category, then toggle the switch for **Enable screen capture protection** to **Enabled**.

   :::image type="content" source="media/screen-capture-protection/screen-capture-protection-intune.png" alt-text="A screenshot showing the screen capture protection settings in Microsoft Intune." lightbox="media/screen-capture-protection/screen-capture-protection-intune.png":::

1. Toggle the switch for **Screen Capture Protection Options (Device)** to **off** for **Block screen capture on client**, or **on** for **Block screen capture on client and server** based on your requirements, then select **OK**. 

1. Select **Next**.

1. *Optional*: On the **Scope tags** tab, select a scope tag to filter the profile. For more information about scope tags, see [Use role-based access control (RBAC) and scope tags for distributed IT](/mem/intune/fundamentals/scope-tags).

1. On the **Assignments** tab, select the group containing the computers providing a remote session you want to configure, then select **Next**.

1. On the **Review + create** tab, review the settings, then select **Create**.

1. Once the policy applies to the computers providing a remote session, restart them for the settings to take effect.

# [Group Policy](#tab/group-policy)

To configure screen capture protection on session hosts using Group Policy:

1. Follow the steps to make the [Administrative template for Azure Virtual Desktop](administrative-template.md) available in Group Policy.

1. Open the **Group Policy Management** console on a device you use to manage the Active Directory domain.

1. Create or edit a policy that targets the computers providing a remote session you want to configure.

1. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**.

   :::image type="content" source="media/administrative-template/azure-virtual-desktop-gpo.png" alt-text="A screenshot showing the Azure Virtual Desktop options in Group Policy." lightbox="media/administrative-template/azure-virtual-desktop-gpo.png":::

1. Double-click the policy setting **Enable screen capture protection** to open it, then select **Enabled**.

   :::image type="content" source="media/screen-capture-protection/screen-capture-protection-group-policy.png" alt-text="A screenshot showing the screen capture protection settings in Group Policy." lightbox="media/screen-capture-protection/screen-capture-protection-group-policy.png":::

1. From the drop-down menu, select the screen capture protection scenario you want to use from **Block screen capture on client** or **Block screen capture on client and server** based on your requirements, then select **OK**. 

1. Ensure the policy is applied to the computers providing a remote session, then restart them for the settings to take effect.

---

## Enable screen capture protection on local devices

To use screen capture protection on iOS/iPadOS and Android devices running Windows App, you need to configure an Intune app protection policy.

> [!TIP]
> On Windows and macOS, Windows App and the Remote Desktop client enforces screen capture protection settings from a session host without additional configuration.

To configure an Intune app protection policy to enable screen capture protection on iOS/iPadOS and Android devices:

1. Follow the steps to [Configure client device redirection settings for Windows App and the Remote Desktop app using Microsoft Intune](client-device-redirection-intune.md). Configuration of screen capture protection is part of an [app protection policy](client-device-redirection-intune.md#create-an-app-protection-policy).

1. When configuring an app protection policy, on the **Data protection** tab, configure the following setting, depending on the platform:

   1. For iOS/iPadOS, set **Send org data to other apps** to **None**.

   1. For Android, set **Screen capture and Google Assistant** to **Block**.

1. Configure other settings based on your requirements and target the app protection policy to users and devices. 

## Verify screen capture protection

To verify screen capture protection is working:

1. Connect to a new remote session with a supported client. Don't reconnect to an existing session. You need to sign out of any existing sessions and sign back in again for the change to take effect. 

1. From a local device, take a screenshot or share your screen in a Teams call or meeting. The content should be blocked or hidden.

1. If you enabled **Block screen capture on client and server** on your session hosts, try to capture the screen using a tool or service within the session host. The content should be blocked or hidden.

## Related content

- Enable [watermarking](watermarking.md), where admins can use a QR code to trace the session.

- Learn about how to secure your Azure Virtual Desktop deployment at [Security best practices](security-guide.md).
