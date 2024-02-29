---
metadata
---
# API request examples for creating Data Collection Rules (DCRs)

## Syslog

### Syslog DCR

#### Syslog DCR creation request

The following is an example of a DCR creation request:

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

#### Syslog DCR creation request URL and header

        Example:
        ```http
        PUT https://management.azure.com/subscriptions/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/resourceGroups/ContosoRG/providers/Microsoft.Insights/dataCollectionRules/Contoso-DCR-01?api-version=2022-06-01
        ```

#### Syslog DCR creation response

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

### Syslog DCRA

#### Syslog DCRA creation request URL and header

```http
PUT 
https://management.azure.com/subscriptions/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/resourceGroups/ContosoRG/providers/Microsoft.Compute/virtualMachines/LogForwarder-VM-1/providers/Microsoft.Insights/dataCollectionRuleAssociations/contoso-dcr-assoc?api-version=2022-06-01
```

#### Syslog DCR creation response

Here's a sample response:

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

## CEF

### CEF DCR creation request

### CEF DCR creation request URL and header

### CEF DCR creation response

