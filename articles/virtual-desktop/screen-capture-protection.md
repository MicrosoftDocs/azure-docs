---
title: Screen capture protection in Azure Virtual Desktop
description: Learn how to enable screen capture protection in Azure Virtual Desktop (preview) to help prevent sensitive information from being captured on client devices.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 06/28/2024
---

# Enable screen capture protection in Azure Virtual Desktop

Screen capture protection, alongside [watermarking](watermarking.md), helps prevent sensitive information from being captured on client endpoints through a specific set of operating system (OS) features and Application Programming Interfaces (APIs). When you enable screen capture protection, remote content is automatically blocked in screenshots and screen sharing. You can configure screen capture protection using Microsoft Intune or Group Policy on your session hosts.

There are two supported scenarios for screen capture protection, depending on the version of Windows you're using:

- **Block screen capture on client**: the session host instructs a supported Remote Desktop client to enable screen capture protection for a remote session. This option prevents screen capture from the client of applications running in the remote session.

- **Block screen capture on client and server**: the session host instructs a supported Remote Desktop client to enable screen capture protection for a remote session. This option prevents screen capture from the client of applications running in the remote session, but also prevents tools and services within the session host from capturing the screen.

When screen capture protection is enabled, users can't share their Remote Desktop window using local collaboration software, such as Microsoft Teams. With Teams, neither the local Teams app or using [Teams with media optimization](teams-on-avd.md) can share protected content.

> [!TIP]
> - To increase the security of your sensitive information, you should also disable clipboard, drive, and printer redirection. Disabling redirection helps prevent users from copying content from the remote session. To learn about supported redirection values, see [Device redirection](rdp-properties.md#device-redirection).
>
> - To discourage other methods of screen capture, such as taking a photo of a screen with a physical camera, you can enable [watermarking](watermarking.md), where admins can use a QR code to trace the session.

## Prerequisites

- Your session hosts must be running one of the following versions of Windows to use screen capture protection:

   - **Block screen capture on client** is available with a [supported version of Windows 10 or Windows 11](prerequisites.md#operating-systems-and-licenses).
   - **Block screen capture on client and server** is available starting with Windows 11, version 22H2.

- Users must connect to Azure Virtual Desktop with Windows App or the Remote Desktop app to use screen capture protection. The following table shows supported scenarios. If a user tries to connect with a different app or version, the connection is denied and shows an error message with the code `0x1151`.

   | App | Version | Desktop session | RemoteApp session | 
   |--|--|--|--|
   | Windows App on Windows | Any | Yes | Yes. Client device OS must be Windows 11, version 22H2 or later. |
   | Remote Desktop client on Windows | 1.2.1672 or later | Yes | Yes. Client device OS must be Windows 11, version 22H2 or later. |
   | Azure Virtual Desktop Store app | Any | Yes | Yes. Client device OS must be Windows 11, version 22H2 or later. |
   | Windows App on macOS | Any | Yes | Yes |
   | Remote Desktop client on macOS | 10.7.0 or later | Yes | Yes |

- To configure Microsoft Intune, you need:

   - Microsoft Entra ID account that is assigned the [Policy and Profile manager](/mem/intune/fundamentals/role-based-access-control-reference#policy-and-profile-manager) built-in RBAC role.

   - A group containing the devices you want to configure.

- To configure Group Policy, you need:

   - A domain account that is a member of the **Domain Admins** security group.

   - A security group or organizational unit (OU) containing the devices you want to configure.

## Enable screen capture protection

Screen capture protection is configured on session hosts and enforced by the client. Select the relevant tab for your scenario.

# [Microsoft Intune](#tab/intune)

To configure screen capture protection using Microsoft Intune:

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

To configure screen capture protection using Group Policy:

1. Follow the steps to make the [Administrative template for Azure Virtual Desktop](administrative-template.md) available to Group Policy.

1. Open the **Group Policy Management** console on device you use to manage the Active Directory domain.

1. Create or edit a policy that targets the computers providing a remote session you want to configure.

1. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**.

   :::image type="content" source="media/administrative-template/azure-virtual-desktop-gpo.png" alt-text="A screenshot showing the Azure Virtual Desktop options in Group Policy." lightbox="media/administrative-template/azure-virtual-desktop-gpo.png":::

1. Double-click the policy setting **Enable screen capture protection** to open it, then select **Enabled**.

   :::image type="content" source="media/screen-capture-protection/screen-capture-protection-group-policy.png" alt-text="A screenshot showing the screen capture protection settings in Group Policy." lightbox="media/screen-capture-protection/screen-capture-protection-group-policy.png":::

1. From the drop-down menu, select the screen capture protection scenario you want to use from **Block screen capture on client** or **Block screen capture on client and server** based on your requirements, then select **OK**. 

1. Ensure the policy is applied to the computers providing a remote session, then restart them for the settings to take effect.

---

## Verify screen capture protection

To verify screen capture protection is working:

1. Connect to a remote session with a supported client.

1. Take a screenshot or share your screen in a Teams call or meeting. The content should be blocked or hidden. Any existing sessions need to sign out and back in again for the change to take effect.


## Related content

- Enable [watermarking](watermarking.md), where admins can use a QR code to trace the session.

- Learn about how to secure your Azure Virtual Desktop deployment at [Security best practices](security-guide.md).
