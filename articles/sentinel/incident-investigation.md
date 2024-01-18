---
title: Understand Microsoft Sentinel's incident investigation and case management capabilities
description: This article describes Microsoft Sentinel's incident investigation and case management capabilities and features, taking you through the phases of a typical incident investigation while presenting all the displays and tools available to you to help you along.
author: yelevin
ms.author: yelevin
ms.topic: conceptual
ms.date: 01/01/2023
---

# Understand Microsoft Sentinel's incident investigation and case management capabilities

Microsoft Sentinel gives you a complete, full-featured case management platform for investigating and managing security incidents. **Incidents** are Microsoft Sentinel’s name for case files that contain a complete and constantly updated chronology of a security threat, whether it’s individual pieces of evidence (alerts), suspects and parties of interest (entities), insights collected and curated by security experts and AI/machine learning models, or comments and logs of all the actions taken in the course of the investigation.

The incident investigation experience in Microsoft Sentinel begins with the **Incidents** page&mdash;a new experience designed to give you everything you need for your investigation in one place. The key goal of this new experience is to increase your SOC’s efficiency and effectiveness, reducing its mean time to resolve (MTTR).

This article takes you through the phases of a typical incident investigation, presenting all the displays and tools available to you to help you along.

## Increase your SOC's maturity

Microsoft Sentinel gives you the tools to help your Security Operations (SecOps) maturity level up.

### Standardize processes

**Incident tasks** are workflow lists of tasks for analysts to follow to ensure a uniform standard of care and to prevent crucial steps from being missed. SOC managers and engineers can develop these task lists and have them automatically apply to different groups of incidents as appropriate, or across the board. SOC analysts can then access the assigned tasks within each incident, marking them off as they’re completed. Analysts can also manually add tasks to their open incidents, either as self-reminders or for the benefit of other analysts who may collaborate on the incident (for example, due to a shift change or escalation).

Learn more about [incident tasks](incident-tasks.md).

### Audit incident management

The incident **activity log** tracks actions taken on an incident, whether initiated by humans or automated processes, and displays them along with all the comments on the incident. You can add your own comments here as well. It gives you a complete record of everything that happened, ensuring thoroughness and accountability.

## Investigate effectively and efficiently

### See timeline

First things first: As an analyst, the most basic question you want to answer is, why is this incident being brought to my attention? Entering an incident’s details page will answer that question: right in the center of the screen, you’ll see the **Incident timeline** widget. The timeline is the diary of all the **alerts** that represent all the logged events that are relevant to the investigation, in the order in which they happened. The timeline also shows **bookmarks**, snapshots of evidence collected while hunting and added to the incident. See the full details of any item on this list by selecting it. Many of these details&mdash;such as the original alert, the analytics rule that created it, and any bookmarks&mdash;appear as links that you can select to dive still deeper and learn more.

