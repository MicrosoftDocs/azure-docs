---
title: "Tutorial: Observability of managed Java components"
description: Learn how to retrieve logs of managed Java components.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: devx-track-extended-java
ms.topic: conceptual
ms.date: 04/30/2024
ms.author: cshoe
zone_pivot_groups: container-apps-portal-or-cli
---

# Tutorial: Observability of managed Java components

Java components include built-in observability features that could give you a holistic view of Java component health throughout its lifecycle.

## Prerequisites

The following prerequisites are required for this tutorial.

| Resource | Description |
|---|---|
| Azure Log Analytics | To use the built-in observability features of managed Java components, ensure you set up your Azure Log Analytics for logging and monitoring in a managed environment as outlined in the document, either using **Log Analytics** or **Azure Monitor**. [Log storage and monitoring options in Azure Container Apps](log-options.md) |
| Java component | Make sure to create at least one Java component in your environment, such as [Eureka](java-eureka-server.md) and [config server](java-config-server.md). |

## Query log data

Log Analytics is a tool in the Azure portal used to view and analyze log data. Using Log Analytics, you can write Kusto queries to retrieve, sort, filter, and visualize the log data. These visualizations help you spot trends and identify issues with your application. You can work interactively with the query results or use them with other features such as alerts, dashboards, and workbooks.

::: zone pivot="azure-portal"

To query Java component logs in Azure, begin by accessing your Azure Log Analytics workspace associated with your environment. From there, proceed by selecting **Logs** from the sidebar.

Focus your query on the Java component logs by utilizing the **ContainerAppSystemlogs_CL** table, which is found under the **CustomLogs** category in **Tables** tab.

:::image type="content" source="media/java-components-logs/java-component-logs.png" alt-text="Screenshot of the Log Analytics Java component logs.":::

The following Kusto query displays the log entries of Eureka Server for Spring component logs.

```kusto
ContainerAppSystemLogs_CL
| where ComponentType_s == 'SpringCloudEureka'
| project Time=TimeGenerated, Type=ComponentType_s, Component=ComponentName_s, Message=Log_s
| take 100
```

::: zone-end

::: zone pivot="azure-cli"

Java component logs can be queried using the [Azure CLI](/cli/azure/monitor/log-analytics).

The following example Azure CLI queries output a table containing log records for the Eureka Server for Spring component. The `project` operator's parameters specify the table columns. The `$WORKSPACE_CUSTOMER_ID` variable contains the GUID of the Log Analytics workspace.

# [Bash](#tab/bash)

```azurecli
az monitor log-analytics query --workspace $WORKSPACE_CUSTOMER_ID --analytics-query "ContainerAppSystemLogs_CL | where ComponentType_s == 'SpringCloudEureka' | project Time=TimeGenerated, Type=ComponentType_s, Component=ComponentName_s, Message=Log_s | take 5" --out table
```

# [PowerShell](#tab/powershell)

```powershell
$queryResults = Invoke-AzOperationalInsightsQuery -WorkspaceId $WORKSPACE_CUSTOMER_ID -Query "ContainerAppSystemLogs_CL | where ComponentType_s == 'SpringCloudEureka' | project Time=TimeGenerated, Type=ComponentType_s, Component=ComponentName_s, Message=Log_s | take 5"
$queryResults.Results
```

---

::: zone-end

## Query Java Component Log with Azure monitor

Azure Monitor is a comprehensive monitoring solution for collecting, analyzing, and responding to monitoring data from your cloud and on-premises environments. Azure Monitor can direct logs to one or more destinations, here we take Log Analytics workspace being a primary example of such a destination.

::: zone pivot="azure-portal"

To query Java components in Azure using Azure Monitor, with Log Analytics workspace as the destination, you have two options: navigate directly to your Log Analytics workspace or access the logs through the Managed Environment's **Log** panel as follows.

Focus your query on the Java component logs by utilizing the **ContainerAppSystemLogs** table, which is found under the **Container Apps** category in **Tables** tab.

:::image type="content" source="media/java-components-logs/java-component-logs.png" alt-text="Screenshot of the Log Analytics Java component logs portal location.":::

The following Kusto query displays the log entries of Eureka Server for Spring component logs.

```kusto
ContainerAppSystemLogs
| where ComponentType == "SpringCloudEureka"
| project Time=TimeGenerated, Type=ComponentType, Component=ComponentName, Message=Log
| take 100
```

::: zone-end

::: zone pivot="azure-cli"

Java component logs can be queried using the [Azure CLI](/cli/azure/monitor/log-analytics).

The following example Azure CLI queries output a table containing log records for the Eureka Server for Spring component. The `project` operator's parameters specify the table columns. The `$WORKSPACE_CUSTOMER_ID` variable contains the GUID of the Log Analytics workspace.

# [Bash](#tab/bash)

```azurecli
az monitor log-analytics query --workspace $WORKSPACE_CUSTOMER_ID --analytics-query "ContainerAppSystemLogs | where ComponentType == 'SpringCloudEureka' | project Time=TimeGenerated, Type=ComponentType, Component=ComponentName, Message=Log | take 5" --out table
```

# [PowerShell](#tab/powershell)

```powershell
$queryResults = Invoke-AzOperationalInsightsQuery -WorkspaceId $WORKSPACE_CUSTOMER_ID -Query "ContainerAppSystemLogs | where ComponentType == 'SpringCloudEureka' | project Time=TimeGenerated, Type=ComponentType, Component=ComponentName, Message=Log | take 5"
$queryResults.Results
```

---

::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Log storage and monitoring options in Azure Container Apps](log-options.md)