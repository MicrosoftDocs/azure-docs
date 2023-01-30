---
title: Analyze programming details and changes for DeltaV traffic
description: Enhance forensics by displaying programming events carried out on your network devices and analyzing code changes. This information helps you discover suspicious programming activity.
ms.date: 01/23/2023
ms.topic: how-to
---

# Analyze programming details and changes for DeltaV traffic

<!--change TOC to match title (for DeltaV)-->

When working with DeltaV traffic, use the OT sensor to watch for programming events occurring on your network devices and analyze any code changes. Watching for programming events helps you investigate suspicous programming activity, such as:

  - **Human error**: An engineer programming the wrong device.
  - **Corrupted programming automation**: Programming errors due to automation failures.
  - **Hacked systems**: Unauthorized users logged into a programming device.

Use the **Programming timeline** areas on your OT network sensor to review programming data. For example, when investigating an alert about unauthorized programming, after a planned controller update, or when a process or machine isn't working correctly and you want to understand who made the last update and when.

Programming activity shown on OT sensors include both *authorized* and *unathorized* events. Authorized events are performed by devices that are either learned or manually defined as programming devices. Unauthorized events are performed by devices that haven't been learned or manually defined as programming devices.

> [!NOTE]
> Programming data is available on OT sensors only for devices with DeltaV protocol.

<!--i don't think we need this image here, it doesn't add a lot. neither does the rest of the text in that section...:::-->

## Prerequisites

To perform the procedures in this article, make sure that you have:

<!-- a sensor installed and configured? Which users are required?-->

## Access programming data

Programming data is available from unathorized programming alerts, the **Device map**, **Event timeline** and **Device inventory** pages. <!--sort this list by order in the sensor UI-->

### Access programming data from an alert

Alerts are triggered when unauthorized programming devices carry out programming activities.

**To access the programming timeline from an alert**:

1. Sign into the sensor console and go to **Alerts**.

1. Filter the alerts to find the alert you want to analyze.

1. Select the alert to open the alert details in the pane on the right.

1. Select **Programming** to open the **Programming timeline**.

    :::image type="content" source="media/how-to-work-with-maps/unauthorized.png" alt-text="Screenshot of unauthorized programming alerts.":::

### Access programming data from a device map

1. Sign into the sensor console and go to **Device map**.

1. Under **OT Protocol**, select **DeltaV**.

1. In the map, right-click on the device you want to analyze, and select **Programming timeline**.

    :::image type="content" source="media/analyze-programming/select-programming-timeline-from-device-map.png" alt-text="Screenshot of the programming timeline option from the device map.":::

