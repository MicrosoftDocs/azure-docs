---
title: Enforce job execution on Azure Automation Hybrid Runbook Worker
description: This article tells how to use a custom Azure Policy definition to enforce job execution on an Azure Automation Hybrid Runbook Worker.
services: automation
ms.subservice: process-automation
ms.date: 03/15/2023
ms.topic: conceptual
---

# Use Azure Policy to enforce job execution on Hybrid Runbook Worker

> [!IMPORTANT]
>  Azure Automation Agent-based User Hybrid Runbook Worker (Windows and Linux) will retire on **31 August 2024** and wouldn't be supported after that date. You must complete migrating existing Agent-based User Hybrid Runbook Workers to Extension-based Workers before 31 August 2024. Moreover, starting **1 October 2023**, creating new Agent-based Hybrid Workers wouldn't be possible. [Learn more](migrate-existing-agent-based-hybrid-worker-to-extension-based-workers.md).

Starting a runbook on a Hybrid Runbook Worker uses a **Run on** option that allows you to specify the name of a Hybrid Runbook Worker group when initiating from the Azure portal, with the Azure PowerShell, or REST API. When a group is specified, one of the workers in that group retrieves and runs the runbook. If your runbook does not specify this option, Azure Automation runs the runbook in the Azure sandbox.

