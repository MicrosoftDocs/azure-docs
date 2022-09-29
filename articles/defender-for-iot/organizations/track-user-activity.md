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
