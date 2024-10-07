---
title: Configure clipboard redirection over the Remote Desktop Protocol
description: Learn how to redirect the clipboard between a local device and a remote session over the Remote Desktop Protocol. It applies to Azure Virtual Desktop, Windows 365, and Microsoft Dev Box.
ms.topic: how-to
zone_pivot_groups: rdp-products-features
author: dknappettmsft
ms.author: daknappe
ms.date: 04/29/2024
---

# Configure clipboard redirection over the Remote Desktop Protocol

[!INCLUDE [include-rdp-shared-article](includes/include-rdp-shared-article.md)]

You can configure the redirection behavior of the clipboard between a local device and a remote session over the Remote Desktop Protocol (RDP).

::: zone pivot="azure-virtual-desktop"
For Azure Virtual Desktop, we recommend you enable clipboard redirection on your session hosts using Microsoft Intune or Group Policy, then control redirection using the host pool RDP properties. Additionally, in Windows Insider Preview, you can configure whether users can use the clipboard from session host to client, or client to session host, and the types of data that can be copied. For more information, see [Configure the clipboard transfer direction and types of data that can be copied](clipboard-transfer-direction-data-types.md).
::: zone-end

::: zone pivot="windows-365"
For Windows 365, you can configure your Cloud PCs using Microsoft Intune or Group Policy. Additionally, in Windows Insider Preview, you can configure whether users can use the clipboard from Cloud PC to client, or client to Cloud PC, and the types of data that can be copied. For more information, see [Configure the clipboard transfer direction and types of data that can be copied](clipboard-transfer-direction-data-types.md).
::: zone-end

::: zone pivot="dev-box"
For Microsoft Dev Box, you can configure your dev boxes using Microsoft Intune or Group Policy. Additionally, in Windows Insider Preview, you can configure whether users can use the clipboard from dev box to client, or client to dev box, and the types of data that can be copied. For more information, see [Configure the clipboard transfer direction and types of data that can be copied](clipboard-transfer-direction-data-types.md).
::: zone-end

This article provides information about the supported redirection methods and how to configure the redirection behavior for the clipboard. To learn more about how redirection works, see [Redirection over the Remote Desktop Protocol](redirection-remote-desktop-protocol.md).

## Prerequisites

Before you can configure clipboard redirection, you need:

::: zone pivot="azure-virtual-desktop"
- An existing host pool with session hosts.

