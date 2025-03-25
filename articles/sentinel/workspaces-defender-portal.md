---
title: Multiple workspaces - Microsoft Sentinel in Defender portal
description: Learn about the support of multiple workspaces for Microsoft Sentinel in the Defender portal including primary and secondary workspaces.
author: cwatson-cat
ms.author: cwatson
ms.topic: concept-article
ms.date: 02/27/2025
appliesto: Microsoft Sentinel with Defender XDR in the Defender portal


#Customer intent: As a security profession, I want to understand the support for multiple workspaces for Microsoft Sentinel in the Defender portal so that I can make the right choices for my organization when setting up and managing workspaces.

---

# Multiple Microsoft Sentinel workspaces in the Defender portal (preview)

The Defender portal allows you to connect to one primary workspace and multiple secondary workspaces for Microsoft Sentinel. In the context of this article, a workspace is a Log Analytics workspace with Microsoft Sentinel enabled.

This article primarily applies to the scenario where you  onboard Microsoft Sentinel with Microsoft Defender XDR to unify your experiences in [Microsoft's unified security operations (SecOps) platform](/unified-secops-platform/overview-unified-security). If you plan to use Microsoft Sentinel in the Defender portal without Defender XDR, you can manage multiple workspaces. But, the primary workspace doesn't include Defender XDR data and you won't have access to Defender XDR capabilities.  

## Primary and secondary workspaces

When you onboard Microsoft Sentinel, you select a primary workspace. A primary workspace's alerts are correlated with Defender XDR data. So, incidents include alerts from Microsoft Sentinel's primary workspace and Defender XDR in a unified queue. 

- All Defender XDR alerts and incidents are synced back to the primary workspace.  
- All other onboarded workspaces are considered secondary workspaces. Incidents are created based on the workspace’s data and won't include Defender XDR data.
- The Defender portal keeps incident creation and alert correlation separate between the Microsoft Sentinel workspaces.
- The Defender portal supports one primary workspace and up to 99 secondary workspaces per tenant for Microsoft Sentinel.
- One primary workspace must always be connected to the Defender portal when using Microsoft's unified SecOps platform.

Where you have multiple Microsoft Sentinel workspaces within a Microsoft Entra ID tenant, consider using the primary workspace for your global security operations center.

## Primary workspace changes

After you onboard Microsoft Sentinel to the Defender portal,  you can change the primary workspace. When you switch the primary workspace for Microsoft Sentinel, the Defender XDR connector is connected to the new primary and disconnected from the former one automatically.  

Change the primary workspace in the Defender portal by going to **System** > **Settings** > **Microsoft Sentinel** > **Workspaces**.

## Scope of workspace data in different views

If you have the appropriate permissions to view data from primary and secondary workspaces for Microsoft Sentinel, the workspace scope in following table applies for each capability.

|Capability  |Workspace scope |
|---------|---------|
|**Search**     |   The results from the global search at the top of the browser page in the Defender portal provide an aggregated view of all relevant workspace data that you have permissions to view.    |
|Investigation & response > Incidents & alerts > **Incidents**   | View incidents from different workspaces in a unified queue or filter the view by workspace.      |
|Investigation & response > Incidents & alerts > **Alerts**     |   View alerts from different workspaces in a unified queue or filter the view by workspace.<br><br> The Defender portal segments alert correlation by workspace.      |
|Entities: From an incident or alert > select a device, user, or other entity asset  |  View all relevant entity data from multiple workspaces in a single entity page. Entity pages aggregates alerts, incidents, and timeline events from all workspaces to provide deeper insights into entity behavior.   <br><br>Filter by workspace in **Incidents and alerts**, **Timeline**, and **Insights** tabs. The **Overview** tab displays entity metadata aggregated from all workspaces.    |
|Investigation & response > Hunting > **Advanced hunting**     | Select a workspace from the top right-hand side of the browser. Or, query across multiple workspaces by using the workspace operator in the query. See [Query multiple workspaces](extend-sentinel-across-workspaces-tenants.md#query-multiple-workspaces). The query results don't show a workspace name or ID.<br><br>Access all log data of the workspace, including queries and functions, as read only.  For more information, see [Advanced hunting with Microsoft Sentinel data in Microsoft Defender portal](/defender-xdr/advanced-hunting-microsoft-defender). <br><br>Some capabilities are limited to the primary workspace:<br>- Creating custom detections<br>- Queries via API  |
|**Microsoft Sentinel** experiences|View data from one workspace for each page in the Microsoft Sentinel section of the Defender portal. Switch between workspaces by selecting **Select a workspace** from the top-right hand side of the browser for most pages. The **Workbooks** page only shows data associated with the primary workspace.|
|**SOC optimization**|Data and recommendations are aggregated from multiple workspaces. |


## Permissions to view workspace data

After you connect Microsoft Sentinel to the Defender portal, your existing Azure role-based access control (RBAC) permissions allow you to view and work with the Microsoft Sentinel features and workspaces that you have access to.


|Workspace |Access  |
|---------|---------|
|Primary    | If you have access to the primary workspace, you're able to read and manage data from the workspace and Defender XDR.      |
|Secondary    |   If you have access to a secondary workspace, you're able to read and manage data from the workspace only. The secondary workspaces don't include Defender XDR data.       |

**Exception:** If you've already onboarded one workspace to the Defender portal,  any alerts created by using custom detections on `AlertInfo` and `AlertEvidance` tables before mid January are visible to all users.

For more information, see [Roles and permissions in Microsoft Sentinel](roles.md).

## Bi-directional sync for workspaces

How incident changes sync between the Azure portal and the Defender portal depends on whether it's a primary or secondary workspace.

|Workspace |Sync behavior  |
|---------|---------|
|Primary     |  For Microsoft Sentinel in the Azure portal, Defender XDR incidents appear in **Threat management** > **Incidents** with the incident provider name **Microsoft Defender XDR**. Any changes you make to the status, closing reason, or assignment of a Defender XDR incident in either the Azure or Defender portal, update in the other's incidents queue.  For more information, see [Working with Microsoft Defender XDR incidents in Microsoft Sentinel and bi-directional sync](microsoft-365-defender-sentinel-integration.md#working-with-microsoft-defender-xdr-incidents-in-microsoft-sentinel-and-bi-directional-sync).|
|Secondary   | All alerts and incidents that you create for a secondary workspace are synced between that workspace in the Azure and Defender portals.   Data in a workspace is only synced to the workspace in the other portal.      |

## Related content

- [Microsoft Defender multitenant management](/unified-secops-platform/mto-overview)
- [Connect Microsoft Sentinel to the Microsoft Defender portal](/unified-secops-platform/microsoft-sentinel-onboard)

