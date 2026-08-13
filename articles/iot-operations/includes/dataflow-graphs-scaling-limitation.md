---
author: dominicbetts
ms.author: dobett
ms.date: 08/07/2026
ms.topic: include
ms.service: azure-iot-operations
---

> [!IMPORTANT]
> Window and throttle transforms are *stateful*. Each instance maintains its own state and instances don't share that state with each other. When the data flow profile [instance count](../connect-to-cloud/howto-configure-dataflow-profile.md#scaling) is greater than one, [shared subscriptions](../connect-to-cloud/howto-configure-dataflow-source.md#shared-subscriptions) distribute messages across instances, so each instance sees only a subset of the messages. A [window](../connect-to-cloud/howto-dataflow-graphs-window.md) transform then computes aggregations such as averages, sums, and counts over a partial dataset, and a [throttle](../connect-to-cloud/howto-dataflow-graphs-throttle.md) transform enforces the configured rate limit independently in each instance instead of across the whole pipeline.
>
> Set the data flow profile instance count to **1** for any data flow graph that uses a window or throttle transform. Stateless data flow graphs that use only map, filter, branch, and concatenate transforms can safely use higher instance counts to increase throughput.
