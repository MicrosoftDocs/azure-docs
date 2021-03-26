---
title: Use Monitor Windows Virtual Desktop Monitor preview - Azure
description: How to use Azure Monitor for Windows Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 12/01/2020
ms.author: helohr
manager: lizross
---
# Use Azure Monitor for Windows Virtual Desktop to monitor your deployment (preview)

>[!IMPORTANT]
>Azure Monitor for Windows Virtual Desktop is currently in public preview. This preview version is provided without a service level agreement, and we don't recommend using it for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Monitor for Windows Virtual Desktop (preview) is a dashboard built on Azure Monitor Workbooks that helps IT professionals understand their Windows Virtual Desktop environments. This topic will walk you through how to set up Azure Monitor for Windows Virtual Desktop to monitor your Windows Virtual Desktop environments.

## Requirements

Before you start using Azure Monitor for Windows Virtual Desktop, you'll need to set up the following things:

- All Windows Virtual Desktop environments you monitor must be based on the latest release of Windows Virtual Desktop that’s compatible with Azure Resource Manager.

- At least one configured Log Analytics Workspace.

- Enable data collection for the following things in your Log Analytics workspace:
    - Any required performance counters
    - Any performance counters or events used in Azure Monitor for Windows Virtual Desktop
    - Data from the Diagnostics tool for all objects in the environment you'll be monitoring.
    - Virtual machines (VMs) in the environment you'll monitor.

Anyone monitoring the Azure Monitor for Windows Virtual Desktop for your environment will also need the following read-access permissions:

- Read access to the resource group where the environment's resources are located.

- Read access to the resource group(s) where the environment’s session hosts are located

>[!NOTE]
> Read access only lets admins view data. They'll need different permissions to manage resources in the Windows Virtual Desktop portal.

## Open Azure Monitor for Windows Virtual Desktop

You can open Azure Monitor for Windows Virtual Desktop with one of the following methods:

