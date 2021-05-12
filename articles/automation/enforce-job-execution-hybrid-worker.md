---
title: Enforce job execution on Azure Automation Hybrid Runbook Worker
description: This article tells how to use a custom Azure Policy definition to enforce job execution on an Azure Automation Hybrid Runbook Worker.
services: automation
ms.subservice: process-automation
ms.date: 05/12/2021
ms.topic: conceptual
---

# Use Azure Policy to enforce job execution on Hybrid Runbook Worker

Starting a runbook on a Hybrid Runbook Worker uses a **Run on** option that allows you to specify the name of a Hybrid Runbook Worker group when initiating from the Azure portal, with the Azure PowerShell, or REST API. When a group is specified, one of the workers in that group retrieves and runs the runbook. If your runbook does not specify this option, Azure Automation runs the runbook in the Azure sandbox. 

Anyone in your organization who is a member of the [Automation Job Operator](automation-role-based-access-control.md#automation-job-operator) or higher can create runbook jobs. To manage runbook execution targeting a Hybrid Runbook Worker group in your Automation account, you can use [Azure Policy](../governance/policy/overview.md). 

A custom Azure Policy definition is included in this article to help you control these activities using the following Automation REST API operations. Specifically:

* [Create job](/rest/api/automation/job/create)
* [Create job schedule](/rest/api/automation/jobschedule/create)
* [Create webhook](/rest/api/automation/webhook/createorupdate)

This policy is based on the `runOn` property. The policy validates the value of the property, which should contain the name of an existing Hybrid Runbook Worker group. If the value is null, it is interpreted as the create request for the job, job schedule, or webhook is intended for the Azure sandbox, and the request is denied.

## Permissions required

You need to be a member of the [Owner](../role-based-access-control/built-in-roles.md#owner) role at the subscription-level for permission to Azure Policy resources.

## Create and assign the policy definition

Here we compose the policy rule and then assign it to either a management group or subscription, and optionally specify a resource group in the subscription. If you aren't yet familiar with the policy language, reference [policy definition structure](../governance/policy/concepts/definition-structure.md) for how to structure the policy definition.

1. Use the following JSON snippet to create a JSON file with the name AuditAutomationHRWJobExecution.json.

    ```json
    {
    	"properties": {
    		"displayName": "Enforce job execution on Automation Hybrid Runbook Worker",
    		"description": "Enforce job execution on Hybrid Runbook Workers in your Automation account.",
    		"mode": "all",
    		"parameters": {
    			"effectType": {
    				"type": "string",
    				"defaultValue": "Deny",
    				"allowedValues": [
    				   "Deny",
    				   "Disabled"
    				],
    				"metadata": {
    					"displayName": "Effect",
    					"description": "Enable or disable execution of the policy"
    				}
    			}
    		},
    		"policyRule": {
          "if": {
            "anyOf": [
              {
                "allOf": [
                  {
                    "field": "type",
                    "equals": "Microsoft.Automation/automationAccounts/jobs"
                  },
                  {
                    "value": "[length(field('Microsoft.Automation/automationAccounts/jobs/runOn'))]",
                    "less": 1
                  }
                ]
              },
              {
                "allOf": [
                  {
                    "field": "type",
                    "equals": "Microsoft.Automation/automationAccounts/webhooks"
                  },
                  {
                    "value": "[length(field('Microsoft.Automation/automationAccounts/webhooks/runOn'))]",
                    "less": 1
                  }
                ]
              },
              {
                "allOf": [
                  {
                    "field": "type",
                    "equals": "Microsoft.Automation/automationAccounts/jobSchedules"
                  },
                  {
                    "value": "[length(field('Microsoft.Automation/automationAccounts/jobSchedules/runOn'))]",
                    "less": 1
                  }
                ]
              }
            ]
          },
          "then": {
            "effect": "[parameters('effectType')]"
          }
        }
      }
    }
    ```

2. Run the following Azure PowerShell or Azure CLI command to create a policy definition using the AuditAutomationHRWJobExecution.json file.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az policy definition create --name 'audit-enforce-jobs-on-automation-hybrid-runbook-workers' --display-name 'Audit Enforce Jobs on Automation Hybrid Runbook Workers' --description 'This policy enforces job execution on Automation account user Hybrid Runbook Workers.' --rules 'AuditAutomationHRWJobExecution.json' --mode All
    ```

    The command creates a policy definition named **Audit Enforce Jobs on Automation Hybrid Runbook Workers**. For more information about other parameters that you can use, see [az policy definition create](/cli/azure/policy/definition#az_policy_definition_create).

    When called without location parameters, `az policy definition create` defaults to saving the policy definition in the selected subscription of the sessions context. To save the definition to a different location, use the following parameters:

    * **subscription** - Save to a different subscription. Requires a *GUID* value for the subscription ID or a *string* value for the subscription name.
    * **management-group** - Save to a management group. Requires a *string* value.

    # [PowerShell](#tab/azure-powershell)

    ```azurepowershell
    New-AzPolicyDefinition -Name 'audit-enforce-jobs-on-automation-hybrid-runbook-workers' -DisplayName 'Audit Enforce Jobs on Automation Hybrid Runbook Workers' -Policy 'AuditAutomationHRWJobExecution.json'
    ```

    The command creates a policy definition named **Audit Enforce Jobs on Automation Hybrid Runbook Workers**. For more information about other parameters that you can use, see [New-AzPolicyDefinition](/powershell/module/az.resources/new-azpolicydefinition).

    When called without location parameters, `New-AzPolicyDefinition` defaults to saving the policy definition in the selected subscription of the sessions context. To save the definition to a different location, use the following parameters:

    * **SubscriptionId** - Save to a different subscription. Requires a *GUID* value.
    * **ManagementGroupName** - Save to a management group. Requires a *string* value.

    ---

3. After you create your policy definition, you can create a policy assignment by running the following commands:

    