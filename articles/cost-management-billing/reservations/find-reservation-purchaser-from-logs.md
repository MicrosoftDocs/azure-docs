---
title: Find a reservation purchaser from Azure Monitor logs
description: This article helps find a reservation purchaser with information from Azure Monitor logs.
author: bandersmsft
ms.reviewer: yashar
ms.service: cost-management-billing
ms.subservice: reservations
ms.topic: troubleshooting
ms.date: 03/13/2021
ms.author: banders
---

# Find a reservation purchaser from Azure logs

This article helps find a reservation purchaser with information from your directory logs. The directory logs from Azure Monitor shows the email IDs of users that made reservation purchases.

## Find the purchaser

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Monitor** > **Activity Log** > **Activity**.  
    :::image type="content" source="./media/find-reservation-purchaser-from-logs/activity-log-activity.png" alt-text="Screenshot showing navigation to Activity log - Activity." lightbox="./media/find-reservation-purchaser-from-logs/activity-log-activity.png" :::
1. Select **Directory Activity**. If you see a message stating *You need permission to view directory-level logs*, select the [link](../../role-based-access-control/elevate-access-global-admin.md) to learn how to get permissions.  
    :::image type="content" source="./media/find-reservation-purchaser-from-logs/directory-activity-no-permission.png" alt-text="Screenshot showing Directory Activity without permission to view the log." lightbox="./media/find-reservation-purchaser-from-logs/directory-activity-no-permission.png" :::
1. Once you have permission, filter **Tenant Resource Provider** with **Microsoft.Capacity**. You should see all reservation-related events for the selected time span. If needed, change the time span.  
    :::image type="content" source="./media/find-reservation-purchaser-from-logs/user-that-purchased-reservation.png" alt-text="Screenshot showing the user that purchased the reservation." lightbox="./media/find-reservation-purchaser-from-logs/user-that-purchased-reservation.png" :::
    If necessary, you might need to **Edit columns** to select **Event initiated by**.
    The user who made the reservation purchase is shown under **Event initiated by**.

## Next steps

- If needed, billing administrators can [take ownership of a reservation](view-reservations.md#how-billing-administrators-can-view-or-manage-reservations).
