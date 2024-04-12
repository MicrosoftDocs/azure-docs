---
title: Configure plug and play MTP and PTP redirection over the Remote Desktop Protocol
description: Learn how to redirect MTP and PTP plug and play peripherals from a local device to a remote session over the Remote Desktop Protocol. It applies to Azure Virtual Desktop, Windows 365, Microsoft Dev Box, Remote Desktop Services, and Remote PC connections.
ms.topic: how-to
zone_pivot_groups: rdp-products-features
author: dknappettmsft
ms.author: daknappe
ms.date: 07/03/2024
---

# Configure Media Transfer Protocol and Picture Transfer Protocol redirection on Windows over the Remote Desktop Protocol

[!INCLUDE [include-rdp-shared-article](includes/include-rdp-shared-article.md)]

You can configure the redirection behavior of peripherals that use the Media Transfer Protocol (MTP) or Picture Transfer Protocol (PTP), such as a digital camera, from a local device to a remote session over the Remote Desktop Protocol (RDP). 

::: zone pivot="azure-virtual-desktop"
For Azure Virtual Desktop, we recommend you enable MTP and PTP redirection on your session hosts using Microsoft Intune or Group Policy, then control redirection using the host pool RDP properties.
::: zone-end

::: zone pivot="windows-365"
For Windows 365, you can configure your Cloud PCs using Microsoft Intune or Group Policy. Once enabled, Windows 365 redirects all supported MTP and PTP peripherals.
::: zone-end

::: zone pivot="dev-box"
For Microsoft Dev Box, you can configure your dev boxes using Microsoft Intune or Group Policy. Once enabled, Microsoft Dev Box redirects all supported MTP and PTP peripherals.
::: zone-end

This article provides information about the supported redirection methods and how to configure the redirection behavior for MTP and PTP peripherals. To learn more about how redirection works, see [Redirection over the Remote Desktop Protocol](redirection-remote-desktop-protocol.md).

## MTP and PTP redirection vs USB redirection

Most MTP and PTP peripherals connect to a computer over USB. RDP supports redirecting MTP and PTP peripherals using native MTP and PTP redirection or opaque low-levelUSB device redirection, independent of each other. Behavior depends on the peripheral and its supported features.

Both redirection methods redirect the device to the remote session listed under **Portable Devices** in **Device Manager**. This device class is `WPD` and the device class GUID is `{eec5ad98-8080-425f-922a-dabf3de3f69a}`. You can find a list of the device classes at [System-Defined Device Setup Classes Available to Vendors](/windows-hardware/drivers/install/system-defined-device-setup-classes-available-to-vendors)

