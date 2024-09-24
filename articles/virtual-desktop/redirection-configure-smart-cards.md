---
title: Configure smart card device redirection over the Remote Desktop Protocol
description: Learn how to redirect smart card devices from a local device to a remote session over the Remote Desktop Protocol. It applies to Azure Virtual Desktop, Windows 365, and Microsoft Dev Box.
ms.topic: how-to
zone_pivot_groups: rdp-products-features
author: dknappettmsft
ms.author: daknappe
ms.date: 07/05/2024
---

# Configure smart card redirection over the Remote Desktop Protocol

[!INCLUDE [include-rdp-shared-article](includes/include-rdp-shared-article.md)]

You can configure the redirection behavior of smart card devices from a local device to a remote session over the Remote Desktop Protocol (RDP).

::: zone pivot="azure-virtual-desktop"
For Azure Virtual Desktop, we recommend you enable smart card redirection on your session hosts using Microsoft Intune or Group Policy, then control redirection using the host pool RDP properties.
::: zone-end

::: zone pivot="windows-365"
For Windows 365, you can configure your Cloud PCs using Microsoft Intune or Group Policy.
::: zone-end

::: zone pivot="dev-box"
For Microsoft Dev Box, you can configure your dev boxes using Microsoft Intune or Group Policy.
::: zone-end

This article provides information about the supported redirection methods and how to configure the redirection behavior for smart card devices. To learn more about how redirection works, see [Redirection over the Remote Desktop Protocol](redirection-remote-desktop-protocol.md).

## Prerequisites

Before you can configure smart card redirection, you need:

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

- A smart card device available on your local device.

