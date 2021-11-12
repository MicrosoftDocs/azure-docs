---
title: What's new with Azure Arc-enabled servers agent
description: This article has release notes for Azure Arc-enabled servers agent. For many of the summarized issues, there are links to more details.
ms.topic: overview
ms.date: 09/01/2021
ms.custom: references_regions
---

# What's new with Azure Arc-enabled servers agent

The Azure Arc-enabled servers Connected Machine agent receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes

This page is updated monthly, so revisit it regularly. If you're looking for items older than six months, you can find them in [archive for What's new with Azure Arc-enabled servers agent](agent-release-notes-archive.md).

## November 2021

Version 1.13

### Fixed

- Improved reliability when installing or upgrading the agent.

### New features

- Local configuration of agent settings now available using the [azcmagent config command](manage-agent.md#config).
- Proxy server settings can be [configured using agent-specific settings](manage-agent.md#update-or-remove-proxy-settings) instead of environment variables.
- Extension operations will execute faster using a new notification pipeline. You may need to adjust your firewall or proxy server rules to allow the new network addresses for this notification service (see [networking configuration](agent-overview.md#networking-configuration)). The extension manager will fall back to the existing behavior of checking every 5 minutes when the notification service cannot be reached.
- Detection of the AWS account ID, instance ID, and region information for servers running in Amazon Web Services.

## October 2021

Version 1.12

### Fixed

- Improved reliability when validating signatures of extension packages.
- `azcmagent_proxy remove` command on Linux now correctly removes environment variables on Red Hat Enterprise Linux and related distributions.
- `azcmagent logs` now includes the computer name and timestamp to help disambiguate log files.

## September 2021

Version 1.11

### Fixed

- The agent can now be installed on Windows systems with the [System objects: Require case insensitivity for non-Windows subsystems](/windows/security/threat-protection/security-policy-settings/system-objects-require-case-insensitivity-for-non-windows-subsystems) policy set to Disabled.
- The guest configuration policy agent will now automatically retry if an error is encountered during service start or restart events.
- Fixed an issue that prevented guest configuration audit policies from successfully executing on Linux machines.

## August 2021

Version 1.10

### Fixed

- The guest configuration policy agent can now configure and remediate system settings. Existing policy assignments continue to be audit-only. Learn more about the Azure Policy [guest configuration remediation options](../../governance/policy/concepts/guest-configuration-policy-effects.md).
- The guest configuration policy agent now restarts every 48 hours instead of every 6 hours.

## July 2021

Version 1.9

## New features

Added support for the Indonesian language

### Fixed

Fixed a bug that prevented extension management in the West US 3 region

Version 1.8

### New features

- Improved reliability when installing the Azure Monitor Agent extension on Red Hat and CentOS systems
- Added agent-side enforcement of max resource name length (54 characters)
- Guest Configuration policy improvements:
  - Added support for PowerShell-based Guest Configuration policies on Linux operating systems
  - Added support for multiple assignments of the same Guest Configuration policy on the same server
  - Upgraded PowerShell Core to version 7.1 on Windows operating systems

### Fixed

- The agent will continue running if it is unable to write service start/stop events to the Windows application event log

## Next steps

- Before evaluating or enabling Azure Arc-enabled servers across multiple hybrid machines, review [Connected Machine agent overview](agent-overview.md) to understand requirements, technical details about the agent, and deployment methods.
- Review the [Planning and deployment guide](plan-at-scale-deployment.md) to plan for deploying Azure Arc-enabled servers at any scale and implement centralized management and monitoring.
