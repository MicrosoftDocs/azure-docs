<properties
   pageTitle="Manage your StorSimple bandwidth templates | Microsoft Azure"
   description="Describes how to manage StorSimple bandwidth templates, which allow you to control bandwidth consumption."
   services="storsimple"
   documentationCenter=""
   authors="alkohli"
   manager="carmonm"
   editor="" />
<tags
   ms.service="storsimple"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/24/2016"
   ms.author="alkohli" />

# Use the StorSimple Manager service to manage StorSimple bandwidth templates

## Overview

Bandwidth templates allow you to configure network bandwidth usage across multiple time-of-day schedules to tier the data from the StorSimple device to the cloud.

With bandwidth throttling schedules you can:

- Specify customized bandwidth schedules depending on the workload network usages.

- Centralize management and reuse the schedules across multiple devices in an easy and seamless manner.

> [AZURE.NOTE] This feature is available only for StorSimple physical devices and not for virtual devices.

All the bandwidth templates for your service are displayed in a tabular format, and contain the following information:

- **Name** – A unique name assigned to the bandwidth template when it was created.

- **Schedule** – The number of schedules contained in a given bandwidth template.

- **Used by** – The number of volumes using the bandwidth templates.

You use the StorSimple Manager service **Configure** page in the Azure classic portal to manage bandwidth templates.

You can also find additional information to help configure bandwidth templates in:

- Questions and answers about bandwidth templates
- Best practices for bandwidth templates

## Add a bandwidth template

Perform the following steps to create a new bandwidth template.

#### To add a bandwidth template

1. On the StorSimple Manager service **Configure** page, click **add/edit bandwidth template**.

2. In the **Add/Edit Bandwidth Template** dialog box:

   1. From the **Template** drop-down list, select **Create new** to add a new bandwidth template.
   2. Specify a unique name for your bandwidth template.

3. Define a **Bandwidth Schedule**. To create a schedule:

   1. From the drop-down list, choose the days of the week the schedule is configured for. You can select multiple days by selecting the check boxes located before the respective days in the list.
   2. Select the **All Day** option if the schedule is enforced for the entire day. When this option is checked, you can no longer specify a **Start Time** or an **End Time**. The schedule runs from 12:00 AM to 11:59 PM.
   3. From the drop-down list, select a **Start Time**. This is when the schedule will begin.
   4. From the drop-down list, select an **End Time**. This is when the schedule will stop.

         > [AZURE.NOTE] Overlapping schedules are not allowed. If the start and end times will result in an overlapping schedule, you will see an error message to that effect.

   5. Specify the **Bandwidth Rate**. This is the bandwidth in Megabits per second (Mbps) used by your StorSimple device in operations involving the cloud (both uploads and downloads). Supply a number between 1 and 1,000 for this field.

   6. Click the check icon ![Check icon](./media/storsimple-manage-bandwidth-templates/HCS_CheckIcon.png). The template that you have created will be added to the list of bandwidth templates on the service **Configure** page.

    ![Create new bandwidth template](./media/storsimple-manage-bandwidth-templates/HCS_CreateNewBT1.png)

4. Click **Save** at the bottom of the page and then click **Yes** when prompted for confirmation. This will save the configuration changes that you have made.

## Edit a bandwidth template

Perform the following steps to edit a bandwidth template.

### To edit a bandwidth template

1. Click **add/edit bandwidth template**.

2. In the **Add/Edit Bandwidth Template** dialog box:

   1. From the **Template** drop-down list, choose an existing bandwidth template that you want to modify.
   2. Complete your changes. (You can modify any of the existing settings.)
   3. Click the check icon ![Check icon](./media/storsimple-manage-bandwidth-templates/HCS_CheckIcon.png). You will see the modified template in the list of bandwidth templates on the service Configure page.

3. To save your changes, click **Save** at the bottom of the page. Click **Yes** when prompted for confirmation.

> [AZURE.NOTE] You will not be allowed to save your changes if the edited schedule overlaps with an existing schedule in the bandwidth template that you are modifying.

## Delete a bandwidth template

Perform the following steps to delete a bandwidth template.

#### To delete a bandwidth template

1. In the tabular list of the bandwidth templates for your service, select the template that you wish to delete. A delete icon (**x**) will appear to the extreme right of the selected template. Click the **x** icon to delete the template.

