---
title: Connected Machine agent prerequisites
description: Learn about the prerequisites for installing the Connected Machine agent for Azure Arc-enabled servers.
ms.date: 09/14/2022
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

## Supported operating systems

The following versions of the Windows and Linux operating system are officially supported for the Azure Connected Machine agent. Only x86-64 (64-bit) architectures are supported. x86 (32-bit) and ARM-based architectures, including x86-64 emulation on arm64, are not supported operating environments.

* Windows Server 2008 R2 SP1, 2012 R2, 2016, 2019, and 2022
  * Both Desktop and Server Core experiences are supported
  * Azure Editions are supported when running as a virtual machine on Azure Stack HCI
* Windows IoT Enterprise
* Azure Stack HCI
* Ubuntu 16.04, 18.04, and 20.04 LTS
* Debian 10
* CentOS Linux 7 and 8
* SUSE Linux Enterprise Server (SLES) 12 and 15
* Red Hat Enterprise Linux (RHEL) 7 and 8
* Amazon Linux 2
* Oracle Linux 7 and 8

> [!NOTE] 
> On Linux, Azure Arc-enabled servers install several daemon processes. We only support using systemd to manage these processes. In some environments, systemd may not be installed or available, in which case Arc-enabled servers are not supported, even if the distribution is otherwise supported. These environments include **Windows Subsystem for Linux** (WSL) and most container-based systems, such as Kubernetes or Docker. The Azure Connected Machine agent can be installed on the node that runs the containers but not inside the containers themselves.


> [!WARNING]
> If the Linux hostname or Windows computer name uses a reserved word or trademark, attempting to register the connected machine with Azure will fail. For a list of reserved words, see [Resolve reserved resource name errors](../../azure-resource-manager/templates/error-reserved-resource-name.md).

> [!NOTE]
> While Azure Arc-enabled servers support Amazon Linux, the following features are not supported by this distribution:
>
> * The Dependency agent used by Azure Monitor VM insights
> * Azure Automation Update Management

## Software requirements

Windows operating systems:

* NET Framework 4.6 or later is required. [Download the .NET Framework](/dotnet/framework/install/guide-for-developers).
* Windows PowerShell 5.1 is required. [Download Windows Management Framework 5.1.](https://www.microsoft.com/download/details.aspx?id=54616).

Linux operating systems:

* systemd
* wget (to download the installation script)

## Required permissions

The following Azure built-in roles are required for different aspects of managing connected machines:

* To onboard machines, you must have the [Azure Connected Machine Onboarding](../../role-based-access-control/built-in-roles.md#azure-connected-machine-onboarding) or [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role for the resource group in which the machines will be managed.
* To read, modify, and delete a machine, you must have the [Azure Connected Machine Resource Administrator](../../role-based-access-control/built-in-roles.md#azure-connected-machine-resource-administrator) role for the resource group.
* To select a resource group from the drop-down list when using the **Generate script** method, you must have the [Reader](../../role-based-access-control/built-in-roles.md#reader) role for that resource group (or another role which includes **Reader** access).

## Azure subscription and service limits

Azure Arc-enabled servers support up to 5,000 machine instances in a resource group.

Before configuring your machines with Azure Arc-enabled servers, review the Azure Resource Manager [subscription limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#subscription-limits) and [resource group limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#resource-group-limits) to plan for the number of machines to be connected.

## Azure resource providers

To use Azure Arc-enabled servers, the following [Azure resource providers](../../azure-resource-manager/management/resource-providers-and-types.md) must be registered in your subscription:

* **Microsoft.HybridCompute**
* **Microsoft.GuestConfiguration**
* **Microsoft.HybridConnectivity**

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
