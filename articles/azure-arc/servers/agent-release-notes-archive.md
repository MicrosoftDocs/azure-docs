---,
"title: Archive for What's new with Azure Connected Machine agent,
"description: Release notes for Azure Connected Machine agent versions older than six months,
"ms.topic: overview,
"ms.date: 08/01/2023,
"ms.custom: references_regions
---

# Archive for What's new with Azure Connected Machine agent
,
"The primary [What's new in Azure Connected Machine agent?](agent-release-notes.md) article contains updates for the last six months, while this article contains all the older information.
,
"The Azure Connected Machine agent receives improvements on an ongoing basis. This article provides you with information about:

- Previous releases
- Known issues
- Bug fixes

## Version 1.31 - June 2023
,
"Download for [Windows](https://download.microsoft.com/download/2/6/e/26e2b001-1364-41ed-90b0-1340a44ba409/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Known issue
,
"The first release of agent version 1.31 had a known issue affecting customers using proxy servers. The issue displays as  `AZCM0026: Network Error` and a message about "no IP addresses found" when connecting a server to Azure Arc using a proxy server. A newer version of agent 1.31 was released on June 14, 2023 that addresses this issue.
,
"To check if you're running the latest version of the Azure connected machine agent, navigate to the server in the Azure portal or run `azcmagent show` from a terminal on the server itself and look for the "Agent version." The table below shows the version numbers for the first and patched releases of agent 1.31.

| Package type | Version number with proxy issue | Version number of patched agent |
| ------------ | ------------------------------- | ------------------------------- |
| Windows | 1.31.02347.1069 | 1.31.02356.1083 |
| RPM-based Linux | 1.31.02347.957 | 1.31.02356.970 |
| DEB-based Linux | 1.31.02347.939 | 1.31.02356.952 |

### New features

- Added support for Amazon Linux 2023
- [azcmagent show](azcmagent-show.md) no longer requires administrator privileges
- You can now filter the output of [azcmagent show](azcmagent-show.md) by specifying the properties you wish to output

### Fixed

