---
title: Syslog collection with Container Insights
description: This article describes how to collect Syslog from AKS nodes using Container insights.
ms.topic: conceptual
ms.date: 05/31/2024
ms.reviewer: damendo
---

# Syslog collection with Container Insights 

Container Insights offers the ability to collect Syslog events from Linux nodes in your [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes) clusters. This includes the ability to collect logs from control plane components like kubelet. Customers can also use Syslog for monitoring security and health events, typically by ingesting syslog into a SIEM system like [Microsoft Sentinel](https://azure.microsoft.com/products/microsoft-sentinel/#overview).  

## Prerequisites 

- Syslog collection needs to be enabled for your cluster using the guidance in [Configure and filter log collection in Container insights](./container-insights-data-collection-configure.md).
- Port 28330 should be available on the host node.


## Access Syslog data using built-in workbooks

To get a quick snapshot of your syslog data, use the built-in Syslog workbook using one of the following methods:

- **Reports** tab in Container Insights. 
Navigate to your cluster in the Azure portal and open the **Insights**. Open the **Reports** tab and locate the **Syslog** workbook. 

    :::image type="content" source="media/container-insights-syslog/syslog-workbook-cluster.gif" lightbox="media/container-insights-syslog/syslog-workbook-cluster.gif" alt-text="Video of Syslog workbook being accessed from Container Insights Reports tab." border="true":::

- **Workbooks** tab in AKS
Navigate to your cluster in the Azure portal. Open the **Workbooks** tab and locate the **Syslog** workbook. 

    :::image type="content" source="media/container-insights-syslog/syslog-workbook-container-insights-reports-tab.gif" lightbox="media/container-insights-syslog/syslog-workbook-container-insights-reports-tab.gif" alt-text="Video of Syslog workbook being accessed from cluster workbooks tab." border="true":::

### Access Syslog data using a Grafana dashboard

Customers can use our Syslog dashboard for Grafana to get an overview of their Syslog data. Customers who create a new Azure-managed Grafana instance will have this dashboard available by default. Customers with existing instances or those running their own instance can [import the Syslog dashboard from the Grafana marketplace](https://grafana.com/grafana/dashboards/19866-azure-monitor-container-insights-syslog/). 

> [!NOTE]
> You will need to have the **Monitoring Reader** role on the Subscription containing the Azure Managed Grafana instance to access syslog from Container Insights. 

:::image type="content" source="media/container-insights-syslog/grafana-screenshot.png" lightbox="media/container-insights-syslog/grafana-screenshot.png" alt-text="Screenshot of Syslog Grafana dashboard." border="false":::

### Access Syslog data  using log queries

Syslog data is stored in the [Syslog](/azure/azure-monitor/reference/tables/syslog) table in your Log Analytics workspace. You can create your own [log queries](../logs/log-query-overview.md) in [Log Analytics](../logs/log-analytics-overview.md) to analyze this data or use any of the [prebuilt queries](../logs/log-query-overview.md).

:::image type="content" source="media/container-insights-syslog/azmon-3.png" lightbox="media/container-insights-syslog/azmon-3.png" alt-text="Screenshot of Syslog query loaded in the query editor in the Azure Monitor Portal UI." border="false":::    

You can open Log Analytics from the **Logs** menu in the **Monitor** menu to access Syslog data for all clusters or from the AKs cluster's menu to access Syslog data for only that cluster.
 
:::image type="content" source="media/container-insights-syslog/aks-4.png" lightbox="media/container-insights-syslog/aks-4.png" alt-text="Screenshot of Query editor with Syslog query." border="false":::
  
#### Sample queries
  
The following table provides different examples of log queries that retrieve Syslog records.

| Query | Description |
|:--- |:--- |
| `Syslog` |All Syslogs |
| `Syslog | where SeverityLevel == "error"` | All Syslog records with severity of error |
| `Syslog | summarize AggregatedValue = count() by Computer` | Count of Syslog records by computer |
| `Syslog | summarize AggregatedValue = count() by Facility` | Count of Syslog records by facility |  
| `Syslog | where ProcessName == "kubelet"` | All Syslog records from the kubelet process |
| `Syslog | where ProcessName == "kubelet" and  SeverityLevel == "error"` | Syslog records from kubelet process with errors |

## Editing your Syslog collection settings

To modify the configuration for your Syslog collection, you modify the [data collection rule (DCR)](../essentials/data-collection-rule-overview.md) that was created when you enabled it. 

Select **Data Collection Rules** from the **Monitor** menu in the Azure portal. 

:::image type="content" source="media/container-insights-syslog/dcr-1.png" lightbox="media/container-insights-syslog/dcr-1.png" alt-text="Screenshot of Data Collection Rules tab in the Azure Monitor portal UI." border="false":::

Select your DCR and then **View data sources**. Select the **Linux Syslog** data source to view the Syslog collection details.
>[!NOTE]
> A DCR is created automatically when you enable syslog. The DCR follows the naming convention `MSCI-<WorkspaceRegion>-<ClusterName>`.

:::image type="content" source="media/container-insights-syslog/dcr-3.png" lightbox="media/container-insights-syslog/dcr-3.png" alt-text="Screenshot of Data Sources tab for Syslog data collection rule." border="false":::

Select the minimum log level for each facility that you want to collect.

:::image type="content" source="media/container-insights-syslog/dcr-4.png" lightbox="media/container-insights-syslog/dcr-4.png" alt-text="Screenshot of Configuration panel for Syslog data collection rule." border="false":::



## Next steps

Once setup customers can start sending Syslog data to the tools of their choice
- [Send Syslog to Microsoft Sentinel](/azure/sentinel/connect-syslog)
- [Export data from Log Analytics](/azure/azure-monitor/logs/logs-data-export?tabs=portal)
- [Syslog record properties](/azure/azure-monitor/reference/tables/syslog)

Share your feedback for this feature here: https://forms.office.com/r/BBvCjjDLTS 
