---
title: Scale session hosts using Azure Automation and Azure Logic Apps for Azure Virtual Desktop - Azure
description: Learn about scaling Azure Virtual Desktop session hosts with Azure Automation and Azure Logic Apps.
author: Heidilohr
ms.topic: how-to
ms.date: 04/29/2022
ms.author: helohr
manager: femila
---
# Scale session hosts using Azure Automation and Azure Logic Apps for Azure Virtual Desktop

You can reduce your total Azure Virtual Desktop deployment cost by scaling your virtual machines (VMs). This means shutting down and deallocating session host VMs during off-peak usage hours, then turning them back on and reallocating them during peak hours.

In this article, you'll learn about the scaling tool built with the Azure Automation account and Azure Logic Apps that automatically scales session host VMs in your Azure Virtual Desktop environment. To learn how to use the scaling tool, see [Set up scaling of session hosts using Azure Automation and Azure Logic Apps](set-up-scaling-script.md).

## How the scaling tool works

The scaling tool provides a low-cost automation option for customers who want to optimize their session host VM costs.

You can use the scaling tool to:

- Schedule VMs to start and stop based on peak and off-peak business hours.
- Scale out VMs based on number of sessions per CPU core.
- Scale in VMs during off-peak hours, leaving the minimum number of session host VMs running.

The scaling tool uses a combination of an Azure Automation account, a PowerShell runbook, a webhook, and a Logic App to function. When the tool runs, the Logic App calls a webhook to start the runbook. The runbook then creates a job.

Peak and off-peak hours are defined as:

- **Peak**: The time when *maximum* user session concurrency is expected to be reached.
- **Off-peak**: The time when *minimum* user session concurrency is expected to be reached.

During peak usage time, the job checks the current number of sessions and the VM capacity of the current running session host for each host pool. It uses this information to calculate if the running session host VMs can support existing sessions based on the *SessionThresholdPerCPU* parameter defined for the **CreateOrUpdateAzLogicApp.ps1** file. If the session host VMs can't support existing sessions, the job starts extra session host VMs in the host pool.

>[!NOTE]
>*SessionThresholdPerCPU* doesn't restrict the number of sessions on the VM. This parameter only determines when new VMs need to be started to load-balance the connections. To restrict the number of sessions, you need to follow the instructions [Update-AzWvdHostPool](configure-host-pool-load-balancing.md#configure-breadth-first-load-balancing) to configure the *MaxSessionLimit* parameter accordingly.

During the off-peak usage time, the job determines how many session host VMs should be shut down based on the *MinimumNumberOfRDSH* parameter. If you set the *LimitSecondsToForceLogOffUser* parameter to a non-zero positive value, the job will set the session host VMs to drain mode to prevent new sessions from connecting to the hosts. The job will then notify any currently signed in users to save their work, wait the configured amount of time, and then force the users to sign out. Once all user sessions on the session host VM have been signed out, the job will shut down the VM. After the VM shuts down, the job will reset its session host drain mode.

>[!NOTE]
>If you manually set the session host VM to drain mode, the job won't manage the session host VM. If the session host VM is running and set to drain mode, it will be treated as unavailable, which will make the job start additional VMs to handle the load. We recommend you tag any Azure VMs before you manually set them to drain mode. You can name the tag with the *MaintenanceTagName* parameter when you create Azure Logic App Scheduler later. Tags will help you distinguish these VMs from the ones the scaling tool manages. Setting the maintenance tag also prevents the scaling tool from making changes to the VM until you remove the tag.

If you set the *LimitSecondsToForceLogOffUser* parameter to zero, the job allows the session configuration setting in specified group policies to handle signing off user sessions. To see these group policies, go to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Session Time Limits**. If there are any active sessions on a session host VM, the job will leave the session host VM running. If there aren't any active sessions, the job will shut down the session host VM.

At any time, the job also takes host pool's *MaxSessionLimit* into account to determine if the current number of sessions is more than 90% of the maximum capacity. If it is, the job will start extra session host VMs.

The job runs periodically based on a set recurrence interval. You can change this interval based on the size of your Azure Virtual Desktop environment, but remember that starting and shutting down VMs can take some time, so remember to account for the delay. We recommend setting the recurrence interval to every 15 minutes.

However, the tool also has the following limitations:

- This solution applies only to pooled multi-session session host VMs.
- This solution manages VMs in any region, but can only be used in the same subscription as your Azure Automation account and Azure Logic App.
- The maximum runtime of a job in the runbook is 3 hours. If starting or stopping the VMs in the host pool takes longer than that, the job will fail. For more information, see [Shared resources](../automation/automation-runbook-execution.md#fair-share).
- At least one VM or session host needs to be turned on for the scaling algorithm to work properly.
- The scaling tool doesn't support scaling based on CPU or memory.
- Scaling only works with existing hosts in the host pool. The scaling tool doesn't support scaling new session hosts.

>[!NOTE]
>The scaling tool controls the load balancing mode of the host pool it's currently scaling. The tool uses breadth-first load balancing mode for both peak and off-peak hours.

## Next steps

- Learn how to [set up scaling of session hosts using Azure Automation and Azure Logic Apps](set-up-scaling-script.md).
