---
title: Customize a workflow schedule
description: Learn how to customize the schedule of a lifecycle workflow.
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

# Customize the schedule of workflows (preview)

When you create workflows by using lifecycle workflows, you can fully customize them to match the schedule that fits your organization's needs. By default, workflows are scheduled to run every 3 hours. But you can set the interval to be as frequent as 1 hour or as infrequent as 24 hours.

## Customize the schedule of workflows by using the Azure portal

Workflows that you create within lifecycle workflows follow the same schedule that you define on the **Workflow settings (Preview)** pane. To adjust the schedule, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the search bar near the top of the page, enter **Identity Governance** and select the result.

1. On the left menu, select **Lifecycle workflows (Preview)**.

1. On the **Lifecycle workflows** overview page, select **Workflow settings (Preview)**.

1. On the **Workflow settings (Preview)** pane, set the schedule of workflows as an interval of 1 to 24.

   :::image type="content" source="media/customize-workflow-schedule/workflow-schedule-settings.png" alt-text="Screenshot of the settings for a workflow schedule.":::
1. Select **Save**.

## Customize the schedule of workflows by using Microsoft Graph

To schedule workflow settings by using the Microsoft Graph API, see [lifecycleManagementSettings resource type](/graph/api/resources/identitygovernance-lifecyclemanagementsettings).

## Next steps

- [Manage workflow properties](manage-workflow-properties.md)
- [Delete lifecycle workflows](delete-lifecycle-workflow.md)