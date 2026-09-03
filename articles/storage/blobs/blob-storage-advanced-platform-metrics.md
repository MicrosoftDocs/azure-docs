---
title: Advanced platform metrics for Azure Blob Storage (preview)
description: Learn how to use advanced platform metrics to gain container-level capacity insights for Azure Blob Storage, including per-container storage size and object count.
recommendations: false
author: derdanu
ms.service: azure-blob-storage
ms.topic: concept-article
ms.author: normesta
ms.date: 03/10/2026
ms.custom:
  - "monitoring"
  - sfi-image-nochange
# Customer intent: "As a storage administrator, I want to use advanced platform metrics to monitor container-level capacity in Azure Blob Storage, so that I can optimize performance, manage costs, and support operational planning."
---

# Advanced platform metrics for Azure Blob Storage (preview)

> [!IMPORTANT]
> Advanced platform metrics for Azure Blob Storage is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Advanced platform metrics provides container-level capacity insights for Azure Blob Storage. This feature extends Azure Monitor's platform metrics to include per-container storage size and object count, helping you optimize performance, manage costs, and support operational planning.

## About advanced platform metrics

Advanced platform metrics provides deeper visibility into Azure Storage by adding granular telemetry beyond standard account-level metrics. By using advanced platform metrics, you get **container-level capacity metrics**, including per-container storage size and object count.

These insights help you:

- **Optimize performance** by understanding storage distribution across containers.
- **Manage costs** by identifying containers that consume the most capacity.
- **Support operational planning** with detailed capacity data at the container level.

Once you enable advanced platform metrics, you consume the metrics the same way you do with existing Azure platform metrics. Querying, dashboarding, and alerting work just like platform metrics today.

## Available metrics

The following container-level metrics are available with advanced platform metrics:

| Metric | Description | Unit |
|---|---|---|
| Container Blob Capacity | The amount of storage used by a container. | Bytes |
| Container Blob Count | The number of blob objects in a container. | Count |

Both metrics support the **ContainerName** dimension, which you use to split and filter results by individual containers. The metrics include current versions, previous versions, and soft-deleted blobs.

## Prerequisites

- An Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/free/).
- An Azure Storage account with Blob Storage. If you need to create one, see [Create a storage account](/azure/storage/common/storage-account-create).
- PowerShell 5.1 or later, or Azure CLI installed.
- Install the **Az.Storage** preview PowerShell module (with admin privileges):

  1. Install the latest PowerShellGet:

     ```powershell
     Install-Module PowerShellGet -Repository PSGallery -Force
     ```

  2. Close and reopen the PowerShell console.

  3. Install Az.Storage preview module:

     ```powershell
     Install-Module Az.Storage -Repository PsGallery -RequiredVersion 9.6.3-preview -AllowClobber -AllowPrerelease -Force
     ```

 
## Enable advanced platform metrics

To use advanced platform metrics, create a rule on your storage account. Rules define which containers emit capacity metrics.

> [!NOTE]
> Depending on the size of the storage account, it can take up to six hours for changes to container level capacity metric settings to be reflected. This delay includes enabling, updating, and disabling these metrics.

### [PowerShell](#tab/azure-powershell)

#### Authenticate

```powershell
Connect-AzAccount
```

#### Create a rule for all containers

To enable container-level capacity metrics for all containers in a storage account, run the following command:

```powershell
Set-AzStorageAdvancedPlatformMetric `
  -ResourceGroupName <resource-group-name> `
  -AccountName <storage-account-name> `
  -RuleConfigFilterType AllContainersFilter `
  -Enabled
```

#### Create a rule for specific containers

To enable metrics only for specific containers, use the `ContainerListFilter` filter type:

```powershell
Set-AzStorageAdvancedPlatformMetric `
  -ResourceGroupName <resource-group-name> `
  -AccountName <storage-account-name> `
  -RuleConfigFilterType ContainerListFilter `
  -RuleConfigFilterValue "container1","container2" `
  -Enabled
