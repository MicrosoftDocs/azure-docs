---
title: View data collection rules in Azure Monitor
description: Describes different options for viewing data collection rules (DCRs) and data collection rule associations (DCRA) in Azure Monitor.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/18/2024
ms.reviewer: nikeist
---

# View data collection rules in Azure Monitor
There are multiple ways to view the DCRs in your subscription and the resources that they are associated with. 

### [Portal](#tab/portal)
To view your DCRs in the Azure portal, select **Data Collection Rules** under **Settings** on the **Monitor** menu.

:::image type="content" source="media/data-collection-rule-overview/view-data-collection-rules.png" lightbox="media/data-collection-rule-overview/view-data-collection-rules.png" alt-text="Screenshot that shows DCRs in the Azure portal.":::

Select a DCR to view its details, including the resources it's associated with. For some DCRs, you may need to use the **JSON view** to view its details. See [Create and edit data collection rules (DCRs) in Azure Monitor](./data-collection-rule-create-edit.md) for details on how you can modify them.

> [!NOTE]
> Although this view shows all DCRs in the specified subscriptions, selecting the **Create** button will create a data collection for Azure Monitor Agent. Similarly, this page will only allow you to modify DCRs for Azure Monitor Agent. For guidance on how to create and update DCRs for other workflows, see [Create and edit data collection rules (DCRs) in Azure Monitor](./data-collection-rule-create-edit.md).



### [PowerShell](#tab/powershell)
Use [Get-AzDataCollectionRule](/powershell/module/az.monitor/get-azdatacollectionrule) to retrieve the DCRs in your subscription.


```powershell
Get-AzDataCollectionRule 
```

Use [Get-azDataCollectionRuleAssociation](/powershell/module/az.monitor/get-azdatacollectionruleassociation) to retrieve the DCRs associated with a VM. 

```powershell
get-azDataCollectionRuleAssociation -TargetResourceId /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/my-vm | foreach {Get-azDataCollectionRule -RuleId $_.DataCollectionRuleId }
```

### [CLI](#tab/cli)
Use [az monitor data-collection rule](/cli/azure/monitor/data-collection/rule) to work the DCRs using Azure CLI.

Use the following to return all DCRs in your subscription.

```azurecli
az monitor data-collection rule list
```

Use the following to return DCR associations for a VM.

```azurecli
az monitor data-collection rule association list --resource "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/my-vm "
```
---



## Preview DCR experience
A preview of the new Azure portal experience for DCRs is now available. Select the option on the displayed banner to enable this experience.

:::image type="content" source="media/data-collection-rule-view/preview-experience.png" alt-text="Screenshot of title bar to enable the preview experience for DCRs in the Azure portal." lightbox="media/data-collection-rule-view/preview-experience.png":::

The preview experience ties together DCRs and the resources they're associated with. You can either view the list by **Data collection rule**, which shows the number of resources associated with each DCR, or by **Resources**, which shows the count of DCRs associated with each resource.


### Data collection rule view
In the **Data collection rule** view, the **Resource count** represents the number of resources that have a [data collection rule association](./data-collection-rule-overview.md#data-collection-rule-associations-dcra) with the DCR. Click this value to open the **Resources** view for that DCR.

:::image type="content" source="media/data-collection-rule-view/data-collection-rules-view.png" alt-text="Screenshot of data collection rules view in  the preview experience for DCRs in the Azure portal." lightbox="media/data-collection-rule-view/data-collection-rules-view.png":::

### Resources view
The **Resources** view lists all Azure resources that match the selected filter, whether they have a DCR association or not. Tiles at the top of the view list the count of total resources listed, the number of resources not associated with a DCR, and the total number of DCRs matching the selected filter.

:::image type="content" source="media/data-collection-rule-view/resources-view.png" alt-text="Screenshot of resources view in the preview experience for DCRs in the Azure portal." lightbox="media/data-collection-rule-view/resources-view.png":::

The **Data collection rules** column represents the number of DCRs that are associated with each resource. Click this value to open a new pane listing the DCRs associated with the resource. 

:::image type="content" source="media/data-collection-rule-view/resources-view-associations.png" alt-text="Screenshot of the DCR associations for a resource in the resources view in  the preview experience for DCRs in the Azure portal." lightbox="media/data-collection-rule-view/resources-view-associations.png":::

> [!IMPORTANT]
> Not all DCRs are associated with resources. For example, DCRs used with the [Logs ingestion API](../logs/logs-ingestion-api-overview.md) are specified in the API call and do not use associations. These DCRs still appear in the view, but will have a **Resource Count** of 0.

### Create new associations
Using the **Resources** view, you can create new associations to one or more DCRs for a particular resource. Select the resource and then click **Associate to existing data collection rules**.

:::image type="content" source="media/data-collection-rule-view/resources-view-associate.png" alt-text="Screenshot of the create association button in the resources view in  the preview experience for DCRs in the Azure portal." lightbox="media/data-collection-rule-view/resources-view-associate.png":::

This opens a list of DCRs that can be associated with the current resource. This list only includes DCRs that are valid for the particular resource. For example, if the resource is a VM with the Azure Monitor agent (AMA) installed, only DCRs that process AMA data are listed. 

:::image type="content" source="media/data-collection-rule-view/resources-view-create-associations.png" alt-text="Screenshot of the create associations view in the resources view in the preview experience for DCRs in the Azure portal." lightbox="media/data-collection-rule-view/resources-view-create-associations.png":::

Click **Review & Associate** to create the association.

## Next steps
See the following articles for additional information on how to work with DCRs.

- [Data collection rule structure](data-collection-rule-structure.md) for a description of the JSON structure of DCRs and the different elements used for different workflows.
- [Sample data collection rules (DCRs)](data-collection-rule-samples.md) for sample DCRs for different data collection scenarios.
- [Create and edit data collection rules (DCRs) in Azure Monitor](./data-collection-rule-create-edit.md) for different methods to create DCRs for different data collection scenarios.
- [Azure Monitor service limits](../service-limits.md#data-collection-rules) for limits that apply to each DCR.
