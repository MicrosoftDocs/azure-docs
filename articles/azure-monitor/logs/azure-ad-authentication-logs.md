---
title: Azure AD authentication for Logs 
description: Learn how to enable Azure Active Directory (Azure AD) authentication for Log Analytics in Azure Monitor
ms.topic: conceptual
ms.date: 08/23/2021

---

# Azure AD authentication for Logs

[Log data can be collected from multiple sources](data-platform-logs.md#data-collection), specifically, agents, Data Collector REST API, Application Insights SDK and more.

Log Analytics agents are using workspace key as an enrollment key to verify initial access and provision a certificate further used to establish a secure connection between the agent and Azure Monitor service. To learn more, see [send data from agents](data-security.md#2-send-data-from-agents). Data Collector API is using the same workspace key to [authorize access](data-collector-api.md#authorization).

These options may be cumbersome and pose risk since it’s difficult to manage credentials (specifically, workspace keys) at a large scale. You can now choose to opt-out of local authentication and ensure only telemetry that is exclusively authenticated using Managed Identities and Azure Active Directory is ingested into Azure Monitor. This feature is a step to enhance the security and reliability of the telemetry used to make both critical operational (alerting/autoscale etc.) and business decisions.

Azure Monitor Agent (AMA) does not require any keys but instead [requires a system-managed identity](../agents/azure-monitor-agent-overview.md#security).

To avoid reliance on shared secrets (for example, workspace keys, Application Insights API keys) you should perform:

1. [Migrate from Log Analytics Agent to Azure Monitor Agent](../agents/azure-monitor-agent-migration.md).
2. Disable local authentication for Log Analytics Workspaces (see instructions in the next section).
3. [Enforce Azure AD authentication for Application Insights resources](../app/azure-ad-authentication.md).

## Disable local authentication for Log Analytics

After the Azure AD authentication is enabled, you can choose to disable local authentication for Log Analytics workspaces. This will allow you to ingest and query telemetry authenticated exclusively by Azure AD.

Disabling local authentication may limit some functionality available, specifically:

- Existing Log Analytics Agents will stop functioning, only Azure Monitor Agent (AMA) is supported. AMA is missing some capabilities that are available through Log Analytics agent (for example, custom log collection, IIS log collection).
- Data Collector API (preview) does not support Azure AD authentication and will not be available to ingest data.

You can disable local authentication by using the Azure Policy, or programmatically through  Azure Resource Manager Template, PowerShell, or CLI.

### Azure Policy

Azure Policy for ‘DisableLocalAuth’ will deny from users to create a new Log Analytics Workspace without this property setting to ‘true’. The policy name is `Log Analytics Workspaces should block non-Azure Active Directory based ingestion`. To apply this policy definition to your subscription, [create a new policy assignment and assign the policy](../../governance/policy/assign-policy-portal.md). 

Below is the policy template definition:

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

### Disable through Azure Resource Manager

Property `DisableLocalAuth` is used to disable any local authentication on your Log Analytics Workspace. When set to true, this property enforces that Azure AD authentication must be used for all access. 

Below is an example Azure Resource Manager template that you can use to disable local auth:

```json
{
    "$schema": https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#,
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


### CLI and PowerShell 

Property `DisableLocalAuth` is used to disable any local authentication on your Log Analytics Workspace. When set to true, this property enforces that Azure AD authentication must be used for all access. 

Below is an example of CLI and PowerShell commands that you can use to disable local auth:

```azurecli
    az resource update --ids "/subscriptions/[Your subscription ID]/resourcegroups/[You resource group]/providers/microsoft.operationalinsights/workspaces/[Your workspace name]--api-version "2021-06-01" --set properties.features.disableLocalAuth=True
```

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