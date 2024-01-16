---
title: Skip or delay an auto-stop scheduled shutdown
titleSuffix: Microsoft Dev Box
description: Learn how to delay the scheduled shutdown of your dev box, or skip the shutdown entirely, to manage your work and resources more effectively.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 01/10/2024
ms.topic: how-to
---

# Skip or delay an auto-stop scheduled shutdown

A platform engineer or project admin can schedule a time for dev boxes in a pool to stop automatically, to ensure efficient resource use and provide cost management. 

You can delay the shutdown or skip it altogether. This flexibility allows you to manage your work and resources more effectively, ensuring that your projects remain uninterrupted when necessary.

## Change scheduled shutdown from the dev box

If your dev box is in a pool with a stop schedule, you receive a notification about 30 minutes before the scheduled shutdown giving you time to save your work or make necessary adjustments.

### Delay the shutdown

1. In the pop-up notification, select a time to delay the shutdown for, such as **Delay 1 Hour**.

   :::image type="content" source="media/how-to-skip-delay-stop/dev-box-toast-time.png" alt-text="Screenshot showing the shutdown notification and delay options in the dropdown list." lightbox="media/how-to-skip-delay-stop/dev-box-toast-time.png" :::

1. Select **Delay**.

   :::image type="content" source="media/how-to-skip-delay-stop/dev-box-toast-delay.png" alt-text="Screenshot showing the shutdown notification and the Delay button highlighted." lightbox="media/how-to-skip-delay-stop/dev-box-toast-delay.png" :::

### Skip the shutdown

You can also choose to skip the next scheduled shutdown altogether. In the pop-up notification, select **Skip**.

:::image type="content" source="media/how-to-skip-delay-stop/dev-box-toast-skip.png" alt-text="Screenshot showing the shutdown notification with the Skip button highlighted." lightbox="media/how-to-skip-delay-stop/dev-box-toast-skip.png":::

The dev box doesn't shut down until the next scheduled shutdown time.

## Change scheduled shutdown from the developer portal

In the developer portal, you can see the scheduled shutdown time on the dev box tile. You can delay or skip the shutdown from the more options (**...**) menu. 

:::image type="content" source="media/how-to-skip-delay-stop/dev-portal-stop-time.png" alt-text="Screenshot showing the dev box tile, with the shutdown time highlighted. In this example, the shutdown time is 6 30 p m." lightbox="media/how-to-skip-delay-stop/dev-portal-stop-time.png":::

### Delay the shutdown

1. Locate your dev box.

1. On the more options (**...**) menu, select **Delay scheduled shutdown**. 

   :::image type="content" source="media/how-to-skip-delay-stop/dev-portal-menu.png" alt-text="Screenshot showing the dev box tile and the more options menu with the Delay scheduled shutdown option highlighted." lightbox="media/how-to-skip-delay-stop/dev-portal-menu.png":::

1. In the **Delay shutdown until** dropdown list, select the time that you want to delay the shutdown until. You can delay the shutdown by up to 8 hours from the scheduled time.

   :::image type="content" source="media/how-to-skip-delay-stop/delay-options.png" alt-text="Screenshot showing how to delay the scheduled shutdown until 7 30 p m." lightbox="media/how-to-skip-delay-stop/delay-options.png":::

1. Select **Delay**.

### Skip the shutdown

1. Locate your dev box.

1. On the more options (**...**) menu, select **Delay scheduled shutdown**.

1. In the **Delay shutdown until** dropdown list, select the last available option, which specifies the time 8 hours after the scheduled shutdown time. In this example, the last option is **6:30 pm tomorrow (skip)**. 

   :::image type="content" source="media/how-to-skip-delay-stop/skip-shutdown.png" alt-text="Screenshot showing the final shutdown option that skips shutdown until the next scheduled time." lightbox="media/how-to-skip-delay-stop/skip-shutdown.png":::

1. Select **Delay**.

## Related content

- [Manage a dev box by using the developer portal](./how-to-create-dev-boxes-developer-portal.md)
- [Auto-stop your dev boxes on schedule](how-to-configure-stop-schedule.md)
