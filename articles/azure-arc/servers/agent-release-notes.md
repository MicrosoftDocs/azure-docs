---
title: What's new with Azure Arc-enabled servers agent
description: This article has release notes for Azure Arc-enabled servers agent. For many of the summarized issues, there are links to more details.
ms.topic: overview
ms.date: 04/06/2023
ms.custom: references_regions
---

# What's new with Azure Arc-enabled servers agent

The Azure Connected Machine agent receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes

This page is updated monthly, so revisit it regularly. If you're looking for items older than six months, you can find them in [archive for What's new with Azure Arc-enabled servers agent](agent-release-notes-archive.md).

## Version 1.29 - April 2023

Download for [Windows](https://download.microsoft.com/download/2/7/0/27063536-949a-4b16-a29a-3d1dcb29cff7/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features

- The agent now compares the time on the local system and Azure service when checking network connectivity and creating the resource in Azure. If the clocks are offset by more than 120 seconds (2 minutes), a non-blocking error will be printed to the console. You may encounter TLS connection errors if the time of your computer does not match the time in Azure.
- `azcmagent show` now supports an `--os` flag to print additional OS information to the console

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

## Version 1.27 - February 2023

Download for [Windows](https://download.microsoft.com/download/8/4/5/845d5e04-bb09-4ed2-9ca8-bb51184cddc9/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Fixed

- The extension service now correctly restarts when the Azure Connected Machine agent is upgraded by Update Management Center
- Resolved issues with the hybrid connectivity component that could result in the "himds" service crashing, the server showing as "disconnected" in Azure, and connectivity issues with Windows Admin Center and SSH
- Improved handling of resource move scenarios that could impact Windows Admin Center and SSH connectivity
- Improved reliability when changing the [agent configuration mode](security-overview.md#local-agent-security-controls) from "monitor" mode to "full" mode.
- Increased the [resource limits](agent-overview.md#agent-resource-governance) for the Microsoft Sentinel DNS extension to improve log collection reliability
- Tenant IDs are better validated when connecting the server

## Version 1.26 - January 2023

Download for [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

> [!NOTE]
> Version 1.26 is only available for Linux operating systems.

### Fixed

- Increased the [resource limits](agent-overview.md#agent-resource-governance) for the Microsoft Defender for Endpoint extension (MDE.Linux) on Linux to improve installation reliability

## Version 1.25 - January 2023

Download for [Windows](https://download.microsoft.com/download/2/a/5/2a5b7d19-bc35-443e-80b2-63087577236e/AzureConnectedMachineAgent%20(1).msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features

- Red Hat Enterprise Linux (RHEL) 9 is now a [supported operating system](prerequisites.md#supported-operating-systems)

### Fixed

- Reliability improvements in the machine (guest) configuration policy engine
- Improved error messages in the Windows MSI installer
- Additional improvements to the detection logic for machines running on Azure Stack HCI

## Next steps

- Before evaluating or enabling Azure Arc-enabled servers across multiple hybrid machines, review [Connected Machine agent overview](agent-overview.md) to understand requirements, technical details about the agent, and deployment methods.
- Review the [Planning and deployment guide](plan-at-scale-deployment.md) to plan for deploying Azure Arc-enabled servers at any scale and implement centralized management and monitoring.
