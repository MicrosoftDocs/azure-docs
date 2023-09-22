---
title: Azure Government compliance
description: Provides an overview of the available compliance assurances for Azure Government
ms.service: azure-government
ms.topic: article
ms.workload: azure-government
ms.author: stevevi
author: stevevi
ms.custom: references_regions
recommendations: false
ms.date: 04/02/2023
---

# Azure Government compliance

Microsoft Azure Government meets demanding US government compliance requirements that mandate formal assessments and authorizations, including:

- [Federal Risk and Authorization Management Program](https://www.fedramp.gov/) (FedRAMP)
- Department of Defense (DoD) Cloud Computing [Security Requirements Guide](https://public.cyber.mil/dccs/dccs-documents/) (SRG) Impact Level (IL) 2, 4, and 5

Azure Government maintains the following authorizations that pertain to Azure Government regions US Gov Arizona, US Gov Texas, and US Gov Virginia:

- [FedRAMP High](/azure/compliance/offerings/offering-fedramp) Provisional Authorization to Operate (P-ATO) issued by the FedRAMP Joint Authorization Board (JAB)
- [DoD IL2](/azure/compliance/offerings/offering-dod-il2) Provisional Authorization (PA) issued by the Defense Information Systems Agency (DISA)
- [DoD IL4](/azure/compliance/offerings/offering-dod-il4) PA issued by DISA
- [DoD IL5](/azure/compliance/offerings/offering-dod-il5) PA issued by DISA

For links to extra Azure Government compliance assurances, see [Azure compliance](../compliance/index.yml). For example, Azure Government can help you meet your compliance obligations with many US government requirements, including:

- [Criminal Justice Information Services (CJIS)](/azure/compliance/offerings/offering-cjis)
- [Internal Revenue Service (IRS) Publication 1075](/azure/compliance/offerings/offering-irs-1075)
- [Defense Federal Acquisition Regulation Supplement (DFARS)](/azure/compliance/offerings/offering-dfars)
- [International Traffic in Arms Regulations (ITAR)](/azure/compliance/offerings/offering-itar)
- [Export Administration Regulations (EAR)](/azure/compliance/offerings/offering-ear)
- [Federal Information Processing Standard (FIPS) 140](/azure/compliance/offerings/offering-fips-140-2)
- [National Institute of Standards and Technology (NIST) 800-171](/azure/compliance/offerings/offering-nist-800-171)
- [National Defense Authorization Act (NDAA) Section 889 and Section 1634](/azure/compliance/offerings/offering-ndaa-section-889)
- [North American Electric Reliability Corporation (NERC) Critical Infrastructure Protection (CIP) standards](/azure/compliance/offerings/offering-nerc)
- [Health Insurance Portability and Accountability Act of 1996 (HIPAA)](/azure/compliance/offerings/offering-hipaa-us)
- [Electronic Prescriptions for Controlled Substances (EPCS)](/azure/compliance/offerings/offering-epcs-us)
- And many more US government, global, and industry standards

For current Azure Government regions and available services, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=all&regions=non-regional,usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-texas,usgov-virginia&rar=true).

> [!NOTE]
>
> - Some Azure services deployed in Azure Government regions (US Gov Arizona, US Gov Texas, and US Gov Virginia) require extra configuration to meet DoD IL5 compute and storage isolation requirements, as explained in **[Isolation guidelines for Impact Level 5 workloads](./documentation-government-impact-level-5.md).**
> - For DoD IL5 PA compliance scope in Azure Government DoD regions (US DoD Central and US DoD East), see **[Azure Government DoD regions IL5 audit scope](./documentation-government-overview-dod.md#us-dod-regions-il5-audit-scope).**

## Services in audit scope

For a detailed list of Azure, Dynamics 365, Microsoft 365, and Power Platform services in FedRAMP and DoD compliance audit scope, see:

- [Azure public services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-public-services-by-audit-scope)
- [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope)

## Audit documentation

For information on how to access Azure and Azure Government audit reports and related documentation, see [Azure compliance offerings audit documentation](/azure/compliance/offerings/#audit-documentation).

## Azure Policy regulatory compliance built-in initiatives

For extra customer assistance, Microsoft provides Azure Policy regulatory compliance built-in initiatives, which map to **compliance domains** and **controls** in key US government standards, including:

- [FedRAMP High](../governance/policy/samples/gov-fedramp-high.md)
- [DoD IL4](../governance/policy/samples/gov-dod-impact-level-4.md)
- [DoD IL5](../governance/policy/samples/gov-dod-impact-level-5.md)
- And others

For more regulatory compliance built-in initiatives that pertain to Azure Government, see [Azure Policy samples](../governance/policy/samples/index.md#regulatory-compliance).

Regulatory compliance in Azure Policy provides built-in initiative definitions to view a list of the controls and compliance domains based on responsibility – customer, Microsoft, or shared. For Microsoft-responsible controls, we provide extra audit result details based on third-party attestations and our control implementation details to achieve that compliance. Each control is associated with one or more Azure Policy definitions. These policies may help you [assess compliance](../governance/policy/how-to/get-compliance-data.md) with the control; however, compliance in Azure Policy is only a partial view of your overall compliance status. Azure Policy helps to enforce organizational standards and assess compliance at scale. Through its compliance dashboard, it provides an aggregated view to evaluate the overall state of the environment, with the ability to drill down to more granular status.

## Next steps

- [Azure compliance](../compliance/index.yml)
- [Azure and other Microsoft services compliance offerings](/azure/compliance/offerings/)
- [Azure Policy overview](../governance/policy/overview.md)
- [Azure Policy regulatory compliance built-in initiatives](../governance/policy/samples/index.md#regulatory-compliance)
- [Azure Government overview](./documentation-government-welcome.md)
- [Azure Government security](./documentation-government-plan-security.md)
- [Compare Azure Government and global Azure](./compare-azure-government-global-azure.md)
- [Azure Government services by audit scope](./compliance/azure-services-in-fedramp-auditscope.md#azure-government-services-by-audit-scope)
- [Azure Government isolation guidelines for Impact Level 5 workloads](./documentation-government-impact-level-5.md)
- [Azure Government DoD overview](./documentation-government-overview-dod.md)
