---
title: Organize threat hunting
titleSuffix: Microsoft Sentinel
description: Learn how to organize your threat hunting. Seek out undetected threats based on hypothesis or start broadly and refine your searches with this end to end hunting experience.
author: austinmccollum
ms.author: austinmc
ms.topic: how-to
ms.date: 04/17/2023
---

# Organize proactive threat detection with Hunts in Microsoft Sentinel

Proactive threat hunting is a process by which security analysts seek out undetected threats and malicious behaviors by creating a hypothesis, searching through data, validating that hypothesis, and acting when applicable. Actions can include creating new detections, threat intelligence, or incidents.

Learn how to use the Hunts feature, which is our first step to providing an end to end hunting experience within Microsoft Sentinel.

Common Use-Cases:
- Proactively hunt based on specific MITRE techniques, potentially malicious activity, recent threats, or your own customer defined hypothesis.
- Use security-researcher-generated hunting queries, custom hunting queries, or bookmarks.
- Conduct your hunts using multiple persisted-query tabs that enable you to keep context over time.
- Collect evidence, investigate entities, and annotate your findings using hunt specific bookmarks.
- Collaborate and document your findings with comments.
- Act on results by creating new analytic rules, new incidents, new threat indicators, and running playbooks.
- Keep track of your new, active, and closed hunts in one place.
- View metrics based on tangible results.

## Prerequisites
The [Microsoft Sentinel Contributor role assignment](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-contributor) is required. To learn more about roles in Microsoft Sentinel, see [Roles and permissions in Microsoft Sentinel](roles.md).

## Define your hypothesis
The first step to hunting is to decide which direction to go in. Use this idea to define a hypothesis. The most common sources of hunting hypotheses are:

- Malicious behavior - this type of hunt is looking to find any and all sorts of malicious activity.
- New threat campaign - here we're looking for a specific type of attack or vulnerability.
- MITRE detection gaps - with the ATT&CK map in mind, this directed hunt gives us tools to bolster our defense in a specific area.

Microsoft Sentinel gives you flexibility as you zero in on the right set of hunting queries to investigate your hypothesis. But when you create the hunt, you can initiate it with pre-selected hunting queries, or you can add queries as you progress. Here are some pre-selected queries based on the most common hypothesis.

### Hypothesis - malicious behavior
1. Navigate to the Hunting page **Queries** tab. With a well established base of queries installed, running all your queries is the recommended method for identifying potentially malicious behaviors. 

1. Select **Run All queries** > wait for the queries to execute. This may take awhile. 
1. Select **Add filter** > **Results** > unselect the checkboxes "!", "N/A", "-", and "0" values > **Apply**
    :::image type="content" source="media/organize-hunts/all-queries-with-results.png" alt-text="Screenshot shows the filter described in step 3.":::

1. Select all the remaining queries - these results will guide us on the hunt.


### Hypothesis - new threat campaign
Content hub offers threat campaign and domain-based solutions to hunt for specific attacks. 

1. For example, install the "Log4J Vulnerability Detection" or the "Apache Tomcat" solutions from Microsoft. 
    :::image type="content" source="media/organize-hunts/content-hub-solutions.png" alt-text="Screenshot shows the content hub in grid view with the Log4J and Apache solutions selected.":::
1. Once installed search for queries from these solutions in the Hunting **Queries** tab. Search by solution name, or filtering by **Source Name** of the solution.


### Hypothesis - MITRE detection gaps
The MITRE ATT&CK map helps you identify specific gaps in your detection coverage. Hunting queries are good starting points to develop new detection analytics for specific tactics and techniques.
1. Navigate to the MITRE page.
1. Unselect items in the Active drop down.
1. Select **hunting queries** in the Simulated filter.
    :::image type="content" source="media/organize-hunts/mitre-hunting-queries.png" alt-text="Screenshot shows the MITRE ATT&CK page with the option for simulated Hunting queries selected."::: 

