---
title: Supported features available in Azure Security Center | Microsoft Docs
description: This document provides a list of services supported by Azure Security Center.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 870ebc8d-1fad-435b-9bf9-c477f472ab17
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/12/2020
ms.author: memildin
---

# Feature coverage for machines

The two tabs below show the features of Azure Security Center that are available for Windows and Linux virtual machines and servers.

## Supported features for virtual machines and servers <a name="vm-server-features"></a>

### [**Windows machines**](#tab/features-windows)

|**Feature**|**Azure Virtual Machines**|**Azure Virtual Machine Scale Sets**|**Non-Azure Machines**|**Pricing**
|----|:----:|:----:|:----:|:----:|
|[Microsoft Defender ATP integration](security-center-wdatp.md)|✔</br>(on supported versions)|✔</br>(on supported versions)|✔|Standard|
|[Virtual machine behavioral analytics (and security alerts)](threat-protection.md)|✔|✔|✔|Standard|
|[Fileless security alerts](alerts-reference.md#alerts-windows)|✔|✔|✔|Standard|
|[Network-based security alerts](threat-protection.md#network-layer)|✔|✔|-|Standard|
|[Just-in-time VM access](security-center-just-in-time.md)|✔|-|-|Standard|
|[Native vulnerability assessment](deploy-vulnerability-assessment-vm.md#overview-of-the-integrated-vulnerability-scanner)|✔|-|-|Standard|
|[File integrity monitoring](security-center-file-integrity-monitoring.md)|✔|✔|✔|Standard|
|[Adaptive application controls](security-center-adaptive-application.md)|✔|-|✔|Standard|
|[Network map](security-center-network-recommendations.md#network-map)|✔|✔|-|Standard|
|[Adaptive network hardening](security-center-adaptive-network-hardening.md)|✔|-|-|Standard|
|[Regulatory compliance dashboard & reports](security-center-compliance-dashboard.md)|✔|✔|✔|Standard|
|Recommendations and threat protection on Docker-hosted IaaS containers|-|-|-|Standard|
|Missing OS patches assessment|✔|✔|✔|Azure: Free<br><br>Non-Azure: Standard|
|Security misconfigurations assessment|✔|✔|✔|Azure: Free<br><br>Non-Azure: Standard|
|[Endpoint protection assessment](security-center-services.md#supported-endpoint-protection-solutions-)|✔|✔|✔|Azure: Free<br><br>Non-Azure: Standard|
|Disk encryption assessment|✔|✔|-|Free|
|Third-party vulnerability assessment|✔|-|-|Free|
|[Network security assessment](security-center-network-recommendations.md)|✔|✔|-|Free|


### [**Linux machines**](#tab/features-linux)

|**Feature**|**Azure Virtual Machines**|**Azure Virtual Machine Scale Sets**|**Non-Azure Machines**|**Pricing**
|----|:----:|:----:|:----:|:----:|
|[Microsoft Defender ATP integration](security-center-wdatp.md)|-|-|-|Standard|
|[Virtual machine behavioral analytics (and security alerts)](security-center-alerts-iaas.md)|✔</br>(on supported versions)|✔</br>(on supported versions)|✔|Standard|
|[Fileless security alerts](alerts-reference.md#alerts-windows)|-|-|-|Standard|
|[Network-based security alerts](threat-protection.md#network-layer)|✔|✔|-|Standard|
|[Just-in-time VM access](security-center-just-in-time.md)|✔|-|-|Standard|
|[Native vulnerability assessment](deploy-vulnerability-assessment-vm.md#overview-of-the-integrated-vulnerability-scanner)|✔|-|-|Standard|
|[File integrity monitoring](security-center-file-integrity-monitoring.md)|✔|✔|✔|Standard|
|[Adaptive application controls](security-center-adaptive-application.md)|✔|-|✔|Standard|
|[Network map](security-center-network-recommendations.md#network-map)|✔|✔|-|Standard|
|[Adaptive network hardening](security-center-adaptive-network-hardening.md)|✔|-|-|Standard|
|[Regulatory compliance dashboard & reports](security-center-compliance-dashboard.md)|✔|✔|✔|Standard|
|Recommendations and threat protection on Docker-hosted IaaS containers|✔|✔|✔|Standard|
|Missing OS patches assessment|✔|✔|✔|Azure: Free<br><br>Non-Azure: Standard|
|Security misconfigurations assessment|✔|✔|✔|Azure: Free<br><br>Non-Azure: Standard|
|[Endpoint protection assessment](security-center-services.md#supported-endpoint-protection-solutions-)|-|-|-|Free|
|Disk encryption assessment|✔|✔|-|Free|
|Third-party vulnerability assessment|✔|-|-|Free|
|[Network security assessment](security-center-network-recommendations.md)|✔|✔|-|Free|

--- 


> [!TIP]
>To experiment with features that are only available on the standard pricing tier, free tier users can enroll in a 30-day trial. For more information, see the [pricing page](https://azure.microsoft.com/pricing/details/security-center/).


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
| McAfee v10+ | Linux Server Family  | No | Yes **\*** |
| Sophos V9+| Linux Server Family  | No | Yes  **\***  |

 **\*** The coverage state and supporting data is currently only available in the Log Analytics workspace associated to your protected subscriptions. It isn't reflected in the Azure Security Center portal.

> [!NOTE]
> Detection of System Center Endpoint Protection (SCEP) on a Windows Server 2008 R2 virtual machine requires SCEP to be installed after PowerShell (v3.0 or newer).


## Next steps

- Learn how [Security Center collects data and the Log Analytics Agent](security-center-enable-data-collection.md).
- Learn how [Security Center manages and safeguards data](security-center-data-security.md).
- Review the [platforms that support security center](security-center-os-coverage.md).