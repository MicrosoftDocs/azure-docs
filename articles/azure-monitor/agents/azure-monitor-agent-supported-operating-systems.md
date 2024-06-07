---
title: Azure Monitor Agent supported operating systems
description: Identifies the operating systems supported by Azure Monitor Agent and legacy agents.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 04/11/2024
ms.custom: references_regions
ms.reviewer: jeffwo

# Customer intent: As an IT manager, I want to understand the capabilities of Azure Monitor Agent to determine whether I can use the agent to collect the data I need from the operating systems of my virtual machines.

---

# Azure Monitor Agent supported operating systems and environments
This article identifies the operating systems supported by [Azure Monitor Agent](./azure-monitor-agent-overview.md) and [legacy agents](./log-analytics-agent.md). 

> [!NOTE]
> All operating systems listed are assumed to be x64. x86 isn't supported for any operating system.

## Windows

| Operating system | Azure Monitor agent | Legacy agent|
|:---|:---:|:---:
| Windows Server 2022                                      | ✓ | ✓ |
| Windows Server 2022 Core                                 | ✓ |   |
| Windows Server 2019                                      | ✓ | ✓ |
| Windows Server 2019 Core                                 | ✓ |   |
| Windows Server 2016                                      | ✓ | ✓ |
| Windows Server 2016 Core                                 | ✓ |   |
| Windows Server 2012 R2                                   | ✓ | ✓ |
| Windows Server 2012                                      | ✓ | ✓ |
| Windows 11 Client and Pro                                | ✓<sup>1</sup>, <sup>2</sup> |  |
| Windows 11 Enterprise<br>(including multi-session)       | ✓ |  |
| Windows 10 1803 (RS4) and higher                         | ✓<sup>1</sup> |  |
| Windows 10 Enterprise<br>(including multi-session) and Pro<br>(Server scenarios only)  | ✓ | ✓ |
| Azure Stack HCI                                          | ✓ | ✓ |
| Windows IoT Enterprise                                   | ✓ |   |

<sup>1</sup> Requires Azure Monitor agent [client installer](./azure-monitor-agent-windows-client.md).<br>
<sup>2</sup> Also supported on Arm64-based machines.

## Linux

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

| Operating system | Azure Monitor agent <sup>1</sup> | Legacy Agent <sup>1</sup> |
|:---|:---:|:---:|
| AlmaLinux 9                                                 | ✓<sup>2</sup> | ✓ |
| AlmaLinux 8                                                 | ✓<sup>2</sup> | ✓ |
| Amazon Linux 2017.09                                        |  | ✓ |
| Amazon Linux 2                                              | ✓ | ✓ |
| Azure Linux                                                 | ✓ |   |
| CentOS Linux 8                                              | ✓ | ✓ |
| CentOS Linux 7                                              | ✓<sup>2</sup> | ✓ |
| CBL-Mariner 2.0                                             | ✓<sup>2,3</sup> |   |
| Debian 11                                                   | ✓<sup>2</sup> | ✓ |
| Debian 10                                                   | ✓ | ✓ |
| Debian 9                                                    | ✓ | ✓ |
| Debian 8                                                    |   | ✓ |
| OpenSUSE 15                                                 | ✓ | ✓ |
| Oracle Linux 9                                              | ✓ |  |
| Oracle Linux 8                                              | ✓ | ✓ |
| Oracle Linux 7                                              | ✓ | ✓ |
| Oracle Linux 6.4+                                           |   |  |
| Red Hat Enterprise Linux Server 9+                          | ✓ | ✓ |
| Red Hat Enterprise Linux Server 8.6+                        | ✓<sup>2</sup> | ✓ |
| Red Hat Enterprise Linux Server 8.0-8.5                     | ✓ | ✓ |
| Red Hat Enterprise Linux Server 7                           | ✓ | ✓ |
| Red Hat Enterprise Linux Server 6.7+                        |   |  |
| Rocky Linux 9                                               | ✓ | ✓ | 
| Rocky Linux 8                                               | ✓ | ✓ |
| SUSE Linux Enterprise Server 15 SP4                         | ✓<sup>2</sup> | ✓   |
| SUSE Linux Enterprise Server 15 SP3                         | ✓ | ✓ |
| SUSE Linux Enterprise Server 15 SP2                         | ✓ | ✓ |
| SUSE Linux Enterprise Server 15 SP1                         | ✓ | ✓ |
| SUSE Linux Enterprise Server 15                             | ✓ | ✓ |
| SUSE Linux Enterprise Server 12                             | ✓ | ✓ |
| Ubuntu 22.04 LTS                                            | ✓ | ✓ |
| Ubuntu 20.04 LTS                                            | ✓<sup>2</sup> | ✓ |
| Ubuntu 18.04 LTS                                            | ✓<sup>2</sup> | ✓ |
| Ubuntu 16.04 LTS                                            | ✓ | ✓ |
| Ubuntu 14.04 LTS                                            |   | ✓ |

