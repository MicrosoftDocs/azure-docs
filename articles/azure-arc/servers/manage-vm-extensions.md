---
title: VM extension management with Azure Arc-enabled servers
description: Azure Arc-enabled servers can manage deployment of virtual machine extensions that provide post-deployment configuration and automation tasks with non-Azure VMs.
ms.date: 10/08/2022
ms.topic: conceptual
---

# Virtual machine extension management with Azure Arc-enabled servers

Virtual machine (VM) extensions are small applications that provide post-deployment configuration and automation tasks on Azure VMs. For example, if a virtual machine requires software installation, anti-virus protection, or to run a script in it, a VM extension can be used.

Azure Arc-enabled servers enables you to deploy, remove, and update Azure VM extensions to non-Azure Windows and Linux VMs, simplifying the management of your hybrid machine through their lifecycle. VM extensions can be managed using the following methods on your hybrid machines or servers managed by Arc-enabled servers:

- The [Azure portal](manage-vm-extensions-portal.md)
- The [Azure CLI](manage-vm-extensions-cli.md)
- [Azure PowerShell](manage-vm-extensions-powershell.md)
- Azure [Resource Manager templates](manage-vm-extensions-template.md)

> [!NOTE]
> Azure Arc-enabled servers does not support deploying and managing VM extensions to Azure virtual machines. For Azure VMs, see the following [VM extension overview](../../virtual-machines/extensions/overview.md) article.

> [!NOTE]
> Currently you can only update extensions from the Azure portal or the Azure CLI. Performing this operation from Azure PowerShell, or using an Azure Resource Manager template is not supported at this time.

## Key benefits

Azure Arc-enabled servers VM extension support provides the following key benefits:

- Collect log data for analysis with [Logs in Azure Monitor](../../azure-monitor/logs/data-platform-logs.md) by enabling the Log Analytics agent VM extension. Log Analytics makes it useful for doing complex analysis across log data from different kinds of sources.

- With [VM insights](../../azure-monitor/vm/vminsights-overview.md), it analyzes the performance of your Windows and Linux VMs, and monitors their processes and dependencies on other resources and external processes. This is achieved through enabling both the Log Analytics agent and Dependency agent VM extensions.

- Download and execute scripts on hybrid connected machines using the Custom Script Extension. This extension is useful for post deployment configuration, software installation, or any other configuration or management tasks.

- Automatically refresh of certificates stored in an [Azure Key Vault](../../key-vault/general/overview.md).

## Availability