- To configure Microsoft Intune, you need:

   - Microsoft Entra ID account that is assigned the [Policy and Profile manager](/mem/intune/fundamentals/role-based-access-control-reference#policy-and-profile-manager) built-in RBAC role.
   - A group containing the devices you want to configure.

- To configure Group Policy, you need:

   - A domain account that has permission to create or edit Group Policy objects.
   - A security group or organizational unit (OU) containing the devices you want to configure.

- You need to connect to a remote session from a supported app and platform. To view redirection support in Windows App and the Remote Desktop app, see [Compare Windows App features across platforms and devices](/windows-app/compare-platforms-features#redirection) and [Compare Remote Desktop app features across platforms and devices](compare-remote-desktop-clients.md#redirection).

## Smart card redirection

::: zone pivot="azure-virtual-desktop"
Configuration of a session host using Microsoft Intune or Group Policy, or setting an RDP property on a host pool governs the ability to redirect smart card devices from a local device to a remote session, which is subject to a priority order.

The default configuration is:

- **Windows operating system**: Smart card redirection isn't blocked.
- **Azure Virtual Desktop host pool RDP properties**: Smart card devices are redirected from the local device to the remote session.
- **Resultant default behavior**: Smart card devices are redirected from the local device to the remote session.

> [!IMPORTANT]
> Take care when configuring redirection settings as the most restrictive setting is the resultant behavior. For example, if you disable smart card redirection on a session host with Microsoft Intune or Group Policy, but enable it with the host pool RDP property, redirection is disabled.

::: zone-end

::: zone pivot="windows-365"
Configuration of a Cloud PC governs the ability to redirect smart card devices from a local device to a remote session, and is set using Microsoft Intune or Group Policy.

The default configuration is:

- **Windows operating system**: Smart card redirection isn't blocked.
- **Windows 365**: Smart card redirection is enabled.
- **Resultant default behavior**: Smart card devices are redirected from the local device to the remote session.

::: zone-end

::: zone pivot="dev-box"
Configuration of a dev box governs the ability to redirect smart card devices from a local device to a remote session, and is set using Microsoft Intune or Group Policy.

The default configuration is:

- **Windows operating system**: Smart card redirection isn't blocked.
- **Microsoft Dev Box**: Smart card redirection is enabled.
- **Resultant default behavior**: Smart card devices are redirected from the local device to the remote session.

::: zone-end

::: zone pivot="azure-virtual-desktop"
### Configure smart card device redirection using host pool RDP properties

The Azure Virtual Desktop host pool setting *smart card redirection* controls whether to redirect smart card from a local device to a remote session. The corresponding RDP property is `redirectsmartcards:i:<value>`. For more information, see [Supported RDP properties](rdp-properties.md#device-redirection).

To configure smart card redirection using host pool RDP properties:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Host pools**, then select the host pool you want to configure.

1. Select **RDP Properties**, then select **Device redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png" alt-text="A screenshot showing the host pool device redirection tab in the Azure portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-host-pool.png":::

1. For **Smart card redirection**, select the drop-down list, then select one of the following options:

   - **The smart card device on the local computer is not available in remote session**
   - **The smart card device on the local computer is available in remote session** (*default*)
   - **Not configured**

1. Select **Save**.

1. To test the configuration, connect to a remote session, then use an application or website that requires your smart card. Verify that the smart card is available and works as expected.
::: zone-end

::: zone pivot="azure-virtual-desktop"
### Configure smart card device redirection using Microsoft Intune or Group Policy
::: zone-end

::: zone pivot="windows-365,dev-box"
### Configure smart card device redirection using Microsoft Intune or Group Policy
::: zone-end

Select the relevant tab for your scenario.

# [Microsoft Intune](#tab/intune)

To allow or disable smart card device redirection using Microsoft Intune:

1. Sign in to the [Microsoft Intune admin center](https://endpoint.microsoft.com/).

1. [Create or edit a configuration profile](/mem/intune/configuration/administrative-templates-windows) for **Windows 10 and later** devices, with the **Settings catalog** profile type.

1. In the settings picker, browse to **Administrative templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Device and Resource Redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-intune.png" alt-text="A screenshot showing the device and resource redirection options in the Microsoft Intune portal." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-intune.png":::

1. Check the box for **Do not allow smart card device redirection**, then close the settings picker.

1. Expand the **Administrative templates** category, then toggle the switch for **Do not allow smart card device redirection**, depending on your requirements:

   - To allow smart card device redirection, toggle the switch to **Disabled**, then select **OK**. 

   - To disable smart card device redirection, toggle the switch to **Enabled**, then select **OK**. 

1. Select **Next**.

1. *Optional*: On the **Scope tags** tab, select a scope tag to filter the profile. For more information about scope tags, see [Use role-based access control (RBAC) and scope tags for distributed IT](/mem/intune/fundamentals/scope-tags).

1. On the **Assignments** tab, select the group containing the computers providing a remote session you want to configure, then select **Next**.

1. On the **Review + create** tab, review the settings, then select **Create**.

1. Once the policy applies to the computers providing a remote session, restart them for the settings to take effect.

# [Group Policy](#tab/group-policy)

To allow or disable smart card device redirection using Group Policy:

1. Open the **Group Policy Management** console on device you use to manage the Active Directory domain.

1. Create or edit a policy that targets the computers providing a remote session you want to configure.

1. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Device and Resource Redirection**.

   :::image type="content" source="media/redirection-remote-desktop-protocol/redirection-configuration-group-policy.png" alt-text="A screenshot showing the device and resource redirection options in the Group Policy editor." lightbox="media/redirection-remote-desktop-protocol/redirection-configuration-group-policy.png":::

1. Double-click the policy setting **Do not allow smart card device redirection** to open it.

   - To allow smart card device redirection, select **Disabled** or **Not configured**, then select **OK**. 

   - To disable smart card device redirection, select **Enabled**, then select **OK**.

1. Ensure the policy is applied to the computers providing a remote session, then restart them for the settings to take effect.

---

## Test smart card redirection

To test smart card redirection:

1. Connect to a remote session using Window App or the Remote Desktop app on a platform that supports smart card redirection. For more information, see [Compare Windows App features across platforms and devices](/windows-app/compare-platforms-features#redirection) and [Compare Remote Desktop app features across platforms and devices](compare-remote-desktop-clients.md#redirection).

1. Check your smart cards are available in the remote session. Run the following command in the remote session in Command Prompt or from a PowerShell prompt.

   ```cmd
   certutil -scinfo
   ```

   If smart card redirection is working, the output starts similar to the following output:

   ```output
   The Microsoft Smart Card Resource Manager is running.
   Current reader/card status:
   Readers: 2
     0: Windows Hello for Business 1
     1: Yubico YubiKey OTP+FIDO+CCID 0
   --- Reader: Windows Hello for Business 1
   --- Status: SCARD_STATE_PRESENT | SCARD_STATE_INUSE
   --- Status: The card is being shared by a process.
   ---   Card: Identity Device (Microsoft Generic Profile)
   ---    ATR:
           aa bb cc dd ee ff 00 11  22 33 44 55 66 77 88 99   ;.........AB12..
           ab                                                 .
   
   --- Reader: Yubico YubiKey OTP+FIDO+CCID 0
   --- Status: SCARD_STATE_PRESENT | SCARD_STATE_UNPOWERED
   --- Status: The card is available for use.
   ---   Card: Identity Device (NIST SP 800-73 [PIV])
   ---    ATR:
           aa bb cc dd ee ff 00 11  22 33 44 55 66 77 88 99   ;.........34yz..
           ab                                                 .
   
   [continued...]
   ```

1. Open and use an application or website that requires your smart card. Verify that the smart card is available and works as expected.

## Related content

[!INCLUDE [include-rdp-redirection-related-content](includes/include-rdp-redirection-related-content.md)]