1. Select the card with your desired technique.
1. Click the **View** link next to the Hunting queries item at the bottom of the right-hand details pane to see just these queries in a filtered view of Hunting **Queries** tab.
    :::image type="content" source="media/organize-hunts/mitre-card-view.png" alt-text="Screenshot shows the MITRE ATT&CK card view with the Hunting queries view link.":::

## Create a Hunt
There are two ways to create a hunt.

- If you've started with a hypothesis where you've selected queries, select the **Hunt actions** drop down menu > **Create new hunt**. This creates a new hunt with clones of the queries related to the hunt you selected.
:::image type="content" source="media/organize-hunts/create-new-hunt.png" alt-text="Screenshot shows queries selected and the create new hunt menu option selected.":::

- If you haven't decided on queries yet, select the **Hunts (Preview)** tab > **New Hunt** to create a blank hunt.
:::image type="content" source="media/organize-hunts/create-blank-hunt.png" alt-text="Screenshot shows the menu to create a blank hunt with no pre-selected queries.":::

- Fill out the hunt name and additional optional fields. The description is a good place to verbalize your hypothesis. The **Hypothesis** pull down menu is where you set the status of your working hypothesis. Select **Create** to get started.
:::image type="content" source="media/organize-hunts/create-hunt-description.png" alt-text="Screenshot shows the hunt creation page with Hunt name, description, owner, status and hypothesis state.":::

### Deploy Demo Hunt via ARM template (if needed)
If you don’t have any hunting queries that produce results in your environment, and don’t want to create an empty hunt, you can deploy a "Demo Hunt".

