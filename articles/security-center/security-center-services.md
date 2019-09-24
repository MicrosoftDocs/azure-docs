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
ms.date: 09/24/2019
ms.author: memildin
---
# Supported features available in Azure Security Center

> [!NOTE]
>Some features are only available with the Standard tier. If you have not already signed up for Security Center's Standard tier, a free trial period is available. See the [Security Center pricing page](https://azure.microsoft.com/pricing/details/security-center/) for more information.

The following sections show Security Center features that are available for their [supported platforms](security-center-os-coverage.md).

* [Virtual machines / servers](#vm-server-features)
* [PaaS services](#paas-services)


## Virtual machine / server supported features <a name="vm-server-features"></a>

> [!div class="mx-tableFixed"]

|Server|Windows|||Linux|||Pricing|
|----|----|----|----|----|----|----|----|
|**Environment**|**Azure**||**Non-Azure**|**Azure**||**Non-Azure**||
||**Virtual Machine**|**Virtual Machine Scale Set**||**Virtual Machine**|**Virtual Machine Scale Set**|
|VMBA threat detection alerts|✔|✔|✔|✔ (on supported versions)|✔ (on supported versions)|✔|Recommendations (Free) Threat Detection (Standard)|
|Network-based threat detection alerts|✔|✔|X|✔|✔|X|Standard|
|Microsoft Defender ATP integration|✔ (on supported versions)|✔ (on supported versions)|✔|X|X|X|Standard|
|Missing patches|✔|✔|✔|✔|✔|✔|Free|
|Security configurations|✔|✔|✔|✔|✔|✔|Free|
|Endpoint protection assessment|✔|✔|✔|X|X|X|Free|
|JIT VM access|✔|X|X|✔|X|X|Standard|
|Adaptive application controls|✔|X|✔|✔|X|✔|Standard|
|FIM|✔|✔|✔|✔|✔|✔|Standard|
|Disk encryption assessment|✔|✔|X|✔|✔|X|Free|
|Third-party deployment|✔|X|X|✔|X|X|Free|
|NSG assessment|✔|✔|X|✔|✔|X|Free|
|Fileless threat detection|✔|✔|✔|X|X|X|Standard|
|Network map|✔|✔|X|✔|✔|X|Standard|
|Adaptive network controls|✔|✔|X|✔|✔|X|Standard|
|Regulatory Compliance dashboard & reports|✔|✔|✔|✔|✔|✔|Standard|
|Recommendations and threat detection on Docker-hosted IaaS containers|X|X|X|✔|✔|✔|Standard|

### Supported endpoint protection solutions <a name="endpoint-supported"></a>

The following table provides a matrix of:

 - Whether you can use Azure Security Center to install each solution for you.
 - Which endpoint protection solutions Security Center can discover. If one of these endpoint protection solutions is discovered, Security Center will not recommend installing one.

For information about when recommendations are generated for each of these protections, see [Endpoint Protection Assessment and Recommendations](security-center-endpoint-protection.md).

| Endpoint Protection| Platforms | Security Center Installation | Security Center Discovery |
|------|------|-----|-----|
| Windows Defender (Microsoft Antimalware)| Windows Server 2016| No, Built in to OS| Yes |
| System Center Endpoint Protection (Microsoft Antimalware) | Windows Server 2012 R2, 2012, 2008 R2 (see note below) | Via Extension | Yes |
| Trend Micro – All versions* | Windows Server Family  | No | Yes |
| Symantec v12.1.1100+| Windows Server Family  | No | Yes |
| McAfee v10+ | Windows Server Family  | No | Yes |
| McAfee v10+ | Linux Server Family  | No | Yes **\*** |
| Sophos V9+| Linux Server Family  | No | Yes  **\***  |

 **\*** The coverage state and supporting data is currently available only in the Log Analytics workspace associated to your protected subscriptions, and is not reflected in Azure Security Center portal.

> [!NOTE]
>
> - Detection of System Center Endpoint Protection (SCEP) on a Windows Server 2008 R2 virtual machine requires SCEP to be installed after PowerShell 3.0 (or an upper version).
> - Detection of Trend Micro protection is supported for Deep Security agents.  OfficeScan agents are not supported.


## PaaS services supported features <a name="paas-services"> </a>

The following PaaS resources are supported by Azure Security Center:

|Service|Recommendations (Free)|Threat detection (Standard)|
|----|----|----|
|SQL|✔| ✔|
|PostGreSQL*|✔| ✔|
|MySQL*|✔| ✔|
|CosmosDB*|X| ✔|
|Blob storage|✔| ✔|
|Storage account|✔| NA|
|App service|✔| ✔|
|Function|✔| X|
|Cloud Service|✔| X|
|VNet|✔| NA|
|Subnet|✔| NA|
|NIC|✔| NA|
|NSG|✔| NA|
|Subscription|✔ **| ✔|
|Batch account|✔| X|
|Service fabric account|✔| X|
|Automation account|✔| X|
|Load balancer|✔| X|
|Search|✔| X|
|Service bus namespace|✔| X|
|Stream analytics|✔| X|
|Event hub namespace|✔| X|
|Logic apps|✔| X|
|Redis|✔| NA|
|Data Lake Analytics|✔| X|
|Data Lake Store|✔| X|
|Key vault|✔| X|

\* These features are currently supported in public preview.

\*\* Azure Active Directory (Azure AD) recommendations are available only for Standard subscriptions.

## Next steps

- Learn how [Security Center collects data and the Log Analytics Agent](security-center-enable-data-collection.md).
- Learn how [Security Center manages and safeguards data](security-center-data-security.md).
- Learn how to [plan and understand the design considerations to adopt Azure Security Center](security-center-planning-and-operations-guide.md).
- Review the [platforms that support security center](security-center-os-coverage.md).
- Learn more about [threat detection for VMs & servers in Azure Security Center](security-center-alerts-iaas.md).
- Find [frequently asked questions about using Azure Security Center](security-center-faq.md).
- Find [blog posts about Azure security and compliance](https://blogs.msdn.com/b/azuresecurity/).