- Added an error message when a pending reboot on the machine affects extension operations
- The scheduled task that checks for agent updates no longer outputs a file
- Improved formatting for clock skew calculations
- Improved reliability when upgrading extensions by explicitly asking extensions to stop before trying to upgrade.
- Increased the [resource limits](agent-overview.md#agent-resource-governance) for the Update Manager extension for Linux, Microsoft Defender Endpoint for Linux, and Azure Security Agent for Linux to prevent timeouts during installation
- [azcmagent disconnect](azcmagent-disconnect.md) now closes any active SSH or Windows Admin Center connections
- Improved output of the [azcmagent check](azcmagent-check.md) command
- Better handling of spaces in the `--location` parameter of [azcmagent connect](azcmagent-connect.md)

## Version 1.30 - May 2023
,
"Download for [Windows](https://download.microsoft.com/download/7/7/9/779eae73-a12b-4170-8c5e-abec71bc14cf/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features

- Introduced a scheduled task that checks for agent updates on a daily basis. Currently, the update mechanism is inactive and no changes are made to your server even if a newer agent version is available. In the future, you'll be able to schedule updates of the Azure Connected Machine agent from Azure. For more information, see [Automatic agent upgrades](manage-agent.md#automatic-agent-upgrades).

### Fixed

- Resolved an issue that could cause the agent to go offline after rotating its connectivity keys.
- `azcmagent show` no longer shows an incomplete resource ID or Azure portal page URL when the agent isn't configured.

## Version 1.29 - April 2023
,
"Download for [Windows](https://download.microsoft.com/download/2/7/0/27063536-949a-4b16-a29a-3d1dcb29cff7/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

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
,
"Download for [Windows](https://download.microsoft.com/download/5/9/7/59789af8-5833-4c91-8dc5-91c46ad4b54f/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Fixed

- Improved reliability of delete requests for extensions
- More frequent reporting of VM UUID (system firmware identifier) changes
- Improved reliability when writing changes to agent configuration files
- JSON output for `azcmagent connect` now includes Azure portal URL for the server
- Linux installation script now installs the `gnupg` package if it's missing on Debian operating systems
- Removed weekly restarts for the extension and guest configuration services

## Version 1.27 - February 2023
,
"Download for [Windows](https://download.microsoft.com/download/8/4/5/845d5e04-bb09-4ed2-9ca8-bb51184cddc9/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Fixed

- The extension service now correctly restarts when the Azure Connected Machine agent is upgraded by Update Manager
- Resolved issues with the hybrid connectivity component that could result in the "himds" service crashing, the server showing as "disconnected" in Azure, and connectivity issues with Windows Admin Center and SSH
- Improved handling of resource move scenarios that could impact Windows Admin Center and SSH connectivity
- Improved reliability when changing the [agent configuration mode](security-overview.md#local-agent-security-controls) from "monitor" mode to "full" mode.
- Increased the [resource limits](agent-overview.md#agent-resource-governance) for the Microsoft Sentinel DNS extension to improve log collection reliability
- Tenant IDs are better validated when connecting the server

## Version 1.26 - January 2023
,
"Download for [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

> [!NOTE]
> Version 1.26 is only available for Linux operating systems.

### Fixed

- Increased the [resource limits](agent-overview.md#agent-resource-governance) for the Microsoft Defender for Endpoint extension (MDE.Linux) on Linux to improve installation reliability

## Version 1.25 - January 2023
,
"Download for [Windows](https://download.microsoft.com/download/2/a/5/2a5b7d19-bc35-443e-80b2-63087577236e/AzureConnectedMachineAgent%20(1).msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features

- Red Hat Enterprise Linux (RHEL) 9 is now a [supported operating system](prerequisites.md#supported-operating-systems)

### Fixed

- Reliability improvements in the machine (guest) configuration policy engine
- Improved error messages in the Windows MSI installer
- Additional improvements to the detection logic for machines running on Azure Stack HCI
## Version 1.24 - November 2022
,
"Download for [Windows](https://download.microsoft.com/download/f/9/d/f9d60cc9-7c2a-4077-b890-f6a54cc55775/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features

- `azcmagent logs` improvements:
  - Only the most recent log file for each component is collected by default. To collect all log files, use the new `--full` flag.
  - Journal logs for the agent services are now collected on Linux operating systems
  - Logs from extensions are now collected
- Agent telemetry is no longer sent to `dc.services.visualstudio.com`. You may be able to remove this URL from any firewall or proxy server rules if no other applications in your environment require it.
- Failed extension installs can now be retried without removing the old extension as long as the extension settings are different
- Increased the [resource limits](agent-overview.md#agent-resource-governance) for the Azure Update Manager extension on Linux to reduce downtime during update operations

### Fixed

- Improved logic for detecting machines running on Azure Stack HCI to reduce false positives
- Auto-registration of required resource providers only happens when they are unregistered
- Agent will now detect drift between the proxy settings of the command line tool and background services
- Fixed a bug with proxy bypass feature that caused the agent to incorrectly use the proxy server for bypassed URLs
- Improved error handling when extensions don't download successfully, fail validation, or have corrupt state files

## Version 1.23 - October 2022
,
"Download for [Windows](https://download.microsoft.com/download/3/9/8/398f6036-958d-43c4-ad7d-4576f1d860aa/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features

- The minimum PowerShell version required on Windows Server has been reduced to PowerShell 4.0
- The Windows agent installer is now compatible with systems that enforce a Microsoft publisher-based Windows Defender Application Control policy.
- Added support for Rocky Linux 8 and Debian 11.

### Fixed

- Tag values are correctly preserved when connecting a server and specifying multiple tags (fixes known issue from version 1.22).
- An issue preventing some users who tried authenticating with an identity from a different tenant than the tenant where the server is (will be) registered has been fixed.
- The `azcamgent check` command no longer validates CNAME records to reduce warnings that did not impact agent functionality.
- The agent will now try to obtain an access token for up to 5 minutes when authenticating with an Azure Active Directory service principal.
- Cloud presence checks now only run once at the time the `himds` service starts on the server to reduce local network traffic. If you live migrate your virtual machine to a different cloud provider, it will not reflect the new cloud provider until the service or computer has rebooted.
- Improved logging during the installation process.
- The install script for Windows now saves the MSI to the TEMP directory instead of the current directory.

## Version 1.22 - September 2022
,
"Download for [Windows](https://download.microsoft.com/download/1/3/5/135f1f2b-7b14-40f6-bceb-3af4ebadf434/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Known issues

- The 'connect' command uses the value of the last tag for all tags. You will need to fix the tags after onboarding to use the correct values.

### New features

- The default login flow for Windows computers now loads the local web browser to authenticate with Azure Active Directory instead of providing a device code. You can use the `--use-device-code` flag to return to the old behavior or [provide service principal credentials](onboard-service-principal.md) for a non-interactive authentication experience.
- If the resource group provided to `azcmagent connect` does not exist, the agent tries to create it and continue connecting the server to Azure.
- Added support for Ubuntu 22.04
- Added `--no-color` flag for all azcmagent commands to suppress the use of colors in terminals that do not support ANSI codes.

### Fixed

- The agent now supports Red Hat Enterprise Linux 8 servers that have FIPS mode enabled.
- Agent telemetry uses the proxy server when configured.
- Improved accuracy of network connectivity checks
- The agent retains extension allow and blocklists when switching the agent from monitoring mode to full mode. Use [azcmagent config clear](azcmagent-config.md) to reset individual configuration settings to the default state.

## Version 1.21 - August 2022
,
"Download for [Windows](https://download.microsoft.com/download/a/4/c/a4cce0a3-5830-4bd4-a4aa-a26794690e3d/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features

- `azcmagent connect` usability improvements:
  - The `--subscription-id (-s)` parameter now accepts friendly names in addition to subscription IDs
  - Automatic registration of any missing resource providers for first-time users (extra user permissions required to register resource providers)
  - Added a progress bar during onboarding
  - The onboarding script now supports both the yum and dnf package managers on RPM-based Linux systems
- You can now restrict the URLs used to download machine configuration (formerly Azure Policy guest configuration) packages by setting the `allowedGuestConfigPkgUrls` tag on the server resource and providing a comma-separated list of URL patterns to allow.

### Fixed

- Improved reliability when reporting extension installation failures to prevent extensions from staying in the "creating" state
- Support for retrieving metadata for Google Cloud Platform virtual machines when the agent uses a proxy server
- Improved network connection retry logic and error handling
- Linux only: resolves local escalation of privilege vulnerability [CVE-2022-38007](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2022-38007)

## Version 1.20 - July 2022
,
"Download for [Windows](https://download.microsoft.com/download/f/b/1/fb143ada-1b82-4d19-a125-40f2b352e257/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Known issues

- Some systems may incorrectly report their cloud provider as Azure Stack HCI.

### New features

- Added support for connecting the agent to the Microsoft Azure operated by 21Vianet cloud
- Added support for Debian 10
- Updates to the [instance metadata](agent-overview.md#instance-metadata) collected on each machine:
  - GCP VM OS is no longer collected
  - CPU logical core count is now collected
- Improved error messages and colorization

### Fixed

- Agents configured to use private endpoints correctly download extensions over the private endpoint
- Renamed the `--use-private-link` flag on [azcmagent check](azcmagent-check.md) to `--enable-pls-check` to more accurately represent its function

## Version 1.19 - June 2022
,
"Download for [Windows](https://download.microsoft.com/download/8/9/f/89f80a2b-32c3-43e8-b3b8-fce6cea8e2cf/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Known issues

- Agents configured to use private endpoints incorrectly download extensions from a public endpoint. [Upgrade the agent](manage-agent.md#upgrade-the-agent) to version 1.20 or later to restore correct functionality.
- Some systems may incorrectly report their cloud provider as Azure Stack HCI.

### New features

- When installed on a Google Compute Engine virtual machine, the agent detects and reports Google Cloud metadata in the "detected properties" of the Azure Arc-enabled servers resource. [Learn more](agent-overview.md#instance-metadata) about the new metadata.

### Fixed

- Resolved an issue that could cause the extension manager to hang during extension installation, update, and removal operations.
- Improved support for TLS 1.3

## Version 1.18 - May 2022
,
"Download for [Windows](https://download.microsoft.com/download/2/5/6/25685d0f-2895-4b80-9b1d-5ba53a46097f/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features

- You can configure the agent to operate in [monitoring mode](security-overview.md#agent-modes), which simplifies configuration of the agent for scenarios where you only want to use Arc for monitoring and security scenarios. This mode disables other agent functionality and prevents use of extensions that could make changes to the system (for example, the Custom Script Extension).
- VMs and hosts running on Azure Stack HCI now report the cloud provider as "HCI" when [Azure benefits are enabled](/azure-stack/hci/manage/azure-benefits#enable-azure-benefits).

### Fixed

- `systemd` is now an official prerequisite on Linux
- Guest configuration policies no longer create unnecessary files in the `/tmp` directory on Linux servers
- Improved reliability when extracting extensions and guest configuration policy packages
- Improved reliability for guest configuration policies that have child processes

## Version 1.17 - April 2022
,
"Download for [Windows](https://download.microsoft.com/download/a/3/4/a34bb824-d563-4ebf-bcbf-d5c5e7aaf4a3/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features

- The default resource name for AWS EC2 instances is now the instance ID instead of the hostname. To override this behavior, use the `--resource-name PreferredResourceName` parameter to specify your own resource name when connecting a server to Azure Arc.
- The network connectivity check during onboarding now verifies private endpoint configuration if you specify a private link scope. You can run the same check anytime by running [azcmagent check](azcmagent-check.md) with the new `--use-private-link` parameter.
- You can now disable the extension manager with the [local agent security controls](security-overview.md#local-agent-security-controls).

### Fixed

- If you attempt to run `azcmagent connect` on a server already connected to Azure, the resource ID is shown on the console to help you locate the resource in Azure.
- Extended the `azcmagent connect` timeout to 10 minutes.
- `azcmagent show` no longer prints the private link scope ID. You can check if the server is associated with an Azure Arc private link scope by reviewing the machine details in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_HybridCompute/AzureArcCenterBlade/servers), [CLI](/cli/azure/connectedmachine?view=azure-cli-latest#az-connectedmachine-show&preserve-view=true), [PowerShell](/powershell/module/az.connectedmachine/get-azconnectedmachine), or [REST API](/rest/api/hybridcompute/machines/get).
- `azcmagent logs` collects only the two most recent logs for each service to reduce ZIP file size.
- `azcmagent logs` collects Guest Configuration logs again.

## Version 1.16 - March 2022
,
"Download for [Windows](https://download.microsoft.com/download/e/a/4/ea4ea4a9-a947-4c94-995c-52eaf200f651/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Known issues

- `azcmagent logs` doesn't collect Guest Configuration logs in this release. You can locate the log directories in the [agent installation details](agent-overview.md#agent-resources).

### New features

- You can now granularly control allowed and blocked extensions on your server and disable the Guest Configuration agent. See [local agent controls to enable or disable capabilities](security-overview.md#local-agent-security-controls) for more information.

### Fixed

- The "Arc" proxy bypass keyword no longer includes Azure Active Directory endpoints on Linux
- The "Arc" proxy bypass keyword now includes Azure Storage endpoints for extension downloads

## Version 1.15 - February 2022
,
"Download for [Windows](https://download.microsoft.com/download/0/7/4/074a7a9e-1d86-4588-8297-b4e587ea0307/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Known issues

- The "Arc" proxy bypass feature on Linux includes some endpoints that belong to Azure Active Directory. As a result, if you only specify the "Arc" bypass rule, traffic destined for Azure Active Directory endpoints will not use the proxy server as expected.

### New features

- Network check improvements during onboarding:
  - Added TLS 1.2 check
  - Onboarding aborts when required networking endpoints are inaccessible
  - New `--skip-network-check` flag to override the new network check behavior
  - On-demand network check now available using `azcmagent check`
- [Proxy bypass](manage-agent.md#proxy-bypass-for-private-endpoints) is now available for customers using private endpoints. This feature allows you to send Azure Active Directory and Azure Resource Manager traffic through a proxy server, but skip the proxy server for traffic that should stay on the local network to reach private endpoints.
- Oracle Linux 8 is now supported

### Fixed

- Improved reliability when disconnecting the agent from Azure
- Improved reliability when installing and uninstalling the agent on Active Directory Domain Controllers
- Extended the device login timeout to 5 minutes
- Removed resource constraints for Azure Monitor Agent to support high throughput scenarios

## Version 1.14 - January 2022
,
"Download for [Windows](https://download.microsoft.com/download/e/8/1/e816ff18-251b-4160-b421-a4f8ab9c2bfe/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Fixed

- Fixed a state corruption issue in the extension manager that could cause extension operations to get stuck in transient states. Customers running agent version 1.13 are encouraged to upgrade to version 1.14 as soon as possible. If you continue to have issues with extensions after upgrading the agent, [submit a support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Version 1.13 - November 2021
,
"Download for [Windows](https://download.microsoft.com/download/8/a/9/8a963958-c446-4898-b635-58f3be58f251/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Known issues

- Extensions may get stuck in transient states (creating, deleting, updating) on Windows machines running the 1.13 agent in certain conditions. Microsoft recommends upgrading to agent version 1.14 as soon as possible to resolve this issue.

### Fixed

- Improved reliability when installing or upgrading the agent.

### New features

- Local configuration of agent settings now available using the [azcmagent config command](azcmagent-config.md).
- Support for configuring proxy server settings [using agent-specific settings](manage-agent.md#update-or-remove-proxy-settings) instead of environment variables.
- Extension operations execute faster using a new notification pipeline. You may need to adjust your firewall or proxy server rules to allow the new network addresses for this notification service (see [networking configuration](network-requirements.md)). The extension manager falls back to the existing behavior of checking every 5 minutes when the notification service is inaccessible.
- Detection of the AWS account ID, instance ID, and region information for servers running in Amazon Web Services.

## Version 1.12 - October 2021
,
"Download for [Windows](https://download.microsoft.com/download/9/e/e/9eec9acb-53f1-4416-9e10-afdd8e5281ad/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Fixed

- Improved reliability when validating signatures of extension packages.
- `azcmagent_proxy remove` command on Linux now correctly removes environment variables on Red Hat Enterprise Linux and related distributions.
- `azcmagent logs` now includes the computer name and timestamp to help disambiguate log files.

## Version 1.11 - September 2021
,
"Download for [Windows](https://download.microsoft.com/download/6/d/b/6dbf7141-0bf0-4b18-93f5-20de4018369d/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Fixed

- The agent now supports on Windows systems with the [System objects: Require case insensitivity for non-Windows subsystems](/windows/security/threat-protection/security-policy-settings/system-objects-require-case-insensitivity-for-non-windows-subsystems) policy set to Disabled.
- The guest configuration policy agent automatically retries if an error occurs during service start or restart events.
- Fixed an issue that prevented guest configuration audit policies from successfully executing on Linux machines.

## Version 1.10 - August 2021
,
"Download for [Windows](https://download.microsoft.com/download/1/c/4/1c4a0bde-0b6c-4c52-bdaf-04851c567f43/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Fixed

- The guest configuration policy agent can now configure and remediate system settings. Existing policy assignments continue to be audit-only. Learn more about the Azure Policy [guest configuration remediation options](../../governance/machine-configuration/remediation-options.md).
- The guest configuration policy agent now restarts every 48 hours instead of every 6 hours.

## Version 1.9 - July 2021
,
"Download for [Windows](https://download.microsoft.com/download/5/1/d/51d4340b-c927-4fc9-a0da-0bb8556338d0/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features
,
"Added support for the Indonesian language

### Fixed
,
"Fixed a bug that prevented extension management in the West US 3 region

## Version 1.8 - July 2021
,
"Download for [Windows](https://download.microsoft.com/download/1/7/5/1758f4ea-3114-4a20-9113-6bc5fff1c3e8/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features

- Improved reliability when installing the Azure Monitor Agent extension on Red Hat and CentOS systems
- Added agent-side enforcement of max resource name length (54 characters)
- Guest Configuration policy improvements:
  - Added support for PowerShell-based Guest Configuration policies on Linux operating systems
  - Added support for multiple assignments of the same Guest Configuration policy on the same server
  - Upgraded PowerShell Core to version 7.1 on Windows operating systems

### Fixed

- The agent continues running if it is unable to write service start/stop events to the Windows Application event log

## Version 1.7 - June 2021
,
"Download for [Windows](https://download.microsoft.com/download/6/1/c/61c69f31-8e22-4298-ac9d-47cd2090c81d/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features

- Improved reliability during onboarding:
  - Improved retry logic when HIMDS is unavailable
  - Onboarding continues instead of aborting if OS information isn't available
- Improved reliability when installing the Log Analytics agent for Linux extension on Red Hat and CentOS systems

## Version 1.6 - May 2021
,
"Download for [Windows](https://download.microsoft.com/download/d/3/d/d3df034a-d231-4ca6-9199-dbaa139b1eaf/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features

- Added support for SUSE Enterprise Linux 12
- Updated Guest Configuration agent to version 1.26.12.0 to include:
  - Policies execute in a separate process.
  - Added V2 signature support for extension validation.
  - Minor update to data logging.

## Version 1.5 - April 2021
,
"Download for [Windows](https://download.microsoft.com/download/1/d/4/1d44ef2e-dcc9-42e4-b76c-2da6a6e852af/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features

- Added support for Red Hat Enterprise Linux 8 and CentOS Linux 8.
- New `-useStderr` parameter to direct error and verbose output to stderr.
- New `-json` parameter to direct output results in JSON format (when used with -useStderr).
- Collect other instance metadata - Manufacturer, model, and cluster resource ID (for Azure Stack HCI nodes).

## Version 1.4 - March 2021
,
"Download for [Windows](https://download.microsoft.com/download/e/b/1/eb128465-8830-47b0-b89e-051eefd33f7c/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features

- Added support for private endpoints, which is currently in limited preview.
- Expanded list of exit codes for azcmagent.
- You can pass agent configuration parameters from a file with the `--config` parameter.
- Automatically detects the presence of Microsoft SQL Server on the server

### Fixed
,
"Network endpoint checks are now faster.

## Version 1.3 - December 2020
,
"Download for [Windows](https://download.microsoft.com/download/5/4/c/54c2afd8-e559-41ab-8aa2-cc39bc13156b/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features
,
"Added support for Windows Server 2008 R2 SP1.

### Fixed
,
"Resolved issue preventing the Custom Script Extension on Linux from installing successfully.

## Version 1.2 - November 2020
,
"Download for [Windows](https://download.microsoft.com/download/4/c/2/4c287d81-6657-4cd8-9254-881ae6a2d1f4/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Fixed
,
"Resolved issue where proxy configuration resets after upgrade on RPM-based distributions.

## Version 1.1 - October 2020

### Fixed

- Fixed proxy script to handle alternate GC daemon unit file location.
- GuestConfig agent reliability changes.
- GuestConfig agent support for US Gov Virginia region.
- GuestConfig agent extension report messages to be more verbose if there is a failure.

## Version 1.0 - September 2020
,
"This version is the first generally available release of the Azure Connected Machine Agent.

### Plan for change

- Support for preview agents (all versions older than 1.0) will be removed in a future service update.
- Removed support for fallback endpoint `.azure-automation.net`. If you have a proxy, you need to allow the endpoint `*.his.arc.azure.com`.
- VM extensions can't be installed or modified from Azure Arc if the agent detects it's running in an Azure VM. This is to avoid conflicting extension operations being performed from the virtual machine's **Microsoft.Compute** and **Microsoft.HybridCompute** resource. Use the **Microsoft.Compute** resource for the machine for all extension operations.
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
