---
title: Data collection rules in Azure Monitor
description: Overview of data collection rules (DCRs) in Azure Monitor including their contents and structure and how you can create and work with them.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 11/15/2023
ms.reviewer: nikeist
ms.custom: references_regions
---

# Data collection rules in Azure Monitor
Data collection rules (DCRs) are sets of instructions supporting [data collection in Azure Monitor](../essentials/data-collection.md). They provide a consistent and centralized way to define and customize different data collection scenarios. Depending on the scenario, DCRs specify such details as what data should be collected, how to transform that data, and where to send it. 

DCRs are stored in Azure so that you can centrally manage them. Different components of a data collection workflow will access the DCR for particular information that it requires. In some cases, you can use the Azure portal to configure data collection, and Azure Monitor will create and manage the DCR for you. Other scenarios will require you to create your own DCR. You may also choose to customize an existing DCR to meet your required functionality.

## Data collection in Azure Monitor
DCRs are part of a new [ETL](/azure/architecture/data-guide/relational-data/etl)-like data collection pipeline being implemented by Azure Monitor that improves on legacy data collection methods. This process uses a common data ingestion pipeline for all data sources and provides a standard method of configuration that's more manageable and scalable than current methods. Specific advantages of the new data collection include the following:

- Common set of destinations for different data sources.
- Ability to apply a transformation to filter or modify incoming data before it's stored.
- Consistent method for configuration of different data sources.
- Scalable configuration options supporting infrastructure as code and DevOps processes.

When implementation is complete, all data collected by Azure Monitor will use the new data collection process and be managed by DCRs. Currently, only certain data collection methods support the ingestion pipeline, and they may have limited configuration options. There's no difference between data collected with the new ingestion pipeline and data collected using other methods. The data is all stored together as [Logs](../logs/data-platform-logs.md) and [Metrics](data-platform-metrics.md), supporting Azure Monitor features such as log queries, alerts, and workbooks. The only difference is in the method of collection.


## Data collection rule associations (DCRAs)
Data collection rule associations (DCRAs) associate a DCR with an object being monitored, for example a virtual machine with the Azure Monitor agent (AMA). A single object can be associated with multiple DCRs, and a single DCR can be associated with multiple objects.


## View data collection rules
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


## Data collection scenarios
This section describes the data collection scenarios that are currently supported using DCR and the new data ingestion pipeline.

### Azure Monitor agent

>[!IMPORTANT]
>The Log Analytics agent is on a **deprecation path** and won't be supported after **August 31, 2024**. Any new data centers brought online after January 1 2024 will not support the Log Analytics agent. If you use the Log Analytics agent to ingest data to Azure Monitor, [migrate to the new Azure Monitor agent](../agents/azure-monitor-agent-migration.md) prior to that date.
>

The following diagram illustrates data collection for the Azure Monitor agent. When the agent is installed, it connects to Azure Monitor to retrieve any DCRs that are associated with it. It then references the data sources section of each DCR to determine what data to collect from the machine. When the agent delivers this data,  Azure Monitor references other sections of the DCR to determine whether a transformation should be applied to it and then the workspace and table to send it to.

The diagram below shows data collection for the [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) running on a virtual machine. In this scenario, the DCR specifies events and performance data to collect from the agent machine, a transformation to filter and modify the data after its collected, and a Log Analytics workspace to send the transformed data. To implement this scenario, you create an association between the DCR and the agent. One agent can be associated with multiple DCRs, and one DCR can be associated with multiple agents.

:::image type="content" source="media/data-collection-transformations/transformation-azure-monitor-agent.png" lightbox="media/data-collection-transformations/transformation-azure-monitor-agent.png" alt-text="Diagram showing data collection for Azure Monitor agent." border="false":::

:::image type="content" source="media/data-collection-rule-overview/overview-agent.png" lightbox="media/data-collection-rule-overview/overview-agent.png" alt-text="Diagram that shows basic operation for DCR using Azure Monitor Agent." border="false":::


### Log ingestion API
The diagram below shows data collection for the [Logs ingestion API](../logs/logs-ingestion-api-overview.md), which allows you to send data to a Log Analytics workspace from any REST client. In this scenario, the API call connects to a [data collection endpoint (DCE)](data-collection-endpoint-overview.md) and specifies a DCR to accept its incoming data. The DCR understands the structure of the incoming data, includes a transformation that ensures that the data is in the format of the target table, and specifies a workspace and table to send the transformed data.

:::image type="content" source="media/data-collection-transformations/transformation-data-ingestion-api.png" lightbox="media/data-collection-transformations/transformation-data-ingestion-api.png" alt-text="Diagram showing data collection for custom application using logs ingestion API." border="false":::

See [Logs ingestion API in Azure Monitor (Preview)](../logs/logs-ingestion-api-overview.md) for details on the Logs ingestion API.








## Supported regions
Data collection rules are available in all public regions where Log Analytics workspaces and the Azure Government and China clouds are supported. Air-gapped clouds aren't yet supported.

**Single region data residency** is a preview feature to enable storing customer data in a single region and is currently only available in the Southeast Asia Region (Singapore) of the Asia Pacific Geo and the Brazil South (Sao Paulo State) Region of the Brazil Geo. Single-region residency is enabled by default in these regions.

## Data resiliency and high availability
A DCR gets created and stored in a particular region and is backed up to the [paired-region](../../availability-zones/cross-region-replication-azure.md#azure-paired-regions) within the same geography. The service is deployed to all three [availability zones](../../availability-zones/az-overview.md#availability-zones) within the region. For this reason, it's a *zone-redundant service*, which further increases availability.

## Next steps
See the following articles for additional information on how to work with DCRs.

- [Data collection rule structure](data-collection-rule-structure.md) for a description of the JSON structure of DCRs and the different elements used for different workflows.
- [Sample data collection rules (DCRs)](data-collection-rule-samples.md) for sample DCRs for different data collection scenarios.
- [Create and edit data collection rules (DCRs) in Azure Monitor](./data-collection-rule-create-edit.md) for different methods to create DCRs for different data collection scenarios.
- [Azure Monitor service limits](../service-limits.md#data-collection-rules) for limits that apply to each DCR.
