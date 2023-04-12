---
title: Watermarking in Azure Virtual Desktop (preview)
description: Learn how to enable watermarking in Azure Virtual Desktop (preview) to help prevent sensitive information from being captured on client endpoints.
author: dknappettmsft
ms.topic: how-to
ms.date: 10/27/2022
ms.author: daknappe
---
# Watermarking in Azure Virtual Desktop (preview)

> [!IMPORTANT]
> Watermarking is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Watermarking (preview), alongside [screen capture protection](screen-capture-protection.md), helps prevent sensitive information from being captured on client endpoints. When you enable watermarking, QR code watermarks appear as part of remote desktops. The QR code contains the *connection ID* of a remote session that admins can use to trace the session. Watermarking is configured on session hosts and enforced by the Remote Desktop client.

Here's a screenshot showing what watermarking looks like when it's enabled:

:::image type="content" source="media/watermarking-result.png" alt-text="A screenshot showing watermarking enabled on a remote desktop." lightbox="media/watermarking-result.png":::

> [!IMPORTANT]
> - Once watermarking is enabled on a session host, only clients that support watermarking can connect to that session host. If you try to connect from an unsupported client, the connection will fail and you'll get an error message that is not specific.
>
> - Watermarking is for remote desktops only. With remote apps, watermarking is not applied and the connection is allowed.
>
> - If you connect to a session host directly (not through Azure Virtual Desktop) using the Remote Desktop Connection app (`mstsc.exe`), watermarking is not applied and the connection is allowed.

## Prerequisites

You'll need the following things before you can use watermarking:

- A Remote Desktop client that supports watermarking. The following clients currently support watermarking:

  - [Windows Desktop client](users/connect-windows.md?toc=%2Fazure%2Fvirtual-desktop%2Ftoc.json), version 1.2.3317 or later, on Windows 10 and later.

- [Azure Virtual Desktop Insights](azure-monitor.md) configured for your environment.

## Enable watermarking

To enable watermarking, follow the steps below:

1. Follow the steps to download and add the [Administrative template for Azure Virtual Desktop](administrative-template.md).

1. Once you've verified that the Azure Virtual Desktop administrative template is available, open the policy setting **Enable watermarking** and set it to **Enabled**.

1. You can configure the following options:

   | Option | Values | Description |
   |--|:--:|--|
   | QR code bitmap scale factor | 1 to 10<br />(*default = 4*) | The size in pixels of each QR code dot. This value determines how many the number of squares per dot in the QR code. |
   | QR code bitmap opacity | 100 to 9999 (*default = 700*) | How transparent the watermark is, where 100 is fully transparent. |
   | Width of grid box in percent relevant to QR code bitmap width | 100 to 1000<br />(*default = 320*) | Determines the distance between the QR codes in percent. When combined with the height, a value of 100 would make the QR codes appear side-by-side and fill the entire screen. |
   | Height of grid box in percent relevant to QR code bitmap width | 100 to 1000<br />(*default = 180*) | Determines the distance between the QR codes in percent. When combined with the width, a value of 100 would make the QR codes appear side-by-side and fill the entire screen. |

   > [!TIP]
   > We recommend trying out different opacity values to find a balance between the readability of the remote session and being able to scan the QR code, but keeping the default values for the other parameters.

1. Apply the policy settings to your session hosts by running a Group Policy update or Intune device sync.

1. Connect to a remote session, where you should see QR codes appear. For any changes you make to the policy and apply to the session host, you'll need to disconnect and reconnect to your remote session to see the difference.

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

## Next steps

- Learn more about [Azure Virtual Desktop Insights](azure-monitor.md).
- For more information about Azure Monitor Log Analytics, see [Overview of Log Analytics in Azure Monitor](../azure-monitor/logs/log-analytics-overview.md).