VM extension functionality is available only in the list of [supported regions](overview.md#supported-regions). Ensure you onboard your machine in one of these regions.

## Extensions

In this release, we support the following VM extensions on Windows and Linux machines.

To learn about the Azure Connected Machine agent package and details about the Extension agent component, see [Agent overview](agent-overview.md).

> [!NOTE]
> The Desired State Configuration VM extension is no longer available for Azure Arc-enabled servers. Alternatively, we recommend [migrating to machine configuration](../../governance/machine-configuration/migrate-from-azure-automation.md) or using the Custom Script Extension to manage the post-deployment configuration of your server.

Arc-enabled servers support moving machines with one or more VM extensions installed between resource groups or another Azure subscription without experiencing any impact to their configuration. The source and destination subscriptions must exist within the same [Azure Active Directory tenant](../../active-directory/develop/quickstart-create-new-tenant.md). This support is enabled starting with the Connected Machine agent version **1.8.21197.005**. For more information about moving resources and considerations before proceeding, see [Move resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md).

### Windows extensions

|Extension |Publisher |Type |Additional information |
|----------|----------|-----|-----------------------|
|Microsoft Defender for Cloud integrated vulnerability scanner |Qualys |WindowsAgent.AzureSecurityCenter |[Microsoft Defender for Cloud’s integrated vulnerability assessment solution for Azure and hybrid machines](../../security-center/deploy-vulnerability-assessment-vm.md)|
|Microsoft Antimalware extension |Microsoft.Azure.Security |IaaSAntimalware |[Microsoft Antimalware extension for Windows](../../virtual-machines/extensions/iaas-antimalware-windows.md) |
|Custom Script extension |Microsoft.Compute | CustomScriptExtension |[Windows Custom Script Extension](../../virtual-machines/extensions/custom-script-windows.md)|
|Log Analytics agent |Microsoft.EnterpriseCloud.Monitoring |MicrosoftMonitoringAgent |[Log Analytics VM extension for Windows](../../virtual-machines/extensions/oms-windows.md)|
|Azure Monitor for VMs (insights) |Microsoft.Azure.Monitoring.DependencyAgent |DependencyAgentWindows | [Dependency agent virtual machine extension for Windows](../../virtual-machines/extensions/agent-dependency-windows.md)|
|Azure Key Vault Certificate Sync | Microsoft.Azure.Key.Vault |KeyVaultForWindows | [Key Vault virtual machine extension for Windows](../../virtual-machines/extensions/key-vault-windows.md) |
|Azure Monitor Agent |Microsoft.Azure.Monitor |AzureMonitorWindowsAgent |[Install the Azure Monitor agent](../../azure-monitor/agents/azure-monitor-agent-manage.md) |
|Azure Automation Hybrid Runbook Worker extension |Microsoft.Compute |HybridWorkerForWindows |[Deploy an extension-based User Hybrid Runbook Worker](../../automation/extension-based-hybrid-runbook-worker-install.md) to execute runbooks locally. |
|Azure Extension for SQL Server |Microsoft.AzureData |WindowsAgent.SqlServer |[Install Azure extension for SQL Server](/sql/sql-server/azure-arc/connect#initiate-the-connection-from-azure) to initiate SQL Server connection to Azure. |
|Windows Admin Center (preview) |Microsoft.AdminCenter |AdminCenter |[Manage Azure Arc-enabled Servers using Windows Admin Center in Azure](/windows-server/manage/windows-admin-center/azure/manage-arc-hybrid-machines) |

### Linux extensions

|Extension |Publisher |Type |Additional information |
|----------|----------|-----|-----------------------|
|Microsoft Defender for Cloud integrated vulnerability scanner |Qualys |LinuxAgent.AzureSecurityCenter |[Microsoft Defender for Cloud’s integrated vulnerability assessment solution for Azure and hybrid machines](../../security-center/deploy-vulnerability-assessment-vm.md)|
|Custom Script extension |Microsoft.Azure.Extensions |CustomScript |[Linux Custom Script Extension Version 2](../../virtual-machines/extensions/custom-script-linux.md) |
|Log Analytics agent |Microsoft.EnterpriseCloud.Monitoring |OmsAgentForLinux |[Log Analytics VM extension for Linux](../../virtual-machines/extensions/oms-linux.md) |
|Azure Monitor for VMs (insights) |Microsoft.Azure.Monitoring.DependencyAgent |DependencyAgentLinux |[Dependency agent virtual machine extension for Linux](../../virtual-machines/extensions/agent-dependency-linux.md) |
|Azure Key Vault Certificate Sync | Microsoft.Azure.Key.Vault |KeyVaultForLinux | [Key Vault virtual machine extension for Linux](../../virtual-machines/extensions/key-vault-linux.md) |
|Azure Monitor Agent |Microsoft.Azure.Monitor |AzureMonitorLinuxAgent |[Install the Azure Monitor agent](../../azure-monitor/agents/azure-monitor-agent-manage.md) |
|Azure Automation Hybrid Runbook Worker extension  |Microsoft.Compute |HybridWorkerForLinux |[Deploy an extension-based User Hybrid Runbook Worker](../../automation/extension-based-hybrid-runbook-worker-install.md) to execute runbooks locally.|

## Prerequisites

This feature depends on the following Azure resource providers in your subscription:

- **Microsoft.HybridCompute**
- **Microsoft.GuestConfiguration**

If they aren't already registered, follow the steps under [Register Azure resource providers](prerequisites.md#azure-resource-providers).

Be sure to review the documentation for each VM extension referenced in the previous table to understand if it has any network or system requirements. This can help you avoid experiencing any connectivity issues with an Azure service or feature that relies on that VM extension.

### Log Analytics VM extension

The Log Analytics agent VM extension for Linux requires Python 2.x is installed on the target machine.

Before you install the extension we suggest you review the [deployment options for the Log Analytics agent](concept-log-analytics-extension-deployment.md) to understand the different methods available and which meets your requirements.

### Azure Key Vault VM extension

The Key Vault VM extension doesn't support the following Linux operating systems:

- CentOS Linux 7 (x64)
- Red Hat Enterprise Linux (RHEL) 7 (x64)
- Amazon Linux 2 (x64)

Deploying the Key Vault VM extension is only supported using:

- The Azure CLI
- The Azure PowerShell
- Azure Resource Manager template

Before you deploy the extension, you need to complete the following:

1. [Create a vault and certificate](../../key-vault/certificates/quick-create-portal.md) (self-signed or import).

2. Grant the Azure Arc-enabled server access to the certificate secret. If you’re using the [RBAC preview](../../key-vault/general/rbac-guide.md), search for the name of the Azure Arc resource and assign it the **Key Vault Secrets User (preview)** role. If you’re using [Key Vault access policy](../../key-vault/general/assign-access-policy-portal.md), assign Secret **Get** permissions to the Azure Arc resource’s system assigned identity.

### Connected Machine agent

Verify your machine matches the [supported versions](prerequisites.md#supported-operating-systems) of Windows and Linux operating system for the Azure Connected Machine agent.

The minimum version of the Connected Machine agent that is supported with this feature on Windows and Linux is the 1.0 release.

To upgrade your machine to the version of the agent required, see [Upgrade agent](manage-agent.md#upgrade-the-agent).

## Operating system extension availability

The following extensions are available for Windows and Linux machines:

### Windows extension availability

|Operating system |Azure Monitor agent |Log Analytics agent |Dependency VM Insights |Qualys |Custom Script |Key Vault |Hybrid Runbook |Antimalware Extension |Windows Admin Center |
|-----------------|--------------------|--------------------|-----------------------|-------|--------------|----------|---------------|----------------------|---------------------|
|Windows Server 2022 |X |X |X |X |X | |X | |X |
|Windows Server 2019 |X |X |X |X |X |X | | |X |
|Windows Server 2016 |X |X |X |X |X |X |X |Built-in |X |
|Windows Server 2012 R2 |X |X |X |X |X | |X |X | |
|Windows Server 2012 |X |X |X |X |X |X |X |X | |
|Windows Server 2008 R2 SP1 |X |X |X |X |X | |X |X | |
|Windows Server 2008 R2 | | | |X |X | |X |X | |
|Windows Server 2008 SP2 | |X | |X |X | |X | | |
|Windows 11 client OS |X | | |X | | | | | |
|Windows 10 1803 (RS4) and higher |X | | |X |X | | | | |
|Windows 10 Enterprise (including multi-session) and Pro (Server scenarios only) |X |X |X |X |X | |X | | |
|Windows 8 Enterprise and Pro (Server scenarios only) | |X |X |X | | |X | | |
|Windows 7 SP1 (Server scenarios only) | |X |X |X | | |X | | |
|Azure Stack HCI (Server scenarios only) | |X | |X | | |X | | |

### Linux extension availability

|Operating system |Azure Monitor agent |Log Analytics agent |Dependency VM Insights |Qualys |Custom Script |Key Vault |Hybrid Runbook |Antimalware Extension |Connected Machine agent |
|-----------------|--------------------|--------------------|-----------------------|-------|--------------|----------|---------------|----------------------|------------------------|
|Amazon Linux 2 | |X | |X | | |X |X |
|CentOS Linux 8 |X |X |X |X |X | |X |X |
|CentOS Linux 7 |X |X |X |X |X | |X |X |
|CentOS Linux 6 | |X | |X |X | |X | |
|Debian 10 |X | | |X |X | |X | |
|Debian 9 |X |X |X |X |X | | | |
|Debian 8 | |X |X |X | | |X | |
|Debian 7 | | | |X | | |X | |
|OpenSUSE 13.1+ | | | |X |X | | | |
|Oracle Linux 8 |X |X | |X |X | |X |X |
|Oracle Linux 7 |X |X | |X |X | |X |X |
|Oracle Linux 6 | |X | |X |X | |X |X |
|Red Hat Enterprise Linux Server 8 |X |X | |X |X | |X |X |
|Red Hat Enterprise Linux Server 7 |X |X |X |X |X | |X |X |
|Red Hat Enterprise Linux Server 6 | |X |X |X | | |X | |
|SUSE Linux Enterprise Server 15.2 |X | | |X |X |X | |X |
|SUSE Linux Enterprise Server 15.1 |X |X | |X |X |X |X |X |
|SUSE Linux Enterprise Server 15 SP1 |X |X |X |X |X |X |X |X |
|SUSE Linux Enterprise Server 15 |X |X |X |X |X |X |X |X |
|SUSE Linux Enterprise Server 15 SP5 |X |X |X |X |X | |X |X |
|SUSE Linux Enterprise Server 12 SP5 |X |X |X |X |X | |X |X |
|Ubuntu 20.04 LTS |X |X |X |X |X | |X |X |
|Ubuntu 18.04 LTS |X |X |X |X |X |X |X |X |
|Ubuntu 16.04 LTS |X |X |X |X | | |X |X |
|Ubuntu 14.04 LTS | |X | |X | | |X | |

For the regional availabilities of different Azure services and VM extensions available for Azure Arc-enabled servers, [refer to Azure Global's Product Availability Roadmap](https://global.azure.com/product-availability/roadmap).

## Next steps

You can deploy, manage, and remove VM extensions using the [Azure CLI](manage-vm-extensions-cli.md), [Azure PowerShell](manage-vm-extensions-powershell.md), from the [Azure portal](manage-vm-extensions-portal.md), or [Azure Resource Manager templates](manage-vm-extensions-template.md).
