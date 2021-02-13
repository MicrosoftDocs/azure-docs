---
title: Create and run jobs in your Azure IoT Central application | Microsoft Docs
description: Azure IoT Central jobs allow for bulk device management capabilities, such as updating properties or running a command.
ms.service: iot-central
services: iot-central
author: philmea
ms.author: philmea
ms.date: 11/19/2020
ms.topic: how-to
---

# Create and run a job in your Azure IoT Central application

You can use Azure IoT Central to manage your connected devices at scale through jobs. Jobs let you do bulk updates to device and cloud properties and run commands. This article shows you how to get started with using jobs in your own application.

## Create and run a job

The following example shows you how to create and run a job to set the light threshold for a group of logistic gateway devices. You use the job wizard to create and run jobs. You can save a job to run later.

1. On the left pane, select **Jobs**.

1. Select **+ New job**.

1. On the **Configure your job** page, enter a name and description to identify the job you're creating.

1. Select the target device group that you want your job to apply to. You can see how many devices your job configuration applies to below your **Device group** selection.

1. Choose **Cloud property**, **Property**, or **Command** as the **Job type**:

    To configure a **Property** job, select a property and set its new value. To configure a **Command** job, choose the command to run. A property job can set multiple properties.

    :::image type="content" source="media/howto-run-a-job/configure-job.png" alt-text="Screenshot that shows selections for creating a property job called Set Light Threshold":::

    Select **Save and exit** to add the job to the list of saved jobs on the **Jobs** page. You can later return to a job from the list of saved jobs.

1. Select **Next** to move to the **Delivery Options** page. The **Delivery Options** page lets you set the delivery options for this job: **Batches** and **Cancellation threshold**.

    Batches let you stagger jobs for large numbers of devices. The job is divided into multiple batches and each batch contains a subset of the devices. The batches are queued and run in sequence.

    The cancellation threshold lets you automatically cancel a job if the number of errors exceeds your set limit. The threshold can apply to all the devices in the job, or to individual batches.

    :::image type="content" source="media/howto-run-a-job/job-wizard-delivery-options.png" alt-text="Screenshot of job wizard delivery options page":::

1. Select **Next** to move to the **Schedule** page. The **Schedule** page lets you enable a schedule to run the job in the future:

    Choose a recurrence option for the schedule. You can set up a job to run:

    * One-time
    * Daily
    * Weekly

    Set a start date and time for a scheduled job. The date and time is specific to your time zone, and not to the device's local time.

    To end a recurring schedule, choose:

    * **On this day** to set an end date for the schedule.
    * **After** to set the number of times to run the job.

    Scheduled jobs always run on the devices in a device group, even if the device group membership changes over time.

    :::image type="content" source="media/howto-run-a-job/job-wizard-schedule.png" alt-text="Screenshot of job wizard schedule options page":::

1. Select **Next** to move to the **Review** page. The **Review** page shows the job configuration details. Select **Schedule** to schedule the job:

    :::image type="content" source="media/howto-run-a-job/job-wizard-schedule-review.png" alt-text="Screenshot of scheduled job wizard review page":::

1. The job details page shows information about scheduled jobs. When the scheduled job executes, you see a list of the job instances. The scheduled job execution is also be part of the **Last 30-day** job list.

    On this page, you can **Unschedule** the job or **Edit** the scheduled job. You can return to a scheduled job from the list of scheduled jobs.

    :::image type="content" source="media/howto-run-a-job/job-schedule-details.png" alt-text="Screenshot of scheduled job details page":::

1. In the job wizard, you can choose to not schedule a job, and run it immediately. The following screenshot shows a job without a schedule that's ready to run immediately. Select **Run** to run the job:

    :::image type="content" source="media/howto-run-a-job/job-wizard-schedule-immediate.png" alt-text="Screenshot of job wizard review page":::

1. A job goes through *pending*, *running*, and *completed* phases. The job execution details contain result metrics, duration details, and a device list grid.

    When the job is complete, you can select **Results log** to download a CSV file of your job details, including the devices and their status values. This information can be useful for troubleshooting.

    :::image type="content" source="media/howto-run-a-job/download-details.png" alt-text="Screenshot that shows device status":::

