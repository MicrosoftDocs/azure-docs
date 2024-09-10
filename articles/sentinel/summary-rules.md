---
title: Aggregate Microsoft Sentinel data with summary rules | Microsoft Sentinel
description: Learn how to aggregate large sets of Microsoft Sentinel data across log tiers with summary rules.
author: batamig
ms.author: bagol
ms.topic: how-to #Don't change
ms.date: 07/23/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security

#customer intent: As a SOC engineer, I want to create summary rules in Microsoft Sentinel to aggregate large sets of data for use across my SOC team activities.

---

# Aggregate Microsoft Sentinel data with summary rules (preview)

Use [summary rules](/azure/azure-monitor/logs/summary-rules) in Microsoft Sentinel to aggregate large sets of data in the background for a smoother security operations experience across all log tiers. Summary data is precompiled in custom log tables and provide fast query performance, including queries run on data derived from [low-cost log tiers](billing.md#auxiliary-logs-and-basic-logs). Summary rules can help optimize your data for:

- **Analysis and reports**, especially over large data sets and time ranges, as required for security and incident analysis, month-over-month or annual business reports, and so on. 
- **Cost savings** on verbose logs, which you can retain for as little or as long as you need in a less expensive log tier, and send as summarized data only to an Analytics table for analysis and reports.
- **Security and data privacy**, by removing or obfuscating privacy details in summarized shareable data and limiting access to tables with raw data.

Access summary rule results via Kusto Query Language (KQL) across detection, investigation, hunting, and reporting activities. Use summary rule results for longer in historical investigations, hunting, and compliance activities.

Summary rule results are stored in separate tables under the **Analytics** data plan, and charged accordingly. For more information on data plans and storage costs, see [Select a table plan based on usage patterns in a Log Analytics workspace](../azure-monitor/logs/basic-logs-configure.md)

> [!IMPORTANT]
> Summary rules are currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> [!INCLUDE [unified-soc-preview-without-alert](includes/unified-soc-preview-without-alert.md)]
>

## Prerequisites

To create summary rules in Microsoft Sentinel:

- Microsoft Sentinel must be enabled in at least one workspace, and actively consume logs.

- You must be able to access Microsoft Sentinel with [**Microsoft Sentinel Contributor**](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor) permissions. For more information, see [Roles and permissions in Microsoft Sentinel](roles.md).

- To create summary rules in the Microsoft Defender portal, you must first onboard your workspace to the unified security operations platform. For more information, see [Connect Microsoft Sentinel to Microsoft Defender XDR](/microsoft-365/security/defender/microsoft-sentinel-onboard).

We recommend that you [experiment with your summary rule query](hunts.md) in the **Logs** page before creating your rule. Verify that the query doesn't reach or near the [query limit](/azure/azure-monitor/logs/summary-rules#restrictions-and-limitations), and check that the query produces the intended schema and expected results. If the query is close to the query limits, consider using a smaller `binSize` to process less data per bin. You can also modify the query to return fewer records or remove fields with higher volume.

## Create a summary rule

Create a new summary rule to aggregate a specific large set of data into a dynamic table. Configure your rule frequency to determine how often your aggregated data set is updated from the raw data.

1. In the Azure portal, from the Microsoft Sentinel navigation menu, under **Configuration**, select **Summary rules (Preview)**. In the Defender portal, select **Microsoft Sentinel > Configuration > Summary rules (Preview)**. For example:

    :::image type="content" source="media/summary-rules/summary-rules-azure.png" alt-text="Screenshot of the Summary rules page in the Azure portal.":::

1. Select **+ Create** and enter the following details:

    - **Name**. Enter a meaningful name for your rule.

    - **Description**. Enter an optional description.

    - **Destination table**. Define the custom log table where your data is aggregated:

        - If you select **Existing custom log table**, select the table you want to use.

        - If you select **New custom log table**, enter a meaningful name for your table. Your full table name uses the following syntax: `<tableName>_CL`.

1. We recommend that you enable **SummaryLogs** diagnostic settings on your workspace to get visibility for historical runes and failures. If **SummaryLogs** diagnostic settings aren't enabled, you're prompted to enable them in the **Diagnostic settings** area.

    If **SummaryLogs** diagnostic settings are already enabled, but you want to modify the settings, select **Configure advanced diagnostic settings**. When you come back to the **Summary rule wizard** page, make sure to select **Refresh** to refresh your setting details.

    > [!IMPORTANT]
    > The **SummaryLogs** diagnostic settings has additional costs. For more information, see [Diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/diagnostic-settings?WT.mc_id=Portal-Microsoft_Azure_Monitoring).
    >

1. Select **Next: Set summary logic >** to continue.

1. On the **Set summary logic** page, enter your summary query. For example, to pull content from Google Cloud Platform, you might want to enter:

    ```kusto
    GCPAuditLogs
    | where ServiceName == 'pubsub.googleapis.com'
    | summarize count() by Severity
    ```

    For for more information, see [Sample summary rule scenarios](#sample-summary-rule-scenarios) and [Kusto Query Language (KQL) in Azure Monitor](/azure/azure-monitor/log-query/log-query-overview).

1. Select **Preview results** to show an example of the data you'd collect with the configured query.

1. In the **Query scheduling** area, define the following details:

    - How often you want the rule to run
    - Whether you want the rule to run with any sort of delay, in minutes
    - When you want the rule to start running

    Times defined in the scheduling are based on the `timegenerated` column in your data

1. Select **Next: Review + create >** > **Save** to complete the summary rule.

Existing summary rules are listed on the **Summary rules (Preview)** page, where you can review your rule status. For each rule, select the options menu at the end of the row to take any of the following actions:

- View the rule's current data in the **Logs** page, as if you were to run the query immediately
- View the run history for the selected rule
- Disable or enable the rule.
- Edit the rule configuration
 
To delete a rule, select the rule row and then select **Delete** in the toolbar at the top of the page.

> [!NOTE]
> Azure Monitor also supports creating summary rules via API or an Azure Resource Monitor (ARM) template. For more information, see [Create or update a summary rule](/azure/azure-monitor/logs/summary-rules?tabs=api).

## Sample summary rule scenarios

This section reviews common scenarios for creating summary rules in Microsoft Sentinel, and our recommendations for how to configure each rule. For more information and examples, see [Use summary rules with auxiliary logs (sample process)](#use-summary-rules-with-auxiliary-logs-sample-process) and [Log sources to use for Auxiliary Logs ingestion](basic-logs-use-cases.md).

### Quickly find a malicious IP address in your network traffic

**Scenario**: You're a threat hunter, and one of your team's goals is to identify all instances of when a malicious IP address interacted in the network traffic logs from an active incident, in the last 90 days.

**Challenge**: Microsoft Sentinel currently ingests multiple terabytes of network logs a day. You need to move through them quickly to find matches for the malicious IP address.

**Solution**: We recommend using summary rules to do the following:

1. **Create a summary data set** for each IP address related to the incident, including the `SourceIP`, `DestinationIP`, `MaliciousIP`, `RemoteIP`, each listing important attributes, such as `IPType`, `FirstTimeSeen`, and `LastTimeSeen`.

    The summary dataset enables you to quickly search for a specific IP address and narrow down the time range where the IP address is found. You can do this even when the searched events happened more than 90 days ago, which is beyond their workspace retention period.

    In this example, configure the summary to run daily, so that the query adds new summary records every day until it expires.

1. **Create an analytics rule** that runs for less than two minutes against the summary dataset, quickly drilling into the specific time range when the malicious IP address interacted with the company network.

    Make sure to configure run intervals of up to five minutes at a minimum, to accommodate different summary payload sizes. This ensures that there's no loss even when there's an event ingestion delay.

    For example:

    ```kusto
    let csl_columnmatch=(column_name: string) {
    CommonSecurityLog
    | where TimeGenerated > startofday(ago(1d))
    | where isnotempty(column_name)
    | extend
        Date = format_datetime(TimeGenerated, "yyyy-MM-dd"),
        IPaddress = column_ifexists(column_name, ""),
        FieldName = column_name
    | extend IPType = iff(ipv4_is_private(IPaddress) == true, "Private", "Public")
    | where isnotempty(IPaddress)
    | project Date, TimeGenerated, IPaddress, FieldName, IPType, DeviceVendor
    | summarize count(), FirstTimeSeen = min(TimeGenerated), LastTimeSeen = min(TimeGenerated) by Date, IPaddress, FieldName, IPType, DeviceVendor
    };
    union csl_columnmatch("SourceIP")
        , csl_columnmatch("DestinationIP") 
        , csl_columnmatch("MaliciousIP")
        , csl_columnmatch("RemoteIP")
    // Further summarization can be done per IPaddress to remove duplicates per day on larger timeframe for the first run
    | summarize make_set(FieldName), make_set(DeviceVendor) by IPType, IPaddress
    ```

1. **Run a subsequent search or correlation with other data** to complete the attack story.

### Detect potential SPN scanning in your network

Detect potential Service Principal Name (SPN) scanning in your network traffic.

**Scenario**: You're a SOC engineer who needs to create a highly accurate detection for any SPN scanning performed by a user account. The detection currently does the following:

1. Looks for Security events with EventID 4796 (A Kerberos service ticket was requested).
1. Creates a baseline with the number of unique tickets typically requested by a user account per day.
1. Generates an alert when there's a major deviation from that baseline.

**Challenge**: The current detection runs on 14 days, or the maximum data lookback in the Analytics table, and creates many false positives. While the detection includes thresholds that are designed to prevent false positives, alerts are still generated for legitimate requests as long as there are more requests than usual. This might happen for vulnerability scanners, administration systems, and in misconfigured systems. On your team, there were so many false positives that they needed to turn off some of the analytics rules. To create a more accurate baseline, you'll need more than 14 days of baseline data.

The current detection also runs a summary query on a separate logic app for each alert. This involves extra work for the setup and maintenance of those logic apps, and incurs extra costs.

**Solution**: We recommend using summary rules to do the following:

1. Generate a daily summary of the count of unique tickets per user. This summarizes the `SecurityEvents` table data for EventID 4769, with extra filtering for specific user accounts.

1. In the summary rule, to generate potential SPN scanning alerts:

    - Reference at least 30 days worth of summary data to create a strong baseline.
    - Apply `percentile()` in your query to calculate the deviation from the baseline

    For example:

    ```kusto
    let starttime = 14d;  
    let endtime = 1d;  
    let timeframe = 1h;  
    let threshold=10;  
    let Kerbevent = SecurityEvent  
    | where TimeGenerated between(ago(starttime) .. now())  
    | where EventID == 4769  
    | parse EventData with * 'TicketEncryptionType">' TicketEncryptionType "<" *  
    | parse EventData with * 'ServiceName">' ServiceName "<" *  
    | where ServiceName !contains "$" and ServiceName !contains "krbtgt"  
    | parse EventData with * 'TargetUserName">' TargetUserName "<" *  
    | where TargetUserName !contains "$@" and TargetUserName !contains ServiceName  
    | parse EventData with * 'IpAddress">::ffff:' ClientIPAddress "<" *;  let baseline = Kerbevent  
    | where TimeGenerated >= ago(starttime) and TimeGenerated < ago(endtime)  
    | make-series baselineDay=dcount(ServiceName) default=1 on TimeGenerated in range(ago(starttime), ago(endtime), 1d) by TargetUserName  | mvexpand TimeGenerated , baselineDay  
    | extend baselineDay = toint(baselineDay)  
    | summarize p95CountDay = percentile(baselineDay, 95) by TargetUserName;  let current = Kerbevent  
    | where TimeGenerated between(ago(timeframe) .. now())  
    | extend encryptionType = case(TicketEncryptionType in ("0x1","0x3"), "DES", TicketEncryptionType in ("0x11","0x12"), "AES", TicketEncryptionType in ("0x17","0x18"), "RC4", "Failure")  
    | where encryptionType in ("AES","DES","RC4")  
    | summarize currentCount = dcount(ServiceName), ticketsRequested=make_set(ServiceName), encryptionTypes=make_set(encryptionType), ClientIPAddress=any(ClientIPAddress), Computer=any(Computer) by TargetUserName; current  
    | join kind=leftouter baseline on TargetUserName  
    | where currentCount > p95CountDay*2 and currentCount > threshold  
    | project-away TargetUserName1  
    | extend context_message = strcat("Potential SPN scan performed by user ", TargetUserName, "\nUser generally requests ", p95CountDay, " unique service tickets in a day.", "\nUnique service tickets requested by user in the last hour: ", currentCount)
    ```

### Generate alerts on threat intelligence matches against network data

Generate alerts on threat intelligence matches against noisy, high volume, and low-security value network data.

**Scenario**: You need to build an analytics rule for firewall logs to match domain names in the system that have been visited against a threat intelligence domain name list. 

Most of the data sources are raw logs that are noisy and have high volume, but have lower security value, including IP addresses, Azure Firewall traffic, Fortigate traffic, and so on. There's a total volume of about 1 TB per day.

**Challenge**: Creating separate rules requires multiple logic apps, requiring extra setup and maintenance overhead and costs.

**Solution**: We recommend using summary rules to do the following:

1. Summarize McAfee firewall logs every 10 minutes, updating the data in the same custom table with each run. [ASIM functions](normalization-functions.md) might be helpful in the summary query when interacting with your McAfee logs.

1. Create an analytics rule to trigger an alert for anytime a domain name in the summary data matches an entry on the threat intelligence list. For example:

    ```kusto
    //let timeRange = 5m;
    //let httpstrim = "https://";
    //let httptrim = "http://";
    let timeRangeStart = now (-10m);
    let timeRangeEnd = (timeRangeStart + 10m);
    //Take visited domains from McAfee proxy
    adx('https://adxfwlog01.northeurope.kusto.windows.net/nwlogs').MappedMcAfeeSyslog
    | where timestamp between (timeRangeStart .. timeRangeEnd)
    | where isnotempty(URL)
    | extend URLDomain = parse_url(URL).Host
    | extend URLDomain = iff(isempty(URLDomain),URL,URLDomain)
    | extend URLDomain = extract(@"([0-9a-zA-Z-]{1,}\.[0-9a-zA-Z-]{2,3}\.[0-9a-zA-Z-]{2,3}|[0-9a-zA-Z-]{1,}\.[0-9a-zA-Z-]{2,10})$", 0, URLDomain)
    | where isnotempty(URLDomain)
    | summarize by URLDomain
    //Match visited domains with TI DomainName list
    | join kind=inner (ThreatIntelligenceIndicator
        | where isnotempty(DomainName)
        | where Active == true
        | where ExpirationDateTime > now()
        | summarize LatestIndicatorTime = arg_max(TimeGenerated, *) by DomainName
          ) on $left.URLDomain == $right.DomainName
    | extend LogicApp = "SOC-McAfee-ADX-DstDomainAgainstThreatIntelligence"
    | project LatestIndicatorTime, TI_Domain = DomainName, Description, ConfidenceScore, AdditionalInformation, LogicApp
    ```

## Use summary rules with auxiliary logs (sample process)

This procedure describes a sample process for using summary rules with [auxiliary logs](basic-logs-use-cases.md), using a custom connection created via an AMR template to ingest CEF data from Logstash.

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
    CefAux_CL
    | take 10
    ```

1. Create summary rules that aggregate your CEF data. For example:

    - **Lookup incident of concern (IoC) data**: Hunt for specific IoCs by running aggregated summary queries to bring unique occurrences, and then query only those occurrences for faster results. The following example shows an example of how to bring a unique `Source Ip` feed along with other metadata, which can then be used against IoC lookups:

        ```kusto
        // Daily Network traffic trend Per Destination IP along with Data transfer stats 
        // Frequency - Daily - Maintain 30 day or 60 Day History. 
          Custom_CommonSecurityLog 
          | where TimeGenerated > ago(1d) 
          | extend Day = format_datetime(TimeGenerated, "yyyy-MM-dd") 
          | summarize Count= count(), DistinctSourceIps = dcount(SourceIP), NoofByesTransferred = sum(SentBytes), NoofBytesReceived = sum(ReceivedBytes)  
          by Day,DestinationIp, DeviceVendor 
        ```

    - **Query a summary baseline for anomaly detections**. Instead of running your queries against large historical periods, such as 30 or 60 days, we recommend that you ingest data into custom logs, and then only query summary baseline data, such as for time series anomaly detections. For example:

        ```kusto
        // Time series data for Firewall traffic logs 
        let starttime = 14d; 
        let endtime = 1d; 
        let timeframe = 1h; 
        let TimeSeriesData =  
        Custom_CommonSecurityLog 
          | where TimeGenerated between (startofday(ago(starttime))..startofday(ago(endtime))) 
          | where isnotempty(DestinationIP) and isnotempty(SourceIP) 
          | where ipv4_is_private(DestinationIP) == false 
          | project TimeGenerated, SentBytes, DeviceVendor 
          | make-series TotalBytesSent=sum(SentBytes) on TimeGenerated from startofday(ago(starttime)) to startofday(ago(endtime)) step timeframe by DeviceVendor 
        ```

## Related content

- [Aggregate data in Log Analytics workspace with Summary rules](/azure/azure-monitor/logs/summary-rules)
- [Plan costs and understand Microsoft Sentinel pricing and billing](billing.md)
- [Log sources to use for Auxiliary Logs ingestion](basic-logs-use-cases.md)
- [Summary rules restrictions and limitations](/azure/azure-monitor/logs/summary-rules)
