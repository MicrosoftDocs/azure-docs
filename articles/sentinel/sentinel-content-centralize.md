---
title: Out-of-the-box (OOTB) content centralization changes
titleSuffix: Microsoft Sentinel
description: This article describes upcoming centralization changes for out-of-the-box content in Microsoft Sentinel.
author: austinmccollum
ms.topic: conceptual
ms.date: 06/22/2023
ms.author: austinmc
#Customer intent: As a SIEM decision maker or implementer, I want to know about changes to out-of-the-box content, and how to centralize the management, discovery, and inventory of content in Microsoft Sentinel.
---

# Microsoft Sentinel out-of-the-box content centralization changes

The Microsoft Sentinel content hub enables discovery and on-demand installation of out-of-the-box (OOTB) content and solutions in a single step. Previously, some of this OOTB content existed only in various gallery sections of Microsoft Sentinel. Now, *all* of the following gallery content templates are available in the content hub as standalone items or as part of packaged solutions:

- Data connectors
- Analytics rule templates
- Hunting queries
- Playbook templates
- Workbook templates

## Content hub changes

To centralize all OOTB content, we've retired the gallery-only content templates. The legacy gallery content templates are no longer being updated consistently, and the content hub is where OOTB content stays up to date. The content hub also provides updated workflows for solutions and automatic updates for standalone content.

To facilitate this transition, we've published a central tool to reinstate **IN USE** retired templates from corresponding content hub solutions.

## Reinstate IN USE retired templates with central tool

Now that the content hub centralization changes are complete, here's an overview of how to complete the central tool reinstate process.

1. Select the link in the warning banner to reinstate **IN USE** retired, gallery-only content templates.

    This screenshot shows an example of the warning banner found in the **Workbooks** gallery.
    :::image type="content" source="media/sentinel-content-centralize/warning-banner-with-tool-link.png" alt-text="Screenshot showing orange warning banner with link to initiate central tool." lightbox="media/sentinel-content-centralize/warning-banner-with-tool-link.png"::: 

1. Select the link and read the page carefully.
1. Select **Continue** and review the list of content the tool generates.

    :::image type="content" source="media/sentinel-content-centralize/central-tool-reinstate-templates-resized.png" alt-text="Screenshot shows central tool page including details on how to use it." lightbox="media/sentinel-content-centralize/central-tool-reinstate-templates-resized.png" :::

1. Select **Complete Centralization** to start the installation. The selection is fixed and can't be changed.

    :::image type="content" source="media/sentinel-content-centralize/central-tool-select-all-content-resized.png" alt-text="Screenshot shows the list of content the tool generates.":::

## Data connector page change

All data connectors are now part of a solution. Previously, in order to promote dashboard visualizations (now called workbooks) and provide sample KQL queries, we included a few of these items on a **Next Steps** tab of the data connector page. We have deprecated the **Next Steps** portion of the data connector page in favor of the new *solution* content behavior where all the solution components are managed alongside the data connector. 

The key to experiencing the updated behavior is to start in **Content hub**. For a comparison of the previous behavior with the new experience, examine the **Azure Activity** data connector. After installing the solution from content hub and selecting **Manage**, the entire solution is available for inspection. If you want a visualization of the Azure Activity data connector, view the template for the workbook. If you want to see KQL queries, start with the data table. For advanced queries, look to the analytics rules and hunting queries.

