
```bash

#!/bin/bash
set -e

SUBSCRIPTION_ID="${SUBSCRIPTION_ID:?SUBSCRIPTION_ID must be set}"
SERVICE_PRINCIPAL_ID="${SERVICE_PRINCIPAL_ID:?SERVICE_PRINCIPAL_ID must be set}"
SERVICE_PRINCIPAL_SECRET="${SERVICE_PRINCIPAL_SECRET:?SERVICE_PRINCIPAL_SECRET must be set}"
RESOURCE_GROUP="${RESOURCE_GROUP:?RESOURCE_GROUP must be set}"
TENANT_ID="${TENANT_ID:?TENANT_ID must be set}"
LOCATION="${LOCATION:?LOCATION must be set}"
LAW_RESOURCE_ID="${LAW_RESOURCE_ID:?LAW_RESOURCE_ID must be set}"
DCR_NAME=${DCR_NAME:-${RESOURCE_GROUP}-syslog-dcr}

az login --service-principal -u "${SERVICE_PRINCIPAL_ID}" -p "${SERVICE_PRINCIPAL_SECRET}" -t "${TENANT_ID}"

az account set -s "${SUBSCRIPTION_ID}"

az extension add --name monitor-control-service

RULEFILE=$(mktemp)
tee "${RULEFILE}" <<EOF
{
  "location": "${LOCATION}",
  "properties": {
    "dataSources": {
      "syslog": [
        {
          "name": "syslog",
          "streams": [
            "Microsoft-Syslog"
          ],
          "facilityNames": [
            "auth",
            "authpriv",
            "cron",
            "daemon",
            "mark",
            "kern",
            "local0",
            "local1",
            "local2",
            "local3",
            "local4",
            "local5",
            "local6",
            "local7",
            "lpr",
            "mail",
            "news",
            "syslog",
            "user",
            "uucp"
          ],
          "logLevels": [
            "Info",
            "Notice",
            "Warning",
            "Error",
            "Critical",
            "Alert",
            "Emergency"
          ]
        }
      ]
    },
    "destinations": {
      "logAnalytics": [
        {
          "workspaceResourceId": "${LAW_RESOURCE_ID}",
          "name": "centralWorkspace"
        }
      ]
    },
    "dataFlows": [
      {
        "streams": [
          "Microsoft-Syslog"
        ],
        "destinations": [
          "centralWorkspace"
        ]
      }
    ]
  }
}

EOF

az monitor data-collection rule create --name "${DCR_NAME}" --resource-group "${RESOURCE_GROUP}" --location "${LOCATION}" --rule-file "${RULEFILE}" -o tsv --query id

rm -rf "${RULEFILE}"
```
