---
title: Configure Microsoft Entra ID to meet FedRAMP High Impact level
description: Overview of how you can meet a FedRAMP High Impact level for your organization by using Microsoft Entra ID.
services: active-directory 
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: how-to
author: gargi-sinha
ms.author: gasinh
manager: martinco
ms.reviewer: martinco
ms.date: 03/09/2023
ms.custom: it-pro
ms.collection: M365-identity-device-management
---


# Configure Microsoft Entra ID to meet FedRAMP High Impact level

The [Federal Risk and Authorization Management Program](https://www.fedramp.gov/) (FedRAMP) is an assessment and authorization process for cloud service providers (CSPs). Specifically, the process is for CSPs that create cloud solution offerings (CSOs) for use with federal agencies. Azure and Azure Government have earned a [Provisional Authority to Operate (P-ATO) at the High Impact level](/compliance/regulatory/offering-fedramp) from the Joint Authorization Board, the highest bar for FedRAMP accreditation.

Azure provides the capability to fulfill all control requirements to achieve a FedRAMP high rating for your CSO, or as a federal agency. It's your organization’s responsibility to complete additional configurations or processes to be compliant. This responsibility applies to both CSPs seeking a FedRAMP high authorization for their CSO, and federal agencies seeking an Authority to Operate (ATO). 

## Microsoft and FedRAMP 

Microsoft Azure supports more services at [FedRAMP High Impact](../../azure-government/compliance/azure-services-in-fedramp-auditscope.md) levels than any other CSP. And while this level in the Azure public cloud meets the needs of many US government customers, agencies with more stringent requirements might rely on the Azure Government cloud. Azure Government provides additional safeguards, such as the heightened screening of personnel. 

Microsoft is required to recertify its cloud services each year to maintain its authorizations. To do so, Microsoft continuously monitors and assesses its security controls, and demonstrates that the security of its services remains in compliance. For more information, see [Microsoft cloud services FedRAMP authorizations](https://marketplace.fedramp.gov/), and [Microsoft FedRAMP Audit Reports](https://aka.ms/MicrosoftFedRAMPAuditDocuments). To receive other FedRAMP reports, send email to [Azure Federal Documentation](mailto:AzFedDoc@microsoft.com).

There are multiple paths towards FedRAMP authorization. You can reuse the existing authorization package of Azure and the guidance here to significantly reduce the time and effort required to obtain an ATO or a P-ATO. 

## Scope of guidance

The FedRAMP high baseline is made up of 421 controls and control enhancements from [NIST 800-53 Security Controls Catalog Revision 4](https://csrc.nist.gov/pubs/itlb/2015/01/release-of-nist-special-publication-80053a-revisio/final). Where applicable, we included clarifying information from the [800-53 Revision 5](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final). This article set covers a subset of these controls that are related to identity, and which you must configure. 

We provide prescriptive guidance to help you achieve compliance with controls you're responsible for configuring in Microsoft Entra ID. To fully address some identity control requirements, you might need to use other systems. Other systems might include a security information and event management tool, such as Microsoft Sentinel. If you're using Azure services outside of Microsoft Entra ID, there will be other controls you need to consider, and you can use the capabilities Azure already has in place to meet the controls.

The following is a list of FedRAMP resources:

* [Federal Risk and Authorization Management Program](https://www.fedramp.gov/)

* [FedRAMP Security Assessment Framework](https://reciprocity.com/blog/conducting-a-fedramp-risk-assessment/)

* [Agency Guide for FedRAMP Authorizations](https://www.fedramp.gov/assets/resources/documents/Agency_Authorization_Playbook.pdf)

* [Managing compliance in the cloud at Microsoft](https://www.microsoft.com/trustcenter/common-controls-hub)

* [Microsoft Government Cloud](https://go.microsoft.com/fwlink/p/?linkid=2087246)

* [Azure Compliance Offerings](https://aka.ms/azurecompliance)

* [FedRAMP High Azure Policy built-in initiative definition](../../governance/policy/samples/fedramp-high.md)

* [Microsoft Purview compliance portal](/microsoft-365/compliance/microsoft-365-compliance-center)

* [Microsoft Purview Compliance Manager](/microsoft-365/compliance/compliance-manager)

## Next steps

[Configure access controls](fedramp-access-controls.md)

[Configure identification and authentication controls](fedramp-identification-and-authentication-controls.md)

[Configure other controls](fedramp-other-controls.md)
