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

## Custom logs from text files

The following examples are for DCRs using the AMA to collect custom logs from text files.

### Custom text logs DCR

These examples are of the API request for creating a DCR.

#### Custom text logs DCR creation request body

The following is an example of a DCR creation request for a custom log text file. Replace *`{PLACEHOLDER_VALUES}`* with actual values.

The `outputStream` parameter is required only if the transform changes the schema of the stream.

```json
{
    "type": "Microsoft.Insights/dataCollectionRules",
    "name": "{DCR_NAME}",
    "location": "{WORKSPACE_LOCATION}",
    "apiVersion": "2022-06-01",
    "properties": {
        "streamDeclarations": {
            "Custom-Text-{TABLE_NAME}": {
                "columns": [
                    {
                        "name": "TimeGenerated",
                        "type": "datetime"
                    },
                    {
                        "name": "RawData",
                        "type": "string"
                    },
                ]
            }
        },
        "dataSources": {
            "logFiles": [
                {
                    "streams": [ 
                        "Custom-Text-{TABLE_NAME}" 
                    ],
                    "filePatterns": [ 
                        "{LOCAL_PATH_FILE_1}","{LOCAL_PATH_FILE_2}" 
                    ],
                    "format": "text",
                    "name": "Custom-Text-{TABLE_NAME}"
                }
            ],
        },
        "destinations": {
            "logAnalytics": [
                {
                    "workspaceResourceId": "{WORKSPACE_RESOURCE_PATH}",
                    "workspaceId": "{WORKSPACE_ID}",
                    "name": "DataCollectionEvent"
                }
            ],
        },
        "dataFlows": [
            {
                "streams": [
                    "Custom-Text-{TABLE_NAME}" 
                ],
                "destinations": [ 
                    "DataCollectionEvent" 
                ],
                "transformKql": "source",
                "outputStream": "Custom-{TABLE_NAME}"
            }
        ]
    }
}
```

#### Custom text logs DCR creation response

```json
{
    "properties": {
        "immutableId": "dcr-00112233445566778899aabbccddeeff",
        "dataCollectionEndpointId": "/subscriptions/aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb/resourceGroups/Contoso-RG-1/providers/Microsoft.Insights/dataCollectionEndpoints/Microsoft-Sentinel-aaaabbbbccccddddeeeefff",
        "streamDeclarations": {
            "Custom-Text-ApacheHTTPServer_CL": {
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
                        "Custom-Text-ApacheHTTPServer_CL"
                    ],
                    "filePatterns": [
                        "C:\\Server\\bin\\log\\Apache24\\logs\\*.log"
                    ],
                    "format": "text",
                    "settings": {
                        "text": {
                            "recordStartTimestampFormat": "ISO 8601"
                        }
                    },
                    "name": "Custom-Text-ApacheHTTPServer_CL"
                }
            ]
        },
        "destinations": {
            "logAnalytics": [
                {
                    "workspaceResourceId": "/subscriptions/aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb/resourceGroups/contoso-rg-1/providers/Microsoft.OperationalInsights/workspaces/CyberSOC",
                    "workspaceId": "cccccccc-3333-4444-5555-dddddddddddd",
                    "name": "DataCollectionEvent"
                }
            ]
        },
        "dataFlows": [
            {
                "streams": [
                    "Custom-Text-ApacheHTTPServer_CL"
                ],
                "destinations": [
                    "DataCollectionEvent"
                ],
                "transformKql": "source",
                "outputStream": "Custom-ApacheHTTPServer_CL"
            }
        ],
        "provisioningState": "Succeeded"
    },
    "location": "centralus",
    "tags": {
        "createdBy": "Sentinel"
    },
    "id": "/subscriptions/aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb/resourceGroups/Contoso-RG-1/providers/Microsoft.Insights/dataCollectionRules/DCR-CustomLogs-01",
    "name": "DCR-CustomLogs-01",
    "type": "Microsoft.Insights/dataCollectionRules",
    "etag": "\"00000000-1111-2222-3333-444444444444\"",
    "systemData": {
        "createdBy": "gbarnes@contoso.com",
        "createdByType": "User",
        "createdAt": "2024-08-12T09:29:15.1083961Z",
        "lastModifiedBy": "gbarnes@contoso.com",
        "lastModifiedByType": "User",
        "lastModifiedAt": "2024-08-12T09:29:15.1083961Z"
    }
}
```
