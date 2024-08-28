---
title: Manage data collection rules (DCRs) and associations in Azure Monitor
description: Describes different options for viewing data collection rules (DCRs) and data collection rule associations (DCRA) in Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/18/2024
ms.reviewer: nikeist
---

# Manage data collection rules (DCRs) and associations in Azure Monitor
[Data collection rules (DCRs)](data-collection-rule-overview.md) are used to specify the data that you want to collect from your Azure resources and the configuration for how that data is collected. This article describes how to view the DCRs in your subscription and the resources that they are associated with. It also provides details on managing [data collection rule associations (DCRAs)](data-collection-rule-overview.md#data-collection-rule-associations-dcra).

> [!NOTE]
> This article describes how to manage DCRs and their associations with resources using the Azure portal. Details for creating the DCR itself are described in [Create and edit data collection rules (DCRs) in Azure Monitor](./data-collection-rule-create-edit.md). 
> 
> For alternate methods of working with DCRs and associations, see the following:
> - Azure CLI - [az monitor data-collection rule](/cli/azure/monitor/data-collection/rule)
> - PowerShell - [Az.Monitor](/powershell/module/az.monitor)

## View DCRs and add associations

To view your DCRs in the Azure portal, select **Data Collection Rules** under **Settings** on the **Monitor** menu.

:::image type="content" source="media/data-collection-rule-overview/view-data-collection-rules.png" lightbox="media/data-collection-rule-overview/view-data-collection-rules.png" alt-text="Screenshot that shows DCRs in the Azure portal.":::

Select a DCR to view its details, including the resources it's associated with. For some DCRs, you may need to use the **JSON view** to view its details. See [Create and edit data collection rules (DCRs) in Azure Monitor](./data-collection-rule-create-edit.md) for details on how you can modify them.

> [!NOTE]
> Although this view shows all DCRs in the specified subscriptions, selecting the **Create** button will create a data collection for Azure Monitor Agent. Similarly, this page will only allow you to modify DCRs for Azure Monitor Agent. For guidance on how to create and update DCRs for other workflows, see [Create and edit data collection rules (DCRs) in Azure Monitor](./data-collection-rule-create-edit.md).

Click the **Resources** tab to view the resources associated with the selected DCR. Click **Add** to add an association to a new resource. You can view and add resources using this feature whether or not you created the DCR in the Azure portal. 

:::image type="content" source="media/data-collection-rule-overview/view-data-collection-rules.png" lightbox="media/data-collection-rule-overview/view-data-collection-rules.png" alt-text="Screenshot that shows DCRs in the Azure portal.":::


## Preview DCR experience
A preview of the new Azure portal experience for DCRs is now available. The preview experience ties together DCRs and the resources they're associated with. You can either view the list by **Data collection rule**, which shows the number of resources associated with each DCR, or by **Resources**, which shows the count of DCRs associated with each resource.

Select the option on the displayed banner to enable this experience.

:::image type="content" source="media/data-collection-rule-view/preview-experience.png" alt-text="Screenshot of title bar to enable the preview experience for DCRs in the Azure portal." lightbox="media/data-collection-rule-view/preview-experience.png":::


### Data collection rule view
In the **Data collection rule** view, the **Resource count** represents the number of resources that have a [data collection rule association](./data-collection-rule-overview.md#data-collection-rule-associations-dcra) with the DCR. Click this value to open the **Resources** view for that DCR.

:::image type="content" source="media/data-collection-rule-view/data-collection-rules-view.png" alt-text="Screenshot of data collection rules view in  the preview experience for DCRs in the Azure portal." lightbox="media/data-collection-rule-view/data-collection-rules-view.png":::

### Resources view
The **Resources** view lists all Azure resources that match the selected filter, whether they have a DCR association or not. Tiles at the top of the view list the count of total resources listed, the number of resources not associated with a DCR, and the total number of DCRs matching the selected filter.

:::image type="content" source="media/data-collection-rule-view/resources-view.png" alt-text="Screenshot of resources view in the preview experience for DCRs in the Azure portal." lightbox="media/data-collection-rule-view/resources-view.png":::

**View DCRs for a resource**

The **Data collection rules** column represents the number of DCRs that are associated with each resource. Click this value to open a new pane listing the DCRs associated with the resource. 

:::image type="content" source="media/data-collection-rule-view/resources-view-associations.png" alt-text="Screenshot of the DCR associations for a resource in the resources view in  the preview experience for DCRs in the Azure portal." lightbox="media/data-collection-rule-view/resources-view-associations.png":::

> [!IMPORTANT]
> Not all DCRs are associated with resources. For example, DCRs used with the [Logs ingestion API](../logs/logs-ingestion-api-overview.md) are specified in the API call and do not use associations. These DCRs still appear in the view, but will have a **Resource Count** of 0.

**Create new DCR or associations with existing DCR**

Using the **Resources** view, you can create a new DCR for the selected resources or associate them with an existing DCR. Select the resources and then click one of the following options.

| Option | Description |
|:---|:---|
| Create a data collection rule | Launch the process to create a new DCR. The selected resources are automatically added as resources for the new DCR. See [Collect data with Azure Monitor Agent](../agents/azure-monitor-agent-data-collection.md) for details on this process. |
| Associate with existing data collection rule | Associate the selected resources with one or more existing DCRs. This opens a list of DCRs that can be associated with the current resource. This list only includes DCRs that are valid for the particular resource. For example, if the resource is a VM with the Azure Monitor agent (AMA) installed, only DCRs that process AMA data are listed.  |

:::image type="content" source="media/data-collection-rule-view/resources-view-associate.png" alt-text="Screenshot of the create association button in the resources view in  the preview experience for DCRs in the Azure portal." lightbox="media/data-collection-rule-view/resources-view-associate.png":::



## Azure Policy
Using [Azure Policy](../../governance/policy/overview.md), you can associate a DCR with multiple resources at scale. When you create an assignment between a resource group and a built-in policy or initiative, associations are created between the DCR and each resource of the assigned type in the resource group, including any new resources as they're created. Azure Monitor provides a simplified user experience to create an assignment for a policy or initiative for a particular DCR, which is an alternate method to creating the assignment using Azure Policy directly.

> [!NOTE]
> A **policy** in Azure Policy is a single rule or condition that resources in Azure must comply with. For example, there is a built-in policy called **Configure Windows Machines to be associated with a Data Collection Rule or a Data Collection Endpoint**.
> 
> An **initiative** is a collection of policies that are grouped together to achieve a specific goal or purpose. For example, there is an initiative called **Configure Windows machines to run Azure Monitor Agent and associate them to a Data Collection Rule** that includes multiple policies to install and configure the Azure Monitor agent.

From the DCR in the Azure portal, select **Policies (Preview)**. This will open a page that lists any assignments with the current DCR and the compliance state of included resources. Tiles across the top provide compliance metrics for all resources and assignments.

:::image type="content" source="media/data-collection-rule-view/data-collection-rule-policies.png" alt-text="Screenshot of DCR policies view." lightbox="media/data-collection-rule-view/data-collection-rule-policies.png":::

To create a new assignment, click either **Assign Policy** or **Assign Initiative**. 

:::image type="content" source="media/data-collection-rule-view/data-collection-rule-new-policy.png" alt-text="Screenshot of new policy assignment blade." lightbox="media/data-collection-rule-view/data-collection-rule-new-policy.png":::

| Setting | Description |
|:---|:---|
| Subscription | The subscription with the resource group to use as the scope. |
| Resource group | The resource group to use as the scope. The DCR will be assigned to all resource in this resource group, depending on the resource group managed by the definition. |
| Policy/Initiative definition | The definition to assign. The dropdown will include all definitions in the subscription that accept DCR as a parameter. |
| Assignment Name | A name for the assignment. Must be unique in the subscription. |
| Description | Optional description of the assignment. |
| Policy Enforcement | The policy is only actually applied if enforcement is enabled. If disabled, only assessments for the policy are performed. |

Once an assignment is created, you can view its details by clicking on it. This will allow you to edit the details of the assignment and also to create a remediation task. 

:::image type="content" source="media/data-collection-rule-view/data-collection-rule-assignment-details.png" alt-text="Screenshot of assignment details." lightbox="media/data-collection-rule-view/data-collection-rule-assignment-details.png":::

> [!IMPORTANT]
> The assignment won't be applied to existing resources until you create a remediation task. For more information, see [Remediate non-compliant resources with Azure Policy](../../governance/policy/how-to/remediate-resources.md).


## Next steps
See the following articles for additional information on how to work with DCRs.

- [Data collection rule structure](data-collection-rule-structure.md) for a description of the JSON structure of DCRs and the different elements used for different workflows.
- [Sample data collection rules (DCRs)](data-collection-rule-samples.md) for sample DCRs for different data collection scenarios.
- [Create and edit data collection rules (DCRs) in Azure Monitor](./data-collection-rule-create-edit.md) for different methods to create DCRs for different data collection scenarios.
- [Azure Monitor service limits](../service-limits.md#data-collection-rules) for limits that apply to each DCR.
