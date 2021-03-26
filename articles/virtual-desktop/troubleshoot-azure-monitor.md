---
title: Troubleshoot Monitor Windows Virtual Desktop preview - Azure
description: How to troubleshoot issues with Azure Monitor for Windows Virtual Desktop.
author: Heidilohr
ms.topic: troubleshooting
ms.date: 03/25/2020
ms.author: helohr
manager: lizross
---
# Troubleshoot Azure Monitor for Windows Virtual Desktop (preview)

>[!IMPORTANT]
>Azure Monitor for Windows Virtual Desktop is currently in public preview. This preview version is provided without a service level agreement, and we don't recommend using it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article presents known issues and solutions for common problems in Azure Monitor for Windows Virtual Desktop (preview).

## Issues with configuration and setup

If the configuration workbook isn't working properly to automate setup, you can use these resources to set up your environment manually:

- To manually enable diagnostics or access the Log Analytics workspace, see [Send Windows Virtual Desktop diagnostics to Log Analytics](diagnostics-log-analytics.md).
- To install the Log Analytics extension on a session host manually, see [Log Analytics virtual machine extension for Windows](../virtual-machines/extensions/oms-windows.md).
- To set up a new Log Analytics workspace, see [Create a Log Analytics workspace in the Azure portal](../azure-monitor/logs/quick-create-workspace.md).
- To add, remove, or edit performance counters, see [Configuring performance counters](../azure-monitor/agents/data-sources-performance-counters.md).
- To configure Windows Event Logs for a Log Analytics workspace, see [Collect Windows event log data sources with Log Analytics agent](../azure-monitor/agents/data-sources-windows-events.md).

## My data isn't displaying properly

If your data isn't displaying properly, check the following common solutions:

- First, make sure you've set up correctly with the configuration workbook as described in [Use Azure Monitor for Windows Virtual Desktop to monitor your deployment](azure-monitor.md). If you're missing any counters or events, the data associated with them won't appear in the Azure portal.
- Check your access permissions & contact the resource owners to request missing permissions; anyone monitoring Windows Virtual Desktop requires the following permissions:
    - Read-access to the Azure subscriptions that hold your Windows Virtual Desktop resources
    - Read-access to the subscription's resource groups that hold your Windows Virtual Desktop session hosts 
    - Read-access to whichever Log Analytics workspaces you're using
- You may need to open outgoing ports in your server's firewall to allow Azure Monitor and Log Analytics to send data to the portal. To learn how to do this, see the following articles:
      - [Azure Monitor Outgoing ports](../azure-monitor/app/ip-addresses.md)
      - [Log Analytics Firewall Requirements](../azure-monitor/agents/log-analytics-agent.md#firewall-requirements). 
- Not seeing data from recent activity? You may want to wait for 15 minutes and refresh the feed. Azure Monitor has a 15-minute latency period for populating log data. To learn more, see [Log data ingestion time in Azure Monitor](../azure-monitor/logs/data-ingestion-time.md).

If you're not missing any information but your data still isn't displaying properly, there may be an issue in the query or the data sources. Review [known issues and limitations](#known-issues-and-limitations). 

## I want to customize Azure Monitor for Windows Virtual Desktop

Azure Monitor for Windows Virtual Desktop uses Azure Monitor Workbooks. Workbooks lets you save a copy of the Windows Virtual Desktop workbook template and make your own customizations.

By design, custom Workbook templates will not automatically adopt updates from the products group. For more information, see [Troubleshooting workbook-based insights](../azure-monitor/insights/troubleshoot-workbooks.md) and the [Workbooks overview](../azure-monitor/visualize/workbooks-overview.md).

## I can't interpret the data

Learn more about data terms at the [Azure Monitor for Window Virtual Desktop glossary](azure-monitor-glossary.md).

## The data I need isn't available

If you want to monitor more Performance counters or Windows Event Logs, you can enable them to send diagnostics info to your Log Analytics workspace and monitor them in **Host Diagnostics: Host browser**. 

- To add performance counters, see [Configuring performance counters](../azure-monitor/agents/data-sources-performance-counters.md#configuring-performance-counters)
- To add Windows Events, see [Configuring Windows Event Logs](../azure-monitor/agents/data-sources-windows-events.md#configuring-windows-event-logs)

Can't find a data point to help diagnose an issue? Send us feedback!

- To learn how to leave feedback, see [Troubleshooting overview, feedback, and support for Windows Virtual Desktop](troubleshoot-set-up-overview.md).
- You can also leave feedback for Windows Virtual Desktop at the [Windows Virtual Desktop feedback hub](https://support.microsoft.com/help/4021566/windows-10-send-feedback-to-microsoft-with-feedback-hub-app)

## Known issues and limitations

The following are issues and limitations we're aware of and working to fix:

- You can only monitor one host pool at a time. 
- To save favorite settings, you have to save a custom template of the workbook. Custom templates won't automatically adopt updates from the product group.
- The configuration workbook will sometimes show "query failed" errors when loading your selections. Refresh the query, reenter your selection if needed, and the error should resolve itself. 
- Some error messages aren't phrased in a user-friendly way, and not all error messages are described in documentation.
- The total sessions performance counter can over-count sessions by a small number and your total sessions may appear to go above your Max Sessions limit.
- Available sessions count doesn't reflect scaling policies on the host pool. 	
- Do you see contradicting or unexpected connection times? While rare, a connection's completion event can go missing and can impact some visuals and metrics.
- Time to connect includes the time it takes users to enter their credentials; this correlates to the experience but in some cases can show false peaks. 
	

## Next steps

If you're unsure how to interpret the data or want to learn more about common terms, check out the [Azure Monitor for Windows Virtual Desktop glossary](azure-monitor-glossary.md). If you want to learn how to set up and use Azure Monitor for Windows Virtual Desktop, see [Use Azure Monitor for Windows Virtual Desktop to monitor your deployment](azure-monitor.md).
