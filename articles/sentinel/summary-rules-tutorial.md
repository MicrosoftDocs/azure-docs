---
title: Summarize insights from raw data in an Auxiliary table to an Analytics table in Microsoft Sentinel (Preview)
description: This article walks you through a sample process for using summary rules with auxiliary logs in Microsoft Sentinel.
author: batamig
ms.author: bagol
ms.topic: how-to #Don't change
ms.date: 10/16/2024
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security

#customer intent: As a SOC engineer, I want to create summary rules in Microsoft Sentinel to aggregate large sets of data for use across my SOC team activities.

---

# Tutorial: Summarize insights from raw data in an Auxiliary table to an Analytics table in Microsoft Sentinel (Preview)

This article provides an example of how to use summary rules to aggregate insights from an [auxiliary logs table](basic-logs-use-cases.md) to an Analytics table. In this example, you ingest CEF data from Logstash by deploying a custom connector using an ARM template.

> [!IMPORTANT]
> Summary rules are currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> [!INCLUDE [unified-soc-preview-without-alert](includes/unified-soc-preview-without-alert.md)]
>

## Prerequisites

To complete this tutorial, you need:

- A Microsoft Sentinel-enabled workspace.
- Access to Microsoft Sentinel with [**Microsoft Sentinel Contributor**](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor) permissions. For more information, see [Roles and permissions in Microsoft Sentinel](roles.md).
- [Monitoring Contributor](/azure/role-based-access-control/built-in-roles#monitoring-contributor) permissions to create a data collection rule (DCR) and a data collection endpoint (DCE). For more information, see [Data collection rules](https://learn.microsoft.com/azure/azure-monitor/logs/data-collection-rules).
- A virtual machine (VM) with Logstash installed. For more information, see [Install Logstash](https://www.elastic.co/guide/en/logstash/current/installing-logstash.html).
- To create summary rules in the Microsoft Defender portal, you must first onboard your workspace to the Defender portal. For more information, see [Connect Microsoft Sentinel to the Microsoft Defender portal](/microsoft-365/security/defender/microsoft-sentinel-onboard).

## Use summary rules with auxiliary logs (sample process)

1. Set up your custom CEF connector from Logstash:

    1. Deploy the following ARM template to your Microsoft Sentinel workspace to create a custom table with data collection rules (DCR) and a data collection endpoint (DCE):

        [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2FAzure-Sentinel%2Fmaster%2FDataConnectors%2Fmicrosoft-sentinel-log-analytics-logstash-output-plugin%2Fexamples%2Fauxiliry-logs%2Farm-template%2Fdeploy-dcr-dce-cef-table.json)

    1. Note the following details from the ARM template output:

        - `tenant_id`
        - `data_collection_endpoint`
        - `dcr_immutable_id`
        - `dcr_stream_name`

    1. Create a Microsoft Entra application, and note the application's **Client ID** and **Secret**. For more information, see [Tutorial: Send data to Azure Monitor Logs with Logs ingestion API (Azure portal)](/azure/azure-monitor/logs/tutorial-logs-ingestion-portal).

    1. Use our [sample script](https://github.com/Azure/Azure-Sentinel/blob/master/DataConnectors/microsoft-sentinel-log-analytics-logstash-output-plugin/examples/auxiliry-logs/config/bronze.conf) to update your Logstash configuration file. The updates configure Logstash to send CEF logs to the custom table created by the ARM template, transforming JSON data to DCR format. In this script, make sure to replace placeholder values with your own values for the custom table and Microsoft Entra app you created earlier.

1. Check to see that your CEF data is flowing from Logstash as expected. For example, in Microsoft Sentinel, go to the **Logs** page and run the following query:

    ```kusto
    CommonSecurityLog_CL
    | take 10
    ```

1. Create summary rules that aggregate your CEF data. For example:

    - **Lookup indicator of compromise (IoC) data**: Hunt for specific IoCs by running aggregated summary queries to bring unique occurrences, and then query only those occurrences for faster results. The following example shows an example of how to bring a unique `Source Ip` feed along with other metadata, which can then be used against IoC lookups:

        ```kusto
        // Daily Network traffic trend Per Destination IP along with Data transfer stats 
        // Frequency - Daily - Maintain 30 day or 60 Day History. 
          CommonSecurityLog_CL 
          | extend Day = format_datetime(TimeGenerated, "yyyy-MM-dd") 
          | summarize Count= count(), DistinctSourceIps = dcount(SourceIP), NoofBytesTransferred = sum(SentBytes), NoofBytesReceived = sum(ReceivedBytes)  
          by Day,DestinationIp, DeviceVendor 
        ```

    - **Query a summary baseline for anomaly detections**. Instead of running your queries against large historical periods, such as 30 or 60 days, we recommend that you ingest data into custom logs, and then only query summary baseline data, such as for time series anomaly detections. For example:

        ```kusto
        // Time series data for Firewall traffic logs 
        let starttime = 14d; 
        let endtime = 1d; 
        let timeframe = 1h; 
        let TimeSeriesData =  
        CommonSecurityLog_CL 
          | where TimeGenerated between (startofday(ago(starttime))..startofday(ago(endtime))) 
          | where isnotempty(DestinationIP) and isnotempty(SourceIP) 
          | where ipv4_is_private(DestinationIP) == false 
          | project TimeGenerated, SentBytes, DeviceVendor 
          | make-series TotalBytesSent=sum(SentBytes) on TimeGenerated from startofday(ago(starttime)) to startofday(ago(endtime)) step timeframe by DeviceVendor 
        ```

See more information on the following items used in the preceding examples, in the Kusto documentation:
- [***let*** statement](/kusto/query/let-statement?view=microsoft-sentinel&preserve-view=true)
- [***where*** operator](/kusto/query/where-operator?view=microsoft-sentinel&preserve-view=true)
- [***extend*** operator](/kusto/query/extend-operator?view=microsoft-sentinel&preserve-view=true)
- [***project*** operator](/kusto/query/project-operator?view=microsoft-sentinel&preserve-view=true)
- [***summarize*** operator](/kusto/query/summarize-operator?view=microsoft-sentinel&preserve-view=true)
- [***lookup*** operator](/kusto/query/lookup-operator?view=microsoft-sentinel&preserve-view=true)
- [***union*** operator](/kusto/query/union-operator?view=microsoft-sentinel&preserve-view=true)
- [***make-series*** operator](/kusto/query/make-series-operator?view=microsoft-sentinel&preserve-view=true)
- [***isnotempty()*** function](/kusto/query/isnotempty-function?view=microsoft-sentinel&preserve-view=true)
- [***format_datetime()*** function](/kusto/query/format-datetime-function?view=microsoft-sentinel&preserve-view=true)
- [***column_ifexists()*** function](/kusto/query/column-ifexists-function?view=microsoft-sentinel&preserve-view=true)
- [***iff()*** function](/kusto/query/iff-function?view=microsoft-sentinel&preserve-view=true)
- [***ipv4_is_private()*** function](/kusto/query/ipv4-is-private-function?view=microsoft-sentinel&preserve-view=true)
- [***min()*** function](/kusto/query/min-aggregation-function?view=microsoft-sentinel&preserve-view=true)
- [***tostring()*** function](/kusto/query/tostring-function?view=microsoft-sentinel&preserve-view=true)
- [***ago()*** function](/kusto/query/ago-function?view=microsoft-sentinel&preserve-view=true)
- [***startofday()*** function](/kusto/query/startofday-function?view=microsoft-sentinel&preserve-view=true)
- [***parse_json()*** function](/kusto/query/parse-json-function?view=microsoft-sentinel&preserve-view=true)
- [***count()*** aggregation function](/kusto/query/count-aggregation-function?view=microsoft-sentinel&preserve-view=true)
- [***make_set()*** aggregation function](/kusto/query/make-set-aggregation-function?view=microsoft-sentinel&preserve-view=true)
- [***dcount()*** aggregation function](/kusto/query/dcount-aggregation-function?view=microsoft-sentinel&preserve-view=true)
- [***sum()*** aggregation function](/kusto/query/sum-aggregation-function?view=microsoft-sentinel&preserve-view=true)

[!INCLUDE [kusto-reference-general-no-alert](includes/kusto-reference-general-no-alert.md)]

## Related content

- [Aggregate data in Log Analytics workspace with Summary rules](/azure/azure-monitor/logs/summary-rules)
- [Plan costs and understand Microsoft Sentinel pricing and billing](billing.md)
- [Log sources to use for Auxiliary Logs ingestion](basic-logs-use-cases.md)
- [Summary rules restrictions and limitations](/azure/azure-monitor/logs/summary-rules)
