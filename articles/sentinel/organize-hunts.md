---
title: Organize threat hunting
titleSuffix: Microsoft Sentinel
description: Learn how to organize your threat hunting. Seek out undetected threats based on hypothesis or start broadly and refine your searches with this end to end hunting experience.
author: austinmccollum
ms.author: austinmc
ms.topic: how-to
ms.date: 04/24/2023
---

# Organize threat detection with proactive hunts in Microsoft Sentinel

Proactive threat hunting is a process where security analysts seek out undetected threats and malicious behaviors. By creating a hypothesis, searching through data, and validating that hypothesis, they determine what to act on. Actions can include creating new detections, new threat intelligence, or spinning up a new incident.

Learn how to use the **Hunts** feature, which is our first step to providing an end to end hunting experience within Microsoft Sentinel.

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
The first step to hunting is to decide which direction to go in. Use this idea to define your hypothesis. The most common hypotheses are:

- Malicious behavior - this type of hunt is looking to find all sorts of malicious activity.
- New threat campaign - here you're looking for a specific type of attack or vulnerability.
- MITRE detection gaps - with the ATT&CK map in mind, this directed hunt gives you tools to bolster your defenses in a specific area.

Microsoft Sentinel gives you flexibility as you zero in on the right set of hunting queries to investigate your hypothesis. When you create a hunt, initiate it with preselected hunting queries, or add queries as you progress. Here are recommendations for preselected queries based on the most common hypotheses.

### Hypothesis - malicious behavior
1. Navigate to the Hunting page **Queries** tab. With a well established base of queries installed, running all your queries is the recommended method for identifying potentially malicious behaviors. 

1. Select **Run All queries** > wait for the queries to execute. This process may take a while. 
1. Select **Add filter** > **Results** > unselect the checkboxes "!", "N/A", "-", and "0" values > **Apply**
    :::image type="content" source="media/organize-hunts/all-queries-with-results.png" alt-text="Screenshot shows the filter described in step 3." lightbox="media/organize-hunts/all-queries-with-results.png":::

1. Select all the remaining queries - these results provide initial guidance on the hunt.


### Hypothesis - new threat campaign
Content hub offers threat campaign and domain-based solutions to hunt for specific attacks. 

1. For example, install the "Log4J Vulnerability Detection" or the "Apache Tomcat" solutions from Microsoft. 
    :::image type="content" source="media/organize-hunts/content-hub-solutions.png" alt-text="Screenshot shows the content hub in grid view with the Log4J and Apache solutions selected.":::
1. Once installed search for queries from these solutions in the Hunting **Queries** tab. Search by solution name, or filtering by **Source Name** of the solution.


### Hypothesis - MITRE detection gaps
The MITRE ATT&CK map helps you identify specific gaps in your detection coverage. Hunting queries are good starting points to develop new detection analytics for specific tactics and techniques.
1. Navigate to the MITRE page.
1. Unselect items in the Active drop down menu.
1. Select **Hunting queries** in the **Simulated** filter.

    :::image type="content" source="media/organize-hunts/mitre-hunting-queries.png" alt-text="Screenshot shows the MITRE ATT&CK page with the option for simulated Hunting queries selected." lightbox="media/organize-hunts/mitre-hunting-queries.png"::: 

1. Select the card with your desired technique.
1. Select the **View** link next to **Hunting queries** at the bottom of the details pane. This link filters the **Queries** tab on the **Hunting** page based on the technique you selected. 

    :::image type="content" source="media/organize-hunts/mitre-card-view.png" alt-text="Screenshot shows the MITRE ATT&CK card view with the Hunting queries view link.":::

1. Select all the queries for that technique.

## Create a Hunt
There are two ways to create a hunt.

1. If you've started with a hypothesis where you've selected queries, select the **Hunt actions** drop down menu > **Create new hunt**. All the queries you selected are cloned for this new hunt.

    :::image type="content" source="media/organize-hunts/create-new-hunt.png" alt-text="Screenshot shows queries selected and the create new hunt menu option selected.":::