2. You will be prompted for confirmation. Click **OK** to proceed.

If the template is in use by any volume(s), you will not be allowed to delete it. You will see an error message indicating that the template is in use. An error message dialog box will appear advising you that all the references to the template should be removed.

You can delete all the references to the template by accessing the **Volume Containers** page and modifying the volume containers that use this template so that they use another template or use a custom or unlimited bandwidth setting. When all the references have been removed, you can delete the template.

## Use a default bandwidth template

A default bandwidth template is provided and is used by volume containers by default to enforce bandwidth controls when accessing the cloud. The default template also serves as a ready reference for users who create their own templates. The details of this default template are:

- **Name** – Unlimited nights and weekends

- **Schedule** – A single schedule from Monday to Friday that applies a bandwidth rate of 1 Mbps between 8 AM and 5 PM device time. The bandwidth is set to Unlimited for the remainder of the week.

The default template can be edited. The usage of this template (including edited versions) is tracked.

## Create an all-day bandwidth template that starts at a specified time

Follow this procedure to create a schedule that starts at a specified time and runs all day. In the example, the schedule starts at 9 AM in the morning and runs until 9 AM the next morning. It's important to note that the start and end times for a given schedule must both be contained on the same 24 hour schedule and cannot span multiple days. If you need to set up bandwidth templates that span multiple days, you will need to use multiple schedules (as shown in the example).

#### To create an all-day bandwidth template

1. Create a schedule that starts at 9 AM in the morning and runs until midnight.

2. Add another schedule. Configure the second schedule to run from midnight until 9 AM in the morning.

3. Save the bandwidth template.

The composite schedule will then start at a time of your choosing and run all-day.

## Questions and answers about bandwidth templates

**Q**. What happens to bandwidth controls when you are in between the schedules? (A schedule has ended and another one has not started yet.)

**A**. In such cases, no bandwidth controls will be employed. This means that the device can use unlimited bandwidth when tiering data to the cloud.

**Q**. Can you modify bandwidth templates on an offline device?

**A**. You will not be able to modify bandwidth templates on volumes containers if the corresponding device is offline.

**Q**. Can you edit a bandwidth template associated with a volume container when the associated volumes are offline?

**A**. You can modify a bandwidth template associated with a volume container whose volumes are offline. Note that when volumes are offline, no data will be tiered from the device to the cloud.

**Q**. Can you delete a default template?

**A**. Although you can delete a default template, it is not a good idea to do so. The usage of a default template, including edited versions, is tracked. The tracking data is analyzed and over the course of time, is used to improve the default template.

**Q**. How do you determine that your bandwidth templates need to be modified?

**A**. One of the signs that you need to modify the bandwidth templates is when you start seeing the network slow down or choke multiple times in a day. If this happens, monitor the storage and usage network by looking at the I/O Performance and Network Throughput charts.

From the network throughput data, identify the time of day and the volume containers in which the network bottleneck occurs. If this happens when data is being tiered to the cloud (get this information from I/O performance for all volume containers for device to cloud), then you will need to modify the bandwidth templates associated with your volume containers.

After the modified templates are in use, you will need to monitor the network again for significant latencies. If these still exist, then you will need to revisit your bandwidth templates.

**Q**. What happens if multiple volume containers on my device have schedules that overlap but different limits apply to each?

**A**. Let's assume that you have a device with 3 volume containers. The schedules associated with these containers completely overlap. For each of these containers, the bandwidth limits used are 5, 10, and 15 Mbps respectively. When I/Os are occurring on all of these containers at the same time, the minimum of the 3 bandwidth limits may be applied: in this case, 5 Mbps as these outgoing I/O requests share the same queue.

## Best practices for bandwidth templates

Follow these best practices for your StorSimple device:

- Configure bandwidth templates on your device to enable variable throttling of the network throughput by the device at different times of the day. These bandwidth templates when used with backup schedules can effectively leverage additional network bandwidth for cloud operations during off-peak hours.

- Calculate the actual bandwidth required for a particular deployment based on the size of the deployment and the required recovery time objective (RTO).

## Next steps

Learn more about [using the StorSimple Manager service to administer your StorSimple device](storsimple-manager-service-administration.md).
