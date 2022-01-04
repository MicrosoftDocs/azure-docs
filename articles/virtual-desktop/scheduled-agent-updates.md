---
title: Azure Virtual Desktop Scheduled Agent Updates preview
description: How to use the Scheduled Agent Updates feature to choose a time and day for the agent components to be updated.
author: Sefriend
ms.topic: how-to
ms.date: 01/04/2022
ms.author: sefriend
manager: rkiran
---
# Scheduled Agent Updates (preview) for Azure Virtual Desktop host pools

> [!IMPORTANT]
> The Scheduled Agent Updates feature is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The Scheduled Agent Updates feature (preview) allows you to create up to 2 maintenance windows that will be used to ensure that the the Azure Virtual Desktop agent, side-by-side stack, and Geneva Monitoring agent don't get updated during peak business hours. You can also use Log Analytics to see when agent component updates are available and when updates are unsuccessful. 

This article describes how the Scheduled Agent Updates feature works and how to set it up.

>[!NOTE]
Azure Virtual Desktop (classic) doesn't support the Scheduled Agent Updates feature. 

>[!IMPORTANT]
>The preview version of this feature currently has the following limitations:
>
> - You can only use the Scheduled Agent Updates feature in the Azure public cloud.

## How the Scheduled Agent Updates feature works

When configuring Scheduled Agent Updates, consider the following:

- Scheduled Agent Updates is disabled by default. This means that by default, the agent can get updated any day at any time using the flighting mechanism.

- Scheduled Agent Updates is a host pool setting. The time zone setting you choose and the maintenance windows you set will be applied to all the session hosts in the host pool.

- You can only configure this feature for existing host pools. This feature isn't available when you create a new host pool.

- Scheduled Agent Updates refers to the update of the Azure Virtual Desktop agent, side-by-side stack, and Geneva Monitoring agent. If any one or more of these components needs to be updated, it will be updated according to the Scheduled Agent Update settings. Any reference to the agent components is referring to these 3 components.

- You must specify at least 1 maintenance window. You can optionally specify a second maintenance window. Having 2 maintenance windows provides additional opportunities for the agent components to be updated in the event that they fail to update at some point.

- The agent component update will fail if the session host virtual machine is shutdown or deallocated. If you enable Scheduled Agent Updates, it is imperative that all the session hosts in your host pool are turned on during the specified maintenance window.

- The broker will attempt to update the agent components during each specified maintenance window up to 4 times before the update is forcefully installed. This is to provide adequate time for installation retries in the event that the update fails, but also to prevent session hosts from having stale agent component versions.

- Maintenance windows are fixed to be 2 hours long to account for the potential of the agent, stack, and monitoring agent all needing to update at the same time. For example, if you set a maintenance window to be Saturday at 9pm, the agent, stack, and/or monitoring agent update will happen anytime between 9pm and 11pm.

- Critical updates are applied forcefully irrespective of the set maintenance window for security purposes.

- Scheduled Agent Updates does not apply to the initial installation of the agent components. When the agent is initially installed on a virtual machine, the agent will then install the side-by-side stack and the Geneva Monitoring agent, irrespective of the set maintenance windows. Further updates to any of these agent components will be installed during the set maintenance windows.

