---
title: Track on-premises OT monitoring user activity - Microsoft Defender for IoT
description: Track Microsoft Defender for IoT on-premises user activity on a sensor's event timeline, or by viewing audit logs generated on an on-premises management console.
ms.date: 01/26/2022
ms.topic: article
---

# Track on-premises OT monitoring user activity

Track user activity on a sensor's event timeline, or by viewing audit logs generated on an on-premises management console.

- **The timeline** displays the event or affected device, and the time and date that the user carried out the activity.

- **Audit logs** record key activity data at the time of occurrence. Use audit logs generated on the on-premises management console to understand which changes were made, when, and by whom.

## View user activity on the sensor's Event Timeline

Select **Event Timeline** from the sensor side menu. If needed, verify that  **User Operations** filter is set to **Show**.

For example:

:::image type="content" source="media/how-to-create-and-manage-users/track-user-activity.png" alt-text="Screenshot of the Event timeline showing a user that signed in to Defender for IoT.":::

Use the filters or search using CTRL+F to find the information of interest to you.
<!--remove this, needs other improvement for event timeline
The maximum number of events displayed depends on the [hardware profile](how-to-install-software.md#install-ot-monitoring-software) configured for your sensor during installation. While the event timeline isn't limited by time, after the maximum number of events is reached, the oldest events are deleted.

|Hardware profile  |Number of events displayed  |
|---------|---------|
| C5600     |   10 million events      |
| E1800    |   10 million events      |
| E1000     |   6 million events     |
| E500     |   6 million events     |
| L500     |  3 million events       |
| L100     |   500 thousand events      |
| L60     |   500 thousand events      |

For more information, see [Which appliances do I need?](ot-appliance-sizing.md)
-->
## View audit log data on the on-premises management console

In the on-premises management console, select **System Settings > System Statistics**, and then select **Audit log**.

The dialog displays data from the currently active audit log. For example:

For example:

:::image type="content" source="media/how-to-create-and-manage-users/view-audit-logs.png" alt-text="Screenshot of the on-premises management console showing audit logs." lightbox="media/how-to-create-and-manage-users/view-audit-logs.png":::

New audit logs are generated at every 10 MB. One previous log is stored in addition to the current active log file.

Audit logs include the following data:

| Action | Information logged |
|--|--|
| **Learn, and remediation of alerts** | Alert ID |
| **Password changes** | User, User ID |
| **Login** | User |
| **User creation** | User, User role |
| **Password reset** | User name |
| **Exclusion rules-Creation**| Rule summary |
| **Exclusion rules-Editing**| Rule ID, Rule Summary |
| **Exclusion rules-Deletion** | Rule ID |
| **Management Console Upgrade** | The upgrade file used |
| **Sensor upgrade retry** | Sensor ID |
| **Uploaded TI package** | No additional information recorded. |


> [!TIP]
> You may also want to export your audit logs to send them to the support team for extra troubleshooting. For more information, see [Export audit logs for troubleshooting](how-to-troubleshoot-the-sensor-and-on-premises-management-console.md#export-audit-logs-for-troubleshooting)
>

## Next steps

For more information, see [Create and manage on-premises users for OT monitoring](how-to-create-and-manage-users.md).
