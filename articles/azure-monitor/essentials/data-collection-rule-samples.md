---
title: Sample data collection rules (DCRs) in Azure Monitor
description: Sample data collection rule for different Azure Monitor data collection scenarios.
ms.topic: sample
ms.date: 11/15/2023
ms.custom: references_region
ms.reviewer: jeffwo

---

# Sample data collection rules (DCRs) in Azure Monitor
This article includes sample [data collection rules (DCRs)](./data-collection-rule-overview.md) for different scenarios. For descriptions of each of the properties in these DCRs, see [Data collection rule structure](./data-collection-rule-structure.md).

## Azure Monitor agent - events and performance data
The sample [data collection rule](../essentials/data-collection-rule-overview.md) below is for virtual machines with [Azure Monitor agent](../agents/data-collection-rule-azure-monitor-agent.md) and has the following details:

- Performance data
  - Collects specific Processor, Memory, Logical Disk, and Physical Disk counters every 15 seconds and uploads every minute.
  - Collects specific Process counters every 30 seconds and uploads every 5 minutes.
- Windows events
  - Collects Windows security events and uploads every minute.
  - Collects Windows application and system events and uploads every 5 minutes.
- Syslog
  - Collects Debug, Critical, and Emergency events from cron facility.
  - Collects Alert, Critical, and Emergency events from syslog facility.
- Destinations
  - Sends all data to a Log Analytics workspace named centralWorkspace.

