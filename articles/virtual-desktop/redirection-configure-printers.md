---
title: Configure printer redirection over the Remote Desktop Protocol
description: Learn how to redirect printers from a local device to a remote session over the Remote Desktop Protocol. It applies to Azure Virtual Desktop, Windows 365, and Microsoft Dev Box.
ms.topic: how-to
zone_pivot_groups: rdp-products-features
author: dknappettmsft
ms.author: daknappe
ms.date: 07/02/2024
---

# Configure printer redirection over the Remote Desktop Protocol

[!INCLUDE [include-rdp-shared-article](includes/include-rdp-shared-article.md)]

You can configure the redirection behavior of printers from a local device to a remote session over the Remote Desktop Protocol (RDP). Printer redirection supports locally attached and network printers. When you enable printer redirection, all printers available on the local device are redirected; you can't select specific printers to redirect. The default printer on the local device is automatically set as the default printer in the remote session.

::: zone pivot="azure-virtual-desktop"
Printer redirection uses high-level redirection and doesn't require drivers to be installed on session hosts. The **Remote Desktop Easy Print** driver is used automatically on session hosts. The driver for the printer must be installed on the local device for redirection to work correctly.

For Azure Virtual Desktop, we recommend you enable printer redirection on your session hosts using Microsoft Intune or Group Policy, then control redirection using the host pool RDP properties.
::: zone-end

::: zone pivot="windows-365"
Printer redirection uses high-level redirection and doesn't require drivers to be installed on a Cloud PC. The **Remote Desktop Easy Print** driver is used automatically on a Cloud PC. The driver for the printer must be installed on the local device for redirection to work correctly.

For Windows 365, you can configure your Cloud PCs using Microsoft Intune or Group Policy.
::: zone-end

::: zone pivot="dev-box"
Printer redirection uses high-level redirection and doesn't require drivers to be installed on a dev box. The **Remote Desktop Easy Print** driver is used automatically on a dev box. The driver for the printer must be installed on the local device for redirection to work correctly.

For Microsoft Dev Box, you can configure your dev boxes using Microsoft Intune or Group Policy.
::: zone-end

This article provides information about the supported redirection methods and how to configure the redirection behavior for printers. To learn more about how redirection works, see [Redirection over the Remote Desktop Protocol](redirection-remote-desktop-protocol.md).

> [!TIP]
> Azure Universal Print is an alternative solution to redirecting printers from a local device to a remote session. For more information, see [Discover Universal Print](/universal-print/discover-universal-print) and to learn about using it with Azure Virtual Desktop, see [Printing on Azure Virtual Desktop using Universal Print](/universal-print/fundamentals/universal-print-avd).

## Prerequisites

Before you can configure printer redirection, you need:

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

- A printer available on the local device. You need to make sure local device has the printer driver is installed correctly. No driver is needed in the remote session as redirected printers use the **Remote Desktop Easy Print** driver.

