---
title: Windows Virtual Desktop Start VM Connect FAQ - Azure
description: Frequently asked questions and best practices for using the Start VM on Connect feature.
author: Heidilohr
ms.topic: conceptual
ms.date: 10/15/2020
ms.author: helohr
manager: lizross
---
# Start VM on Connect FAQ (preview)

This article covers frequently asked questions about the Start VM on Connect feature for Windows Virtual Desktop host pools.

## Are VMs automatically deallocated when a user stops using them?

No, additional policies need to be configured to log of users and leverage Azure automation scripts to deallocate VMs.

1.  Connect remotely to the VM where you want to set the policy:

2.  Open the ‘**Group Policy Editor**‘ and go to **Local Computer Policy** > **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Session Time Limits**.

3.  Locate **Set time limit for disconnected sessions**.

    - Change the value to ‘**Enabled**‘.

    - Once the setting is set to Enabled, set **End a disconnected session**. Recommendation is not to set the timeframe too low as it may lead to loss of work.

>[!NOTE]
>Setting the ‘End a disconnected session’ time value too low, may cause your work to be lost if your network connection drops. So do not set this to ‘1 minute’ or ‘5 minutes’.

Signing users out won't deallocate the VM. Learn how to [deallocate VMs](../automation/automation-solution-vm-management.md) using Azure Compute guidance.

## Can users turn off the VM from their clients?

Users can shut down the VM from within the session using the Windows start menu. This action will not deallocate the VM. Learn how to [deallocate VMs](../automation/automation-solution-vm-management.md) using Azure Compute guidance.