<sup>1</sup> Requires Python (2 or 3) to be installed on the machine.<br>
<sup>2</sup> Also supported on Arm64-based machines.<br>
<sup>3</sup> Does not include the required least 4GB of disk space by default. See note below.

> [!NOTE]
> Machines and appliances that run heavily customized or stripped-down versions of the above distributions and hosted solutions that disallow customization by the user are not supported. Azure Monitor and legacy agents rely on various packages and other baseline functionality that is often removed from such systems, and their installation may require some environmental modifications considered to be disallowed by the appliance vendor. For example, [GitHub Enterprise Server](https://docs.github.com/en/enterprise-server/admin/overview/about-github-enterprise-server) is not supported due to heavy customization as well as [documented, license-level disallowance](https://docs.github.com/en/enterprise-server/admin/overview/system-overview#operating-system-software-and-patches) of operating system modification.

> [!NOTE]
> CBL-Mariner 2.0's disk size is by default about 1GB to provide storage savings, compared to other Azure VMs that are about 30GB. The Azure Monitor Agent requires at least 4GB disk size in order to install and run successfully. See [CBL-Mariner's documentation](https://eng.ms/docs/products/mariner-linux/gettingstarted/azurevm/azurevm#disk-size) for more information and instructions on how to increase disk size before installing the agent.

## Linux Hardening Standards

The Azure Monitoring Agent for Linux supports various hardening standards for Linux operating systems and distros. Every release of the agent is tested and certified against the supported hardening standards using images that are publicly available on the Azure Marketplace and published by CIS. Only the settings and hardening that are applied to those images are supported. If you apply additional customizations on your own golden images, and those settings are not covered by the CIS images, it will be considered a non-supported scenario.

> [!NOTE]
> Only the Azure Monitoring Agent for Linux will support these hardening standards. They are not supported by the legacy Log Analytics Agent or the Diagnostics Extension.

Currently supported hardening standards:
- SELinux
- CIS Lvl 1 and 2<sup>1</sup>
- STIG
- FIPs
- FedRamp

| Operating system | Azure Monitor agent <sup>1</sup> | Legacy Agent<sup>1</sup> |
|:---|:---:|:---:|:---:|
| CentOS Linux 7 | ✓ |   |
| Debian 10      | ✓ |   |
| Ubuntu 18      | ✓ |   |
| Ubuntu 20      | ✓ |   |
| Red Hat Enterprise Linux Server 7 | ✓ |   |
| Red Hat Enterprise Linux Server 8 | ✓ |   |

<sup>1</sup> Supports only the above distros and version

## On-premises and other clouds
Both on-premises machines and machines connected to other clouds require [Azure Arc-enabled servers](../../azure-arc/overview.md). You must install the  to support Azure Monitor agent. You must install the [Azure Connected Machine agent](../../azure-arc/servers/learn/quick-enable-hybrid-vm.md) before Azure Monitor agent can be installed. See [Supported operating systems](../../azure-arc/servers/prerequisites.md#supported-operating-systems)for operating systems that are supported by Azure Arc.

Azure Monitor Agent authenticates to your workspace via managed identity, which is created when you install the Connected Machine agent. Managed Identity is a more secure and manageable authentication solution from Azure. The legacy Log Analytics agent authenticated by using the workspace ID and key instead, so it didn't need Azure Arc.

The Azure Arc requirement comes at no extra cost or resource consumption. The Azure Arc agent is only used as an installation mechanism. You don't need to enable the paid management features if you don't want to use them.




## Next steps

- [Install the Azure Monitor Agent](azure-monitor-agent-manage.md) on Windows and Linux virtual machines.
- [Create a data collection rule](data-collection-rule-azure-monitor-agent.md) to collect data from the agent and send it to Azure Monitor.