1. Select a file to view programming details. You can also download the file, or compare it to other recent files. For more information, see [Working in the programming timeline window](#working-in-the-programming-timeline-window).

### Access programming data from an event timeline

Use the event timeline to display a timeline of events in which programming changes were detected.

1. Sign into the sensor console and go to **Event timeline**.

1. Filter events by keyword **DeltaV** (optional).

1. Select the event you want to analyze to open the event details pane on the right.

1. Select **View programming** to open the programming timeline. You can also download the file, or compare it to other recent files. For more information, see [Working in the programming timeline window](#working-in-the-programming-timeline-window).

    :::image type="content" source="media/how-to-work-with-maps/timeline.png" alt-text="Screenshot of the event timeline.":::

### Accvess programming data from the device inventory

The device inventory indicates if a device is a programming device, and the device properties window provides information on the last programming event detected on the device.

<!--why do we have this image here? does it add anything? :::image type="content" source="media/how-to-work-with-maps/inventory-v2.png" alt-text="Screenshot of the device inventory page.":::-->

**To access the programming timeline from the device inventory**:

1. Sign into the sensor console and go to **Device inventory**.

1. Filter the inventory by protocol and select **DeltaV**.

1. Select the device you want to analyze, and then select **View full details** to open the device properties page.

1. On the device properties page, go to the **Programming timeline** tab to select a file and view programming details. You can also download the file, or compare it to other recent files. For more information, see [Working in the programming timeline window](#working-in-the-programming-timeline-window).

    :::image type="content" source="media/analyze-programming/programming-timeline-window-device-inventory.png" alt-text="Screenshot of programming timeline tab on device properties page.":::

## Programming timeline activities

In a **Programming timeline**, use any of the following options to investigate programming activity data:

|Programming timeline type | Description |
|--|--|
| Programmed Device | Provides details about the device that was programmed, including the hostname and file. |
| Recent Events | Displays the 50 most recent events detected by the sensor. <br />To highlight an event, hover over it and select the star. :::image type="icon" source="media/how-to-work-with-maps/star.png" border="false"::: <br /> The last 50 events can be viewed. |
| Files | Displays the files detected for the chosen date and the file size on the programmed device. <br /> By default, the maximum number of files available for display per device is 300. <br /> By default, the maximum file size for each file is 15 MB. |
| File status :::image type="icon" source="media/analyze-programming/file-status.png" border="false"::: | File labels indicate the status of the file on the device, including: <br /> **Added**: the file was added to the endpoint on the date or time selected. <br /> **Updated**: The file was updated on the date or time selected. <br /> **Deleted**: This file was removed. <br /> **No label**: The file wasn't changed.   |
| Programming Device | The device that made the programming change. Multiple devices may have carried out programming changes on one programmed device. The hostname, date, or time of change and logged in user are displayed. |
| :::image type="content" source="media/analyze-programming/current-file-indication.png" alt-text="Image of current file indication."::: | Indicates the current file installed on the programmed device. |
| :::image type="icon" source="media/analyze-programming/download-icon.png" border="false"::: | Download a text file of the code displayed. |
| :::image type="icon" source="media/analyze-programming/compare-icon.png" border="false"::: | Compare the current file with another file detected on a selected date. |

### Review a specific programming detail file

<!--when do i do this? how do i get to the recent events pane?-->

**To review a specific programming detail file**:

1. Select an event period from the **Recent Events** pane.

1. Select a file from the **File** pane. The file appears in the pane on the right. <!--screenshot should be of the full page to give context-->

   :::image type="content" source="media/analyze-programming/programming-timeline-2.png" alt-text="Screenshot of the programming timeline window." lightbox="media/analyze-programming/programming-timeline-2.png":::

### Compare programming detail files

This procedure describes how to compare multiple programming detail files. <!--why would i want to do this?-->

**To compare files:**

1. Select an event period from the **Recent Events** pane.

2. Select a file from the **File** pane. The file appears in the pane on the right. You can compare this file to other files.

3. Select the compare indicator. 

    :::image type="content" source="media/analyze-programming/compare-icon.png" alt-text="Screenshot of the compare indicator.":::

1. Select a file for comparison by clicking on the scale icon under **Action** next to the file. 

    :::image type="content" source="media/analyze-programming/compare-file-pane.png" alt-text="Screenshot of compare files pane.":::

   <!--Remove all of this? I don't see this option of differences or dates-->

   The window displays all dates the selected file was detected on the programmed device. The file may have been updated on the programmed device by multiple programming devices.

   The number of differences detected appears in the upper right-hand corner of the window. You may need to scroll down to view differences.

   :::image type="content" source="media/how-to-work-with-maps/scroll.png" alt-text="Screenshot of scrolling down to your selection.":::

   The number is calculated by adjacent lines of changed text. For example, if eight consecutive lines of code were changed (deleted, updated, or added) this will be calculated as one difference.

   :::image type="content" source="media/how-to-work-with-maps/program-timeline.png" alt-text="Screenshot of the programming timeline view." lightbox="media/how-to-work-with-maps/program-timeline.png":::

1. Select a date. The file detected on the selected date appears in the window. 

<!--Remove all of this? I don''t see this option of differences or dates-->

1. The file selected from the **Recent Events** or **Files** pane always appears on the right.

    :::image type="content" source="media/analyze-programming/compare-files-side-by-side.png" alt-text="Screenshot of programming file comparison side by side.":::

    Compare and download files as needed.


## About authorized versus unauthorized programming events


<!--do we realy need a screenshot here to explain this? -->
:::image type="content" source="media/analyze-programming/programming-timeline-2.png" alt-text="Screenshot of the programming timeline window." lightbox="media/analyze-programming/programming-timeline-2.png":::





## Next steps

For more information, see [Import device information to a sensor](how-to-import-device-information.md).
