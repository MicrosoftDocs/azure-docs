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
Windows Virtual Desktop Monitor and Windows Virtual Desktop Insights are currently in public preview. This preview version is provided without a service level agreement, and we don't recommend using it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

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

- Read access to the resource group(s) where the environment’s resources are located (workspaces, host pools, and app groups)

- Read access to the resource group(s) where the environment’s session hosts are located

>[!NOTE]
> Read access only lets an admin view the data, not manage in the Windows Virtual Desktop portal.

## Open Windows Virtual Desktop Insights

You can open Windows Virtual Desktop Insights from several access points:

- You can visit
    [aka.ms/azmonwvdi](https://portal.azure.com/?feature.wvdinsights=true#blade/AppInsightsExtension/WorkbookViewerBlade/Type/wvd-insights/ComponentId/Azure%20Monitor/GalleryResourceType/Azure%20Monitor/ConfigurationId/community-Workbooks%2FWindows%20Virtual%20Desktop%2FWVD%20Insights).

- You can search and select *Windows Virtual Desktop* from the Azure Portal, then select Insights.

- You can search and select *Azure Monitor* from the Azure Portal. Select *Insights Hub* under *Insights*, and under *Other* select *Windows Virtual Desktop* to open the dashboard in the Insights page.

Once you have Windows Virtual Desktop Insights open, use the *Subscription*, *Resource Group*, *Host Pool*, and *Time Range* boxes, select the environment you would like to monitor.

>[!NOTE]
>If you can’t find the environment you want to monitor, see \*Troubleshooting doc\*

>[!NOTE]
>At this time we only support monitoring one subscription, resource group, and host pool at a time. Please see our \*Troubleshooting do\* for known feature requests and issues.

## Use the Configuration Workbook

If this is your first time opening Windows Virtual Desktop Insights, you will need to configure Azure Monitor for your Windows Virtual Desktop resources. In the workbook, select “Open the Configuration Workbook”. You should only need to use the configuration workbook when first setting up Azure Monitor for your environment, to check the configuration if visuals in the dashboard aren’t populating correctly, or when the product group publishes updates to the Insights page that require additional data points.

## Set up Log Analytics

Before enabling any of the following data, you will need at least one Log Analytics workspace to collect data from the environment(s) and supply it to the workbook. You may already have one created, in which case you can move to the next session. To set up a new Log Analytics workspace for the Azure subscription containing your Windows Virtual Desktop environment, see [Create a Log Analytics workspace in the Azure portal](https://docs.microsoft.com/en-us/azure/azure-monitor/learn/quick-create-workspace)*.*

>[!NOTE]
>Standard data storage charges for Log Analytics will apply. To start, we recommend you choose the pay-as-you-go model and adjust as you scale your deployment and take in more data. To learn more, see* [Azure Monitor Pricing](https://azure.microsoft.com/en-us/pricing/details/monitor/).

## Set up performance counters

You need to enable specific performance counters for collection at the corresponding sample interval in the Log Analytics workspace(s). The specified performance counters are the only counters needed for Windows Virtual Desktop Insights; all others can be disabled for cost savings.

1. If you have performance counters enabled already and you want to remove them for cost savings, the fastest way to do so is by removing all performance counters (or the select group you do not want) before using the configuration workbook to enable the set required for monitoring. To do so, see [Configuring performance counters](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/data-sources-performance-counters).

2. In Windows Virtual Desktop Insights ([aka.ms/azmonwvdi](https://portal.azure.com/?feature.wvdinsights=true#blade/AppInsightsExtension/WorkbookViewerBlade/Type/wvd-insights/ComponentId/Azure%20Monitor/GalleryResourceType/Azure%20Monitor/ConfigurationId/community-Workbooks%2FWindows%20Virtual%20Desktop%2FWVD%20Insights)), select the **Configuration Workbook** link at the bottom of the page.

3. Under **Log Analytics Configuration**, select the workspace set up for your subscription.

4. Under **Workspace Performance Counters**, you will see the list of counters required for monitoring. To the right of that list, under **Missing Counters**, you will see the required counters that are not enabled for your workspace.

5. Select **Configure Performance Counters**.

6. Select **Apply Config**.

7. After the deployment is complete, refresh the configuration workbook and continue to set up your environment.

Performance counters may be added with updates to these monitoring tools, requiring you to enable new perf counters to adopt updates. You can verify that you are collecting all of the required counters with the Configuration Workbook and the steps above.

Input delay performance counters are only compatible with Windows 10 RS5 and above and Windows Server 2019 and above.

To learn more about how to manually add performance counters that aren’t already enabled for collection, see [Configuring performance counters](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/data-sources-performance-counters).

## Set up Windows Events

You need to enable specific Windows Events for collection in the Log Analytics workspace(s). The specified events are the only ones needed for Windows Virtual Desktop Insights; all others can be disabled for cost savings.

1. If you have Windows Events enabled already and you want to remove them for cost savings, the fastest way to do so is by removing all of the events (or the select group you do not want) before using the configuration workbook to enable the set required for monitoring. To do so, see TBD

2. In Windows Virtual Desktop Insights ([aka.ms/azmonwvdi](https://portal.azure.com/?feature.wvdinsights=true#blade/AppInsightsExtension/WorkbookViewerBlade/Type/wvd-insights/ComponentId/Azure%20Monitor/GalleryResourceType/Azure%20Monitor/ConfigurationId/community-Workbooks%2FWindows%20Virtual%20Desktop%2FWVD%20Insights)), select the Configuration Workbook at the bottom of the page.

3. Under Windows Events Configuration, you will see the list of Windows Events required for monitoring. To the right of that list, under **Missing Events**, you will see the required event names and event types that are not enabled for your workspace. Remember these, or open this page in a separate tab to refer back to.

4. Select **Open Workspaces Configuration**.

5. Select **Data**.

6. Select **Windows Event Logs.**

7. Add the missing event names, selecting the required event type for each.

8. After the deployment is complete, refresh the configuration workbook and continue to set up your environment.

Windows events may be added with updates to these monitoring tools, requiring you to enable new events to adopt updates. You can verify that you are collecting all required events with the Configuration Workbook and the steps above.

To learn more about how to manually add Windows Events that aren’t already enabled for collection, see *TBD*

## Set up Azure Monitor for Virtual Machines

Virtual Machines in the environment(s) must be configured to send data to the Log Analytics workspace(s) configured with your workbook.

1. In Windows Virtual Desktop Insights ([aka.ms/azmonwvdi](https://portal.azure.com/?feature.wvdinsights=true#blade/AppInsightsExtension/WorkbookViewerBlade/Type/wvd-insights/ComponentId/Azure%20Monitor/GalleryResourceType/Azure%20Monitor/ConfigurationId/community-Workbooks%2FWindows%20Virtual%20Desktop%2FWVD%20Insights)), select the Configuration Workbook at the bottom of the page.

To learn how to configure Virtual Machines to send data to the Log Analytics workspace(s), see [Log Analytics virtual machine extension for Windows](https://docs.microsoft.com/en-us/azure/virtual-machines/extensions/oms-windows?toc=/azure/azure-monitor/toc.json).

## Set up Diagnostics

You must enable Azure Monitor diagnostic settings on all objects within the Windows Virtual Desktop environment that support this feature.

1. In Windows Virtual Desktop Insights ([aka.ms/azmonwvdi](https://portal.azure.com/?feature.wvdinsights=true#blade/AppInsightsExtension/WorkbookViewerBlade/Type/wvd-insights/ComponentId/Azure%20Monitor/GalleryResourceType/Azure%20Monitor/ConfigurationId/community-Workbooks%2FWindows%20Virtual%20Desktop%2FWVD%20Insights)), select the Configuration Workbook at the bottom of the page.

2.  Under Host Pool Diagnostic Settings, verify whether WVD diagnostics are enabled for the host pool. If they are not, you will see the error *No existing Diagnostic configuration was found for the selected host pool* and you will need to continue with the following steps to set them up.

3.  Click on the **Open Host Pool Diagnostic settings** button

4.  Click on **+Add diagnostic settings**

5.  Select the following tables on **Categories**

    - Checkpoint
    - Error
    - Management
    - Connection
    - HostRegistration

6.  Select **Send to Log Analytics** on **Destination Details**

7.  Select the subscription and the Log Analytics workspace you want to send the host pool data

8.  Enter a name for your settings configuration on the **Diagnostic setting name**

9.  Select **Save**

10. After the deployment is completed, close the page by click on the **X** button on the top right corner. You need click twice, one for the new setting you have just added and to close the host pool diagnostic settings blade.

11. Refresh the workbook by clicking on the refresh button on the top.

You can learn more about how to enable diagnostics on all objects in the Windows Virtual Desktop environment(s) or access the Log Analytics workspace at [Send Windows Virtual Desktop diagnostics to Log Analytics](https://docs.microsoft.com/en-us/azure/virtual-desktop/diagnostics-log-analytics).

## Optional: configure alerts

Windows Virtual Desktop Insights surfaces any severity 1 Azure Monitor alerts configured on events and thresholds within your selected subscription. Configure
alerts on Windows Virtual Desktop events to see them surfaced in the workbook.

To learn more about how to configure alerts, see [Respond to events with Azure Monitor Alerts](https://docs.microsoft.com/en-us/azure/azure-monitor/learn/tutorial-response).

## Next steps

Now that you’ve accessed the Windows Virtual Desktop Insights page and verified your Azure Monitor configuration with the *Check Configuration* workbook accessible through the Insights page, you are ready to monitor!