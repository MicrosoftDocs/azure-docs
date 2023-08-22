---
title: Skip or delay an auto-stop scheduled shutdown
titleSuffix: Microsoft Dev Box
description: Learn how to delay the scheduled shutdown of your dev box, or skip the shutdown entirely.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 06/16/2023
ms.topic: how-to
---

# Skip or delay an auto-stop scheduled shutdown

A platform engineer or project admin can schedule a time for dev boxes in a pool to stop automatically, to ensure efficient resource use and provide cost management. 

You can delay the shutdown or skip it altogether. This flexibility allows you to manage your work and resources more effectively, ensuring that your projects remain uninterrupted when necessary.


## Skip scheduled shutdown from the dev box

If your dev box is in a pool with a stop schedule, you receive a notification about 30 minutes before the scheduled shutdown giving you time to save your work or make necessary adjustments.

### Delay the shutdown

1. In the pop-up notification, select a time to delay the shutdown for.

   :::image type="content" source="media/how-to-skip-delay-stop/dev-box-toast-time.png" alt-text="Screenshot showing the shutdown notification.":::

1. Select **Delay**

   :::image type="content" source="media/how-to-skip-delay-stop/dev-box-toast-delay.png" alt-text="Screenshot showing the shutdown notification with Delay highlighted.":::

### Skip the shutdown

To skip the shutdown, select **Skip** in the notification. The dev box doesn't shut down until the next scheduled shutdown time.

   :::image type="content" source="media/how-to-skip-delay-stop/dev-box-toast-skip.png" alt-text="Screenshot showing the shutdown notification with Skip highlighted.":::

## Skip scheduled shutdown from the developer portal

In the developer portal, you can see the scheduled shutdown time on the dev box tile, and delay or skip the shutdown from the more options menu.

Shutdown time is shown on dev box tile:

:::image type="content" source="media/how-to-skip-delay-stop/dev-portal-stop-time.png" alt-text="Screenshot showing the dev box tile, with the shutdown time highlighted. In this example, the shutdown time is 6.30 P M.":::

### Delay the shutdown
1. Locate your dev box.
1. On the more options menu, select **Delay scheduled shutdown**. 

   :::image type="content" source="media/how-to-skip-delay-stop/dev-portal-menu.png" alt-text="Screenshot showing the dev box tile, more options menu, with Delay scheduled shutdown highlighted.":::

1. You can delay the shutdown by up to 8 hours from the scheduled time. From **Delay shutdown until**, select the time you want to delay the shutdown until, and then select **Delay**.

   :::image type="content" source="media/how-to-skip-delay-stop/delay-options.png" alt-text="Screenshot showing the options available for delaying the scheduled shutdown.":::

### Skip the shutdown
1. Locate your dev box.
1. On the more options menu, select **Delay scheduled shutdown**. 
1. On the **Delay shutdown until** list, select the last available option, which specifies the time 8 hours after the scheduled shutdown time, and then select **Delay**. In this example, the last option is **6:30 pm tomorrow (skip)**. 

   :::image type="content" source="media/how-to-skip-delay-stop/skip-shutdown.png" alt-text="Screenshot showing the final shutdown option is to skip shutdown until the next scheduled time.":::

## Next steps

- [Manage a dev box using the developer portal](./how-to-create-dev-boxes-developer-portal.md)
- [Auto-stop your Dev Boxes on schedule](how-to-configure-stop-schedule.md)