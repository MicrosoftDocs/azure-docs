---
title: How to investigate an incident using AIOps with Azure Monitor Investigator
description: Instructions for how to use the Azure Monitor investigator to investigate and incident using AI.
ms.author: abbyweisberg
author: MSFT
ms.topic: how-to
ms.date: 02/14/2024
ms.reviewer: yalavi

# Customer intent: As an  Site Reliability Engineers (SREs), developer, or IT operations engineer, I want to know how to use AI to explain why an alert was fired and tell me what my next steps should be to resolve the issue.
---

# Use AIOps to investigate incidents Azure Monitor Investigator

This article describes how to use Azure Monitor Investigator to trigger an investigation to identify resource issues, or to explain why an alert was fired, and provide next steps to resolve the issue.

## Investigate an alert

1. From the home page in the [Azure portal](https://portal.azure.com/), select **Monitor** > **Alerts**.
1. From the **Alerts** page, select the alert that you want to investigate.
1. In the alert details pane, select **Investigate** on the top right.

    :::image type="content" source="./media/investigate-alert-instance/investigate-button.png" alt-text="Screenshot of the investigate button from the alert details page.":::

1. The investigation starts to run. 

    :::image type="content" source="./media/investigate-alert-instance/investigator-running.png" alt-text="Screenshot of the investigator in the middle of running.":::

1. When the investigation is complete, a summary of the incident is displayed with recommendations for how to mitigate the issue.

    

## Ask Copilot about resource issues, and trigger an investigation

1. From the home page in the [Azure portal](https://portal.azure.com/), select **Copilot**.
1. In **Copilot**, ask about resource issues
 
 

 
## Next steps

Learn about [Responsible AI for Azure Monitor Investigator](responsible-ai-faq.md).
