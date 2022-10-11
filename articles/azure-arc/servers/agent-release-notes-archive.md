---
title: Archive for What's new with Azure Arc-enabled servers agent
description: The What's new release notes in the Overview section for Azure Arc-enabled servers agent contains six months of activity. Thereafter, the items are removed from the main article and put into this article.
ms.topic: overview
ms.date: 10/11/2022
ms.custom: references_regions
---

# Archive for What's new with Azure Arc-enabled servers agent

The primary [What's new in Azure Arc-enabled servers agent?](agent-release-notes.md) article contains updates for the last six months, while this article contains all the older information.

The Azure Connected Machine agent receives improvements on an ongoing basis. This article provides you with information about:

- Previous releases
- Known issues
- Bug fixes

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

## Version 1.16 - March 2022

### Known issues

- `azcmagent logs` doesn't collect Guest Configuration logs in this release. You can locate the log directories in the [agent installation details](agent-overview.md#agent-resources).

### New features

- You can now granularly control which extensions are allowed to be deployed to your server and whether or not Guest Configuration should be enabled. See [local agent controls to enable or disable capabilities](security-overview.md#local-agent-security-controls) for more information.

### Fixed

- The "Arc" proxy bypass keyword no longer includes Azure Active Directory endpoints on Linux. Azure Storage endpoints for extension downloads are now included with the "Arc" keyword.

## Version 1.15 - February 2022

### Known issues

- The "Arc" proxy bypass feature on Linux includes some endpoints that belong to Azure Active Directory. As a result, if you only specify the "Arc" bypass rule, traffic destined for Azure Active Directory endpoints will not use the proxy server as expected. This issue will be fixed in an upcoming release.

### New features

- Network check improvements during onboarding:
  - Added TLS 1.2 check
  - Azure Arc network endpoints are now required, onboarding will abort if they are not accessible
  - New `--skip-network-check` flag to override the new network check behavior
  - On-demand network check now available using `azcmagent check`
- [Proxy bypass](manage-agent.md#proxy-bypass-for-private-endpoints) is now available for customers using private endpoints. This allows you to send Azure Active Directory and Azure Resource Manager traffic through a proxy server, but skip the proxy server for traffic that should stay on the local network to reach private endpoints.
- Oracle Linux 8 is now supported

### Fixed

- Improved reliability when disconnecting the agent from Azure
- Improved reliability when installing and uninstalling the agent on Active Directory Domain Controllers
- Extended the device login timeout to 5 minutes
- Removed resource constraints for Azure Monitor Agent to support high throughput scenarios

## Version 1.14 - January 2022

### Fixed

- A state corruption issue in the extension manager that could cause extension operations to get stuck in transient states has been fixed. Customers running agent version 1.13 are encouraged to upgrade to version 1.14 as soon as possible. If you continue to have issues with extensions after upgrading the agent, [submit a support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Version 1.13 - November 2021

### Known issues

- Extensions may get stuck in transient states (creating, deleting, updating) on Windows machines running the 1.13 agent in certain conditions. Microsoft recommends upgrading to agent version 1.14 as soon as possible to resolve this issue.

### Fixed

- Improved reliability when installing or upgrading the agent.

### New features

- Local configuration of agent settings now available using the [azcmagent config command](manage-agent.md#config).
- Proxy server settings can be [configured using agent-specific settings](manage-agent.md#update-or-remove-proxy-settings) instead of environment variables.
- Extension operations will execute faster using a new notification pipeline. You may need to adjust your firewall or proxy server rules to allow the new network addresses for this notification service (see [networking configuration](network-requirements.md)). The extension manager will fall back to the existing behavior of checking every 5 minutes when the notification service cannot be reached.
- Detection of the AWS account ID, instance ID, and region information for servers running in Amazon Web Services.


## Version 1.12 - October 2021

### Fixed

- Improved reliability when validating signatures of extension packages.
- `azcmagent_proxy remove` command on Linux now correctly removes environment variables on Red Hat Enterprise Linux and related distributions.
- `azcmagent logs` now includes the computer name and timestamp to help disambiguate log files.
## Version 1.11 - September 2021

### Fixed

- The agent can now be installed on Windows systems with the [System objects: Require case insensitivity for non-Windows subsystems](/windows/security/threat-protection/security-policy-settings/system-objects-require-case-insensitivity-for-non-windows-subsystems) policy set to Disabled.
- The guest configuration policy agent will now automatically retry if an error is encountered during service start or restart events.
- Fixed an issue that prevented guest configuration audit policies from successfully executing on Linux machines.

## Version 1.10 - August 2021

### Fixed

- The guest configuration policy agent can now configure and remediate system settings. Existing policy assignments continue to be audit-only. Learn more about the Azure Policy [guest configuration remediation options](../../governance/machine-configuration/machine-configuration-policy-effects.md).
- The guest configuration policy agent now restarts every 48 hours instead of every 6 hours.

## Version 1.9 - July 2021

### New features

Added support for the Indonesian language

### Fixed

Fixed a bug that prevented extension management in the West US 3 region

## Version 1.8 - July 2021

### New features

- Improved reliability when installing the Azure Monitor Agent extension on Red Hat and CentOS systems
- Added agent-side enforcement of max resource name length (54 characters)
- Guest Configuration policy improvements:
  - Added support for PowerShell-based Guest Configuration policies on Linux operating systems
  - Added support for multiple assignments of the same Guest Configuration policy on the same server
  - Upgraded PowerShell Core to version 7.1 on Windows operating systems

### Fixed

- The agent will continue running if it is unable to write service start/stop events to the Windows application event log

## Version 1.7 - June 2021

### New features

- Improved reliability during onboarding:
  - Improved retry logic when HIMDS is unavailable
  - Onboarding continues instead of aborting if OS information cannot be obtained
- Improved reliability when installing the Log Analytics agent for Linux extension on Red Hat and CentOS systems

## Version 1.6 - May 2021

### New features

- Added support for SUSE Enterprise Linux 12
- Updated Guest Configuration agent to version 1.26.12.0 to include:
  - Policies are executed in a separate process.
  - Added V2 signature support for extension validation.
  - Minor update to data logging.

## Version 1.5 - April 2021

### New features

- Added support for Red Hat Enterprise Linux 8 and CentOS Linux 8.
- New `-useStderr` parameter to direct error and verbose output to stderr.
- New `-json` parameter to direct output results in JSON format (when used with -useStderr).
- Collect other instance metadata - Manufacturer, model, and cluster resource ID (for Azure Stack HCI nodes).

## Version 1.4 - March 2021

### New features

- Added support for private endpoints, which is currently in limited preview.
- Expanded list of exit codes for azcmagent.
- Agent configuration parameters can now be read from a file with the `--config` parameter.
- Collect new instance metadata to determine if Microsoft SQL Server is installed on the server

### Fixed

Network endpoint checks are now faster.

## Version 1.3 - December 2020

### New features

Added support for Windows Server 2008 R2 SP1.

### Fixed

Resolved issue preventing the Custom Script Extension on Linux from installing successfully.

## Version 1.2 - November 2020

### Fixed

Resolved issue where proxy configuration could be lost after upgrade on RPM-based distributions.

## Version 1.1 - October 2020

### Fixed

- Fixed proxy script to handle alternate GC daemon unit file location.
- GuestConfig agent reliability changes.
- GuestConfig agent support for US Gov Virginia region.
- GuestConfig agent extension report messages to be more verbose if there is a failure.

## Version 1.0 - September 2020

This version is the first generally available release of the Azure Connected Machine Agent.

### Plan for change

- Support for preview agents (all versions older than 1.0) will be removed in a future service update.
- Removed support for fallback endpoint `.azure-automation.net`. If you have a proxy, you need to allow the endpoint `*.his.arc.azure.com`.
- If the Connected Machine agent is installed on a virtual machine hosted in Azure, VM extensions can't be installed or modified from the Arc-enabled servers resource. This is to avoid conflicting extension operations being performed from the virtual machine's **Microsoft.Compute** and **Microsoft.HybridCompute** resource. Use the **Microsoft.Compute** resource for the machine for all extension operations.
- Name of guest configuration process has changed, from *gcd* to *gcad* on Linux, and *gcservice* to *gcarcservice* on Windows.

### New features

- Added `azcmagent logs` option to collect information for support.
- Added `azcmagent license` option to display EULA.
- Added `azcmagent show --json` option to output agent state in easily parseable format.
- Added flag in `azcmagent show` output to indicate if server is on a virtual machine hosted in Azure.
- Added `azcmagent disconnect --force-local-only` option to allow reset of local agent state when Azure service cannot be reached.
- Added `azcmagent connect --cloud` option to support other clouds. In this release, only Azure is supported by service at time of agent release.
- Agent has been localized into Azure-supported languages.

### Fixed

- Improvements to connectivity check.
- Corrected issue with proxy server settings being lost when upgrading agent on Linux.
- Resolved issues when attempting to install agent on server running Windows Server 2012 R2.
- Improvements to extension installation reliability

## Next steps

- Before evaluating or enabling Arc-enabled servers across multiple hybrid machines, review [Connected Machine agent overview](agent-overview.md) to understand requirements, technical details about the agent, and deployment methods.

- Review the [Planning and deployment guide](plan-at-scale-deployment.md) to plan for deploying Azure Arc-enabled servers at any scale and implement centralized management and monitoring.