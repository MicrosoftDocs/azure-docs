---
title: Work with incident tasks in Microsoft Sentinel
description: This article explains how SOC analysts can use incident tasks to manage their incident-handling workflow processes in Microsoft Sentinel.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 11/24/2022
---

# Work with incident tasks in Microsoft Sentinel

This article explains how SOC analysts can use incident tasks to manage their incident-handling workflow processes in Microsoft Sentinel.

[Incident tasks](incident-tasks.md) are typically created automatically by either automation rules or playbooks set up by senior analysts or SOC managers, but lower-tier analysts can create their own tasks on the spot, manually, right from within the incident.

You can see the list of tasks you need to perform for a particular incident on the incident details page, and mark them complete as you go.

> [!IMPORTANT]
>
> The **Incident tasks** feature is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Use cases for different roles

This article addresses the following scenarios, which apply to SOC analysts:

- [View and follow incident tasks](#view-and-follow-incident-tasks)
- [Manually add an ad-hoc task to an incident](#manually-add-an-ad-hoc-task-to-an-incident)

Other articles at the following links address scenarios that apply more to SOC managers, senior analysts, and automation engineers:

- [View automation rules with incident task actions](create-tasks-automation-rule.md#view-automation-rules-with-incident-task-actions)
- [Add tasks to incidents with automation rules](create-tasks-automation-rule.md#add-tasks-to-incidents-with-automation-rules)
- [Add tasks to incidents with playbooks](create-tasks-playbook.md)

## Prerequisites

The **Microsoft Sentinel Responder** role is required to create automation rules and to view and edit incidents, both of which are necessary to add, view, and edit tasks.

## View and follow incident tasks

1. In the **Incidents** page, select an incident from the list, and select **View full details**  under **Tasks (Preview)** in the details panel, or select **View full details** at the bottom of the details panel.

    :::image type="content" source="media/work-with-tasks/tasks-from-incident-info-panel.png" alt-text="Screenshot of link to enter the tasks panel from the incident info panel on the main incidents screen.":::

1. If you opted to enter the full details page, select **Tasks (Preview)** from the top banner.

    :::image type="content" source="media/work-with-tasks/incident-details-screen.png" alt-text="Screenshot shows incident details screen with tasks panel open." lightbox="media/work-with-tasks/incident-details-screen.png":::

1. The **Incident tasks (Preview)** panel will open on the right side of whichever screen you were in (the main incidents page or the incident details page). You'll see the list of tasks defined for this incident, along with how or by whom it was created - whether manually or by an automation rule or a playbook.

    :::image type="content" source="media/work-with-tasks/incident-tasks-panel.png" alt-text="Screenshot shows incident tasks panel as seen from incident details page.":::

1. The tasks that have descriptions will be marked with an expansion arrow. Expand a task to see its full description.

    :::image type="content" source="media/work-with-tasks/incident-tasks-panel-with-descriptions.png" alt-text="Screenshot shows incident tasks panel with expanded task descriptions.":::

1. Mark a task complete by marking the circle next to the task name. A check mark will appear in the circle, and the text of the task will be grayed out. See the "Reset user password" example in the screenshots above.

## Manually add an ad-hoc task to an incident

You can also add tasks for yourself, on the spot, to an incident's task list. This task will apply only to the open incident. This helps if your investigation leads you in new directions and you think of new things you need to check. Adding these as tasks ensures that you won't forget to do them, and that there will be a record of what you did, that other analysts and managers can benefit from.

1. Select **+ Add task** from the top of the **Incident tasks (Preview)** panel.

    :::image type="content" source="media/work-with-tasks/add-task-ad-hoc-1.png" alt-text="Screenshot shows how to manually add a task to your task list.":::

1. Enter a **Title** for your task, and a **Description** if you choose.

    :::image type="content" source="media/work-with-tasks/add-task-ad-hoc-2.png" alt-text="Screenshot shows how to add a title and description to your task.":::

1. Select **Save** when you've finished.

    :::image type="content" source="media/work-with-tasks/add-task-ad-hoc-3.png" alt-text="Screenshot shows how to finish defining and save your task.":::

1. See your new task at the bottom of the task list. Note that manually created tasks have a different color band on the left border, and that your name appears as *Created by:* under the task title and description.

    :::image type="content" source="media/work-with-tasks/view-ad-hoc-added-task.png" alt-text="Screenshot showing your new task at the end of the task list.":::

## Next steps

- Learn more about [incident tasks](incident-tasks.md).
- Learn how to [investigate incidents](investigate-cases.md).
- Learn how to add tasks to groups of incidents automatically using [automation rules](create-tasks-automation-rule.md) or [playbooks](create-tasks-playbook.md), and [when to use which](incident-tasks.md#use-automation-rules-or-playbooks-to-add-tasks).
- Learn about [keeping track of your tasks](audit-track-tasks.md).
- Learn more about [automation rules](automate-incident-handling-with-automation-rules.md) and how to [create them](./create-manage-use-automation-rules.md).
- Learn more about [playbooks](automate-responses-with-playbooks.md) and how to [create them](tutorial-respond-threats-playbook.md).
