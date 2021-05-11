---
title: Enforce job execution on Azure Automation Hybrid Runbook Worker
description: This article tells how to use a custom Azure Policy definition to enforce job execution on an Azure Automation Hybrid Runbook Worker.
services: automation
ms.subservice: process-automation
ms.date: 05/11/2021
ms.topic: conceptual
---
# Use Azure Policy to enforce job execution on Hybrid Runbook Worker

Starting a runbook on a Hybrid Runbook Worker uses a **Run on** option that allows you to specify the name of a Hybrid Runbook Worker group when initiating from the Azure portal, with the Azure PowerShell [Start-AzAutomationRunbook](/powershell/module/Az.Automation/Start-AzAutomationRunbook) cmdlet, or REST API. When a group is specified, one of the workers in that group retrieves and runs the runbook. If your runbook does not specify this option, Azure Automation runs the runbook in the Azure sandbox. 

Anyone in your organization who is a member of the [Automation Job Operator](automation-role-based-access-control.md#automation-job-operator) or higher can create runbook jobs. To manage runbook execution targeting a Hybrid Runbook Worker group in your Automation account, you can use [Azure Policy](../../governance/policy/overview.md). 

A custom Azure Policy definition is included in this article to help you control these activities using the following Automation REST API operations. Specifically:

* [Create job](/rest/api/automation/job/create)
* [Create job schedule](/rest/api/automation/jobschedule/create)
* [Create webhook](/rest/api/automation/webhook/createorupdate)

This policy is based on the `runOn` property. The policy validates the value of the property, which should contain the name of an existing Hybrid Runbook Worker group. If the value is null, this is interpreted as the create request for the job, job schedule, or webhook is intended for the Azure sandbox and the request is denied.

## Permissions required

You need to be a member of the [Owner](../../role-based-access-control/built-in-roles.md#owner) role at the subscription-level for permission to Azure Policy resources.

## Deploy

Here we compose the policy rule. If you aren't yet familiar with the policy language, reference policy definition structure for how to structure the policy definition.

```json
"policyRule": {
      "if": {
        "anyOf": [
          {
            "allOf": [
              {
                "field": "type",
                "equals": "Microsoft.Automation/automationAccounts/jobs"
              },
                "value": "[length(field('Microsoft.Automation/automationAccounts/jobs/runOn'))]",
                "less": 1
              }
            ]
          },
                "equals": "Microsoft.Automation/automationAccounts/webhooks"
                "value": "[length(field('Microsoft.Automation/automationAccounts/webhooks/runOn'))]",
                "equals": "Microsoft.Automation/automationAccounts/jobSchedules"
                "value": "[length(field('Microsoft.Automation/automationAccounts/jobSchedules/runOn'))]",
          }
        ]
      },
      "then": {
        "effect": "deny"
      }
    }
```
