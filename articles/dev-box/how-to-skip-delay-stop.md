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

Your platform engineer or project admin may have scheduled a time for dev boxes in a pool to stop automtatically, to ensure efficient resource use and cost management. 

To keep you informed, you'll receive a notification about 30 minutes before the scheduled shutdown, giving you ample time to save your work or make necessary adjustments.

In addition to receiving a notification 30 minutes before the scheduled shutdown, you also have the option to delay the shutdown or skip it altogether. This flexibility allows you to manage your work and resources more effectively, ensuring that your projects remain uninterrupted when necessary.

<!-- Question: Does scheduled shutdown only affect new dev boxes, or all in the pool regardless of when they were created? -->

## Skip from developer portal

Shutdown time is shown on dev box tile:
:::image type="content" source="media/how-to-skip-delay-stop/dev-portal-stop-time.png" alt-text="Screenshot showing the dev box tile, with the shutdown time highlighted. In this example the shutdown time is 6.30 P M.":::

To delay the shutdown:
:::image type="content" source="media/how-to-skip-delay-stop/dev-portal-menu.png" alt-text="Screenshot showing the dev box tile, more options menu, with Delay scheduled shutdown highlighted.":::

:::image type="content" source="media/how-to-skip-delay-stop/delay-options.png" alt-text="Screenshot showing the options available for delaying the scheduled shutdown.":::

To skip the shutdown:
:::image type="content" source="media/how-to-skip-delay-stop/skip-shutdown.png" alt-text="Screenshot showing the final shutdown option is to skip shutdown until the next scheduled time.":::

## Skip from dev box

## error

Say we have a dev box which has idle-detect turned on, and a schedule enabled (for this example, let's say the schedule is set for 7:00PM) 

The idle state has been detected and is set for 6:00PM (that action has been sent) 

Let's say I wanted to delay the schedule shutdown to 8:00PM in the portal, but the idle detection action has already been launched. We essentially have two actions (the idle detect action, and the schedule delay) 

What ends up happening is that the idle detect action ends successfully delaying, while the schedule delay fails. In this case, the dev box will drop the idle-detection schedule (so it will not hibernate at 6:00PM), but the dev box will shutdown at 7:00PM (instead of 8:00PM).

If there are 2 actions, the earlier of the two actions succeeds in delaying to the requested time, but the later action does not delay. The shutdown time will be the time of the second action, instead of the delay.  

<!-- Question: What's idle detect & how is it configured -->

## Next steps




idle detect = hibernation on idle 