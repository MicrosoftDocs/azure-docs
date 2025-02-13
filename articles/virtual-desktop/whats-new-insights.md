---
title: What's new in Azure Virtual Desktop Insights?
description: New features and product updates in Azure Virtual Desktop Insights.
author: sipastak
ms.topic: release-notes
ms.date: 01/30/2025
ms.author: sipastak
ms.custom: references_regions
---
# What's new in Azure Virtual Desktop Insights?

This article describes the changes we make to each new version of Azure Virtual Desktop Insights.

If you're not sure which version of Azure Virtual Desktop Insights you're currently using, you can find it in the bottom-right corner of your **Insights** page or configuration workbook. To access your workbook, go to [https://aka.ms/azmonwvdi](https://aka.ms/azmonwvdi).

## Latest available version

The following table shows the latest available version of Azure Virtual Desktop Insights.

| Release | Latest version | Setup instructions |
|---------|----------------|----------|
| Public | 4.3.1 | [Use Azure Virtual Desktop Insights to monitor your deployment](insights.md) |

## How to read version numbers

There are three numbers in each version of Azure Virtual Desktop Insights. Here's what each number means:

- The first number is the major version, and is usually used for major releases.

- The second number is the minor version. Minor versions are for backwards-compatible changes such as new features and deprecation notices.

- The third number is the patch version, which is used for small changes that fix incorrect behavior or bugs.

For example, a release with a version number of 1.2.31 is on the first major release, the second minor release, and patch number 31.

When one of the numbers is increased, all numbers after it must change, too. One release has one version number. However, not all version numbers track releases. Patch numbers can be somewhat arbitrary, for example.

## Version 4.3.1

*Published: January 29, 2025*

In this update, we made the following changes:

- Added Multipath as UdpType to the **Connection Reliability** tab. 

## Version 4.3.0

*Published: November 22, 2024*

In this update, we made the following changes:

- On the **Overview** page, changed the name from Azure Stack HCI to Azure Local.
 
## Version 4.2.0

*Published: November 21, 2024*

In this update, we made the following changes:

- Added RTT view and reordered the **User** page.
- Updated the Host Pool Overview view to allow switching between pooled host pool and personal host pool.
- Added Assigned User column and removed Available Sessions column to the personal host pool view. 
 
## Version 4.1.0

*Published: October 29, 2024*

In this update, we made the following change:

- Prominently highlighted hosts that are unhealthy in Azure Virtual Desktop Insights.
 
## Version 4.0.5

*Published: October 7, 2024*

In this update, we made the following change:

- Changed language to “The Log Analytics Agent has been deprecated. To ensure continued support for AVD Insights, please upgrade to the Azure Monitor Agent and use the updated AVD Insights experience now."
 
## Version 4.0.4

*Published: September 30, 2024*

In this update, we made the following change:

- Updated the banner text under the **Connection Performance** page and moved them to the top of each section.
 
## Version 4.0.3

*Published: August 22, 2024*

In this update, we made the following change:

- Switched the RTT queries that were still using the RemoteFX perf counter to use Azure Virtual Desktop network logs.
 
## Version 4.0.2

*Published: August 13, 2024*

In this update, we made the following changes:

- Masked IP address to first 2 octets after the pivot value has been set.
- Updated some typos.
 
## Version 4.0.1

*Published: August 13, 2024*

In this update, we made the following changes:

- Renamed Windows Virtual Desktop Insights to Azure Virtual Desktop Insights.
- Redirected the Azure Virtual Desktop Insights to the Workbooks/Windows Virtual Desktop/AtScale/WVD Insights workbook.

## Version 4.0.0

*Published: August 12, 2024*

In this update, we made the following changes:

- Updated the banner on the Insights (Legacy) page from information level to error level. 
- Revised the date format in the Insights (Legacy) page banner from *August 31st, 2024* to *August 31, 2024*. 
- Eliminated the **Go to AVD Insights** legacy link from host pool view in the Workbook. 
- Redirected the **Open Configuration Workbook** button and **Configuration Workbook** link in the legacy scoped workbook from the old configuration (community-Workbooks/Windows Virtual Desktop/Check Configuration) to the new configuration (community-Workbooks/Windows Virtual Desktop/CheckAMAConfiguration). 
- Deleted the old configuration. 
- Redirected the **Open Docs** link to [Enable Insights to monitor Azure Virtual Desktop](insights.md). 
  
## Version 3.5.0

*Published: July 1, 2024*

In this update, we made the following change:

- Connection reliability is generally available.

## Version 3.4.0

*Published: May 13, 2024*

In this update, we made the following changes:

- Added Azure Stack HCI core count.
- Updated the reliability of the calculation for users per core.

## Version 3.3.1

*Published: April 29, 2024*

In this update, we made the following change:

- Introduced previews for connection reliability and autoscale reporting.

## Version 3.2.2

*Published: February 12, 2024*

In this update, we made the following changes:

- Updated logic for Data Collection Rule (DCR) selection in the Configuration workbook.
- Removed unused performance counters from DCR for data savings.
- Removed Terminal Services counters that the Azure Virtual Desktop Insights workbook no longer uses.

## Version 3.2.0

*Published: October 9, 2023*

In this update, we've made the following changes:

- Updated support for session hosts with multiple Data Collection Rules.
- Added additional error impact reporting.

## Version 3.1.0

*Published: October 2, 2023*

In this update, we've made the following change:

- Updated configuration workbook to allow users to use existing resource groups for Azure Monitor Agent configuration.

## Version 3.0.0

*Published: September 18, 2023*

In this update, we've made the following changes:

- Azure Monitor Agent based Insights now generally available.
- Introduced Insights (Legacy) for support of Log Analytics Agent until end of life.

## Version 2.3.4

*Published: September 5, 2023*

In this update, we've made the following changes:

- Fixed configuration workbook experience for Azure Monitor Agent deployment preview.
- Updated connection time reporting for connected time only.

## Version 2.3.0

*Published: June 5, 2023*

In this update, we've made the following change:

- Added HCI support and updated diagnostic threshold descriptions.

## Version 2.2.0

*Published: May 22, 2023*

In this update, we've made the following change:

- Added reporting support for the shutdown state.

## Version 2.1.0

*Published: May 1, 2023*

In this update, we've made the following change:

- Introduced support for the Azure Monitor Agent in preview.

## Version 2.0.2

*Published: April 3, 2023*

In this update, we've made the following change:

- Fixed reporting inconsistencies with **Overview** and **User** tabs.

## Version 2.0.1

*Published: March 20, 2023*

In this update, we've made the following change:

- Improved visualization for the Connection Time graph in the **Utilization** tab.

## Version 2.0.0

*Published: March 6, 2023*

In this release, we've made the following change:

- The Azure Virtual Desktop Insights at scale feature is now generally available.

## Version 1.6.1

*Published: February 27, 2023*

In this release, we've made the following changes:

- The Azure Virtual Desktop Insights *at scale* feature is now generally available.

- Added the version of the OS used on session hosts to the **Overview** tab.

## Version 1.6.0

*Published: January 30, 2023*

In this release, we've made the following change:

- Added idle session reporting to the **Utilization** page that visualizes sessions with no active connections.

## Version 1.5.0

*Published: January 9, 2023*

In this release, we've made the following change:

- Added a preview of FSLogix compaction information to the **Utilization** page for reporting as well as a User search capability to the *at scale*.

## Version 1.4.0

*Published: October 2022*

In this release, we've made the following change:

- Added Windows 7 end-of-life reporting for client operating system and a dynamic notification box as a reminder of the deprecation timeframe for Windows 7 support for Azure Virtual Desktop.

## Version 1.3.0

*Published: September 2022*

In this release, we've made the following changes:

- Introduced a preview of *at scale* reporting for Azure Virtual Desktop Insights to allow the selection of multiple subscriptions, resource groups, and host pools.

## Version 1.2.2

*Published: July 2022*

In this release, we've made the following change:

- Updated checkpoint queries for LaunchExecutable.

## Version 1.2.1

*Published: June 2022*

In this release, we've made the following change:

- Updated templates for Configuration Workbook to be available at the gallery instead of the external GitHub.

## Version 1.2.0

*Published: May 2022*

In this release, we've made the following changes:

- Updated language for connection performance to "time to be productive" for clarity.

- Improved and expanded **Connection Details** flyout panel with additional information on connection history for selected users.

- Added a fix for duplication of some data.

## Version 1.1.10

*Published: February 2022*

In this release, we've made the following change:

- We added support for [category groups](/azure/azure-monitor/essentials/diagnostic-settings#resource-logs) for resource logs.

## Version 1.1.8

*Published: November 2021*

In this release, we've made the following changes:

- We added a dynamic check for host pool and workspaces Log Analytics tables to show instances where diagnostics may not be configured.

- Updated the source table for session history and calculations for users per core.

## Version 1.1.7

*Published: November 2021*

In this release, we've made the following change:

- We increased the session host limit to 1000 for the configuration workbook to allow for larger deployments.

## Version 1.1.6

*Published: October 2021*

In this release, we've made the following change:

- We updated contents to reflect change from *Windows Virtual Desktop* to *Azure Virtual Desktop*.

## Version 1.1.4

*Published: October 2021*

In this release, we've made the following change:

- We updated data usage reporting in the configuration workbook to include the agent health table.

## Version 1.1.3

*Published: September 2021*

In this release, we've made the following change:

- We updated filtering behavior to make use of resource IDs.

## Version 1.1.2

*Published: August 2021*

In this release, we've made the following change:

- We updated some formatting in the workbooks.

## Version 1.1.1

*Published: July 2021*

In this release, we've made the following change:

- We added the Workbooks gallery for quick access to Azure Virtual Desktop related Azure workbooks.

## Version 1.1.0

*Published: July 2021*

In this release, we've made the following change:

- We added a **Data Generated** tab to the configuration workbook for detailed data on storage space usage for Azure Virtual Desktop Insights to allow more insight into Log Analytics usage.

## Version 1.0.4

*Published: June 2021*

In this release, we've made the following change:

- We made some changes to formatting and layout for better use of whitespace.

- We changed the sort order for **User Input Delay** details in **Host Performance** to descending.

## Version 1.0.3

*Published: May 2021*

In this release, we've made the following change:

- We updated formatting to prevent truncation of text.

## Version 1.0.2

*Published: May 2021*

In this release, we've made the following change:

- We resolved an issue with user per core calculation in the **Utilization** tab.

## Version 1.0.1

*Published: April 2021*

In this release, we've made the following change:

- We made a formatting update for columns containing sparklines.

## Version 1.0.0

*Published: March 2021*

In this release, we've made the following changes:

- We introduced a new visual indicator for high-impact errors and warnings from the Azure Virtual Desktop agent event log on the host diagnostics page.

- We removed five expensive process performance counters from the default configuration. For more information, see our blog post at [Updated guidance on Azure Virtual Desktop Insights](https://techcommunity.microsoft.com/t5/windows-virtual-desktop/updated-guidance-on-azure-monitor-for-wvd/m-p/2236173).

- The setup process for Windows Event Log for the configuration workbook is now automated.

- The configuration workbook now supports automated deployment of recommended Windows Event Logs.

- The configuration workbook can now install the Log Analytics agent and setting-preferred workspace for session hosts outside of the resource group's region.

- The configuration workbook now has a tabbed layout for the setup process.

- We introduced versioning with this update.

## Next steps

For the general What's New page, see [What's New in Azure Virtual Desktop](whats-new.md).

To learn more about Azure Virtual Desktop Insights, see [Use Azure Virtual Desktop Insights to monitor your deployment](insights.md).
