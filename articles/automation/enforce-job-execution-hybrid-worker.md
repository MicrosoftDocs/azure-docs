---
title: Enforce job execution on Azure Automation Hybrid Runbook Worker
description: This article tells how to use a custom Azure Policy definition to enforce job execution on an Azure Automation Hybrid Runbook Worker.
services: automation
ms.subservice: process-automation
ms.date: 05/11/2021
ms.topic: conceptual
---
# Use Azure Policy to enforce job execution on Hybrid Runbook Worker

To manage the creation of jobs, job schedules, and webhooks that target a Hybrid Runbook Worker in your Automation account, you can use Azure Policy to help manage this experience. A custom Azure Policy is provided in this article to control these activities using the following Automation REST API operations, specifically:

* [Create job](/rest/api/automation/job/create)
* [Create job schedule](/rest/api/automation/jobschedule/create)
* [Create webhook](/rest/api/automation/webhook/createorupdate)

The policy is based on the *runOn* property, which is an optional string that sets the name of the hybrid worker group. The policy validates the value of the property, which should contain the name of an existing Hybrid Runbook Worker group. If the value is null, this is interpreted as the create request for the job, job schedule, or webhook is intended for the Azure sandbox and the request is denied.

## Permissions required

You need to be a member of the [Owner](../../role-based-access-control/built-in-roles.md#owner) role at the subscription-level for permission to Azure Policy resources.

## Deploy

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
