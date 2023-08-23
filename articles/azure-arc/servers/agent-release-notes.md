---
title: What's new with Azure Connected Machine agent
description: This article has release notes for Azure Connected Machine agent. For many of the summarized issues, there are links to more details.
ms.topic: overview
ms.date: 07/11/2023
ms.custom: references_regions
---

# What's new with Azure Connected Machine agent

The Azure Connected Machine agent receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes

This page is updated monthly, so revisit it regularly. If you're looking for items older than six months, you can find them in [archive for What's new with Azure Connected Machine agent](agent-release-notes-archive.md).

## Version 1.33 - August 2023

Download for [Windows](https://download.microsoft.com/download/0/c/7/0c7a484b-e29e-42f9-b3e9-db431df2e904/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Security fix

Agent version 1.33 contains a fix for [CVE-2023-38176](https://msrc.microsoft.com/update-guide/en-US/vulnerability/CVE-2023-38176), a local elevation of privilege vulnerability. Microsoft recommends upgrading all agents to version 1.33 or later to mitigate this vulnerability. Azure Advisor can help you [identify servers that need to be upgraded](https://portal.azure.com/#view/Microsoft_Azure_Expert/RecommendationListBlade/recommendationTypeId/9d5717d2-4708-4e3f-bdda-93b3e6f1715b/recommendationStatus). Learn more about CVE-2023-38176 in the [Security Update Guide](https://msrc.microsoft.com/update-guide/en-US/vulnerability/CVE-2023-38176).

### Fixed

- Fixed an issue that could cause a VM extension to disappear in Azure Resource Manager if it's installed with the same settings twice. After upgrading to agent version 1.33 or later, reinstall any missing extensions to restore the information in Azure Resource Manager.
- You can now set the [agent mode](security-overview.md#agent-modes) before connecting the agent to Azure.
- The agent now responds to instance metadata service (IMDS) requests even when the connection to Azure is temporarily unavailable.

## Version 1.32 - July 2023

Download for [Windows](https://download.microsoft.com/download/7/e/5/7e51205f-a02e-4fbe-94fe-f36219be048c/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features

- Added support for the Debian 12 operating system
- [azcmagent show](azcmagent-show.md) now reflects the "Expired" status when a machine has been disconnected long enough for the managed identity to expire. Previously, the agent only showed "Disconnected" while the Azure portal and API showed the correct state, "Expired."

### Fixed

- Fixed an issue that could result in high CPU usage if the agent was unable to send telemetry to Azure.
- Improved local logging when there are network communication errors

## Version 1.31 - June 2023

Download for [Windows](https://download.microsoft.com/download/2/6/e/26e2b001-1364-41ed-90b0-1340a44ba409/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Known issue

The first release of agent version 1.31 had a known issue affecting customers using proxy servers. The issue displays as  `AZCM0026: Network Error` and a message about "no IP addresses found" when connecting a server to Azure Arc using a proxy server. A newer version of agent 1.31 was released on June 14, 2023 that addresses this issue.

To check if you're running the latest version of the Azure connected machine agent, navigate to the server in the Azure portal or run `azcmagent show` from a terminal on the server itself and look for the "Agent version." The table below shows the version numbers for the first and patched releases of agent 1.31.

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
- Increased the [resource limits](agent-overview.md#agent-resource-governance) for the Update Management Center extension for Linux, Microsoft Defender Endpoint for Linux, and Azure Security Agent for Linux to prevent timeouts during installation
- [azcmagent disconnect](azcmagent-disconnect.md) now closes any active SSH or Windows Admin Center connections
- Improved output of the [azcmagent check](azcmagent-check.md) command
- Better handling of spaces in the `--location` parameter of [azcmagent connect](azcmagent-connect.md)

## Version 1.30 - May 2023

Download for [Windows](https://download.microsoft.com/download/7/7/9/779eae73-a12b-4170-8c5e-abec71bc14cf/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features

- Introduced a scheduled task that checks for agent updates on a daily basis. Currently, the update mechanism is inactive and no changes are made to your server even if a newer agent version is available. In the future, you'll be able to schedule updates of the Azure Connected Machine agent from Azure. For more information, see [Automatic agent upgrades](manage-agent.md#automatic-agent-upgrades).

### Fixed

- Resolved an issue that could cause the agent to go offline after rotating its connectivity keys.
- `azcmagent show` no longer shows an incomplete resource ID or Azure portal page URL when the agent isn't configured.

## Next steps

- Before evaluating or enabling Azure Arc-enabled servers across multiple hybrid machines, review [Connected Machine agent overview](agent-overview.md) to understand requirements, technical details about the agent, and deployment methods.
- Review the [Planning and deployment guide](plan-at-scale-deployment.md) to plan for deploying Azure Arc-enabled servers at any scale and implement centralized management and monitoring.
