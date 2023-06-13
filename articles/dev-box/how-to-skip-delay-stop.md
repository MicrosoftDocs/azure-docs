---
title: Delay or skip an auto-stop scheduled stop
titleSuffix: Microsoft Dev Box
description: Learn how to delay the scheduled shutdown of your dev box, or skip the shutdown entirely.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 06/08/2023
ms.topic: how-to
---

# Delay or skip an auto-stop scheduled shutdown

A platform engineer or project admin can scheduled a time for dev boxes in a pool to stop automatically, to ensure efficient resource use and cost management. 

If your dev box is in a pool with a stop schedule, receive a notification about 30 minutes before the scheduled shutdown, giving you time to save your work or make necessary adjustments.

You also have the option to delay the shutdown or skip it altogether. This flexibility allows you to manage your work and resources more effectively, ensuring that your projects remain uninterrupted when necessary.

## Skip scheduled shutdown from the developer portal

In the developer portal, you can see the scheduled shutdown time on the dev box tile, and delay or skip the shutdown from the more options menu.

Shutdown time is shown on dev box tile:
:::image type="content" source="media/how-to-skip-delay-stop/dev-portal-stop-time.png" alt-text="Screenshot showing the dev box tile, with the shutdown time highlighted. In this example the shutdown time is 6.30 P M.":::

### To delay the shutdown:
1. Locate your dev box.
1. On the more options menu, select **Delay scheduled shutdown**. 
:::image type="content" source="media/how-to-skip-delay-stop/dev-portal-menu.png" alt-text="Screenshot showing the dev box tile, more options menu, with Delay scheduled shutdown highlighted.":::

1. You can delay the shutdown by up to 8 hours from the scheduled time. From **Delay shutdown until**, select the time you want to delay the shutdown until, and then select **Delay**.
:::image type="content" source="media/how-to-skip-delay-stop/delay-options.png" alt-text="Screenshot showing the options available for delaying the scheduled shutdown.":::

### To skip the shutdown:
1. Locate your dev box.
1. On the more options menu, select **Delay scheduled shutdown**. 
1. On the **Delay shutdown until** list, select the last available option, which specifies the time 8 hours after the scheduled shutdown time, and then select **Delay**. In this example, the last option is **6:30 pm tomorrow (skip)**. 
:::image type="content" source="media/how-to-skip-delay-stop/skip-shutdown.png" alt-text="Screenshot showing the final shutdown option is to skip shutdown until the next scheduled time.":::

## Skip from dev box

<!-- Need info -->
## Conflicts between hibernate on idle and scheduled shutdown actions

Configuring a dev box pool with a hibernate on idle policy and a scheduled shutdown can lead to conflicts.

Consider a dev box in a pool which has idle-detect enabled, and a scheduled shutdown at 7:00pm. In this case, there are two actions that can affect the dev box; hibernate on idle, and scheduled shutdown. The action initiated earlier succeeds in delaying to the requested time, and the later action does not succeed in a delay. 

For example a Dev Box detects a dev box in an idle state and sends an action directing the dev box hibernate at a specific time, 6:00pm.

In the meantime, the a dev box user delays the scheduled shutdown from 7:00pm until 8:00pm. 

The expected behavior might be that the dev box still hibernates at 6:00pm, because that action was sent to the dev box.

In this scenario, the idle detect action successfully delays, while the schedule delay fails. The dev box will drop the idle-detection schedule (so it will not hibernate at 6:00PM), but shutdown at 7:00PM (instead of 8:00PM).

<!-- Varsha, I'm not clear on which action delays and which doesn't. Let's talk it through again. the final paragraph doesn't make sense. --> 

<!-- Question: What's idle detect & how is it configured -->

## Next steps

- [Manage a dev box using the developer portal](./how-to-create-dev-boxes-developer-portal.md)
- [Auto-stop your Dev Boxes on schedule](how-to-configure-stop-schedule.md)