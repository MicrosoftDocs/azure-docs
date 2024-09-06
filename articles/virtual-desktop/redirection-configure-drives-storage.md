---
title: Configure fixed, removable, and network drive redirection over the Remote Desktop Protocol
description: Learn how to redirect fixed, removable, and network storage drives from a local device to a remote session over the Remote Desktop Protocol. It applies to Azure Virtual Desktop, Windows 365, and Microsoft Dev Box.
ms.topic: how-to
zone_pivot_groups: rdp-products-features
author: dknappettmsft
ms.author: daknappe
ms.date: 04/29/2024
---

# Configure fixed, removable, and network drive redirection over the Remote Desktop Protocol

[!INCLUDE [include-rdp-shared-article](includes/include-rdp-shared-article.md)]

You can configure the redirection behavior of fixed, removable, and network drives from a local device to a remote session over the Remote Desktop Protocol (RDP).

::: zone pivot="azure-virtual-desktop"
For Azure Virtual Desktop, we recommend you enable drive redirection on your session hosts using Microsoft Intune or Group Policy, then control redirection using the host pool RDP properties.
::: zone-end

::: zone pivot="windows-365"
For Windows 365, you can configure your Cloud PCs using Microsoft Intune or Group Policy.
::: zone-end

::: zone pivot="dev-box"
For Microsoft Dev Box, you can configure your dev boxes using Microsoft Intune or Group Policy.
::: zone-end

This article provides information about the supported redirection methods and how to configure the redirection behavior for drives and storage. To learn more about how redirection works, see [Redirection over the Remote Desktop Protocol](redirection-remote-desktop-protocol.md).

## Prerequisites

Before you can configure drive redirection, you need:

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

- Each drive you want to redirect must have a drive letter assigned on the local device.

- If you want to test drive redirection with a removable drive, you need a removable drive connected to the local device.

