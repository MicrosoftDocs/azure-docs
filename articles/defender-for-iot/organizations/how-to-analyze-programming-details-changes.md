---
title: Analyze programming details and changes on an OT sensor - Microsoft Defender for IoT
description: Discover suspicious programming activity by investigating programming events occurring on your network devices.
ms.date: 02/28/2023
ms.topic: how-to
---

# Analyze programming details and changes

Enhance forensics by displaying programming events occurring on your network devices and analyzing any code changes using the OT sensor. Watching for programming events helps you investigate suspicious programming activity, such as:

  - **Human error**: An engineer programming the wrong device.
  - **Corrupted programming automation**: Programming errors due to automation failures.
  - **Hacked systems**: Unauthorized users logged into a programming device.

Use the **Programming Timeline** tab on your OT network sensor to review programming data, such as when investigating an alert about unauthorized programming, after a planned controller update, or when a process or machine isn't working correctly and you want to understand who made the last update and when.

Programming activity shown on OT sensors include both *authorized* and *unauthorized* events. Authorized events are performed by devices that are either learned or manually defined as programming devices. Unauthorized events are performed by devices that haven't been learned or manually defined as programming devices.

> [!NOTE]
> Programming data is available for devices using text based programming protocols, such as DeltaV.

## Prerequisites

To perform the procedures in this article, make sure that you have:

- An OT sensor installed and configured, with text based programming protocol traffic.

- Access to the sensor as a **Viewer**, **Security analyst** or **Admin** user.

## Access programming data

The **Programming Timeline** tab can be accessed from the **Device map**, **Device inventory**, and **Event timeline** pages in the sensor console.

### Access programming data from the device map

1. Sign into the OT sensor console and select **Device map**.

1. In the **Groups** area to the left of the map, select **Filter** > **OT Protocols** > select a text based programming protocol, such as DeltaV.

1. In the map, right-click on the device you want to analyze, and select **Programming timeline**.

      :::image type="content" source="media/analyze-programming/select-programming-timeline-from-device-map.png" alt-text="Screenshot of the programming timeline option from the device map." lightbox="media/analyze-programming/select-programming-timeline-from-device-map.png":::

      The device details page opens with the **Programming Timeline** tab open.
  
### Access programming data from the device inventory

1. Sign into the OT sensor console and select **Device inventory**.

1. Filter the device inventory to show devices using text based programming protocols, such as DeltaV.

1. Select the device you want to analyze, and then select **View full details** to open the device details page.

1. On the device details page, select the **Programming Timeline** tab.

    For example: 

    :::image type="content" source="media/analyze-programming/programming-timeline-window-device-inventory.png" alt-text="Screenshot of programming timeline tab on device details page." lightbox="media/analyze-programming/programming-timeline-window-device-inventory.png":::

### Access programming data from the event timeline

Use the event timeline to display a timeline of events in which programming changes were detected.

1. Sign into the OT sensor console and select **Event timeline**.

1. Filter the event timeline for devices using text based programming protocols, such as **DeltaV**.

1. Select the event you want to analyze to open the event details pane on the right, and then select **Programming timeline**.

## View programming details

The **Programming Timeline** tab shows details about each device that was programmed. Select an event and a file to view full programming details on the right. In the **Programming Timeline** tab:

- The **Recent Events** area lists the 50 most recent events detected by the OT sensor. Hover over an event period select the star to mark the event as an **Important** event.

- The **Files** area lists programming files detected for the selected device. The OT sensor can display a maximum of 300 files per device, where each file has a maximum size of 15 MB. The **Files** area lists each file's name and size, and one of the following statuses to indicate the programming event that occurred:

  - **Added**: The programming file was added to the endpoint
  - **Updated**: The programming file was updated on the endpoint
  - **Deleted**: The programming file was removed from the endpoint
  - **Unknown**: No changes were detected for the programming file

- When a programming file is opened on the right, the device that was programmed is listed as the *programmed asset*. Multiple devices may have made programming changes on the device. Devices that made changes are listed as the *programming assets*, and details include the hostname, when the change was made, and the user that was signed in to the device at the time.

> [!TIP]
> Select the :::image type="icon" source="media/analyze-programming/download-icon.png" border="false"::: download button to download a copy of the currently displayed programming file.

For example:

:::image type="content" source="media/analyze-programming/programming-timeline-2.png" alt-text="Screenshot of viewing programming details in programming timeline." lightbox="media/analyze-programming/programming-timeline-2.png":::

## Compare programming detail files

This procedure describes how to compare multiple programming detail files to identify discrepancies or investigate them for suspicious activity.

**To compare files:**

1. Open a programming file from an alert or from the **Device map** or **Device inventory** pages.

1. With your first file open, select the compare :::image type="icon" source="media/analyze-programming/compare-icon.png" border="false"::: button.

1. In the **Compare** pane, select a file for comparison by selecting the scale icon under **Action** next to the file. For example:

    :::image type="content" source="media/analyze-programming/compare-file-pane.png" alt-text="Screenshot of compare files pane." lightbox="media/analyze-programming/compare-file-pane.png":::

    The selected file opens up in a new pane for side-by-side comparison with the first file. The current file installed on the programmed device is labeled *Current* at the top of the file.

    :::image type="content" source="media/analyze-programming/compare-files-side-by-side.png" alt-text="Screenshot of programming file comparison side by side." lightbox="media/analyze-programming/compare-files-side-by-side.png":::

    Scroll through the files to see the programming details and any differences between the files. Differences between the two files are highlighted in green and red.

## Next steps

For more information, see [Import device information to a sensor](how-to-import-device-information.md).