Devices are redirected differently depending on the redirection method used. MTP and PTP redirection uses high-level redirection; the peripheral is available locally and in the remote session concurrently, and requires the relevant driver installed locally. Opaque low-level USB redirection transports the raw communication of a peripheral, so requires the relevant driver installed in the remote session. You should use high-level redirection methods where possible. For more information, see [Redirection methods](redirection-remote-desktop-protocol.md#redirection-methods-and-classifications).

The following example shows the difference when redirecting an Apple iPhone using the two methods. Both methods achieve the same result where pictures can be imported from the iPhone to the remote session.

- Using MTP and PTP redirection, the iPhone is listed as **Digital Still Camera** to applications and under **Portable Devices** in **Device Manager**:

   :::image type="content" source="media/redirection-remote-desktop-protocol/remote-session-device-manager-portable-devices-mtp-ptp.png" alt-text="A screenshot showing portable devices in Device Manager using MTP and PTP redirection." lightbox="media/redirection-remote-desktop-protocol/remote-session-device-manager-portable-devices-mtp-ptp.png":::

- Using USB redirection, the iPhone is listed as **Apple iPhone** to applications and under **Portable Devices** in **Device Manager**:

   :::image type="content" source="media/redirection-remote-desktop-protocol/remote-session-device-manager-portable-devices-usb.png" alt-text="A screenshot showing portable devices in Device Manager using USB redirection." lightbox="media/redirection-remote-desktop-protocol/remote-session-device-manager-portable-devices-usb.png":::

The rest of this article covers MTP and PTP redirection. To learn how to configure USB redirection, see [Configure USB redirection on Windows over the Remote Desktop Protocol](redirection-configure-usb.md). 

## Prerequisites

Before you can configure MTP and PTP redirection, you need:

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

- A device that supports MTP or PTP you can use to test the redirection configuration connected to a local device.

- To configure Microsoft Intune, you need:

   - Microsoft Entra ID account that is assigned the [Policy and Profile manager](/mem/intune/fundamentals/role-based-access-control-reference#policy-and-profile-manager) built-in RBAC role.
   - A group containing the devices you want to configure.

- To configure Group Policy, you need:

   - A domain account that has permission to create or edit Group Policy objects.
   - A security group or organizational unit (OU) containing the devices you want to configure.

- You need to connect to a remote session from a supported app and platform. To view redirection support in Windows App and the Remote Desktop app, see [Compare Windows App features across platforms and devices](/windows-app/compare-platforms-features#redirection) and [Compare Remote Desktop app features across platforms and devices](compare-remote-desktop-clients.md#redirection).

## MTP and PTP redirection

::: zone pivot="azure-virtual-desktop"
Configuration of a session host using Microsoft Intune or Group Policy, or setting an RDP property on a host pool governs the ability to redirect MTP and PTP peripherals between the remote session and the local device, which is subject to a priority order.

The default configuration is:

- **Windows operating system**: MTP and PTP redirection isn't allowed.
- **Azure Virtual Desktop host pool RDP properties**: MTP and PTP devices are redirected from the local device to the remote session.
- **Resultant default behavior**: MTP and PTP peripherals aren't redirected.

> [!IMPORTANT]
> Take care when configuring redirection settings as the most restrictive setting is the resultant behavior. For example, if you disable MTP and PTP redirection on a session host with Microsoft Intune or Group Policy, but enable it with the host pool RDP property, redirection is disabled. You can also specify individual MTP and PTP peripherals to redirect only.

::: zone-end

::: zone pivot="windows-365"
Configuration of a Cloud PC governs the ability to redirect MTP and PTP peripherals between the remote session and the local device, and is set using Microsoft Intune or Group Policy.

The default configuration is:

- **Windows operating system**: MTP and PTP redirection isn't allowed.
- **Windows 365**: MTP and PTP redirection is enabled.
- **Resultant default behavior**: MTP and PTP peripherals are redirected.

::: zone-end

::: zone pivot="dev-box"
Configuration of a dev box governs the ability to redirect the MTP and PTP peripherals between the remote session and the local device, and is set using Microsoft Intune or Group Policy.

The default configuration is:

- **Windows operating system**: MTP and PTP redirection isn't allowed.
- **Microsoft Dev Box**: MTP and PTP redirection is enabled.
- **Resultant default behavior**: MTP and PTP peripherals are redirected.

::: zone-end

::: zone pivot="azure-virtual-desktop"
### Configure MTP and PTP redirection using host pool RDP properties

The Azure Virtual Desktop host pool setting *MTP and PTP device redirection* controls whether to redirect MTP and PTP peripherals between the remote session and the local device. The corresponding RDP property is `devicestoredirect:s:<value>`. For more information, see [Supported RDP properties](rdp-properties.md#device-redirection).

To configure MTP and PTP redirection using host pool RDP properties:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the host pool you want to configure.

1. Select **RDP Properties**, then select **Device redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png" alt-text="A screenshot showing the host pool device redirection tab in the Azure portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png":::

1. For **MTP and PTP device redirection**, select the drop-down list, then select one of the following options:

   - **Don't redirect any devices**
   - **Redirect portable media players based on the Media Transfer Protocol (MTP) and digital cameras based on the Picture Transfer Protocol (PTP)** (*default*)
   - **Not configured**

1. Select **Save**.

> [!TIP]
> If you enable redirection using host pool RDP properties, you need the check that redirection isn't blocked by a Microsoft Intune or Group Policy setting.

### Optional: Retrieve specific MTP and PTP device instance IDs and add them to the RDP property

By default, the host pool RDP property will redirect all supported MTP and PTP peripherals, but you can also enter specific device instance IDs in the host pool properties so that only the peripherals you approve are redirected. To retrieve the device instance IDs available of the USB devices on a local device you want to redirect:

1. On the local device, connect any devices you want to redirect.

1. Open a PowerShell prompt and run the following command:

   ```powershell
   Get-PnPdevice | Where-Object {$_.Class -eq "WPD" -and $_.Status -eq "OK"} | FT -AutoSize
   ```

   The output is similar to the following output. Make a note of the **InstanceId** value for each device you want to redirect.

   ```output
   Status Class FriendlyName InstanceId
   ------ ----- ------------ ----------
   OK     WPD   Apple iPhone USB\VID_05AC&PID_12A8&MI_00\B&1A733E8B&0&0000
   ```

1. In the Azure portal, return to the host pool RDP properties configuration, and select **Advanced**.

1. In the text box, find the relevant RDP property, which by default is `devicestoredirect:s:*`, then add the instance IDs you want to redirect, as shown in the following example. Separate each device instance ID with a semi-colon (`;`).

   ```uri
   devicestoredirect:s:USB\VID_05AC&PID_12A8&MI_00\B&1A733E8B&0&0000
   ```

1. Select **Save**.

> [!TIP]
> The following behavior is expected when you specify an instance ID:
>
> - If you refresh the Azure portal, the value you entered changes to lowercase and each backslash character in the instance ID is escaped by another backslash character.
>
> - When you navigate to the **Device redirection** tab, the value for **MTP and PTP device redirection** is blank.

::: zone-end

::: zone pivot="azure-virtual-desktop"
### Configure MTP and PTP redirection using Microsoft Intune or Group Policy
::: zone-end

::: zone pivot="windows-365,dev-box"
### Configure MTP and PTP redirection using Microsoft Intune or Group Policy
::: zone-end

Select the relevant tab for your scenario.

# [Microsoft Intune](#tab/intune)

To allow or disable MTP and PTP redirection using Microsoft Intune:

1. Sign in to the [Microsoft Intune admin center](https://endpoint.microsoft.com/).

1. [Create or edit a configuration profile](/mem/intune/configuration/administrative-templates-windows) for **Windows 10 and later** devices, with the **Settings catalog** profile type.

1. In the settings picker, browse to **Administrative templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Device and Resource Redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-intune.png" alt-text="A screenshot showing the device and resource redirection options in the Microsoft Intune portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-intune.png":::

1. Check the box for **Do not allow supported Plug and Play device redirection**, then close the settings picker.

1. Expand the **Administrative templates** category, then set toggle the switch for **Do not allow supported Plug and Play device redirection**, depending on your requirements:

   - To allow MTP and PTP redirection, toggle the switch to **Disabled**, then select **OK**.

   - To disable MTP and PTP redirection, toggle the switch to **Enabled**, then select **OK**.

1. Select **Next**.

1. *Optional*: On the **Scope tags** tab, select a scope tag to filter the profile. For more information about scope tags, see [Use role-based access control (RBAC) and scope tags for distributed IT](/mem/intune/fundamentals/scope-tags).

1. On the **Assignments** tab, select the group containing the computers providing a remote session you want to configure, then select **Next**.

1. On the **Review + create** tab, review the settings, then select **Create**.

1. Once the policy applies to the computers providing a remote session, restart them for the settings to take effect.

> [!NOTE]
> When you configure the Intune policy setting **Do not allow supported Plug and Play device redirection**, it also affects USB redirection.

# [Group Policy](#tab/group-policy)

To allow or disable MTP and PTP redirection using Group Policy:

1. Open the **Group Policy Management** console on device you use to manage the Active Directory domain.

1. Create or edit a policy that targets the computers providing a remote session you want to configure.

1. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Device and Resource Redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-group-policy.png" alt-text="A screenshot showing the device and resource redirection options in the Group Policy editor." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-group-policy.png":::

1. Double-click the policy setting **Do not allow supported Plug and Play device redirection** to open it.

   - To allow MTP and PTP redirection, select **Disabled**, then select **OK**.

   - To disable MTP and PTP redirection, select **Enabled**, then select **OK**.

1. Ensure the policy is applied to the computers providing a remote session, then restart them for the settings to take effect.

> [!NOTE]
> When you configure the Group Policy setting **Do not allow supported Plug and Play device redirection**, it also affects USB redirection.

---

::: zone pivot="azure-virtual-desktop"

::: zone-end

## Test MTP and PTP redirection

To test MTP and PTP redirection:

1. Make sure a device that supports MTP or PTP is connected to the local device.

1. Connect to a remote session using Window App or the Remote Desktop app on a platform that supports MTP and PTP redirection. For more information, see [Compare Windows App features across platforms and devices](/windows-app/compare-platforms-features#redirection) and [Compare Remote Desktop app features across platforms and devices](compare-remote-desktop-clients.md#redirection).

1. Check the MTP or PTP device is available in the remote session. Here are some ways to check:

   1. Open the **Photos** app (from Microsoft) in the remote session from the start menu. Select **Import** and check the redirected device appears in the list of connected devices.

      :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-photos-app-mtp-ptp.png" alt-text="A screenshot showing the available printers and scanners in the remote session." lightbox="media/redirection-remote-desktop-protocol/redirection-photos-app-mtp-ptp.png":::

   1. Open a PowerShell prompt in the remote session and run the following command:

      ```powershell
      Get-PnPdevice | ? Class -eq "WPD" | FT -AutoSize
      ```
      
      The output is similar to the following output:

      ```output
      Status Class FriendlyName         InstanceId
      ------ ----- ------------         ----------
      OK     WPD   Digital Still Camera TSBUS\UMB\2&FD4482C&0&TSDEVICE#0002.0003
      ```

      You can verify whether the device is redirected using MTP and PTP redirection or USB redirection by the **InstanceId** value:

      - For MTP and PTP redirection, the **InstanceId** value begins with `TSBUS`.
      
      - For USB redirection, the **InstanceId** value begins `USB`.

1. Open an application and print a test page to verify the printer is functioning correctly.

## Related content

[!INCLUDE [include-rdp-redirection-related-content](includes/include-rdp-redirection-related-content.md)]
