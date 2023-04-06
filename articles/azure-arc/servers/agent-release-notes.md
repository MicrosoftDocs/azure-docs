---
title: What's new with Azure Arc-enabled servers agent
description: This article has release notes for Azure Arc-enabled servers agent. For many of the summarized issues, there are links to more details.
ms.topic: overview
ms.date: 03/10/2023
ms.custom: references_regions
---

# What's new with Azure Arc-enabled servers agent

The Azure Connected Machine agent receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes

This page is updated monthly, so revisit it regularly. If you're looking for items older than six months, you can find them in [archive for What's new with Azure Arc-enabled servers agent](agent-release-notes-archive.md).

## Version 1.28 - March 2023

### Fixed

- Improved reliability of delete requests for extensions
- More frequent reporting of VM UUID (system firmware identifier) changes
- Improved reliability when writing changes to agent configuration files
- JSON output for `azcmagent connect` now includes Azure portal URL for the server
- Linux installation script now installs the `gnupg` package if it's missing on Debian operating systems
- Removed weekly restarts for the extension and guest configuration services

## Version 1.27 - February 2023

### Fixed

- The extension service now correctly restarts when the Azure Connected Machine agent is upgraded by Update Management Center
- Resolved issues with the hybrid connectivity component that could result in the "himds" service crashing, the server showing as "disconnected" in Azure, and connectivity issues with Windows Admin Center and SSH
- Improved handling of resource move scenarios that could impact Windows Admin Center and SSH connectivity
- Improved reliability when changing the [agent configuration mode](security-overview.md#local-agent-security-controls) from "monitor" mode to "full" mode.
- Increased the [resource limits](agent-overview.md#agent-resource-governance) for the Microsoft Sentinel DNS extension to improve log collection reliability
- Tenant IDs are better validated when connecting the server

## Version 1.26 - January 2023

> [!NOTE]
> Version 1.26 is only available for Linux operating systems.

### Fixed

- Increased the [resource limits](agent-overview.md#agent-resource-governance) for the Microsoft Defender for Endpoint extension (MDE.Linux) on Linux to improve installation reliability

## Version 1.25 - January 2023

### New features

- Red Hat Enterprise Linux (RHEL) 9 is now a [supported operating system](prerequisites.md#supported-operating-systems)

### Fixed

- Reliability improvements in the machine (guest) configuration policy engine
- Improved error messages in the Windows MSI installer
- Additional improvements to the detection logic for machines running on Azure Stack HCI

## Version 1.24 - November 2022

### New features

- `azcmagent logs` improvements:
  - Only the most recent log file for each component is collected by default. To collect all log files, use the new `--full` flag.
  - Journal logs for the agent services are now collected on Linux operating systems
  - Logs from extensions are now collected
- Agent telemetry is no longer sent to `dc.services.visualstudio.com`. You may be able to remove this URL from any firewall or proxy server rules if no other applications in your environment require it.
- Failed extension installs can now be retried without removing the old extension as long as the extension settings are different
- Increased the [resource limits](agent-overview.md#agent-resource-governance) for the Azure Update Management Center extension on Linux to reduce downtime during update operations

### Fixed

- Improved logic for detecting machines running on Azure Stack HCI to reduce false positives
- Auto-registration of required resource providers only happens when they are unregistered
- Agent will now detect drift between the proxy settings of the command line tool and background services
- Fixed a bug with proxy bypass feature that caused the agent to incorrectly use the proxy server for bypassed URLs
- Improved error handling when extensions don't download successfully, fail validation, or have corrupt state files

## Next steps

- Before evaluating or enabling Azure Arc-enabled servers across multiple hybrid machines, review [Connected Machine agent overview](agent-overview.md) to understand requirements, technical details about the agent, and deployment methods.
- Review the [Planning and deployment guide](plan-at-scale-deployment.md) to plan for deploying Azure Arc-enabled servers at any scale and implement centralized management and monitoring.