- To configure Microsoft Intune, you need:

   - Microsoft Entra ID account that is assigned the [Policy and Profile manager](/mem/intune/fundamentals/role-based-access-control-reference#policy-and-profile-manager) built-in RBAC role.
   - A group containing the devices you want to configure.

- To configure Group Policy, you need:

   - A domain account that has permission to create or edit Group Policy objects.
   - A security group or organizational unit (OU) containing the devices you want to configure.

- You need to connect to a remote session from a supported app and platform. To view redirection support in Windows App and the Remote Desktop app, see [Compare Windows App features across platforms and devices](/windows-app/compare-platforms-features#redirection) and [Compare Remote Desktop app features across platforms and devices](compare-remote-desktop-clients.md#redirection).

## Printer redirection

::: zone pivot="azure-virtual-desktop"
Configuration of a session host using Microsoft Intune or Group Policy, or setting an RDP property on a host pool governs the ability to redirect printers from a local device to a remote session, which is subject to a priority order.

The default configuration is:

- **Windows operating system**: Printer redirection isn't blocked.
- **Azure Virtual Desktop host pool RDP properties**: All printers are redirected from the local device to a remote session and the default printer on the local device is the default printer in the remote session.
- **Resultant default behavior**: All printers are redirected from the local device to a remote session and the default printer on the local device is the default printer in the remote session.

> [!IMPORTANT]
> Take care when configuring redirection settings as the most restrictive setting is the resultant behavior. For example, if you disable printer redirection on a session host with Microsoft Intune or Group Policy, but enable it with the host pool RDP property, redirection is disabled.

::: zone-end

::: zone pivot="windows-365"
Configuration of a Cloud PC governs the ability to redirect printers from a local device to a remote session, and is set using Microsoft Intune or Group Policy.

The default configuration is:

- **Windows operating system**: Printer redirection isn't blocked.
- **Windows 365**: All printers are redirected from the local device to a remote session and the default printer on the local device is the default printer in the remote session.
- **Resultant default behavior**: All printers are redirected from the local device to a remote session and the default printer on the local device is the default printer in the remote session.

::: zone-end

::: zone pivot="dev-box"
Configuration of a dev box governs the ability to redirect printers from a local device to a remote session, and is set using Microsoft Intune or Group Policy.

The default configuration is:

- **Windows operating system**: Printer redirection isn't blocked.
- **Microsoft Dev Box**: All printers are redirected from the local device to a remote session and the default printer on the local device is the default printer in the remote session.
- **Resultant default behavior**: All printers are redirected from the local device to a remote session and the default printer on the local device is the default printer in the remote session.

::: zone-end

::: zone pivot="azure-virtual-desktop"
### Configure printer redirection using host pool RDP properties

The Azure Virtual Desktop host pool setting *printer redirection* controls whether to redirect printers from a local device to a remote session. The corresponding RDP property is `redirectprinters:i:<value>`. For more information, see [Supported RDP properties](rdp-properties.md#device-redirection).

To configure printer redirection using host pool RDP properties:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the host pool you want to configure.

1. Select **RDP Properties**, then select **Device redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png" alt-text="A screenshot showing the host pool device redirection tab in the Azure portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png":::

1. For **Printer redirection**, select the drop-down list, then select one of the following options:

   - **The printers on the local computer are not available in remote session**
   - **The printers on the local computer are available in remote session** (*default*)
   - **Not configured**

1. Select **Save**.
::: zone-end

::: zone pivot="azure-virtual-desktop"
### Configure printer redirection using Microsoft Intune or Group Policy
::: zone-end

::: zone pivot="windows-365,dev-box"
### Configure printer redirection using Microsoft Intune or Group Policy
::: zone-end

Select the relevant tab for your scenario.

# [Microsoft Intune](#tab/intune)

To allow or disable printer redirection using Microsoft Intune:

1. Sign in to the [Microsoft Intune admin center](https://endpoint.microsoft.com/).

1. [Create or edit a configuration profile](/mem/intune/configuration/administrative-templates-windows) for **Windows 10 and later** devices, with the **Settings catalog** profile type.

1. In the settings picker, browse to **Administrative templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Printer Redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-printers-intune.png" alt-text="A screenshot showing the printer redirection options in the Microsoft Intune portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-printers-intune.png":::

1. Check the box for **Do not allow client printer redirection**, then close the settings picker.

1. Expand the **Administrative templates** category, then toggle the switch for **Do not allow client printer redirection** to **Enabled** or **Disabled**, depending on your requirements:

   - To allow printer redirection, toggle the switch to **Disabled**, then select **OK**.

   - To disable printer redirection, toggle the switch to **Enabled**, then select **OK**.

1. Select **Next**.

1. *Optional*: On the **Scope tags** tab, select a scope tag to filter the profile. For more information about scope tags, see [Use role-based access control (RBAC) and scope tags for distributed IT](/mem/intune/fundamentals/scope-tags).

1. On the **Assignments** tab, select the group containing the computers providing a remote session you want to configure, then select **Next**.

1. On the **Review + create** tab, review the settings, then select **Create**.

1. Once the policy applies to the computers providing a remote session, restart them for the settings to take effect.

# [Group Policy](#tab/group-policy)

To allow or disable printer redirection using Group Policy:

1. Open the **Group Policy Management** console on device you use to manage the Active Directory domain.

1. Create or edit a policy that targets the computers providing a remote session you want to configure.

1. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Printer Redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-printers-group-policy.png" alt-text="A screenshot showing the printer redirection options in the Group Policy editor." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-printers-group-policy.png":::

1. Double-click the policy setting **Do not allow client printer redirection** to open it.

   - To allow printer redirection, select **Disabled** or **Not configured**, then select **OK**. 

   - To disable printer redirection, select **Enabled**, then select **OK**.

1. Ensure the policy is applied to the computers providing a remote session, then restart them for the settings to take effect.

---

## Test printer redirection

Printer redirection uses high-level redirection; the printer is available locally and in the remote session concurrently, and requires the relevant driver installed locally. The driver for the printer doesn't need to be installed in the remote session as redirected printers use the **Remote Desktop Easy Print** driver.

To test printer redirection:

1. Make sure a printer is available on the local device that's functioning.

1. Connect to a remote session using Window App or the Remote Desktop app on a platform that supports printer redirection. For more information, see [Compare Windows App features across platforms and devices](/windows-app/compare-platforms-features#redirection) and [Compare Remote Desktop app features across platforms and devices](compare-remote-desktop-clients.md#redirection).

1. Check the printers available in the remote session. Here are some ways to check:

   1. Open **Printers & scanners** in the remote session from the start menu. Check the redirected printers appear in the list of printers. Redirected printers are identified where the name of the printer is appended with **(redirected *n*)**, where *n* is the user's session ID. The session ID is appended to make sure redirected printers are unique to the user's session.

      :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-printers.png" alt-text="A screenshot showing the available printers and scanners in the remote session." lightbox="media/redirection-remote-desktop-protocol/redirection-printers.png":::

   1. Open a PowerShell prompt in the remote session and run the following command:

      ```powershell
      Get-Printer | ? DriverName -eq "Remote Desktop Easy Print" | Sort-Object | FT -AutoSize
      ```
      
      The output is similar to the following output:

      ```output
      Name                                         ComputerName Type  DriverName                PortName Shared Published DeviceType
      ----                                         ------------ ----  ----------                -------- ------ --------- ----------
      HP Color LaserJet MFP M281fdw (redirected 2)              Local Remote Desktop Easy Print TS001    False  False     Print
      Microsoft Print to PDF (redirected 2)                     Local Remote Desktop Easy Print TS002    False  False     Print
      OneNote (Desktop) (redirected 2)                          Local Remote Desktop Easy Print TS003    False  False     Print
      ```

1. Open an application and print a test page to verify the printer is functioning correctly.

### Optional: Disable printer redirection on a local Windows device

You can disable printer redirection on a local Windows device to prevent printers from being redirected to a remote session. This method is useful if you want to enable printer redirection for most users, but disable it for specific Windows devices.

1. As an Administrator on a local Windows device, open the Registry Editor app from the start menu, or run `regedit.exe` from the command line.

1. Configure the following registry key and value. You don't need to restart the local device for the settings to take effect.

   - **Key**: `HKEY_LOCAL_MACHINE\Software\Microsoft\Terminal Server Client`
   - **Type**: `REG_DWORD`
   - **Value name**: `DisablePrinterRedirection`
   - **Value data**: `1`

## Related content

[!INCLUDE [include-rdp-redirection-related-content](includes/include-rdp-redirection-related-content.md)]
