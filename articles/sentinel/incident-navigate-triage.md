---
title: Basic incident tasks for Microsoft Sentinel incidents in the Azure portal
description: This article describes how to navigate and triage incidents in Microsoft Sentinel in the Azure portal.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 12/22/2024
appliesto: 
  - Microsoft Sentinel in the Azure portal
#Customer intent: As a security analyst, I want to learn the basics of navigating, triaging, and managing Microsoft Sentinel incidents in the Azure portal so that I can start investigating and responding to security incidents.
---

# Navigate, triage, and manage Microsoft Sentinel incidents in the Azure portal

This article describes how to navigate and run basic triage on your incidents in the Azure portal.

## Prerequisites

- The [**Microsoft Sentinel Responder**](../role-based-access-control/built-in-roles.md#microsoft-sentinel-responder) role assignment is required to investigate incidents.

    Learn more about [roles in Microsoft Sentinel](roles.md).

- If you have a guest user that needs to assign incidents, the user must be assigned the [Directory Reader](../active-directory/roles/permissions-reference.md#directory-readers) role in your Microsoft Entra tenant. Regular (nonguest) users have this role assigned by default.

## Navigate and triage incidents

1. From the Microsoft Sentinel navigation menu, under **Threat management**, select **Incidents**.

    The **Incidents** page gives you basic information about all of your open incidents. For example:

    :::image type="content" source="media/investigate-incidents/incident-grid.png" alt-text="Screenshot of view of incident severity." lightbox="media/investigate-incidents/incident-grid.png":::

    - **Across the top of the screen**, you have a toolbar with actions you can take outside of a specific incident&mdash;either on the grid as a whole, or on multiple selected incidents. You also have the counts of open incidents, whether new or active, and the counts of open incidents by severity.

    - **In the central pane**, you have an incident grid, which is a list of incidents as filtered by the filtering controls at the top of the list, and a search bar to find specific incidents.

    - **On the side**, you have a details pane that shows important information about the incident highlighted in the central list, along with buttons for taking certain specific actions regarding that incident.

1. Your security operations team might have [automation rules](automate-incident-handling-with-automation-rules.md#automatic-assignment-of-incidents) in place to perform basic triage on new incidents and assign them to the proper personnel.

    In that case, filter the incident list by **Owner** to limit the list to the incidents assigned to you or to your team. This filtered set represents your personal workload.

    Otherwise, you can perform basic triage yourself. Start by filtering the list of incidents by available filtering criteria, whether status, severity, or product name. For more information, see [Search for incidents](#search-for-incidents).

1. Triage a specific incident and take initial action on it immediately, right from the details pane on the **Incidents** page, without having to enter the incident’s full details page. For example:

    - **Investigate Microsoft Defender XDR incidents in Microsoft Defender XDR:** Follow the [**Investigate in Microsoft Defender XDR**](microsoft-365-defender-sentinel-integration.md) link to pivot to the parallel incident in the Defender portal. Any changes you make to the incident in Microsoft Defender XDR are synchronized to the same incident in Microsoft Sentinel.

    - **Open the list of assigned tasks:** Incidents that have tasks assigned display a count of completed and total tasks and a **View full details** link. Follow the link to open the [**Incident tasks**](incident-tasks.md) page to see the list of tasks for this incident.

    - **Assign ownership of the incident** to a user or group by selecting from the **Owner** drop-down list.

        :::image type="content" source="media/investigate-incidents/assign-incident-to-user.png" alt-text="Screenshot of assigning incident to user.":::

        Recently selected users and groups appear at the top of the pictured drop-down list.

    - **Update the incident’s status** (for example, from **New** to **Active** or **Closed**) by selecting from the **Status** drop-down list. When closing an incident, you're required to specify a reason. For more information, see [Close an incident](#close-an-incident).

    - **Change the incident’s severity** by selecting from the **Severity** drop-down list.

    - **Add tags** to categorize your incidents. You might need to scroll down to the bottom of the details pane to see where to add tags.

    - **Add comments** to log your actions, ideas, questions, and more. You might need to scroll down to the bottom of the details pane to see where to add comments.

1. If the information in the details pane is sufficient to prompt further remediation or mitigation actions, select the **Actions** button at the bottom to do one of the following:

   |Action  | Description  |
   |---------|---------|
   | **Investigate** | Use the [graphical investigation tool](investigate-incidents.md#investigate-incidents-visually-using-the-investigation-graph) to discover relationships between alerts, entities, and activities, both within this incident and across other incidents.|
   |**Run playbook** | Run a [playbook](automate-responses-with-playbooks.md#run-a-playbook-manually) on this incident to take particular [enrichment, collaboration, or response actions](automate-responses-with-playbooks.md#use-cases-for-playbooks) such as your SOC engineers might have made available.|  
   | **Create automation rule**| Create an [automation rule](automate-incident-handling-with-automation-rules.md#common-use-cases-and-scenarios) that runs only on incidents like this one (generated by the same analytics rule) in the future, in order to reduce your future workload or to account for a temporary change in requirements (such as for a penetration test). |
   | **Create team (Preview)**| Create a team in Microsoft Teams to collaborate with other individuals or teams across departments on handling the incident. |
   
    For example:
  
    :::image type="content" source="media/investigate-incidents/incident-actions.png" alt-text="Screenshot of menu of actions that can be performed on an incident from the details pane.":::

1. If more information about the incident is needed, select **View full details** in the details pane to open and see the incident's details in their entirety, including the alerts and entities in the incident, a list of similar incidents, and selected top insights.

## Search for incidents

To find a specific incident quickly, enter a search string in the search box above the incidents grid and press **Enter** to modify the list of incidents shown accordingly. If your incident isn't included in the results, you might want to narrow your search by using **Advanced search** options.

To modify the search parameters, select the **Search** button and then select the parameters where you want to run your search.

For example:

:::image type="content" source="media/investigate-incidents/advanced-search.png" alt-text="Screenshot of the incident search box and button to select basic and/or advanced search options.":::

By default, incident searches run across the **Incident ID**, **Title**, **Tags**, **Owner**, and **Product name** values only. In the search pane, scroll down the list to select one or more other parameters to search, and select **Apply** to update the search parameters. Select **Set to default** reset the selected parameters to the default option.


> [!NOTE]
> Searches in the **Owner** field support both names and email addresses.
>

Using advanced search options changes the search behavior as follows:

| Search behavior  | Description  |
|---------|---------|
| **Search button color**     | The color of the search button changes, depending on the types of parameters currently being used in the search. <ul><li>As long as only the default parameters are selected, the button is grey. <li>As soon as different parameters are selected, such as advanced search parameters, the button turns blue.         |
| **Auto-refresh**     | Using advanced search parameters prevents you from selecting to automatically refresh your results.        |
| **Entity parameters**     | All entity parameters are supported for advanced searches. When searching in any entity parameter, the search runs in all entity parameters.         |
| **Search strings**     | Searching for a string of words includes all of the words in the search query. Search strings are case sensitive.     |
| **Cross workspace support**     | Advanced searches aren't supported for cross-workspace views.     |
| **Number of search results displayed** | When you're using advanced search parameters, only 50 results are shown at a time. |


> [!TIP]
>  If you're unable to find the incident you're looking for, remove search parameters to expand your search. If your search results in too many items, add more filters to narrow down your results.
>

## Audit and comment on incidents

When investigating an incident, you want to thoroughly document the steps you take, both to ensure accurate reporting to management and to enable seamless cooperation and collaboration among coworkers. You also want to clearly see records of any actions taken on the incident by others, including by automated processes. Microsoft Sentinel gives you the **Activity log**, a rich audit and commenting environment, to help you accomplish this.

You can also enrich your incidents automatically with comments. For example, when you run a playbook on an incident that fetches relevant information from external sources (say, checking a file for malware at VirusTotal), you can have the playbook place the external source's response&mdash;along with any other information you define&mdash;in the incident's comments.

The activity log autorefreshes, even while open, so that you can always see changes in real time. You're also notified of any changes made to the activity log while you have it open.

**Prerequisites**

- **Editing:** Only the author of a comment has permission to edit it.

- **Deleting:** Only users with the [Microsoft Sentinel Contributor](roles.md) role have permission to delete comments. Even the comment's author must have this role in order to delete it.

**To view the log of activities and comments, or to add your own comments**:

1. Select **Activity log** at the top of the incident details page.
1. To filter the log to show either only activities or only comments, select the filter control at the top of the log.
1. If you want to add a comment, enter it in the rich text editor at the bottom of the **Incident activity log** panel.
1. Select **Comment** to submit the comment. Your comment is added at the top of the log.

:::image type="content" source="media/investigate-incidents/comments-screen.png" alt-text="Screenshot of viewing and entering comments.":::

### Supported input for comments

The following table lists limits for supported inputs in comments:

| **Type** | **Description** |
| --- | --- |
| **Text** | Comments in Microsoft Sentinel support text inputs in plain text, basic HTML, and Markdown. You can also paste copied text, HTML, and Markdown into the comment window. |
| **Links** | Links must be in the form of HTML anchor tags, and they must have the parameter `target="_blank"`. For example::<br><br>```html<br><a href="https://www.url.com" target="_blank">link text</a><br>```<br><br>If you have playbooks that create comments in incidents, links in those comments must conform to this template as well. |
| **Images** | Images can't be uploaded directly to comments. Instead, insert links to images in comments to display images inline. Linked images must already be hosted in a publicly accessible location such as Dropbox, OneDrive, Google Drive and so on. |
| **Size limit** | **Per comment:** A single comment can contain up to **30,000 characters**.<br><br>**Per incident:** A single incident can contain up to **100 comments**.<br><br>The size limit of a single incident record in the *SecurityIncident* table in Log Analytics is 64 KB. If this limit is exceeded, comments (starting with the earliest) are truncated, which may affect the comments that appear in [advanced search](#search-for-incidents) results. The actual incident records in the incidents database aren't affected. |

## Close an incident

Once you resolve a particular incident (for example, when your investigation reaches its conclusion), set the incident’s status to **Closed**. When you do so, you're asked to classify the incident by specifying the reason you're closing it. This step is mandatory. 

Select **Select classification** and choose one of the following from the drop-down list:

- **True Positive** &ndash; suspicious activity
- **Benign Positive** &ndash; suspicious but expected
- **False Positive** &ndash; incorrect alert logic
- **False Positive** &ndash; incorrect data
- **Undetermined**

:::image type="content" source="media/investigate-incidents/closing-reasons-dropdown.png" alt-text="Screenshot that highlights the classifications available in the Select classification list.":::

For more information about false positives and benign positives, see [Handle false positives in Microsoft Sentinel](false-positives.md).

After choosing the appropriate classification, add some descriptive text in the **Comment** field. This is useful in the event you need to refer back to this incident. Select **Apply** when you’re done, and the incident is closed.

:::image type="content" source="media/investigate-incidents/closing-reasons-comment-apply.png" alt-text="Screenshot of closing an incident.":::

## Next step

For more information, see [Investigate Microsoft Sentinel incidents in depth in the Azure portal](investigate-incidents.md)
