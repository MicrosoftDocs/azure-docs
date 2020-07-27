---
title: Data Collection Rules in Azure Monitor agent (preview)
description: Overview of data collection rules (DCRs) in Azure Monitor including their contents and structure and how you can create and work with them.
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/11/2020

---

# Data collection rules in Azure Monitor (preview)
Data Collection Rules (DCR) define data coming into Azure Monitor and specify where it should be sent. This article provides an overview of DCRs including their contents and structure and how you can create and work with them.

## Input sources
Data collection rules currently support the following input sources:

- Azure Monitor agent installed on Azure virtual machine.



## Components of a DCR
A DCR includes the following components.

| Component | Description |
|:---|:---|
| Data sources | Unique source of monitoring data with its own format and method exposing its data. Examples of a data source include Windows event log, performance counters, and syslog. Each data source matches a particular data source type as described below. |
| Streams | Unique handle that describes a set of data sources that will be transformed and schematized as one type. Each data source requires one or more streams, and one stream may be used by multiple data sources. All data sources in a stream share a common schema. Use multiple streams for example, when you want to send a particular data source to multiple tables in the same Log Analytics workspace. |
| Destinations | Set of destinations where the data should be sent. Examples include Log Analytics workspace, Azure Monitor Metrics, and Azure Event Hubs. | 
| Data flows | Definition of which streams should be sent to which destinations. | 


<Diagram of DCR and contents>

### Data source types
Each data source has a Data Source Type. Each type defines a unique set of properties that must be specified for each data source. The data source types currently available are shown the following table. Follow the link for the set of properties that must be defined for each.

| Data source type | Description | 
|:---|:---|
| [extension](https://review.docs.microsoft.com/en-us/rest/api/documentation-preview/datacollectionrules/datacollectionrules_create?view=azure-rest-preview&branch=openapiHub_production_ad39a35d2f16#extensiondatasource) | VM extension-based data source |
| [performanceCounters](https://review.docs.microsoft.com/en-us/rest/api/documentation-preview/datacollectionrules/datacollectionrules_create?view=azure-rest-preview&branch=openapiHub_production_ad39a35d2f16#perfcounterdatasource) | Performance counters |
| [syslog](https://review.docs.microsoft.com/en-us/rest/api/documentation-preview/datacollectionrules/datacollectionrules_create?view=azure-rest-preview&branch=openapiHub_production_ad39a35d2f16#syslogdatasource) | Syslog events on Linux virtual machine |
| [windowsEventLogs](https://review.docs.microsoft.com/en-us/rest/api/documentation-preview/datacollectionrules/datacollectionrules_create?view=azure-rest-preview&branch=openapiHub_production_ad39a35d2f16#syslogdatasource) | Windows event log |


## Limits
The following table lists the limits that currently apply to DCRs.

| Limit | Value |
|:---|:---|
| Number of data sources in a | 10 |
| Maximum counter specifiers in performance | 10 |
| Maximum facility names in SysLog | 20 |
| Maximum XPath queries in EventLog | 100 |
| Maximum data flows | 10 |
| Maximum data streams | 10 |
| Maximum number of extensions | 10 |
| Maximum size of extension settings | 32 Kb |
| Maximum Log Analytics workspaces | 10 |


## Create a DCR
There are currently two available methods to create a DCR:

- Use the Azure portal to create a DCR and assign to one or more virtual machines. See [Create using Azure portal](data-collection-rule-portal.md#create-using-the-azure-portal).
- Directly edit the DCR in JSON and submit using the REST API. See [Create using REST API](data-collection-rule-portal.md#create-using-rest-api).

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
  - Sends performance data to Azure Monitor Metrics in the current subscription.

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

