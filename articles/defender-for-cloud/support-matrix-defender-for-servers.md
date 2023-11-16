---
title: Support for the Defender for Servers plan
description: Review support requirements for the Defender for Servers plan in Microsoft Defender for Cloud.
ms.topic: limits-and-quotas
author: dcurwin
ms.author: dacurwin
ms.date: 06/11/2023
---

# Defender for Servers support

This article summarizes support information for the Defender for Servers plan in Microsoft Defender for Cloud.

## Network requirements

Validate the following endpoints are configured for outbound access so that Azure Arc extension can connect to Microsoft Defender for Cloud to send security data and events:

- For Defender for Server multicloud deployments, make sure that the [addresses and ports required by Azure Arc](../azure-arc/data/connectivity.md#details-on-internet-addresses-ports-encryption-and-proxy-server-support) are open.

- For deployments with GCP connectors, open port 443 to these URLs:

  - `osconfig.googleapis.com`
  - `compute.googleapis.com`
  - `containeranalysis.googleapis.com`
  - `agentonboarding.defenderforservers.security.azure.com`
  - `gbl.his.arc.azure.com`

- For deployments with AWS connectors, open port 443 to these URLs:

  - `ssm.<region>.amazonaws.com`
  - `ssmmessages.<region>.amazonaws.com`
  - `ec2messages.<region>.amazonaws.com`
  - `gbl.his.arc.azure.com`

## Azure cloud support

This table summarizes Azure cloud support for Defender for Servers features.

**Feature/Plan** | **Azure** | **Azure Government** | **Microsoft Azure operated by 21Vianet**<br/>**21Vianet**
--- | --- | --- | ---
[Microsoft Defender for Endpoint integration](./integration-defender-for-endpoint.md) | GA | GA | NA
[Compliance standards](./regulatory-compliance-dashboard.md)<br/>Compliance standards might differ depending on the cloud type.| GA | GA | GA
[Microsoft Cloud Security Benchmark recommendations for OS hardening](apply-security-baseline.md) | GA | GA | GA
[VM vulnerability scanning-agentless](concept-agentless-data-collection.md) | GA | NA | NA
[VM vulnerability scanning - Microsoft Defender for Endpoint sensor](deploy-vulnerability-assessment-defender-vulnerability-management.md) | GA | NA | NA
[VM vulnerability scanning - Qualys](deploy-vulnerability-assessment-vm.md) | GA | NA | NA
[Just-in-time VM access](./just-in-time-access-usage.md) | GA | GA | GA
[File integrity monitoring](./file-integrity-monitoring-overview.md)  | GA | GA | GA
[Adaptive application controls](./adaptive-application-controls.md)  | GA | GA | GA
[Adaptive network hardening](./adaptive-network-hardening.md) | GA | NA | NA
[Docker host hardening](./harden-docker-hosts.md)  | GA | GA | GA 
[Agentless secret scanning](secret-scanning.md) | Preview | NA | NA

## Windows machine support

The following table shows feature support for Windows machines in Azure, Azure Arc, and other clouds.

| **Feature**                                                                                                                       | **Azure VMs*<br/> **[VM Scale Sets (Flexible orchestration](../virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes.md#scale-sets-with-flexible-orchestration)** | **Azure Arc-enabled machines** |    **Defender for Servers required**    |
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
| Disk encryption assessment                                                                                                        |                                                 ✔</br>(for [supported scenarios](../virtual-machines/windows/disk-encryption-windows.md))                                                 |               -                |                   No                    |
| Third-party vulnerability assessment (BYOL)                                                                                              |                                                                                                        ✔                                                                                                        |               -               |                   No                    |
| [Network security assessment](protect-network-resources.md)                                                                       |                                                                                                        ✔                                                                                                        |               -                |                   No                    |

## Linux machine support

The following table shows feature support for Linux machines in Azure, Azure Arc, and other clouds.

| **Feature**                                                                                                                       | **Azure VMs**<br/> **[VM Scale Sets (Flexible orchestration](../virtual-machine-scale-sets/virtual-machine-scale-sets-orchestration-modes.md#scale-sets-with-flexible-orchestration)** | **Azure Arc-enabled machines** |    **Defender for Servers required**    |
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
| Disk encryption assessment                                                                                                        |                                                 ✔</br>(for [supported scenarios](../virtual-machines/windows/disk-encryption-windows.md))                                                 |               -                |                   No                    |
| Third-party vulnerability assessment (BYOL)                                                                                             |                                                                                                        ✔                                                                                                        |               -               |                   No                    |
| [Network security assessment](protect-network-resources.md)                                                                       |                                                                                                        ✔                                                                                                        |               -                |                   No                    |

## Multicloud machines

The following table shows feature support for AWS and GCP machines.

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
| Disk encryption assessment | ✔</br>(for [supported scenarios](../virtual-machines/windows/disk-encryption-windows.md)) | ✔</br>(for [supported scenarios](../virtual-machines/windows/disk-encryption-windows.md)) |
| Third-party vulnerability assessment | - | - |
| [Network security assessment](protect-network-resources.md) | - | - |
| [Cloud security explorer](how-to-manage-cloud-security-explorer.md) | ✔ | - |
| [Agentless secret scanning](secret-scanning.md) | ✔ | - |

## Endpoint protection support

The following table provides a matrix of supported endpoint protection solutions. The table indicates whether you can use Defender for Cloud to install each solution for you.

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

<sup><a name="footnote2"></a>2</sup> With the Defender for Endpoint unified solution on Server 2012 R2, it automatically installs Microsoft Defender Antivirus in Active mode. For Windows Server 2016, Microsoft Defender Antivirus is built into the OS.

## Next steps

Start planning your [Defender for Servers deployment](plan-defender-for-servers.md).
