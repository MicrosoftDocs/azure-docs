---
title: Multiple workspaces - Microsoft Sentinel in Defender portal
description: Learn about the support of multiple workspaces for Microsoft Sentinel in the Defender portal including primary and secondary workspaces.
author: batamig
ms.author: bagol
ms.topic: concept-article
ms.date: 05/26/2025
appliesto: 
    - Microsoft Sentinel with Defender XDR in the Defender portal

#Customer intent: As a security professional, I want to understand the support for multiple workspaces for Microsoft Sentinel in the Defender portal so that I can make the right choices for my organization when setting up and managing workspaces.

---

# Multiple Microsoft Sentinel workspaces in the Defender portal

The Defender portal allows you to connect to one primary workspace and multiple secondary workspaces for Microsoft Sentinel. In the context of this article, a workspace is a Log Analytics workspace with Microsoft Sentinel enabled.

This article primarily applies to the scenario where you onboard Microsoft Sentinel to the Defender portal together with Microsoft Defender XDR for [unified security operations](/unified-secops-platform/overview-unified-security). If you plan to use Microsoft Sentinel in the Defender portal without Microsoft Defender XDR, you can still manage multiple workspaces. However, since you don't have Defender XDR, your primary workspace won't have Defender XDR data, and you won't have access to Defender XDR features.

## Primary and secondary workspaces

Select your primary workspace when you onboard Microsoft Sentinel to the Defender portal. Any other workspaces that you onboard to the Defender portal are considered as secondary workspaces. The Defender portal supports one primary workspace and up to 99 secondary workspaces per tenant for Microsoft Sentinel.

When you also have Microsoft Defender XDR, alerts from your primary workspace are correlated with Defender XDR data, and incidents include alerts from both your primary workspace and Defender XDR in a unified queue. When you select a primary workspace, the [Defender XDR data connector](connect-microsoft-365-defender.md) for incidents and alerts is connected to the primary workspace only.

In such cases:

|Area  |Description  |
|---------|---------|
|**Other workspaces previously connected to Defender XDR** | Any other workspaces that were previously connected to the Defender XDR connector are disconnected, and function as secondary workspaces. Defender XDR data isn't available in a secondary workspace, and any analytics rules and automation that you had previously configured based on Defender XDR data no longer function.|
|**Tenant-based alerts and standalone data connectors** |Alerts from other Microsoft services, including other Defender services, are tenant-based alerts and relate to the entire tenant instead of a specific workspace.  <br><br>To prevent duplication across workspaces, any direct, standalone data connectors for these services must be disconnected from Microsoft Sentinel in secondary workspaces. This results in tenant-based alerts surfacing only in the primary workspace. <br><br>Upon onboarding, standalone data connectors for Microsoft Defender for Office 365, Microsoft Entra ID Protection, Microsoft Defender for Cloud Apps, Microsoft Defender for Endpoint, and Microsoft Defender for Identity are automatically disconnected. <br><br>If you have other, standalone Microsoft data connectors with alerts in your workspaces, make sure to disconnect them before onboarding to the Defender portal. |
|**Defender XDR alerts and incidents** | All Defender XDR alerts and incidents are synced to your primary workspace only.|
|**Incident creation and alert correlation** | The Defender portal keeps incident creation and alert correlation separate between the Microsoft Sentinel workspaces. Incidents in secondary workspaces don't include data from any other workspace, or from Defender XDR.|
|**One primary workspace required** | One primary workspace must always be connected to the Defender portal.|

For example, you might be working on a global SOC team in a company that has multiple, autonomous workspaces. In such cases, you might not want to see incidents and alerts from each of these workspaces in your global SOC queue in the Defender portal. Since these workspaces are onboarded to the Defender portal as secondary workspaces, they show in the Defender portal as Microsoft Sentinel only, without any Defender data, and continue to function autonomously. When looking at your global SOC workspace, you won't see data from these secondary workspaces.

Where you have multiple Microsoft Sentinel workspaces within a Microsoft Entra ID tenant, consider using the primary workspace for your global security operations center.

## Permissions to manage workspaces and view workspace data

Use one of the following roles or role combinations to manage primary and secondary workspaces:

