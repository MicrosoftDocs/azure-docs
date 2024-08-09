---
title: Configure WebAuthn redirection over the Remote Desktop Protocol
description: Learn how to redirect WebAuthn requests from a remote session to a local device over the Remote Desktop Protocol. It applies to Azure Virtual Desktop, Windows 365, and Microsoft Dev Box.
ms.topic: how-to
zone_pivot_groups: rdp-products-features
author: dknappettmsft
ms.author: daknappe
ms.date: 06/25/2024
---

# Configure WebAuthn redirection over the Remote Desktop Protocol

[!INCLUDE [include-rdp-shared-article](includes/include-rdp-shared-article.md)]

You can configure the redirection behavior of WebAuthn requests from a remote session to a local device over the Remote Desktop Protocol (RDP). WebAuthn redirection enables [in-session passwordless authentication](authentication.md#in-session-authentication) using Windows Hello for Business or security devices like FIDO keys.

::: zone pivot="azure-virtual-desktop"
For Azure Virtual Desktop, we recommend you enable WebAuthn redirection on your session hosts using Microsoft Intune or Group Policy, then control redirection using the host pool RDP properties.
::: zone-end

::: zone pivot="windows-365"
For Windows 365, you can configure your Cloud PCs using Microsoft Intune or Group Policy.
::: zone-end

::: zone pivot="dev-box"
For Microsoft Dev Box, you can configure your dev boxes using Microsoft Intune or Group Policy.
::: zone-end

This article provides information about the supported redirection methods and how to configure the redirection behavior for WebAuthn requests. To learn more about how redirection works, see [Redirection over the Remote Desktop Protocol](redirection-remote-desktop-protocol.md).

## Prerequisites

Before you can configure WebAuthn redirection, you need:

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

- A local Windows device with Windows Hello for Business or a security device like a FIDO USB key already configured.

- To configure Microsoft Intune, you need:

   - Microsoft Entra ID account that is assigned the [Policy and Profile manager](/mem/intune/fundamentals/role-based-access-control-reference#policy-and-profile-manager) built-in RBAC role.
   - A group containing the devices you want to configure.

- To configure Group Policy, you need:

   - A domain account that has permission to create or edit Group Policy objects.
   - A security group or organizational unit (OU) containing the devices you want to configure.

- You need to connect to a remote session from a supported app and platform. To view redirection support in Windows App and the Remote Desktop app, see [Compare Windows App features across platforms and devices](/windows-app/compare-platforms-features#redirection) and [Compare Remote Desktop app features across platforms and devices](compare-remote-desktop-clients.md#redirection).

## WebAuthn redirection

::: zone pivot="azure-virtual-desktop"
Configuration of a session host using Microsoft Intune or Group Policy, or setting an RDP property on a host pool governs the ability to redirect WebAuthn requests from a remote session to a local device, which is subject to a priority order.

The default configuration is:

- **Windows operating system**: WebAuthn requests aren't blocked.
- **Azure Virtual Desktop host pool RDP properties**: WebAuthn requests in the remote session are redirected to the local computer.

> [!IMPORTANT]
> Take care when configuring redirection settings as the most restrictive setting is the resultant behavior. For example, if you disable WebAuthn redirection on a session host with Microsoft Intune or Group Policy, but enable it with the host pool RDP property, redirection is disabled.

::: zone-end

::: zone pivot="windows-365"
Configuration of a Cloud PC governs the ability to redirect WebAuthn requests between the remote session and the local device, and is set using Microsoft Intune or Group Policy.

The default configuration is:

- **Windows operating system**: WebAuthn requests aren't blocked. Windows 365 enables WebAuthn redirection.

::: zone-end

::: zone pivot="dev-box"
Configuration of a dev box governs the ability to redirect WebAuthn requests between the remote session and the local device, and is set using Microsoft Intune or Group Policy.

The default configuration is:

- **Windows operating system**: WebAuthn requests aren't blocked. Windows 365 enables WebAuthn redirection.

::: zone-end

::: zone pivot="azure-virtual-desktop"
### Configure WebAuthn redirection using host pool RDP properties

The Azure Virtual Desktop host pool setting *WebAuthn redirection* controls whether to redirect WebAuthn requests between the remote session and the local device. The corresponding RDP property is `redirectwebauthn:i:<value>`. For more information, see [Supported RDP properties](rdp-properties.md#device-redirection).

To configure WebAuthn redirection using host pool RDP properties:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the host pool you want to configure.

1. Select **RDP Properties**, then select **Device redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png" alt-text="A screenshot showing the host pool device redirection tab in the Azure portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png":::

1. For **WebAuthn redirection**, select the drop-down list, then select one of the following options:

   - **WebAuthn requests in the remote session are not redirected to the local computer**
   - **WebAuthn requests in the remote session are redirected to the local computer** (*default*)
   - **Not configured**

1. Select **Save**.

1. To test the configuration, follow the steps in [Test WebAuthn redirection](#test-webauthn-redirection).

::: zone-end

::: zone pivot="azure-virtual-desktop"
### Configure WebAuthn redirection using Microsoft Intune or Group Policy
::: zone-end

::: zone pivot="windows-365,dev-box"
### Configure WebAuthn redirection using Microsoft Intune or Group Policy
::: zone-end

Select the relevant tab for your scenario.

# [Microsoft Intune](#tab/intune)

To allow or disable WebAuthn redirection using Microsoft Intune:

1. Sign in to the [Microsoft Intune admin center](https://endpoint.microsoft.com/).

1. [Create or edit a configuration profile](/mem/intune/configuration/administrative-templates-windows) for **Windows 10 and later** devices, with the **Templates** profile type, and the **Administrative templates** template.

1. In the **Configuration settings** tab, browse to **Computer configuration** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Device and Resource Redirection**, then select **Do not allow WebAuthn redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-intune-template-webauthn.png" alt-text="A screenshot showing the device and resource redirection options in the Microsoft Intune portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-intune-template-webauthn.png":::

1. Select **Do not allow WebAuthn redirection**. In the pane separate pane that opens:

   - To allow WebAuthn redirection, select **Disabled** or **Not configured**, then select **OK**. 

   - To disable WebAuthn redirection, select **Enabled**, then select **OK**.

1. Select **Next**.

1. *Optional*: On the **Scope tags** tab, select a scope tag to filter the profile. For more information about scope tags, see [Use role-based access control (RBAC) and scope tags for distributed IT](/mem/intune/fundamentals/scope-tags).

1. On the **Assignments** tab, select the group containing the computers providing a remote session you want to configure, then select **Next**.

1. On the **Review + create** tab, review the settings, then select **Create**.

1. Once the policy applies to the computers providing a remote session, restart them for the settings to take effect.

# [Group Policy](#tab/group-policy)

To allow or disable WebAuthn redirection using Group Policy:

1. Open the **Group Policy Management** console on device you use to manage the Active Directory domain.

1. Create or edit a policy that targets the computers providing a remote session you want to configure.

1. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Device and Resource Redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-group-policy.png" alt-text="A screenshot showing the device and resource redirection options in the Group Policy editor." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-group-policy.png":::

1. Double-click the policy setting **Do not allow WebAuthn redirection** to open it.

   - To allow WebAuthn redirection, select **Disabled** or **Not configured**, then select **OK**. 

   - To disable WebAuthn redirection, select **Enabled**, then select **OK**.

1. Ensure the policy is applied to the computers providing a remote session, then restart them for the settings to take effect.

---

## Test WebAuthn redirection

Once you enable WebAuthn redirection, to test it:

1. If you're using a USB security key, make sure it's plugged in first.

1. Connect to a remote session using Window App or the Remote Desktop app on a platform that supports WebAuthn redirection. For more information, see [Compare Windows App features across platforms and devices](/windows-app/compare-platforms-features#redirection) and [Compare Remote Desktop app features across platforms and devices](compare-remote-desktop-clients.md#redirection).

1. In the remote session, open a website in an **InPrivate window** that uses WebAuthn authentication, such as Windows App for web browsers at [https://windows.cloud.microsoft/](https://windows.cloud.microsoft/). 

1. Follow the sign-in process. When the authentication comes to use Windows Hello for Business or the security key, you should see a Windows Security prompt to complete the authentication, as shown in the following image when using a Windows local device.

   The Windows Security prompt is on the local device and overlays the remote session, indicating that WebAuthn redirection is working.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-webauthn.png" alt-text="A screenshot showing a WebAuthn request from the remote session to the local device." lightbox="media/redirection-remote-desktop-protocol/redirection-webauthn.png":::

## Related content

[!INCLUDE [include-rdp-redirection-related-content](includes/include-rdp-redirection-related-content.md)]
