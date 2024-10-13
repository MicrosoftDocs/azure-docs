---
title: Extensions security
description: Extensions security for Azure Arc-enabled servers.
ms.topic: conceptual
ms.date: 06/06/2024
---

# Extensions security

This article describes the fundamentals of [VM extensions](manage-vm-extensions.md) for Azure Arc-enabled servers and details how extension settings can be customized.

## Extension basics

VM extensions for Azure Arc-enabled servers are optional add-ons that enable other functionality, such as monitoring, patch management, and script execution. Extensions are published by Microsoft and select third parties from the Azure Marketplace and stored in Microsoft-managed storage accounts. All extensions are scanned for malware as part of the publishing process. The extensions for Azure Arc-enabled servers are identical to those available for Azure VMs, ensuring consistency across your operating environments.

Extensions are downloaded directly from Azure Storage (`*.blob.core.windows.net`) at the time they are installed or upgraded, unless you have configured private endpoints. The storage accounts regularly change and can’t be predicted in advance. When private endpoints are used, extensions are proxied via the regional URL for the Azure Arc service instead.

A digitally signed catalog file is downloaded separately from the extension package and used to verify the integrity of each extension before the extension manager opens or executes the extension package. If the downloaded ZIP file for the extension doesn’t match the contents in the catalog file, the extension operation will be aborted.

Extensions may take settings to customize or configure the installation, such as proxy URLs or API keys to connect a monitoring agent to its cloud service. Extension settings come in two flavors: regular settings and protected settings. Protected settings aren’t persisted in Azure and are encrypted at rest on your local machine.

All extension operations originate from Azure through an API call, CLI, PowerShell, or Portal action. This design ensures that any action to install, update, or upgrade an extension on a server gets logged in the Azure Activity Log. The Azure Connected Machine agent does allow extensions to be removed locally for troubleshooting and cleanup purposes. However, if the extension is removed locally and the service still expects the machine to have the extension installed, it will be reinstalled the next time the extension manager syncs with Azure.

## Script execution

The extension manager can be used to run scripts on machines using the Custom Script Extension or Run Command. By default, these scripts will run in the extension manager’s user context – Local System on Windows or root on Linux – meaning these scripts will have unrestricted access to the machine. If you do not intend to use these features, you can block them using an allowlist or blocklist. An example is provided in the next section.

## Local agent security controls

Starting with agent version 1.16, you can optionally limit the extensions that can be installed on your server and disable Guest Configuration. These controls can be useful when connecting servers to Azure for a single purpose, such as collecting event logs, without allowing other management capabilities to be used on the server.

These security controls can only be configured by running a command on the server itself and cannot be modified from Azure. This approach preserves the server admin's intent when enabling remote management scenarios with Azure Arc, but also means that changing the setting is more difficult if you later decide to change them. This feature is intended for sensitive servers (for example, Active Directory Domain Controllers, servers that handle payment data, and servers subject to strict change control measures). In most other cases, it's not necessary to modify these settings.

## Allowlists and blocklists

The Azure Connected Machine agent supports an allowlist and blocklist to restrict which extensions can be installed on your machine. Allowlists are exclusive, meaning that only the specific extensions you include in the list can be installed. Blocklists are exclusive, meaning anything except those extensions can be installed. Allowlists are preferable to blocklists because they inherently block any new extensions that become available in the future.
Allowlists and blocklists are configured locally on a per-server basis. This ensures that nobody, not even a user with Owner or Global Administrator permissions in Azure, can override your security rules by trying to install an unauthorized extension. If someone tries to install an unauthorized extension, the extension manager will refuse to install it and mark the extension installation report a failure to Azure.
Allowlists and blocklists can be configured any time after the agent is installed, including before the agent is connected to Azure.

If no allowlist or blocklist is configured on the agent, all extensions are allowed.

The most secure option is to explicitly allow the extensions you expect to be installed. Any extension not in the allowlist is automatically blocked. To configure the Azure Connected Machine agent to allow only the Azure Monitor Agent for Linux, run the following command on each server:

