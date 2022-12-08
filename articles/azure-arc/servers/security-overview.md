---
title: Security overview
description: Security information about Azure Arc-enabled servers.
ms.topic: conceptual
ms.date: 05/24/2022
---

# Azure Arc-enabled servers security overview

This article describes the security configuration and considerations you should evaluate before deploying Azure Arc-enabled servers in your enterprise.

> [!IMPORTANT]
> In the interest of ensuring new features are documented no later than their release, this page may include documentation for features that may not yet be publicly available.

## Identity and access control

Each Azure Arc-enabled server has a managed identity as part of a resource group inside an Azure subscription. That identity represents the server running on-premises or other cloud environment. Access to this resource is controlled by standard [Azure role-based access control](../../role-based-access-control/overview.md). From the [**Access Control (IAM)**](../../role-based-access-control/role-assignments-portal.md) page in the Azure portal, you can verify who has access to your Azure Arc-enabled server.

:::image type="content" source="./media/security-overview/access-control-page.png" alt-text="Azure Arc-enabled server access control" border="false" lightbox="./media/security-overview/access-control-page.png":::

Users and applications granted [contributor](../../role-based-access-control/built-in-roles.md#contributor) or administrator role access to the resource can make changes to the resource, including deploying or deleting [extensions](manage-vm-extensions.md) on the machine. Extensions can include arbitrary scripts that run in a privileged context, so consider any contributor on the Azure resource to be an indirect administrator of the server.

The **Azure Connected Machine Onboarding** role is available for at-scale onboarding, and is only able to read or create new Azure Arc-enabled servers in Azure. It cannot be used to delete servers already registered or manage extensions. As a best practice, we recommend only assigning this role to the Azure Active Directory (Azure AD) service principal used to onboard machines at scale.

Users as a member of the **Azure Connected Machine Resource Administrator** role can read, modify, reonboard, and delete a machine. This role is designed to support management of Azure Arc-enabled servers, but not other resources in the resource group or subscription.

## Agent security and permissions

To manage the Azure Connected Machine agent (azcmagent) on Windows, your user account needs to be a member of the local Administrators group. On Linux, you must have root access permissions.

The Azure Connected Machine agent is composed of three services, which run on your machine.

* The Hybrid Instance Metadata Service (himds) service is responsible for all core functionality of Arc. This includes sending heartbeats to Azure, exposing a local instance metadata service for other apps to learn about the machine’s Azure resource ID, and retrieve Azure AD tokens to authenticate to other Azure services. This service runs as an unprivileged virtual service account (NT SERVICE\\himds) on Windows, and as the **himds** user on Linux. The virtual service account requires the Log on as a Service right on Windows.

* The Guest Configuration service (GCService) is responsible for evaluating Azure Policy on the machine.

* The Guest Configuration Extension service (ExtensionService) is responsible for installing, upgrading, and deleting extensions (agents, scripts, or other software) on the machine.

The guest configuration and extension services run as Local System on Windows, and as root on Linux.

## Local agent security controls

Starting with agent version 1.16, you can optionally limit the extensions that can be installed on your server and disable Guest Configuration. These controls can be useful when connecting servers to Azure that need to be monitored or secured by Azure, but should not allow arbitrary management capabilities like running scripts with Custom Script Extension or configuring settings on the server with Guest Configuration.

These security controls can only be configured by running a command on the server itself and cannot be modified from Azure. This approach preserves the server admin's intent when enabling remote management scenarios with Azure Arc, but also means that changing the setting is more difficult if you later decide to change them. This feature is intended for particularly sensitive servers (for example, Active Directory Domain Controllers, servers that handle payment data, and servers subject to strict change control measures). In most other cases, it is not necessary to modify these settings.

### Extension allowlists and blocklists

To limit which [extensions](manage-vm-extensions.md) can be installed on your server, you can configure lists of the extensions you wish to allow and block on the server. The extension manager will evaluate all requests to install, update, or upgrade extensions against the allowlist and blocklist to determine if the extension can be installed on the server. Delete requests are always allowed.

The most secure option is to explicitly allow the extensions you expect to be installed. Any extension not in the allowlist is automatically blocked. To configure the Azure Connected Machine agent to allow only the Log Analytics Agent for Linux and the Dependency Agent for Linux, run the following command on each server:

```bash
azcmagent config set extensions.allowlist "Microsoft.EnterpriseCloud.Monitoring/OMSAgentForLinux,Microsoft.Azure.Monitoring.DependencyAgent/DependencyAgentLinux"
```

You can block one or more extensions by adding them to the blocklist. If an extension is present in both the allowlist and blocklist, it will be blocked. To block the Custom Script extension for Linux, run the following command:

```bash
azcmagent config set extensions.blocklist "Microsoft.Azure.Extensions/CustomScript"
```

Extensions are specified by their publisher and type, separated by a forward slash. See the list of the [most common extensions](manage-vm-extensions.md) in the docs or list the VM extensions already installed on your server in the [portal](manage-vm-extensions-portal.md#list-extensions-installed), [Azure PowerShell](manage-vm-extensions-powershell.md#list-extensions-installed), or [Azure CLI](manage-vm-extensions-cli.md#list-extensions-installed).

The table below describes the behavior when performing an extension operation against an agent that has the allowlist or blocklist configured.

| Operation | In the allowlist | In the blocklist | In both the allowlist and blocklist | Not in any list, but an allowlist is configured |
|--|--|--|--|
| Install extension | Allowed | Blocked | Blocked | Blocked |
| Update (reconfigure) extension | Allowed | Blocked | Blocked | Blocked |
| Upgrade extension | Allowed | Blocked | Blocked | Blocked |
| Delete extension | Allowed | Allowed | Allowed | Allowed |

> [!IMPORTANT]
> If an extension is already installed on your server before you configure an allowlist or blocklist, it will not automatically be removed. It is your responsibility to delete the extension from Azure to fully remove it from the machine. Delete requests are always accepted to accommodate this scenario. Once deleted, the allowlist and blocklist will determine whether or not to allow future install attempts.

### Enable or disable Guest Configuration

Azure Policy's Guest Configuration feature enables you to audit and configure settings on your server from Azure. You can disable Guest Configuration from running on your server if you don't want to allow this functionality by running the following command:

```bash
azcmagent config set guestconfiguration.enabled false
```

When Guest Configuration is disabled, any Guest Configuration policies assigned to the machine in Azure will report as non-compliant. Consider [creating an exemption](../../governance/policy/concepts/exemption-structure.md) for these machines or [changing the scope](../../governance/policy/concepts/assignment-structure.md#excluded-scopes) of your policy assignments if you don't want to see these machines reported as non-compliant.

### Enable or disable the extension manager

The extension manager is responsible for installing, updating, and removing [VM Extensions](manage-vm-extensions.md) on your server. You can disable the extension manager to prevent managing any extensions on your server, but we recommend using the [allow and blocklists](#extension-allowlists-and-blocklists) instead for more granular control.

```bash
azcmagent config set extensions.enabled false
```

Disabling the extension manager will not remove any extensions already installed on your server. Extensions that are hosted in their own Windows or Linux services, such as the Log Analytics Agent, may continue to run even if the extension manager is disabled. Other extensions that are hosted by the extension manager itself, like the Azure Monitor Agent, will not run if the extension manger is disabled. You should [remove any extensions](manage-vm-extensions-portal.md#remove-extensions) before disabling the extension manager to ensure no extensions continue to run on the server.

### Locked down machine best practices

When configuring the Azure Connected Machine agent with a reduced set of capabilities, it is important to consider the mechanisms that someone could use to remove those restrictions and implement appropriate controls. Anybody capable of running commands as an administrator or root user on the server can change the Azure Connected Machine agent configuration. Extensions and guest configuration policies execute in privileged contexts on your server, and as such may be able to change the agent configuration. If you apply these security controls to lock down the agent, Microsoft recommends the following best practices to ensure only local server admins can update the agent configuration:

* Use allowlists for extensions instead of blocklists whenever possible.
* Don't include the Custom Script Extension in the extension allowlist to prevent execution of arbitrary scripts that could change the agent configuration.
* Disable Guest Configuration to prevent the use of custom Guest Configuration policies that could change the agent configuration.

### Example configuration for monitoring and security scenarios

It's common to use Azure Arc to monitor your servers with Azure Monitor and Microsoft Sentinel and secure them with Microsoft Defender for Cloud. The following configuration samples can help you configure the Azure Arc Connected Machine agent to only allow these scenarios.

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

Microsoft Defender for Cloud enables additional extensions on your server to identify vulnerable software on your server and enable Microsoft Defender for Endpoint (if configured). Microsoft Defender for Cloud also uses Guest Configuration for its regulatory compliance feature. Since a custom Guest Configuration assignment could be used to undo the agent limitations, you should carefully evaluate whether or not you need the regulatory compliance feature and, as a result, Guest Configuration to be enabled on the machine.

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

## Using a managed identity with Azure Arc-enabled servers

By default, the Azure Active Directory system assigned identity used by Arc can only be used to update the status of the Azure Arc-enabled server in Azure. For example, the *last seen* heartbeat status. You can optionally assign other roles to the identity if an application on your server uses the system assigned identity to access other Azure services. To learn more about configuring a system-assigned managed identity to access Azure resources, see [Authenticate against Azure resources with Azure Arc-enabled servers](managed-identity-authentication.md).

While the Hybrid Instance Metadata Service can be accessed by any application running on the machine, only authorized applications can request an Azure AD token for the system assigned identity. On the first attempt to access the token URI, the service will generate a randomly generated cryptographic blob in a location on the file system that only trusted callers can read. The caller must then read the file (proving it has appropriate permission) and retry the request with the file contents in the authorization header to successfully retrieve an Azure AD token.

* On Windows, the caller must be a member of the local **Administrators** group or the **Hybrid Agent Extension Applications** group to read the blob.

* On Linux, the caller must be a member of the **himds** group to read the blob.

To learn more about using a managed identity with Arc-enabled servers to authenticate and access Azure resources, see the following video.

> [!VIDEO https://www.youtube.com/embed/4hfwxwhWcP4]

## Using disk encryption

The Azure Connected Machine agent uses public key authentication to communicate with the Azure service. After you onboard a server to Azure Arc, a private key is saved to the disk and used whenever the agent communicates with Azure. If stolen, the private key can be used on another server to communicate with the service and act as if it were the original server. This includes getting access to the system assigned identity and any resources that identity has access to. The private key file is protected to only allow the **himds** account access to read it. To prevent offline attacks, we strongly recommend the use of full disk encryption (for example, BitLocker, dm-crypt, etc.) on the operating system volume of your server.

## Next steps

* Before evaluating or enabling Azure Arc-enabled servers across multiple hybrid machines, review [Connected Machine agent overview](agent-overview.md) to understand requirements, technical details about the agent, and deployment methods.

* Review the [Planning and deployment guide](plan-at-scale-deployment.md) to plan for deploying Azure Arc-enabled servers at any scale and implement centralized management and monitoring.