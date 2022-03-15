---
title: Configure Windows endpoint monitoring for Defender for IoT devices
description: Set up Windows endpoint monitoring (WMI) for Windows information on devices.
ms.date: 02/01/2022
ms.topic: how-to
---


# Configure Windows endpoint monitoring (WMI)

Use WMI to scan Windows systems for focused and accurate device information, such as service pack levels. You can scan specific IP address ranges and hosts. You can perform scheduled or manual scans. When a scan is finished, you can view the results in a CSV log file. The log contains all the IP addresses that were probed, and success and failure information for each address. There's also an error code, which is a free string derived from the exception.  Note that:

- You can run only one scan at a time.
- You get the best results with users who have domain or local administrator privileges.
- Only the scan of the last log is kept in the system.


## Set up a firewall rule

Before you begin scanning, create a firewall rule that allows outgoing traffic from the sensor to the scanned subnet by using UDP port 135 and all TCP ports above 1024.


## Set up scanning

1. In Defender for IoT select **System Settings**.
1. Under **Network monitoring**, select **Windows Endpoint Monitoring (WMI)**
1. In the **Windows Endpoint Monitoring (WMI) dialog, select **Add ranges**. You can also import and export ranges.
1. Specify the IP address range you want to scan. You can add multiple ranges.
1. Add your user name and password, and ensure that **Enable** is toggled on.
1. In **Scan will run**, specify when you want the automatic scan to run. You can set an hourly interval between scans, or a specific scan time.
1. If you want to run a scan immediately with the configured settings, select **Manually scan**.
1. Select **Save** to save the automatic scan settings.
1. When the scan is finished, select to view/export scan results.

## Next steps

For more information, see [Work with device notifications](how-to-work-with-device-notifications.md).