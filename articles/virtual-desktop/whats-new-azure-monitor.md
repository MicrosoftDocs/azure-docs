---
title: What’s new in Azure Monitor for Azure Virtual Desktop?
description: New features and product updates for the Azure Virtual Desktop agent.
author: Heidilohr
ms.topic: reference
ms.date: 07/09/2021
ms.author: helohr
manager: femila
ms.custom: references_regions
---
# What’s new in Azure Monitor for Azure Virtual Desktop?

This article describes the changes we make to each new version of Azure Monitor for Azure Virtual Desktop.

If you're not sure which version of Azure Monitor you're currently using, you can find it in the bottom-right corner of your Insights page or configuration workbook. To access your workbook, go to [https://aka.ms/azmonwvdi](https://aka.ms/azmonwvdi).

## How to read version numbers

There are three numbers in each version of Azure Monitor for Azure Virtual Desktop. Here's what each number means:

- The first number is the major version, and is usually used for major releases.

- The second number is the minor version. Minor versions are for backwards-compatible changes such as new features and deprecation notices.

- The third number is the patch version, which is used for small changes that fix incorrect behavior or bugs.

For example, a release with a version number of 1.2.31 is on the first major release, the second minor release, and patch number 31.

When one of the numbers is increased, all numbers after it must change, too. One release has one version number. However, not all version numbers track releases. Patch numbers can be somewhat arbitrary, for example.

## Version 1.0.0

Release date: March 21st, 2021.

In this version, we made the following changes:

- We introduced a new visual indicator for high-impact errors and warnings from the Azure Virtual Desktop agent event log on the host diagnostics page.

- We removed five expensive process performance counters from the default configuration. For more information, see our blog post at [Updated guidance on Azure Monitor for Azure Virtual Desktop](https://techcommunity.microsoft.com/t5/windows-virtual-desktop/updated-guidance-on-azure-monitor-for-wvd/m-p/2236173).

- The setup process for Windows Event Log for the configuration workbook is now automated.

- The configuration workbook now supports automated deployment of recommended Windows Event Logs.

- The configuration workbook can now install the Log Analytics agent and setting-preferred workspace for session hosts outside of the resource group's region.

- The configuration workbook now has a tabbed layout for the setup process.

- We introduced versioning with this update.

## Next steps

For the general What's New page, see [What's New in Azure Virtual Desktop](whats-new.md).

To learn more about Azure Monitor for Azure Virtual Desktop, see [Use Azure Monitor for Azure Virtual Desktop to monitor your deployment](azure-monitor.md).
