---
title: What's new with Azure Connected Machine agent
description: This article has release notes for Azure Connected Machine agent. For many of the summarized issues, there are links to more details.
ms.topic: overview
ms.date: 04/09/2024
ms.custom: references_regions
---

# What's new with Azure Connected Machine agent

The Azure Connected Machine agent receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes

This page is updated monthly, so revisit it regularly. If you're looking for items older than six months, you can find them in [archive for What's new with Azure Connected Machine agent](agent-release-notes-archive.md).

## Version 1.42 - May 2024 (Second Release)

Download for [Windows](https://download.microsoft.com/download/9/6/0/9600825a-e532-4e50-a2d5-7f07e400afc1/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Fixed

- Extensions and machine configuration policies can be used with private endpoints again

## Version 1.41 - May 2024

Download for [Windows](https://download.microsoft.com/download/2/a/5/2a57aa86-c445-4f08-bd52-10af2b748fec/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Known issues

Customers using private endpoints with Azure Arc may encounter issues with extension management and machine configuration policies with agent version 1.41. Agent version 1.42 resolves this issue.

### New features

- Certificate-based authentication is now supported when using a service principal to connect or disconnect the agent. For more information, see [authentication options for the azcmagent CLI](azcmagent-connect.md#authentication-options).
- [azcmagent check](azcmagent-check.md) now allows you to also check for the endpoints used by the SQL Server enabled by Azure Arc extension using the new `--extensions` flag. This can help you troubleshoot networking issues for both the OS and SQL management components. You can try this out by running `azcmagent check --extensions sql --location eastus` on a server, either before or after it is connected to Azure Arc.

### Fixed

- Fixed a memory leak in the Hybrid Instance Metadata service
- Better handling when IPv6 local loopback is disabled
- Improved reliability when upgrading extensions
- Improved reliability when enforcing CPU limits on Linux extensions
- PowerShell telemetry is now disabled by default for the extension manager and policy services
- The extension manager and policy services now support OpenSSL 3
- Colors are now disabled in the onboarding progress bar when the `--no-color` flag is used
- Improved detection and reporting for Windows machines that have custom [logon as a service rights](prerequisites.md#local-user-logon-right-for-windows-systems) configured.
- Improved accuracy when obtaining system metadata on Windows:
  - VMUUID is now obtained from the Win32 API
  - Physical memory is now checked using WMI
- Fixed an issue that could prevent the region selector in the [Windows GUI installer](onboard-windows-server.md) from loading
- Fixed permissions issues that could prevent the "himds" service from accessing necessary directories on Windows

## Version 1.40 - April 2024

Download for [Windows](https://download.microsoft.com/download/2/1/0/210f77ca-e069-412b-bd94-eac02a63255d/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Known issues

The first release of the 1.40 agent may impact SQL Server enabled by Azure Arc when configured with least privileges on Windows servers. The 1.40 agent was re-released to address this problem. To check if your server is affected, run `azcmagent show` and locate the agent version number. Agent version `1.40.02664.1629` has the known issue and agent `1.40.02669.1635` fixes it. Download and install the [latest version of the agent](https://aka.ms/AzureConnectedMachineAgent) to restore functionality for SQL Server enabled by Azure Arc.

### New features

- Oracle Linux 9 is now a [supported operating system](prerequisites.md#supported-operating-systems)

### Fixed

- Improved error handling when a machine configuration policy has an invalid SAS token
- The installation script for Windows now includes a flag to suppress reboots in case any agent executables are in use during an upgrade
- Fixed an issue that could block agent installation or upgrades on Windows when the installer can't change the access control list on the agent's log directories.
- Extension package maximum download size increased to fix access to the [latest versions of the Azure Monitor Agent](/azure/azure-monitor/agents/azure-monitor-agent-extension-versions) on Azure Arc-enabled servers.

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

Windows machines that try and fail to upgrade to version 1.38 manually or via Microsoft Update might not roll back to the previously installed version. As a result, the machine will appear "Disconnected" and won't be manageable from Azure. A new version of 1.38 was released to Microsoft Update and the Microsoft Download Center on March 5, 2024 that resolves this issue.

If your machine was affected by this issue, you can repair the agent by downloading and installing the agent again. The agent will automatically discover the existing configuration and restore connectivity with Azure. You don't need to run `azcmagent connect`.

### New features

- AlmaLinux 9 is now a [supported operating system](prerequisites.md#supported-operating-systems)

### Fixed

- The hybrid instance metadata service (HIMDS) now listens on the IPv6 local loopback address (::1)
- Improved logging in the extension manager and policy engine
- Improved reliability when fetching the latest operating system metadata
- Reduced extension manager CPU usage

## Next steps

- Before evaluating or enabling Azure Arc-enabled servers across multiple hybrid machines, review [Connected Machine agent overview](agent-overview.md) to understand requirements, technical details about the agent, and deployment methods.
- Review the [Planning and deployment guide](plan-at-scale-deployment.md) to plan for deploying Azure Arc-enabled servers at any scale and implement centralized management and monitoring.
