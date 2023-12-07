---
title: What's new with Azure Connected Machine agent
description: This article has release notes for Azure Connected Machine agent. For many of the summarized issues, there are links to more details.
ms.topic: overview
ms.date: 09/11/2023
ms.custom: references_regions
---

# What's new with Azure Connected Machine agent

The Azure Connected Machine agent receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes

This page is updated monthly, so revisit it regularly. If you're looking for items older than six months, you can find them in [archive for What's new with Azure Connected Machine agent](agent-release-notes-archive.md).

## Version 1.36 - November 2023

Download for [Windows](https://download.microsoft.com/download/5/e/9/5e9081ed-2ee2-4b3a-afca-a8d81425bcce/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features

- [azcmagent show](azcmagent-show.md) now reports extended security license status on Windows Server 2012 server machines.
- Introduced a new [proxy bypass](manage-agent.md#proxy-bypass-for-private-endpoints) option, `ArcData`, that covers the SQL Server enabled by Azure Arc endpoints. This will enable you to use a private endpoint with Azure Arc-enabled servers with the public endpoints for SQL Server enabled by Azure Arc.
- The [CPU limit for extension operations](agent-overview.md#agent-resource-governance) on Linux is now 30%. This increase will help improve reliability of extension install, upgrade and uninstall operations.
- Older extension manager and machine configuration agent logs are automatically zipped to reduce disk space requirements.
- New executable names for the extension manager (`gc_extension_service`) and machine configuration (`gc_arc_service`) agents on Windows to help you distinguish the two services. For more information, see [Windows agent installation details](./agent-overview.md#windows-agent-installation-details).

### Bug fixes

- [azcmagent connect](azcmagent-connect.md) now uses the latest API version when creating the Azure Arc-enabled server resource to ensure Azure policies targeting new properties can take effect.
- Upgraded the OpenSSL library and PowerShell runtime shipped with the agent to include the latest security fixes.
- Fixed an issue that could prevent the agent from reporting the correct product type on Windows machines.
- Improved handling of upgrades when the previously installed extension version was not in a successful state.

## Version 1.35 - October 2023

Download for [Windows](https://download.microsoft.com/download/e/7/0/e70b1753-646e-4aea-bac4-40187b5128b0/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features

- The Linux installation script now downloads supporting assets with either wget or curl, depending on which tool is available on the system
- [azcmagent connect](azcmagent-connect.md) and [azcmagent disconnect](azcmagent-disconnect.md) now accept the `--user-tenant-id` parameter to enable Lighthouse users to use a credential from their tenant and onboard a server to a different tenant.
- You can configure the extension manager to run, without allowing any extensions to be installed, by configuring the allowlist to `Allow/None`. This supports Windows Server 2012 ESU scenarios where the extension manager is required for billing purposes but doesn't need to allow any extensions to be installed. Learn more about [local security controls](security-overview.md#local-agent-security-controls).

### Fixed

- Improved reliability when installing Microsoft Defender for Endpoint on Linux by increasing [available system resources](agent-overview.md#agent-resource-governance) and extending the timeout
- Better error handling when a user specifies an invalid location name to [azcmagent connect](azcmagent-connect.md)
- Fixed a bug where clearing the `incomingconnections.enabled` [configuration setting](azcmagent-config.md) would show `<nil>` as the previous value
- Security fix for the extension allowlist and blocklist feature to address an issue where an invalid extension name could impact enforcement of the lists.

## Version 1.34 - September 2023

Download for [Windows](https://download.microsoft.com/download/b/3/2/b3220316-13db-4f1f-babf-b1aab33b364f/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### New features

- [Extended Security Updates for Windows Server 2012 and 2012 R2](prepare-extended-security-updates.md) can be purchased and enabled through Azure Arc. If your server is already running the Azure Connected Machine agent, [upgrade to agent version 1.34](manage-agent.md#upgrade-the-agent) or later to take advantage of this new capability.
- Additional system metadata is collected to enhance your device inventory in Azure:
  - Total physical memory
  - Additional processor information
  - Serial number
  - SMBIOS asset tag
- Network requests to Microsoft Entra ID (formerly Azure Active Directory) now use `login.microsoftonline.com` instead of `login.windows.net`

### Fixed

- Better handling of disconnected agent scenarios in the extension manager and policy engine.

## Version 1.33 - August 2023

Download for [Windows](https://download.microsoft.com/download/0/c/7/0c7a484b-e29e-42f9-b3e9-db431df2e904/AzureConnectedMachineAgent.msi) or [Linux](manage-agent.md#installing-a-specific-version-of-the-agent)

### Security fix

Agent version 1.33 contains a fix for [CVE-2023-38176](https://msrc.microsoft.com/update-guide/en-US/vulnerability/CVE-2023-38176), a local elevation of privilege vulnerability. Microsoft recommends upgrading all agents to version 1.33 or later to mitigate this vulnerability. Azure Advisor can help you [identify servers that need to be upgraded](https://portal.azure.com/#view/Microsoft_Azure_Expert/RecommendationListBlade/recommendationTypeId/9d5717d2-4708-4e3f-bdda-93b3e6f1715b/recommendationStatus). Learn more about CVE-2023-38176 in the [Security Update Guide](https://msrc.microsoft.com/update-guide/en-US/vulnerability/CVE-2023-38176).

### Known issue

[azcmagent check](azcmagent-check.md) validates a new endpoint in this release: `<geography>-ats.his.arc.azure.com`. This endpoint is reserved for future use and not required for the Azure Connected Machine agent to operate successfully. However, if you're using a private endpoint, this endpoint will fail the network connectivity check. You can safely ignore this endpoint in the results and should instead confirm that all other endpoints are reachable.

This endpoint will be removed from `azcmagent check` in a future release.

### Fixed

- Fixed an issue that could cause a VM extension to disappear in Azure Resource Manager if it's installed with the same settings twice. After upgrading to agent version 1.33 or later, reinstall any missing extensions to restore the information in Azure Resource Manager.
- You can now set the [agent mode](security-overview.md#agent-modes) before connecting the agent to Azure.
- The agent now responds to instance metadata service (IMDS) requests even when the connection to Azure is temporarily unavailable.

## Next steps

- Before evaluating or enabling Azure Arc-enabled servers across multiple hybrid machines, review [Connected Machine agent overview](agent-overview.md) to understand requirements, technical details about the agent, and deployment methods.
- Review the [Planning and deployment guide](plan-at-scale-deployment.md) to plan for deploying Azure Arc-enabled servers at any scale and implement centralized management and monitoring.
