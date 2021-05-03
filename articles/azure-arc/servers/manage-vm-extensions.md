---
title: VM extension management with Azure Arc enabled servers
description: Azure Arc enabled servers can manage deployment of virtual machine extensions that provide post-deployment configuration and automation tasks with non-Azure VMs.
ms.date: 04/13/2021
ms.topic: conceptual
---

# Virtual machine extension management with Azure Arc enabled servers

Virtual machine (VM) extensions are small applications that provide post-deployment configuration and automation tasks on Azure VMs. For example, if a virtual machine requires software installation, anti-virus protection, or to run a script in it, a VM extension can be used.

Azure Arc enabled servers enables you to deploy Azure VM extensions to non-Azure Windows and Linux VMs, simplifying the management of your hybrid machine through their lifecycle. VM extensions can be managed using the following methods on your hybrid machines or servers managed by Arc enabled servers:

- The [Azure portal](manage-vm-extensions-portal.md)
- The [Azure CLI](manage-vm-extensions-cli.md)
- [Azure PowerShell](manage-vm-extensions-powershell.md)
- Azure [Resource Manager templates](manage-vm-extensions-template.md)

> [!NOTE]
> Azure Arc enabled servers does not support deploying and managing VM extensions to Azure virtual machines. For Azure VMs, see the following [VM extension overview](../../virtual-machines/extensions/overview.md) article.

## Key benefits

Azure Arc enabled servers VM extension support provides the following key benefits:

- Collect log data for analysis with [Logs in Azure Monitor](../../azure-monitor/logs/data-platform-logs.md) by enabling the Log Analytics agent VM extension. This is useful for doing complex analysis across data from different kinds of sources.

- With [VM insights](../../azure-monitor/vm/vminsights-overview.md), it analyzes the performance of your Windows and Linux VMs, and monitors their processes and dependencies on other resources and external processes. This is achieved through enabling both the Log Analytics agent and Dependency agent VM extensions.

- Download and execute scripts on hybrid connected machines using the Custom Script Extension. This extension is useful for post deployment configuration, software installation, or any other configuration or management tasks.

- Automatically refresh of certificates stored in an [Azure Key Vault](../../key-vault/general/overview.md).

## Availability