- To configure Microsoft Intune, you need:

   - Microsoft Entra ID account that is assigned the [Policy and Profile manager](/mem/intune/fundamentals/role-based-access-control-reference#policy-and-profile-manager) built-in RBAC role.
   - A group containing the devices you want to configure.

- To configure Group Policy, you need:

   - A domain account that has permission to create or edit Group Policy objects.
   - A security group or organizational unit (OU) containing the devices you want to configure.

- You need to connect to a remote session from a supported app and platform. To view redirection support in Windows App and the Remote Desktop app, see [Compare Windows App features across platforms and devices](/windows-app/compare-platforms-features#redirection) and [Compare Remote Desktop app features across platforms and devices](compare-remote-desktop-clients.md#redirection).

## Configure drive redirection

::: zone pivot="azure-virtual-desktop"
Configuration of a session host using Microsoft Intune or Group Policy, or setting an RDP property on a host pool governs the ability to redirect drives from a local device to a remote session, which is subject to a priority order.

The default configuration is:

- **Windows operating system**: Drive and storage redirection isn't blocked.
- **Azure Virtual Desktop host pool RDP properties**: All drives are redirected from the local device to a remote session, including ones that are connected later.
- **Resultant default behavior**: All drives are redirected from the local device to a remote session, including ones that are connected later.

> [!IMPORTANT]
> Take care when configuring redirection settings as the most restrictive setting is the resultant behavior. For example, if you disable drive and storage redirection on a session host with Microsoft Intune or Group Policy, but enable it with the host pool RDP property, redirection is disabled.

::: zone-end

::: zone pivot="windows-365"
Configuration of a Cloud PC governs the ability to redirect drives from a local device to a remote session, and is set using Microsoft Intune or Group Policy.

The default configuration is:

- **Windows operating system**: Drive redirection isn't blocked.
- **Windows 365**: All drives are redirected from the local device to a remote session, including ones that are connected later.
- **Resultant default behavior**: All drives are redirected from the local device to a remote session, including ones that are connected later.

::: zone-end

::: zone pivot="dev-box"
Configuration of a dev box governs the ability to redirect drives from a local device to a remote session, and is set using Microsoft Intune or Group Policy.

The default configuration is:

- **Windows operating system**: Drive and storage redirection isn't blocked.
- **Microsoft Dev Box**: All drives are redirected from the local device to a remote session, including ones that are connected later.
- **Resultant default behavior**: All drives are redirected from the local device to a remote session, including ones that are connected later.

::: zone-end

::: zone pivot="azure-virtual-desktop"
### Configure drive redirection using host pool RDP properties

The Azure Virtual Desktop host pool setting *drive/storage redirection* controls whether to redirect drives from a local device to a remote session. The corresponding RDP property is `drivestoredirect:s:<value>`. For more information, see [Supported RDP properties](rdp-properties.md#device-redirection).

To configure drive redirection using host pool RDP properties:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the host pool you want to configure.

1. Select **RDP Properties**, then select **Device redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png" alt-text="A screenshot showing the host pool device redirection tab in the Azure portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png":::

1. For **Drive/storage redirection**, select the drop-down list, then select one of the following options:

   - **Don't redirect any drives**
   - **Redirect all disk drives, including ones that are connected later** (*default*)
   - **Dynamic drives: redirect any drives that are connected later**
   - **Manually enter drives and labels**
   - **Not configured**

1. If you select **Manually enter drives and labels**, an extra box shows. You need to enter the drive letter for each fixed, removable, and network drive you want to redirect, with each drive letter followed by a semicolon. For Azure Virtual Desktop, the characters `\`, `:`, and `;` must be escaped using a backslash character. For example, to redirect drives `C:\` and `D:\` from the local device, enter `C\:\\\;D\:\\\;`.

1. Select **Save**.

1. To test the configuration, make sure the drives you configured to redirect are connected to the local device, then connect to a remote session. Verify that drives you redirected are available in **File Explorer** or **Disk Management** in the remote session. If you selected **Redirect all disk drives, including ones that are connected later** or **Dynamic drives: redirect any drives that are connected later**, you can connect more drives to the local device after you connect to the remote session and verify they're redirected too.
::: zone-end

::: zone pivot="azure-virtual-desktop"
### Configure drive redirection using Microsoft Intune or Group Policy
::: zone-end

::: zone pivot="windows-365,dev-box"
### Configure drive redirection using Microsoft Intune or Group Policy
::: zone-end

Select the relevant tab for your scenario.

# [Microsoft Intune](#tab/intune)

To enable or disable drive redirection using Microsoft Intune:

1. Sign in to the [Microsoft Intune admin center](https://endpoint.microsoft.com/).

1. [Create or edit a configuration profile](/mem/intune/configuration/administrative-templates-windows) for **Windows 10 and later** devices, with the **Settings catalog** profile type.

1. In the settings picker, browse to **Administrative templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Device and Resource Redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-intune.png" alt-text="A screenshot showing the device and resource redirection options in the Microsoft Intune portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-intune.png":::

1. Check the box for **Do not allow drive redirection**, then close the settings picker.

1. Expand the **Administrative templates** category, then toggle the switch for **Do not allow drive redirection** to **Enabled** or **Disabled**, depending on your requirements:

   - To allow drive redirection, toggle the switch to **Disabled**, then select **OK**.

   - To disable drive redirection, toggle the switch to **Enabled**, then select **OK**.

1. Select **Next**.

1. *Optional*: On the **Scope tags** tab, select a scope tag to filter the profile. For more information about scope tags, see [Use role-based access control (RBAC) and scope tags for distributed IT](/mem/intune/fundamentals/scope-tags).

1. On the **Assignments** tab, select the group containing the computers providing a remote session you want to configure, then select **Next**.

1. On the **Review + create** tab, review the settings, then select **Create**.

1. Once the policy applies to the computers providing a remote session, restart them for the settings to take effect.

# [Group Policy](#tab/group-policy)

To enable or disable drive redirection using Group Policy:

1. Open the **Group Policy Management** console on device you use to manage the Active Directory domain.

1. Create or edit a policy that targets the computers providing a remote session you want to configure.

1. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Device and Resource Redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-group-policy.png" alt-text="A screenshot showing the device and resource redirection options in the Group Policy editor." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-group-policy.png":::

1. Double-click the policy setting **Do not allow drive redirection** to open it.

   - To enable drive redirection, select **Disabled** or **Not configured**, then select **OK**. 

   - To disable drive redirection, select **Enabled**, then select **OK**.

1. Ensure the policy is applied to the computers providing a remote session, then restart them for the settings to take effect.

---

> [!IMPORTANT]
> - Network drives that are disconnected aren't redirected. Once the network drives are reconnected, they're not automatically redirected during the remote session. You need to disconnect and reconnect to the remote session to redirect the network drives.
>
> - If you disable drive redirection using Intune or Group Policy, it also prevents files being transferred between the local device and remote session using the clipboard. Other content, such as text or images, isn't affected.

## Test drive redirection

To test drive redirection:

1. Connect to a remote session using Window App or the Remote Desktop app on a platform that supports drive redirection. For more information, see [Compare Windows App features across platforms and devices](/windows-app/compare-platforms-features#redirection) and [Compare Remote Desktop app features across platforms and devices](compare-remote-desktop-clients.md#redirection).

1. Check the redirected drives available in the remote session. Here are some ways to check:

   1. Open **File explorer** in the remote session from the start menu. Select **This PC**, then check the redirected drives appear in the list. When you redirect drives from a local Windows device, it looks similar to the following image:

      :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-drives.png" alt-text="A screenshot showing the available drives in the remote session." lightbox="media/redirection-remote-desktop-protocol/redirection-drives.png":::

   1. Open a PowerShell prompt in the remote session and run the following command:

      ```powershell
      $CLSIDs = @()
      foreach($registryKey in (Get-ChildItem "Registry::HKEY_CLASSES_ROOT\CLSID" -Recurse)){
          If (($registryKey.GetValueNames() | %{$registryKey.GetValue($_)}) -eq "Drive or folder redirected using Remote Desktop") {
              $CLSIDs += $registryKey
          }
      }

      $drives = @()
      foreach ($CLSID in $CLSIDs.PSPath) {
          $drives += (Get-ItemProperty $CLSID)."(default)"
      }

      Write-Output "These are the local drives redirected to the remote session:`n"
      $drives
      ```

      The output is similar to the following output when you redirect drives from a local Windows device:

      ```output
      These are the local drives redirected to the remote session:

      C on DESKTOP
      S on DESKTOP
      ```

### Optional: Disable drive redirection on a local device

You can disable drive redirection on a local device to prevent the drives from being redirected between a remote session. This method is useful if you want to enable drive redirection for most users, but disable it for specific devices.

On a local Windows device, you can disable drive redirection by configuring the following registry key and value:

- **Key**: `HKEY_LOCAL_MACHINE\Software\Microsoft\Terminal Server Client`
- **Type**: `REG_DWORD`
- **Value name**: `DisableDriveRedirection`
- **Value data**: `1`

For iOS/iPadOS and Android devices, you can disable drive redirection using Intune. For more information, see [Configure client device redirection settings for Windows App and the Remote Desktop app using Microsoft Intune](client-device-redirection-intune.md).

## Related content

[!INCLUDE [include-rdp-redirection-related-content](includes/include-rdp-redirection-related-content.md)]
