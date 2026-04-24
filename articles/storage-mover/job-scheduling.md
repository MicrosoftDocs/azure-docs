---
title: How to schedule a migration job
description: Storage Mover allows users to automate data migration jobs with flexible scheduling options, enabling synchronization of data between on-premises, Azure, and other cloud sources.
author: stevenmatthew
ms.author: shaas
ms.service: azure-storage-mover
ms.topic: how-to
ms.date: 04/21/2026
ms.custom: sfi-image-nochange
---

# Job scheduling in Azure Storage Mover

Job scheduling in Azure Storage Mover automates running migration jobs. Use schedules to keep data in Azure synchronized with your source environment.

## Prerequisites

Before you create or schedule a job, make sure that you have:

- An understanding of the [Storage Mover resource hierarchy](resource-hierarchy.md).
- A [Storage Mover resource](storage-mover-create.md) deployed in your Azure subscription.
- An Azure [Storage Mover project](project-manage.md) created.
- [Source and target endpoints](endpoint-manage.md) created with appropriate permissions.
- Optionally, created a [job definition](job-definition-create.md) for your migration scenario.

## Create a scheduled job

To define a job schedule while creating a new migration job, complete the following steps.

1. In the Azure portal, open your Storage Mover resource and select *Projects*.
1. Select a project, and then select *Create job*.
1. On the *Basics* tab, select the migration type.

> [!NOTE]
> Storage Mover supports on-premises, multicloud, and Azure-to-Azure migration types.

1. Select the *source endpoint*.
   - To create a new source endpoint, select *Create*.
1. Select the *target endpoint*.
   - To create a new target endpoint, select *Create*.

> [!NOTE]
> Some endpoints require extra setup or permissions (for example, an agent, Key Vault access, or a multicloud connector). Make sure the required resources are in place before you continue.

1. Configure any job settings you need.
1. Select the *Scheduling* tab.
1. For *Frequency*, select one of the following options:
   - *No schedule* (run manually)
   - *One-time*
   - *Recurring*
1. Configure the schedule:
    1. Select a *start date and time*. The start date can be set up to 90 days from the creation date. For example, if you create the schedule on October 31, 2026, you can select any *Start date* between October 31 and January 29, 2026.
    1. For recurring schedules, select *Daily*, *Weekly*, or *Monthly*, and then select the days that apply.
    1. Select an **end date**. You can update the end date later, but *Until* must always remain within a year of when the schedule was created. The one-year limit is based on the creation date, not the selected *Start date*. For example, if you create a schedule on October 31, 2026, the latest possible end date (*Until*) is October 31, 2027.

    > [!NOTE]
    > For recurring schedules, the end date must be within one year of the start date. You can update the end date later, but it must stay within that one-year window.

    :::image type="content" source="media/job-scheduling/create-job-scheduling-settings-sml.png" alt-text="Screenshot of the job scheduling settings in Azure Storage Mover." lightbox="media/job-scheduling/create-job-scheduling-settings-lrg.png":::

1. Select *Create*.
1. After the job is created, open the job and select *Enable* to activate the schedule.

:::image type="content" source="media/job-scheduling/enable-scheduling-for-job-sml.png" alt-text="Screenshot of enabling a schedule for a job in Azure Storage Mover." lightbox="media/job-scheduling/enable-scheduling-for-job-lrg.png":::

## Update the schedule for an existing job

1. In your Storage Mover resource, select *Projects*, and then select a project.
1. Select the job, and then select *Edit*.
1. Select the *Scheduling* tab and update the schedule settings.
1. Select *Save*.

:::image type="content" source="media/job-scheduling/edit-job-schedule-settings-sml.png" alt-text="Screenshot of editing schedule settings for an existing job." lightbox="media/job-scheduling/edit-job-schedule-settings-lrg.png":::