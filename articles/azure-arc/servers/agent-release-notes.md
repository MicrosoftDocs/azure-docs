---
title: What's new with Azure Connected Machine agent
description: This article has release notes for Azure Connected Machine agent. For many of the summarized issues, there are links to more details.
ms.topic: overview
ms.date: 02/07/2024
ms.custom: references_regions
---

# What's new with Azure Connected Machine agent

The Azure Connected Machine agent receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes

This page is updated monthly, so revisit it regularly. If you're looking for items older than six months, you can find them in [archive for What's new with Azure Connected Machine agent](agent-release-notes-archive.md).

## Version 1.39 - March 2024

Download for [Windows](https://download.microsoft.com/download/1/9/f/19f44dde-2c34-4676-80d7-9fa5fc44d2a8/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features

- Check which extensions are installed and manually remove them with the new [azcmagent extension](azcmagent-extension.md) command group. These commands run locally on the machine and work even if a machine has lost its connection to Azure.
- You can now [customize the CPU limit](agent-overview.md#custom-resource-limits) applied to the extension manager and machine configuration policy evaluation engine. This might be helpful on small or under-powered VMs where the [default resource governance limits](agent-overview.md#agent-resource-governance) can cause extension operations to time out.

### Fixed

- Improved reliability of the run command feature with long-running commands
- Removed an unnecessary endpoint from the network connectivity check when onboarding machines via an Azure Arc resource bridge
- Improved heartbeat reliability
- Removed unnecessary dependencies

## Version 1.38 - February 2024

Download for [Windows](https://download.microsoft.com/download/4/8/f/48f69eb1-f7ce-499f-b9d3-5087f330ae79/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Known issues

Windows machines that try to upgrade to version 1.38 via Microsoft Update and encounter an error might fail to roll back to the previously installed version. As a result, the machine will appear "Disconnected" and won't be manageable from Azure. The update has been removed from the Microsoft Update Catalog while Microsoft investigates this behavior. Manual installations of the agent on new and existing machines aren't affected.

If your machine was affected by this issue, you can repair the agent by downloading and installing the agent again. The agent will automatically discover the existing configuration and restore connectivity with Azure. You don't need to run `azcmagent connect`.

### New features

- AlmaLinux 9 is now a [supported operating system](prerequisites.md#supported-operating-systems)

### Fixed

- The hybrid instance metadata service (HIMDS) now listens on the IPv6 local loopback address (::1)
- Improved logging in the extension manager and policy engine
- Improved reliability when fetching the latest operating system metadata
- Reduced extension manager CPU usage

## Version 1.37 - December 2023

Download for [Windows](https://download.microsoft.com/download/f/6/4/f64c574f-d3d5-4128-8308-ed6a7097a93d/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features

- Rocky Linux 9 is now a [supported operating system](prerequisites.md#supported-environments)
- Added Oracle Cloud Infrastructure display name as a [detected property](agent-overview.md#instance-metadata)

### Fixed

- Restored access to servers with Windows Admin Center in Azure
- Improved detection logic for Microsoft SQL Server
- Agents connected to sovereign clouds should now see the correct cloud and portal URL in [azcmagent show](azcmagent-show.md)
- The installation script for Linux now automatically approves the request to import the packages.microsoft.com signing key to ensure a silent installation experience
- Agent installation and upgrades apply more restrictive permissions to the agent's data directories on Windows
- Improved reliability when detecting Azure Stack HCI as a cloud provider
- Removed the log zipping feature introduced in version 1.37 for extension manager and machine configuration agent logs. Log files are still rotated automatically.
- Removed the scheduled tasks for automatic agent upgrades (introduced in agent version 1.30). We'll reintroduce this functionality when the automatic upgrade mechanism is available.
- Resolved [Azure Connected Machine Agent Elevation of Privilege Vulnerability](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-35624)

## Version 1.36 - November 2023

Download for [Windows](https://download.microsoft.com/download/5/e/9/5e9081ed-2ee2-4b3a-afca-a8d81425bcce/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Known issues

The Windows Admin Center in Azure feature is incompatible with Azure Connected Machine agent version 1.36. Upgrade to version 1.37 or later to use this feature.

### New features

- [azcmagent show](azcmagent-show.md) now reports extended security license status on Windows Server 2012 server machines.
- Introduced a new [proxy bypass](manage-agent.md#proxy-bypass-for-private-endpoints) option, `ArcData`, that covers the SQL Server enabled by Azure Arc endpoints. This enables you to use a private endpoint with Azure Arc-enabled servers with the public endpoints for SQL Server enabled by Azure Arc.
- The [CPU limit for extension operations](agent-overview.md#agent-resource-governance) on Linux is now 30%. This increase helps improve reliability of extension install, upgrade, and uninstall operations.
- Older extension manager and machine configuration agent logs are automatically zipped to reduce disk space requirements.
- New executable names for the extension manager (`gc_extension_service`) and machine configuration (`gc_arc_service`) agents on Windows to help you distinguish the two services. For more information, see [Windows agent installation details](./agent-overview.md#windows-agent-installation-details).

### Bug fixes

- [azcmagent connect](azcmagent-connect.md) now uses the latest API version when creating the Azure Arc-enabled server resource to ensure Azure policies targeting new properties can take effect.
- Upgraded the OpenSSL library and PowerShell runtime shipped with the agent to include the latest security fixes.
- Fixed an issue that could prevent the agent from reporting the correct product type on Windows machines.
- Improved handling of upgrades when the previously installed extension version wasn't in a successful state.

## Version 1.35 - October 2023

Download for [Windows](https://download.microsoft.com/download/e/7/0/e70b1753-646e-4aea-bac4-40187b5128b0/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Known issues

The Windows Admin Center in Azure feature is incompatible with Azure Connected Machine agent version 1.35. Upgrade to version 1.37 or later to use this feature.

### New features

- The Linux installation script now downloads supporting assets with either wget or curl, depending on which tool is available on the system
- [azcmagent connect](azcmagent-connect.md) and [azcmagent disconnect](azcmagent-disconnect.md) now accept the `--user-tenant-id` parameter to enable Lighthouse users to use a credential from their tenant and onboard a server to a different tenant.
- You can configure the extension manager to run, without allowing any extensions to be installed, by configuring the allowlist to `Allow/None`. This supports Windows Server 2012 ESU scenarios where the extension manager is required for billing purposes but doesn't need to allow any extensions to be installed. Learn more about [local security controls](security-overview.md#local-agent-security-controls).

### Fixed

- Improved reliability when installing Microsoft Defender for Endpoint on Linux by increasing [available system resources](agent-overview.md#agent-resource-governance) and extending the timeout
- Better error handling when a user specifies an invalid location name to [azcmagent connect](azcmagent-connect.md)
- Fixed a bug where clearing the `incomingconnections.enabled` [configuration setting](azcmagent-config.md) would show `<nil>` as the previous value
- Security fix for the extension allowlist and blocklist feature to address an issue where an invalid extension name could impact enforcement of the lists.

## Next steps

- Before evaluating or enabling Azure Arc-enabled servers across multiple hybrid machines, review [Connected Machine agent overview](agent-overview.md) to understand requirements, technical details about the agent, and deployment methods.
- Review the [Planning and deployment guide](plan-at-scale-deployment.md) to plan for deploying Azure Arc-enabled servers at any scale and implement centralized management and monitoring.
