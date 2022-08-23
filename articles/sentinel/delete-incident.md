---
title: Delete incidents in Microsoft Sentinel
description: Delete incidents in Microsoft Sentinel from the portal, through the API, or using a Logic App.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 08/22/2022
---

# Delete incidents in Microsoft Sentinel

> [!IMPORTANT]
>
> Incident deletion is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The ability to create incidents from scratch in Microsoft Sentinel opens the possibility that you'll create an incident that you later decide you shouldn't have. For example, you may have created an incident based on an employee report, before having received any evidence (such as alerts), and soon afterward you receive alerts that automatically generate the incident in question. But now, you have a duplicate incident. In this scenario, you can delete your duplicate incident right from the incident queue in the portal.

## Delete an incident using the Azure portal

1. From the Microsoft Sentinel navigation menu, select **Incidents**.

1. On the **Incidents** page, select the incident or incidents you want to delete by marking the checkboxes next to them in the queue. 

1. Select **Delete** from the button bar.  

    :::image type="content" source="media/create-incident-manually/create-incident-main-page.png" alt-text="Screenshot of main incident screen, locating the button to create a new incident manually."  lightbox="media/create-incident-manually/create-incident-main-page.png":::

    The **Create incident (Preview)** panel will open on the right side of the screen.

    :::image type="content" source="media/create-incident-manually/create-incident-panel.png" alt-text="Screenshot of manual incident creation panel, all fields blank.":::

1. Fill in the fields in the panel accordingly.

    - **Title**
        - Enter a title of your choosing for the incident. The incident will appear in the queue with this title.
        - Required. Free text of unlimited length. Spaces will be trimmed.

    - **Description**
        - Enter descriptive information about the incident, including details such as the origin of the incident, any entities involved, relation to other events, who was informed, and so on.
        - Optional. Free text up to 5000 characters.

    - **Severity**
        - Choose a severity from the drop-down list. All Microsoft Sentinel-supported severities are available.
        - Required. Defaults to "Medium."

    - **Status**
        - Choose a status from the drop-down list. All Microsoft Sentinel-supported statuses are available.
        - Required. Defaults to "New."
        - You can create an incident with a status of "closed," and then open it manually afterward to make changes and choose a different status. Choosing "closed" from the drop-down will activate **classification reason** fields for you to choose a reason for closing the incident and add comments.
            :::image type="content" source="media/create-incident-manually/classification-reason.png" alt-text="Screenshot of classification reason fields for closing an incident.":::

    - **Owner**
        - Choose from the available users or groups in your tenant. Begin typing a name to search for users and groups. Select the field (click or tap) to display a list of suggestions. Choose "assign to me" at the top of the list to assign the incident to yourself.
        - Optional.

    - **Tags**
        - Use tags to classify incidents and to filter and locate them in the queue.
        - Create tags by selecting the **plus sign icon**, entering text in the dialog box, and selecting **OK**. Auto-completion will suggest tags used within the workspace over the prior two weeks.
        - Optional. Free text.

1. Select **Create** at the bottom of the panel. After a few seconds, the incident will be created and will appear in the incidents queue.

    Select the incident in the queue to see its full details, add bookmarks, change its owner and status, and more.

### Notes

- Incidents created manually do not contain any entities or alerts. Therefore, the **Alerts** tab in the incident page will remain empty until you [relate existing alerts to your incident](relate-alerts-to-incidents.md).

    The **Entities** tab will also remain empty, as adding entities *directly* to manually created incidents is not currently supported. (If you relate an alert to this incident, entities from the alert will appear in the incident.)

- Manually created incidents will also not display any **Product name** in the queue.

- The incidents queue is filtered by default to display only incidents with a status of "New" or "Active." If you create an incident with a status of "Closed," it will not appear in the queue until you change the status filter to show closed incidents as well.


## Next steps

For more information, see:
- [Relate alerts to incidents in Microsoft Sentinel](relate-alerts-to-incidents.md)
- [Investigate incidents with Microsoft Sentinel](investigate-cases.md)
- [Create custom analytics rules to detect threats](detect-threats-custom.md)
