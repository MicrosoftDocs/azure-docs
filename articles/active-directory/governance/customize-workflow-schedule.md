---
title: 'Customize workflow schedule - Azure Active Directory'
description: Describes how to customize the schedule of a Lifecycle Workflow.
services: active-directory
author: owinfrey
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 01/20/2022
ms.subservice: compliance
ms.author: owinfrey
ms.reviewer: krbain
ms.collection: M365-identity-device-management
---

# Customize the schedule of workflows (Preview)

Workflows created using Lifecycle Workflows can be fully customized to match the schedule that fits your organization's needs. By default, workflows are scheduled to run every 3 hours, but the interval can be set as frequent as 1 hour, or as infrequent as 24 hours.


## Customize the schedule of workflows using Microsoft Graph


First, to view the current schedule interval of your workflows, run the following get call:

```http
GET https://graph.microsoft.com/beta/identityGovernance/lifecycleWorkflows/settings
```


To customize a workflow in Microsoft Graph, use the following request and body:
```http
PATCH https://graph.microsoft.com/beta/identityGovernance/lifecycleWorkflows/settings
Content-type: application/json

{
"workflowScheduleIntervalInHours":<Interval between 0-24>
}

```

## Next steps

- [Manage workflow properties](manage-workflow-properties.md)
- [Delete Lifecycle Workflows](delete-lifecycle-workflow.md)