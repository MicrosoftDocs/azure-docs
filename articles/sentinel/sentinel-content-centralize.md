---
title: [Coming Soon] Content hub centralization changes in Microsoft Sentinel
description: This article describes the centralization changes about to take place for out-of-the-box content in Microsoft Sentinel.
author: austinmccollum
ms.topic: conceptual
ms.date: 01/30/2023
ms.author: austinmc
---

# [Coming Soon] Content hub centralization changes in Microsoft Sentinel

Microsoft Sentinel Content hub enables discovery and on-demand installation of out-of-the-box (OOTB) content and solutions in a single step. Previously, some of this built-in content only existed in various gallery sections of Sentinel. We are excited to announce all of the following gallery content templates are now available in content hub as standalone items or part of packaged solutions.

- **Data connectors**
- **Hunting queries**
- **Analytics rule templates**
- **Playbook templates**
- **Workbook templates**

In order to centralize all OOTB content in one place, however, we are planning to retire the gallery-only templates. The legacy gallery templates don't update automatically, but the content hub provides update workflows for solutions and automatic updates for standalone content. So, we are introducing a central tool to filter "in-use" templates retired from the feature galleries and reinstate the corresponding content hub items. This change will complete the journey towards centralizing Microsoft Sentinel content.

## When is this change coming?
This change is expected to go live in all Microsoft Sentinel workspaces in Spring 2023.

> [!NOTE]
> This planned timeline is tentative and is subject to change.

## Scope of change
This change is only scoped to gallery content type templates. All these same templates and more OOTB content are available in content hub as solutions or standalone content. 

### What's not changing?
The active or custom items created in any manner (from templates or otherwise) are **NOT** impacted by this change. This specifically means the following are **NOT** affected by this change: 

- Data Connectors with *Status = Connected*. 
- Alert rules or detections in enabled or disabled state in the 'Active rules' tab in the Analytics gallery. 
- Saved workbooks in the 'My workbooks' tab in the Workbooks gallery. 
- Cloned content or *Content source = Custom* in the Hunting gallery. 
- Active playbooks in either enabled or disabled state in the 'Active playbooks' tab in the Automation gallery. 

Any OOTB content templates installed from content hub (identifiable as *Content source = Content hub*) are NOT affected by this change.

### What's changing?
All template galleries will display an in-product warning banner. This will contain a link to a tool within the Sentinel portal. Activating the tool will initiate a guided experience to help reinstate in-use templates centrally in content hub for all galleries in the current workspace. This tool is expected to be executed only once per workspace. Once the tool runs successfully, the warning banner will resolve and no longer be visible from the template galleries of that workspace. 

Specific impact to the gallery content templates for each of these galleries are detailed below. The following changes will be visible when the OOTB content centralization changes goes live. 

Data connectors  
The templates identifiable as content source = "Gallery content" and Status = "Not connected" will no longer appear in the data connectors gallery.  

Analytics templates 
The templates identifiable as source name = "Gallery content" will no longer appear in the Analytics template gallery. 

Hunting  
The templates with Content source = "Gallery content" will no longer appear in the Hunting gallery. 

Workbooks templates 
The templates with Content source = "Gallery content" will no longer appear in the Workbooks template gallery. 

Playbooks templates  
The templates identifiable as source name = "Gallery content" will no longer appear in the Automation Playbook templates gallery.

## Action needed
1. Starting now, install new OOTB content from Content hub and update solutions as needed to have the latest version of the templates. The gallery content in the above-listed feature galleries may be out-of-date.  
1. Plan to execute the tool when the change goes live. 
1. Spread awareness of the OOTB content centralization change in your organization.  

## Next steps

Take a look at these additional resources for OOTB content and Content hub.

- [About OOTB content and solutions in Microsoft Sentinel](sentinel-solutions.md)
- [Discover OOTB content and solutions in Content hub](sentinel-solutions-deploy.md)
- [How to install and update OOTB content and solutions in Content hub](sentinel-solutions-deploy#install-or-update-content)
- [Bulk install and update solutions and standalone content in Content hub](sentinel-solutions-deploy#bulk-install-and-update-content)
- [How to enable OOTB content and solutions in Content hub](sentinel-solutions-deploy#enable-content-items-in-a-solution)
- Video: [Using content hub to manage your SIEM content](https://www.youtube.com/watch?v=OtHs4dnR0yA&list=PL3ZTgFEc7LyvY90VTpKVFf70DXM7--47u&index=10)