---
title: Sample data collection rule - agent
description: Sample data collection rule for Azure Monitor agent
ms.topic: sample
ms.date: 07/19/2023
ms.custom: references_region
ms.reviewer: jeffwo

---

# Sample data collection rule - agent
The sample [data collection rule](../essentials/data-collection-rule-overview.md) below is for virtual machines with Azure Monitor agent and has the following details:

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

## Sample DCR

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

- [Create a data collection rule](../agents/data-collection-rule-azure-monitor-agent.md) and an association to it from a virtual machine using the Azure Monitor agent.
