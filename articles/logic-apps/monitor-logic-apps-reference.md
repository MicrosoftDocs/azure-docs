---
title: Monitoring data reference for Azure Logic Apps
description: This article contains important reference material you need when you monitor Azure Logic Apps.
ms.date: 03/19/2024
ms.custom: horz-monitor
ms.topic: reference
ms.service: logic-apps
---

# Azure Logic Apps monitoring data reference

[!INCLUDE [horz-monitor-ref-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-intro.md)]

For details about the data you can collect for Azure Logic Apps and how to use that data, see [Monitor Azure Logic Apps](monitor-logic-apps.md).

[!INCLUDE [horz-monitor-ref-metrics-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-intro.md)]

### Supported metrics for Microsoft.Logic/IntegrationServiceEnvironments

The following table lists the metrics available for the **Microsoft.Logic/IntegrationServiceEnvironments** resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.Logic/IntegrationServiceEnvironments](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-logic-integrationserviceenvironments-metrics-include.md)]

### Supported metrics for Microsoft.Logic/Workflows

The following table lists the metrics available for the **Microsoft.Logic/Workflows** resource type.
[!INCLUDE [horz-monitor-ref-metrics-tableheader](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-tableheader.md)]

[!INCLUDE [Microsoft.Logic/Workflows](~/azure-reference-other-repo/azure-monitor-ref/supported-metrics/includes/microsoft-logic-workflows-metrics-include.md)]

[!INCLUDE [horz-monitor-ref-metrics-dimensions-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-metrics-dimensions-intro.md)]

[!INCLUDE [horz-monitor-ref-no-metrics-dimensions](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-no-metrics-dimensions.md)]

[!INCLUDE [horz-monitor-ref-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-resource-logs.md)]

### Supported resource logs for Microsoft.Logic/IntegrationAccounts

[!INCLUDE [Microsoft.Logic/IntegrationAccounts](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-logic-integrationaccounts-logs-include.md)]

### Supported resource logs for Microsoft.Logic/Workflows

[!INCLUDE [Microsoft.Logic/Workflows](~/azure-reference-other-repo/azure-monitor-ref/supported-logs/includes/microsoft-logic-workflows-logs-include.md)]

[!INCLUDE [horz-monitor-ref-logs-tables](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-logs-tables.md)]

### Azure Logic Apps
Microsoft.Logic/workflows

- [AzureActivity](/azure/azure-monitor/reference/tables/AzureActivity#columns)
- [AzureMetrics](/azure/azure-monitor/reference/tables/AzureMetrics#columns)
- [AzureDiagnostics](/azure/azure-monitor/reference/tables/AzureDiagnostics#columns). Logs are collected in the **AzureDiagnostics** table under the resource provider name of `MICROSOFT.LOGIC`.
- [LogicAppWorkflowRuntime](/azure/azure-monitor/reference/tables/LogicAppWorkflowRuntime#columns)

### Integration Account
Microsoft.Logic/integrationAccounts

- [AzureActivity](/azure/azure-monitor/reference/tables/AzureActivity#columns)

[!INCLUDE [horz-monitor-ref-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-ref-activity-log.md)]
- [Microsoft.Logic resource provider operations](/azure/role-based-access-control/permissions/integration#microsoftlogic)

## Related content

- For an overview of monitoring Azure Logic Apps, see [Monitor Azure Logic Apps](monitor-logic-apps-overview.md).
- For a description of monitoring workflow status and history and creating alerts, see [Monitor workflows](monitor-logic-apps.md).
- For details about monitoring Azure resources, see [Monitor Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource).