|Task  |Required roles or role combinations  |
|---------|---------|
|**Connect a primary workspace**     | One of the following: <br>- Global Administrator AND subscription Owner <br>- Security Administrator AND subscription Owner <br>- Global Administrator AND User access administrator AND Sentinel contributor <br>- Security Administrator AND User access administrator AND Sentinel contributor|
|**Change the primary workspace**     | One of the following: <br>- Global Administrator <br>- Security Administrator |
|**Onboard or offboard secondary workspaces**     |  One of the following:  <br>- Global Administrator AND subscription Owner <br>- Security Administrator AND subscription Owner <br>- Global Administrator AND User access administrator AND Sentinel contributor <br>- Security Administrator AND User access administrator AND Sentinel contributor <br>- Subscription Owner <br>- User access administrator AND Sentinel contributor|

> [!IMPORTANT]
> Microsoft recommends that you use roles with the fewest permissions. This helps improve security for your organization. Global Administrator is a highly privileged role that should be limited to emergency scenarios when you can't use an existing role.

After you connect Microsoft Sentinel to the Defender portal, your existing Azure role-based access control (RBAC) permissions allow you to view and work with the Microsoft Sentinel features and workspaces that you have access to.

|Workspace |Access  |
|---------|---------|
|**Primary**    | If you have access to the primary workspace, you're able to read and manage data from the workspace and Defender XDR.      |
|**Secondary**    |   If you have access to a secondary workspace, you're able to read and manage data from the workspace only. The secondary workspaces don't include Defender XDR data.       |

**Exception:** If you've already onboarded one workspace to the Defender portal, any alerts created by using custom detections on `AlertInfo` and `AlertEvidence` tables before mid January 2025 are visible to all users.

For more information, see [Roles and permissions in Microsoft Sentinel](roles.md).

## Primary workspace changes

After you onboard Microsoft Sentinel to the Defender portal, you can change the primary workspace. When you switch the primary workspace for Microsoft Sentinel, the Defender XDR connector is connected to the new primary and disconnected from the former one automatically.  

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


## Bi-directional sync for workspaces

How incident changes sync between the Azure portal and the Defender portal depends on whether it's a primary or secondary workspace.

|Workspace |Sync behavior  |
|---------|---------|
|Primary     |  For Microsoft Sentinel in the Azure portal, Defender XDR incidents appear in **Threat management** > **Incidents** with the incident provider name **Microsoft XDR**. Any changes you make to the status, closing reason, or assignment of a Defender XDR incident in either the Azure or Defender portal, update in the other's incidents queue.  For more information, see [Working with Microsoft Defender XDR incidents in Microsoft Sentinel and bi-directional sync](microsoft-365-defender-sentinel-integration.md#working-with-microsoft-defender-xdr-incidents-in-microsoft-sentinel-and-bi-directional-sync).|
|Secondary   | All alerts and incidents that you create for a secondary workspace are synced between that workspace in the Azure and Defender portals.   Data in a workspace is only synced to the workspace in the other portal.      |

## Insider risk management (IRM) support

[Microsoft Purview Insider Risk Management (IRM)](/defender-xdr/irm-investigate-alerts-defender) alerts are correlated to the primary workspace only. If you have IRM alerts with [Microsoft Defender XDR](microsoft-365-defender-sentinel-integration.md), you must connect IRM to the Microsoft Defender XDR connector in your primary workspace before onboarding the workspace to the Defender portal. This is required to ensure that IRM alerts and incidents are available in the primary workspace. If you don't want to see IRM alerts in the primary workspace, you can instead opt out of the integration with Microsoft Defender XDR. 

Also, if the direct [Microsoft 365 Insider Risk Management connector for Microsoft Sentinel](data-connectors-reference.md#microsoft-365-insider-risk-management) data connector is connected to any of the secondary workspaces, you must disconnect it before onboarding the workspace to the Defender portal.

## Related content

- [Microsoft Defender multitenant management](/unified-secops-platform/mto-overview)
- [Connect Microsoft Sentinel to the Microsoft Defender portal](/unified-secops-platform/microsoft-sentinel-onboard)