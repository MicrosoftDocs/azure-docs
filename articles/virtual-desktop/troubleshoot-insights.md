---
title: Troubleshoot Monitor Azure Virtual Desktop - Azure
description: How to troubleshoot issues with Azure Virtual Desktop Insights.
author: Heidilohr
ms.topic: troubleshooting
ms.date: 09/12/2023
ms.author: helohr
manager: femila
---
# Troubleshoot Azure Virtual Desktop Insights

This article presents known issues and solutions for common problems in Azure Virtual Desktop Insights.

>[!IMPORTANT]
>[The Log Analytics Agent is currently being deprecated](https://azure.microsoft.com/updates/were-retiring-the-log-analytics-agent-in-azure-monitor-on-31-august-2024/). If you use the Log Analytics Agent for Azure Virtual Desktop support, you'll eventually need to migrate to the [Azure Monitor Agent](../azure-monitor/agents/agents-overview.md) by August 31, 2024.

# [Azure Monitor Agent](#tab/monitor)

## Issues with configuration and setup

If the configuration workbook isn't working properly to automate setup, you can use these resources to set up your environment manually:

- To manually enable diagnostics or access the Log Analytics workspace, see [Send Azure Virtual Desktop diagnostics to Log Analytics](diagnostics-log-analytics.md).
- To install the Azure Monitor Agent extension on a session host manually, see [Azure Monitor Agent virtual machine extension for Windows](../azure-monitor/agents/azure-monitor-agent-manage.md#install).
- To set up a new Log Analytics workspace, see [Create a Log Analytics workspace in the Azure portal](../azure-monitor/logs/quick-create-workspace.md).
- To validate the Data Collection Rules in use, see [View data collection rules](../azure-monitor/essentials/data-collection-rule-overview.md#view-data-collection-rules).

## My data isn't displaying properly

If your data isn't displaying properly, check the following common solutions:

- First, make sure you've set up correctly with the configuration workbook as described in [Use Azure Virtual Desktop Insights to monitor your deployment](insights.md). If you're missing any counters or events, the data associated with them won't appear in the Azure portal.
- Check your access permissions & contact the resource owners to request missing permissions; anyone monitoring Azure Virtual Desktop requires the following permissions:
    - Read-access to the Azure resource groups that hold your Azure Virtual Desktop resources
    - Read-access to the subscription's resource groups that hold your Azure Virtual Desktop session hosts 
    - Read-access to whichever Log Analytics workspaces you're using
- You may need to open outgoing ports in your server's firewall to allow Azure Monitor to send data to the portal. To learn how to do this, see [Firewall requirements](../azure-monitor/agents/azure-monitor-agent-data-collection-endpoint.md#firewall-requirements).
- If you're not seeing data from recent activity, you may need to wait for 15 minutes and refresh the feed. Azure Monitor has a 15-minute latency period for populating log data. To learn more, see [Log data ingestion time in Azure Monitor](../azure-monitor/logs/data-ingestion-time.md).

If you're not missing any information but your data still isn't displaying properly, there may be an issue in the query or the data sources. For more information, see [known issues and limitations](#known-issues-and-limitations). 

# [Log Analytics agent](#tab/analytics)

## Issues with configuration and setup

If the configuration workbook isn't working properly to automate setup, you can use these resources to set up your environment manually:

- To manually enable diagnostics or access the Log Analytics workspace, see [Send Azure Virtual Desktop diagnostics to Log Analytics](diagnostics-log-analytics.md).
- To install the Log Analytics extension on a session host manually, see [Log Analytics virtual machine extension for Windows](../virtual-machines/extensions/oms-windows.md).
- To set up a new Log Analytics workspace, see [Create a Log Analytics workspace in the Azure portal](../azure-monitor/logs/quick-create-workspace.md).
- To add, remove, or edit performance counters, see [Configuring performance counters](../azure-monitor/agents/data-sources-performance-counters.md).
- To configure Windows Event Logs for a Log Analytics workspace, see [Collect Windows event log data sources with Log Analytics agent](../azure-monitor/agents/data-sources-windows-events.md).

## My data isn't displaying properly

If your data isn't displaying properly, check the following common solutions:

- First, make sure you've set up correctly with the configuration workbook as described in [Use Azure Virtual Desktop Insights to monitor your deployment](insights.md). If you're missing any counters or events, the data associated with them won't appear in the Azure portal.
- Check your access permissions and contact the resource owners to request missing permissions. Anyone monitoring Azure Virtual Desktop requires the following permissions:
    - Read-access to the Azure resource groups that hold your Azure Virtual Desktop resources
    - Read-access to the subscription's resource groups that hold your Azure Virtual Desktop session hosts 
    - Read-access to whichever Log Analytics workspaces you're using
- You may need to open outgoing ports in your server's firewall to allow Azure Monitor and Log Analytics to send data to the portal. To learn how to do this, see the following articles:
      - [Azure Monitor Outgoing ports](../azure-monitor/app/ip-addresses.md)
      - [Log Analytics Firewall Requirements](../azure-monitor/agents/log-analytics-agent.md#firewall-requirements). 
- Not seeing data from recent activity? You may want to wait for 15 minutes and refresh the feed. Azure Monitor has a 15-minute latency period for populating log data. To learn more, see [Log data ingestion time in Azure Monitor](../azure-monitor/logs/data-ingestion-time.md).

If you're not missing any information but your data still isn't displaying properly, there may be an issue in the query or the data sources. For more information, see [known issues and limitations](#known-issues-and-limitations). 

---

## I want to customize Azure Virtual Desktop Insights

Azure Virtual Desktop Insights uses Azure Monitor Workbooks. Workbooks lets you save a copy of the Azure Virtual Desktop workbook template and make your own customizations.

By design, custom Workbook templates will not automatically adopt updates from the products group. For more information, see [Troubleshooting workbook-based insights](../azure-monitor/insights/troubleshoot-workbooks.md) and the [Workbooks overview](../azure-monitor/visualize/workbooks-overview.md).

## I can't interpret the data

Learn more about data terms at the [Azure Virtual Desktop Insights glossary](insights-glossary.md).

# [Azure Monitor Agent](#tab/monitor)

## The data I need isn't available

If this article doesn't have the data point you need to resolve an issue, you can send us feedback at the following places:

- To learn how to leave feedback, see [Troubleshooting overview, feedback, and support for Azure Virtual Desktop](troubleshoot-set-up-overview.md).
- You can also leave feedback for Azure Virtual Desktop at the [Azure Virtual Desktop feedback hub](https://support.microsoft.com/help/4021566/windows-10-send-feedback-to-microsoft-with-feedback-hub-app).

# [Log Analytics agent](#tab/analytics)

## The data I need isn't available

If you want to monitor more Performance counters or Windows Event Logs, you can enable them to send diagnostics info to your Log Analytics workspace and monitor them in **Host Diagnostics: Host browser**. 

- To add performance counters, see [Configuring performance counters](../azure-monitor/agents/data-sources-performance-counters.md#configure-performance-counters)
- To add Windows Events, see [Configuring Windows Event Logs](../azure-monitor/agents/data-sources-windows-events.md#configure-windows-event-logs)

Can't find a data point to help diagnose an issue? Send us feedback!

- To learn how to leave feedback, see [Troubleshooting overview, feedback, and support for Azure Virtual Desktop](troubleshoot-set-up-overview.md).
- You can also leave feedback for Azure Virtual Desktop at the [Azure Virtual Desktop feedback hub](https://support.microsoft.com/help/4021566/windows-10-send-feedback-to-microsoft-with-feedback-hub-app).

---

## Known issues and limitations

The following are issues and limitations we're aware of and working to fix:

- To save favorite settings, you have to save a custom template of the workbook. Custom templates won't automatically adopt updates from the product group.
- The configuration workbook will sometimes show *query failed* errors when loading your selections. Refresh the query, reenter your selection if needed, and the error should resolve itself. 
- Some error messages aren't phrased in a user-friendly way, and not all error messages are described in documentation.
- The total sessions performance counter can over-count sessions by a small number and your total sessions may appear to go above your Max Sessions limit.
- Available sessions count doesn't reflect scaling policies on the host pool. 	
- Do you see contradicting or unexpected connection times? While rare, a connection's completion event can go missing and can impact some visuals and metrics.
- Time to connect includes the time it takes users to enter their credentials; this correlates to the experience but in some cases can show false peaks.

## Next steps

- To get started, see [Use Azure Virtual Desktop Insights to monitor your deployment](insights.md).
- To estimate, measure, and manage your data storage costs, see [Estimate Azure Monitor costs](insights-costs.md).
- Check out our [glossary](insights-glossary.md) to learn more about terms and concepts related to Azure Virtual Desktop Insights.
