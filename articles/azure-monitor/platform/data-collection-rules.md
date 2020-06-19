---
title: Data Collection Rules in Azure Monitor agent (preview)
description: T
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/11/2020

---

# Data Collection Rules in Azure Monitor agent (preview)
Data Collection Rules (DCR) define the details of data to be collected from the guest operating system of virtual machines monitored by the Azure Monitor Agent. A DCR defines what data should be collected and where that data should be sent. You can create a DCR by directly editing is JSON or by using the Azure portal.

## Components of a DCR

A Data Collection Rule (DCR) is made up of the following components.

| Component | Description |
|:---|:---|
| Data sources | Unique source of monitoring data with its own format and method exposing its data. A single virtual machine has multiple data sources, such as Windows event log, performance counters, and syslog. Each has unique format such as XML and CEF. Each has a method of access such as event libraries and syslog server. |
| Streams | Unique handle that describes a set of data sources that will be transformed and schematized as one type. A stream will typically correspond to a particular table in the Log Analytics workspace. |
| Destinations | Set of destinations where the data should be sent. Examples include Log Analytics workspace, Azure Monitor Metrics, and Azure Event Hubs. Each data source in a DCR  | 
| Data flows | Definitions of which streams should be sent to which destinations. | 


## Data sources
Each data source has a Data Source Type, and the type defines the properties that must be specified for the data source. The data source types currently available are shown the following table:

| Data source type | Description | 
|:---|:---|
| [extension](https://review.docs.microsoft.com/en-us/rest/api/documentation-preview/datacollectionrules/datacollectionrules_create?view=azure-rest-preview&branch=openapiHub_production_ad39a35d2f16#extensiondatasource) | VM extension-based data source |
| [performanceCounters](https://review.docs.microsoft.com/en-us/rest/api/documentation-preview/datacollectionrules/datacollectionrules_create?view=azure-rest-preview&branch=openapiHub_production_ad39a35d2f16#perfcounterdatasource) | Performance counters |
| [syslog](https://review.docs.microsoft.com/en-us/rest/api/documentation-preview/datacollectionrules/datacollectionrules_create?view=azure-rest-preview&branch=openapiHub_production_ad39a35d2f16#syslogdatasource) | Syslog events on Linux virtual machine |
| [windowsEventLogs](https://review.docs.microsoft.com/en-us/rest/api/documentation-preview/datacollectionrules/datacollectionrules_create?view=azure-rest-preview&branch=openapiHub_production_ad39a35d2f16#syslogdatasource) | Windows event log |


### Properties
The following table shows the properties common to all data sources types. See the documentation for each data source type for its unique set of properties.

| Property | Description |
|:---|:---|
| name   | Name for the data source that's unique for all data sources in the current DCR. |
| stream | List of one or more streams to collect data from the data source. Multiple data sources may use the same stream if they will be sending data to the same destination. For example, you may have different data sources of type `performanceCounters` that collect different counters at a different rate. Have each of these sources use a stream called `Microsoft-Perf` to send them to Azure Monitor Metrics or to a common workspace. |

## DCR associations
An association relates a virtual machine to a DCR. You can create and association when you create a DCR in the Azure portal or create the association using the REST API after creating the DCR.

## Create and assign a DCR

### Azure portal

### REST API



## Sample DCR
The sample DCR below has the following details:

- Collects specific Processor, Memory, Logical Disk, and Physical Disk counters every 15 minutes.
- Collects specific Process counters every 15 minutes.
- Collects Windows security events every minute.
- Collects Debug, Critical, and Emergency events from cron facility.
- Collects Alert, Critical, and Emergency events from syslog facility.
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
            "workspaceResourceId": "/subscriptions/4e56605e-4b16-4baa-9358-dbb8d6faedfe/resourceGroups/bw-samples-arm/providers/Microsoft.OperationalInsights/workspaces/bw-arm-01",
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

