---
title: Out-of-the-box (OOTB) content centralization changes
titleSuffix: Microsoft Sentinel
description: This article describes the centralization changes about to take place for out-of-the-box content in Microsoft Sentinel.
author: austinmccollum
ms.topic: conceptual
ms.date: 01/30/2023
ms.author: austinmc
#Customer intent: As a SIEM decision maker or implementer, I want to know about changes to out of the box content, and how to centralize the management, discovery and inventory of content in Microsoft Sentinel.
---

# Microsoft Sentinel out-of-the-box content centralization changes

Microsoft Sentinel Content hub enables discovery and on-demand installation of out-of-the-box (OOTB) content and solutions in a single step. Previously, some of this OOTB content only existed in various gallery sections of Sentinel. We're excited to announce *all* of the following gallery content templates are now available in content hub as standalone items or part of packaged solutions.

- **Data connectors**
- **Hunting queries**
- **Analytics rule templates**
- **Playbook templates**
- **Workbook templates**

## Content hub changes
In order to centralize all out-of-the-box content, we're planning to retire the gallery-only content templates. The legacy gallery content templates are no longer being updated consistently, and the content hub is where OOTB content is kept up to date. Content hub also provides update workflows for solutions and automatic updates for standalone content. To facilitate this transition, we're going to publish a central tool to reinstate corresponding **IN USE** retired templates from the Content hub. 

