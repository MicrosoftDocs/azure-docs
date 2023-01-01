---
title: Investigate incidents comprehensively in Microsoft Sentinel
description: 
author: yelevin
ms.author: yelevin
ms.topic: conceptual
ms.date: 01/01/2023
---

# Investigate incidents comprehensively in Microsoft Sentinel

Microsoft Sentinel gives you a complete, full-featured case management platform for investigating security incidents. **Incidents** are Microsoft Sentinel’s name for case files that contain a complete and constantly updated chronology of a security threat, whether it’s individual pieces of evidence (alerts), suspects and parties of interest (entities), insights collected and curated by security experts and AI/machine learning models, or comments and logs of all the actions taken in the course of the investigation.

The incident investigation experience in Microsoft Sentinel begins with the **Incidents** page – a new experience designed to give you everything you need for your investigation in one place. The key goal of this new experience is to increase your SOC’s efficiency and effectiveness, reducing its mean time to resolve (MTTR).

This article takes you through the phases of a typical incident investigation, presenting all the displays and tools available to you to help you along.

## Increase your SOC's maturity

Microsoft Sentinel gives you the tools to help your Security Operations (SecOps) maturity level up.

### Standardize processes

**Incident tasks** are workflow lists of tasks for analysts to follow to ensure a uniform standard of care and to prevent crucial steps from being missed. SOC managers and engineers can develop these task lists and have them automatically apply to different groups of incidents as appropriate, or across the board. SOC analysts can then access the assigned tasks within each incident, marking them off as they’re completed. Analysts can also manually add their own tasks to their open incidents, either as self-reminders or for the benefit of other analysts who may collaborate on the incident.

Learn more about [incident tasks](incident-tasks.md).

### Audit incident management

The incident **activity log** tracks all the actions taken on an incident, whether initiated by humans or automated processes, and displays them along with all the comments on the incident. You can add your own comments here as well. It gives you a complete record of everything that happened, ensuring thoroughness and accountability.

## Investigate effectively and efficiently

### See timeline

First things first: The most basic question you want to answer is, why is this incident being brought to my attention? Entering an incident’s details page will answer that question: right in the center of the screen, you’ll see the incident’s Timeline panel. The timeline is the diary of all the alerts that represent all the logged events that are relevant to the investigation, in the order in which they happened. See the full details of any item on this list by selecting it. Many of these details appear as links that you can select to dive still deeper and learn more.

### View entities

You’ll also want to see who the major players are in this story. Usernames, hostnames, IP addresses, file names, and other types of entities can all be “persons of interest” in your investigation. Microsoft Sentinel finds them all for you and displays them front and center, alongside the timeline. Selecting an entity from this panel will pivot you to the Entities tab where you will see that entity highlighted in the list, and its entity information, timeline, and insights (what would appear on its entity page) condensed into three tabs in a side panel. From there you can launch the graphical investigation tool centered on that entity, or run a playbook on it.

### Examine top insights

Next, having the broad outlines of what happened (or is still happening), and knowing who and what is involved, you’ll be curious about what interesting information can be learned but might be difficult to find out. Microsoft Sentinel automatically surfaces the most important information in your incident in the Top insights panel, visible on the right side of the incident details page. This panel shows a collection of results based on both machine-learning analysis and the curation of top teams of security experts.

### Learn from experience

If anything you’ve seen so far in your incident looks familiar, there may be good reason. Microsoft Sentinel stays one step ahead of you by showing you the incidents most similar to the open one. The Similar incidents panel shows you the 20 most similar incidents, based on common elements including entities, the source analytics rule, and alert details. From this panel you can jump directly to any of these incidents

### Explore logs

Now you’ll want to get down into the details to know what exactly happened? You can drill down into the individual alerts contained in the incident, viewing the original query results. These results are displayed in the Logs (log analytics) screen that appears here as a panel extension of the incident details page, so you don’t leave the context of the investigation. 

### See what’s been done

Finally, you’ll want a record of all the actions that have been taken on the incident – whether by automated processes or by people. The incident activity log shows you all of these activities. You can also see any comments that have been made and add your own.

## Take actions to remediate threats

No less important than being able to carry out all of your investigative activity from a single interface is the ability to act quickly to remediate threats while remaining in the investigation context. From each of the areas described above, you can take direct actions to stop attackers before they do (more) damage.

## Next steps

In this document, you learned how the incident investigation experience in Microsoft Sentinel helps you [carry out an investigation in a single context](investigate-incidents.md). For more information about managing and investigating incidents, see the following articles:

- [Use tasks to manage incidents in Microsoft Sentinel](incident-tasks.md)
- [Investigate entities with entity pages in Microsoft Sentinel](entity-pages.md).
- [Automate incident handling in Microsoft Sentinel with automation rules](automate-incident-handling-with-automation-rules.md).
- [Identify advanced threats with User and Entity Behavior Analytics (UEBA) in Microsoft Sentinel](identify-threats-with-entity-behavior-analytics.md)
- [Hunt for security threats](./hunting.md).
