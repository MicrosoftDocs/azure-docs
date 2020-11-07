---
title: Use Insight in Windows Virtual Desktop Monitor preview - Azure
description: How to use Windows Virtual Desktop Insight in Windows Virtual Desktop Monitor.
author: Heidilohr
ms.topic: how-to
ms.date: 12/01/2020
ms.author: helohr
manager: lizross
---
# Use Windows Virtual Desktop Insight to monitor your deployment (preview)

>[!IMPORTANT]
Windows Virtual Desktop Insight is currently in public preview. This preview version is provided without a service level agreement, and we don't recommend using it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Windows Virtual Desktop Insights (preview) is a dashboard for Azure Monitor Workbooks that helps IT professionals understand their Windows Virtual Desktop environments. This topic will walk you through how to set up Windows Virtual Desktop Insights to monitor your Windows Virtual Desktop environments.

## Requirements

Before you start using Windows Virtual Desktop Insights, you'll need to set up the following things:

- All Windows Virtual Desktop environments you monitor must be based on the latest release of Windows Virtual Desktop that’s compatible with Azure Resource Manager.

- At least one configured Log Analytics Workspace.

- Enable data collection for the following things in your Log Analytics workspace:
    - Any required performance counters
    - Data from the Diagnostics tool for all objects in the environment you'll be monitoring.
    - Virtual machines (VMs) in the environment you'll monitor.

Anyone monitoring the Windows Virtual Desktop Insights for your environment will also
need the following read-access permissions:

- Read access to the resource group where the environment's resources are located.

- Read access to the resource group(s) where the environment’s session hosts are located

>[!NOTE]
> Read access only lets admins view data. They'll need different permissions to manage resources in the Windows Virtual Desktop portal.

## Open Windows Virtual Desktop Insights

You can open Windows Virtual Desktop Insights with one of the following methods:

