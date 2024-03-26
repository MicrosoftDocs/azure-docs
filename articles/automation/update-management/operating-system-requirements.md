---
title: Azure Automation Update Management Supported Clients
description: This article describes the supported Windows and Linux operating systems with Azure Automation Update Management.
services: automation
ms.subservice: update-management
ms.date: 08/01/2023
ms.topic: conceptual
---

# Operating systems supported by Update Management

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

This article details the Windows and Linux operating systems supported and system requirements for machines or servers managed by Update Management.

## Supported operating systems

The following table lists the supported operating systems for update assessments and patching. Patching requires a system Hybrid Runbook Worker, which is automatically installed when you enable the virtual machine or server for management by Update Management. For information on Hybrid Runbook Worker system requirements, see [Deploy a Windows Hybrid Runbook Worker](../automation-windows-hrw-install.md#prerequisites) and [Deploy a Linux Hybrid Runbook Worker](../automation-linux-hrw-install.md#prerequisites).

All operating systems are assumed to be x64. x86 is not supported for any operating system.

> [!NOTE]
> - Update assessment of Linux machines is only supported in certain regions as listed in the Automation account and Log Analytics workspace [mappings table](../how-to/region-mappings.md#supported-mappings-for-log-analytics-and-azure-automation).
> - Update Management does not support CIS hardened images.

# [Windows operating system](#tab/os-win)

|Operating system  |Notes  |
|---------|---------|
| Windows Server 2022 (Datacenter)| |
|Windows Server 2019 (Datacenter/Standard including Server Core)<br><br>Windows Server 2016 (Datacenter/Standard excluding Server Core)<br><br>Windows Server 2012 R2(Datacenter/Standard)<br><br>Windows Server 2012 | |
|Windows Server 2008 R2 (RTM and SP1 Standard)| Update Management supports assessments and patching for this operating system. The [Hybrid Runbook Worker](../automation-windows-hrw-install.md) is supported for Windows Server 2008 R2. |

# [Linux operating system](#tab/os-linux)

> [!NOTE]
> Update assessment of Linux machines is only supported in certain regions as listed in the Automation account and Log Analytics workspace [mappings table](../how-to/region-mappings.md#supported-mappings-for-log-analytics-and-azure-automation).

|Operating system  |Notes  |
|---------|---------|
|CentOS 6, 7, and 8       | Linux agents require access to an update repository. Classification-based patching requires `yum` to return security data that CentOS doesn't have in its RTM releases. For more information on classification-based patching on CentOS, see [Update classifications on Linux](view-update-assessments.md#linux).          |
|Oracle Linux 6.x, 7.x, 8x | Linux agents require access to an update repository.        |
|Red Hat Enterprise 6, 7, and 8      | Linux agents require access to an update repository.        |
|SUSE Linux Enterprise Server 12, 15, and 15.1      | Linux agents require access to an update repository.     |
|Ubuntu 14.04 LTS, 16.04 LTS, 18.04 LTS, and 20.04 LTS       |Linux agents require access to an update repository.         |

---

> [!NOTE]
> Update Management does not support automating update management across all instances in an Azure virtual machine scale set. [Automatic OS image upgrades](../../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md) is the recommended method for managing OS image upgrades on your scale set.

## Unsupported operating systems

The following table lists operating systems not supported by Update Management:

|Operating system  |Notes  |
|---------|---------|
|Windows client     | Client operating systems (such as Windows 7 and Windows 10) aren't supported.<br>For Azure Virtual Desktop, the recommended method to manage updates is [Microsoft Configuration Manager](../../virtual-desktop/configure-automatic-updates.md) for Windows 10 client machine patch management. |
|Windows Server 2016 Nano Server     | Not supported.       |
|Azure Kubernetes Service Nodes | Not supported. Use the patching process described in [Apply security and kernel updates to Linux nodes in Azure Kubernetes Service (AKS)](../../aks/node-updates-kured.md)|

## System requirements

The section describes operating system-specific requirements. For additional guidance, see [Network planning](plan-deployment.md#ports). To understand requirements for TLS 1.2 or higher, see [TLS 1.2 or higher for Azure Automation](../automation-managing-data.md#tls-12-or-higher-for-azure-automation).

# [Windows](#tab/sr-win)

**Software Requirements**:

- .NET Framework 4.6 or later is required. ([Download the .NET Framework](/dotnet/framework/install/guide-for-developers).
- Windows PowerShell 5.1 is required ([Download Windows Management Framework 5.1](https://www.microsoft.com/download/details.aspx?id=54616).)
- The Update Management feature depends on the system Hybrid Runbook Worker role, and you should confirm its [system requirements](../automation-windows-hrw-install.md#prerequisites).

Windows Update agents must be configured to communicate with a Windows Server Update Services (WSUS) server, or they require access to Microsoft Update. For hybrid machines, we recommend installing the Log Analytics agent for Windows by first connecting your machine to [Azure Arc-enabled servers](../../azure-arc/servers/overview.md), and then use Azure Policy to assign the [Deploy Log Analytics agent to Microsoft Azure Arc machines](../../governance/policy/samples/built-in-policies.md#monitoring) built-in policy definition. Alternatively, if you plan to monitor the machines with VM insights, instead use the [Enable Enable VM insights](../../governance/policy/samples/built-in-initiatives.md#monitoring) initiative.

You can use Update Management with Microsoft Configuration Manager. To learn more about integration scenarios, see [Integrate Update Management with Windows Configuration Manager](mecmintegration.md). The [Log Analytics agent for Windows](../../azure-monitor/agents/agent-windows.md) is required for Windows servers managed by sites in your Configuration Manager environment.

By default, Windows VMs that are deployed from Azure Marketplace are set to receive automatic updates from Windows Update Service. This behavior doesn't change when you add Windows VMs to your workspace. If you don't actively manage updates by using Update Management, the default behavior (to automatically apply updates) applies.

> [!NOTE]
> You can modify Group Policy so that machine reboots can be performed only by the user, not by the system. Managed machines can get stuck if Update Management doesn't have rights to reboot the machine without manual interaction from the user. For more information, see [Configure Group Policy settings for Automatic Updates](/windows-server/administration/windows-server-update-services/deploy/4-configure-group-policy-settings-for-automatic-updates).

# [Linux](#tab/sr-linux)

**Software Requirements**:

- The machine requires access to an update repository - private or public.
- TLS 1.1 or TLS 1.2 is required to interact with Update Management.
- The Update Management feature depends on the system Hybrid Runbook Worker role, and you should confirm its [system requirements](../automation-linux-hrw-install.md#prerequisites). Because Update Management uses Automation runbooks to initiate assessment and update of your machines, review the [version of Python required](../automation-linux-hrw-install.md#supported-runbook-types) for your supported Linux distro.

> [!NOTE]
> Update assessment of Linux machines is supported in certain regions only. See the Automation account and Log Analytics workspace [mappings table](../how-to/region-mappings.md#supported-mappings-for-log-analytics-and-azure-automation).


For hybrid machines, we recommend installing the Log Analytics agent for Linux by first connecting your machine to [Azure Arc-enabled servers](../../azure-arc/servers/overview.md), and then use Azure Policy to assign the [Deploy Log Analytics agent to Linux Azure Arc machines](../../governance/policy/samples/built-in-policies.md#monitoring) built-in policy definition. Alternatively, to monitor the machines use the [Enable Azure Monitor for VMs](../../governance/policy/samples/built-in-initiatives.md#monitoring) instead of Azure Monitor for VMs.

## Next steps

Before you enable and use Update Management, review [Plan your Update Management deployment](plan-deployment.md).
