---
title: Skip Or Delay Auto-Stop Scheduled Shutdown
titleSuffix: Microsoft Dev Box
description: Learn how to delay the scheduled automatic shutdown of your dev box, or skip the shutdown entirely, to manage your work and resources more effectively.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 09/23/2025
ms.topic: how-to

#Customer intent: As a developer, I want to skip or delay a scheduled shutdown of my dev box so that my projects keep running when needed.
---

# Skip or delay an autostop scheduled shutdown

A platform engineer or project admin can schedule a time for dev boxes in a pool to stop automatically, helping ensure efficient resource use and cost management. If you use a dev box in a pool with an autostop schedule, you can manage the scheduled shutdown of your dev box. You can delay the shutdown or skip it altogether. This flexibility lets you manage your work and resources more effectively, so your projects remain uninterrupted when necessary.

Dev boxes that support hibernation hibernate on schedule instead of shutting down. Otherwise, they shut down.

## Change scheduled shutdown from the dev box

If your dev box is in a pool with an autostop schedule, and the dev box is running, you receive a popup notification about 30 minutes before the scheduled shutdown. The notification gives you time to save your work or make necessary adjustments.

> [!NOTE]
> If you don't see the notification, check your browser or application settings and allow popups for the dev box.

### Delay the shutdown

Follow these steps to delay the shutdown of a dev box that's currently running:

1. In the popup for the running dev box, select a time to delay the shutdown, such as **Delay 1 Hour**:

   :::image type="content" source="media/how-to-skip-delay-stop/dev-box-toast-time.png" alt-text="Screenshot showing the shutdown notification and delay options in the dropdown list.":::

1. Select **Delay**:

   :::image type="content" source="media/how-to-skip-delay-stop/dev-box-toast-delay.png" alt-text="Screenshot showing the shutdown notification and the Delay button highlighted.":::

### Skip the shutdown

You can also choose to skip the next scheduled shutdown altogether. In the popup for the running dev box, select **Skip**:

:::image type="content" source="media/how-to-skip-delay-stop/dev-box-toast-skip.png" alt-text="Screenshot showing the shutdown notification with the Skip button highlighted.":::

The dev box continues to run until the next scheduled shutdown time.

## Change scheduled shutdown from the developer portal

In the developer portal, you see the scheduled shutdown time on the dev box tile. To **Delay** or **Skip** the shutdown, select **More options** (**...**) and the desired action:

:::image type="content" source="media/how-to-skip-delay-stop/dev-portal-stop-time.png" alt-text="Screenshot showing the dev box tile, with the shutdown time highlighted. In this example, the shutdown time is 11 45 pm.":::

### Delay the shutdown

Follow these steps to delay the shutdown of a running dev box:

1. In the developer portal, locate your running dev box.

1. Select **More options** (**...**) > **Delay scheduled shutdown**:

   :::image type="content" source="media/how-to-skip-delay-stop/dev-portal-menu.png" alt-text="Screenshot showing the dev box tile and the more options menu with the Delay scheduled shutdown option highlighted.":::

1. In the **Delay shutdown until** list, use the up/down arrows to select the amount of time you want to delay the shutdown. You can delay the shutdown by up to 8 hours from the scheduled time.

   :::image type="content" source="media/how-to-skip-delay-stop/delay-options.png" alt-text="Screenshot showing how to delay the scheduled shutdown until 12 45 am tomorrow.":::

1. Select **Delay**.

### Skip the shutdown

Follow these steps to skip the shutdown of a running dev box:

1. In the developer portal, locate your running dev box.

1. Select **More options** (**...**) > **Delay scheduled shutdown**:

1. In the **Delay shutdown until** list, use the up/down arrows to select the last available option, which specifies the time 8 hours after the scheduled shutdown time. In this example, the last option is **11:45 pm tomorrow (skip)**: 

   :::image type="content" source="media/how-to-skip-delay-stop/skip-shutdown.png" alt-text="Screenshot showing the final shutdown option that skips shutdown until the next scheduled time.":::

   The popup indicates that shutdown will be skipped until the next scheduled time tomorrow.

1. Select **Delay**.

## Related content

- [Manage a dev box by using the developer portal](./how-to-create-dev-boxes-developer-portal.md)
- [Autostop your dev boxes on schedule](how-to-configure-stop-schedule.md)
