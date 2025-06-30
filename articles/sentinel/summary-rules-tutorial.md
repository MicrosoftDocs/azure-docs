---
title: Summarize insights from raw data in an Auxiliary table to an Analytics table in Microsoft Sentinel (Preview)
description: This article walks you through a sample process of using summary rules to extract actionable analytics from verbose logs ingested into low-cost storage.
author: guywi-ms
ms.author: guywild
ms.topic: how-to #Don't change
ms.date: 05/25/2025
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal
ms.collection: usx-security

#customer intent: As a SOC engineer, I want to understand how to use summary rules extract actionable analytics from verbose logs ingested into low-cost storage.

---

# Tutorial: Send logs to low-cost storage and extract actionable analytics using summary rules in Microsoft Sentinel (Preview)

This article provides an example of how to use summary rules to aggregate insights from an [auxiliary logs table](basic-logs-use-cases.md) to an Analytics table. In this example, you ingest Common Event Format (CEF) data from Logstash by deploying a custom connector using an ARM template.

> [!IMPORTANT]
> Summary rules are currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> [!INCLUDE [unified-soc-preview-without-alert](includes/unified-soc-preview-without-alert.md)]
>

## Prerequisites

To complete this tutorial, you need:

- A Microsoft Sentinel-enabled workspace.
- A virtual machine (VM) with Logstash installed. For more information, see [Install Logstash](https://www.elastic.co/guide/en/logstash/current/installing-logstash.html).
- Access to Microsoft Sentinel with [**Microsoft Sentinel Contributor**](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor) permissions. For more information, see [Roles and permissions in Microsoft Sentinel](roles.md).
- [Monitoring Contributor](/azure/role-based-access-control/built-in-roles#monitoring-contributor) permissions to create a data collection rule (DCR) and a data collection endpoint (DCE). For more information, see [Data collection rules](/azure/azure-monitor/data-collection/data-collection-rule-overview).
- To create summary rules in the Microsoft Defender portal, you must first onboard your workspace to the Defender portal. For more information, see [Connect Microsoft Sentinel to the Microsoft Defender portal](/microsoft-365/security/defender/microsoft-sentinel-onboard).

## Process overview

This diagram shows the process described in this tutorial:

:::image type="content" source="media/summary-rules/summary-rule-auxiliary-logs-overview.svg" alt-text="Screenshot of the Content Hub page in Microsoft Sentinel showing summary rule templates." lightbox="media/summary-rules/summary-rule-auxiliary-logs-overview.svg":::

## Use summary rules with auxiliary logs

1. **Register a Microsoft Entra application.**

    Create a Microsoft Entra application, and note the application's **Client ID** and **Secret**. For more information, see [Tutorial: Send data to Azure Monitor Logs with Logs ingestion API (Azure portal)](/azure/azure-monitor/logs/tutorial-logs-ingestion-portal).

    The Microsoft Entra application authenticates the Logstash output plugin, which sends logs to your Log Analytics workspace.


1.  **Create a data collection endpoint (DCE), data collection rule (DCR), and a custom Auxiliary table.** 
    
    Deploy this ARM template to create the required resources:

    [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2FAzure-Sentinel%2Fmaster%2FDataConnectors%2Fmicrosoft-sentinel-log-analytics-logstash-output-plugin%2Fexamples%2Fauxiliry-logs%2Farm-template%2Fdeploy-dcr-dce-cef-table.json)

    Note the following details from the ARM template output:

    - `tenant_id`
    - `data_collection_endpoint`
    - `dcr_immutable_id`
    - `dcr_stream_name`
    
    The data collection endpoint is the endpoint to which your Logstash instance sends logs. The data collection rule (DCR) defines which data to send to which table and how to process that data. For more information, see [Data collection endpoints](/azure/azure-monitor/data-collection/data-collection-endpoint-overview) and [Data collection rules](/azure/azure-monitor/data-collection/data-collection-rule-overview). 

1. **Grant your application permission to send data to your data collection endpoint.**

    Navigate to your data collection endpoint, and assign the **Log Analytics Data Contributor** role to your Microsoft Entra application. 

    For more information, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

1. **Update the Logstash configuration file on your VM.** 

    Copy our [sample Logstash configuration](https://github.com/Azure/Azure-Sentinel/blob/master/DataConnectors/microsoft-sentinel-log-analytics-logstash-output-plugin/examples/auxiliry-logs/config/bronze.conf) to your VM. Make sure to replace placeholder values with your own values for the custom table and Microsoft Entra app you created earlier.

    This file configures Logstash to send CEF logs to the custom table created by the ARM template, transforming JSON data to the format used in your destination table schema. 
    
    After you update the configuration file and restart Logstash, CEF data that your VM logs will be sent to your Log Analytics workspace.

1. **Query your Auxiliary table to verify that data is being ingested.**

    In Microsoft Sentinel, go to the **Logs** page and run a query. For example:

    ```kusto
    CommonSecurityLog_CL
    | take 10
    ```

1. **Create a summary rule.**

    Create a summary rule to aggregate insights from the Auxiliary table to an Analytics table.
    For more information about creating summary rules in Microsoft Sentinel, see [Create a new summary rule](./summary-rules.md#create-a-new-summary-rule).
    
    Here are a couple of examples of summary rules to aggregate your CEF data:

    - **Lookup indicator of compromise (IoC) data**: Hunt for specific IoCs by running aggregated summary queries to bring unique occurrences, and then query only those occurrences for faster results. The `Message` field is device-specific and in JSON format, so you need to parse this field to extract relevant data. This summary rule is an example of how to bring a unique `SourceIP` feed along with other metadata, which you can then use against IoC lookups:

        ```kusto
        // Daily Network traffic trend Per Destination IP along with Data transfer stats 
        // Frequency - Daily - Maintain 30 day or 60 Day History. 
        CommonSecurityLog_CL 
        | extend j=parse_json(Message)
        | extend DestinationIP=tostring(j.destinationAddress)
        | extend SourceIP=tostring(j.sourceAddress)
        | extend SentBytes=toint(j.bytesOut)
        | extend ReceivedBytes=toint(j.bytesOut)
        | extend Day = format_datetime(TimeGenerated, "yyyy-MM-dd") 
        | summarize Count= count(), DistinctSourceIps = dcount(SourceIP), NoofBytesTransferred = sum(SentBytes), NoofBytesReceived = sum(ReceivedBytes) by Day,DestinationIP, DeviceVendor
        ```

    - **Query a summary baseline for anomaly detections**. Instead of running your queries against large historical periods, such as 30 or 60 days, we recommend that you ingest data into an Auxiliary table, and then only query summary baseline data, such as for time series anomaly detections. For example:

        ```kusto
        // Time series data for Firewall traffic logs 
        let starttime = 14d; 
        let endtime = 1d; 
        let timeframe = 1h; 
        CommonSecurityLog_CL 
        | extend j=parse_json(Message)
        | extend DestinationIP=tostring(j.destinationAddress)
        | extend SourceIP=tostring(j.sourceAddress)
        | extend SentBytes=toint(j.bytesOut)
        | where isnotempty(DestinationIP) and isnotempty(SourceIP) 
        | where ipv4_is_private(DestinationIP) == false 
        | project TimeGenerated, SentBytes, DeviceVendor 
        | make-series TotalBytesSent=sum(SentBytes) on TimeGenerated from startofday(ago(starttime)) to startofday(ago(endtime)) step timeframe by DeviceVendor 
        ```

1. **Query the destination Analytics table.**

    To view the aggregated data, run a query against the Analytics table you specified in the summary rule. 


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
