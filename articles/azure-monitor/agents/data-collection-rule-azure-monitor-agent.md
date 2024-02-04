---
title: Collect events and performance counters from virtual machines with Azure Monitor Agent
description: Describes how to collect events and performance data from virtual machines by using Azure Monitor Agent.
ms.topic: conceptual
ms.date: 7/19/2023
author: guywild
ms.author: guywild
ms.reviewer: jeffwo

---

# Collect data from virtual machines using Azure Monitor Agent

To collect data from Azure virtual machines, Virtual Machine Scale Sets, and Arc-enabled on-premises servers using [Azure Monitor Agent](azure-monitor-agent-overview.md), [create a data collection rule (DCR)](../essentials/data-collection-rule-create-edit.md) and associate it with your machines. When you create a data collection rule in the Azure portal, the portal automatically installs Azure Monitor Agent on the selected machines.      

This article provides guidance for collecting data from each data source type that Azure Monitor Agent supports.

> [!NOTE]
> To send data across tenants, you must first enable [Azure Lighthouse](../../lighthouse/overview.md).

## Prerequisites
To complete this procedure, you need: 

- Log Analytics workspace where you have at least [contributor rights](../logs/manage-access.md#azure-rbac).
- [Permissions to create Data Collection Rule objects](../essentials/data-collection-rule-create-edit.md#permissions) in the workspace.

## Collect performance counters 

You can send performance counters to both Azure Monitor Metrics and Azure Monitor Logs. 

1. Select which data you want to collect. For performance counters, you can select from a predefined set of objects and their sampling rate. For events, you can select from a set of logs and severity levels.
    <!-- convertborder later -->
    :::image type="content" source="media/data-collection-rule-azure-monitor-agent/data-collection-rule-data-source-basic-updated.png" lightbox="media/data-collection-rule-azure-monitor-agent/data-collection-rule-data-source-basic-updated.png" alt-text="Screenshot that shows the Azure portal form to select basic performance counters in a data collection rule." border="false":::

1. Select **Custom** to collect logs and performance counters that aren't [currently supported data sources](azure-monitor-agent-overview.md#data-sources-and-destinations) or to [filter events by using XPath queries](#filter-events-using-xpath-queries). You can then specify an [XPath](https://www.w3schools.com/xml/xpath_syntax.asp) to collect any specific values. For an example, see [Sample DCR](data-collection-rule-sample-agent.md).
    <!-- convertborder later -->
    :::image type="content" source="media/data-collection-rule-azure-monitor-agent/data-collection-rule-data-source-custom-updated.png" lightbox="media/data-collection-rule-azure-monitor-agent/data-collection-rule-data-source-custom-updated.png" alt-text="Screenshot that shows the Azure portal form to select custom performance counters in a data collection rule." border="false":::

> [!NOTE] 
> At this time, Microsoft.HybridCompute ([Azure Arc-enabled servers](../../azure-arc/servers/overview.md)) resources can't be viewed in [Metrics Explorer](../essentials/metrics-getting-started.md) (the Azure portal UX), but they can be acquired via the Metrics REST API (Metric Namespaces - List, Metric Definitions - List, and Metrics - List).

## Collect events

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

## Collect logs from a text or JSON file

1. From the **Data source type** dropdown, select **Custom Text Logs** or **JSON Logs**.
1. Specify the following information:
 
    - **File Pattern** - Identifies where the log files are located on the local disk. You can enter multiple file patterns separated by commas (on Linux, AMA version 1.26 or higher is required to collect from a comma-separated list of file patterns).
    
        Examples of valid inputs: 
        - 20220122-MyLog.txt 
        - ProcessA_MyLog.txt  
        - ErrorsOnly_MyLog.txt, WarningOnly_MyLog.txt
    
        > [!NOTE]
        > Multiple log files of the same type commonly exist in the same directory. For example, a machine might create a new file every day to prevent the log file from growing too large. To collect log data in this scenario, you can use a file wildcard. Use the format `C:\directoryA\directoryB\*MyLog.txt` for Windows and `/var/*.log` for Linux. There is no support for directory wildcards. 
    
    
    - **Table name** - The name of the destination table you created in your Log Analytics Workspace. For more information, see [Create a custom table](#create-a-custom-table).     
    - **Record delimiter** - Will be used in the future to allow delimiters other than the currently supported end of line (`/r/n`). 
    - **Transform** - Add an [ingestion-time transformation](../essentials/data-collection-transformations.md) or leave as **source** if you don't need to transform the collected data.
 
1. On the **Destination** tab, add one or more destinations for the data source. You can select multiple destinations of the same or different types. For instance, you can select multiple Log Analytics workspaces, which is also known as multihoming.
    <!-- convertborder later -->
    :::image type="content" source="media/data-collection-rule-azure-monitor-agent/data-collection-rule-destination.png" lightbox="media/data-collection-rule-azure-monitor-agent/data-collection-rule-destination.png" alt-text="Screenshot that shows the destination tab of the Add data source screen for a data collection rule in Azure portal." border="false":::

1. Select **Review + create** to review the details of the data collection rule and association with the set of virtual machines.
1. Select **Create** to create the data collection rule.

### Text and JSON file requirements and best practices

- Store files on the local drive of the machine on which Azure Monitor Agent is running and in the directory that is being monitored.
- Delineate the end of a record with an end of line. 
- Use ASCII or UTF-8 encoding. Other formats such as UTF-16 aren't supported.
- Create a new log file every day so that you can remove old files easily. 
- Clean up all log files in the monitored directory. Tracking many log files can drive up agent CPU and Memory usage. Wait for at least 2 days to allow ample time for all logs to be processed.
- Do not overwrite an existing file with new records. You should only append new records to the end of the file. Overwriting will cause data loss.
- Do not rename a file to a new name and then open a new file with the same name. This could cause data loss.
- Do not rename or copy large log files that match the file scan pattern in to the monitored directory. If you must, do not exceed 50MB per minute.
- Do not rename a file that matches the file scan pattern to a new name that also matches the file scan pattern. This will cause duplicate data to be ingested. 


### Create a custom table

The table created in the script has two columns: 

- `TimeGenerated` (datetime)
- `RawData` (string

This is the default table schema for log data collected from text and JSON files. If you know your final schema, you can add columns in the script before creating the table. If you don't, you can [add columns using the Log Analytics table UI](../logs/create-custom-table.md#add-or-delete-a-custom-column).  

The easiest way to make the REST call is from an Azure Cloud PowerShell command line (CLI). To open the shell, go to the Azure portal, press the Cloud Shell button, and select PowerShell. If this is your first time using Azure Cloud PowerShell, you'll need to walk through the one-time configuration wizard.

Copy and paste this script into PowerShell to create the table in your workspace: 

```code
$tableParams = @'
{
    "properties": {
        "schema": {
               "name": "{TableName}_CL",
               "columns": [
        {
                                "name": "TimeGenerated",
                                "type": "DateTime"
                        }, 
                       {
                                "name": "RawData",
                                "type": "String"
                       }
              ]
        }
    }
}
'@

Invoke-AzRestMethod -Path "/subscriptions/{subscription}/resourcegroups/{resourcegroup}/providers/microsoft.operationalinsights/workspaces/{WorkspaceName}/tables/{TableName}_CL?api-version=2021-12-01-preview" -Method PUT -payload $tableParams
```

You should receive a 200 response and details about the table you just created. 

> [!Note]
> The column names are case sensitive. For example `Rawdata` will not correctly collect the event data. It must be `RawData`.

### Sample log queries
The column names used here are for example only. The column names for your log will most likely be different.

- **Count the number of events by code.**
    
    ```kusto
    MyApp_CL
    | summarize count() by code
    ```

### Sample alert rule

- **Create an alert rule on any error event.**
    
    ```kusto
    MyApp_CL
    | where status == "Error"
    | summarize AggregatedValue = count() by Computer, bin(TimeGenerated, 15m)
    ```


### Troubleshoot
Use the following steps to troubleshoot collection of logs from text and JSON files. 

### Use the Azure Monitor Agent Troubleshooter
Use the [Azure Monitor Agent Troubleshooter](use-azure-monitor-agent-troubleshooter.md) to look for common issues and share results with Microsoft.

#### Check if you've ingested data to your custom table
Start by checking if any records have been ingested into your custom log table by running the following query in Log Analytics: 

``` kusto
<YourCustomTable>_CL
| where TimeGenerated > ago(48h)
| order by TimeGenerated desc
```
If records aren't returned, check the other sections for possible causes. This query looks for entries in the last two days, but you can modify for another time range. It can take 5-7 minutes for new data to appear in your table. The Azure Monitor Agent only collects data written to the text or JSON file after you associate the data collection rule with the virtual machine. 


#### Verify that you created a custom table
You must [create a custom log table](../logs/create-custom-table.md#create-a-custom-table) in your Log Analytics workspace before you can send data to it.

#### Verify that the agent is sending heartbeats successfully
Verify that Azure Monitor agent is communicating properly by running the following query in Log Analytics to check if there are any records in the Heartbeat table.

``` kusto
Heartbeat
| where TimeGenerated > ago(24h)
| where Computer has "<computer name>"
| project TimeGenerated, Category, Version
| order by TimeGenerated desc
```

#### Verify that you specified the correct log location in the data collection rule
The data collection rule will have a section similar to the following. The `filePatterns` element specifies the path to the log file to collect from the agent computer. Check the agent computer to verify that this is correct.


```json
"dataSources": [{
            "configuration": {
                "filePatterns": ["C:\\JavaLogs\\*.log"],
                "format": "text",
                "settings": {
                    "text": {
                        "recordStartTimestampFormat": "yyyy-MM-ddTHH:mm:ssK"
                    }
                }
            },
            "id": "myTabularLogDataSource",
            "kind": "logFile",
            "streams": [{
                    "stream": "Custom-TabularData-ABC"
                }
            ],
            "sendToChannels": ["gigl-dce-00000000000000000000000000000000"]
        }
    ]
```

This file pattern should correspond to the logs on the agent machine.

<!-- convertborder later -->
:::image type="content" source="media/data-collection-text-log/text-log-files.png" lightbox="media/data-collection-text-log/text-log-files.png" alt-text="Screenshot of text log files on agent machine." border="false":::


#### Verify that logs are being populated
The agent will only collect new content written to the log file being collected. If you're experimenting with the collection logs from a text or JSON file, you can use the following script to generate sample logs.

```powershell
# This script writes a new log entry at the specified interval indefinitely.
# Usage:
# .\GenerateCustomLogs.ps1 [interval to sleep]
#
# Press Ctrl+C to terminate script.
#
# Example:
# .\ GenerateCustomLogs.ps1 5

param (
    [Parameter(Mandatory=$true)][int]$sleepSeconds
)

$logFolder = "c:\\JavaLogs"
if (!(Test-Path -Path $logFolder))
{
    mkdir $logFolder
}

$logFileName = "TestLog-$(Get-Date -format yyyyMMddhhmm).log"
do
{
    $count++
    $randomContent = New-Guid
    $logRecord = "$(Get-Date -format s)Z Record number $count with random content $randomContent"
    $logRecord | Out-File "$logFolder\\$logFileName" -Encoding utf8 -Append
    Start-Sleep $sleepSeconds
}
while ($true)

```


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
