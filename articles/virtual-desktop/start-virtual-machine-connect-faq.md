---
title: Azure Virtual Desktop Start VM Connect FAQ - Azure
description: Frequently asked questions and best practices for using the Start VM on Connect feature.
author: Heidilohr
ms.topic: conceptual
ms.date: 09/19/2022
ms.author: helohr
manager: femila
---
# Start VM on Connect FAQ

This article covers frequently asked questions about the Start Virtual Machine (VM) on Connect feature for Azure Virtual Desktop host pools.

## Are VMs automatically deallocated when a user stops using them?

No. You'll need to configure additional policies to sign users out of their sessions and run Azure automation scripts to deallocate VMs.

To configure the deallocation policy:

1. Connect remotely to the VM that you want to set the policy for.

2. Open the **Group Policy Editor**, then go to **Local Computer Policy** > **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Session Time Limits**.

3. Find the policy that says **Set time limit for disconnected sessions**, then change its value to **Enabled**.

4. After you've enabled the policy, select **End a disconnected session**.

>[!NOTE]
>Make sure to set the time limit for the "End a disconnected session" policy to a value greater than five minutes. A low time limit can cause users' sessions to end if their network loses connection for too long, resulting in lost work.

Signing users out won't deallocate their VMs. To learn how to deallocate VMs, see [Start or stop VMs during off hours](../automation/automation-solution-vm-management.md) for personal host pools and [Autoscale](autoscale-scaling-plan.md) for pooled host pools.

## Can users turn off the VM from their clients?

Yes. Users can shut down the VM by using the Start menu within their session, just like they would with a physical machine. However, shutting down the VM won't deallocate the VM. To learn how to deallocate VMs, see [Start or stop VMs during off hours](../automation/automation-solution-vm-management.md) for personal host pools and [Autoscale](autoscale-scaling-plan.md) for pooled host pools.

## How does load balancing affect Start VM on Connect?

For pooled host pools, Start VM on Connect will wait until all virtual machines hit their maximum session limit before turning on additional VMs.

For example, let's say your host pool has three VMs and has a maximum session limit of five users per machine. If you turn on two VMs, Start VM on Connect won't turn on the third machine until both VMs reach their maximum session limit of five users.

## Next steps

To learn how to configure Start VM on Connect, see [Start virtual machine on connect](start-virtual-machine-connect.md).

If you have more general questions about Azure Virtual Desktop, check out our general [FAQ](faq.yml).
