---
title: Troubleshoot Monitor Windows Virtual Desktop preview - Azure
description: How to troubleshoot issues with Azure Monitor for Windows Virtual Desktop.
author: Heidilohr
ms.topic: troubleshooting
ms.date: 12/01/2020
ms.author: helohr
manager: lizross
---
# Troubleshoot Azure Monitor for Windows Virtual Desktop (preview)

>[!IMPORTANT]
>Azure Monitor for Windows Virtual Desktop is currently in public preview. This preview version is provided without a service level agreement, and we don't recommend using it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article presents known issues and solutions for common problems in Azure Monitor for Windows Virtual Desktop (preview).

## The configuration workbook isn't working properly

If the Azure Monitor configuration workbook isn't working, you can use these resources to set its parts up manually:

- To manually enable diagnostics or access the Log Analytics workspace, see [Send Windows Virtual Desktop diagnostics to Log Analytics](diagnostics-log-analytics.md).
- To install the Log Analytics extension on a host manually, see [Log Analytics virtual machine extension for Windows](../virtual-machines/extensions/oms-windows.md).
- To set up a new Log Analytics workspace, see [Create a Log Analytics workspace in the Azure portal](../azure-monitor/learn/quick-create-workspace.md).
- To add or remove performance counters, see [Configuring performance counters](../azure-monitor/platform/data-sources-performance-counters.md).
- To configure events for a Log Analytics workspace, see [Collect Windows event log data sources with Log Analytics agent](../azure-monitor/platform/data-sources-windows-events.md).

Alternatively, the problem could be caused by either a lack of resources or not having the required permissions.

If the subscription doesn't have any Windows Virtual Desktop resources, it won't show up in the *Subscription* parameter.

If you don't have read access to the correct subscriptions, they won't show up in the *Subscription* parameter and you won't see their data in the dashboard. To solve this issue, contact your subscription owner and ask for read access.

## My data isn't displaying properly

If your data isn't displaying properly, something may have happened during the Azure Monitor configuration process. First, make sure you've filled out all fields in the configuration workbook as described in [Use Azure Monitor for Windows Virtual Desktop to monitor your deployment](azure-monitor.md). You can change settings for both new and existing environments at any time. If you're missing any counters or events, the data associated with them won't appear in the Azure portal.

If you're not missing any information but your data still isn't displaying properly, there may be an issue in the query or the data sources. 

If you don't see any setup errors and still don't see the data you expect, you may want to wait for 15 minutes and refresh the feed. Azure Monitor has a 15 minute latency period for populating log data. To learn more, see [Log data ingestion time in Azure Monitor](../azure-monitor/platform/data-ingestion-time.md).

Finally, if you're not missing any information but your data still doesn't appear, there may be an issue in the query or the data sources. You may need to contact Support to resolve the problem, if that's the case.

## I want to customize Azure Monitor for Windows Virtual Desktop

Azure Monitor for Windows Virtual Desktop uses Azure Monitor Workbooks. Workbooks lets you save a copy of the Windows Virtual Desktop workbook template and make your own customizations.

Customized templates won't update when the product group updates the original template. This is by design in the workbooks tool, you will need to save a copy of the updated template and re-build your customizations to adopt updates. For more information, see [Troubleshooting workbook-based insights](../azure-monitor/insights/troubleshoot-workbooks.md) and the [Workbooks overview](../azure-monitor/platform/workbooks-overview.md).

## I can't interpret the data

Learn more about data terms at the [Azure Monitor for Window Virtual Desktop glossary](azure-monitor-glossary.md).

## The data I need isn't available

Can't find a data point to help diagnose an issue? Send us feedback!

- To learn how to leave feedback, see [Troubleshooting overview, feedback, and support for Windows Virtual Desktop](troubleshoot-set-up-overview.md).
- You can also leave feedback for Windows Virtual Desktop at the [Windows Virtual Desktop feedback hub](https://support.microsoft.com/help/4021566/windows-10-send-feedback-to-microsoft-with-feedback-hub-app) or [our UserVoice forum](https://windowsvirtualdesktop.uservoice.com/forums/921118-general).

## Known issues

These are the issues we're currently aware of and working to fix:

- You can currently only select one subscription, resource group, and host pool to monitor at a time. Because of this, when using the User Reports page to understand a user’s experience, you need to verify that you have the correct host pool that the user has been using or their data will not populate the visuals.

- It's not currently possible to save favorite settings in Azure Monitor unless you save a custom template of the workbook. This means that IT admins will have to enter their subscription name, resource group names, and host pool preferences every time they open Azure Monitor for Windows Virtual Desktop.

- There currently isn't a way to export data from Azure Monitor for Windows Virtual Desktop into Excel.

- All severity 1 Azure Monitor alerts for all products within the selected subscription will appear in the Overview page. This is by design, as alerts from other products in the subscription may impact Windows Virtual Desktop. Right now, the query is limited to severity 1 alerts, excluding high-priority severity 0 alerts from the Overview page.

- Some error messages are not phrased in a user-friendly way, and not all error messages are described in the documentation.

## Next steps

If you're unsure how to interpret the data or want to learn more about common terms, check out the [Azure Monitor for Windows Virtual Desktop glossary](azure-monitor-glossary.md). If you want to learn how to set up and use Azure Monitor for Windows Virtual Desktop, see [Use Azure Monitor for Windows Virtual Desktop to monitor your deployment](azure-monitor.md).