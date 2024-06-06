---
title: Extensions security
description: Extensions security for Azure Arc-enabled servers.
ms.topic: conceptual
ms.date: 06/06/2024
---

# Extensions security

This article describes the fundamentals of VM extensions for Azure Arc-enabled servers and details how extension settings can be customized. It also covers the execution of scripts using the extension manager and the option to disable the extension manager if extensions aren't needed.

## Extension basics

VM extensions for Azure Arc-enabled servers are optional add-ons that enable other functionality, such as monitoring, patch management, and script execution. Extensions are published by Microsoft and select third parties from the Azure Marketplace and stored in Microsoft-managed storage accounts. All extensions are scanned for malware as part of the publishing process. The extensions for Azure Arc-enabled servers are identical to those available for Azure VMs, ensuring consistency across your operating environments.

Extensions are downloaded directly from Azure Storage (`*.blob.core.windows.net`) at the time they are installed or upgraded, unless you have configured private endpoints. The storage accounts regularly change and can’t be predicted in advance. When private endpoints are used, extensions are proxied via the regional URL for the Azure Arc service instead.

A digitally signed catalog file is downloaded separately from the extension package and used to verify the integrity of each extension before the extension manager opens or executes the extension package. If the downloaded ZIP file for the extension doesn’t match the contents in the catalog file, the extension operation will be aborted.

Extensions may take settings to customize or configure the installation, such as proxy URLs or API keys to connect a monitoring agent to its cloud service. Extension settings come in two flavors: regular settings and protected settings. Protected settings aren’t persisted in Azure and are encrypted at rest on your local machine.

All extension operations originate from Azure through an API call, CLI, PowerShell, or Portal action. This design ensures that any action to install, update, or upgrade an extension on a server gets logged in the Azure Activity Log. The Azure Connected Machine agent does allow extensions to be removed locally for troubleshooting and cleanup purposes. However, if the extension is removed locally and the service still expects the machine to have the extension installed, it will be reinstalled the next time the extension manager syncs with Azure.

## Script execution

The extension manager can be used to run scripts on machines using the Custom Script Extension or Run Command. By default, these scripts will run in the extension manager’s user context – Local System on Windows or root on Linux – meaning these scripts will have unrestricted access to the machine. If you do not intend to use these features, you can block them using an allowlist or blocklist. An example is provided in the next section.

## Allowlists and blocklists

The Azure Connected Machine agent supports an allowlist and blocklist to restrict which extensions can be installed on your machine. Allowlists are exclusive, meaning that only the specific extensions you include in the list can be installed. Blocklists are exclusive, meaning anything except those extensions can be installed. Allowlists are preferable to blocklists because they inherently block any new extensions that become available in the future.
Allowlists and blocklists are configured locally on a per-server basis. This ensures that nobody, not even a user with Owner or Global Administrator permissions in Azure, can override your security rules by trying to install an unauthorized extension. If someone tries to install an unauthorized extension, the extension manager will refuse to install it and mark the extension installation report a failure to Azure.
Allowlists and blocklists can be configured any time after the agent is installed, including before the agent is connected to Azure.

If no allowlist or blocklist is configured on the agent, all extensions are allowed.

Here is an example blocklist that blocks all extensions with the capability of running arbitrary scripts:

```
azcmagent config set extensions.blocklist “Microsoft.Cplat.Core/RunCommandHandlerWindows, Microsoft.Cplat.Core/RunCommandHandlerLinux,Microsoft.Compute/CustomScriptExtension,Microsoft.Azure.Extensions/CustomScript,Microsoft.Azure.Automation.HybridWorker/HybridWorkerForWindows,Microsoft.Azure.Automation.HybridWorkerForLinux,Microsoft.EnterpriseCloud.Monitoring/MicrosoftMonitoringAgent, Microsoft.EnterpriseCloud.Monitoring/OMSAgentForLinux”
```

Azure Policies can also be used to restrict which extensions can be installed. Azure Policies have the advantage of being configurable in the cloud and not requiring a change on each individual server if you need to change the list of approved extensions. However, anyone with permission to modify policy assignments could override or remove this protection. If you choose to use Azure Policies to restrict extensions, make sure you review which accounts in your organization have permission to edit policy assignments and that appropriate change control measures are in place.

## Disabling the extension manager

If you don’t need to use extensions with Azure Arc, you can also disable the extension manager entirely. You can disable the extension manager with the following command (run locally on each machine):

`azcmagent config set extensions.enabled false`