```bash
azcmagent config set extensions.allowlist "Microsoft.Azure.Monitor/AzureMonitorLinuxAgent"
```

Here is an example blocklist that blocks all extensions with the capability of running arbitrary scripts:

```
azcmagent config set extensions.blocklist “Microsoft.Cplat.Core/RunCommandHandlerWindows, Microsoft.Cplat.Core/RunCommandHandlerLinux,Microsoft.Compute/CustomScriptExtension,Microsoft.Azure.Extensions/CustomScript,Microsoft.Azure.Automation.HybridWorker/HybridWorkerForWindows,Microsoft.Azure.Automation.HybridWorkerForLinux,Microsoft.EnterpriseCloud.Monitoring/MicrosoftMonitoringAgent, Microsoft.EnterpriseCloud.Monitoring/OMSAgentForLinux”
```

Specify extensions with their publisher and type, separated by a forward slash `/`. See the list of the [most common extensions](manage-vm-extensions.md) in the docs or list the VM extensions already installed on your server in the [portal](manage-vm-extensions-portal.md#list-extensions-installed), [Azure PowerShell](manage-vm-extensions-powershell.md#list-extensions-installed), or [Azure CLI](manage-vm-extensions-cli.md#list-extensions-installed).

The table describes the behavior when performing an extension operation against an agent that has the allowlist or blocklist configured.

| Operation | In the allowlist | In the blocklist | In both the allowlist and blocklist | Not in any list, but an allowlist is configured |
|--|--|--|--|
| Install extension | Allowed | Blocked | Blocked | Blocked |
| Update (reconfigure) extension | Allowed | Blocked | Blocked | Blocked |
| Upgrade extension | Allowed | Blocked | Blocked | Blocked |
| Delete extension | Allowed | Allowed | Allowed | Allowed |

> [!IMPORTANT]
> If an extension is already installed on your server before you configure an allowlist or blocklist, it won't automatically be removed. It's your responsibility to delete the extension from Azure to fully remove it from the machine. Delete requests are always accepted to accommodate this scenario. Once deleted, the allowlist and blocklist determine whether or not to allow future install attempts.

Starting with agent version 1.35, there is a special allowlist value `Allow/None`, which instructs the extension manager to run, but not allow any extensions to be installed. This is the recommended configuration when using Azure Arc to deliver Windows Server 2012 Extended Security Updates (ESU) without intending to use any other extensions.

```bash
azcmagent config set extensions.allowlist "Allow/None"
```
Azure Policies can also be used to restrict which extensions can be installed. Azure Policies have the advantage of being configurable in the cloud and not requiring a change on each individual server if you need to change the list of approved extensions. However, anyone with permission to modify policy assignments could override or remove this protection. If you choose to use Azure Policies to restrict extensions, make sure you review which accounts in your organization have permission to edit policy assignments and that appropriate change control measures are in place.

## Locked down machine best practices

When configuring the Azure Connected Machine agent with a reduced set of capabilities, it's important to consider the mechanisms that someone could use to remove those restrictions and implement appropriate controls. Anybody capable of running commands as an administrator or root user on the server can change the Azure Connected Machine agent configuration. Extensions and guest configuration policies execute in privileged contexts on your server, and as such might be able to change the agent configuration. If you apply local agent security controls to lock down the agent, Microsoft recommends the following best practices to ensure only local server admins can update the agent configuration:

* Use allowlists for extensions instead of blocklists whenever possible.
* Don't include the Custom Script Extension in the extension allowlist to prevent execution of arbitrary scripts that could change the agent configuration.
* Disable Guest Configuration to prevent the use of custom Guest Configuration policies that could change the agent configuration.

### Example configuration for monitoring and security scenarios

It's common to use Azure Arc to monitor your servers with Azure Monitor and Microsoft Sentinel and secure them with Microsoft Defender for Cloud. This section contains examples for how to lock down the agent to only support monitoring and security scenarios.

#### Azure Monitor Agent only

On your Windows servers, run the following commands in an elevated command console:

```powershell
azcmagent config set extensions.allowlist "Microsoft.Azure.Monitor/AzureMonitorWindowsAgent"
azcmagent config set guestconfiguration.enabled false
```

On your Linux servers, run the following commands:

```bash
sudo azcmagent config set extensions.allowlist "Microsoft.Azure.Monitor/AzureMonitorLinuxAgent"
sudo azcmagent config set guestconfiguration.enabled false
```

#### Log Analytics and dependency (Azure Monitor VM Insights) only

This configuration is for the legacy Log Analytics agents and the dependency agent.

On your Windows servers, run the following commands in an elevated console:

```powershell
azcmagent config set extensions.allowlist "Microsoft.EnterpriseCloud.Monitoring/MicrosoftMonitoringAgent,Microsoft.Azure.Monitoring.DependencyAgent/DependencyAgentWindows"
azcmagent config set guestconfiguration.enabled false
```

On your Linux servers, run the following commands:

```bash
sudo azcmagent config set extensions.allowlist "Microsoft.EnterpriseCloud.Monitoring/OMSAgentForLinux,Microsoft.Azure.Monitoring.DependencyAgent/DependencyAgentLinux"
sudo azcmagent config set guestconfiguration.enabled false
```

#### Monitoring and security

Microsoft Defender for Cloud deploys extensions on your server to identify vulnerable software on your server and enable Microsoft Defender for Endpoint (if configured). Microsoft Defender for Cloud also uses Guest Configuration for its regulatory compliance feature. Since a custom Guest Configuration assignment could be used to undo the agent limitations, you should carefully evaluate whether or not you need the regulatory compliance feature and, as a result, Guest Configuration to be enabled on the machine.

On your Windows servers, run the following commands in an elevated command console:

```powershell
azcmagent config set extensions.allowlist "Microsoft.EnterpriseCloud.Monitoring/MicrosoftMonitoringAgent,Qualys/WindowsAgent.AzureSecurityCenter,Microsoft.Azure.AzureDefenderForServers/MDE.Windows,Microsoft.Azure.AzureDefenderForSQL/AdvancedThreatProtection.Windows"
azcmagent config set guestconfiguration.enabled true
```

On your Linux servers, run the following commands:

```bash
sudo azcmagent config set extensions.allowlist "Microsoft.EnterpriseCloud.Monitoring/OMSAgentForLinux,Qualys/LinuxAgent.AzureSecurityCenter,Microsoft.Azure.AzureDefenderForServers/MDE.Linux"
sudo azcmagent config set guestconfiguration.enabled true
```

## Agent modes

A simpler way to configure local security controls for monitoring and security scenarios is to use the *monitor mode*, available with agent version 1.18 and newer. Modes are pre-defined configurations of the extension allowlist and guest configuration agent maintained by Microsoft. As new extensions become available that enable monitoring scenarios, Microsoft will update the allowlist and agent configuration to include or exclude the new functionality, as appropriate.

There are two modes to choose from:

1. **full** - the default mode. This allows all agent functionality.
1. **monitor** - a restricted mode that disables the guest configuration policy agent and only allows the use of extensions related to monitoring and security.

To enable monitor mode, run the following command:

```bash
azcmagent config set config.mode monitor
```

You can check the current mode of the agent and allowed extensions with the following command:

```bash
azcmagent config list
```

While in monitor mode, you cannot modify the extension allowlist or blocklist. If you need to change either list, change the agent back to full mode and specify your own allowlist and blocklist.

To change the agent back to full mode, run the following command:

```bash
azcmagent config set config.mode full
```

## Disabling the extension manager

If you don’t need to use extensions with Azure Arc, you can also disable the extension manager entirely. You can disable the extension manager with the following command (run locally on each machine):

`azcmagent config set extensions.enabled false`

Disabling the extension manager won't remove any extensions already installed on your server. Extensions that are hosted in their own Windows or Linux services, such as the Log Analytics Agent, might continue to run even if the extension manager is disabled. Other extensions that are hosted by the extension manager itself, like the Azure Monitor Agent, don't run if the extension manger is disabled. You should [remove any extensions](manage-vm-extensions-portal.md#remove-extensions) before disabling the extension manager to ensure no extensions continue to run on the server.