Anyone in your organization who is a member of the [Automation Job Operator](automation-role-based-access-control.md#automation-job-operator) or higher can create runbook jobs. To manage runbook execution targeting a Hybrid Runbook Worker group in your Automation account, you can use [Azure Policy](../governance/policy/overview.md). This helps to enforce organizational standards and ensure your automation jobs are controlled and managed by those designated, and anyone cannot execute a runbook on an Azure sandbox, only on Hybrid Runbook workers.

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

   The command creates a policy definition named **Audit Enforce Jobs on Automation Hybrid Runbook Workers**. For more information about other parameters that you can use, see [az policy definition create](/cli/azure/policy/definition#az-policy-definition-create).

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

   # [Azure CLI](#tab/azure-cli)

   ```azurecli
   az policy assignment create --name '<name>' --scope '<scope>' --policy '<policy definition ID>'
   ```

   The **scope** parameter on `az policy assignment create` works with management group, subscription, resource group, or a single resource. The parameter uses a full resource path. The pattern for **scope** for each container is as follows. Replace `{rName}`, `{rgName}`, `{subId}`, and `{mgName}` with your resource name, resource group name, subscription ID, and management group name, respectively. `{rType}` would be replaced with the **resource type** of the resource, such as `Microsoft.Compute/virtualMachines` for a VM.

   - Resource - `/subscriptions/{subID}/resourceGroups/{rgName}/providers/{rType}/{rName}`
   - Resource group - `/subscriptions/{subID}/resourceGroups/{rgName}`
   - Subscription - `/subscriptions/{subID}`
   - Management group - `/providers/Microsoft.Management/managementGroups/{mgName}`

   You can get the Azure Policy Definition ID by using PowerShell with the following command:

   ```azurecli
   az policy definition show --name 'Audit Enforce Jobs on Automation Hybrid Runbook Workers'
   ```

   The policy definition ID for the policy definition that you created should resemble the following example:

   ```output
   "/subscription/<subscriptionId>/providers/Microsoft.Authorization/policyDefinitions/Audit Enforce Jobs on Automation Hybrid Runbook Workers"
   ```

   # [PowerShell](#tab/azure-powershell)

   ```azurepowershell
   $rgName = Get-AzResourceGroup -Name 'ContosoRG'
   $Policy = Get-AzPolicyDefinition -Name 'audit-enforce-jobs-on-automation-hybrid-runbook-workers'
   New-AzPolicyAssignment -Name 'audit-enforce-jobs-on-automation-hybrid-runbook-workers' -PolicyDefinition $Policy -Scope $rg.ResourceId
   ```

   Replace _ContosoRG_ with the name of your intended resource group.

   The **Scope** parameter on `New-AzPolicyAssignment` works with management group, subscription, resource group, or a single resource. The parameter uses a full resource path, which the **ResourceId** property on `Get-AzResourceGroup` returns. The pattern for **Scope** for each container is as follows. Replace `{rName}`, `{rgName}`, `{subId}`, and `{mgName}` with your resource name, resource group name, subscription ID, and management group name, respectively. `{rType}` would be replaced with the **resource type** of the resource, such as `Microsoft.Compute/virtualMachines` for a VM.

   - Resource - `/subscriptions/{subID}/resourceGroups/{rgName}/providers/{rType}/{rName}`
   - Resource group - `/subscriptions/{subId}/resourceGroups/{rgName}`
   - Subscription - `/subscriptions/{subId}`
   - Management group - `/providers/Microsoft.Management/managementGroups/{mgName}`

   ---

4. Sign in to the [Azure portal](https://portal.azure.com).
5. Launch the Azure Policy service in the Azure portal by selecting **All services**, then searching for and selecting **Policy**.
6. Select **Compliance** in the left side of the page. Then locate the policy assignment you created.

   :::image type="content" source="./media/enforce-job-execution-hybrid-worker/azure-policy-dashboard-policy-status.png" alt-text="Screenshot of Azure Policy dashboard.":::

When one of the Automation REST operations are executed without reference to a Hybrid Runbook Worker in the request body, a 403 response code is returned with an error similar to the following example indicating the operation attempted execution on an Azure sandbox:

```rest
{
  "error": {
    "code": "RequestDisallowedByPolicy",
    "target": "Start_VMS",
    "message": "Resource 'Start_VMS' was disallowed by policy. Policy identifiers: '[{\"policyAssignment\":{\"name\":\"Enforce Jobs on Automation Hybrid Runbook Workers\",\"id\":\"/subscriptions/75475e1e-9643-4f3d-859e-055f4c31b458/resourceGroups/MAIC-RG/providers/Microsoft.Authorization/policyAssignments/fd5e2cb3842d4eefbc857917\"},\"policyDefinition\":{\"name\":\"Enforce Jobs on Automation Hybrid Runbook Workers\",\"id\":\"/subscriptions/75475e1e-9643-4f3d-859e-055f4c31b458/providers/Microsoft.Authorization/policyDefinitions/4fdffd35-fd9f-458e-9779-94fe33401bfc\"}}]'.",
    "additionalInfo": [
      {
        "type": "PolicyViolation",
        "info": {
          "policyDefinitionDisplayName": "Enforce Jobs on Automation Hybrid Runbook Workers",
          "evaluationDetails": {
            "evaluatedExpressions": [
              {
                "result": "True",
                "expressionKind": "Field",
                "expression": "type",
                "path": "type",
                "expressionValue": "Microsoft.Automation/automationAccounts/jobs",
                "targetValue": "Microsoft.Automation/automationAccounts/jobs",
                "operator": "Equals"
              },
              {
                "result": "True",
                "expressionKind": "Value",
                "expression": "[length(field('Microsoft.Automation/automationAccounts/jobs/runOn'))]",
                "expressionValue": 0,
                "targetValue": 1,
                "operator": "Less"
              }
            ]
          },
          "policyDefinitionId": "/subscriptions/75475e1e-9643-4f3d-859e-055f4c31b458/providers/Microsoft.Authorization/policyDefinitions/4fdffd35-fd9f-458e-9779-94fe33401bfc",
          "policyDefinitionName": "4fdffd35-fd9f-458e-9779-94fe33401bfc",
          "policyDefinitionEffect": "Deny",
          "policyAssignmentId": "/subscriptions/75475e1e-9643-4f3d-859e-055f4c31b458/resourceGroups/MAIC-RG/providers/Microsoft.Authorization/policyAssignments/fd5e2cb3842d4eefbc857917",
          "policyAssignmentName": "fd5e2cb3842d4eefbc857917",
          "policyAssignmentDisplayName": "Enforce Jobs on Automation Hybrid Runbook Workers",
          "policyAssignmentScope": "/subscriptions/75475e1e-9643-4f3d-859e-055f4c31b458/resourceGroups/MAIC-RG",
          "policyAssignmentParameters": {}
        }
      }
    ]
  }
}
```

The attempted operation is also logged in the Automation account's Activity Log, similar to the following example.

:::image type="content" source="./media/enforce-job-execution-hybrid-worker/failed-job-activity-log-example.png" alt-text="Example of Activity log for failed job execution.":::

## Next steps

To work with runbooks, see [Manage runbooks in Azure Automation](manage-runbooks.md).
