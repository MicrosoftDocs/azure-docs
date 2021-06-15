---
title: Data Collection Rules in Azure Monitor (preview)
description: Overview of data collection rules (DCRs) in Azure Monitor including their contents and structure and how you can create and work with them.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 01/19/2021
ms.custom: references_region

---

# Data collection rules in Azure Monitor
Data Collection Rules (DCR) define data coming into Azure Monitor and specify where that data should be sent or stored. This article provides an overview of data collection rules including their contents and structure and how you can create and work with them.

## Input sources
Data collection rules currently support the following input sources:

- Azure Monitor Agent running on virtual machines, virtual machine scale sets and Azure Arc for servers. See [Configure data collection for the Azure Monitor agent (preview)](../agents/data-collection-rule-azure-monitor-agent.md).



## Components of a data collection rule
A data collection rule includes the following components.

| Component | Description |
|:---|:---|
| Data sources | Unique source of monitoring data with its own format and method of exposing its data. Examples of a data source include Windows event log, performance counters, and syslog. Each data source matches a particular data source type as described below. |
| Streams | Unique handle that describes a set of data sources that will be transformed and schematized as one type. Each data source requires one or more streams, and one stream may be used by multiple data sources. All data sources in a stream share a common schema. Use multiple streams for example, when you want to send a particular data source to multiple tables in the same Log Analytics workspace. |
| Destinations | Set of destinations where the data should be sent. Examples include Log Analytics workspace and Azure Monitor Metrics. | 
| Data flows | Definition of which streams should be sent to which destinations. | 

Data collection rules are stored regionally, and are available in all public regions where Log Analytics is supported. Government regions and clouds are not currently supported.

The following diagram shows the components of a data collection rule and their relationship

[![Diagram of DCR](media/data-collection-rule-overview/data-collection-rule-components.png)](media/data-collection-rule-overview/data-collection-rule-components.png#lightbox)

### Data source types
Each data source has a data source type. Each type defines a unique set of properties that must be specified for each data source. The data source types currently available are shown in the following table.

| Data source type | Description | 
|:---|:---|
| extension | VM extension-based data source |
| performanceCounters | Performance counters for both Windows and Linux |
| syslog | Syslog events on Linux |
| windowsEventLogs | Windows event log |


## Limits
For limits that apply to each data collection rule, see [Azure Monitor service limits](../service-limits.md#data-collection-rules).

## Data residency 
Data Collection Rules as a service is deployed regionally. A rule gets created and stored in the region you specify, and is backed up to the [paired-region](../../best-practices-availability-paired-regions.md#azure-regional-pairs) within the same Geo.  

**Single region data residency**: The previewed feature to enable storing customer data in a single region is currently only available in the Southeast Asia Region (Singapore) of the Asia Pacific Geo and Brazil South (Sao Paulo State) Region of Brazil Geo. Single region residency is enabled by default in these regions.

## Create a DCR
You can currently use any of the following methods to create a DCR:

- [Use the Azure portal](../agents/data-collection-rule-azure-monitor-agent.md) to create a data collection rule and have it associated with one or more virtual machines.
- Directly edit the data collection rule in JSON and [submit using the REST API](/rest/api/monitor/datacollectionrules).
- Create DCR and associations with [Azure CLI](https://github.com/Azure/azure-cli-extensions/blob/master/src/monitor-control-service/README.md).
- Create DCR and associations with Azure PowerShell.
  - [Get-AzDataCollectionRule](https://github.com/Azure/azure-powershell/blob/master/src/Monitor/Monitor/help/Get-AzDataCollectionRule.md)
  - [New-AzDataCollectionRule](https://github.com/Azure/azure-powershell/blob/master/src/Monitor/Monitor/help/New-AzDataCollectionRule.md)
  - [Set-AzDataCollectionRule](https://github.com/Azure/azure-powershell/blob/master/src/Monitor/Monitor/help/Set-AzDataCollectionRule.md)
  - [Update-AzDataCollectionRule](https://github.com/Azure/azure-powershell/blob/master/src/Monitor/Monitor/help/Update-AzDataCollectionRule.md)
  - [Remove-AzDataCollectionRule](https://github.com/Azure/azure-powershell/blob/master/src/Monitor/Monitor/help/Remove-AzDataCollectionRule.md)
  - [Get-AzDataCollectionRuleAssociation](https://github.com/Azure/azure-powershell/blob/master/src/Monitor/Monitor/help/Get-AzDataCollectionRuleAssociation.md)
  - [New-AzDataCollectionRuleAssociation](https://github.com/Azure/azure-powershell/blob/master/src/Monitor/Monitor/help/New-AzDataCollectionRuleAssociation.md)
  - [Remove-AzDataCollectionRuleAssociation](https://github.com/Azure/azure-powershell/blob/master/src/Monitor/Monitor/help/Remove-AzDataCollectionRuleAssociation.md)

## Sample data collection rule
The sample data collection rule below is for virtual machines with Azure Monitor agent and has the following details:

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
> For an explanation of XPaths that are used to specify event collection in data collection rules, see [Limit data collection with custom XPath queries](data-collection-rule-azure-monitor-agent.md#limit-data-collection-with-custom-xpath-queries)


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


## Next steps

- [Create a data collection rule](data-collection-rule-azure-monitor-agent.md) and an association to it from a virtual machine using the Azure Monitor agent.
