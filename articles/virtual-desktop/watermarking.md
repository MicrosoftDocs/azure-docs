---
title: Watermarking in Azure Virtual Desktop
description: Learn how to enable watermarking in Azure Virtual Desktop to help prevent sensitive information from being captured on client endpoints.
author: dknappettmsft
ms.topic: how-to
ms.date: 04/29/2024
ms.author: daknappe
---

# Watermarking in Azure Virtual Desktop

Watermarking, alongside [screen capture protection](screen-capture-protection.md), helps prevent sensitive information from being captured on client endpoints. When you enable watermarking, QR code watermarks appear as part of remote desktops. The QR code contains the *Connection ID* or *Device ID* of a remote session that admins can use to trace the session. Watermarking is configured on session hosts using Microsoft Intune or Group Policy, and enforced by Windows App or the Remote Desktop client.

Here's a screenshot showing what watermarking looks like when it's enabled:

:::image type="content" source="media/watermarking-result.png" alt-text="A screenshot showing watermarking enabled on a remote desktop." lightbox="media/watermarking-result.png":::

> [!IMPORTANT]
> - Once watermarking is enabled on a session host, only clients that support watermarking can connect to that session host. If you try to connect from an unsupported client, the connection will fail and you'll get an error message that is not specific.
>
> - Watermarking is for remote desktops only. With RemoteApp, watermarking is not applied and the connection is allowed.
>
> - If you connect to a session host directly (not through Azure Virtual Desktop) using the Remote Desktop Connection app (`mstsc.exe`), watermarking is not applied and the connection is allowed.

## Prerequisites

You'll need the following things before you can use watermarking:

- An existing host pool with session hosts.