- Host pools that have the Scheduled Agent Updates feature enabled will receive the agent update after the agent has been fully flighted to production. For more information about how agent flighting works, see [Agent update process](agent-overview.md#agent-update-process).

- If you want to apply the same time zone and maintenance window settings to multiple host pools, run the [PowerShell cmdlet](#use-powershell) in a loop.

- The **Use session host local time** parameter by default is set to false, which means that you need to specify a single time zone for the agent component update maintenance windows to be applied in for all the session hosts in the host pool. This is useful for scenarios where all session hosts in a host pool are in the same time zone or all users assigned to a host pool are in the same time zone. If you set the **Use session host local time** to be true, the agent component update maintenance windows will be applied to the session hosts in the local time zone of each of the session hosts in the host pool. This is useful for scenarios where all session hosts in a host pool are in different time zones or all users assigned to a host pool are in different time zones. For example, consider a scenario where you have 1 host pool with session hosts in West US in Pacific Standard Time and session hosts in East US in Eastern Standard Time, and you've set the maintenance window to be Saturday at 9pm. Enabling **Use session host local time** will ensure that updates to the West US session hosts happen on Saturday at 9pm Pacific Standard Time and updates to the East US session hosts happen on Saturday at 9pm Eastern Standard Time. Disabling **Use session host local time** and setting the time zone to be Central Standard Time will ensure that updates to all session hosts in the host pool happen at 9pm Central Standard Time, regardless of the session hosts' local time zones.

- The local time zone for virtual machines created through the Azure portal is by default set to Coordinated Universal Time (UTC). If you want to change the virtual machine time zone, you must run the [Set-TimeZone PowerShell cmdlet](https://docs.microsoft.com/powershell/module/microsoft.powershell.management/set-timezone?view=powershell-7.1) on the virtual machine.

- To get a list of all the available time zones for a particular virtual machine, you can run the following [PowerShell cmdlet](https://docs.microsoft.com/powershell/module/microsoft.powershell.management/get-timezone?view=powershell-7.1) on the virtual machine:
    ```powershell
    Get-TimeZone -ListAvailable
    ```

## Configure the Scheduled Agent Updates feature using the Azure portal

To use the Azure portal to configure Scheduled Agent Updates:

1. Open your browser and go to [the Azure portal](https://portal.azure.com).

2. In the Azure portal, go to **Azure Virtual Desktop**.

3. Select **Host pools**, then go to the host pool where you want to enable the feature.

4. In the host pool, select **Scheduled Agent Updates**. Select the **Scheduled agent updates** checkbox to enable the feature.

5. Input your preferred time zone setting. If you select **Use local session host time zone** you cannot choose a timezone. If you deselect **Use local session host time zone**, you need to specify a time zone.

6. Select a day and corresponding time for the **Maintenance window**. You can optionally select a day and corresponding time for an additional maintenance window.

7. Select **Apply** to instantly apply the settings.

## Configure the Scheduled Agent Updates feature using PowerShell

To configure this feature with PowerShell, you need to make sure you have the name of the resource group and host pool you want to configure. You'll also need to install [the Azure PowerShell module (version 3.1.0 or later)](https://www.powershellgallery.com/packages/Az.DesktopVirtualization/3.1.0).

To configure Scheduled Agent Updates using PowerShell:

1. Open a PowerShell command window.

2. Run the following cmdlet to enable and configure Scheduled Agent Updates:

    ```powershell
    Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -AgentUpdateType "Scheduled" -AgentUpdateUseSessionHostLocalTime <Boolean> -AgentUpdateTimeZone <timeZoneName> -AgentUpdateMaintenanceWindows [{<hour>, <dayOfWeek>}, {<hour>, <dayOfWeek>}] 
    ```
    To configure Scheduled Agent Updates to have agent components updated either on Saturdays between 9pm and 11pm or Sundays between 9pm and 11pm in each session hosts' local time zone, run the following PowerShell cmdlet:

    ```powershell
    Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -AgentUpdateType "Scheduled" -AgentUpdateUseSessionHostLocalTime $true -AgentUpdateMaintenanceWindows [{21, Saturday}, {21, Sunday}]        
    ```

    To configure Scheduled Agent Updates to have agent components updated on Saturdays between 9am and 11am in Pacific Standard Time, run the following PowerShell cmdlet:
        
    ```powershell
    Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -AgentUpdateType "Scheduled" -AgentUpdateUseSessionHostLocalTime $false -AgentUpdateMaintenanceWindows [{9, Saturday}]
    ```

>[!NOTE]
The maintenance window hour must be specified according to the 24-hour clock. For example, specifying 21 as the hour here would be translated as 9pm.

3. Run the following cmdlet to disable Scheduled Agent Updates:

    ```powershell
    Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -AgentUpdateType "Default"
    ```

## Next steps

For more Scheduled Agent Updates and agent component related information check out the following resources:

- To set up diagnostics for this feature, see the [Scheduled Agent Updates Diagnostics guide](agent-updates-diagnostics.md).
- To find more information about the Azure Virtual Desktop agent, side-by-side stack, and Geneva Monitoring agent, see [Getting Started with the Azure Virtual Desktop Agent](agent-overview.md).
- To find information about the latest and previous agent versions, see the [Agent Updates Version Notes](whats-new.md#azure-virtual-desktop-agent-updates).
- If you're experiencing agent or connectivity-related issues, see the [Azure Virtual Desktop Agent issues troubleshooting guide](troubleshoot-agent.md).