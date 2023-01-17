---
title: Create your own incidents manually in Microsoft Sentinel
description: Manually create incidents in Microsoft Sentinel based on data or information received by the SOC through alternate means or channels.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 08/17/2022
---

# Create your own incidents manually in Microsoft Sentinel

> [!IMPORTANT]
>
> Manual incident creation, using the portal or Logic Apps, is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> Manual incident creation is generally available using the API.

With Microsoft Sentinel as your SIEM, your SOC’s threat detection and response activities are centered on **incidents** that you investigate and remediate. These incidents have two main sources: 

- They are generated automatically by detection mechanisms that operate on the logs and alerts that Sentinel ingests from its connected data sources.

- They are ingested directly from other connected Microsoft security services (such as [Microsoft 365 Defender](microsoft-365-defender-sentinel-integration.md)) that created them.

There can, however, be data from other sources *not ingested into Microsoft Sentinel*, or events not recorded in any log, that justify opening an investigation. For example, an employee might witness an unrecognized person engaging in suspicious activity related to your organization’s information assets, and this employee might call or email the SOC to report the activity.

For this reason, Microsoft Sentinel allows your security analysts to manually create incidents for any type of event, regardless of its source or associated data, for the purpose of managing and documenting these investigations.

## Common use cases

### Create an incident for a reported event

This is the scenario described in the introduction above.

### Create incidents out of events from external systems

Create incidents based on events from systems whose logs are not ingested into Microsoft Sentinel. For example, an SMS-based phishing campaign might use your organization's corporate branding and themes to target employees' personal mobile devices. You may want to investigate such an attack, and creating an incident in Microsoft Sentinel gives you a platform to collect and log evidence and record your response and mitigating actions.

### Create incidents based on hunting results

Create incidents based on the observed results of hunting activities. For example, in the course of your threat hunting activities in relation to a particular investigation (or independently), you might come across evidence of a completely unrelated threat that warrants its own separate investigation.

## Manually create an incident

There are three ways to create an incident manually:

- [Create an incident using the Azure portal](#create-an-incident-using-the-azure-portal)
- [Create an incident using Azure Logic Apps](#create-an-incident-using-azure-logic-apps), using the Microsoft Sentinel Incident trigger.
- [Create an incident using the Microsoft Sentinel API](#create-an-incident-using-the-microsoft-sentinel-api), through the [Incidents](/rest/api/securityinsights/preview/incidents) operation group. It allows you to get, create, update, and delete incidents.

### Create an incident using the Azure portal

1. Select **Microsoft Sentinel** and choose your workspace.

1. From the Microsoft Sentinel navigation menu, select **Incidents**.

1. On the **Incidents** page, select **+ Create incident (Preview)** from the button bar.  

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

    If you assign an incident a status of "Closed," it will not appear in the queue until you change the **status** filter to show closed incidents as well. The filter is set by default to display only incidents with a status of "New" or "Active." 

Select the incident in the queue to see its full details, add bookmarks, change its owner and status, and more.

If for some reason you change your mind after the fact about creating the incident, you can [delete it](delete-incident.md) from the queue grid, or from within the incident itself.

### Create an incident using Azure Logic Apps

Creating an incident is also available as a Logic Apps action in the Microsoft Sentinel connector, and therefore in Microsoft Sentinel [playbooks](tutorial-respond-threats-playbook.md).

You can find the **Create incident (preview)** action in the playbook schema for the incident trigger.

:::image type="content" source="media/create-incident-manually/create-incident-logicapp-action.png" alt-text="Screenshot of create incident logic app action in Microsoft Sentinel connector.":::

You need to supply parameters as described below:

- Select your **Subscription**, **Resource group**, and **Workspace name** from their respective drop-downs.

- For the remaining fields, see the explanations above (under [Create an incident using the Azure portal](#create-an-incident-using-the-azure-portal)).

    :::image type="content" source="media/create-incident-manually/create-incident-logicapp-parameters.png" alt-text="Screenshot of create incident action parameters in Microsoft Sentinel connector.":::

Microsoft Sentinel supplies some sample playbook templates that show you how to work with this capability:

- **Create incident with Microsoft Form**
- **Create incident from shared email inbox**

You can find them in the playbook templates gallery on the Microsoft Sentinel **Automation** page.

### Create an incident using the Microsoft Sentinel API

The [Incidents](/rest/api/securityinsights/preview/incidents) operation group allows you not only to create, but also to [update (edit)](/rest/api/securityinsights/preview/incidents/create-or-update), [get (retrieve)](/rest/api/securityinsights/preview/incidents/get), [list](/rest/api/securityinsights/preview/incidents/list), and [delete](/rest/api/securityinsights/preview/incidents/delete) incidents.

You [create an incident](/rest/api/securityinsights/preview/incidents/create-or-update) using the following endpoint. After this request is made, the incident will be visible in the incident queue in the portal.

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/providers/Microsoft.SecurityInsights/incidents/{incidentId}?api-version=2022-07-01-preview
```

Here's an example of what a request body might look like:

```json
{
  "etag": "\"0300bf09-0000-0000-0000-5c37296e0000\"",
  "properties": {
    "lastActivityTimeUtc": "2019-01-01T13:05:30Z",
    "firstActivityTimeUtc": "2019-01-01T13:00:30Z",
    "description": "This is a demo incident",
    "title": "My incident",
    "owner": {
      "objectId": "2046feea-040d-4a46-9e2b-91c2941bfa70"
    },
    "severity": "High",
    "classification": "FalsePositive",
    "classificationComment": "Not a malicious activity",
    "classificationReason": "IncorrectAlertLogic",
    "status": "Closed"
  }
}
```

## Notes

- Incidents created manually do not contain any entities or alerts. Therefore, the **Alerts** tab in the incident page will remain empty until you [relate existing alerts to your incident](relate-alerts-to-incidents.md).

    The **Entities** tab will also remain empty, as adding entities *directly* to manually created incidents is not currently supported. (If you relate an alert to this incident, entities from the alert will appear in the incident.)

- Manually created incidents will also not display any **Product name** in the queue.

- The incidents queue is filtered by default to display only incidents with a status of "New" or "Active." If you create an incident with a status of "Closed," it will not appear in the queue until you change the status filter to show closed incidents as well.


## Next steps

For more information, see:
- [Relate alerts to incidents in Microsoft Sentinel](relate-alerts-to-incidents.md)
- [Delete incidents in Microsoft Sentinel](delete-incident.md)
- [Investigate incidents with Microsoft Sentinel](investigate-cases.md)
- [Create custom analytics rules to detect threats](detect-threats-custom.md)
