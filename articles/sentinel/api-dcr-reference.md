---
title: Microsoft Sentinel API request examples for creating Data Collection Rules (DCRs)
description: See samples of API requests for creating Data Collection Rules and their associations, for use with the Azure Monitor Agent.
author: yelevin
ms.author: yelevin
ms.topic: reference
ms.date: 03/01/2024
ms.service: microsoft-sentinel
---
# API request examples for creating Data Collection Rules (DCRs)

This article presents some examples of API requests and responses for creating Data Collection Rules (DCRs) and DCR Associations (DCRAs) for use with the Azure Monitor Agent (AMA).

## Syslog/CEF

The following examples are for DCRs using the AMA to collect Syslog and CEF messages.

### Syslog/CEF DCR

These examples are of the API request and response for creating a DCR.

#### Syslog/CEF DCR creation request URL and header

Example:

```http
PUT https://management.azure.com/subscriptions/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/resourceGroups/ContosoRG/providers/Microsoft.Insights/dataCollectionRules/Contoso-DCR-01?api-version=2022-06-01
```

#### Syslog/CEF DCR creation request body

The following is an example of a DCR creation request. For each stream&mdash;you can have several in one DCR&mdash;change the value of the `"Streams"` field according to the source of the messages you want to ingest:

| Log source | `"Streams"` field value |
| --- | --- |
| **Syslog** | `"Microsoft-Syslog"` |
| **CEF** | `"Microsoft-CommonSecurityLog"` |
| **Cisco ASA** | `"Microsoft-CiscoAsa"` |

```json
{
  "location": "centralus",
  "kind": "Linux",
  "properties": {
    "dataSources": {
      "syslog": [
        {
          "name": "localsSyslog",
          "streams": [
            "Microsoft-Syslog"
          ],
          "facilityNames": [
            "auth",
            "local0",
            "local1",
            "local2",
            "local3",
            "syslog"
          ],
          "logLevels": [
            "Critical",
            "Alert",
            "Emergency"
          ]
        },
        {
          "name": "authprivSyslog",
          "streams": [
            "Microsoft-Syslog"
          ],
          "facilityNames": [
            "authpriv"
          ],
          "logLevels": [
            "Error",
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
          "workspaceResourceId": "/subscriptions/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/resourceGroups/ContosoRG/providers/Microsoft.OperationalInsights/workspaces/Contoso",
          "workspaceId": "11111111-2222-3333-4444-555555555555",
          "name": "DataCollectionEvent"
        }
      ]
    },
    "dataFlows": [
      {
        "streams": [
          "Microsoft-Syslog"
        ],
        "destinations": [
          "DataCollectionEvent"
        ]
      }
    ]
  }
}
```

#### Syslog/CEF DCR creation response

Here's the response you should receive according to the sample request above:

```json
  {
    "properties": {
      "immutableId": "dcr-0123456789abcdef0123456789abcdef",
      "dataSources": {
        "syslog": [
          {
            "streams": [
              "Microsoft-Syslog"
            ],
            "facilityNames": [
              "auth",
              "local0",
              "local1",
              "local2",
              "local3",
              "syslog"
            ],
            "logLevels": [
              "Critical",
              "Alert",
              "Emergency"
            ],
            "name": "localsSyslog"
          },
          {
            "streams": [
              "Microsoft-Syslog"
            ],
            "facilityNames": [
              "authpriv"
            ],
            "logLevels": [
              "Error",
              "Alert",
              "Critical",
              "Emergency"
            ],
            "name": "authprivSyslog"
          }
        ]
      },
      "destinations": {
        "logAnalytics": [
          {
            "workspaceResourceId": "/subscriptions/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/resourceGroups/ContosoRG/providers/Microsoft.OperationalInsights/workspaces/Contoso",
            "workspaceId": "11111111-2222-3333-4444-555555555555",
            "name": "DataCollectionEvent"
          }
        ]
      },
      "dataFlows": [
        {
          "streams": [
            "Microsoft-Syslog"
          ],
          "destinations": [
            "DataCollectionEvent"
          ]
        }
      ],
      "provisioningState": "Succeeded"
    },
    "location": "centralus",
    "kind": "Linux",
    "id": "/subscriptions/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/resourceGroups/ContosoRG/providers/Microsoft.Insights/dataCollectionRules/Contoso-DCR-01",
    "name": "Contoso-DCR-01",
    "type": "Microsoft.Insights/dataCollectionRules",
    "etag": "\"00000000-0000-0000-0000-000000000000\"",
    "systemData": {
    }
  }
```

### Syslog/CEF DCRA

#### Syslog/CEF DCRA creation request URL and header

```http
PUT 
https://management.azure.com/subscriptions/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/resourceGroups/ContosoRG/providers/Microsoft.Compute/virtualMachines/LogForwarder-VM-1/providers/Microsoft.Insights/dataCollectionRuleAssociations/contoso-dcr-assoc?api-version=2022-06-01
```

#### Syslog/CEF DCRA creation request body

```json
{
  "properties": {
    "dataCollectionRuleId": "/subscriptions/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/resourceGroups/ContosoRG/providers/Microsoft.Insights/dataCollectionRules/Contoso-DCR-01"
  }
}
```

#### Syslog/CEF DCRA creation response

```json
{
    "properties": {
      "dataCollectionRuleId": "/subscriptions/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/resourceGroups/ContosoRG/providers/Microsoft.Insights/dataCollectionRules/Contoso-DCR-01"
    },
    "id": "/subscriptions/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/resourceGroups/ContosoRG/providers/Microsoft.Compute/virtualMachines/LogForwarder-VM-1/providers/Microsoft.Insights/dataCollectionRuleAssociations/contoso-dcr-assoc",
    "name": "contoso-dcr-assoc",
    "type": "Microsoft.Insights/dataCollectionRuleAssociations",
    "etag": "\"00000000-0000-0000-0000-000000000000\"",
    "systemData": {
    }
  }
```

