---
title: Configure camera, webcam, and video capture redirection over the Remote Desktop Protocol
description: Learn how to redirect camera, webcam, and video capture peripherals, and also video encoding and quality, from a local device to a remote session over the Remote Desktop Protocol. It applies to Azure Virtual Desktop, Windows 365, and Microsoft Dev Box.
ms.topic: how-to
zone_pivot_groups: rdp-products-features
author: dknappettmsft
ms.author: daknappe
ms.date: 04/24/2024
---

# Configure camera, webcam, and video capture redirection over the Remote Desktop Protocol

[!INCLUDE [include-rdp-shared-article](includes/include-rdp-shared-article.md)]

You can configure the redirection behavior of cameras, webcams, and video capture peripherals, and also video encoding and quality, from a local device to a remote session over the Remote Desktop Protocol (RDP).

::: zone pivot="azure-virtual-desktop"
For Azure Virtual Desktop, we recommend you enable camera, webcam, and video capture redirection on your session hosts using Microsoft Intune or Group Policy, then control redirection using the host pool RDP properties.
::: zone-end

::: zone pivot="windows-365"
For Windows 365, you can configure your Cloud PCs using Microsoft Intune or Group Policy.
::: zone-end

::: zone pivot="dev-box"
For Microsoft Dev Box, you can configure your dev boxes using Microsoft Intune or Group Policy.
::: zone-end

This article provides information about the supported redirection methods and how to configure the redirection behavior for camera, webcam, and video capture peripherals. To learn more about how redirection works, see [Redirection over the Remote Desktop Protocol](redirection-remote-desktop-protocol.md).

::: zone pivot="azure-virtual-desktop"
> [!TIP]
> If you use the following features in a remote session, they have their own optimizations that are independent from the redirection configuration on the session host, host pool RDP properties, or local device. 
>
> - [Microsoft Teams](teams-on-avd.md) for camera, microphone, and audio redirection.
> - [Multimedia redirection](multimedia-redirection-intro.md) for audio, video and call redirection. 

::: zone-end

::: zone pivot="windows-365"
> [!TIP]
> If you use the following features in a remote session, they have their own optimizations that are independent from the redirection configuration on the Cloud PC or local device. 
>
> - [Microsoft Teams](/windows-365/enterprise/teams-on-cloud-pc) for camera, microphone, and audio redirection.
> - [Multimedia redirection](multimedia-redirection-intro.md) for audio, video and call redirection. 

::: zone-end

::: zone pivot="dev-box"
> [!TIP]
> If you use the following features in a remote session, they have their own optimizations that are independent from the redirection configuration on the dev box or local device. 
>
> - [Microsoft Teams](/windows-365/enterprise/teams-on-cloud-pc) for camera, microphone, and audio redirection.
> - [Multimedia redirection](multimedia-redirection-intro.md) for audio, video and call redirection. 

::: zone-end

## Prerequisites

Before you can configure camera, webcam, and video capture redirection, you need:

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

- A camera, webcam, or video capture device you can use to test the redirection configuration.

