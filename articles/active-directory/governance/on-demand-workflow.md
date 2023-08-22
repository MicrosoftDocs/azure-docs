---
title: Run a workflow on-demand
description: This article guides a user to running a workflow on demand using Lifecycle Workflows
author: OWinfreyATL
ms.author: owinfrey
manager: amycolannino
ms.service: active-directory
ms.subservice: compliance
ms.workload: identity
ms.topic: how-to 
ms.date: 05/31/2023
ms.custom: template-how-to 
---


# Run a workflow on-demand

Scheduled workflows by default run every 3 hours, but can also run on-demand so that they can be applied to specific users whenever you see fit. A workflow can be run on demand for any user, and doesn't take into account whether or not a user meets the workflow's execution conditions. Running a workflow on-demand allows you to test workflows before their scheduled run. This testing, on a set of users up to 10 at a time, allows you to see how a workflow will run before it processes a larger set of users. Testing your workflow before their scheduled runs helps you proactively solve potential lifecycle issues more quickly.


## Run a workflow on-demand in the Azure portal

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Use the following steps to run a workflow on-demand.

>[!NOTE]
>To be run on demand, the  workflow must be enabled.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Type in **Identity Governance** on the search bar near the top of the page and select it.

1. On the left menu, select **Lifecycle workflows**.

1. select **Workflows**

1. On the workflow screen, select the specific workflow you want to run.

     :::image type="content" source="media/on-demand-workflow/on-demand-list.png" alt-text="Screenshot of a list of Lifecycle Workflows workflows to run on-demand.":::

1. Select **Run on demand**.     

1. On the **select users** tab, select **add users**.

1. On the add users screen, select the users you want to run the on demand workflow for.

     :::image type="content" source="media/on-demand-workflow/on-demand-add-users.png" alt-text="Screenshot of add users for on-demand workflow.":::

1. Select **Add**

1. Confirm your choices and select **Run workflow**.   

     :::image type="content" source="media/on-demand-workflow/on-demand-run.png" alt-text="Screenshot of a workflow being run on-demand.":::


## Run a workflow on-demand using Microsoft Graph

To run a workflow on-demand using API via Microsoft Graph, see: [workflow: activate (run a workflow on-demand)](/graph/api/identitygovernance-workflow-activate).


## Next steps

- [Customize the schedule of workflows](customize-workflow-schedule.md)
- [Delete a Lifecycle workflow](delete-lifecycle-workflow.md)
