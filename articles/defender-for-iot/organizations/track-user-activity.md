---
title: Audit Microsoft Defender for IoT user activity
description: Learn how to track and audit user activity across Microsoft Defender for IoT.
ms.date: 01/26/2022
ms.topic: how-to
---

# Audit user activity

After you've set up your user access for the [Azure portal](manage-users-portal.md), on your [OT network sensors](manage-users-sensor.md) and an [on-premises management consoles](manage-users-on-premises-management-console.md), you'll want to be able to track and audit user activity across all of Microsoft Defender for IoT.

## Audit Azure user activity

Use Microsoft Entra user auditing resources to audit Azure user activity across Defender for IoT. For more information, see:

- [Audit logs in Microsoft Entra ID](../../active-directory/reports-monitoring/concept-audit-logs.md)
- [Microsoft Entra audit activity reference](../../active-directory/reports-monitoring/reference-audit-activities.md)

## Audit user activity on an OT network sensor

Audit and track user activity on a sensor's **Event timeline**. The **Event timeline** displays events that occurred on the sensor, affected devices for each event, and the time and date that the event occurred.

> [!NOTE]
> This procedure is supported for users with an **Admin** role, and the *support*, *cyberx*, and *cyberx_host* users.
>

**To use the sensor's Event Timeline**:

1. Sign into the sensor console as one of the following users:

    - Any **Admin** user
    - The *support*, *cyberx*, or *cyberx_host* user

1. On the sensor, select **Event Timeline** from the left-hand menu. Make sure that the filter is set to show **User Operations**.

    For example:

    :::image type="content" source="media/manage-users-sensor/track-user-activity.png" alt-text="Screenshot of the Event Timeline on the sensor showing user activity.":::

1. Use additional filters or search using **CTRL+F** to find the information of interest to you.

    For more information on the event timeline, see [Track network and sensor activity with the event timeline](how-to-track-sensor-activity.md)

## Audit user activity on an on-premises management console

To audit and track user activity on an on-premises management console, use the on-premises management console audit logs, which record key activity data at the time of occurrence. Use on-premises management console audit logs to understand changes that were made on the on-premises management console, when, and by whom.

**To access on-premises management console audit logs**:

Sign in to the on-premises management console and select **System Settings > System Statistics** > **Audit log**.

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
> You may also want to export your audit logs to send them to the support team for extra troubleshooting. For more information, see [Export logs from the on-premises management console for troubleshooting](how-to-troubleshoot-on-premises-management-console.md#export-logs-from-the-on-premises-management-console-for-troubleshooting).
>

## Next steps

For more information, see:

- [Microsoft Defender for IoT user management](manage-users-overview.md)
- [Azure user roles and permissions for Defender for IoT](roles-azure.md)
- [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md)
- [Create and manage users on an OT network sensor](manage-users-sensor.md)
- [Create and manage users on an on-premises management console](manage-users-on-premises-management-console.md)