- Go to [aka.ms/azmonwvdi](https://portal.azure.com/#blade/Microsoft_Azure_WVD/WvdManagerMenuBlade/workbooks).

- Search for and select **Windows Virtual Desktop** from the Azure portal, then select **Insights**.

- Search for and select **Azure Monitor** from the Azure portal. Select **Insights Hub** under **Insights**, and under **Other** select **Windows Virtual Desktop** to open the dashboard in the Azure Monitor page.

Once you have Azure Monitor for Windows Virtual Desktop open, select one or more of the check boxes labeled **Subscription**, **Resource group**, **Host pool**, and **Time range** based on which environment you want to monitor.

>[!NOTE]
>Windows Virtual Desktop currently only supports monitoring one subscription, resource group, and host pool at a time. If you can't find the environment you want to monitor, see [our troubleshooting documentation](troubleshoot-azure-monitor.md) for known feature requests and issues.!

## Set up with the configuration workbook

If this is your first time opening Azure Monitor for Windows Virtual Desktop, you'll need to configure Azure Monitor for your Windows Virtual Desktop resources. To configure your resources:

1. Open your workbook in the Azure portal.
2. Select **Open the configuration workbook**.

The configuration workbook sets up your monitoring environment and lets you check the configuration after you've finished the setup process. It's important to check your configuration if items in the dashboard aren't displaying correctly, or when the product group publishes updates that require additional data points.

## Host pool diagnostic settings

You'll need to enable Azure Monitor diagnostic settings on all objects within the Windows Virtual Desktop environment that support this feature.

1. Open Azure Monitor for Windows Virtual Desktop at [aka.ms/azmonwvdi](https://portal.azure.com/#blade/Microsoft_Azure_WVD/WvdManagerMenuBlade/workbooks), then select **Configuration Workbook**.

2. Select an environment to monitor under **Subscription**, **Resource Group**, and **Host Pool**.

3. Under **Host Pool Diagnostic Settings**, check to see whether Windows Virtual Desktop diagnostics are enabled for the host pool. If they aren't, an error message will appear that says "No existing Diagnostic configuration was found for the selected host pool." 
   
   The following tables should be enabled:

    - Checkpoint
    - Error
    - Management
    - Connection
    - HostRegistration

    >[!NOTE]
    > If you don't see the error message, you don't need to do step 4.

4. Select **Configure host pool**.

5. Select **Deploy**.

6. Refresh the workbook.

You can learn more about how to enable diagnostics on all objects in the Windows Virtual Desktop environment or access the Log Analytics workspace at [Send Windows Virtual Desktop diagnostics to Log Analytics](diagnostics-log-analytics.md).

## Configure Log Analytics

To start using Azure Monitor for Windows Virtual Desktop, you'll also need at least one Log Analytics workspace to collect data from the environment you plan to monitor and supply it to the workbook. If you already have one set up, skip ahead to [Set up performance counters](#set-up-performance-counters). To set up a new Log Analytics workspace for the Azure subscription containing your Windows Virtual Desktop environment, see [Create a Log Analytics workspace in the Azure portal](../azure-monitor/logs/quick-create-workspace.md).

>[!NOTE]
>Standard data storage charges for Log Analytics will apply. To start, we recommend you choose the pay-as-you-go model and adjust as you scale your deployment and take in more data. To learn more, see [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

### Set up performance counters

You need to enable specific performance counters for collection at the corresponding sample interval in the Log Analytics workspace. These performance counters are the only counters you'll need to monitor Windows Virtual Desktop. You can disable all others to save costs.

If you already have performance counters enabled and want to remove them, follow the instructions in [Configuring performance counters](../azure-monitor/agents/data-sources-performance-counters.md) to reconfigure your performance counters. While the article describes how to add counters, you can also remove them in the same location.

If you haven't already set up performance counters, here's how to configure them for Azure Monitor for Windows Virtual Desktop:

1. Go to [aka.ms/azmonwvdi](https://portal.azure.com/#blade/Microsoft_Azure_WVD/WvdManagerMenuBlade/workbooks), then select the **Configuration Workbook** bottom of the window.

2. Under **Log Analytics Configuration**, select the workspace you've set up for your subscription.

3. In **Workspace performance counters**, you'll see the list of counters required for monitoring. On the right side of that list, check the items in the **Missing counters** list to enable the counters you'll need to start monitoring your workspace.

4. Select **Configure Performance Counters**.

5. Select **Apply Config**.

6. Refresh the configuration workbook and continue setting up your environment.

You can also add new performance counters after the initial configuration whenever the service updates and requires new monitoring tools. You can verify that all the required counters are enabled by selecting them in the **Missing counters** list.

>[!NOTE]
>Input delay performance counters are only compatible with Windows 10 RS5 and later or Windows Server 2019 and later.

To learn more about how to manually add performance counters that aren’t already enabled for collection, see [Configuring performance counters](../azure-monitor/agents/data-sources-performance-counters.md).

### Set up Windows Events

Next, you'll need to enable specific Windows Events for collection in the Log Analytics workspace. The events described in this section are the only ones Azure Monitor for Windows Virtual Desktop needs. You can disable all others to save costs.

To set up Windows Events:

1. If you have Windows Events enabled already and want to remove them, remove the events you don't want before using the configuration workbook to enable the set required for monitoring.

2. Go to Azure Monitor for Windows Virtual Desktop at [aka.ms/azmonwvdi](https://portal.azure.com/#blade/Microsoft_Azure_WVD/WvdManagerMenuBlade/workbooks), then select **Configuration workbook** at the bottom of the window.

3. In **Windows Events configuration**, there's a list of Windows Events required for monitoring. On the right side of that list is the **Missing events** list, where you'll find the required event names and event types that aren't currently enabled for your workspace. Record each of these names for later.

4. Select **Open Workspaces Configuration**.

5. Select **Data**.

6. Select **Windows Event Logs**.

7. Add the missing event names from step 3 and the required event type for each.

8. Refresh the configuration workbook and continue setting up your environment.

You can add new Windows events after the initial configuration if monitoring tool updates require enabling new events. To make sure you've got all required events enabled, go back to the **Missing events** list and enable any missing events you see there.

## Install the Log Analytics agent on all hosts

Finally, you'll need to install the Log Analytics agent on all hosts in the host pool to send data from the hosts to the selected workspace.

To install the Log Analytics agent:

1. Go to Azure Monitor for Windows Virtual Desktop at [aka.ms/azmonwvdi](https://portal.azure.com/#blade/Microsoft_Azure_WVD/WvdManagerMenuBlade/workbooks), then select **Configuration workbook** at the bottom of the window.

2. If Log Analytics isn't configured for all the hosts in the host pool, you'll see an error at the bottom of the Log Analytics configuration section with the message "Some hosts in the host pool are not sending data to the selected Log Analytics workspace." Select **Add hosts to workspace** to add the selected hosts. If you don't see the error message, stop here.

3. Refresh the Configuration Workbook.

>[!NOTE]
>The host machine needs to be running to install the Log Analytics extension. If automatic deployment fails on a host, you can always install the extension on a host manually. To learn how to install the extension manually, see [Log Analytics virtual machine extension for Windows](../virtual-machines/extensions/oms-windows.md).

## Optional: configure alerts

You can configure Azure Monitor for Windows Virtual Desktop to notify you if any severe Azure Monitor alerts happen within your selected subscription. To do this, follow the instructions in [Respond to events with Azure Monitor Alerts](../azure-monitor/alerts/tutorial-response.md).

## Diagnostic and usage data

Microsoft automatically collects usage and performance data through your use of the Azure Monitor service. Microsoft uses this data to improve the quality, security, and integrity of the service.

To provide accurate and efficient troubleshooting capabilities, the collected data includes the portal session ID, Azure Active Directory user ID, and the name of the portal tab where the event occurred. Microsoft doesn't collect names, addresses, or other contact information.

For more information about data collection and usage, see the [Microsoft Online Services Privacy Statement](https://privacy.microsoft.com/privacystatement).

>[!NOTE]
>To learn about viewing or deleting your personal data collected by the service, see [Azure Data Subject Requests for the GDPR](/microsoft-365/compliance/gdpr-dsr-azure). For more information about GDPR, see [the GDPR section of the Service Trust portal](https://servicetrust.microsoft.com/ViewPage/GDPRGetStarted).

## Next steps

Now that you’ve configured your Windows Virtual Desktop Azure portal, here are some resources that might help you:

- Check out our [glossary](azure-monitor-glossary.md) to learn more about terms and concepts related to Azure Monitor for Windows Virtual Desktop.
- If you encounter a problem, check out our [troubleshooting guide](troubleshoot-azure-monitor.md) for help.