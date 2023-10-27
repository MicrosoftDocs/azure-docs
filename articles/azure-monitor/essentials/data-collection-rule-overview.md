---
title: Data collection rules in Azure Monitor
description: Overview of data collection rules (DCRs) in Azure Monitor including their contents and structure and how you can create and work with them.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 08/08/2023
ms.reviewer: nikeist
ms.custom: references_regions
---

# Data collection rules in Azure Monitor
Data collection rules (DCRs) are sets of instructions supporting [data collection in Azure Monitor](../essentials/data-collection.md). They provide a consistent way to define and customize different data collection scenarios. Depending on the scenario, DCRs may specify what data should be collected, how to transform that data, and where to send it. 

DCRs are stored in Azure so that you can centrally manage them. Different components of a data collection workflow will access the DCR for particular information that it requires. In some cases, you can use the Azure portal to configure data collection, and Azure Monitor will create and manage the DCR for you. Other scenarios will require you to create your own DCR. You may also choose to customize a DCR to meet your required functionality.


## Basic operation
One example of how DCRs are used is the Logs Ingestion API that allows you to send custom data to Azure Monitor. This scenario is illustrated in the following diagram. Prior to using the API, you create a DCR that defines the structure of the data that your going to send and the Log Analytics workspace and table that will receive the data. If the data needs to be formatted before it's stored, you can include a [transformation](data-collection-transformations.md) in the DCR.

Each call to the API specifies the DCR to use, and Azure Monitor references this DCR to determine what to do with the incoming data. If your requirements change, you can modify the DCR without making any changes the application sending the data.

 
:::image type="content" source="media/data-collection-transformations/transformation-data-ingestion-api.png" lightbox="media/data-collection-transformations/transformation-data-ingestion-api.png" alt-text="Diagram that shows ingestion-time transformation for custom application by using logs ingestion API." border="false":::

## Data collection rule associations (DCRAs)
Data collection rule associations (DCRAs) associate a DCR with a virtual machine (VM) using the Azure Monitor agent (AMA). A single VM can be associated with multiple DCRs, and a single DCR can be used with multiple VMs. 

The following diagram illustrates data collection for the Azure Monitor agent. When the agent is installed, it connects to Azure to retrieve any DCRs that are associated with it. It then references the data sources section of each DCR to determine what data to collect from the machine. When the agent delivers this data, to Azure Monitor references other sections of the DCR to determine whether a transformation should be applied to then the workspace and table to send it to.

:::image type="content" source="media/data-collection-transformations/transformation-azure-monitor-agent.png" lightbox="media/data-collection-transformations/transformation-azure-monitor-agent.png" alt-text="Diagram that shows ingestion-time transformation for Azure Monitor Agent." border="false":::



## View data collection rules

### [Portal](#tab/portal)
To view your DCRs in the Azure portal, select **Data Collection Rules** under **Settings** on the **Monitor** menu.

> [!NOTE]
> Although this view shows all DCRs in the specified subscriptions, selecting the **Create** button will create a data collection for Azure Monitor Agent. Similarly, this page will only allow you to modify DCRs for Azure Monitor Agent. For guidance on how to create and update DCRs for other workflows, see [Create and edit data collection rules (DCRs) in Azure Monitor](./data-collection-rule-create-edit.md).

:::image type="content" source="media/data-collection-rule-overview/view-data-collection-rules.png" lightbox="media/data-collection-rule-overview/view-data-collection-rules.png" alt-text="Screenshot that shows DCRs in the Azure portal.":::

### [PowerShell](#tab/powershell)
[Get-AzDataCollectionRule](/powershell/module/az.monitor/get-azdatacollectionrule)

Return all DCRs.

```powershell
Get-AzDataCollectionRule 
```

Return DCRs associated with a VM.

```powershell
get-azDataCollectionRuleAssociation -TargetResourceId /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/my-vm | foreach {Get-azDataCollectionRule -RuleId $_.DataCollectionRuleId }
```

### [CLI](#tab/cli)
 Create DCRs and associations with the [Azure CLI](/cli/azure/monitor/data-collection/rule).

Return all DCRs.

```azurecli
az monitor data-collection rule list
```

Return DCR associations for a VM.

```azurecli
az monitor data-collection rule association list --resource "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/my-vm "
```

---


## Structure of a DCR
Data collection rules are formatted in JSON. For a description of this structure and the different elements used for different workflows, see [Data collection rule structure](data-collection-rule-structure.md). For sample DCRs, see [Sample data collection rules (DCRs)](data-collection-rule-samples.md).

## Create and edit DCRs
See [Create and edit data collection rules (DCRs) in Azure Monitor](./data-collection-rule-create-edit.md).

## Limits
For limits that apply to each DCR, see [Azure Monitor service limits](../service-limits.md#data-collection-rules).

## Supported regions
Data collection rules are available in all public regions where Log Analytics workspaces and the Azure Government and China clouds are supported. Air-gapped clouds aren't yet supported.

**Single region data residency** is a preview feature to enable storing customer data in a single region and is currently only available in the Southeast Asia Region (Singapore) of the Asia Pacific Geo and the Brazil South (Sao Paulo State) Region of the Brazil Geo. Single-region residency is enabled by default in these regions.

## Data resiliency and high availability
A rule gets created and stored in a particular region and is backed up to the [paired-region](../../availability-zones/cross-region-replication-azure.md#azure-paired-regions) within the same geography. The service is deployed to all three [availability zones](../../availability-zones/az-overview.md#availability-zones) within the region. For this reason, it's a *zone-redundant service*, which further increases availability.

## Next steps

- [Read about the detailed structure of a data collection rule](data-collection-rule-structure.md)
- [Get details on transformations in a data collection rule](data-collection-transformations.md)