```

#### Create a rule by container prefix

To enable metrics for containers that match a prefix, use the `ContainerPrefixFilter` filter type:

```powershell
Set-AzStorageAdvancedPlatformMetric `
  -ResourceGroupName <resource-group-name> `
  -AccountName <storage-account-name> `
  -RuleConfigFilterType ContainerPrefixFilter `
  -RuleConfigFilterValue "logs-","data-" `
  -Enabled
```

### [Azure CLI](#tab/azure-cli)


#### Create a rule for all containers

To enable container-level capacity metrics for all containers in a storage account, run the following command:

```bash
az storage advanced-platform-metric create \
  -g <resource_group_name> \
  --account-name <storage_account_name> \
  --enabled \
  --rule-config-filter-type AllContainersFilter
```

#### Create a rule for specific containers

To enable metrics only for specific containers, use the `ContainerListFilter` filter type:

```bash
az storage advanced-platform-metric create \
  -g <resource_group_name> \
  --account-name <storage_account_name> \
  --enabled \
  --rule-config-filter-type ContainerListFilter \
  --rule-config-filter-values container1 container2
```

#### Create a rule by container prefix

To enable metrics for containers that match a prefix, use the `ContainerPrefixFilter` filter type:

```bash
az storage advanced-platform-metric create \
  -g <resource_group_name> \
  --account-name <storage_account_name> \
  --enabled \
  --rule-config-filter-type ContainerPrefixFilter \
  --rule-config-filter-values "logs-" "data-"
```

### [Portal](#tab/azure-portal)

To view advanced platform metrics in the Azure portal:

1. Go to your **Storage Account** in the [Azure portal](https://portal.azure.com).
1. Under **Monitoring**, select **Advanced platform metrics**.
1. Select **Add rule** to create a new rule.
1. In the **Add metric rule** pane, configure the rule filter type and filter values.
1. Select **Save**.

:::image type="content" source="./media/advanced-platform-metrics/enable-metrics-rule.png" alt-text="Screenshot of the Azure portal showing the Advanced platform metrics page with the Add metric rule pane.":::

---

## View and manage advanced platform metrics rules

After you create a rule, you can view and update rules for a storage account.

### View enabled rules

### [PowerShell](#tab/azure-powershell)

```powershell
Get-AzStorageAdvancedPlatformMetric `
  -ResourceGroupName <resource-group-name> `
  -AccountName <storage-account-name>
```

### [Azure CLI](#tab/azure-cli)

```bash
az storage advanced-platform-metric list \
  -g <resource_group_name> \
  --account-name <storage_account_name> 
```

### [Portal](#tab/azure-portal)

To view advanced platform metrics in the Azure portal:

1. Go to your **Storage Account** in the [Azure portal](https://portal.azure.com).
1. Under **Monitoring**, select **Advanced platform metrics**.
1. Review the list of configured rules.

:::image type="content" source="./media/advanced-platform-metrics/view-metrics-rules.png" alt-text="Screenshot of the Azure portal Advanced platform metrics page showing configured rules.":::

---

### Update an existing rule

You can update a rule to change the filter type, filter values, or enabled state. For example, to change to a container list filter and disable the rule:

### [PowerShell](#tab/azure-powershell)

```powershell
Set-AzStorageAdvancedPlatformMetric `
  -ResourceGroupName <resource-group-name> `
  -AccountName <storage-account-name> `
  -RuleConfigFilterType ContainerListFilter `
  -RuleConfigFilterValue "container1","container2" `
  -Enabled:$false
```

### [Azure CLI](#tab/azure-cli)

```bash
az storage advanced-platform-metric update \
  -g <resource_group_name> \
  --account-name <storage_account_name> \
  --enabled false \
  --rule-config-filter-type ContainerPrefixFilter \
  --rule-config-filter-values container1 container2
```

### [Portal](#tab/azure-portal)

To view advanced platform metrics in the Azure portal:

1. Go to your **Storage Account** in the [Azure portal](https://portal.azure.com).
1. Under **Monitoring**, select **Advanced platform metrics**.
1. Select the rule that you want to update, and then select **Edit**.
1. Update the filter type or filter values.
1. Select **Save**.

:::image type="content" source="./media/advanced-platform-metrics/edit-metrics-rule.png" alt-text="Screenshot of the Azure portal showing the Edit rule experience for advanced platform metrics.":::

---

## View advanced platform metrics

> [!NOTE]
> If no metrics appear, make sure the **Microsoft.Insights** resource provider is registered on your subscription. To register it, run `az provider register -n Microsoft.Insights` by using Azure CLI.


### [PowerShell](#tab/azure-powershell)

To query container-level capacity metrics by using PowerShell, use the [Get-AzMetric](/powershell/module/az.monitor/get-azmetric) cmdlet:

```powershell
$resourceId = "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>"

Get-AzMetric -ResourceId $resourceId `
  -MetricName "ContainerUsedSize" `
  -TimeGrain 01:00:00 `
  -AggregationType Average
```

### [Azure CLI](#tab/azure-cli)

To query container-level capacity metrics by using Azure CLI, run:

**Container used size:**

```azurecli
az monitor metrics list \
  --resource /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-account-name> \
  --metric ContainerUsedSize \
  --dimension ContainerName \
  --interval PT1H \
  -o table
```

**Container blob count:**

```azurecli
az monitor metrics list \
  --resource /subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-account-name> \
  --metric ContainerBlobCount \
  --dimension ContainerName \
  --interval PT1H \
  -o table
```

### [Portal](#tab/azure-portal)

To view advanced platform metrics in the Azure portal:

1. Go to your **Storage Account** in the [Azure portal](https://portal.azure.com).
1. Under **Monitoring**, select **Metrics**.
1. Select one of the following metrics:
   - **Container Blob Capacity**
   - **Container Blob Count**

   :::image type="content" source="./media/advanced-platform-metrics/select-container-metric.png" alt-text="Screenshot of Azure Portal Metrics explorer showing the metric selector with Container Blob Capacity and Container Blob Count options.":::

1. Select **Apply splitting**, and then choose **ContainerName** to view per-container graphs.

   :::image type="content" source="./media/advanced-platform-metrics/split-by-container-name.png" alt-text="Screenshot of Azure Metrics settings showing the Apply splitting control with ContainerName selected.":::

The following screenshot shows a metrics chart displaying container-level capacity data for two containers.

:::image type="content" source="./media/advanced-platform-metrics/container-metrics-chart.png" alt-text="Screenshot of Azure Metrics chart displaying container-level data split by container name.":::

---

## Pricing

Azure Monitor bills advanced platform metrics as advanced platform metrics. For pricing details, see the metrics section of [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

### Data points calculation example

Container-level capacity metrics expose data points for each container and access tier combination. Multiple dimensions per hour contribute to the total billable data points.

For example, consider a storage account with the following configuration:

- **Blob access tiers**: 5 (Hot, Cool, Cold, Smart, Archive)
- **Blob types**: 2 (Block blob, Append blob)
- **Data points per container per hour**: 5 tiers × 2 types = 10 data points
- **Metrics enabled**: 2 (Container Blob Capacity and Container Blob Count)
- **Total data points per container per hour**: 2 metrics × 10 = 20 data points

If you have **50 containers** in your storage account:

- **Data points per hour**: 50 containers × 20 = 1,000 data points
- **Data points per day**: 1,000 × 24 hours = 24,000 data points
- **Data points per month** (30 days): 24,000 × 30 = 720,000 billable data points

The actual number of data points depends on your specific configuration, including the number of containers, enabled metrics, and the blob types and access tiers in use.

## Limits and considerations
> [!NOTE]
> Advanced platform metrics is supported only on storage accounts that support Azure Blob Storage. Premium Azure Files accounts, and Premium Page Blob accounts aren't supported.

The following limit applies when using advanced platform metrics:

| Limit | Value |
| --- | --- |
| Maximum containers per storage account | 10,000 |

## Related content

- [Monitor Azure Blob Storage](monitor-blob-storage.md)
- [Azure Blob Storage monitoring data reference](monitor-blob-storage-reference.md)
- [Best practices for monitoring Azure Blob Storage](blob-storage-monitoring-scenarios.md)
