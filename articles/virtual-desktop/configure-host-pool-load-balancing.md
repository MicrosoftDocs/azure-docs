---
title: Configure host pool load balancing in Azure Virtual Desktop
description: How to configure the load balancing method for pooled host pools in Azure Virtual Desktop.
ms.custom:
ms.topic: how-to
author: sipastak
ms.author: sipastak 
ms.date: 06/11/2024
---

# Configure host pool load balancing in Azure Virtual Desktop

Azure Virtual Desktop supports two load balancing algorithms for pooled host pools. Each algorithm determines which session host is used when a user starts a remote session. Load balancing doesn't apply to personal host pools because users always have a 1:1 mapping to a session host within the host pool.

The following load balancing algorithms are available for pooled host pools:

- **Breadth-first**, which aims to evenly distribute new user sessions across the session hosts in a host pool. You don't have to specify a maximum session limit for the number of sessions.

- **Depth-first**, which keeps starting new user sessions on one session host until the maximum session limit is reached. Once the session limit is reached, any new user connections are directed to the next session host in the host pool until it reaches its session limit, and so on.

You can only configure one of the load balancing algorithms at a time per pooled host pool, but you can change which one is used at any time. Both load balancing algorithms share the following behaviors:

- If a user already has an active or disconnected session in the host pool and signs in again, the load balancer will successfully redirect them to the session host with their existing session. This behavior applies even if [drain mode](drain-mode.md) has been enabled for that session host.

- If a user doesn't already have a session on a session host in the host pool, the load balancer doesn't consider a session host where drain mode has been enabled.

- If you lower the maximum session limit on a session host while it has active user sessions, the change doesn't affect existing user sessions.

## Breadth-first load balancing algorithm

The breadth-first load balancing algorithm aims to distribute user sessions across session hosts to optimize for session performance. Breadth-first is ideal for organizations that want to provide the best experience for users connecting to their remote resources as session host resources, such as CPU, memory, and disk, are generally less contended.

The breadth-first algorithm first queries session hosts in a host pool that allow new connections. The algorithm then selects a session host randomly from half the set of available session hosts with the fewest sessions. For example, if there are nine session hosts with 11, 12, 13, 14, 15, 16, 17, 18, and 19 sessions, a new session doesn't automatically go to the session host with the fewest sessions. Instead, it can go to any of the first five session hosts with the fewest sessions at random. Due to the randomization, some sessions may not be evenly distributed across all session hosts.

## Depth-first load balancing algorithm

The depth-first load balancing algorithm aims to saturate one session host at a time. This algorithm is ideal for cost-conscious organizations that want more granular control on the number of session hosts available in a host pool, enabling you to more easily scale down the number of session hosts powered on when there are fewer users.

The depth-first algorithm first queries session hosts that allow new connections and haven't reached their maximum session limit. The algorithm then selects the session host with most sessions. If there's a tie, the algorithm selects the first session host from the query.

You must [set a maximum session limit](configure-host-pool-load-balancing.md#configure-load-balancing) when using the depth-first algorithm. You can use Azure Virtual Desktop Insights to [monitor the number of sessions on each session host](insights-use-cases.md#session-host-utilization) and review [session host performance](insights-use-cases.md#session-host-performance) to help determine the best maximum session limit for your environment.

> [!IMPORTANT]
> Once all session hosts have reached the maximum session limit, you need to increase the limit or [add more session hosts to the host pool](add-session-hosts-host-pool.md).

## Prerequisites

To configure load balancing for a pooled host pool, you need: 

- An existing pooled host pool.

- An Azure account assigned the [Desktop Virtualization Host Pool Contributor](rbac.md#desktop-virtualization-host-pool-contributor) role.

- If you want to use Azure PowerShell locally, see [Use Azure CLI and Azure PowerShell with Azure Virtual Desktop](cli-powershell.md) to make sure you have the [Az.DesktopVirtualization](/powershell/module/az.desktopvirtualization) PowerShell module installed. Alternatively, use the [Azure Cloud Shell](../cloud-shell/overview.md).


## Configure load balancing

### [Azure portal](#tab/portal) 

Here's how to configure load balancing with the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, enter *Azure Virtual Desktop* and select the matching service entry

1. Select **Host pools**, then select the name of the host pool you want to configure.

1. Select **Properties**.

1. For **Load balancing algorithm**, select which type you want to use for this host pool from the drop-down menu, then for **Max session limit**, enter a value.

1. Select **Save** to apply the new load balancing settings.

### [Azure PowerShell](#tab/powershell)

Here's how to configure load balancing with Azure PowerShell:

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Configure a host pool to perform breadth-first or depth-first load balancing using the Update-AzWvdHostPool cmdlet. Here are some examples:

   - To set breadth-first without adjusting the maximum session limit, run the following command:

   ```powershell
   $parameters = @{
       Name = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
       LoadBalancerType = 'BreadthFirst'
   }
   
   Update-AzWvdHostPool @parameters 
   ```

   - To set depth-first and adjust the maximum session limit to 10, run the following command:

   ```powershell
   $parameters = @{
       Name = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
       LoadBalancerType = 'DepthFirst'
       MaxSessionLimit = '10'
   }
   
   Update-AzWvdHostPool @parameters 
   ```

3. To make sure the setting has updated, run this command:

   ```powershell
   $parameters = @{
       Name = '<HostPoolName>'
       ResourceGroupName = '<ResourceGroupName>'
   }
   
   Get-AzWvdHostPool @parameters | Format-Table Name, LoadBalancerType, MaxSessionLimit
   ```

   The output should be similar to the following output:

   ```output
   Name        LoadBalancerType MaxSessionLimit
   ----------- ---------------- ---------------
   contosohp01 DepthFirst                    10
   ```

### [Azure CLI](#tab/cli)

Here's how to configure load balancing with Azure CLI:

[!INCLUDE [include-cloud-shell-local-cli](includes/include-cloud-shell-local-cli.md)]

2. Configure a host pool to perform breadth-first or depth-first load balancing. Here are some examples:

   - To set breadth-first without adjusting the maximum session limit, run the following command:

   ```azurecli
   az desktopvirtualization hostpool update \
       --resource-group <ResourceGroupName> \
       --name <HostPoolName> \
       --load-balancer-type BreadthFirst
   ```

   - To set depth-first and adjust the maximum session limit to 10, run the following command:

   ```azurecli
   az desktopvirtualization hostpool update \
       --resource-group <ResourceGroupName> \
       --name <HostPoolName> \
       --load-balancer-type DepthFirst \
       --max-session-limit 10
   ```

3. To make sure the setting has updated, run this command:

   ```azurecli
   az desktopvirtualization hostpool show \
       --resource-group <ResourceGroupName> \
       --name <HostPoolName> \
       --query "{name:name,loadBalancerType:loadBalancerType,maxSessionLimit:maxSessionLimit}" \
       --output table
   ```

   The output should be similar to the following output:

   ```output
   Name         LoadBalancerType    MaxSessionLimit
   -----------  ------------------  -----------------
   contosohp01  DepthFirst          10
   ```

---

> [!NOTE]
> The depth-first load balancing algorithm distributes sessions to session hosts up to the maximum session limit. If you use breadth-first when first creating a host pool, the default value for the maximum session limit is set to `999999`, which is also the highest possible number you can set this parameter to. For the best possible user experience when using depth-first load balancing, make sure to change the maximum session limit parameter to a number that best suits your requirements.

## Related content

- Understand how [autoscale](autoscale-scenarios.md) can automatically scale the number of available session hosts in a host pool.
