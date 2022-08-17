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
> Manual incident creation is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

As you know from your work with Microsoft Sentinel so far, your SOC’s threat detection and response activities are centered on incidents that you investigate and remediate. These incidents are generated automatically by detection mechanisms that operate on the logs that Sentinel ingests from its connected data sources.

There can, however, be data from other sources – *besides those ingested into Microsoft Sentinel* – that justify creating an incident to be investigated. For example, an employee might witness an unrecognized person engaging in suspicious activity related to the organization’s information assets, and this employee might call or email the SOC to report the activity.

For this reason, Microsoft Sentinel allows security analysts to manually create incidents from the user interface, for any type of event, regardless of its source or associated data.

## Common use cases

### Create an incident for a reported event

This is the scenario described in the introduction above.

### Create incidents out of events from external systems

Create incidents based on events from systems whose logs are not ingested into Microsoft Sentinel. For example, a physical security system such as a gated entry might catch an unauthorized person or a person entering or leaving at an unusual or unauthorized time.

### Create incidents based on hunting results

Create incidents based on the observed results of hunting activities. For example, in the course of your threat hunting activities in relation to a particular investigation (or independently), you might come across evidence of a completely unrelated threat that warrants its own separate investigation.

## Manually create an incident

1. From the Microsoft Sentinel navigation menu, select **Incidents**.

1. On the **Incidents** page, select **+ Create incident (Preview)** from the button bar.  

    :::image type="content" source="media/create-incident-manually/create-incident-main-page.png" alt-text="Screenshot of main incident screen, locating the button to create a new incident manually."  lightbox="media/create-incident-manually/create-incident-main-page.png":::

    The **Create incident (Preview)** panel will open on the right side of the screen.

    :::image type="content" source="media/create-incident-manually/create-incident-panel.png" alt-text="Screenshot of manual incident creation panel, all fields blank.":::

1. Fill in the fields in the panel accordingly.

    | Field name | Format | Required? | Description and notes |
    | ---------- | ------ | --------- | --------------------- |
    | **Title** | Free text, unlimited | Yes | The title of the incident.<br>Spaces will be trimmed. |
    | **Description** | Free text<br>up to 5000 characters | No | Information regarding the incident. This can include details such as the origin of the incident, any entities involved, relation to other events, who was informed, and so on. |
    | **Severity** | Choice from a closed list | Yes | Default is "Medium". Supports all severities supported in Sentinel. |
    | **Status** | Choice from a closed list | Yes | Default is "New". The incident can be opened manually after it’s been mitigated and closed. In such a case, it’s possible to create an incident with a “closed” status. Choosing “closed” will immediately open the “classification reason” menu and the ability to add comments regarding the closing of the incident. 
•	Owner – The incident can be assigned to the current user (the “assign to me” option) or to another user / group. The list in the drop down is searchable in the AD. There is no default to this field. 
•	Tags – Tags are free text that can be used in order to classify, filter and locate the incident in the list. Auto completion will be offered from tags used in the workspace in the past two weeks. 










## Next steps

For more information, see:
- [Handle false positives in Microsoft Sentinel](false-positives.md)
- [Use UEBA data to analyze false positives](investigate-with-ueba.md#use-ueba-data-to-analyze-false-positives)
- [Create custom analytics rules to detect threats](detect-threats-custom.md)
