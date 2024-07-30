---
title: Configure default chroma value for Azure Virtual Desktop
description: Learn how to configure the default chroma value from 4:2:0 to 4:4:4.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 05/21/2024
---

# Configure the default chroma value for Azure Virtual Desktop

The chroma value determines the color space used for encoding. By default, the chroma value is set to 4:2:0, which provides a good balance between image quality and network bandwidth. You can increase the default chroma value to 4:4:4 to improve image quality. You don't need to use GPU acceleration to change the default chroma value.

This article shows you how to set the default chroma value. You can use Microsoft Intune or Group Policy to configure your session hosts.

## Prerequisites

Before you can configure the default chroma value, you need:

- An existing host pool with session hosts.

- To configure Microsoft Intune, you need:

   - Microsoft Entra ID account that is assigned the [Policy and Profile manager](/mem/intune/fundamentals/role-based-access-control-reference#policy-and-profile-manager) built-in RBAC role.

   - A group containing the devices you want to configure.

- To configure Group Policy, you need:

   - A domain account that is a member of the **Domain Admins** security group.

   - A security group or organizational unit (OU) containing the devices you want to configure.

## Increase the default chroma value to 4:4:4

By default, the chroma value is set to 4:2:0. You can increase the default chroma value to 4:4:4 using Microsoft Intune or Group Policy.

Select the relevant tab for your scenario.

# [Microsoft Intune](#tab/intune)

To increase the default chroma value to 4:4:4 using Microsoft Intune:

1. Sign in to the [Microsoft Intune admin center](https://endpoint.microsoft.com/).

1. [Create or edit a configuration profile](/mem/intune/configuration/administrative-templates-windows) for **Windows 10 and later** devices, with the **Settings catalog** profile type.

1. In the settings picker, browse to **Administrative templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Remote Session Environment**.

   :::image type="content" source="media/enable-gpu-acceleration/remote-session-environment-intune.png" alt-text="A screenshot showing the redirection options in the Microsoft Intune portal." lightbox="media/enable-gpu-acceleration/remote-session-environment-intune.png":::

1. Check the box for the following settings, then close the settings picker:

   1. **Prioritize H.264/AVC 444 Graphics mode for Remote Desktop connections**

   1. **Configure image quality for RemoteFX Adaptive Graphics**

1. Expand the **Administrative templates** category, then set each setting as follows:

   1. Set toggle the switch for **Prioritize H.264/AVC 444 Graphics mode for Remote Desktop connections** to **Enabled**.

   1. Set toggle the switch for **Configure image quality for RemoteFX Adaptive Graphics** to **Enabled**, then for **Image quality: (Device)**, select **High**.

1. Select **Next**.

1. *Optional*: On the **Scope tags** tab, select a scope tag to filter the profile. For more information about scope tags, see [Use role-based access control (RBAC) and scope tags for distributed IT](/mem/intune/fundamentals/scope-tags).

1. On the **Assignments** tab, select the group containing the computers providing a remote session you want to configure, then select **Next**.

1. On the **Review + create** tab, review the settings, then select **Create**.

1. Once the policy applies to the computers providing a remote session, restart them for the settings to take effect.

# [Group Policy](#tab/group-policy)

To increase the default chroma value to 4:4:4 using Group Policy:

1. Open the **Group Policy Management** console on device you use to manage the Active Directory domain.

1. Create or edit a policy that targets the computers providing a remote session you want to configure.

1. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Remote Session Environment**.

   :::image type="content" source="media/enable-gpu-acceleration/remote-session-environment-group-policy.png" alt-text="A screenshot showing the redirection options in the Group Policy editor." lightbox="media/enable-gpu-acceleration/remote-session-environment-group-policy.png":::

1. Configure the following settings:

   1. Double-click the policy setting **Prioritize H.264/AVC 444 Graphics mode for Remote Desktop connections** to open it. Select **Enabled**, then select **OK**.

   1. Double-click the policy setting **Configure image quality for RemoteFX Adaptive Graphics** to **Enabled**, then for **Image quality**, select **High**. Select **OK**.

1. Ensure the policy is applied to your session hosts, then restart them for the settings to take effect.

---

## Verify a remote session is using a chroma value of 4:4:4

To verify that a remote session is using a chroma value of 4:4:4, you need to [open an Azure support request](https://azure.microsoft.com/support/create-ticket/) with Microsoft Support who can verify the chroma value from telemetry.

## Related content

- [Configure GPU acceleration](enable-gpu-acceleration.md)
