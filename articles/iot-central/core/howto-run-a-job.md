---
title: Create and run jobs in your Azure IoT Central application | Microsoft Docs
description: Azure IoT Central jobs allow for bulk device management capabilities, such as updating properties or executing a command.
ms.service: iot-central
services: iot-central
author: sarahhubbard
ms.author: sahubbar
ms.date: 03/03/2020
ms.topic: how-to
manager: peterpr
---

# Create and run a job in your Azure IoT Central application

You can use Microsoft Azure IoT Central to manage your connected devices at scale using jobs. Jobs let you do bulk updates to device properties and run commands. This article shows you how to get started using jobs in your own application.

## Create and run a job

This section shows you how to create and run a job. It shows you how to set the light threshold for a group of logistic gateway devices.

1. Navigate to **Jobs** from the left pane.

2. Select **+ New** to create a new job:

    ![Create new job](./media/howto-run-a-job/createnewjob.png)

3. Enter a name and description to identify the job you're creating.

4. Select the target device group you want your job to apply to. You can see how many devices your job configuration applies to in the **Summary** section.

5. Next, choose either **Cloud property**, **Property** or **Command** as the type of job to configure. To set up a **Property** job configuration, select a property and set its new value. To set up a **Command**, choose the command to run. A property job can set multiple properties:

    ![Configure job](./media/howto-run-a-job/configurejob.png)

6. After creating your job, choose **Run** or **Save**. The job now appears on your main **Jobs** page. On this page, you can see your currently running job and the history of any previously run or saved jobs. Your saved job can be opened again at any time to continue editing it or to run it:

    ![View job](./media/howto-run-a-job/viewjob.png)

    > [!NOTE]
    > You can view up 30 days of history for your previously run jobs.

7. To get an overview of your job, select the job to view from the list. This overview contains the job details, devices, and device status values. From this overview, you can also select **Download Job Details** to download a CSV file of your job details, including the devices and their status values. This information can be useful for troubleshooting:

    ![View device status](./media/howto-run-a-job/downloaddetails.png)

### Manage a job

To stop one of your running jobs, open it and select **Stop**. The job status changes to reflect the job is stopped. The **Summary** section shows which devices have completed, failed, or are still pending.

To run a job that's currently stopped, select it, and then select **Run**. The job status changes to reflect the job is now running again. The **Summary** section continues to update with the latest progress.

![Manage job](./media/howto-run-a-job/managejob.png)

## Copy a job

To copy one of your existing jobs, select it on the **Jobs** page and select **Copy**. A copy of the job configuration opens for you to edit, and **Copy** is appended to the job name. You can save or run the new job:

![Copy job](./media/howto-run-a-job/copyjob.png)

## View the job status

After a job is created, the **Status** column updates with the latest status message of the job. The following table lists the possible status values:

| Status message       | Status meaning                                          |
| -------------------- | ------------------------------------------------------- |
| Completed            | This job has been executed on all devices.              |
| Failed               | This job has failed and not fully executed on devices.  |
| Pending              | This job hasn't yet begun executing on devices.         |
| Running              | This job is currently executing on devices.             |
| Stopped              | This job has been manually stopped by a user.           |

The status message is followed by an overview of the devices in the job. The following table lists the possible device status values:

| Status message       | Status meaning                                                     |
| -------------------- | ------------------------------------------------------------------ |
| Succeeded            | The number of devices that the job successfully executed on.       |
| Failed               | The number of devices that the job has failed to execute on.       |

### View the device status

To view the status of the job and all the affected devices, open the job. To download a CSV file that includes the job details, including the list of devices and their status values, select **Download job details**. Next to each device name, you see one of the following status messages:

| Status message       | Status meaning                                                                |
| -------------------- | ----------------------------------------------------------------------------- |
| Completed            | The job has been executed on this device.                                     |
| Failed               | The job has failed to execute on this device. The error message shows more information.  |
| Pending              | The job hasn't yet executed on this device.                                   |

### Job Details Filtering 

You can filter on device list in the job details page by clicking on the Filter icon. Filtering is allowed on **Device ID** or **Status** fields.

![Results Filter](./media/howto-run-a-job/filter.png)

### Job Details Column Picker 

You can select additional columns to be displayed in the results grid. Selected columns will be persisted during a user session or across user sessions who have access to the application.

![Column Options](./media/howto-run-a-job/columnoptions.png)

You will be presented with a popup modal with the ability to select columns to be displayed in the results grid. Select the columns, click on the **right arrow** and click *OK**. You have the option to select all columns by clicking on the **Select All** checkbox. 

![Column Picker Popup](./media/howto-run-a-job/columnpickerpopup.png)

The selected columns will be displayed in the results grid. 

![Selected Columns](./media/howto-run-a-job/columnpickercolumnselected.png)


### Rerun Job on failed devices

You can rerun a job if your previously submitted job has devices which failed during the previous run. Click on **Rerun**. 

![Rerun](./media/howto-run-a-job/rerun.png)

You can be presented with a popup modal with the ability to provide a job name, description for th job. Click on **Rerun job**. New job will be submitted to retry the action on failed devices.  

![Rerun Failed](./media/howto-run-a-job/rerunfailed.png)


> [!NOTE]
> You are allowed to execute no more than 5 jobs at the same time from an IoT Central application. 

> [!NOTE]
> After a job has completed and a device which is part of the results grid is deleted, the device entry shows as deleted in the device name and device details link is not available for the deleted device.

 

## Next steps

Now that you've learned how to create jobs in your Azure IoT Central application, here are some next steps:

- [Manage your devices](howto-manage-devices.md)
- [Version your device template](howto-version-device-template.md)
