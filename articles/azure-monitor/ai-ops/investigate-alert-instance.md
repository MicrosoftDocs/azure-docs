---
title: Investigate an incident with Azure Monitor Investigator
description: Learn how to use the Azure Monitor investigator to use AIOps to investigate an incident using AI.
ms.author: abbyweisberg
author: MSFT
ms.topic: how-to
ms.date: 04/09/2024
ms.reviewer: yalavi

# Customer intent: As a Site Reliability Engineer (SRE), developer, or IT operations engineer, I want to know how to use AI to explain why an alert was fired and tell me what my next steps should be to resolve the issue.
---

# Use AIOps to investigate incidents Azure Monitor Investigator

This article describes how to use Azure Monitor Investigator to trigger an investigation to identify resource issues, or to explain why an alert was fired, and provide next steps to resolve the issue.

## Investigate an alert

1. From the home page in the [Azure portal](https://portal.azure.com/), select **Monitor** > **Alerts**.
1. From the **Alerts** page, select the alert that you want to investigate.
1. In the alert details pane, select **Investigate** on the top right.

    :::image type="content" source="./media/investigate-alert-instance/investigate-button.png" alt-text="Screenshot of the investigate button from the alert details page.":::

1. Alternatively, you can select **Investigate** from the email notification about an alert.
1. The investigation starts to run. 

    :::image type="content" source="./media/investigate-alert-instance/investigator-running.png" alt-text="Screenshot of the investigator in the middle of running.":::

1. When the investigation is complete, a summary of the incident is displayed with recommendations for how to mitigate the issue.

    :::image type="content" source="./media/investigate-alert-instance/investigator-response.png" alt-text="Screenshot of the investigator response with recommendations.":::


## Ask Copilot to trigger an investigation

1. From the home page in the [Azure portal](https://portal.azure.com/), select **Copilot**.
1. In **Copilot**, ask about resource issues to get more insight into the issue. Here are some examples of questions you can ask:
    - "Is there any anomaly in my edge resource?"
    - "Run anomaly detection for the last two days."
    - "Any anomaly on my AKS resource?"
    - "Had an alert in my HCI at 8 am this morning, run an anomaly investigation for me"
    - "Run anomaly detection at 2023-10-27T20:48:53Z."
    - "Run anomaly detection at 10/27/2023, 8:48:53 PM"
 
1.  Copilot runs an investigation and respond with the results.


## Next steps

Learn about [Responsible AI for Azure Monitor Investigator](responsible-ai-faq.md).
