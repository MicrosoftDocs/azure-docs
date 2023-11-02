---
title:  Get resource information using Microsoft Copilot for Azure (preview)
description: Learn about scenarios where Microsoft Copilot for Azure (preview) can help with Azure Resource Graph.
ms.date: 11/15/2023
ms.topic: conceptual
ms.service: azure
ms.author: jenhayes
author: JnHs
---

# Get resource information using Microsoft Copilot for Azure (preview)

You can ask Microsoft Copilot for Azure (preview) questions about your Azure resources and environment. Using retrieval-augmented generation and cognitive search, Microsoft Copilot for Azure creates [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/) queries for use within [Azure Resource Graph](/azure/governance/resource-graph/overview). Azure Resource Graph also acts as an underpinning mechanism for other scenarios that require real-time access to your resource inventory.

You don't need to be familiar with KQL in order to use Microsoft Copilot for Azure to retrieve information about your Azure resources and environment from anywhere in the Azure portal. Experienced KQL authors can also use Microsoft Copilot for Azure to help streamline your query generation process.

While a high level of accuracy is typical, we strongly advise you to review the generated queries to ensure they meet your expectations.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

## Sample prompts

Here are a few examples of the kinds of prompts you can use to generate Kusto queries with Azure Resource Graph. Modify these prompts based on your real-life scenarios, or try additional prompts to create different kinds of queries.

- "Show me all resources that are noncompliant"
- "Write a query that finds all VMs that do NOT have Replication enabledResources"
- "Write a query that finds all changes for last 7 days in my resource Group = Prod"
- "Help me write an ARG query that looks up all virtual machines scales sets, sorted by creation date descending"

## Examples

Ask "What resources do I use the most?" Microsoft Copilot in Azure (preview) generates a query and shows some of your most frequently used resources.

:::image type="content" source="media/get-information-resource-graph/azure-resource-graph-most-used-copilot.png" lightbox="media/get-information-resource-graph/azure-resource-graph-most-used-copilot.png" alt-text="Screenshot of Microsoft Copilot for Azure responding to a query about which resources are used most.":::

In some cases, you might want to view the generated query in Azure Resource Graph Explorer. To do so, select the **Open in Resource Graph Explorer** button. For example, you can ask "List my virtual machines with their network interface and public IP", then **Open in Resource Graph Explorer**.

:::image type="content" source="media/get-information-resource-graph/azure-resource-graph-explorer-list-vms.png" lightbox="media/get-information-resource-graph/azure-resource-graph-explorer-list-vms.png"  alt-text="Screenshot of Microsoft Copilot for Azure responding to a request to list VMs with the query shown in Azure Resource Graph Explorer.":::

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot for Azure (preview).
- Learn more about [Azure Resource Graph](/azure/governance/resource-graph/overview).
- [Request access](https://aka.ms/MSCopilotforAzurePreview) to Microsoft Copilot for Azure (preview).
