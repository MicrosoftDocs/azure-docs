---
title: Connected Machine agent prerequisites
description: Learn about the prerequisites for installing the Connected Machine agent for Azure Arc-enabled servers.
ms.date: 01/25/2023
ms.topic: conceptual 
---

# Connected Machine agent prerequisites

This topic describes the basic requirements for installing the Connected Machine agent to onboard a physical server or virtual machine to Azure Arc-enabled servers. Some [onboarding methods](deployment-options.md) may have additional requirements.

## Supported environments

Azure Arc-enabled servers support the installation of the Connected Machine agent on physical servers and virtual machines hosted outside of Azure. This includes support for virtual machines running on platforms like:

* VMware (including Azure VMware Solution)
* Azure Stack HCI
* Other cloud environments

Azure Arc-enabled servers do not support installing the agent on virtual machines running in Azure, or on virtual machines running on Azure Stack Hub or Azure Stack Edge, as they are already modeled as Azure VMs and able to be managed directly in Azure.

If you use Azure Arc on a system that will be cloned, restored from backup as a second instance, or used to create a golden image from which other VMs are created, you must take extra care to ensure the Arc agent is not configured before a second copy of the VM or image is instantiated. If two agents use the same configuration, you will encounter inconsistent behaviors when both agents try to act as one Azure resource. The best practice for these situations is to use an automation tool or script to onboard the server to Azure Arc after it has been cloned, restored, or instantiated from a golden image.

> [!NOTE]
> For additional information on using Arc-enabled servers in VMware environments, see the [VMware FAQ](vmware-faq.md).

## Supported operating systems

The following versions of the Windows and Linux operating system are officially supported for the Azure Connected Machine agent. Only x86-64 (64-bit) architectures are supported. x86 (32-bit) and ARM-based architectures, including x86-64 emulation on arm64, are not supported operating environments.

* Windows Server 2008 R2 SP1, 2012 R2, 2016, 2019, and 2022
  * Both Desktop and Server Core experiences are supported
  * Azure Editions are supported when running as a virtual machine on Azure Stack HCI