For more information on the new solution content behavior, see [Discover and deploy OOTB content](sentinel-solutions-deploy.md#enable-content-items-in-a-solution).

If there was a particular sample query for a third party data connector you are looking for, we still publish them in our **All connectors** index. For example, here are the sample queries for the [Jamf Protect connector](data-connectors/jamf-protect.md).

## Microsoft Sentinel GitHub changes

Microsoft Sentinel has an official [GitHub repository](https://github.com/Azure/Azure-Sentinel) for community contributions vetted by Microsoft and the community. It's the source for most of the content items in the content hub.

For consistent discovery of this content, the OOTB content centralization changes have already been extended to the Microsoft Sentinel GitHub repo:

- All OOTB content packaged from content hub solutions is now stored in the GitHub repo's [Solutions folder](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions).
- All standalone OOTB content items will remain in their respective locations.
  
These changes to the content hub and the Microsoft Sentinel GitHub repo will complete the journey toward centralizing Microsoft Sentinel content.

## When is this change coming?

The centralization changes have been released! The Microsoft Sentinel GitHub changes have already happened. Standalone content is available in existing GitHub folders, and solution content has been moved to the *Solutions* folder.

The change to the **Next Steps** tab has already been completed. 

## Scope of change

This change is scoped to only the *gallery content* type of templates. All these same templates and more OOTB content are available in the content hub as solutions or standalone content.

For the Microsoft Sentinel GitHub repo, OOTB content packaged in solutions in the content hub is now listed only under the GitHub repo's [Solutions folder](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions). The other existing GitHub content is scoped to the following folders and contains only standalone content items. Content in the remaining GitHub folders not mentioned in this list doesn't have any changes.

- [DataConnectors folder](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors)
- [Detections folder](https://github.com/Azure/Azure-Sentinel/tree/master/Detections) (analytics rules)
- [Hunting Queries folder](https://github.com/Azure/Azure-Sentinel/tree/master/Hunting%20Queries)
- [Parsers folder](https://github.com/Azure/Azure-Sentinel/tree/master/Parsers)
- [Playbooks folder](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks)
- [Workbooks folder](https://github.com/Azure/Azure-Sentinel/tree/master/Workbooks)

### What's not changing?

This change does not affect active or custom items (created from templates or otherwise). Specifically, this change doesn't affect the following items:

- Data connectors with **Status** = **Connected**.
- Alert rules or detections (enabled or disabled) on the **Active rules** tab in the analytics gallery.
- Saved workbooks on the **My workbooks** tab in the workbooks gallery.
- Cloned content or **Content source** = **Custom** in the hunting gallery.
- Active playbooks (enabled or disabled) on the **Active playbooks** tab in the automation gallery.

This change also doesn't affect any OOTB content templates installed from the content hub (identifiable as **Content source** = **Content hub**).

### What's changing?

All template galleries now display an in-product warning banner. This banner contains a link to a tool that will run within the Microsoft Sentinel portal. Activating the tool starts a guided experience to reinstate the content templates for the **IN USE** retired templates from the content hub.

This tool needs to run only once per workspace, so be sure to plan with your organization. After the tool runs successfully, the warning banner will disappear from the template galleries of that workspace.

The following table lists specific impacts to the content templates for each of these galleries. Expect these changes now that the OOTB content centralization is live.

| Content type | Impact |
| ------- | ------- |
| [Data connectors](connect-data-sources.md) | Templates identifiable as **Content source** = **Gallery content** and **Status** = **Not connected** will no longer appear in the data connectors gallery. |
| [Analytics](detect-threats-built-in.md) | Templates identifiable as **Source name** = **Gallery content** will no longer appear in the analytics gallery. |
| [Hunting](hunting.md#use-built-in-queries) | Templates with **Content source** = **Gallery content** will no longer appear in the hunting gallery. |
| [Playbooks](use-playbook-templates.md#explore-playbook-templates) | Templates identifiable as **Source name** = **Gallery content** will no longer appear in the automation playbooks gallery. |
| [Workbooks](get-visibility.md) | Templates with **Content source** = **Gallery content** will no longer appear in the workbooks gallery. |

Here's an example of an analytics rule before and after the centralization changes and the tool has run:

- The active analytics rule won't change at all. It's based on an analytics rule template that will be retired.
  
  :::image type="content" source="media/sentinel-content-centralize/before-tool-analytic-rule-active-2.png" alt-text="Screenshot that shows an active analytics rule before centralization changes." lightbox="media/sentinel-content-centralize/before-tool-analytic-rule-active-2.png":::

  This screenshot shows an analytics rule template that will be retired.

  :::image type="content" source="media/sentinel-content-centralize/before-tool-analytic-rule-templates-2.png" alt-text="Screenshot that shows the analytics rule template that will be retired." lightbox="media/sentinel-content-centralize/before-tool-analytic-rule-templates-2.png":::

- After you run the tool to reinstate the analytics rule template, the source changes to the solution that it's reinstated from.

  :::image type="content" source="media/sentinel-content-centralize/after-tool-analytic-rule-template-2.png" alt-text="Screenshot that shows the analytics rule template after being reinstated from the content hub Microsoft Entra solution." lightbox="media/sentinel-content-centralize/after-tool-analytic-rule-template-2.png":::

## Action needed

- Install new OOTB content from the content hub and update solutions as needed to have the latest versions of templates.
- For existing gallery content templates in use, get future updates by installing the solutions or standalone content items from the content hub. The gallery content in the feature galleries might be out of date.
- If you have applications or processes that directly get OOTB content from the Microsoft Sentinel GitHub repository, update the locations to include getting OOTB content from the *Solutions* folder in addition to existing content folders.  
- Plan with your organization who will run the tool, and when, now that the warning banner and the changes are live. The tool needs to run once in a workspace to reinstate all **IN USE** retired templates from the content hub.
- Review the following FAQs to learn more details that might apply to your environment.

## Content centralization FAQs

### Will this change affect my SOC alert generation or incident generation and management?

No. There's no impact to active alert rules or detections, active playbooks, cloned hunting queries, or saved workbooks. The OOTB content centralization change won't affect your current incident generation and management processes.  

### Are there any exceptions for gallery content?

Yes. The following types of analytics rule templates are exempt from this change:  

- Anomalies rule templates
- Fusion rule templates
- ML Behavior Analytics (machine learning) rule templates
- Microsoft Security (incident creation) rule templates
- Threat Intelligence rule templates

### Will this change affect any of the APIs?

Yes. Currently, the only Microsoft Sentinel REST API calls that exist for content template management are the `Get` and `List` operations for alert rule templates. These operations only surface gallery content templates and won't be updated. For more information on these operations, see the current [Alert Rule Templates REST API reference](/rest/api/securityinsights/stable/alert-rule-templates).

New REST API operations on the content hub will be available soon to enable OOTB content management scenarios more broadly. This API update will include operations for the same content types scoped in the centralization changes (data connectors, playbook templates, workbook templates, analytics rule templates, hunting queries). A mechanism to update analytics rule templates installed on the workspace is also on the roadmap.

**Action needed:** Plan to update your applications and processes to use the new OOTB content management API operations on the content hub when those are available. Originally we expressed this would be available Q2 2023, but they are not ready yet.  

### How will the central tool identify my in-use OOTB content templates?

The tool builds a list of solutions based on two criteria: data connectors with **Status** = **Connected** and **IN USE** playbook templates. After the tool builds the proposed list of solutions, it will present the list for approval. If the list is approved, the tool installs all those solutions. Because the OOTB content is reinstated based on solutions, you might get more templates than you actually use.  

This central tool is a best effort to get your **IN USE** OOTB content templates reinstated from the content hub. You can install omitted OOTB content directly from the content hub.

### What if I'm using APIs to connect data sources in my Microsoft Sentinel workspace?
  
Currently, if an API data connection matches the data connector data type, it will appear as **Status** = **Connected** in the data connectors gallery. After the centralization changes go live, the specific data connector needs to be installed from a respective solution to get the same behavior.  

**Action needed:** Plan to update processes or tooling for your data connector deployments to install from content hub solutions before connecting with data ingestion APIs. The REST API operator for installing a solution will be coming in Q2 2023 with the OOTB content management APIs.

### What if I'm working with content by using the repositories feature in Microsoft Sentinel?

Repositories specifically deploy custom or active content in Microsoft Sentinel. The OOTB content centralization changes won't affect content that's deployed through the repositories feature.

### Does this affect deployment groups in workspace manager?

Just like Repositories, workspace manager deploys custom or active content only, so the OOTB content centralization changes won't affect content that's deployed through workspace manager either.

## Next steps

Take a look at these other resources for OOTB content and the content hub:

- [About Microsoft Sentinel content and solutions](sentinel-solutions.md)
- [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md)
- Video: [Using content hub to manage your SIEM content](https://www.youtube.com/watch?v=OtHs4dnR0yA&list=PL3ZTgFEc7LyvY90VTpKVFf70DXM7--47u&index=10)
