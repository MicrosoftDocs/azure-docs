---
title: What's new with Azure Arc-enabled servers agent
description: This article has release notes for Azure Arc-enabled servers agent. For many of the summarized issues, there are links to more details.
ms.topic: overview
ms.date: 08/17/2022
ms.custom: references_regions
---

# What's new with Azure Arc-enabled servers agent

The Azure Connected Machine agent receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes

This page is updated monthly, so revisit it regularly. If you're looking for items older than six months, you can find them in [archive for What's new with Azure Arc-enabled servers agent](agent-release-notes-archive.md).

## Version 1.21 - August 2022

### New features

- `azcmagent connect` usability improvements:
  - The `--subscription-id (-s)` parameter now accepts friendly names in addition to subscription IDs
  - Automatic registration of any missing resource providers for first-time users (additional user permissions required to register resource providers)
  - A progress bar now appears while the resource is being created and connected
  - The onboarding script now supports both the yum and dnf package managers on RPM-based Linux systems
- You can now restrict which URLs can be used to download machine configuration (formerly Azure Policy guest configuration) packages by setting the `allowedGuestConfigPkgUrls` tag on the server resource and providing a comma-separated list of URL patterns to allow.

### Fixed

- Extension installation failures are now reported to Azure more reliably to prevent extensions from being stuck in the "creating" state
- Metadata for Google Cloud Platform virtual machines can now be retrieved when the agent is configured to use a proxy server
- Improved network connection retry logic and error handling

## Version 1.20 - July 2022

### Known issues

- Some systems may incorrectly report their cloud provider as Azure Stack HCI.

### New features

- Added support for connecting the agent to the Azure China cloud
- Added support for Debian 10
- Updates to the [instance metadata](agent-overview.md#instance-metadata) collected on each machine:
  - GCP VM OS is no longer collected
  - CPU logical core count is now collected
- Improved error messages and colorization

### Fixed

- Agents configured to use private endpoints will now download extensions over the private endpoint
- The `--use-private-link` flag on [azcmagent check](manage-agent.md#check) has been renamed to `--enable-pls-check` to more accurately represent its function

## Version 1.19 - June 2022

### Known issues

- Agents configured to use private endpoints will incorrectly try to download extensions from a public endpoint. [Upgrade the agent](manage-agent.md#upgrade-the-agent) to version 1.20 or later to restore correct functionality.
- Some systems may incorrectly report their cloud provider as Azure Stack HCI.

### New features

- When installed on a Google Compute Engine virtual machine, the agent will now detect and report Google Cloud metadata in the "detected properties" of the Azure Arc-enabled servers resource. [Learn more](agent-overview.md#instance-metadata) about the new metadata.

### Fixed

- An issue that could cause the extension manager to hang during extension installation, update, and removal operations has been resolved.
- Improved support for TLS 1.3

## Version 1.18 - May 2022

### New features

- The agent can now be configured to operate in [monitoring mode](security-overview.md#agent-modes), which simplifies configuration of the agent for scenarios where you only want to use Arc for monitoring and security scenarios. This mode disables other agent functionality and prevents use of extensions that could make changes to the system (for example, the Custom Script Extension).
- VMs and hosts running on Azure Stack HCI now report the cloud provider as "HCI" when [Azure benefits are enabled](/azure-stack/hci/manage/azure-benefits#enable-azure-benefits).

### Fixed

- `systemd` is now an official prerequisite on Linux and your package manager will alert you if you try to install the Azure Connected Machine agent on a server without systemd.
- Guest configuration policies no longer create unnecessary files in the `/tmp` directory on Linux servers
- Improved reliability when extracting extensions and guest configuration policy packages
- Improved reliability for guest configuration policies that have child processes

## Version 1.17 - April 2022

### New features

- The default resource name for AWS EC2 instances is now the instance ID instead of the hostname. To override this behavior, use the `--resource-name PreferredResourceName` parameter to specify your own resource name when connecting a server to Azure Arc.
- The network connectivity check during onboarding now verifies private endpoint configuration if you specify a private link scope. You can run the same check anytime by running [azcmagent check](manage-agent.md#check) with the new `--use-private-link` parameter.
- You can now disable the extension manager with the [local agent security controls](security-overview.md#local-agent-security-controls).

### Fixed

- If you attempt to run `azcmagent connect` on a server that is already connected to Azure, the resource ID is now printed to the console to help you locate the resource in Azure.
- The `azcmagent connect` timeout has been extended to 10 minutes.
- `azcmagent show` no longer prints the private link scope ID. You can check if the server is associated with an Azure Arc private link scope by reviewing the machine details in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/servers), [CLI](/cli/azure/connectedmachine?view=azure-cli-latest#az-connectedmachine-show&preserve-view=true), [PowerShell](/powershell/module/az.connectedmachine/get-azconnectedmachine), or [REST API](/rest/api/hybridcompute/machines/get).
- `azcmagent logs` collects only the 2 most recent logs for each service to reduce ZIP file size.
- `azcmagent logs` collects Guest Configuration logs again.

## Next steps

- Before evaluating or enabling Azure Arc-enabled servers across multiple hybrid machines, review [Connected Machine agent overview](agent-overview.md) to understand requirements, technical details about the agent, and deployment methods.
- Review the [Planning and deployment guide](plan-at-scale-deployment.md) to plan for deploying Azure Arc-enabled servers at any scale and implement centralized management and monitoring.
