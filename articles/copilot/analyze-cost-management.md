---
title: Analyze, estimate and optimize cloud costs using Microsoft Copilot for Azure (preview)
description: Learn about scenarios where Microsoft Copilot for Azure (preview) can use Microsoft Cost Management to help you manage your costs.
ms.date: 11/15/2023
ms.topic: conceptual
ms.service: azure
ms.custom:
  - ignite-2023
  - ignite-2023-copilotinAzure
ms.author: jenhayes
author: JnHs
---

# Analyze, estimate and optimize cloud costs using Microsoft Copilot for Azure (preview)

Microsoft Copilot for Azure (preview) can help you analyze, estimate and optimize cloud costs. Ask questions using natural language to get information and recommendations based on [Microsoft Cost Management](/azure/cost-management-billing/costs/overview-cost-management).

When you ask Microsoft Copilot for Azure (preview) questions about your costs, it automatically pulls context based on the last scope that you accessed using Cost Management. If the context isn't clear, you'll be prompted to select a scope or provide more context.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

## Sample prompts

Here are a few examples of the kinds of prompts you can use to generate Azure CLI scripts. Modify these prompts based on your real-life scenarios, or try additional prompts to create different kinds of queries.

- "Summarize my costs for the last 6 months?"
- "Why did my cost spike on July 8th"
- "Can you provide an estimate of our expected expenses for the next 6 months?"
- "Show me the resource group with the highest spending in the last 6 months."
- "How can we reduce our costs?"
- "Which resources are covered by savings plans?

## Examples

In this example, the first request is "Change cost management scope." Microsoft Copilot for Azure (preview) provides a prompt to open the scope selector, allowing you to choose the desired scope.

:::image type="content" source="media/analyze-cost-management/cost-management-change-scope.png" lightbox="media/analyze-cost-management/cost-management-change-scope.png" alt-text="Screenshot showing Microsoft Copilot for Azure (preview) changing the cost management scope.":::

Once the desired scope is selected, you can say "Summarize my costs for the last 6 months?" A summary of costs for the selected scope is provided. You can follow up with questions to get more granular details, such as "How about the cost of VMs specifically?"

:::image type="content" source="media/analyze-cost-management/cost-management-summarize-costs.png" alt-text="Screenshot of Microsoft Copilot for Azure (preview) providing a summary of costs.":::

:::image type="content" source="media/analyze-cost-management/cost-management-vm-costs.png" alt-text="Screenshot showing Microsoft Copilot for Azure (preview) providing details about VM costs.":::

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot for Azure (preview).
- Learn more about [Microsoft Cost Management](/azure/cost-management-billing/costs/overview-cost-management).
- [Request access](https://aka.ms/MSCopilotforAzurePreview) to Microsoft Copilot for Azure (preview).
