---
title: Features and platforms supported by Azure Security Center | Microsoft Docs
description: This document provides a list of features and platforms supported by Azure Security Center.
services: security-center
documentationcenter: na
author: monhaber
manager: barbkess
editor: ''

ms.assetid: 70c076ef-3ad4-4000-a0c1-0ac0c9796ff1
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 5/02/2019
ms.author: v-mohabe

---
# Platforms and features supported by Azure Security Center

Security state monitoring and recommendations are available for virtual machines (VMs), created by using both the classic and Resource Manager deployment models, and computers.

> [!NOTE]
> Learn more about the [classic and Resource Manager deployment models](../azure-classic-rm.md) for Azure resources.
>

## Platforms that support the data collection agent 

This section lists the platforms on which the Azure Security Center agent can run and from which it can gather data.

### Supported platforms for Windows computers and VMs
The following Windows operating systems are supported:

* Windows Server 2019
* Windows Server 2016
* Windows Server 2012 R2
* Windows Server 2012
* Windows Server 2008 R2
* Windows Server 2008

> [!NOTE]
> Integration with Windows Defender ATP supports only Windows Server 2012 R2 and Windows Server 2016.
>
>

### Supported platforms for Linux computers and VMs
The following Linux operating systems are supported:

* Ubuntu versions 12.04 LTS, 14.04 LTS, and 16.04 LTS.
* Debian versions 6, 7, 8, and 9.
* CentOS versions 5, 6, and 7.
* Red Hat Enterprise Linux (RHEL) versions 5, 6, and 7.
* SUSE Linux Enterprise Server (SLES) versions 11 and 12.
* Oracle Linux versions 5, 6, and 7.
* Amazon Linux 2012.09 through 2017.
* OpenSSL 1.1.0 is only supported on x86_64 platforms, 64 bit.

## VMs and Cloud Services
VMs that run in a cloud service are also supported. Only cloud services web and worker roles that run in production slots are monitored. To learn more about cloud services, see [Overview of Azure Cloud Services](../cloud-services/cloud-services-choose-me.md).


## Supported IaaS features

> [!div class="mx-tableFixed"]
> 

|Server|Windows||Linux||||Pricing|
|----|----|----|----|----|----|----|----|
|**Environment**|**Azure**||**Non-Azure**|**Azure**||**Non-Azure**||
||**Virtual Machine**|**Virtual Machine Scale Set**||**Virtual Machine**|**Virtual Machine Scale Set**|
|VMBA threat detection alerts|✔|✔|✔|✔ (on supported versions)|✔ (on supported versions)|✔|Recommendations (Free) Threat Detection (Standard)|
|Network-based threat detection alerts|✔|✔|X|✔|✔|X|Standard|
|Windows Defender ATP integration|✔ (on supported versions)|✔ (on supported versions)|✔|X|X|X|Standard|
|Missing patches|✔|✔|✔|✔|✔|✔|Free|
|Security configurations|✔|✔|✔|✔|✔|✔|Free|
|Endpoint protection assessment|✔|✔|✔|X|X|X|Free|
|JIT VM access|✔|X|X|✔|X|X|Standard|
|Adaptive application controls|✔|X|✔|✔|X|✔|Standard|
|FIM|✔|✔|✔|✔|✔|✔|Standard|
|Disk encryption assessment|✔|✔|X|✔|✔|X|Free|
|Third-party deployment|✔|X|X|✔|X|X|Free|
|NSGs assessment|✔|✔|X|✔|✔|X|Free|
|Fileless threat detection|✔|✔|✔|X|X|X|Standard|
|Network map|✔|✔|X|✔|✔|X|Standard|
|Adaptive network controls|✔|✔|X|✔|✔|X|Standard|
|Regulatory Compliance dashboard & reports|✔|✔|✔|✔|✔|✔|Standard|
|Recommendations and threat detection on Docker-hosted IaaS containers|X|X|X|✔|✔|✔|Standard|

### Supported endpoint protection solutions

The following table provides a matrix of:
 - Whether you can use Azure Security Center to install each solution for you.
 - Which endpoint protection solutions Security Center can discover. If one of these endpoint protection solutions is discovered, Security Center will not recommend installing one.

| Endpoint Protection| Platforms | Security Center Installation | Security Center Discovery |
|------|------|-----|-----|
| Windows Defender (Microsoft Antimalware)| Windows Server 2016| No, Built in to OS| Yes |
| System Center Endpoint Protection (Microsoft Antimalware) | Windows Server 2012 R2, 2012, 2008 R2 (see note below) | Via Extension | Yes |
| Trend Micro – All version | Windows Server Family  | No | Yes |
| Symantec v12.1.1100+| Windows Server Family  | No | Yes |
| McAfee v10+ | Windows Server Family  | No | Yes |
| Kaspersky| Windows Server Family  | No | No  |
| Sophos| Windows Server Family  | No | No  |

> [!NOTE]
> - Detection of System Center Endpoint Protection (SCEP) on a Windows Server 2008 R2 virtual machine requires SCEP to be installed after PowerShell 3.0 (or an upper version).
>

## Supported PaaS features


|Service|Recommendations (Free)|Threat detection (Standard)|
|----|----|----|
|SQL|✔| ✔|
|PostGreSQL*|✔| ✔|
|MySQL*|✔| ✔|
|Azure Blob storage accounts*|✔| ✔|
|App services|✔| ✔|
|Cloud Services|✔| X|
|VNets|✔| NA|
|Subnets|✔| NA|
|NICs|✔| NA|
|NSGs|✔| NA|
|Subscription|✔ **| ✔|
|App service|✔| NA|
|Batch|✔| NA|
|Service fabric|✔| NA|
|Automation account|✔| NA|
|Load balancer|✔| NA|
|Search|✔| NA|
|Service bus|✔| NA|
|Stream analytics|✔| NA|
|Event hub|✔| NA|
|Logic apps|✔| NA|
|Subnet|✔| NA|
|Vnet|✔| NA|
|Storage account|✔| NA|
|Redis|✔| NA|
|SQL|✔| NA|
|Data lake analytics|✔| NA|
|Storage account|✔| NA|
|Subscription|✔| NA|
|Key vault|✔| NA|




\* These features are currently supported in public preview.

\*\* AAD recommendations are only available for Standard subscriptions



## Next steps

- Learn how to [plan and understand the design considerations to adopt Azure Security Center](security-center-planning-and-operations-guide.md).
- Learn more about [virtual machine behavioral analysis and crash dump memory analysis in Security Center](security-center-alerts-type.md#virtual-machine-behavioral-analysis).
- Find [frequently asked questions about using Azure Security Center](security-center-faq.md).
- Find [blog posts about Azure security and compliance](https://blogs.msdn.com/b/azuresecurity/).
