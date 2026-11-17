---
title: Investigate configuration deviations with Run Oracle Agent
titleSuffix: Azure Workload Center for Oracle
description: Learn how to investigate configuration deviations of an Oracle workload with the Azure Copilot Run Oracle Agent.
author: teja-san
ms.author: tsankranthi
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: how-to
ms.date: 11/06/2026
ai-usage: ai-assisted
---
# Investigate configuration deviations with Run Oracle Agent

Azure Copilot Run Oracle Agent reads the results of configuration validation and answers questions about deviations. It returns a summary first and gives details when you ask. For a long result, it creates a JSON file that you can download. It also suggests next prompts.

## Open the agent from the Overview page

1.  In Azure Workload Center for Oracle, open the **Overview** page.

2.  On the **Configuration checks** card, select **View drifts**. Copilot opens with the prompt "Show the configuration drifts for all my Oracle Workloads."

:::image type="content" source="media/investigate-configuration-deviations/view-drifts-button.png" alt-text="Screenshot that shows the Azure Workload Center for Oracle Overview page with the View results and View drifts buttons." lightbox="media/investigate-configuration-deviations/view-drifts-button.png":::

3.  Review the answer, and ask a follow-up question or select a suggested prompt.

:::image type="content" source="media/investigate-configuration-deviations/drifts-answer.png" alt-text="Screenshot that shows the Run Oracle Agent answer with a summary and key findings for the configuration drifts of a WVI." lightbox="media/investigate-configuration-deviations/drifts-answer.png":::

You can also start from a deviation on the **Check results** page by selecting **Click here for more suggestions** on its detail page.

## Example prompts

- Show me the configuration deviations for the Oracle workload \<WVI name\>

- Show the configuration deviations for my workloads, grouped by environment

- Provide resolution steps for all configuration deviations in my workloads

- Show me the high-impact configuration deviations across my production Oracle workloads

- Give me resolution steps for the configuration deviations in \<WVI name\>

- Give me the resolution steps for the \<check name\> check on \<WVI name\>

The agent provides resolution steps. You review and apply the changes yourself.
