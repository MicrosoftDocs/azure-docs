---
title: Configure audio and video redirection over the Remote Desktop Protocol
description: Learn how to redirect audio peripherals, such as microphone and speaker, between a local device and a remote session over the Remote Desktop Protocol. It applies to Azure Virtual Desktop, Windows 365, and Microsoft Dev Box.
ms.topic: how-to
zone_pivot_groups: rdp-products-features
author: dknappettmsft
ms.author: daknappe
ms.date: 04/24/2024
---

# Configure audio and video redirection over the Remote Desktop Protocol

[!INCLUDE [include-rdp-shared-article](includes/include-rdp-shared-article.md)]

You can configure the redirection behavior of audio peripherals, such as microphones and speakers, between a local device and a remote session over the Remote Desktop Protocol (RDP).

::: zone pivot="azure-virtual-desktop"
For Azure Virtual Desktop, we recommend you enable audio and video redirection on your session hosts using Microsoft Intune or Group Policy, then control redirection using the host pool RDP properties.
::: zone-end

::: zone pivot="windows-365"
For Windows 365, you can configure your Cloud PCs using Microsoft Intune or Group Policy.
::: zone-end

::: zone pivot="dev-box"
For Microsoft Dev Box, you can configure your dev boxes using Microsoft Intune or Group Policy.
::: zone-end

This article provides information about the supported redirection methods and how to configure the redirection behavior for audio and video peripherals. To learn more about how redirection works, see [Redirection over the Remote Desktop Protocol](redirection-remote-desktop-protocol.md).

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

Before you can configure audio and video redirection, you need:

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

- An audio device you can use to test the redirection configuration.

