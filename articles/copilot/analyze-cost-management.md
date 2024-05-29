---
title: Analyze, estimate and optimize cloud costs using Microsoft Copilot in Azure
description: Learn about scenarios where Microsoft Copilot in Azure can use Microsoft Cost Management to help you manage your costs.
ms.date: 05/28/2024
ms.topic: conceptual
ms.service: copilot-for-azure
ms.custom:
  - ignite-2023
  - ignite-2023-copilotinAzure
  - build-2024
ms.author: jenhayes
author: JnHs
---

# Analyze, estimate and optimize cloud costs using Microsoft Copilot in Azure

Microsoft Copilot in Azure (preview) can help you analyze, estimate and optimize cloud costs. Ask questions using natural language to get information and recommendations based on [Microsoft Cost Management](/azure/cost-management-billing/costs/overview-cost-management).

When you ask Microsoft Copilot in Azure  questions about your costs, it automatically pulls context based on the last scope that you accessed using Cost Management. If the context isn't clear, you'll be prompted to select a scope or provide more context.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

[!INCLUDE [preview-note](includes/preview-note.md)]

## Sample prompts

Here are a few examples of the kinds of prompts you can use for Cost Management. Modify these prompts based on your real-life scenarios, or try additional prompts to meet your needs.

- "Summarize my costs for the last 6 months."
- "Why did my cost spike on July 8th?"
- "Can you provide an estimate of our expected expenses for the next 6 months?"
- "Show me the resource group with the highest spending in the last 6 months."
- "How can we reduce our costs?"
- "Which resources are covered by savings plans?"

## Examples

When you prompt Microsoft Copilot in Azure, "**Summarize my costs for the last 6 months**," a summary of costs for the selected scope is provided. You can follow up with questions to get more granular details, such as "What was our virtual machine spending last month?"

:::image type="content" source="media/analyze-cost-management/cost-management-summarize-costs.png" alt-text="Screenshot of Microsoft Copilot in Azure providing a summary of costs.":::

:::image type="content" source="media/analyze-cost-management/cost-management-vm-costs.png" alt-text="Screenshot showing Microsoft Copilot in Azure providing details about VM costs.":::

Next, you can ask "**How can we reduce our costs?**" Microsoft Copilot in Azure provides a list of recommendations you can take, including an estimate of the potential savings you might see.

:::image type="content" source="media/analyze-cost-management/cost-management-reduce.png" alt-text="Screenshot showing Microsoft Copilot in Azure providing a list of recommendations to reduce costs.":::

:::image type="content" source="media/analyze-cost-management/cost-management-reduce-2.png" alt-text="Screenshot showing Microsoft Copilot in Azure continuing a list of recommendations to reduce costs.":::

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot in Azure.
- Learn more about [Microsoft Cost Management](/azure/cost-management-billing/costs/overview-cost-management).