1. The job now appears in **Last 30 days** list on the **Jobs** page. This page shows currently running jobs and the history of any previously run or saved jobs.

    > [!NOTE]
    > You can view 30 days of history for your previously run jobs.

## Manage jobs

To stop a running job, open it and select **Stop**. The job status changes to reflect that the job is stopped. The **Summary** section shows which devices have completed, have failed, or are still pending.

:::image type="content" source="media/howto-run-a-job/manage-job.png" alt-text="Screenshot that shows a running job and the button for stopping a job":::

When a job is in a stopped state, you can select **Continue** to resume running the job. The job status changes to reflect that the job is now running again. The **Summary** section continues to update with the latest progress.

:::image type="content" source="media/howto-run-a-job/stopped-job.png" alt-text="Screenshot that shows a stopped job and the button for continuing a job":::

## Copy a job

To copy an existing job, select an executed job. Select **Copy** on the job results page or jobs details page:

:::image type="content" source="media/howto-run-a-job/job-details-copy.png" alt-text="Screenshot that shows the copy button":::

A copy of the job configuration opens for you to edit, and **Copy** is appended to the job name.

## View job status

After a job is created, the **Status** column updates with the latest job status message. The following table lists the possible *job status* values:

| Status message       | Status meaning                                          |
| -------------------- | ------------------------------------------------------- |
| Completed            | This job ran on all devices.              |
| Failed               | This job failed and didn't fully run on devices.  |
| Pending              | This job hasn't yet begun running on devices.         |
| Running              | This job is currently running on devices.             |
| Stopped              | A user has manually stopped this job.           |
| Canceled             | This job was canceled because the threshold set on the **Delivery options** page was exceeded. |

The status message is followed by an overview of the devices in the job. The following table lists the possible *device status* values:

| Status message       | Status meaning                                                     |
| -------------------- | ------------------------------------------------------------------ |
| Succeeded            | The number of devices that the job successfully ran on.       |
| Failed               | The number of devices that the job has failed to run on.       |

To view the status of the job and all the affected devices, open the job. Next to each device name, you see one of the following status messages:

| Status message       | Status meaning                                                                |
| -------------------- | ----------------------------------------------------------------------------- |
| Completed            | The job ran on this device.                                     |
| Failed               | The job failed to run on this device. The error message shows more information.  |
| Pending              | The job hasn't yet run on this device.                                   |

To download a CSV file that includes the job details and the list of devices and their status values, select **Results log**.

## Filter the device list

You can filter the device list on the **Job details** page by selecting the filter icon. You can filter on the **Device ID** or **Status** field:

:::image type="content" source="media/howto-run-a-job/filter.png" alt-text="Screenshot that shows selections for filtering a device list.":::

## Customize columns in the device list

You can add columns to the device list by selecting the column options icon:

:::image type="content" source="media/howto-run-a-job/column-options.png" alt-text="Screenshot that shows the icon for column options.":::

Use the **Column options** dialog box to choose the device list columns. Select the columns that you want to display, select the right arrow, and then select **OK**. To select all the available columns, choose **Select all**. The selected columns appear in the device list.

Selected columns persist across a user session or across user sessions that have access to the application.

## Rerun jobs

You can rerun a job that has failed devices. Select **Rerun on failed**:

:::image type="content" source="media/howto-run-a-job/rerun.png" alt-text="Screenshot that shows the button for rerunning a job on failed devices.":::

Enter a job name and description, and then select **Rerun job**. A new job is submitted to retry the action on failed devices.

> [!NOTE]
> You can't run more than five jobs at the same time from an Azure IoT Central application.
>
> When a job is complete and you delete a device that's in the job's device list, the device entry appears as deleted in the device name. The details link isn't available for the deleted device.

## Next steps

Now that you've learned how to create jobs in your Azure IoT Central application, here are some next steps:

- [Manage your devices](howto-manage-devices.md)
- [Version your device template](howto-version-device-template.md)
