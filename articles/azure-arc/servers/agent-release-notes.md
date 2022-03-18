---
title: What's new with Azure Arc-enabled servers agent
description: This article has release notes for Azure Arc-enabled servers agent. For many of the summarized issues, there are links to more details.
ms.topic: overview
ms.date: 03/17/2022
ms.custom: references_regions
---

# What's new with Azure Arc-enabled servers agent

The Azure Connected Machine agent receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes

This page is updated monthly, so revisit it regularly. If you're looking for items older than six months, you can find them in [archive for What's new with Azure Arc-enabled servers agent](agent-release-notes-archive.md).

## Version 1.16 - March 2022

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

## Next steps

- Before evaluating or enabling Azure Arc-enabled servers across multiple hybrid machines, review [Connected Machine agent overview](agent-overview.md) to understand requirements, technical details about the agent, and deployment methods.
- Review the [Planning and deployment guide](plan-at-scale-deployment.md) to plan for deploying Azure Arc-enabled servers at any scale and implement centralized management and monitoring.
