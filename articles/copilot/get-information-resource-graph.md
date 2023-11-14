---
title:  Get resource information using Microsoft Copilot for Azure (preview)
description: Learn about scenarios where Microsoft Copilot for Azure (preview) can help with Azure Resource Graph.
ms.date: 11/15/2023
ms.topic: conceptual
ms.service: azure
ms.custom:
  - ignite-2023
  - ignite-2023-copilotinAzure
ms.author: jenhayes
author: JnHs
---

# Get resource information using Microsoft Copilot for Azure (preview)

You can ask Microsoft Copilot for Azure (preview) questions about your Azure resources and cloud environment. Using the combined power of large language models (LLMs) and [Azure Resource Graph](/azure/governance/resource-graph/overview), Microsoft Copilot for Azure (preview) helps you author Azure Resource Graph queries. You provide input using natural language from anywhere in the Azure portal, and Microsoft Copilot for Azure (preview) returns a working query that you can use with Azure Resource Graph. Azure Resource Graph also acts as an underpinning mechanism for other scenarios that require real-time access to your resource inventory.

Azure Resource Graph's query language is based on the [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/) used by Azure Data Explorer. However, you don't need to be familiar with KQL in order to use Microsoft Copilot for Azure (preview) to retrieve information about your Azure resources and environment. Experienced query authors can also use Microsoft Copilot for Azure to help streamline their query generation process.

While a high level of accuracy is typical, we strongly advise you to review the generated queries to ensure they meet your expectations.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

## Sample prompts

Here are a few examples of the kinds of prompts you can use to generate Azure Resource Graph queries. Modify these prompts based on your real-life scenarios, or try additional prompts to create different kinds of queries.

- "Show me all resources that are noncompliant"
- "List all virtual machines lacking enabled replication resources"
- "List all the updates applied to my Linux virtual machines"
- "List all storage accounts that are accessible from the internet"
- "List all virtual machines that are not running now"
- "Write a query that finds all changes for last 7 days."
- "Help me write an ARG query that looks up all virtual machines scale sets, sorted by creation date descending"
- "What are the public IPs of my VMs?"
- "Show me all my storage accounts in East US?"
- "List all my Resource Groups and its subscription."
- "Write a query that finds all resources that were created yesterday."

## Examples

You can Ask Microsoft Copilot for Azure (preview) to write queries with prompts like "Write a query to list my virtual machines with their public interface and public IP.

:::image type="content" source="media/get-information-resource-graph/azure-resource-graph-explorer-list-vms.png" alt-text="Screenshot of Microsoft Copilot for Azure responding to a request to list VMs.":::

If the generated query isn't exactly what you want, you can ask Microsoft Copilot for Azure (preview) to make changes. In this example, the first prompt is "Write a KQL query to list my VMs by OS." After the query is shown, the additional prompt "Sorted alphabetically" results in a revised query that lists the OS alphabetically by name.

:::image type="content" source="media/get-information-resource-graph/azure-resource-graph-query-refine.png" alt-text="Screenshot of Microsoft Copilot for Azure (preview) generating and then revising a query to list VMs by OS.":::

You can view the generated query in Azure Resource Graph Explorer by selecting **Run**. For example, you can ask "What resources were created in the last 24 hours?" After Microsoft Copilot for Azure (preview) generates the query, select **Run** to see the query and results in Azure Resource Graph Explorer.

:::image type="content" source="media/get-information-resource-graph/azure-resource-graph-last-24-hours.png" lightbox="media/get-information-resource-graph/azure-resource-graph-last-24-hours.png" alt-text="Screenshot showing Microsoft Copilot for Azure generating a query and showing results in Azure Resource Graph Explorer.":::

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot for Azure (preview).
- Learn more about [Azure Resource Graph](/azure/governance/resource-graph/overview).
- [Request access](https://aka.ms/MSCopilotforAzurePreview) to Microsoft Copilot for Azure (preview).
