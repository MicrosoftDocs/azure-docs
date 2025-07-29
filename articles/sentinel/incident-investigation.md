---
title: Microsoft Sentinel incident investigation in the Azure portal
description: This article describes Microsoft Sentinel's incident investigation and case management capabilities and features in the Azure portal.
author: yelevin
ms.author: yelevin
ms.topic: concept-article
ms.date: 12/22/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
#Customer intent: As a security analyst, I want to understand how Microsoft Sentinel incidents in the Azure portal can help me efficiently manage and resolve security threats.
---

# Microsoft Sentinel incident investigation in the Azure portal

Microsoft Sentinel gives you a complete, full-featured case management platform for investigating and managing security incidents. **Incidents** are Microsoft Sentinel’s name for files that contain a complete and constantly updated chronology of a security threat, whether it’s individual pieces of evidence (alerts), suspects and parties of interest (entities), insights collected and curated by security experts and AI/machine learning models, or comments and logs of all the actions taken in the course of the investigation.

The incident investigation experience in Microsoft Sentinel begins with the **Incidents** page&mdash;an experience designed to give you everything you need for your investigation in one place. The key goal of this experience is to increase your SOC’s efficiency and effectiveness, reducing its mean time to resolve (MTTR).

This article describes Microsoft Sentinel's incident investigation and case management capabilities and features in the Azure portal, taking you through the phases of a typical incident investigation while presenting all the displays and tools available to you to help you along.

## Prerequisites

