---
title: Use RDP Multipath to improve Azure Virtual Desktop connections
description: Learn how RDP Multipath enhances remote connections to an Azure Virtual Desktop session by intelligently managing multiple network paths.
ms.topic: how-to
author: dougeby
ms.author: avdcontent
ms.date: 06/02/2025
---

# Use RDP Multipath to improve connections to Azure Virtual Desktop

> [!IMPORTANT]
> RDP Multipath is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Remote Desktop Protocol (RDP) Multipath improves session stability by continuously monitoring multiple networks paths and dynamically selecting the most reliable one. This intelligent switching mechanism helps reduce the likelihood of disconnections and contributes to a smoother and more consistent user experience.

It offers several key benefits:

- **Seamless integration**: RDP Multipath works automatically. You don't need to make changes to existing infrastructure, making it easy to adopt RDP Multipath without disrupting current workflows.

- **Intelligent path management**: Interactive Connectivity Establishment (ICE) discovers and evaluates multiple RDP Shortpath paths using Simple Traversal Underneath NAT (STUN) and Traversal Using Relays around NAT (TURN) protocols. With RDP Multipath, backup paths remain on standby in case the active path fails. RDP Multipath continuously monitors these paths and promotes the most stable one to active use. If the currently active path becomes unreliable or fails, the system automatically switches to the next best available path. This helps users remain connected and significantly reduces session drops or interruptions. If all paths fail, for example due to a local network outage, it automatically attempts to reconnect once connectivity is restored.

- **Enhanced Reliability**: RDP Multipath proactively manages multiple network paths to significantly improve the resilience of Azure Virtual Desktop connections. Even in environments with fluctuating network quality, users can expect a more stable and productive experience.

The following diagram illustrates how RDP Multipath works with Azure Virtual Desktop. In this user scenario, the primary active path is the connection of UDP via STUN, supplemented by two redundant UDP connections through a TURN server:

:::image type="content" source="media/rdp-multipath/rdp-multipath-diagram.svg" alt-text="A diagram showing RDP Multipath connections over RDP Shortpath using STUN and TURN.":::

## Prerequisites

RDP Multipath works automatically when the following prerequisites are met:

- During the preview, your host pool must be set as a validation environment. For more information, see [Configure a host pool as a validation environment](configure-validation-environment.md).

- Ensure that RDP Shortpath is configured as the primary transport protocol. For more information, see [Configure RDP Shortpath](configure-rdp-shortpath.md). We don't currently support WebSocket (TCP-based) connections and those users don't see any benefit at this time.

- Connections must be from a local Windows device using [Windows App, version 2.0.366.0](/windows-app/whats-new?tabs=windows) or later, or the [Remote Desktop client, version 1.2.6074](/previous-versions/remote-desktop-client/whats-new-windows?tabs=windows-msrdc-msi) or later. Other platforms aren't currently supported.

## Verify RDP Multipath is used

There are two ways to verify that RDP Multipath is being used for a connection:

- Users can check the connection status of a remote session from the connection bar, which shows RDP Multipath is enabled, as shown in the following example screenshot:

   :::image type="content" source="media/rdp-multipath/rdp-multipath-connection-bar.png" alt-text="A screenshot of connection information showing that RDP Multipath is enabled.":::

- Azure Virtual Desktop administrators can view connection reliability information in Azure Virtual Desktop Insights. For more information, see the [connection reliability use case for Azure Virtual Desktop Insights](insights-use-cases.md#connection-reliability).

   If you find some connections aren't using RDP Multipath, check that a firewall or other network restrictions doesn't block RDP Shortpath connections. A connection using STUN or TURN protocols is required.

## Opt-out of the RDP Multipath preview

If you experience degraded performance or connectivity issues, you can opt out of the preview by removing your host pool from the validation ring.

## Related content

To learn more about RDP Shortpath, see [RDP Shortpath for Azure Virtual Desktop](rdp-shortpath.md).
