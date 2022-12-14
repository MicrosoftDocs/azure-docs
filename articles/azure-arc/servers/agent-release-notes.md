---
title: What's new with Azure Arc-enabled servers agent
description: This article has release notes for Azure Arc-enabled servers agent. For many of the summarized issues, there are links to more details.
ms.topic: overview
ms.date: 11/15/2022
ms.custom: references_regions
---

# What's new with Azure Arc-enabled servers agent

The Azure Connected Machine agent receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes

This page is updated monthly, so revisit it regularly. If you're looking for items older than six months, you can find them in [archive for What's new with Azure Arc-enabled servers agent](agent-release-notes-archive.md).

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

## Version 1.23 - October 2022

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

### Known issues

- When connecting a server and specifying multiple tags, the value of the last tag is used for all tags. You will need to fix the tags after onboarding to use the correct values.

### New features

- The default login flow for Windows computers now loads the local web browser to authenticate with Azure Active Directory instead of providing a device code. You can use the `--use-device-code` flag to return to the old behavior or [provide service principal credentials](onboard-service-principal.md) for a non-interactive authentication experience.
- If the resource group provided to `azcmagent connect` does not exist, the agent will try to create it and continue connecting the server to Azure.
- Added support for Ubuntu 22.04
- Added `--no-color` flag for all azcmagent commands to suppress the use of colors in terminals that do not support ANSI codes.

### Fixed

- The agent can now be installed on Red Hat Enterprise Linux 8 servers that have FIPS mode enabled.
- Agent telemetry is now sent through the proxy server if one is configured.
- Improved accuracy of network connectivity checks
- When switching the agent from monitoring mode to full mode, existing restrictions are now retained. Use [azcmagent clear](manage-agent.md#config) to reset individual configuration settings to the default state.

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
- Linux only: resolves local escalation of privilege vulnerability [CVE-2022-38007](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2022-38007)

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

## Next steps

- Before evaluating or enabling Azure Arc-enabled servers across multiple hybrid machines, review [Connected Machine agent overview](agent-overview.md) to understand requirements, technical details about the agent, and deployment methods.
- Review the [Planning and deployment guide](plan-at-scale-deployment.md) to plan for deploying Azure Arc-enabled servers at any scale and implement centralized management and monitoring.
