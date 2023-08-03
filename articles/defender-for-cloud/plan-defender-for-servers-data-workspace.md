---
title: Plan Defender for Servers data residency and workspaces 
description: Review data residency and workspace design for Microsoft Defender for Servers.
ms.topic: conceptual
ms.author: dacurwin
author: dcurwin
ms.date: 06/15/2023
ms.custom: references_regions
---
# Plan data residency and workspaces for Defender for Servers

This article helps you understand how your data is stored in Microsoft Defender for Servers and how Log Analytics workspaces are used in Defender for Servers.

Defender for Servers is one of the paid plans provided by [Microsoft Defender for Cloud](defender-for-cloud-introduction.md).

## Before you begin

This article is the *second* article in the Defender for Servers planning guide series. Begin by [planning your deployment](plan-defender-for-servers.md).

## Understand data residency

Data residency refers to the physical or geographic location of your organization's data.

Before you deploy Defender for Servers, it's important for you to understand data residency for your organization:

- Review [general Azure data residency considerations](https://azure.microsoft.com/blog/making-your-data-residency-choices-easier-with-azure/).
- Review the table in the next section to understand where Defender for Cloud stores data.

### Storage locations

Understand where Defender for Cloud stores data and how you can work with your data:

**Data** | **Location**
--- | ---  
**Security alerts and recommendations** | - Stored in the Defender for Cloud back end and accessible via the Azure portal, Azure Resource Graph, and REST APIs.<br/><br/> - You can export the data to a Log Analytics workspace by using [continuous export](continuous-export.md).
**Machine information** | - Stored in a Log Analytics workspace.<br/><br/> - You can use either the default Defender for Cloud workspace or a custom workspace. Data is stored in accordance with the workspace location.

## Workspace considerations

In Defender for Cloud, you can store server data in the default Log Analytics workspace for your Defender for Cloud deployment or in a custom workspace.

Here's more information:

- By default, when you enable Defender for Cloud for the first time, a new resource group and a default workspace are created in the subscription region for each subscription that has Defender for Cloud enabled.
- When you use only free foundational cloud security posture management (CSPM), Defender for Cloud sets up the default workspace with the *SecurityCenterFree* solution enabled.
- When you turn on a Defender for Cloud plan (including Defender for Servers), the plan is enabled for the default workspace, and the *Security* solution is enabled.
- If you have virtual machines in multiple locations, Defender for Cloud creates multiple workspaces accordingly to ensure data compliance.
- Default workspace names are in the format `[subscription-id]-[geo]`.

## Default workspaces

Defender for Cloud default workspaces are created in the following locations:

**Server location** | **Workspace location**
--- | ---
United States, Canada, Europe, United Kingdom, Korea, India, Japan, China, Australia | The workspace is created in the matching location.
Brazil | United States
East Asia, Southeast Asia | Asia

## Custom workspaces

You can store your server information in the default workspace or you can use a custom workspace. A custom workspace must meet these requirements:

- You must enable the Defender for Servers plan in the custom workspace.
- The custom workspace must be associated with the Azure subscription in which Defender for Cloud is enabled.
- You must have at least read permissions for the workspace.
- If the *Security & Audit* solution is installed in a workspace, Defender for Cloud uses the existing solution.

## Next steps

- After you work through these planning steps, review [Defender for Server access roles](plan-defender-for-servers-roles.md).
- Check out the [common questions](faq-defender-for-servers.yml) about workspaces in Defender for Servers.
