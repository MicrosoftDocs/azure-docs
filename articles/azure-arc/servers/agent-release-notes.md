---
title: What's new with Azure Arc enabled servers agent
description: This article has release notes for Azure Arc enabled servers agent. For many of the summarized issues, there are links to more details.
ms.topic: conceptual
ms.date: 03/15/2021
---

# What's new with Azure Arc enabled servers agent

The Azure Arc enabled servers Connected Machine agent receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes

## March 2021

Version 1.4

## New feature

- Added support for private endpoints.
- Expanded list of exit codes for azcmagent.
- Agent configuration parameters can now be read from a file with the --config parameter.

## Fixed

Network endpoint checks are now faster.

## December 2020

Version: 1.3

### New feature

Added support for Windows Server 2008 R2.

### Fixed

Resolved issue preventing the Custom Script Extension on Linux from installing successfully.

## November 2020

Version: 1.2

### Fixed

Resolved issue where proxy configuration could be lost after upgrade on RPM-based distributions.

## October 2020

Version: 1.1

### Fixed

- Fixed proxy script to handle alternate GC daemon unit file location.
- GuestConfig agent reliability changes.
- GuestConfig agent support for US Gov Virginia region.
- GuestConfig agent extension report messages to be more verbose if there is a failure.

## September 2020

Version: 1.0 (General Availability)

### Plan for change

- Support for preview agents (all versions older than 1.0) will be removed in a future service update.
- Removed support for fallback endpoint `.azure-automation.net`. If you have a proxy, you need to allow the endpoint `*.his.arc.azure.com`.
- If the Connected Machine agent is installed on a virtual machine hosted in Azure, VM extensions can't be installed or modified from the Arc enabled servers resource. This is to avoid conflicting extension operations being performed from the virtual machine's **Microsoft.Compute** and **Microsoft.HybridCompute** resource. Use the **Microsoft.Compute** resource for the machine for all extension operations.
- Name of Guest Configuration process has changed, from *gcd* to *gcad* on Linux, and *gcservice* to *gcarcservice* on Windows.

### New feature

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

## August 2020

Version: 0.11

- This release previously announced support for Ubuntu 20.04. Because some Azure VM extensions don't support Ubuntu 20.04, support for this version of Ubuntu is being removed.

- Reliability improvements for extension deployments.

### Known issues

If you are using an older version of the Linux agent and it's configured to use a proxy server, you need to reconfigure the proxy server setting after the upgrade. To do this, run `sudo azcmagent_proxy add http://proxyserver.local:83`.

## Next steps

Before evaluating or enabling Arc enabled servers across multiple hybrid machines, review [Connected Machine agent overview](agent-overview.md) to understand requirements, technical details about the agent, and deployment methods.