VM extension functionality is available only in the list of [supported regions](overview.md#supported-regions). Ensure you onboard your machine in one of these regions.

## Extensions

In this release, we support the following VM extensions on Windows and Linux machines.

To learn about the Azure Connected Machine agent package and details about the Extension agent component, see [Agent overview](agent-overview.md#agent-component-details).

> [!NOTE]
> Recently support for the DSC VM extension was removed for Arc enabled servers. Alternatively, we recommend using the Custom Script Extension to manage the post-deployment configuration of your server or machine.

### Windows extensions

|Extension |Publisher |Type |Additional information |
|----------|----------|-----|-----------------------|
|Azure Defender integrated vulnerability scanner |Qualys |WindowsAgent.AzureSecurityCenter |[Azure Defender’s integrated vulnerability assessment solution for Azure and hybrid machines](../../security-center/deploy-vulnerability-assessment-vm.md)|
|Custom Script extension |Microsoft.Compute | CustomScriptExtension |[Windows Custom Script Extension](../../virtual-machines/extensions/custom-script-windows.md)|
|Log Analytics agent |Microsoft.EnterpriseCloud.Monitoring |MicrosoftMonitoringAgent |[Log Analytics VM extension for Windows](../../virtual-machines/extensions/oms-windows.md)|
|Azure Monitor for VMs (insights) |Microsoft.Azure.Monitoring.DependencyAgent |DependencyAgentWindows | [Dependency agent virtual machine extension for Windows](../../virtual-machines/extensions/agent-dependency-windows.md)|
|Azure Key Vault Certificate Sync | Microsoft.Azure.Key.Vault |KeyVaultForWindows | [Key Vault virtual machine extension for Windows](../../virtual-machines/extensions/key-vault-windows.md) |
|Azure Monitor Agent |Microsoft.Azure.Monitor |AzureMonitorWindowsAgent |[Install the Azure Monitor agent (preview)](../../azure-monitor/agents/azure-monitor-agent-install.md) |

### Linux extensions

|Extension |Publisher |Type |Additional information |
|----------|----------|-----|-----------------------|
|Azure Defender integrated vulnerability scanner |Qualys |LinuxAgent.AzureSecurityCenter |[Azure Defender’s integrated vulnerability assessment solution for Azure and hybrid machines](../../security-center/deploy-vulnerability-assessment-vm.md)|
|Custom Script extension |Microsoft.Azure.Extensions |CustomScript |[Linux Custom Script Extension Version 2](../../virtual-machines/extensions/custom-script-linux.md) |
|Log Analytics agent |Microsoft.EnterpriseCloud.Monitoring |OmsAgentForLinux |[Log Analytics VM extension for Linux](../../virtual-machines/extensions/oms-linux.md) |
|Azure Monitor for VMs (insights) |Microsoft.Azure.Monitoring.DependencyAgent |DependencyAgentLinux |[Dependency agent virtual machine extension for Linux](../../virtual-machines/extensions/agent-dependency-linux.md) |
|Azure Key Vault Certificate Sync | Microsoft.Azure.Key.Vault |KeyVaultForLinux | [Key Vault virtual machine extension for Linux](../../virtual-machines/extensions/key-vault-linux.md) |
|Azure Monitor Agent |Microsoft.Azure.Monitor |AzureMonitorLinuxAgent |[Install the Azure Monitor agent (preview)](../../azure-monitor/agents/azure-monitor-agent-install.md) |

## Prerequisites

This feature depends on the following Azure resource providers in your subscription:

- **Microsoft.HybridCompute**
- **Microsoft.GuestConfiguration**

If they aren't already registered, follow the steps under [Register Azure resource providers](agent-overview.md#register-azure-resource-providers).

Be sure to review the documentation for each VM extension referenced in the previous table to understand if it has any network or system requirements. This can help you avoid experiencing any connectivity issues with an Azure service or feature that relies on that VM extension.

### Log Analytics VM extension

The Log Analytics agent VM extension for Linux requires Python 2.x is installed on the target machine.

### Azure Key Vault VM extension (preview)

The Key Vault VM extension (preview) doesn't support the following Linux operating systems:

- CentOS Linux 7 (x64)
- Red Hat Enterprise Linux (RHEL) 7 (x64)
- Amazon Linux 2 (x64)

Deploying the Key Vault VM extension (preview) is only supported using:

- The Azure CLI
- The Azure PowerShell
- Azure Resource Manager template

Before you deploy the extension, you need to complete the following:

1. [Create a vault and certificate](../../key-vault/certificates/quick-create-portal.md) (self-signed or import).

2. Grant the Azure Arc enabled server access to the certificate secret. If you’re using the [RBAC preview](../../key-vault/general/rbac-guide.md), search for the name of the Azure Arc resource and assign it the **Key Vault Secrets User (preview)** role. If you’re using [Key Vault access policy](../../key-vault/general/assign-access-policy-portal.md), assign Secret **Get** permissions to the Azure Arc resource’s system assigned identity.

### Connected Machine agent

Verify your machine matches the [supported versions](agent-overview.md#supported-operating-systems) of Windows and Linux operating system for the Azure Connected Machine agent.

The minimum version of the Connected Machine agent that is supported with this feature on Windows and Linux is the 1.0 release.

To upgrade your machine to the version of the agent required, see [Upgrade agent](manage-agent.md#upgrading-agent).

## Next steps

You can deploy, manage, and remove VM extensions using the [Azure CLI](manage-vm-extensions-cli.md), [Azure PowerShell](manage-vm-extensions-powershell.md), from the [Azure portal](manage-vm-extensions-portal.md), or [Azure Resource Manager templates](manage-vm-extensions-template.md).