- To configure Microsoft Intune, you need:

   - Microsoft Entra ID account that is assigned the [Policy and Profile manager](/mem/intune/fundamentals/role-based-access-control-reference#policy-and-profile-manager) built-in RBAC role.
   - A group containing the devices you want to configure.

- To configure Group Policy, you need:

   - A domain account that has permission to create or edit Group Policy objects.
   - A security group or organizational unit (OU) containing the devices you want to configure.

- You need to connect to a remote session from a supported app and platform. To view redirection support in Windows App and the Remote Desktop app, see [Compare Windows App features across platforms and devices](/windows-app/compare-platforms-features#redirection) and [Compare Remote Desktop app features across platforms and devices](compare-remote-desktop-clients.md#redirection).

## Configure camera, webcam, and video capture

::: zone pivot="azure-virtual-desktop"
Configuration of a session host or setting an RDP property on a host pool governs the ability to use cameras, webcams, and video capture peripherals in a remote session, which is subject to a priority order. The configuration of the session host controls whether cameras, webcams, and video capture peripherals can be redirected to a remote session, and is set using Microsoft Intune or Group Policy. A host pool RDP property controls whether cameras, webcams, and video capture peripherals can be redirected to a remote session over the Remote Desktop Protocol, and whether to redirect all applicable devices, or only those specified by Vendor ID (VID) and Product ID (PID).

The default configuration is:

- **Windows operating system**: Camera, webcam, and video capture peripheral redirection is allowed.
- **Azure Virtual Desktop host pool RDP properties**: Not configured.
- **Resultant default behavior**: Camera, webcam, and video capture peripherals are redirected to the local computer.

> [!IMPORTANT]
> Take care when configuring redirection settings as the most restrictive setting is the resultant behavior. For example, if you disable camera, webcam, and video capture peripheral redirection on a session host with Microsoft Intune or Group Policy, but enable it with the host pool RDP property, redirection is disabled.
::: zone-end

::: zone pivot="windows-365"
Configuration of a Cloud PC governs the ability to use cameras, webcams, and video capture peripherals in a remote session, and is set using Microsoft Intune or Group Policy.

The default configuration is:

- **Windows operating system**: Camera, webcam, and video capture peripheral redirection isn't blocked.
- **Windows 365**: Camera, webcam, and video capture peripheral redirection is enabled.
- **Resultant default behavior**: Camera, webcam, and video capture peripherals are redirected to the local computer.

::: zone-end

::: zone pivot="dev-box"
Configuration of a dev box governs the ability to use cameras, webcams, and video capture peripherals in a remote session, and is set using Microsoft Intune or Group Policy.

The default configuration is:

- **Windows operating system**: Camera, webcam, and video capture peripheral redirection isn't blocked.
- **Microsoft Dev Box**: Camera, webcam, and video capture peripheral redirection is enabled.
- **Resultant default behavior**: Camera, webcam, and video capture peripherals are redirected to the local computer.

::: zone-end

::: zone pivot="azure-virtual-desktop"
### Configure camera, webcam and video capture redirection using host pool RDP properties

The Azure Virtual Desktop host pool setting *camera redirection* controls whether cameras, webcams, and video capture peripherals are redirected from a local device to a remote session, and optionally which devices. The corresponding RDP property is `camerastoredirect:s:<value>`. For more information, see [Supported RDP properties](rdp-properties.md#device-redirection).

To configure camera, webcam and video capture redirection using host pool RDP properties:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the host pool you want to configure.

1. Select **RDP Properties**, then select **Device redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png" alt-text="A screenshot showing the host pool device redirection tab in the Azure portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png":::

1. For **Camera redirection**, select the drop-down list, then select one of the following options:

   - **Don't redirect any cameras**
   - **Redirect cameras**
   - **Manually enter list of cameras**
   - **Not configured** (*default*)

   1. If you select **Manually enter list of cameras**, enter the Vendor ID (VID) and Product ID (PID) of the cameras you want to redirect using a semicolon-delimited list of `KSCATEGORY_VIDEO_CAMERA` interfaces. Characters `\`, `:`, and `;` must be escaped with a backslash character `\`, and cannot end with a backslash. For example, the value `\?\usb#vid_0bda&pid_58b0&mi` needs to be entered as `\\?\\usb#vid_0bda&pid_58b0&mi`. You can find the VID and PID in the *device instance path* in Device Manager on the local device. For more information, see [Device instance path](redirection-remote-desktop-protocol.md#controlling-opaque-low-level-usb-redirection).

1. Select **Save**.

1. To test the configuration, connect to a remote session with a camera, webcam, or video capture peripheral and use it with a supported application for the peripheral, such as Microsoft Teams.
::: zone-end

::: zone pivot="azure-virtual-desktop"
### Configure video capture redirection using Microsoft Intune or Group Policy
::: zone-end

::: zone pivot="windows-365,dev-box"
### Configure video capture redirection using Microsoft Intune or Group Policy
::: zone-end

Select the relevant tab for your scenario.

# [Microsoft Intune](#tab/intune)

To allow or disable video capture redirection, which includes cameras and webcams, using Microsoft Intune:

1. Sign in to the [Microsoft Intune admin center](https://endpoint.microsoft.com/).

1. [Create or edit a configuration profile](/mem/intune/configuration/administrative-templates-windows) for **Windows 10 and later** devices, with the **Settings catalog** profile type.

1. In the settings picker, browse to **Administrative templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Device and Resource Redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-intune.png" alt-text="A screenshot showing the device and resource redirection options in the Microsoft Intune portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-intune.png":::

1. Check the box for **Do not allow video capture redirection**, then close the settings picker.

1. Expand the **Administrative templates** category, then toggle the switch for **Do not allow video capture redirection** to **Enabled** or **Disabled**, depending on your requirements:

   - To allow video capture redirection, toggle the switch to **Disabled**, then select **OK**.

   - To disable video capture redirection, toggle the switch to **Enabled**, then select **OK**.

1. Select **Next**.

1. *Optional*: On the **Scope tags** tab, select a scope tag to filter the profile. For more information about scope tags, see [Use role-based access control (RBAC) and scope tags for distributed IT](/mem/intune/fundamentals/scope-tags).

1. On the **Assignments** tab, select the group containing the computers providing a remote session you want to configure, then select **Next**.

1. On the **Review + create** tab, review the settings, then select **Create**.

1. Once the policy applies to the computers providing a remote session, restart them for the settings to take effect.

1. To test the configuration, connect to a remote session with a camera, webcam, or video capture peripheral and use it with a supported application for the peripheral. Don't use Microsoft Teams to test as it uses its own redirection optimizations that's independent of the Remote Desktop Protocol.

# [Group Policy](#tab/group-policy)

To allow or disable video capture redirection, which includes cameras and webcams, using Group Policy:

1. Open the **Group Policy Management** console on device you use to manage the Active Directory domain.

1. Create or edit a policy that targets the computers providing a remote session you want to configure.

1. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Device and Resource Redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-group-policy.png" alt-text="A screenshot showing the device and resource redirection options in the Group Policy editor." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-group-policy.png":::

1. Double-click the policy setting **Do not allow video capture redirection** to open it.

   - To allow video capture redirection, select **Disabled** or **Not configured**, then select **OK**. 

   - To disable video capture redirection, select **Enabled**, then select **OK**.

1. Ensure the policy is applied to the computers providing a remote session, then restart them for the settings to take effect.

1. To test the configuration, connect to a remote session with a camera, webcam, or video capture peripheral and use it with a supported application for the peripheral. Don't use Microsoft Teams to test as it uses its own redirection optimizations that's independent of the Remote Desktop Protocol.

### Optional: Disable camera redirection on a local device

You can disable camera redirection on a local device to prevent a camera from being redirected from a local device to a remote session. This method is useful if you want to enable camera redirection for most users, but disable it for specific devices.

For iOS/iPadOS and Android devices, you can disable camera redirection using Intune. For more information, see [Configure client device redirection settings for Windows App and the Remote Desktop app using Microsoft Intune](client-device-redirection-intune.md).

---

::: zone pivot="azure-virtual-desktop"
## Configure video encoding redirection

Video encoding redirection controls whether to encode video in a remote session or redirected to the local device, and is configured with a host pool RDP property. The corresponding RDP property is `encode redirected video capture:i:<value>`. For more information, see [Supported RDP properties](rdp-properties.md#device-redirection).

> [!TIP]
> Redirect video encoding is different to [multimedia redirection](multimedia-redirection-intro.md), which redirects video playback and calls to your local device for faster processing and rendering.

To configure redirect video encoding:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the host pool you want to configure.

1. Select **RDP Properties**, then select **Device redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png" alt-text="A screenshot showing the host pool device redirection tab in the Azure portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png":::

1. For **Redirect video encoding**, select the drop-down list, then select one of the following options:

   - **Disable encoding of redirected video**
   - **Enable encoding of redirected video**
   - **Not configured** (*default*)

1. Select **Save**.

::: zone-end

::: zone pivot="azure-virtual-desktop"
## Configure encoded video quality

Encoded video quality controls the quality of encoded video between high, medium, and low compression, and is configured with a host pool RDP property. You also need to [redirect video encoding](#configure-video-encoding-redirection) to the local device. The corresponding RDP property is `redirected video capture encoding quality:i:<value>`. For more information, see [Supported RDP properties](rdp-properties.md#device-redirection).

To configure encoded video quality:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the host pool you want to configure.

1. Select **RDP Properties**, then select **Device redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png" alt-text="A screenshot showing the host pool device redirection tab in the Azure portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png":::

1. For **Encoded video quality**, select the drop-down list, then select one of the following options:

   - **High compression video. Quality may suffer when there is a lot of motion**
   - **Medium compression**
   - **Low compression video with high picture quality**
   - **Not configured** (*default*)

1. Select **Save**.

::: zone-end

## Related content

[!INCLUDE [include-rdp-redirection-related-content](includes/include-rdp-redirection-related-content.md)]
