 ---
title: Collect logs from a text or JSON file with Azure Monitor Agent 
description: Configure a data collection rule to collect log data from a text or JSON file on a virtual machine using Azure Monitor Agent.
ms.topic: conceptual
ms.date: 03/01/2024
author: guywi-ms
ms.author: guywild
ms.reviewer: jeffwo
---

# Collect logs from a text or JSON file with Azure Monitor Agent 

Many applications and services will log information to text or JSON files instead of standard logging services such as Windows Event log or Syslog. This data can be collected with [Azure Monitor Agent](azure-monitor-agent-overview.md) and stored in a Log Analytics workspace with data collected from other sources.

**Custom Text Logs** and **Custom JSON Logs** are two of the data sources used in a [data collection rule (DCR)](../essentials/data-collection-rule-create-edit.md). Details for the creation of the DCR are provided in [Collect data with Azure Monitor Agent](./azure-monitor-agent-data-collection.md). This article provides additional details for the text and JSON logs type.

> [!Note]
> JSON ingestion is currently in Preview.

## Prerequisites
To complete this procedure, you need: 

- Log Analytics workspace where you have at least [contributor rights](../logs/manage-access.md#azure-rbac).
- A data collection endpoint (DCE) if you plan to use Azure Monitor Private Links. The data collection endpoint must be in the same region as the Log Analytics workspace. See [How to set up data collection endpoints based on your deployment](../essentials/data-collection-endpoint-overview.md#how-to-set-up-data-collection-endpoints-based-on-your-deployment) for details.

## Text or JSON file requirements and best practices
The file that the Azure Monitor Agent is monitoring must meet the following requirements:

- The file must be stored on the local drive of the machine with the Azure Monitor Agent in the directory that is being monitored.
- Each record must be delineated with an end of line. 
- The file must use ASCII or UTF-8 encoding. Other formats such as UTF-16 aren't supported.
- New records should be appended to the end of the file and not overwrite old records. Overwriting will cause data loss.
- JSON text must be contained in a single row. The JSON body format is not supported. For example `{"Element":"Gold","Symbol":"Au","NobleMetal":true,"AtomicNumber":79,"MeltingPointC":1064.18}`. 
     

Adhere to the following recommendations to ensure that you don't experience data loss or performance issues:
  

- Create a new log file every day so that you can easily clean up old files.
- Continuously clean up log files in the monitored directory. Tracking many log files can drive up agent CPU and Memory usage. Wait for at least 2 days to allow ample time for all logs to be processed.
- Don't rename a monitored file and then open a new file with the same name. This could cause data loss.
- Don't rename a file that matches the file scan pattern to another name that also matches the file scan pattern. This will cause duplicate data to be ingested. 
- Don't rename or copy large log files that match the file scan pattern into the monitored directory. If you must, do not exceed 50MB per minute.



## Incoming stream
When you create the DCR using the Azure portal, the incoming stream of data includes the columns in the following table. To modify the incoming stream, you must manually modify the DCR created by the portal or create the DCR using another method where you can explicitly define the incoming stream.

 | Column | Type | Description |
|:---|:---|:---|
| `TimeGenerated` | datetime | The time the record was generated. |
| `RawData` | string | For a text log, this will include the entire log entry in a single column. You can use a transformation if you want to break down this data into multiple columns. For a JSON file, this column will be empty. |
| `FilePath` | string | If you add this column to either a text file or a JSON file, it will include the path to the log file. |
| Additional columns | varies | Add additional columns to the incoming stream of the DCR for a JSON file that match the columns in the log file. |

## Create a custom table
Before you can collect log data from a text or JSON file, you must create a custom table in your Log Analytics workspace to receive the data. The table schema must match the data you are collecting, or you must add a transformation to ensure that the output schema matches the table.

The incoming stream of data from 

 The default table schema for log data collected from text files is 'TimeGenerated' and 'RawData'. If you add 
 
  Adding the 'FilePath' to either team is optional. If you know your final schema or your source is a JSON log, you can add the final columns in the script before creating the table. You can always [add columns using the Log Analytics table UI](../logs/create-custom-table.md#add-or-delete-a-custom-column) later. 

The table created in the script has two columns: 

- `TimeGenerated` (datetime) [Required]
- `RawData` (string) [Optional if table schema provided]
- 'FilePath' (string) [Optional]
- `YourOptionalColumn` (string) [Optional]

 

Your column names and JSON attributes must exactly match to automatically parse into the table. Both columns and JSON attributes are case sensitive. For example `Rawdata` will not collect the event data. It must be `RawData`. Ingestion will drop JSON attributes that do not have a corresponding column. 

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
                       },
                       {
                                "name": "FilePath",
                                "type": "String"
                       },
                      {
                                "name": "YourOptionalColumn",
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

## Create a data collection rule for a text or JSON file

### [Portal](#tab/portal)

Create a data collection rule, as described in [Collect data with Azure Monitor Agent](./azure-monitor-agent-data-collection.md). In the **Collect and deliver** step, select **Custom Text Logs** or **JSON Logs**  from the **Data source type** dropdown. 
 

| Setting | Description |
|:---|:---|
| File pattern | Identifies the location and name of log files on the local disk. Use a wildcard for filenames that vary, for example when a new file is created each daya with a new name. You can enter multiple file patterns separated by commas.<br><br>Examples:<br>- C:\Logs\MyLog.txt<br>- C:\Logs\MyLog*.txt<br>- C:\App01\AppLog.txt, C:\App02\AppLog.txt<br>- /var/mylog.log<br>- /var/mylog*.log |
| Table name | Name of the destination table in your Log Analytics Workspace. |     
| Record delimiter | Not currently used but reserved for future potential use allowing delimiters other than the currently supported end of line (`/r/n`). | 
| Transform | [Ingestion-time transformation](../essentials/data-collection-transformations.md) to filter records or to format the incoming data for the destination table. Use `source` to leave the incoming data unchanged. |

 

### [Resource Manager template](#tab/arm)

### Text file
```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
        {
            "type": "Microsoft.Insights/dataCollectionRules",
            "name": "dataCollectionRuleName",
            "location": "location",
            "apiVersion": "2022-06-01",
            "properties": {
                "dataCollectionEndpointId":  "endpointResourceId",
                "streamDeclarations": {
                    "Custom-MyLogFileFormat": {
                        "columns": [
                            {
                                "name": "TimeGenerated",
                                "type": "datetime"
                            },
                            {
                                "name": "RawData",
                                "type": "string"
                            },
                            {
                                "name": "FilePath",
                                "type": "String"
                            },
                            {
                                "name": "YourOptionalColumn" ,
                                "type": "string"
                            }
                        ]
                    }
                },
                "dataSources": {
                    "logFiles": [
                        {
                            "streams": [
                                "Custom-MyLogFileFormat"
                            ],
                            "filePatterns": [
                                "filePatterns"
                            ],
                            "format": "text",
                            "settings": {
                                "text": {
                                    "recordStartTimestampFormat": "ISO 8601"
                                }
                            },
                            "name": "myLogFileFormat-Windows"
                        }
                    ]
                },
                "destinations": {
                    "logAnalytics": [
                        {
                            "workspaceResourceId": "workspaceResourceId",
                            "name": "workspaceName"
                        }
                    ]
                },
                "dataFlows": [
                    {
                        "streams": [
                            "Custom-MyLogFileFormat"
                        ],
                        "destinations": [
                            "workspaceName"
                        ],
                        "transformKql": "source",
                        "outputStream": "tableName"
                    }
                ]
            }
        }
    ],
    "outputs": {
        "dataCollectionRuleId": {
            "type": "string",
            "value": "[resourceId('Microsoft.Insights/dataCollectionRules', parameters('dataCollectionRuleName'))]"
        }
    }
}
```

### JSON file

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
        {
            "type": "Microsoft.Insights/dataCollectionRules",
            "name": "dataCollectionRuleName",
            "location":  "location" ,
            "apiVersion": "2022-06-01",
            "properties": {
                "dataCollectionEndpointId":  "endpointResourceId" ,
                "streamDeclarations": {
                    "Custom-JSONLog": {
                        "columns": [
                            {
                                "name": "TimeGenerated",
                                "type": "datetime"
                            },
                            {
                                "name": "FilePath",
                                "type": "String"
                            },
                            {
                                "name": "YourFirstAttribute",
                                "type": "string"
                            },
                            {
                                "name": "YourSecondAttribute",
                                "type": "string"
                            }
                        ]
                    }
                },
                "dataSources": {
                    "logFiles": [
                        {
                            "streams": [
                                "Custom-JSONLog"
                            ],
                            "filePatterns": [
                                "filePatterns"
                            ],
                            "format": "json",
                            "settings": {
                            },
                            "name": "myLogFileFormat"
                        }
                    ]
                },
                "destinations": {
                    "logAnalytics": [
                        {
                            "workspaceResourceId":  "workspaceResourceId" ,
                            "name": "workspaceName"
                        }
                    ]
                },
                "dataFlows": [
                    {
                        "streams": [
                            "Custom-JSONLog"
                        ],
                        "destinations": [
                            "workspaceName"
                        ],
                        "transformKql": "source",
                        "outputStream": "tableName"
                    }
                ]
            }
        }
    ],
    "outputs": {
        "dataCollectionRuleId": {
            "type": "string",
            "value": "[resourceId('Microsoft.Insights/dataCollectionRules',  `dataCollectionRuleName`"
        }
    }
}
```


Update the following values in the Resource Manager template:

| Parameter | Description |
|:---|:---|
| `workspaceResorceId`:| The data collection rule requires the resource ID of your workspace. Navigate to your workspace in the **Log Analytics workspaces** menu in the Azure portal. From the **Properties** page, copy the **Resource ID**. |
| `dataCollectionRuleName` | The name that you define for the data collection rule. Example "AwesomeDCR" |
| `location` | The data center that the rule will be located in. Must be the same data center as the Log Analytics Workspace. Example "WestUS2" |
| `endpointResourceId` | This is the ID of the DCRE. Example "/subscriptions/63b9abf1-7648-4bb2-996b-023d7aa492ce/resourceGroups/Awesome/providers/Microsoft.Insights/dataCollectionEndpoints/AwesomeDCE" |
| `workspaceName` | This is the name of your workspace. Example `AwesomeWorkspace` |
| `tableName` | The name of the destination table you created in your Log Analytics Workspace. For more information, see [Create a custom table](#create-a-custom-table). Example `AwesomeLogFile_CL` |
| `streamDeclarations` | Defines the columns of the incoming data. This must match the structure of the log file. Your columns names and JSON attributes must exactly match to automatically parse into the table. Both column names and JSON attribute are case sensitive. For example, `Rawdata` will not collect the event data. It must be `RawData`. Ingestion will drop JSON attributes that do not have a corresponding column. |
| `filePatterns` | Identifies where the log files are located on the local disk. You can enter multiple file patterns separated by commas (on Linux, AMA version 1.26 or higher is required to collect from a comma-separated list of file patterns). Examples of valid inputs: 20220122-MyLog.txt, ProcessA_MyLog.txt, ErrorsOnly_MyLog.txt, WarningOnly_MyLog.txt |
| `transformKql` | Specifies a [transformation](../logs/../essentials//data-collection-transformations.md) to apply to the incoming data before it's sent to the workspace or leave as **source** if you don't need to transform the collected data. |




    

When the deployment is complete, expand the **Deployment details** box and select your data collection rule to view its details. Select **JSON View**.

:::image type="content" source="media/data-collection-text-log/data-collection-rule-details.png" lightbox="media/data-collection-text-log/data-collection-rule-details.png" alt-text="Screenshot that shows the Overview pane in the portal with data collection rule details.":::

Change the API version to **2022-06-01**.

:::image type="content" source="media/data-collection-text-log/data-collection-rule-json-view.png" lightbox="media/data-collection-text-log/data-collection-rule-json-view.png" alt-text="Screenshot that shows JSON view for data collection rule.":::


---

## Delimited log files
Many text log files have entries that are delimited by a character such as a comma. To parse this data into separate columns, use a transformation with the [split function](/azure/data-explorer/kusto/query/split-function).

For example, consider a text file with the following comma-delimited data. These fields could desscribed as: `Time`, `Code`, `Severity`,`Module`, and `Message`. 

```plaintext
2024-06-21 19:17:34,1423,Error,Sales,Unable to connect to pricing service.
2024-06-21 19:18:23,1420,Information,Sales,Pricing service connection established.
2024-06-21 21:45:13,2011,Warning,Procurement,Module failed and was restarted.
2024-06-21 23:53:31,4100,Information,Data,Nightly backup complete.
```

The following transformation parses the data into separate columns:

```kusto
source | project d = split(RawData,",") | project TimeGenerated=todatetime(d[0]), Code=toint(d[1]), Severity=tostring(d[2]), Module=tostring(d[3]), Message=tostring(d[4])
```

:::image type="content" source="media/data-collection-text-log/delimited-results.png" lightbox="media/data-collection-text-log/delimited-resultspng" alt-text="Screenshot that shows log query returning results of comma-delimited file collection.":::



Because `split` returns dynamic data, you must use functions such as `tostring` and `toint` to convert the data to the correct scalar type. You also need to provide a name for each entry that matches the column name in the target table. Note that this example provides a `TimeGenerated` value. If this was not provided, the ingestion time would be used.

:::image type="content" source="media/data-collection-text-log/delimited-results.png" lightbox="media/data-collection-text-log/delimited-resultspng" alt-text="Screenshot that shows log query returning results of comma-delimited file collection.":::



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

## Transformation

To transfom the data into a table with columns TimeGenerated, Element, Symbol, NobleMetal, AtomicNumber and Melting point use this transform:  "transformKql": "source|extend d=todynamic(RawData)|project TimeGenerated, Element=tostring(d.Element), Symbol=tostring(d.Symbol), NobleMetal=tostring(d.NobleMetal), AtomicNumber=tostring(d.AtommicNumber), MeltingPointC=tostring(d.MeltingPointC)


## Troubleshoot
Use the following steps to troubleshoot collection of logs from text and JSON files. 

### Check if you've ingested data to your custom table
Start by checking if any records have been ingested into your custom log table by running the following query in Log Analytics: 

``` kusto
<YourCustomTable>_CL
| where TimeGenerated > ago(48h)
| order by TimeGenerated desc
```
If records aren't returned, check the other sections for possible causes. This query looks for entries in the last two days, but you can modify for another time range. It can take 5-7 minutes for new data to appear in your table. The Azure Monitor Agent only collects data written to the text or JSON file after you associate the data collection rule with the virtual machine. 


### Verify that you created a custom table
You must [create a custom log table](../logs/create-custom-table.md#create-a-custom-table) in your Log Analytics workspace before you can send data to it.

### Verify that the agent is sending heartbeats successfully
Verify that Azure Monitor agent is communicating properly by running the following query in Log Analytics to check if there are any records in the Heartbeat table.

``` kusto
Heartbeat
| where TimeGenerated > ago(24h)
| where Computer has "<computer name>"
| project TimeGenerated, Category, Version
| order by TimeGenerated desc
```

### Verify that you specified the correct log location in the data collection rule
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

### Use the Azure Monitor Agent Troubleshooter
Use the [Azure Monitor Agent Troubleshooter](use-azure-monitor-agent-troubleshooter.md) to look for common issues and share results with Microsoft.

### Verify that logs are being populated
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


## Example
Consider the following log file used by an application running on a virtual machine. The log files are stored in the `C:\Logs` folder and have a name that starts with `AppLog` followed by the date. For 
example, `appLog240621.txt`.

:::image type="content" source="media/data-collection-text-log/example-text-logs.png" lightbox="media/data-collection-text-log/example-text-logs.png" alt-text="Screenshot that shows contents of example text log file.":::

The contents of a log file are shown in the following image. Each line is comma-delimited and contains the following fields: `Time`, `Code`, `Severity`,`Module`, and `Message`.

:::image type="content" source="media/data-collection-text-log/example-text-contents.png" lightbox="media/data-collection-text-log/example-text-contents.png" alt-text="Screenshot that shows contents of example text log file.":::

The following sections show different options for collection this log data.

### Simple table with single column
This strategy uses a table with a single column called `RawData`. No transformation is required since the table corresponds to the default schema of the log file.



### Parse log data into columns
This strategy uses a table with a column for each field in the log file. A transformation is used to parse each 




## Next steps

Learn more about: 

- [Azure Monitor Agent](azure-monitor-agent-overview.md).
- [Data collection rules](../essentials/data-collection-rule-overview.md).
- [Best practices for cost management in Azure Monitor](../best-practices-cost.md).
