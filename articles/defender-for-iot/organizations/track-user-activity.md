---
title: Audit Microsoft Defender for IoT user activity
description: Learn how to track and audit user activity across Microsoft Defender for IoT.
ms.date: 12/19/2023
ms.topic: how-to
---

# Audit user activity

After you've set up your user access for the [Azure portal](manage-users-portal.md), on your [OT network sensors](manage-users-sensor.md), you'll want to be able to track and audit user activity across all of Microsoft Defender for IoT.

## Audit Azure user activity

Use Microsoft Entra user auditing resources to audit Azure user activity across Defender for IoT. For more information, see:

- [Audit logs in Microsoft Entra ID](../../active-directory/reports-monitoring/concept-audit-logs.md)
- [Microsoft Entra audit activity reference](../../active-directory/reports-monitoring/reference-audit-activities.md)

## Audit user activity on an OT network sensor

Audit and track user activity on a sensor's **Event timeline**. The **Event timeline** displays events that occurred on the sensor, affected devices for each event, and the time and date that the event occurred.

> [!NOTE]
> This procedure is supported for the default, privileged *admin* users and any user with an **Admin** role.
>

**To use the sensor's Event Timeline**:

1. Sign into the sensor console as the default, privileged *admin* users or any user with an **Admin** role.

1. On the sensor, select **Event Timeline** from the left-hand menu. Make sure that the filter is set to show **User Operations**.

    For example:

    :::image type="content" source="media/manage-users-sensor/track-user-activity.png" alt-text="Screenshot of the Event Timeline on the sensor showing user activity.":::

1. Use additional filters or search using **CTRL+F** to find the information of interest to you.

    For more information on the event timeline, see [Track network and sensor activity with the event timeline](how-to-track-sensor-activity.md)

## Next steps

For more information, see:

- [Microsoft Defender for IoT user management](manage-users-overview.md)
- [Azure user roles and permissions for Defender for IoT](roles-azure.md)
- [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md)
- [Create and manage users on an OT network sensor](manage-users-sensor.md)
