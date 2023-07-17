---
title: What's new with Azure Connected Machine agent
description: This article has release notes for Azure Connected Machine agent. For many of the summarized issues, there are links to more details.
ms.topic: overview
ms.date: 05/08/2023
ms.custom: references_regions
---

# What's new with Azure Connected Machine agent

The Azure Connected Machine agent receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes

This page is updated monthly, so revisit it regularly. If you're looking for items older than six months, you can find them in [archive for What's new with Azure Connected Machine agent](agent-release-notes-archive.md).

## Version 1.31 - June 2023

Download for [Windows](https://download.microsoft.com/download/e/b/2/eb2f2d87-6382-463e-9d01-45b40c93c05b/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Known issue

You may encounter error `AZCM0026: Network Error` accompanied by a message about "no IP addresses found" when connecting a server to Azure Arc using a proxy server. At this time, Microsoft recommends using [agent version 1.30](#version-131---june-2023) in networks that require a proxy server. Microsoft has also reverted the agent download URL [aka.ms/AzureConnectedMachineAgent](https://aka.ms/AzureConnectedMachineAgent) to agent version 1.30 to allow existing installation scripts to succeed.

If you've already installed agent version 1.31 and are seeing the error message above, [uninstall the agent](manage-agent.md#uninstall-from-control-panel) and run your installation script again. You do not need to downgrade to agent 1.30 if your agent is connected to Azure.

Microsoft will update the release notes when this issue is resolved.

### New features

- Added support for Amazon Linux 2023
- [azcmagent show](azcmagent-show.md) no longer requires administrator privileges
- You can now filter the output of [azcmagent show](azcmagent-show.md) by specifying the properties you wish to output

### Fixed

- Added an error message when a pending reboot on the machine affects extension operations
- The scheduled task that checks for agent updates no longer outputs a file
- Improved formatting for clock skew calculations
- Improved reliability when upgrading extensions by explicitly asking extensions to stop before trying to upgrade.
- Increased the [resource limits](agent-overview.md#agent-resource-governance) for the Update Management Center extension for Linux, Microsoft Defender Endpoint for Linux, and Azure Security Agent for Linux to prevent timeouts during installation
- [azcmagent disconnect](azcmagent-disconnect.md) now closes any active SSH or Windows Admin Center connections
- Improved output of the [azcmagent check](azcmagent-check.md) command
- Better handling of spaces in the `--location` parameter of [azcmagent connect](azcmagent-connect.md)

## Version 1.30 - May 2023

Download for [Windows](https://download.microsoft.com/download/7/7/9/779eae73-a12b-4170-8c5e-abec71bc14cf/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features

- Introduced a scheduled task that checks for agent updates on a daily basis. Currently, the update mechanism is inactive and no changes are made to your server even if a newer agent version is available. In the future, you'll be able to schedule updates of the Azure Connected Machine agent from Azure. For more information, see [Automatic agent upgrades](manage-agent.md#automatic-agent-upgrades).

### Fixed

- Resolved an issue that could cause the agent to go offline after rotating its connectivity keys.
- `azcmagent show` no longer shows an incomplete resource ID or Azure portal page URL when the agent isn't configured.

## Version 1.29 - April 2023

Download for [Windows](https://download.microsoft.com/download/2/7/0/27063536-949a-4b16-a29a-3d1dcb29cff7/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features

- The agent now compares the time on the local system and Azure service when checking network connectivity and creating the resource in Azure. If the clocks are offset by more than 120 seconds (2 minutes), a nonblocking error is shown. You may encounter TLS connection errors if the time of your computer doesn't match the time in Azure.
- `azcmagent show` now supports an `--os` flag to print extra OS information to the console

### Fixed

- Fixed an issue that could cause the guest configuration service (gc_service) to repeatedly crash and restart on Linux systems
- Resolved a rare condition under which the guest configuration service (gc_service) could consume excessive CPU resources
- Removed "sudo" calls in internal install script that could be blocked if SELinux is enabled
- Reduced how long network checks wait before determining a network endpoint is unreachable
- Stopped writing error messages in "himds.log" referring to a missing certificate key file for the ATS agent, an inactive component reserved for future use.

## Version 1.28 - March 2023

Download for [Windows](https://download.microsoft.com/download/5/9/7/59789af8-5833-4c91-8dc5-91c46ad4b54f/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Fixed

- Improved reliability of delete requests for extensions
- More frequent reporting of VM UUID (system firmware identifier) changes
- Improved reliability when writing changes to agent configuration files
- JSON output for `azcmagent connect` now includes Azure portal URL for the server
- Linux installation script now installs the `gnupg` package if it's missing on Debian operating systems
- Removed weekly restarts for the extension and guest configuration services

## Next steps

- Before evaluating or enabling Azure Arc-enabled servers across multiple hybrid machines, review [Connected Machine agent overview](agent-overview.md) to understand requirements, technical details about the agent, and deployment methods.
- Review the [Planning and deployment guide](plan-at-scale-deployment.md) to plan for deploying Azure Arc-enabled servers at any scale and implement centralized management and monitoring.