> [!NOTE]
> For an explanation of XPaths that are used to specify event collection in data collection rules, see [Limit data collection with custom XPath queries](../agents/data-collection-rule-azure-monitor-agent.md#filter-events-using-xpath-queries).


```json
{
    "location": "eastus",
    "properties": {
      "dataSources": {
        "performanceCounters": [
          {
            "name": "cloudTeamCoreCounters",
            "streams": [
              "Microsoft-Perf"
            ],
            "scheduledTransferPeriod": "PT1M",
            "samplingFrequencyInSeconds": 15,
            "counterSpecifiers": [
              "\\Processor(_Total)\\% Processor Time",
              "\\Memory\\Committed Bytes",
              "\\LogicalDisk(_Total)\\Free Megabytes",
              "\\PhysicalDisk(_Total)\\Avg. Disk Queue Length"
            ]
          },
          {
            "name": "appTeamExtraCounters",
            "streams": [
              "Microsoft-Perf"
            ],
            "scheduledTransferPeriod": "PT5M",
            "samplingFrequencyInSeconds": 30,
            "counterSpecifiers": [
              "\\Process(_Total)\\Thread Count"
            ]
          }
        ],
        "windowsEventLogs": [
          {
            "name": "cloudSecurityTeamEvents",
            "streams": [
              "Microsoft-Event"
            ],
            "scheduledTransferPeriod": "PT1M",
            "xPathQueries": [
              "Security!*"
            ]
          },
          {
            "name": "appTeam1AppEvents",
            "streams": [
              "Microsoft-Event"
            ],
            "scheduledTransferPeriod": "PT5M",
            "xPathQueries": [
              "System!*[System[(Level = 1 or Level = 2 or Level = 3)]]",
              "Application!*[System[(Level = 1 or Level = 2 or Level = 3)]]"
            ]
          }
        ],
        "syslog": [
          {
            "name": "cronSyslog",
            "streams": [
              "Microsoft-Syslog"
            ],
            "facilityNames": [
              "cron"
            ],
            "logLevels": [
              "Debug",
              "Critical",
              "Emergency"
            ]
          },
          {
            "name": "syslogBase",
            "streams": [
              "Microsoft-Syslog"
            ],
            "facilityNames": [
              "syslog"
            ],
            "logLevels": [
              "Alert",
              "Critical",
              "Emergency"
            ]
          }
        ]
      },
      "destinations": {
        "logAnalytics": [
          {
            "workspaceResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.OperationalInsights/workspaces/my-workspace",
            "name": "centralWorkspace"
          }
        ]
      },
      "dataFlows": [
        {
          "streams": [
            "Microsoft-Perf",
            "Microsoft-Syslog",
            "Microsoft-Event"
          ],
          "destinations": [
            "centralWorkspace"
          ]
        }
      ]
    }
  }
```

## Azure Monitor agent - text logs
The sample data collection rule below is used to collect [text logs using Azure Monitor agent](../agents/data-collection-text-log.md).

```json
{
    "location": "eastus",
    "properties": {
        "dataCollectionEndpointId": "/subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/my-resource-groups/providers/Microsoft.Insights/dataCollectionEndpoints/my-data-collection-endpoint",
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
                        "C:\\JavaLogs\\*.log"
                    ],
                    "format": "text",
                    "settings": {
                        "text": {
                            "recordStartTimestampFormat": "ISO 8601"
                        }
                    },
                    "name": "myLogFileFormat-Windows"
                },
                {
                    "streams": [
                        "Custom-MyLogFileFormat" 
                    ],
                    "filePatterns": [
                        "//var//*.log"
                    ],
                    "format": "text",
                    "settings": {
                        "text": {
                            "recordStartTimestampFormat": "ISO 8601"
                        }
                    },
                    "name": "myLogFileFormat-Linux"
                }
            ]
        },
        "destinations": {
            "logAnalytics": [
                {
                    "workspaceResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.OperationalInsights/workspaces/my-workspace",
                    "name": "MyDestination"
                }
            ]
        },
        "dataFlows": [
            {
                "streams": [
                    "Custom-MyLogFileFormat"
                ],
                "destinations": [
                    "MyDestination"
                ],
                "transformKql": "source",
                "outputStream": "Custom-MyTable_CL"
            }
        ]
    }
}
```

## Event Hubs
The sample data collection rule below is used to collect [data from an event hub](../logs/ingest-logs-event-hub.md).

```json
{
    "location": "eastus",
    "properties": {
        "dataCollectionEndpointId": "/subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/my-resource-groups/providers/Microsoft.Insights/dataCollectionEndpoints/my-data-collection-endpoint",
        "streamDeclarations": {
            "Custom-MyEventHubStream": {
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
                        "name": "Properties",
                        "type": "dynamic"
                    }
                ]
            }
        },
        "dataSources": {
            "dataImports": {
                "eventHub": {
                            "consumerGroup": "<consumer-group>",
                            "stream": "Custom-MyEventHubStream",
                            "name": "myEventHubDataSource1"
                            }
                }
        },
        "destinations": {
            "logAnalytics": [
                {
                    "workspaceResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.OperationalInsights/workspaces/my-workspace",
                    "name": "MyDestination"
                }
            ]
        },
        "dataFlows": [
            {
                "streams": [
                    "Custom-MyEventHubStream"
                ],
                "destinations": [
                    "MyDestination"
                ],
                "transformKql": "source",
                "outputStream": "Custom-MyTable_CL"
            }
        ]
    }
}
```

## Logs ingestion API
The sample [data collection rule](../essentials/data-collection-rule-overview.md) below is used with the [Logs ingestion API](../logs/logs-ingestion-api-overview.md). It has the following details:

- Sends data to a table called MyTable_CL in a workspace called my-workspace.
- Applies a [transformation](../essentials//data-collection-transformations.md) to the incoming data.


```json
{
    "location": "eastus",
    "properties": {
        "dataCollectionEndpointId": "/subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/my-resource-groups/providers/Microsoft.Insights/dataCollectionEndpoints/my-data-collection-endpoint",
        "streamDeclarations": {
            "Custom-MyTable": {
                "columns": [
                    {
                        "name": "Time",
                        "type": "datetime"
                    },
                    {
                        "name": "Computer",
                        "type": "string"
                    },
                    {
                        "name": "AdditionalContext",
                        "type": "string"
                    }
                ]
            }
        },
        "destinations": {
            "logAnalytics": [
                {
                    "workspaceResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/cefingestion/providers/microsoft.operationalinsights/workspaces/my-workspace",
                    "name": "LogAnalyticsDest"
                }
            ]
        },
        "dataFlows": [
            {
                "streams": [
                    "Custom-MyTable"
                ],
                "destinations": [
                    "LogAnalyticsDest"
                ],
                "transformKql": "source | extend jsonContext = parse_json(AdditionalContext) | project TimeGenerated = Time, Computer, AdditionalContext = jsonContext, ExtendedColumn=tostring(jsonContext.CounterName)",
                "outputStream": "Custom-MyTable_CL"
            }
        ]
    }
}
```

## Workspace transformation DCR
The sample [data collection rule](../essentials/data-collection-rule-overview.md) below is used as a 
[workspace transformation DCR](../essentials/data-collection-transformations.md#workspace-transformation-dcr) to transform all data sent to a table called *LAQueryLogs*.

```json
{
    "location": "eastus",
    "properties": {
        "destinations": {
            "logAnalytics": [
                {
                    "workspaceResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.OperationalInsights/workspaces/my-workspace",
                    "name": "clv2ws1"
                }
            ]
        },
        "dataFlows": [
            {
                "streams": [
                    "Microsoft-Table-LAQueryLogs"
                ],
                "destinations": [
                    "clv2ws1"
                ],
                "transformKql": "source |where QueryText !contains 'LAQueryLogs' | extend Context = parse_json(RequestContext) | extend Resources_CF = tostring(Context['workspaces']) |extend RequestContext = ''"
            }
        ]
    }
}
```


## Next steps

- [Get details for the different properties in a DCR](../essentials/data-collection-rule-structure.md)
- [See different methods for creating a DCR](../essentials/data-collection-rule-create-edit.md)