- To configure Microsoft Intune, you need:

   - Microsoft Entra ID account that is assigned the [Policy and Profile manager](/mem/intune/fundamentals/role-based-access-control-reference#policy-and-profile-manager) built-in RBAC role.
   - A group containing the devices you want to configure.

- To configure Group Policy, you need:

   - A domain account that has permission to create or edit Group Policy objects.
   - A security group or organizational unit (OU) containing the devices you want to configure.

- You need to connect to a remote session from a supported app and platform. To view redirection support in Windows App and the Remote Desktop app, see [Compare Windows App features across platforms and devices](/windows-app/compare-platforms-features#redirection) and [Compare Remote Desktop app features across platforms and devices](compare-remote-desktop-clients.md#redirection).

## Configure audio output redirection

::: zone pivot="azure-virtual-desktop"
Audio output redirection controls where audio signals from the remote session are played. Configuration of a session host or setting an RDP property on a host pool governs the ability to play audio from a remote session, which is subject to a priority order.

Session host configuration controls whether audio and video playback redirection is enabled together with the audio playback quality and is set using Microsoft Intune or Group Policy. A host pool RDP property controls whether to play audio and the audio output location over the Remote Desktop Protocol.

The default configuration is:

- **Windows operating system**: Audio and video playback redirection isn't blocked.
- **Azure Virtual Desktop host pool RDP properties**: Play sounds on the local computer.
- **Resultant default behavior**: Audio is redirected to the local computer.

> [!IMPORTANT]
> Take care when configuring redirection settings as the most restrictive setting is the resultant behavior. For example, if you disable audio and video playback redirection on a session host with Microsoft Intune or Group Policy, but enable it with the host pool RDP property, redirection is disabled. 

::: zone-end

::: zone pivot="windows-365"
Audio output redirection controls where audio signals from the remote session are played. Configuration of a Cloud PC governs the ability to play audio from a remote session and controls the audio playback quality. You can configure audio output redirection using Microsoft Intune or Group Policy.

The default configuration is:

- **Windows operating system**: Audio and video playback redirection isn't blocked.
- **Windows 365**: Audio and video playback redirection is enabled.
- **Resultant default behavior**: Audio is redirected to the local computer.

::: zone-end

::: zone pivot="dev-box"
Audio output redirection controls where audio signals from the remote session are played. Configuration of a dev box governs the ability to play audio from a remote session and controls the audio playback quality. You can configure audio output redirection using Microsoft Intune or Group Policy.

The default configuration is:

- **Windows operating system**: Audio and video playback redirection isn't blocked.
- **Microsoft Dev Box**: Audio and video playback redirection is enabled.
- **Resultant default behavior**: Audio is redirected to the local computer.

::: zone-end

::: zone pivot="azure-virtual-desktop"
### Configure the audio output location using host pool RDP properties

The Azure Virtual Desktop host pool setting *audio output location* controls whether to play audio from remote session in the remote session, redirected to the local device, or disable audio. The corresponding RDP property is `audiomode:i:<value>`. For more information, see [Supported RDP properties](rdp-properties.md#device-redirection).

To configure the audio output location using host pool RDP properties:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the host pool you want to configure.

1. Select **RDP Properties**, then select **Device redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png" alt-text="A screenshot showing the host pool device redirection tab in the Azure portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png":::

1. For **Audio output location**, select the drop-down list, then select one of the following options:

   - **Play sounds on the local computer** (*default*)
   - **Play sounds on the remote computer**
   - **Do not play sounds**
   - **Not configured**

1. Select **Save**.

1. To test the configuration, connect to a remote session and play audio. Verify that you can hear audio as expected. Make sure you're not using Microsoft Teams or a web page that's redirected with [multimedia redirection](multimedia-redirection-intro.md) for this test.
::: zone-end

::: zone pivot="azure-virtual-desktop"
### Configure audio and video playback redirection, and limit audio playback quality using Microsoft Intune or Group Policy
::: zone-end

::: zone pivot="windows-365,dev-box"
### Configure audio and video playback redirection, and limit audio playback quality using Microsoft Intune or Group Policy
::: zone-end

Select the relevant tab for your scenario.

# [Microsoft Intune](#tab/intune)

To allow or disable audio and video playback redirection, and limit audio playback quality using Microsoft Intune:

1. Sign in to the [Microsoft Intune admin center](https://endpoint.microsoft.com/).

1. [Create or edit a configuration profile](/mem/intune/configuration/administrative-templates-windows) for **Windows 10 and later** devices, with the **Settings catalog** profile type.

1. In the settings picker, browse to **Administrative templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Device and Resource Redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-intune.png" alt-text="A screenshot showing the device and resource redirection options in the Microsoft Intune portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-intune.png":::

1. Check the box for **Allow audio and video playback redirection**, and optionally **Limit audio playback quality**, then close the settings picker.

1. Expand the **Administrative templates** category, then toggle the switch for **Allow audio and video playback redirection**, depending on your requirements:

   - To allow audio and video playback redirection, toggle the switch to **Enabled**, then select **OK**.

   - To disable audio and video playback redirection, toggle the switch to **Disabled**, then select **OK**.

1. If you selected **Limit audio playback quality**, select the audio quality from the drop-down list.

1. Select **Next**.

1. *Optional*: On the **Scope tags** tab, select a scope tag to filter the profile. For more information about scope tags, see [Use role-based access control (RBAC) and scope tags for distributed IT](/mem/intune/fundamentals/scope-tags).

1. On the **Assignments** tab, select the group containing the computers providing a remote session you want to configure, then select **Next**.

1. On the **Review + create** tab, review the settings, then select **Create**.

1. Once the policy applies to the computers providing a remote session, restart them for the settings to take effect.

1. To test the configuration, connect to a remote session and play audio. Verify that you can hear audio as expected. Make sure you're not using Microsoft Teams or a web page that's redirected with [multimedia redirection](multimedia-redirection-intro.md) for this test.

# [Group Policy](#tab/group-policy)

To allow or disable audio and video playback redirection, and limit audio playback quality using Group Policy:

1. Open the **Group Policy Management** console on device you use to manage the Active Directory domain.

1. Create or edit a policy that targets the computers providing a remote session you want to configure.

1. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Device and Resource Redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-group-policy.png" alt-text="A screenshot showing the device and resource redirection options in the Group Policy editor." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-group-policy.png":::

1. Double-click the policy setting **Allow audio and video playback redirection** to open it.

   - To allow audio and video playback redirection, select **Enabled** or **Not configured**, then select **OK**. 

   - To disable audio and video playback redirection, select **Disabled**, then select **OK**.

1. If you want to limit audio playback quality, double-click the policy setting **Limit audio playback quality** to open it.

1. Select **Enabled**, then select the audio quality from the drop-down list, then select **OK**.

1. Ensure the policy is applied to the computers providing a remote session, then restart them for the settings to take effect.

1. To test the configuration, connect to a remote session and play audio. Verify that you can hear audio as expected. Make sure you're not using Microsoft Teams or a web page that's redirected with [multimedia redirection](multimedia-redirection-intro.md) for this test.

---

## Configure audio capture redirection

::: zone pivot="azure-virtual-desktop"
Audio recording redirection controls whether you want to allow peripherals such as a microphone to be accessible in the remote session. Configuration of a session host and setting an RDP property on a host pool governs the ability to record audio from a local device in a remote session, which is subject to a priority order.

Session host configuration controls whether audio recording redirection is enabled and is set using Microsoft Intune or Group Policy. A host pool RDP property controls whether microphones are redirected over the Remote Desktop Protocol.

The default configuration is:

- **Windows operating system**: Audio recording redirection isn't blocked.
- **Azure Virtual Desktop host pool RDP properties**: Not configured.

> [!IMPORTANT]
> Take care when configuring redirection settings as the most restrictive setting is the resultant behavior. For example, if you disable audio recording redirection on a session host with Microsoft Intune or Group Policy, but enable it with the host pool RDP property, redirection is disabled. 

::: zone-end

::: zone pivot="windows-365"
Audio recording redirection controls whether you want to allow peripherals such as a microphone to be accessible in the remote session. Configuration of a Cloud PC governs the ability to record audio from a local device in a remote session. You can configure audio recording redirection using Microsoft Intune or Group Policy.

The default configuration is:

- **Windows operating system**: Audio recording redirection isn't blocked. Windows 365 enables audio recording redirection.

::: zone-end

::: zone pivot="dev-box"
Audio recording redirection controls whether you want to allow peripherals such as a microphone to be accessible in the remote session. Configuration of a dev box governs the ability to record audio from a local device in a remote session. You can configure audio recording redirection using Microsoft Intune or Group Policy.

The default configuration is:

- **Windows operating system**: Audio recording redirection isn't blocked. Microsoft Dev Box enables audio recording redirection.

::: zone-end

::: zone pivot="azure-virtual-desktop"
### Configure audio input redirection using host pool RDP properties

The Azure Virtual Desktop host pool setting *microphone redirection* controls whether to redirect audio input from a local device to an audio application in a remote session. The corresponding RDP property is `audiocapturemode:i:<value>`. For more information, see [Supported RDP properties](rdp-properties.md#device-redirection).

To configure audio input redirection using host pool RDP properties:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the host pool you want to configure.

1. Select **RDP Properties**, then select **Device redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png" alt-text="A screenshot showing the host pool device redirection tab in the Azure portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png":::

1. For **Microphone redirection**, select the drop-down list, then select one of the following options:

   - **Disable audio capture from the local device**
   - **Enable audio capture from the local device and redirection to an audio application in the remote session**
   - **Not configured** (*default*)

1. Select **Save**.

1. To test the configuration, connect to a remote session and verify that the audio input redirection is as expected, such as recording audio from a microphone in an application in the remote session.
::: zone-end

::: zone pivot="azure-virtual-desktop"
### Configure audio input redirection using Microsoft Intune or Group Policy
::: zone-end

::: zone pivot="windows-365,dev-box"
### Configure audio input redirection using Microsoft Intune or Group Policy
::: zone-end

Select the relevant tab for your scenario.

# [Microsoft Intune](#tab/intune)

To allow or disable audio input redirection using Microsoft Intune:

1. Sign in to the [Microsoft Intune admin center](https://endpoint.microsoft.com/).

1. [Create or edit a configuration profile](/mem/intune/configuration/administrative-templates-windows) for **Windows 10 and later** devices, with the **Settings catalog** profile type.

1. In the settings picker, browse to **Administrative templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Device and Resource Redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-intune.png" alt-text="A screenshot showing the device and resource redirection options in the Microsoft Intune portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-intune.png":::

1. Check the box for **Allow audio recording redirection**, then close the settings picker.

1. Expand the **Administrative templates** category, then toggle the switch for **Allow audio recording redirection** to **Enabled** or **Disabled**, depending on your requirements. Select **Next**.

1. *Optional*: On the **Scope tags** tab, select a scope tag to filter the profile. For more information about scope tags, see [Use role-based access control (RBAC) and scope tags for distributed IT](/mem/intune/fundamentals/scope-tags).

1. On the **Assignments** tab, select the group containing the computers providing a remote session you want to configure, then select **Next**.

1. On the **Review + create** tab, review the settings, then select **Create**.

1. Once the policy applies to the computers providing a remote session, restart them for the settings to take effect.

1. To test the configuration, connect to a remote session and verify that the audio input redirection is as expected, such as recording audio from a microphone in an application in the remote session.

# [Group Policy](#tab/group-policy)

To allow or disable audio input redirection using Group Policy:

1. Open the **Group Policy Management** console on device you use to manage the Active Directory domain.

1. Create or edit a policy that targets the computers providing a remote session you want to configure.

1. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Device and Resource Redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-group-policy.png" alt-text="A screenshot showing the device and resource redirection options in the Group Policy editor." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-group-policy.png":::

1. Double-click the policy setting **Allow audio recording redirection** to open it.

   - To allow audio recording redirection, select **Enabled** or **Not configured**, then select **OK**. 

   - To disable audio recording redirection, select **Disabled**, then select **OK**.

1. Ensure the policy is applied to the computers providing a remote session, then restart them for the settings to take effect.

1. To test the configuration, connect to a remote session and verify that the audio input redirection is as expected, such as recording audio from a microphone in an application in the remote session.

### Optional: Disable audio input redirection on a local device

You can disable audio input redirection on a local device to prevent audio input from being redirected from a local device to a remote session. This method is useful if you want to enable audio input redirection for most users, but disable it for specific devices.

For iOS/iPadOS and Android devices, you can disable audio input redirection using Intune. For more information, see [Configure client device redirection settings for Windows App and the Remote Desktop app using Microsoft Intune](client-device-redirection-intune.md).

---

## Related content

[!INCLUDE [include-rdp-redirection-related-content](includes/include-rdp-redirection-related-content.md)]
