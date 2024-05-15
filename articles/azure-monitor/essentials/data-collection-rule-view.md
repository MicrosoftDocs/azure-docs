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
There are multiple ways to view the DCRs in your subscription.

### [Portal](#tab/portal)
To view your DCRs in the Azure portal, select **Data Collection Rules** under **Settings** on the **Monitor** menu.

:::image type="content" source="media/data-collection-rule-overview/view-data-collection-rules.png" lightbox="media/data-collection-rule-overview/view-data-collection-rules.png" alt-text="Screenshot that shows DCRs in the Azure portal.":::

Select a DCR to view its details. For DCRs supporting VMs, you can view and modify its associations and the data that it collects. For other DCRs, use the **JSON view** to view the details of the DCR. See [Create and edit data collection rules (DCRs) in Azure Monitor](./data-collection-rule-create-edit.md) for details on how you can modify them.

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

## Next steps
See the following articles for additional information on how to work with DCRs.

- [Data collection rule structure](data-collection-rule-structure.md) for a description of the JSON structure of DCRs and the different elements used for different workflows.
- [Sample data collection rules (DCRs)](data-collection-rule-samples.md) for sample DCRs for different data collection scenarios.
- [Create and edit data collection rules (DCRs) in Azure Monitor](./data-collection-rule-create-edit.md) for different methods to create DCRs for different data collection scenarios.
- [Azure Monitor service limits](../service-limits.md#data-collection-rules) for limits that apply to each DCR.
