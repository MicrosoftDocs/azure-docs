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

# Multiple Microsoft Sentinel workspaces in the Defender portal

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


If you have the appropriate permissions to view data from primary and secondary workspaces for Microsoft Sentinel, the workspace scope in following table applies for each capability.

|Capability  |Workspace scope |
|---------|---------|
|Incidents & alerts > Incidents   | View incidents from different workspaces in a unified queue or filter the view by workspace.        |
|Incidents & alerts > Alerts     |   View alerts from different workspaces in a unified queue or filter the view by workspace.       |
|Entities: From an incident or alert > select a device, user, or other entity asset  |  View all relevant entity data from multiple workspaces in a single entity page. Entity pages aggregates alerts, incidents, and timeline events from all workspaces to provide deeper insights into entity behavior.   <br><br>Filter by workspace in **Incidents and alerts**, **Timeline**, and **Insights** tabs. The **Overview** tab displays entity metadata aggregated from all workspaces.    |
|Advanced hunting     |         |
|Global search     |         |
|Microsoft Sentinel experiences|View data from one workspace  for each page in the Microsoft Sentinel section of the Defender portal. Switch between workspaces by selecting **Select a workspace** from the top-right hand side of the browser. The **Workbooks** page only shows workbooks associated with the primary workspace.|
|Microsoft Sentinel > Automation|Instead of creating the same rule in each workspace separately, deploy copies of an automation rule across multiple workspaces by using the automation rule creation wizard. <br><br>Like the other Microsoft Sentinel experiences, the **Automation** page displays rules from a single workspace.  Switch between workspaces by selecting **Select a workspace** from the top-right hand side of the browser.|
|SOC optimization|Data and recommendations is aggregated from multiple workspaces. |


## Permissions

TO DO:
Permissions and RBAC: In the unified portal we respect Sentinel workspace’s permissions: 

Primary Workspace users- will be able to read/ manage data from the workspace and XDR data as well.  

Secondary Workspace users- will only have read/ manage permissions to the data that belongs to the workspace itself.  

Exception: customers that already onboarded one Workspace to the unified portal: 
Alerts created using Custome Detections on AlertInfo and AlertEvidance tables before Mid January will be visible to all users 

Permissions and RBAC for Microsoft Defender XDR remain the same.  

## Bi-directional sync

Primary workspace:  

When the Defender XDR connector is enabled, alerts and incidents flow to Microsoft Sentinel through the Defender XDR connector. 

Defender XDR incidents appear in the Microsoft Sentinel incident queue with the product name Microsoft Defender XDR. Changes made to the status, closing reason or assignment of a Defender XDR incident in either Defender XDR or Sentinel, update accordingly in the other’s incidents queue. 

Learn more here: Microsoft Defender XDR integration with Microsoft Sentinel | Microsoft Learn 

Secondary workspace: 

all alerts and incidents that will be created for this workspace will be synced back to the workspace.  

No data violation: data from a workspace will only be synced to its own workspace. 

## Related content

- [Microsoft Defender multitenant management](/unfied-secops-platform/mto-overview)
- [Connect Microsoft Sentinel to the Microsoft Defender portal](/unified-secops-platform/microsoft-sentinel-onboard)

