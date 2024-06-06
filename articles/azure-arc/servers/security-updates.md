---
title: Security updates
description: Agent and extension updates for Azure Arc-enabled servers.
ms.topic: conceptual
ms.date: 06/06/2024
---

# Agent and extension updates

This article describes the update process for the Azure Connected Machine agent and its extensions. It outlines the release schedule, update methods for Windows and Linux machines, and the importance of keeping the agent up to date for security and performance reasons. Additionally, it explains how automatic and manual extension updates are handled, including the default settings for automatic upgrades and options for managing these upgrades manually using various tools.

## Agent updates

A new version of the Azure Connected Machine agent is typically released every month. There isn’t an exact schedule of when the updates will be available, but you should expect to check for and apply updates on a monthly basis. The documentation contains [a list of all the new releases](/azure/azure-arc/servers/agent-release-notes) including what specific changes are included in them. Most updates include security, performance and quality fixes. Some also include new features and functionality as the product continues to evolve. In the event a hotfix is required to address an issue with a release, it will be released as a new agent version and available via the same means as a regular agent release.

The Azure Connected Machine agent does not update itself. You will need to update it using your preferred update management tool. For Windows machines, updates are delivered through Microsoft Update. Standalone servers should opt-in to Microsoft Updates (“receive updates for other Microsoft products”). If your organization uses Windows Server Update Services to cache and approve updates locally, your WSUS admin will need to synchronize and approve updates for the “Azure Connected Machine Agent” product.

Linux updates are published to packages.microsoft.com. Your package management software (apt, yum, dnf, zypper, etc.) should show “azcmagent” updates alongside all your other system packages. Learn more about [upgrading Linux agents](/azure/azure-arc/servers/manage-agent?tabs=linux-apt).

Microsoft recommends staying up to date with the latest agent version whenever possible. If your maintenance windows are less frequent, Microsoft will support all agent versions released within the last 12 months. However, since the agent updates include security fixes, it’s recommended to update as frequently as possible.

If you are looking for a patch management tool to orchestrate updates of the Azure Connected Machine agent on both Windows and Linux, as well as any other system updates, consider Azure Update Manager. 

## Extension updates

### Automatic extension updates

By default, every extension you deploy to an Azure Arc-enabled server will have automatic extension upgrades enabled. If the extension publisher supports this feature, new versions of the extension will automatically be installed within 60 days of the new version becoming available. Automatic extension upgrades follow a safe deployment practice, meaning that only a fraction of all extensions are updated at any one time, and rollouts will continue slowly across regions and subscriptions until every extension has been updated.

There are no granular controls over automatic extension upgrades. You will always be upgraded to the most recent version of the extension and can’t choose when the upgrade will happen. The extension manager has [built-in resource governance](/azure/azure-arc/servers/agent-overview) to ensure that an extension upgrade will not consume too much of the system’s CPU and interfere with your workloads during the upgrade.

If you do not want to use automatic upgrades for extensions, you can disable them on a per-extension, per-server basis using the [Azure portal, CLI, or PowerShell](/azure/azure-arc/servers/manage-automatic-vm-extension-upgrade?tabs=azure-portal).

### Manual extension updates

For extensions that don’t support automatic upgrades or have automatic upgrades disabled, you can use the Azure Portal, CLI, or PowerShell to upgrade extensions to the newest version. The CLI and PowerShell commands also support downgrading an extension, in case you need to revert to an earlier version.



