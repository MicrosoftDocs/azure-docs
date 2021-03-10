---
title: Azure Security Center's features according to OS, machine type, and cloud
description: Learn about which Azure Security Center features are available according to their OS, type, and cloud deployment.
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: overview
ms.date: 02/16/2021
ms.author: memildin
---

# Feature coverage for machines

The two tabs below show the features of Azure Security Center that are available for Windows and Linux virtual machines and servers.

## Supported features for virtual machines and servers <a name="vm-server-features"></a>

### [**Windows machines**](#tab/features-windows)

|**Feature**|**Azure Virtual Machines**|**Azure Virtual Machine Scale Sets**|**Azure Arc enabled machines**|**Azure Defender required**
|----|:----:|:----:|:----:|:----:|
|[Microsoft Defender for Endpoint integration](security-center-wdatp.md)|✔</br>(on supported versions)|✔</br>(on supported versions)|✔|Yes|
|[Virtual machine behavioral analytics (and security alerts)](alerts-reference.md)|✔|✔|✔|Yes|
|[Fileless security alerts](alerts-reference.md#alerts-windows)|✔|✔|✔|Yes|
|[Network-based security alerts](other-threat-protections.md#network-layer)|✔|✔|-|Yes|
|[Just-in-time VM access](security-center-just-in-time.md)|✔|-|-|Yes|
|[Native vulnerability assessment](deploy-vulnerability-assessment-vm.md#overview-of-the-integrated-vulnerability-scanner)|✔|-|✔|Yes|
|[File integrity monitoring](security-center-file-integrity-monitoring.md)|✔|✔|✔|Yes|
|[Adaptive application controls](security-center-adaptive-application.md)|✔|-|✔|Yes|
|[Network map](security-center-network-recommendations.md#network-map)|✔|✔|-|Yes|
|[Adaptive network hardening](security-center-adaptive-network-hardening.md)|✔|-|-|Yes|
|[Regulatory compliance dashboard & reports](security-center-compliance-dashboard.md)|✔|✔|✔|Yes|
|Recommendations and threat protection on Docker-hosted IaaS containers|-|-|-|Yes|
|Missing OS patches assessment|✔|✔|✔|Azure: No<br><br>Arc-enabled: Yes|
|Security misconfigurations assessment|✔|✔|✔|Azure: No<br><br>Arc-enabled: Yes|
|[Endpoint protection assessment](security-center-services.md#supported-endpoint-protection-solutions-)|✔|✔|✔|Azure: No<br><br>Arc-enabled: Yes|
|Disk encryption assessment|✔</br>(for [supported scenarios](../virtual-machines/windows/disk-encryption-windows.md#unsupported-scenarios))|✔|-|No|
|Third-party vulnerability assessment|✔|-|✔|No|
|[Network security assessment](security-center-network-recommendations.md)|✔|✔|-|No|


### [**Linux machines**](#tab/features-linux)

|**Feature**|**Azure Virtual Machines**|**Azure Virtual Machine Scale Sets**|**Azure Arc enabled machines**|**Azure Defender required**
|----|:----:|:----:|:----:|:----:|
|[Microsoft Defender for Endpoint integration](security-center-wdatp.md)|-|-|-|-|
|[Virtual machine behavioral analytics (and security alerts)](./azure-defender.md)|✔</br>(on supported versions)|✔</br>(on supported versions)|✔|Yes|
|[Fileless security alerts](alerts-reference.md#alerts-windows)|-|-|-|Yes|
|[Network-based security alerts](other-threat-protections.md#network-layer)|✔|✔|-|Yes|
|[Just-in-time VM access](security-center-just-in-time.md)|✔|-|-|Yes|
|[Native vulnerability assessment](deploy-vulnerability-assessment-vm.md#overview-of-the-integrated-vulnerability-scanner)|✔|-|✔|Yes|
|[File integrity monitoring](security-center-file-integrity-monitoring.md)|✔|✔|✔|Yes|
|[Adaptive application controls](security-center-adaptive-application.md)|✔|-|✔|Yes|
|[Network map](security-center-network-recommendations.md#network-map)|✔|✔|-|Yes|
|[Adaptive network hardening](security-center-adaptive-network-hardening.md)|✔|-|-|Yes|
|[Regulatory compliance dashboard & reports](security-center-compliance-dashboard.md)|✔|✔|✔|Yes|
|Recommendations and threat protection on Docker-hosted IaaS containers|✔|✔|✔|Yes|
|Missing OS patches assessment|✔|✔|✔|Azure: No<br><br>Arc-enabled: Yes|
|Security misconfigurations assessment|✔|✔|✔|Azure: No<br><br>Arc-enabled: Yes|
|[Endpoint protection assessment](security-center-services.md#supported-endpoint-protection-solutions-)|-|-|-|No|
|Disk encryption assessment|✔</br>(for [supported scenarios](../virtual-machines/windows/disk-encryption-windows.md#unsupported-scenarios))|✔|-|No|
|Third-party vulnerability assessment|✔|-|✔|No|
|[Network security assessment](security-center-network-recommendations.md)|✔|✔|-|No|

--- 


> [!TIP]
>To experiment with features that are only available with Azure Defender, you can enroll in a 30-day trial. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/security-center/).


## Supported endpoint protection solutions <a name="endpoint-supported"></a>

The following table provides a matrix of:

 - Whether you can use Azure Security Center to install each solution for you.
 - Which endpoint protection solutions Security Center can discover. If an endpoint protection solution from this list is discovered, Security Center won't recommend installing one.

For information about when recommendations are generated for each of these protections, see [Endpoint Protection Assessment and Recommendations](security-center-endpoint-protection.md).

| Endpoint Protection| Platforms | Security Center Installation | Security Center Discovery |
|------|------|-----|-----|
| Microsoft Defender Antivirus| Windows Server 2016 or later| No, Built in to OS| Yes |
| System Center Endpoint Protection (Microsoft Antimalware) | Windows Server 2012 R2, 2012, 2008 R2 (see note below) | Via Extension | Yes |
| Trend Micro – Deep Security | Windows Server Family  | No | Yes |
| Symantec v12.1.1100+| Windows Server Family  | No | Yes |
| McAfee v10+ | Windows Server Family  | No | Yes |
| McAfee v10+ | Linux Server Family  | No | Yes |
| Sophos V9+| Linux Server Family  | No | Yes |

> [!NOTE]
> Detection of System Center Endpoint Protection (SCEP) on a Windows Server 2008 R2 virtual machine requires SCEP to be installed after PowerShell (v3.0 or newer).



## Feature support in government clouds

| Service / Feature | US Gov | China Gov |
|------|:----:|:----:|
|[Just-in-time VM access](security-center-just-in-time.md) (1)|✔|✔|
|[File integrity monitoring](security-center-file-integrity-monitoring.md) (1)|✔|✔|
|[Adaptive application controls](security-center-adaptive-application.md) (1)|✔|✔|
|[Adaptive network hardening](security-center-adaptive-network-hardening.md) (1)|-|-|
|[Docker host hardening](harden-docker-hosts.md) (1)|✔|✔|
|[Integrated vulnerability assessment for machines](deploy-vulnerability-assessment-vm.md) (1)|-|-|
|[Microsoft Defender for Endpoint](harden-docker-hosts.md) (1)|✔|-|
|[Connect AWS account](quickstart-onboard-aws.md) (1)|-|-|
|[Connect GCP account](quickstart-onboard-gcp.md) (1)|-|-|
|[Continuous export](continuous-export.md)|✔|✔|
|[Workflow automation](workflow-automation.md)|✔|✔|
|[Recommendation exemption rules](exempt-resource.md)|-|-|
|[Alert suppression rules](alerts-suppression-rules.md)|✔|✔|
|[Email notifications for security alerts](security-center-provide-security-contact-details.md)|✔|✔|
|[Asset inventory](asset-inventory.md)|✔|✔|
|[Azure Defender for App Service](defender-for-app-service-introduction.md)|-|-|
|[Azure Defender for Storage](defender-for-storage-introduction.md)|✔|-|
|[Azure Defender for SQL](defender-for-sql-introduction.md)|✔|✔ (2)|
|[Azure Defender for Key Vault](defender-for-key-vault-introduction.md)|-|-|
|[Azure Defender for Resource Manager](defender-for-resource-manager-introduction.md)|-|-|
|[Azure Defender for DNS](defender-for-dns-introduction.md)|-|-|
|[Azure Defender for container registries](defender-for-container-registries-introduction.md)|✔ (2)|✔ (2)|
|[Azure Defender for Kubernetes](defender-for-kubernetes-introduction.md)|✔|✔|
|[Kubernetes workload protection](kubernetes-workload-protections.md)|✔|✔|
|||

(1) Requires **Azure Defender for servers**

(2) Partial


## Next steps

- Learn how [Security Center collects data using the Log Analytics Agent](security-center-enable-data-collection.md).
- Learn how [Security Center manages and safeguards data](security-center-data-security.md).
- Review the [platforms that support security center](security-center-os-coverage.md).