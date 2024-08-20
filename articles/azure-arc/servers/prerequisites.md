---
title: Connected Machine agent prerequisites
description: Learn about the prerequisites for installing the Connected Machine agent for Azure Arc-enabled servers.
ms.date: 07/29/2024
ms.topic: conceptual
ms.custom: devx-track-azurepowershell
---

# Connected Machine agent prerequisites

> [!CAUTION]
> This article references CentOS, a Linux distribution that is End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](/azure/virtual-machines/workloads/centos/centos-end-of-life).

This article describes the basic requirements for installing the Connected Machine agent to onboard a physical server or virtual machine to Azure Arc-enabled servers. Some [onboarding methods](deployment-options.md) may have more requirements.

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

If two agents use the same configuration, you'll encounter inconsistent behaviors when both agents try to act as one Azure resource. The best practice for these situations is to use an automation tool or script to onboard the server to Azure Arc after its cloned, restored from backup, or created from a golden image.

> [!NOTE]
> For additional information on using Azure Arc-enabled servers in VMware environments, see the [VMware FAQ](vmware-faq.md).

## Supported operating systems

Azure Arc supports the following Windows and Linux operating systems. Only x86-64 (64-bit) architectures are supported. The Azure Connected Machine agent doesn't run on x86 (32-bit) or ARM-based architectures.

