---
title: Collect logs from a JSON file with Azure Monitor Agent 
description: Configure a data collection rule to collect log data from a JSON file on a virtual machine using Azure Monitor Agent.
ms.topic: conceptual
ms.date: 07/12/2024
author: guywi-ms
ms.author: guywild
ms.reviewer: jeffwo
---

# Collect logs from a JSON file with Azure Monitor Agent 
**Custom JSON Logs** is one of the data sources used in a [data collection rule (DCR)](../essentials/data-collection-rule-create-edit.md). Details for the creation of the DCR are provided in [Collect data with Azure Monitor Agent](./azure-monitor-agent-data-collection.md). This article provides additional details for the text and JSON logs type.

Many applications and services will log information to a JSON files instead of standard logging services such as Windows Event log or Syslog. This data can be collected with [Azure Monitor Agent](azure-monitor-agent-overview.md) and stored in a Log Analytics workspace with data collected from other sources.

## Prerequisites

- Log Analytics workspace where you have at least [contributor rights](../logs/manage-access.md#azure-rbac).
- A data collection endpoint (DCE) if you plan to use Azure Monitor Private Links. The data collection endpoint must be in the same region as the Log Analytics workspace. See [How to set up data collection endpoints based on your deployment](../essentials/data-collection-endpoint-overview.md#how-to-set-up-data-collection-endpoints-based-on-your-deployment) for details.
- Either a new or existing DCR described in [Collect data with Azure Monitor Agent](./azure-monitor-agent-data-collection.md).

## Basic operation
The following diagram shows the basic operation of collecting log data from a json file. 

1. The agent watches for any log files that match a specified name pattern on the local disk. 
2. Each entry in the log is collected and sent to Azure Monitor. The incoming stream defined by the user is used to parse the log data into columns.
3. A default transformation is used if the schema of the incoming stream matches the schema of the target table.

:::image type="content" source="media/data-collection-log-json/json-log-collection.png" lightbox="media/data-collection-log-json/json-log-collection.png" alt-text="Screenshot that shows log query returning results of comma-delimited file collection." border="false":::


## JSON file requirements and best practices
The file that the Azure Monitor Agent is monitoring must meet the following requirements:

- The file must be stored on the local drive of the machine with the Azure Monitor Agent in the directory that is being monitored.
- Each record must be delineated with an end of line. 
- The file must use ASCII or UTF-8 encoding. Other formats such as UTF-16 aren't supported.
- New records should be appended to the end of the file and not overwrite old records. Overwriting will cause data loss.
- JSON text must be contained in a single row. The JSON body format is not supported. See sample below.
     

Adhere to the following recommendations to ensure that you don't experience data loss or performance issues:
  

- Create a new log file every day so that you can easily clean up old files.
- Continuously clean up log files in the monitored directory. Tracking many log files can drive up agent CPU and Memory usage. Wait for at least 2 days to allow ample time for all logs to be processed.
- Don't rename a file that matches the file scan pattern to another name that also matches the file scan pattern. This will cause duplicate data to be ingested. 
- Don't rename or copy large log files that match the file scan pattern into the monitored directory. If you must, do not exceed 50MB per minute.



## Custom table
Before you can collect log data from a JSON file, you must create a custom table in your Log Analytics workspace to receive the data. The table schema must match the columns in the incoming stream, or you must add a transformation to ensure that the output schema matches the table. 

>
> Warning: You shouldn’t use an existing custom table used by MMA agents. Your MMA agents won't be able to write to the table once the first AMA agent writes to the table. You should create a new table for AMA to use to prevent MMA data loss.
>

For example, you can use the following PowerShell script to create a custom table with multiple columns.  

```powershell
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
                        "name": "MyStringColumn",
                        "type": "string"
                    },
                    {
                        "name": "MyIntegerColumn",
                        "type": "int"
                    },
                    {
                        "name": "MyRealColumn",
                        "type": "real"
                    },
                    {
                        "name": "MyBooleanColumn",
                        "type": "bool"
                    },
                    {
                        "name": "FilePath",
                        "type": "string"
                    }
              ]
        }
    }
}
'@

Invoke-AzRestMethod -Path "/subscriptions/{subscription}/resourcegroups/{resourcegroup}/providers/microsoft.operationalinsights/workspaces/{WorkspaceName}/tables/{TableName}_CL?api-version=2021-12-01-preview" -Method PUT -payload $tableParams
```


## Create a data collection rule for a JSON file

> [!NOTE]
> The agent based JSON custom file ingestion is currently in preview and does not have a complete UI experience in the portal yet. While you can create the DCR using the portal, you must modify it to define the columns in the incoming stream. See the **Resource Manager template** tab for details on creating the required DCR.

### Incoming stream
JSON files include a property name with each value, and the incoming stream in the DCR needs to include a column matching the name of each property. If you create the DCR using the Azure portal, the columns in the following table will be included in the incoming stream, and you must manually modify the DCR or create it using another method where you can explicitly define the incoming stream.

 | Column | Type | Description |
|:---|:---|:---|
| `TimeGenerated` | datetime | The time the record was generated. |
| `RawData` | string | This column will be empty for a JSON log. |
| `FilePath` | string | If you add this column to the incoming stream in the DCR, it will be populated with the path to the log file. This column is not created automatically and can't be added using the portal. You must manually modify the DCR created by the portal or create the DCR using another method where you can explicitly define the incoming stream. |

### [Portal](#tab/portal)

Create a data collection rule, as described in [Collect data with Azure Monitor Agent](./azure-monitor-agent-data-collection.md). In the **Collect and deliver** step, select **JSON Logs**  from the **Data source type** dropdown. 

| Setting | Description |
|:---|:---|
| File pattern | Identifies the location and name of log files on the local disk. Use a wildcard for filenames that vary, for example when a new file is created each day with a new name. You can enter multiple file patterns separated by commas.<br><br>Examples:<br>- C:\Logs\MyLog.json<br>- C:\Logs\MyLog*.json<br>- C:\App01\AppLog.json, C:\App02\AppLog.json<br>- /var/mylog.json<br>- /var/mylog*.json |
| Table name | Name of the destination table in your Log Analytics Workspace. |     
| Record delimiter | Not currently used but reserved for future potential use allowing delimiters other than the currently supported end of line (`/r/n`). | 
| Transform | [Ingestion-time transformation](../essentials/data-collection-transformations.md) to filter records or to format the incoming data for the destination table. Use `source` to leave the incoming data unchanged. |

 

### [Resource Manager template](#tab/arm)

Use the following ARM template to create a DCR for collecting text log files. In addition to the parameter values, you may need to modify the following values in the template:

- `columns`: Modify with the list of columns in the JSON log that you're collecting.
- `transformKql`: Modify the default transformation if the schema of the incoming stream doesn't match the schema of the target table. The output schema of the transformation must match the schema of the target table.

> [!IMPORTANT]
> If you create the DCR using an ARM template, you still must associate the DCR with the agents that will use it. You can edit the DCR in the Azure portal and select the agents as described in [Add resources](./azure-monitor-agent-data-collection.md#add-resources)


```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "dataCollectionRuleName": {
            "type": "string",
            "metadata": {
              "description": "Unique name for the DCR. "
            },
        },
        "location": {
            "type": "string",
            "metadata": {
              "description": "Region for the DCR. Must be the same location as the Log Analytics workspace. "
        },
        "filePatterns": {
            "type": "string",
            "metadata": {
              "description": "Path on the local disk for the log file to collect. May include wildcards.Enter multiple file patterns separated by commas (AMA version 1.26 or higher required for multiple file patterns on Linux)."
            },
        },
        "tableName": {
            "type": "string",
            "metadata": {
              "description": "Name of destination table in your Log Analytics workspace. "
            },
        },
        "workspaceResourceId": {
            "type": "string",
            "metadata": {
              "description": "Resource ID of the Log Analytics workspace with the target table."
            },
        }
    },
    "variables": {
      "tableOutputStream": "['Custom-',concat(parameters('tableName'))]"
    },
    "resources": [
        {
            "type": "Microsoft.Insights/dataCollectionRules",
            "name": "[parameters('dataCollectionRuleName')]",
            "location":  "[parameters('location')]",
            "apiVersion": "2022-06-01",
            "properties": {
                "streamDeclarations": {
                    "Custom-JSONLog-stream": {
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
                                "name": "MyStringColumn",
                                "type": "string"
                            },
                            {
                                "name": "MyIntegerColumn",
                                "type": "int"
                            },
                            {
                                "name": "MyRealColumn",
                                "type": "real"
                            },
                            {
                                "name": "MyBooleanColumn",
                                "type": "bool"
                            }
                        ]
                    }
                },
                "dataSources": {
                    "logFiles": [
                        {
                            "streams": [
                                "Custom-Json-stream"
                            ],
                            "filePatterns": [
                                "[parameters('filePatterns')]"
                            ],
                            "format": "json",
                            "name": "Custom-Json-dataSource"
                        }
                    ]
                },
                "destinations": {
                    "logAnalytics": [
                        {
                            "workspaceResourceId":  "[parameters('workspaceResourceId')]",
                            "name": "workspace"
                        }
                    ]
                },
                "dataFlows": [
                    {
                        "streams": [
                            "Custom-Json-dataSource"
                        ],
                        "destinations": [
                            "workspace"
                        ],
                        "transformKql": "source",
                        "outputStream": "[variables('tableOutputStream')]"
                    }
                ]
            }
        }
    ]
}
```
---

## Troubleshooting
Go through the following steps if you aren't collecting data from the JSON log that you're expecting.

- Verify that data is being written to the log file being collected.
- Verify that the name and location of the log file matches the file pattern you specified.
- Verify that the schema of the incoming stream in the DCR matches the schema in the log file.
- Verify that the schema of the target table matches the incoming stream or that you have a transformation that will convert the incoming stream to the correct schema.
- See [Verify operation](./azure-monitor-agent-data-collection.md#verify-operation) to verify whether the agent is operational and data is being received.




## Next steps

Learn more about: 

- [Azure Monitor Agent](azure-monitor-agent-overview.md).
- [Data collection rules](../essentials/data-collection-rule-overview.md).
- [Best practices for cost management in Azure Monitor](../best-practices-cost.md).
