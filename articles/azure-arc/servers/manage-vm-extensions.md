---
title: VM extension management with Azure Arc enabled servers
description: Azure Arc enabled servers can manage deployment of virtual machine extensions that provide post-deployment configuration and automation tasks with non-Azure VMs.
ms.date: 11/06/2020
ms.topic: conceptual
---

# Virtual machine extension management with Azure Arc enabled servers

Virtual machine (VM) extensions are small applications that provide post-deployment configuration and automation tasks on Azure VMs. For example, if a virtual machine requires software installation, anti-virus protection, or to run a script inside of it, a VM extension can be used.

Azure Arc enabled servers enables you to deploy Azure VM extensions to non-Azure Windows and Linux VMs, simplifying the management of your hybrid machine on-premises, edge, and other cloud environments through their lifecycle. VM extensions can be managed using the following methods on your hybrid machines or servers managed by Arc enabled servers:

- The [Azure portal](manage-vm-extensions-portal.md)
- The [Azure CLI](manage-vm-extensions-cli.md)
- [Azure PowerShell](manage-vm-extensions-powershell.md)
- Azure [Resource Manager templates](manage-vm-extensions-template.md)

## Key benefits

Azure Arc enabled servers VM extension support provides the following key benefits:

- Use [Azure Automation State Configuration](../../automation/automation-dsc-overview.md) to centrally store configurations and maintain the desired state of hybrid connected machines enabled through the DSC VM extension.

- Collect log data for analysis with [Logs in Azure Monitor](../../azure-monitor/platform/data-platform-logs.md) enabled through the Log Analytics agent VM extension. This is useful for performing complex analysis across data from a variety of sources.

- With [Azure Monitor for VMs](../../azure-monitor/insights/vminsights-overview.md), analyzes the performance of your Windows and Linux VMs, and monitor their processes and dependencies on other resources and external processes. This is achieved through enabling both the Log Analytics agent and Dependency agent VM extensions.

- Download and execute scripts on hybrid connected machines using the Custom Script Extension. This extension is useful for post deployment configuration, software installation, or any other configuration or management tasks.

- Automatically refresh of certificates stored in an [Azure Key Vault](../../key-vault/general/overview.md).

## Availability

VM extension functionality is available only in the list of [supported regions](overview.md#supported-regions). Ensure you onboard your machine in one of these regions.

## Extensions

In this release, we support the following VM extensions on Windows and Linux machines.

|Extension |OS |Publisher |Additional information |
|----------|---|----------|-----------------------|
|CustomScriptExtension |Windows |Microsoft.Compute |[Windows Custom Script Extension](../../virtual-machines/extensions/custom-script-windows.md)|
|DSC |Windows |Microsoft.PowerShell|[Windows PowerShell DSC Extension](../../virtual-machines/extensions/dsc-windows.md)|
|Log Analytics agent |Windows |Microsoft.EnterpriseCloud.Monitoring |[Log Analytics VM extension for Windows](../../virtual-machines/extensions/oms-windows.md)|
|Microsoft Dependency agent | Windows |Microsoft.Compute | [Dependency agent virtual machine extension for Windows](../../virtual-machines/extensions/agent-dependency-windows.md)|
|Key Vault | Windows | Microsoft.Compute | [Key Vault virtual machine extension for Windows](../../virtual-machines/extensions/key-vault-windows.md) |
|CustomScript|Linux |Microsoft.Azure.Extension |[Linux Custom Script Extension Version 2](../../virtual-machines/extensions/custom-script-linux.md) |
|DSC |Linux |Microsoft.OSTCExtensions |[PowerShell DSC Extension for Linux](../../virtual-machines/extensions/dsc-linux.md) |
|Log Analytics agent |Linux |Microsoft.EnterpriseCloud.Monitoring |[Log Analytics VM extension for Linux](../../virtual-machines/extensions/oms-linux.md) |
|Microsoft Dependency agent | Linux |Microsoft.Compute | [Dependency agent virtual machine extension for Linux](../../virtual-machines/extensions/agent-dependency-linux.md) |
|Key Vault | Linux | Microsoft.Compute | [Key Vault virtual machine extension for Linux](../../virtual-machines/extensions/key-vault-linux.md) |

To learn about the Azure Connected Machine agent package and details about the Extension agent component, see [Agent overview](agent-overview.md#agent-component-details).

## Prerequisites

This feature depends on the following Azure resource providers in your subscription:

- **Microsoft.HybridCompute**
- **Microsoft.GuestConfiguration**

If they are not already registered, follow the steps under [Register Azure resource providers](agent-overview.md#register-azure-resource-providers).

### Log Analytics VM extension

The Log Analytics agent VM extension for Linux requires Python 2.x is installed on the target machine.

### Azure Key Vault VM extension (preview)

The Key Vault VM extension (preview) does not support the following Linux operating systems:

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
