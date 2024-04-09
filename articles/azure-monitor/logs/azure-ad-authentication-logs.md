---
title: Microsoft Entra authentication for Azure Monitor Logs 
description: Learn how to enable Microsoft Entra authentication for Log Analytics in Azure Monitor.
ms.topic: conceptual
ms.date: 08/24/2021
---

# Microsoft Entra authentication for Azure Monitor Logs

Azure Monitor can [collect data in Azure Monitor Logs from multiple sources](data-platform-logs.md#data-collection). These sources include agents on virtual machines, Application Insights, diagnostic settings for Azure resources, and the Data Collector API.

Log Analytics agents use a workspace key as an enrollment key to verify initial access and provision a certificate further used to establish a secure connection between the agent and Azure Monitor. To learn more, see [Send data from agents](data-security.md#2-send-data-from-agents). The Data Collector API uses the same workspace key to [authorize access](data-collector-api.md#authorization).

These options might be cumbersome and pose a risk because it's difficult to manage credentials, specifically workspace keys, at a large scale. You can opt out of local authentication and ensure that only telemetry that's exclusively authenticated by using Managed Identities and Microsoft Entra ID is ingested into Azure Monitor. This feature enhances the security and reliability of the telemetry used to make critical operational and business decisions.

To enable Microsoft Entra integration for Azure Monitor Logs and remove reliance on these shared secrets:

1. [Disable local authentication for Log Analytics workspaces](#disable-local-authentication-for-log-analytics-workspaces).
1. Ensure that only authenticated telemetry is ingested in your Application Insights resources with [Microsoft Entra authentication for Application Insights (preview)](../app/azure-ad-authentication.md).

## Prerequisites

- [Migrate to Azure Monitor Agent](../agents/azure-monitor-agent-migration.md) from the Log Analytics agents. Azure Monitor Agent doesn't require any keys but instead [requires a system-managed identity](../agents/azure-monitor-agent-overview.md#security).
- [Migrate to the Log Ingestion API](./custom-logs-migrate.md) from the HTTP Data Collector API to send data to Azure Monitor Logs.

## Permissions required

To disable local authentication for a Log Analytics workspace, you need `microsoft.operationalinsights/workspaces/write` permissions on the workspace, as provided by the [Log Analytics Contributor built-in role](./manage-access.md#log-analytics-contributor), for example.

## Disable local authentication for Log Analytics workspaces


Disabling local authentication might limit the availability of some functionality, specifically:

- Existing Log Analytics agents will stop functioning. Only Azure Monitor Agent will be supported. Azure Monitor Agent will be missing some capabilities that are available through the Log Analytics agent. Examples include custom log collection and IIS log collection.
- The Data Collector API (preview) won't support Microsoft Entra authentication and won't be available to ingest data.
- VM insights and Container insights will stop working. Local authorization will be the only authorization method supported by these features.

You can disable local authentication by using Azure Policy. Or you can disable it programmatically through an Azure Resource Manager template, PowerShell, or the Azure CLI.

### [Azure Policy](#tab/azure-policy)

Azure Policy for `DisableLocalAuth` won't allow you to create a new Log Analytics workspace unless this property is set to `true`. The policy name is `Log Analytics Workspaces should block non-Azure Active Directory based ingestion`. To apply this policy definition to your subscription, [create a new policy assignment and assign the policy](../../governance/policy/assign-policy-portal.md).

The policy template definition:

```json
{
  "properties": {
    "displayName": "Log Analytics Workspaces should block non-Azure Active Directory based ingestion.",
    "policyType": "BuiltIn",
    "mode": "Indexed",
    "description": "Enforcing log ingestion to require Azure Active Directory authentication prevents unauthenticated logs from an attacker which could lead to incorrect status, false alerts, and incorrect logs stored in the system.",
    "metadata": {
      "version": "1.0.0",
      "category": "Monitoring"
    },
    "parameters": {
      "effect": {
        "type": "String",
        "metadata": {
          "displayName": "Effect",
          "description": "Enable or disable the execution of the policy"
        },
        "allowedValues": [
          "Deny",
          "Audit",
          "Disabled"
        ],
        "defaultValue": "Audit"
      }
    },
    "policyRule": {
      "if": {
        "allOf": [
          {
            "field": "type",
            "equals": "Microsoft.OperationalInsights/workspaces"
          },
          {
            "field": "Microsoft.OperationalInsights/workspaces/features.disableLocalAuth",
            "notEquals": "true"
          }
        ]
      },
      "then": {
        "effect": "[parameters('effect')]"
      }
    }
  },
  "id": "/providers/Microsoft.Authorization/policyDefinitions/e15effd4-2278-4c65-a0da-4d6f6d1890e2",
  "type": "Microsoft.Authorization/policyDefinitions",
  "name": "e15effd4-2278-4c65-a0da-4d6f6d1890e2"
}
```

### [Azure Resource Manager](#tab/azure-resource-manager)

The `DisableLocalAuth` property is used to disable any local authentication on your Log Analytics workspace. When set to `true`, this property enforces that Microsoft Entra authentication must be used for all access.

Use the following Azure Resource Manager template to disable local authentication:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "workspaces_name": {
            "defaultValue": "workspace-name",
            "type": "string"
        },
        "workspace_location": {
          "defaultValue": "region-name",
          "type": "string"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.OperationalInsights/workspaces",
            "apiVersion": "2020-08-01",
            "name": "[parameters('workspaces_name')]",
            "location": "[parameters('workspace_location')]",
            "properties": {
                 "sku": {
                    "name": "PerGB2018"
                },
                "retentionInDays": 30,
                "features": {
                    "disableLocalAuth": false,
                    "enableLogAccessUsingOnlyResourcePermissions": true
                }
            }
        }
    ]
}

```

### [Azure CLI](#tab/azure-cli)

The `DisableLocalAuth` property is used to disable any local authentication on your Log Analytics workspace. When set to `true`, this property enforces that Microsoft Entra authentication must be used for all access.

Use the following Azure CLI commands to disable local authentication:

```azurecli
    az resource update --ids "/subscriptions/[Your subscription ID]/resourcegroups/[Your resource group]/providers/microsoft.operationalinsights/workspaces/[Your workspace name]--api-version "2021-06-01" --set properties.features.disableLocalAuth=True
```

### [PowerShell](#tab/powershell)

The `DisableLocalAuth` property is used to disable any local authentication on your Log Analytics workspace. When set to `true`, this property enforces that Microsoft Entra authentication must be used for all access.

Use the following PowerShell commands to disable local authentication:

```powershell
    $workspaceSubscriptionId = "[You subscription ID]"
    $workspaceResourceGroup = "[You resource group]"
    $workspaceName = "[Your workspace name]"
    $disableLocalAuth = $false
    
    # login
    Connect-AzAccount
    
    # select subscription
    Select-AzSubscription -SubscriptionId $workspaceSubscriptionId
    
    # get private link workspace resource
    $workspace = Get-AzResource -ResourceType Microsoft.OperationalInsights/workspaces -ResourceGroupName $workspaceResourceGroup -ResourceName $workspaceName -ApiVersion "2021-06-01"
    
    # set DisableLocalAuth
    $workspace.Properties.Features | Add-Member -MemberType NoteProperty -Name DisableLocalAuth -Value $disableLocalAuth -Force
    $workspace | Set-AzResource -Force
```

---

## Next steps
See [Microsoft Entra authentication for Application Insights (preview)](../app/azure-ad-authentication.md).
