---
title: 'Customize workflow schedule'
description: Describes how to customize the schedule of a Lifecycle Workflow.
services: active-directory
author: owinfreyATL
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 01/26/2023
ms.subservice: compliance
ms.author: owinfrey
ms.reviewer: krbain
ms.collection: M365-identity-device-management
---

# Customize the schedule of workflows (Preview)

Workflows created using Lifecycle Workflows can be fully customized to match the schedule that fits your organization's needs. By default, workflows are scheduled to run every 3 hours, but the interval can be set as frequent as 1 hour, or as infrequent as 24 hours.


## Customize the schedule of workflows using the Azure portal

Workflows created within Lifecycle Workflows follow the same schedule that you define within the **Workflow Settings** page. To adjust the schedule, you'd follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Type in **Identity Governance** on the search bar near the top of the page and select it.

1. In the left menu, select **Lifecycle workflows (Preview)**.

1. Select **Workflow settings (Preview)** from the Lifecycle workflows overview page.

1. On the workflow settings page you can set the schedule of workflows from an interval between 1-24.
    :::image type="content" source="media/customize-workflow-schedule/workflow-schedule-settings.png" alt-text="Screenshot of the settings for workflow schedule.":::
1. After setting the workflow schedule, select save.

## Customize the schedule of workflows using Microsoft Graph

To schedule workflow settings using API via Microsoft Graph, see: Update lifecycleManagementSettings [tenant settings for Lifecycle Workflows](/graph/api/resources/identitygovernance-lifecyclemanagementsettings).

## Next steps

- [Manage workflow properties](manage-workflow-properties.md)
- [Delete Lifecycle Workflows](delete-lifecycle-workflow.md)