---
title: Run a workflow on-demand - Azure Active Directory
description: This article guides a user to running a workflow on demand using Lifecycle Workflows
author: OWinfreyATL
ms.author: owinfrey
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: how-to 
ms.date: 03/04/2022
ms.subservice: compliance
ms.custom: template-how-to 
---


# Run a workflow on-demand (Preview)

While most workflows by default are scheduled to run every 3 hours, workflows created using Lifecycle Workflows can also run on-demand so that they can be applied to specific users whenever you see fit. A workflow can be run on demand for any user and doesn't take into account whether or not a user meets the workflow's execution conditions. Workflows created in the Azure portal are disabled by default. Running a workflow on-demand allows you to run workflows that can't be run on schedule currently such as leaver workflows. It also allows you to test workflows before their scheduled run. You can test the workflow on a smaller group of users before enabling it for a broader audience.

>[!NOTE]
>Be aware that you currently cannot run a workflow on-demand if it is set to disabled, which is the default state of newly created workflows using the Azure portal.  You need to set the workflow to enabled to use the on-demand feature.

## Run a workflow on-demand in the Azure portal

Use the following steps to run a workflow on-demand.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Azure Active Directory** and then select **Identity Governance**.

1. On the left menu, select **Lifecycle workflows (Preview)**.

1. select **Workflows (Preview)**

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