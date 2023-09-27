---
title: Troubleshoot Conditional Access policy changes
description: Diagnose changes to Conditional Access policy with the Microsoft Entra audit logs.

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: troubleshooting
ms.date: 12/02/2022

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: calebb, martinco

ms.collection: M365-identity-device-management
---
# Troubleshooting Conditional Access policy changes

The Microsoft Entra audit log is a valuable source of information when troubleshooting why and how Conditional Access policy changes happened in your environment.

Audit log data is only kept for 30 days by default, which may not be long enough for every organization. Organizations can store data for longer periods by changing diagnostic settings in Microsoft Entra ID to: 

- Send data to a Log Analytics workspace
- Archive data to a storage account
- Stream data to Event Hubs
- Send data to a partner solution
 
Find these options under **Identity** > **Monitoring & health** > **Diagnostic settings** > **Edit setting**. If you don't have a diagnostic setting, follow the instructions in the article [Create diagnostic settings to send platform logs and metrics to different destinations](../../azure-monitor/essentials/diagnostic-settings.md) to create one. 

## Use the audit log

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Conditional Access Administrator](../roles/permissions-reference.md#conditional-access-administrator).
1. Browse to **Identity** > **Monitoring & health** > **Audit logs**.
1. Select the **Date** range you want to query.
1. From the **Service** filter, select **Conditional Access** and select the **Apply** button.

    The audit logs display all activities, by default. Open the **Activity** filter to narrow down the activities. For a full list of the audit log activities for Conditional Access, see the [Audit log activities](../reports-monitoring/reference-audit-activities.md#conditional-access).

1. Select a row to view the details. The **Modified Properties** tab lists the modified JSON values for the selected audit activity.

:::image type="content" source="media/troubleshoot-policy-changes-audit-log/old-and-new-policy-properties.png" alt-text="Audit log entry showing old and new JSON values for Conditional Access policy" lightbox="media/troubleshoot-policy-changes-audit-log/old-and-new-policy-properties.png":::

## Use Log Analytics

Log Analytics allows organizations to query data using built in queries or custom created Kusto queries, for more information, see [Get started with log queries in Azure Monitor](../../azure-monitor/logs/get-started-queries.md).

:::image type="content" source="media/troubleshoot-policy-changes-audit-log/log-analytics-new-old-value.png" alt-text="Log Analytics query for updates to Conditional Access policies showing new and old value location" lightbox="media/troubleshoot-policy-changes-audit-log/log-analytics-new-old-value.png":::

Once enabled find access to Log Analytics in the **Identity** > **Monitoring & health** > **Log Analytics**. The table of most interest to Conditional Access administrators is **AuditLogs**.

```kusto
AuditLogs 
| where OperationName == "Update Conditional Access policy"
```

Changes can be found under **TargetResources** > **modifiedProperties**.

## Reading the values

The old and new values from the audit log and Log Analytics are in JSON format. Compare the two values to see the changes to the policy.

Old policy example:

```json
{
    "conditions": {
        "applications": {
            "applicationFilter": null,
            "excludeApplications": [
            ],
            "includeApplications": [
                "797f4846-ba00-4fd7-ba43-dac1f8f63013"
            ],
            "includeAuthenticationContextClassReferences": [
            ],
            "includeUserActions": [
            ]
        },
        "clientAppTypes": [
            "browser",
            "mobileAppsAndDesktopClients"
        ],
        "servicePrincipalRiskLevels": [
        ],
        "signInRiskLevels": [
        ],
        "userRiskLevels": [
        ],
        "users": {
            "excludeGroups": [
                "eedad040-3722-4bcb-bde5-bc7c857f4983"
            ],
            "excludeRoles": [
            ],
            "excludeUsers": [
            ],
            "includeGroups": [
            ],
            "includeRoles": [
            ],
            "includeUsers": [
                "All"
            ]
        }
    },
    "displayName": "Common Policy - Require MFA for Azure management",
    "grantControls": {
        "builtInControls": [
            "mfa"
        ],
        "customAuthenticationFactors": [
        ],
        "operator": "OR",
        "termsOfUse": [
            "a0d3eb5b-6cbe-472b-a960-0baacbd02b51"
        ]
    },
    "id": "334e26e9-9622-4e0a-a424-102ed4b185b3",
    "modifiedDateTime": "2021-08-09T17:52:40.781994+00:00",
    "state": "enabled"
}

```

Updated policy example:

```json
{
    "conditions": {
        "applications": {
            "applicationFilter": null,
            "excludeApplications": [
            ],
            "includeApplications": [
                "797f4846-ba00-4fd7-ba43-dac1f8f63013"
            ],
            "includeAuthenticationContextClassReferences": [
            ],
            "includeUserActions": [
            ]
        },
        "clientAppTypes": [
            "browser",
            "mobileAppsAndDesktopClients"
        ],
        "servicePrincipalRiskLevels": [
        ],
        "signInRiskLevels": [
        ],
        "userRiskLevels": [
        ],
        "users": {
            "excludeGroups": [
                "eedad040-3722-4bcb-bde5-bc7c857f4983"
            ],
            "excludeRoles": [
            ],
            "excludeUsers": [
            ],
            "includeGroups": [
            ],
            "includeRoles": [
            ],
            "includeUsers": [
                "All"
            ]
        }
    },
    "displayName": "Common Policy - Require MFA for Azure management",
    "grantControls": {
        "builtInControls": [
            "mfa"
        ],
        "customAuthenticationFactors": [
        ],
        "operator": "OR",
        "termsOfUse": [
        ]
    },
    "id": "334e26e9-9622-4e0a-a424-102ed4b185b3",
    "modifiedDateTime": "2021-08-09T17:52:54.9739405+00:00",
    "state": "enabled"
}

``` 

In the example above, the updated policy doesn't include terms of use in grant controls.

### Restoring Conditional Access policies

For more information about programmatically updating your Conditional Access policies using the Microsoft Graph API, see the article [Conditional Access: Programmatic access](howto-conditional-access-apis.md).

## Next steps

- [What is Microsoft Entra ID monitoring?](../reports-monitoring/overview-monitoring.md)
- [Install and use the log analytics views for Microsoft Entra ID](../../azure-monitor/visualize/workbooks-view-designer-conversion-overview.md)
- [Conditional Access: Programmatic access](howto-conditional-access-apis.md)
