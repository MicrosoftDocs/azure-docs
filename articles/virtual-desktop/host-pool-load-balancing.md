---
title: Host pool load balancing algorithms in Azure Virtual Desktop - Azure
description: Learn about the host pool load balancing algorithms available for pooled host pools in Azure Virtual Desktop.
author: dknappettmsft
ms.topic: conceptual
ms.date: 08/25/2023
ms.author: daknappe
---

# Host pool load balancing algorithms in Azure Virtual Desktop

Azure Virtual Desktop supports two load balancing algorithms for pooled host pools. Each algorithm determines which session host is used when a user starts a remote session. Load balancing doesn't apply to personal host pools because users always have a 1:1 mapping to a session host within the host pool.

The following load balancing algorithms are available for pooled host pools:

- **Breadth-first**, which aims to evenly distribute new user sessions across the session hosts in a host pool. You don't have to specify a maximum session limit for the number of sessions.

- **Depth-first**, which keeps starting new user sessions on one session host until the maximum session limit is reached. Once the session limit is reached, any new user connections are directed to the next session host in the host pool until it reaches its session limit, and so on.

You can only configure one of the load balancing at a time per pooled host pool, but you can change which one is used after a host pool is created. However, both load balancing algorithms share the following behaviors:

- If a user already has an active or disconnected session in the host pool and signs in again, the load balancer will successfully redirect them to the session host with their existing session. This behavior applies even if [drain mode](drain-mode.md) has been enabled for that session host.

- If a user doesn't already have a session on a session host in the host pool, the load balancer doesn't consider a session host where drain mode has been enabled.

- If you lower the maximum session limit on a session host while it has active user sessions, the change doesn't affect existing user sessions.

## Breadth-first load balancing algorithm

The breadth-first load balancing algorithm aims to distribute user sessions across session hosts to optimize for session performance. Breadth-first is ideal for organizations that want to provide the best experience for users connecting to their remote resources as session host resources, such as CPU, memory, and disk, are generally less contended.

The breadth-first algorithm first queries session hosts in a host pool that allow new connections. The algorithm then selects a session host randomly from half the set of available session hosts with the fewest sessions. For example, if there are nine session hosts with 11, 12, 13, 14, 15, 16, 17, 18, and 19 sessions, a new session doesn't automatically go to the session host with the fewest sessions. Instead, it can go to any of the first five session hosts with the fewest sessions at random. Due to the randomization, some sessions may not be evenly distributed across all session hosts.

## Depth-first load balancing algorithm

The depth-first load balancing algorithm aims to saturate one session host at a time. This algorithm is ideal for cost-conscious organizations that want more granular control on the number of session hosts available in a host pool, enabling you to more easily scale down when there are fewer users.

The depth-first algorithm first queries session hosts that allow new connections and haven't reached their maximum session limit. The algorithm then selects the session host with most sessions. If there's a tie, the algorithm selects the first session host from the query.

You must [set a maximum session limit](configure-host-pool-load-balancing.md#configure-depth-first-load-balancing) when using the depth-first algorithm. You can use Azure Virtual Desktop Insights to monitor [the number of sessions on each session host](insights-use-cases.md#session-host-utilization) and [session host performance](insights-use-cases.md#session-host-performance) to help determine the best maximum session limit for your environment.

> [!IMPORTANT]
> Once all session hosts have reached the maximum session limit, you need to increase the limit or [add more session hosts to the host pool](add-session-hosts-host-pool.md).

## Next steps

- Learn how to [configure load balancing for a host pool](configure-host-pool-load-balancing.md).

- Understand how [autoscale](autoscale-scenarios.md) can automatically scale the number of available session hosts in a host pool.