Learn more about what you can do from the [incident timeline](investigate-incidents.md#incident-timeline).

### Learn from similar incidents

If anything you’ve seen so far in your incident looks familiar, there may be good reason. Microsoft Sentinel stays one step ahead of you by showing you the incidents most similar to the open one. The **Similar incidents** widget shows you the most relevant information about incidents deemed to be similar, including their last updated date and time, last owner, last status (including, if they are closed, the reason they were closed), and the reason for the similarity.

This can benefit your investigation in several ways:

- Spot concurrent incidents that may be part of a larger attack strategy.
- Use similar incidents as reference points for your current investigation&mdash;see how they were dealt with.
- Identify owners of past similar incidents to benefit from their knowledge.

The widget shows you the 20 most similar incidents. Microsoft Sentinel decides which incidents are similar based on common elements including entities, the source analytics rule, and alert details. From this widget you can jump directly to any of these incidents' full details pages, while keeping the connection to the current incident intact.

Learn more about what you can do with [similar incidents](investigate-incidents.md#similar-incidents).

### Examine top insights

Next, having the broad outlines of what happened (or is still happening), and having a better understanding of the context, you’ll be curious about what interesting information Microsoft Sentinel has already found out for you. It automatically asks the big questions about the entities in your incident and shows the top answers in the **Top insights** widget, visible on the right side of the incident details page. This widget shows a collection of insights based on both machine-learning analysis and the curation of top teams of security experts.

These are a specially selected subset of the insights that appear on [entity pages](entity-pages.md#entity-insights), but in this context, insights for all the entities in the incident are presented together, giving you a more complete picture of what's happening. The full set of insights appears on the **Entities tab**, for each entity separately&mdash;see below.

The **Top insights** widget answers questions about the entity relating to its behavior in comparison to its peers and its own history, its presence on watchlists or in threat intelligence, or any other sort of unusual occurrence relating to it.

Most of these insights contain links to more information. These links open the Logs panel in-context, where you'll see the source query for that insight along with its results. 

### View entities

Now that you have some context and some basic questions answered, you’ll want to get some more depth on the major players are in this story. Usernames, hostnames, IP addresses, file names, and other types of entities can all be “persons of interest” in your investigation. Microsoft Sentinel finds them all for you and displays them front and center in the **Entities** widget, alongside the timeline. Selecting an entity from this widget will pivot you to that entity's listing in the **Entities tab** on the same **incident page**.

The **Entities tab** contains a list of all the entities in the incident. When an entity in the list is selected, a side panel opens containing a display based on the [entity page](entity-pages.md). The side panel contains three cards:
- **Info** contains basic information about the entity. For a user account entity this might be things like the username, domain name, security identifier (SID), organizational information, security information, and more.
- **Timeline** contains a list of the alerts that feature this entity and activities the entity has done, as collected from logs in which the entity appears.
- **Insights** contains answers to questions about the entity relating to its behavior in comparison to its peers and its own history, its presence on watchlists or in threat intelligence, or any other sort of unusual occurrence relating to it. These answers are the results of queries defined by Microsoft security researchers that provide valuable and contextual security information on entities, based on data from a collection of sources.

    As of November 2023, the **Insights** panel includes the next generation of insights, available in **PREVIEW**, in the form of [enrichment widgets](whats-new.md#visualize-data-with-enrichment-widgets-preview), alongside the existing insights. To take advantage of these new widgets, you must [enable the widget experience](enable-enrichment-widgets.md).

Depending on the entity type, you can take a number of further actions from this side panel:
- Pivot to the entity's full [entity page](entity-pages.md) to get even more details over a longer timespan or launch the graphical investigation tool centered on that entity.
- Run a [playbook](respond-threats-during-investigation.md) to take specific response or remediation actions on the entity (in Preview).
- Classify the entity as an [indicator of compromise (IOC)](add-entity-to-threat-intelligence.md) and add it to your Threat intelligence list.

Each of these actions is currently supported for certain entity types and not for others. The following table shows which actions are supported for which entity types:

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

### Explore logs

Now you’ll want to get down into the details to know *what exactly happened?* From almost any of the places mentioned above, you can drill down into the individual alerts, entities, insights, and other items contained in the incident, viewing the original query and its results. These results are displayed in the Logs (log analytics) screen that appears here as a panel extension of the incident details page, so you don’t leave the context of the investigation. 

### Keep your records in order

Finally, in the interests of transparency, accountability, and continuity, you’ll want a record of all the actions that have been taken on the incident – whether by automated processes or by people. The incident **activity log** shows you all of these activities. You can also see any comments that have been made and add your own. The activity log is constantly auto-refreshing, even while open, so you can see changes to it in real time.


## Next steps

In this document, you learned how the incident investigation experience in Microsoft Sentinel helps you [carry out an investigation in a single context](investigate-incidents.md). For more information about managing and investigating incidents, see the following articles:

- [Use tasks to manage incidents in Microsoft Sentinel](incident-tasks.md)
- [Investigate entities with entity pages in Microsoft Sentinel](entity-pages.md).
- [Automate incident handling in Microsoft Sentinel with automation rules](automate-incident-handling-with-automation-rules.md).
- [Identify advanced threats with User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel](identify-threats-with-entity-behavior-analytics.md)
- [Hunt for security threats](./hunting.md).
