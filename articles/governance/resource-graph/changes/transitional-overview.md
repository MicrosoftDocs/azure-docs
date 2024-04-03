---
title: Azure Monitor Change Analysis vs. Azure Resource Graph Change Analysis (preview)
description: Learn the differences between Azure Monitor and Azure Resource Graph Change Analysis.
author: iancarter-msft
ms.author: iancarter
ms.date: 03/19/2024
ms.topic: conceptual
---

# Azure Monitor Change Analysis vs. Azure Resource Graph Change Analysis (preview)

The Azure portal Change Analysis experience is in the process of moving from Azure Monitor to Azure Resource Graph. During this transition, you'll see two options for Change Analysis when you search for it in the Azure portal:

:::image type="content" source="./media/transitional-overview/change-analysis-portal-search.png" alt-text="Screenshot of the search results for Change Analysis in the Azure portal.":::

1. **Azure Resource Graph Change Analysis (preview)**  

    The Change Analysis (preview) service presented by Resource Graph sets a new direction for all Change Analysis user experiences, directly querying Azure Resource Graph for all resource change data. This experience of Change Analysis provides:
    
    - An onboarding-free experience, giving all subscriptions and resources access to change history
    - Tenant-wide querying, rather than select subscriptions
    - Change history summaries aggregated into cards at the top of the new Resource Graph Change Analysis blade
    - More extensive filtering capabilities
    - [Improved accuracy and relevance of "changed by" change information](https://techcommunity.microsoft.com/t5/azure-governance-and-management/announcing-the-public-preview-of-change-actor/ba-p/4076626)

    [Learn how to view the new Change Analysis experience in the portal.](./view-resource-changes.md)

1. **Azure Monitor Change Analysis** 

    The [Change Analysis service presented by Azure Monitor](../../../azure-monitor/change/change-analysis.md) requires you to query a resource provider, called `Microsoft.ChangeAnalysis`, which provides a simple API that abstracts resource change data from the Azure Resource Graph. 
    
    While this service successfully helped thousands of Azure customers, the `Microsoft.ChangeAnalysis` resource provider has [limitations](../../../azure-monitor/change/change-analysis.md#limitations) that prevent it from servicing the needs and scale of all Azure customers across all public and sovereign clouds.



- **Programmatic callers:** Programmatic callers need to use the `Microsoft.ResourceGraph/resources` API, instead of the `Microsoft.ChangeAnalysis/*` APIs 

ARG Change analysis does show emailId etc.. this is good enough or better than just a display name. Only for applications, it is not resolved.

GUIDs are preferred since they can use it with automation/scripting, as opposed to display names

In fact this is advantage for ARG CC customers that they can now see this information (who/how or Actor model), which we recently announcemented.

## Architectural differences

The transition from Azure Monitor to Azure Resource Graph highlights some key architectural differences in how Change Analysis works. 

### How data is collected

The following table outlines the differences between how Azure Monitor Change Analysis and Azure Resource Graph Change Analysis collect resource change data.

| Scenario | Azure Monitor | Azure Resource Graph |
| -------- | ------------- | -------------------- |
| Change data in the `resourceChanges` table | [Change Analysis queries for data from several data sources, including Azure Resource Manager using Azure Resource Graph.](../../../azure-monitor/change/change-analysis.md#azure-resource-manager-resource-properties-changes) Azure Resource Manager notifies Azure Resource Graph via the resource provider when a resource is created, updated, or deleted. The `Microsoft.ChangeAnalysis` resource provider specifies whether a resource should be tracked in a special configuration file. | Change Analysis notifies Azure Resource Graph when a resource is created, updated, or deleted. Azure Resource Graph Change Analysis ingests data into Resource Graph for queryability and powering the portal experience. |
| Change data in other tables | Change Analysis queries every six hours for the latest state of resources in subscriptions previously onboarded to the `Microsoft.ChangeAnalysis` resource provider. If the resource's state has changed since the previous check, then a single change is calculated. | Currently an opt-in feature. Each resource provider must update their services to push data to Azure Resource Graph when these resources types are created, updated, or deleted via the Azure Resource Manager control plane. For these resource types, you can expect [certain known limitations for changes saved in the `resourceChanges` table.](./resource-graph-changes.md#limitations) |

"Change data in other tables" should just be phrased as pull (Azure monitor CA) vs push (ARG CA).
In fact ARG echo system supports pull model (reconciliation) as well, if the RP supports LIST apis for given type. We can adjust frequency as well. In such a case RP doesn't have to push.

So ARG CA supports both models. 
and there is advantage when RPs are pushing notifications, since the updates are available & shown to user in real-time.
Overall IMO this is very implementation detail and not correct as I called out above.
Please capture in granular details like this.

API is actually advantage that they can query data in using highly performant API that is powered by ARG. We also have another set of APIs, similar to Microsoft.ChangeAnalysis. But they are slow.
GET/LIST Microsoft.Resources/Changes
GET/LIST Microsoft.Resources/Snapshots

- **No `Microsoft.Web/sites`-specific data,** such as:
  - Configuration changes
  - App Settings changes
  - Environment variables changes
  - File changes


## Limitations

Azure Resource Graph Change Analysis currently presents some known limitations.

- Changes made to an application resource do not 
- Changes made to a resource's data plane API, such as writing data to a table in a storage account, are not observed by Azure Resource Graph.



## Next steps

> [!div class="nextstepaction"]
> [Get resource changes](../how-to/get-resource-changes.md)