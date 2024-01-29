---
title: Collect events and performance counters from virtual machines with Azure Monitor Agent
description: Describes how to collect events and performance data from virtual machines by using Azure Monitor Agent.
ms.topic: conceptual
ms.date: 7/19/2023
author: guywild
ms.author: guywild
ms.reviewer: jeffwo

---

# Configure data collection rules to collect data from virtual machines with Azure Monitor Agent

This article describes how to collect events and performance counters from virtual machines by using [Azure Monitor Agent](azure-monitor-agent-overview.md).

## Prerequisites
To complete this procedure, you need: 

- Log Analytics workspace where you have at least [contributor rights](../logs/manage-access.md#azure-rbac).
- [Permissions to create Data Collection Rule objects](../essentials/data-collection-rule-create-edit.md#permissions) in the workspace.
- Associate the data collection rule to specific virtual machines.

## Collect events and performance counters 

You can define a data collection rule to send data from multiple machines to multiple Log Analytics workspaces, including workspaces in a different region or tenant. Create the data collection rule in the *same region* as your Log Analytics workspace. You can send Windows event and Syslog data to Azure Monitor Logs only. You can send performance counters to both Azure Monitor Metrics and Azure Monitor Logs. 

> [!NOTE] 
> At this time, Microsoft.HybridCompute ([Azure Arc-enabled servers](../../azure-arc/servers/overview.md)) resources can't be viewed in [Metrics Explorer](../essentials/metrics-getting-started.md) (the Azure portal UX), but they can be acquired via the Metrics REST API (Metric Namespaces - List, Metric Definitions - List, and Metrics - List).


> [!NOTE]
> To send data across tenants, you must first enable [Azure Lighthouse](../../lighthouse/overview.md).


1. Select which data you want to collect. For performance counters, you can select from a predefined set of objects and their sampling rate. For events, you can select from a set of logs and severity levels.
    <!-- convertborder later -->
    :::image type="content" source="media/data-collection-rule-azure-monitor-agent/data-collection-rule-data-source-basic-updated.png" lightbox="media/data-collection-rule-azure-monitor-agent/data-collection-rule-data-source-basic-updated.png" alt-text="Screenshot that shows the Azure portal form to select basic performance counters in a data collection rule." border="false":::

1. Select **Custom** to collect logs and performance counters that aren't [currently supported data sources](azure-monitor-agent-overview.md#data-sources-and-destinations) or to [filter events by using XPath queries](#filter-events-using-xpath-queries). You can then specify an [XPath](https://www.w3schools.com/xml/xpath_syntax.asp) to collect any specific values. For an example, see [Sample DCR](data-collection-rule-sample-agent.md).
    <!-- convertborder later -->
    :::image type="content" source="media/data-collection-rule-azure-monitor-agent/data-collection-rule-data-source-custom-updated.png" lightbox="media/data-collection-rule-azure-monitor-agent/data-collection-rule-data-source-custom-updated.png" alt-text="Screenshot that shows the Azure portal form to select custom performance counters in a data collection rule." border="false":::

### Filter events using XPath queries

You're charged for any data you collect in a Log Analytics workspace. Therefore, you should only collect the event data you need. The basic configuration in the Azure portal provides you with a limited ability to filter out events.

[!INCLUDE [azure-monitor-cost-optimization](../../../includes/azure-monitor-cost-optimization.md)]

To specify more filters, use custom configuration and specify an XPath that filters out the events you don't need. XPath entries are written in the form `LogName!XPathQuery`. For example, you might want to return only events from the Application event log with an event ID of 1035. The `XPathQuery` for these events would be `*[System[EventID=1035]]`. Because you want to retrieve the events from the Application event log, the XPath is `Application!*[System[EventID=1035]]`

#### Extract XPath queries from Windows Event Viewer

In Windows, you can use Event Viewer to extract XPath queries as shown in the screenshots.

When you paste the XPath query into the field on the **Add data source** screen, as shown in step 5, you must append the log type category followed by an exclamation point (!).

:::image type="content" source="media/data-collection-rule-azure-monitor-agent/data-collection-rule-extract-xpath.png" lightbox="media/data-collection-rule-azure-monitor-agent/data-collection-rule-extract-xpath.png" alt-text="Screenshot that shows the steps to create an XPath query in the Windows Event Viewer.":::


> [!TIP]
> You can use the PowerShell cmdlet `Get-WinEvent` with the `FilterXPath` parameter to test the validity of an XPath query locally on your machine first. For more information, see the tip provided in the [Windows agent-based connections](../../sentinel/connect-services-windows-based.md) instructions. The [`Get-WinEvent`](/powershell/module/microsoft.powershell.diagnostics/get-winevent) PowerShell cmdlet supports up to 23 expressions. Azure Monitor data collection rules support up to 20. Also, `>` and `<` characters must be encoded as `&gt;` and `&lt;` in your data collection rule. The following script shows an example:
>
> ```powershell
> $XPath = '*[System[EventID=1035]]'
> Get-WinEvent -LogName 'Application' -FilterXPath $XPath
> ```
>
> - In the preceding cmdlet, the value of the `-LogName` parameter is the initial part of the XPath query until the exclamation point (!). The rest of the XPath query goes into the `$XPath` parameter.
> - If the script returns events, the query is valid.
> - If you receive the message "No events were found that match the specified selection criteria," the query might be valid but there are no matching events on the local machine.
> - If you receive the message "The specified query is invalid," the query syntax is invalid.

Examples of using a custom XPath to filter events:

| Description |  XPath |
|:---|:---|
| Collect only System events with Event ID = 4648 |  `System!*[System[EventID=4648]]`
| Collect Security Log events with Event ID = 4648 and a process name of consent.exe | `Security!*[System[(EventID=4648)]] and *[EventData[Data[@Name='ProcessName']='C:\Windows\System32\consent.exe']]` |
| Collect all Critical, Error, Warning, and Information events from the System event log except for Event ID = 6 (Driver loaded) |  `System!*[System[(Level=1 or Level=2 or Level=3) and (EventID != 6)]]` |
| Collect all success and failure Security events except for Event ID 4624 (Successful logon) |  `Security!*[System[(band(Keywords,13510798882111488)) and (EventID != 4624)]]` |

> [!NOTE]
> For a list of limitations in the XPath supported by Windows event log, see [XPath 1.0 limitations](/windows/win32/wes/consuming-events#xpath-10-limitations).  
> For instance, you can use the "position", "Band", and "timediff" functions within the query but other functions like "starts-with" and "contains" are not currently supported.

## Collect IIS logs

1. On the **Collect and deliver** tab, select **Add data source** to add a data source and set a destination.
1. Select **IIS Logs**.

    :::image type="content" source="media/data-collection-iis/iis-data-collection-rule.png" lightbox="media/data-collection-iis/iis-data-collection-rule.png" alt-text="Screenshot that shows the Azure portal form to select basic performance counters in a data collection rule.":::

1. Specify a file pattern to identify the directory where the log files are located. 
1. On the **Destination** tab, add a destination for the data source.
    <!-- convertborder later -->
    :::image type="content" source="media/data-collection-rule-azure-monitor-agent/data-collection-rule-destination.png" lightbox="media/data-collection-rule-azure-monitor-agent/data-collection-rule-destination.png" alt-text="Screenshot that shows the Azure portal form to add a data source in a data collection rule." border="false":::

### Sample IIS log queries

- **Count the IIS log entries by URL for the host www.contoso.com.**
    
    ```kusto
    W3CIISLog 
    | where csHost=="www.contoso.com" 
    | summarize count() by csUriStem
    ```

- **Review the total bytes received by each IIS machine.**

    ```kusto
    W3CIISLog 
    | summarize sum(csBytes) by Computer
    ```


### Sample IIS alert rule

- **Create an alert rule on any record with a return status of 500.**
    
    ```kusto
    W3CIISLog 
    | where scStatus==500
    | summarize AggregatedValue = count() by Computer, bin(TimeGenerated, 15m)
    ```


### Troubleshoot IIS log collection

Use the following steps to troubleshoot collection of IIS logs. 

#### Check if any IIS logs have been received
Start by checking if any records have been collected for your IIS logs by running the following query in Log Analytics. If the query doesn't return records, check the other sections for possible causes. This query looks for entires in the last two days, but you can modify for another time range.

``` kusto
W3CIISLog
| where TimeGenerated > ago(48h)
| order by TimeGenerated desc
```

#### Verify that the agent is sending heartbeats successfully
Verify that Azure Monitor agent is communicating properly by running the following query in Log Analytics to check if there are any records in the Heartbeat table.

``` kusto
Heartbeat
| where TimeGenerated > ago(24h)
| where Computer has "<computer name>"
| project TimeGenerated, Category, Version
| order by TimeGenerated desc
```

#### Verify that IIS logs are being created
Look at the timestamps of the log files and open the latest to see that latest timestamps are present in the log files. The default location for IIS log files is C:\\inetpub\\logs\\LogFiles\\W3SVC1.
<!-- convertborder later -->
:::image type="content" source="media/data-collection-text-log/iis-log-timestamp.png" lightbox="media/data-collection-text-log/iis-log-timestamp.png" alt-text="Screenshot of an IIS log, showing the timestamp." border="false":::

#### Verify that you specified the correct log location in the data collection rule
The data collection rule will have a section similar to the following. The `logDirectories` element specifies the path to the log file to collect from the agent computer. Check the agent computer to verify that this is correct.

``` json
    "dataSources": [
    {
            "configuration": {
                "logDirectories": ["C:\\scratch\\demo\\W3SVC1"]
            },
            "id": "myIisLogsDataSource",
            "kind": "iisLog",
            "streams": [{
                    "stream": "ONPREM_IIS_BLOB_V2"
                }
            ],
            "sendToChannels": ["gigl-dce-6a8e34db54bb4b6db22d99d86314eaee"]
        }
    ]
```

This directory should correspond to the location of the IIS logs on the agent machine.
<!-- convertborder later -->
:::image type="content" source="media/data-collection-text-log/iis-log-files.png" lightbox="media/data-collection-text-log/iis-log-files.png" alt-text="Screenshot of IIS log files on agent machine." border="false":::

#### Verify that the IIS logs are W3C formatted
Open IIS Manager and verify that the logs are being written in W3C format.

:::image type="content" source="media/data-collection-text-log/iis-log-format-setting.png" lightbox="media/data-collection-text-log/iis-log-format-setting.png" alt-text="Screenshot of IIS logging configuration dialog box on agent machine.":::

Open the IIS log file on the agent machine to verify that logs are in W3C format.
<!-- convertborder later -->
:::image type="content" source="media/data-collection-text-log/iis-log-format.png" lightbox="media/data-collection-text-log/iis-log-format.png" alt-text="Screenshot of an IIS log, showing the header, which specifies that the file is in W3C format." border="false":::


## Frequently asked questions

This section provides answers to common questions.

#### How can I collect Windows security events by using Azure Monitor Agent?

There are two ways you can collect Security events using the new agent, when sending to a Log Analytics workspace:
- You can use Azure Monitor Agent to natively collect Security Events, same as other Windows Events. These flow to the ['Event'](/azure/azure-monitor/reference/tables/Event) table in your Log Analytics workspace. 
- If you have Microsoft Sentinel enabled on the workspace, the security events flow via Azure Monitor Agent into the [`SecurityEvent`](/azure/azure-monitor/reference/tables/SecurityEvent) table instead (the same as using the Log Analytics agent). This scenario always requires the solution to be enabled first.

### Will I duplicate events if I use Azure Monitor Agent and the Log Analytics agent on the same machine? 

If you're collecting the same events with both agents, duplication occurs. This duplication could be the legacy agent collecting redundant data from the [workspace configuration](./agent-data-sources.md) data, which is collected by the data collection rule. Or you might be collecting security events with the legacy agent and enable Windows security events with Azure Monitor Agent connectors in Microsoft Sentinel.
          
Limit duplication events to only the time when you transition from one agent to the other. After you've fully tested the data collection rule and verified its data collection, disable collection for the workspace and disconnect any Microsoft Monitoring Agent data connectors.

### Does Azure Monitor Agent offer more granular event filtering options other than Xpath queries and specifying performance counters?

For Syslog events on Linux, you can select facilities and the log level for each facility.

### If I create data collection rules that contain the same event ID and associate them to the same VM, will events be duplicated?

Yes. To avoid duplication, make sure the event selection you make in your data collection rules doesn't contain duplicate events.

## Next steps

- [Collect text logs by using Azure Monitor Agent](data-collection-text-log.md).
- Learn more about [Azure Monitor Agent](azure-monitor-agent-overview.md).
- Learn more about [data collection rules](../essentials/data-collection-rule-overview.md).