1. If you haven't decided on queries yet, select the **Hunts (Preview)** tab > **New Hunt** to create a blank hunt.

    :::image type="content" source="media/organize-hunts/create-blank-hunt.png" alt-text="Screenshot shows the menu to create a blank hunt with no preselected queries.":::

1. Fill out the hunt name and optional fields. The description is a good place to verbalize your hypothesis. The **Hypothesis** pull down menu is where you set the status of your working hypothesis. 

1. Select **Create** to get started.

    :::image type="content" source="media/organize-hunts/create-hunt-description.png" alt-text="Screenshot shows the hunt creation page with Hunt name, description, owner, status and hypothesis state.":::

### Deploy Demo Hunt via ARM template (if needed)
If you don't have any hunting queries that produce results in your environment, and you don't want to create an empty hunt, deploy the "Demo Hunt".

1. Navigate to the [DemoHunt GitHub folder](https://aka.ms/DemoHuntARMTemplatePreview). 
1. Select the ****Deploy to Azure** button, and fill out the appropriate fields. 
1. Be sure to type in the name of your desired Log Analytics workspace. Without this step, the ARM template can't be deployed, even though the validate step indicates success. 

The demo hunt contains a sample hunting query, "Hunts Demo Query". This query generates mock data in a dynamic table based on the current time. Now you're able to demo the other features of hunts!

## View hunt details
1. Select the **Hunts (Preview)** tab to view your new hunt.
1. Select the hunt link by name to view the details and take actions.

    :::image type="content" source="media/organize-hunts/view-hunt.png" alt-text="Screenshot showing new hunt in Hunting tab." lightbox="media/organize-hunts/view-hunt.png":::

1. View the details pane with the **Hunt name**, **Description**, **Content**, **Last update time**, and **Creation time**. 
1. Note the tabs for **Queries**, **Bookmarks**, and **Entities**.

    :::image type="content" source="media/organize-hunts/view-hunt-details.png" alt-text="Screenshot showing the hunt details." lightbox="media/organize-hunts/view-hunt-details.png":::
 
### Queries tab
The **Queries** tab contains hunting queries specific to this hunt. These queries are independent from all others in the workspace and can be updated or deleted without impacting your overall set of hunting queries or queries in other hunts. 

1. Select a query.
1. Right-click the query and select one of the following from the context menu:
    - **Run**
    - **Edit**
    - **Clone** 
    - **Delete**
    - **Create analytics rule**

    :::image type="content" source="media/organize-hunts/queries-tab.png" alt-text="Screenshot shows right-click context menu options in the Queries tab of a hunt.":::

    These options behave just like the existing queries table in the **Hunting** page, except the actions only apply within this hunt. When you choose to create an analytics rule, the name, description, and KQL query is prepopulated in the new rule creation. A link is created to view the new analytics rule found under **Related analytics rules**.

    :::image type="content" source="media/organize-hunts/analytics-rule-from-query-tab.png" alt-text="Screenshot showing hunt details with related analytics rule."::: 

1. Select the **View results** button. 

    A special version of the Log Analytics (LA) search page launches. All the query tabs in this special LA space persist for your browser session. If you pivot to another part of the Microsoft Sentinel portal, then browse back to the LA log search experience from the hunt page, all your LA query tabs remain.

    > [!TIP]
    > These LA query tabs are lost if you close the browser tab. If you want to persist the queries long term, you need to save the query, create a new hunting query, or [copy it into a comment](#add-comments) for later use within the hunt.
    >

## Add a bookmark
When you find interesting results or important rows of data, add those results to the hunt by creating a bookmark. 

1. Select the desired row or rows. Select the Add bookmark action, right above the Results table.
    :::image type="content" source="media/organize-hunts/add-bookmark.png" alt-text="Screenshot showing add bookmark pane with optional fields filled in." lightbox="media/organize-hunts/add-bookmark.png":::

   Optional steps:
1. Name the bookmark(s), 
1. Set the event time column
1. Map entity identifiers
1. Set MITRE tactics and techniques
1. Add tags, and add notes. 

    The bookmarks preserve the specific row results, KQL query, and time range that generated the result. For more information, see [Hunt with bookmarks](bookmarks.md).

1. Select **Create** to add the bookmark to the hunt.


## View bookmarks
Navigate to your hunt's bookmark tab to view your bookmarks with previously created details.

:::image type="content" source="media/organize-hunts/view-bookmark.png" alt-text="Screenshot showing a bookmark with all its details and the hunts action menu open." lightbox="media/organize-hunts/view-bookmark.png":::

From here select a desired bookmark and perform the following actions:
- Select entity links to view the corresponding UEBA entity page.
- View raw results, tags, and notes.
- Select **View source query** to see the source query in Log Analytics.
- Select **View bookmark logs** to see the bookmark contents in the Log Analytics hunting bookmark table.
- Select **Investigate** button to view the bookmark and related entities in the investigation graph. 
- Select the **Edit** button to update the tags, MITRE tactics and techniques, and notes.

## Interact with entities
1. Navigate to your hunt's **Entities** tab to view, search, and filter the entities contained in your hunt. This list is generated from the list of entities in the bookmarks. The Entities tab automatically resolves duplicated entries. 
1. Select entity names to visit the corresponding UEBA entity page. 
1. Right-click on the entity to take actions appropriate to the entity types, such as adding an IP address to TI or running an entity type specific playbook.

    :::image type="content" source="media/organize-hunts/entities-add-ti.png" alt-text="Screenshot showing context menu for entities.":::


## Add comments
Comments are an excellent place to collaborate with colleagues, preserve notes, and document findings. 

1. Select :::image type="icon" source="media/organize-hunts/comments-icon.png":::
1. Type and format your comment in the edit box.
1. Add a query result as a link for collaborators to quickly understand the context.  
1. Select the **Comment** button to apply your comments.

    :::image type="content" source="media/organize-hunts/add-comment.png" alt-text="Screenshot showing comment edit box with LA query as a link.":::


## Create incidents
There are two choices for incident creation while hunting. 

Option 1: Use bookmarks.
1. Select a bookmark or bookmarks.
1. Select the Incident actions button.
1. Select Create new incident or Add to existing incident

    :::image type="content" source="media/organize-hunts/create-incident.png" alt-text="Screenshot showing incident actions menu from the bookmarks window.":::

    - For **Create new incident**, follow the guided steps. The bookmarks tab is prepopulated with your selected bookmarks. 
    - For **Add to existing incident**, select the incident and select the **Accept** button.

Option 2: Use the hunts **Actions**.
1. Select the hunts **Actions** menu > **Create incident**, and follow the guided steps.

    :::image type="content" source="media/organize-hunts/create-incident-actions-menu.png" alt-text="Screenshot showing hunts actions menu from the bookmarks window.":::

1. During the **Add bookmarks** step use the **Add bookmark** action to choose additional bookmarks from the hunt to add to the incident. You're limited to bookmarks that haven't already been assigned to an incident.


## Update status
1. When you have captured enough evidence to validate or invalidate your hypothesis, update your hypothesis state.

    :::image type="content" source="media/organize-hunts/set-hypothesis.png" alt-text="Screenshot shows hypothesis state menu selection.":::

1. When all the actions associated with the hunt are complete, such as creating analytics rules, incidents, or adding indicators of compromise (IOCs) to TI, close out the hunt.

    :::image type="content" source="media/organize-hunts/set-status.png" alt-text="Screenshot shows Hunt state menu selection.":::

These status updates are visible on the main Hunting page and are used to [track metrics](#track-metrics).

## Track metrics
Track tangible results from hunting activity using the metrics bar in the **Hunts** tab. Metrics show the number of validated hypotheses, new incidents created, and new analytic rules created. Use these results to set goals or celebrate milestones of your hunting program.
 
:::image type="content" source="media/organize-hunts/track-metrics.png" alt-text="Screenshot shows hunting metrics.":::


## Next steps