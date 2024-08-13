---
title: Configure serial or COM port redirection over the Remote Desktop Protocol
description: Learn how to redirect serial or COM ports from a local device to a remote session over the Remote Desktop Protocol. It applies to Azure Virtual Desktop, Windows 365, and Microsoft Dev Box.
ms.topic: how-to
zone_pivot_groups: rdp-products-features
author: dknappettmsft
ms.author: daknappe
ms.date: 04/29/2024
---

# Configure serial or COM port redirection over the Remote Desktop Protocol

[!INCLUDE [include-rdp-shared-article](includes/include-rdp-shared-article.md)]

You can configure the redirection behavior of serial or COM ports between a local device and a remote session over the Remote Desktop Protocol (RDP). 

::: zone pivot="azure-virtual-desktop"
For Azure Virtual Desktop, we recommend you enable serial or COM port redirection on your session hosts using Microsoft Intune or Group Policy, then control redirection using the host pool RDP properties.
::: zone-end

::: zone pivot="windows-365"
For Windows 365, you can configure your Cloud PCs using Microsoft Intune or Group Policy.
::: zone-end

::: zone pivot="dev-box"
For Microsoft Dev Box, you can configure your dev boxes using Microsoft Intune or Group Policy.
::: zone-end

This article provides information about the supported redirection methods and how to configure the redirection behavior serial or COM ports. To learn more about how redirection works, see [Redirection over the Remote Desktop Protocol](redirection-remote-desktop-protocol.md).

## Prerequisites

Before you can configure serial or COM port redirection, you need:

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

- A serial or COM port on a local device and a peripheral that connects to the port. Serial or COM port redirection uses opaque low-level redirection, so drivers need to be installed in the remote session for the peripheral to function correctly.

