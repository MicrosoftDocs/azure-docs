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
> Incident deletion using the portal is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
> 
> Incident deletion is generally available through the API.

The ability to create incidents from scratch in Microsoft Sentinel opens the possibility that you'll create an incident that you later decide you shouldn't have. For example, you may have created an incident based on an employee report, before having received any evidence (such as alerts), and soon afterward you receive alerts that automatically generate the incident in question. But now, you have a duplicate incident with no data in it. In this scenario, you can delete your duplicate incident right from the incident queue in the portal.

**Deleting an incident is not a substitute for closing an incident!** Deleting an incident should only be done when at least one of the following conditions is met:
- The incident was created manually by mistake.
- The incident exactly duplicates another incident.
- Faulty incidents were generated in bulk by a broken analytics rule.
- The incident contains no data - alerts, entities, bookmarks, and so on.

In all other cases, when an incident is no longer needed, it should be **closed**, not deleted. [Closing an incident](investigate-cases.md#closing-an-incident) requires you to specify the reason for closing it, and allows you to add additional comments for context and clarification. Closing old incidents in this way preserves the transparency and integrity of your SOC, and also allows for the possibility of reopening the incident if the problem resurfaces.




## Delete an incident using the Azure portal

**To delete a single incident:**

1. From the Microsoft Sentinel navigation menu, select **Incidents**.

1. On the **Incidents** page, select the incident you want to delete.

1. Select **View full details** in the details pane to enter the incident's full details view.

1. Select **Delete incident** from the button bar at the top.
    :::image type="content" source="media/delete-incident/delete-incident-from-details-screen.png" alt-text="Screenshot of deleting incident from details screen.":::

1. Answer **Yes** to the confirmation prompt that appears.
    :::image type="content" source="media/delete-incident/delete-incident-confirm.png" alt-text="Screenshot of single incident deletion confirmation dialog.":::

Alternatively, you can follow the instructions for deleting multiple incidents (immediately below), and mark a single incident's checkbox.

**To delete multiple incidents:**

1. From the Microsoft Sentinel navigation menu, select **Incidents**.

1. On the **Incidents** page, select the incident or incidents you want to delete, by marking the checkboxes next to each one in the incidents grid.

1. Select **Delete** from the button bar.
    :::image type="content" source="media/delete-incident/delete-multiple-incidents-from-queue.png" alt-text="Screenshot of deleting multiple incidents from incident queue.":::

1. Answer **Yes** to the confirmation prompt that appears.
    :::image type="content" source="media/delete-incident/delete-multiple-incidents-confirm.png" alt-text="Screenshot of multiple-incident-deletion confirmation dialog.":::

## Delete an incident using the Microsoft Sentinel API

The [Incidents](/rest/api/securityinsights/preview/incidents) operation group allows you to delete incidents as well as to [create and update (edit)](/rest/api/securityinsights/preview/incidents/create-or-update), [get (retrieve)](/rest/api/securityinsights/preview/incidents/get), and [list](/rest/api/securityinsights/preview/incidents/list) them.

You [delete an incident](/rest/api/securityinsights/preview/incidents/delete) using the following endpoint. After this request is made, the incident will be visible in the incident queue in the portal.

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/providers/Microsoft.SecurityInsights/incidents/{incidentId}?api-version=2022-07-01-preview
```

## Notes

- To delete an incident, you must have the [**Microsoft Sentinel Contributor**](roles.md) role.

- Deleting an incident is not reversible! After you delete an incident, the only reference to it will be the audit data in the *SecurityIncident* table in the Logs screen. (See the [table's schema documentation in Log Analytics](/azure/azure-monitor/reference/tables/securityincident)). The *Status* field in that table will be updated to "Deleted" for that incident.

    > [!NOTE]
    >
    > Due to the 64 KB limit of the record size in the *SecurityIncident* table, incident comments may be truncated (beginning from the earliest) if the limit is exceeded.

- You can't delete incidents from within Microsoft Sentinel that were [imported from and synchronized with Microsoft 365 Defender](microsoft-365-defender-sentinel-integration.md).

- If an alert [related to a deleted incident](relate-alerts-to-incidents.md) gets updated, or if a new alert is grouped under a deleted incident, a new incident will be created to replace the deleted one.

## Next steps

For more information, see:
- [Create your own incidents manually in Microsoft Sentinel](create-incident-manually.md)
- [Relate alerts to incidents in Microsoft Sentinel](relate-alerts-to-incidents.md)
- [Investigate incidents with Microsoft Sentinel](investigate-cases.md)
- [Create custom analytics rules to detect threats](detect-threats-custom.md)
