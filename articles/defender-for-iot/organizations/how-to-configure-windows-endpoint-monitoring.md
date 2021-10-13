---
title: Configure Windows endpoint monitoring
description: Enrich data resolved on devices by working with Windows endpoint monitoring (WMI).
ms.date: 05/03/2021
ms.topic: how-to
---


# Configure Windows endpoint monitoring (WMI)

With the Windows endpoint monitoring capability, you can configure Azure Defender for IoT to selectively probe Windows systems. This provides you with more focused and accurate information about your devices, such as service pack levels.

You can configure probing with specific ranges and hosts, and configure it to be performed only as often as desired. You accomplish selective probing by using the Windows Management Instrumentation (WMI), which is Microsoft's standard scripting language for managing Windows systems.

> [!NOTE]
> - You can run only one scan at a time.
> - You get the best results with users who have domain or local administrator privileges.
> - Before you begin the WMI configuration, configure a firewall rule that opens outgoing traffic from the sensor to the scanned subnet by using UDP port 135 and all TCP ports above 1024.

When the probe is finished, a log file with all the probing attempts is available from the option to export a log. The log contains all the IP addresses that were probed. For each IP address, the log shows success and failure information. There's also an error code, which is a free string derived from the exception. The scan of the last log only is kept in the system.

You can perform scheduled scans or manual scans. When a scan is finished, you can view the results in a CSV file.

**Prerequisites**

Configure a firewall rule that opens outgoing traffic from the sensor to the scanned subnet by using UDP port 135 and all TCP ports above 1024.

## Perform an automatic scan

This section describes how to perform an automatic scan

**To perform an automatic scan:**

1. On the side menu, select **System Settings**.

2. Select **Windows Endpoint Monitoring** :::image type="icon" source="media/how-to-control-what-traffic-is-monitored/windows-endpoint-monitoring-icon-v2.png" border="false":::.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/windows-endpoint-monitoring-screen-v2.png" alt-text="Screenshot that shows the selection of Windows Endpoint Monitoring.":::

3. On the **Scan Schedule** pane, configure options as follows:

      - **By fixed intervals (in hours)**: Set the scan schedule according to intervals in hours.

      - **By specific times**: Set the scan schedule according to specific times and select **Save Scan**.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/schedule-a-scan-screen-v2.png" alt-text="Screenshot that shows the Save Scan button.":::

4. To define the scan range, select **Set scan ranges**.

5. Set the IP address range and add your user and password.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/edit-scan-range-screen.png" alt-text="Screenshot that shows adding a user and password.":::

6. To exclude an IP range from a scan, select **Disable** next to the range.

7. To remove a range, select :::image type="icon" source="media/how-to-control-what-traffic-is-monitored/remove-scan-icon.png" border="false"::: next to the range.

8. Select **Save**. The **Edit Scan Ranges Configuration** dialog box closes, and the number of ranges appears in the **Scan Ranges** pane.

## Perform a manual scan

**To perform a manual scan:**

1. On the side menu, select **System Settings**.

2. Select **Windows Endpoint Monitoring** :::image type="icon" source="media/how-to-control-what-traffic-is-monitored/windows-endpoint-monitoring-icon-v2.png" border="false":::.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/windows-endpoint-monitoring-screen-v2.png" alt-text="Screenshot that shows the Windows Endpoint Monitoring setup screen.":::

3. In the **Actions** pane, select **Start scan**. A status bar appears on the **Actions** pane and shows the progress of the scanning process.

    :::image type="content" source="media/how-to-control-what-traffic-is-monitored/started-scan-screen-v2.png" alt-text="Screenshot that shows the Start scan button.":::

## View scan results

**To view scan results:**

1. When the scan is finished, on the **Actions** pane, select **View Scan Results**. The CSV file with the scan results is downloaded to your computer.