- To configure Microsoft Intune, you need:

   - Microsoft Entra ID account that is assigned the [Policy and Profile manager](/mem/intune/fundamentals/role-based-access-control-reference#policy-and-profile-manager) built-in RBAC role.
   - A group containing the devices you want to configure.

- To configure Group Policy, you need:

   - A domain account that has permission to create or edit Group Policy objects.
   - A security group or organizational unit (OU) containing the devices you want to configure.

- You need to connect to a remote session from a supported app and platform. To view redirection support in Windows App and the Remote Desktop app, see [Compare Windows App features across platforms and devices](/windows-app/compare-platforms-features#redirection) and [Compare Remote Desktop app features across platforms and devices](compare-remote-desktop-clients.md#redirection).

## Serial or COM port redirection

::: zone pivot="azure-virtual-desktop"
Configuration of a session host using Microsoft Intune or Group Policy, or setting an RDP property on a host pool governs the ability to redirect serial or COM ports from the local device to the remote session, which is subject to a priority order.

The default configuration is:

- **Windows operating system**: Serial or COM port redirection isn't blocked.
- **Azure Virtual Desktop host pool RDP properties**: Serial or COM ports are redirected from the local device to the remote session.
- **Resultant default behavior**: Serial or COM ports are redirected from the local device to the remote session.

> [!IMPORTANT]
> Take care when configuring redirection settings as the most restrictive setting is the resultant behavior. For example, if you disable serial or COM port redirection on a session host with Microsoft Intune or Group Policy, but enable it with the host pool RDP property, redirection is disabled.

::: zone-end

::: zone pivot="windows-365"
Configuration of a Cloud PC governs the ability to redirect the serial or COM ports from the local device to the remote session, and is set using Microsoft Intune or Group Policy.

The default configuration is:

- **Windows operating system**: Serial or COM port redirection isn't blocked.
- **Windows 365**: Serial or COM ports are redirected from the local device to the remote session.
- **Resultant default behavior**: Serial or COM ports are redirected from the local device to the remote session.

::: zone-end

::: zone pivot="dev-box"
Configuration of a dev box governs the ability to redirect Serial or COM port from the local device to the remote session, and is set using Microsoft Intune or Group Policy.

The default configuration is:

- **Windows operating system**: Serial or COM port redirection isn't blocked.
- **Microsoft Dev Box**: Serial or COM ports are redirected from the local device to the remote session.
- **Resultant default behavior**: Serial or COM ports are redirected from the local device to the remote session.

::: zone-end

::: zone pivot="azure-virtual-desktop"
### Configure serial or COM port redirection using host pool RDP properties

The Azure Virtual Desktop host pool setting *COM ports redirection* controls whether to redirect the serial or COM ports between the remote session and the local device. The corresponding RDP property is `redirectcomports:i:<value>`. For more information, see [Supported RDP properties](rdp-properties.md#device-redirection).

To configure serial or COM port redirection using host pool RDP properties:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the host pool you want to configure.

1. Select **RDP Properties**, then select **Device redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png" alt-text="A screenshot showing the host pool device redirection tab in the Azure portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png":::

1. For **COM ports redirection**, select the drop-down list, then select one of the following options:

   - **COM ports on the local computer are not available in the remote session**
   - **COM ports on the local computer are available in the remote session** (*default*)
   - **Not configured**

1. Select **Save**.

::: zone-end

::: zone pivot="azure-virtual-desktop"
### Configure serial or COM port redirection using Microsoft Intune or Group Policy
::: zone-end

::: zone pivot="windows-365,dev-box"
### Configure serial or COM port redirection using Microsoft Intune or Group Policy
::: zone-end

Select the relevant tab for your scenario.

# [Microsoft Intune](#tab/intune)

To allow or disable serial or COM port redirection using Microsoft Intune:

1. Sign in to the [Microsoft Intune admin center](https://endpoint.microsoft.com/).

1. [Create or edit a configuration profile](/mem/intune/configuration/administrative-templates-windows) for **Windows 10 and later** devices, with the **Settings catalog** profile type.

1. In the settings picker, browse to **Administrative templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Device and Resource Redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-intune.png" alt-text="A screenshot showing the device and resource redirection options in the Microsoft Intune portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-intune.png":::

1. Check the box for **Do not allow COM port redirection**, then close the settings picker.

1. Expand the **Administrative templates** category, then toggle the switch for **Do not allow COM port redirection** to **Enabled** or **Disabled**, depending on your requirements:

   - To allow serial or COM port redirection, toggle the switch to **Disabled**, then select **OK**.

   - To disable serial or COM port redirection, toggle the switch to **Enabled**, then select **OK**.

1. Select **Next**.

1. *Optional*: On the **Scope tags** tab, select a scope tag to filter the profile. For more information about scope tags, see [Use role-based access control (RBAC) and scope tags for distributed IT](/mem/intune/fundamentals/scope-tags).

1. On the **Assignments** tab, select the group containing the computers providing a remote session you want to configure, then select **Next**.

1. On the **Review + create** tab, review the settings, then select **Create**.

1. Once the policy applies to the computers providing a remote session, restart them for the settings to take effect.

# [Group Policy](#tab/group-policy)

To allow or disable serial or COM port redirection using Group Policy:

1. Open the **Group Policy Management** console on device you use to manage the Active Directory domain.

1. Create or edit a policy that targets the computers providing a remote session you want to configure.

1. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Device and Resource Redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-group-policy.png" alt-text="A screenshot showing the device and resource redirection options in the Group Policy editor." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-group-policy.png":::

1. Double-click the policy setting **Do not allow COM port redirection** to open it.

   - To allow serial or COM port redirection, select **Disabled** or **Not configured**, then select **OK**. 

   - To disable serial or COM port redirection, select **Enabled**, then select **OK**.

1. Ensure the policy is applied to the computers providing a remote session, then restart them for the settings to take effect.

---

## Test serial or COM port redirection

When using serial or COM port redirection, consider the following behavior:

- Drivers for redirected peripherals connected to a serial or COM port need to be installed in the remote session using the same process as the local device. Ensure that Windows Update is enabled in the remote session, or that drivers are available for the peripheral.

- Opaque low-level redirection is designed for LAN connections; with higher latency, some peripherals connected to a serial or COM port might not function properly, or the user experience might not suitable.

- Peripherals connected to a serial or COM port aren't available on the local device locally while it's redirected to the remote session.

- Peripherals connected to a serial or COM port can only be used in one remote session at a time.

- Serial or COM port redirection is only available from a local Windows device.

To test serial or COM port redirection from a local Windows device:

1. Plug in the supported peripherals you want to use in a remote session to a serial or COM port.

1. Connect to a remote session using Window App or the Remote Desktop app on a platform that supports drive redirection. For more information, see [Compare Windows App features across platforms and devices](/windows-app/compare-platforms-features#redirection) and [Compare Remote Desktop app features across platforms and devices](compare-remote-desktop-clients.md#redirection).

1. Check the device is functioning correctly in the remote session. As serial or COM ports are redirected using opaque low-level redirection, the correct driver needs to be installed in the remote session, which you need to do if it's not installed automatically.

   Here are some ways to check the USB peripherals are available in the remote session, depending on the permission you have in the remote session:

   1. Open **Device Manager** in the remote session from the start menu, or run `devmgmt.msc` from the command line. Check the redirected peripherals appear in the expected device category and don't show any errors.

      :::image type="content" source="media/redirection-remote-desktop-protocol/remote-session-device-manager.png" alt-text="A screenshot showing device manager in a remote session.":::

   1. Open a Command Prompt or PowerShell prompt on both the local device and in the remote session, then run the following command in both locations. This command shows the serial or COM ports available locally and enable you to verify that they're available in the remote session.

      ```cmd
      chgport
      ```
      
      The output is similar to the following output:

      - On the local device:

         ```output
         COM3 = \Device\Serial0
         COM4 = \Device\Serial1
         ```

      - In the remote session:

         ```output
         COM3 = \Device\RdpDrPort\;COM3:2\tsclient\COM3
         COM4 = \Device\RdpDrPort\;COM4:2\tsclient\COM4
         ```

1. Once the peripherals are redirected and functioning correctly, you can use them as you would on a local device.

## Related content

[!INCLUDE [include-rdp-redirection-related-content](includes/include-rdp-redirection-related-content.md)]
