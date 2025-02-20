---
title: Multiple workspaces - Microsoft Sentinel in Defender portal
description: Learn about the support of multiple workspaces for Microsoft Sentinel in the Defender portal including primary and secondary workspaces.
author: cwatson-cat
ms.author: cwatson
ms.topic: concept-article
ms.date: 02/20/2025
appliesto: Microsoft Sentinel in the Defender portal


#Customer intent: As a security profession, I want to understand the support for multiple workspaces for Microsoft Sentinel in the Defender portal so that I can make the right choices for my organization when setting up and managing workspaces.

---

# Multiple workspace management for Microsoft Sentinel in the Defender portal

The Defender portal allows you to connect to one primary workspace and multiple secondary workspaces for Microsoft Sentinel. In the context of this article, a workspace is a Log Analytics workspace with Microsoft Sentinel enabled.

## Primary and secondary workspaces

When you onboard Microsoft Sentinel you select a primary workspace. A Primary workspace's alerts are correlated with Microsoft Defender XDR data, which results in incidents that include alerts from Microsoft Sentinel's primary workspace and Defender XDR. 

- All Defender XDR alerts and incidents are synced back to the primary workspace.  -
- All other onboard workspaces are considered secondary workspaces. Incidents are created based on the workspace’s data and won't include Defender XDR data.
- The Defender portal supports one primary workspace and up to 99 secondary workspaces per tenant for Microsoft Sentinel.
- One primary workspace must always be connected when using Microsoft's unified SecOps platform.

Where you have multiple Microsoft Sentinel workspaces within a Microsoft Entra ID tenant, consider using the primary workspace for your global security operations center. 

## Workspace management

After you onboard Microsoft Sentinel to the Defender portal,  you can change the primary workspace. When you switch the primary workspace for Microsoft Sentinel, the Defender XDR connector is connected to the new primary and disconnected from the former one automatically.  

Change the primary workspace in the Defender portal by going to **System** > **Settings** > **Microsoft Sentinel** > **Workspaces**.

## Scope in different views

NOTES:

Unified incidents will scope to all workspaces. 

Correlation is segmented by workspace. (not across workspaces) 

Advanced hunting - scope to workspace BUT you can use workspace operator in LA to run queries across workspaces. 

Global search - no aggregated view for results. Results based on single workspace that you can select. 

All sentinel experiences will have a workspace selector. So instead of picking workspace as you go into Sentinel, you can pick after on the individual experiences. 

## Related content

- [Microsoft Defender multitenant management](/unfied-secops-platform/mto-overview)
- [Connect Microsoft Sentinel to the Microsoft Defender portal](/unified-secops-platform/microsoft-sentinel-onboard)

