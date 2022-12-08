---
title: Plan data residency and workspace design for Defender for Servers 
description: Review data residency and workspace design for Defender for Servers 
ms.topic: conceptual
ms.author: benmansheim
author: bmansheim
ms.date: 11/06/2022
---
# Review data residency and workspace design

This article helps you to understand how your data is stored in Defender for Servers, and how Log Analytics workspaces are used. Defender for Servers is one of the paid plans provided by [Microsoft Defender for Cloud](defender-for-cloud-introduction.md).


## Before you start

This article is the second in the Defender for Servers planning guide series. Before you begin, review [Start planning your deployment](plan-defender-for-servers.md).

## Understand data residency

Data residency refers to the physical or geographic location of your organization’s data.

1. Before you deploy Defender for Servers, review [general Azure data residency considerations](https://azure.microsoft.com/blog/making-your-data-residency-choices-easier-with-azure/).
1. Review the table below to understand where Defender for Cloud/Defender for Servers stores data.

### Storage locations

**Data** | **Location** 
--- | ---  
**Security alerts and recommendations** | These are stored in the Defender for Cloud backend, and accessible via the Azure portal, Azure Resource Graph, and the REST APIs.<br/><br/> Export to a Log Analytics workspace using [continuous export](continuous-export.md).
**Machine information** | Stored in a Log Analytics workspace.<br/><br/> Either in the Defender for Cloud default workspace, or a custom workspace that you specify. Data is stored in accordance with the workspace location.

## Understand workspace considerations

In Defender for Cloud, you can store server data in the default Defender for Cloud log analytics workspace, or in a custom workspace.

### Default workspace

- By default, when you onboard for the first time Defender for Cloud creates a new resource group and default workspace in the region of each subscription with Defender for Cloud enabled.
- When you use only free foundational cloud security posture management (CSPM), Defender for Cloud sets up the default workspace with the *SecurityCenterFree* solution enabled.
- When you turn on Defender for Cloud plans (including Defender for Servers), they're enabled on the default workspace, and the *Security* solution is installed.
- If you have VMs in multiple locations, Defender for Cloud creates multiple workspaces accordingly, to ensure data compliance.
- Default workspace naming is in the format: [subscription-id]-[geo].

## Default workspace 

Default workspaces are created in the following locations.

**Server location** | **Workspace location**
--- | ---
United States, Canada, Europe, UK, Korea, India, Japan, China, Australia | The workspace is created in the matching location.
Brazil | United States
East Asia, Southeast Asia | Asia

## Custom workspaces

Your server information can be stored in the default workspace, or you can select to use a custom workspace.

- You must enable the Defender for Servers plan on custom workspaces.
- The custom workspace must be associated with the Azure subscription on which Defender for Cloud is enabled.
- You need at minimum read permissions for the workspace.
- If the *Security & Audit* solution is installed on a workspace, Defender for Cloud uses the existing solution.
- Learn more about [Log Analytics workspace design strategy and criteria](../azure-monitor/logs/workspace-design.md).



## Next steps

After working through these planning steps, review [Defender for Server access roles](plan-defender-for-servers-roles.md).
