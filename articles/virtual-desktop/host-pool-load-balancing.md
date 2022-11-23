---
title: Azure Virtual Desktop host pool load-balancing - Azure
description: Learn about host pool load-balancing algorithms for a Azure Virtual Desktop environment.
author: Heidilohr
ms.topic: conceptual
ms.date: 09/19/2022
ms.author: helohr
manager: femila
---
# Host pool load-balancing algorithms

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/host-pool-load-balancing-2019.md).

Azure Virtual Desktop supports two load-balancing algorithms. Each algorithm determines which session host will host a user's session when they connect to a resource in a pooled host pool. The information in this article only applies to pooled host pools.

The following load-balancing algorithms are available in Azure Virtual Desktop:

- Breadth-first load balancing allows you to evenly distribute user sessions across the session hosts in a host pool.
- Depth-first load balancing allows you to saturate a session host with user sessions in a host pool. Once the first session host reaches its session limit threshold, the load balancer directs any new user connections to the next session host in the host pool until it reaches its limit, and so on.

Each host pool can only configure one type of load-balancing specific to it. However, both load-balancing algorithms share the following behaviors no matter which host pool they're in:

- If a user already has an active or disconnected session in the host pool and signs in again, the load balancer will successfully redirect them to the session host with their existing session. This behavior applies even if that session host's AllowNewConnections property is set to False (drain mode is enabled).
- If a user doesn't already have a session in the host pool, then the load balancer won't consider session hosts whose AllowNewConnections property is set to False during load balancing.
- If you lower the maximum session limit on a session host while it has active user sessions, the change won't affect the active user sessions.

## Breadth-first load-balancing algorithm

The breadth-first load-balancing algorithm allows you to distribute user sessions across session hosts to optimize for session performance. This algorithm is ideal for organizations that want to provide the best experience for users connecting to their pooled virtual desktop environment.

The breadth-first algorithm first queries session hosts that allow new connections. The algorithm then selects a session host randomly from half the set of session hosts with the least number of sessions. For example, if there are nine machines with 11, 12, 13, 14, 15, 16, 17, 18, and 19 sessions, a new session you create won't automatically go to the first machine. Instead, it can go to any of the first five machines with the lowest number of sessions (11, 12, 13, 14, 15).

## Depth-first load-balancing algorithm

The depth-first load-balancing algorithm allows you to saturate one session host at a time to optimize for scale down scenarios. This algorithm is ideal for cost-conscious organizations that want more granular control on the number of virtual machines they've allocated for a host pool.

The depth-first algorithm first queries session hosts that allow new connections and haven't gone over their maximum session limit. The algorithm then selects the session host with highest number of sessions. If there's a tie, the algorithm selects the first session host in the query.

>[!IMPORTANT]
>The depth-first load balancing algorithm distributes sessions to session hosts based on the maximum session host limit. This parameter is required when you use the depth-first load balancing algorithm. For the best possible user experience, make sure to change the maximum session host limit parameter to a number that best suits your environment.
