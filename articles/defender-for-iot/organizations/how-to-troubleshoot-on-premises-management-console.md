---
title: Troubleshoot the sensor and on-premises management console
description: Troubleshoot your sensor and on-premises management console to eliminate any problems you might be having.
ms.date: 06/15/2022
ms.topic: troubleshooting
---
# Troubleshoot the on-premises management console

This article describes basic troubleshooting tools for the on-premises management console. In addition to the items described here, you can forward alerts about failed sensor backups and disconnected sensors.

For any other issues, contact [Microsoft Support](https://support.microsoft.com/supportforbusiness/productselection?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099).

## Prerequisites

To perform the procedures in this article, make sure that you have:

- Access to the on-premises management console as a **Support** user. For more information, see [Default privileged on-premises users](roles-on-premises.md#default-privileged-on-premises-users).

## Check system health

Check your system health from the on-premises management console.

**To access the system health tool**:

1. Sign in to the on-premises management console with the *support* user credentials.

1. Select **System Settings** > **System Statistics**.

    :::image type="icon" source="media/tutorial-install-components/system-statistics-icon.png" border="false":::

1. System health data appears. Select an item to view more details in the box. For example:

    :::image type="content" source="media/tutorial-install-components/system-health-check-screen.png" alt-text="Screenshot that shows the system health check.":::

System health checks include the following:

|Name  |Description  |
|---------|---------|
|**Sanity**     |         |
|- Appliance     | Runs the appliance sanity check. You can perform the same check by using the CLI command `system-sanity`.        |
|- Version     | Displays the appliance version.        |
|- Network Properties     | Displays the sensor network parameters.        |
|**Redis**     |         |
|- Memory     |   Provides the overall picture of memory usage, such as how much memory was used and how much remained.      |
|- Longest Key     | Displays the longest keys that might cause extensive memory usage.        |
|**System**     |         |
|- Core Log     | Provides the last 500 rows of the core log, so that you can view the recent log rows without exporting the entire system log.        |
|- Task Manager     |  Translates the tasks that appear in the table of processes to the following layers: <br><br>  - Persistent layer (Redis)<br>  - Cache layer (SQL) |
|- Network Statistics     | Displays your network statistics.        |
|- TOP     |    Shows the table of processes. It's a Linux command that provides a dynamic real-time view of the running system.     |
|- Backup Memory Check     | Provides the status of the backup memory, checking the following:<br><br> - The location of the backup folder<br>  - The size of the backup folder<br>  - The limitations of the backup folder<br>  - When the last backup happened<br>  - How much space there is for the extra backup files        |
|- ifconfig     | Displays the parameters for the appliance's physical interfaces.        |
|- CyberX nload     | Displays network traffic and bandwidth by using the six-second tests.        |
|- Errors from core log     |  Displays errors from the core log file.       |

## Investigate a lack of expected alerts

If you don't see an expected alert on the on-premises **Alerts** page, do the following to troubleshoot:

- Verify whether the alert is already listed as a reaction to a different security instance. If it is, and that alert hasn't yet been handled, a new alert isn't shown elsewhere.

- Verify that the alert isn't being excluded by **Alert Exclusion** rules. For more information, see [Create alert exclusion rules on an on-premises management console](how-to-accelerate-alert-incident-response.md#create-alert-exclusion-rules-on-an-on-premises-management-console).

## Tweak the Quality of Service (QoS)

To save your network resources, you can limit the number of alerts sent to external systems (such as emails or SIEM) in one sync operation between an appliance and the on-premises management console.

The default number of alerts is 50. This means that in one communication session between an appliance and the on-premises management console, there will be no more than 50 alerts to external systems.

To limit the number of alerts, use the `notifications.max_number_to_report` property available in `/var/cyberx/properties/management.properties`. No restart is needed after you change this property.

**To tweak the Quality of Service (QoS)**:

1. Sign into your on-premises management console via SSH to access the [CLI](references-work-with-defender-for-iot-cli-commands.md).

1. Verify the default values:

   ```bash
   grep \"notifications\" /var/cyberx/properties/management.properties
   ```

   The following default values appear:

   ```bash
   notifications.max_number_to_report=50
   notifications.max_time_to_report=10 (seconds)
   ```

1. Edit the default settings:

   ```bash
   sudo nano /var/cyberx/properties/management.properties
   ```

1. Edit the settings of the following lines:

   ```bash
   notifications.max_number_to_report=50
   notifications.max_time_to_report=10 (seconds)
   ```

1. Save the changes. No restart is required.

## Export logs from the on-premises management console for troubleshooting

For further troubleshooting, you may want to export logs to send to the support team, such as audit or database logs.

**To export log data**:

1. In the on-premises management console, select **System Settings > Export**.

1. In the **Export Troubleshooting Information** dialog:

    1. In the **File Name** field, enter a meaningful name for the exported log. The default filename uses the current date, such as **13:10-June-14-2022.tar.gz**.

    1. Select the logs you would like to export.

    1. Select **Export**.

    The file is exported and is linked from the **Archived Files** list at the bottom of the **Export Troubleshooting Information** dialog.

    For example:

    :::image type="content" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/export-logs-on-premises-management-console.png" alt-text="Screenshot of the Export Troubleshooting Information dialog in the on-premises management console." lightbox="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/export-logs-on-premises-management-console.png":::

1. Select the file link to download the exported log, and also select the :::image type="icon" source="media/how-to-troubleshoot-the-sensor-and-on-premises-management-console/eye-icon.png" border="false"::: button to view its one-time password.

1. To open the exported logs, forward the downloaded file and the one-time password to the support team. Exported logs can be opened only together with the Microsoft support team.

    To keep your logs secure, make sure to forward the password separately from the downloaded log.

## Next steps

- [View alerts](how-to-view-alerts.md)

- [Track on-premises user activity](track-user-activity.md)
