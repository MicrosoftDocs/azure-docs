---
title: Microsoft Defender for Cloud's servers features according to OS, machine type, and cloud
description: Learn about the availability of Microsoft Defender for Cloud's servers features according to OS, machine type, and cloud deployment.
ms.topic: overview
ms.date: 03/08/2022
ms.custom: references_regions, ignite-2022
---

# Feature coverage for machines

The **tabs** below show the features of Microsoft Defender for Cloud that are available for Windows and Linux machines.

## Supported features for virtual machines and servers<a name="vm-server-features"></a>

### [**Windows machines**](#tab/features-windows)

| **Feature**                                                                                                                       | **Azure Virtual Machines**                                                                                      | **Azure Virtual Machine Scale Sets** | **Azure Arc-enabled machines** | **Defender for Servers required** |
|-----------------------------------------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------:|:------------------------------------:|:------------------------------:|:---------------------------------------:|
| [Microsoft Defender for Endpoint integration](integration-defender-for-endpoint.md)                                               | ✔</br>(on supported versions)                                                                                  | ✔</br>(on supported versions)        | ✔                             | Yes                                     |
| [Virtual machine behavioral analytics (and security alerts)](alerts-reference.md)                                                 | ✔                                                                                                              | ✔                                    | ✔                             | Yes                                     |
| [Fileless security alerts](alerts-reference.md#alerts-windows)                                                                    | ✔                                                                                                              | ✔                                    | ✔                             | Yes                                     |
| [Network-based security alerts](other-threat-protections.md#network-layer)                                                        | ✔                                                                                                              | ✔                                    | -                              | Yes                                     |
| [Just-in-time VM access](just-in-time-access-usage.md)                                                                            | ✔                                                                                                              | -                                    | -                              | Yes                                     |
| [Integrated Qualys vulnerability scanner](deploy-vulnerability-assessment-vm.md#overview-of-the-integrated-vulnerability-scanner) | ✔                                                                                                              | -                                    | ✔                             | Yes                                     |
| [File Integrity Monitoring](file-integrity-monitoring-overview.md)                                                                | ✔                                                                                                              | ✔                                    | ✔                             | Yes                                     |
| [Adaptive application controls](adaptive-application-controls.md)                                                                 | ✔                                                                                                              | -                                    | ✔                             | Yes                                     |
| [Network map](protect-network-resources.md#network-map)                                                                           | ✔                                                                                                              | ✔                                    | -                              | Yes                                     |
| [Adaptive network hardening](adaptive-network-hardening.md)                                                                       | ✔                                                                                                              | -                                    | -                              | Yes                                     |
| [Regulatory compliance dashboard & reports](regulatory-compliance-dashboard.md)                                                   | ✔                                                                                                              | ✔                                    | ✔                             | Yes                                     |
| [Docker host hardening](./harden-docker-hosts.md)                                                                                 | -                                                                                                               | -                                    | -                              | Yes                                     |
| Missing OS patches assessment                                                                                                     | ✔                                                                                                              | ✔                                    | ✔                             | Azure: No<br><br>Azure Arc-enabled: Yes |
| Security misconfigurations assessment                                                                                             | ✔                                                                                                              | ✔                                    | ✔                             | Azure: No<br><br>Azure Arc-enabled: Yes |
| [Endpoint protection assessment](supported-machines-endpoint-solutions-clouds-servers.md#supported-endpoint-protection-solutions)        | ✔                                                                                                              | ✔                                    | ✔                             | Azure: No<br><br>Azure Arc-enabled: Yes |
| Disk encryption assessment                                                                                                        | ✔</br>(for [supported scenarios](../virtual-machines/windows/disk-encryption-windows.md#unsupported-scenarios)) | ✔                                    | -                              | No                                      |
| Third-party vulnerability assessment                                                                                              | ✔                                                                                                              | -                                    | ✔                             | No                                      |
| [Network security assessment](protect-network-resources.md)                                                                       | ✔                                                                                                              | ✔                                    | -                              | No                                      |


### [**Linux machines**](#tab/features-linux)

| **Feature**                                                                                                                       | **Azure Virtual Machines**                                                                                      | **Azure Virtual Machine Scale Sets** | **Azure Arc-enabled machines** | **Defender for Servers required** |
|-----------------------------------------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------------------------:|:------------------------------------:|:------------------------------:|:---------------------------------------:|
| [Microsoft Defender for Endpoint integration](integration-defender-for-endpoint.md)                                               | ✔                                                                                                              | -                                    | ✔                             | Yes                                     |
| [Virtual machine behavioral analytics (and security alerts)](./azure-defender.md)                                                 | ✔</br>(on supported versions)                                                                                  | ✔</br>(on supported versions)        | ✔                             | Yes                                     |
| [Fileless security alerts](alerts-reference.md#alerts-windows)                                                                    | -                                                                                                               | -                                    | -                              | Yes                                     |
| [Network-based security alerts](other-threat-protections.md#network-layer)                                                        | ✔                                                                                                              | ✔                                    | -                              | Yes                                     |
| [Just-in-time VM access](just-in-time-access-usage.md)                                                                            | ✔                                                                                                              | -                                    | -                              | Yes                                     |
| [Integrated Qualys vulnerability scanner](deploy-vulnerability-assessment-vm.md#overview-of-the-integrated-vulnerability-scanner) | ✔                                                                                                              | -                                    | ✔                             | Yes                                     |
| [File Integrity Monitoring](file-integrity-monitoring-overview.md)                                                                | ✔                                                                                                              | ✔                                    | ✔                             | Yes                                     |
| [Adaptive application controls](adaptive-application-controls.md)                                                                 | ✔                                                                                                              | -                                    | ✔                             | Yes                                     |
| [Network map](protect-network-resources.md#network-map)                                                                           | ✔                                                                                                              | ✔                                    | -                              | Yes                                     |
| [Adaptive network hardening](adaptive-network-hardening.md)                                                                       | ✔                                                                                                              | -                                    | -                              | Yes                                     |
| [Regulatory compliance dashboard & reports](regulatory-compliance-dashboard.md)                                                   | ✔                                                                                                              | ✔                                    | ✔                             | Yes                                     |
| [Docker host hardening](./harden-docker-hosts.md)                                                                                 | ✔                                                                                                              | ✔                                    | ✔                             | Yes                                     |
| Missing OS patches assessment                                                                                                     | ✔                                                                                                              | ✔                                    | ✔                             | Azure: No<br><br>Azure Arc-enabled: Yes |
| Security misconfigurations assessment                                                                                             | ✔                                                                                                              | ✔                                    | ✔                             | Azure: No<br><br>Azure Arc-enabled: Yes |
| [Endpoint protection assessment](supported-machines-endpoint-solutions-clouds-servers.md#supported-endpoint-protection-solutions)        | -                                                                                                               | -                                    | -                              | No                                      |
| Disk encryption assessment                                                                                                        | ✔</br>(for [supported scenarios](../virtual-machines/windows/disk-encryption-windows.md#unsupported-scenarios)) | ✔                                    | -                              | No                                      |
| Third-party vulnerability assessment                                                                                              | ✔                                                                                                              | -                                    | ✔                             | No                                      |
| [Network security assessment](protect-network-resources.md)                                                                       | ✔                                                                                                              | ✔                                    | -                              | No                                      |



### [**Multicloud machines**](#tab/features-multicloud)

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


--- 

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
| Sophos V9+                                                          | Linux (GA)                   | No                              |


<sup><a name="footnote1"></a>1</sup> It's not enough to have Microsoft Defender for Endpoint on the Linux machine: the machine will only appear as healthy if the always-on scanning feature (also known as real-time protection (RTP)) is active. By default, the RTP feature is **disabled** to avoid clashes with other AV software.




## Feature support in government and national clouds

| Feature/Service                                                                                                                                               | Azure          | Azure Government               | Azure China 21Vianet           |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|--------------------------------|--------------------------------|
| **Defender for Cloud free features**                                                                                                                          |                |                                |                                |
| - [Continuous export](./continuous-export.md)                                                                                                                 | GA             | GA                             | GA                             |
| - [Workflow automation](./workflow-automation.md)                                                                                                             | GA             | GA                             | GA                             |
| - [Recommendation exemption rules](./exempt-resource.md)                                                                                                      | Public Preview | Not Available                  | Not Available                  |
| - [Alert suppression rules](./alerts-suppression-rules.md)                                                                                                    | GA             | GA                             | GA                             |
| - [Email notifications for security alerts](./configure-email-notifications.md)                                                                               | GA             | GA                             | GA                             |
| - [Deployment of agents and extensions](monitoring-components.md)                                                                                  | GA             | GA                             | GA                             |
| - [Asset inventory](./asset-inventory.md)                                                                                                                     | GA             | GA                             | GA                             |
| - [Azure Monitor Workbooks reports in Microsoft Defender for Cloud's workbooks gallery](./custom-dashboards-azure-workbooks.md)                               | GA             | GA                             | GA                             |
| - [Integration with Microsoft Defender for Cloud Apps](./other-threat-protections.md#display-recommendations-in-microsoft-defender-for-cloud-apps)                | GA             | Not Available                  | Not Available                  |
| **Microsoft Defender plans and extensions**                                                                                                                   |                |                                |                                |
| - [Microsoft Defender for Servers](./defender-for-servers-introduction.md)                                                                                    | GA             | GA                             | GA                             |
| - [Microsoft Defender for App Service](./defender-for-app-service-introduction.md)                                                                            | GA             | Not Available                  | Not Available                  |
| - [Microsoft Defender for DNS](./defender-for-dns-introduction.md)                                                                                            | GA             | GA                             | GA                             |
| - [Microsoft Defender for container registries](./defender-for-container-registries-introduction.md) <sup>[1](#footnote1)</sup>                               | GA             | GA  <sup>[2](#footnote2)</sup> | GA  <sup>[2](#footnote2)</sup> |
| - [Microsoft Defender for Kubernetes](./defender-for-kubernetes-introduction.md) <sup>[4](#footnote4)</sup>                                                   | GA             | GA                             | GA                             |
| - [Microsoft Defender for Containers](./defender-for-containers-introduction.md) <sup>[10](#footnote4)</sup>                                                  | GA             | GA                             | GA                             |
| - [Defender extension for Azure Arc-enabled Kubernetes clusters, servers or data services](./defender-for-kubernetes-azure-arc.md) <sup>[5](#footnote5)</sup> | Public Preview | Not Available                  | Not Available                  |
| - [Microsoft Defender for Azure SQL database servers](./defender-for-sql-introduction.md)                                                                     | GA             | GA                             | GA  <sup>[9](#footnote9)</sup> |
| - [Microsoft Defender for SQL servers on machines](./defender-for-sql-introduction.md)                                                                        | GA             | GA                             | Not Available                  |
| - [Microsoft Defender for open-source relational databases](./defender-for-databases-introduction.md)                                                         | GA             | Not Available                  | Not Available                  |
| - [Microsoft Defender for Key Vault](./defender-for-key-vault-introduction.md)                                                                                | GA             | Not Available                  | Not Available                  |
| - [Microsoft Defender for Resource Manager](./defender-for-resource-manager-introduction.md)                                                                  | GA             | GA                             | GA                             |
| - [Microsoft Defender for Storage](./defender-for-storage-introduction.md) <sup>[6](#footnote6)</sup>                                                         | GA             | GA                             | Not Available                  |
| - [Microsoft Defender for Azure Cosmos DB](concept-defender-for-cosmos.md)                                              | Public Preview | Not Available                  | Not Available                  |
| - [Kubernetes workload protection](./kubernetes-workload-protections.md)                                                                                      | GA             | GA                             | GA                             |
| - [Bi-directional alert synchronization with Sentinel](../sentinel/connect-azure-security-center.md)                                                          | Public Preview | Not Available                  | Not Available                  |
| **Microsoft Defender for Servers features** <sup>[7](#footnote7)</sup>                                                                                        |                |                                |                                |
| - [Just-in-time VM access](./just-in-time-access-usage.md)                                                                                                    | GA             | GA                             | GA                             |
| - [File Integrity Monitoring](./file-integrity-monitoring-overview.md)                                                                                        | GA             | GA                             | GA                             |
| - [Adaptive application controls](./adaptive-application-controls.md)                                                                                         | GA             | GA                             | GA                             |
| - [Adaptive network hardening](./adaptive-network-hardening.md)                                                                                               | GA             | Not Available                  | Not Available                  |
| - [Docker host hardening](./harden-docker-hosts.md)                                                                                                           | GA             | GA                             | GA                             |
| - [Integrated Qualys vulnerability scanner](./deploy-vulnerability-assessment-vm.md)                                                                          | GA             | Not Available                  | Not Available                  |
| - [Regulatory compliance dashboard & reports](./regulatory-compliance-dashboard.md) <sup>[8](#footnote8)</sup>                                                | GA             | GA                             | GA                             |
| - [Microsoft Defender for Endpoint deployment and integrated license](./integration-defender-for-endpoint.md)                                                 | GA             | GA                             | Not Available                  |
| - [Connect AWS account](./quickstart-onboard-aws.md)                                                                                                          | GA             | Not Available                  | Not Available                  |
| - [Connect GCP project](./quickstart-onboard-gcp.md)                                                                                                          | GA             | Not Available                  | Not Available                  |


<sup><a name="footnote1"></a>1</sup> Partially GA: The ability to disable specific findings from vulnerability scans is in public preview.

<sup><a name="footnote2"></a>2</sup> Vulnerability scans of container registries on the Azure Government cloud can only be performed with the scan on push feature.

<sup><a name="footnote3"></a>3</sup> Requires Microsoft Defender for container registries.

<sup><a name="footnote4"></a>4</sup> Partially GA: Support for Azure Arc-enabled clusters is in public preview and not available on Azure Government.

<sup><a name="footnote5"></a>5</sup> Requires Microsoft Defender for Kubernetes or Microsoft Defender for Containers.

<sup><a name="footnote6"></a>6</sup> Partially GA: Some of the threat protection alerts from Microsoft Defender for Storage are in public preview.

<sup><a name="footnote7"></a>7</sup> These features all require [Microsoft Defender for Servers](./defender-for-servers-introduction.md).

<sup><a name="footnote8"></a>8</sup> There may be differences in the standards offered per cloud type.
 
<sup><a name="footnote9"></a>9</sup> Partially GA: Subset of alerts and vulnerability assessment for SQL servers. Behavioral threat protections aren't available.

<sup><a name="footnote4"></a>10</sup> Partially GA: Support for Arc-enabled Kubernetes clusters (and therefore AWS EKS too) is in public preview and not available on Azure Government. Run-time visibility of vulnerabilities in container images is also a preview feature.

## Next steps

- Learn how [Defender for Cloud collects data using the Log Analytics Agent](monitoring-components.md#log-analytics-agent).
- Learn how [Defender for Cloud manages and safeguards data](data-security.md).
- Review the [platforms that support Defender for Cloud](security-center-os-coverage.md).
