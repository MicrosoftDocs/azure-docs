---
title: Connected Machine agent prerequisites
description: Learn about the prerequisites for installing the Connected Machine agent for Azure Arc-enabled servers.
ms.date: 07/11/2023
ms.topic: conceptual
ms.custom: devx-track-azurepowershell
---

# Connected Machine agent prerequisites

This topic describes the basic requirements for installing the Connected Machine agent to onboard a physical server or virtual machine to Azure Arc-enabled servers. Some [onboarding methods](deployment-options.md) may have more requirements.

## Supported environments

Azure Arc-enabled servers support the installation of the Connected Machine agent on physical servers and virtual machines hosted outside of Azure. This includes support for virtual machines running on platforms like:

* VMware (including Azure VMware Solution)
* Azure Stack HCI
* Other cloud environments

You shouldn't install Azure Arc on virtual machines hosted in Azure, Azure Stack Hub, or Azure Stack Edge, as they already have similar capabilities. You can, however, [use an Azure VM to simulate an on-premises environment](plan-evaluate-on-azure-virtual-machine.md) for testing purposes, only.

Take extra care when using Azure Arc on systems that are:

* Cloned
* Restored from backup as a second instance of the server
* Used to create a "golden image" from which other virtual machines are created

If two agents use the same configuration, you will encounter inconsistent behaviors when both agents try to act as one Azure resource. The best practice for these situations is to use an automation tool or script to onboard the server to Azure Arc after it has been cloned, restored from backup, or created from a golden image.

> [!NOTE]
> For additional information on using Azure Arc-enabled servers in VMware environments, see the [VMware FAQ](vmware-faq.md).

## Supported operating systems

Azure Arc supports the following Windows and Linux operating systems. Only x86-64 (64-bit) architectures are supported. The Azure Connected Machine agent does not run on x86 (32-bit) or ARM-based architectures.

* Windows Server 2008 R2 SP1, 2012 R2, 2016, 2019, and 2022
  * Both Desktop and Server Core experiences are supported
  * Azure Editions are supported on Azure Stack HCI
* Windows 10, 11 (see [client operating system guidance](#client-operating-system-guidance))
* Windows IoT Enterprise
* Azure Stack HCI
* Azure Linux (CBL-Mariner) 1.0, 2.0
* Ubuntu 16.04, 18.04, 20.04, and 22.04 LTS
* Debian 10, 11, and 12
* CentOS Linux 7 and 8
* Rocky Linux 8
* SUSE Linux Enterprise Server (SLES) 12 SP3-SP5 and 15
* Red Hat Enterprise Linux (RHEL) 7, 8 and 9
* Amazon Linux 2 and 2023
* Oracle Linux 7 and 8

### Client operating system guidance

The Azure Arc service and Azure Connected Machine Agent are supported on Windows 10 and 11 client operating systems only when using those computers in a server-like environment. That is, the computer should always be:

* Connected to the internet
* Connected to a power source
* Powered on

For example, a computer running Windows 11 that's responsible for digital signage, point-of-sale solutions, and general back office management tasks is a good candidate for Azure Arc. End-user productivity machines, such as a laptop, which may go offline for long periods of time, shouldn't use Azure Arc and instead should consider [Microsoft Intune](/mem/intune) or [Microsoft Configuration Manager](/mem/configmgr).

### Short-lived servers and virtual desktop infrastructure

Microsoft doesn't recommend running Azure Arc on short-lived (ephemeral) servers or virtual desktop infrastructure (VDI) VMs. Azure Arc is designed for long-term management of servers and isn't optimized for scenarios where you are regularly creating and deleting servers. For example, Azure Arc doesn't know if the agent is offline due to planned system maintenance or if the VM was deleted, so it won't automatically clean up server resources that stopped sending heartbeats. As a result, you could encounter a conflict if you re-create the VM with the same name and there's an existing Azure Arc resource with the same name.

[Azure Virtual Desktop on Azure Stack HCI](../../virtual-desktop/azure-stack-hci-overview.md) doesn't use short-lived VMs and supports running Azure Arc in the desktop VMs.

## Software requirements

Windows operating systems:

* NET Framework 4.6 or later. [Download the .NET Framework](/dotnet/framework/install/guide-for-developers).
* Windows PowerShell 4.0 or later (already included with Windows Server 2012 R2 and later). For Windows Server 2008 R2 SP1, [Download Windows Management Framework 5.1.](https://www.microsoft.com/download/details.aspx?id=54616).

Linux operating systems:

* systemd
* wget (to download the installation script)
* openssl
* gnupg

## Required permissions

You'll need the following Azure built-in roles for different aspects of managing connected machines:

* To onboard machines, you must have the [Azure Connected Machine Onboarding](../../role-based-access-control/built-in-roles.md#azure-connected-machine-onboarding) or [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role for the resource group where you're managing the servers.
* To read, modify, and delete a machine, you must have the [Azure Connected Machine Resource Administrator](../../role-based-access-control/built-in-roles.md#azure-connected-machine-resource-administrator) role for the resource group.
* To select a resource group from the drop-down list when using the **Generate script** method, you'll also need the [Reader](../../role-based-access-control/built-in-roles.md#reader) role for that resource group (or another role that includes **Reader** access).

## Azure subscription and service limits

There are no limits to the number of Azure Arc-enabled servers you can register in any single resource group, subscription or tenant.

Each Azure Arc-enabled server is associated with an Azure Active Directory object and counts against your directory quota. See [Azure AD service limits and restrictions](../../active-directory/enterprise-users/directory-service-limits-restrictions.md) for information about the maximum number of objects you can have in an Azure AD directory.

## Azure resource providers

To use Azure Arc-enabled servers, the following [Azure resource providers](../../azure-resource-manager/management/resource-providers-and-types.md) must be registered in your subscription:

* **Microsoft.HybridCompute**
* **Microsoft.GuestConfiguration**
* **Microsoft.HybridConnectivity**
* **Microsoft.AzureArcData** (if you plan to Arc-enable SQL Servers)

You can register the resource providers using the following commands:

Azure PowerShell:

```azurepowershell-interactive
Connect-AzAccount
Set-AzContext -SubscriptionId [subscription you want to onboard]
Register-AzResourceProvider -ProviderNamespace Microsoft.HybridCompute
Register-AzResourceProvider -ProviderNamespace Microsoft.GuestConfiguration
Register-AzResourceProvider -ProviderNamespace Microsoft.HybridConnectivity
Register-AzResourceProvider -ProviderNamespace Microsoft.AzureArcData
```

Azure CLI:

```azurecli-interactive
az account set --subscription "{Your Subscription Name}"
az provider register --namespace 'Microsoft.HybridCompute'
az provider register --namespace 'Microsoft.GuestConfiguration'
az provider register --namespace 'Microsoft.HybridConnectivity'
az provider register --namespace 'Microsoft.AzureArcData'
```

You can also register the resource providers in the [Azure portal](../../azure-resource-manager/management/resource-providers-and-types.md#azure-portal).

## Next steps

* Review the [networking requirements for deploying Azure Arc-enabled servers](network-requirements.md).
* Before you deploy the Azure Connected Machine agent and integrate with other Azure management and monitoring services, review the [Planning and deployment guide](plan-at-scale-deployment.md).* To resolve problems, review the [agent connection issues troubleshooting guide](troubleshoot-agent-onboard.md).