- A Microsoft Entra ID account that is assigned the [Desktop Virtualization Host Pool Contributor](rbac.md#desktop-virtualization-host-pool-contributor) built-in role-based access control (RBAC) roles on the host pool as a minimum. 

- A client that supports watermarking. The following clients support watermarking:

   - Remote Desktop client for:
      - [Windows Desktop](users/connect-windows.md?toc=%2Fazure%2Fvirtual-desktop%2Ftoc.json), version 1.2.3317 or later, on Windows 10 and later.
      - [Web browser](users/connect-web.md?toc=%2Fazure%2Fvirtual-desktop%2Ftoc.json).
      - [macOS](users/connect-macos.md), version 10.9.5 or later.
      - [iOS/iPadOS](users/connect-ios-ipados.md), version 10.5.4 or later.

   - Windows App for:
      - Windows
      - macOS
      - Web browser

- [Azure Virtual Desktop Insights](azure-monitor.md) configured for your environment.

- If you manage your session hosts with Microsoft Intune, you need:

   - Microsoft Entra ID account that is assigned the [Policy and Profile manager](/mem/intune/fundamentals/role-based-access-control-reference#policy-and-profile-manager) built-in RBAC role.

   - A group containing the devices you want to configure.

- If you manage your session hosts with Group Policy in an Active Directory domain, you need:

   - A domain account that is a member of the **Domain Admins** security group.

   - A security group or organizational unit (OU) containing the session hosts you want to configure.
 
## Enable watermarking

Select the relevant tab for your scenario.

# [Microsoft Intune](#tab/intune)

To enable watermarking using Microsoft Intune:

1. Sign in to the [Microsoft Intune admin center](https://endpoint.microsoft.com/).

1. [Create or edit a configuration profile](/mem/intune/configuration/administrative-templates-windows) for **Windows 10 and later** devices, with the **Settings catalog** profile type.

1. In the settings picker, browse to **Administrative templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**.

   :::image type="content" source="media/administrative-template/azure-virtual-desktop-intune-settings-catalog.png" alt-text="A screenshot of the Intune admin center showing Azure Virtual Desktop settings." lightbox="media/administrative-template/azure-virtual-desktop-intune-settings-catalog.png":::

1. Check the box for **Enable watermarking**, then close the settings picker.

   > [!IMPORTANT]
   > Don't select **\[Deprecated\] Enable watermarking** as this setting doesn't include the option to specify the QR code embedded content.

1. Expand the **Administrative templates** category, then toggle the switch for **Enable watermarking** to **Enabled**.

   :::image type="content" source="media/watermarking/watermarking-intune-settings-catalog.png" alt-text="A screenshot of the available settings for watermarking in Intune." lightbox="media/watermarking/watermarking-intune-settings-catalog.png":::

1. You can configure the following options:

   | Option | Values | Description |
   |--|:--:|--|
   | QR code bitmap scale factor | 1 to 10<br />(*default = 4*) | The size in pixels of each QR code dot. This value determines how many the number of squares per dot in the QR code. |
   | QR code bitmap opacity | 100 to 9999 (*default = 2000*) | How transparent the watermark is, where 100 is fully transparent. |
   | Width of grid box in percent relevant to QR code bitmap width | 100 to 1000<br />(*default = 320*) | Determines the distance between the QR codes in percent. When combined with the height, a value of 100 would make the QR codes appear side-by-side and fill the entire screen. |
   | Height of grid box in percent relevant to QR code bitmap width | 100 to 1000<br />(*default = 180*) | Determines the distance between the QR codes in percent. When combined with the width, a value of 100 would make the QR codes appear side-by-side and fill the entire screen. |
   | QR code embedded content | Connection ID (*default*)<br />Device ID | Specify whether the *Connection ID* or *Device ID* should be used in the QR code. Only select Device ID with session hosts that are in a personal host pool and joined to Microsoft Entra ID or Microsoft Entra hybrid joined. |

   > [!TIP]
   > We recommend trying out different opacity values to find a balance between the readability of the remote session and being able to scan the QR code, but keeping the default values for the other parameters.

1. Select **Next**.

1. *Optional*: On the **Scope tags** tab, select a scope tag to filter the profile. For more information about scope tags, see [Use role-based access control (RBAC) and scope tags for distributed IT](/mem/intune/fundamentals/scope-tags).

1. On the **Assignments** tab, select the group containing the computers providing a remote session you want to configure, then select **Next**.

1. On the **Review + create** tab, review the settings, then select **Create**.

1. [Sync your session hosts with Intune](/mem/intune/remote-actions/device-sync) for the settings to take effect.

# [Group Policy](#tab/group-policy)

To enable watermarking using Group Policy:

1. Follow the steps to make the [Administrative template for Azure Virtual Desktop](administrative-template.md?tabs=group-policy-domain) available.

1. Open the **Group Policy Management** console on device you use to manage the Active Directory domain, then create or edit a policy that targets the computers providing a remote session you want to configure.

1. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**.

1. Open the policy setting **Enable watermarking** and set it to **Enabled**.

   :::image type="content" source="media/watermarking/watermarking-group-policy.png" alt-text="A screenshot of the available settings for watermarking in Group Policy." lightbox="media/watermarking/watermarking-group-policy.png":::

1. You can configure the following options:

   | Option | Values | Description |
   |--|:--:|--|
   | QR code bitmap scale factor | 1 to 10<br />(*default = 4*) | The size in pixels of each QR code dot. This value determines how many the number of squares per dot in the QR code. |
   | QR code bitmap opacity | 100 to 9999 (*default = 2000*) | How transparent the watermark is, where 100 is fully transparent and 9999 is fully opaque. |
   | Width of grid box in percent relevant to QR code bitmap width | 100 to 1000<br />(*default = 320*) | Determines the distance between the QR codes in percent. When combined with the height, a value of 100 would make the QR codes appear side-by-side and fill the entire screen. |
   | Height of grid box in percent relevant to QR code bitmap width | 100 to 1000<br />(*default = 180*) | Determines the distance between the QR codes in percent. When combined with the width, a value of 100 would make the QR codes appear side-by-side and fill the entire screen. |
   | QR code embedded content | Connection ID (*default*)<br />Device ID | Specify whether the *Connection ID* or *Device ID* should be used in the QR code. Only select Device ID with session hosts that are in a personal host pool and joined to Microsoft Entra ID or Microsoft Entra hybrid joined. |

   > [!TIP]
   > We recommend trying out different opacity values to find a balance between the readability of the remote session and being able to scan the QR code, but keeping the default values for the other parameters.

1. Ensure the policy is applied to your session hosts, then refresh Group Policy on the session hosts or restart them for the settings to take effect.

1. Connect to a remote session with a supported client, where you should see QR codes appear. Any existing sessions will need to sign out and back in again for the change to take effect.

---

## Find session information

Once you've enabled watermarking, you can find the session information from the QR code by using Azure Virtual Desktop Insights or querying Azure Monitor Log Analytics.

### Azure Virtual Desktop Insights

To find out the session information from the QR code by using Azure Virtual Desktop Insights:

1. Open a web browser and go to https://aka.ms/avdi to open Azure Virtual Desktop Insights. Sign-in using your Azure credentials when prompted.

1. Select the relevant subscription, resource group, host pool and time range, then select the **Connection Diagnostics** tab.

1. In the section **Success rate of (re)establishing a connection (% of connections)**, there's a list of all connections showing **First attempt**, **Connection Id**, **User**, and **Attempts**. You can look for the connection ID from the QR code in this list, or export to Excel.

### Azure Monitor Log Analytics

To find out the session information from the QR code by querying Azure Monitor Log Analytics:

1. Sign in to [the Azure portal](https://portal.azure.com).

1. In the search bar, type *Log Analytics workspaces* and select the matching service entry.

1. Select to open the Log Analytics workspace that is connected to your Azure Virtual Desktop environment.

1. Under **General**, select **Logs**.

1. Start a new query, then run the following query to get session information for a specific connection ID (represented as *CorrelationId* in Log Analytics), replacing `<connection ID>` with the full or partial value from the QR code:

   ```kusto
   WVDConnections
   | where CorrelationId contains "<connection ID>"
   ```

## Related content

- [Enable screen capture protection in Azure Virtual Desktop](screen-capture-protection.md).
