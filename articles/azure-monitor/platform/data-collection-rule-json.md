---
title: Data Collection Rules in Azure Monitor agent (preview)
description: T
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/11/2020

---

# Configure data collection for the Azure Monitor agent using JSON (preview)
Data Collection Rules (DCR) define the details of data to be collected from the guest operating system of virtual machines monitored by the Azure Monitor agent. This article describes the structure of a DCR and you directly work with its JSON definition. This might be a DCR that you create in the Azure portal and then export for editing, or you may choose to create a new DCR by editing it directly.

## Components of a DCR
A Data Collection Rule (DCR) defines what data should be collected and where that data should be sent. It's made up of the following components.

| Component | Description |
|:---|:---|
| Data sources | Unique source of monitoring data with its own format and method exposing its data. A single virtual machine has multiple data sources, such as Windows event log, performance counters, and syslog. Each data source matches are particular data source type as described below. |
| Streams | Unique handle that describes a set of data sources that will be transformed and schematized as one type. Each data source requires one or more streams, and one stream may be used by multiple data sources. All data sources in a stream share a common schema. Use multiple streams for example, when you want to send a particular data source to multiple tables in the same Log Analytics workspace. |
| Destinations | Set of destinations where the data should be sent. Examples include Log Analytics workspace, Azure Monitor Metrics, and Azure Event Hubs. | 
| Data flows | Definitions of which streams should be sent to which destinations. | 


## Data source types
Each data source has a Data Source Type, and the type defines the properties that must be specified for the data source. The data source types currently available are shown the following table:

| Data source type | Description | 
|:---|:---|
| [extension](https://review.docs.microsoft.com/en-us/rest/api/documentation-preview/datacollectionrules/datacollectionrules_create?view=azure-rest-preview&branch=openapiHub_production_ad39a35d2f16#extensiondatasource) | VM extension-based data source |
| [performanceCounters](https://review.docs.microsoft.com/en-us/rest/api/documentation-preview/datacollectionrules/datacollectionrules_create?view=azure-rest-preview&branch=openapiHub_production_ad39a35d2f16#perfcounterdatasource) | Performance counters |
| [syslog](https://review.docs.microsoft.com/en-us/rest/api/documentation-preview/datacollectionrules/datacollectionrules_create?view=azure-rest-preview&branch=openapiHub_production_ad39a35d2f16#syslogdatasource) | Syslog events on Linux virtual machine |
| [windowsEventLogs](https://review.docs.microsoft.com/en-us/rest/api/documentation-preview/datacollectionrules/datacollectionrules_create?view=azure-rest-preview&branch=openapiHub_production_ad39a35d2f16#syslogdatasource) | Windows event log |


## DCR associations
An association relates a virtual machine to a DCR. A DCR may have an association with multiple virtual machines, and a virtual machine may have an association with multiple DCRs. This allows you to define multiple DCRs with a 


## Sample DCR
The sample DCR below has the following details:

- Performance data
  - Collects specific Processor, Memory, Logical Disk, and Physical Disk counters every 15 minutes.
  - Collects specific Process counters every 15 minutes.
- Windows events
  - Collects Windows security events every minute.
- Syslog
  - Collects Debug, Critical, and Emergency events from cron facility.
  - Collects Alert, Critical, and Emergency events from syslog facility.
- Destinations
  - Sends all data to a Log Analytics workspace named centralTeamWorkspace.

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
              "Microsoft-WindowsEvent"
            ],
            "scheduledTransferPeriod": "PT1M",
            "xPathQueries": [
              "Security!*"
            ]
          },
          {
            "name": "appTeam1AppEvents",
            "streams": [
              "Microsoft-WindowsEvent"
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
            "name": "sylogBase",
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
            "workspaceResourceId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-resource-group/providers/Microsoft.OperationalInsights/workspaces/my-workspace",
            "name": "centralWorkspace"
          }
        ]
      },
      "dataFlows": [
        {
          "streams": [
            "Microsoft-Perf",
            "Microsoft-Syslog",
            "Microsoft-WindowsEvent"
          ],
          "destinations": [
            "centralWorkspace"
          ]
        }
      ]
    }
  }
```


## Next steps

