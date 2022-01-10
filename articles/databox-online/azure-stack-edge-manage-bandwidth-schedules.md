---
title: Azure Stack Edge Pro FPGA bandwidth schedules management
description: Describes how to use the Azure portal to manage bandwidth schedules on your Azure Stack Edge Pro FPGA.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 03/22/2019
ms.author: alkohli
---
# Use the Azure portal to manage bandwidth schedules on your Azure Stack Edge Pro FPGA  

This article describes how to manage users on your Azure Stack Edge Pro FPGA. Bandwidth schedules allow you to configure network bandwidth usage across multiple time-of-day schedules. These schedules can be applied to the upload and download operations from your device to the cloud.

You can add, modify, or delete the bandwidth schedules for your Azure Stack Edge Pro FPGA via the Azure portal.

In this article, you learn how to:

> [!div class="checklist"]
> * Add a schedule
> * Modify schedule
> * Delete a schedule


## Add a schedule

Do the following steps in the Azure portal to add a schedule.

1. In the Azure portal for your Azure Stack Edge resource, go to **Bandwidth**.
2. In the right-pane, select **+ Add schedule**.

    ![Select Bandwidth](media/azure-stack-edge-manage-bandwidth-schedules/add-schedule-1.png)

3. In the **Add schedule**: 

   1. Provide the **Start day**, **End day**, **Start time**, and **End time** of the schedule.
   2. Check the **All day** option if this schedule should run all day.
   3. **Bandwidth rate** is the bandwidth in Megabits per second (Mbps) used by your device in operations involving the cloud (both uploads and downloads). Supply a number between 20 and 1,000,000,007 for this field.
   4. Check **Unlimited** bandwidth if you do not want to throttle the date upload and download.
   5. Select **Add**.

      ![Add schedule](media/azure-stack-edge-manage-bandwidth-schedules/add-schedule-2.png)

3. A schedule is created with the specified parameters. This schedule is then displayed in the list of bandwidth schedules in the portal.

    ![Updated list of bandwidth schedules](media/azure-stack-edge-manage-bandwidth-schedules/add-schedule-3.png)

## Edit schedule

Do the following steps to edit a bandwidth schedule.

1. In the Azure portal, go to your Azure Stack Edge resource and then go to **Bandwidth**. 
2. From the list of bandwidth schedules, select and select a schedule that you want to modify.
    ![Select bandwidth schedule](media/azure-stack-edge-manage-bandwidth-schedules/modify-schedule-1.png)

3. Make the desired changes and save the changes.

    ![Modify user](media/azure-stack-edge-manage-bandwidth-schedules/modify-schedule-2.png)

4. After the schedule is modified, the list of schedules is updated to reflect the modified schedule.

    ![Modify user 2](media/azure-stack-edge-manage-bandwidth-schedules/modify-schedule-3.png)


## Delete a schedule

Do the following steps to delete a bandwidth schedule associated with your Azure Stack Edge Pro FPGA device.

1. In the Azure portal, go to your Azure Stack Edge resource and then go to **Bandwidth**.  

2. From the list of bandwidth schedules, select a schedule that you want to delete. In the **Edit schedule**, select **Delete**. When prompted for confirmation, select **Yes**.

   ![Delete a user](media/azure-stack-edge-manage-bandwidth-schedules/delete-schedule-2.png)

3. After the schedule is deleted, the list of schedules is updated.


## Next steps

- Learn how to [Manage shares](azure-stack-edge-manage-shares.md).