- The [**Microsoft Sentinel Responder**](../role-based-access-control/built-in-roles.md#microsoft-sentinel-responder) role assignment is required to investigate incidents.

    Learn more about [roles in Microsoft Sentinel](roles.md).

- If you have a guest user that needs to assign incidents, the user must be assigned the [Directory Reader](../active-directory/roles/permissions-reference.md#directory-readers) role in your Microsoft Entra tenant. Regular (nonguest) users have this role assigned by default.

## Increase your SOC's maturity

Microsoft Sentinel incidents give you tools to help your Security Operations (SecOps) maturity level up by standardizing your processes and auditing your incident management.

### Standardize your processes

**Incident tasks** are workflow lists of tasks for analysts to follow to ensure a uniform standard of care and to prevent crucial steps from being missed:

- **SOC managers and engineers** can develop these task lists and have them automatically apply to different groups of incidents as appropriate, or across the board. 
- **SOC analysts** can then access the assigned tasks within each incident, marking them off as they’re completed. 

    Analysts can also manually add tasks to their open incidents, either as self-reminders or for the benefit of other analysts who may collaborate on the incident (for example, due to a shift change or escalation).

For more information, see [Use tasks to manage incidents in Microsoft Sentinel in the Azure portal](incident-tasks.md).

### Audit your incident management

The incident **activity log** tracks actions taken on an incident, whether initiated by humans or automated processes, and displays them along with all the comments on the incident.

You can add your own comments here as well. For more information, see [Investigate Microsoft Sentinel incidents in depth in the Azure portal](investigate-incidents.md).

## Investigate effectively and efficiently

First things first: As an analyst, the most basic question you want to answer is, why is this incident being brought to my attention? Entering an incident’s details page will answer that question: right in the center of the screen, you’ll see the **Incident timeline** widget.

Use Microsoft Sentinel incidents to investigate security incidents effectively and efficiently using the incident timeline, learning from similar incidents, examining top insights, viewing entities, and exploring logs.

### Incident timelines

The incident timeline is the diary of all the **alerts** that represent all the logged events that are relevant to the investigation, in the order in which they happened. The timeline also shows **bookmarks**, snapshots of evidence collected while hunting and added to the incident. 

Search the list of alerts and bookmarks, or filter the list by severity, tactics, or content type (alert or bookmark), to help you find the item you want to pursue. The initial display of the timeline immediately tells you several important things about each item in it, whether alert or bookmark:

- The **date and time** of the creation of the alert or bookmark.
- The **type** of item, alert or bookmark, indicated by an icon and a ToolTip when hovering on the icon.
- The **name** of the alert or the bookmark, in bold type on the first line of the item.
- The **severity** of the alert, indicated by a color band along the left edge, and in word form at the beginning of the three-part "subtitle" of the alert.
- The **alert provider**, in the second part of the subtitle. For bookmarks, the **creator** of the bookmark.
- The MITRE ATT&CK **tactics** associated with the alert, indicated by icons and ToolTips, in the third part of the subtitle.

For more information, see [Reconstruct the timeline of the attack story](investigate-incidents.md#reconstruct-the-timeline-of-the-attack-story).

### Lists of similar incidents

If anything you’ve seen so far in your incident looks familiar, there may be good reason. Microsoft Sentinel stays one step ahead of you by showing you the incidents most similar to the open one. 

The **Similar incidents** widget shows you the most relevant information about incidents deemed to be similar, including their last updated date and time, last owner, last status (including, if they are closed, the reason they were closed), and the reason for the similarity.

This can benefit your investigation in several ways:

- Spot concurrent incidents that may be part of a larger attack strategy.
- Use similar incidents as reference points for your current investigation&mdash;see how they were dealt with.
- Identify owners of past similar incidents to benefit from their knowledge.

For example, you want to see if other incidents like this have happened before or are happening now.

- You might want to identify concurrent incidents that might be part of the same larger attack strategy.
- You might want to identify similar incidents in the past, to use them as reference points for your current investigation.
- You might want to identify the owners of past similar incidents, to find the people in your SOC who can provide more context, or to whom you can escalate the investigation.

The widget shows you the 20 most similar incidents. Microsoft Sentinel decides which incidents are similar based on common elements including entities, the source analytics rule, and alert details. From this widget you can jump directly to any of these incidents' full details pages, while keeping the connection to the current incident intact.

:::image type="content" source="media/investigate-incidents/similar-incidents.png" alt-text="Screenshot of the similar incidents display." lightbox="media/investigate-incidents/similar-incidents.png":::

Similarity is determined based on the following criteria:

| Criteria | Description |
| --- | --- |
| **Similar entities** | An incident is considered similar to another incident if they both include the same [entities](entities.md). The more entities two incidents have in common, the more similar they're considered to be. |
| **Similar rule** | An incident is considered similar to another incident if they were both created by the same [analytics rule](detect-threats-built-in.md). |
| **Similar alert details** | An incident is considered similar to another incident if they share the same title, product name, and/or [custom details(surface-custom-details-in-alerts.md). |

Incident similarity is calculated based on data from the 14 days prior to the last activity in the incident, that being the end time of the most recent alert in the incident. Incident similarity is also recalculated every time you enter the incident details page, so the results might vary between sessions if new incidents were created or updated.

For more information, see [Check for similar incidents in your environment](investigate-incidents.md#check-for-similar-incidents-in-your-environment).

### Top incident insights

Next, having the broad outlines of what happened (or is still happening), and having a better understanding of the context, you’ll be curious about what interesting information Microsoft Sentinel has already found out for you. 

Microsoft Sentinel automatically asks the big questions about the entities in your incident and shows the top answers in the **Top insights** widget, visible on the right side of the incident details page. This widget shows a collection of insights based on both machine-learning analysis and the curation of top teams of security experts.

These are a specially selected subset of the insights that appear on [entity pages](entity-pages.md#entity-insights), but in this context, insights for all the entities in the incident are presented together, giving you a more complete picture of what's happening. The full set of insights appears on the **Entities tab**, for each entity separately&mdash;see below.

The **Top insights** widget answers questions about the entity relating to its behavior in comparison to its peers and its own history, its presence on watchlists or in threat intelligence, or any other sort of unusual occurrence relating to it.

Most  of these insights contain links to more information. These links open the Logs panel in-context, where you'll see the source query for that insight along with its results.

### List of related entities

Now that you have some context and some basic questions answered, you’ll want to get some more depth on the major players are in this story.

Usernames, hostnames, IP addresses, file names, and other types of entities can all be “persons of interest” in your investigation. Microsoft Sentinel finds them all for you and displays them front and center in the **Entities** widget, alongside the timeline. 

Select an entity from this widget to pivot you to that entity's listing in the **Entities tab** on the same **incident page**, which contains a list of all the entities in the incident. 

Select an entity in the list to open a side panel with information based on the [entity page](entity-pages.md), including the following details:

- **Info** contains basic information about the entity. For a user account entity this might be things like the username, domain name, security identifier (SID), organizational information, security information, and more.

- **Timeline** contains a list of the alerts that feature this entity and activities the entity has done, as collected from logs in which the entity appears.

- **Insights** contains answers to questions about the entity relating to its behavior in comparison to its peers and its own history, its presence on watchlists or in threat intelligence, or any other sort of unusual occurrence relating to it.

    These answers are the results of queries defined by Microsoft security researchers that provide valuable and contextual security information on entities, based on data from a collection of sources.

Depending on the entity type, you can take a number of further actions from this side panel, including:

- **Pivot to the entity's full [entity page](entity-pages.md)** to get even more details over a longer timespan or launch the graphical investigation tool centered on that entity.

- **Run a [playbook](respond-threats-during-investigation.md)** to take specific response or remediation actions on the entity (in Preview).

- **Classify the entity as an [indicator of compromise (IOC)](add-entity-to-threat-intelligence.md)** and add it to your Threat intelligence list.

<a name=supported-actions></a>Each of these actions is currently supported for certain entity types and not for others. The following table shows which actions are supported for each entity type:

| Available actions &#9654;<br>Entity types &#9660;  | View full details<br>(in entity page) | Add to TI * | Run playbook *<br>(Preview) |
| ----- | :----: | :----: | :----: |
| **User account** | &#10004; | | &#10004; |
| **Host** | &#10004; | | &#10004; |
| **IP address** | &#10004; | &#10004; | &#10004; |
| **URL** | | &#10004; | &#10004; |
| **Domain name** | | &#10004; | &#10004; | 
| **File (hash)** | | &#10004; | &#10004; |
| **Azure resource** | &#10004; | | | 
| **IoT device** | &#10004; | | |

\* For entities for which the **Add to TI** or **Run playbook** actions are available, you can take those actions right from the **Entities** widget in the **Overview tab**, never leaving the incident page.

### Incident logs

Explore incident logs to get down into the details to know *what exactly happened?* 

From almost any area in the incident, you can drill down into the individual alerts, entities, insights, and other items contained in the incident, viewing the original query and its results. 

These results are displayed in the Logs (log analytics) screen that appears here as a panel extension of the incident details page, so you don’t leave the context of the investigation.

## Organized records with incidents

In the interests of transparency, accountability, and continuity, you’ll want a record of all the actions that have been taken on the incident&mdash;whether by automated processes or by people. The incident **activity log** shows you all of these activities. You can also see any comments that have been made and add your own.

The activity log is constantly auto-refreshing, even while open, so you can see changes to it in real time.

## Related content

In this document, you learned how the Microsoft Sentinel incident investigation experience in the Azure portal helps you [carry out an investigation in a single context](investigate-incidents.md). For more information about managing and investigating incidents, see the following articles:

- [Investigate entities with entity pages in Microsoft Sentinel](entity-pages.md).
- [Use tasks to manage incidents in Microsoft Sentinel](incident-tasks.md)
- [Automate incident handling in Microsoft Sentinel with automation rules](automate-incident-handling-with-automation-rules.md).
- [Identify advanced threats with User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel](identify-threats-with-entity-behavior-analytics.md)
- [Hunt for security threats](./hunting.md).

## Next step

[Navigate, triage, and manage Microsoft Sentinel incidents in the Azure portal](incident-navigate-triage.md)
