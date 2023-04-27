---
title: Matrices of Defender for Servers features in foundational CSPM, Azure Arc, multicloud, and endpoint protection solutions
description: Learn about the environments where you can protect servers and virtual machines with Defender for Servers.
ms.topic: limits-and-quotas
author: bmansheim
ms.author: benmansheim
ms.date: 01/01/2023
---

# Support matrices for Defender for Servers

This article provides information about the environments where you can protect servers and virtual machines with Defender for Servers and the endpoint protections that you can use to protect them.

## Supported features for virtual machines and servers<a name="vm-server-features"></a>

The following tables show the features that are supported for virtual machines and servers in Azure, Azure Arc, and other clouds.

- [Windows machines](#windows-machines)
- [Linux machines](#linux-machines)
- [Multicloud machines](#multicloud-machines)

### Windows machines

| **Feature**                                                                                                                       | **Azure Virtual Machines and [Virtual Machine Scale Sets with Flexible orchestration](../virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes.md#scale-sets-with-flexible-orchestration)** | **Azure Arc-enabled machines** |    **Defender for Servers required**    |
| --------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------: | :-------------------------------------: |
| [Microsoft Defender for Endpoint integration](integration-defender-for-endpoint.md)                                               |                                                                                          ✔</br>(on supported versions)                                                                                          |               ✔               |                   Yes                   |
| [Virtual machine behavioral analytics (and security alerts)](alerts-reference.md)                                                 |                                                                                                        ✔                                                                                                        |               ✔               |                   Yes                   |
| [Fileless security alerts](alerts-reference.md#alerts-windows)                                                                    |                                                                                                        ✔                                                                                                        |               ✔               |                   Yes                   |
| [Network-based security alerts](other-threat-protections.md#network-layer)                                                        |                                                                                                        ✔                                                                                                        |               -                |                   Yes                   |
| [Just-in-time VM access](just-in-time-access-usage.md)                                                                            |                                                                                                        ✔                                                                                                        |               -                |                   Yes                   |
| [Integrated Qualys vulnerability scanner](deploy-vulnerability-assessment-vm.md#overview-of-the-integrated-vulnerability-scanner) |                                                                                                        ✔                                                                                                        |               ✔               |                   Yes                   |
| [File Integrity Monitoring](file-integrity-monitoring-overview.md)                                                                |                                                                                                        ✔                                                                                                        |               ✔               |                   Yes                   |
| [Adaptive application controls](adaptive-application-controls.md)                                                                 |                                                                                                        ✔                                                                                                        |               ✔               |                   Yes                   |
| [Network map](protect-network-resources.md#network-map)                                                                           |                                                                                                        ✔                                                                                                        |               -                |                   Yes                   |
| [Adaptive network hardening](adaptive-network-hardening.md)                                                                       |                                                                                                        ✔                                                                                                        |               -                |                   Yes                   |
| [Regulatory compliance dashboard & reports](regulatory-compliance-dashboard.md)                                                   |                                                                                                        ✔                                                                                                        |               ✔               |                   Yes                   |
| [Docker host hardening](./harden-docker-hosts.md)                                                                                 |                                                                                                        -                                                                                                         |               -                |                   Yes                   |
| Missing OS patches assessment                                                                                                     |                                                                                                        ✔                                                                                                        |               ✔               | Azure: No<br><br>Azure Arc-enabled: Yes |
| Security misconfigurations assessment                                                                                             |                                                                                                        ✔                                                                                                        |               ✔               | Azure: No<br><br>Azure Arc-enabled: Yes |
| [Endpoint protection assessment](supported-machines-endpoint-solutions-clouds-servers.md#supported-endpoint-protection-solutions) |                                                                                                        ✔                                                                                                        |               ✔               | Azure: No<br><br>Azure Arc-enabled: Yes |
| Disk encryption assessment                                                                                                        |                                                 ✔</br>(for [supported scenarios](../virtual-machines/windows/disk-encryption-windows.md#unsupported-scenarios))                                                 |               -                |                   No                    |
| Third-party vulnerability assessment (BYOL)                                                                                              |                                                                                                        ✔                                                                                                        |               -               |                   No                    |
| [Network security assessment](protect-network-resources.md)                                                                       |                                                                                                        ✔                                                                                                        |               -                |                   No                    |

### Linux machines

| **Feature**                                                                                                                       | **Azure Virtual Machines and [Virtual Machine Scale Sets with Flexible orchestration](../virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes.md#scale-sets-with-flexible-orchestration)** | **Azure Arc-enabled machines** |    **Defender for Servers required**    |
| --------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------: | :-------------------------------------: |
| [Microsoft Defender for Endpoint integration](integration-defender-for-endpoint.md)                                               |                                                                                                        ✔                                                                                                        |               ✔               |                   Yes                   |
| [Virtual machine behavioral analytics (and security alerts)](./azure-defender.md)                                                 |                                                                                          ✔</br>(on supported versions)                                                                                          |               ✔               |                   Yes                   |
| [Fileless security alerts](alerts-reference.md#alerts-windows)                                                                    |                                                                                                        -                                                                                                         |               -                |                   Yes                   |
| [Network-based security alerts](other-threat-protections.md#network-layer)                                                        |                                                                                                        ✔                                                                                                        |               -                |                   Yes                   |
| [Just-in-time VM access](just-in-time-access-usage.md)                                                                            |                                                                                                        ✔                                                                                                        |               -                |                   Yes                   |
| [Integrated Qualys vulnerability scanner](deploy-vulnerability-assessment-vm.md#overview-of-the-integrated-vulnerability-scanner) |                                                                                                        ✔                                                                                                        |               ✔               |                   Yes                   |
| [File Integrity Monitoring](file-integrity-monitoring-overview.md)                                                                |                                                                                                        ✔                                                                                                        |               ✔               |                   Yes                   |
| [Adaptive application controls](adaptive-application-controls.md)                                                                 |                                                                                                        ✔                                                                                                        |               ✔               |                   Yes                   |
| [Network map](protect-network-resources.md#network-map)                                                                           |                                                                                                        ✔                                                                                                        |               -                |                   Yes                   |
| [Adaptive network hardening](adaptive-network-hardening.md)                                                                       |                                                                                                        ✔                                                                                                        |               -                |                   Yes                   |
| [Regulatory compliance dashboard & reports](regulatory-compliance-dashboard.md)                                                   |                                                                                                        ✔                                                                                                        |               ✔               |                   Yes                   |
| [Docker host hardening](./harden-docker-hosts.md)                                                                                 |                                                                                                        ✔                                                                                                        |               ✔               |                   Yes                   |
| Missing OS patches assessment                                                                                                     |                                                                                                        ✔                                                                                                        |               ✔               | Azure: No<br><br>Azure Arc-enabled: Yes |
| Security misconfigurations assessment                                                                                             |                                                                                                        ✔                                                                                                        |               ✔               | Azure: No<br><br>Azure Arc-enabled: Yes |
| [Endpoint protection assessment](supported-machines-endpoint-solutions-clouds-servers.md#supported-endpoint-protection-solutions) |                                                                                                        -                                                                                                         |               -                |                   No                    |
| Disk encryption assessment                                                                                                        |                                                 ✔</br>(for [supported scenarios](../virtual-machines/windows/disk-encryption-windows.md#unsupported-scenarios))                                                 |               -                |                   No                    |
| Third-party vulnerability assessment (BYOL)                                                                                             |                                                                                                        ✔                                                                                                        |               -               |                   No                    |
| [Network security assessment](protect-network-resources.md)                                                                       |                                                                                                        ✔                                                                                                        |               -                |                   No                    |

### Multicloud machines

| **Feature** | **Availability in AWS** | **Availability in GCP** |
|--|:-:|
| [Microsoft Defender for Endpoint integration](integration-defender-for-endpoint.md) | ✔ | ✔ |
| [Virtual machine behavioral analytics (and security alerts)](alerts-reference.md) | ✔ | ✔ |
| [Fileless security alerts](alerts-reference.md#alerts-windows) | ✔ | ✔ |
| [Network-based security alerts](other-threat-protections.md#network-layer) | - | - |
| [Just-in-time VM access](just-in-time-access-usage.md) | ✔ | - |
| [Integrated Qualys vulnerability scanner](deploy-vulnerability-assessment-vm.md#overview-of-the-integrated-vulnerability-scanner) | ✔ | ✔ |
| [File Integrity Monitoring](file-integrity-monitoring-overview.md) | ✔ | ✔ |
| [Adaptive application controls](adaptive-application-controls.md) | ✔ | ✔ |
| [Network map](protect-network-resources.md#network-map) | - | - |
| [Adaptive network hardening](adaptive-network-hardening.md) | - | - |
| [Regulatory compliance dashboard & reports](regulatory-compliance-dashboard.md) | ✔ | ✔ |
| [Docker host hardening](harden-docker-hosts.md) | ✔ | ✔ |
| Missing OS patches assessment | ✔ | ✔ |
| Security misconfigurations assessment | ✔ | ✔ |
| [Endpoint protection assessment](supported-machines-endpoint-solutions-clouds-servers.md#supported-endpoint-protection-solutions) | ✔ | ✔ |
| Disk encryption assessment | ✔</br>(for [supported scenarios](../virtual-machines/windows/disk-encryption-windows.md#unsupported-scenarios)) | ✔</br>(for [supported scenarios](../virtual-machines/windows/disk-encryption-windows.md#unsupported-scenarios)) |
| Third-party vulnerability assessment | - | - |
| [Network security assessment](protect-network-resources.md) | - | - |
| [Cloud security explorer](how-to-manage-cloud-security-explorer.md) | ✔ | - |

> [!TIP]
>To experiment with features that are only available with enhanced security features enabled, you can enroll in a 30-day trial. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).


<a name="endpoint-supported"></a>

## Supported endpoint protection solutions

The following table provides a matrix of supported endpoint protection solutions and whether you can use Microsoft Defender for Cloud to install each solution for you.

For information about when recommendations are generated for each of these solutions, see [Endpoint Protection Assessment and Recommendations](endpoint-protection-recommendations-technical.md).

| Solution                                                            | Supported platforms          | Defender for Cloud installation |
|---------------------------------------------------------------------|------------------------------|---------------------------------|
| Microsoft Defender Antivirus                                        | Windows Server 2016 or later | No (built into OS)              |
| System Center Endpoint Protection (Microsoft Antimalware)           | Windows Server 2012 R2       | Via extension                   |
| Trend Micro – Deep Security                                         | Windows Server (all)         | No                              |
| Symantec v12.1.1100+                                                | Windows Server (all)         | No                              |
| McAfee v10+                                                         | Windows Server (all)         | No                              |
| McAfee v10+                                                         | Linux (GA)                   | No                              |
| Microsoft Defender for Endpoint for Linux<sup>[1](#footnote1)</sup> | Linux (GA)                   | Via extension                   |
| Microsoft Defender for Endpoint Unified Solution<sup>[2](#footnote2)</sup>                    | Windows Server 2012 R2 and Windows 2016 | Via extension                   |
| Sophos V9+                                                          | Linux (GA)                   | No                              |


<sup><a name="footnote1"></a>1</sup> It's not enough to have Microsoft Defender for Endpoint on the Linux machine: the machine will only appear as healthy if the always-on scanning feature (also known as real-time protection (RTP)) is active. By default, the RTP feature is **disabled** to avoid clashes with other AV software.

<sup><a name="footnote2"></a>2</sup> With the MDE unified solution on Server 2012 R2, it automatically installs Microsoft Defender Antivirus in Active mode. For Windows Server 2016, Microsoft Defender Antivirus is built into the OS.

## Next steps

- Learn how [Defender for Cloud collects data using the Log Analytics agent](monitoring-components.md#log-analytics-agent).
- Learn how [Defender for Cloud manages and safeguards data](data-security.md).
