---
title: Configure Azure Active Directory to meet FedRAMP High impact level
description: overview of how you can meet a FedRAMP High impact level for your organization by using Azure Active Directory.
services: active-directory 
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: how-to
author: barbaraselden
ms.author: baselden
manager: mtillman
ms.reviewer: martinco
ms.date: 4/26/2021
ms.custom: it-pro
ms.collection: M365-identity-device-management
---


# Configure Azure Active Directory to meet FedRAMP High Impact level

The [Federal Risk and Authorization Management Program](https://www.fedramp.gov/) (FedRAMP) is an assessment and authorization process for cloud service providers (CSPs) creating cloud solution offerings (CSOs) for use with federal agencies. Azure and Azure Government have earned a [Provisional Authority to Operate (P-ATO) at the High Impact Level](https://docs.microsoft.com/compliance/regulatory/offering-fedramp) from the Joint Authorization Board, the highest bar for FedRAMP accreditation.

Azure provides the capability to fulfill all control requirements to achieve a FedRAMP high rating for your CSO, or as a federal agency. It is your organization’s responsibility to complete additional configurations or processes to be compliant. This responsibility applies to both CSPs seeking a FedRAMP high authorization for their CSO, and federal agencies seeking an Authority to Operate (ATO). 

## Microsoft and FedRAMP 

Microsoft Azure supports more services at [FedRAMP High Impact](https://docs.microsoft.com/azure/azure-government/compliance/azure-services-in-fedramp-auditscope) levels than any other CSP. And while FedRAMP High in the Azure public cloud will meet the needs of many US government customers, agencies with more stringent requirements may rely on the Azure Government cloud. Azure Government cloud provides additional safeguards such as the heightened screening of personnel. 

Microsoft is required to recertify its cloud services each year to maintain its authorizations. To do so, Microsoft continuously monitors and assesses its security controls and demonstrate that the security of its services remains in compliance.

* [Microsoft cloud services FedRAMP authorizations](https://marketplace.fedramp.gov/)

* [Microsoft FedRAMP Audit Reports](https://aka.ms/MicrosoftFedRAMPAuditDocuments)

To receive other FedRAMP reports, send email to [Azure Federal Documentation](mailto:AzFedDoc@microsoft.com).

There are multiple paths towards FedRAMP authorization. You can reuse Microsoft Azure's existing authorization package and the guidance here to significantly reduce the time and effort required to obtain an ATO or P-ATO. More information on FedRAMP can be found at on the [FedRAMP website.](https://www.fedramp.gov/)

 ## Scope of guidance

The FedRAMP High Baseline is made up of 421 controls and control enhancements from [NIST 800-53 Security Controls Catalog Revision 4](https://csrc.nist.gov/publications/detail/sp/800-53/rev-4/final). Where applicable, we included clarifying information from the [800-53 Revision 5](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final). This article set covers a subset of these controls that are related to identity and which you must configure. We provide prescriptive guidance to assist you in achieving compliance with controls you are responsible for configuring in Azure Active Directory (Azure AD). To fully address some identity control requirements, you may need to use other systems. Other systems might include a security information and event management (SIEM) tool, such as Azure Sentinel. If you are using Azure services outside of Azure Active Directory, there will be other controls you need to consider, and you can use the capabilities Azure already has in place to meet the controls.

FedRAMP Resources

* [Federal Risk and Authorization Management Program](https://www.fedramp.gov/)

* [FedRAMP Security Assessment Framework](https://www.fedramp.gov/assets/resources/documents/FedRAMP_Security_Assessment_Framework.pdf)

* [Agency Guide for FedRAMP Authorizations](https://www.fedramp.gov/assets/resources/documents/Agency_Guide_for_Reuse_of_FedRAMP_Authorizations.pdf)

* [Managing compliance in the cloud at Microsoft](https://www.microsoft.com/trustcenter/common-controls-hub)

* [Microsoft Government Cloud](https://go.microsoft.com/fwlink/p/?linkid=2087246)

* [Azure Compliance Offerings](https://aka.ms/azurecompliance)

* [FedRAMP High blueprint sample overview](https://docs.microsoft.com/azure/governance/blueprints/samples/fedramp-h/)

* [Microsoft 365 compliance center](https://docs.microsoft.com///microsoft-365/compliance/microsoft-365-compliance-center)

* [Microsoft Compliance Manager ](https://docs.microsoft.com///microsoft-365/compliance/compliance-manager)

 

## Next Steps

[Configure access controls](fedramp-access-controls.md)

[Configure identification & authentication controls](fedramp-identification-and-authentication-controls.md)

[Configure other controls](fedramp-other-controls.md)

 
