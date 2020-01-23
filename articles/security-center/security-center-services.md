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
ms.date: 01/05/2020
ms.author: memildin
---
# Supported features available in Azure Security Center

> [!NOTE]
>Some features are only available with the Standard tier. If you have not already signed up for Security Center's Standard tier, a free trial period is available. For more information, see the [Security Center pricing page](https://azure.microsoft.com/pricing/details/security-center/).

The following sections show Security Center features that are available for their [supported platforms](security-center-os-coverage.md).

* [Virtual machines / servers](#vm-server-features)
* [PaaS services](#paas-services)


## Virtual machine / server supported features <a name="vm-server-features"></a>

### [Windows](#tab/features-windows)

|||||||||
|----|:----:|:----:|:----:|:----:|:----:|:----:|:----:|
||**Azure Virtual Machines**|**Azure Virtual Machine Scale Sets**|**Non-Azure Machines**|**Pricing**
|[Microsoft Defender ATP integration](security-center-wdatp.md)|✔ (on supported versions)|✔ (on supported versions)|✔|Standard|
|[Virtual Machine Behavioral Analytics threat detection alerts](security-center-alerts-iaas.md)|✔|✔|✔|Recommendations (Free) Threat Detection (Standard)|
|[Fileless threat detection alerts](alerts-reference.md#alerts-windows)|✔|✔|✔|Standard|
|[Network-based threat detection alerts](security-center-alerts-service-layer.md#azure-network-layer)|✔|✔|-|Standard|
|[Just-In-Time VM access](security-center-just-in-time.md)|✔|-|-|Standard|
|[Native vulnerability assessment](built-in-vulnerability-assessment.md)|✔|-|-|Standard|
|[File Integrity Monitoring](security-center-file-integrity-monitoring.md)|✔|✔|✔|Standard|
|[Adaptive application controls](security-center-adaptive-application.md)|✔|-|✔|Standard|
|[Network map](security-center-network-recommendations.md#network-map)|✔|✔|-|Standard|
|[Adaptive network hardening](security-center-adaptive-network-hardening.md)|✔|-|-|Standard|
|Adaptive network controls|✔|✔|-|Standard|
|[Regulatory Compliance dashboard & reports](security-center-compliance-dashboard.md)|✔|✔|✔|Standard|
|Recommendations and threat detection on Docker-hosted IaaS containers|-|-|-|Standard|
|Missing OS patches assessment|✔|✔|✔|Free|
|Security misconfigurations assessment|✔|✔|✔|Free|
|[Endpoint protection assessment](security-center-services.md#supported-endpoint-protection-solutions-)|✔|✔|✔|Free|
|Disk encryption assessment|✔|✔|-|Free|
|Third-party vulnerability assessment|✔|-|-|Free|
|[Network security assessment](security-center-network-recommendations.md)|✔|✔|-|Free|


### [Linux](#tab/features-linux)

|||||||||
|----|:----:|:----:|:----:|:----:|:----:|:----:|:----:|
||**Azure Virtual Machines**|**Azure Virtual Machine Scale Sets**|**Non-Azure Machines**|**Pricing**
|[Microsoft Defender ATP integration](security-center-wdatp.md)|-|-|-|Standard|
|[Virtual Machine Behavioral Analytics threat detection alerts](security-center-alerts-iaas.md)|✔ (on supported versions)|✔ (on supported versions)|✔|Recommendations (Free) Threat Detection (Standard)|
|[Fileless threat detection alerts](alerts-reference.md#alerts-windows)|-|-|-|Standard|
|[Network-based threat detection alerts](security-center-alerts-service-layer.md#azure-network-layer)|✔|✔|-|Standard|
|[Just-In-Time VM access](security-center-just-in-time.md)|✔|-|-|Standard|
|[Native vulnerability assessment](built-in-vulnerability-assessment.md)|✔|-|-|Standard|
|[File Integrity Monitoring](security-center-file-integrity-monitoring.md)|✔|✔|✔|Standard|
|[Adaptive application controls](security-center-adaptive-application.md)|✔|-|✔|Standard|
|[Network map](security-center-network-recommendations.md#network-map)|✔|✔|-|Standard|
|[Adaptive network hardening](security-center-adaptive-network-hardening.md)|✔|-|-|Standard|
|Adaptive network controls|✔|✔|-|Standard|
|[Regulatory Compliance dashboard & reports](security-center-compliance-dashboard.md)|✔|✔|✔|Standard|
|Recommendations and threat detection on Docker-hosted IaaS containers|✔|✔|✔|Standard|
|Missing OS patches assessment|✔|✔|✔|Free|
|Security misconfigurations assessment|✔|✔|✔|Free|
|[Endpoint protection assessment](security-center-services.md#supported-endpoint-protection-solutions-)|-|-|-|Free|
|Disk encryption assessment|✔|✔|-|Free|
|Third-party vulnerability assessment|✔|-|-|Free|
|[Network security assessment](security-center-network-recommendations.md)|✔|✔|-|Free|

--- 

## Supported endpoint protection solutions <a name="endpoint-supported"></a>

The following table provides a matrix of:

 - Whether you can use Azure Security Center to install each solution for you.
 - Which endpoint protection solutions Security Center can discover. If an endpoint protection solution from this list is discovered, Security Center won't recommend installing one.

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

 **\*** The coverage state and supporting data is currently only available in the Log Analytics workspace associated to your protected subscriptions. It isn't reflected in the Azure Security Center portal.

> [!NOTE]
> - Detection of System Center Endpoint Protection (SCEP) on a Windows Server 2008 R2 virtual machine requires SCEP to be installed after PowerShell 3.0 (or an upper version).
> - Detection of Trend Micro protection is supported for Deep Security agents.  OfficeScan agents are not supported.


## PaaS services supported features <a name="paas-services"> </a>

The following PaaS resources are supported by Azure Security Center:

|Service|Recommendations (Free)|Threat detection alerts (Standard)|Vulnerability assessment (Standard)|
|----|:----:|:----:|:----:|
|SQL Databases|✔|✔|✔|
|Azure Container Registry|-|-|✔|
|Azure Kubernetes Service|✔|✔|-|
|Azure Database for PostgreSQL*|✔|✔|-|
|Azure Database for MySQL*|✔|✔|-|
|Azure CosmosDB*|-|✔|-|
|Storage Accounts|✔|-|-|
|Blob Storage|✔|✔|-|
|App Service|✔|✔|-|
|Function app|✔|-|-|
|Cloud Services|✔|-|-|
|Virtual Network|✔|-|-|
|Subnet|✔|-|-|
|NIC|✔|-|-|
|Network Security Groups|✔|-|-|
|Subscription|✔ **|✔|-|
|Batch account|✔|-|-|
|Service Fabric account|✔|-|-|
|Automation account|✔|-|-|
|Load Balancer|✔|-|-|
|Cognitive Search|✔|-|-|
|Service Bus namespace|✔|-|-|
|Stream analytics|✔|-|-|
|Event hub namespace|✔|-|-|
|Logic apps|✔|-|-|
|Cache for Redis|✔|-|-|
|Data Lake Analytics|✔|-|-|
|Azure Data Lake Storage|✔|-|-|
|Key Vault|✔|✔ *|-|

\* These features are currently supported in preview.

\*\* Azure Active Directory (Azure AD) recommendations are available only for Standard subscriptions.

## Next steps

- Learn how [Security Center collects data and the Log Analytics Agent](security-center-enable-data-collection.md).
- Learn how [Security Center manages and safeguards data](security-center-data-security.md).
- Learn how to [plan and understand the design considerations to adopt Azure Security Center](security-center-planning-and-operations-guide.md).
- Review the [platforms that support security center](security-center-os-coverage.md).
- Learn more about [threat detection for VMs & servers in Azure Security Center](security-center-alerts-iaas.md).
- Find [frequently asked questions about using Azure Security Center](security-center-faq.md).
- Find [blog posts about Azure security and compliance](https://blogs.msdn.com/b/azuresecurity/).