* AlmaLinux 9
* Amazon Linux 2 and 2023
* Azure Linux (CBL-Mariner) 2.0
* Azure Stack HCI
* Debian 11, and 12
* Oracle Linux 7, 8, and 9
* Red Hat Enterprise Linux (RHEL) 7, 8 and 9
* Rocky Linux 8 and 9
* SUSE Linux Enterprise Server (SLES) 12 SP3-SP5 and 15
* Ubuntu 18.04, 20.04, and 22.04 LTS
* Windows 10, 11 (see [client operating system guidance](#client-operating-system-guidance))
* Windows IoT Enterprise
* Windows Server 2012, 2012 R2, 2016, 2019, and 2022
  * Both Desktop and Server Core experiences are supported
  * Azure Editions are supported on Azure Stack HCI

The Azure Connected Machine agent isn't tested on operating systems hardened by the Center for Information Security (CIS) Benchmark.

> [!NOTE]
> [Azure Connected Machine agent version 1.44](agent-release-notes.md#version-144---july-2024) is the last version to officially support Debian 10, Ubuntu 16.04, and Azure Linux (CBL-Mariner) 1.0.
> 

## Limited support operating systems

The following operating system versions have **limited support**. In each case, newer agent versions won't support these operating systems.  The last agent version that supports the operating system is listed, and newer agent releases won't be made available for that system. 
The listed version is supported until the **End of Arc Support Date**. If critical security issues are identified that affect these agent versions, the fixes can be backported to the last supported version, but new functionality or other bug fixes won't be.

| Operating system | Last supported agent version | End of Arc Support Date | Notes |
| -- | -- | -- | -- | 
| Windows Server 2008 R2 SP1 | 1.39 [Download](https://aka.ms/AzureConnectedMachineAgent-1.39)  | 03/31/2025 | Windows Server 2008 and 2008 R2 reached End of Support in January 2020. See [End of support for Windows Server 2008 and Windows Server 2008 R2](/troubleshoot/windows-server/windows-server-eos-faq/end-of-support-windows-server-2008-2008r2). | 
| CentOS 7 and 8 | 1.42  | 05/31/2025 | See the [CentOS End Of Life guidance](/azure/virtual-machines/workloads/centos/centos-end-of-life). | 
| Debian 10 | 1.44  | 07/15/2025 |  | 
| Ubuntu 16.04 | 1.44  | 07/15/2025 |  | 
| Azure Linux (CBL-Mariner) 1.0 | 1.44  | 07/15/2025 |  | 

### Connect new limited support servers

To connect a new server running a Limited Support operating system to Azure Arc, you will need to make some adjustments to the onboarding script.

For Windows, modify the installation script to specify the version required, using the -AltDownload parameter.

Instead of 

```pwsh
    # Install the hybrid agent
    & "$env:TEMP\install_windows_azcmagent.ps1";
```

Use 

```pwsh
    # Install the hybrid agent
    & "$env:TEMP\install_windows_azcmagent.ps1" -AltDownload https://aka.ms/AzureConnectedMachineAgent-1.39;
```

For Linux, the relevant package repository will only contain releases that are applicable, so no special considerations are required. 


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

* Windows Server 2008 R2 SP1 requires PowerShell 4.0 or later. Microsoft recommends running the latest version, [Windows Management Framework 5.1](https://www.microsoft.com/download/details.aspx?id=54616).

Linux operating systems:

* systemd
* wget (to download the installation script)
* openssl
* gnupg (Debian-based systems, only)

## Local user logon right for Windows systems

The Azure Hybrid Instance Metadata Service runs under a low-privileged virtual account, `NT SERVICE\himds`. This account needs the "log on as a service" right in Windows to run. In most cases, there's nothing you need to do because this right is granted to virtual accounts by default. However, if your organization uses Group Policy to customize this setting, you'll need to add `NT SERVICE\himds` to the list of accounts allowed to log on as a service.

You can check the current policy on your machine by opening the Local Group Policy Editor (`gpedit.msc`) from the Start menu and navigating to the following policy item:

Computer Configuration > Windows Settings > Security Settings > Local Policies > User Rights Assignment > Log on as a service

Check if any of `NT SERVICE\ALL SERVICES`, `NT SERVICE\himds`, or `S-1-5-80-4215458991-2034252225-2287069555-1155419622-2701885083` (the static security identifier for NT SERVICE\\himds) are in the list. If none are in the list, you'll need to work with your Group Policy administrator to add `NT SERVICE\himds` to any policies that configure user rights assignments on your servers. The Group Policy administrator needs to make the change on a computer with the Azure Connected Machine agent installed so the object picker resolves the identity correctly. The agent doesn't need to be configured or connected to Azure to make this change.

:::image type="content" source="media/prerequisites/arc-server-user-rights-assignment.png" alt-text="Screen capture of the Local Group Policy Editor showing which users have permissions to log on as a service." border="true":::

## Required permissions

You'll need the following Azure built-in roles for different aspects of managing connected machines:

* To onboard machines, you must have the [Azure Connected Machine Onboarding](../../role-based-access-control/built-in-roles.md#azure-connected-machine-onboarding) or [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role for the resource group where you're managing the servers.
* To read, modify, and delete a machine, you must have the [Azure Connected Machine Resource Administrator](../../role-based-access-control/built-in-roles.md#azure-connected-machine-resource-administrator) role for the resource group.
* To select a resource group from the drop-down list when using the **Generate script** method, you'll also need the [Reader](../../role-based-access-control/built-in-roles.md#reader) role for that resource group (or another role that includes **Reader** access).
* When associating a Private Link Scope with an Arc Server, you must have Microsoft.HybridCompute/privateLinkScopes/read permission on the Private Link Scope Resource.

## Azure subscription and service limits

There are no limits to the number of Azure Arc-enabled servers you can register in any single resource group, subscription, or tenant.

Each Azure Arc-enabled server is associated with a Microsoft Entra object and counts against your directory quota. See [Microsoft Entra service limits and restrictions](../../active-directory/enterprise-users/directory-service-limits-restrictions.md) for information about the maximum number of objects you can have in a Microsoft Entra directory.

## Azure resource providers

To use Azure Arc-enabled servers, the following [Azure resource providers](../../azure-resource-manager/management/resource-providers-and-types.md) must be registered in your subscription:

* **Microsoft.HybridCompute**
* **Microsoft.GuestConfiguration**
* **Microsoft.HybridConnectivity**
* **Microsoft.AzureArcData** (if you plan to Arc-enable SQL Servers)
* **Microsoft.Compute** (for Azure Update Manager and automatic extension upgrades)

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
