---
title: How to schedule an Azure Storage Mover migration job
description: Storage Mover allows users to automate data migration jobs with flexible scheduling options, enabling synchronization of data between on-premises, Azure, and other cloud sources.
author: stevenmatthew
ms.author: shaas
ms.service: azure-storage-mover
ms.topic: how-to
ms.date: 04/24/2026
ms.custom: sfi-image-nochange
---

# Job scheduling in Azure Storage Mover (Preview)

Job scheduling (preview) in Azure Storage Mover automates the execution of migration jobs. You can use schedules to keep data in Azure synchronized with your source environment.

> [!IMPORTANT]
> Azure Storage Mover job scheduling is currently in PREVIEW.
>
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

Before you create or schedule a job, make sure that you have:

- An understanding of the [Storage Mover resource hierarchy](resource-hierarchy.md).
- A [Storage Mover resource](storage-mover-create.md) deployed in your Azure subscription.
- An Azure [Storage Mover project](project-manage.md) created.
- [Source and target endpoints](endpoint-manage.md) created with appropriate permissions.
- Optionally, created a [job definition](job-definition-create.md) for your migration scenario.

## Create a scheduled job

To define a job schedule while creating a new migration job, complete the following steps.

1. In the Azure portal, open your Storage Mover resource and select **Projects**.
1. Select a project, and then select **Create job**.
1. Within the **Basics** tab, select the appropriate migration type. Storage Mover supports on-premises, multicloud, and Azure-to-Azure migration types.
1. Select the **Source endpoint**. To create a new source endpoint, select *Create*.
    > [!NOTE]
    > Some sources require extra resources, such as a key vault, a registered agent, or a Multicloud connector. Ensure you have the required resources available for the source you select or create.
1. Select the *target endpoint*.
   - To create a new target endpoint, select *Create*.
   - Before attempting to create a target endpoint, ensure that you have the appropriate permissions to the storage account.
1. Configure any job settings you need.
1. Within the *Scheduling* tab:

    - Select a **Migration Frequency** option. To run your migration jobs manually, select the *No schedule* button. Otherwise, select either *One-time* or *Recurring*.
    - Select a **Start date** and **Start time** in Coordinated Universal Time (UTC). The start date can be set up to 90 days from the creation date. For example, if you create the schedule on October 31, 2026, you can select any *Start date* between October 31 and January 29, 2026.
    - For recurring schedules, select a **Frequency** value of *Daily*, *Weekly*, or *Monthly*, and then select the days that apply. Selected values are highlighted.
    - Select an *end date* value within the **Until** field. You can update the end date later, but the **Until** value must always remain within a year of schedule's created date. The one-year limit is based on the creation date, not the selected *Start date*. For example, if you create a schedule on October 31, 2026, the latest possible end date (*Until*) is October 31, 2027.

    > [!NOTE]
    > For recurring schedules, the end date must be within one year of the date on which the schedule was created. You can update the end date later, but it must stay within a one-year window.

    :::image type="content" source="media/job-scheduling/create-job-scheduling-settings-sml.png" alt-text="Screenshot of the job scheduling settings in Azure Storage Mover." lightbox="media/job-scheduling/create-job-scheduling-settings-lrg.png":::

1. Select **Create** to complete the job creation.
1. After the job is created, select it to display its properties. Select **Enable** to activate the schedule. If all permissions checks are validated, the job schedule begins running automatically. Validation failures or improperly configured permissions result in a failure. In this case, you need to rectify them and enable the schedule again.

    > [!NOTE]
    > The schedule can be disabled and re-enabled as necessary according to your particular use case.

:::image type="content" source="media/job-scheduling/enable-scheduling-for-job-sml.png" alt-text="Screenshot of enabling a schedule for a job in Azure Storage Mover." lightbox="media/job-scheduling/enable-scheduling-for-job-lrg.png":::

## Update the schedule for an existing job

1. In your Storage Mover resource, select **Projects**, and then select a project.
1. Select the job you want to update, then select **Edit**.
1. Within the **Scheduling** tab, select a **Migration Frequency** option. To run your migration jobs manually, select the *No schedule* button. Otherwise, select either *One-time* or *Recurring*.

    > [!NOTE]
    > If you reduce the frequency of the job run schedule, changing from a recurring schedule to a one-time schedule or to no schedule for example, all upcoming job runs are canceled. You still have access to the job-run history and all previous job run results.

1. Select **Save** to commit your changes.

    > [!NOTE]
    > If a schedule for this job was previously enabled, it need not be reeanabled. Otherwise, the job needs to be enabled.

:::image type="content" source="media/job-scheduling/edit-job-schedule-settings-sml.png" alt-text="Screenshot of editing schedule settings for an existing job." lightbox="media/job-scheduling/edit-job-schedule-settings-lrg.png":::