## Sentinel GitHub changes
Microsoft Sentinel has an official [GitHub repository](https://github.com/Azure/Azure-Sentinel) for community contributions vetted by Microsoft and the community. It is the source for most of the content items in Content hub. In order to enable consistent discovery of all this content, the OOTB content centralization changes have already been extended to the Microsoft Sentinel GitHub repo. With this change: 

 - All OOTB content packaged in solutions in content hub now shows up under the [Solutions folder](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions) in the GitHub repository. 
 - All standalone OOTB content will continue to remain in their respective locations. 
  
Together, these changes will complete the journey towards centralizing Microsoft Sentinel content.

## When is this change coming?
> [!NOTE]
> The following timeline is tentative and subject to change.
>

The centralization change in the Sentinel portal is expected to go live in all Sentinel workspaces Q2 2023. The Microsoft Sentinel GitHub changes have already been done. Standalone content is available in existing GitHub folders and solutions content has been moved to the solutions folder.  

## Scope of change
This change is only scoped to *gallery content* type templates. All these same templates and more OOTB content are available in *Content hub* as solutions or standalone content. 

For Microsoft Sentinel GitHub, OOTB content packaged in solutions in content hub now shows up under the GitHub [Solutions folder](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions). The other existing content in GitHub is scoped to the following folders and only contains standalone content items. Content in the remaining GitHub folders not called out in this list do not have any changes.

- [DataConnectors folder](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors)
- [Detections folder](https://github.com/Azure/Azure-Sentinel/tree/master/Detections) (Analytics rules)
- [Hunting queries folder](https://github.com/Azure/Azure-Sentinel/tree/master/Hunting%20Queries)
- [Parsers folder](https://github.com/Azure/Azure-Sentinel/tree/master/Parsers)
- [Playbooks folder](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks)
- [Workbooks folder](https://github.com/Azure/Azure-Sentinel/tree/master/Workbooks)


### What's not changing?
The active or custom items created in any manner (from templates or otherwise) are **NOT** impacted by this change. More specifically, the following are **NOT** affected by this change: 

- Data Connectors with *Status = Connected*. 
- Alert rules or detections (enabled or disabled) in the *'Active rules'* tab in the Analytics gallery. 
- Saved workbooks in the 'My workbooks' tab in the Workbooks gallery. 
- Cloned content or *Content source = Custom* in the Hunting gallery. 
- Active playbooks (enabled or disabled) in the *'Active playbooks'* tab in the Automation gallery. 

Any OOTB content templates installed from content hub (identifiable as *Content source = Content hub*) are NOT affected by this change.

### What's changing?
All template galleries will display an in-product warning banner. This banner will contain a link to a tool that will run within the Microsoft Sentinel portal. Activating the tool will initiate a guided experience to reinstate the content templates for the **IN USE** retired templates from the Content hub. This tool only needs to be run once per workspace, so be sure to plan with your organization. Once the tool runs successfully, the warning banner will resolve and no longer be visible from the template galleries of that workspace. 

Specific impact to the gallery content templates for each of these galleries are detailed in the following table. Expect these changes when the OOTB content centralization goes live. 

| Content Type | Impact |
| ------- | ------- |
| [Data connectors](connect-data-sources.md) | The templates identifiable as `content source = "Gallery content"` and `Status = "Not connected"` will no longer appear in the data connectors gallery. |
| [Analytics templates](detect-threats-built-in.md#view-built-in-detections) | The templates identifiable as `source name = "Gallery content"` will no longer appear in the Analytics template gallery. |
| [Hunting](hunting.md#use-built-in-queries) | The templates with `Content source = "Gallery content"` will no longer appear in the Hunting gallery. |
| [Workbooks templates](get-visibility.md#use-built-in-workbooks) | The templates with `Content source = "Gallery content"` will no longer appear in the Workbooks template gallery. |
| [Playbooks templates](use-playbook-templates.md#explore-playbook-templates) | The templates identifiable as `source name = "Gallery content"` will no longer appear in the Automation Playbook templates gallery. |

Here's an example of an Analytics rule before and after the centralization changes and the tool has run.
- The active Analytics rule won't change at all. We can see it's based on an Analytics rule template that will be retired.
    :::image type="content" source="media/sentinel-content-centralize/before-tool-analytic-rule-active-2.png" alt-text="This screenshot shows an active Analytics rule before centralization changes.":::

- This screenshot shows the Analytics rule template before the change that will be retired.
    :::image type="content" source="media/sentinel-content-centralize/before-tool-analytic-rule-template-2.png" alt-text="This screenshot shows the Analytics rule template that will be retired.":::

- After the tool has been run to reinstate the Analytics rule template, the source changes to the solution it's reinstated from.
    :::image type="content" source="media/sentinel-content-centralize/after-tool-analytic-rule-template-2.png" alt-text="This screenshot shows the Analytics rule template after being reinstated from the Content hub Azure Active Directory solution.":::

## Action needed
- Starting now, install new OOTB content from Content hub and update solutions as needed to have the latest version of the templates. 
- For existing gallery content templates in use, get future updates by installing the respective solutions or standalone content items from Content hub. The gallery content in the feature galleries may be out-of-date.
- If you have applications or processes that directly get OOTB content from the Microsoft Sentinel GitHub repository, update the locations to include getting OOTB content from the solutions folder in addition to existing content folders.  
- Plan with your organization who and when will run the tool when you see the warning banner and the change goes live in Q2 2023. The tool needs to be run once in a workspace to reinstate all **IN USE** retired templates from the Content hub. 
- Review the FAQs section to learn more details that may be applicable to your environment. 

## Content centralization FAQs
#### Will my SOC alert generation or incidents generation and management be impacted with this change? 
No, there's no impact to active alert rules or detections, or active playbooks, or cloned hunting queries, or saved workbooks. The OOTB content centralization change won't impact your current incident generation and management processes.  

#### Are there any gallery content exceptions? 
Yes, the following Analytics rule template types won't be impacted by this change.  

- Fusion templates 
- Anomalies templates 
- ML (Managed Language) rule templates 
- Microsoft incident creation templates 
- BBTI (Blackbox Threat intelligence) templates 

#### Will any of the APIs be impacted with this change? 
Currently the only Sentinel REST API calls that exist for content template management are the `Get` and `List` operations for alert rule templates. These operations only surface gallery content templates and won't be updated.   

New content hub API operations will be available soon to enable OOTB content management scenarios more broadly. This API update will include operations for the same content types scoped in the centralization changes (data connectors, playbook templates, workbook templates, analytic rule templates, hunting queries). A mechanism to update analytics rule templates installed on the workspace is on the roadmap as well. 

**Action needed:** Plan to update your applications and processes to utilize the new content hub OOTB content management APIs when those are available in Q2 2023.  

#### How will the central tool identify my in-use OOTB content templates? 
The tool will look for data connectors with "status = connected" to build a list of solutions and standalone content that you can review and install to get the content hub OOTB content templates in all the impacted feature galleries. There is a specific check for **IN USE** playbook templates. Since this process installs solutions, you might get more OOTB content items that match the connected data source than you might be actually using.  

Please note that this central tool is a best-effort to get your **IN USE** OOTB content templates reinstated from content hub. You can get additional OOTB content or content might be missing that you can get directly by installing from content hub.   

#### What if I am using APIs to connect data sources in my Microsoft Sentinel workspace?  
Currently all the data connectors exist in the data connectors gallery so you can see the specific data connector show up as "status = Connected" if the specific data type matches with that referenced in the data connector. After the centralization experiences go live, the specific data connector needs to be installed from the respective solution to get the same behavior.  

**Action needed:** Plan to update the process/any custom tooling for deploying data connectors in this scenario to start installing the specific solution(s) before the connecting to data ingest APIs step. The API for installing a solution will be coming in Q2 2023 with the content hub OOTB content management APIs.    

#### What if I am working with content using Repositories feature in Microsoft Sentinel? 
Repositories specifically deploy custom or active content in Microsoft Sentinel. Content deployed through the Repositories feature won't be impacted by the OOTB content centralization changes. 

## Next steps
Take a look at these other resources for OOTB content and Content hub.

- [About OOTB content and solutions in Microsoft Sentinel](sentinel-solutions.md)
- [Discover OOTB content and solutions in Content hub](sentinel-solutions-deploy.md)
- [How to install and update OOTB content and solutions in Content hub](sentinel-solutions-deploy.md#install-or-update-content)
- [Bulk install and update solutions and standalone content in Content hub](sentinel-solutions-deploy.md#bulk-install-and-update-content)
- [How to enable OOTB content and solutions in Content hub](sentinel-solutions-deploy.md#enable-content-items-in-a-solution)
- Video: [Using content hub to manage your SIEM content](https://www.youtube.com/watch?v=OtHs4dnR0yA&list=PL3ZTgFEc7LyvY90VTpKVFf70DXM7--47u&index=10)