- A Microsoft Entra ID account that is assigned the [Desktop Virtualization Host Pool Contributor](rbac.md#desktop-virtualization-host-pool-contributor) built-in role-based access control (RBAC) roles on the host pool as a minimum. 
::: zone-end

::: zone pivot="windows-365"
- An existing Cloud PC.
::: zone-end

::: zone pivot="dev-box"
- An existing dev box.
::: zone-end

- To configure Microsoft Intune, you need:

   - Microsoft Entra ID account that is assigned the [Policy and Profile manager](/mem/intune/fundamentals/role-based-access-control-reference#policy-and-profile-manager) built-in RBAC role.
   - A group containing the devices you want to configure.

- To configure Group Policy, you need:

   - A domain account that has permission to create or edit Group Policy objects.
   - A security group or organizational unit (OU) containing the devices you want to configure.

- You need to connect to a remote session from a supported app and platform. To view redirection support in Windows App and the Remote Desktop app, see [Compare Windows App features across platforms and devices](/windows-app/compare-platforms-features#redirection) and [Compare Remote Desktop app features across platforms and devices](compare-remote-desktop-clients.md#redirection).

## Configure clipboard redirection

::: zone pivot="azure-virtual-desktop"
Configuration of a session host using Microsoft Intune or Group Policy, or setting an RDP property on a host pool governs the ability to redirect the clipboard between the remote session and the local device, which is subject to a priority order.

The default configuration is:

- **Windows operating system**: Clipboard redirection isn't blocked.
- **Azure Virtual Desktop host pool RDP properties**: The clipboard is available between the remote session and the local device.
- **Resultant default behavior**: The clipboard is redirected in both directions between the remote session and the local device.

> [!IMPORTANT]
> Take care when configuring redirection settings as the most restrictive setting is the resultant behavior. For example, if you disable clipboard redirection on a session host with Microsoft Intune or Group Policy, but enable it with the host pool RDP property, redirection is disabled.

::: zone-end

::: zone pivot="windows-365"
Configuration of a Cloud PC governs the ability to redirect the clipboard between the remote session and the local device, and is set using Microsoft Intune or Group Policy.

The default configuration is:

- **Windows operating system**: Clipboard redirection isn't blocked.
- **Windows 365**: Clipboard redirection is enabled.
- **Resultant default behavior**: The clipboard is redirected in both directions between the remote session and the local device.

::: zone-end

::: zone pivot="dev-box"
Configuration of a dev box governs the ability to redirect the clipboard between the remote session and the local device, and is set using Microsoft Intune or Group Policy.

The default configuration is:

- **Windows operating system**: Clipboard redirection isn't blocked.
- **Microsoft Dev Box**: Clipboard redirection is enabled.
- **Resultant default behavior**: The clipboard is redirected in both directions between the remote session and the local device.

::: zone-end

::: zone pivot="azure-virtual-desktop"
### Configure clipboard redirection using host pool RDP properties

The Azure Virtual Desktop host pool setting *clipboard redirection* controls whether to redirect the clipboard between the remote session and the local device. The corresponding RDP property is `redirectclipboard:i:<value>`. For more information, see [Supported RDP properties](rdp-properties.md#device-redirection).

To configure clipboard redirection using host pool RDP properties:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the host pool you want to configure.

1. Select **RDP Properties**, then select **Device redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png" alt-text="A screenshot showing the host pool device redirection tab in the Azure portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png":::

1. For **Clipboard redirection**, select the drop-down list, then select one of the following options:

   - **Clipboard on local computer isn't available in remote session**
   - **Clipboard on local computer is available in remote session** (*default*)
   - **Not configured**

1. Select **Save**.

1. To test the configuration, connect to a remote session and copy and paste some text between the local device and remote session. Verify that the text is as expected.
::: zone-end

::: zone pivot="azure-virtual-desktop"
### Configure clipboard redirection using Microsoft Intune or Group Policy
::: zone-end

::: zone pivot="windows-365,dev-box"
### Configure clipboard redirection using Microsoft Intune or Group Policy
::: zone-end

Select the relevant tab for your scenario.

# [Microsoft Intune](#tab/intune)

To enable or disable clipboard redirection using Microsoft Intune:

1. Sign in to the [Microsoft Intune admin center](https://endpoint.microsoft.com/).

1. [Create or edit a configuration profile](/mem/intune/configuration/administrative-templates-windows) for **Windows 10 and later** devices, with the **Settings catalog** profile type.

1. In the settings picker, browse to **Administrative templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Device and Resource Redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-intune.png" alt-text="A screenshot showing the device and resource redirection options in the Microsoft Intune portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-intune.png":::

1. Check the box for **Do not allow Clipboard redirection**, then close the settings picker.

1. Expand the **Administrative templates** category, then toggle the switch for **Do not allow Clipboard redirection** to **Enabled** or **Disabled**, depending on your requirements:

   - To allow clipboard redirection, toggle the switch to **Disabled**, then select **OK**.

   - To disable clipboard redirection, toggle the switch to **Enabled**, then select **OK**.

1. Select **Next**.

1. *Optional*: On the **Scope tags** tab, select a scope tag to filter the profile. For more information about scope tags, see [Use role-based access control (RBAC) and scope tags for distributed IT](/mem/intune/fundamentals/scope-tags).

1. On the **Assignments** tab, select the group containing the computers providing a remote session you want to configure, then select **Next**.

1. On the **Review + create** tab, review the settings, then select **Create**.

1. Once the policy applies to the computers providing a remote session, restart them for the settings to take effect.

1. To test the configuration, connect to a remote session and copy and paste some text between the local device and remote session. Verify that the text is as expected.

# [Group Policy](#tab/group-policy)

To enable or disable clipboard redirection using Group Policy:

1. Open the **Group Policy Management** console on device you use to manage the Active Directory domain.

1. Create or edit a policy that targets the computers providing a remote session you want to configure.

1. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Device and Resource Redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-group-policy.png" alt-text="A screenshot showing the device and resource redirection options in the Group Policy editor." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-group-policy.png":::

1. Double-click the policy setting **Do not allow Clipboard redirection** to open it.

   - To enable clipboard redirection, select **Disabled** or **Not configured**, then select **OK**. 

   - To disable clipboard redirection, select **Enabled**, then select **OK**.

1. Ensure the policy is applied to the computers providing a remote session, then restart them for the settings to take effect.

1. To test the configuration, connect to a remote session and copy and paste some text between the local device and remote session. Verify that the text is as expected.

---

> [!IMPORTANT]
> If you disable [drive redirection](redirection-configure-drives-storage.md) using Intune or Group Policy, it also prevents files being transferred between the local device and remote session using the clipboard. Other content, such as text or images, isn't affected.

### Optional: Disable clipboard redirection on a local device

You can disable clipboard redirection on a local device to prevent the clipboard from being redirected between a remote session. This method is useful if you want to enable clipboard redirection for most users, but disable it for specific devices.

On a local Windows device, you can disable clipboard redirection by configuring the following registry key and value:

- **Key**: `HKEY_LOCAL_MACHINE\Software\Microsoft\Terminal Server Client`
- **Type**: `REG_DWORD`
- **Value name**: `DisableClipboardRedirection`
- **Value data**: `1`

For iOS/iPadOS and Android devices, you can disable clipboard redirection using Intune. For more information, see [Configure client device redirection settings for Windows App and the Remote Desktop app using Microsoft Intune](client-device-redirection-intune.md).

## Related content

[!INCLUDE [include-rdp-redirection-related-content](includes/include-rdp-redirection-related-content.md)]
