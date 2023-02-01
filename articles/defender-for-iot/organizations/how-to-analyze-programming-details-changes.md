---
title: Analyze programming details and changes for DeltaV traffic
description: Enhance forensics by displaying programming events carried out on your network devices and analyzing code changes. This information helps you discover suspicious programming activity.
ms.date: 01/31/2023
ms.topic: how-to
---

# Analyze programming details and changes for DeltaV traffic

<!--change TOC to match title (for DeltaV)-->

When working with DeltaV traffic, use the OT sensor to watch for programming events occurring on your network devices and analyze any code changes. Watching for programming events helps you investigate suspicious programming activity, such as:

  - **Human error**: An engineer programming the wrong device.
  - **Corrupted programming automation**: Programming errors due to automation failures.
  - **Hacked systems**: Unauthorized users logged into a programming device.

Use the **Programming timeline** on your OT network sensor to review programming data. For example, when investigating an alert about unauthorized programming, after a planned controller update, or when a process or machine isn't working correctly and you want to understand who made the last update and when.

Programming activity shown on OT sensors include both *authorized* and *unauthorized* events. Authorized events are performed by devices that are either learned or manually defined as programming devices. Unauthorized events are performed by devices that haven't been learned or manually defined as programming devices.

> [!NOTE]
> Programming data is available on OT sensors only for the DeltaV protocol.

## Prerequisites

To perform the procedures in this article, make sure that you have:

- An OT sensor installed and configured.
- Access to the sensor as a **Viewer**, **Security analyst** or **Admin** user.

## Access programming data

The **Programming timeline** can be accessed from unauthorized programming alerts, and the **Device map**, **Device inventory**, and **Event timeline** pages in the sensor console.

### Access programming data from an alert

Unauthorized programming alerts are triggered when unauthorized programming devices carry out programming activities.

**To access the programming timeline from an alert**:

1. Sign into the sensor console and go to **Alerts**.

1. Filter the alerts to find the alert you want to analyze.

1. Select the alert to open the alert details pane on the right.

1. Select **Programming** to open the **Programming timeline**.

    :::image type="content" source="media/how-to-work-with-maps/unauthorized.png" alt-text="Screenshot of unauthorized programming alerts.":::

### Access programming data from the device map

1. Sign into the sensor console and go to **Device map**.

1. Under **OT Protocol**, select **DeltaV**.

1. In the map, right-click on the device you want to analyze, and select **Programming timeline**.

    :::image type="content" source="media/analyze-programming/select-programming-timeline-from-device-map.png" alt-text="Screenshot of the programming timeline option from the device map.":::

1. Select a file to view programming details. You can also download the file, or compare it to other recent files. For more information, see [Programming timeline activities](#programming-timeline-activities).

### Access programming data from the device inventory

The device inventory indicates if a device is a programming device, and the device properties page provides information on the last programming event detected on the device.

**To access the programming timeline from the device inventory**:

1. Sign into the sensor console and go to **Device inventory**.

1. Filter the inventory by protocol and select **DeltaV**.

1. Select the device you want to analyze, and then select **View full details** to open the device properties page.

1. On the device properties page, go to the **Programming timeline** tab to select a file and view programming details. You can also download the file, or compare it to other recent files. For more information, see [Programming timeline activities](#programming-timeline-activities). For example:

    :::image type="content" source="media/analyze-programming/programming-timeline-window-device-inventory.png" alt-text="Screenshot of programming timeline tab on device properties page.":::

### Access programming data from an event timeline

Use the event timeline to display a timeline of events in which programming changes were detected.

1. Sign into the sensor console and go to **Event timeline**.

1. Filter events by keyword **DeltaV**.

1. Select the event you want to analyze to open the event details pane on the right.

1. Select **View programming** to open the programming timeline. You can also download the file, or compare it to other recent files. For more information, see [Programming timeline activities](#programming-timeline-activities).

    :::image type="content" source="media/how-to-work-with-maps/timeline.png" alt-text="Screenshot of the event timeline.":::

## Programming timeline activities

In a **Programming timeline**,  you can [Review programming detail files](#review-a-specific-programming-detail-file), or [Compare files](#compare-programming-detail-files), to analyze and investigate programming activity data.

### Programming timeline reference table

|Field | Description |
|--|--|
| Programmed Device | Provides details about the device that was programmed, including the hostname and file. |
| Recent Events | Displays the 50 most recent events detected by the sensor. <br />To highlight an event, hover over it and select the star. :::image type="icon" source="media/how-to-work-with-maps/star.png" border="false"::: <br /> The last 50 events can be viewed. |
| Files | Displays the files detected for the chosen date and the file size on the programmed device. <br /> By default, the maximum number of files available for display per device is 300. <br /> By default, the maximum file size for each file is 15 MB. |
| File status :::image type="icon" source="media/analyze-programming/file-status.png" border="false"::: | File labels indicate the status of the file on the device, including: <br /> **Added**: the file was added to the endpoint on the date or time selected. <br /> **Updated**: The file was updated on the date or time selected. <br /> **Deleted**: This file was removed. <br /> **No label**: The file wasn't changed.   |
| Programming Device | The device that made the programming change. Multiple devices may have carried out programming changes on one programmed device. The hostname, date, or time of change and logged in user are displayed. |
| :::image type="content" source="media/analyze-programming/current-file-indication.png" alt-text="Image of current file indication."::: | Indicates the current file installed on the programmed device. |
| :::image type="icon" source="media/analyze-programming/download-icon.png" border="false"::: | Download a text file of the code displayed. |
| :::image type="icon" source="media/analyze-programming/compare-icon.png" border="false"::: | Compare the current file with another recent file. |

### Review a specific programming detail file

Open specific files to review programming details.

**To review a specific programming detail file**:

1. Select an event period from the **Recent Events** pane.

1. Select a file from the **File** pane. The file appears in the pane on the right. For example, from a device properties page:

   :::image type="content" source="media/analyze-programming/programming-timeline-2.png" alt-text="Screenshot of the programming timeline window." lightbox="media/analyze-programming/programming-timeline-2.png":::

    Review the programming details, download the file, or compare it to another recent file.

### Compare programming detail files

This procedure describes how to compare multiple programming detail files.

You may want to compare the programming details of multiple files to determine if there are any differences and investigate them for suspicious activity.

**To compare files:**

1. Select an event period from the **Recent Events** pane.

1. Select a file from the **File** pane. The file appears in the pane on the right. You can compare this file to other recent files.

1. Select the compare :::image type="icon" source="media/analyze-programming/compare-icon.png" border="false"::: indicator to open the **Compare** pane.

1. In the **Compare** pane, select a file for comparison by selecting the scale icon under **Action** next to the file. 

    :::image type="content" source="media/analyze-programming/compare-file-pane.png" alt-text="Screenshot of compare files pane.":::

    The selected file opens up in a new pane for side by side comparison with the first file. The current file installed on the programmed device will always appear on the right, and is indicated with the *Current* :::image type="icon" source="media/analyze-programming/current-file-indication.png" border="false"::: label.

    :::image type="content" source="media/analyze-programming/compare-files-side-by-side.png" alt-text="Screenshot of programming file comparison side by side.":::

    Scroll through the files to see the programming details and any differences between the files. Differences between the two files are highlighted, in green for the current file and in red for the comparison file.

## Next steps

For more information, see [Import device information to a sensor](how-to-import-device-information.md).