To deploy the ARM template, navigate to the this [DemoHunt GitHub folder](https://aka.ms/DemoHuntARMTemplatePreview). Select the **Deploy to Azure** button, and fill out the appropriate fields.
 
Be sure to type in the name of your desired Log Analytics workspace. Without this step, the ARM template can't be deployed, even though the validate step indicates success. 

The demo hunt contains a sample hunting query, "Hunts Demo Query". This query generates mock data in a dynamic table based on the current time. You can use this to try out the other features of Hunts!

## View Hunt details
1. Select the **Hunts (Preview)** tab to view your new hunt.
1. Select the hunt link by name to view the details.
    :::image type="content" source="{source}" alt-text="{alt-text}":::

Each hunt has a details page listing its contents. On the left you can see the details pane with the Hunt name, description, content, creation time, and last updated time. The hunt details page contains tabs for Queries, Bookmarks, and Entities.
:::image type="content" source="{source}" alt-text="{alt-text}":::
 
1. Queries tab
This tab contains hunting queries specific to this hunt. These queries are independent from all other queries and can be updated or deleted without impacting the overall set of hunting queries or queries in other hunts. This tab enables you to select and run queries and add new queries. You can also right-click on a hunting query to Run, Edit, Clone, Delete, or Create an analytics rule from a query. This behaves just like the existing Queries table in the Hunting page, except that actions only apply within the hunt. 

When you choose to create an analytics rule, the name, description and KQL query is pre-populated in the Analytics rule wizard. When you finish creating the rule, a link is created to view the new analytics rule on the Analytics page. 

1. View results in Log analytics
To view the results of a desired hunting query, select the query and click “View results” at the bottom of the of the query details pane on the right. This will pivot to a special version of the Log Analytics Search page.

1. Persisted query tabs in Log Analytics
All the Query tabs created in a browser session are persisted for that browser session. This way you can pivot to another part of the Microsoft Sentinel Portal, then pivot back to the LA log search user experience from an entry point within the hunt user experience. All the previously created LA Query tabs will still be there.

> [!IMPORTANT]
> These LA Query tabs are lost if you close the browser tab. If you want to persist the queries long term, you need to save the query, create a new hunting query, or copy it into a comment (see below) for later use within the hunt.
>

## Add bookmarks
When you find one or more interesting results/rows, you can add the results to the hunt by creating one or more bookmarks. 

1. Select the desired row or rows. Select the Add bookmark action, right above the Results table.
    :::image type="content" source="{source}" alt-text="{alt-text}":::

1. You can optionally name the bookmark(s), set the event time column, map entity identifiers, set MITRE tactics and techniques, add tags, and add notes. Additionally, the bookmarks will preserve the specific row results, KQL query, and time range that generated the result. For more information, see [Hunt with bookmarks](bookmarks.md).
1. Select **Create and assign to current hunt** to add the bookmark to the hunt.
    :::image type="content" source="{source}" alt-text="{alt-text}":::

## View bookmarks
Navigate to your hunt’s bookmark tab to view your bookmarks with previously-created details.
:::image type="content" source="{source}" alt-text="{alt-text}":::

From here you can select a desired bookmark and perform the following actions:
- Select entity links to view the corresponding UEBA entity page.
- View raw results, tags, and notes.
- Select **View source query** to see the source query in Log Analytics.
- Select **View bookmark logs** to see the bookmark contents in the Log Analytics hunting bookmark table.
- Select **Investigate** button to view the bookmark and related entities in the investigation graph. 
- Select the **Edit** button to update the tags, MITRE tactics and techniques, and notes.

## Create incidents
There are two choices for creating incidents. 

Option 1: Use bookmarks.
- Select a bookmark or bookmarks.
- Select the “Incident actions” button.
- Select “Create new incident” or “Add to existing incident”
:::image type="content" source="{source}" alt-text="{alt-text}":::

- For **Create new incident**, follow the guided steps. The bookmarks tab is pre-populated with your selected bookmarks. 
- For **Add to existing incident**, select the incident and select the **Accept** button.

Option 2: Use **Hunt actions**.
- Select the **Hunts actions** menu > **Create incident**, and follow the guided steps.
:::image type="content" source="{source}" alt-text="{alt-text}":::

During the **Add bookmarks** step use the **Add bookmark** action to choose additional bookmarks from the hunt to add to the incident. You are limited to bookmarks that haven't already been assigned to an incident.
:::image type="content" source="{source}" alt-text="{alt-text}":::

## Interact with entities
Navigate to your hunt's Entities tab to view, search, and filter the entities contained in your hunt. This list is generated from the list of entities in the bookmarks. The Entities tab automatically resolves duplicated entries. You can click on entity names to visit the corresponding UEBA entity page. You can also right-click on the entity to take actions appropriate to the entity types, such as adding an IP address to TI or running an entity type specific playbook.
:::image type="content" source="{source}" alt-text="{alt-text}":::

## Add comments
Comments are an excellent place to collaborate with colleagues, preserve notes, and document findings. To create, edit, and delete comments, click the comment icon in the upper right of the hunt details.
:::image type="content" source="{source}" alt-text="{alt-text}":::

Type and format your comment in the editing box. You can include URLs and they will be resolved into hyperlinks. 
Choose the **Comment** button to apply your comments. 
:::image type="content" source="{source}" alt-text="{alt-text}":::

## Update status
When you have captured enough evidence to validate or invalidate your hypothesis, update your hypothesis status in the left-hand pane in the **Hypothesis** drop down menu in the hunt's details.
:::image type="content" source="{source}" alt-text="{alt-text}":::

When you have finished all actions associated with the hunt, such as creating analytics rules, incidents, or adding indicators of compromise (IOCs) to TI, you can show the hunt as closed by updating the status drop down next to the hypothesis drop down.
:::image type="content" source="{source}" alt-text="{alt-text}":::

These status updates are visible on the main Hunting page and are used to [track metrics](#track-metrics).

## Track metrics
On the hunting page you can track tangible results from hunting activity using the metrics bar for the hunts tab near the top of the page. This will show the number of validated hypotheses, new incidents created, and new analytic rules created. This information makes it easy to see the total results across all the hunts. 
:::image type="content" source="{source}" alt-text="{alt-text}":::


## Next steps

