---
title: What's new in Azure Virtual Desktop Insights?
description: New features and product updates in Azure Virtual Desktop Insights.
author: Heidilohr
ms.topic: release-notes
ms.date: 03/16/2023
ms.author: helohr
manager: femila
ms.custom: references_regions
---
# What's new in Azure Virtual Desktop Insights?

This article describes the changes we make to each new version of Azure Virtual Desktop Insights.

If you're not sure which version of Azure Virtual Desktop Insights you're currently using, you can find it in the bottom-right corner of your Insights page or configuration workbook. To access your workbook, go to [https://aka.ms/azmonwvdi](https://aka.ms/azmonwvdi).

## How to read version numbers

There are three numbers in each version of Azure Virtual Desktop Insights. Here's what each number means:

- The first number is the major version, and is usually used for major releases.

- The second number is the minor version. Minor versions are for backwards-compatible changes such as new features and deprecation notices.

- The third number is the patch version, which is used for small changes that fix incorrect behavior or bugs.

For example, a release with a version number of 1.2.31 is on the first major release, the second minor release, and patch number 31.

When one of the numbers is increased, all numbers after it must change, too. One release has one version number. However, not all version numbers track releases. Patch numbers can be somewhat arbitrary, for example.

## Version 2.0.0

This update was released on March 6, 2023 and had the following change:

- The Azure Virtual Desktop Insights at scale feature is now generally available.

## Version 1.6.1

This update was released in February 27, 2023 and had the following changes:

- The Azure Virtual Desktop Insights *at scale* feature is now generally available.
- Added the version of the OS used on session hosts to the **Overview** tab.

## Version 1.6.0

This update was released on January 30, 2023 and had the following change:

- Added idle session reporting to the **Utilization** tab that visualizes sessions with no active connections.

## Version 1.5.0

This update was released on January 9, 2023 and had the following change:

- Added FSLogix compaction information to the **Utilization** tab for reporting as well as a User search capability to the *at scale* public preview.

## Version 1.4.0

This update was released in October 2022 and has the following changes:

- Added Windows 7 end-of-life reporting for client operating system and a dynamic notification box as a reminder of the deprecation timeframe for Windows 7 support for Azure Virtual Desktop.

## Version 1.3.0

This update was released in September 2022 and has the following changes:

- Introduced a public preview of *at scale* reporting for Azure Virtual Desktop Insights to allow the selection of multiple subscriptions, resource groups, and host pools.

## Version 1.2.2

This update was released in July 2022 and has the following changes:

- Updated checkpoint queries for LaunchExecutable.

## Version 1.2.1

This update was released in June 2022 and has the following changes:

- Updated templates for Configuration Workbook to be available at the gallery instead of the external GitHub.

## Version 1.2.0

This update was released in May 2022 and has the following changes:

- Updated language for connection performance to "time to be productive" for clarity.

- Improved and expanded **Connection Details** flyout panel with additional information on connection history for selected users.

- Added a fix for duplication of some data.

## Version 1.1.10

This update was released in February 2022 and has the following changes:

- We added support for [category groups](../azure-monitor/essentials/diagnostic-settings.md#resource-logs) for resource logs.

## Version 1.1.8

This update was released in November 2021 and has the following changes:

- We added a dynamic check for host pool and workspaces Log Analytics tables to show instances where diagnostics may not be configured.
- Updated the source table for session history and calculations for users per core.

## Version 1.1.7

This update was released in November 2021 and has the following changes:

- We increased the session host limit to 1000 for the configuration workbook to allow for larger deployments.

## Version 1.1.6

This update was released in October 2021 and has the following changes:

- We updated contents to reflect change from *Windows Virtual Desktop* to *Azure Virtual Desktop*.

## Version 1.1.4

This update was released in October 2021 and has the following changes:

- We updated data usage reporting in the configuration workbook to include the agent health table.

## Version 1.1.3

This update was released in September 2021 and has the following changes:

- We updated filtering behavior to make use of resource IDs.

## Version 1.1.2

This update was released in August 2021 and has the following changes:

- We updated some formatting in the workbooks.

## Version 1.1.1

This update was released in July 2021 and has the following changes:

- We added the Workbooks gallery for quick access to Azure Virtual Desktop related Azure workbooks.

## Version 1.1.0

This update was released July 2021 and has the following changes:

- We added a **Data Generated** tab to the configuration workbook for detailed data on storage space usage for Azure Virtual Desktop Insights to allow more insight into Log Analytics usage.

## Version 1.0.4

This update was released in June 2021 and has the following changes:

- We made some changes to formatting and layout for better use of whitespace.
- We changed the sort order for **User Input Delay** details in **Host Performance** to descending.

## Version 1.0.3

This update was released in May 2021 and has the following changes:

- We updated formatting to prevent truncation of text.

## Version 1.0.2

This update was released in May 2021 and has the following changes:

- We resolved an issue with user per core calculation in the **Utilization** tab.

## Version 1.0.1

This update was released in April 2021 and has the following changes:

- We made a formatting update for columns containing sparklines.

## Version 1.0.0

This update was released in March 2021 and has the following changes:

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