* Windows 10, 11 (see [client operating system guidance](#client-operating-system-guidance))
* Windows IoT Enterprise
* Azure Stack HCI
* Ubuntu 16.04, 18.04, 20.04, and 22.04 LTS
* Debian 10 and 11
* CentOS Linux 7 and 8
* Rocky Linux 8
* SUSE Linux Enterprise Server (SLES) 12 and 15
* Red Hat Enterprise Linux (RHEL) 7, 8 and 9
* Amazon Linux 2
* Oracle Linux 7 and 8

> [!NOTE]
> On Linux, Azure Arc-enabled servers install several daemon processes. We only support using systemd to manage these processes. In some environments, systemd may not be installed or available, in which case Arc-enabled servers are not supported, even if the distribution is otherwise supported. These environments include Windows Subsystem for Linux (WSL) and most container-based systems, such as Kubernetes or Docker. The Azure Connected Machine agent can be installed on the node that runs the containers but not inside the containers themselves.

> [!WARNING]
> If the Linux hostname or Windows computer name uses a reserved word or trademark, attempting to register the connected machine with Azure will fail. For a list of reserved words, see [Resolve reserved resource name errors](../../azure-resource-manager/templates/error-reserved-resource-name.md).

> [!NOTE]
> While Azure Arc-enabled servers support Amazon Linux, the following features are not supported by this distribution:
>
> * The Dependency agent used by Azure Monitor VM insights
> * Azure Automation Update Management

### Client operating system guidance

The Azure Arc service and Azure Connected Machine Agent are supported on Windows 10 and 11 client operating systems only when those computers are being used in a server-like environment. That is, the computer should always be:

* Connected to the internet
* Connected to a power source
* Powered on

For example, a computer running Windows 11 that's responsible for digital signage, point-of-sale solutions, and general back office management tasks is a good candidate for Azure Arc. End-user productivity machines, such as a laptop which may go offline for long periods of time, shouldn't use Azure Arc and instead should consider [Microsoft Intune](/mem/intune) or [Microsoft Endpoint Configuration Manager](/mem/configmgr).

### Short-lived servers and virtual desktop infrastructure

It is not recommended to use Azure Arc on short-lived (ephemeral) servers or virtual desktop infrastructure (VDI) VMs. Azure Arc is designed for long-term management of servers and is not optimized for scenarios where you are regularly creating and deleting servers. For example, Azure Arc does not know if the agent is offline due to planned system maintenance or if the VM has been deleted, so it will not automatically clean up server resources. This could result in a conflict if a VM is re-created with the same name and tries connecting to Azure Arc, but a resource with the same name already exists.

[Azure Virtual Desktop on Azure Stack HCI](../../virtual-desktop/azure-stack-hci-overview.md) does not use short-lived VMs and supports running Azure Arc in the desktop VMs.

## Software requirements

Windows operating systems:

* NET Framework 4.6 or later is required. [Download the .NET Framework](/dotnet/framework/install/guide-for-developers).
* Windows PowerShell 4.0 or later is required. No action is required for Windows Server 2012 R2 and above. For Windows Server 2008 R2 SP1, [Download Windows Management Framework 5.1.](https://www.microsoft.com/download/details.aspx?id=54616).

Linux operating systems:

* systemd
* wget (to download the installation script)
* openssl
* gnupg

## Required permissions

The following Azure built-in roles are required for different aspects of managing connected machines:

* To onboard machines, you must have the [Azure Connected Machine Onboarding](../../role-based-access-control/built-in-roles.md#azure-connected-machine-onboarding) or [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role for the resource group in which the machines will be managed.
* To read, modify, and delete a machine, you must have the [Azure Connected Machine Resource Administrator](../../role-based-access-control/built-in-roles.md#azure-connected-machine-resource-administrator) role for the resource group.
* To select a resource group from the drop-down list when using the **Generate script** method, as well as the permissions needed to onboard machines, listed above, you must additionally have the [Reader](../../role-based-access-control/built-in-roles.md#reader) role for that resource group (or another role which includes **Reader** access).

## Azure subscription and service limits

There are no limits to the number of Azure Arc-enabled servers you can register in any single resource group, subscription or tenant.

Each Azure Arc-enabled server is associated with an Azure Active Directory object and will count against your directory quota. See [Azure AD service limits and restrictions](../../active-directory/enterprise-users/directory-service-limits-restrictions.md) for information about the maximum number of objects you can have in an Azure AD directory.

## Azure resource providers

To use Azure Arc-enabled servers, the following [Azure resource providers](../../azure-resource-manager/management/resource-providers-and-types.md) must be registered in your subscription:

* **Microsoft.HybridCompute**
* **Microsoft.GuestConfiguration**
* **Microsoft.HybridConnectivity**
* **Microsoft.AzureArcData** (if you plan to Arc-enable SQL Servers)

If these resource providers are not already registered, you can register them using the following commands:

Azure PowerShell:

```azurepowershell-interactive
Connect-AzAccount
Set-AzContext -SubscriptionId [subscription you want to onboard]
Register-AzResourceProvider -ProviderNamespace Microsoft.HybridCompute
Register-AzResourceProvider -ProviderNamespace Microsoft.GuestConfiguration
Register-AzResourceProvider -ProviderNamespace Microsoft.HybridConnectivity
```

Azure CLI:

```azurecli-interactive
az account set --subscription "{Your Subscription Name}"
az provider register --namespace 'Microsoft.HybridCompute'
az provider register --namespace 'Microsoft.GuestConfiguration'
az provider register --namespace 'Microsoft.HybridConnectivity'
```

You can also register the resource providers in the [Azure portal](../../azure-resource-manager/management/resource-providers-and-types.md#azure-portal).

## Next steps

* Review the [networking requirements for deploying Azure Arc-enabled servers](network-requirements.md).
* Before you deploy the Azure Arc-enabled servers agent and integrate with other Azure management and monitoring services, review the [Planning and deployment guide](plan-at-scale-deployment.md).* To resolve problems, review the [agent connection issues troubleshooting guide](troubleshoot-agent-onboard.md).
