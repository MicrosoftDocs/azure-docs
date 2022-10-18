---
title: Analyze programming details and changes
description: Enhance forensics by displaying programming events carried out on your network devices and analyzing code changes. This information helps you discover suspicious programming activity.
ms.date: 01/30/2022
ms.topic: how-to
---


# Analyze programming details and changes

Enhance forensics by displaying programming events carried out on your network devices and analyzing code changes. This information helps you discover suspicious programming activity, for example:

  - Human error: An engineer is programming the wrong device.

  - Corrupted programming automation: Programming is erroneously carried out because of automation failure.

  - Hacked systems: Unauthorized users logged into a programming device.

You can display a programmed device and scroll through various programming changes carried out on it by other devices.

View code that was added, changed, removed, or reloaded by the programming device. Search for programming changes based on file types, dates, or times of interest.

## When to review programming activity 

You may need to review programming activity:

  - After viewing an alert regarding unauthorized programming

  - After a planned update to controllers

  - When a process or machine isn't working correctly (to see who carried out the last update and when)

   :::image type="content" source="media/how-to-work-with-maps/differences.png" alt-text="Screenshot of a Programming Change Log":::

Other options let you:

  - Mark events of interest with a star.

  - Download a *.txt file with the current code.

## About authorized versus unauthorized programming events 

Unauthorized programming events are carried out by devices that haven't been learned or manually defined as programming devices. Authorized programming events are carried out by devices that were resolved or manually defined as programming devices.

The Programming Analysis window displays both authorized and unauthorized programming events.

## Accessing programming details and changes

Access the Programming Analysis window from the:

- [Event Timeline](how-to-track-sensor-activity.md)

- [Unauthorized Programming Alerts](#unauthorized-programming-alerts)

### Event timeline

Use the event timeline to display a timeline of events in which programming changes were detected.

:::image type="content" source="media/how-to-work-with-maps/timeline.png" alt-text="Screenshot of the event timeline.":::

### Unauthorized programming alerts

Alerts are triggered when unauthorized programming devices carry out programming activities.

:::image type="content" source="media/how-to-work-with-maps/unauthorized.png" alt-text="Screenshot of unauthorized programming alerts":::

> [!NOTE]
> You can also view basic programming information in the Device Properties window and Device Inventory.

## Working in the programming timeline window

This section describes how to view programming files and compare versions. Search for specific files sent to a programmed device. Search for files based on:

  - Date

  - File type

   :::image type="content" source="media/how-to-work-with-maps/timeline-view.png" alt-text="Screenshot of a programming timeline window.":::

|Programming timeline type | Description |
|--|--|
| Programmed Device | Provides details about the device that was programmed, including the hostname and file. |
| Recent Events | Displays the 50 most recent events detected by the sensor. <br />To highlight an event, hover over it and select the star. :::image type="icon" source="media/how-to-work-with-maps/star.png" border="false"::: <br /> The last 50 events can be viewed. |
| Files | Displays the files detected for the chosen date and the file size on the programmed device. <br /> By default, the maximum number of files available for display per device is 300. <br /> By default, the maximum file size for each file is 15 MB. |
| File status :::image type="icon" source="media/how-to-work-with-maps/status-v2.png" border="false"::: | File labels indicate the status of the file on the device, including: <br /> **Added**: the file was added to the endpoint on the date or time selected. <br /> **Updated**: The file was updated on the date or time selected. <br /> **Deleted**: This file was removed. <br /> **No label**: The file wasn't changed.   |
| Programming Device | The device that made the programming change. Multiple devices may have carried out programming changes on one programmed device. The hostname, date, or time of change and logged in user are displayed. |
| :::image type="icon" source="media/how-to-work-with-maps/current.png" border="false"::: | Displays the current file installed on the programmed device. |
| :::image type="icon" source="media/how-to-work-with-maps/download-text.png" border="false"::: | Download a text file of the code displayed. |
| :::image type="icon" source="media/how-to-work-with-maps/compare.png" border="false"::: | Compare the current file with the file detected on a selected date. |

### Choose a file to review

This section describes how to choose a file to review.

**To choose a file to review:**

1. Select an event from the **Recent Events** pane

2. Select a file from the File pane. The file appears in the Current pane.

   :::image type="content" source="media/how-to-work-with-maps/choose-file.png" alt-text="Screenshot of selecting the file you want to work with.":::

### Compare files

This section describes how to compare programming files.

**To compare:**

1. Select an event from the Recent Events pane.

2. Select a file from the File pane. The file appears in the  Current pane. You can compare this file to other files.

3. Select the compare indicator.

   :::image type="content" source="media/how-to-work-with-maps/compare.png" alt-text="Screenshot of the compare indicator.":::

   The window displays all dates the selected file was detected on the programmed device. The file may have been updated on the programmed device by multiple programming devices.

   The number of differences detected appears in the upper right-hand corner of the window. You may need to scroll down to view differences.

   :::image type="content" source="media/how-to-work-with-maps/scroll.png" alt-text="Screenshot of scrolling down to your selection.":::

   The number is calculated by adjacent lines of changed text. For example, if eight consecutive lines of code were changed (deleted, updated, or added) this will be calculated as one difference.

   :::image type="content" source="media/how-to-work-with-maps/program-timeline.png" alt-text="Screenshot of the programming timeline view." lightbox="media/how-to-work-with-maps/program-timeline.png":::

4. Select a date. The file detected on the selected date appears in the window.

5. The file selected from the Recent Events/Files pane always appears on the right.

## Device programming information: Other locations

In addition to reviewing details in the Programming Timeline, you can access programming information in the Device Properties window and the Device Inventory.

| Device type | Description |
|--|--|
| Device properties | The device properties window provides information on the last programming event detected on the device. |
| The device inventory | The device inventory indicates if the device is a programming device. <br> :::image type="content" source="media/how-to-work-with-maps/inventory-v2.png" alt-text="Screenshot of the device inventory page."::: |

## Next steps

For more information, see [Import device information to a sensor](how-to-import-device-information.md).