- Go to [aka.ms/azmonwvdi](https://portal.azure.com/?feature.wvdinsights=true#blade/AppInsightsExtension/WorkbookViewerBlade/Type/wvd-insights/ComponentId/Azure%20Monitor/GalleryResourceType/Azure%20Monitor/ConfigurationId/community-Workbooks%2FWindows%20Virtual%20Desktop%2FWVD%20Insights).

- Search for and select **Windows Virtual Desktop** from the Azure Portal, then select **Insights**.

- Search for and select **Azure Monitor** from the Azure Portal. Select **Insights Hub** under **Insights**, and under **Other** select **Windows Virtual Desktop** to open the dashboard in the Insights page.

Once you have Windows Virtual Desktop Insights open, select one or more of the checkboxers labeled **Subscription**, **Resource group**, **Host pool**, and **Time range** based on which environment you want to monitor.

>[!NOTE]
>Windows Virtual Desktop currently only supports monitoring one subscription, resource group, and host pool at a time. If you can't find the environment you want to monitor, see our troubleshooting documentation for known feature requests and issues.

<!---Link to troubleshooting doc, when available-->

## Use the configuration workbook

If this is your first time opening Windows Virtual Desktop Insights, you'll need to configure Azure Monitor for your Windows Virtual Desktop resources. To configure your resources:

1. Open your workbook in the Azure portal.
2. Select **Open the configuration workbook**.

You'll only need to use the configuration workbook when you first set up Azure Monitor for your environment. This workbook will let you check the configuration if items in the dashboard aren't displaying correctly, or when the product group publishes updates to the Insights page that require additional data points.

## Set up Log Analytics

To start using Insights, you'll also need at least one Log Analytics workspace to collect data from the environment you plan to monitor and supply it to the workbook. If you already have one set up, skip ahead to [Set up performance counters](#set-up-performance-counters). To set up a new Log Analytics workspace for the Azure subscription containing your Windows Virtual Desktop environment, see [Create a Log Analytics workspace in the Azure portal](../azure-monitor/learn/quick-create-workspace.md).

>[!NOTE]
>Standard data storage charges for Log Analytics will apply. To start, we recommend you choose the pay-as-you-go model and adjust as you scale your deployment and take in more data. To learn more, see [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

### Set up performance counters

You need to enable specific performance counters for collection at the corresponding sample interval in the Log Analytics workspace. The specified performance counters are the only counters needed for Windows Virtual Desktop Insights. You can disabled all others to save costs.

If you already have performance counters enabled want to remove them, follow the instructions in [Configuring performance counters](../azure-monitor/platform/data-sources-performance-counters.md) to reconfigure your performance counters.

<!---This article doesn't mention how to remove counters. Should we link something else?--->

If you haven't already set up performance counters, here's how to configure them for Windows Virtual Desktop Insights:

1. Go to [aka.ms/azmonwvdi](https://portal.azure.com/?feature.wvdinsights=true#blade/AppInsightsExtension/WorkbookViewerBlade/Type/wvd-insights/ComponentId/Azure%20Monitor/GalleryResourceType/Azure%20Monitor/ConfigurationId/community-Workbooks%2FWindows%20Virtual%20Desktop%2FWVD%20Insights)), then select the **Configuration Workbook** bottom of the window.

2. Under **Log Analytics Configuration**, select the workspace you've set up for your subscription.

3. In **Workspace performance counters**, you'll see the list of counters required for monitoring. On the right side of that list, check the items in the **Missing counters** list to enable the counters you'll need to start monitoring your workspace.

4. Select **Configure Performance Counters**.

5. Select **Apply Config**.

6. Refresh the configuration workbook and continue setting up your environment.

You can also add new performance counters after the initial configuration whenever the service updates and requires new monitoring tools. You can verify that all the required counters are enabled by selectingg them in the **Missing counters** list.

>[!NOTE]
>Input delay performance counters are only compatible with Windows 10 RS5 and later or Windows Server 2019 and later.

To learn more about how to manually add performance counters that aren’t already enabled for collection, see [Configuring performance counters](../azure-monitor/platform/data-sources-performance-counters.md).

## Set up Windows Events

Next, you'll need to enable specific Windows Events for collection in the Log Analytics workspace. The events described in this section are the only ones Windows Virtual Desktop Insights needs. You can disable all others to save costs.

To set up Windows Events:

1. If you have Windows Events enabled already and want to remove them, remove the events you don't want before using the configuration workbook to enable the set required for monitoring.

2. Go to Windows Virtual Desktop Insights at ([aka.ms/azmonwvdi](https://portal.azure.com/?feature.wvdinsights=true#blade/AppInsightsExtension/WorkbookViewerBlade/Type/wvd-insights/ComponentId/Azure%20Monitor/GalleryResourceType/Azure%20Monitor/ConfigurationId/community-Workbooks%2FWindows%20Virtual%20Desktop%2FWVD%20Insights)), then select **Configuration workbook** at the bottom of the window.

3. In **Windows Events configuration**, there's a list of Windows Events required for monitoring. On the right side of that list is the **Missing events** list, where you'll find the required event names and event types that aren't currently enabled for your workspace. Record each of these names for later.

4. Select **Open Workspaces Configuration**.

5. Select **Data**.

6. Select **Windows Event Logs**.

7. Add the missing event names from step 3 and the required event type for each.

8. Refresh the configuration workbook and continue setting up your environment.

You can add new Windows events after the initial configuration if monitoring tool updates require enabling new events. To make sure you've got all required events enabled, go back to the **Missing events** list and enable any missing events you see there.

## Set up Azure Monitor for virtual machines

After that, you'll need to configure your VMs to send data to the Log Analytics workspace configured with your workbook.

To configure VMs:

1. Go to ([aka.ms/azmonwvdi](https://portal.azure.com/?feature.wvdinsights=true#blade/AppInsightsExtension/WorkbookViewerBlade/Type/wvd-insights/ComponentId/Azure%20Monitor/GalleryResourceType/Azure%20Monitor/ConfigurationId/community-Workbooks%2FWindows%20Virtual%20Desktop%2FWVD%20Insights)) to open Insights, then select **Configuration Workbook**.
2. Follow the instructions in [Log Analytics virtual machine extension for Windows](../virtual-machines/extensions/oms-windows.md).

## Set up diagnostics

Finally, you'll need to enable Azure Monitor diagnostic settings on all objects within the Windows Virtual Desktop environment that support this feature.

1. Open Windows Virtual Desktop Insights at ([aka.ms/azmonwvdi](https://portal.azure.com/?feature.wvdinsights=true#blade/AppInsightsExtension/WorkbookViewerBlade/Type/wvd-insights/ComponentId/Azure%20Monitor/GalleryResourceType/Azure%20Monitor/ConfigurationId/community-Workbooks%2FWindows%20Virtual%20Desktop%2FWVD%20Insights)), then select **Configuration Workbook**.

2. Under **Host Pool Diagnostic Settings**, check to see whether Windows Virtual Desktop diagnostics are enabled for the host pool. If they aren't, an error will appear that says "No existing Diagnostic configuration was found for the selected host pool." When that happens, go to step 3. If you don't see the error, you don't need to do anything else.

3.  Select **Open Host Pool Diagnostic settings**.

4.  Select **+Add diagnostic settings**.

5.  In **Categories**, select the following tables:

    - Checkpoint
    - Error
    - Management
    - Connection
    - HostRegistration

6.  Under **Destination details**, select **Send to Log Analytics**.

7.  Select the subscription and the Log Analytics workspace you want to send the host pool data to.

8.  In **Diagnostic setting name**, enter a name for your settings configuration.

9.  Select **Save**.

10. Close the settings page and the host pool diagnostic settings tab.

11. Refresh the workbook.

You can learn more about how to enable diagnostics on all objects in the Windows Virtual Desktop environment(s) or access the Log Analytics workspace at [Send Windows Virtual Desktop diagnostics to Log Analytics](https://docs.microsoft.com/en-us/azure/virtual-desktop/diagnostics-log-analytics).

## Optional: configure alerts

You can configure Windows Virtual Desktop Insights to notify you if any severe Azure Monitor alerts happen within your selected subscription. To do this, follow the instructions in [Respond to events with Azure Monitor Alerts](../azure-monitor/learn/tutorial-response.md).

## Next steps

Now that you’ve configured your Windows Virtual Desktop Azure portal, you're ready to get started!

<!---Links to new articles will go here--->